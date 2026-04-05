import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'DNR Technics — Zonnepanelen & Thuisbatterijen | Hasselt & Houthalen' },
      {
        name: 'description',
        content:
          'DNR Technics installeert zonnepanelen en thuisbatterijen in Hasselt en Houthalen. Uw woning wordt een autonome energiemachine. Bel 0474/605779.',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body style={{ margin: 0, backgroundColor: '#050505' }}>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
