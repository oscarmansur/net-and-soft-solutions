import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#030A0E",
};

export const metadata: Metadata = {
  title: "Net & Soft Proposal Builder | Gestión de Propuestas Comerciales",
  description:
    "Sistema corporativo de Net & Soft Solutions para creación, cotización, previsualización en tiempo real y publicación de propuestas comerciales.",
  icons: {
    icon: "/brand/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${montserrat.variable} dark`}>
      <body className="min-h-screen bg-[#030A0E] text-slate-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
