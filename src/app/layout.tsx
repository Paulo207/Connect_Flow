import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConnectFlow - WhatsApp Instance Manager",
  description: "Manage your WhatsApp instances and webhooks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen`}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
