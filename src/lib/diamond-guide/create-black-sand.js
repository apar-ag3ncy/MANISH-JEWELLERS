import * as THREE from "three";
import { createSandMaterial } from "./cut-material";
import { sandHeight, sandRandom } from "./sand-surface";

/** A sculpted bed and one instanced draw for thousands of irregular basalt grains. */
export function createBlackSand() {
  const group = new THREE.Group();
  const surface = new THREE.PlaneGeometry(70, 70, 256, 256);
  surface.rotateX(-Math.PI / 2);
  const positions = surface.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    positions.setY(i, sandHeight(positions.getX(i), positions.getZ(i)));
  }
  surface.computeVertexNormals();
  const floor = new THREE.Mesh(surface, createSandMaterial());
  floor.receiveShadow = true;
  group.add(floor);

  const random = sandRandom();
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const vertices = geometry.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i),
      y = vertices.getY(i),
      z = vertices.getZ(i);
    const rough = 0.9 + 0.16 * Math.sin(x * 8.3 + y * 5.4 + z * 9.1);
    vertices.setXYZ(i, x * rough, y * rough, z * rough);
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    color: "#b6b8bc",
    roughness: 0.76,
    metalness: 0.12,
    flatShading: true,
  });
  const count = 18000;
  const grains = new THREE.InstancedMesh(geometry, material, count);
  const transform = new THREE.Object3D();
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const x = (random() - 0.5) * 12;
    const z = (random() - 0.5) * 9;
    const size = 0.006 + Math.pow(random(), 0.75) * 0.017;
    transform.scale.set(size * (0.8 + random() * 0.5), size * (0.55 + random() * 0.45), size * (0.75 + random() * 0.7));
    transform.rotation.set(random() * Math.PI, random() * Math.PI, random() * Math.PI);
    transform.updateMatrix();
    // Rest each irregular grain on the same relief as the floor.
    let lowest = Infinity;
    const vertex = new THREE.Vector3();
    for (let j = 0; j < vertices.count; j++) {
      vertex.fromBufferAttribute(vertices, j).applyMatrix4(transform.matrix);
      lowest = Math.min(lowest, vertex.y);
    }
    transform.position.set(x, sandHeight(x, z) - lowest - 0.006, z);
    transform.updateMatrix();
    grains.setMatrixAt(i, transform.matrix);
    transform.position.set(0, 0, 0);
    const tone = 0.018 + Math.pow(random(), 2) * 0.052;
    color.setRGB(tone * 0.96, tone, tone * 1.025);
    grains.setColorAt(i, color);
  }
  grains.instanceMatrix.needsUpdate = true;
  grains.instanceColor.needsUpdate = true;
  grains.computeBoundingSphere();
  grains.receiveShadow = true;
  group.add(grains);
  return {
    group,
    count,
    dispose() {
      surface.dispose();
      floor.material.dispose();
      geometry.dispose();
      material.dispose();
      grains.dispose();
    },
  };
}
