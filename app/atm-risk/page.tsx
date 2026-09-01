"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { MapOverview } from "@/components/visualizations/MapOverview";
import { MOCK_ATM_HOTSPOTS, AtmHotspot } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import { MapPin, Crosshair, Radio, Shield, Clock, Send, Download, Filter } from "lucide-react";

export default function AtmRiskPage() {
  const [filterBank, setFilterBank] = useState<string>("ALL");

  const filteredAtms = MOCK_ATM_HOTSPOTS.filter((atm) => {
    if (filterBank === "ALL") return true;
    return atm.bank.toLowerCase().includes(filterBank.toLowerCase());
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
                ATM Risk Intelligence &amp; Cash-Out Hotspot Matrix
              </h1>
              <Badge variant="critical">PREDICTIVE INTERCEPTION</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              AI-driven ATM location prediction triangulating mule phone CDRs, travel isochrones, historical withdrawal density, and branch CCTV feeds
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dispatch"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ba1a1a] hover:bg-red-800 text-white font-label-caps text-xs rounded uppercase font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch All Beat Units
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="ATMs Under Surveillance"
            value="48 Active"
            change="18 Critical Hotspots"
            changeType="urgent"
            accentColor="red"
            subtitle="Noida, Ghaziabad, Delhi, Gurugram"
            icon={<MapPin className="w-5 h-5 text-red-700" />}
          />
          <StatCard
            title="Projected Cash-Out At Risk"
            value="₹84.9 Lakhs"
            change="Next 60 Minutes"
            changeType="negative"
            accentColor="saffron"
            subtitle="Across 5 Priority E-Lobbies"
            icon={<Clock className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Assigned Patrol Beat Units"
            value="32 Cheeth Units"
            change="Avg PCR ETA: 4.2 mins"
            changeType="positive"
            accentColor="emerald"
            subtitle="Live GPS Tracking Active"
            icon={<Radio className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Prediction Accuracy (Historical)"
            value="89.4%"
            change="Model: CrimeFlow-XGB-v4"
            changeType="positive"
            accentColor="navy"
            subtitle="Within 500m radius"
            icon={<Crosshair className="w-5 h-5 text-secondary" />}
          />
        </div>

        {/* Tactical Map View */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              Live GIS Hotspot Tactical Surveillance Grid
            </h3>
            <span className="text-xs text-on-surface-variant font-mono">Synced with DoT TAFCOP &amp; State Police Radio</span>
          </div>
          <MapOverview />
        </div>

        {/* ATM Surveillance Grid Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant">
            <div>
              <h3 className="font-label-caps text-xs uppercase font-bold text-primary">
                High-Risk ATM Terminal Telemetry &amp; Police Station Jurisdiction
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Live probability of unauthorized physical cash withdrawal by mule runners
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-on-surface-variant font-medium">Filter Bank:</span>
              <select
                value={filterBank}
                onChange={(e) => setFilterBank(e.target.value)}
                className="bg-surface border border-outline-variant rounded px-2 py-1 text-xs font-semibold"
              >
                <option value="ALL">All Banks</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Axis">Axis Bank</option>
                <option value="PNB">Punjab National Bank</option>
              </select>
            </div>
          </div>

          <DataTable
            columns={[
              {
                header: "ATM ID & Terminal Name",
                render: (a) => (
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">{a.id}</span>
                    <div className="font-semibold text-xs text-secondary">{a.name}</div>
                    <div className="text-[10px] text-on-surface-variant truncate max-w-[200px]">{a.address}</div>
                  </div>
                ),
              },
              {
                header: "Bank & District",
                render: (a) => (
                  <div>
                    <div className="font-semibold text-primary">{a.bank}</div>
                    <div className="text-[10px] text-on-surface-variant">{a.district}</div>
                  </div>
                ),
              },
              {
                header: "Risk Level",
                render: (a) => (
                  <Badge variant={a.riskLevel === "CRITICAL" ? "critical" : a.riskLevel === "HIGH" ? "medium" : "low"}>
                    {a.riskLevel} ({a.probability}%)
                  </Badge>
                ),
              },
              {
                header: "Est. Cash-Out",
                render: (a) => (
                  <span className="font-mono font-bold text-red-700">
                    {formatCurrencyINR(a.predictedCashOutAmount)}
                  </span>
                ),
              },
              {
                header: "Window Remaining",
                align: "center",
                render: (a) => (
                  <span className="font-mono font-bold text-xs text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-300 animate-pulse">
                    T+{a.estimatedWindowMin} mins
                  </span>
                ),
              },
              {
                header: "Jurisdiction Police Station",
                render: (a) => (
                  <div>
                    <div className="font-semibold text-primary">{a.nearbyPoliceStation}</div>
                    <div className="text-[10px] text-on-surface-variant font-mono">
                      Distance: {a.stationDistanceKm} km • Unit: {a.assignedPatrol}
                    </div>
                  </div>
                ),
              },
              {
                header: "Action",
                align: "right",
                render: (a) => (
                  <button
                    onClick={() => alert(`Patrol Unit '${a.assignedPatrol}' dispatched to ${a.name}`)}
                    className="px-2.5 py-1 bg-primary-container hover:bg-error hover:text-white text-white rounded text-[11px] font-semibold transition-colors uppercase"
                  >
                    Dispatch
                  </button>
                ),
              },
            ]}
            data={filteredAtms}
            keyExtractor={(a) => a.id}
          />
        </div>
      </div>
    </AppShell>
  );
}
