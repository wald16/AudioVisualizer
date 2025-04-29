'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useParty } from '@/contexts/PartyContext';

const Visualizer2: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyserRef } = useAudio();
    const { partyMode } = useParty();
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const analyser = analyserRef.current;

        if (!canvas || !ctx || !analyser) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const baseColors = ['#6412bb', '#FF00FF', '#0005FF', '#00FF00'];

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bassRange = dataArray.slice(0, bufferLength / 4);
            const bassEnergy = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
            const pulse = bassEnergy / 255;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const maxRadius = Math.min(centerX, centerY);

            const ringCount = partyMode ? 14 : 7;

            const angleStep = (Math.PI * 3) / 30;

            for (let i = 0; i < ringCount; i++) {
                const radius = (i + 1) * (maxRadius / ringCount) * (1 + pulse * (partyMode ? 1.5 : 0.5));
                const color = partyMode
                    ? baseColors[Math.floor(Math.random() * baseColors.length)] // random color each frame
                    : baseColors[i % baseColors.length];

                ctx.beginPath();
                for (let a = 0; a < Math.PI * 2; a += angleStep) {
                    const wave = partyMode
                        ? 5 * Math.sin(a * 10 + pulse * 20) // more extreme waves
                        : 0.2 * Math.sin(a * 10 + pulse * 10); // normal small waves
                    const x = centerX + Math.cos(a) * radius * (1 + 0.2 * Math.sin(a * 10 + pulse * 10));
                    const y = centerY + Math.sin(a) * radius * (1 + 0.2 * Math.sin(a * 10 + pulse * 10));
                    if (a === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
                ctx.stroke();
            }
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [analyserRef, partyMode]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
        />
    );
};

export default Visualizer2;
