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
import Headphones from "./headphones";

const AnimatedRoundedBox = animated(RoundedBox);

type PlanetProps = {
  listening?: boolean;
};

export default function Planet(props: PlanetProps) {
  // const meshRef = useRef<Mesh>(null!);
  const planetRef = useRef<Mesh>(null!);
  const [active, setActive] = useState(false);

  const springs = useSpring({
    scale: active ? 1.1 : 1,
  });

  useFrame((state, delta) => {
    const speed = 1;
    const time = state.clock.getElapsedTime();
    planetRef.current.rotation.x = Math.sin(time) * 0.1;
    planetRef.current.rotation.y += delta * -0.2 * speed;
  });

  return (
    <group ref={planetRef}>
      <AnimatedRoundedBox
        ref={planetRef}
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
          position={[0, 0, 0.52]} // Position it slightly in front of the box face
          transform // This makes the HTML follow the 3D rotation of the box
          // occlude={[meshRef]} // Hidden when behind the box
          pointerEvents="none"
        >
          <div className="select-none translate-y-1/2 backface-hidden">
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
      <Headphones
        headWidth={1}
        position={[0, 0, 0]} // Центрируем относительно куба
      />
    </group>
  );
}
