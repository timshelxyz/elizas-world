'use client'

export function NavHeader() {
  return (
    <header className="w-full border-b border-[rgb(230,222,213)] bg-[rgb(241,237,227)]">
      <div className="container max-w-[95vw] mx-auto p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href="https://ai16z.ai/" target="_blank" className="hover:opacity-80 transition-opacity">
          <img 
            src="/observatory_orange.png" 
            alt="Observatory Logo" 
            className="h-12 w-12"
          />
        </a>
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <a 
            href="https://elizas.world" 
            className="text-[rgb(255,136,0)] font-medium text-sm hover:bg-[rgb(232,227,214)] px-4 py-2 rounded-xl"
          >
            Elizaverse
          </a>
          <a 
            href="https://ai16z.ai/" 
            className="text-[rgb(94,84,68)] font-medium text-sm hover:bg-[rgb(232,227,214)] px-4 py-2 rounded-xl"
          >
            ai16z
          </a>
          <a 
            href="https://ai16z.github.io/eliza/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgb(94,84,68)] font-medium text-sm hover:bg-[rgb(232,227,214)] px-4 py-2 rounded-xl"
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  )
} 