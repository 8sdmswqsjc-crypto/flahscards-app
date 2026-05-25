import './globals.css'

export const metadata = {
  title: 'Flashcards - Learn with AI',
  description: 'Create and share flashcards powered by AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  )
}
