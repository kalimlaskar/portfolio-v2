'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const experiences = [
    {
        company: 'HighRadius',
        role: 'Principal Web Developer & Web Developer II',
        period: 'Sep 2022 – Present · 4 yrs 1 mo',
        location: 'Hyderabad & Bengaluru, India',
        description: [
            'Leading full-stack development initiatives for complex enterprise web applications within a high-growth environment.',
            'Collaborating with cross-functional teams to define project requirements, enhancing system performance and user experience.',
            'Driving strategic vision, frontend/backend integration, SEO optimization, and cross-browser compatibility.'
        ],
        skills: ['React.js', 'Next.js', 'JavaScript', 'AWS Elastic Beanstalk', 'Jira', 'WordPress', 'System Performance'],
        highlight: 'HighFlyer Award H2 2023',
        active: true,
    },
    {
        company: 'Camp K12',
        role: 'Frontend Developer',
        period: 'Oct 2021 – Sep 2022 · 1 yr 1 mo',
        location: 'Bengaluru, Karnataka, India',
        description: [
            'Enhanced frontend design and optimized user interfaces for an advanced educational technology platform.',
            'Employed Next.js for seamless server-side rendering, headless content delivery, and lightning-fast loading times.',
            'Contributed to measurable user engagement gains through frontend responsiveness and performance tuning.'
        ],
        skills: ['Next.js', 'React.js', 'UI/UX Optimization', 'WordPress', 'Performance Tuning'],
        active: false,
    },
    {
        company: 'Macaw Digital',
        role: 'Full Stack Engineer',
        period: 'Jan 2020 – Sep 2021 · 1 yr 9 mos',
        location: 'Greater Hyderabad Area',
        description: [
            'Led full-stack development efforts for diverse PHP applications, optimizing system performance and browser compatibility.',
            'Engineered interactive, visually appealing user interfaces using React.js and modern JavaScript.',
            'Executed robust SEO strategies to boost online visibility and drive organic traffic.'
        ],
        skills: ['PHP', 'JavaScript', 'React.js', 'SEO Strategy', 'MySQL', 'WordPress'],
        active: false,
    },
    {
        company: 'WanderGateway',
        role: 'Full Stack Engineer / Web Developer',
        period: 'Jul 2018 – Dec 2019 · 1 yr 6 mos',
        location: 'Guwahati, Assam, India',
        description: [
            'Designed and maintained mobile-friendly, high-performance web solutions with optimized SEO and analytics integration.',
            'Leveraged PHP, MySQL, and modern SEO techniques to build engaging, user-centric web properties.'
        ],
        skills: ['PHP', 'MySQL', 'Web Development', 'SEO', 'Analytics Integration'],
        active: false,
    },
];

export default function CyberExperience() {
    const sectionRef = useRef(null);
    const dotRef = useRef(null);
    const trackRef = useRef(null);
    const fillRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const dot = dotRef.current;
        const track = trackRef.current;
        const fill = fillRef.current;
        if (!section || !dot || !track || !fill) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {
            // The dot is driven by the TRACK's own geometry, not the section's.
            // The section is taller than the track (py-32 + header), so mapping section
            // progress onto the track made the dot run out of travel early.
            const dotTrigger = ScrollTrigger.create({
                trigger: track,
                start: 'top 62%',
                end: 'bottom 62%',
                scrub: reduceMotion ? false : 0.4,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const max = Math.max(0, track.offsetHeight - dot.offsetHeight);
                    gsap.set(dot, { y: self.progress * max });
                    gsap.set(fill, { scaleY: self.progress });
                },
                onRefresh: (self) => {
                    const max = Math.max(0, track.offsetHeight - dot.offsetHeight);
                    gsap.set(dot, { y: self.progress * max });
                    gsap.set(fill, { scaleY: self.progress });
                },
            });

            // Light each card up as the dot reaches it
            const cardTriggers = gsap.utils.toArray('.exp-card').map((el) =>
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 68%',
                    end: 'bottom 40%',
                    onToggle: (self) => el.classList.toggle('is-live', self.isActive),
                })
            );

            return () => {
                dotTrigger.kill();
                cardTriggers.forEach((t) => t.kill());
            };
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="experience" className="py-32 px-6 sm:px-8 max-w-5xl mx-auto relative z-25">
            <style jsx>{`
                @keyframes trace-flow {
                    to { stroke-dashoffset: -200; }
                }
                @keyframes pulse-sweep {
                    from { stroke-dashoffset: 0; }
                    to { stroke-dashoffset: -1240; }
                }
                @keyframes ring-spin {
                    to { transform: rotate(360deg); }
                }

                .wave-base { stroke: rgba(16, 185, 129, 0.16); }
                .wave-pulse {
                    stroke: #34d399;
                    stroke-dasharray: 70 1170;
                    filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.9));
                    animation: pulse-sweep 5s linear infinite;
                }

                .node-ring {
                    transform-origin: 12px 12px;
                    animation: ring-spin 14s linear infinite;
                    stroke: rgba(16, 185, 129, 0.35);
                    transition: stroke 0.45s ease;
                }
                .node-core {
                    fill: #0b0f1a;
                    stroke: rgba(16, 185, 129, 0.5);
                    transition: fill 0.45s ease, stroke 0.45s ease;
                }
                .exp-card.is-live .node-ring { stroke: rgba(52, 211, 153, 0.9); }
                .exp-card.is-live .node-core { fill: #34d399; stroke: #34d399; }

                .circuit-trace {
                    stroke-dasharray: 5 7;
                    animation: trace-flow 6s linear infinite;
                }

                .bracket path {
                    stroke-dasharray: 90;
                    stroke-dashoffset: 90;
                    transition: stroke-dashoffset 0.65s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .exp-card:hover .bracket path,
                .exp-card.is-live .bracket path { stroke-dashoffset: 0; }

                .exp-card .card-shell { transition: border-color 0.5s ease, box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                .exp-card.is-live .card-shell {
                    border-color: rgba(16, 185, 129, 0.35);
                    box-shadow: 0 25px 50px -15px rgba(16, 185, 129, 0.12);
                }

                @media (prefers-reduced-motion: reduce) {
                    .wave-pulse, .node-ring, .circuit-trace { animation: none; }
                }
            `}</style>

            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-20">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">
                    SECTION 0X // CAREER TELEMETRY
                </span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                    Professional Trajectory
                </h2>

                {/* Telemetry waveform — a pulse runs the line on a loop */}
                <svg
                    viewBox="0 0 600 56"
                    fill="none"
                    aria-hidden="true"
                    className="w-full max-w-md mx-auto mt-6 h-12"
                >
                    <path
                        className="wave-base"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M0 28 H108 l9 -17 l11 33 l10 -16 H236 l7 -9 l9 18 l8 -9 H352 l10 -21 l13 40 l9 -19 H600"
                    />
                    <path
                        className="wave-pulse"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M0 28 H108 l9 -17 l11 33 l10 -16 H236 l7 -9 l9 18 l8 -9 H352 l10 -21 l13 40 l9 -19 H600"
                    />
                </svg>
            </div>

            {/* Main Container with Track Line */}
            <div className="relative max-w-4xl mx-auto pl-8 sm:pl-16">

                {/* Continuous Vertical Neon Track Line */}
                <div ref={trackRef} className="absolute left-2 sm:left-6 top-6 bottom-6 w-[2px] bg-emerald-500/15 z-10">
                    {/* Travelled portion of the track */}
                    <div
                        ref={fillRef}
                        className="absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-emerald-400 via-emerald-500 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                    />

                    {/* Scroll-Driven Moving Green Telemetry Dot */}
                    <div
                        ref={dotRef}
                        className="absolute -left-[7px] top-0 w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_20px_#10b981,0_0_10px_#10b981] z-30"
                    >
                        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
                    </div>
                </div>

                {/* Experience Cards */}
                <div className="space-y-12">
                    {experiences.map((exp, idx) => (
                        <div key={idx} className="exp-card relative group">

                            {/* Track node sitting on the line, level with the card header */}
                            <span className="absolute -left-[30px] sm:-left-[46px] top-8 w-[14px] h-[14px] z-20 pointer-events-none">
                                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                                    <circle className="node-ring" cx="12" cy="12" r="10" strokeWidth="1.5" strokeDasharray="4 3" />
                                    <rect className="node-core" x="7" y="7" width="10" height="10" strokeWidth="1.5" transform="rotate(45 12 12)" />
                                </svg>
                            </span>

                            <div className="card-shell p-6 sm:p-8 rounded-3xl bg-[linear-gradient(145deg,rgba(24,24,27,0.8)_0%,rgba(9,9,11,0.9)_55%,#080c18_100%)] border border-zinc-800/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden">

                                {/* Hover glow wash */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                {/* Drawing corner brackets */}
                                <svg className="bracket absolute top-0 left-0 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                                    <path d="M1 39 V13 A12 12 0 0 1 13 1 H39" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.55" />
                                </svg>
                                <svg className="bracket absolute bottom-0 right-0 w-10 h-10 rotate-180 pointer-events-none" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                                    <path d="M1 39 V13 A12 12 0 0 1 13 1 H39" stroke="#00d2ff" strokeWidth="1.5" strokeOpacity="0.45" />
                                </svg>

                                {/* Flowing circuit trace */}
                                <svg className="absolute -right-4 top-6 w-40 h-24 opacity-30 pointer-events-none" viewBox="0 0 160 96" fill="none" aria-hidden="true">
                                    <path className="circuit-trace" d="M0 20 H60 a8 8 0 0 1 8 8 V52 a8 8 0 0 0 8 8 H160" stroke="#10b981" strokeWidth="1.5" />
                                    <path className="circuit-trace" d="M0 76 H40 a8 8 0 0 0 8 -8 V32 a8 8 0 0 1 8 -8 H160" stroke="#00d2ff" strokeWidth="1.5" style={{ animationDelay: '-2s' }} />
                                    <circle cx="60" cy="24" r="2.5" fill="#10b981" />
                                    <circle cx="96" cy="60" r="2.5" fill="#00d2ff" />
                                </svg>

                                {/* Top Meta Bar */}
                                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                                            {exp.company}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                                            {exp.role}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col sm:items-end">
                                        <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300">
                                            {exp.period}
                                        </span>
                                        <span className="text-[11px] font-mono text-zinc-500 mt-1">
                                            {exp.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Highlight Badge */}
                                {exp.highlight && (
                                    <div className="relative z-10 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
                                        <span>🏆</span>
                                        <span>{exp.highlight}</span>
                                    </div>
                                )}

                                {/* Bullet Points */}
                                <ul className="relative z-10 space-y-2.5 mb-6 text-zinc-400 text-sm md:text-base leading-relaxed">
                                    {exp.description.map((desc, i) => (
                                        <li key={i} className="flex items-start space-x-3">
                                            <span className="text-emerald-400 mt-1">›</span>
                                            <span>{desc}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Tech Stack Pills */}
                                <div className="relative z-10 flex flex-wrap gap-2 pt-4 border-t border-zinc-800/60">
                                    {exp.skills.map((skill, i) => (
                                        <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 text-zinc-300 group-hover:border-emerald-500/20 transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}