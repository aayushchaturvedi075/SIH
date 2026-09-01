"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/common/Badge";
import { SensitiveData } from "@/components/common/SensitiveData";
import { formatCurrencyINR } from "@/lib/utils";
import { anchorCaseEvidence } from "@/lib/api-client";
import { Printer, Download, Shield, FileText, CheckCircle2, ArrowLeft, Link2, ExternalLink, Cpu } from "lucide-react";

export default function OfficialReportPage() {
  const [isAnchoring, setIsAnchoring] = useState(false);
  const [blockchainProof, setBlockchainProof] = useState<any>({
    status: "ANCHORED_TO_BLOCKCHAIN_SUCCESSFULLY",
    case_id: "NCRP-DEMO-894321",
    merkle_root: "7D6631B7F127C58B868BE2E56DAE4E59F1F3507B98234",
    blockchain_tx: {
      network: "Algorand Testnet",
      txId: "ALGO-TX-7XKQ8J90123LMN894321",
      round: 41298412,
      explorerUrl: "https://testnet.algoexplorer.io/tx/ALGO-TX-7XKQ8J90123LMN894321",
      timestamp: "2026-09-01T19:50:00Z",
    },
    section_65b_certificate: {
      certificate_id: "CERT-SEC65B-894321",
      statutory_reference: "Section 65B Indian Evidence Act, 1872 / Section 63 BSA 2023",
      hash_verification_status: "VERIFIED_TAMPER_PROOF",
    },
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAnchorToAlgorand = async () => {
    setIsAnchoring(true);
    const proof = await anchorCaseEvidence({
      ncrp_id: "NCRP-DEMO-894321",
      total_loss_inr: 4250000.0,
      victim_token: "TOK_ARVIND_UP_NOIDA",
      target_atm: "ATM-UP-NOI-042",
      reported_timestamp: "2026-09-01T19:42:15Z",
    });
    setBlockchainProof(proof);
    setIsAnchoring(false);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1100px] mx-auto w-full pb-16">
        {/* Action Header (Hidden in Print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <Link
              href="/cases/NCRP-DEMO-894321"
              className="inline-flex items-center gap-1 text-xs text-secondary hover:underline font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Case Investigation
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAnchorToAlgorand}
              disabled={isAnchoring}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy-800 hover:bg-navy-700 text-saffron border border-navy-600 font-label-caps text-xs rounded uppercase font-bold transition-colors shadow-md"
            >
              <Cpu className="w-4 h-4" /> {isAnchoring ? "Committing to Algorand..." : "Anchor to Algorand (Sec 65B)"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-container hover:bg-secondary text-white font-label-caps text-xs rounded uppercase font-bold transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" /> Print / Save as Official PDF
            </button>
          </div>
        </div>

        {/* Blockchain Evidence Certificate Banner (Layer 11) */}
        {blockchainProof && (
          <div className="no-print p-4 bg-navy-950 border-2 border-saffron/40 rounded-lg text-white shadow-xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-navy-800 pb-2">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-saffron animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-wider text-saffron">
                  Layer 11: Algorand Testnet Immutable Evidence Anchor Active
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                ✓ SECTION 65B / 63 BSA COMPLIANT
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-1">
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Algorand TxID:</span>
                <p className="text-blue-400 font-bold truncate">{blockchainProof.blockchain_tx.txId}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Merkle Evidence Root:</span>
                <p className="text-saffron font-bold truncate">{blockchainProof.merkle_root}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase">Testnet Block Round:</span>
                <p className="text-white font-bold">Round #{blockchainProof.blockchain_tx.round}</p>
              </div>
            </div>
          </div>
        )}

        {/* Printable Official Dossier Container */}
        <div className="bg-white border-2 border-primary-container p-8 lg:p-12 text-on-surface shadow-xl space-y-8 font-sans">
          {/* Official Emblem & Top Letterhead */}
          <div className="text-center border-b-2 border-primary-container pb-6 space-y-2">
            <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center mx-auto mb-2 shadow">
              <Shield className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="font-display-lg text-lg lg:text-xl font-bold uppercase tracking-wider text-primary">
              GOVERNMENT OF INDIA • MINISTRY OF HOME AFFAIRS
            </h2>
            <h3 className="font-headline-sm text-base font-bold text-secondary tracking-wide">
              INDIAN CYBER CRIME COORDINATION CENTRE (I4C)
            </h3>
            <p className="font-mono text-xs text-on-surface-variant font-semibold">
              NATIONAL CYBERCRIME FORENSIC INTELLIGENCE DOSSIER
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant border-t border-surface-container mt-3">
              <span>DOSSIER REF: <strong>I4C/MHA/FORENSIC/2026/894321</strong></span>
              <span>CLASSIFICATION: <strong>CONFIDENTIAL // LAW ENFORCEMENT ONLY</strong></span>
              <span>DATE: <strong>01-SEP-2026 19:50 IST</strong></span>
            </div>
          </div>

          {/* Section 1: Executive Incident Summary */}
          <div className="space-y-3">
            <h4 className="font-label-caps text-xs uppercase font-bold bg-primary-container text-white px-3 py-1 tracking-wider">
              1. EXECUTIVE INCIDENT SUMMARY &amp; NCRP REGISTRATION
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div><strong>NCRP Portal Ref:</strong> <span className="font-mono">NCRP-DEMO-894321</span></div>
                <div><strong>Acknowledgement No:</strong> <span className="font-mono">202609019842100</span></div>
                <div><strong>Crime Classification:</strong> Financial Cyber Fraud (Digital Arrest / Impersonation)</div>
                <div><strong>Victim Name:</strong> Dr. Arvind Rameshwar (Age 58)</div>
                <div><strong>Victim Location:</strong> Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh</div>
              </div>
              <div className="space-y-1.5 font-mono text-right">
                <div><strong>Total Defrauded Loss:</strong> <span className="text-red-700 font-bold">₹42,50,000/-</span></div>
                <div><strong>Total Secured / Frozen:</strong> <span className="text-emerald-700 font-bold">₹31,00,000/- (72.9%)</span></div>
                <div><strong>Amount at Imminent Risk:</strong> <span className="text-amber-700 font-bold">₹11,50,000/-</span></div>
                <div><strong>Investigation Lead:</strong> UP Cyber Police Station, Sector 36 Noida</div>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Suspect & Mule Account Forensics */}
          <div className="space-y-3">
            <h4 className="font-label-caps text-xs uppercase font-bold bg-primary-container text-white px-3 py-1 tracking-wider">
              2. PRIMARY ACCUSED &amp; MULE INFRASTRUCTURE FORENSICS
            </h4>
            <table className="w-full text-left text-xs border border-outline-variant border-collapse">
              <thead className="bg-surface-container font-label-caps text-[11px]">
                <tr>
                  <th className="p-2 border border-outline-variant">Entity Type</th>
                  <th className="p-2 border border-outline-variant">Identifier</th>
                  <th className="p-2 border border-outline-variant">Institution / Carrier</th>
                  <th className="p-2 border border-outline-variant">Statutory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-mono">
                <tr>
                  <td className="p-2 border border-outline-variant font-sans font-semibold">Primary Inflow Account</td>
                  <td className="p-2 border border-outline-variant font-bold">918230918234</td>
                  <td className="p-2 border border-outline-variant">State Bank of India (SBIN0001423)</td>
                  <td className="p-2 border border-outline-variant text-red-700 font-bold">HOLD ORDER ISSUED</td>
                </tr>
                <tr>
                  <td className="p-2 border border-outline-variant font-sans font-semibold">UPI VPA Handle</td>
                  <td className="p-2 border border-outline-variant font-bold">paytmqr.283910@paytm</td>
                  <td className="p-2 border border-outline-variant">Paytm Payments Bank / NPCI</td>
                  <td className="p-2 border border-outline-variant text-red-700 font-bold">VPA BLACKLISTED</td>
                </tr>
                <tr>
                  <td className="p-2 border border-outline-variant font-sans font-semibold">Suspect Handset IMEI</td>
                  <td className="p-2 border border-outline-variant font-bold">867543029182736</td>
                  <td className="p-2 border border-outline-variant">DoT TAFCOP Central Registry</td>
                  <td className="p-2 border border-outline-variant text-emerald-700 font-bold">CELL TOWER TRACKED</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Predictive Cash-Out Interception Window */}
          <div className="space-y-3">
            <h4 className="font-label-caps text-xs uppercase font-bold bg-primary-container text-white px-3 py-1 tracking-wider">
              3. PREDICTIVE CASH-OUT INTERCEPTION &amp; PATROL DEPLOYMENT
            </h4>
            <div className="p-4 bg-surface-container-low border border-outline-variant text-xs space-y-2">
              <p>
                IntelliTrace AI Model <strong>CrimeFlow-XGB-v4.2</strong> has projected a <strong>94.2% confidence</strong> of imminent physical cash-out at:
              </p>
              <div className="font-mono font-bold text-sm text-primary">
                TARGET TERMINAL: HDFC Bank E-Lobby, Plot B-9, Sector 62 Institutional Area, Noida
              </div>
              <p>
                <strong>Patrol Dispatch:</strong> Sector 58 Police Station Cheetah Unit 04 deployed with GPS tracking. Estimated Intercept ETA: <strong>2.4 minutes</strong>.
              </p>
            </div>
          </div>

          {/* Section 4: Forensic Sign-Off & Official Seal */}
          <div className="pt-8 border-t-2 border-primary-container flex justify-between items-end text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Cryptographically Anchored to Algorand Blockchain
              </div>
              <p className="text-[10px] text-on-surface-variant font-mono">
                Blockchain TxID: <strong>{blockchainProof.blockchain_tx.txId}</strong> (Round #{blockchainProof.blockchain_tx.round})
              </p>
              <p className="text-[10px] text-on-surface-variant font-mono">
                Merkle Root: <code>{blockchainProof.merkle_root}</code>
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="h-10"></div>
              <p className="font-bold text-primary">Shri Vikramaditya K., IPS</p>
              <p className="text-on-surface-variant text-[11px]">Superintendent of Police (Cyber Intelligence)</p>
              <p className="text-[10px] text-on-surface-variant font-mono">Ministry of Home Affairs, New Delhi</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
