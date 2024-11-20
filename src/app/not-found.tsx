import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Not Found',
  description: 'Page not found',
}

export default function NotFound() {
  return (
    <main className="container max-w-[95vw] mx-auto p-4">
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-2">You have reached the periphery of the Elizaverse</p>
        </div>
      </div>
    </main>
  )
} 