'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import InteractiveArcade from './components/InteractiveArcade';
import CinematicGallery from './components/CinematicGallery';
import CyberTestimonials from './components/CyberTestimonials';
import CyberFooter from './components/CyberFooter';
import PixelShatterAvatar from './components/PixelShatterAvatar';
import CyberExperience from './components/CyberExperience';
import CyberEducation from './components/CyberEducation';
import Cybernav from './components/Cybernav';
import CyberBento from './components/Cyberbento';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLElement>(null);
  const rotatingTextRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const rotatingWords = ['Digital Realities', 'Frontend Systems', 'Web Experiences'];
  const [wordIndex, setWordIndex] = useState(0);

  const handleBentoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    const textInterval = setInterval(() => {
      gsap.to(rotatingTextRef.current, {
        y: -15,
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          setWordIndex((prev) => (prev + 1) % rotatingWords.length);
          gsap.fromTo(
            rotatingTextRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    }, 3200);

    const ctx = gsap.context(() => {
      gsap.from('.nav-anim', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.hero-anim', { y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out' });

      // Extraordinary 3D Split-Reveal Scroll Effect
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      scrollTl
        .to(leftTextRef.current, { x: -100, rotationY: -10, opacity: 0, ease: 'power1.inOut' }, 0)
        .to(rightCardRef.current, { x: 100, rotationY: 10, opacity: 0, ease: 'power1.inOut' }, 0);

      gsap.to('.floating-icon', {
        y: '+=15',
        repeat: -1,
        yoyo: true,
        duration: 3.5,
        stagger: { amount: 2.5, from: 'random' },
        ease: 'sine.inOut',
      });

      // Ball Follower animation
      const path = linePathRef.current;
      if (path && ballRef.current) {
        const pathLength = path.getTotalLength();
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: bentoRef.current, start: 'top 60%', end: 'bottom 40%', scrub: 1.5 },
        });

        tl.to(path, { strokeDashoffset: 0, ease: 'none' }, 0);
        tl.to(ballRef.current, { motionPath: { path: path, align: path, alignOrigin: [0.5, 0.5] }, ease: 'none' }, 0);
      }

      gsap.utils.toArray<HTMLElement>('.bento-card').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 50%', scrub: 1 },
          }
        );
      });

      const xSet = gsap.quickTo('.floating-icon', 'x', { duration: 0.5, ease: 'power2.out' });
      const ySet = gsap.quickTo('.floating-icon', 'y', { duration: 0.5, ease: 'power2.out' });
      const bgXSet = gsap.quickTo(bgRef.current, 'x', { duration: 0.8, ease: 'power2.out' });
      const bgYSet = gsap.quickTo(bgRef.current, 'y', { duration: 0.8, ease: 'power2.out' });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xNorm = (clientX / window.innerWidth - 0.5) * 25;
        const yNorm = (clientY / window.innerHeight - 0.5) * 25;

        bgXSet(-xNorm * 0.6);
        bgYSet(-yNorm * 0.6);

        document.querySelectorAll<HTMLElement>('.floating-icon').forEach((icon) => {
          const speed = parseFloat(icon.dataset.speed || '1');
          xSet(xNorm * speed);
          ySet(yNorm * speed);
        });
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      return () => window.removeEventListener('mousemove', handleMouseMove);
    });

    return () => {
      clearInterval(textInterval);
      ctx.revert();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#030305] text-zinc-100 relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        @keyframes bg-pulse-zoom {
          0%, 100% { transform: scale(1.03) translateZ(0); filter: brightness(0.85) contrast(1.05); }
          50% { transform: scale(1.10) translateZ(0); filter: brightness(1.1) contrast(1.15); }
        }
        .cyber-bg-fx { animation: bg-pulse-zoom 10s ease-in-out infinite; will-change: transform, filter; }
        .floating-icon { position: absolute; will-change: transform; transform: translateZ(0); }
        .cyber-icon-card {
          width: 100%; height: 100%;
          background: rgba(12, 18, 34, 0.85);
          border: 1px solid rgba(16, 185, 129, 0.25);
          backdrop-filter: blur(16px);
          transform: translateZ(0);
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .cyber-icon-card:hover {
          border-color: rgba(16, 185, 129, 1);
          background: rgba(16, 185, 129, 0.2);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.45);
          transform: scale(1.15) rotate(6deg) translateY(-3px) translateZ(0);
        }
        .h1-glow { text-shadow: 0 0 50px rgba(16, 185, 129, 0.3); }
        .bento-card {
          position: relative;
          background: linear-gradient(145deg, rgba(14, 20, 38, 0.75) 0%, rgba(8, 12, 24, 0.85) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 2rem;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.7);
          transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bento-card:hover {
          border-color: rgba(16, 185, 129, 0.5);
          transform: translateY(-6px);
          box-shadow: 0 30px 70px -15px rgba(16, 185, 129, 0.2);
        }
        .bento-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.14), transparent 70%);
          opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
        }
        .bento-card:hover::before { opacity: 1; }
        @keyframes border-rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes continuous-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .rotating-border-btn {
          position: relative; border-radius: 9999px;
          background: linear-gradient(135deg, #0066ff 0%, #00d2ff 100%);
          padding: 2px; overflow: hidden;
          animation: continuous-float 3s ease-in-out infinite;
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
        }
        .rotating-border-btn::before {
          content: ''; position: absolute; inset: -50%;
          background: conic-gradient(from 0deg at 50% 50%, rgba(0,210,255,0) 0deg, rgba(0,210,255,0) 270deg, #10b981 310deg, #ffffff 360deg);
          animation: border-rotate 4s linear infinite;
        }
        .btn-inner-content { position: relative; background: #0066ff; border-radius: 9999px; transition: background 0.3s ease; }
        .rotating-border-btn:hover .btn-inner-content { background: #0052cc; }
      `}</style>

      {/* Floating Navigation */}
      <Cybernav />

      {/* Hero Section */}
      <section ref={heroRef} className="pt-[140px] pb-[100px] relative flex flex-col items-center justify-center min-h-[95vh] w-full overflow-hidden px-6">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div ref={bgRef} className="absolute inset-[-40px] bg-cover bg-center opacity-50 cyber-bg-fx" style={{ backgroundImage: `url('/cyber-hero-bg.png')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/90 via-[#030305]/50 to-[#030305]" />
        </div>

        {/* Floating Icons */}
        <div data-speed="1.3" className="floating-icon top-[22%] left-[4%] md:left-[7%] w-14 h-14 pointer-events-auto cursor-pointer z-20"><div className="cyber-icon-card rounded-2xl flex items-center justify-center text-lg shadow-2xl">💻</div></div>
        <div data-speed="0.8" className="floating-icon top-[42%] left-[3%] md:left-[5%] w-14 h-14 pointer-events-auto cursor-pointer z-20"><div className="cyber-icon-card rounded-2xl flex items-center justify-center text-lg shadow-2xl">📌</div></div>
        <div data-speed="1.6" className="floating-icon top-[62%] left-[5%] md:left-[8%] w-14 h-14 pointer-events-auto cursor-pointer z-20"><div className="cyber-icon-card rounded-2xl flex items-center justify-center text-lg shadow-2xl">▶️</div></div>

        <div data-speed="1.4" className="floating-icon top-[22%] right-[4%] md:right-[7%] w-14 h-14 pointer-events-auto cursor-pointer z-20"><div className="cyber-icon-card rounded-2xl flex items-center justify-center text-lg shadow-2xl">📦</div></div>
        <div data-speed="0.9" className="floating-icon top-[42%] right-[3%] md:right-[5%] w-14 h-14 pointer-events-auto cursor-pointer z-20"><div className="cyber-icon-card rounded-2xl flex items-center justify-center text-lg shadow-2xl">⚡</div></div>
        <div data-speed="1.7" className="floating-icon top-[62%] right-[5%] md:right-[8%] w-14 h-14 pointer-events-auto cursor-pointer z-20"><div className="cyber-icon-card rounded-2xl flex items-center justify-center text-lg shadow-2xl">🔮</div></div>

        {/* Main Hero Container */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-30 perspective-[1200px]">

          {/* Left Column: Text Content */}
          <div ref={leftTextRef} className="lg:col-span-7 text-left space-y-6 transform-gpu">
            <div className="hero-anim inline-flex items-center space-x-3 rounded-2xl bg-zinc-900/90 px-4 py-2 border border-emerald-500/20 shadow-2xl backdrop-blur-md">
              <span className="text-base">🏆</span>
              <div className="flex flex-col text-left">
                <span className="text-[9px] leading-[10px] font-semibold text-emerald-400 tracking-wider">PRODUCT HUNT</span>
                <span className="text-[13px] leading-[16px] font-bold text-zinc-100">Featured Creator Portfolio</span>
              </div>
            </div>

            <div className="hero-anim space-y-2">
              <h1 className="h1-glow text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                Crafting <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">Digital Realities</span> That Breathe —
              </h1>
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-emerald-400 min-h-[1.3em] flex items-center">
                <span ref={rotatingTextRef} className="inline-block bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
                  {rotatingWords[wordIndex]}
                </span>
              </div>
            </div>

            <p className="hero-anim max-w-lg text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
              Next-generation frontend architecture, fluid motion engineering, and immersive interactive design systems.
            </p>

            <div className="hero-anim pt-2 flex items-center space-x-4">
              <a href="#projects" className="rotating-border-btn inline-block group">
                <div className="btn-inner-content px-8 py-4 flex items-center space-x-3 text-white font-bold text-base">
                  <span>Launch Studio</span>
                </div>
              </a>
              <a href="#contact" className="px-6 py-4 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-semibold text-sm transition-all">
                Direct Transmission
              </a>
            </div>
          </div>

          {/* Right Column: Pixel Shatter Avatar Component */}
          <div ref={rightCardRef} className="lg:col-span-5 flex justify-center lg:justify-end hero-anim transform-gpu">
            <PixelShatterAvatar />
          </div>

        </div>
      </section>

      {/* Bento Grid Section */}
      <div ref={bentoRef}>
        <CyberBento onBentoMouseMove={handleBentoMouseMove} />
      </div>

      {/* Connector Beam & Ball Follower */}
      <div className="relative w-full h-36 flex justify-center items-center overflow-visible my-4">
        <svg className="absolute w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M 150 10 C 600 120 600 120 1050 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <path ref={linePathRef} d="M 150 10 C 600 120 600 120 1050 10" fill="none" stroke="url(#beam-gradient)" strokeWidth="4" strokeLinecap="round" />
          <defs>
            <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#00d2ff" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        <div ref={ballRef} className="absolute w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_20px_#00d2ff,0_0_40px_#10b981] z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
        <div className="relative z-10 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 text-[11px] font-mono tracking-widest text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          ⚡ SYSTEM LINK: ACTIVE
        </div>
      </div>

      <CyberExperience />
      <CyberEducation />

      {/* Interactive Arcade Project Module */}
      <div id="projects">
        <InteractiveArcade />
      </div>

      {/* Cinematic Gallery Vault */}
      <CinematicGallery />

      {/* Testimonials Matrix */}
      <CyberTestimonials />

      {/* Contact Footer */}
      <div id="contact">
        <CyberFooter />
      </div>

    </main>
  );
}