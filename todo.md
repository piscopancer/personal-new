Center это группа, а `right`/`left` указывает направление куда он толкнет всех своих детей. Если указано `right`, они никогда не вылезут слева от центра.

```tsx
<>
  <Center right position={[0.5, 0, 0]}>
    <mesh>
      <boxGeometry args={[0.5, 1, 1]} />
      <meshToonMaterial color={"tomato"} transparent opacity={0.4} />
      <Debug box={[0.5, 1, 1]} />
    </mesh>
  </Center>
  <Center right position={[0.5 + 0.5 + 0.05, 0, 0]}>
    <mesh>
      <boxGeometry args={[0.7, 1, 1]} />
      <meshToonMaterial />
      <Debug box={[0.7, 1, 1]} />
    </mesh>
  </Center>
</>
```
