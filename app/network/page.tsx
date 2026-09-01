"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NetworkGraph } from "@/components/visualizations/NetworkGraph";
import { FundFlowDiagram } from "@/components/visualizations/FundFlowDiagram";
import { Badge } from "@/components/common/Badge";
import { SensitiveData } from "@/components/common/SensitiveData";
import { formatCurrencyINR } from "@/lib/utils";
import { Network, GitFork, Layers, ShieldAlert, Radio, Search, Filter } from "lucide-react";

export default function UnifiedGraphForensicsPage() {
  const [activeTab, setActiveTab] = useState<"TOPOLOGY" | "FUND_FLOW" | "CROSS_COMPLAINT">("TOPOLOGY");

  const crossComplaints = [
    {
      caseId: "NCRP-2026-9812",
      state: "Uttar Pradesh",
      district: "Noida",
      loss: 4250000,
      commonNode: "TOK_MULE_L1_01 (SBI)",
      similarity: "98.4%",
      status: "PRIMARY_CASE",
    },
    {
      caseId: "NCRP-2026-9744",
      state: "Maharashtra",
      district: "Mumbai",
      loss: 1850000,
      commonNode: "TOK_MULE_L2_01 (ICICI)",
      similarity: "94.1%",
      status: "LINKED_FIR",
    },
    {
      caseId: "NCRP-2026-9602",
      state: "Karnataka",
      district: "Bengaluru",
      loss: 3100000,
      commonNode: "TOK_IMEI_8675430291",
      similarity: "91.8%",
      status: "LINKED_FIR",
    },
    {
      caseId: "NCRP-2026-9519",
      state: "West Bengal",
      district: "Kolkata",
      loss: 950000,
      commonNode: "TOK_MULE_L2_02 (Axis)",
      similarity: "87.5%",
      status: "LINKED_FIR",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-16">
        {/* Header & Forensics Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <Network className="w-5 h-5 text-secondary" />
              <span>Syndicate Graph &amp; Fund Flow Intelligence Hub</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              Multi-hop fund tracking, Louvain community detection, and cross-complaint entity resolution
            </p>
          </div>

          <div className="flex bg-surface-container-high p-1 rounded border border-outline-variant text-xs font-mono">
            <button
              onClick={() => setActiveTab("TOPOLOGY")}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "TOPOLOGY"
                  ? "bg-primary-container text-white font-bold shadow"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Network className="w-3.5 h-3.5" /> Syndicate Topology
            </button>
            <button
              onClick={() => setActiveTab("FUND_FLOW")}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "FUND_FLOW"
                  ? "bg-primary-container text-white font-bold shadow"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-amber-400" /> Multi-Hop Money Trail
            </button>
            <button
              onClick={() => setActiveTab("CROSS_COMPLAINT")}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                activeTab === "CROSS_COMPLAINT"
                  ? "bg-primary-container text-white font-bold shadow"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-saffron" /> Cross-FIR Linkages ({crossComplaints.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Syndicate Topology Explorer */}
        {activeTab === "TOPOLOGY" && (
          <div className="space-y-4">
            <div className="p-3 bg-surface border border-outline-variant rounded flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>ACTIVE SYNDICATE CLUSTER: <strong className="text-primary">SYN-NOIDA-MEWRAT-04</strong></span>
              </div>
              <span className="text-on-surface-variant">LOUVAIN MODULARITY: <strong>0.842</strong></span>
            </div>
            <NetworkGraph />
          </div>
        )}

        {/* Tab 2: Multi-Hop Fund Flow Diagram */}
        {activeTab === "FUND_FLOW" && (
          <div className="space-y-4">
            <div className="p-3 bg-surface border border-outline-variant rounded flex items-center justify-between text-xs font-mono">
              <span className="text-on-surface-variant">LAYER 0 (VICTIM) $\rightarrow$ LAYER 3 (ATM CASH-OUT TERMINALS)</span>
              <span className="text-red-700 font-bold">TOTAL SIPHONED VOLUME: ₹42,50,000/-</span>
            </div>
            <FundFlowDiagram />
          </div>
        )}

        {/* Tab 3: Cross-Complaint Linkages */}
        {activeTab === "CROSS_COMPLAINT" && (
          <div className="space-y-4">
            <div className="bg-surface border border-outline-variant rounded p-4 space-y-3">
              <h4 className="font-bold text-sm text-primary">Cross-Jurisdiction NCRP Complaint Matrix</h4>
              <p className="text-xs text-on-surface-variant">
                The following distinct NCRP cybercrime complaints share identical tokenized bank accounts, phone numbers, or IMEIs.
              </p>

              <div className="overflow-x-auto border border-outline-variant rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-container font-label-caps text-[11px] text-on-surface">
                    <tr>
                      <th className="p-3 border-b border-outline-variant">Case Reference</th>
                      <th className="p-3 border-b border-outline-variant">Jurisdiction</th>
                      <th className="p-3 border-b border-outline-variant">Reported Loss</th>
                      <th className="p-3 border-b border-outline-variant">Shared Forensic Identifier</th>
                      <th className="p-3 border-b border-outline-variant">Graph Similarity</th>
                      <th className="p-3 border-b border-outline-variant">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant font-mono">
                    {crossComplaints.map((c, i) => (
                      <tr key={i} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="p-3 font-bold text-primary">{c.caseId}</td>
                        <td className="p-3 font-sans text-on-surface-variant">{c.district}, {c.state}</td>
                        <td className="p-3 font-bold text-red-600">{formatCurrencyINR(c.loss)}</td>
                        <td className="p-3 text-secondary font-bold">{c.commonNode}</td>
                        <td className="p-3 text-emerald-600 font-bold">{c.similarity}</td>
                        <td className="p-3">
                          <Badge variant={c.status === "PRIMARY_CASE" ? "critical" : "medium"}>{c.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
