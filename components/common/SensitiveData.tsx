"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { cn, maskData } from "@/lib/utils";

interface SensitiveDataProps {
  value: string;
  type?: "aadhaar" | "phone" | "account" | "ip";
  label?: string;
  showCopy?: boolean;
  className?: string;
}

export function SensitiveData({
  value,
  type = "account",
  label,
  showCopy = true,
  className,
}: SensitiveDataProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayVal = revealed ? value : maskData(value, type);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 font-mono text-xs", className)}>
      {label && <span className="text-on-surface-variant font-sans text-[11px]">{label}:</span>}
      <span className="bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant text-on-surface select-all tracking-wider font-semibold">
        {displayVal}
      </span>
      <button
        type="button"
        onClick={() => setRevealed(!revealed)}
        className="p-1 text-on-surface-variant hover:text-primary transition-colors"
        title={revealed ? "Mask sensitive data" : "Reveal sensitive data"}
      >
        {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 text-on-surface-variant hover:text-primary transition-colors"
          title="Copy exact value"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}
