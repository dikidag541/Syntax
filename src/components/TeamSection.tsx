'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const team = [
    { name: 'DIKI FERDIANTO', role: 'TECHNICAL ARCHITECT' },
    { name: 'PANDU SATRIA', role: 'CREATIVE ARCHITECT' },
    { name: 'AG_ENGINE', role: 'CORE INTELLIGENCE' },
];

interface Props {
    onHover: (hovered: boolean) => void;
    isVisible: boolean;
}

export default function TeamSection({ onHover, isVisible }: Props) {
    return (
        <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            className="fixed left-6 md:left-12 bottom-8 md:top-1/2 md:-translate-y-1/2 z-[60] flex flex-col gap-6 md:gap-10 items-start pointer-events-auto"
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            <div className="text-[10px] tracking-[0.5em] opacity-30 mb-8 font-['JetBrains_Mono'] leading-relaxed">THE_ARCHITECTS_v1.2</div>

            {team.map((member, index) => (
                <div
                    key={member.name}
                    className="group relative flex items-center gap-8 cursor-pointer"
                >
                    <div
                        className="w-1.5 h-1.5 rounded-full border border-white/40 transition-all duration-500 group-hover:bg-white group-hover:scale-150"
                    />

                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] tracking-[0.3em] uppercase font-['JetBrains_Mono'] opacity-30 group-hover:opacity-100 transition-all duration-500 translate-x-0 group-hover:translate-x-2 leading-none">
                            {member.name}
                        </span>
                        <span className="text-[8px] tracking-[0.2em] opacity-0 group-hover:opacity-40 transition-all duration-500 font-mono translate-x-0 group-hover:translate-x-2 leading-none">
                            {member.role}
                        </span>
                    </div>

                    <span className="text-[8px] opacity-10 font-mono tracking-[0.2em]">
                        [0{index + 1}]
                    </span>
                </div>
            ))}
        </motion.section>
    );
}
