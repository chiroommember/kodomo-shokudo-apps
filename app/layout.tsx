import React from 'react'

export const metadata = {
  title: 'ちるーむ | こども食堂サポートサークル',
  description: '長崎大学 こども食堂サポートサークル',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
