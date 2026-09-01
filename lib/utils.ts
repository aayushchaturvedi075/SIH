import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  }).format(d) + " IST";
}

export function maskData(data: string, type: "account" | "phone" | "aadhaar" | "ip" = "account"): string {
  if (!data) return "";
  const str = String(data).trim();
  if (type === "account") {
    if (str.length <= 4) return str;
    return "XXXX-XXXX-" + str.slice(-4);
  }
  if (type === "phone") {
    if (str.length <= 4) return str;
    return "+91 XXXXX " + str.slice(-5);
  }
  if (type === "aadhaar") {
    return "XXXX-XXXX-" + str.slice(-4);
  }
  if (type === "ip") {
    const parts = str.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`;
    return str;
  }
  return str;
}

export function formatTimeCountdown(minutes: number): string {
  if (minutes <= 0) return "EXPIRED";
  const mins = Math.floor(minutes);
  const secs = Math.floor((minutes - mins) * 60);
  return `${mins}m ${secs > 0 ? `${secs}s` : ""}`.trim();
}

export const formatTimeRemaining = formatTimeCountdown;

export function getSeverityColor(severity: string) {
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-950 text-red-400 border-red-800";
    case "HIGH":
      return "bg-amber-950 text-amber-400 border-amber-800";
    case "MEDIUM":
      return "bg-blue-950 text-blue-400 border-blue-800";
    default:
      return "bg-slate-900 text-slate-400 border-slate-700";
  }
}
