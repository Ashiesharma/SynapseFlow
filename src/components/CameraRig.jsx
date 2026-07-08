import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const target = new THREE.Vector3(0, -0.9, 0);

export default function CameraRig() {
    useFrame(({ camera, clock }) => {
        const t = clock.getElapsedTime();

        camera.position.x = Math.sin(t * 0.08) * 1.4;
        camera.position.y = 1.15 + Math.sin(t * 0.12) * 0.12;
        camera.position.z = 6.2 + Math.cos(t * 0.08) * 0.6;

        camera.lookAt(target);
    });

    return null;
}