'use client';

import { useState } from 'react';
import { TokenHolding, Social } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatDateTime } from '@/lib/date-utils';

// Helper function to format large numbers
function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

function getSocialUrl(platform: string, url: string): string {
  if (!url) return '#';
  return url; // Return the URL directly since it's already complete
}

function getSocialIcon(type: string): string {
  if (!type) return '🔗';
  
  switch (type.toLowerCase()) {
    case 'twitter':
      return '𝕏';
    case 'telegram':
      return '📱';
    case 'discord':
      return '💬';
    default:
      return '🔗';
  }
}

type SortConfig = {
  key: keyof TokenHolding | 
    'price' | 
    'marketCap' | 
    'totalSupply' | 
    'createdAt' | 
    'priceChange5m' |
    'priceChange1h' |
    'priceChange6h' |
    'priceChange24h' |
    'address' |
    'solValue' |
    'volume24h' |
    'score';
  direction: 'asc' | 'desc';
};

type TributeFilter = 'ALL' | 'FULL' | 'HALF' | 'SMOL';
type SocialFilter = 'ALL' | 'HAS_TWITTER' | 'NO_TWITTER';

// Add this helper function near the top with the other helper functions
function getTokenTags(holding: TokenHolding): Array<{label: string, color: string}> {
  const tags: Array<{label: string, color: string}> = [];
  
  // Check for Eliza and Degen Spartan AI address specifically
  if (holding.address === '5voS9evDjxF589WuEub5i4ti7FWQmZCsAsyD5ucbuRqM') {
    tags.push({ 
      label: 'ai16z Partner', 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    });
  }

  else if (holding.address === 'Gu3LDkn7Vx3bmCzLafYNKcDxv2mH7YN44NJZFXnypump') {
    tags.push({ 
      label: 'ai16z Official', 
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    });
  }


  // Check for Eliza in the name (but not for the official address)
  else if (holding.marketData.baseToken.name.toLowerCase().includes('eliza')) {
    tags.push({ 
      label: 'Community', 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    });
  }
  
  // Check for vvaifu.fun URL
  if (holding.marketData.info?.websites?.some(w => w.url.includes('vvaifu.fun'))) {
    tags.push({ 
      label: 'VVAIFU', 
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    });
  }
  
  return tags;
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function TokenGrid({ holdings }: { holdings: TokenHolding[] }) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'createdAt', 
    direction: 'desc' 
  });
  const [tributeFilter, setTributeFilter] = useState<TributeFilter>('FULL');
  const [socialFilter, setSocialFilter] = useState<SocialFilter>('HAS_TWITTER');

  const filterHoldings = (holdings: TokenHolding[], tributeFilter: TributeFilter, socialFilter: SocialFilter) => {
    let filtered = holdings;
    
    // Apply tribute filter
    switch (tributeFilter) {
      case 'FULL':
        filtered = filtered.filter(h => h.percentageOwned >= 9.9);
        break;
      case 'HALF':
        filtered = filtered.filter(h => h.percentageOwned >= 4.9 && h.percentageOwned < 9.9);
        break;
      case 'SMOL':
        filtered = filtered.filter(h => h.percentageOwned < 4.9);
        break;
    }

    // Apply social filter with improved Twitter URL validation
    switch (socialFilter) {
      case 'HAS_TWITTER':
        filtered = filtered.filter(h => {
          const twitterSocial = h.marketData.info?.socials?.find(s => s.type.toLowerCase() === 'twitter');
          if (!twitterSocial?.url) return false;
          // Check if URL contains a path after twitter.com or x.com
          const url = new URL(twitterSocial.url);
          return (url.hostname.includes('twitter.com') || url.hostname.includes('x.com')) 
            && url.pathname.length > 1; // More than just "/"
        });
        break;
      case 'NO_TWITTER':
        filtered = filtered.filter(h => {
          const twitterSocial = h.marketData.info?.socials?.find(s => s.type.toLowerCase() === 'twitter');
          if (!twitterSocial?.url) return true;
          // Include tokens with invalid Twitter URLs (just twitter.com or x.com)
          const url = new URL(twitterSocial.url);
          return !(url.pathname.length > 1);
        });
        break;
    }

    return filtered;
  };

  const sortData = (data: TokenHolding[], config: SortConfig) => {
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      switch(config.key) {
        case 'price':
          aValue = Number(a.marketData.priceUsd);
          bValue = Number(b.marketData.priceUsd);
          break;
        case 'marketCap':
          aValue = a.marketData.fdv || 0;
          bValue = b.marketData.fdv || 0;
          break;
        case 'totalSupply':
          aValue = (a.marketData.fdv || 0) / Number(a.marketData.priceUsd);
          bValue = (b.marketData.fdv || 0) / Number(b.marketData.priceUsd);
          break;
        case 'solValue':
          aValue = a.usdValue * (1 / Number(a.marketData.priceUsd));
          bValue = b.usdValue * (1 / Number(b.marketData.priceUsd));
          break;
        case 'volume24h':
          aValue = a.marketData.volume?.h24 || 0;
          bValue = b.marketData.volume?.h24 || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.marketData.pairCreatedAt).getTime();
          bValue = new Date(b.marketData.pairCreatedAt).getTime();
          break;
        case 'priceChange24h':
          aValue = a.marketData.priceChange?.h24 || 0;
          bValue = b.marketData.priceChange?.h24 || 0;
          break;
        case 'firstReceived':
          aValue = a.firstReceived || 0;
          bValue = b.firstReceived || 0;
          break;
        case 'priceChange5m':
          aValue = a.marketData.priceChange?.m5 || 0;
          bValue = b.marketData.priceChange?.m5 || 0;
          break;
        case 'priceChange1h':
          aValue = a.marketData.priceChange?.h1 || 0;
          bValue = b.marketData.priceChange?.h1 || 0;
          break;
        case 'priceChange6h':
          aValue = a.marketData.priceChange?.h6 || 0;
          bValue = b.marketData.priceChange?.h6 || 0;
          break;
        case 'address':
          aValue = a.address;
          bValue = b.address;
          break;
        case 'score':
          aValue = a.marketData.score || 0;
          bValue = b.marketData.score || 0;
          break;
        default:
          aValue = a[config.key as keyof TokenHolding];
          bValue = b[config.key as keyof TokenHolding];
      }

      if (config.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  };

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedAndFilteredHoldings = sortData(
    filterHoldings(holdings, tributeFilter, socialFilter),
    sortConfig
  );

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: SortConfig['key'] }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(sortKey)}
        className={`
          flex items-center gap-1
          ${sortConfig.key === sortKey 
            ? 'bg-[rgb(232,227,214)]' // Same color as hover state for active column
            : 'hover:bg-[rgb(232,227,214)]'
          }
        `}
      >
        {label}
        {sortConfig.key === sortKey ? (
          sortConfig.direction === 'desc' ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        {/* Tribute Filter */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'FULL', 'HALF', 'SMOL'] as TributeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTributeFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                ${tributeFilter === filter 
                  ? 'bg-[rgb(94,84,68)] text-white' 
                  : 'bg-[rgb(232,227,214)] text-[rgb(94,84,68)] hover:bg-[rgb(224,220,209)]'
                }`}
            >
              {filter} {filter !== 'ALL' && 'TRIBUTE'}
            </button>
          ))}
        </div>
        
        {/* Social Filter */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={socialFilter === 'HAS_TWITTER' ? 'default' : 'outline'}
            onClick={() => setSocialFilter('HAS_TWITTER')}
            className="text-sm flex-1 sm:flex-none"
          >
            Has 𝕏
          </Button>
          <Button
            variant={socialFilter === 'NO_TWITTER' ? 'default' : 'outline'}
            onClick={() => setSocialFilter('NO_TWITTER')}
            className="text-sm flex-1 sm:flex-none"
          >
            No 𝕏
          </Button>
          <Button
            variant={socialFilter === 'ALL' ? 'default' : 'outline'}
            onClick={() => setSocialFilter('ALL')}
            className="text-sm flex-1 sm:flex-none"
          >
            All
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card w-full overflow-x-auto">
        <Table className="w-full relative">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[65px]">🦾</TableHead>
              <TableHead>Token (CA)</TableHead>
              <TableHead className="sm:hidden">Token (CA)</TableHead>
              <SortHeader label="Links" sortKey="address" />
              <SortHeader label="Tribute Level" sortKey="percentageOwned" />
              <SortHeader label="Created" sortKey="createdAt" />
              <SortHeader label="USD Value" sortKey="usdValue" />
              <SortHeader label="Market Cap" sortKey="marketCap" />
              <SortHeader label="Trust Score" sortKey="score" />
              <SortHeader label="Price" sortKey="price" />
              <SortHeader label="5m %" sortKey="priceChange5m" />
              <SortHeader label="1h %" sortKey="priceChange1h" />
              <SortHeader label="6h %" sortKey="priceChange6h" />
              <SortHeader label="24h %" sortKey="priceChange24h" />
              <SortHeader label="% Owned" sortKey="percentageOwned" />
              <SortHeader label="ai16z Balance" sortKey="balance" />
              <SortHeader label="Total Supply" sortKey="totalSupply" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredHoldings.map((holding, index) => (
              <TableRow 
                key={holding.address} 
                className={`
                  hover:bg-accent/50 
                  ${index % 2 === 0 ? 'bg-card' : 'bg-background'}
                `}
              >
                <TableCell className="w-[65px]">
                  <div className="w-8 h-8 relative">
                    <a 
                      href={
                        holding.marketData.info?.socials?.find(s => s.type.toLowerCase() === 'twitter')?.url || 
                        `https://www.defined.fi/sol/${holding.address}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <img 
                        src={holding.marketData.info?.imageUrl || 'https://via.placeholder.com/32'} 
                        alt={holding.marketData.baseToken.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <a href={`https://www.defined.fi/sol/${holding.address}`}>
                        {holding.marketData.baseToken.name}
                      </a>
                      {getTokenTags(holding).map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xxs px-1.5 py-0.5 rounded-full whitespace-nowrap ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span className="cursor-pointer font-mono text-xs">
                        {truncateAddress(holding.address)}
                      </span>
                      <button 
                        className="p-1 hover:text-gray-700"
                        onClick={() => navigator.clipboard.writeText(holding.address)}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth="1.5" 
                          stroke="currentColor" 
                          className="h-3.5 w-3.5"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="sm:hidden">
                  <div className="w-8 h-8 relative">
                    <a 
                      href={
                        holding.marketData.info?.socials?.find(s => s.type.toLowerCase() === 'twitter')?.url || 
                        `https://www.defined.fi/sol/${holding.address}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <img 
                        src={holding.marketData.info?.imageUrl || 'https://via.placeholder.com/32'} 
                        alt={holding.marketData.baseToken.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </a>
                  </div>
                </TableCell>
                <TableCell className="flex gap-2">
                  {/* Website and Social links */}
                  {holding.marketData.info?.websites?.[0]?.url && (
                    <a 
                      href={holding.marketData.info.websites[0].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {holding.marketData.info.websites[0].url.includes('vvaifu.fun') ? '🤖' : '🌐'}
                    </a>
                  )}
                  {holding.marketData.info?.socials?.map((social) => (
                    <a 
                      key={social.url} 
                      href={getSocialUrl(social.type, social.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getSocialIcon(social.type)}
                    </a>
                  ))}
                </TableCell>
                <TableCell>
                  {holding.percentageOwned >= 9.9 ? (
                    <span className="text-green-500 font-bold">Full</span>
                  ) : holding.percentageOwned >= 4.9 ? (
                    <span className="text-yellow-500 font-bold">Half</span>
                  ) : (
                    <span className="text-gray-500">Smol</span>
                  )}
                </TableCell>
                <TableCell>
  {formatDateTime(new Date(holding.marketData.pairCreatedAt))}
</TableCell>
                <TableCell>{formatCurrency(holding.usdValue)}</TableCell>
                <TableCell>{formatCurrency(holding.marketData.fdv || 0)}</TableCell>
                <TableCell>
                  {holding.marketData.score !== undefined ? (
                    <a 
                        href={`https://www.solsniffer.com/scanner/${holding.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                            ${holding.marketData.score >= 79 ? 'text-green-400' : 
                              holding.marketData.score >= 60 ? 'text-orange-300' : 
                              holding.marketData.score >= 40 ? 'text-red-500' : 
                              'text-red-800'
                            } font-medium hover:underline cursor-pointer
                        `}
                    >
                        {holding.marketData.score.toFixed(0)}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>${Number(holding.marketData.priceUsd).toFixed(6)}</TableCell>
                <TableCell 
                    className={`${
                        !holding.marketData.priceChange?.m5 ? 'text-gray-400' :
                        holding.marketData.priceChange.m5 > 0 ? 'text-green-500' : 
                        holding.marketData.priceChange.m5 < 0 ? 'text-red-500' : 
                        'text-gray-500'
                    }`}
                >
                    {holding.marketData.priceChange?.m5 
                        ? `${Math.round(holding.marketData.priceChange.m5)}%` 
                        : '0%'
                    }
                </TableCell>
                <TableCell 
                    className={`${
                        !holding.marketData.priceChange?.h1 ? 'text-gray-400' :
                        holding.marketData.priceChange.h1 > 0 ? 'text-green-500' : 
                        holding.marketData.priceChange.h1 < 0 ? 'text-red-500' : 
                        'text-gray-500'
                    }`}
                >
                    {holding.marketData.priceChange?.h1 
                        ? `${Math.round(holding.marketData.priceChange.h1)}%` 
                        : '0%'
                    }
                </TableCell>
                <TableCell 
                    className={`${
                        !holding.marketData.priceChange?.h6 ? 'text-gray-400' :
                        holding.marketData.priceChange.h6 > 0 ? 'text-green-500' : 
                        holding.marketData.priceChange.h6 < 0 ? 'text-red-500' : 
                        'text-gray-500'
                    }`}
                >
                    {holding.marketData.priceChange?.h6 
                        ? `${Math.round(holding.marketData.priceChange.h6)}%` 
                        : '0%'
                    }
                </TableCell>
                <TableCell 
                    className={`${
                        !holding.marketData.priceChange?.h24 ? 'text-gray-400' :
                        holding.marketData.priceChange.h24 > 0 ? 'text-green-500' : 
                        holding.marketData.priceChange.h24 < 0 ? 'text-red-500' : 
                        'text-gray-500'
                    }`}
                >
                    {holding.marketData.priceChange?.h24 
                        ? `${Math.round(holding.marketData.priceChange.h24)}%` 
                        : '0%'
                    }
                </TableCell>
                
                <TableCell>{holding.percentageOwned.toFixed(2)}%</TableCell>
                <TableCell>{formatNumber(holding.balance)}</TableCell>
                <TableCell>{formatNumber((holding.marketData.fdv || 0) / Number(holding.marketData.priceUsd))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 