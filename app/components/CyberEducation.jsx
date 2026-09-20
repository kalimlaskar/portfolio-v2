'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const educationData = [
    {
        institution: 'Alagappa Chettiar Government College of Engineering and Technology, Karaikudi',
        degree: 'Bachelor of Engineering - BE, Electrical and Electronics Engineering',
        period: 'Aug 2013 – Aug 2017',
        grade: 'First Class Honors',
        highlights: [
            'Achieved First Class honors in a comprehensive Electrical and Electronics Engineering program.',
            'Demonstrated strong analytical and problem-solving skills through rigorous coursework and projects.',
            'Engaged in various extracurricular activities, fostering teamwork and leadership abilities.'
        ],
        icon: '⚡',
    },
    {
        institution: 'Kendriya Vidyalaya',
        degree: 'Higher Secondary & Foundation Education',
        period: 'Apr 2003 – May 2013',
        grade: 'Excellence Distinction',
        highlights: [
            'Excelled in a challenging academic environment, developing a solid foundation in core analytical subjects.',
            'Participated actively in school events, nurturing interpersonal skills and building a well-rounded personality.'
        ],
        icon: '🏛️',
    },
];

export default function CyberEducation() {
    const sectionRef = useRef(null);
    const connectorRef = useRef(null);
    const cardRefs = useRef([]);

    const handleTilt = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--mx', `${(e.clientX - rect.left)}px`);
        card.style.setProperty('--my', `${(e.clientY - rect.top)}px`);
        gsap.to(card, {
            rotationX: py * -6,
            rotationY: px * 8,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 900,
        });
    };

    const resetTilt = (e) => {
        gsap.to(e.currentTarget, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
    };

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            if (reduceMotion) return;

            gsap.from('.edu-eyebrow, .edu-heading', {
                y: 24,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: { trigger: section, start: 'top 75%' },
            });

            if (connectorRef.current) {
                gsap.fromTo(
                    connectorRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 65%',
                            end: 'bottom 70%',
                            scrub: 0.5,
                        },
                    }
                );
            }

            cardRefs.current.forEach((card) => {
                if (!card) return;
                gsap.fromTo(
                    card,
                    { y: 70, opacity: 0, scale: 0.96 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: card, start: 'top 85%' },
                    }
                );

                const seal = card.querySelector('.edu-seal');
                if (seal) {
                    gsap.fromTo(
                        seal,
                        { rotate: -50, scale: 0.4, opacity: 0 },
                        {
                            rotate: 0,
                            scale: 1,
                            opacity: 1,
                            duration: 0.8,
                            ease: 'back.out(2.2)',
                            delay: 0.15,
                            scrollTrigger: { trigger: card, start: 'top 85%' },
                        }
                    );
                }
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="education" className="py-32 px-6 sm:px-8 max-w-5xl mx-auto relative z-25">
            <style jsx>{`
                @keyframes seal-spin { to { transform: rotate(360deg); } }
                @keyframes trace-flow { to { stroke-dashoffset: -200; } }
                @keyframes grade-shimmer {
                    0% { background-position: -120% 0; }
                    100% { background-position: 220% 0; }
                }

                .edu-seal-ring {
                    animation: seal-spin 16s linear infinite;
                    transform-origin: 50% 50%;
                }
                .edu-circuit { stroke-dasharray: 5 7; animation: trace-flow 7s linear infinite; }

                .edu-grade {
                    background-image: linear-gradient(100deg, rgba(16,185,129,0.55) 0%, #fff 12%, rgba(16,185,129,0.55) 24%, rgba(16,185,129,0.55) 100%);
                    background-size: 250% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    animation: grade-shimmer 5s ease-in-out infinite;
                }

                .edu-card { transform-style: preserve-3d; will-change: transform; }
                .edu-glow {
                    background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(16,185,129,0.14), transparent 70%);
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }
                .edu-card:hover .edu-glow { opacity: 1; }

                @media (prefers-reduced-motion: reduce) {
                    .edu-seal-ring, .edu-circuit, .edu-grade { animation: none; }
                }
            `}</style>

            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-20">
                <span className="edu-eyebrow text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">
                    SECTION 0Y // ACADEMIC PROTOCOL
                </span>
                <h2 className="edu-heading text-3xl md:text-5xl font-bold tracking-tight text-white">
                    Educational Foundation
                </h2>
            </div>

            {/* Education Cards */}
            <div className="relative grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                {educationData.length > 1 && (
                    <div className="absolute left-[27px] sm:left-[39px] top-[52px] bottom-[52px] w-[2px] -z-0 pointer-events-none">
                        <div className="absolute inset-0 bg-zinc-800/70" />
                        <div
                            ref={connectorRef}
                            className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                        />
                    </div>
                )}

                {educationData.map((edu, idx) => (
                    <div
                        key={idx}
                        ref={(el) => {
                            if (el) cardRefs.current[idx] = el;
                        }}
                        onMouseMove={handleTilt}
                        onMouseLeave={resetTilt}
                        className="edu-card group relative p-8 rounded-3xl bg-[linear-gradient(145deg,rgba(24,24,27,0.8)_0%,rgba(9,9,11,0.9)_55%,#080c18_100%)] border border-zinc-800/80 hover:border-emerald-500/40 transition-[border-color,box-shadow] duration-500 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] hover:shadow-[0_25px_50px_-15px_rgba(16,185,129,0.15)] backdrop-blur-xl overflow-hidden"
                    >
                        {/* Cursor-follow glow */}
                        <div className="edu-glow absolute inset-0 pointer-events-none" />

                        {/* Faint animated circuit tracery */}
                        <svg className="absolute -right-6 -bottom-6 w-44 h-32 opacity-25 pointer-events-none" viewBox="0 0 160 96" fill="none" aria-hidden="true">
                            <path className="edu-circuit" d="M0 70 H50 a8 8 0 0 0 8 -8 V34 a8 8 0 0 1 8 -8 H160" stroke="#10b981" strokeWidth="1.5" />
                            <circle cx="58" cy="62" r="2.5" fill="#10b981" />
                        </svg>

                        {/* Top Bar with animated Seal & Period */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
                            <div className="flex items-center space-x-3">
                                <div className="edu-seal relative w-12 h-12 flex items-center justify-center">
                                    <svg className="edu-seal-ring absolute inset-0 w-full h-full" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                                        <circle cx="24" cy="24" r="21" stroke="#10b981" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 5" />
                                    </svg>
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        {edu.icon}
                                    </div>
                                </div>
                                <div>
                                    <span className="edu-grade text-xs font-mono uppercase tracking-wider block font-semibold">
                                        {edu.grade}
                                    </span>
                                    <span className="text-xs font-mono text-zinc-500">{edu.period}</span>
                                </div>
                            </div>
                        </div>

                        {/* Degree & Institution */}
                        <div className="mb-6 relative z-10">
                            <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide mb-1">
                                {edu.degree}
                            </h3>
                            <p className="text-sm font-mono text-zinc-400">
                                {edu.institution}
                            </p>
                        </div>

                        {/* Highlights list */}
                        <ul className="space-y-2.5 relative z-10 text-zinc-400 text-sm md:text-base leading-relaxed">
                            {edu.highlights.map((item, i) => (
                                <li key={i} className="flex items-start space-x-3">
                                    <span className="text-emerald-400 mt-1">›</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}