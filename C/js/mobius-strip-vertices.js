import { UNIT } from "./main-script";

function mobiusStrip(u, v) {
  const x = (1 + (v / 2) * Math.cos(u / 2)) * Math.cos(u);
  const y = (1 + (v / 2) * Math.cos(u / 2)) * Math.sin(u);
  const z = (v / 2) * Math.sin(u / 2);
  return [x, y, z];
}
function createMobiusStripVertices() {
  const N = 20;
  const vertices = [];
  const SCALE_FACTOR = UNIT * 4;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const u0 = (i / N) * 2 * Math.PI;
      const u1 = ((i + 1) / N) * 2 * Math.PI;
      const v0 = (j / N) * 2 - 1;
      const v1 = ((j + 1) / N) * 2 - 1;

      const p0 = mobiusStrip(u0, v0);
      const p1 = mobiusStrip(u1, v0);
      const p2 = mobiusStrip(u0, v1);
      const p3 = mobiusStrip(u1, v1);

      // multiply by SCALE_FACTOR to scale the mobius strip
      p0[0] *= SCALE_FACTOR;
      p0[1] *= SCALE_FACTOR;
      p0[2] *= SCALE_FACTOR;
      p1[0] *= SCALE_FACTOR;
      p1[1] *= SCALE_FACTOR;
      p1[2] *= SCALE_FACTOR;
      p2[0] *= SCALE_FACTOR;
      p2[1] *= SCALE_FACTOR;
      p2[2] *= SCALE_FACTOR;
      p3[0] *= SCALE_FACTOR;
      p3[1] *= SCALE_FACTOR;
      p3[2] *= SCALE_FACTOR;

      vertices.push(...p0);
      vertices.push(...p1);
      vertices.push(...p2);

      vertices.push(...p1);
      vertices.push(...p3);
      vertices.push(...p2);
    }
  }

  const verticesArray = new Float32Array(vertices);
  return verticesArray;
}

export { createMobiusStripVertices };
