'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TokenLore({ token }: { token: any }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {token.info?.description || 'No description available.'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 italic">
            Community notes coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 