import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import noise2D from "../utils/noise";
const ROWS = 90;
const COLS = 150;
const SPACING = 0.085;
const RIVER_COUNT = 35000;

function getHeight(x, z) {
    const large = noise2D(x * 0.18, z * 0.18) * 1.1;
    const medium = noise2D(x * 0.45, z * 0.45) * 0.35;
    const small = noise2D(x * 0.9, z * 0.9) * 0.12;

    return large + medium + small;
}

function riverCenterZ(x, time = 0) {
    return Math.sin(x * 0.9 + time * 0.35) * 1.4;
}

export default function FlowField() {
    const surfaceRef = useRef();
    const riverRef = useRef();

    const speeds = useMemo(() => {
        return Array.from(
            { length: RIVER_COUNT },
            () => 0.018 + Math.random() * 0.015
        );
    }, []);

    const surfacePositions = useMemo(() => {
        const arr = new Float32Array(ROWS * COLS * 3);
        let index = 0;

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const x = (c - COLS / 2) * SPACING;
                const z = (r - ROWS / 2) * SPACING;
                const y = getHeight(x, z) - 1.2;

                arr[index++] = x;
                arr[index++] = y;
                arr[index++] = z;
            }
        }

        return arr;
    }, []);

    const riverPositions = useMemo(() => {
        const arr = new Float32Array(RIVER_COUNT * 3);

        for (let i = 0; i < RIVER_COUNT; i++) {
            const t = Math.random();
            const x = -6 + t * 12;
            const z = riverCenterZ(x);

            const lane = Math.floor(Math.random() * 5) - 2;
            const spread = lane * 0.32 + (Math.random() - 0.5) * 0.08;

            arr[i * 3] = x;
            arr[i * 3 + 1] = getHeight(x, z) - 0.85 + Math.random() * 0.25;
            arr[i * 3 + 2] = z + spread;
        }

        return arr;
    }, []);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        const river = riverRef.current.geometry.attributes.position.array;

        for (let i = 0; i < RIVER_COUNT; i++) {
            const i3 = i * 3;

            let x = river[i3];
            x += speeds[i];

            if (x > 6) x = -6;

            const progress = (x + 6) / 12;
            const centerZ = riverCenterZ(x, time);
            const noise = Math.sin(time * 2 + i * 0.12) * 0.16;

            const riverWidth =
                0.25 +
                Math.sin(progress * Math.PI) * 0.75 +
                Math.sin(time * 0.8 + progress * 8) * 0.12;

            river[i3] = x;
            river[i3 + 2] =
                centerZ + noise + Math.sin(i * 0.03) * riverWidth;

            river[i3 + 1] =
                getHeight(x, river[i3 + 2]) -
                0.8 +
                Math.sin(time * 3 + i) * 0.05;
        }

        riverRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group rotation={[0.08, 0, 0]}>
            <points ref={surfaceRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={surfacePositions}
                        count={surfacePositions.length / 3}
                        itemSize={3}
                    />
                </bufferGeometry>

                <pointsMaterial
                    color="#7dafff"
                    size={0.016}
                    transparent
                    opacity={0.28}
                    depthWrite={false}
                />
            </points>

            <gridHelper
                args={[14, 80, "#1b4f8f", "#0b1f3a"]}
                position={[0, -1.15, 0]}
            />

            <points ref={riverRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        array={riverPositions}
                        count={riverPositions.length / 3}
                        itemSize={3}
                    />
                </bufferGeometry>

                <pointsMaterial
                    color="#38bdf8"
                    size={0.024}
                    transparent
                    opacity={0.7}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
}