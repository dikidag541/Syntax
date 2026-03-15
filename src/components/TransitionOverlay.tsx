'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function TransitionOverlay({ active }: { active: boolean }) {
    const gridSize = 10; // 10x10 grid
    const cells = Array.from({ length: gridSize * gridSize });

    return (
        <div className={`fixed inset-0 pointer-events-none z-[100] grid grid-cols-10 grid-rows-10`}>
            <AnimatePresence>
                {active && cells.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: (i % gridSize + Math.floor(i / gridSize)) * 0.05,
                            ease: 'easeInOut'
                        }}
                        className="bg-white"
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
