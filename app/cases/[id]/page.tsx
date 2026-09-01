"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { SensitiveData } from "@/components/common/SensitiveData";
import { NetworkGraph } from "@/components/visualizations/NetworkGraph";
import { FundFlowDiagram } from "@/components/visualizations/FundFlowDiagram";
import { PredictionCurve } from "@/components/visualizations/PredictionCurve";
import { MOCK_CASES } from "@/lib/mock-data";
import { formatCurrencyINR } from "@/lib/utils";
import {
  FileSearch,
  User,
  Phone,
  Landmark,
  Smartphone,
  Globe,
  Clock,
  ShieldAlert,
  Send,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function CaseIntelligencePage({ params }: { params: { id: string } }) {
  const caseId = params?.id || "NCRP-DEMO-894321";
  const caseData = MOCK_CASES.find((c) => c.ncrpId === caseId) || MOCK_CASES[0];

  const [activeTab, setActiveTab] = useState<"network" | "fundflow" | "prediction">("network");

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Case Header Banner */}
        <div className="bg-primary px-6 py-4 rounded-sm text-white shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-amber-500">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-lg font-bold text-amber-400">{caseData.ncrpId}</span>
              <Badge variant="critical">CRITICAL TRIAGE</Badge>
              <span className="text-xs text-primary-fixed-dim font-mono">
                ACK: {caseData.acknowledgementNo}
              </span>
            </div>
            <h1 className="font-headline-md text-xl font-bold text-white">
              {caseData.subCategory}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Reported: <span className="font-mono font-semibold">{caseData.reportedDate}</span> • Jurisdiction:{" "}
              <span className="font-semibold">{caseData.victimDistrict}, {caseData.victimState}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dispatch"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ba1a1a] hover:bg-red-800 text-white font-label-caps text-xs rounded uppercase font-bold transition-colors shadow"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch 1930 Notice
            </Link>
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-blue-800 text-white font-label-caps text-xs rounded uppercase font-bold transition-colors shadow"
            >
              <Download className="w-3.5 h-3.5" /> Official Case Dossier
            </Link>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Defrauded Loss"
            value={formatCurrencyINR(caseData.totalLoss)}
            accentColor="red"
            subtitle="Transferred via RTGS/IMPS"
            icon={<ShieldAlert className="w-5 h-5 text-red-700" />}
          />
          <StatCard
            title="Amount Secured / Frozen"
            value={formatCurrencyINR(caseData.blockedAmount)}
            change={`${caseData.recoveryRate}% Secured`}
            changeType="positive"
            accentColor="emerald"
            subtitle="Across Layer 1 & 2 Mules"
            icon={<Lock className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="AI Cash-Out Likelihood"
            value={`${caseData.cashOutLikelihood}%`}
            change={`Window: T+${caseData.timeToWithdrawMin}m`}
            changeType="urgent"
            accentColor="saffron"
            subtitle={caseData.predictedAtmName}
            icon={<Clock className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Syndicate Cluster Risk Score"
            value={`${caseData.riskScore} / 100`}
            change="High Confidence Match"
            changeType="negative"
            accentColor="navy"
            subtitle="Linked to 14 other NCRP cases"
            icon={<AlertTriangle className="w-5 h-5 text-secondary" />}
          />
        </div>

        {/* Two-Column Forensics Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Victim Profile Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-3">
            <div className="pb-2 border-b border-outline-variant flex items-center justify-between">
              <span className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <User className="w-4 h-4 text-secondary" /> Victim Demographics
              </span>
              <Badge variant="navy">VERIFIED AADHAAR</Badge>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Full Name:</span>
                <span className="font-bold text-primary">{caseData.victimName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Phone:</span>
                <SensitiveData value={caseData.victimPhone} type="phone" />
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Location:</span>
                <span>{caseData.victimDistrict}, {caseData.victimState}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-surface-container">
                <span className="text-on-surface-variant">Crime Modus:</span>
                <span className="text-red-700 font-semibold">{caseData.subCategory}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-on-surface-variant">Initial Deposit A/C:</span>
                <SensitiveData value="109283746152" type="account" />
              </div>
            </div>
          </div>

          {/* Suspect Digital Footprints */}
          <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-3">
            <div className="pb-2 border-b border-outline-variant flex items-center justify-between">
              <span className="font-label-caps text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-red-600" /> Primary Suspect &amp; Mule Infrastructure
              </span>
              <Badge variant="critical">SYNDICATE NODE #NCR-04</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Suspect Mule Account:</span>
                  <SensitiveData value={caseData.suspectAccount} type="account" />
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Bank &amp; IFSC:</span>
                  <span className="font-mono font-semibold">{caseData.suspectBank} ({caseData.suspectIfsc})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">UPI VPA Handle:</span>
                  <span className="font-mono font-semibold text-secondary">{caseData.suspectUpi}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Suspect Phone (CDR):</span>
                  <SensitiveData value={caseData.suspectPhone} type="phone" />
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Device IMEI:</span>
                  <span className="font-mono">{caseData.suspectImei}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container">
                  <span className="text-on-surface-variant">Origin IP:</span>
                  <SensitiveData value={caseData.suspectIp} type="ip" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Forensics Analysis Tabs (Network / Fund Flow / Prediction) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-outline-variant pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("network")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  activeTab === "network"
                    ? "bg-primary-container text-white shadow-sm"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                1. Fraud Syndicate Network Graph
              </button>
              <button
                onClick={() => setActiveTab("fundflow")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  activeTab === "fundflow"
                    ? "bg-primary-container text-white shadow-sm"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                2. Fund Flow Layering &amp; Freezes
              </button>
              <button
                onClick={() => setActiveTab("prediction")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  activeTab === "prediction"
                    ? "bg-primary-container text-white shadow-sm"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                3. Cash-Out Prediction Curve
              </button>
            </div>
            <Link href="/network" className="text-xs text-secondary font-bold hover:underline">
              Open Fullscreen Forensics →
            </Link>
          </div>

          <div>
            {activeTab === "network" && <NetworkGraph />}
            {activeTab === "fundflow" && <FundFlowDiagram />}
            {activeTab === "prediction" && (
              <PredictionCurve
                currentMinute={caseData.timeToWithdrawMin}
                predictedAtm={caseData.predictedAtmName}
                confidenceScore={caseData.cashOutLikelihood}
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
