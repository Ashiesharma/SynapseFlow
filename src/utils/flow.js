import * as THREE from "three";

export const riverCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(-6, 0, -1.8),
    new THREE.Vector3(-4.5, 0, -0.6),
    new THREE.Vector3(-3, 0, 0.9),
    new THREE.Vector3(-1.5, 0, 0.2),
    new THREE.Vector3(0, 0, -1.1),
    new THREE.Vector3(1.8, 0, -0.3),
    new THREE.Vector3(3.5, 0, 1.2),
    new THREE.Vector3(5, 0, 0.4),
    new THREE.Vector3(6, 0, -0.8),
  ],
  false,
  "catmullrom",
  0.35
);

export function getRiverPoint(t) {
  return riverCurve.getPointAt(t);
}

export function getRiverDirection(t) {
  return riverCurve.getTangentAt(t).normalize();
}