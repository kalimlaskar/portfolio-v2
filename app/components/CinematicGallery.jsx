'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicGallery() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const track = trackRef.current;
            const section = sectionRef.current;

            if (track && section) {
                gsap.to(track, {
                    x: () => -(track.scrollWidth - window.innerWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        pin: true,
                        scrub: 1.2,
                        end: () => `+=${track.scrollWidth}`,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                    },
                });
            }
        }, sectionRef);

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    const projectItems = [
        { title: 'EXECSYNC OS', tag: 'PROJECT 01 // REACT & PHP', desc: 'Schedule and insights management web application with custom Google OAuth authentication.', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
        { title: 'BULK ID DELETER', tag: 'PROJECT 02 // WORDPRESS PLUGIN', desc: 'Custom database optimization plugin built to seamlessly purge object IDs from wp_term_relationships.', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop' },
        { title: 'BILLIVERSE ANIMATION', tag: 'PROJECT 03 // 2D CANVAS & GSAP', desc: 'Interactive animated series and motion graphics platform featuring educational science narratives.', image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop' },
        { title: 'SYNTHWAVE DASHBOARD', tag: 'PROJECT 04 // NEXT.JS & TAILWIND', desc: 'High-performance cyberpunk telemetry interface with real-time analytics and smooth scroll triggers.', image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop' },
    ];

    return (
        <section ref={sectionRef} className="relative h-screen bg-[#030305] overflow-hidden flex items-center border-t border-zinc-900">

            {/* Section Header */}
            <div className="absolute top-12 left-12 z-20">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">Section 05 // Featured Projects</span>
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Interactive Project Showcases (Scroll to Slide)</h2>
            </div>

            {/* Horizontal Scrolling Track */}
            <div ref={trackRef} className="flex items-center gap-12 px-16 w-max pt-20">
                {projectItems.map((item, index) => (
                    <div
                        key={index}
                        className="w-[85vw] md:w-[700px] h-[55vh] rounded-3xl overflow-hidden border border-emerald-500/30 bg-zinc-950 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col justify-end p-8 md:p-12 relative group shrink-0"
                    >
                        {/* Background Image with Hover Zoom */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-65 transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/40 to-transparent" />

                        {/* Content Details */}
                        <div className="relative z-10">
                            <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block mb-3">
                                {item.tag}
                            </span>
                            <h3 className="text-3xl md:text-5xl font-black text-white mb-2">{item.title}</h3>
                            <p className="text-zinc-300 text-sm md:text-base max-w-lg">
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}