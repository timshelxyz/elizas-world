"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { posthog } from '@/lib/posthog'
import { Suspense } from 'react'

function AnalyticsTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      posthog.capture('$pageview')
    }
  }, [pathname, searchParams])

  return null
}

export function Analytics() {
  return (
    <Suspense>
      <AnalyticsTracking />
    </Suspense>
  )
} 