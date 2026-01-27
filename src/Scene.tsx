import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  RoundedBox,
  Outlines,
  Stars,
  Html,
  Center,
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
import Planet from "./components/planet";
import { Box3 } from "three";
import Debug from "./components/debug";

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
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow // Если есть на что падать тени
        />
        <RotatingStars />
        <Planet />
        <axesHelper args={[10]} />
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
