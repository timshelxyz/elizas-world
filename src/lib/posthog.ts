'use client'

import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_BrBxTeQxtL24ebiwkSKxLL93wvoCJ5ayJ7Q5PbeJQdp', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: false,
    persistence: 'memory'
  })
}

export { posthog } 