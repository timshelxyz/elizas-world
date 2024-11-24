'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
        <div className="flex items-center gap-4">
          <img 
            src={token.info?.imageUrl || '/default-token.png'} 
            alt={token.baseToken.name}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold">{token.baseToken.name}</h1>
            <p className="text-gray-600">{token.baseToken.symbol}</p>
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