import { NextResponse } from 'next/server';
import { fetchLatestData } from '@/scripts/fetchLatestData';
import { TokenHolding } from '@/types';

const TIMEOUT_MS = 30000; // 30 seconds timeout

interface FetchResult {
    holdings: TokenHolding[];
    lastUpdated: string;
}
export async function GET() {
    try {
        const dataPromise = fetchLatestData();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), TIMEOUT_MS)
        );

        const data = await Promise.race([dataPromise, timeoutPromise])  as FetchResult;

        return NextResponse.json(
            {
                holdings: data.holdings,
                lastUpdated: data.lastUpdated,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching data' },
            { status: 500 }
        );
    }
}