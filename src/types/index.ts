import { TokenBalance as AlchemyTokenBalance } from "alchemy-sdk";

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

interface TokenBalance {
    mint: string;
    tokenAmount: {
        uiAmount: number;
        decimals: number;
        amount: string;
    };
}

interface Social {
    platform: string;
    handle: string;
}

interface TokenInfo {
    imageUrl?: string;
    websites?: Array<{ label: string; url: string }>;
    socials?: Array<{
        type: string;
        url: string;
    }>;
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
    volume?: {
        h24: number;
    };
    txns?: {
        h24: number;
    };
    pairCreatedAt: number;
    score?: number;
}

interface TokenHolding {
    address: string;
    balance: number;
    decimals: number;
    usdValue: number;
    percentageOwned: number;
    firstReceived: number;
    marketData: {
        baseToken: {
            address: string;
            name: string;
            symbol: string;
        };
        priceUsd: string;
        priceChange: {
            m5: number;
            h1: number;
            h6: number;
            h24: number;
        };
        fdv?: number;
        volume?: {
            h24: number;
        };
        txns?: {
            h24: number;
        };
        info?: TokenInfo;
        pairCreatedAt: number;
        score?: number;
    };
}

interface TokenData {
    holdings: TokenHolding[];
    summary: {
        totalValue: number;
        totalHoldings: number;
        significantPositions: number;
        averagePosition: number;
        topHoldingsValue: number;
        topHoldingsPercentage: number;
    }
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

interface DexScreenerResponse {
    pairs: Array<{
        baseToken: {
            address: string;
            name: string;
            symbol: string;
        };
        priceUsd: string;
        priceChange: {
            m5: number;
            h1: number;
            h6: number;
            h24: number;
        };
        fdv?: number;
        volume?: {
            h24: number;
        };
        txns?: {
            h24: number;
        };
        info?: TokenInfo;
        pairCreatedAt: number;
    }>;
}

// Add this to your existing types file
export interface DexScreenerPair {
  baseToken: { address: string; name: string; symbol: string };
  priceUsd: string;
  priceChange: { m5: number; h1: number; h6: number; h24: number };
  fdv?: number;
  volume?: { h24: number };
  txns?: { h24: number };
  info?: TokenInfo;
  pairCreatedAt: number;
}

export type {
    TokenAmount,
    ParsedTokenAccount,
    TokenBalance,
    Social,
    TokenInfo,
    BaseToken,
    Liquidity,
    TokenPair,
    TokenHolding,
    TokenData,
    TimeSeriesPoint,
    TokenAnalysis,
    DexScreenerResponse,
    AlchemyTokenBalance
};