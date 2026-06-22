"use client";

import React, { useState, useEffect } from "react";
import { Bell, Wifi, WifiOff, HardDrive, Trash2, Smartphone, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { usePWA } from "./PWASyncProvider";
import { usePushNotifications } from "@/hooks/pwa/usePushNotifications";
import { usePWAInstall } from "@/hooks/pwa/usePWAInstall";
import { cacheManager } from "@/lib/pwa/cacheManager";

export default function PWADashboard() {
  const { isOnline, setShowInstallModal } = usePWA();
  const { permission, requestPermission, sendMockNotification } = usePushNotifications();
  const { isStandalone, isInstallable } = usePWAInstall();

  // Storage states
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [swStatus, setSwStatus] = useState<string>("Checking...");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Update storage usage and service worker status
  const updatePWAStats = async () => {
    const size = await cacheManager.getCacheSize();
    setCacheSize(size);

    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        if (reg.active) {
          setSwStatus(`Active (${reg.active.state})`);
        } else if (reg.installing) {
          setSwStatus("Installing...");
        } else if (reg.waiting) {
          setSwStatus("Waiting/Ready...");
        }
      } else {
        setSwStatus("Not registered");
      }
    } else {
      setSwStatus("Unsupported browser");
    }
  };

  useEffect(() => {
    updatePWAStats();
  }, [isOnline]);

  const handleClearCache = async () => {
    const cleared = await cacheManager.clearPWACache();
    if (cleared) {
      showToast("App cache cleared successfully!");
      updatePWAStats();
    }
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleRequestPermission = async () => {
    const res = await requestPermission();
    if (res === "granted") {
      showToast("Notification permission granted!");
    } else {
      showToast("Notification permission denied/blocked.");
    }
  };

  const triggerOrderUpdate = () => {
    sendMockNotification({
      title: "📦 Order Dispatched! - DOD Shop",
      body: "Good news! Your 'Royal Katan Silk Banarasi Saree' has been handpicked, packed, and handed over to our courier partner. Track delivery details.",
      url: "/cart",
      tag: "order-dispatch"
    });
    showToast("Order dispatch notification triggered!");
  };

  const triggerAbandonedCart = () => {
    sendMockNotification({
      title: "🛒 Items waiting in your bag!",
      body: "You left premium Chanderi Silk Saree items in your cart. Complete checkout now to secure our limited artisan stocks.",
      url: "/cart",
      tag: "abandoned-cart"
    });
    showToast("Abandoned cart notification triggered!");
  };

  const triggerDiscountOffer = () => {
    sendMockNotification({
      title: "✨ Festive Saree Sale - 30% OFF",
      body: "Enjoy exclusive weaver discounts! Get 30% off on all handloom Dupattas and Kurtis today. Use code WEAVER30.",
      url: "/collection?category=Saree",
      tag: "offer-alert"
    });
    showToast("Festive sale notification triggered!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Editorial Header */}
      <div className="text-center mb-10">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-[#6F8F7A] uppercase">PWA Center</span>
        <h1 className="text-3xl md:text-4xl font-light tracking-wider uppercase mt-2 text-zinc-900" style={{ fontFamily: "var(--font-marcellus)" }}>
          Application Dashboard
        </h1>
        <div className="w-12 h-[1px] bg-[#6F8F7A] mx-auto mt-4 opacity-50"></div>
        <p className="text-zinc-500 text-xs md:text-sm max-w-lg mx-auto mt-4 leading-relaxed">
          Monitor your app installation state, verify connection caches, and simulate native push notification events below.
        </p>
      </div>

      {/* Success alert */}
      {successMsg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-500/20 text-emerald-800 rounded-xl text-center text-xs tracking-wider font-semibold animate-pulse">
          {successMsg}
        </div>
      )}

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection & Storage Panel */}
        <div className="p-6 rounded-2xl bg-[#F3EFEA] border border-[#6F8F7A]/10 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6 text-zinc-800 border-b border-[#6F8F7A]/10 pb-4">
            <HardDrive size={18} className="text-[#6F8F7A]" />
            <h3 className="font-semibold tracking-wide text-sm uppercase" style={{ fontFamily: "var(--font-poppins)" }}>
              App Diagnostics
            </h3>
          </div>

          <div className="space-y-5 text-xs text-zinc-600">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span>Network Connection:</span>
              <div className="flex items-center gap-1.5 font-semibold">
                {isOnline ? (
                  <>
                    <Wifi size={14} className="text-[#6F8F7A]" />
                    <span className="text-[#6F8F7A]">ONLINE</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="text-rose-500" />
                    <span className="text-rose-500">OFFLINE</span>
                  </>
                )}
              </div>
            </div>

            {/* Service Worker Status */}
            <div className="flex items-center justify-between">
              <span>Service Worker Status:</span>
              <span className="font-mono text-[11px] bg-white/70 px-2 py-0.5 rounded border border-zinc-200">
                {swStatus}
              </span>
            </div>

            {/* Offline Cache Storage */}
            <div className="flex items-center justify-between">
              <span>Local Offline Caches:</span>
              <span className="font-semibold text-zinc-800">{cacheSize} MB</span>
            </div>

            {/* Installation State */}
            <div className="flex items-center justify-between">
              <span>Installation Mode:</span>
              <div className="flex items-center gap-1 font-semibold text-zinc-800">
                {isStandalone ? (
                  <>
                    <ShieldCheck size={14} className="text-[#6F8F7A]" /> Installed (Standalone)
                  </>
                ) : (
                  <>
                    <Smartphone size={14} className="text-orange-500" /> Browser Window (Web)
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50/50 text-rose-600 font-semibold transition-all duration-300"
              >
                <Trash2 size={13} /> Clear Offline Cache
              </button>

              {!isStandalone && (
                <button
                  onClick={() => setShowInstallModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#6F8F7A] text-white hover:bg-[#5E7A68] font-semibold transition-all duration-300"
                >
                  <Smartphone size={13} /> Install Saree App
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Simulator Panel */}
        <div className="p-6 rounded-2xl bg-[#F3EFEA] border border-[#6F8F7A]/10 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6 text-zinc-800 border-b border-[#6F8F7A]/10 pb-4">
            <Bell size={18} className="text-[#6F8F7A]" />
            <h3 className="font-semibold tracking-wide text-sm uppercase" style={{ fontFamily: "var(--font-poppins)" }}>
              Push Notification Simulator
            </h3>
          </div>

          {permission !== "granted" ? (
            <div className="p-4 bg-white/60 border border-amber-500/10 rounded-xl mb-6">
              <div className="flex gap-2.5 text-amber-700 mb-3">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold">Permissions Required</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                    You must authorize system notifications to test push updates and delivery alerts on your desktop or mobile OS.
                  </p>
                </div>
              </div>
              <button
                onClick={handleRequestPermission}
                className="w-full py-2 bg-zinc-950 text-white rounded-lg font-semibold text-xs tracking-wider uppercase hover:bg-[#6F8F7A] transition-all"
              >
                Enable Notifications
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-500/20 text-emerald-800 rounded-xl text-xs font-semibold mb-6">
              <Check size={14} /> System Notifications Activated
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={triggerOrderUpdate}
              disabled={permission !== "granted"}
              className="w-full text-left p-3.5 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-[#6F8F7A]/40 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <h4 className="text-xs font-semibold text-zinc-800">1. Order Dispatch Alert</h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">Dispatches a shipping update for a premium mulberry silk saree order.</p>
            </button>

            <button
              onClick={triggerAbandonedCart}
              disabled={permission !== "granted"}
              className="w-full text-left p-3.5 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-[#6F8F7A]/40 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <h4 className="text-xs font-semibold text-zinc-800">2. Abandoned Cart Reminder</h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">Alerts user that their saved shopping bag items are waiting.</p>
            </button>

            <button
              onClick={triggerDiscountOffer}
              disabled={permission !== "granted"}
              className="w-full text-left p-3.5 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-[#6F8F7A]/40 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <h4 className="text-xs font-semibold text-zinc-800">3. Saree Festival Discount</h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">Broadcasts an exclusive 30% off discount code alert.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
