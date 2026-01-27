import { animated, useSpring, to } from "@react-spring/three";
import { Center, Outlines, RoundedBox } from "@react-three/drei";
import { type ThreeElements } from "@react-three/fiber";
import { easeOut } from "motion";
import { useMemo } from "react";
import * as THREE from "three";

const AnimatedMeshToonMaterial = animated("meshToonMaterial");
const AnimatedRoundedBox = animated(RoundedBox);

type HeadphonesProps = {
  headWidth: number;
} & ThreeElements["group"];

const headphonesColor = "#72d149";
const headphonesColor2 = "#4d514b";

export default function Headphones({ headWidth, ...props }: HeadphonesProps) {
  const headHalfWidth = headWidth / 2;
  const depth = 0.05;

  const padW = 0.15;
  const padH = 0.6;
  const padD = 0.5;

  const cupW = 0.2;
  const cupH = padH + 0.1;
  const cupD = padD + 0.1;

  const bendW = 0.1;

  const sideBendSink = 0.1;
  const sideBendD = 0.3;
  const sideBendH = 0.6;

  const topBandY = cupH / 2 + sideBendH - bendW - sideBendSink;

  const gradientMap = useMemo(() => {
    const data = new Uint8Array([0, 255]);
    const tex = new THREE.DataTexture(data, 2, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const spring = useSpring({
    loop: {
      reset: true,
    },
    from: {
      emissiveIntensity: 2, // резкий пик (можно даже 1.6–2.0 для драмы)
      padH: padH + 0.1,
      padD: padD + 0.1,
      padScale: [1, 1.1, 1.1],
    },
    to: {
      emissiveIntensity: 0.5, // базовое спокойное свечение
      padH: padH,
      padD: padD,
      padScale: [1, 1, 1],
    },
    config: {
      duration: 500,
      easing: easeOut,
    },
    // reset: true,         // ← если loop не нужен, а только один раз по триггеру
  });

  return (
    <group {...props}>
      {([-1, 1] as const).map((side) => (
        <>
          <Center
            left={side === -1}
            right={side === 1}
            position={[side * headHalfWidth, 0, 0]}
          >
            {/* pad */}
            <AnimatedRoundedBox
              args={[padW, padH, padD]}
              radius={0.05}
              // @ts-expect-error
              scale={spring.padScale}
            >
              <AnimatedMeshToonMaterial
                color={headphonesColor}
                gradientMap={gradientMap}
                emissive={headphonesColor}
                emissiveIntensity={spring.emissiveIntensity}
              />
              <Outlines
                thickness={2}
                color={headphonesColor}
                transparent
                opacity={8}
                angle={0} // 0 means it outlines all edges including the bevels
              />
            </AnimatedRoundedBox>
          </Center>
          {/* cup */}
          <Center
            left={side === -1}
            right={side === 1}
            position={[side * (headHalfWidth - depth + padW), 0, 0]}
          >
            <RoundedBox args={[cupW, cupH, cupD]} radius={0.1}>
              <meshToonMaterial
                color={headphonesColor}
                gradientMap={gradientMap}
              />
            </RoundedBox>
          </Center>
          {/* side bend */}
          <Center
            top
            left={side === -1}
            right={side === 1}
            position={[
              side * (headHalfWidth - depth + padW),
              cupH / 2 - sideBendSink,
              0,
            ]}
          >
            <RoundedBox args={[bendW, sideBendH, sideBendD]} radius={0.05}>
              <meshToonMaterial
                color={headphonesColor}
                gradientMap={gradientMap}
              />
            </RoundedBox>
          </Center>
          {/* Центральная дужка */}
          <Center top position={[0, topBandY, 0]}>
            <RoundedBox
              args={[headWidth + 2 * (bendW + padW - depth), bendW, sideBendD]}
              radius={0.05}
            >
              <meshToonMaterial
                color={headphonesColor}
                gradientMap={gradientMap}
              />
            </RoundedBox>
          </Center>
          {/* Cushion */}
          <Center top position={[0, headHalfWidth, 0]}>
            <RoundedBox
              args={[headWidth - 0.2, topBandY - headHalfWidth, sideBendD]}
              radius={0.05}
            >
              <meshToonMaterial
                color={headphonesColor2}
                gradientMap={gradientMap}
              />
            </RoundedBox>
          </Center>
        </>
      ))}
    </group>
  );
}
