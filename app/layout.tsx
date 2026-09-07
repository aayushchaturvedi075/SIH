import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntelliTrace — Predictive Cybercrime Intelligence & Cash-Out Forecasting",
  description:
    "Ministry of Home Affairs & I4C Cybercrime Intelligence and Predictive ATM Cash-Out Interception Platform",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-background text-on-background antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
