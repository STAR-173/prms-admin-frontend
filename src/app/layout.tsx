import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { FloatingPWAInstall } from "@/components/FloatingPWAInstall";

const inter = Inter({ subsets: ["latin"] });
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#09090b",
};

const APP_NAME = "PRMS Admin Dashboard";
const APP_DEFAULT_TITLE = "PRMS Admin Dashboard";
const APP_DESCRIPTION =
  "Player Relationship Management System - Admin Dashboard";

export const metadata: Metadata = {
  title: APP_DEFAULT_TITLE,
  description: APP_DESCRIPTION,
  manifest: "/manifest/manifest.json",
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_DEFAULT_TITLE,
    description: APP_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/manifest/ios/16.png", sizes: "16x16", type: "image/png" },
      { url: "/manifest/ios/32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/manifest/ios/180.png", sizes: "180x180", type: "image/png" },
      { url: "/manifest/ios/152.png", sizes: "152x152", type: "image/png" },
      { url: "/manifest/ios/120.png", sizes: "120x120", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#09090b",
    "msapplication-TileImage":
      "/manifest/windows11/Square150x150Logo.scale-200.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#09090b] text-white antialiased`}
      >
        {/* We wrap everything in Providers to ensure State Management works everywhere */}
        <Providers>{children}</Providers>

        {/* Floating PWA Install Button */}
        <FloatingPWAInstall />
      </body>
    </html>
  );
}
