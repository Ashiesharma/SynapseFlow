import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleFlow() {
    const pointsRef = useRef();

    const count = 4000;

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const i3 = i * 3;

            const x = -6 + t * 12;
            const z = Math.sin(t * Math.PI * 3) * 1.2;
            const y = 0.35 + Math.sin(t * Math.PI * 5) * 0.25;

            arr[i3] = x + (Math.random() - 0.5) * 0.35;
            arr[i3 + 1] = y + Math.random() * 0.35;
            arr[i3 + 2] = z + (Math.random() - 0.5) * 0.35;
        }

        return arr;
    }, []);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        const pos = pointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            let x = pos[i3] + 0.018;

            if (x > 6) x = -6;

            const progress = (x + 6) / 12;

            const centerZ = Math.sin(progress * Math.PI * 3 + time * 0.4) * 1.25;
            const centerY =
                0.6 +
                Math.sin(progress * Math.PI * 5 + time * 0.8) * 0.25;

            pos[i3] = x;
            pos[i3 + 1] = centerY + Math.sin(time * 3 + i) * 0.12;
            pos[i3 + 2] = centerZ + Math.cos(time * 2 + i) * 0.18;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={count}
                    itemSize={3}
                />
            </bufferGeometry>

            <pointsMaterial
                color="#38bdf8"
                size={0.055}
                transparent
                opacity={1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}