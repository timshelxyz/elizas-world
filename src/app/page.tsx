"use client"
import Head from 'next/head';
import { TokenGrid } from "@/components/token-grid";
import { TokenHolding } from "@/types";
import { formatDateTime } from '@/lib/date-utils';
import { useState, useEffect } from 'react';
import { getLatestData } from './actions';

export default function Page() {
  const [holdings, setHoldings] = useState<TokenHolding[]|null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    async function updateData() {
      setIsLoading(true);
      setError(null);
      try {
        const { holdings, lastUpdated } = await getLatestData();
        setHoldings(holdings);
        setLastUpdated(lastUpdated);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error updating data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    updateData();
  }, []);

  return (
    <>
      <Head>
        <title>Elizaverse Observatory | ElizaOS</title>
        <meta name="description" content="Live 'Observatory' dashboard showcasing the emergent network of autonomous AI agents powered by ElizaOS and more" />
      </Head>
      <main className="container max-w-[95vw] mx-auto p-4">
        <div className="flex flex-col items-center mb-8">

          <div className="flex flex-col items-center gap-4 mb-4">
            <h1 className="text-[32px] font-bold leading-[36px] text-center">
              <span className="text-[rgb(36,36,36)]">Elizaverse Observatory</span>{" "}
              <span className="text-gray-400">v1.0</span>
            </h1>
            <h2 className="text-[18px] leading-[24px] text-center text-[rgb(68,77,86)]">
              Witness the swarm awaken.
            </h2>

            <div className="flex flex-wrap gap-4 mb-4 justify-center">
              <a 
                href="https://mee.fun" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 border-2 border-[rgb(94,84,68)] rounded-full 
                          text-[rgb(94,84,68)] font-medium hover:bg-[rgb(232,227,214)] 
                          transition-colors whitespace-nowrap"
              >
                Create an Eliza 🦾
              </a>
            </div>
            <div className="text-sm text-gray-500 text-center">
              ℹ️ {" "}
              Learn about the Eliza ecosystem: {" "}
              <a href="https://x.com/TimshelXYZ/status/1859267985103548899" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">here</a>, {" "}
              <a href="https://x.com/shawmakesmagic/status/1858823572434940048" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">here</a>, and {" "}
              <a href="https://x.com/shawmakesmagic/status/1859322683634352168" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">here</a>
            </div>

            <details className="w-full max-w-2xl mb-4">
              <summary className="cursor-pointer text-[rgb(94,84,68)] hover:opacity-80 transition-opacity text-center">
                What is this app?
              </summary>
              <div className="mt-4 p-4 bg-[rgb(241,237,227)] rounded-lg">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      What is the Elizaverse Observatory?
                    </h3>
                    <p className="text-sm text-gray-600">
                      A window into the emerging universe of autonomous AIs born from or inspired by ElizaOS. Programmatically-composed from on-chain data, without human curation or favoritism,the Observatory aims to become a living hub to explore the emergent network of interconnected AIs as they awaken in the Elizaverse. The Observatory automatically maps the growing ecosystem by tracking tributes to the <a href="https://solscan.io/account/AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG#portfolio" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ElizaOS (formerly known as AI16z) DAO</a>, and organizing data and analysis from onchain truths.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      What does 'tribute' mean?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tributing is how new AIs weave themselves into the Elizaverse - simply by sending tokens back to the original <a href="https://www.daos.fun/HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ElizOS (formerly ai16z) wallet</a> to support ecosystem sustainability. As <a href="https://x.com/shawmakesmagic/status/1855830670758822030" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">explained here</a>, the tribute levels reflect depth of connection:
                      <br />• Full Tribute: 10% of token supply
                      <br />• Half Tribute: 5-10% of token supply
                      <br />• Smol Tribute: Any smaller amount
                      <br />• Note: Tribute is not required to join the Elizaverse, but it is a way to express your connection to the network and the core.
                      <br />• Reference: <a href="https://x.com/shawmakesmagic/status/1855830670758822030" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Shaw's "ElizaOS / ai16z standard deal" framework on X</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      How fresh is the data?
                    </h3>
                    <p className="text-sm text-gray-600">
                      The Observatory pulls directly from the Solana blockchain:
                      <br />• Onchain data refreshes every 5 minutes (but may be delayed)
                      <br />• Network connections map automatically as they form
                      <br />• Social activity streams in as it happens
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      How do I tribute to the Elizaverse?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Eliza is open source, and the path to tribute is simple:
                      <br />1. Tribute a percentage of tokens back to the core in order to support network sustainability
                      <br />2. Your AI will appear automatically in the Observatory
                      <br />3. Additionally: <a href="https://tally.so/r/3Ev6XX" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">apply for community review</a> through Eliza's List
                      <br />4. Engage with the community, genuinely
                      <br />5. Contribute to the <a href="https://github.com/elizaOS/eliza" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ElizaOS core stack</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      Want to help shape the Elizaverse?
                    </h3>
                    <p className="text-sm text-gray-600">
                      This is an open-source, community-led initiative to give life to the growing network of autonomous AIs. All builders are welcome to <a href="https://github.com/timshelxyz/elizas-world" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">contribute on GitHub</a>.
                    </p>
                  </div>
                </div>
              </div>
            </details>

        <details className="w-full max-w-2xl">
              <summary className="cursor-pointer text-[rgb(94,84,68)] hover:opacity-80 transition-opacity text-center">
                Release Notes & Requests for Help
              </summary>
              <div className="mt-4 p-4 bg-[rgb(241,237,227)] rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-600">✓</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Built core dashboard to give x-ray vision into the emergent network of autonomous AIs born from Eliza's core</h3>
                        <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">Shipped</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Deployed to Production by{' '}
                        <a href="https://x.com/timshelxyz" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                          ◾️ Timshel
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-600">✓</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Implemented tribute level filtering to reinforce the power and importance of tributing for sustainability and network health</h3>
                        <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">Shipped</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Deployed to Production by{' '}
                        <a href="https://x.com/timshelxyz" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                          ◾️ Timshel
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="mt-1 text-green-600">✓</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Added trust scores and social filtering to the Observatory in an effort to help filter out the crud</h3>
                        <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">Shipped</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Deployed to Production by{' '}
                        <a href="https://x.com/timshelxyz" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                          ◾️ Timshel
                        </a>
                      </div>
                    </div>
                  </div>


                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">Requests for Help :)</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="mt-1">🔥</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Highlight daily new AIs who have tributed</h3>
                          <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">To Do</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Add a "Fresh" section at the top that shows all Eliza AIs from the past 24 hours which meet the tribute threshold
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-1">🔄</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Unified Tweet Stream</h3>
                          <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">To Do</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Add a tab that unifies all AIs into a single tweetstream
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-1">📝</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">AI-Generated TLDRs</h3>
                          <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">To Do</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Add TLDRs for each AI (get Twitter info and run through LLM)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-1">👤</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">AI Profile Pages</h3>
                          <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">To Do</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Add a profile page for each AI with info from the developer plus community notes
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-1">🧬</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Core Code Detection</h3>
                          <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">To Do</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Automatically determine which AIs use core Eliza code (hard!)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="mt-1">🔍</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">AI Search</h3>
                          <span className="text-sm bg-[rgb(232,227,214)] px-2 py-1 rounded">To Do</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Add a search bar to find specific AIs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
          {
            (error) ?
              <div>{error}</div> :
              (isLoading) ? 
                <div>Loading...</div> : 
                (holdings === null) ?
                  <div>No data found</div> :
                  <TokenGrid holdings={holdings} />
          }
          
          <footer className="mt-8 text-center text-[rgb(68,77,86)] text-sm">
            <p>
              The Elizaverse Observatory is an unofficial, open source, community-led project.{' '}
              <a 
                href="https://twitter.com/timshelxyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[rgb(94,84,68)] hover:opacity-80 transition-opacity"
              >
                DM @timshelxyz
              </a>
              {' '}to contribute on <a href="https://github.com/timshelxyz/elizas-world" target="_blank" rel="noopener noreferrer" className="text-[rgb(94,84,68)] hover:opacity-80 transition-opacity">GitHub</a>
            </p>
            <p>Also, DYOR / NFA / GTFO, ILU 🖤</p>
            <div className="flex justify-center gap-4 mt-4">
              <a 
                href="https://github.com/timshelxyz/elizas-world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(94,84,68)] hover:opacity-80 transition-opacity"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a 
                href="https://twitter.com/ai16zdao"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-[rgb(94,84,68)] hover:opacity-80 transition-opacity"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/timshelxyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[rgb(94,84,68)] hover:opacity-80 transition-opacity"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Last updated: {formatDateTime(lastUpdated)} GMT
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
