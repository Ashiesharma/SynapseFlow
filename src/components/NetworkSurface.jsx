import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import noise2D from "../utils/noise";

function getHeight(x, z) {
    const large = noise2D(x * 0.12, z * 0.12) * 0.45;
    const medium = noise2D(x * 0.35, z * 0.35) * 0.18;
    const small = noise2D(x * 0.8, z * 0.8) * 0.05;

    return large + medium + small;
}
export default function NetworkSurface() {
    const meshRef = useRef();
    const materialRef = useRef();

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(14, 14, 120, 120);
        geo.rotateX(-Math.PI / 2);

        const position = geo.attributes.position;

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const z = position.getZ(i);

            position.setY(i, getHeight(x, z) - 1.25);
        }

        geo.computeVertexNormals();
        return geo;
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();

        meshRef.current.rotation.y = Math.sin(t * 0.08) * 0.02;
        materialRef.current.uniforms.uTime.value = t;
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                transparent
                wireframe
                depthWrite={false}
                side={THREE.DoubleSide}
                uniforms={{
                    uTime: { value: 0 },
                }}
                vertexShader={`
          varying vec3 vPosition;

          void main() {
            vPosition = position;

            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;

            gl_Position = projectedPosition;
          }
        `}
                fragmentShader={`
          uniform float uTime;
          varying vec3 vPosition;

          void main() {
            float pulse = sin(uTime * 1.2 + vPosition.x * 2.0) * 0.5 + 0.5;

            vec3 colorA = vec3(0.15, 0.45, 1.0);
            vec3 colorB = vec3(0.85, 0.95, 1.0);

            vec3 finalColor = mix(colorA, colorB, pulse);

            gl_FragColor = vec4(finalColor, 0.06);
          }
        `}
            />
        </mesh>
    );
}