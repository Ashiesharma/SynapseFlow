import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import NetworkSurface from "./NetworkSurface";
import {
    createParticleData,
    updateParticleData,
} from "../utils/particles";

export default function FlowField() {
    const riverRef = useRef();

    const { positions, progress, speeds } = useMemo(
        () => createParticleData(),
        []
    );

    useFrame(({ clock }) => {
        updateParticleData(
            positions,
            progress,
            speeds,
            clock.getElapsedTime()
        );

        riverRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group rotation={[0.08, 0, 0]}>
            <NetworkSurface />

            <points ref={riverRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={positions}
                        count={positions.length / 3}
                        itemSize={3}
                    />
                </bufferGeometry>

                <pointsMaterial
                    color="#38bdf8"
                    size={0.018}
                    transparent
                    opacity={0.55}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
}