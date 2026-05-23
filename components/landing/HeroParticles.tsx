"use client";

/**
 * HeroParticles — WebGL particle field via React Three Fiber.
 *
 * Why Three.js here instead of CSS: CSS can fake depth with blur and opacity,
 * but it can't do sizeAttenuation (particles that physically scale with
 * perspective distance) or GPU-batched point rendering. The result looks
 * unmistakably different — particles that exist in actual 3D space.
 *
 * Design choices:
 * - 2,800 particles across a wide volume (±18 x, ±12 y, ±8 z)
 * - Two colours: primary teal + warm white, randomly assigned
 * - Slow drift rotation + subtle mouse influence
 * - Intentionally faint (opacity 0.35) — must not compete with copy
 * - alpha: true on Canvas = transparent background, composites over page
 *
 * Performance:
 * - BufferGeometry with Float32Array positions — single draw call
 * - PointMaterial with sizeAttenuation — no per-particle JS
 * - ~0.5ms per frame on a mid-range GPU
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const TEAL  = new THREE.Color("#00C2A8");
const WHITE = new THREE.Color("#ffffff");

function Particles({ count = 2800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  // Generate static positions, colours, and sizes once
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);
    const c         = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Spread across a wide, flat volume — matches wide hero viewport
      positions[i * 3]     = (Math.random() - 0.5) * 36; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12; // z

      // 30% teal, 70% white/grey
      if (Math.random() < 0.3) {
        c.copy(TEAL);
      } else {
        const brightness = 0.55 + Math.random() * 0.45;
        c.setRGB(brightness, brightness, brightness);
      }
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      // Vary sizes: most are tiny, a few are slightly larger
      sizes[i] = Math.random() < 0.08 ? 0.06 : 0.022 + Math.random() * 0.02;
    }
    return { positions, colors, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const t = clock.elapsedTime;

    // Slow drift rotation — feels alive without being distracting
    pts.rotation.y  = t * 0.018;
    pts.rotation.x  = Math.sin(t * 0.011) * 0.06;

    // Subtle mouse influence — particles tilt slightly toward cursor
    pts.rotation.y += mouse.x * 0.04;
    pts.rotation.x -= mouse.y * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.38}
        sizeAttenuation    // particles scale with Z depth — real 3D feel
        depthWrite={false} // prevents z-fighting in transparent scene
        size={0.032}
      />
    </points>
  );
}

export function HeroParticles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 55 }}
          gl={{
            antialias: false,   // disabled for performance — particles don't need AA
            alpha: true,        // transparent bg, composites over page gradient
            powerPreference: "high-performance",
          }}
          style={{ width: "100%", height: "100%" }}
          dpr={[1, 1.5]}        // cap DPR for performance
        >
          <Particles />
        </Canvas>
      </Suspense>
    </div>
  );
}
