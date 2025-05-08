'use client';

import React from 'react';
import Visualizer1 from './Visualizer1';
import Visualizer2 from './Visualizer2';
import Visualizer3 from './Visualizer3';
import Visualizer4 from './Visualizer4';
import { useVisualizer } from '@/contexts/VisualizerContext';
import { useAudio } from '@/contexts/AudioContext';



const VisualizerWrapper: React.FC = () => {
    const { visualizerIndex } = useVisualizer();
    const { isPlaying } = useAudio();

    if (!isPlaying) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        >
            {visualizerIndex === 1 && <Visualizer1 />}
            {visualizerIndex === 2 && <Visualizer2 />}
            {visualizerIndex === 3 && <Visualizer3 />}
            {visualizerIndex === 4 && <Visualizer4 />}



        </div>
    );
};

export default VisualizerWrapper;
