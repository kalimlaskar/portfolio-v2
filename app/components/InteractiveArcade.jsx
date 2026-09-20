'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function InteractiveArcade() {
    const sectionRef = useRef(null);
    const gameWrapperRef = useRef(null);
    const canvasRef = useRef(null);

    const [activeGame, setActiveGame] = useState('blaster'); // 'blaster', 'catcher'
    const [uiState, setUiState] = useState('start');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    const gameStateRef = useRef('start');
    const activeGameRef = useRef('blaster');
    const scoreRef = useRef(0);
    const engineRef = useRef(null);

    useEffect(() => {
        activeGameRef.current = activeGame;
    }, [activeGame]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            if (gameWrapperRef.current && sectionRef.current) {
                gsap.fromTo(
                    gameWrapperRef.current,
                    {
                        width: '25vw',
                        x: '35vw',
                        opacity: 0,
                        borderRadius: '4rem'
                    },
                    {
                        width: '100%',
                        x: '0vw',
                        opacity: 1,
                        borderRadius: '1.5rem',
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top top',
                            end: '+=900',
                            scrub: 1.5,
                            pin: true,
                            anticipatePin: 1,
                        },
                    }
                );
            }
        }, sectionRef);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const c = canvas.getContext('2d');

        const cw = 1200;
        const ch = 800;
        canvas.width = cw;
        canvas.height = ch;

        let frame = 0;

        // --- GAME A: LASER BLASTER (Shooter) ---
        let shipX = cw / 2;
        let bullets = [];
        let targets = [];
        let particles = [];

        // --- GAME B: MATRIX CATCHER (Catch Items) ---
        let catcherX = cw / 2;
        let items = [];

        const resetGame = () => {
            frame = 0;
            scoreRef.current = 0;
            setScore(0);
            gameStateRef.current = 'playing';
            setUiState('playing');
            bullets = [];
            targets = [];
            items = [];
            particles = [];
        };

        const triggerGameOver = () => {
            gameStateRef.current = 'gameover';
            setUiState('gameover');
            setHighScore((prev) => (scoreRef.current > prev ? scoreRef.current : prev));
        };

        const drawGrid = () => {
            c.strokeStyle = 'rgba(16, 185, 129, 0.05)';
            c.lineWidth = 1;
            const size = 60;
            const off = (frame * 2) % size;
            for (let x = -off; x < cw; x += size) {
                c.beginPath(); c.moveTo(x, 0); c.lineTo(x, ch); c.stroke();
            }
            for (let y = 0; y < ch; y += size) {
                c.beginPath(); c.moveTo(0, y); c.lineTo(cw, y); c.stroke();
            }
        };

        const loop = () => {
            c.globalCompositeOperation = 'source-over';
            c.fillStyle = 'rgba(3, 3, 5, 0.4)';
            c.fillRect(0, 0, cw, ch);
            c.globalCompositeOperation = 'lighter';
            drawGrid();

            const currentGame = activeGameRef.current;
            const currentState = gameStateRef.current;

            if (currentState === 'playing') {
                frame++;

                if (currentGame === 'blaster') {
                    // --- LASER BLASTER LOGIC ---
                    // Draw & Update Ship
                    c.beginPath();
                    c.moveTo(shipX, ch - 70);
                    c.lineTo(shipX - 25, ch - 30);
                    c.lineTo(shipX + 25, ch - 30);
                    c.closePath();
                    c.fillStyle = '#00d2ff';
                    c.shadowBlur = 20; c.shadowColor = '#00d2ff';
                    c.fill(); c.shadowBlur = 0;

                    // Spawn targets (Cyber Drones)
                    if (frame % 50 === 0) {
                        targets.push({
                            x: Math.random() * (cw - 100) + 50,
                            y: -50,
                            radius: 25,
                            speed: Math.random() * 3 + 2,
                        });
                    }

                    // Update Bullets
                    for (let i = bullets.length - 1; i >= 0; i--) {
                        let b = bullets[i];
                        b.y -= 14;
                        c.beginPath();
                        c.arc(b.x, b.y, 5, 0, Math.PI * 2);
                        c.fillStyle = '#10b981';
                        c.shadowBlur = 15; c.shadowColor = '#10b981';
                        c.fill(); c.shadowBlur = 0;

                        if (b.y < 0) bullets.splice(i, 1);
                    }

                    // Update Targets & Collisions
                    for (let i = targets.length - 1; i >= 0; i--) {
                        let t = targets[i];
                        t.y += t.speed;

                        c.beginPath();
                        c.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
                        c.fillStyle = '#ec4899';
                        c.shadowBlur = 20; c.shadowColor = '#ec4899';
                        c.fill(); c.shadowBlur = 0;

                        // Check hit by bullet
                        for (let j = bullets.length - 1; j >= 0; j--) {
                            let b = bullets[j];
                            if (Math.hypot(b.x - t.x, b.y - t.y) < t.radius + 5) {
                                // Explosion particles
                                for (let p = 0; p < 12; p++) {
                                    particles.push({
                                        x: t.x, y: t.y,
                                        vx: (Math.random() - 0.5) * 8,
                                        vy: (Math.random() - 0.5) * 8,
                                        life: 1,
                                    });
                                }
                                targets.splice(i, 1);
                                bullets.splice(j, 1);
                                scoreRef.current += 10;
                                setScore(scoreRef.current);
                                break;
                            }
                        }

                        // Game over if drone reaches bottom
                        if (t.y > ch - 40) {
                            triggerGameOver();
                        }
                    }

                } else if (currentGame === 'catcher') {
                    // --- MATRIX CATCHER LOGIC ---
                    // Draw Catcher Platform
                    c.fillStyle = '#10b981';
                    c.shadowBlur = 20; c.shadowColor = '#10b981';
                    c.fillRect(catcherX - 60, ch - 50, 120, 20);
                    c.shadowBlur = 0;

                    // Spawn Items
                    if (frame % 40 === 0) {
                        items.push({
                            x: Math.random() * (cw - 80) + 40,
                            y: -30,
                            radius: 18,
                            speed: Math.random() * 4 + 4,
                            isBomb: Math.random() < 0.25,
                        });
                    }

                    // Update Items
                    for (let i = items.length - 1; i >= 0; i--) {
                        let item = items[i];
                        item.y += item.speed;

                        c.beginPath();
                        c.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
                        c.fillStyle = item.isBomb ? '#ef4444' : '#00d2ff';
                        c.shadowBlur = 15; c.shadowColor = item.isBomb ? '#ef4444' : '#00d2ff';
                        c.fill(); c.shadowBlur = 0;

                        // Check catch by platform
                        if (item.y + item.radius >= ch - 50 && item.x >= catcherX - 65 && item.x <= catcherX + 65) {
                            if (item.isBomb) {
                                triggerGameOver();
                            } else {
                                scoreRef.current += 5;
                                setScore(scoreRef.current);
                                items.splice(i, 1);
                                continue;
                            }
                        }

                        // Missed item
                        if (item.y > ch) {
                            if (!item.isBomb) {
                                triggerGameOver(); // Missed a coin!
                            } else {
                                items.splice(i, 1);
                            }
                        }
                    }
                }
            }

            // Render Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                p.x += p.vx; p.y += p.vy; p.life -= 0.03;
                if (p.life <= 0) particles.splice(i, 1);
                else {
                    c.beginPath(); c.arc(p.x, p.y, p.life * 5, 0, Math.PI * 2);
                    c.fillStyle = `rgba(0, 210, 255, ${p.life})`;
                    c.fill();
                }
            }

            engineRef.current = requestAnimationFrame(loop);
        };

        loop();

        const handleAction = () => {
            if (gameStateRef.current !== 'playing') {
                resetGame();
            } else if (activeGameRef.current === 'blaster') {
                // Shoot Bullet
                bullets.push({ x: shipX, y: ch - 70 });
            }
        };

        const handlePointerMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX !== undefined) {
                const xPos = ((clientX - rect.left) / rect.width) * cw;
                shipX = Math.max(40, Math.min(cw - 40, xPos));
                catcherX = Math.max(70, Math.min(cw - 70, xPos));
            }
        };

        const wrapper = gameWrapperRef.current;
        const handleDown = (e) => {
            e.preventDefault();
            handleAction();
        };

        const handleKeyDown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                handleAction();
            }
        };

        if (wrapper) {
            wrapper.addEventListener('pointerdown', handleDown);
            wrapper.addEventListener('pointermove', handlePointerMove);
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            ctx.revert();
            if (engineRef.current) cancelAnimationFrame(engineRef.current);
            if (wrapper) {
                wrapper.removeEventListener('pointerdown', handleDown);
                wrapper.removeEventListener('pointermove', handlePointerMove);
            }
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activeGame]);

    return (
        <section ref={sectionRef} className="relative h-screen bg-[#030305] flex flex-col items-center justify-center pt-24 overflow-hidden border-t border-zinc-900">

            {/* Game Selector Tabs */}
            <div className="absolute top-24 z-30 flex space-x-3 bg-zinc-900/90 p-2 rounded-2xl border border-emerald-500/30 backdrop-blur-md shadow-2xl">
                {[
                    { id: 'blaster', label: '🚀 LASER BLASTER' },
                    { id: 'catcher', label: '💎 MATRIX CATCHER' },
                ].map((g) => (
                    <button
                        key={g.id}
                        onClick={() => {
                            setActiveGame(g.id);
                            gameStateRef.current = 'start';
                            setUiState('start');
                        }}
                        className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${activeGame === g.id
                                ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                : 'text-zinc-400 hover:text-white bg-zinc-800/50'
                            }`}
                    >
                        {g.label}
                    </button>
                ))}
            </div>

            {/* Game Canvas Container */}
            <div
                ref={gameWrapperRef}
                className="relative h-[68vh] w-full bg-zinc-950 border-2 border-emerald-500/30 overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.2)] cursor-pointer mt-8 select-none"
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

                {uiState === 'playing' && (
                    <div className="absolute top-6 right-10 text-5xl font-black font-mono text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] pointer-events-none">
                        {score}
                    </div>
                )}

                {uiState === 'start' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/75 backdrop-blur-md pointer-events-none">
                        <span className="text-emerald-400 font-mono text-sm tracking-[0.3em] mb-3 animate-pulse">ARCADE MODULE // {activeGame.toUpperCase()}</span>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-wider drop-shadow-[0_0_20px_rgba(0,210,255,0.5)] text-center px-4">
                            {activeGame === 'blaster' && 'LASER BLASTER'}
                            {activeGame === 'catcher' && 'MATRIX CATCHER'}
                        </h2>
                        <div className="px-6 py-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold font-mono tracking-wider animate-bounce text-center">
                            MOVE MOUSE & CLICK TO SHOOT / CATCH
                        </div>
                    </div>
                )}

                {uiState === 'gameover' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/85 backdrop-blur-md pointer-events-none">
                        <span className="text-pink-500 font-mono text-sm tracking-[0.3em] mb-3">MISSION FAILED</span>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-2">GAME OVER</h2>
                        <div className="flex space-x-12 my-6 font-mono">
                            <div className="text-center">
                                <div className="text-zinc-400 text-xs mb-1">SCORE</div>
                                <div className="text-4xl font-bold text-white">{score}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-zinc-400 text-xs mb-1">HIGH SCORE</div>
                                <div className="text-4xl font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">{highScore}</div>
                            </div>
                        </div>
                        <div className="px-6 py-3 rounded-xl border border-pink-500/50 bg-pink-500/10 text-pink-400 font-bold font-mono tracking-wider animate-pulse">
                            CLICK OR SPACE TO RESTART
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}