import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inai.lk — Sri Lankan Tamil Matrimony",
  description:
    "Inai.lk connects Sri Lankan Tamil families worldwide. Find your life partner with privacy, culture, and family values at the heart of every match.",
  robots: "noindex, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+Tamil:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
