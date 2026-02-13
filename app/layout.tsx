import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoaTec - Natural Oscillation Activator",
  description: "NoaTec ergonomic seating solutions made in Belgium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
