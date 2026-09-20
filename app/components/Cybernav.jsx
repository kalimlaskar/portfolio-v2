'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const LINKS = [
    { label: 'projects.tsx', short: 'Projects', href: '#projects', id: 'projects', dot: '#00d2ff' },
    { label: 'about.md', short: 'About', href: '#about', id: 'about', dot: '#e4e4e7' },
    { label: 'contact.sh', short: 'Contact', href: '#contact', id: 'contact', dot: '#10b981' },
];

export default function CyberNav() {
    const [active, setActive] = useState('');
    const [paletteOpen, setPaletteOpen] = useState(false);

    const tabsWrapRef = useRef(null);
    const indicatorRef = useRef(null);
    const tabRefs = useRef({});
    const progressRef = useRef(null);
    const navRef = useRef(null);
    const paletteRef = useRef(null);

    // Scroll: toggle the dock's "docked" emphasis + drive the progress rail directly via ref
    useEffect(() => {
        const nav = navRef.current;
        const bar = progressRef.current;
        const onScroll = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
            if (bar) bar.style.width = `${pct}%`;
            if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Scrollspy
    useEffect(() => {
        const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
        if (!sections.length) return;
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );
        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Active-tab indicator: a snap, not a bounce — tabs switch mechanically, not elastically
    useEffect(() => {
        const wrap = tabsWrapRef.current;
        const indicator = indicatorRef.current;
        const target = active ? tabRefs.current[active] : null;
        if (!wrap || !indicator) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!target) {
            gsap.to(indicator, { opacity: 0, duration: reduceMotion ? 0 : 0.2 });
            return;
        }
        const wrapRect = wrap.getBoundingClientRect();
        const rect = target.getBoundingClientRect();
        gsap.to(indicator, {
            x: rect.left - wrapRect.left,
            width: rect.width,
            opacity: 1,
            duration: reduceMotion ? 0 : 0.35,
            ease: 'power3.out',
        });
    }, [active]);

    // Command palette: Cmd/Ctrl+K to toggle from anywhere, Escape to close
    useEffect(() => {
        const onKey = (e) => {
            const tag = e.target?.tagName;
            const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable;
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !typing) {
                e.preventDefault();
                setPaletteOpen((v) => !v);
            }
            if (e.key === 'Escape') setPaletteOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        const panel = paletteRef.current;
        if (!panel) return;
        if (paletteOpen) {
            document.body.style.overflow = 'hidden';
            gsap.set(panel, { display: 'flex' });
            gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
            gsap.fromTo(
                panel.querySelector('.palette-card'),
                { y: -12, opacity: 0, scale: 0.97 },
                { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' }
            );
            gsap.fromTo(
                panel.querySelectorAll('.palette-row'),
                { x: -10, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, delay: 0.08, ease: 'power2.out' }
            );
        } else {
            document.body.style.overflow = '';
            gsap.to(panel, { opacity: 0, duration: 0.15, ease: 'power2.in', onComplete: () => gsap.set(panel, { display: 'none' }) });
        }
    }, [paletteOpen]);

    useEffect(() => () => { document.body.style.overflow = ''; }, []);

    return (
        <>
            <style jsx global>{`
                @keyframes rail-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
                @keyframes cursor-blink { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
                .rail-dot-live { animation: rail-blink 1.8s ease-in-out infinite; }
                .palette-cursor { animation: cursor-blink 1s step-end infinite; }

                .nav-dock {
                    background: linear-gradient(180deg, rgba(5,6,10,0.92) 0%, rgba(5,6,10,0.82) 100%);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    transition: border-color 0.4s ease, background 0.4s ease;
                }
                .nav-dock.is-scrolled {
                    border-bottom-color: rgba(16,185,129,0.18);
                    box-shadow: 0 20px 50px -25px rgba(0,0,0,0.8);
                }
                .nav-tab {
                    font-family: var(--font-mono, ui-monospace, monospace);
                    position: relative;
                }
                .nav-tab[aria-current="page"] { color: #e4e4e7; }
            `}</style>

            {/* Full-width IDE-style dock, flush to the top */}
            <nav ref={navRef} className="nav-anim nav-dock fixed top-0 inset-x-0 z-50 backdrop-blur-2xl">
                <div className="max-w-6xl mx-auto px-5 sm:px-8">
                    <div className="flex items-center justify-between h-14">

                        {/* Window chrome + wordmark */}
                        {/* Window chrome + wordmark */}
                        <a href="#" className="flex items-center gap-3 shrink-0 group">
                            <span className="flex items-center gap-[5px]" aria-hidden="true">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 rail-dot-live shadow-[0_0_8px_#10b981]" />
                            </span>
                            <span className="font-black tracking-wider text-sm text-zinc-100 group-hover:text-emerald-400 transition-colors">
                                KALIM
                            </span>
                            <span className="hidden lg:inline text-[11px] font-mono text-zinc-600">~/kalim/portfolio</span>
                        </a>

                        {/* Tab strip */}
                        <div ref={tabsWrapRef} className="hidden md:flex relative items-stretch h-full">
                            <div
                                ref={indicatorRef}
                                className="absolute top-0 left-0 h-full bg-white/[0.04] border-x border-white/[0.06] opacity-0 pointer-events-none"
                                style={{ willChange: 'transform, width' }}
                            >
                                <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-cyan-400" />
                            </div>
                            {LINKS.map((link) => (
                                <a
                                    key={link.id}
                                    ref={(el) => { tabRefs.current[link.id] = el; }}
                                    href={link.href}
                                    aria-current={active === link.id ? 'page' : undefined}
                                    className="nav-tab flex items-center gap-2 px-5 text-[13px] text-zinc-400 hover:text-zinc-200 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: link.dot }} />
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* CTA styled as a runnable command */}
                        <a
                            href="#contact"
                            className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-zinc-950 text-[12px] font-mono transition-colors"
                        >
                            <span>$</span> contact --now
                        </a>

                        {/* Cmd+K trigger */}
                        <button
                            type="button"
                            onClick={() => setPaletteOpen(true)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                            aria-label="Open command menu"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                                <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                            <span className="hidden sm:inline text-[11px] font-mono">⌘K</span>
                        </button>
                    </div>
                </div>

                {/* Scroll-progress rail */}
                <div className="h-[2px] w-full bg-white/[0.03]">
                    <div ref={progressRef} className="h-full w-0 bg-gradient-to-r from-emerald-400 to-cyan-400" />
                </div>
            </nav>

            {/* Command palette */}
            <div
                ref={paletteRef}
                onClick={(e) => { if (e.target === e.currentTarget) setPaletteOpen(false); }}
                className="fixed inset-0 z-[60] hidden items-start justify-center pt-28 px-4 bg-black/70 backdrop-blur-sm"
                style={{ opacity: 0 }}
            >
                <div className="palette-card w-full max-w-md rounded-2xl bg-zinc-950/95 border border-zinc-800 shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-900">
                        <span className="flex items-center gap-[5px]" aria-hidden="true">
                            <span className="w-2 h-2 rounded-full bg-red-500/70" />
                            <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
                            <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500 ml-1">command_palette</span>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3.5 border-b border-zinc-900 text-zinc-300 font-mono text-sm">
                        <span className="text-emerald-400">›</span>
                        <span className="text-zinc-500">jump to section</span>
                        <span className="palette-cursor w-[6px] h-[16px] bg-emerald-400 ml-0.5" />
                    </div>

                    <div className="py-2">
                        {LINKS.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                onClick={() => setPaletteOpen(false)}
                                className="palette-row flex items-center justify-between px-4 py-3 text-sm text-zinc-200 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: link.dot }} />
                                    <span className="font-mono text-zinc-500">{link.label}</span>
                                    <span>{link.short}</span>
                                </span>
                                <span className="text-zinc-600 text-xs">↵</span>
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={() => setPaletteOpen(false)}
                            className="palette-row flex items-center justify-between px-4 py-3 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        >
                            <span className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span className="font-mono text-zinc-500">contact.sh</span>
                                <span>Get in touch</span>
                            </span>
                            <span className="text-zinc-600 text-xs">↵</span>
                        </a>
                    </div>

                    <div className="px-4 py-2.5 border-t border-zinc-900 text-[11px] font-mono text-zinc-600">
                        esc to close
                    </div>
                </div>
            </div>
        </>
    );
}