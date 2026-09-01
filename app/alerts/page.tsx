"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/common/Badge";
import { MOCK_ALERTS, AlertRecord } from "@/lib/mock-data";
import { formatCurrencyINR, formatTimeCountdown } from "@/lib/utils";
import { dispatchAlertMandate } from "@/lib/api-client";
import {
  BellRing,
  Send,
  ShieldAlert,
  Clock,
  Radio,
  Building2,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Crosshair,
  Filter,
} from "lucide-react";

export default function UnifiedAlertsPage() {
  const [activeTab, setActiveTab] = useState<"TRIAGE" | "DISPATCH_CONSOLE">("TRIAGE");
  const [alerts, setAlerts] = useState<AlertRecord[]>(MOCK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<AlertRecord>(MOCK_ALERTS[0]);
  const [activeSeverity, setActiveSeverity] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");

  // Dispatch Channels Configuration
  const [channels, setChannels] = useState({
    policeRadio: true,
    bankHold: true,
    dotLock: true,
    smsOfficer: true,
  });
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const filteredAlerts = alerts.filter((a) => {
    if (activeSeverity === "ALL") return true;
    return a.severity === activeSeverity;
  });

  const handleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" as const } : a))
    );
  };

  const handleExecuteDispatch = async () => {
    setIsDispatching(true);
    await dispatchAlertMandate({
      alert_id: selectedAlert.id,
      case_ref: selectedAlert.caseId,
      police_radio_broadcast: channels.policeRadio,
      bank_cfcfrms_hold: channels.bankHold,
      telecom_dot_imei_lock: channels.dotLock,
      sms_investigating_officer: channels.smsOfficer,
    });
    setIsDispatching(false);
    setDispatchSuccess(true);
    setAlerts((prev) =>
      prev.map((a) => (a.id === selectedAlert.id ? { ...a, status: "DISPATCHED" as const } : a))
    );
    setTimeout(() => setDispatchSuccess(false), 5000);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-16">
        {/* Header with Unified Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <BellRing className="w-5 h-5 text-red-500 animate-pulse" />
              <span>Operations &amp; Alert Management Center</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              Real-time cyber threat triage and multi-agency Section 91 CrPC statutory emergency dispatch
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-surface-container-high p-1 rounded border border-outline-variant text-xs font-mono">
              <button
                onClick={() => setActiveTab("TRIAGE")}
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                  activeTab === "TRIAGE"
                    ? "bg-primary-container text-white font-bold shadow"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <Filter className="w-3.5 h-3.5" /> Incident Triage Queue ({alerts.length})
              </button>
              <button
                onClick={() => setActiveTab("DISPATCH_CONSOLE")}
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                  activeTab === "DISPATCH_CONSOLE"
                    ? "bg-primary-container text-white font-bold shadow"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <Send className="w-3.5 h-3.5 text-amber-400" /> Statutory Dispatch Console
              </button>
            </div>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-on-surface-variant font-semibold">Filter:</span>
          {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setActiveSeverity(sev)}
              className={`px-3 py-1 rounded transition-colors ${
                activeSeverity === sev
                  ? "bg-primary-container text-white font-bold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {activeTab === "TRIAGE" ? (
          /* Main Alert Triage Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Alerts List */}
            <div className="lg:col-span-2 space-y-3">
              {filteredAlerts.map((alert) => {
                const isSelected = selectedAlert.id === alert.id;
                const windowRemaining = alert.severity === "CRITICAL" ? 18 : alert.severity === "HIGH" ? 34 : 55;
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-4 bg-surface border rounded-sm transition-all cursor-pointer hover:border-primary ${
                      isSelected ? "border-l-4 border-l-amber-500 border-primary shadow-md bg-surface-container-lowest" : "border-outline-variant"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.severity.toLowerCase() as any}>
                          {alert.severity}
                        </Badge>
                        <span className="font-mono text-xs text-on-surface-variant">{alert.id}</span>
                        <span className="text-[10px] font-mono text-slate-400">• {alert.timestamp}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {formatCurrencyINR(alert.amount)}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-primary mt-2">{alert.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{alert.description}</p>

                    <div className="mt-3 pt-2 border-t border-outline-variant flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-on-surface-variant">Location: <strong className="text-primary font-sans">{alert.targetLocation}</strong></span>
                        <span className="text-on-surface-variant flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-red-500" />
                          Window: <strong className="text-red-700">{formatTimeCountdown(windowRemaining)}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {alert.status === "NEW" ? (
                          <button
                            onClick={(e) => handleAcknowledge(alert.id, e)}
                            className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant rounded text-[11px] font-bold transition-colors"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {alert.status}
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setSelectedAlert(alert);
                            setActiveTab("DISPATCH_CONSOLE");
                          }}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Send className="w-3 h-3" /> Quick Dispatch
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Col: Active Alert Inspector */}
            <div className="bg-surface border border-outline-variant rounded-sm p-5 space-y-4 shadow-sm h-fit">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <span className="font-label-caps text-xs text-primary font-bold">ACTIVE INCIDENT INSPECTOR</span>
                <Badge variant={selectedAlert.severity.toLowerCase() as any}>{selectedAlert.severity}</Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase font-mono">Incident ID:</span>
                  <p className="font-mono font-bold text-primary">{selectedAlert.id}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase font-mono">Case File Link:</span>
                  <Link href={`/cases/${selectedAlert.caseId}`} className="font-mono text-secondary hover:underline font-bold flex items-center gap-1">
                    {selectedAlert.caseId} <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase font-mono">Target Sector:</span>
                  <p className="font-sans font-bold text-primary">{selectedAlert.targetLocation}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant text-[10px] uppercase font-mono">Confidence Score:</span>
                  <p className="font-mono font-bold text-emerald-600 text-sm">{selectedAlert.confidenceScore}% (Calibrated)</p>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant space-y-2">
                <button
                  onClick={() => setActiveTab("DISPATCH_CONSOLE")}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-label-caps text-xs rounded uppercase font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-4 h-4" /> Open Statutory Dispatch Console
                </button>
                <Link
                  href="/atm-risk"
                  className="w-full py-2 bg-primary-container hover:bg-secondary text-white font-label-caps text-xs rounded uppercase font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Crosshair className="w-4 h-4 text-amber-400" /> View on Tactical GIS Map
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Consolidated Statutory Dispatch Console */
          <div className="bg-surface border border-outline-variant rounded-sm p-6 lg:p-8 space-y-6 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-4">
              <div>
                <h3 className="font-bold text-base text-primary flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  Section 91 CrPC Statutory Emergency Dispatch Console
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Simultaneous Multi-Channel Broadcast to Police Patrols, Bank CFCFRMS, and DoT Telecommunication Gateways
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-on-surface-variant">Target Incident:</span>
                <span className="font-bold text-primary bg-surface-container px-2 py-1 rounded">{selectedAlert.id}</span>
              </div>
            </div>

            {/* Broadcast Channel Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="p-4 bg-surface-container-low border border-outline-variant rounded-sm flex items-start gap-3 cursor-pointer hover:border-primary">
                <input
                  type="checkbox"
                  checked={channels.policeRadio}
                  onChange={(e) => setChannels((p) => ({ ...p, policeRadio: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Radio className="w-4 h-4 text-blue-600" /> Police Wireless Radio (VHF Channel 4)
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Broadcasts emergency coordinates to nearest Cheetah &amp; PCR mobile patrol units in {selectedAlert.targetLocation}.
                  </p>
                </div>
              </label>

              <label className="p-4 bg-surface-container-low border border-outline-variant rounded-sm flex items-start gap-3 cursor-pointer hover:border-primary">
                <input
                  type="checkbox"
                  checked={channels.bankHold}
                  onChange={(e) => setChannels((p) => ({ ...p, bankHold: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Building2 className="w-4 h-4 text-emerald-600" /> Bank CFCFRMS API Freeze Mandate
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Issues instant automated statutory debit freeze on target Layer-2 and Layer-3 mule accounts under Sec 91 CrPC.
                  </p>
                </div>
              </label>

              <label className="p-4 bg-surface-container-low border border-outline-variant rounded-sm flex items-start gap-3 cursor-pointer hover:border-primary">
                <input
                  type="checkbox"
                  checked={channels.dotLock}
                  onChange={(e) => setChannels((p) => ({ ...p, dotLock: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <PhoneCall className="w-4 h-4 text-saffron" /> DoT Central Equipment IMEI Lock (CEIR)
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Submits blacklisting order to Department of Telecom to disable suspect mobile handset IMEI on national networks.
                  </p>
                </div>
              </label>

              <label className="p-4 bg-surface-container-low border border-outline-variant rounded-sm flex items-start gap-3 cursor-pointer hover:border-primary">
                <input
                  type="checkbox"
                  checked={channels.smsOfficer}
                  onChange={(e) => setChannels((p) => ({ ...p, smsOfficer: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <MessageSquare className="w-4 h-4 text-purple-600" /> Investigating Officer SMS Dispatch
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Sends encrypted SMS flash to the Duty Inspector and State Cyber Cell nodal officers with terminal telemetry.
                  </p>
                </div>
              </label>
            </div>

            {dispatchSuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-600 text-emerald-300 rounded text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>STATUTORY DISPATCH TRANSMITTED ON ALL 4 CHANNELS UNDER CRPC SEC 91 // TRANSACTION LOGGED</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
              <button
                onClick={() => setActiveTab("TRIAGE")}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-caps text-xs rounded uppercase font-bold transition-colors"
              >
                Back to Incident Triage
              </button>
              <button
                onClick={handleExecuteDispatch}
                disabled={isDispatching}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-label-caps text-xs rounded uppercase font-bold transition-colors flex items-center gap-2 shadow-lg shadow-red-950"
              >
                <Send className="w-4 h-4" />
                {isDispatching ? "TRANSMITTING DISPATCH..." : "EXECUTE STATUTORY DISPATCH"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
