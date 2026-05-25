import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inai Admin",
  description: "Inai Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
