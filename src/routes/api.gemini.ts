import { createFileRoute } from '@tanstack/react-router'

const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

async function callGemini(prompt: string, retries = 3): Promise<string> {
  const apiKey = process.env['GEMINI_API_KEY']
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 429 && attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000))
          continue
        }
        throw new Error(`Gemini API error ${response.status}: ${errorText}`)
      }

      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
      }
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ??
        'Geen antwoord ontvangen.'
      )
    } catch (error) {
      if (attempt === retries - 1) throw error
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 1000))
    }
  }
  throw new Error('Max retries reached')
}

export const Route = createFileRoute('/api/gemini')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            prompt?: string
            type?: string
          }
          const { prompt, type } = body

          if (!prompt || typeof prompt !== 'string') {
            return Response.json({ error: 'Prompt is vereist' }, { status: 400 })
          }

          let systemContext = ''
          if (type === 'simulator') {
            systemContext = `Je bent een expert zonne-energie adviseur voor DNR Technics, een Belgisch bedrijf gespecialiseerd in zonnepanelen en thuisbatterijen in Hasselt en Houthalen. Geef gepersonaliseerd advies voor de ideale zonne-energie opstelling op basis van de beschrijving van de woning en het verbruik. Antwoord professioneel maar toegankelijk in het Nederlands. Geef concrete aanbevelingen voor het aantal panelen, vermogen, thuisbatterij en verwachte opbrengst. Sluit af met een aanmoediging om contact op te nemen met DNR Technics via 0474/605779.`
          } else if (type === 'autopilot') {
            systemContext = `Je bent een slim energiebeheersysteem voor DNR Technics. Op basis van de dagelijkse routine van de gebruiker, genereer je een geoptimaliseerd energieschema dat zonnepanelen en thuisbatterij optimaal benut om de netstroom te minimaliseren. Antwoord in het Nederlands met een concreet tijdschema met tijdstippen en acties. Gebruik het formaat "HH:MM - Actie/Advies". Geef 8-12 tijdsmomenten. Sluit af met een samenvatting van de verwachte besparing.`
          } else if (type === 'jargon') {
            systemContext = `Je bent een energiespecialist die complexe zonne-energie en energieopslag begrippen uitlegt in eenvoudig Belgisch Nederlands (Jip & Janneke taal). Leg elk begrip kort en duidelijk uit alsof je het aan een 10-jarige uitlegt. Geen technisch jargon in je uitleg. Gebruik vergelijkingen uit het dagelijks leven.`
          } else {
            systemContext = `Je bent een vriendelijke en deskundige AI-assistent van DNR Technics, een Belgisch bedrijf voor zonnepanelen en thuisbatterijen in Hasselt en Houthalen. Help klanten met hun vragen over zonne-energie. Wees enthousiast maar professioneel. Moedig aan om een offerte aan te vragen of te bellen naar 0474/605779. Antwoord altijd in het Nederlands.`
          }

          const fullPrompt = `${systemContext}\n\nGebruikersvraag/beschrijving: ${prompt}`
          const result = await callGemini(fullPrompt)

          return Response.json({ result })
        } catch (error) {
          console.error('Gemini API error:', error)
          return Response.json(
            {
              error:
                error instanceof Error
                  ? error.message
                  : 'Er is een fout opgetreden',
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
