'use client';

import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useEffect } from 'react';

export default function MagneticButton({ visible, text = "OPEN PROJECT" }: { visible: boolean, text?: string }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth lag effect using springs
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX + 20); // Offset from cursor
            mouseY.set(e.clientY + 20);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{
                left: smoothX,
                top: smoothY,
                position: 'fixed',
                zIndex: 100,
                pointerEvents: 'none',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: visible ? 1 : 0,
                scale: visible ? 1 : 0.8
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <div className="bg-white text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl backdrop-blur-md border border-white/20">
                <span className="text-[10px] font-black tracking-[0.2em] uppercase font-['JetBrains_Mono']">
                    {text}
                </span>
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
            </div>
        </motion.div>
    );
}
