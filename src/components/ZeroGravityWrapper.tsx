'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ZeroGravityWrapper({ children, active }: { children: React.ReactNode, active: boolean }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const x = useSpring(0, { stiffness: 50, damping: 20 });
    const y = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            if (active) {
                setMousePos({
                    x: (e.clientX / window.innerWidth - 0.5) * 100,
                    y: (e.clientY / window.innerHeight - 0.5) * 100,
                });
            }
        };
        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, [active]);

    useEffect(() => {
        if (active) {
            x.set(mousePos.x);
            y.set(mousePos.y);
        } else {
            x.set(0);
            y.set(0);
        }
    }, [mousePos, active, x, y]);

    return (
        <motion.div
            style={{ x, y }}
            animate={active ? { y: -20, rotate: 1 } : { y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 20, damping: 10 }}
        >
            {children}
        </motion.div>
    );
}
