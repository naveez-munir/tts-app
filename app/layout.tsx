import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Primary font: Inter (Professional, trustworthy, excellent readability)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Monospace font: JetBrains Mono (For booking references, codes)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Airport Transfer Booking | UK's Leading Transfer Platform",
  description: "Book reliable airport transfers across the UK. Compare quotes from trusted operators. Competitive pricing, professional service, 24/7 support.",
  keywords: ["airport transfer", "UK airport taxi", "airport pickup", "airport dropoff", "transfer booking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
