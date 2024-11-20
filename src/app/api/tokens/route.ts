import { Connection } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { getTokenData, fetchDexScreenerData, calculateHoldings } from '@/lib/token-utils';
import { getCachedData, setCachedData, shouldRefreshCache } from '@/lib/cache';

const WALLET_ADDRESS = 'AM84n1iLdxgVTAyENBcLdjXoyvjentTbu5Q6EpKV1PeG';

const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://solana-mainnet.g.alchemy.com/v2/your-api-key',
    'confirmed'
);

export async function GET() {
    try {
        // Check cache first
        const cached = getCachedData();
        if (cached && !shouldRefreshCache()) {
            return new NextResponse(JSON.stringify(cached.holdings), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=60',
                },
            });
        }

        // Fetch fresh data
        const tokenBalances = await getTokenData(connection);
        const marketData = await fetchDexScreenerData(
            tokenBalances.map(t => t.mint)
        );
        const holdings = await calculateHoldings(
            connection,
            tokenBalances,
            marketData,
            WALLET_ADDRESS
        );

        // Update cache
        setCachedData(holdings);

        return new NextResponse(JSON.stringify(holdings), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60',
            },
        });
    } catch (error) {
        console.error('API Error:', error);
        // Return cached data on error if available
        const cached = getCachedData();
        if (cached) {
            return new NextResponse(JSON.stringify(cached.holdings), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=60',
                },
            });
        }
        return NextResponse.error();
    }
} 