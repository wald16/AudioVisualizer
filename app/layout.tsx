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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen w-full flex items-center justify-center`}      >
        <AudioProvider>
          <VisualizerProvider>
            {children}
          </VisualizerProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
