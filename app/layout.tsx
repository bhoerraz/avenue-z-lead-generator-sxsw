import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800', '900'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'AEO Readiness Assessment — Avenue Z',
  description:
    'Find out how ready your brand is for AI search in under 2 minutes. Get an instant score across 10 AEO readiness categories.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body className="font-sans antialiased bg-black text-white">
        {children}
      </body>
    </html>
  )
}
