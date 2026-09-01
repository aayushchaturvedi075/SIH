"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/common/Badge";
import { DataTable } from "@/components/common/DataTable";
import { CheckSquare, Clock, AlertCircle, CheckCircle2, FileText, ArrowRight, ShieldCheck } from "lucide-react";

interface ActionTask {
  id: string;
  title: string;
  category: "FREEZE_APPROVAL" | "WARRANT_SIGN" | "EVIDENCE_REVIEW" | "PATROL_DEBRIEF";
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  caseRef: string;
  deadline: string;
  status: "PENDING" | "COMPLETED";
}

export default function ActionCenterPage() {
  const [tasks, setTasks] = useState<ActionTask[]>([
    {
      id: "TSK-2026-901",
      title: "Authorize CFCFRMS Hold Order for 3 Layer-2 Mule Accounts (Noida)",
      category: "FREEZE_APPROVAL",
      priority: "CRITICAL",
      caseRef: "NCRP-DEMO-894321",
      deadline: "In 15 mins (20:15 IST)",
      status: "PENDING",
    },
    {
      id: "TSK-2026-902",
      title: "Digital Signature on Section 91 CrPC Notice to SBI & ICICI Bank",
      category: "WARRANT_SIGN",
      priority: "CRITICAL",
      caseRef: "NCRP-DEMO-894323",
      deadline: "In 30 mins (20:30 IST)",
      status: "PENDING",
    },
    {
      id: "TSK-2026-903",
      title: "Verify Telecom CDR Cell Tower Coordinates for Suspect Handset",
      category: "EVIDENCE_REVIEW",
      priority: "HIGH",
      caseRef: "NCRP-DEMO-894322",
      deadline: "Today (22:00 IST)",
      status: "PENDING",
    },
    {
      id: "TSK-2026-904",
      title: "Post-Intercept Interrogation Report Submission (Cheetah Unit 09)",
      category: "PATROL_DEBRIEF",
      priority: "MEDIUM",
      caseRef: "NCRP-DEMO-894318",
      deadline: "Tomorrow (10:00 IST)",
      status: "COMPLETED",
    },
  ]);

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "COMPLETED" } : t))
    );
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1600px] mx-auto w-full pb-10">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl lg:text-2xl font-bold text-primary tracking-tight">
                My Action Center &amp; Officer Task Board
              </h1>
              <Badge variant="navy">SUPERINTENDENT DESK</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Officer: <strong>Shri Vikramaditya K., IPS</strong> • Pending statutory approvals, hold orders, and case reviews
            </p>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Freeze Orders"
            value="2 Mandates"
            change="Action Needed < 30m"
            changeType="urgent"
            accentColor="red"
            subtitle="CFCFRMS Signoff"
            icon={<AlertCircle className="w-5 h-5 text-red-700" />}
          />
          <StatCard
            title="Active Warrants Pending"
            value="1 Notice"
            change="Sec 91 CrPC Bank Directive"
            changeType="negative"
            accentColor="saffron"
            subtitle="SBI &amp; ICICI Core Banking"
            icon={<FileText className="w-5 h-5 text-amber-600" />}
          />
          <StatCard
            title="Tasks Completed Today"
            value="14 Actions"
            change="100% SLA Compliance"
            changeType="positive"
            accentColor="emerald"
            subtitle="Avg Sign Time: 3.4 mins"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />}
          />
          <StatCard
            title="Secured Funds by Officer"
            value="₹4.82 Cr"
            change="This Month (Sep 2026)"
            changeType="positive"
            accentColor="navy"
            subtitle="76.4% Recovery Rate"
            icon={<ShieldCheck className="w-5 h-5 text-secondary" />}
          />
        </div>

        {/* Tasks Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-sm p-4 space-y-4">
          <div className="pb-2 border-b border-outline-variant">
            <h3 className="font-label-caps text-xs uppercase font-bold text-primary">
              Assigned Tasks &amp; Statutory Approvals Queue
            </h3>
            <p className="text-[11px] text-on-surface-variant">
              High-priority tasks requiring officer digital signature or decision
            </p>
          </div>

          <DataTable
            columns={[
              {
                header: "Task ID & Case Ref",
                render: (t) => (
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">{t.id}</span>
                    <div className="font-mono text-[10px] text-secondary">
                      <Link href={`/cases/${t.caseRef}`} className="hover:underline">
                        {t.caseRef}
                      </Link>
                    </div>
                  </div>
                ),
              },
              {
                header: "Task Description",
                render: (t) => (
                  <div>
                    <span className="font-bold text-xs text-primary">{t.title}</span>
                    <div className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">
                      Category: {t.category.replace(/_/g, " ")}
                    </div>
                  </div>
                ),
              },
              {
                header: "Priority",
                render: (t) => (
                  <Badge variant={t.priority === "CRITICAL" ? "critical" : t.priority === "HIGH" ? "medium" : "low"}>
                    {t.priority}
                  </Badge>
                ),
              },
              {
                header: "Deadline",
                render: (t) => (
                  <span className="font-mono text-xs font-semibold text-red-700">{t.deadline}</span>
                ),
              },
              {
                header: "Status",
                render: (t) => (
                  <Badge variant={t.status === "PENDING" ? "medium" : "success"}>
                    {t.status}
                  </Badge>
                ),
              },
              {
                header: "Action",
                align: "right",
                render: (t) => (
                  <div>
                    {t.status === "PENDING" ? (
                      <button
                        onClick={() => handleComplete(t.id)}
                        className="px-3 py-1 bg-primary-container hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Approve &amp; Sign
                      </button>
                    ) : (
                      <span className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Signed
                      </span>
                    )}
                  </div>
                ),
              },
            ]}
            data={tasks}
            keyExtractor={(t) => t.id}
          />
        </div>
      </div>
    </AppShell>
  );
}
