'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, MeshTransmissionMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface SatelliteProps {
    index: number;
    count: number;
}

function AddonSatellite({ index, count }: SatelliteProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const orbitRadius = 2.5;
    const speed = 0.5 + index * 0.2;

    useFrame((state) => {
        const time = state.clock.getElapsedTime() * speed;
        const angle = (index / count) * Math.PI * 2 + time;
        if (meshRef.current) {
            meshRef.current.position.set(
                Math.cos(angle) * orbitRadius,
                Math.sin(time * 0.5) * 0.5,
                Math.sin(angle) * orbitRadius
            );
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
        </mesh>
    );
}

interface SceneProps {
    tier: 'core' | 'interface' | 'system';
    addonCount: number;
}

function GeometricEngine({ tier, addonCount }: SceneProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const { mouse } = useThree();

    // Geometries
    const cube = useMemo(() => new THREE.BoxGeometry(1.5, 1.5, 1.5), []);
    const tetra = useMemo(() => new THREE.TetrahedronGeometry(1.5), []);
    const dodeca = useMemo(() => new THREE.DodecahedronGeometry(1.5), []);

    useEffect(() => {
        if (!meshRef.current) return;

        let targetGeom: THREE.BufferGeometry = cube;
        if (tier === 'interface') targetGeom = tetra;
        if (tier === 'system') targetGeom = dodeca;

        meshRef.current.geometry = targetGeom;

        gsap.fromTo(meshRef.current.scale,
            { x: 0.8, y: 0.8, z: 0.8 },
            { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)' }
        );
    }, [tier, cube, tetra, dodeca]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.2, 0.1);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -mouse.x * 0.2, 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh ref={meshRef}>
                    {tier === 'core' && (
                        <meshStandardMaterial wireframe color="#22d3ee" />
                    )}
                    {tier === 'interface' && (
                        <MeshTransmissionMaterial
                            samples={6}
                            resolution={256}
                            thickness={1}
                            roughness={0.1}
                            ior={1.4}
                            chromaticAberration={0.8}
                            anisotropy={0.5}
                            color="#ffffff"
                        />
                    )}
                    {tier === 'system' && (
                        <MeshTransmissionMaterial
                            samples={10}
                            resolution={512}
                            thickness={1.5}
                            roughness={0.05}
                            ior={1.6}
                            chromaticAberration={2.0}
                            distortion={2.0}
                            temporalDistortion={1.0}
                            color="#ffffff"
                        />
                    )}
                </mesh>
            </Float>

            {/* Add-on visualization */}
            {Array.from({ length: addonCount }).map((_, i) => (
                <AddonSatellite key={i} index={i} count={addonCount} />
            ))}
        </group>
    );
}

function BlueprintGrid() {
    return (
        <gridHelper args={[30, 30, 0x22d3ee, 0x22d3ee]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -5]}>
            <meshBasicMaterial transparent opacity={0.3} />
        </gridHelper>
    );
}

export default function PricelistScene({ tier = 'core', addonCount = 0 }: SceneProps) {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={2} />

                <BlueprintGrid />
                <GeometricEngine tier={tier} addonCount={addonCount} />

                <Environment preset="studio" />
            </Canvas>
        </div>
    );
}
