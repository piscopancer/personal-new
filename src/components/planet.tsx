import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  RoundedBox,
  Outlines,
  Stars,
  Html,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Vector3, type Mesh, type Points } from "three";
import {
  Bloom,
  EffectComposer,
  FXAA,
  Noise,
  Vignette,
} from "@react-three/postprocessing";

const AnimatedRoundedBox = animated(RoundedBox);

function Piscopancer() {
  const meshRef = useRef<Mesh>(null!);
  const [active, setActive] = useState(false);

  const springs = useSpring({
    scale: active ? 1.1 : 1,
  });

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time) * 0.1;
    meshRef.current.rotation.y += delta * -0.2;
  });

  return (
    <AnimatedRoundedBox
      ref={meshRef}
      args={[1, 1, 1]} // Dimensions: Width, Height, Depth
      radius={0.1} // The radius of the rounded corner
      smoothness={4} // Number of segments (higher = smoother)
      bevelSegments={4} // Number of segments for the bevel
      scale={springs.scale}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <Html
        distanceFactor={1} // Scales the text based on distance (like 3D)
        position={[0, 0, 0.51]} // Position it slightly in front of the box face
        transform // This makes the HTML follow the 3D rotation of the box
        occlude // Hidden when behind the box
        pointerEvents="none"
      >
        <div className="select-none translate-y-1/2">
          <ul className="flex gap-4 justify-center">
            <div className="w-28 h-16 bg-white rounded-b-[4rem] rounded-t-xl rotate-1 "></div>
            <div className="w-28 h-16 bg-white rounded-b-[4rem] rounded-t-xl -rotate-1" />
          </ul>
          <div className="h-2 w-8 bg-white mx-auto mt-6 rounded-[1px]" />
        </div>
      </Html>
      <MeshTransmissionMaterial
        /* REQUIRED for seeing stars through it */
        backside
        transmission={0.95}
        transparent
        roughness={0.1} // The "Blur"
        // ior={1.5} // Index of Refraction (1.5 is standard glass)
        ior={1} // Index of Refraction (1.5 is standard glass)
        thickness={0.5} // Gives the glass "volume"
        /* THE COLOR: Must not be pure #000000 */
        color="#111111"
        /* OPTIONAL: Adds a "rainbow" edge to the stars behind the glass */
        // chromaticAberration={0.06}
        /* REMOVE REFLECTIONS as per your style */
        metalness={0}
        reflectivity={0}
        clearcoat={0.9}
        /* Rendering optimization */
        resolution={512}
        samples={16}
      />
      <Outlines
        thickness={2}
        color={"#ffffff"}
        transparent
        opacity={1}
        angle={0} // 0 means it outlines all edges including the bevels
      />
    </AnimatedRoundedBox>
  );
}

function RotatingStars() {
  const starsRef = useRef<Points>(null!);

  useFrame((state, delta) => {
    starsRef.current.rotation.y += delta * 0.001;
  });

  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={10}
      count={10000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}

export default function Scene() {
  return (
    <div className="h-screen w-full bg-zinc-950">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <RotatingStars />
        <Piscopancer />
        <EffectComposer>
          <Bloom
            intensity={1} // Strength of the glow
            luminanceThreshold={0.5} // How bright an object must be to glow (0 to 1)
            luminanceSmoothing={0.5} // Smoothness of the glow transition
            mipmapBlur // Higher quality blur
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
