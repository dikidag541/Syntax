'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [cursorType, setCursorType] = useState<'circle' | 'shape'>('circle');

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 40, stiffness: 400, mass: 1.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleHoverStart = () => {
            setIsHovered(true);
            setCursorType('shape');
        };

        const handleHoverEnd = () => {
            setIsHovered(false);
            setCursorType('circle');
        };

        window.addEventListener('mousemove', moveMouse);

        // Add listeners for interactive elements if needed, 
        // or use global delegation. Pure circle for now.

        return () => {
            window.removeEventListener('mousemove', moveMouse);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Main Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-6 h-6 border border-foreground rounded-full pointer-events-none z-[10000] flex items-center justify-center origin-center"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    rotate: isHovered ? 45 : 0,
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                }}
            />

            {/* Trailing effect dot */}
            <motion.div
                className="fixed top-0 left-0 w-1 h-1 bg-foreground rounded-full pointer-events-none z-[9999]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </>
    );
}
