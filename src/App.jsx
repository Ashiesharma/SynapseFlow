import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import CameraRig from "./components/CameraRig";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
export default function App() {
  return (
    <Canvas camera={{ position: [0, 3.2, 8], fov: 55 }}>
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 5, 16]} />

      <Scene />
      <CameraRig />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.95}
        />
      </EffectComposer>
    </Canvas>
  );
}