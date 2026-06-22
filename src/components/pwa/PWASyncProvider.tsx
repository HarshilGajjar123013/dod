"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/pwa/useNetworkStatus";
import { useStore } from "@/store/useStore";
import { cacheManager } from "@/lib/pwa/cacheManager";
import { usePushNotifications } from "@/hooks/pwa/usePushNotifications";
import OfflineIndicator from "@/components/pwa/OfflineIndicator";
import InstallPromptModal from "@/components/pwa/InstallPromptModal";

interface PWAContextType {
  isOnline: boolean;
  showInstallModal: boolean;
  setShowInstallModal: (show: boolean) => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function usePWA() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWA must be used within a PWASyncProvider");
  }
  return context;
}

export default function PWASyncProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useNetworkStatus();
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const { sendMockNotification } = usePushNotifications();

  const [showInstallModal, setShowInstallModal] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Precache cart and wishlist items whenever they change
  useEffect(() => {
    cart.forEach((item) => {
      cacheManager.precacheProduct(item.product);
    });
  }, [cart]);

  useEffect(() => {
    wishlist.forEach((product) => {
      cacheManager.precacheProduct(product);
    });
  }, [wishlist]);

  // Sync logic when coming back online
  useEffect(() => {
    if (isOnline) {
      if (wasOffline) {
        console.log("[PWA Sync] Internet connection restored. Triggering background synchronization...");
        
        // Trigger background sync via service worker if available
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          navigator.serviceWorker.ready.then((reg: any) => {
            reg.sync.register("sync-cart").catch((err: any) => console.error("SW sync-cart registration failed:", err));
            reg.sync.register("sync-wishlist").catch((err: any) => console.error("SW sync-wishlist registration failed:", err));
          });
        }

        // Show back online toast notification
        sendMockNotification({
          title: "Back Online!",
          body: "Your connection is restored. Syncing cart and wishlist...",
          url: "/cart",
          tag: "network-status"
        });

        setWasOffline(false);
      }
    } else {
      setWasOffline(true);
    }
  }, [isOnline, wasOffline, sendMockNotification]);

  return (
    <PWAContext.Provider value={{ isOnline, showInstallModal, setShowInstallModal }}>
      {children}
      <OfflineIndicator />
      <InstallPromptModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </PWAContext.Provider>
  );
}
