"use client";

import React, { useState } from "react";
import { formatCurrencyINR } from "@/lib/utils";
import { SensitiveData } from "@/components/common/SensitiveData";
import { Badge } from "@/components/common/Badge";
import { ArrowRight, ShieldCheck, AlertCircle, Ban, Lock } from "lucide-react";

interface LayerItem {
  id: string;
  layer: number;
  bank: string;
  account: string;
  name: string;
  amount: number;
  timestamp: string;
  status: "FROZEN" | "TRANSFERRED" | "AT_RISK";
  freezeTimeSec?: number;
}

export function FundFlowDiagram() {
  const [layers, setLayers] = useState<LayerItem[]>([
    { id: "L0", layer: 0, bank: "ICICI Bank (Victim A/C)", account: "109283746152", name: "Dr. Arvind Rameshwar", amount: 4250000, timestamp: "19:42:00 IST", status: "TRANSFERRED" },
    { id: "L1-A", layer: 1, bank: "SBI Noida Branch", account: "918230918234", name: "CyberSafe Global Escrow", amount: 2000000, timestamp: "19:43:10 IST", status: "TRANSFERRED" },
    { id: "L1-B", layer: 1, bank: "HDFC Sector 18", account: "501004928172", name: "Mukesh Kumar Yadav", amount: 1250000, timestamp: "19:43:45 IST", status: "FROZEN", freezeTimeSec: 142 },
    { id: "L1-C", layer: 1, bank: "Axis Bank Jaipur", account: "602938475102", name: "P2P Trader Deshraj", amount: 1000000, timestamp: "19:44:12 IST", status: "TRANSFERRED" },
    { id: "L2-A", layer: 2, bank: "Kotak Mahindra ATM Pool", account: "771029384756", name: "ATM Runner Deepak B.", amount: 850000, timestamp: "19:45:30 IST", status: "AT_RISK" },
    { id: "L2-B", layer: 2, bank: "Canara Bank Meerut", account: "330918273645", name: "Rohit Verma (Mule)", amount: 1150000, timestamp: "19:46:00 IST", status: "FROZEN", freezeTimeSec: 88 },
  ]);

  const handleToggleFreeze = (id: string) => {
    setLayers((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "FROZEN" ? "AT_RISK" : "FROZEN";
          return { ...item, status: nextStatus, freezeTimeSec: nextStatus === "FROZEN" ? 45 : undefined };
        }
        return item;
      })
    );
  };

  const totalAmount = 4250000;
  const frozenAmount = layers
    .filter((l) => l.status === "FROZEN" && l.layer > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const recoveryPct = ((frozenAmount / totalAmount) * 100).toFixed(1);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 shadow-sm">
      {/* Top Banner Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-surface-container-low border border-outline-variant rounded-sm mb-6">
        <div>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
            Total Siphoned Amount
          </span>
          <p className="font-display-lg text-lg font-bold text-primary font-mono">
            {formatCurrencyINR(totalAmount)}
          </p>
        </div>
        <div>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
            Total Successfully Frozen
          </span>
          <p className="font-display-lg text-lg font-bold text-emerald-700 font-mono">
            {formatCurrencyINR(frozenAmount)} ({recoveryPct}%)
          </p>
        </div>
        <div>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">
            Average CFCFRMS Freeze Time
          </span>
          <p className="font-display-lg text-lg font-bold text-secondary font-mono">
            115 seconds
          </p>
        </div>
      </div>

      {/* Layer Flow Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Layer 0: Victim */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
            <span className="font-label-caps text-xs font-bold text-primary">LAYER 0 (SOURCE)</span>
            <span className="text-[10px] font-mono text-on-surface-variant">ORIGIN DEPOSIT</span>
          </div>
          {layers
            .filter((l) => l.layer === 0)
            .map((item) => (
              <div key={item.id} className="p-3 bg-red-50/50 border border-red-200 rounded-sm">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-primary">{item.name}</span>
                  <Badge variant="critical">VICTIM</Badge>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">{item.bank}</p>
                <div className="mt-2">
                  <SensitiveData value={item.account} type="account" />
                </div>
                <div className="mt-2 flex justify-between items-center text-xs font-mono font-bold text-red-700">
                  <span>- {formatCurrencyINR(item.amount)}</span>
                  <span className="text-[10px] font-normal text-on-surface-variant">{item.timestamp}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Layer 1: Mule Hops */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
            <span className="font-label-caps text-xs font-bold text-primary">LAYER 1 (MULE ACCOUNTS)</span>
            <span className="text-[10px] font-mono text-on-surface-variant">3 PARALLEL HOPS</span>
          </div>
          {layers
            .filter((l) => l.layer === 1)
            .map((item) => (
              <div
                key={item.id}
                className={`p-3 border rounded-sm transition-all ${
                  item.status === "FROZEN"
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-amber-50/50 border-amber-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-primary">{item.name}</span>
                  <Badge variant={item.status === "FROZEN" ? "success" : "medium"}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">{item.bank}</p>
                <div className="mt-2">
                  <SensitiveData value={item.account} type="account" />
                </div>
                <div className="mt-2 flex justify-between items-center text-xs font-mono font-bold">
                  <span className={item.status === "FROZEN" ? "text-emerald-800" : "text-amber-800"}>
                    {formatCurrencyINR(item.amount)}
                  </span>
                  <button
                    onClick={() => handleToggleFreeze(item.id)}
                    className="text-[11px] font-sans px-2 py-0.5 rounded bg-primary-container text-white hover:bg-secondary transition-colors"
                  >
                    {item.status === "FROZEN" ? "Unfreeze" : "Instant Freeze"}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Layer 2: Cash-Out & Final Terminus */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-outline-variant">
            <span className="font-label-caps text-xs font-bold text-primary">LAYER 2 (TERMINUS / ATMS)</span>
            <span className="text-[10px] font-mono text-on-surface-variant">FINAL WITHDRAWAL</span>
          </div>
          {layers
            .filter((l) => l.layer === 2)
            .map((item) => (
              <div
                key={item.id}
                className={`p-3 border rounded-sm transition-all ${
                  item.status === "FROZEN"
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-red-100/60 border-red-400 animate-pulse"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-primary">{item.name}</span>
                  <Badge variant={item.status === "FROZEN" ? "success" : "critical"}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">{item.bank}</p>
                <div className="mt-2">
                  <SensitiveData value={item.account} type="account" />
                </div>
                <div className="mt-2 flex justify-between items-center text-xs font-mono font-bold">
                  <span className={item.status === "FROZEN" ? "text-emerald-800" : "text-red-800 font-extrabold"}>
                    {formatCurrencyINR(item.amount)}
                  </span>
                  <button
                    onClick={() => handleToggleFreeze(item.id)}
                    className="text-[11px] font-sans px-2 py-0.5 rounded bg-error text-white hover:bg-red-800 transition-colors"
                  >
                    {item.status === "FROZEN" ? "Unfreeze" : "Dispatched Intercept"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
