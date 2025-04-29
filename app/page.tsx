'use client';

import { useState } from 'react';
import { AudioProvider } from '@/contexts/AudioContext';
import PartyButton from '@/components/PartyButton';
import UploadButton from '@/components/UploadButton';
import ChangeThemeButton from '@/components/ChangeThemeButton';
import Visualizer from '@/components/VisualizerWrapper';
import { useAudio } from '@/contexts/AudioContext';

export default function HomePage() {
  return (
    <AudioProvider>
      <HomePageContent />
    </AudioProvider>
  );
}

// HERE inside HomePageContent you define showUI ✅
function HomePageContent() {
  const { audioRef } = useAudio();
  const [showUI, setShowUI] = useState(true); // <-- This fixes the error

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0e0e1a]">
      <Visualizer />

      {/* Eye Button */}
      <button
        onClick={() => setShowUI(prev => !prev)}
        className="absolute top-5 left-5 z-20 p-3 bg-black/50 rounded-full hover:bg-black/70 transition"
      >
        {showUI ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Open eye */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {/* Closed eye */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.617-4.138m1.999-1.664A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-1.799 3.013M3 3l18 18" />
          </svg>
        )}
      </button>

      {/* UI that is hidden/shown */}
      {showUI && (
        <div className="z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-cyan-300 drop-shadow-lg mb-10 tracking-widest relative left-4">
            WALD
          </h1>
          <div className="flex flex-wrap gap-6 justify-center">
            <PartyButton />
            <UploadButton />
            <ChangeThemeButton />
          </div>
        </div>
      )}

      <audio ref={audioRef} hidden />
    </div>
  );
}
