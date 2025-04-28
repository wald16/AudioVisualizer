'use client';

import { createContext, useContext, useRef } from 'react';

type AudioContextType = {
    audioRef: React.RefObject<HTMLAudioElement>;
    loadAudio: (file: File) => void;
    play: () => void;
};

const AudioContextReact = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null);

    const loadAudio = (file: File) => {
        const url = URL.createObjectURL(file);
        if (audioRef.current) {
            audioRef.current.src = url;
        }
    };

    const play = () => {
        audioRef.current?.play();
    };

    return (
        <AudioContextReact.Provider value={{ audioRef, loadAudio, play }}>
            {children}
        </AudioContextReact.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContextReact);
    if (!context) {
        throw new Error('useAudio must be used inside an AudioProvider');
    }
    return context;
}
