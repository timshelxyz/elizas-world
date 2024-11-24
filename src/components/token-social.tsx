'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TokenSocial({ token }: { token: any }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {token.info?.socials?.map((social: any) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {social.type === 'twitter' && '𝕏'}
                {social.type === 'telegram' && '📱'}
                {social.type === 'discord' && '💬'}
                <span>{social.type.charAt(0).toUpperCase() + social.type.slice(1)}</span>
              </a>
            ))}
            
            {token.info?.websites?.map((website: any) => (
              <a
                key={website.url}
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                🌐 <span>Website</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 