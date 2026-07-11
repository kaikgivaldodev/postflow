import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "PostFlow — Agende seus posts no Instagram. Durma tranquilo.",
    template: "%s — PostFlow",
  },
  description:
    "PostFlow publica seu conteúdo no horário certo, mesmo quando você está offline. Conecte sua conta, agende seus posts e acompanhe tudo no calendário.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://postflow.app"
  ),
  openGraph: {
    title: "PostFlow — Agende seus posts no Instagram. Durma tranquilo.",
    description:
      "Agende. Publique. Cresça. Automatize seu Instagram com o PostFlow.",
    url: "/",
    siteName: "PostFlow",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostFlow — Agende seus posts no Instagram. Durma tranquilo.",
    description:
      "Agende. Publique. Cresça. Automatize seu Instagram com o PostFlow.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "facebook-domain-verification": "6m1lamjxOhb0zo86xs382r0ivmoddi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
