import { useMemo } from "react";
import * as THREE from "three";

export default function Terrain() {
    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(14, 14, 160, 160);
        geo.rotateX(-Math.PI / 2);

        const position = geo.attributes.position;

        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const z = position.getZ(i);

            const y =
                Math.sin(x * 0.8 + z * 0.3) * 0.45 +
                Math.cos(z * 1.1 - x * 0.2) * 0.35 +
                Math.sin((x * z) * 0.08) * 0.55 +
                Math.cos(Math.sqrt(x * x + z * z) * 1.4) * 0.25;

            position.setY(i, y);
        }

        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <mesh geometry={geometry} position={[0, -1.2, 0]}>
            <meshStandardMaterial
                color="#f2f6ff"
                roughness={0.55}
                metalness={0.03}
            />
        </mesh>
    );
}