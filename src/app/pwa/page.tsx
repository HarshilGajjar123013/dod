"use client";

import React from "react";
import PWADashboard from "@/components/pwa/PWADashboard";

export default function PWADashboardPage() {
  return (
    <main className="relative pt-[120px] pb-24 bg-white min-h-screen">
      {/* Decorative Jali Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3C/svg%3E\")" }} 
      />
      <PWADashboard />
    </main>
  );
}
