'use client';

import React, { useEffect, useRef, useState } from 'react';

// Manhattan-routed traces defined as percentage waypoints
const TRACES = [
    { id: 't1', points: [[6, 12], [6, 46], [34, 46], [34, 80], [61, 80], [61, 94], [95, 94]], color: '#34d399', pulseDuration: 6.5, pulseDelay: 0 },
    { id: 't2', points: [[94, 16], [70, 16], [70, 40], [47, 40], [47, 62], [17, 62], [17, 88], [4, 88]], color: '#22d3ee', pulseDuration: 7.5, pulseDelay: 1.4 },
    { id: 't3', points: [[50, 3], [50, 22], [82, 22], [82, 52], [82, 52]], color: '#34d399', pulseDuration: 5, pulseDelay: 2.6 },
    { id: 't4', points: [[26, 97], [26, 72], [9, 72], [9, 28], [26, 28], [26, 3]], color: '#10b981', pulseDuration: 8, pulseDelay: 0.8 },
    { id: 't5', points: [[88, 60], [88, 76], [58, 76]], color: '#22d3ee', pulseDuration: 4, pulseDelay: 3.3 },
];

function toPath(points, w, h) {
    return points
        .map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${(px / 100) * w} ${(py / 100) * h}`)
        .join(' ');
}

function junctions(points, w, h) {
    return points.slice(1, -1).map(([px, py]) => [(px / 100) * w, (py / 100) * h]);
}

export default function CyberBento({ onBentoMouseMove }) {
    const sectionRef = useRef(null);
    const [dims, setDims] = useState({ w: 0, h: 0 });
    const [reduceMotion, setReduceMotion] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
    );

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Use requestAnimationFrame to defer measurements and prevent cascading render warnings
        const frameId = requestAnimationFrame(() => {
            setDims({ w: section.offsetWidth, h: section.offsetHeight });
        });

        const ro = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
            }
        });
        ro.observe(section);

        return () => {
            cancelAnimationFrame(frameId);
            ro.disconnect();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="py-32 px-8 max-w-6xl mx-auto relative z-20 tech-grid-bg overflow-hidden"
        >
            <style jsx>{`
                @keyframes trace-current { to { stroke-dashoffset: -240; } }
                @keyframes via-pulse { 0%, 100% { opacity: 0.35; r: 2.2px; } 50% { opacity: 0.9; r: 3.2px; } }
                .trace-line { animation: trace-current 9s linear infinite; }
                .trace-via { animation: via-pulse 3.4s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .trace-line, .trace-via { animation: none; }
                }
            `}</style>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

            {/* PCB trace network */}
            {dims.w > 0 && (
                <svg
                    className="absolute inset-0 pointer-events-none"
                    width={dims.w}
                    height={dims.h}
                    viewBox={`0 0 ${dims.w} ${dims.h}`}
                    aria-hidden="true"
                >
                    <defs>
                        <filter id="trace-glow" x="-200%" y="-200%" width="500%" height="500%">
                            <feGaussianBlur stdDeviation="2.4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {TRACES.map((trace) => {
                        const d = toPath(trace.points, dims.w, dims.h);
                        const vias = junctions(trace.points, dims.w, dims.h);
                        return (
                            <g key={trace.id}>
                                <path d={d} fill="none" stroke={trace.color} strokeOpacity="0.14" strokeWidth="1.5" />
                                <path
                                    className="trace-line"
                                    d={d}
                                    fill="none"
                                    stroke={trace.color}
                                    strokeOpacity="0.35"
                                    strokeWidth="1.5"
                                    strokeDasharray="3 9"
                                    strokeLinecap="round"
                                />

                                {vias.map(([vx, vy], i) => (
                                    <circle key={i} className="trace-via" cx={vx} cy={vy} r="2.2" fill={trace.color} fillOpacity="0.7" />
                                ))}

                                {!reduceMotion && (
                                    <circle r="3" fill={trace.color} filter="url(#trace-glow)">
                                        <animateMotion
                                            path={d}
                                            dur={`${trace.pulseDuration}s`}
                                            begin={`${trace.pulseDelay}s`}
                                            repeatCount="indefinite"
                                            rotate="auto"
                                        />
                                    </circle>
                                )}
                            </g>
                        );
                    })}
                </svg>
            )}

            <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">Core Engineering</span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Engineered For Performance</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div onMouseMove={onBentoMouseMove} className="bento-card md:col-span-2 p-8 flex flex-col justify-between h-[340px] relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-[400px] h-[220px] opacity-45 pointer-events-none svg-wave-anim">
                        <svg viewBox="0 0 500 200" fill="none"><path d="M0 100C100 30 200 170 300 100C400 30 450 150 500 100V200H0V100Z" fill="url(#vector-wave-grad)" /><defs><linearGradient id="vector-wave-grad" x1="0" y1="0" x2="500" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="#10b981" stopOpacity="0.5" /><stop offset="1" stopColor="#00d2ff" stopOpacity="0.1" /></linearGradient></defs></svg>
                    </div>
                    <div className="relative z-10">
                        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block mb-4">ARCHITECTURE</span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">Fluid Motion & React Systems</h3>
                        <p className="text-zinc-400 text-sm md:text-base max-w-md">Building high-performance Next.js web applications with butter-smooth GSAP scroll orchestration.</p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 relative z-10">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Optimized 60 FPS Render Pipeline</span>
                    </div>
                </div>

                <div onMouseMove={onBentoMouseMove} className="bento-card p-8 flex flex-col justify-between h-[340px] relative overflow-hidden">
                    <div className="absolute right-4 top-4 w-28 h-28 pointer-events-none">
                        <svg viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="35" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 5" className="pulse-circle" /><circle cx="50" cy="50" r="20" fill="#10b981" fillOpacity="0.2" /><circle cx="50" cy="50" r="6" fill="#10b981" /></svg>
                    </div>
                    <div className="relative z-10">
                        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block mb-4">PERFORMANCE</span>
                        <h3 className="text-2xl font-bold mb-3">Sub-20MB Heap</h3>
                        <p className="text-zinc-400 text-sm">Extremely lightweight client footprint ensuring instant load times.</p>
                    </div>
                    <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent relative z-10">17.4 MB</div>
                </div>

                <div onMouseMove={onBentoMouseMove} className="bento-card p-8 flex flex-col justify-between h-[340px]">
                    <div>
                        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block mb-4">TECH STACK</span>
                        <h3 className="text-2xl font-bold mb-3">Modern Toolchain</h3>
                        <p className="text-zinc-400 text-sm">Next.js App Router, Tailwind CSS, GSAP ScrollTrigger, and WebGL shaders.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2.5 py-1 rounded bg-zinc-800/80 text-zinc-300 font-mono">Next.js</span>
                        <span className="text-xs px-2.5 py-1 rounded bg-zinc-800/80 text-zinc-300 font-mono">GSAP</span>
                        <span className="text-xs px-2.5 py-1 rounded bg-zinc-800/80 text-zinc-300 font-mono">Tailwind</span>
                    </div>
                </div>

                <div onMouseMove={onBentoMouseMove} className="bento-card md:col-span-2 p-8 flex flex-col justify-between h-[340px] relative overflow-hidden">
                    <div className="absolute right-6 bottom-4 w-52 h-36 opacity-35 pointer-events-none">
                        <svg viewBox="0 0 200 120" fill="none"><path d="M10 110V70C10 50 30 30 50 30H190" stroke="#00d2ff" strokeWidth="2" strokeDasharray="6 6" /><circle cx="190" cy="30" r="5" fill="#00d2ff" /><path d="M40 120V90C40 75 55 60 70 60H160" stroke="#10b981" strokeWidth="2" /><circle cx="160" cy="60" r="5" fill="#10b981" /></svg>
                    </div>
                    <div className="relative z-10">
                        <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block mb-4">DESIGN SYSTEMS</span>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">Cyber-Neon Aesthetic & Glassmorphism</h3>
                        <p className="text-zinc-400 text-sm md:text-base max-w-md">Merging dark-mode futuristic interfaces with high-contrast accessibility.</p>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 relative z-10">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span>GPU Accelerated Layer Composition</span>
                    </div>
                </div>
            </div>
        </section>
    );
}