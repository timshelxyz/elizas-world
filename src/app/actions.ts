"use server"
import { getCachedData, shouldRefreshCache } from '@/lib/cache';
import { fetchLatestData } from '@/scripts/fetchLatestData';

async function getCachedDataIfValid() {
  const cached = await getCachedData();
  // const shouldRefresh = await shouldRefreshCache();
  if (cached) { // && !shouldRefresh
    console.log('Using cached data');
    return {
      holdings: cached.holdings,
      lastUpdated: new Date(cached.lastUpdated),
    };
  }
  
  return null;
}

export async function getLatestData() {
  try {
    // Try to get cached data first
    const cachedData = await getCachedDataIfValid();
    if (cachedData) {
      return {
        holdings: cachedData.holdings,
        lastUpdated: cachedData.lastUpdated,
      };
    }

    // If no valid cached data, fetch and process latest data
    return await fetchLatestData();
  } catch (error) {
    console.error('Error fetching data:', error);
    // Attempt to return cached data on error
    const cached = await getCachedData();
    if (cached) {
      return {
        holdings: cached.holdings,
        lastUpdated: new Date(cached.lastUpdated),
      };
    }
    throw error; // Re-throw if we couldn't even get cached data
  }
}