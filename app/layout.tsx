import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const GA_ID = 'G-14EZ67DY2W'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800', '900'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'AEO Readiness Assessment — Avenue Z',
  description:
    'Find out how ready your brand is for AI search in under 2 minutes. Get an instant score across 10 AEO readiness categories.',
  openGraph: {
    title: 'Is Your Brand Ready for AI Search?',
    description:
      'Take the Avenue Z AEO Readiness Assessment — 10 sections, instant score, free.',
    siteName: 'Avenue Z',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Is Your Brand Ready for AI Search?',
    description:
      'Take the Avenue Z AEO Readiness Assessment — 10 sections, instant score, free.',
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body className="font-sans antialiased bg-black text-white">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
        {children}
      </body>
    </html>
  )
}
