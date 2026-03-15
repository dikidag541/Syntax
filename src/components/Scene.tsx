'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, ScrollControls } from '@react-three/drei';
import { Suspense } from 'react';
import AntigravityObject from './AntigravityObject';

export default function Scene({ activeProject, isFocused, progress }: { activeProject: string | null, isFocused: boolean, progress: number }) {
    return (
        <div className="w-full h-full">
            <Canvas
                shadows
                camera={{ position: [0, 0, 5], fov: 35 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    <AntigravityObject
                        activeProject={activeProject}
                        isFocused={isFocused}
                        progress={progress}
                    />

                    <ContactShadows
                        position={[0, -2.5, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={4}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
