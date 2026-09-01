"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { NATIONAL_STATS } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import { Globe2, ShieldCheck, Landmark, AlertCircle, ArrowUpRight, TrendingUp, Filter, Download } from "lucide-react";

export default function NationalOverviewPage() {
  const [selectedSort, setSelectedSort] = useState<"complaints" | "lossCr" | "frozenRate">("complaints");

  const sortedStates = [...NATIONAL_STATS.topStates].sort((a, b) => b[selectedSort] - a[selectedSort]);

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Page Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
                National Cybercrime Intelligence Overview
              </h1>
              <Badge variant="navy">ALL-INDIA TELEMETRY</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Indian Cyber Crime Coordination Centre (I4C) • Cross-State Syndicate Forensics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container hover:bg-secondary text-white font-label-caps text-xs rounded uppercase font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export National Dossier
            </Link>
          </div>
        </div>

        {/* High-Level All-India Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints (All-India 24h)"
            value="14,820"
            change="+8.2% vs yesterday"
            changeType="negative"
            accentColor="red"
            subtitle="NCRP Live Ingestion"
            icon={<Globe2 className="w-5 h-5 text-red-700" />}
          />
          <StatCard
            title="Total Reported Losses (24h)"
            value="₹38.42 Cr"
            change="₹1.60 Cr / hour"
            changeType="urgent"
            accentColor="saffron"
            subtitle="Avg Fraud Ticket: ₹25,900"
            icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Amount Blocked / Frozen"
            value="₹26.15 Cr"
            change="68.06% Golden Hour Ratio"
            changeType="positive"
            accentColor="emerald"
            subtitle="CFCFRMS Instant Hold"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Active High-Risk ATMs"
            value="1,240 Nodes"
            change="49 Cash-Outs Intercepted"
            changeType="positive"
            accentColor="navy"
            subtitle="Across 18 States"
            icon={<Landmark className="w-5 h-5 text-secondary" />}
          />
        </div>

        {/* State-Wise Cybercrime Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant">
            <div>
              <h3 className="font-label-caps text-xs uppercase font-bold text-primary">
                State-Wise Cyber Crime Index &amp; Interception Velocity
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Ranked by volume of financial fraud complaints and recovery rate
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-on-surface-variant">Sort By:</span>
              <button
                onClick={() => setSelectedSort("complaints")}
                className={`px-2 py-1 rounded border ${
                  selectedSort === "complaints"
                    ? "bg-primary-container text-white font-bold"
                    : "bg-surface text-on-surface hover:bg-surface-container"
                }`}
              >
                Complaints
              </button>
              <button
                onClick={() => setSelectedSort("lossCr")}
                className={`px-2 py-1 rounded border ${
                  selectedSort === "lossCr"
                    ? "bg-primary-container text-white font-bold"
                    : "bg-surface text-on-surface hover:bg-surface-container"
                }`}
              >
                Loss (₹ Cr)
              </button>
              <button
                onClick={() => setSelectedSort("frozenRate")}
                className={`px-2 py-1 rounded border ${
                  selectedSort === "frozenRate"
                    ? "bg-primary-container text-white font-bold"
                    : "bg-surface text-on-surface hover:bg-surface-container"
                }`}
              >
                Recovery %
              </button>
            </div>
          </div>

          <DataTable
            columns={[
              {
                header: "State / UT",
                render: (s) => (
                  <div className="flex items-center gap-2">
                    <Link
                      href={s.state === "Uttar Pradesh" ? "/state" : "#"}
                      className="font-bold text-primary hover:text-secondary hover:underline flex items-center gap-1"
                    >
                      {s.state}
                      {s.state === "Uttar Pradesh" && <ArrowUpRight className="w-3.5 h-3.5 text-secondary" />}
                    </Link>
                    {s.state === "Uttar Pradesh" && <Badge variant="critical">PRIORITY FOCUS</Badge>}
                  </div>
                ),
              },
              {
                header: "Complaints (24h)",
                render: (s) => (
                  <span className="font-mono font-bold text-primary">{s.complaints.toLocaleString()}</span>
                ),
              },
              {
                header: "Reported Loss (₹ Cr)",
                render: (s) => (
                  <span className="font-mono font-bold text-red-700">₹{s.lossCr} Cr</span>
                ),
              },
              {
                header: "Recovery / Freeze %",
                render: (s) => (
                  <div className="flex items-center gap-2 font-mono">
                    <div className="w-24 bg-surface-container rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${s.frozenRate}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-emerald-800 text-[11px]">{s.frozenRate}%</span>
                  </div>
                ),
              },
              {
                header: "Active Hotspot ATMs",
                render: (s) => (
                  <span className="font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {s.hotAtmCount} ATMs
                  </span>
                ),
              },
              {
                header: "State Portal",
                align: "right",
                render: (s) => (
                  <Link
                    href={s.state === "Uttar Pradesh" ? "/state" : "#"}
                    className="px-2.5 py-1 bg-surface-container-high hover:bg-primary-container hover:text-white rounded text-[11px] font-semibold transition-colors"
                  >
                    Drilldown →
                  </Link>
                ),
              },
            ]}
            data={sortedStates}
            keyExtractor={(s) => s.state}
          />
        </div>

        {/* Targeted Banks Vulnerability Matrix */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-4">
          <div className="pb-2 border-b border-outline-variant">
            <h3 className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-2">
              <Landmark className="w-4 h-4 text-secondary" />
              Banking Core Vulnerability &amp; Mule Account Detection Matrix
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Telemetry from NPCI / RBI CFCFRMS gateway tracking mule accounts by financial institution
            </p>
          </div>

          <DataTable
            columns={[
              {
                header: "Financial Institution",
                render: (b) => <span className="font-bold text-primary">{b.bank}</span>,
              },
              {
                header: "Mule Accounts Detected",
                render: (b) => (
                  <span className="font-mono font-bold text-red-700">{b.muleAccountsDetected} A/Cs</span>
                ),
              },
              {
                header: "Siphoned Volume (24h)",
                render: (b) => (
                  <span className="font-mono font-bold text-primary">₹{b.totalVolumeCr} Cr</span>
                ),
              },
              {
                header: "Freeze API Efficiency",
                render: (b) => (
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {b.freezeEfficiency} success
                  </span>
                ),
              },
              {
                header: "Actions",
                align: "right",
                render: (b) => (
                  <button
                    onClick={() => alert(`Nodal Circular issued to ${b.bank} Compliance Head`)}
                    className="px-2.5 py-1 bg-surface-container-high hover:bg-secondary hover:text-white rounded text-[11px] font-semibold transition-colors"
                  >
                    Issue Directive
                  </button>
                ),
              },
            ]}
            data={NATIONAL_STATS.topTargetBanks}
            keyExtractor={(b) => b.bank}
          />
        </div>
      </div>
    </AppShell>
  );
}
