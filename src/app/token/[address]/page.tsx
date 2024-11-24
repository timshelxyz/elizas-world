import { Connection } from "@solana/web3.js";
import { getTokenData, fetchDexScreenerData } from "@/lib/token-utils";
import { TokenProfile } from "@/components/token-profile";
import { formatDateTime } from "@/lib/date-utils";
import { Metadata } from "next";

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

interface PageProps {
  params: { address: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const marketData = await fetchDexScreenerData([params.address]);
  const tokenName = marketData?.pairs?.[0]?.baseToken?.name || 'Token';
  
  return {
    title: `${tokenName} | AI Observatory`,
    description: `View detailed information about ${tokenName} on AI Observatory`,
  };
}

export default async function TokenPage({ params }: PageProps) {
  const tokenBalances = await getTokenData(connection);
  const marketData = await fetchDexScreenerData([params.address]);
  
  if (!marketData?.pairs?.length) {
    return <div>Token not found</div>;
  }

  const tokenData = marketData.pairs[0];

  return (
    <main className="container max-w-[95vw] mx-auto p-4">
      <TokenProfile token={tokenData} />
    </main>
  );
} 