import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral" | "urgent";
  accentColor?: "navy" | "saffron" | "red" | "blue" | "emerald";
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  accentColor = "navy",
  icon,
  actionText,
  onAction,
  className,
}: StatCardProps) {
  const accentBorderColors = {
    navy: "border-t-[#002147]",
    saffron: "border-t-[#ff9933]",
    red: "border-t-[#ba1a1a]",
    blue: "border-t-[#3a5f94]",
    emerald: "border-t-[#15803d]",
  };

  const changeColors = {
    positive: "text-emerald-700 bg-emerald-50 border border-emerald-200",
    negative: "text-red-700 bg-red-50 border border-red-200",
    neutral: "text-on-surface-variant bg-surface-container-low",
    urgent: "text-red-800 bg-red-100 font-bold border border-red-300 animate-pulse",
  };

  return (
    <div
      className={cn(
        "bg-surface-container-lowest border border-outline-variant rounded-sm p-4 shadow-sm relative overflow-hidden border-t-[3px]",
        accentBorderColors[accentColor],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
            {title}
          </p>
          <h3 className="font-display-lg text-2xl lg:text-3xl font-bold text-primary mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="p-2 bg-surface-container-low rounded-sm text-primary-container shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-surface-container">
          {change && (
            <span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono",
                changeColors[changeType]
              )}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-on-surface-variant truncate">
              {subtitle}
            </span>
          )}
          {actionText && (
            <button
              onClick={onAction}
              className="text-xs text-secondary hover:text-primary-container font-semibold ml-auto underline"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
