"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Shield, Radio, User, Menu, X, CheckCircle2, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/common/Badge";

interface TopNavBarProps {
  onToggleMobileMenu?: () => void;
}

export function TopNavBar({ onToggleMobileMenu }: TopNavBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check initial theme from localStorage or document
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const isDark = savedTheme === "dark" || (!savedTheme && document.documentElement.classList.contains("dark"));
    if (isDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      setTheme("light");
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const [officer, setOfficer] = useState({
    name: "Vikramaditya K., IPS",
    role: "Superintendent / Cyber",
    initials: "VK",
    email: "vikram.ips@mha.gov.in"
  });

  useEffect(() => {
    const loadOfficer = () => {
      try {
        const saved = localStorage.getItem("intellitrace_officer");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.name) {
            setOfficer({
              name: parsed.name,
              role: parsed.role || "Superintendent / Cyber",
              initials: parsed.initials || "VK",
              email: parsed.email || ""
            });
          }
        }
      } catch (e) {}
    };
    loadOfficer();
    window.addEventListener("officer-login", loadOfficer);
    return () => window.removeEventListener("officer-login", loadOfficer);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + " " + now.toLocaleTimeString("en-IN", { hour12: false }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full h-16 bg-primary text-on-primary border-b border-surface-tint px-4 lg:px-6 flex items-center justify-between z-30 shadow-md shrink-0">
      {/* Brand & Mobile Menu Button */}
      <div className="flex items-center gap-4">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 text-white/80 hover:text-white rounded hover:bg-white/10"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md ring-2 ring-amber-400/40 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="IntelliTrace Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display-lg text-lg font-bold text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
              IntelliTrace
            </span>
            <span className="text-[10px] text-primary-fixed-dim font-mono tracking-wider">
              MHA CYBER INTELLIGENCE
            </span>
          </div>
        </Link>
        <span className="hidden sm:inline-flex bg-on-primary-fixed-variant text-on-primary font-label-caps text-[10px] px-2 py-0.5 rounded border border-primary-container uppercase tracking-wider font-bold">
          ADMIN
        </span>
      </div>

      {/* Global Forensic Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-primary-container" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global Search (Phone, Bank A/C, UPI VPA, Case ID, IMEI)..."
            className="w-full bg-primary-container border border-surface-tint rounded text-xs text-white placeholder-on-primary-container pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary-container font-mono transition-all shadow-inner"
          />
        </div>
      </form>

      {/* Live Status Indicators & User Badge */}
      <div className="flex items-center gap-4">
        {/* Real-time Clock */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-primary-fixed-dim bg-primary-container/80 px-2.5 py-1 rounded border border-surface-tint">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{currentTime || "2026-09-01 19:50:00 IST"}</span>
        </div>

        {/* Threat Level */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-error-container text-on-error-container rounded border border-red-300 font-label-caps text-[10px] uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
          <span>DEFCON 2</span>
        </div>

        {/* Dark / Light Theme Toggle Button with Smooth Animated Micro-Interaction */}
        <button
          onClick={toggleTheme}
          className="relative w-9 h-9 p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center group overflow-hidden"
          title={theme === "dark" ? "Switch to Day / Light Mode" : "Switch to Night / Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Day / Light Mode" : "Switch to Night / Dark Mode"}
        >
          <Sun
            className={`w-5 h-5 text-amber-400 absolute transition-all duration-500 ease-in-out transform ${
              theme === "dark"
                ? "rotate-0 scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                : "rotate-90 scale-0 opacity-0 pointer-events-none"
            }`}
          />
          <Moon
            className={`w-5 h-5 text-slate-200 absolute transition-all duration-500 ease-in-out transform ${
              theme === "light"
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0 pointer-events-none"
            }`}
          />
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary animate-pulse"></span>
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded shadow-2xl z-50 text-on-surface overflow-hidden">
              <div className="bg-primary-container px-4 py-2.5 text-white flex items-center justify-between">
                <span className="font-label-caps text-xs font-bold uppercase">LIVE HIGH-PRIORITY ALERTS (4)</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-white/70 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>
              <div className="divide-y divide-surface-container max-h-80 overflow-y-auto text-xs">
                <div className="p-3 hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant="critical">CASH-OUT IMMINENT</Badge>
                    <span className="text-[10px] text-on-surface-variant font-mono">2m ago</span>
                  </div>
                  <p className="font-semibold text-on-surface mt-1">HDFC Sector 62 E-Lobby (Noida)</p>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">Mule balance ₹18.5L transferred. Intercept window active.</p>
                </div>
                <div className="p-3 hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant="critical">RAPID LAYERING</Badge>
                    <span className="text-[10px] text-on-surface-variant font-mono">11m ago</span>
                  </div>
                  <p className="font-semibold text-on-surface mt-1">₹95L Split Across 5 Accounts</p>
                  <p className="text-on-surface-variant text-[11px] mt-0.5">ICICI to Axis/Canara within 180 seconds.</p>
                </div>
              </div>
              <div className="p-2 bg-surface-container-low border-t border-outline-variant text-center">
                <Link
                  href="/alerts"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-secondary font-bold hover:underline"
                >
                  View All Alert Queues →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Officer User Profile */}
        <Link
          href="/login"
          title={`Signed in as ${officer.name} (${officer.email || officer.role}) - Click to switch profile / login`}
          className="flex items-center gap-2 pl-2 border-l border-surface-tint hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-secondary-container text-primary font-bold flex items-center justify-center text-xs shadow-sm">
            {officer.initials}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-white leading-tight truncate max-w-[170px]">{officer.name}</span>
            <span className="text-[10px] text-primary-fixed-dim truncate max-w-[170px]">{officer.role}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
