'use client';

import { useRef, useMemo, useLayoutEffect, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Custom shader snippet for subtle iridescence
const iridescencePars = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uVelocity;
`;

const iridescenceMain = `
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float cosine = dot(viewDir, vNormal);
  float fresnel = pow(1.0 - abs(cosine), 3.0);
  
  // Soap bubble-like interference colors
  vec3 color1 = vec3(0.8, 0.5, 1.0); // Purple/Indigo
  vec3 color2 = vec3(0.5, 1.0, 0.8); // Cyan/Green
  vec3 color3 = vec3(1.0, 0.8, 0.5); // Gold/Orange
  
  vec3 irid = mix(color1, color2, sin(fresnel * 10.0 + uTime + uVelocity * 5.0) * 0.5 + 0.5);
  irid = mix(irid, color3, cos(fresnel * 7.0 - uTime * 0.5) * 0.5 + 0.5);
  
  gl_FragColor.rgb += irid * fresnel * 0.15 * (1.0 + uVelocity * 2.0);
`;

export default function AntigravityObject({ activeProject, isFocused, progress }: { activeProject: string | null, isFocused: boolean, progress: number }) {
    const meshRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();

    // Floating animation constants
    const floatAmplitude = 0.2;
    const floatSpeed = 1.5;

    // Refs for dynamic uniforms
    const shaderRefs = useRef<{
        time: number,
        velocity: number,
        projectOpacity: number,
        blurFocus: number,
        projectMix: number
    }>({
        time: 0,
        velocity: 0,
        projectOpacity: 0,
        blurFocus: 0,
        projectMix: 0
    });

    // Multi-texture state
    const [textures, setTextures] = useState<Record<string, THREE.Texture>>({});
    const activeTextureRef = useRef<THREE.Texture | null>(null);
    const prevTextureRef = useRef<THREE.Texture | null>(null);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        const projectUrls: Record<string, string> = {
            'ukm': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
            'sugoi': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
            'af': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1000',
            'bk': 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1000',
            'strategix': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000',
            'hmrp': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000',
        };

        Object.entries(projectUrls).forEach(([id, url]) => {
            loader.load(url, (tex) => {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                setTextures(prev => ({ ...prev, [id]: tex }));
            });
        });
    }, []);

    // Handle texture switching with morph
    useEffect(() => {
        if (activeProject && textures[activeProject]) {
            prevTextureRef.current = activeTextureRef.current;
            activeTextureRef.current = textures[activeProject];
            shaderRefs.current.projectMix = 0; // Reset mix for new transition
        } else if (!activeProject) {
            prevTextureRef.current = activeTextureRef.current;
            activeTextureRef.current = null;
        }
    }, [activeProject, textures]);

    useFrame((state, delta) => {
        // Scaling logic based on external progress
        const targetScale = progress > 0.01 ? THREE.MathUtils.mapLinear(progress, 0.01, 1, 1, 15) : 1;
        meshRef.current?.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // Texture morph logic
        const targetMix = activeProject ? 1 : 0;
        shaderRefs.current.projectMix = THREE.MathUtils.lerp(shaderRefs.current.projectMix, targetMix, 0.1);

        // Desaturation / Opacity
        const targetOpacity = activeProject ? 1 : 0;
        shaderRefs.current.projectOpacity = THREE.MathUtils.lerp(shaderRefs.current.projectOpacity, targetOpacity, 0.1);

        // Blur Focus for DOF simulation (Team section is further down)
        const targetFocus = isFocused ? 1 : 0;
        shaderRefs.current.blurFocus = THREE.MathUtils.lerp(shaderRefs.current.blurFocus, targetFocus, 0.1);

        if (coreRef.current) {
            const mat = coreRef.current.material as any;
            mat.roughness = THREE.MathUtils.lerp(0.15, 0.8, shaderRefs.current.blurFocus);

            // Interaction rotation: Faster spin when project is hovered
            const spinIntensity = activeProject ? 2.5 : 1.0;
            coreRef.current.rotation.y += delta * 0.2 * spinIntensity;

            // In viewfinder mode (high scale), we need it to be very clear but distorted
            const isScaleHigh = meshRef.current && meshRef.current.scale.x > 5;
            mat.transmission = isScaleHigh ? 1.0 : THREE.MathUtils.lerp(1.0, 0.2, shaderRefs.current.blurFocus);
        }
    });

    // Initial geometry
    const icosahedronGeom = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);

    useLayoutEffect(() => {
        if (!meshRef.current || !wireframeRef.current || !coreRef.current) return;

        const ctx = gsap.context(() => {
            const wireframe = wireframeRef.current;
            const core = coreRef.current;
            if (!wireframe || !core) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                }
            });

            // Subtle core rotation on scroll
            tl.to(core.rotation, {
                y: Math.PI * 2,
                ease: 'none'
            }, 0);

            // KEYBOARD PING LISTENER
            const handleKeyDown = () => {
                gsap.to(wireframe.scale, {
                    x: 2.2,
                    y: 2.2,
                    z: 2.2,
                    duration: 0.1,
                    ease: 'power4.out',
                    onComplete: () => {
                        gsap.to(wireframe.scale, {
                            x: 1.5,
                            y: 1.5,
                            z: 1.5,
                            duration: 1.5,
                            ease: 'elastic.out(1, 0.3)',
                        });
                    }
                });
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        });

        return () => ctx.revert();
    }, []);

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const scrollVelocity = 0; // Velocity logic can be refined later if needed

        shaderRefs.current.time = time;
        shaderRefs.current.velocity = scrollVelocity * 50; // Influence of speed

        if (meshRef.current) {
            // 1. Antigravity Floating with "momentum"
            meshRef.current.position.y = Math.sin(time * floatSpeed) * floatAmplitude;

            // 2. Magnetic Mouse Interaction (Tilt) with Power4-like smoothing
            meshRef.current.rotation.x = THREE.MathUtils.lerp(
                meshRef.current.rotation.x,
                mouse.y * 0.4,
                0.05 // Slower lerp for weight feel
            );
            meshRef.current.rotation.y = THREE.MathUtils.lerp(
                meshRef.current.rotation.y,
                mouse.x * 0.4,
                0.05
            );
        }

        if (wireframeRef.current) {
            // React to velocity
            const targetScale = 1.5 + scrollVelocity * 20; // Expand on fast scroll
            wireframeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

            wireframeRef.current.rotation.y += 0.002 + scrollVelocity * 0.5;
            wireframeRef.current.rotation.z += 0.001 + scrollVelocity * 0.3;

            // Dynamic opacity based on velocity
            const meshMat = wireframeRef.current.material as THREE.MeshStandardMaterial;
            meshMat.opacity = THREE.MathUtils.lerp(meshMat.opacity, 0.1 + scrollVelocity * 2.0, 0.1);
        }

        if (coreRef.current) {
            // Chromatic aberration expansion based on velocity
            const coreMat = coreRef.current.material as any;
            if (coreMat.chromaticAberration !== undefined) {
                coreMat.chromaticAberration = THREE.MathUtils.lerp(coreMat.chromaticAberration, 0.06 + scrollVelocity * 2.0, 0.1);
            }

            // Update custom shader uniforms if possible or just use temporalDistortion
            if (coreMat.temporalDistortion !== undefined) {
                coreMat.temporalDistortion = 0.5 + scrollVelocity * 5.0;
            }
        }
    });

    return (
        <group ref={meshRef}>
            {/* Core Frosted Glass Object */}
            <mesh ref={coreRef} geometry={icosahedronGeom}>
                <MeshTransmissionMaterial
                    backside
                    samples={typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 4 : 16}
                    resolution={typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 256 : 512}
                    transmission={1}
                    roughness={0.15}
                    thickness={0.8}
                    ior={1.2}
                    chromaticAberration={0.06}
                    anisotropy={typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 0 : 0.1}
                    distortion={0.1}
                    distortionScale={0.3}
                    temporalDistortion={0.5}
                    color="#ffffff"
                    onBeforeCompile={(shader) => {
                        shader.uniforms.uTime = { value: 0 };
                        shader.uniforms.uVelocity = { value: 0 };
                        shader.uniforms.uActiveTex = { value: activeTextureRef.current };
                        shader.uniforms.uPrevTex = { value: prevTextureRef.current };
                        shader.uniforms.uProjectMix = { value: 0 };
                        shader.uniforms.uProjectOpacity = { value: 0 };

                        shader.fragmentShader = `
                            uniform float uTime;
                            uniform float uVelocity;
                            uniform sampler2D uActiveTex;
                            uniform sampler2D uPrevTex;
                            uniform float uProjectMix;
                            uniform float uProjectOpacity;
                            ${shader.fragmentShader}
                        `.replace(
                            '#include <dithering_fragment>',
                            `#include <dithering_fragment>
                            vec3 surfaceNormal = normalize(vNormal);
                            vec3 surfaceViewDir = normalize(vViewPosition);
                            float fresnel = pow(1.0 - clamp(dot(surfaceNormal, surfaceViewDir), 0.0, 1.0), 3.0);
                            
                            // Lens Distortion logic for project preview
                            vec2 uv = gl_FragCoord.xy / vec2(1024.0); // Use power of 2 just in case
                            uv = (uv - 0.5) * (1.0 + fresnel * 4.0) + 0.5;
                            
                            vec4 texActive = texture2D(uActiveTex, uv + sin(uTime * 0.1) * 0.02);
                            vec4 texPrev = texture2D(uPrevTex, uv + sin(uTime * 0.1) * 0.02);
                            vec4 tex = mix(texPrev, texActive, uProjectMix);

                            // Desaturation
                            float gray = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
                            tex.rgb = mix(tex.rgb, vec3(gray), 0.8);
                            
                            vec3 color1 = vec3(0.0, 0.9, 1.0); // Brighter Cyan #22d3ee
                            vec3 color2 = vec3(0.13, 0.83, 0.93); // Medium Cyan
                            vec3 color3 = vec3(1.0, 1.0, 1.0); // White flash
                            vec3 irid = mix(color1, color2, sin(fresnel * 12.0 + uTime * 2.0 + uVelocity * 8.0) * 0.5 + 0.5);
                            irid = mix(irid, color3, cos(fresnel * 8.0 - uTime) * 0.5 + 0.5);
                            
                            gl_FragColor.rgb += irid * fresnel * 0.4 * (1.0 + uVelocity * 3.0);
                            gl_FragColor.rgb = mix(gl_FragColor.rgb, tex.rgb, uProjectOpacity * 0.8 * (1.0 - fresnel));
                            `
                        );

                        coreRef.current!.onBeforeRender = () => {
                            shader.uniforms.uTime.value = shaderRefs.current.time;
                            shader.uniforms.uVelocity.value = shaderRefs.current.velocity;
                            shader.uniforms.uProjectMix.value = shaderRefs.current.projectMix;
                            shader.uniforms.uProjectOpacity.value = shaderRefs.current.projectOpacity;
                            shader.uniforms.uActiveTex.value = activeTextureRef.current;
                            shader.uniforms.uPrevTex.value = prevTextureRef.current;
                        };
                    }}
                />
            </mesh>

            {/* Chrome Wireframe */}
            <mesh ref={wireframeRef} geometry={icosahedronGeom}>
                <meshStandardMaterial
                    color="#ffffff"
                    wireframe
                    transparent
                    opacity={0.1}
                    metalness={1}
                    roughness={0}
                />
            </mesh>
        </group>
    );
}
