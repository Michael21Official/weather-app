import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CacheService {
    private cache = new Map<string, { data: any; timestamp: number }>();
    private ttl = 300000;

    set(key: string, data: any): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    get(key: string): any | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }
}