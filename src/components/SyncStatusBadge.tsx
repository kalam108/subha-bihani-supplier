import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { OfflineManager } from '../utils/offlineQueue';

export const SyncStatusBadge: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [showSyncedSuccess, setShowSyncedSuccess] = useState(false);

  useEffect(() => {
    setIsOnline(OfflineManager.isOnline());
    setQueueCount(OfflineManager.getQueue().length);

    const unsubscribe = OfflineManager.subscribe((online, syncing) => {
      setIsOnline(online);
      setIsSyncing(syncing);
      const remaining = OfflineManager.getQueue().length;
      setQueueCount(remaining);

      if (!syncing && remaining === 0 && online) {
        setShowSyncedSuccess(true);
        setTimeout(() => setShowSyncedSuccess(false), 3000);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleManualSync = () => {
    OfflineManager.processQueue();
  };

  if (isOnline && queueCount === 0 && !showSyncedSuccess && !isSyncing) {
    return (
      <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Online</span>
      </div>
    );
  }

  if (showSyncedSuccess) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-emerald-800 bg-emerald-100 border border-emerald-300">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Synced ✓</span>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-sky-800 bg-sky-50 border border-sky-200">
        <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
        <span>Syncing ({queueCount})...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-amber-800 bg-amber-50 border border-amber-300">
        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
        <span>Offline ({queueCount} draft{queueCount === 1 ? '' : 's'})</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleManualSync}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-amber-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 transition-colors"
      title="Click to sync pending data"
    >
      <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
      <span>{queueCount} to sync</span>
    </button>
  );
};
