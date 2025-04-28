'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface VisualizerContextType {
    visualizerIndex: number;
    nextVisualizer: () => void;
}

const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

export const VisualizerProvider = ({ children }: { children: ReactNode }) => {
    const [visualizerIndex, setVisualizerIndex] = useState(1);

    const nextVisualizer = () => {
        setVisualizerIndex((prev) => (prev === 1 ? 2 : 1));
    };

    return (
        <VisualizerContext.Provider value={{ visualizerIndex, nextVisualizer }}>
            {children}
        </VisualizerContext.Provider>
    );
};

export const useVisualizer = () => {
    const context = useContext(VisualizerContext);
    if (!context) {
        throw new Error('useVisualizer must be used inside VisualizerProvider');
    }
    return context;
};
