'use client';

import { useEffect, useState } from 'react';
import "@fontsource/jetbrains-mono";

export default function HUD() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[50] font-['JetBrains_Mono',monospace] text-[10px] uppercase tracking-widest text-foreground/40 p-6 flex flex-col justify-between">
            {/* Top HUD */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
                        <span>SYST_ACTIVE: OK</span>
                    </div>
                    <span>SYNTAX_DIGITAL_ARCHITECTS</span>
                    <span>SRL_N: SX-2026-X</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span>UTC: {time}</span>
                    <span>IDENTITY: SYNTAX_PORTFOLIO</span>
                </div>
            </div>

            {/* Center Micro-details can be added here if needed */}

            {/* Bottom HUD */}
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-[1px] bg-[#22d3ee]/40"></div>
                        <span>STATUS: FLOATING</span>
                    </div>
                    <span>FREQ: 60.00HZ</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-4">
                        <span>MEM: 24GB</span>
                        <span>GPU: RTX_ON</span>
                    </div>
                    <div className="w-24 h-[1px] bg-foreground/20 relative">
                        <div className="absolute top-0 left-0 h-full bg-[#22d3ee] shadow-[0_0_5px_#22d3ee] animate-[loading_2s_infinite_linear]"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes loading {
          0% { width: 0%; left: 0; }
          50% { width: 100%; left: 0; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
        </div>
    );
}
