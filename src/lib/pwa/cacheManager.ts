import { Product } from '@/store/useStore';

const RECENTLY_VIEWED_KEY = 'dod-recently-viewed-products';
const MAX_RECENTLY_VIEWED = 10;
const DYNAMIC_CACHE_NAME = 'dod-dynamic-assets-v1';

export const cacheManager = {
  // Manage Recently Viewed Products in local storage
  getRecentlyViewed(): Product[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse recently viewed products', e);
      return [];
    }
  },

  addToRecentlyViewed(product: Product): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getRecentlyViewed();
      const filtered = current.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));

      // Trigger pre-caching of the product details route and image
      this.precacheProduct(product);
    } catch (e) {
      console.error('Failed to add to recently viewed products', e);
    }
  },

  // Precache product page HTML/JSON and product image dynamically
  async precacheProduct(product: Product): Promise<void> {
    if (typeof window === 'undefined' || !('caches' in window)) return;

    try {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);

      // Caching routes (Next.js server-rendered routes or data payloads)
      const routesToCache = [
        `/product/${product.id}`,
        // Add Next.js data prefetch routes if available
      ];

      // Add to Cache
      for (const route of routesToCache) {
        // Only fetch and cache if not already in cache
        const match = await cache.match(route);
        if (!match) {
          try {
            const response = await fetch(route);
            if (response.ok) {
              await cache.put(route, response);
              console.log(`[PWA Cache] Cached route: ${route}`);
            }
          } catch (fetchErr) {
            // Ignore fetch errors during pre-caching
          }
        }
      }

      // Caching product images
      if (product.image) {
        const imageMatch = await cache.match(product.image);
        if (!imageMatch) {
          try {
            // Use cors request for cross-origin unsplash images if needed, or normal fetch
            const imgResponse = await fetch(product.image, { mode: 'no-cors' });
            await cache.put(product.image, imgResponse);
            console.log(`[PWA Cache] Cached product image: ${product.image}`);
          } catch (imgErr) {
            // Ignore image fetch errors
          }
        }
      }
    } catch (error) {
      console.error('[PWA Cache] Failed to precache product', error);
    }
  },

  // Estimate total cache size in MB
  async getCacheSize(): Promise<number> {
    if (typeof window === 'undefined' || !('storage' in navigator) || !navigator.storage.estimate) {
      return 0;
    }

    try {
      const estimate = await navigator.storage.estimate();
      const usageInBytes = estimate.usage || 0;
      // Convert to MB
      return Math.round((usageInBytes / (1024 * 1024)) * 100) / 100;
    } catch (error) {
      console.error('Failed to estimate storage size', error);
      return 0;
    }
  },

  // Clear all caches managed by the app
  async clearPWACache(): Promise<boolean> {
    if (typeof window === 'undefined' || !('caches' in window)) return false;

    try {
      const cacheKeys = await caches.keys();
      const deletePromises = cacheKeys.map((key) => caches.delete(key));
      await Promise.all(deletePromises);
      console.log('[PWA Cache] All caches cleared successfully');
      return true;
    } catch (error) {
      console.error('[PWA Cache] Failed to clear caches', error);
      return false;
    }
  }
};
