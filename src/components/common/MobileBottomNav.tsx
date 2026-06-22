"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { 
  Home, 
  Compass, 
  Heart, 
  ShoppingBag, 
  User, 
  Settings 
} from "lucide-react";

// Custom SVG background with a smooth dip in the center (for width 100%, height 76px)
const NavBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 filter drop-shadow-[0_-10px_25px_rgba(0,0,0,0.06)]">
      <svg
        width="100%"
        height="76"
        viewBox="0 0 100 76"
        preserveAspectRatio="none"
        className="fill-white stroke-[#C5A059]/15"
      >
        <path
          d="M 0 20 
             Q 0 10 10 10
             L 34 10
             Q 40 10 42 16
             A 11 11 0 0 0 58 16
             Q 60 10 66 10
             L 90 10
             Q 100 10 100 20
             L 100 76
             L 0 76
             Z"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Zustand Store values
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const user = useStore((state) => state.user);

  // Quantities for Badges
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const leftNavItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
      animate: {
        active: { scale: 1.12, y: -2 },
        inactive: { scale: 1, y: 0 }
      }
    },
    {
      label: "Shop",
      href: "/collection",
      icon: Compass,
      isActive: pathname?.startsWith("/collection"),
      animate: {
        active: { scale: 1.12, rotate: 45, y: -2 },
        inactive: { scale: 1, rotate: 0, y: 0 }
      }
    },
  ];

  const rightNavItems = [
    {
      label: "Fav",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistCount,
      isActive: pathname === "/wishlist",
      animate: {
        active: { scale: [1, 1.25, 1.12], y: -2, transition: { duration: 0.4 } },
        inactive: { scale: 1, y: 0 }
      }
    },
    {
      label: "Profile",
      href: "/login",
      icon: User,
      isActive: pathname === "/login",
      avatarLabel: user?.isLoggedIn ? user.name.charAt(0).toUpperCase() : null,
      animate: {
        active: { scale: 1.12, y: -2 },
        inactive: { scale: 1, y: 0 }
      }
    },
    {
      label: "Setting",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
      animate: {
        active: { scale: 1.12, rotate: 90, y: -2 },
        inactive: { scale: 1, rotate: 0, y: 0 }
      }
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] h-[76px] px-2 pb-[safe-area-inset-bottom] overflow-visible">
      {/* Curved SVG Background */}
      <NavBackground />

      <div className="relative w-full h-full flex items-center justify-between px-3 overflow-visible">
        
        {/* Left Nav Group */}
        <div className="w-[38%] flex justify-around items-center">
          {leftNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 relative rounded-2xl transition-colors duration-300 ${
                  item.isActive ? "text-[#FF6A00]" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {/* Smooth Sliding Pill Background */}
                {item.isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#FF6A00]/5 to-[#C5A059]/10 -z-10 border border-[#C5A059]/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={item.isActive ? "active" : "inactive"}
                  variants={item.animate}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon size={19} strokeWidth={item.isActive ? 2.25 : 1.75} />
                </motion.div>
                <span 
                  className="text-[9px] font-semibold mt-1 tracking-wider uppercase" 
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Center Floating Cart Button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5.5 z-20 overflow-visible text-center">
          <Link href="/cart" className="relative block">
            <motion.div
              className={`w-14 h-14 rounded-full bg-[#FF6A00] border-[5px] border-[#F8F5F0] flex items-center justify-center text-white shadow-lg shadow-[#FF6A00]/25`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              animate={{
                boxShadow: pathname === "/cart" 
                  ? "0 10px 25px rgba(255,106,0,0.4)" 
                  : ["0 4px 12px rgba(255,106,0,0.2)", "0 8px 20px rgba(255,106,0,0.35)", "0 4px 12px rgba(255,106,0,0.2)"]
              }}
              transition={{
                boxShadow: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }
              }}
            >
              <ShoppingBag size={20} strokeWidth={2.25} />
              
              {/* Cart Count Badge */}
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1 bg-[#C5A059] text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 border border-[#FF6A00] shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.div>
          </Link>
          <span 
            className="block text-[9px] font-bold tracking-wider uppercase text-[#FF6A00] mt-1"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Cart
          </span>
        </div>

        {/* Right Nav Group */}
        <div className="w-[42%] flex justify-around items-center">
          {rightNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 relative rounded-2xl transition-colors duration-300 ${
                  item.isActive ? "text-[#FF6A00]" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {/* Smooth Sliding Pill Background */}
                {item.isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#FF6A00]/5 to-[#C5A059]/10 -z-10 border border-[#C5A059]/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={item.isActive ? "active" : "inactive"}
                  variants={item.animate}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative"
                >
                  {item.avatarLabel ? (
                    // Show user initial avatar if logged in
                    <div className="w-5 h-5 rounded-full bg-[#FF6A00]/10 text-[#FF6A00] text-[10px] font-bold flex items-center justify-center border border-[#FF6A00]/20">
                      {item.avatarLabel}
                    </div>
                  ) : (
                    <Icon size={19} strokeWidth={item.isActive ? 2.25 : 1.75} />
                  )}
                  
                  {/* Item Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-white text-[8px] font-bold rounded-full h-3.5 min-w-[14px] flex items-center justify-center px-0.5 border border-white">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
                <span 
                  className="text-[9px] font-semibold mt-1 tracking-wider uppercase" 
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
