'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const IDLE_MESSAGES = [
    'AI_CORE: NEURAL MATRIX INITIALIZED',
    'SYNAPSE_GRID: 99.8% SYNCHRONIZED',
    'SECURE HANDSHAKE ESTABLISHED',
    'READY FOR INBOUND TRANSMISSION',
];

const SEND_SEQUENCE = [
    'ENCRYPTING PAYLOAD...',
    'ROUTING THROUGH NEURAL MESH...',
    'TRANSMISSION SUCCESSFUL // ROUTED TO NEURAL CORE',
];

export default function CyberFooter() {
    const [status, setStatus] = useState('idle');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [terminalText, setTerminalText] = useState('');
    const canvasRef = useRef(null);
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    const pulseRef = useRef(null);

    const typeTimer = useRef(null);
    const idleTimer = useRef(null);

    // --- Typewriter engine ---
    const typeLine = (text, speed, onDone) => {
        if (typeTimer.current) window.clearInterval(typeTimer.current);
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            setTerminalText(text);
            if (onDone) onDone();
            return;
        }

        let i = 0;
        setTerminalText('');
        typeTimer.current = window.setInterval(() => {
            i += 1;
            setTerminalText(text.slice(0, i));
            if (i >= text.length) {
                if (typeTimer.current) window.clearInterval(typeTimer.current);
                if (onDone) onDone();
            }
        }, speed);
    };

    const cycleIdle = (index = 0) => {
        typeLine(IDLE_MESSAGES[index % IDLE_MESSAGES.length], 28, () => {
            idleTimer.current = window.setTimeout(() => cycleIdle(index + 1), 2600);
        });
    };

    useEffect(() => {
        cycleIdle(0);
        return () => {
            if (typeTimer.current) window.clearInterval(typeTimer.current);
            if (idleTimer.current) window.clearTimeout(idleTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Neural particle field ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let animationFrameId;
        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', handleResize);

        const nodes = Array.from({ length: 42 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1.5,
        }));

        const impulse = { active: false, phase: 'idle', target: { x: 0, y: 0 }, startedAt: 0 };

        canvas.__triggerImpulse = (x, y) => {
            if (reduceMotion) return;
            impulse.active = true;
            impulse.phase = 'pull';
            impulse.target = { x, y };
            impulse.startedAt = performance.now();
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            if (impulse.active) {
                const elapsed = performance.now() - impulse.startedAt;
                if (impulse.phase === 'pull' && elapsed > 650) {
                    impulse.phase = 'burst';
                    impulse.startedAt = performance.now();
                    nodes.forEach((n) => {
                        const angle = Math.random() * Math.PI * 2;
                        const power = Math.random() * 9 + 5;
                        n.vx = Math.cos(angle) * power;
                        n.vy = Math.sin(angle) * power;
                    });
                } else if (impulse.phase === 'burst' && elapsed > 500) {
                    impulse.active = false;
                    impulse.phase = 'idle';
                }
            }

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 * (1 - dist / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach((node) => {
                if (impulse.active && impulse.phase === 'pull') {
                    const dx = impulse.target.x - node.x;
                    const dy = impulse.target.y - node.y;
                    const dist = Math.hypot(dx, dy) || 1;
                    node.vx += (dx / dist) * 0.9;
                    node.vy += (dy / dist) * 0.9;
                    node.vx *= 0.9;
                    node.vy *= 0.9;
                } else if (impulse.active && impulse.phase === 'burst') {
                    node.vx *= 0.94;
                    node.vy *= 0.94;
                }

                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                const speed = Math.hypot(node.vx, node.vy);
                ctx.fillStyle = speed > 3 ? '#34d399' : '#00d2ff';
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (status === 'sending') return;
        setStatus('sending');

        const canvas = canvasRef.current;
        const btn = buttonRef.current;
        const panel = panelRef.current;
        if (canvas && btn && panel) {
            const canvasRect = canvas.getBoundingClientRect();
            const btnRect = btn.getBoundingClientRect();
            const tx = btnRect.left + btnRect.width / 2 - canvasRect.left;
            const ty = btnRect.top + btnRect.height / 2 - canvasRect.top;
            if (canvas.__triggerImpulse) canvas.__triggerImpulse(tx, ty);
        }

        gsap.timeline()
            .to(panel, { boxShadow: '0 0 0 1px rgba(16,185,129,0.55), 0 30px 100px rgba(16,185,129,0.25)', duration: 0.4, ease: 'power2.out' })
            .to(panel, { boxShadow: '0 30px 100px rgba(0,0,0,0.8)', duration: 0.8, ease: 'power2.out' }, 0.5);

        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        typeLine(SEND_SEQUENCE[0], 22, () => {
            window.setTimeout(() => {
                typeLine(SEND_SEQUENCE[1], 22, () => {
                    window.setTimeout(() => {
                        typeLine(SEND_SEQUENCE[2], 18, () => {
                            setStatus('sent');
                            if (pulseRef.current) {
                                gsap.fromTo(
                                    pulseRef.current,
                                    { scale: 0.4, opacity: 0.7 },
                                    { scale: 2.6, opacity: 0, duration: 0.9, ease: 'power2.out' }
                                );
                            }
                            setFormData({ name: '', email: '', message: '' });
                            window.setTimeout(() => {
                                setStatus('idle');
                                cycleIdle(0);
                            }, 3200);
                        });
                    }, 500);
                });
            }, 550);
        });
    };

    return (
        <footer id="contact" className="relative bg-[#030305] pt-32 pb-16 px-6 border-t border-zinc-900 overflow-hidden">
            <style jsx>{`
        @keyframes aiScan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: translateY(1200%); opacity: 0; }
        }
        .ai-scan-line {
          position: absolute;
          inset-x: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #10b981, #00d2ff, transparent);
          animation: aiScan 6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes caret-blink { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .caret { display: inline-block; width: 6px; margin-left: 2px; background: #10b981; animation: caret-blink 1s step-end infinite; }

        .field-group { position: relative; }
        .field-edge {
          position: absolute; left: 0; bottom: 0; height: 2px; width: 0%;
          background: linear-gradient(90deg, #10b981, #00d2ff);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .field-group:focus-within .field-edge { width: 100%; }
      `}</style>

            {/* Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[160px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-2">Section 07 // Final Protocol</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">Initialize Contact</h2>
                    <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
                        Ready to deploy high-performance frontend architecture or build your next immersive digital experience? Send a transmission.
                    </p>
                </div>

                {/* AI Neural Particle Terminal Box */}
                <div ref={panelRef} className="relative rounded-3xl p-8 md:p-12 bg-zinc-950/90 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] mb-20 overflow-hidden">

                    {/* Interactive Neural Node Canvas Background */}
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" />

                    {/* AI Laser Scan Effect */}
                    <div className="ai-scan-line" />

                    {/* Terminal Header Bar */}
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-4 mb-8 gap-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs font-mono text-zinc-400 ml-2">secure_transmission_v2.sh</span>
                        </div>
                        <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 min-w-[210px] text-right">
                            {terminalText}
                            <span className="caret">&nbsp;</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                        <fieldset disabled={status !== 'idle'} className="space-y-6 disabled:opacity-60 transition-opacity duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="field-group">
                                    <label className="block text-xs font-mono text-emerald-400 mb-2">IDENTIFIER // NAME</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Alex Vance"
                                        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-colors"
                                    />
                                    <span className="field-edge rounded-full" />
                                </div>
                                <div className="field-group">
                                    <label className="block text-xs font-mono text-emerald-400 mb-2">FREQUENCY // EMAIL</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="alex@veloce.systems"
                                        className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-colors"
                                    />
                                    <span className="field-edge rounded-full" />
                                </div>
                            </div>

                            <div className="field-group">
                                <label className="block text-xs font-mono text-emerald-400 mb-2">TRANSMISSION // MESSAGE</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Describe project requirements or system specifications..."
                                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 transition-colors resize-none"
                                />
                                <span className="field-edge rounded-full" />
                            </div>
                        </fieldset>

                        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
                            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500">
                                <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_#10b981] ${status === 'idle' ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400 animate-pulse'}`} />
                                <span>AI_NEURAL_LINK: {status === 'idle' ? 'ACTIVE' : status === 'sending' ? 'TRANSMITTING' : 'CONFIRMED'} [ AES-256 ]</span>
                            </div>

                            <button
                                ref={buttonRef}
                                type="submit"
                                disabled={status !== 'idle'}
                                className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:cursor-default cursor-pointer overflow-hidden"
                            >
                                <span
                                    ref={pulseRef}
                                    className="absolute inset-0 rounded-xl bg-emerald-300/70 pointer-events-none"
                                    style={{ opacity: 0 }}
                                />
                                <span className="relative flex items-center justify-center gap-2">
                                    {status === 'sending' && (
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
                                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                    )}
                                    {status === 'sent' ? (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                            <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : null}
                                    {status === 'idle' && 'DISPATCH TRANSMISSION'}
                                    {status === 'sending' && 'TRANSMITTING...'}
                                    {status === 'sent' && 'TRANSMISSION SENT'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Bottom Telemetry & Copyright Bar */}
                <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-xs font-mono gap-4">
                    <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>SYSTEM STATUS: OPERATIONAL [ 60 FPS ]</span>
                    </div>

                    <div>
                        <span>© {new Date().getFullYear()} Kalim. ALL RIGHTS RESERVED.</span>
                    </div>

                    <div className="flex space-x-6">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">GITHUB</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">TWITTER</a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">LINKEDIN</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}