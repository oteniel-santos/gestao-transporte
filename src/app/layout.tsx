import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SyncOnline } from "@/components/SyncOnline";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transporte Escolar - Novo Mundo",
  description: "Gestão do Transporte Escolar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta httpEquiv="Content-Language" content="pt-BR" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f766e" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SyncOnline />
        {children}
      </body>
    </html>
  );
}
