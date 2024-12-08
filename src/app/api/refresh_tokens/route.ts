import { NextResponse } from 'next/server';
import { fetchLatestData } from '@/scripts/fetchLatestData';

export async function GET() {
    const data = await fetchLatestData();
    return NextResponse.json(
        {
            holdings: data.holdings,
            lastUpdated: data.lastUpdated,
        }
    );
}