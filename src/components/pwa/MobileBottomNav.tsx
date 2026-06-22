"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, Heart, Smartphone } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Zustand Store
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);

  // Calculate quantities
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

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
      label: "Bag",
      href: "/cart",
      icon: ShoppingBag,
      badge: cartCount,
    },
    {
      label: "Saved",
      href: "/wishlist",
      icon: Heart,
      badge: wishlistCount,
    },
    {
      label: "PWA",
      href: "/pwa",
      icon: Smartphone,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9998] bg-[#F3EFEA]/90 backdrop-blur-xl border-t border-[#6F8F7A]/25 px-4 pt-2 pb-[calc(10px+env(safe-area-inset-bottom))] shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 relative min-w-[50px] transition-all duration-300 ${
                isActive ? "text-[#6F8F7A] scale-105" : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                
                {/* Dynamic Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#6F8F7A] text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 border border-[#F3EFEA]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span 
                className="text-[9px] font-medium mt-1 tracking-wider uppercase" 
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {item.label}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute top-0 w-8 h-[2px] bg-[#6F8F7A] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
