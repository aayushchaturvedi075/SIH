"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { SensitiveData } from "@/components/common/SensitiveData";
import { MOCK_CASES } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import { Search, Database, CheckCircle2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") || "";

  const [query, setQuery] = useState(initialQ || "918230918234");
  const [filterType, setFilterType] = useState<"ALL" | "ACCOUNTS" | "PHONES" | "CASES" | "ATMS">("ALL");
  const [searched, setSearched] = useState(true);

  useEffect(() => {
    if (initialQ) {
      setQuery(initialQ);
      setSearched(true);
    }
  }, [initialQ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const sampleQueries = [
    { label: "Mule Account", val: "918230918234" },
    { label: "Suspect Phone", val: "919876543210" },
    { label: "Target IMEI", val: "867543029182736" },
    { label: "UPI Handle", val: "paytmqr.283910@paytm" },
    { label: "Case ID", val: "NCRP-DEMO-894321" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
      {/* Title Bar */}
      <div className="pb-3 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
            System-Wide Universal Forensic Search
          </h1>
          <Badge variant="navy">6 FEDERATED DATABASES</Badge>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">
          Simultaneous real-time query across NCRP complaints, NPCI banking switch, DoT telecom CDR, CKYC, and ATM registries
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-6 space-y-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across Phone No, Bank A/C, IFSC, UPI VPA, IMEI, Aadhaar Hash, Transaction Ref..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-sm font-mono text-sm focus:ring-2 focus:ring-primary-container focus:border-primary-container text-primary"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-primary-container hover:bg-secondary text-white font-label-caps text-xs rounded-sm uppercase font-bold transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" /> Run Federated Search
          </button>
        </form>

        {/* Quick Query Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-on-surface-variant font-semibold">Quick Sample Queries:</span>
          {sampleQueries.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(s.val);
                setSearched(true);
              }}
              className="px-2.5 py-1 bg-surface-container hover:bg-primary-container hover:text-white rounded border border-outline-variant font-mono text-[11px] transition-colors"
            >
              {s.label}: <strong>{s.val}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Area */}
      {searched && (
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b border-outline-variant pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType("ALL")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  filterType === "ALL" ? "bg-primary-container text-white" : "bg-surface text-on-surface"
                }`}
              >
                All Matches (12)
              </button>
              <button
                onClick={() => setFilterType("ACCOUNTS")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  filterType === "ACCOUNTS" ? "bg-primary-container text-white" : "bg-surface text-on-surface"
                }`}
              >
                Bank A/Cs (4)
              </button>
              <button
                onClick={() => setFilterType("CASES")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  filterType === "CASES" ? "bg-primary-container text-white" : "bg-surface text-on-surface"
                }`}
              >
                NCRP Complaints (4)
              </button>
              <button
                onClick={() => setFilterType("ATMS")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  filterType === "ATMS" ? "bg-primary-container text-white" : "bg-surface text-on-surface"
                }`}
              >
                ATM Terminals (5)
              </button>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Queried 6 databases in 24 ms
            </span>
          </div>

          {/* Results Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-3">
            <h3 className="font-label-caps text-xs uppercase font-bold text-primary">
              Correlated Cross-System Entity Matches for &quot;{query}&quot;
            </h3>

            <DataTable
              columns={[
                {
                  header: "Database Source",
                  render: (c) => (
                    <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-secondary" />
                      NCRP / NPCI Gateway
                    </span>
                  ),
                },
                {
                  header: "Entity Identifier",
                  render: (c) => (
                    <div>
                      <span className="font-mono font-bold text-xs text-primary">{c.suspectAccount}</span>
                      <div className="text-[10px] text-on-surface-variant font-mono">
                        IFSC: {c.suspectIfsc} • {c.suspectBank}
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Linked Case ID",
                  render: (c) => (
                    <Link href={`/cases/${c.ncrpId}`} className="font-mono font-bold text-secondary hover:underline">
                      {c.ncrpId}
                    </Link>
                  ),
                },
                {
                  header: "Modus & Victim",
                  render: (c) => (
                    <div>
                      <div className="font-semibold text-xs text-primary">{c.category}</div>
                      <div className="text-[10px] text-on-surface-variant">Victim: {c.victimName} ({c.victimDistrict})</div>
                    </div>
                  ),
                },
                {
                  header: "Siphoned Loss",
                  render: (c) => (
                    <span className="font-mono font-bold text-red-700">
                      {formatCurrencyINR(c.totalLoss)}
                    </span>
                  ),
                },
                {
                  header: "Status",
                  render: (c) => (
                    <Badge variant={c.status === "CRITICAL_TRIAGE" ? "critical" : "navy"}>
                      {c.status.replace(/_/g, " ")}
                    </Badge>
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
                      Inspect Case →
                    </Link>
                  ),
                },
              ]}
              data={MOCK_CASES}
              keyExtractor={(c) => c.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SystemWideSearchPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-on-surface-variant">Loading search query...</div>}>
        <SearchContent />
      </Suspense>
    </AppShell>
  );
}
