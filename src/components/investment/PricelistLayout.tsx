'use client';

import { motion } from 'framer-motion';
import PriceCounter from './PriceCounter';

const tiers = [
    {
        id: 'core',
        name: 'CORE_PACKAGE',
        price: 1500,
        code: 'MOD_A1',
        description: 'ESSENTIAL DIGITAL FOUNDATION',
        features: ['3D SCENE_v1', 'CORE_INTERACTIONS', 'RESPONSIVE_GRID', 'SEO_BASE_INDEX'],
    },
    {
        id: 'interface',
        name: 'ELITE_INTERFACE',
        price: 3500,
        code: 'MOD_X9',
        description: 'ADVANCED VISUAL PERFORMANCE',
        features: ['CUSTOM_SHADERS', 'MORPH_GEOMETRY', 'MICRO_ANIMATIONS', 'UX_LOGIC_PRO'],
    },
    {
        id: 'system',
        name: 'ULTIMATE_SYSTEM',
        price: 7500,
        code: 'MOD_MAX',
        description: 'TOTAL DIGITAL ECOSYSTEM',
        features: ['FULL_3D_EXPERIENCE', 'DYNAMIC_PHYSICS', 'API_INTEGRATION', 'VIP_SUPPORT_L1'],
    },
];

const addons = [
    { id: 'seo', name: 'ADVANCED_SEO', price: 500 },
    { id: 'assets', name: '3D_ASSET_PACK', price: 1200 },
    { id: 'copy', name: 'COPY_ARCHITECT', price: 800 },
];

interface Props {
    selectedTier: string;
    onSelectTier: (id: any) => void;
    selectedAddons: string[];
    onToggleAddon: (id: string) => void;
}

export default function PricelistLayout({ selectedTier, onSelectTier, selectedAddons, onToggleAddon }: Props) {
    const currentPrice = (tiers.find(t => t.id === selectedTier)?.price || 0) +
        addons.filter(a => selectedAddons.includes(a.id)).reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="relative z-10 w-full min-h-screen p-8 md:p-16 flex flex-col pointer-events-none">
            {/* Header */}
            <header className="flex justify-between items-start mb-16">
                <div className="flex flex-col gap-2">
                    <h2 className="text-[10px] tracking-[0.5em] opacity-30 font-['JetBrains_Mono']">INVESTMENT_GUIDE_v2.0</h2>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Pricelist</h1>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px] opacity-30 font-mono tracking-widest text-black">TOTAL_ESTIMATE</span>
                    <div className="text-3xl font-black text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                        <PriceCounter value={currentPrice} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-8 items-stretch mb-16">
                {/* Tiers List */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
                    {tiers.map((tier) => (
                        <motion.div
                            key={tier.id}
                            onClick={() => onSelectTier(tier.id)}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`relative flex flex-col p-8 border border-black/10 bg-white/5 backdrop-blur-[12px] transition-all duration-500 cursor-pointer overflow-hidden group
                                ${selectedTier === tier.id ? 'border-[#22d3ee] bg-white/10 ring-1 ring-[#22d3ee]/30' : 'hover:border-black/30'}
                            `}
                        >
                            {/* Decorative Corner */}
                            <div className={`absolute top-0 right-0 w-8 h-8 border-t border-r transition-colors duration-500
                                ${selectedTier === tier.id ? 'border-[#22d3ee]' : 'border-transparent'}
                            `}></div>

                            <div className="flex justify-between items-start mb-8">
                                <span className="text-[10px] font-mono opacity-20 tracking-widest">BUILD: {tier.code}</span>
                                <span className="text-[10px] font-mono opacity-40 bg-[#22d3ee]/10 px-2 py-0.5 rounded text-[#22d3ee]">QTY-01</span>
                            </div>

                            <h3 className={`text-2xl font-black tracking-tighter mb-2 transition-colors duration-500
                                ${selectedTier === tier.id ? 'text-[#22d3ee]' : 'text-black/80'}
                            `}>{tier.name}</h3>
                            <p className={`text-[10px] mb-8 font-mono tracking-widest leading-relaxed transition-opacity
                                ${selectedTier === tier.id ? 'opacity-100 text-black' : 'opacity-40'}
                            `}>{tier.description}</p>

                            <div className="flex-1 flex flex-col gap-3">
                                {tier.features.map(f => (
                                    <div key={f} className="flex items-center gap-3">
                                        <div className={`w-1 h-1 rounded-full ${selectedTier === tier.id ? 'bg-[#22d3ee]' : 'bg-black/20'}`}></div>
                                        <span className={`text-[10px] font-mono tracking-widest transition-opacity duration-500 ${selectedTier === tier.id ? 'opacity-100 font-bold' : 'opacity-30'}`}>{f}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 flex justify-between items-end">
                                <span className={`text-3xl font-black tracking-tighter transition-colors ${selectedTier === tier.id ? 'text-black' : 'text-black/60'}`}>
                                    ${tier.price.toLocaleString()}
                                </span>
                                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${selectedTier === tier.id ? 'bg-[#22d3ee] scale-150' : 'bg-black/10'}`}></div>
                            </div>

                            {/* Ticker on hover */}
                            <div className="absolute bottom-0 left-0 w-full overflow-hidden h-6 bg-[#22d3ee]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 border-t border-[#22d3ee]/20">
                                <div className="animate-ticker whitespace-nowrap flex items-center h-full px-4 text-[8px] font-mono tracking-[0.3em] uppercase opacity-40 gap-8">
                                    <span>* REDEFINING DIGITAL LANDSCAPES</span>
                                    <span>* PRECISION ENGINEERED</span>
                                    <span>* SYST_ACT_0{tier.id.length}</span>
                                    <span>* ARCH_V.9</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Configurator / Add-ons */}
                <div className="w-full md:w-64 flex flex-col gap-6 pointer-events-auto">
                    <div className="p-6 border border-black/5 bg-white/5 backdrop-blur-xl flex flex-col gap-6">
                        <span className="text-[10px] font-mono opacity-20 tracking-[0.5em] mb-2 uppercase">Config_Toolbox</span>

                        <div className="flex flex-col gap-4">
                            {addons.map(addon => (
                                <button
                                    key={addon.id}
                                    onClick={() => onToggleAddon(addon.id)}
                                    className={`flex justify-between items-center p-4 border border-black/5 transition-all duration-300 group
                                        ${selectedAddons.includes(addon.id) ? 'bg-[#22d3ee]/10 border-[#22d3ee]/30' : 'hover:bg-black/5'}
                                    `}
                                >
                                    <div className="flex flex-col items-start gap-1">
                                        <span className={`text-[9px] font-mono tracking-widest transition-colors duration-300 ${selectedAddons.includes(addon.id) ? 'text-[#22d3ee]' : 'opacity-40'}`}>
                                            {addon.name}
                                        </span>
                                        <span className="text-[8px] font-mono opacity-20 tracking-widest">+${addon.price}</span>
                                    </div>
                                    <div className={`w-3 h-3 border border-black/20 rounded-sm flex items-center justify-center transition-all duration-300
                                        ${selectedAddons.includes(addon.id) ? 'bg-[#22d3ee] border-[#22d3ee]' : 'group-hover:border-black/40'}
                                    `}>
                                        {selectedAddons.includes(addon.id) && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-black/5 mt-4">
                            <button className="w-full py-4 bg-black text-white text-[10px] font-mono tracking-[0.5em] uppercase hover:bg-[#22d3ee] hover:text-black transition-all duration-500 shadow-2xl shadow-black/10">
                                INITIATE_BUILD
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 px-4">
                        <span className="text-[8px] opacity-20 font-mono tracking-widest leading-relaxed italic">
                            * ALL BUILDS INCLUDE UNLIMITED REVISIONS AND 24/7 INFRASTRUCTURE MONITORING.
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: ticker 10s linear infinite;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
