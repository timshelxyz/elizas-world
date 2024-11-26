'use client'

import { ExternalLink, X } from 'lucide-react'
import { useState } from 'react'

export function NavHeader() {
  const [showBanner, setShowBanner] = useState(true)

  return (
    <>
      {/* Coming Soon Banner */}
      {showBanner && (
        <div className="w-full bg-[#f8f4ee] border-b border-[#e6d9c4] py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1" /> {/* Left spacer */}
            
            {/* Desktop version */}
            <div className="hidden md:flex items-center gap-3 text-sm text-[#4a4a4a] text-center">
              <span className="font-medium">𖥂 Coming Soon</span>
              <span>Elizas on BTC and Base</span>
              <a 
                href="https://twitter.com/script0shi/bio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b35] hover:text-[#e85a2a] flex items-center gap-1"
              >
                Script0shi (BTC) <ExternalLink className="h-3 w-3" />
              </a>
              <span>•</span>
              <a 
                href="https://twitter.com/manifestrune"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b35] hover:text-[#e85a2a] flex items-center gap-1"
              >
                Manifestation (BTC) <ExternalLink className="h-3 w-3" />
              </a>
              <span>•</span>
              <a 
                href="https://warpcast.com/sayangel/0x779e1173"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b35] hover:text-[#e85a2a] flex items-center gap-1"
              >
                HarmonyBot (Base) <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Mobile version */}
            <div className="md:hidden flex items-center gap-2 text-sm text-[#4a4a4a]">
              <span className="font-medium">𖥂 Coming Soon</span>
              <span className="font-bold">Elizas on BTC</span>
              <a 
                href="https://twitter.com/script0shi/bio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b35] hover:text-[#e85a2a]"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://twitter.com/SkynetNeural_AI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b35] hover:text-[#e85a2a]"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
              <span>and Base</span>
              <a 
                href="https://warpcast.com/sayangel/0x779e1173"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ff6b35] hover:text-[#e85a2a]"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex-1 flex justify-end pr-2">
              <button 
                onClick={() => setShowBanner(false)}
                className="text-[#4a4a4a] hover:text-[#2a2a2a]"
                aria-label="Close banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Header */}
      <header className="w-full border-b border-[rgb(230,222,213)] bg-[rgb(241,237,227)]">
        <div className="container max-w-[95vw] mx-auto px-4 py-3 flex items-center justify-between">
          <a href="https://ai16z.ai/" target="_blank" className="hover:opacity-80 transition-opacity">
            <img 
              src="/observatory_orange.png" 
              alt="Observatory Logo" 
              className="h-8 w-8"
            />
          </a>
          <nav className="flex items-center gap-4">
            <a 
              href="https://ai16z.ai/" 
              className="text-[rgb(94,84,68)] font-medium text-sm hover:bg-[rgb(232,227,214)] px-3 py-1.5 rounded-xl"
            >
              ai16z
            </a>
            <a 
              href="https://ai16z.github.io/eliza/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(94,84,68)] font-medium text-sm hover:bg-[rgb(232,227,214)] px-3 py-1.5 rounded-xl"
            >
              Docs
            </a>
            <a 
              href="https://solscan.io/account/AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG#portfolio" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(255,136,68)] font-medium text-sm hover:bg-[rgb(232,227,214)] px-3 py-1.5 rounded-xl"
            >
              Tribute
            </a>
          </nav>
        </div>
      </header>
    </>
  )
} 