'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/lib/format-utils";

export function TokenStats({ token }: { token: any }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Price Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">5m</p>
              <p className={`text-2xl font-bold ${
                !token.priceChange?.m5 ? 'text-gray-400' :
                token.priceChange.m5 > 0 ? 'text-green-500' : 
                'text-red-500'
              }`}>
                {token.priceChange?.m5 
                  ? `${Math.round(token.priceChange.m5)}%` 
                  : '0%'
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">1h</p>
              <p className={`text-2xl font-bold ${
                !token.priceChange?.h1 ? 'text-gray-400' :
                token.priceChange.h1 > 0 ? 'text-green-500' : 
                'text-red-500'
              }`}>
                {token.priceChange?.h1 
                  ? `${Math.round(token.priceChange.h1)}%` 
                  : '0%'
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">6h</p>
              <p className={`text-2xl font-bold ${
                !token.priceChange?.h6 ? 'text-gray-400' :
                token.priceChange.h6 > 0 ? 'text-green-500' : 
                'text-red-500'
              }`}>
                {token.priceChange?.h6 
                  ? `${Math.round(token.priceChange.h6)}%` 
                  : '0%'
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">24h</p>
              <p className={`text-2xl font-bold ${
                !token.priceChange?.h24 ? 'text-gray-400' :
                token.priceChange.h24 > 0 ? 'text-green-500' : 
                'text-red-500'
              }`}>
                {token.priceChange?.h24 
                  ? `${Math.round(token.priceChange.h24)}%` 
                  : '0%'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trading Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">24h Transactions</dt>
              <dd>{formatNumber(token.txns?.h24 || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Holders</dt>
              <dd>{formatNumber(token.holders || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Price ATH</dt>
              <dd>{formatNumber(token.priceUsd.ath || 0)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
} 