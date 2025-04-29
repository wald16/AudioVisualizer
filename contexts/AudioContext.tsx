'use client';

import { createContext, useContext, useRef, useEffect, useState } from 'react';

interface AudioContextType {
    audioRef: React.RefObject<HTMLAudioElement>;
    analyserRef: React.RefObject<AnalyserNode | null>;
    isPlaying: boolean;
}

const AudioContextApp = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
    const [isPlaying, setIsPlaying] = useState(false); // <-- NEW

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!audioRef.current) return;

        const setupAudio = async () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (!sourceNodeRef.current && audioRef.current) {
                const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                const analyser = audioContextRef.current.createAnalyser();
                analyser.fftSize = 512;

                source.connect(analyser);
                analyser.connect(audioContextRef.current.destination);

                sourceNodeRef.current = source;
                analyserRef.current = analyser;
            }


            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
        };

        audioRef.current.addEventListener('play', async () => {
            await setupAudio();
            setIsPlaying(true); // <-- SET isPlaying to true
        });

        audioRef.current.addEventListener('pause', () => {
            setIsPlaying(false);
        });

        return () => {
            audioRef.current?.removeEventListener('play', setupAudio);
            audioContextRef.current?.close();
        };
    }, []);

    return (
        <AudioContextApp.Provider value={{ audioRef, analyserRef, isPlaying }}>
            {children}
        </AudioContextApp.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContextApp);
    if (!context) {
        throw new Error('useAudio must be inside AudioProvider');
    }
    return context;
};
