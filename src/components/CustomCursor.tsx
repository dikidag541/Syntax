'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    const springConfig = { damping: 25, stiffness: 200 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('button') ||
                target.classList.contains('cursor-pointer')
            ) {
                if (!isHovering) {
                    setIsHovering(true);
                }
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY, isHovering]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Main Cursor Ring */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="w-10 h-10 border border-[#22d3ee]/40 rounded-full flex items-center justify-center mix-blend-difference"
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    borderColor: isHovering ? 'rgba(34, 211, 238, 0.8)' : 'rgba(34, 211, 238, 0.4)',
                }}
            >
                <motion.div
                    animate={{
                        scale: isHovering ? 0.3 : 1,
                    }}
                    className="w-1 h-1 bg-[#22d3ee] rounded-full shadow-[0_0_10px_#22d3ee]"
                />
            </motion.div>

            {/* Particle Trail (Simplified CSS trails) */}
            <motion.div
                style={{
                    x: useSpring(mouseX, { damping: 40, stiffness: 300 }),
                    y: useSpring(mouseY, { damping: 40, stiffness: 300 }),
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="w-2 h-2 border border-[#22d3ee]/20 rounded-full mix-blend-difference"
            />
        </div>
    );
}
