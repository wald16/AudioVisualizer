'use client';

import PartyButton from '@/components/PartyButton';
import UploadButton from '@/components/UploadButton';
import ChangeThemeButton from '@/components/ChangeThemeButton';
import Visualizer from '@/components/Visualizer';
import { useAudio } from '@/hooks/useAudio';

export default function HomePage() {
  const { audioRef, loadAudio, play } = useAudio();

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden ">
      <Visualizer audioRef={audioRef} />
      <div className="z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-cyan-300 drop-shadow-lg mb-12 tracking-widest">
          NEON VIBES
        </h1>
        <div className="flex flex-wrap gap-6 justify-center">
          <PartyButton />
          <UploadButton />
          <ChangeThemeButton />
        </div>
      </div>
    </div>
  );
}
