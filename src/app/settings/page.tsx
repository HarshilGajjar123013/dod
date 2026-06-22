"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Globe, 
  Coins, 
  Palette, 
  Trash2, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Languages
} from "lucide-react";

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const clearCart = useStore((state) => state.clearCart);

  // Component States
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("EN");
  const [theme, setTheme] = useState("light");
  const [cacheSize, setCacheSize] = useState("0.00 MB");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Estimate cache size on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "navigator" in window && "storage" in navigator && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const usage = estimate.usage || 0;
        const mb = (usage / (1024 * 1024)).toFixed(2);
        setCacheSize(`${mb} MB`);
      });
    }
  }, []);

  const handleClearCache = async () => {
    if (typeof window !== "undefined" && "caches" in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        setCacheSize("0.00 MB");
        showFeedback("Local application cache cleared successfully!");
      } catch (err) {
        showFeedback("Failed to clear local cache.");
      }
    } else {
      showFeedback("Browser caching not supported.");
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <main className="relative pt-[120px] pb-24 bg-[#F8F5F0] min-h-screen text-zinc-900">
      {/* Gold Jali Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23C5A059' stroke-width='1'/%3E%3C/svg%3E\")" }} 
      />

      <div className="w-full max-w-2xl mx-auto px-4 relative z-10">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C5A059] hover:text-[#FF6A00] transition-colors mb-6">
          <ArrowLeft size={14} /> Back to Boutique
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-10 pb-4 border-b border-[#C5A059]/20">
          <Settings size={28} className="text-[#FF6A00]" />
          <div>
            <h1 className="text-2xl font-light tracking-widest uppercase text-zinc-900" style={{ fontFamily: "var(--font-marcellus)" }}>
              Atelier Settings
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-wider uppercase mt-1">Configure your boutique shopping experience</p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-emerald-50 border border-emerald-500/20 text-emerald-800 rounded-xl text-center text-xs tracking-wider font-semibold"
          >
            {feedbackMsg}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Section 1: Shop Preferences */}
          <div className="p-6 rounded-2xl bg-white border border-[#C5A059]/10 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
              Shop Preferences
            </h3>
            
            <div className="space-y-4">
              {/* Currency */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Coins size={18} className="text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium">Boutique Currency</p>
                    <p className="text-[11px] text-zinc-500">Select currency for pricing display</p>
                  </div>
                </div>
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Languages size={18} className="text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium">Language</p>
                    <p className="text-[11px] text-zinc-500">Configure language options</p>
                  </div>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="EN">English</option>
                  <option value="HI">Hindi (हिंदी)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Alerts & Display */}
          <div className="p-6 rounded-2xl bg-white border border-[#C5A059]/10 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
              Notifications & Display
            </h3>

            <div className="space-y-4">
              {/* Push Alerts */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium">Push Notification Alerts</p>
                    <p className="text-[11px] text-zinc-500">Receive order dispatch & discount alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications} 
                    onChange={() => setNotifications(!notifications)} 
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:height-4 after:w-4 after:transition-all peer-checked:bg-[#FF6A00]"></div>
                </label>
              </div>

              {/* Theme Settings */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Palette size={18} className="text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium">Visual Theme</p>
                    <p className="text-[11px] text-zinc-500">Switch application appearance mode</p>
                  </div>
                </div>
                <select 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#FF6A00]"
                >
                  <option value="light">Atelier Light</option>
                  <option value="dark">Atelier Dark</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Storage & Cache */}
          <div className="p-6 rounded-2xl bg-white border border-[#C5A059]/10 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
              Storage & Diagnostics
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Trash2 size={18} className="text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium">Offline Cache Storage</p>
                    <p className="text-[11px] text-zinc-500">Current browser storage occupied: <strong>{cacheSize}</strong></p>
                  </div>
                </div>
                <button 
                  onClick={handleClearCache}
                  className="px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold transition-all duration-300"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Account Session */}
          {user?.isLoggedIn && (
            <div className="p-6 rounded-2xl bg-white border border-[#C5A059]/10 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
                Atelier Account
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF6A00]/10 text-[#FF6A00] font-semibold text-sm rounded-xl flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-[11px] text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); showFeedback("Logged out successfully."); }}
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-semibold transition-all duration-300"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
