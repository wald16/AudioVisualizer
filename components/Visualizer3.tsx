'use client';

import React, { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';



const Visualizer3: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyserRef } = useAudio();
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

        const particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            velocityX: number;
            velocityY: number;
            baseSpeed: number;
            size: number;
            color: string;

            constructor() {
                this.x = canvas!.width / 2;
                this.y = canvas!.height / 2;
                const angle = Math.random() * 2 * Math.PI;
                this.baseSpeed = Math.random() * 1 + 0.5;
                this.velocityX = Math.cos(angle) * this.baseSpeed;
                this.velocityY = Math.sin(angle) * this.baseSpeed;
                this.size = Math.random() * 3.5 + 0.5;
                this.color = randomColor();
            }

            update(boost: number) {
                const actualBoost = boost * boost; // << quadratic
                this.x += this.velocityX * actualBoost * 40;
                this.y += this.velocityY * actualBoost * 10;
            }

            draw(ctx: CanvasRenderingContext2D, boost: number) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * (1 + boost * 2), 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 20 + boost * 5;
                ctx.fill();
            }
        }


        function randomColor() {
            const colors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0077', '#00FFAA'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        const spawnParticles = (amount: number) => {
            for (let i = 0; i < amount; i++) {
                particles.push(new Particle());
            }
        };

        spawnParticles(250); // Initial burst

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(10, 0, 20, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const bassRange = dataArray.slice(0, bufferLength / 4);
            const bassEnergy = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
            const boost = bassEnergy / 255; // normalized bass boost

            if (boost > 0.4 && Math.random() > 0.6) {
                spawnParticles(5); // small controlled burst on bass
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update(boost);
                p.draw(ctx, boost);

                if (
                    p.x < -100 ||
                    p.x > canvas.width + 100 ||
                    p.y < -100 ||
                    p.y > canvas.height + 100
                ) {
                    particles.splice(i, 1);
                }
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

export default Visualizer3;
