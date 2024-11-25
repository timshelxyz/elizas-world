import { Metadata } from "next";
import { Connection } from "@solana/web3.js";
import { getTokenData, fetchDexScreenerData } from "@/lib/token-utils";
import { TokenProfile } from "@/components/token-profile";
import Link from "next/link";
import { Suspense } from "react";
import { formatDateTime } from "@/lib/date-utils";

// Route segment config
export const dynamic = 'force-dynamic';

// Create connection outside component
const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

// Define the params type that Next.js expects
type TokenPageProps = {
  params: { address: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Loading component
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-center">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Update metadata function
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { address: string },
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  try {
    // Create a Promise to resolve the address
    const addressPromise = Promise.resolve(params.address);
    const address = await addressPromise;
    
    const marketData = await fetchDexScreenerData([address]);
    const tokenName = marketData?.pairs?.[0]?.baseToken?.name || 'Token';
    
    return {
      title: `${tokenName} | AI Observatory`,
      description: `View detailed information about ${tokenName} on AI Observatory`,
    };
  } catch (error) {
    return {
      title: "Token | AI Observatory",
      description: "Token details",
    };
  }
}

// Update page component
export default async function TokenPage({
  params,
  searchParams,
}: {
  params: { address: string },
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  try {
    // Create a Promise to resolve the address
    const addressPromise = Promise.resolve(params.address);
    const address = await addressPromise;
    
    const marketData = await fetchDexScreenerData([address]);
    
    if (!marketData?.pairs?.length) {
      return (
        <main className="container max-w-[95vw] mx-auto p-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Observatory
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
            <p className="text-gray-600">The requested token could not be found.</p>
          </div>
        </main>
      );
    }

    const tokenData = marketData.pairs[0];
    
    return (
      <main className="container max-w-[95vw] mx-auto p-4">
        <Suspense fallback={<LoadingState />}>
          <TokenProfile token={tokenData} />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error('Error in TokenPage:', error);
    return (
      <main className="container max-w-[95vw] mx-auto p-4">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Observatory
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Token</h1>
          <p className="text-gray-600">There was an error loading the token data. Please try again later.</p>
        </div>
      </main>
    );
  }
} 