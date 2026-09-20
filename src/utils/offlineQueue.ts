import { SyncQueueItem } from '../types';

const QUEUE_STORAGE_KEY = 'sbs_offline_queue';
const CACHED_PRODUCTS_KEY = 'sbs_cached_products';
const CACHED_SERVICES_KEY = 'sbs_cached_services';

export class OfflineManager {
  private static listeners: Array<(isOnline: boolean, syncing: boolean) => void> = [];
  private static isSyncing = false;

  public static isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public static subscribe(listener: (isOnline: boolean, syncing: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify() {
    const online = this.isOnline();
    this.listeners.forEach((l) => l(online, this.isSyncing));
  }

  public static init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.notify();
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.notify();
    });

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }

    // Try processing on start if online
    if (this.isOnline()) {
      this.processQueue();
    }
  }

  public static getQueue(): SyncQueueItem[] {
    try {
      const data = localStorage.getItem(QUEUE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static enqueue(type: 'order' | 'service_request', data: any): SyncQueueItem {
    const queue = this.getQueue();
    const item: SyncQueueItem = {
      id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      data,
      timestamp: Date.now(),
      attempts: 0,
    };
    queue.push(item);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    this.notify();

    if (this.isOnline()) {
      this.processQueue();
    }
    return item;
  }

  public static async processQueue(): Promise<{ synced: number; remaining: number }> {
    if (this.isSyncing || !this.isOnline()) {
      return { synced: 0, remaining: this.getQueue().length };
    }

    const queue = this.getQueue();
    if (queue.length === 0) return { synced: 0, remaining: 0 };

    this.isSyncing = true;
    this.notify();

    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: queue }),
      });

      if (response.ok) {
        const result = await response.json();
        const syncedClientIds = new Set(
          result.results?.filter((r: any) => r.status === 'synced').map((r: any) => r.clientId)
        );
        const remainingQueue = queue.filter((item) => !syncedClientIds.has(item.id));
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remainingQueue));
        this.isSyncing = false;
        this.notify();
        return { synced: syncedClientIds.size, remaining: remainingQueue.length };
      }
    } catch (err) {
      console.warn('Sync attempt failed:', err);
    }

    this.isSyncing = false;
    this.notify();
    return { synced: 0, remaining: this.getQueue().length };
  }

  // Caching product catalog for offline viewing
  public static setCachedProducts(products: any[]) {
    try {
      localStorage.setItem(CACHED_PRODUCTS_KEY, JSON.stringify(products));
    } catch {}
  }

  public static getCachedProducts(): any[] {
    try {
      const d = localStorage.getItem(CACHED_PRODUCTS_KEY);
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  }

  public static setCachedServices(services: any[]) {
    try {
      localStorage.setItem(CACHED_SERVICES_KEY, JSON.stringify(services));
    } catch {}
  }

  public static getCachedServices(): any[] {
    try {
      const d = localStorage.getItem(CACHED_SERVICES_KEY);
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  }
}
