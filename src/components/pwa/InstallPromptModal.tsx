"use client";

import React from "react";
import { X, Sparkles, Smartphone, Download, Share } from "lucide-react";
import { usePWAInstall } from "@/hooks/pwa/usePWAInstall";
import { motion, AnimatePresence } from "framer-motion";

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallPromptModal({ isOpen, onClose }: InstallPromptModalProps) {
  const { isInstallable, isIOS, installApp } = usePWAInstall();

  const handleInstallClick = async () => {
    const installed = await installApp();
    if (installed) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#F3EFEA] text-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-[#6F8F7A]/20"
          >
            {/* Header image / branding block */}
            <div className="h-32 bg-[#6F8F7A] relative flex items-center justify-center">
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-light tracking-widest text-white uppercase" style={{ fontFamily: "var(--font-marcellus)" }}>
                  Designs of Dreams
                </h3>
                <p className="text-xs text-white/80 tracking-wider mt-1 uppercase">DOD Handloom Boutique</p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6">
              <div className="flex justify-center -mt-12 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-[#6F8F7A]/10 p-2 overflow-hidden">
                  <img src="/icons/icon-192x192.png" alt="DOD Logo" className="w-full h-full object-cover rounded-xl" />
                </div>
              </div>

              <h4 className="text-lg font-semibold text-center mb-2 tracking-wide" style={{ fontFamily: "var(--font-poppins)" }}>
                Install DOD Shop App
              </h4>
              <p className="text-xs text-zinc-500 text-center mb-6 max-w-xs mx-auto leading-relaxed">
                Add Designs of Dreams to your home screen for full-screen boutique shopping, push order updates, and offline collections browsing.
              </p>

              {/* Install Benefits */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#6F8F7A]/10 text-[#6F8F7A] mt-0.5">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold tracking-wide">Premium Performance</h5>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Zero load lag, instant checkout, and app-like transition animations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-[#6F8F7A]/10 text-[#6F8F7A] mt-0.5">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold tracking-wide">Offline Saree Catalog</h5>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Browse your favorite designs, access cart, and manage wishlist without network connection.</p>
                  </div>
                </div>
              </div>

              {/* Platform specific action */}
              {isIOS ? (
                // iOS installation steps
                <div className="p-4 bg-white/60 rounded-xl border border-[#6F8F7A]/10">
                  <p className="text-xs font-medium text-zinc-800 mb-3 flex items-center gap-1.5 justify-center">
                    <Share size={14} className="text-[#6F8F7A]" /> iOS Installation Guide
                  </p>
                  <ol className="text-[11px] text-zinc-600 space-y-2 list-decimal list-inside leading-relaxed pl-1">
                    <li>Open the share menu in Safari by tapping the <strong>Share</strong> button.</li>
                    <li>Scroll down and tap <strong>'Add to Home Screen'</strong> option.</li>
                    <li>Confirm the brand name and tap <strong>'Add'</strong> in the top right.</li>
                  </ol>
                </div>
              ) : isInstallable ? (
                // Android / Chrome / Desktop native prompt
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 bg-[#6F8F7A] hover:bg-[#5E7A68] text-white rounded-xl font-medium text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-[#6F8F7A]/25 flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Install Now
                </button>
              ) : (
                // Non-installable (e.g. already installed or direct browser unsupported)
                <div className="text-center p-3 bg-zinc-100 rounded-xl">
                  <p className="text-[11px] text-zinc-500">
                    To install: Use options in your browser's menu (e.g. <strong>'Add to Home Screen'</strong> or <strong>'Install App'</strong>).
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
