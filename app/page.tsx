"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { MapOverview } from "@/components/visualizations/MapOverview";
import { NetworkGraph } from "@/components/visualizations/NetworkGraph";
import { PredictionCurve } from "@/components/visualizations/PredictionCurve";
import { MOCK_CASES, MOCK_ALERTS, NATIONAL_STATS, CaseRecord } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import { SensitiveData } from "@/components/common/SensitiveData";
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Send,
  ArrowRight,
  Clock,
  Radio,
  MapPin,
  RefreshCw,
  Eye,
  Filter,
} from "lucide-react";

export default function CommandCenterPage() {
  const [selectedCase, setSelectedCase] = useState<CaseRecord>(MOCK_CASES[0]);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
                National Cybercrime Intelligence Command Center
              </h1>
              <Badge variant="critical">LIVE DEFCON 2</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Ministry of Home Affairs &amp; I4C • Predictive ATM Cash-Out Interception Matrix
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dispatch"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ba1a1a] hover:bg-red-800 text-white font-label-caps text-xs rounded uppercase font-bold transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Quick Dispatch (1930)
            </Link>
            <button
              onClick={() => alert("Refreshed live feed across 28 States and 8 UTs.")}
              className="p-1.5 border border-outline-variant bg-white hover:bg-surface-container-high rounded text-on-surface transition-colors"
              title="Refresh telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Reported Losses (24h)"
            value="₹38.42 Cr"
            change="+12.4% vs 7d avg"
            changeType="negative"
            accentColor="red"
            subtitle="14,820 NCRP Complaints"
            icon={<ShieldAlert className="w-5 h-5 text-red-700" />}
          />
          <StatCard
            title="Total Frozen in Golden Hour"
            value="₹26.15 Cr"
            change="68.06% Recovery Rate"
            changeType="positive"
            accentColor="emerald"
            subtitle="CFCFRMS Automated Freeze"
            icon={<TrendingUp className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Active ATM Cash-Out Alerts"
            value="49 Hotspots"
            change="18 Imminent Intercepts"
            changeType="urgent"
            accentColor="saffron"
            subtitle="UP, NCR, MH, KA Sectors"
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Active Patrol Dispatches"
            value="86 Units"
            change="Avg Response: 4.8m"
            changeType="positive"
            accentColor="navy"
            subtitle="State Police &amp; Bank Nodals"
            icon={<Radio className="w-5 h-5 text-secondary" />}
          />
        </div>

        {/* Central Map & AI Cash-out Predictor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                Live ATM Cash-Out Risk Geo-Surveillance
              </h2>
              <Link href="/atm-risk" className="text-xs text-secondary hover:underline font-semibold">
                Expand Fullscreen GIS →
              </Link>
            </div>
            <MapOverview />
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant mb-3">
                <h2 className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary" />
                  Primary Cash-Out Prediction
                </h2>
                <Badge variant="critical">18 MIN REMAINING</Badge>
              </div>
              <PredictionCurve
                currentMinute={18}
                predictedAtm="HDFC Sector 62 E-Lobby"
                confidenceScore={91.4}
              />
            </div>

            {/* Quick Summary of Target Incident */}
            <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-sm text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-primary">NCRP-DEMO-894321</span>
                <Badge variant="critical">CRITICAL TRIAGE</Badge>
              </div>
              <p className="text-on-surface-variant font-medium">
                Victim: <strong>Dr. Arvind Rameshwar (Noida)</strong> • Siphoned:{" "}
                <strong className="text-red-700 font-mono">₹42,50,000</strong>
              </p>
              <div className="pt-2 border-t border-surface-container flex items-center justify-between">
                <SensitiveData value="918230918234" label="Target Mule A/C" />
                <Link
                  href="/cases/NCRP-DEMO-894321"
                  className="px-2.5 py-1 bg-primary-container text-white rounded font-label-caps text-[11px] uppercase hover:bg-secondary transition-colors"
                >
                  Investigate →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Live Crime Intelligence Feed & High-Priority Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Priority Case Triage Table */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-label-caps text-xs uppercase font-bold text-primary">
                  Live Cyber Fraud Incidents Under Surveillance
                </h2>
                <p className="text-[11px] text-on-surface-variant">
                  Auto-prioritized by AI cash-out probability &amp; amount siphoned
                </p>
              </div>
              <Link href="/alerts" className="text-xs text-secondary font-bold hover:underline">
                View All Queues →
              </Link>
            </div>

            <DataTable
              columns={[
                {
                  header: "Case ID",
                  render: (c) => (
                    <Link href={`/cases/${c.ncrpId}`} className="font-mono font-bold text-secondary hover:underline">
                      {c.ncrpId}
                    </Link>
                  ),
                },
                {
                  header: "Type & Sub-Category",
                  render: (c) => (
                    <div>
                      <div className="font-semibold text-primary">{c.category}</div>
                      <div className="text-[10px] text-on-surface-variant truncate max-w-[180px]">
                        {c.subCategory}
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Loss / Blocked",
                  render: (c) => (
                    <div className="font-mono">
                      <div className="font-bold text-red-700">{formatCurrencyINR(c.totalLoss)}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">
                        Blocked: {formatCurrencyINR(c.blockedAmount)} ({c.recoveryRate}%)
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Predicted ATM",
                  render: (c) => (
                    <div>
                      <div className="font-semibold text-primary">{c.predictedAtmName}</div>
                      <div className="text-[10px] text-on-surface-variant">{c.predictedDistrict}</div>
                    </div>
                  ),
                },
                {
                  header: "Cash-Out ETA",
                  align: "center",
                  render: (c) => (
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-red-100 text-red-800 border border-red-300 animate-pulse">
                      T+{c.timeToWithdrawMin}m ({c.cashOutLikelihood}%)
                    </span>
                  ),
                },
                {
                  header: "Action",
                  align: "right",
                  render: (c) => (
                    <Link
                      href={`/cases/${c.ncrpId}`}
                      className="px-2.5 py-1 bg-surface-container-high hover:bg-primary-container hover:text-white rounded text-[11px] font-semibold transition-colors"
                    >
                      Inspect
                    </Link>
                  ),
                },
              ]}
              data={MOCK_CASES}
              keyExtractor={(c) => c.id}
            />
          </div>

          {/* Real-time Alerts Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                Real-Time Triage Feed
              </h2>
              <span className="text-[10px] font-mono text-on-surface-variant">POLLING 1s</span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-surface-container-lowest border border-outline-variant rounded-sm hover:border-secondary transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={alert.severity === "CRITICAL" ? "critical" : "medium"}>
                      {alert.type.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-[10px] font-mono text-on-surface-variant">{alert.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-primary text-xs">{alert.title}</h4>
                  <p className="text-on-surface-variant text-[11px] line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                  <div className="pt-1.5 flex items-center justify-between border-t border-surface-container font-mono text-[11px]">
                    <span className="font-bold text-red-700">{formatCurrencyINR(alert.amount)}</span>
                    <Link href="/dispatch" className="text-secondary hover:underline font-sans font-semibold">
                      Trigger Dispatch →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
