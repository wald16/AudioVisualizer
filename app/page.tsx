'use client';

import { AudioProvider } from '@/contexts/AudioContext'; // <- Wrap everything
import PartyButton from '@/components/PartyButton';
import UploadButton from '@/components/UploadButton';
import ChangeThemeButton from '@/components/ChangeThemeButton';
import Visualizer from '@/components/Visualizer';
import { useAudio } from '@/contexts/AudioContext';

export default function HomePage() {
  return (
    <AudioProvider>
      <HomePageContent />
    </AudioProvider>
  );
}

function HomePageContent() {
  const { audioRef } = useAudio();

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#0e0e1a]">
      <Visualizer audioRef={audioRef} />
      <div className="z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-cyan-300 drop-shadow-lg mb-12 tracking-widest">
          WALD
        </h1>
        <div className="flex flex-wrap gap-6 justify-center">
          <PartyButton />
          <UploadButton />
          <ChangeThemeButton />
        </div>
      </div>
      <audio ref={audioRef} hidden />
    </div>
  );
}
