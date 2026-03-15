'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PriceCounter({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(value);
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const obj = { val: displayValue };
        gsap.to(obj, {
            val: value,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
                setDisplayValue(Math.floor(obj.val));
            }
        });
    }, [value]);

    return (
        <span ref={counterRef} className="font-mono text-xl tracking-tighter">
            ${displayValue.toLocaleString()}
        </span>
    );
}
