"use client";

import React, { Suspense } from "react";
import CollectionCatalog from "@/app/collection/CollectionCatalog";

export default function CollectionPage() {
  return (
    <main className="relative pt-[100px] bg-white min-h-screen">
      {/* Decorative Jali Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3C/svg%3E\")" }} 
      />

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CollectionCatalog />
      </Suspense>
    </main>
  );
}
