import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const target = new THREE.Vector3(0, -0.8, 0);

export default function CameraRig() {
    useFrame(({ camera, clock }) => {
        const t = clock.getElapsedTime();

        camera.position.x = Math.sin(t * 0.08) * 2.4;
        camera.position.y = 3.4 + Math.sin(t * 0.12) * 0.18;
        camera.position.z = 8 + Math.cos(t * 0.08) * 1.2;

        camera.lookAt(target);
    });

    return null;
}