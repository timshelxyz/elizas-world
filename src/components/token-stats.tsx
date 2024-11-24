'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPercentage } from "@/lib/format-utils";

export function TokenStats({ token }: { token: any }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">1h Change</p>
              <p className={`text-2xl font-bold ${token.priceChange.h1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(token.priceChange.h1)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">24h Change</p>
              <p className={`text-2xl font-bold ${token.priceChange.h24 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(token.priceChange.h24)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">7d Change</p>
              <p className={`text-2xl font-bold ${token.priceChange.h7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(token.priceChange.h7d)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">30d Change</p>
              <p className={`text-2xl font-bold ${token.priceChange.h30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(token.priceChange.h30d)}
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