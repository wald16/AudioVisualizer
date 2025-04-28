'use client';

import React from 'react';
import Visualizer1 from './Visualizer1';
import Visualizer2 from './Visualizer2';
import { useVisualizer } from '@/contexts/VisualizerContext';
import { useAudio } from '@/contexts/AudioContext'; // <-- import useAudio

const VisualizerWrapper: React.FC = () => {
    const { visualizerIndex } = useVisualizer();
    const { isPlaying } = useAudio(); // <-- get isPlaying

    if (!isPlaying) {
        return null; // If not playing, don't render any visualizer yet
    }

    return (
        <div>
            {visualizerIndex === 1 ? <Visualizer1 /> : <Visualizer2 />}
        </div>
    );
};

export default VisualizerWrapper;
