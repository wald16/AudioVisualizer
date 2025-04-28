'use client';
import { useContext } from 'react';
import { AudioContextApp } from '@/contexts/AudioContext';

export const useAudio = () => {
    const context = useContext(AudioContextApp);
    if (!context) {
        throw new Error('useAudio must be inside AudioProvider');
    }
    return context;
};
