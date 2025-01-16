import { NextResponse } from 'next/server';
import { getCachedData, shouldRefreshCache } from '@/lib/cache';
import { fetchLatestData } from '@/scripts/fetchLatestData';

export async function GET() {
    try {
        const needsRefresh = await shouldRefreshCache();

        if (needsRefresh) {
            // Trigger a background refresh
            fetchLatestData().catch(error => console.error('Error refreshing data:', error));
        }

        const cachedData = await getCachedData();

        if (!cachedData) {
            return NextResponse.json({ error: 'No data available' }, { status: 404 });
        }

        return NextResponse.json(cachedData, { status: 200 });
    } catch (error) {
        console.error('Error in GET route:', error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}