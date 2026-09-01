"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { DATA_PIPELINE_STATUS } from "@/lib/mock-data";
import { Database, Cpu, Activity, ShieldCheck, RefreshCw, CheckCircle2, Server } from "lucide-react";

export default function DataPipelinePage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
                IntelliTrace Federated Data Pipeline Telemetry
              </h1>
              <Badge variant="success">6 OF 6 CONNECTORS LIVE</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Real-time ingestion health across NCRP, NPCI UPI Switch, CFCFRMS, DoT Telecom TAFCOP, and CKYC
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Pipeline telemetry heartbeat verified across all 6 Kafka stream topics.")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container hover:bg-secondary text-white font-label-caps text-xs rounded uppercase font-bold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Ping All Ingestion Gateways
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Events Ingested (24h)"
            value="2.08 Million"
            change="Zero Dropped Packets"
            changeType="positive"
            accentColor="emerald"
            subtitle="Kafka / Flink Streaming Stream"
            icon={<Database className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Average Gateway Latency"
            value="18 ms"
            change="SLA: < 100 ms"
            changeType="positive"
            accentColor="navy"
            subtitle="NPCI Direct Leased Line"
            icon={<Cpu className="w-5 h-5 text-secondary" />}
          />
          <StatCard
            title="Pipeline Availability"
            value="99.992%"
            change="ISO 27001 Certified"
            changeType="positive"
            accentColor="emerald"
            subtitle="Multi-AZ NIC Cloud"
            icon={<Activity className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Active Microservices"
            value="38 Pods"
            change="Kubernetes Cluster UP"
            changeType="positive"
            accentColor="saffron"
            subtitle="MeitY / NIC Data Centre"
            icon={<Server className="w-5 h-5 text-amber-600" />}
          />
        </div>

        {/* Connectors Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-4">
          <div className="pb-2 border-b border-outline-variant">
            <h3 className="font-label-caps text-xs uppercase font-bold text-primary">
              National Ingestion Connectors &amp; Government Gateway Status
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Live heartbeat, sync efficiency, and record volume for integrated statutory data sources
            </p>
          </div>

          <DataTable
            columns={[
              {
                header: "Ingestion Connector",
                render: (p) => (
                  <div>
                    <span className="font-bold text-xs text-primary">{p.name}</span>
                    <div className="text-[10px] text-on-surface-variant font-semibold">{p.source}</div>
                  </div>
                ),
              },
              {
                header: "Status",
                render: (p) => (
                  <Badge variant={p.status === "OPERATIONAL" ? "success" : "medium"}>
                    {p.status}
                  </Badge>
                ),
              },
              {
                header: "Gateway Latency",
                render: (p) => (
                  <span className="font-mono font-bold text-xs text-emerald-700">{p.latencyMs} ms</span>
                ),
              },
              {
                header: "Sync Reliability",
                render: (p) => (
                  <span className="font-mono font-bold text-xs text-primary">{p.syncRate}</span>
                ),
              },
              {
                header: "Events Today",
                render: (p) => (
                  <span className="font-mono text-xs font-semibold text-secondary">{p.recordsIngestedToday}</span>
                ),
              },
              {
                header: "Action",
                align: "right",
                render: (p) => (
                  <button
                    onClick={() => alert(`Diagnostics log retrieved for ${p.name}`)}
                    className="px-2.5 py-1 bg-surface-container-high hover:bg-primary-container hover:text-white rounded text-[11px] font-semibold transition-colors"
                  >
                    Test Ping
                  </button>
                ),
              },
            ]}
            data={DATA_PIPELINE_STATUS}
            keyExtractor={(p) => p.name}
          />
        </div>
      </div>
    </AppShell>
  );
}
