'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useParty } from '@/contexts/PartyContext';

const Visualizer4: React.FC = () => {
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

        const snakes: Snake[] = [];

        class Snake {
            points: { x: number; y: number; amplitude: number; frequency: number; phase: number; }[];
            color: string;

            constructor() {
                this.points = [];
                for (let x = 0; x < canvas!.width; x += 40) {
                    this.points.push({
                        x,
                        y: canvas!.height / 2,
                        amplitude: partyMode ? Math.random() * 180 + 60 : Math.random() * 20 + 60,
                        frequency: partyMode ? Math.random() * 0.02 + 0.005 : Math.random() * 0.02 + 0.005,
                        phase: Math.random() * Math.PI * 2,
                    });
                }
                this.color = randomColor();
            }

            update(boost: number) {
                for (const point of this.points) {
                    point.phase += point.frequency + boost * 0.15;
                }
            }

            draw(ctx: CanvasRenderingContext2D, boost: number) {
                ctx.beginPath();
                ctx.moveTo(this.points[0].x, this.points[0].y);

                for (let i = 1; i < this.points.length; i++) {
                    const point = this.points[i];
                    const prev = this.points[i - 1];
                    const midX = (prev.x + point.x) / 2;
                    const midY = ((prev.y + Math.sin(prev.phase) * prev.amplitude * (1 + boost * 2)) +
                        (point.y + Math.sin(point.phase) * point.amplitude * (1 + boost * 2))) / 2;
                    ctx.quadraticCurveTo(prev.x, prev.y + Math.sin(prev.phase) * prev.amplitude * (1 + boost * 2), midX, midY);
                }

                ctx.strokeStyle = this.color;
                ctx.lineWidth = partyMode ? 6 + boost * 20 : 2 + boost * 10;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = partyMode ? 50 + boost * 20 : 20 + boost * 20;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }

        function randomColor() {
            const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0077', '#00FFAA'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        for (let i = 0; i < (partyMode ? 2 : 5); i++) {
            snakes.push(new Snake());
        }

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = partyMode ? 'rgba(0, 0, 0, 0.08)' : 'rgba(188, 183, 183, 0.82)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bassRange = dataArray.slice(0, bufferLength / 3);
            const bassEnergy = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
            const boost = bassEnergy / 255;

            for (const snake of snakes) {
                snake.update(boost);
                snake.draw(ctx, boost);
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

export default Visualizer4;
