'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const AVATAR_SRC = '/kalim-avatar.jpg';
const CARD_PADDING = 10;
const SCROLL_LENGTH = 600;
const GRAVITY = 1100;
const SWAP_AT = 0.0015; // below this the real photo is on screen and the canvas is empty

export default function PixelShatterAvatar() {
    const cardRef = useRef(null);
    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const innerImgRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted) return;
        const canvas = canvasRef.current;
        const card = cardRef.current;
        const source = imgRef.current;
        const innerImg = innerImgRef.current;
        if (!canvas || !card || !source || !innerImg) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let shards = [];
        let shardSize = 2;
        let frame = null;
        let W = 0;
        let H = 0;
        let lastProgress = 0;
        let shattered = false;
        let trigger = null;
        let resizeTimer = 0;
        let disposed = false;

        const sizeCanvas = () => {
            W = Math.floor(window.innerWidth);
            H = Math.floor(window.innerHeight);
            canvas.width = W;
            canvas.height = H;
            canvas.style.width = `${W}px`;
            canvas.style.height = `${H}px`;
            frame = ctx.createImageData(W, H);
        };

        const build = () => {
            const rect = card.getBoundingClientRect();
            const w = Math.max(1, Math.round(rect.width - CARD_PADDING * 2));
            const h = Math.max(1, Math.round(rect.height - CARD_PADDING * 2));

            const tmp = document.createElement('canvas');
            tmp.width = w;
            tmp.height = h;
            const tctx = tmp.getContext('2d', { willReadFrequently: true });
            if (!tctx) return;

            const naturalW = source.naturalWidth || w;
            const naturalH = source.naturalHeight || h;
            const scale = Math.max(w / naturalW, h / naturalH);
            const dw = naturalW * scale;
            const dh = naturalH * scale;
            tctx.drawImage(source, (w - dw) / 2, 0, dw, dh); // object-cover + object-top

            const data = tctx.getImageData(0, 0, w, h).data;

            const gap = window.innerWidth < 768 ? 3 : 2;
            shardSize = gap;
            const cx = w / 2;
            const cy = h * 0.55;
            const next = [];

            for (let y = 0; y < h; y += gap) {
                for (let x = 0; x < w; x += gap) {
                    const i = (y * w + x) * 4;
                    if (data[i + 3] < 30) continue;

                    const dx = x - cx;
                    const dy = y - cy;
                    const dist = Math.hypot(dx, dy) || 1;
                    const power = 600 + Math.random() * 1200;

                    next.push({
                        ox: x,
                        oy: y,
                        vx: (dx / dist) * power + (Math.random() - 0.5) * 400,
                        vy: (dy / dist) * power * 0.6 - (200 + Math.random() * 400),
                        r: data[i],
                        g: data[i + 1],
                        b: data[i + 2],
                        delay: Math.random() * 0.15,
                    });
                }
            }

            shards = next;
        };

        const setShattered = (on) => {
            if (on === shattered) return; // only write opacity when the state actually flips
            shattered = on;
            innerImg.style.opacity = on ? '0' : '1';
        };

        const render = (p) => {
            if (!frame) return;
            lastProgress = p;

            if (p <= SWAP_AT) {
                setShattered(false);
                ctx.clearRect(0, 0, W, H);
                return;
            }

            // Hard swap. At this progress every shard is still on its origin pixel, so the
            // photo and the dust are pixel-identical and the handover is invisible.
            setShattered(true);

            const rect = card.getBoundingClientRect();
            const baseX = rect.left + CARD_PADDING;
            const baseY = rect.top + CARD_PADDING;

            const size = shardSize;
            const buf = frame.data;
            buf.fill(0);

            for (let n = 0; n < shards.length; n++) {
                const s = shards[n];
                let t = (p - s.delay) / (1 - s.delay);
                if (t <= 0) t = 0;

                const alpha = 1 - t * t;
                if (alpha <= 0.02) continue;

                const e = t * t;
                const px = (baseX + s.ox + s.vx * e) | 0;
                const py = (baseY + s.oy + s.vy * e + GRAVITY * e * e) | 0;
                if (px < 0 || py < 0 || px >= W - size || py >= H - size) continue;

                const a = (alpha * 255) | 0;
                for (let sy = 0; sy < size; sy++) {
                    let idx = ((py + sy) * W + px) * 4;
                    for (let sx = 0; sx < size; sx++) {
                        buf[idx] = s.r;
                        buf[idx + 1] = s.g;
                        buf[idx + 2] = s.b;
                        buf[idx + 3] = a;
                        idx += 4;
                    }
                }
            }

            ctx.putImageData(frame, 0, 0);
        };

        const start = () => {
            if (disposed) return;
            setIsLoaded(true);
            if (reduceMotion) return;

            sizeCanvas();
            build();

            // No scrub: self.progress is then the true current scroll position with zero
            // tween lag, so the dust can never drift behind the page.
            trigger = ScrollTrigger.create({
                trigger: document.documentElement,
                start: 'top top',
                end: `+=${SCROLL_LENGTH}`,
                invalidateOnRefresh: true,
                onUpdate: (self) => render(self.progress),
                onRefresh: (self) => render(self.progress),
            });

            render(trigger.progress);
        };

        if (source.complete && source.naturalWidth) start();
        else source.onload = start;

        const onResize = () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                if (disposed || !shards.length) return;
                sizeCanvas();
                build();
                render(lastProgress);
            }, 150);
        };
        window.addEventListener('resize', onResize);

        return () => {
            disposed = true;
            window.clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            source.onload = null;
            trigger?.kill();
            shards = [];
            frame = null;
        };
    }, [mounted]);

    return (
        <div className="relative flex justify-center items-center">
            {/* Hidden source image, used only for reading pixels */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={AVATAR_SRC} alt="" className="hidden" crossOrigin="anonymous" />

            {mounted &&
                createPortal(
                    <canvas
                        ref={canvasRef}
                        aria-hidden="true"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                            zIndex: 60,
                        }}
                    />,
                    document.body
                )}

            {/* Hero Avatar Card Container */}
            <div
                ref={cardRef}
                className={`relative w-[300px] h-[360px] sm:w-[320px] sm:h-[380px] rounded-3xl overflow-hidden bg-zinc-950/90 border border-emerald-500/30 p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-opacity duration-150 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        ref={innerImgRef}
                        src={AVATAR_SRC}
                        alt="Kalim - Senior Frontend & Motion Developer"
                        className="avatar-inner-img w-full h-full object-cover object-top absolute inset-0"
                    />

                    {/* Cyber Scanline Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/15 to-zinc-950/80 pointer-events-none" />

                    {/* Telemetry HUD Badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 backdrop-blur-md border border-zinc-800/80 p-3 rounded-xl flex items-center justify-between shadow-xl z-10">
                        <div>
                            <h3 className="text-white font-bold text-sm tracking-wide">Kalim</h3>
                            <span className="text-[10px] font-mono text-emerald-400">Motion &amp; Frontend Architect</span>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] animate-ping" />
                    </div>
                </div>
            </div>
        </div>
    );
}