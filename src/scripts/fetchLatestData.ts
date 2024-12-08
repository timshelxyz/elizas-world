import { getTokenData, fetchDexScreenerData, calculateHoldings } from "@/lib/token-utils";
import { setCachedData } from '@/lib/cache';
import { DexScreenerResponse } from "@/types";

import { Connection } from "@solana/web3.js";

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


export async function fetchLatestData() {
  console.log('Fetching token balances');
  const tokenBalances = await getTokenData(connection);
  
  if (!tokenBalances || tokenBalances.length === 0) {
    throw new Error('No tokens found');
  }
  
  console.log('Fetching market data');
  const marketData = await fetchDexScreenerData(
    tokenBalances.map(t => t.mint)
  );

  if (!marketData?.pairs?.length) {
    throw new Error('No market data available');
  }

  const dedupedMarketData = deduplicateMarketData(marketData);
  const holdings = await calculateHoldings(
    connection,
    tokenBalances,
    dedupedMarketData,
    WALLET_ADDRESS
  );
  const lastUpdated = new Date();

  // Cache the new data
  await setCachedData(holdings);

  return { holdings, lastUpdated };
}