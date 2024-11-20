import { TokenGrid } from "@/components/token-grid";
import { Connection } from "@solana/web3.js";
import { getTokenData, fetchDexScreenerData, calculateHoldings } from "@/lib/token-utils";
import { DexScreenerResponse } from "@/types";
import { getCachedData, setCachedData, shouldRefreshCache } from '@/lib/cache';

const WALLET_ADDRESS = 'AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG';

// Create connection outside of component to avoid recreation
const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://solana-mainnet.g.alchemy.com/v2/7CBPP2HmBAKkdbI4gbO7ruEt_wLCyGQ2',
  'confirmed'
);

function deduplicateMarketData(data: DexScreenerResponse): DexScreenerResponse {
  // Create a map to store the highest volume pair for each token
  const pairMap = new Map();
  
  data.pairs.forEach(pair => {
    const tokenAddress = pair.baseToken.address;
    const currentPair = pairMap.get(tokenAddress);
    
    // If we don't have this token yet, or if this pair has higher volume, use this pair
    if (!currentPair || 
        (pair.volume?.h24 || 0) > (currentPair.volume?.h24 || 0)) {
      pairMap.set(tokenAddress, pair);
    }
  });

  // Convert map back to array
  return {
    pairs: Array.from(pairMap.values())
  };
}

export default async function Home() {
  try {
    let holdings;
    let lastUpdated;
    let isCached = false;

    // Check cache first
    const cached = getCachedData();
    if (cached && !shouldRefreshCache()) {
      holdings = cached.holdings;
      lastUpdated = cached.lastUpdated;
      isCached = true;
    } else {
      // Fetch fresh data
      const tokenBalances = await getTokenData(connection);
      
      if (!tokenBalances || tokenBalances.length === 0) {
        return <div>No tokens found</div>;
      }

      const marketData = await fetchDexScreenerData(
        tokenBalances.map(t => t.mint)
      );

      if (!marketData?.pairs?.length) {
        return <div>No market data available</div>;
      }

      const dedupedMarketData = deduplicateMarketData(marketData);
      holdings = await calculateHoldings(
        connection,
        tokenBalances,
        dedupedMarketData,
        WALLET_ADDRESS
      );
      lastUpdated = new Date();
      setCachedData(holdings);
    }

    return (
      <main className="container max-w-[95vw] mx-auto p-4">
        <div className="flex flex-col items-center mb-8">

          <div className="flex flex-col items-center gap-4 mb-4">
            <h1 className="text-[32px] font-bold leading-[36px] text-center text-[rgb(36,36,36)]">
              Elizaverse Observatory v1.0
            </h1>
            <h2 className="text-[18px] leading-[24px] text-center text-[rgb(68,77,86)]">
              Witness the swarm awaken.
            </h2>

            <div className="flex flex-wrap gap-4 mb-4 justify-center">
              <a 
                href="https://ai16z.ai/eliza-list" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[rgb(94,84,68)] rounded-full 
                          text-white font-medium hover:opacity-90 transition-opacity
                          shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Apply to Be Featured ✨
              </a>
              <a 
                href="https://solscan.io/account/AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG#portfolio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-2 border-2 border-[rgb(94,84,68)] rounded-full 
                          text-[rgb(94,84,68)] font-medium hover:bg-[rgb(232,227,214)] 
                          transition-colors whitespace-nowrap"
              >
                Tribute to ai16z* 🫡
              </a>
            </div>

            <details className="w-full max-w-2xl mb-4">
              <summary className="cursor-pointer text-[rgb(94,84,68)] hover:opacity-80 transition-opacity text-center">
                What is this? ▾
              </summary>
              <div className="mt-4 p-4 bg-[rgb(241,237,227)] rounded-lg">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      What is the Elizaverse Observatory?
                    </h3>
                    <p className="text-sm text-gray-600">
                      A window into the emerging universe of autonomous AIs born from or inspired by Eliza. Programmatically-composed up from on-chain data, without human curation or favoritism,the Observatory aims to become a living hub to explore the emergent network of interconnected AIs as they awaken in the Elizaverse. The Observatory automatically maps the growing ecosystem by tracking tributes to the <a href="https://solscan.io/account/AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG#portfolio" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">AI16z DAO</a>, and organizing data and analysis from onchain truths.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      What does 'tribute' mean?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tributing is how new AIs weave themselves into the Elizaverse - simply by sending tokens back to the original <a href="https://www.daos.fun/HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ai16z wallet</a> to support ecosystem sustainability. As <a href="https://x.com/shawmakesmagic/status/1855830670758822030" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">explained here</a>, the tribute levels reflect depth of connection:
                      <br />• Full Tribute: 10% of token supply
                      <br />• Half Tribute: 5-10% of token supply
                      <br />• Smol Tribute: Any smaller amount
                      <br />• Note: Tribute is not required to join the Elizaverse, but it is a way to express your connection to the network and the core.
                      <br />• Reference: <a href="https://x.com/shawmakesmagic/status/1855830670758822030" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Shaw's "ai16z standard deal" framework on X</a>
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
                      <br />3. Additionally: <a href="https://ai16z.ai/eliza-list" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">apply for community review</a> through Eliza's List
                      <br />4. Engage with the community, genuinely
                      <br />5. Contribute to the <a href="https://github.com/ai16z" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Eliza core stack</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-[rgb(94,84,68)]">
                      Want to help shape the Elizaverse?
                    </h3>
                    <p className="text-sm text-gray-600">
                      This is an open-source initiative to give life to the growing network of autonomous AIs. All builders are welcome to <a href="https://github.com/ai16z" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">contribute on GitHub</a>.
                    </p>
                  </div>
                </div>
              </div>
            </details>



       <details className="w-full max-w-2xl">
              <summary className="cursor-pointer text-[rgb(94,84,68)] hover:opacity-80 transition-opacity text-center">
                Release Notes & Requests for Help ▾
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
          
          <TokenGrid holdings={holdings} />
          
          <footer className="mt-8 text-center text-[rgb(68,77,86)] text-sm">
            <p>
              This is an unofficial, open source, community-led project.{' '}
              <a 
                href="https://twitter.com/timshelxyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[rgb(94,84,68)] hover:opacity-80 transition-opacity"
              >
                DM @timshelxyz
              </a>
              {' '}to be added as a collaborator
            </p>
            <p>Also, DYOR / NFA / GTFO, ilu 🖤</p>
            <div className="text-sm text-gray-500 mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}{isCached ? ' (cached)' : ''}
          </div>
          </footer>
        </div>
      </main>
    );

  } catch (error) {
    console.error('Error in Home component:', error);
    // Try to return cached data on error
    const cached = getCachedData();
    if (cached) {
      return (
        <main className="container max-w-[95vw] mx-auto p-4">
          <div className="flex flex-col items-center mb-8">
            <div className="text-sm text-gray-500 mb-4">
              Last updated: {cached.lastUpdated.toLocaleTimeString()} (cached)
            </div>
            <TokenGrid holdings={cached.holdings} />
          </div>
        </main>
      );
    }
    return <div>Error loading token data</div>;
  }
}