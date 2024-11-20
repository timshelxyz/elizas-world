import { TokenHolding } from "@/types";
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'data', 'cache.json');
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

export function getCachedData() {
    try {
        if (!fs.existsSync(CACHE_FILE)) {
            return null;
        }
        const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        return {
            holdings: data.holdings,
            lastUpdated: new Date(data.lastUpdated)
        };
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

export function setCachedData(holdings: TokenHolding[]) {
    try {
        const dir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify({
            holdings,
            lastUpdated: new Date()
        }));
    } catch (error) {
        console.error('Error writing cache:', error);
    }
}

export function shouldRefreshCache(): boolean {
    const cached = getCachedData();
    if (!cached) return true;
    const now = new Date();
    return now.getTime() - cached.lastUpdated.getTime() > CACHE_DURATION;
}