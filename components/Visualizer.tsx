'use client';

import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

const Visualizer: React.FC<VisualizerProps> = ({ audioRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;

        const setupAudioContext = async () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
                analyserRef.current = audioContextRef.current.createAnalyser();

                const source = audioContextRef.current.createMediaElementSource(audio);
                source.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);

                analyserRef.current.fftSize = 512;
            }

            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
        };

        const startVisualizer = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            const analyser = analyserRef.current;

            if (!canvas || !ctx || !analyser) return;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const points: Point[] = [];
            let rotation = 0;

            const resizeCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            class Point {
                x: number;
                y: number;
                z: number;
                baseX: number;
                baseY: number;
                baseZ: number;

                constructor() {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.6 + 0.4;
                    this.x = Math.cos(angle) * radius;
                    this.y = Math.sin(angle) * radius;
                    this.z = (Math.random() - 0.5) * 1;
                    this.baseX = this.x;
                    this.baseY = this.y;
                    this.baseZ = this.z;
                }

                update(pulse: number) {
                    // Pulse expansion
                    this.x = this.baseX * (1 + pulse * 1);
                    this.y = this.baseY * (1 + pulse * 1);
                    this.z = this.baseZ * (1 + pulse * 1);
                }

                rotateY(angle: number) {
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const x = this.x * cos - this.z * sin;
                    const z = this.x * sin + this.z * cos;
                    this.x = x;
                    this.z = z;
                }

                project(width: number, height: number) {
                    const scale = 400;
                    const perspective = scale / (scale + this.z * 100);
                    const projX = this.x * scale * perspective + width / 2;
                    const projY = this.y * scale * perspective + height / 2;
                    return { projX, projY, perspective };
                }
            }

            for (let i = 0; i < 250; i++) {
                points.push(new Point());
            }

            const draw = () => {
                requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                ctx.fillStyle = 'rgba(70, 43, 70, 0.3)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const bassRange = dataArray.slice(0, bufferLength / 4);
                const bassEnergy = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;

                const pulse = bassEnergy / 255; // normalized

                // Rotate slowly
                rotation += 0.004;

                for (const p of points) {
                    p.update(pulse);
                    p.rotateY(rotation);
                }

                const projectedPoints = points.map(p => p.project(canvas.width, canvas.height));

                // Draw connections
                for (let i = 0; i < projectedPoints.length; i++) {
                    for (let j = i + 1; j < projectedPoints.length; j++) {
                        const dx = projectedPoints[i].projX - projectedPoints[j].projX;
                        const dy = projectedPoints[i].projY - projectedPoints[j].projY;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 120) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(0,255,255,${(1 - distance / 120) * (pulse + 0.3)})`;
                            ctx.lineWidth = (1 - distance / 120) * 2;
                            ctx.moveTo(projectedPoints[i].projX, projectedPoints[i].projY);
                            ctx.lineTo(projectedPoints[j].projX, projectedPoints[j].projY);
                            ctx.stroke();
                        }
                    }
                }

                // Draw points
                for (const p of projectedPoints) {
                    ctx.beginPath();
                    ctx.arc(p.projX, p.projY, 2 * p.perspective, 0, Math.PI * 2);
                    ctx.fillStyle = '#00FFFF';
                    ctx.fill();
                }
            };

            draw();
        };

        const handlePlay = async () => {
            await setupAudioContext();
            startVisualizer();
        };

        audio.addEventListener('play', handlePlay);

        return () => {
            audio.removeEventListener('play', handlePlay);
            window.removeEventListener('resize', () => { });
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [audioRef]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none"
        />
    );
};

export default Visualizer;
