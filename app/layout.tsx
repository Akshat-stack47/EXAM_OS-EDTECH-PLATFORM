import type { Metadata } from 'next'
import { Inter, Nunito, Poppins } from 'next/font/google'
import './globals.css'
import TRPCProvider from '@/components/providers/trpc-provider'
import PostHogProvider from '@/components/providers/PostHogProvider'
import { reportWebVitals } from '@/lib/performance'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' })

export const metadata: Metadata = {
  title: 'ExamOS — India\'s Unified Exam Intelligence Platform',
  description: 'One ecosystem. Every exam. Zero fragmentation. Built for 200M+ government exam aspirants.',
  keywords: ['exam', 'UPSC', 'SSC', 'banking', 'JEE', 'NEET', 'education', 'EdTech', 'India'],
  manifest: '/manifest.json',
  openGraph: {
    title: 'ExamOS',
    description: 'India\'s Unified Exam Intelligence Platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        <PostHogProvider>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

export { reportWebVitals }
