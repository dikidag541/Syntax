'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PriceCounter({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);
    const [mounted, setMounted] = useState(false);
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const obj = { val: displayValue };
        gsap.to(obj, {
            val: value,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
                setDisplayValue(Math.floor(obj.val));
            }
        });
    }, [value, mounted]);

    return (
        <span ref={counterRef} className="font-mono text-xl tracking-tighter">
            ${mounted ? displayValue.toLocaleString() : displayValue}
        </span>
    );
}
