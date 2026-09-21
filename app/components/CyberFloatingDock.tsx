'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const GLOBAL_ACTIONS = [
    {
        label: 'GitHub',
        href: 'https://github.com/kalimlaskar/',
        external: true,
        icon: (
            <path d="M12 2C6.48 2 2 6.58 2 12.17c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.17C22 6.58 17.52 2 12 2Z" />
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/kalimlaskar/',
        external: true,
        icon: (
            <>
                <path d="M6.94 8.5H3.56V20.5H6.94V8.5Z" />
                <path d="M5.25 7C6.35 7 7.25 6.1 7.25 5S6.35 3 5.25 3 3.25 3.9 3.25 5 4.15 7 5.25 7Z" />
                <path d="M20.5 20.5H17.13V14.5C17.13 13 16.6 12 15.25 12c-1.03 0-1.65.7-1.92 1.37-.1.24-.12.57-.12.91v6.22H9.83s.05-11.3 0-12.5h3.38v1.77c.45-.69 1.25-1.68 3.04-1.68 2.22 0 3.88 1.45 3.88 4.56v7.85Z" />
            </>
        ),
    },
    {
        label: 'Resume',
        href: '/Kalim-Laskar-%20Resume.pdf',
        external: true,
        icon: (
            <>
                <path d="M7 2.75h7.25L19 7.5v13.75a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3.75a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M14 2.75V7.5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M8.5 12h7M8.5 15h7M8.5 18h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </>
        ),
        stroke: true,
    },
    {
        label: 'Contact',
        href: 'mailto:kalim007mailbox@gmail.com',
        external: false,
        icon: (
            <>
                <rect x="2.75" y="5.25" width="18.5" height="13.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m3.5 6 8.5 7 8.5-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </>
        ),
        stroke: true,
    },
];

const PEAK_SCALE = 1.55;
const RADIUS = 130; // px of influence on either side of the cursor

export default function CyberFloatingDock() {
    const dockRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [hidden, setHidden] = useState(false);

    // Hide once the footer/#contact section is on screen — the dock exists to get you
    // there; once you've arrived, it has nothing left to do but sit on top of the footer.
    useEffect(() => {
        const footer = document.getElementById('contact');
        if (!footer) return;
        const observer = new IntersectionObserver(
            ([entry]) => setHidden(entry.isIntersecting),
            { rootMargin: '0px 0px -10% 0px', threshold: 0 }
        );
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const dock = dockRef.current;
        if (!dock) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        gsap.fromTo(dock, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.3 });
        gsap.fromTo(
            itemRefs.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.5, ease: 'back.out(2.4)' }
        );

        if (reduceMotion) return;

        // Transform-only: scale + y are compositor properties, so this never triggers
        // layout the way animating width/height did — that's what made the old version
        // feel laggy instead of snapping cleanly to the cursor.
        const scaleSetters = itemRefs.current.map((el) => gsap.quickTo(el, 'scale', { duration: 0.28, ease: 'power3.out' }));
        const liftSetters = itemRefs.current.map((el) => gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' }));

        const handleMove = (e: MouseEvent) => {
            const rect = dock.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;

            itemRefs.current.forEach((el, i) => {
                if (!el) return;
                const itemRect = el.getBoundingClientRect();
                const itemCenter = itemRect.left - rect.left + itemRect.width / 2;
                const dist = Math.abs(mouseX - itemCenter);
                const falloff = Math.max(0, 1 - dist / RADIUS);
                const eased = falloff * falloff * (3 - 2 * falloff); // smoothstep

                scaleSetters[i](1 + (PEAK_SCALE - 1) * eased);
                liftSetters[i](-eased * 16);
            });
        };

        const handleLeave = () => {
            itemRefs.current.forEach((_, i) => {
                scaleSetters[i](1);
                liftSetters[i](0);
            });
        };

        dock.addEventListener('mousemove', handleMove);
        dock.addEventListener('mouseleave', handleLeave);
        return () => {
            dock.removeEventListener('mousemove', handleMove);
            dock.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    return (
        <div
            ref={dockRef}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-end gap-3 px-4 py-3 rounded-[22px] bg-zinc-950/70 border border-emerald-500/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.75)] transition-[opacity,transform] duration-400 ${hidden ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
                }`}
            style={{ opacity: 0 }}
        >
            {GLOBAL_ACTIONS.map((action, i) => (
                <a
                    key={action.label}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    href={action.href}
                    {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    aria-label={action.label}
                    tabIndex={hidden ? -1 : 0}
                    className="dock-item group relative flex items-center justify-center w-11 h-11 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 focus-visible:text-emerald-400 focus-visible:border-emerald-500/60 focus-visible:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 transition-colors duration-300 shrink-0"
                    style={{ transformOrigin: 'bottom center' }}
                >
                    {/* Tooltip — shows on hover AND keyboard focus */}
                    <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200">
                        {action.label}
                    </span>

                    <svg viewBox="0 0 24 24" className="w-[52%] h-[52%]" fill={action.stroke ? 'none' : 'currentColor'}>
                        {action.icon}
                    </svg>

                    <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-emerald-400/80 group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_#10b981] group-focus-visible:bg-emerald-400 group-focus-visible:shadow-[0_0_6px_#10b981] transition-all" />
                </a>
            ))}

            <style jsx>{`
                .dock-item:focus-visible {
                    transform: translateY(-16px) scale(${PEAK_SCALE});
                }
                @media (prefers-reduced-motion: reduce) {
                    .dock-item:focus-visible { transform: none; }
                }
            `}</style>
        </div>
    );
}