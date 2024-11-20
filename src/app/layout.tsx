import { Providers } from './providers'
import { Analytics } from '@/components/analytics'
import { NavHeader } from '@/components/nav-header'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Eliza's World: Autonomous AI Dashboard",
  description: "Live 'Observatory' dashboard showcasing the emergent network of autonomous AI agents born from Eliza's core (and beyond).",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <Providers>
          <NavHeader />
          {children}
        </Providers>
      </body>
    </html>
  )
} 