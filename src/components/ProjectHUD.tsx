'use client';

import { motion, AnimatePresence } from 'framer-motion';

const projectInfo: Record<string, any> = {
    'ukm': { id: 'UKM_ETALASE', sector: 'E-COMMERCE_ECOSYSTEM', coords: '40.7128° N', year: '2026' },
    'sugoi': { id: 'SUGOI8_MGMT', sector: 'TALENT_BRANDING', coords: '35.6895° N', year: '2026' },
    'af': { id: 'AF_STUDIO', sector: 'CREATIVE_SPACE', coords: '52.5200° N', year: '2025' },
    'bk': { id: 'BALIK_KUCING', sector: 'VISUAL_ART', coords: '48.8566° N', year: '2025' },
    'strategix': { id: 'STRATEGIX_GRP', sector: 'CORPORATE_CONSULT', coords: '51.5074° N', year: '2026' },
    'hmrp': { id: 'HMRP_COMM', sector: 'ACADEMIC_SOC', coords: '1.3521° N', year: '2024' },
    'mahapena': { id: 'MAHAPENA_ARCHIVE', sector: 'VISUAL_JOURNAL', coords: '7.8014° S', year: '2024' },
};

export default function ProjectHUD({ activeId }: { activeId: string | null }) {
    const info = activeId ? projectInfo[activeId] : null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 font-['JetBrains_Mono',monospace] text-[10px] tracking-[0.2em] font-bold p-12">
            <AnimatePresence mode="wait">
                {info && (
                    <motion.div
                        key={info.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full relative"
                    >
                        <div className="absolute top-0 right-0 flex flex-col gap-1 text-right">
                            <span>PROJECT_ID: {info.id}</span>
                            <span>SECTOR: {info.sector}</span>
                        </div>

                        <div className="absolute bottom-0 left-0 flex flex-col gap-1">
                            <span>LAT_LONG: {info.coords}</span>
                            <span>TIMESTAMP: {info.year}_REF</span>
                        </div>

                        <div className="absolute top-1/2 left-0 -translate-y-1/2 p-2 border-l border-white/20">
                            <span className="[writing-mode:vertical-lr] rotate-180">VIEWFINDER_ACTIVE</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
