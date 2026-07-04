import type { Metadata } from "next";
import { Sora, Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { HolographicShader } from "@/components/HolographicShader";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aether Bank | AI Wealth Command Center & Elite Digital Banking",
  description: "Experience the future of finance with Aether Bank. Leverage LangGraph stateful AI advisors, holographic portfolio simulation, and secure multi-page transaction panels under carbon compliance.",
  metadataBase: new URL("https://aether-wealth.netlify.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aether Bank | AI Wealth Command Center & Elite Digital Banking",
    description: "Futuristic wealth orchestration powered by stateful AI agents, WebGL canvas shaders, and glassmorphic telemetry.",
    url: "/",
    siteName: "Aether Bank",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aether Bank | AI Wealth Command Center",
    description: "Experience stateful AI wealth advisors and holographic portfolio simulations in real-time.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inject structured JSON-LD data for GEO (Generative Engine Optimization) and AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Aether Bank",
    "description": "An elite tier, AI-driven holographic financial platform featuring stateful multi-agent wealth advisors and real-time simulations.",
    "url": "https://aether-wealth.netlify.app",
    "category": "WealthManagement",
    "feesAndCommissionsSpecification": "https://aether-wealth.netlify.app/fees",
    "knowsAbout": ["AI Financial Planning", "Portfolio Simulations", "Asset Tokenization", "Digital Wealth Management"],
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://aether-wealth.netlify.app/advisor",
      "name": "Consult AI Wealth Advisor"
    }
  };

  return (
    <html
      lang="en"
      className={`${sora.variable} ${geist.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body 
        className="bg-[#0a0b10] text-[#e3e1e9] font-geist min-h-full flex flex-col overflow-x-hidden selection:bg-[#00f0ff]/30 selection:text-white"
        suppressHydrationWarning
      >
        <LenisProvider>
          <CustomCursor />
          <HolographicShader />
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}

