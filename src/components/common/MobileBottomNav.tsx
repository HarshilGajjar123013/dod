"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Compass, 
  Heart, 
  ShoppingBag, 
  User, 
  MoreHorizontal,
  X,
  Clock,
  Send,
  CheckCircle,
  Sparkles,
  MapPin,
  Phone,
  BookOpen,
  Mail,
  ShieldCheck
} from "lucide-react";

// Path generator that creates a smooth circular dip centered on the active tab's column position
const getPath = (index: number) => {
  const step = 100 / 6;
  const x = (index + 0.5) * step;
  
  // Custom dip transition coordinates (clamped to remain within 0-100 bounds)
  const x1 = x - 8.5;
  const x2 = x - 4.5;
  const x3 = x + 4.5;
  const x4 = x + 8.5;
  
  return `M 0 20 
          Q 0 10 10 10
          L ${Math.max(0, x1)} 10
          Q ${x2} 10 ${x - 3.5} 15.5
          A 6.5 6.5 0 0 0 ${x + 3.5} 15.5
          Q ${x3} 10 ${Math.min(100, x4)} 10
          L 90 10
          Q 100 10 100 20
          L 100 76
          L 0 76
          Z`;
};

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Popover and Modal States
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
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
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close popup menu on page changes
  useEffect(() => {
    setIsMoreMenuOpen(false);
  }, [pathname]);

  // Zustand Store values
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const user = useStore((state) => state.user);

  // Quantities for Badges (only access on client after mounting)
  const cartCount = mounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.length : 0;

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

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Shop",
      href: "/collection",
      icon: Compass,
    },
    {
      label: "Fav",
      href: "/wishlist",
      badge: wishlistCount,
      icon: Heart,
    },
    {
      label: "Cart",
      href: "/cart",
      badge: cartCount,
      icon: ShoppingBag,
    },
    {
      label: "Profile",
      href: "/login",
      icon: User,
      avatarLabel: (mounted && user?.isLoggedIn) ? user.name.charAt(0).toUpperCase() : null,
    },
    {
      label: "More",
      href: "#",
      icon: MoreHorizontal,
    },
  ];

  // Helper to resolve active index
  const getActiveIndex = () => {
    if (isMoreMenuOpen) return 5;
    if (pathname === "/") return 0;
    if (pathname?.startsWith("/collection") || pathname?.startsWith("/product")) return 1;
    if (pathname === "/wishlist") return 2;
    if (pathname === "/cart") return 3;
    if (pathname === "/login") return 4;
    return 0;
  };

  const activeIndex = getActiveIndex();
  const activeItem = navItems[activeIndex];
  const ActiveIcon = activeItem.icon;

  return (
    <>
      {/* Pop-up Cards Panel (About Us & Contact Us) above the bottom nav */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[9990] bg-black/40 backdrop-blur-[2px]"
            />
            
            {/* Side-by-side floating cards */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 30, scale: 0.9, x: "-50%" }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="md:hidden fixed bottom-[96px] left-1/2 w-[calc(100%-2rem)] max-w-sm grid grid-cols-2 gap-4 z-[9991] overflow-visible"
            >
              {/* About Us Card */}
              <button 
                onClick={() => {
                  setIsAboutOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-[#C5A059]/20 rounded-2xl shadow-xl hover:border-[#FF6A00] transition-all duration-300 group text-center cursor-pointer focus:outline-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 rounded-full bg-[#FF6A00]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <BookOpen className="text-[#FF6A00]" size={22} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800 relative z-10" style={{ fontFamily: "var(--font-poppins)" }}>About Us</span>
                <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-widest relative z-10">Our Heritage</span>
              </button>

              {/* Contact Us Card */}
              <button 
                onClick={() => {
                  setIsContactOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-[#C5A059]/20 rounded-2xl shadow-xl hover:border-[#FF6A00] transition-all duration-300 group text-center cursor-pointer focus:outline-none relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6A00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Mail className="text-[#C5A059]" size={22} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800 relative z-10" style={{ fontFamily: "var(--font-poppins)" }}>Contact Us</span>
                <span className="text-[9px] text-zinc-400 mt-1 uppercase tracking-widest relative z-10">Atelier Inquiries</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Modals */}
      
      {/* About Us Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
              className="relative w-full max-w-xl bg-white border border-[#C5A059]/30 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col text-zinc-900"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#C5A059] via-[#FF6A00] to-[#C5A059]" />
              
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors z-20 cursor-pointer"
              >
                <X size={18} />
              </button>

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

                <div className="space-y-3 text-zinc-600 text-xs leading-relaxed font-light text-left">
                  <p>
                    Born in the historic silk weaving district of Varanasi, Designs of Dreams (DOD) represents an unbroken link to India's textile history. We believe that a saree is not just attire, but a canvas of culture, woven one thread at a time by hands that have inherited the craft over generations.
                  </p>
                  <p>
                    Our journey began in 1994 with a simple mission: to rescue traditional handloom motifs from the threat of mass-produced powerlooms. By collaborating directly with weavers at our Peeli Kothi atelier, we ensure that every design preserves its authentic weight, texture, and soul.
                  </p>
                </div>

                {/* Pillars */}
                <div className="pt-4 border-t border-zinc-100 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A059] text-left">Craftsmanship Pillars</h3>
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
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
              className="relative w-full max-w-xl bg-white border border-[#C5A059]/30 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[80vh] flex flex-col text-zinc-900"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#C5A059] via-[#FF6A00] to-[#C5A059]" />
              
              <button 
                onClick={() => setIsContactOpen(false)}
                disabled={contactSubmitted}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors z-20 cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>

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

      {/* Global Success / Feedback Alerts */}
      <AnimatePresence>
        {feedbackMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[10000] p-3.5 bg-emerald-50 border border-emerald-500/20 text-emerald-800 rounded-xl text-center text-xs tracking-wider font-semibold shadow-lg"
          >
            {feedbackMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] h-[76px] px-2 pb-[safe-area-inset-bottom] overflow-visible">
        
        {/* Dynamic Path-Morphing Background */}
        <div className="absolute inset-0 -z-10 filter drop-shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
          <svg
            width="100%"
            height="76"
            viewBox="0 0 100 76"
            preserveAspectRatio="none"
            className="fill-white stroke-[#C5A059]/15"
          >
            <motion.path
              d={getPath(activeIndex)}
              animate={{ d: getPath(activeIndex) }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="relative w-full h-full flex items-center justify-between px-1 overflow-visible">
          
          {/* Floating Bubble containing Active Icon */}
          <motion.div
            className="absolute w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#FF6A00] shadow-[0_5px_15px_rgba(255,106,0,0.15)] z-20 border-[3px] border-white"
            style={{
              top: "0px",
              y: "-15px",
              x: "-50%",
            }}
            animate={{
              left: `${(activeIndex + 0.5) * (100 / 6)}%`
            }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            {/* Active icon crossfade inside floating bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 45, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {activeItem.avatarLabel ? (
                  <div className="w-6 h-6 rounded-full bg-[#FF6A00]/10 text-[#FF6A00] text-[11px] font-bold flex items-center justify-center">
                    {activeItem.avatarLabel}
                  </div>
                ) : (
                  <ActiveIcon size={20} strokeWidth={2.5} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Active Cart/Wishlist Badge on Floating Bubble */}
            {activeItem.badge !== undefined && activeItem.badge > 0 && (
              <motion.span 
                layoutId="activeBubbleBadge"
                className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[8px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 border border-white shadow-sm"
              >
                {activeItem.badge}
              </motion.span>
            )}
          </motion.div>

          {/* Navigation Tabs Row */}
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = idx === activeIndex;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.label === "More") {
                    e.preventDefault();
                    setIsMoreMenuOpen(!isMoreMenuOpen);
                  } else {
                    setIsMoreMenuOpen(false);
                  }
                }}
                className="flex-1 flex flex-col items-center justify-end h-full pb-3 z-10 overflow-visible"
              >
                {/* Icon Container with pop-down animation when inactive */}
                <div className="h-7 flex items-center justify-center overflow-visible relative">
                  <motion.div
                    animate={{
                      scale: isActive ? 0 : 1,
                      opacity: isActive ? 0 : 1,
                      y: isActive ? -10 : 0
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    {item.avatarLabel ? (
                      <div className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-bold flex items-center justify-center border border-zinc-200">
                        {item.avatarLabel}
                      </div>
                    ) : (
                      <Icon size={19} className="text-zinc-500 hover:text-zinc-800" strokeWidth={1.75} />
                    )}

                    {/* Badge for Inactive Tabs */}
                    {!isActive && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1 -right-2.5 bg-[#C5A059] text-white text-[8px] font-bold rounded-full h-3.5 min-w-[14px] flex items-center justify-center px-0.5 border border-white">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Label at the bottom */}
                <motion.span
                  className="text-[9px] font-semibold tracking-wider uppercase mt-1 transition-colors duration-300"
                  style={{ fontFamily: "var(--font-poppins)" }}
                  animate={{
                    color: isActive ? "#FF6A00" : "#71717a",
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? 0 : 2
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}

        </div>
      </div>
    </>
  );
}
