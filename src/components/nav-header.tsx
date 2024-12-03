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
                href="https://warpcast.com/harmonybot"
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
          <a href="https://elizas.world/" target="_blank" className="hover:opacity-80 transition-opacity">
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
              Eliza
            </a>
            <span className="text-[rgb(255,136,68)] font-medium text-sm px-3 py-1.5">
              Tribute
              <a
                href="https://solscan.io/account/AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG#portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block ml-2 hover:opacity-80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 24" fill="none" className="inline-block w-5 h-5" width="20" height="20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.67546 16.6449C6.73454 16.5811 6.80593 16.5299 6.88535 16.4942C6.96477 16.4586 7.05058 16.4394 7.13766 16.4376H21.66C21.7215 16.4384 21.7813 16.457 21.8324 16.491C21.8836 16.5249 21.9238 16.5729 21.9482 16.6291C21.9727 16.6853 21.9803 16.7474 21.9701 16.8078C21.96 16.8682 21.9326 16.9244 21.8912 16.9696L18.8129 20.3762C18.7538 20.4399 18.6824 20.4912 18.603 20.5268C18.5236 20.5624 18.4378 20.5817 18.3507 20.5834H3.81905C3.75761 20.5826 3.69772 20.564 3.64659 20.5301C3.59547 20.4961 3.55528 20.4481 3.53087 20.3919C3.50646 20.3357 3.49886 20.2737 3.50898 20.2133C3.51911 20.1528 3.54653 20.0966 3.58795 20.0514L6.67546 16.6449ZM21.9051 13.8211C21.9465 13.8663 21.9739 13.9225 21.9839 13.9829C21.9942 14.0434 21.9865 14.1054 21.9621 14.1616C21.9377 14.2178 21.8974 14.2658 21.8463 14.2998C21.7952 14.3337 21.7354 14.3523 21.6739 14.3531L7.1469 14.3647C7.05984 14.3629 6.97401 14.3436 6.89459 14.308C6.81517 14.2724 6.74378 14.2211 6.68471 14.1574L3.58333 10.7624C3.54191 10.7171 3.51449 10.6609 3.50436 10.6005C3.49423 10.5401 3.50183 10.4781 3.52625 10.4219C3.55066 10.3656 3.59085 10.3177 3.64197 10.2837C3.6931 10.2497 3.75298 10.2312 3.81443 10.2303L18.3414 10.2188C18.4285 10.2206 18.5143 10.2398 18.5938 10.2755C18.6732 10.3111 18.7446 10.3623 18.8036 10.4261L21.9051 13.8211ZM6.67546 4.2073C6.73454 4.14353 6.80593 4.0923 6.88535 4.05668C6.96477 4.02106 7.05058 4.00178 7.13766 4.00001L21.6693 4.01152C21.7307 4.01239 21.7907 4.03092 21.8418 4.0649C21.8929 4.09889 21.9331 4.14686 21.9574 4.20307C21.9819 4.25927 21.9895 4.32131 21.9794 4.38172C21.9692 4.44213 21.9418 4.49833 21.9004 4.54358L18.8129 7.93857C18.7538 8.00235 18.6824 8.05359 18.603 8.08921C18.5236 8.12483 18.4378 8.14409 18.3507 8.14587H3.81905C3.75761 8.145 3.69772 8.12647 3.64659 8.09249C3.59547 8.05851 3.55528 8.01052 3.53087 7.95433C3.50646 7.89812 3.49886 7.83609 3.50898 7.77568C3.51911 7.71527 3.54653 7.65906 3.58795 7.61382L6.67546 4.2073Z" fill="url(#solana-gradient)" />
                  <defs>
                    <linearGradient id="solana-gradient" x1="4.06171" y1="20.9451" x2="21.3683" y2="3.58022" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#9945FF" />
                      <stop offset="0.14" stopColor="#8A53F4" />
                      <stop offset="0.42" stopColor="#6377D6" />
                      <stop offset="0.79" stopColor="#24B0A7" />
                      <stop offset="0.99" stopColor="#00D18C" />
                      <stop offset="1" stopColor="#00D18C" />
                    </linearGradient>
                  </defs>
                </svg>
              </a>
              <a
                href="https://magiceden.us/runes/portfolio/bc1pznwkqmuwrm6538rwf8ntq9zp6r34lu9m3q5pszudp4tmyrfr2qqqzyq6qz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block ml-2 hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5" width="20" height="20">
                  <path d="M21.4583 14.0743C20.1559 19.4984 14.865 22.7995 9.64055 21.4469C4.41826 20.0946 1.23913 14.6005 2.54203 9.17675C3.84379 3.75199 9.13471 0.450708 14.3576 1.80297C19.5817 3.15524 22.7606 8.64998 21.4581 14.0744L21.4582 14.0743H21.4583Z" fill="#F7931A" />
                  <path d="M16.3003 10.1822C16.4943 8.8348 15.5064 8.11051 14.1555 7.62734L14.5937 5.80214L13.5237 5.5253L13.0971 7.30244C12.8158 7.22959 12.5269 7.16094 12.2398 7.09289L12.6695 5.30403L11.6001 5.02718L11.1616 6.85178C10.9288 6.79675 10.7002 6.74236 10.4784 6.68505L10.4796 6.67931L9.00404 6.2967L8.7194 7.48337C8.7194 7.48337 9.51327 7.67232 9.49654 7.68395C9.92984 7.79625 10.0082 8.09408 9.99519 8.33015L9.49597 10.4095C9.52581 10.4173 9.56451 10.4287 9.60721 10.4465C9.57151 10.4373 9.53353 10.4273 9.49411 10.4175L8.79438 13.3303C8.74142 13.467 8.60702 13.6722 8.30407 13.5943C8.3148 13.6104 7.52636 13.3927 7.52636 13.3927L6.99512 14.6645L8.38758 15.025C8.64662 15.0924 8.90047 15.163 9.15046 15.2294L8.70768 17.0755L9.77646 17.3523L10.215 15.5258C10.5069 15.6081 10.7903 15.684 11.0677 15.7556L10.6307 17.5735L11.7007 17.8504L12.1435 16.0077C13.9681 16.3662 15.3401 16.2217 15.9175 14.508C16.3829 13.1284 15.8944 12.3326 14.9344 11.8136C15.6336 11.6462 16.1602 11.1687 16.3006 10.1824L16.3003 10.1821L16.3003 10.1822ZM13.8555 13.7418C13.5248 15.1215 11.2876 14.3757 10.5623 14.1887L11.1499 11.7429C11.8752 11.9309 14.2011 12.303 13.8556 13.7418H13.8555ZM14.1864 10.1622C13.8848 11.4172 12.0227 10.7796 11.4187 10.6233L11.9514 8.40507C12.5555 8.56141 14.5007 8.85321 14.1865 10.1622H14.1864Z" fill="white" />
                </svg>
              </a>
            </span>
          </nav>
        </div>
      </header>
    </>
  )
} 