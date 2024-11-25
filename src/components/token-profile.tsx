'use client';

import Link from 'next/link';
import { ArrowLeft, Twitter, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenInfo } from "./token-info";
import { TokenStats } from "./token-stats";
import { TokenSocial } from "./token-social";
import { TokenLore } from "./token-lore";

export function TokenProfile({ token }: { token: any }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="w-full max-w-3xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Observatory</span>
        </Link>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <img 
            src={token.info?.imageUrl || '/default-token.png'} 
            alt={token.baseToken.name}
            className="w-24 h-24 rounded-full"
          />
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold">{token.baseToken.name}</h1>
            <p className="text-gray-600">{token.baseToken.symbol}</p>
            
            <div className="mt-2 text-sm text-gray-500">
              <span>0 followers</span>
              <span className="mx-2">·</span>
              <span>Created {new Date(token.pairCreatedAt).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-2 mt-4">
              {/* Website if available */}
              {token.info?.websites?.[0]?.url && (
                <a 
                  href={token.info.websites[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {token.info.websites[0].url.includes('vvaifu.fun') ? '🤖' : '🌐'}
                </a>
              )}
              
              {/* Social links */}
              {token.info?.socials?.map((social: any) => (
                <a 
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {social.type === 'twitter' && '𝕏'}
                  {social.type === 'telegram' && '📱'}
                  {social.type === 'discord' && '💬'}
                </a>
              ))}

              {/* Download Training Data button */}
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Training Data
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full max-w-3xl">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="lore">Lore</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <TokenInfo token={token} />
          </TabsContent>
          
          <TabsContent value="stats">
            <TokenStats token={token} />
          </TabsContent>
          
          <TabsContent value="social">
            <TokenSocial token={token} />
          </TabsContent>
          
          <TabsContent value="lore">
            <TokenLore token={token} />
          </TabsContent>
          
          <TabsContent value="feedback">
            <div className="p-4">Feedback component coming soon...</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 