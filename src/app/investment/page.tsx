'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PricelistScene from '@/components/investment/PricelistScene';
import PricelistLayout from '@/components/investment/PricelistLayout';
import CustomCursor from '@/components/CustomCursor';
import Link from 'next/link';

export default function InvestmentPage() {
    const [selectedTier, setSelectedTier] = useState<'core' | 'interface' | 'system'>('core');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    return (
        <motion.main
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full min-h-screen bg-[#f8f8f8] overflow-hidden selection:bg-[#22d3ee] selection:text-black"
        >
            <CustomCursor />

            {/* Back to Home Link */}
            <div className="fixed top-8 left-8 z-[100] pointer-events-auto">
                <Link href="/" className="group flex items-center gap-3 text-[10px] font-mono tracking-[0.5em] uppercase opacity-30 hover:opacity-100 transition-opacity duration-500">
                    <span className="group-hover:-translate-x-1 transition-transform duration-500">←</span>
                    RETURN_TO_BASE
                </Link>
            </div>

            {/* 3D Scene Layer */}
            <PricelistScene
                tier={selectedTier}
                addonCount={selectedAddons.length}
            />

            {/* UI Overlay Layer */}
            <PricelistLayout
                selectedTier={selectedTier}
                onSelectTier={setSelectedTier}
                selectedAddons={selectedAddons}
                onToggleAddon={toggleAddon}
            />

            {/* Decorative Vignette */}
            <div className="fixed inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/5 z-20" />
        </motion.main>
    );
}
