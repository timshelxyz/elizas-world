import dotenv from 'dotenv';
import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { time } from 'console';
dotenv.config();

const TARGET_WALLET = 'AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG';

interface TokenAmount {
    amount: string;
    decimals: number;
    uiAmount: number;
}

interface ParsedTokenAccount {
    data: {
        parsed: {
            info: {
                mint: string;
                tokenAmount: TokenAmount;
            };
        };
    };
}

interface Social {
    platform: string;
    handle: string;
}

interface TokenInfo {
    imageUrl?: string;
    websites?: { url: string }[];
    socials?: Social[];
}

interface BaseToken {
    address: string;
    name: string;
    symbol: string;
}

interface Liquidity {
    usd: number;
    base: number;
    quote: number;
}

interface TokenPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: BaseToken;
    quoteToken: BaseToken;
    priceUsd: string;
    liquidity: Liquidity;
    fdv?: number;
    marketCap?: number;
    info?: TokenInfo;
}

interface DexScreenerResponse {
    schemaVersion: string;
    pairs: TokenPair[];
}

interface TokenHolding {
    address: string;
    balance: number;
    decimals: number;
    usdValue: number;
    percentageOwned: number;
    marketData: TokenPair;
}

interface TimeSeriesPoint {
    timestamp: number;
    price: number;
    volume: number;
}

interface TokenAnalysis {
    priceChange24h: number;
    priceChange7d?: number;
    volumeChange24h: number;
    volumeAvg24h: number;
    txCount24h: number;
    holders?: number;
    timeSeries: TimeSeriesPoint[];
}

async function fetchWalletTokens(): Promise<string[]> {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const walletPubkey = new PublicKey(TARGET_WALLET);

    try {
        console.log('Fetching token accounts...');
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPubkey, {
            programId: TOKEN_PROGRAM_ID,
        });

        const tokenAddresses = tokenAccounts.value
            .filter(account => {
                const parsedAccount = account.account as ParsedTokenAccount;
                const balance = parsedAccount.data.parsed.info.tokenAmount.uiAmount;
                return balance > 0;
            })
            .map(account => {
                const parsedAccount = account.account as ParsedTokenAccount;
                return parsedAccount.data.parsed.info.mint;
            });

        console.log(`Found ${tokenAddresses.length} tokens with non-zero balance`);
        return tokenAddresses;
    } catch (error) {
        console.error('Error fetching wallet tokens:', error);
        throw error;
    }
}

async function fetchDexScreenerData(tokenAddresses: string[]): Promise<DexScreenerResponse> {
    const BATCH_SIZE = 30;
    const batches: DexScreenerResponse[] = [];
    
    for (let i = 0; i < tokenAddresses.length; i += BATCH_SIZE) {
        const batch = tokenAddresses.slice(i, i + BATCH_SIZE);
        const url = `https://api.dexscreener.com/latest/dex/tokens/${batch.join(',')}`;
        
        try {
            const response = await axios.get<DexScreenerResponse>(url);
            batches.push(response.data);
            await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
            console.error(`Error fetching batch ${i/BATCH_SIZE + 1}:`, error);
        }
    }

    return {
        schemaVersion: batches[0]?.schemaVersion || '',
        pairs: batches.flatMap(batch => batch.pairs || [])
    };
}

async function getTokenBalances(connection: Connection, walletPubkey: PublicKey) {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPubkey, {
        programId: TOKEN_PROGRAM_ID,
    });

    return tokenAccounts.value.map(account => {
        const parsedAccount = account.account as ParsedTokenAccount;
        return {
            mint: parsedAccount.data.parsed.info.mint,
            balance: parsedAccount.data.parsed.info.tokenAmount.uiAmount,
            decimals: parsedAccount.data.parsed.info.tokenAmount.decimals
        };
    });
}

async function fetchTokenAnalysis(address: string): Promise<TokenAnalysis | null> {
    try {
        const url = `https://api.dexscreener.com/latest/dex/pairs/solana/${address}`;
        const response = await axios.get(url);
        const pair = response.data.pair;

        if (!pair) return null;

        return {
            priceChange24h: pair.priceChange.h24 || 0,
            volumeChange24h: pair.volumeChange.h24 || 0,
            volumeAvg24h: pair.volume.h24 || 0,
            txCount24h: pair.txns.h24.total || 0,
            timeSeries: pair.priceUsd.map((price: number, index: number) => ({
                timestamp: Date.now() - (index * 3600000), // Approximate hourly data
                price,
                volume: pair.volume.h24 / 24 // Approximate hourly volume
            }))
        };
    } catch (error) {
        console.error(`Error fetching analysis for ${address}:`, error);
        return null;
    }
}

async function main() {
    try {
        const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        const walletPubkey = new PublicKey(TARGET_WALLET);

        // Get token balances
        console.log('Fetching token balances...');
        const balances = await getTokenBalances(connection, walletPubkey);
        
        // Get market data
        console.log('Fetching market data...');
        const tokenAddresses = balances.map(b => b.mint);
        const marketData = await fetchDexScreenerData(tokenAddresses);

        // Combine balance and market data
        const holdings: TokenHolding[] = [];
        
        marketData.pairs.forEach(pair => {
            const balance = balances.find(b => b.mint === pair.baseToken.address);
            if (balance) {
                const totalSupply = pair.fdv ? pair.fdv / Number(pair.priceUsd) : undefined;
                const percentageOwned = totalSupply ? (balance.balance / totalSupply) * 100 : 0;
                const usdValue = balance.balance * Number(pair.priceUsd);

                holdings.push({
                    address: pair.baseToken.address,
                    balance: balance.balance,
                    decimals: balance.decimals,
                    usdValue,
                    percentageOwned,
                    marketData: pair
                });
            }
        });

        // Sort by USD value
        const sortedHoldings = holdings.sort((a, b) => b.usdValue - a.usdValue);

        console.log('\n=== Significant Holdings Analysis (≥10% of supply) ===\n');
        
        for (const holding of sortedHoldings.filter(h => h.percentageOwned >= 10)) {
            const pair = holding.marketData;
            const analysis = await fetchTokenAnalysis(pair.pairAddress);
            
            console.log(`Token: ${pair.baseToken.name} (${pair.baseToken.symbol})`);
            console.log(`Address: ${pair.baseToken.address}`);
            console.log(`Balance: ${holding.balance.toLocaleString()} tokens`);
            console.log(`USD Value: $${holding.usdValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`);
            console.log(`Percentage Owned: ${holding.percentageOwned.toFixed(2)}%`);
            
            console.log('\nPrice Metrics:');
            console.log(`Current Price: $${pair.priceUsd}`);
            if (analysis) {
                console.log(`24h Change: ${analysis.priceChange24h.toFixed(2)}%`);
                console.log(`24h Volume: $${analysis.volumeAvg24h.toLocaleString()}`);
                console.log(`24h Transactions: ${analysis.txCount24h.toLocaleString()}`);
                
                // Volume analysis
                const volumeToMcap = analysis.volumeAvg24h / (pair.marketCap || 1);
                console.log(`Volume/MCap Ratio: ${(volumeToMcap * 100).toFixed(2)}%`);
            }
            
            console.log('\nLiquidity Metrics:');
            console.log(`Market Cap: $${pair.marketCap?.toLocaleString() ?? 'N/A'}`);
            console.log(`FDV: $${pair.fdv?.toLocaleString() ?? 'N/A'}`);
            console.log(`Liquidity: $${pair.liquidity?.usd?.toLocaleString() ?? 'N/A'}`);
            
            // Calculate liquidity ratio
            if (pair.marketCap && pair.liquidity?.usd) {
                const liquidityRatio = (pair.liquidity.usd / pair.marketCap) * 100;
                console.log(`Liquidity/MCap Ratio: ${liquidityRatio.toFixed(2)}%`);
            }
            
            if (analysis?.timeSeries && analysis.timeSeries.length > 0) {
                console.log('\nRecent Price Action:');
                const last24h = analysis.timeSeries.slice(0, 24).reverse();
                const timeframes = ['1h', '4h', '12h', '24h'];
                
                timeframes.forEach(tf => {
                    const hours = parseInt(tf);
                    const startPrice = last24h[0]?.price || 0;
                    const endPrice = last24h[hours - 1]?.price || 0;
                    const change = ((endPrice - startPrice) / startPrice) * 100;
                    console.log(`${tf} Change: ${change.toFixed(2)}%`);
                });
            }
            
            if (pair.info?.socials) {
                console.log('\nSocial Links:');
                const socialMap = new Map<string, string>();
                
                pair.info.socials.forEach(social => {
                    const platform = social.platform.toLowerCase();
                    if (platform === 'twitter' || platform === 'telegram' || platform === 'discord') {
                        socialMap.set(platform, social.handle);
                    }
                });

                if (socialMap.has('twitter')) console.log(`Twitter: https://twitter.com/${socialMap.get('twitter')}`);
                if (socialMap.has('telegram')) console.log(`Telegram: https://t.me/${socialMap.get('telegram')}`);
                if (socialMap.has('discord')) console.log(`Discord: ${socialMap.get('discord')}`);
            }

            if (pair.info?.websites && pair.info.websites.length > 0) {
                console.log(`Website: ${pair.info.websites[0].url}`);
            }
            
            // Add warning indicators
            console.log('\nRisk Indicators:');
            if (holding.percentageOwned > 25) {
                console.log('⚠️ High ownership concentration (>25%)');
            }
            if (pair.liquidity?.usd && pair.liquidity.usd < 50000) {
                console.log('⚠️ Low liquidity (<$50k)');
            }
            if (analysis?.volumeAvg24h && analysis.volumeAvg24h < 10000) {
                console.log('⚠️ Low trading volume (<$10k/24h)');
            }
            
            console.log('\n-------------------\n');
            
            // Add a small delay between API calls
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Portfolio summary with more metrics
        const totalValue = sortedHoldings.reduce((sum, h) => sum + h.usdValue, 0);
        const significantHoldings = sortedHoldings.filter(h => h.percentageOwned >= 10);
        
        console.log('\n=== Portfolio Summary ===');
        console.log(`Total Holdings: ${sortedHoldings.length} tokens`);
        console.log(`Total Portfolio Value: $${totalValue.toLocaleString()}`);
        console.log(`Significant Positions (≥10%): ${significantHoldings.length}`);
        console.log(`Average Position Size: $${(totalValue / sortedHoldings.length).toLocaleString()}`);
        
        // Calculate concentration metrics
        const topHoldingsValue = significantHoldings.reduce((sum, h) => sum + h.usdValue, 0);
        console.log(`Value in Significant Positions: $${topHoldingsValue.toLocaleString()} (${((topHoldingsValue/totalValue)*100).toFixed(2)}% of portfolio)`);

    } catch (error) {
        console.error('Script failed:', error);
    }
}

main(); 