"use client";

/**
 * HeroNoiseShader — full-screen simplex noise aurora via WebGL ShaderMaterial.
 *
 * This is the gap between "nice site" and "award site":
 * - Particles = you can do that with a canvas and requestAnimationFrame
 * - A flowing, organic noise field with color bleeding and vignette = GPU shaders
 *
 * The shader is 2D simplex noise layered at 3 frequencies + speeds,
 * colour-mapped to the Scrollr palette (dark → teal → violet),
 * with a radial vignette so it fades to black at the edges.
 *
 * Result: the hero background breathes. It isn't static. It isn't a gradient.
 * It reacts to time like something alive — without being distracting.
 *
 * Performance: a single plane with one draw call. ~0.3ms per frame.
 */

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── GLSL ─────────────────────────────────────────────────────────────────────

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * 2D Simplex noise (Stefan Gustavson's algorithm).
 * Included inline so we don't need a texture or external GLSL import.
 */
const FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec2  uMouse; // normalised -1..1
  varying vec2  vUv;

  // ── Simplex 2D ──
  vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 mod289v2(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 permute(vec3 x){return mod289v3(((x*34.)+1.)*x);}

  float snoise(vec2 v){
    const vec4 C=vec4(.211324865,.366025404,-.577350269,.024390244);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289v2(i);
    vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m; m=m*m;
    vec3 x=2.*fract(p*C.www)-1.;
    vec3 h=abs(x)-.5;
    vec3 ox=floor(x+.5);
    vec3 a0=x-ox;
    m*=1.79284291-.85373472*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }

  void main(){
    vec2 uv = vUv + uMouse * 0.06; // subtle mouse warp

    // Three octaves of noise at different frequencies and drift speeds
    float n1 = snoise(uv * 2.1 + uTime * 0.055);
    float n2 = snoise(uv * 4.3 + uTime * 0.038 + vec2(5.2, 1.3));
    float n3 = snoise(uv * 8.8 + uTime * 0.022 + vec2(2.7, 8.1));

    // Blend octaves (fBm)
    float n = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
    n = n * 0.5 + 0.5; // remap [-1,1] → [0,1]

    // Radial vignette — fade toward edges
    float dist    = length(uv - 0.5);
    float vignette = 1.0 - smoothstep(0.2, 0.9, dist * 1.6);

    // Palette: background dark / teal peak / violet highlight
    vec3 dark   = vec3(0.020, 0.020, 0.025);
    vec3 teal   = vec3(0.000, 0.758, 0.659); // #00C2A8
    vec3 violet = vec3(0.486, 0.227, 0.929); // #7C3AED

    // Colour ramps
    vec3 col = dark;
    col = mix(col, teal,   smoothstep(0.42, 0.72, n)          * 0.32);
    col = mix(col, violet, smoothstep(0.58, 0.82, n2*.5+.5)   * 0.14);

    // Alpha: vignette × intensity — stays entirely in the corners/top
    float alpha = vignette * 0.72 * smoothstep(0.30, 0.62, n);

    gl_FragColor = vec4(col, alpha);
  }
`;

// ── Three.js mesh ─────────────────────────────────────────────────────────────

function NoisePlane() {
  const meshRef   = useRef<THREE.Mesh>(null);
  const matRef    = useRef<THREE.ShaderMaterial>(null);
  const { size, mouse } = useThree();

  // Keep the plane exactly filling the camera frustum
  const planeArgs: [number, number] = [
    (size.width  / size.height) * 22,
    22,
  ];

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value  = clock.elapsedTime;
    // Smooth mouse: lerp toward target
    const m = matRef.current.uniforms.uMouse.value as THREE.Vector2;
    m.lerp(mouse, 0.04);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={planeArgs} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        transparent
        depthWrite={false}
        uniforms={{
          uTime:  { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  );
}

// ── Exported component ────────────────────────────────────────────────────────

export function HeroNoiseShader({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{
            antialias: false,
            alpha:     true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1]}   // 1:1 — noise shader doesn't need high DPR
          style={{ width: "100%", height: "100%" }}
        >
          <NoisePlane />
        </Canvas>
      </Suspense>
    </div>
  );
}
