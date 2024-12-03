import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios, { AxiosError } from 'axios';
import { TokenHolding, DexScreenerResponse, ParsedTokenAccount, TokenBalance } from '@/types';
import { Alchemy, Network } from "alchemy-sdk";
import fs from 'fs';
import path from 'path';

// Initialize Alchemy - note we can't use SOL_MAINNET as it's not supported
const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "7CBPP2HmBAKkdbI4gbO7ruEt_wLCyGQ2",
    network: Network.ETH_MAINNET, // We'll handle Solana separately
};

const alchemy = new Alchemy(config);

const SCORES_CACHE_PATH = path.join(process.cwd(), 'data', 'token-scores.json');

// Helper to load cached scores
function loadCachedScores(): Record<string, number> {
    try {
        if (fs.existsSync(SCORES_CACHE_PATH)) {
            const data = fs.readFileSync(SCORES_CACHE_PATH, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn('Error loading cached scores:', error);
    }
    return {};
}

// Helper to save scores to cache
function saveScoresToCache(scores: Record<string, number>) {
    try {
        // Ensure directory exists
        const dir = path.dirname(SCORES_CACHE_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(SCORES_CACHE_PATH, JSON.stringify(scores, null, 2));
    } catch (error) {
        console.warn('Error saving scores to cache:', error);
    }
}

export async function getTokenBalances(connection: Connection, walletPubkey: PublicKey): Promise<TokenBalance[]> {
    try {
        // We'll skip Alchemy for now as it doesn't support Solana natively
        const accounts = await connection.getParsedTokenAccountsByOwner(
            walletPubkey,
            { programId: TOKEN_PROGRAM_ID }
        );
        console.log("Accounts:",accounts.value.length);
        return accounts.value
            .map((account: { account: ParsedTokenAccount }) => ({
                mint: account.account.data.parsed.info.mint,
                tokenAmount: account.account.data.parsed.info.tokenAmount
            }))
            .filter((info) => Number(info.tokenAmount.amount) > 0);
    } catch (error) {
        console.error("Error in getTokenBalances:", error instanceof Error ? error.message : String(error));
        return [];
    }
}

export async function fetchDexScreenerData(
    tokenAddresses: string[]
): Promise<DexScreenerResponse> {
    try {
        // Filter out any empty or invalid addresses
        const validAddresses = tokenAddresses.filter(addr => addr && addr.length > 0);
        
        if (validAddresses.length === 0) {
            return { pairs: [] };
        }

        // Break addresses into batches of 30
        const BATCH_SIZE = 30;
        const allPairs = [];

        for (let i = 0; i < validAddresses.length; i += BATCH_SIZE) {
            const batchAddresses = validAddresses.slice(i, i + BATCH_SIZE);
            const url = `https://api.dexscreener.com/latest/dex/tokens/${batchAddresses.join(',')}`;
            
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                if (response.data?.pairs) {
                    allPairs.push(...response.data.pairs);
                }
                // Add a small delay between batches to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`Error fetching batch ${i/BATCH_SIZE + 1}:`, error);
            }
        }

        return {
            pairs: allPairs
        };
    } catch (error) {
        console.error('Error fetching market data:', error);
        return { pairs: [] };
    }
}

export async function fetchTokenAnalysis(address: string) {
    try {
        const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/solana/${address}`);
        const pair = response.data.pairs[0];
        
        return {
            priceChange24h: parseFloat(pair.priceChange24h || '0'),
            priceChange7d: parseFloat(pair.priceChange7d || '0'),
            volumeChange24h: parseFloat(pair.volumeChange24h || '0'),
            volumeAvg24h: pair.volume?.h24 || 0,
            txCount24h: pair.txns?.h24 || 0,
            holders: pair.holders || undefined,
            timeSeries: pair.priceUsd?.map((price: number, index: number) => ({
                timestamp: Date.now() - (index * 3600000),
                price,
                volume: pair.volume.h24 / 24
            })) || []
        };
    } catch (error) {
        console.error(`Error fetching analysis for ${address}:`, error instanceof Error ? error.message : String(error));
        return null;
    }
}

// Modify calculateHoldings to make the first received date optional
export async function calculateHoldings(
    connection: Connection,
    balances: TokenBalance[], 
    marketData: DexScreenerResponse,
    walletAddress: string
): Promise<TokenHolding[]> {
    const holdings: TokenHolding[] = [];
    const seenPairs = new Set<string>();

    if (!marketData?.pairs) {
        return holdings;
    }

    // Get all token addresses first
    const tokenAddresses = marketData.pairs
        .map(pair => pair?.baseToken?.address)
        .filter((addr): addr is string => !!addr);

    // Fetch scores for all tokens
    console.log('Fetching scores for', tokenAddresses.length, 'tokens');
    const scores = await fetchTokenScores(tokenAddresses);
    console.log('Fetched scores:', scores.length);

    for (const pair of marketData.pairs) {
        if (!pair?.baseToken?.address || seenPairs.has(pair.baseToken.address)) {
            continue;
        }
        seenPairs.add(pair.baseToken.address);

        const balance = balances.find(b => b.mint === pair.baseToken.address);
        if (balance) {
            const totalSupply = pair.fdv ? pair.fdv / Number(pair.priceUsd) : undefined;
            const percentageOwned = totalSupply ? (balance.tokenAmount.uiAmount / totalSupply) * 100 : 0;
            const usdValue = balance.tokenAmount.uiAmount * Number(pair.priceUsd);

            holdings.push({
                address: pair.baseToken.address,
                balance: balance.tokenAmount.uiAmount,
                decimals: balance.tokenAmount.decimals,
                usdValue,
                percentageOwned,
                firstReceived: 0,
                marketData: {
                    ...pair,
                    score: scores[pair.baseToken.address] // Add score to marketData
                }
            });
        }
    }

    console.log('Final holdings with scores:', holdings.map(h => ({
        address: h.address,
        score: h.marketData.score
    })));

    return holdings.sort((a, b) => b.usdValue - a.usdValue);
}

// This function now serves as a wrapper around getTokenBalances for compatibility
export async function getTokenData(connection: Connection) {
    try {
        const walletPubkey = new PublicKey("AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG");
        const balances = await getTokenBalances(connection, walletPubkey);
        
        // Already in the correct format
        return balances;
    } catch (error) {
        console.error("Error in getTokenData:", error instanceof Error ? error.message : String(error));
        return [];
    }
}

interface SolSnifferResponse {
  data: Array<{
    address: string;
    tokenData?: {
      score: number;
      indicatorData: {
        high: { count: number; details: string };
        moderate: { count: number; details: string };
        low: { count: number; details: string };
        specific: { count: number; details: string };
      };
      deployTime: string;
      auditRisk: {
        mintDisabled: boolean;
        freezeDisabled: boolean;
        lpBurned: boolean;
        top10Holders: boolean;
      };
    };
    error?: string;
  }>;
}

async function fetchTokenScores(tokenAddresses: string[]): Promise<Record<string, number>> {
    // Load cached scores
    const cachedScores = loadCachedScores();
    
    // Filter out addresses we already have scores for
    const uncachedAddresses = tokenAddresses.filter(addr => 
        addr && addr.length > 0 && cachedScores[addr] === undefined
    );
    
    if (uncachedAddresses.length === 0) {
        return cachedScores;
    }

    try {
        const BATCH_SIZE = 20;
        const newScores: Record<string, number> = {};
        
        for (let i = 0; i < uncachedAddresses.length; i += BATCH_SIZE) {
            const batchAddresses = uncachedAddresses.slice(i, i + BATCH_SIZE);
            
            try {
                console.log(`Fetching scores for batch ${i/BATCH_SIZE + 1}, addresses:`, batchAddresses);
                
                const response = await axios.post<SolSnifferResponse>(
                    'https://solsniffer.com/api/v2/tokens', 
                    { addresses: batchAddresses },
                    {
                        headers: {
                            'accept': 'application/json',
                            'X-API-KEY': '891aayu3sa4lbg4m8gu9gtfct3pxcp',
                            'Content-Type': 'application/json',
                        },
                        timeout: 10000,
                    }
                );

                if (response.data?.data) {
                    response.data.data.forEach(token => {
                        if (token.address && token.tokenData?.score !== undefined) {
                            newScores[token.address] = token.tokenData.score;
                        }
                    });
                }

                // Log batch results
                console.log(`Batch ${i/BATCH_SIZE + 1} results:`, 
                    response.data?.data?.map(t => ({
                        address: t.address,
                        score: t.tokenData?.score,
                        error: t.error
                    }))
                );

                if (i + BATCH_SIZE < uncachedAddresses.length) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (batchError) {
                console.warn(`Failed to fetch scores for batch ${i/BATCH_SIZE + 1}:`, 
                    batchError instanceof Error ? batchError.message : String(batchError));
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
            }
        }

        // Merge new scores with cached scores and save
        const allScores = { ...cachedScores, ...newScores };
        saveScoresToCache(allScores);
        
        return allScores;
    } catch (error) {
        console.error('Error in fetchTokenScores:', 
            error instanceof Error ? error.message : String(error));
        return cachedScores; // Return cached scores on error
    }
}