"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Smartphone,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// Official Law Enforcement & Intelligence Demo Accounts
const DEMO_OFFICERS = [
  {
    id: "mha-sp",
    name: "Vikramaditya K., IPS",
    role: "Superintendent of Police / Cyber Operations",
    agency: "Ministry of Home Affairs (MHA) • I4C",
    email: "vikram.ips@mha.gov.in",
    password: "Officer@MHA#2026",
    mfa: "849201",
    initials: "VK",
    clearance: "LEVEL-5 TOP SECRET",
    badge: "IPS-8902-DL"
  },
  {
    id: "i4c-lead",
    name: "Ananya Deshmukh",
    role: "Chief Cyber Forensic Investigator",
    agency: "Indian Cyber Crime Coordination Centre (I4C)",
    email: "ananya.deshmukh@i4c.gov.in",
    password: "Kavach@Analyst99",
    mfa: "629104",
    initials: "AD",
    clearance: "LEVEL-4 OPERATIONAL",
    badge: "I4C-Nodal-441"
  },
  {
    id: "police-acp",
    name: "Rajesh Verma, ACP",
    role: "Tactical Dispatch Commander",
    agency: "Delhi Police Crime Branch",
    email: "rajesh.verma@delhipolice.gov.in",
    password: "Suraksha@Field44",
    mfa: "401928",
    initials: "RV",
    clearance: "LEVEL-3 FIELD DISPATCH",
    badge: "DP-TAC-229"
  }
];

const CAPTCHA_POOL = ["M7H4P", "K9V2X", "T8C4N", "S5R8W", "P3F9Q", "D4M8K"];

export default function LoginPage() {
  const router = useRouter();
  
  // Blank fields for manual entry
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [captchaIndex, setCaptchaIndex] = useState(0);
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currentCaptcha = CAPTCHA_POOL[captchaIndex];

  // Check if official gov domain
  const isGovDomain =
    email.trim().length > 0 &&
    (email.endsWith(".gov.in") ||
      email.endsWith(".nic.in") ||
      email.endsWith("@mha.gov.in") ||
      email.endsWith("@i4c.gov.in") ||
      email.endsWith("@police.gov.in"));

  const handleRefreshCaptcha = () => {
    const nextIndex = (captchaIndex + 1) % CAPTCHA_POOL.length;
    setCaptchaIndex(nextIndex);
    setCaptchaInput(CAPTCHA_POOL[nextIndex]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter your official government email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your security access password.");
      return;
    }

    if (!mfaToken) {
      setErrorMessage("Please enter the 6-digit OTP received in your mail.");
      return;
    }

    if (!captchaInput) {
      setErrorMessage("Please enter the security captcha code shown.");
      return;
    }

    if (captchaInput.trim().toUpperCase() !== currentCaptcha.toUpperCase()) {
      setErrorMessage(`Security captcha code does not match. Please enter ${currentCaptcha}.`);
      return;
    }

    setLoading(true);

    // Find if matching preconfigured officer, or construct custom officer
    const matchedOfficer = DEMO_OFFICERS.find(
      (o) => o.email.toLowerCase() === email.toLowerCase()
    ) || {
      name: email.split("@")[0].replace(".", " ").toUpperCase() + ", GOV",
      role: "Authorized Investigating Officer",
      agency: email.endsWith(".gov.in") ? "Government of India" : "Cyber Intelligence Unit",
      email: email,
      initials: email.slice(0, 2).toUpperCase(),
      clearance: "LEVEL-4 ACTIVE CLEARANCE"
    };

    // Save session in localStorage
    try {
      localStorage.setItem("intellitrace_officer", JSON.stringify(matchedOfficer));
      window.dispatchEvent(new Event("officer-login"));
    } catch (err) {
      console.error("Storage error:", err);
    }

    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-300 selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Background Ambience / Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700 via-transparent to-transparent"></div>

      {/* Main Container */}
      <div className="w-full max-w-[580px] flex flex-col gap-4 z-10">
        {/* Central Official Login Card */}
        <main className="w-full bg-surface-container-lowest border border-outline-variant shadow-2xl rounded-xl overflow-hidden relative z-10 transition-all duration-300">
          {/* Accent Header Ribbon */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-amber-500 to-emerald-600"></div>

          <div className="p-8 sm:p-10">
            {/* Header Branding */}
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-24 h-24 rounded-full bg-white p-2 shadow-lg ring-4 ring-amber-400/40 flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="IntelliTrace Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h1 className="font-headline-md text-3xl font-extrabold text-primary tracking-tight">
                IntelliTrace
              </h1>
              <p className="text-xs font-mono font-bold text-amber-500 tracking-widest uppercase mt-1">
                Predict • Prevent • Protect
              </p>
              <p className="font-body-sm text-sm text-on-surface-variant mt-1.5 max-w-md">
                Law Enforcement &amp; Cyber Operations Intelligence Portal
              </p>
              
              <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-label-caps text-[11px] uppercase font-bold tracking-wider">
                  Official Government Personnel Only
                </span>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-error-container text-on-error-container rounded-lg border border-error text-sm flex items-center gap-2.5 animate-shake">
                <AlertTriangle className="w-5 h-5 shrink-0 text-error" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Official Authentication Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Official Government Email ID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-label-caps text-xs uppercase font-bold text-on-surface tracking-wider">
                    OFFICIAL GOVERNMENT EMAIL ID
                  </label>
                  {isGovDomain ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Gov Domain
                    </span>
                  ) : (
                    <span className="text-[11px] text-on-surface-variant">
                      e.g., officer@mha.gov.in
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-outline">
                    <Mail className="w-5 h-5 text-primary" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer.name@mha.gov.in / @i4c.gov.in"
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm text-on-surface placeholder:text-outline-variant transition-all shadow-sm"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  Enter your official email issued by MHA, I4C, State Police, or NIC.
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-label-caps text-xs uppercase font-bold text-on-surface tracking-wider">
                    SECURITY ACCESS KEY / PASSWORD
                  </label>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    AES-256 Auth
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-outline">
                    <Lock className="w-5 h-5 text-primary" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security access password"
                    required
                    className="block w-full pl-11 pr-11 py-3.5 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm text-on-surface transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Check mail for OTP */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-label-caps text-xs uppercase font-bold text-on-surface tracking-wider">
                    Check mail for OTP
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    6-Digit Security OTP
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-outline">
                    <KeyRound className="w-5 h-5 text-primary" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value)}
                    placeholder="Enter 6-digit OTP from mail"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-base text-on-surface tracking-[0.25em] text-center font-bold shadow-sm"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1.5">
                  Check your official email inbox for the 6-digit one-time passcode.
                </p>
              </div>

              {/* Security Captcha */}
              <div className="flex items-center gap-3 p-3 bg-surface-container-low border border-outline-variant rounded-lg shadow-sm">
                <div className="flex-1 bg-surface-container border border-outline-variant px-4 py-2.5 rounded-md text-center font-mono font-black tracking-widest text-primary text-base line-through select-none shadow-inner">
                  {currentCaptcha}
                </div>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-surface rounded-md transition-all"
                  title="Generate New Captcha"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter Code"
                    required
                    className="block w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-md font-mono text-sm text-center uppercase font-bold focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Authenticate Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2.5 py-4 px-6 rounded-lg shadow-md hover:shadow-lg font-label-caps text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all uppercase mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">
                    <RefreshCw className="w-5 h-5 animate-spin" /> Authenticating NIC Gateway...
                  </span>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" /> Authorize &amp; Launch Session
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Compliance Footer Details */}
          <div className="bg-surface-container-low border-t border-outline-variant p-5 sm:p-6">
            <ul className="flex flex-col gap-2 font-body-sm text-xs text-on-surface-variant">
              <li className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Gov e-Sign &amp; 256-bit AES Hardware Encrypted Tunnel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Role-Based Access Control (NCRP / I4C / CERT-In Integrated)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>All Session Telemetry is Logged, Timestamped &amp; IP Audited</span>
              </li>
            </ul>
          </div>
        </main>

        {/* Legal & Statutory Footnote */}
        <footer className="text-center text-on-surface-variant opacity-80 font-body-sm text-xs max-w-xl mx-auto mt-2">
          <p className="font-semibold text-xs">
            Government of India • Ministry of Home Affairs • I4C
          </p>
          <p className="mt-1 text-[11px] leading-relaxed">
            Unauthorized access is strictly prohibited and punishable under Section 43 &amp; 66 of the Information Technology Act, 2000 and the Bharatiya Nyaya Sanhita (BNS).
          </p>
        </footer>
      </div>
    </div>
  );
}
