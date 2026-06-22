"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";
import { usePWA } from "./PWASyncProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Reset dismissed state when going offline again
    if (!isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  if (isOnline || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-20 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[9999]"
      >
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl shadow-2xl backdrop-blur-xl border border-rose-500/20 bg-[#F3EFEA]/95 text-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <WifiOff size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide" style={{ fontFamily: "var(--font-poppins)" }}>
                Offline Mode Active
              </p>
              <p className="text-xs text-zinc-500 tracking-normal mt-0.5">
                Browsing cached collections. Cart & Wishlist will sync when online.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-zinc-200/50 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
