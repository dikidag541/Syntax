'use client';

import { useState, useEffect } from 'react';

export default function useQWERTY(onTrigger: () => void) {
    const [input, setInput] = useState('');
    const target = 'qwerty';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (key.length !== 1) return;

            setInput((prev) => {
                const next = (prev + key).slice(-target.length);
                if (next === target) {
                    onTrigger();
                    return '';
                }
                return next;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onTrigger]);
}
