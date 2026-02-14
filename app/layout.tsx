import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ALPHA Crew Photography",
    template: "%s | ALPHA Crew",
  },
  description: "A premium photography portfolio by ALPHA Crew featuring a curated collection of work.",
  keywords: ["photography", "portfolio", "alpha crew", "creative", "gallery", "photos"],
  authors: [{ name: "ALPHA Crew" }],
  creator: "ALPHA Crew",
  publisher: "ALPHA Crew",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alphacrewweb.vercel.app/",
    siteName: "ALPHA Crew Photography",
    title: "ALPHA Crew Photography",
    description: "Capturing moments with authentic and beautiful imagery.",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "ALPHA Crew Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ALPHA Crew Photography",
    description: "Capturing moments with authentic and beautiful imagery.",
    images: ["/logo-full.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
