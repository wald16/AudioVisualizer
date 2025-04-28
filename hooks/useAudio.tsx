'use client';

import { useState, useRef } from 'react';

export function useAudio() {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const loadAudio = (file: File) => {
        const url = URL.createObjectURL(file);
        setAudioUrl(url);

        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        audioRef.current.src = url;
        audioRef.current.load();
    };

    const play = () => {
        audioRef.current?.play();
    };

    const pause = () => {
        audioRef.current?.pause();
    };

    return { loadAudio, play, pause, audioRef, audioUrl };
}
