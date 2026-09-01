"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { UP_STATE_DATA } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import { Map, Shield, Phone, Mail, UserCheck, AlertTriangle, ArrowRight, Crosshair, Download } from "lucide-react";

export default function StateIntelligencePage() {
  const [districtFilter, setDistrictFilter] = useState<string>("ALL");

  const districts = UP_STATE_DATA.districts;

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Page Title & Nodal Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
                State Intelligence Dashboard — Uttar Pradesh
              </h1>
              <Badge variant="critical">STATE RED ALERT</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              UP State Cyber Crime Headquarters, Signature Building, Lucknow • High-Risk Districts Matrix
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/atm-risk"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ba1a1a] hover:bg-red-800 text-white font-label-caps text-xs rounded uppercase font-bold transition-colors"
            >
              <Crosshair className="w-3.5 h-3.5" /> Noida/Ghaziabad ATM Grid
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container hover:bg-secondary text-white font-label-caps text-xs rounded uppercase font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> State Dossier
            </Link>
          </div>
        </div>

        {/* Nodal Officer Contact Banner */}
        <div className="bg-surface-container-low border border-outline-variant rounded-sm p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm">
              AY
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-primary">{UP_STATE_DATA.stateNodalOfficer}</span>
                <Badge variant="navy">STATE NODAL HEAD</Badge>
              </div>
              <p className="text-xs text-on-surface-variant">{UP_STATE_DATA.nodalAgency}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Phone className="w-3.5 h-3.5 text-secondary" />
              <span>+91 522 2209182 / 1930</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Mail className="w-3.5 h-3.5 text-secondary" />
              <span>cybercell-up@gov.in</span>
            </div>
          </div>
        </div>

        {/* Top State Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Complaints Today"
            value="3,420 Cases"
            change="Rank 1 in National Volume"
            changeType="urgent"
            accentColor="red"
            subtitle="NCR Sector Accounts for 58%"
            icon={<AlertTriangle className="w-5 h-5 text-red-700" />}
          />
          <StatCard
            title="Total Siphoned (UP Today)"
            value="₹84.50 Cr"
            change="+14.2% vs 7d average"
            changeType="negative"
            accentColor="saffron"
            subtitle="Avg: ₹2.47 Lakhs / Case"
            icon={<Map className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Golden Hour Recovery Rate"
            value="71.2%"
            change="₹60.16 Cr Frozen"
            changeType="positive"
            accentColor="emerald"
            subtitle="Top District: Noida (78.4%)"
            icon={<Shield className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Active Hotspot ATMs Monitored"
            value="312 ATMs"
            change="48 Critical Hotspots"
            changeType="urgent"
            accentColor="navy"
            subtitle="Assigned to 84 PCR Units"
            icon={<Crosshair className="w-5 h-5 text-secondary" />}
          />
        </div>

        {/* District Breakdown Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
            <div>
              <h3 className="font-label-caps text-xs uppercase font-bold text-primary">
                District-Wise Cyber Crime Severity &amp; ATM Vulnerability Matrix
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Live statistics from 75 District Cyber Cells in Uttar Pradesh
              </p>
            </div>
          </div>

          <DataTable
            columns={[
              {
                header: "District",
                render: (d) => (
                  <div>
                    <span className="font-bold text-primary">{d.name}</span>
                  </div>
                ),
              },
              {
                header: "Status",
                render: (d) => (
                  <Badge variant={d.status === "RED_ALERT" ? "critical" : d.status === "HIGH_ALERT" ? "medium" : "low"}>
                    {d.status.replace(/_/g, " ")}
                  </Badge>
                ),
              },
              {
                header: "Cases Today",
                render: (d) => (
                  <span className="font-mono font-bold text-primary">{d.casesToday}</span>
                ),
              },
              {
                header: "Reported Loss (₹ Lakhs)",
                render: (d) => (
                  <span className="font-mono font-bold text-red-700">₹{d.lossLakhs} Lakhs</span>
                ),
              },
              {
                header: "Recovery %",
                render: (d) => (
                  <span className="font-mono font-bold text-emerald-700">{d.recoveryRate}%</span>
                ),
              },
              {
                header: "Hotspot ATMs",
                render: (d) => (
                  <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {d.hotAtms} ATMs
                  </span>
                ),
              },
              {
                header: "Action",
                align: "right",
                render: (d) => (
                  <Link
                    href="/atm-risk"
                    className="px-2.5 py-1 bg-surface-container-high hover:bg-primary-container hover:text-white rounded text-[11px] font-semibold transition-colors"
                  >
                    View ATM Grid →
                  </Link>
                ),
              },
            ]}
            data={districts}
            keyExtractor={(d) => d.name}
          />
        </div>
      </div>
    </AppShell>
  );
}
