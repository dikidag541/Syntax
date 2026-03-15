'use client';

import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

const projectSnapshots: Record<string, string> = {
    'ukm': 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=400&q=80',
    'sugoi': 'https://images.unsplash.com/photo-1522071823991-b1ae5e6a3058?auto=format&fit=crop&w=400&q=80',
    'af': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    'bk': 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80',
    'strategix': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
    'hmrp': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
    'mahapena': 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=400&q=80',
};

export default function ProjectPreview({ activeId }: { activeId: string | null }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            <motion.div
                style={{
                    x: springX,
                    y: springY,
                    translateX: 50,
                    translateY: -50,
                }}
                className="relative"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{
                        opacity: activeId ? 1 : 0,
                        scale: activeId ? 1 : 0.8,
                        rotate: activeId ? 0 : -5
                    }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-64 h-40 border border-[#22d3ee]/30 overflow-hidden bg-black/20 backdrop-blur-md relative"
                >
                    {/* Viewfinder Decorative Lines */}
                    <div className="absolute top-2 left-2 w-4 h-[1px] bg-[#22d3ee]"></div>
                    <div className="absolute top-2 left-2 w-[1px] h-4 bg-[#22d3ee]"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-[1px] bg-[#22d3ee]"></div>
                    <div className="absolute bottom-2 right-2 w-[1px] h-4 bg-[#22d3ee]"></div>

                    {activeId && projectSnapshots[activeId] && (
                        <motion.img
                            key={activeId}
                            src={projectSnapshots[activeId]}
                            initial={{ opacity: 0, filter: 'grayscale(1) blur(10px)' }}
                            animate={{ opacity: 1, filter: 'grayscale(0) blur(0px)' }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover opacity-80 mix-blend-screen"
                        />
                    )}

                    <div className="absolute bottom-2 left-3">
                        <span className="text-[8px] font-mono tracking-[0.4em] text-[#22d3ee] animate-pulse">
                            PREVIEW_SIGNAL_0
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
