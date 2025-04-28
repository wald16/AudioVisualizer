'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';

const Visualizer2: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyserRef } = useAudio();
    const animationRef = useRef<number>();

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

        const colors = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'];

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(10, 10, 20, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bassRange = dataArray.slice(0, bufferLength / 4);
            const bassEnergy = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
            const pulse = bassEnergy / 255;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const maxRadius = Math.min(centerX, centerY);

            const ringCount = 8;
            const angleStep = (Math.PI * 2) / 30;

            for (let i = 0; i < ringCount; i++) {
                const radius = (i + 1) * (maxRadius / ringCount) * (1 + pulse * 0.5);
                const color = colors[i % colors.length];

                ctx.beginPath();
                for (let a = 0; a < Math.PI * 2; a += angleStep) {
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
                ctx.lineWidth = 2 + pulse * 5;
                ctx.shadowBlur = 20;
                ctx.shadowColor = color;
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
    }, [analyserRef]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
        />
    );
};

export default Visualizer2;
