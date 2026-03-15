'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ContactTerminal() {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<string[]>(['SYSTEM_BOOT: SUCCESSFUL', 'READY_FOR_COMMUNICATION...']);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const msg = input.trim();
        setInput('');
        setLogs((prev) => [...prev, `> ${msg}`]);

        // Simulate sending process
        setTimeout(() => {
            setLogs((prev) => [...prev, 'ESTABLISHING_SECURE_ULTRALINK...']);
        }, 500);

        setTimeout(() => {
            setLogs((prev) => [...prev, 'UPLOADING_ENCRYPTED_DATA_PACKET...']);
        }, 1200);

        setTimeout(() => {
            setLogs((prev) => [...prev, 'MISSION_ACCOMPLISHED. TRANSMISSION_SENT_TO_DIMENSION_X.']);
        }, 2200);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-12 bg-transparent">
            <div className="mb-12">
                <h2 className="text-[8vw] font-black leading-none uppercase tracking-tighter mb-4">
                    Let's build the <br /> next dimension.
                </h2>
            </div>

            <div
                className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-xl p-6 font-['JetBrains_Mono',monospace] text-[12px] text-foreground/60 shadow-2xl cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex flex-col gap-2 mb-4 h-48 overflow-y-auto">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {log}
                        </motion.div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 items-center border-t border-white/10 pt-4">
                    <span className="text-[#22d3ee]">visitor@syntax:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="bg-transparent border-none outline-none flex-1 py-1 text-foreground"
                        placeholder="Type your message..."
                        autoFocus
                    />
                </form>
            </div>

            <div className="mt-24 flex justify-between items-center text-[10px] tracking-[0.2em] font-bold opacity-20 uppercase">
                <span>© 2026 SYNTAX IDENTITY</span>
                <span>DESIGNED BY AD ARCHITECTS</span>
                <span>BUILT_WITH_ANTIGRAVITY</span>
            </div>
        </div>
    );
}
