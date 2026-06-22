"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Languages,
  BookOpen,
  Mail,
  X,
  Clock,
  Send,
  CheckCircle,
  Sparkles,
  MapPin,
  Phone,
  Compass,
  Heart
} from "lucide-react";

export default function SettingsPage() {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  // Modal States
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Saree",
    message: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contactSubmitted, setContactSubmitted] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!contactForm.name.trim()) {
      newErrors.name = "Full Name is required";
    }
    if (!contactForm.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!contactForm.phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\+?[\d\s-]{10,15}$/.test(contactForm.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (10+ digits)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          interest: "Saree",
          message: ""
        });
        setErrors({});
        setIsContactOpen(false);
        showFeedback("Styling session request submitted successfully!");
      }, 3000);
    }
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
        <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-[#C5A059]/20">
          <Settings size={28} className="text-[#FF6A00]" />
          <div>
            <h1 className="text-2xl font-light tracking-widest uppercase text-zinc-900" style={{ fontFamily: "var(--font-marcellus)" }}>
              Atelier More
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-wider uppercase mt-1">Explore our boutique heritage & configuration</p>
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

        {/* Interactive Information Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* About Us Card */}
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="flex flex-col items-center justify-center p-6 bg-white border border-[#C5A059]/20 rounded-2xl shadow-sm hover:border-[#FF6A00] transition-all duration-300 group text-center cursor-pointer relative overflow-hidden focus:outline-none"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-12 h-12 rounded-full bg-[#FF6A00]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
              <BookOpen className="text-[#FF6A00]" size={22} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-800 relative z-10" style={{ fontFamily: "var(--font-poppins)" }}>About Us</span>
            <span className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest relative z-10">Our Heritage Story</span>
          </button>

          {/* Contact Us Card */}
          <button 
            onClick={() => setIsContactOpen(true)}
            className="flex flex-col items-center justify-center p-6 bg-white border border-[#C5A059]/20 rounded-2xl shadow-sm hover:border-[#FF6A00] transition-all duration-300 group text-center cursor-pointer relative overflow-hidden focus:outline-none"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
              <Mail className="text-[#C5A059]" size={22} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-800 relative z-10" style={{ fontFamily: "var(--font-poppins)" }}>Contact Us</span>
            <span className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest relative z-10">Atelier Inquiries</span>
          </button>
        </div>

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
                  className="px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer focus:outline-none"
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
                    className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer focus:outline-none"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* About Us Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-xl bg-white border border-[#C5A059]/30 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col"
            >
              {/* Gold Header accent */}
              <div className="h-1.5 bg-gradient-to-r from-[#C5A059] via-[#FF6A00] to-[#C5A059]" />
              
              {/* Close Button */}
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors z-20 cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[#C5A059]">
                    <Sparkles size={10} /> Our Heritage
                  </span>
                  <h2 className="text-2xl font-light tracking-widest uppercase mt-1 text-zinc-900" style={{ fontFamily: "var(--font-marcellus)" }}>
                    Designs of <span className="text-[#FF6A00]">Dreams</span>
                  </h2>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80" 
                    alt="Heritage Handloom Weaving"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-semibold text-white tracking-widest uppercase">Atelier Peeli Kothi</span>
                </div>

                <div className="space-y-3 text-zinc-600 text-xs leading-relaxed font-light">
                  <p>
                    Born in the historic silk weaving district of Varanasi, Designs of Dreams (DOD) represents an unbroken link to India's textile history. We believe that a saree is not just attire, but a canvas of culture, woven one thread at a time by hands that have inherited the craft over generations.
                  </p>
                  <p>
                    Our journey began in 1994 with a simple mission: to rescue traditional handloom motifs from the threat of mass-produced powerlooms. By collaborating directly with weavers at our Peeli Kothi atelier, we ensure that every design preserves its authentic weight, texture, and soul.
                  </p>
                </div>

                {/* Craftsmanship Pillars */}
                <div className="pt-4 border-t border-zinc-100 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059]">Craftsmanship Pillars</h3>
                  <div className="grid gap-3">
                    <div className="flex gap-3 items-start text-left">
                      <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center flex-shrink-0">
                        <Compass size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-800">Heritage Preservation</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Direct collaboration with Banaras's master weavers to sustain ancient handloom skills.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-start text-left">
                      <div className="w-8 h-8 rounded-lg bg-[#FF6A00]/10 text-[#FF6A00] flex items-center justify-center flex-shrink-0">
                        <Heart size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-800">Artisanal Integrity</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Every Chikankari shadow stitch and Zardozi knot is done completely by hand.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start text-left">
                      <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center flex-shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-800">Authentic Materials</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">Only pure mulberry silks, certified cottons, and genuine metallic threads are used.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Us Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!contactSubmitted) setIsContactOpen(false);
              }}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-xl bg-white border border-[#C5A059]/30 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col"
            >
              {/* Gold Header accent */}
              <div className="h-1.5 bg-gradient-to-r from-[#C5A059] via-[#FF6A00] to-[#C5A059]" />
              
              {/* Close Button */}
              <button 
                onClick={() => setIsContactOpen(false)}
                disabled={contactSubmitted}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors z-20 cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[#FF6A00]">
                    <Sparkles size={10} /> Atelier Experience
                  </span>
                  <h2 className="text-2xl font-light tracking-widest uppercase mt-1 text-zinc-900" style={{ fontFamily: "var(--font-marcellus)" }}>
                    Contact <span className="text-[#C5A059]">Atelier</span>
                  </h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide mt-1">Book a styling consultation or make an inquiry</p>
                </div>

                {/* Info Cards Row */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                      <MapPin size={14} />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider">Our Address</h4>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal">
                      K-46/2, Near Peeli Kothi Crossing, Varanasi, UP, India
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-2 text-[#FF6A00] mb-1">
                      <Phone size={14} />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider">Private Line</h4>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal">
                      <a href="tel:+919876543210" className="hover:text-[#FF6A00] transition-colors">+91 98765 43210</a>
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-2 text-[#C5A059] mb-1">
                      <Mail size={14} />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider">Email Inquiry</h4>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal truncate">
                      <a href="mailto:appointments@sareestyle.com" className="hover:text-[#C5A059] transition-colors">appointments@sareestyle.com</a>
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-2 text-[#FF6A00] mb-1">
                      <Clock size={14} />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider">Hours</h4>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal">
                      Mon – Sat: 11 AM – 8 PM
                    </p>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="border-t border-zinc-100 pt-4 text-left">
                  {contactSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle size={28} />
                      </div>
                      <h3 className="text-sm font-semibold text-emerald-800">Appointment Request Submitted</h3>
                      <p className="text-xs text-emerald-600 font-light leading-relaxed">
                        Thank you for requesting a styling session. Our atelier concierge will contact you within 24 hours to confirm your experience.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-2">Request Styling Session</h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Name */}
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-500 uppercase mb-1">Full Name *</label>
                          <input 
                            type="text" 
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className={`w-full bg-zinc-50 border ${errors.name ? "border-rose-400 focus:border-rose-400" : "border-zinc-200 focus:border-[#FF6A00]"} rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors`}
                            placeholder="e.g. Priyanjali Sen"
                          />
                          {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-500 uppercase mb-1">Email Address *</label>
                          <input 
                            type="email" 
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className={`w-full bg-zinc-50 border ${errors.email ? "border-rose-400 focus:border-rose-400" : "border-zinc-200 focus:border-[#FF6A00]"} rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors`}
                            placeholder="e.g. name@domain.com"
                          />
                          {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Phone */}
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-500 uppercase mb-1">Phone Number *</label>
                          <input 
                            type="tel" 
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className={`w-full bg-zinc-50 border ${errors.phone ? "border-rose-400 focus:border-rose-400" : "border-zinc-200 focus:border-[#FF6A00]"} rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors`}
                            placeholder="e.g. +91 98765 43210"
                          />
                          {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Design Interest */}
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-500 uppercase mb-1">Design Interest</label>
                          <select 
                            value={contactForm.interest}
                            onChange={(e) => setContactForm({ ...contactForm, interest: e.target.value })}
                            className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#FF6A00] rounded-xl px-2.5 py-2 text-xs focus:outline-none transition-colors cursor-pointer"
                          >
                            <option value="Saree">Saree Collection</option>
                            <option value="Kurti">Chikankari Kurti</option>
                            <option value="Lehenga">Custom Lehenga</option>
                            <option value="Blouse">Artisanal Blouse</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-500 uppercase mb-1">Measurements & Special Requests</label>
                        <textarea 
                          rows={3}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#FF6A00] rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors resize-none"
                          placeholder="Provide any custom styling requests..."
                        />
                      </div>

                      {/* Submit */}
                      <button 
                        type="submit"
                        className="w-full bg-[#FF6A00] text-white py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#e05d00] transition-colors cursor-pointer"
                      >
                        Request Styling Session <Send size={12} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

