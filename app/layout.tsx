import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntelliTrace — Predictive Cybercrime Intelligence & Cash-Out Forecasting",
  description:
    "Ministry of Home Affairs & I4C Cybercrime Intelligence and Predictive ATM Cash-Out Interception Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-background text-on-background antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
