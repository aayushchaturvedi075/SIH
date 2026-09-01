import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "critical" | "high" | "medium" | "low" | "success" | "neutral" | "saffron" | "navy";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className,
}: BadgeProps) {
  const variantStyles = {
    critical: "bg-error-container text-on-error-container border-error/20 font-bold",
    high: "bg-red-100 text-red-800 border-red-300 font-semibold",
    medium: "bg-warning-container text-on-warning-container border-amber-300 font-medium",
    low: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-success-container text-on-success-container border-emerald-300 font-medium",
    neutral: "bg-surface-container-high text-on-surface-variant border-outline-variant",
    saffron: "bg-amber-100 text-amber-900 border-amber-400 font-bold",
    navy: "bg-primary-container text-primary-fixed border-secondary font-medium",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] leading-4 tracking-wider",
    md: "px-2.5 py-1 text-xs leading-4",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border uppercase font-label-caps transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
