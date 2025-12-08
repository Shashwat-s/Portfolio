import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '@/store/appStore';

/**
 * ParticleSphere Component
 * 
 * Creates a dense galaxy-like particle sphere using Three.js.
 * 
 * Features:
 * - 12,000+ particles in spherical formation
 * - Slow rotation for ambient motion
 * - Depth-aware mouse distortion (front particles affected more)
 * - Natural talking animation with smooth transitions
 */

const PARTICLE_COUNT = 15000;

// Generate sphere positions with galaxy-like distribution
function generateSpherePositions(count: number): Float32Array {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const baseRadius = 2.5;
        const radiusVariance = (Math.random() - 0.5) * 0.8;
        const r = baseRadius + radiusVariance;

        const spiralOffset = (phi / Math.PI) * 0.3;
        const adjustedTheta = theta + spiralOffset * Math.sin(phi * 4);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(adjustedTheta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(adjustedTheta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }

    return positions;
}

interface MouseTrail {
    x: number;
    y: number;
    time: number;
}

interface ParticleCloudProps {
    isSpeaking: boolean;
    mousePosition: React.MutableRefObject<{ x: number; y: number }>;
    mouseTrail: React.MutableRefObject<MouseTrail[]>;
}

function ParticleCloud({ isSpeaking, mousePosition, mouseTrail }: ParticleCloudProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const originalPositions = useRef<Float32Array | null>(null);
    const currentOffsets = useRef<Float32Array | null>(null);
    const { viewport, size } = useThree();

    // Smooth speaking transition (0 = not speaking, 1 = speaking)
    const speakingIntensity = useRef(0);

    // Generate initial positions
    const positions = useMemo(() => generateSpherePositions(PARTICLE_COUNT), []);

    // Initialize refs
    useEffect(() => {
        originalPositions.current = positions.slice();
        currentOffsets.current = new Float32Array(PARTICLE_COUNT * 3);
    }, [positions]);

    // Animation frame
    useFrame((state) => {
        if (!pointsRef.current || !originalPositions.current || !currentOffsets.current) return;

        const time = state.clock.getElapsedTime();
        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const origArray = originalPositions.current;
        const offsets = currentOffsets.current;

        // Smooth transition for speaking intensity (lerp towards target)
        const targetIntensity = isSpeaking ? 1 : 0;
        const lerpSpeed = isSpeaking ? 0.08 : 0.03; // Faster in, slower out
        speakingIntensity.current += (targetIntensity - speakingIntensity.current) * lerpSpeed;
        const speakAmount = speakingIntensity.current;

        // Convert mouse to 3D space
        const mouseX = (mousePosition.current.x / size.width) * 2 - 1;
        const mouseY = -(mousePosition.current.y / size.height) * 2 + 1;
        const mouse3D = new THREE.Vector3(
            mouseX * viewport.width / 2,
            mouseY * viewport.height / 2,
            2 // Mouse is "in front" of sphere
        );

        // Process mouse trail
        const currentTrail = mouseTrail.current;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Get original position
            const origX = origArray[i3];
            const origY = origArray[i3 + 1];
            const origZ = origArray[i3 + 2];

            // Apply slow rotation to original
            const rotationSpeed = 0.05;
            const cosRot = Math.cos(time * rotationSpeed);
            const sinRot = Math.sin(time * rotationSpeed);
            const baseX = origX * cosRot - origZ * sinRot;
            const baseY = origY;
            const baseZ = origX * sinRot + origZ * cosRot;

            // Initialize target offsets
            let offsetX = 0;
            let offsetY = 0;
            let offsetZ = 0;

            // ===== NATURAL TALKING ANIMATION =====
            if (speakAmount > 0.01) {
                const len = Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ);
                if (len > 0) {
                    // Organic wave movement like speech vibration
                    const particleAngle = Math.atan2(baseY, baseX);
                    const particleHeight = baseZ / len;

                    // Multiple organic waves
                    const talkFreq1 = 4;
                    const talkFreq2 = 7;
                    const talkFreq3 = 2.5;

                    // Wave 1: Radial breathing
                    const wave1 = Math.sin(time * talkFreq1) * 0.15;

                    // Wave 2: Ripple effect based on position
                    const wave2 = Math.sin(time * talkFreq2 + particleAngle * 3) * 0.08;

                    // Wave 3: Vertical wave (like sound waves emanating)
                    const wave3 = Math.sin(time * talkFreq3 + particleHeight * 4) * 0.12;

                    // Combine waves with speaking intensity
                    const totalWave = (wave1 + wave2 + wave3) * speakAmount;

                    offsetX += (baseX / len) * totalWave;
                    offsetY += (baseY / len) * totalWave;
                    offsetZ += (baseZ / len) * totalWave;
                }
            }

            // ===== DEPTH-AWARE MOUSE DISTORTION =====
            // Particles with Z closer to camera (positive Z, toward viewer) get more effect
            const depthFactor = Math.max(0, (baseZ + 3) / 6); // 0 for back, 1 for front
            const distortionScale = 0.3 + depthFactor * 0.7; // 30% for back, 100% for front

            // Current mouse position - strong repulsion
            const particlePos = new THREE.Vector3(baseX, baseY, baseZ);
            const toMouse = particlePos.clone().sub(mouse3D);
            const distToMouse = toMouse.length();

            // Smaller distortion radius
            const repulsionRadius = 1.2;
            const repulsionStrength = 0.6;

            if (distToMouse < repulsionRadius && distToMouse > 0.01) {
                const normalizedDist = distToMouse / repulsionRadius;
                const force = Math.pow(1 - normalizedDist, 2) * repulsionStrength * distortionScale;

                toMouse.normalize();
                offsetX += toMouse.x * force;
                offsetY += toMouse.y * force;
                offsetZ += toMouse.z * force * 0.3;
            }

            // Mouse trail - flow effect with depth awareness
            for (let t = 0; t < currentTrail.length; t++) {
                const trail = currentTrail[t];
                const trailAge = time - trail.time;

                if (trailAge < 1.0) {
                    const trailX = (trail.x / size.width) * 2 - 1;
                    const trailY = -(trail.y / size.height) * 2 + 1;
                    const trail3D = new THREE.Vector3(
                        trailX * viewport.width / 2,
                        trailY * viewport.height / 2,
                        2
                    );

                    const toTrail = particlePos.clone().sub(trail3D);
                    const distToTrail = toTrail.length();
                    const trailRadius = 0.8;

                    if (distToTrail < trailRadius && distToTrail > 0.01) {
                        const ageFade = 1 - (trailAge / 1.0);
                        const trailForce = Math.pow(1 - distToTrail / trailRadius, 1.5) * 0.6 * ageFade * distortionScale;

                        toTrail.normalize();
                        offsetX += toTrail.x * trailForce;
                        offsetY += toTrail.y * trailForce;
                    }
                }
            }

            // ===== SMOOTH OFFSET INTERPOLATION =====
            // Lerp current offsets toward target offsets for smooth movement
            const smoothFactor = 0.15;
            offsets[i3] += (offsetX - offsets[i3]) * smoothFactor;
            offsets[i3 + 1] += (offsetY - offsets[i3 + 1]) * smoothFactor;
            offsets[i3 + 2] += (offsetZ - offsets[i3 + 2]) * smoothFactor;

            // Subtle ambient floating
            const floatAmp = 0.01;
            const floatX = Math.sin(time * 0.5 + i * 0.01) * floatAmp;
            const floatY = Math.cos(time * 0.4 + i * 0.01) * floatAmp;

            // Final position = base + smoothed offsets + float
            posArray[i3] = baseX + offsets[i3] + floatX;
            posArray[i3 + 1] = baseY + offsets[i3 + 1] + floatY;
            posArray[i3 + 2] = baseZ + offsets[i3 + 2];
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#3b82f6"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={1}
                blending={THREE.NormalBlending}
            />
        </Points>
    );
}

interface ParticleSphereProps {
    className?: string;
}

// Responsive camera that adjusts FOV based on aspect ratio
function ResponsiveCamera() {
    const { size } = useThree();

    useFrame(({ camera }) => {
        if (camera instanceof THREE.PerspectiveCamera) {
            const aspect = size.width / size.height;
            // On portrait mobile (aspect < 1), increase FOV and move camera back
            // to show more of the sphere
            if (aspect < 1) {
                // Mobile portrait: wider FOV to show full sphere
                camera.fov = 75 + (1 - aspect) * 20; // 75-95 based on how narrow
                camera.position.z = 6 + (1 - aspect) * 2; // 6-8 based on narrowness
            } else {
                // Desktop/landscape: standard settings
                camera.fov = 60;
                camera.position.z = 5;
            }
            camera.updateProjectionMatrix();
        }
    });

    return null;
}

export default function ParticleSphere({ className }: ParticleSphereProps) {
    const isSpeaking = useAppStore((state) => state.isSpeaking);
    // Initialize position to center of screen for mobile
    const mousePosition = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
    const mouseTrail = useRef<MouseTrail[]>([]);
    const lastTrailTime = useRef(0);

    // Track mouse and touch position, create trail
    useEffect(() => {
        // Update position helper
        const updatePosition = (x: number, y: number) => {
            mousePosition.current = { x, y };

            const now = performance.now() / 1000;
            if (now - lastTrailTime.current > 0.025) {
                mouseTrail.current.push({ x, y, time: now });

                // Keep recent trail points
                mouseTrail.current = mouseTrail.current.filter(
                    point => now - point.time < 1.2
                );

                lastTrailTime.current = now;
            }
        };

        // Mouse handler
        const handleMouseMove = (e: MouseEvent) => {
            updatePosition(e.clientX, e.clientY);
        };

        // Touch handlers
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <div className={`fixed inset-0 z-0 ${className || ''}`} style={{ background: '#0a0a0a' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
            >
                <ResponsiveCamera />
                <color attach="background" args={['#0a0a0a']} />
                <fog attach="fog" args={['#0a0a0a', 3, 10]} />
                <ParticleCloud
                    isSpeaking={isSpeaking}
                    mousePosition={mousePosition}
                    mouseTrail={mouseTrail}
                />
            </Canvas>
        </div>
    );
}

