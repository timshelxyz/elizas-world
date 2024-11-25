'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/format-utils";
import { formatDateTime } from "@/lib/date-utils";

export function TokenInfo({ token }: { token: any }) {
  const score = token.trustScore || token.score || token.info?.trustScore;
  console.log('Token data:', token);
  console.log('Score paths:', {
    trustScore: token.trustScore,
    score: token.score,
    infoTrustScore: token.info?.trustScore
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Token Info</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd>{token.baseToken.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Symbol</dt>
              <dd>{token.baseToken.symbol}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="truncate max-w-[200px]">
                <a 
                  href={`https://solscan.io/token/${token.baseToken.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {token.baseToken.address}
                </a>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd>{formatDateTime(new Date(token.pairCreatedAt))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Trust Score</dt>
              <dd>
                <a 
                  href={`https://www.solsniffer.com/scanner/${token.baseToken.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    ${!score ? 'text-gray-400' :
                      score >= 79 ? 'text-green-400' : 
                      score >= 60 ? 'text-orange-300' : 
                      score >= 40 ? 'text-red-500' : 
                      'text-red-800'
                    } font-medium hover:underline cursor-pointer
                  `}
                >
                  {score !== undefined ? score.toFixed(0) : 'N/A'}
                </a>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Total Supply</dt>
              <dd>{formatNumber((token.fdv || 0) / Number(token.priceUsd))}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Price</dt>
              <dd>{formatCurrency(token.priceUsd)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Market Cap</dt>
              <dd>{formatCurrency(token.marketCap || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">24h Volume</dt>
              <dd>{formatCurrency(token.volume?.h24 || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Liquidity</dt>
              <dd>{formatCurrency(token.liquidity?.usd || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">FDV</dt>
              <dd>{formatCurrency(token.fdv || 0)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
} 