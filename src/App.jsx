import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Html } from "@react-three/drei";
import Scene from "./components/Scene";
import CameraRig from "./components/CameraRig";

function LoadingScreen() {
  return (
    <Html center>
      <div
        style={{
          color: "#8fd3ff",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.18em",
          fontSize: "14px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        Initializing SynapseFlow...
      </div>
    </Html>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 3.2, 8], fov: 55 }}>
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 5, 16]} />

      <Suspense fallback={<LoadingScreen />}>
        <Scene />
        <CameraRig />

        <EffectComposer>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.95}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}