import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AudioProvider } from "@/contexts/AudioContext";
import { VisualizerProvider } from "@/contexts/VisualizerContext"; // <-- NEW Visualizer context

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WALD | DJ Visualizer",
  description: "An insane live music visualizer made by WALD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <AudioProvider>
          <VisualizerProvider>
            {children}
          </VisualizerProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
