"use client";

import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in-50 duration-300 ease-out flex-1 flex flex-col min-w-0">
      {children}
    </div>
  );
}
