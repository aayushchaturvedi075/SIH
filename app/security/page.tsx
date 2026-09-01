"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { SensitiveData } from "@/components/common/SensitiveData";
import { ShieldCheck, Key, Lock, Users, Activity, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

interface OfficerSession {
  sessionId: string;
  officerName: string;
  role: string;
  ipAddress: string;
  loginTime: string;
  station: string;
  status: "ACTIVE" | "EXPIRED";
}

export default function SecurityPage() {
  const [sessions, setSessions] = useState<OfficerSession[]>([
    {
      sessionId: "SES-2026-9812",
      officerName: "Shri Vikramaditya K., IPS",
      role: "Superintendent (Cyber Command)",
      ipAddress: "10.45.12.89",
      loginTime: "01-Sep-2026 18:30 IST",
      station: "MHA Cyber Command, New Delhi",
      status: "ACTIVE",
    },
    {
      sessionId: "SES-2026-9813",
      officerName: "Insp. Rajeev Sharma",
      role: "Investigating Officer (IO)",
      ipAddress: "10.45.88.14",
      loginTime: "01-Sep-2026 19:15 IST",
      station: "Sector 36 Cyber PS, Noida",
      status: "ACTIVE",
    },
    {
      sessionId: "SES-2026-9814",
      officerName: "Sub-Insp. Amit Patel",
      role: "Field Intercept Lead",
      ipAddress: "10.45.92.77",
      loginTime: "01-Sep-2026 19:38 IST",
      station: "Sector 58 PS / Cheetah Unit 09",
      status: "ACTIVE",
    },
  ]);

  const handleTerminateSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    alert(`Session ${sessionId} revoked and terminated immediately.`);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
                Security, Role-Based Access &amp; Audit Governance
              </h1>
              <Badge variant="navy">STRICT RBAC ENFORCED</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Cryptographic hardware key validation, zero-trust session management, and immutable legal audit logs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Audit log export generated with SHA256 integrity seal.")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container hover:bg-secondary text-white font-label-caps text-xs rounded uppercase font-bold transition-colors shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Export Signed Audit Log
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Officer Sessions"
            value="3 Logged In"
            change="Zero Anomalous Logins"
            changeType="positive"
            accentColor="emerald"
            subtitle="MHA VPN Dedicated Network"
            icon={<Users className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="API Keys &amp; Certificates"
            value="6 Active Keys"
            change="Hardware Token Signed"
            changeType="positive"
            accentColor="navy"
            subtitle="NPCI, DoT, RBI Gateways"
            icon={<Key className="w-5 h-5 text-secondary" />}
          />
          <StatCard
            title="Audit Trail Records (24h)"
            value="142,900 Ops"
            change="100% Hash Verifiable"
            changeType="positive"
            accentColor="emerald"
            subtitle="Write-Once-Read-Many (WORM)"
            icon={<Activity className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="MHA Compliance Status"
            value="100% Compliant"
            change="IT Act Sec 43A / BNS"
            changeType="positive"
            accentColor="saffron"
            subtitle="Govt of India Cyber Security Standard"
            icon={<Lock className="w-5 h-5 text-amber-600" />}
          />
        </div>

        {/* Active Sessions Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-4">
          <div className="pb-2 border-b border-outline-variant">
            <h3 className="font-label-caps text-xs uppercase font-bold text-primary">
              Active Authorized Officer Sessions Under Monitoring
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              Live sessions authenticated via MHA UID and hardware MFA token
            </p>
          </div>

          <DataTable
            columns={[
              {
                header: "Officer & Role",
                render: (s) => (
                  <div>
                    <span className="font-bold text-xs text-primary">{s.officerName}</span>
                    <div className="text-[10px] text-secondary font-semibold">{s.role}</div>
                  </div>
                ),
              },
              {
                header: "Station / Jurisdiction",
                render: (s) => (
                  <span className="text-xs text-primary font-semibold">{s.station}</span>
                ),
              },
              {
                header: "Internal IP",
                render: (s) => (
                  <SensitiveData value={s.ipAddress} type="ip" />
                ),
              },
              {
                header: "Login Timestamp",
                render: (s) => (
                  <span className="font-mono text-xs text-on-surface-variant">{s.loginTime}</span>
                ),
              },
              {
                header: "Session Status",
                render: (s) => (
                  <Badge variant="success">{s.status}</Badge>
                ),
              },
              {
                header: "Action",
                align: "right",
                render: (s) => (
                  <button
                    onClick={() => handleTerminateSession(s.sessionId)}
                    className="px-2.5 py-1 bg-surface-container-high hover:bg-error hover:text-white rounded text-[11px] font-semibold transition-colors"
                  >
                    Revoke Session
                  </button>
                ),
              },
            ]}
            data={sessions}
            keyExtractor={(s) => s.sessionId}
          />
        </div>
      </div>
    </AppShell>
  );
}
