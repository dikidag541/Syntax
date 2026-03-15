'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import HUD from '@/components/HUD';
import AntigravityObject from '@/components/AntigravityObject';
import ProjectItem from '@/components/ProjectItem';
import TeamSection from '@/components/TeamSection';
import ProjectSidebar from '@/components/ProjectSidebar';
import ProjectHUD from '@/components/ProjectHUD';
import ContactTerminal from '@/components/ContactTerminal';
import MagneticButton from '@/components/MagneticButton';
import TransitionOverlay from '@/components/TransitionOverlay';
import CustomCursor from '@/components/CustomCursor';
import ProjectPreview from '@/components/ProjectPreview';
import SmoothScroll from '@/components/SmoothScroll';
import Scene from '@/components/Scene';
import ZeroGravityWrapper from '@/components/ZeroGravityWrapper';
import IntroLoader from '@/components/IntroLoader';
import useQWERTY from '@/hooks/useQWERTY';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 'ukm', name: 'UKM Indonesia' },
  { id: 'sugoi', name: 'Sugoi Japan' },
  { id: 'af', name: 'Ahmad Faiz' },
  { id: 'bk', name: 'Bali Kucing' },
  { id: 'strategix', name: 'Grapadi Strategix' },
  { id: 'hmrp', name: 'HMRP' },
  { id: 'mahapena', name: 'Mahapena' },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isTeamHovered, setIsTeamHovered] = useState(false);
  const [isZeroGravity, setIsZeroGravity] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const loaderFinished = () => {
    setIsLoading(false);
  };

  useQWERTY(() => {
    setIsZeroGravity(true);
  });

  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    const ctx = gsap.context(() => {
      // 1. Hero Fade Out
      gsap.to(heroRef.current, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        }
      });

      // 2. Nav Reveal & Progress Tracking
      ScrollTrigger.create({
        trigger: '#catalog-section',
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => setScrollProgress(self.progress),
        onEnter: () => setShowNav(true),
        onLeaveBack: () => setShowNav(false),
      });

      // 3. Project Visual Synchronizer
      projects.forEach((project) => {
        ScrollTrigger.create({
          trigger: `#view-section-${project.id}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveProjectId(project.id),
          onEnterBack: () => setActiveProjectId(project.id),
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative w-full overflow-x-hidden selection:bg-black selection:text-white">
      <IntroLoader onComplete={loaderFinished} />

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <SmoothScroll />
          <CustomCursor />

          {/* LAYER 0: BASE BACKGROUND COLOR */}
          <div className="fixed inset-0 bg-[#f8f8f8] z-[-2]" />

          {/* LAYER 1: BACKGROUND 3D - FIXED */}
          <div className="fixed inset-0 z-[-1] pointer-events-none">
            <Scene
              activeProject={activeProjectId}
              isFocused={isTeamHovered}
              progress={scrollProgress}
            />
          </div>

          {/* OVERLAY INTERACTION LAYER - Revealing sequentially */}
          <ProjectHUD activeId={activeProjectId} />

          <TeamSection
            isVisible={showNav}
            onHover={setIsTeamHovered}
          />

          <ProjectSidebar
            isVisible={showNav}
            activeId={activeProjectId}
            onHover={setActiveProjectId}
          />

          <MagneticButton visible={!!activeProjectId && showNav} />

          <ZeroGravityWrapper active={isZeroGravity}>
            <HUD />

            {/* SECTION 1: THE HERO (QWERTY ONLY) */}
            <section
              ref={heroRef}
              className="relative h-screen flex flex-col items-center justify-center p-6 md:p-8 text-center"
            >
              <div className="z-10 w-full max-w-full overflow-hidden">
                <h1 className="text-[18vw] md:text-[15vw] leading-[0.8] mb-8 animate-reveal tracking-tighter font-black break-words">
                  SyntaX
                </h1>
                <div className="flex flex-col items-center gap-6 animate-reveal opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                  <p className="text-xl tracking-[0.4em] font-light opacity-60">
                    DIGITAL ARCHITECTS OF ETHEREAL EXPERIENCES
                  </p>
                  <div className="w-24 h-[1px] bg-foreground/20"></div>
                </div>
              </div>
            </section>

            {/* SECTION 2: THE CATALOG (Sequential 80vh markers) */}
            <div id="catalog-section" className="relative">
              {/* Subtle background text to fill dead space */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 overflow-hidden select-none">
                <span className="text-[25vw] font-black tracking-tighter uppercase whitespace-nowrap rotate-90 md:rotate-0">
                  PROJECT_ARCHIVE
                </span>
              </div>

              {projects.map((project) => (
                <section
                  key={project.id}
                  id={`view-section-${project.id}`}
                  className="relative h-[80vh] flex items-center justify-center overflow-hidden pointer-events-none"
                >
                  {/* Distance for background viewfinder transitions */}
                </section>
              ))}
            </div>

            {/* SECTION 3: FINALE */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center px-8 border-t border-black/5 bg-transparent">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="text-[6vw] font-black tracking-tighter leading-none mb-12 opacity-80 uppercase"
              >
                LET'S BUILD THE<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.3)' }}>NEXT DIMENSION</span>
              </motion.h2>
            </section>

            {/* SECTION 4: CONTACT TERMINAL */}
            <section className="relative min-h-screen flex items-center justify-center bg-black/[0.02]">
              <div className="w-full max-w-5xl px-8 py-24">
                <ContactTerminal />
              </div>
            </section>
          </ZeroGravityWrapper>

          <TransitionOverlay active={isTransitioning} />
        </motion.div>
      )}
    </main>
  );
}
