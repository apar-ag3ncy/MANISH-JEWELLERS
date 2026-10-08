import * as THREE from "three";
import { sandHeight } from "./sand-surface";
import { seededRandom } from "../diamond-experience/random";

const COUNT = 16;

/** Shared ring resolution keeps the shard field coherent across all five silhouettes. */
function outline(cut, i) {
  const t = (i / COUNT) * Math.PI * 2;
  if (cut === "emerald") {
    const corners = [
      [-0.58, -1.25],
      [0.58, -1.25],
      [0.82, -1.01],
      [0.82, 1.01],
      [0.58, 1.25],
      [-0.58, 1.25],
      [-0.82, 1.01],
      [-0.82, -1.01],
    ];
    const a = corners[Math.floor(i / 2)],
      b = corners[(Math.floor(i / 2) + 1) % 8];
    return new THREE.Vector2(...a).lerp(new THREE.Vector2(...b), (i % 2) / 2);
  }
  if (cut === "pear") {
    // A cusp at one end and a convex rounded belly at the other.
    return new THREE.Vector2(0.99 * Math.sin(t) * Math.sin(t / 2), -1.34 * Math.cos(t));
  }
  if (cut === "cushion") {
    const c = Math.cos(t),
      s = Math.sin(t);
    return new THREE.Vector2(Math.sign(c) * Math.abs(c) ** 0.57, Math.sign(s) * Math.abs(s) ** 0.57);
  }
  return new THREE.Vector2(Math.cos(t) * (cut === "oval" ? 0.84 : 1.12), Math.sin(t) * (cut === "oval" ? 1.34 : 1.12));
}

export function createCutGeometry(cut) {
  const step = cut === "emerald";
  const profile = step
    ? [
        [0.66, 0.42],
        [0.82, 0.25],
        [1, 0.035],
        [1, -0.035],
        [0.72, -0.38],
        [0.38, -0.7],
      ]
    : [
        [0.48, 0.56],
        [0.76, 0.36],
        [1, 0.035],
        [1, -0.035],
        [0.36, -0.69],
      ];
  const rings = profile.map(([scale, y]) =>
    Array.from({ length: COUNT }, (_, i) => {
      const point = outline(cut, i).multiplyScalar(scale);
      return new THREE.Vector3(point.x, y, point.y);
    }),
  );
  const faces = [];
  const add = (a, b, c) => {
    const centre = a.clone().add(b).add(c).divideScalar(3);
    const n = b.clone().sub(a).cross(c.clone().sub(a));
    if (n.lengthSq() < 1e-10) return;
    faces.push(n.dot(centre) < 0 ? [a, c, b] : [a, b, c]);
  };
  for (let i = 0; i < COUNT; i++) {
    const next = (i + 1) % COUNT;
    add(new THREE.Vector3(0, profile[0][1], 0), rings[0][i], rings[0][next]);
    for (let r = 0; r < rings.length - 1; r++) {
      add(rings[r][i], rings[r + 1][i], rings[r][next]);
      add(rings[r][next], rings[r + 1][i], rings[r + 1][next]);
    }
    if (step) {
      const a = rings.at(-1)[i],
        b = rings.at(-1)[next];
      const keelA = new THREE.Vector3(0, -0.92, a.z >= 0 ? 0.3 : -0.3);
      const keelB = new THREE.Vector3(0, -0.92, b.z >= 0 ? 0.3 : -0.3);
      add(a, keelA, b);
      if (keelA.z !== keelB.z) add(b, keelA, keelB);
    } else add(rings.at(-1)[i], new THREE.Vector3(0, -0.99, 0), rings.at(-1)[next]);
  }
  const planes = [];
  faces.forEach(([a, b, c]) => {
    const n = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    const d = n.dot(a);
    if (!planes.some((p) => Math.abs(p.w - d) < 1e-5 && new THREE.Vector3(p.x, p.y, p.z).distanceTo(n) < 1e-5))
      planes.push(new THREE.Vector4(n.x, n.y, n.z, d));
  });
  const whole = new THREE.BufferGeometry();
  whole.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      faces.flatMap((f) => f.flatMap((v) => v.toArray())),
      3,
    ),
  );
  whole.computeVertexNormals();
  const random = seededRandom(1916);
  const attributes = { position: [], aCentre: [], aRest: [], aAxis: [], aSpin: [], aDelay: [] };
  const core = new THREE.Vector3(0, -0.03, 0);
  faces.forEach((face, i) => {
    const centre = face[0].clone().add(face[1]).add(face[2]).add(core).divideScalar(4);
    const angle = i * 2.399963;
    const radius = 0.55 + Math.sqrt(random()) * 3.0;
    const rest = new THREE.Vector3(Math.cos(angle) * radius, -1.29 + random() * 0.1, Math.sin(angle) * radius * 0.75);
    const axis = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
    const spin = (random() - 0.5) * 7;
    const delay = random() * 0.16;
    const restRotation = new THREE.Matrix4().makeRotationAxis(axis, spin);
    const restingVertices = [...face, core].map((v) =>
      v.clone().sub(centre).multiplyScalar(0.23).applyMatrix4(restRotation),
    );
    const support = Math.max(...restingVertices.map((v) => sandHeight(rest.x + v.x, rest.z + v.z) - v.y));
    // Every shard meets the rippled sand, including its final tumble and scale.
    rest.y = -1.5 + support + 0.008;
    [face, [face[0], core, face[1]], [face[1], core, face[2]], [face[2], core, face[0]]].forEach((f) =>
      f.forEach((v) => {
        attributes.position.push(...v.toArray());
        attributes.aCentre.push(...centre.toArray());
        attributes.aRest.push(...rest.toArray());
        attributes.aAxis.push(...axis.toArray());
        attributes.aSpin.push(spin);
        attributes.aDelay.push(delay);
      }),
    );
  });
  const fragments = new THREE.BufferGeometry();
  Object.entries(attributes).forEach(([key, values]) =>
    fragments.setAttribute(key, new THREE.Float32BufferAttribute(values, key === "aSpin" || key === "aDelay" ? 1 : 3)),
  );
  fragments.computeVertexNormals();
  return { whole, fragments, planes, count: faces.length };
}
