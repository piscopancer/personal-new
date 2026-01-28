import * as THREE from "three"

export default function Debug(props: {
  box?: [number, number, number]
  color?: string
}) {
  return (
    <lineSegments>
      <edgesGeometry
        args={[new THREE.BoxGeometry(...(props.box ? props.box : [1, 1, 1]))]}
      />
      <lineBasicMaterial
        color={props.color ?? "fuchsia"}
        depthTest={false}
        transparent
        opacity={0.5}
      />
    </lineSegments>
  )
}
