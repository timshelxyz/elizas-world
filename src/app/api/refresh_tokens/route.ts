import { NextResponse } from 'next/server';
import { fetchLatestData } from '@/scripts/fetchLatestData';
import { TokenHolding } from '@/types';

interface FetchResult {
    holdings: TokenHolding[];
    lastUpdated: Date;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sync = searchParams.get('sync') === 'true';
    // Start the fetch process in the background
if (sync) {
        try {
            const data = await fetchLatestData() as FetchResult;
            return NextResponse.json(data, { status: 200 });
        } catch (error) {
            console.error('Error fetching data:', error);
            return NextResponse.json(
                { error: 'An error occurred while fetching data' },
                { status: 500 }
            );
        }
    } else {
        // Asynchronous execution (original behavior)
        fetchLatestData()
            .then(() => console.log('Data fetched successfully'))
            .catch(error => console.error('Error fetching data:', error));

        return NextResponse.json(
            { message: 'Data refresh initiated' },
            { status: 202 }
        );
    }
}