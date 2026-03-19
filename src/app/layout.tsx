import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/translations";
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
  title: "Fabrizio Riera Bauer — Portfolio",
  description: "Ingeniero en Informática · Informatics Engineer. Scrollytelling portfolio.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) || "es";

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
      <body className="bg-[#050505] text-[#ededed] min-h-screen flex flex-col font-sans">
        <LanguageProvider initialLocale={locale}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
