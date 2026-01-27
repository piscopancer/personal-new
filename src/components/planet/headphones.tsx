import { animated, useSpring, to } from "@react-spring/three"
import { Center, Html, Outlines, RoundedBox } from "@react-three/drei"
import { type ThreeElements } from "@react-three/fiber"
import { easeOut } from "motion"
import { Fragment, useMemo, useState, type ComponentProps, type Dispatch, type SetStateAction } from "react"
import * as THREE from "three"
import { ChevronDownIcon, ChevronUpIcon, CopyIcon, ExternalLinkIcon, MusicIcon } from "lucide-react"
import { SpotifyIcon } from "@/assets/spotify"
import mercurialWorld from "@/assets/mercurial_world.jpeg"
import type { HtmlProps } from "@react-three/drei/web/Html"

const AnimatedMeshToonMaterial = animated("meshToonMaterial")
const AnimatedRoundedBox = animated(RoundedBox)

type HeadphonesProps = {
  headWidth: number
} & ThreeElements["group"]

const headphonesColor = "#6912de"
const headphonesColor2 = "#9226eb"
const headphonesColor3 = "#2c2c2e"

export default function Headphones({ headWidth, ...props }: HeadphonesProps) {
  const headHalfWidth = headWidth / 2
  const depth = 0.05

  const padW = 0.15
  const padH = 0.6
  const padD = 0.5

  const cupW = 0.2
  const cupH = padH + 0.1
  const cupD = padD + 0.1

  const bendW = 0.1

  const sideBendSink = 0.1
  const sideBendD = 0.3
  const sideBendH = 0.6

  const topBandY = cupH / 2 + sideBendH - bendW - sideBendSink

  const [audioInfoDetached, setAudioInfoDetached] = useState(true)

  const gradientMap = useMemo(() => {
    const data = new Uint8Array([0, 255])
    const tex = new THREE.DataTexture(data, 2, 1, THREE.RedFormat)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    tex.needsUpdate = true
    return tex
  }, [])

  const spring = useSpring({
    loop: {
      reset: true,
    },
    from: {
      emissiveIntensity: 5, // резкий пик (можно даже 1.6–2.0 для драмы)
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
      duration: 700,
      easing: easeOut,
    },
    // reset: true,         // ← если loop не нужен, а только один раз по триггеру
  })

  return (
    <group {...props}>
      {([-1, 1] as const).map((side) => (
        <Fragment key={side}>
          <Center left={side === -1} right={side === 1} position={[side * headHalfWidth, 0, 0]}>
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
              <Outlines thickness={4} color={headphonesColor} opacity={10} />
            </AnimatedRoundedBox>
          </Center>
          {/* cup */}
          <Center left={side === -1} right={side === 1} position={[side * (headHalfWidth - depth + padW), 0, 0]}>
            <RoundedBox args={[cupW, cupH, cupD]} radius={0.1}>
              <meshToonMaterial color={headphonesColor2} gradientMap={gradientMap} />
              <Outlines thickness={2} color={headphonesColor2} />
            </RoundedBox>
            {!audioInfoDetached && (
              <Html
                occlude
                center
                position={[side * 0.11, 0, 0]}
                transform
                scale={3}
                distanceFactor={1}
                rotation={[THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(-90)]}
              >
                <button
                  onClick={() => setAudioInfoDetached(true)}
                  className='text-zinc-200 hover:bg-[#520b8c] bg-[#520b8c]/50 p-2 rounded-full cursor-pointer'
                >
                  <ChevronUpIcon className='size-4 stroke-1.5' />
                </button>
              </Html>
            )}
          </Center>
          {/* side bend */}
          <Center
            top
            left={side === -1}
            right={side === 1}
            position={[side * (headHalfWidth - depth + padW), cupH / 2 - sideBendSink, 0]}
          >
            <RoundedBox args={[bendW, sideBendH, sideBendD]} radius={0.05}>
              <meshToonMaterial color={headphonesColor} gradientMap={gradientMap} />
              <Outlines thickness={2} color={headphonesColor} />
            </RoundedBox>
          </Center>
          {/* top bend */}
          <Center top position={[0, topBandY, 0]}>
            <RoundedBox args={[headWidth + 2 * (bendW + padW - depth), bendW, sideBendD]} radius={0.05}>
              <meshToonMaterial color={headphonesColor} gradientMap={gradientMap} />
              <Outlines thickness={2} color={headphonesColor} />
            </RoundedBox>
            {audioInfoDetached ? (
              <AudioInfo
                center
                position={[0, 0.5, 0]}
                detached={audioInfoDetached}
                setDetached={setAudioInfoDetached}
              />
            ) : (
              <AudioInfo
                occlude='blending'
                detached={audioInfoDetached}
                setDetached={setAudioInfoDetached}
                center
                position={[0, 0.051, 0]}
                transform
                scale={1.5}
                distanceFactor={1}
                rotation={[THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0)]}
              />
            )}
          </Center>
          {/* Cushion */}
          <Center top position={[0, headHalfWidth, 0]}>
            <RoundedBox args={[headWidth - 0.2, topBandY - headHalfWidth, sideBendD]} radius={0.05}>
              <meshToonMaterial color={headphonesColor3} gradientMap={gradientMap} />
            </RoundedBox>
          </Center>
        </Fragment>
      ))}
    </group>
  )
}

type AudioInfoProps = {
  detached: boolean
  setDetached: Dispatch<SetStateAction<boolean>>
} & ComponentProps<"div"> &
  HtmlProps

function AudioInfo({ detached, setDetached, ...props }: AudioInfoProps) {
  const DetachedIcon = detached ? ChevronDownIcon : ChevronUpIcon

  return (
    <Html {...props}>
      <article className='bg-zinc-950/50 rounded-full p-1 flex items-center backface-hidden'>
        <button className='relative flex items-center justify-center text-zinc-200 mr-2 size-8'>
          <img src={mercurialWorld} className='object-cover rounded-full' />
          <SpotifyIcon className='absolute -bottom-0.5 -right-0.5 size-3 border-black border rounded-full bg-black' />
        </button>
        <header className='flex flex-col mr-2'>
          <h1 className='text-zinc-200 text-nowrap leading-none mb-0.5'>Mercurial World</h1>
          <h2 className='text-zinc-400 text-nowrap leading-none text-xs'>Magdalena Bay</h2>
        </header>
        <button className='text-zinc-500 hover:bg-zinc-800/80 p-2 rounded-full hover:text-zinc-200 cursor-pointer'>
          <CopyIcon className='size-4 stroke-1.5' />
        </button>
        <a href='#' className='text-zinc-500 hover:bg-zinc-800/80 p-2 rounded-full hover:text-zinc-200'>
          <ExternalLinkIcon className='size-4 stroke-1.5' />
        </a>
        <button
          onClick={() => {
            setDetached((prev) => !prev)
          }}
          className='text-zinc-500 hover:bg-zinc-800/80 p-2 rounded-full hover:text-zinc-200 cursor-pointer'
        >
          <DetachedIcon className='size-4 stroke-1.5' />
        </button>
      </article>
    </Html>
  )
}
