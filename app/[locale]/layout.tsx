import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import PlausibleProvider from "next-plausible";
import { publicEnv } from "@/lib/env/public-env";
import { userServerSession } from "@/lib/auth/user-server-session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoaTec - Natural Oscillation Activator",
  description: "NoaTec ergonomic seating solutions made in Belgium",
};

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  const session = await userServerSession();

  if (!routing.locales.includes(locale as "en" | "fr" | "de" | "nl")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PlausibleProvider
          domain={publicEnv.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || ""}
          trackLocalhost={true}
          enabled={true}
          pageviewProps={{
            locale,
            authenticated: !!session?.user ? "yes" : "no",
            userId: session?.user.id || "anonymous",
          }}
        >
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <Navigation />
              {children}
              <Footer />
              <Toaster />
            </NextIntlClientProvider>
          </QueryProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
