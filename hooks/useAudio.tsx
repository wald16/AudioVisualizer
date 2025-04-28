'use client';

import { useRef } from 'react';

export function useAudio() {
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

    return {
        audioRef,
        loadAudio,
        play,
    };
}
