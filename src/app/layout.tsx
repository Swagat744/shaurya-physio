import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Shaurya Physiotherapy Clinic | Dr. Nivedita Pingale (PT)",
  description:
    "Shaurya Physiotherapy Clinic offers expert physiotherapy, rehabilitation, and sports medicine services in New Panvel. Headed by Dr. Nivedita Shashikant Pingale, MPT, Certified Nutritionist.",
  keywords:
    "physiotherapy, rehabilitation, New Panvel, Dr Nivedita Pingale, sports physiotherapy, neuro physiotherapy, cardiac rehab",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
