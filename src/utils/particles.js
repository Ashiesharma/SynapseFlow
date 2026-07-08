import { riverCurve } from "./flow";
import noise2D from "./noise";

export const RIVER_COUNT = 60000;

export function getHeight(x, z) {
  const large = noise2D(x * 0.18, z * 0.18) * 1.1;
  const medium = noise2D(x * 0.45, z * 0.45) * 0.35;
  const small = noise2D(x * 0.9, z * 0.9) * 0.12;

  return large + medium + small;
}

export function createParticleData() {
  const positions = new Float32Array(RIVER_COUNT * 3);
  const progress = new Float32Array(RIVER_COUNT);
  const speeds = new Float32Array(RIVER_COUNT);

  for (let i = 0; i < RIVER_COUNT; i++) {
    const t = Math.random();
    const point = riverCurve.getPointAt(t);

    const lane = Math.floor(Math.random() * 5) - 2;
    const spread = lane * 0.32 + (Math.random() - 0.5) * 0.08;

    positions[i * 3] = point.x;
    positions[i * 3 + 1] = getHeight(point.x, point.z) - 0.95;
    positions[i * 3 + 2] = point.z + spread;

    progress[i] = t;
    speeds[i] = 0.018 + Math.random() * 0.015;
  }

  return { positions, progress, speeds };
}

export function updateParticleData(positions, progress, speeds, time) {
  for (let i = 0; i < RIVER_COUNT; i++) {
    const i3 = i * 3;

    progress[i] += speeds[i] * 0.02;
    if (progress[i] > 1) progress[i] = 0;

    const point = riverCurve.getPointAt(progress[i]);

    const pathProgress = progress[i];
    const noise = Math.sin(time * 2 + i * 0.12) * 0.16;

    const riverWidth =
      0.55 +
      Math.sin(pathProgress * Math.PI) * 0.35 +
      Math.sin(time * 0.4 + pathProgress * 4) * 0.05;

    positions[i3] = point.x;
    positions[i3 + 2] =
      point.z + noise + Math.sin(i * 0.03) * riverWidth;

    positions[i3 + 1] =
      getHeight(point.x, positions[i3 + 2]) -
      0.95 +
      Math.sin(time * 2.2 + i * 0.02) * 0.006;
  }
}