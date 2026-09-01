"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MOCK_ATM_HOTSPOTS, AtmHotspot } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import { Badge } from "@/components/common/Badge";
import { MapPin, Navigation, Radio, Shield, AlertTriangle, Crosshair, Map as MapIcon, Compass } from "lucide-react";

// Dynamically import Leaflet Map with SSR disabled for Next.js App Router
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-navy-950 flex flex-col items-center justify-center border border-navy-800 rounded text-slate-400">
      <Radio className="w-8 h-8 text-saffron animate-ping mb-2" />
      <span className="font-mono text-xs">INITIALIZING LEAFLET OPENSTREETMAP TILES & RADAR RADII...</span>
    </div>
  ),
});

export function MapOverview() {
  const [viewMode, setViewMode] = useState<"LEAFLET" | "GRID">("LEAFLET");
  const [selectedAtm, setSelectedAtm] = useState<AtmHotspot>(MOCK_ATM_HOTSPOTS[0]);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "CRITICAL" | "HIGH">("ALL");

  const filteredAtms = MOCK_ATM_HOTSPOTS.filter((atm) => {
    if (activeFilter === "CRITICAL") return atm.riskLevel === "CRITICAL";
    if (activeFilter === "HIGH") return atm.riskLevel === "HIGH" || atm.riskLevel === "CRITICAL";
    return true;
  });

  return (
    <div className="w-full space-y-2">
      {/* Top Map Mode Switcher & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#001730] p-2.5 rounded border border-outline-variant">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-mono text-xs font-bold text-white tracking-wider">
            TACTICAL GIS SURVEILLANCE FEED (DELHI-NCR / UP SECTOR)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex bg-[#000a1e] p-0.5 rounded border border-blue-900/60 text-xs font-mono">
            <button
              onClick={() => setViewMode("LEAFLET")}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                viewMode === "LEAFLET"
                  ? "bg-blue-600 text-white font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" /> Leaflet OpenStreetMap
            </button>
            <button
              onClick={() => setViewMode("GRID")}
              className={`px-3 py-1 rounded flex items-center gap-1.5 transition-colors ${
                viewMode === "GRID"
                  ? "bg-blue-600 text-white font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> Tactical Radar
            </button>
          </div>

          {/* Filter */}
          <div className="flex bg-[#000a1e] p-0.5 rounded border border-blue-950 text-[10px] font-mono">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-2 py-1 rounded ${
                activeFilter === "ALL" ? "bg-blue-700 text-white font-bold" : "text-slate-400"
              }`}
            >
              ALL ({MOCK_ATM_HOTSPOTS.length})
            </button>
            <button
              onClick={() => setActiveFilter("CRITICAL")}
              className={`px-2 py-1 rounded ${
                activeFilter === "CRITICAL" ? "bg-red-600 text-white font-bold" : "text-slate-400"
              }`}
            >
              CRITICAL ONLY
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Rendering */}
      {viewMode === "LEAFLET" ? (
        <div className="w-full rounded overflow-hidden border border-outline-variant shadow-xl">
          <LeafletMap height="520px" />
        </div>
      ) : (
        <div className="relative w-full h-[520px] bg-[#001730] border border-outline-variant rounded-sm overflow-hidden select-none">
          {/* Map Background Grid Simulation */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:20px_20px]"></div>

          {/* Stylized Grid Lines & Sector Rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="90" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6" opacity="0.3" />
            <circle cx="50%" cy="50%" r="270" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="8" opacity="0.2" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1e40af" strokeWidth="0.75" opacity="0.5" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1e40af" strokeWidth="0.75" opacity="0.5" />
          </svg>

          {/* Interactive Radar Markers */}
          <div className="absolute inset-0">
            {filteredAtms.map((atm, i) => {
              const positions = [
                { top: "38%", left: "48%" },
                { top: "28%", left: "62%" },
                { top: "68%", left: "75%" },
                { top: "45%", left: "32%" },
                { top: "25%", left: "40%" },
              ];
              const pos = positions[i % positions.length];
              const isSelected = selectedAtm.id === atm.id;

              return (
                <div
                  key={atm.id}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedAtm(atm)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                >
                  {atm.riskLevel === "CRITICAL" && (
                    <span className="absolute -inset-2 rounded-full bg-red-500/40 animate-ping pointer-events-none"></span>
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg transition-transform group-hover:scale-125 ${
                      atm.riskLevel === "CRITICAL"
                        ? "bg-red-600 text-white"
                        : atm.riskLevel === "HIGH"
                        ? "bg-amber-500 text-white"
                        : "bg-blue-600 text-white"
                    } ${isSelected ? "ring-4 ring-amber-400 scale-110" : ""}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>

                  <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#002147]/90 text-white px-2 py-0.5 rounded text-[10px] font-mono border border-blue-800 shadow">
                    {atm.name.split(" ")[0]} ({atm.probability}%)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Docked Control/Inspector Panel */}
          <div className="absolute bottom-3 right-3 left-3 md:left-auto md:w-96 z-20 bg-[#002147]/95 backdrop-blur-md border border-blue-800 rounded-sm p-4 text-white shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedAtm.riskLevel === "CRITICAL" ? "critical" : "medium"}>
                    {selectedAtm.riskLevel} RISK
                  </Badge>
                  <span className="font-mono text-[11px] text-blue-300">ID: {selectedAtm.id}</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-1">{selectedAtm.name}</h4>
                <p className="text-xs text-slate-300">{selectedAtm.address}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Likelihood</span>
                <div className="text-lg font-mono font-bold text-red-400">{selectedAtm.probability}%</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-blue-900/80 pt-2 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Est. Cash-Out:</span>
                <p className="font-bold text-amber-300">{formatCurrencyINR(selectedAtm.predictedCashOutAmount)}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Window Remaining:</span>
                <p className="font-bold text-red-400">{selectedAtm.estimatedWindowMin} minutes</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Jurisdiction PS:</span>
                <p className="text-white truncate">{selectedAtm.nearbyPoliceStation}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Patrol Unit ETA:</span>
                <p className="text-emerald-400 font-bold">{(selectedAtm.stationDistanceKm * 3.5).toFixed(1)} mins ({selectedAtm.assignedPatrol})</p>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-900 flex gap-2">
              <button
                onClick={() => alert(`Patrol Intercept Unit '${selectedAtm.assignedPatrol}' dispatched to ${selectedAtm.name}`)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-label-caps text-xs py-1.5 rounded uppercase font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Crosshair className="w-3.5 h-3.5" /> Dispatch Intercept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
