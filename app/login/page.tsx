"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, BadgeCheck, Smartphone, RefreshCw, KeyRound, ArrowRight, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("MHA-UID-8902");
  const [password, setPassword] = useState("••••••••••••");
  const [mfaToken, setMfaToken] = useState("849201");
  const [captcha, setCaptcha] = useState("X7K9P");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Central Login Card */}
      <main className="w-full max-w-[480px] bg-surface-container-lowest border border-outline-variant shadow-lg rounded-sm overflow-hidden relative z-10">
        {/* Accent Top Bar */}
        <div className="h-[4px] w-full bg-secondary-container"></div>

        <div className="p-8">
          {/* Header Branding */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-white mb-3 shadow">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="font-headline-md text-2xl font-bold text-primary tracking-tight">
              IntelliTrace
            </h1>
            <p className="font-body-sm text-xs text-on-surface-variant mt-1 max-w-[320px]">
              Predictive Cybercrime Intelligence &amp; Cash-Out Forecasting System
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-error-container text-on-error-container rounded-sm border border-error-container">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-label-caps text-[10px] uppercase font-bold tracking-wider">
                Authorized Personnel Only
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* User ID */}
            <div>
              <label className="block font-label-caps text-[11px] uppercase font-bold text-on-surface mb-1">
                OFFICIAL USER ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-outline">
                  <BadgeCheck className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter ID (e.g., MHA-UID-8902)"
                  required
                  className="block w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container font-mono text-xs text-on-surface placeholder-outline"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-label-caps text-[11px] uppercase font-bold text-on-surface mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-outline">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-9 pr-10 py-2 bg-surface border border-outline-variant rounded-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container font-mono text-xs text-on-surface"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* MFA Token */}
            <div>
              <label className="block font-label-caps text-[11px] uppercase font-bold text-on-surface mb-1">
                MFA HARDWARE TOKEN / OTP
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-outline">
                  <Smartphone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaToken}
                  onChange={(e) => setMfaToken(e.target.value)}
                  placeholder="------"
                  required
                  className="block w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded-sm focus:ring-1 focus:ring-primary-container focus:border-primary-container font-mono text-xs text-on-surface tracking-widest text-center"
                />
              </div>
            </div>

            {/* Captcha */}
            <div className="flex items-center gap-2 p-2.5 bg-surface-container-low border border-outline-variant rounded-sm">
              <div className="flex-1 bg-surface-container border border-outline px-3 py-1.5 rounded text-center font-mono font-bold tracking-widest text-primary text-sm line-through select-none">
                X7K9P
              </div>
              <button
                type="button"
                className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                title="Refresh Captcha"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="Code"
                  required
                  className="block w-full px-2 py-1 bg-surface border border-outline-variant rounded-sm font-mono text-xs text-center uppercase"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-sm shadow-sm font-label-caps text-xs font-bold text-white bg-primary-container hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary-container transition-colors uppercase mt-4"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Authenticate Session
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Footer Details */}
        <div className="bg-surface-container-low border-t border-outline-variant p-4">
          <ul className="flex flex-col gap-1.5 font-body-sm text-[11px] text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>256-bit AES Hardware Encrypted Connection</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Strict Role-Based Access Control (MHA / I4C Portal)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>All Session Activity is Logged, Timestamped and Audited</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Legal Footnote */}
      <footer className="mt-6 text-center text-on-surface-variant opacity-75 font-body-sm text-xs max-w-lg">
        <p className="font-semibold">Government of India • Ministry of Home Affairs</p>
        <p className="mt-1 text-[10px]">
          Unauthorized access is prohibited and punishable under the Information Technology Act, 2000 &amp; Bharatiya Nyaya Sanhita (BNS).
        </p>
      </footer>
    </div>
  );
}
