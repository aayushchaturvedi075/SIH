"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  Network,
  MapPin,
  Cpu,
  BellRing,
  FileText,
  Globe2,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SideNavBarProps {
  onCloseMobile?: () => void;
}

export function SideNavBar({ onCloseMobile }: SideNavBarProps) {
  const pathname = usePathname();

  // 7 Core High-Impact Intelligence Modules
  const navItems = [
    {
      label: "Command Center",
      href: "/",
      icon: LayoutDashboard,
      desc: "Live DEFCON & Incident Feed",
    },
    {
      label: "Case Investigation",
      href: "/cases/NCRP-DEMO-894321",
      icon: FileSearch,
      desc: "Dossier & Suspect Footprint",
    },
    {
      label: "Graph & Fund Flow",
      href: "/network",
      icon: Network,
      desc: "Mule Rings & Money Trail",
    },
    {
      label: "Tactical GIS & ATMs",
      href: "/atm-risk",
      icon: MapPin,
      desc: "Multi-City Leaflet Surveillance",
    },
    {
      label: "AI Prediction Hub",
      href: "/workbench",
      icon: Cpu,
      desc: "Timeline Curves & Model Tuning",
    },
    {
      label: "Alerts & Dispatch",
      href: "/alerts",
      icon: BellRing,
      desc: "Triage & CrPC Sec 91 Orders",
      badge: "4",
    },
    {
      label: "Official Dossier",
      href: "/report",
      icon: FileText,
      desc: "Section 65B Algorand Anchor",
    },
  ];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("intellitrace_officer");
      window.dispatchEvent(new Event("officer-login"));
    } catch (e) {}
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 bg-surface-container-low border-r border-outline-variant flex flex-col h-full shrink-0 select-none">
      {/* Unit Header */}
      <div className="p-4 border-b border-outline-variant bg-surface flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-md ring-2 ring-amber-400/40 flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src="/logo.png"
            alt="IntelliTrace Logo"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-caps text-xs text-primary font-bold tracking-wider">
            INTELLITRACE
          </span>
          <span className="text-[10px] text-on-surface-variant font-semibold tracking-wider text-amber-500 font-mono">
            PREDICT • PREVENT • PROTECT
          </span>
        </div>
      </div>

      {/* Navigation Links Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1.5">
        <div className="px-3 pb-1">
          <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-widest font-bold">
            INTELLIGENCE MODULES
          </span>
        </div>

        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={idx}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                isActive
                  ? "bg-primary-container text-white font-semibold shadow-sm border border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive ? "text-amber-400" : "text-on-surface-variant group-hover:text-primary"
                  )}
                />
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{item.label}</span>
                  <span
                    className={cn(
                      "text-[10px] font-normal truncate",
                      isActive ? "text-slate-300" : "text-slate-400"
                    )}
                  >
                    {item.desc}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0",
                    isActive ? "bg-red-600 text-white" : "bg-red-100 text-red-800 border border-red-200"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / System Utilities */}
      <div className="p-3 border-t border-outline-variant bg-surface-container-lowest space-y-1.5 text-xs">
        <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
          <Link
            href="/national"
            onClick={handleNavClick}
            className="flex items-center gap-1.5 p-1.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-blue-600" />
            <span>National</span>
          </Link>
          <Link
            href="/security"
            onClick={handleNavClick}
            className="flex items-center gap-1.5 p-1.5 rounded text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>Security</span>
          </Link>
        </div>

        <Link
          href="/login"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 mt-2 py-1.5 px-3 border border-error text-error hover:bg-error-container font-label-caps text-[11px] rounded transition-colors uppercase font-bold tracking-wider"
        >
          <LogOut className="w-3.5 h-3.5" />
          SECURE LOGOUT
        </Link>
      </div>
    </aside>
  );
}
