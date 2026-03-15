'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function TransitionOverlay({ active }: { active: boolean }) {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0, transition: { delay: 0.5 } }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[1000] bg-white origin-top flex items-center justify-center overflow-hidden"
                >
                    {/* Cyan Light Leak Flash */}
                    <motion.div
                        initial={{ opacity: 1, x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22d3ee]/40 to-transparent skew-x-12 blur-3xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="text-[10px] font-mono tracking-[1em] opacity-40 uppercase">Initialising_Stream</div>
                        <div className="w-48 h-[1px] bg-black/10 overflow-hidden relative">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                className="absolute top-0 left-0 h-full w-1/2 bg-black"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
