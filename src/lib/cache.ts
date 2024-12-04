import { TokenHolding } from "@/types";
import { Redis } from '@upstash/redis'

const CACHE_KEY = 'token_holdings_cache';
const CACHE_DURATION = 60; // 1 minute in seconds

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Define the interface for the cached data
interface CachedData {
  holdings: TokenHolding[];
  lastUpdated: string;
}

export async function getCachedData(): Promise<CachedData | null> {
  try {
    const data = await redis.get<CachedData>(CACHE_KEY);
    if (!data) return null;
    return {
      holdings: data.holdings,
      lastUpdated: data.lastUpdated
    };
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

export async function setCachedData(holdings: TokenHolding[]): Promise<void> {
  try {
    const cacheData: CachedData = {
      holdings,
      lastUpdated: new Date().toISOString()
    };
    await redis.set(CACHE_KEY, cacheData);
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

export async function shouldRefreshCache(): Promise<boolean> {
  const cached = await getCachedData();
  if (!cached) return true;
  const now = new Date();
  return now.getTime() - new Date(cached.lastUpdated).getTime() > CACHE_DURATION * 1000;
}