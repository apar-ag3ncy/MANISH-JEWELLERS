import * as THREE from "three";
import { createCutGeometry } from "./cut-geometry";
import { createCutMaterial, createShardDepth } from "./cut-material";
import { createBlackSand } from "./create-black-sand";

/** GSAP owns state. WebGL renders only during interaction and while visible. */
export function createCutScene(host, state, onReady, onLost) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0e0d0d");
  scene.fog = new THREE.Fog("#0e0d0d", 12, 24);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
  scene.add(new THREE.HemisphereLight(0xfffaf2, 0x111010, 1.5));
  const key = new THREE.DirectionalLight(0xfff5e7, 4.5);
  key.position.set(-3, 7, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -6;
  key.shadow.camera.right = key.shadow.camera.top = 6;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 20;
  key.shadow.normalBias = 0.018;
  key.shadow.bias = -0.0003;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 2.2);
  rim.position.set(4, 3, -3);
  scene.add(rim);
  const sandBed = createBlackSand();
  const sand = sandBed.group;
  sand.position.y = -1.5;
  scene.add(sand);
  const grazing = new THREE.DirectionalLight(0xf1f3f5, 1.8);
  grazing.position.set(2.5, 0.85, 7);
  scene.add(grazing);
  const stone = new THREE.Group();
  scene.add(stone);
  let currentCut = "",
    geometry,
    whole,
    shards,
    edges;
  const inverse = new THREE.Matrix4();
  const lightMaterial = new THREE.LineBasicMaterial({
    color: "#fff0d0",
    transparent: true,
    opacity: 0,
    depthTest: false,
  });
  const lightPath = [
    new THREE.Vector3(-0.92, 1.7, 0.1),
    new THREE.Vector3(-0.24, 0.5, 0.04),
    new THREE.Vector3(0.43, -0.48, 0),
    new THREE.Vector3(-0.52, -0.49, 0),
    new THREE.Vector3(0.1, 0.52, 0.06),
    new THREE.Vector3(1.05, 1.7, 0.1),
  ];
  const lightPoints = Array.from({ length: 121 }, (_, i) => {
    const along = (i / 120) * 5,
      edge = Math.min(4, Math.floor(along));
    return lightPath[edge].clone().lerp(lightPath[edge + 1], along - edge);
  });
  const lightGeometry = new THREE.BufferGeometry().setFromPoints(lightPoints);
  lightGeometry.setDrawRange(0, 0);
  const light = new THREE.Line(lightGeometry, lightMaterial);
  light.renderOrder = 5;
  stone.add(light);

  function disposeCut() {
    if (!whole) return;
    [whole, shards, edges].forEach((mesh) => {
      stone.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    shards.customDepthMaterial.dispose();
  }
  function changeCut(id) {
    disposeCut();
    currentCut = id;
    geometry = createCutGeometry(id);
    whole = new THREE.Mesh(geometry.whole, createCutMaterial(state, geometry.planes));
    shards = new THREE.Mesh(geometry.fragments, createCutMaterial(state));
    shards.customDepthMaterial = createShardDepth(shards.material.uniforms.uScatter);
    shards.frustumCulled = false;
    whole.castShadow = shards.castShadow = true;
    edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry.whole, 5),
      new THREE.LineBasicMaterial({ color: "#f2e5d4", transparent: true, opacity: 0.0 }),
    );
    stone.add(whole, shards, edges);
  }
  let frame = 0,
    disposed = false,
    visible = true,
    available = true,
    ready = false,
    mobile = false;
  function draw() {
    frame = 0;
    if (disposed || !visible || !available || document.hidden) return;
    if (currentCut !== state.cut) changeCut(state.cut);
    const assembly = 1 - state.scatter;
    const modelScale = mobile ? (host.clientHeight < 720 ? 0.8 : 0.9) : 1.4;
    stone.scale.setScalar(modelScale);
    sand.scale.setScalar(modelScale);
    sand.position.y = -1.5 * modelScale;
    stone.rotation.set(state.pitch * assembly, state.yaw * assembly, 0);
    camera.position.set(0, mobile ? 7.8 : 7, mobile ? 6.4 : 5.6);
    camera.lookAt(0, -0.38, 0);
    whole.visible = state.scatter < 0.012;
    shards.visible = !whole.visible;
    shards.material.uniforms.uScatter.value = state.scatter;
    edges.visible = whole.visible;
    edges.material.opacity = state.facets * 0.32;
    light.visible = whole.visible && state.light > 0.001;
    lightMaterial.opacity = 0.8 * state.light;
    lightGeometry.setDrawRange(0, Math.max(2, Math.ceil(state.light * 121)));
    scene.updateMatrixWorld();
    whole.material.uniforms.uBasis.value.setFromMatrix4(whole.matrixWorld);
    inverse.copy(whole.matrixWorld).invert();
    whole.material.uniforms.uCameraLocal.value.copy(camera.position).applyMatrix4(inverse);
    renderer.render(scene, camera);
    host.dataset.scatter = state.scatter.toFixed(3);
    host.dataset.cut = state.cut;
    host.dataset.rotation = `${state.pitch.toFixed(3)},${state.yaw.toFixed(3)}`;
    host.dataset.light = state.light.toFixed(3);
    host.dataset.fragments = String(geometry.count);
    host.dataset.sandGrains = String(sandBed.count);
    if (!ready) {
      ready = true;
      onReady();
    }
  }
  function render() {
    if (!frame && !disposed && visible && available && !document.hidden) frame = requestAnimationFrame(draw);
  }
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height || disposed) return;
    mobile = width < 900;
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
    camera.aspect = width / height;
    camera.fov = mobile ? 45 : 35;
    camera.clearViewOffset();
    if (!mobile) camera.setViewOffset(width, height, -width * 0.13, 0, width, height);
    else camera.setViewOffset(width, height, 0, -height * 0.045, width, height);
    camera.updateProjectionMatrix();
    render();
  }
  const sizing = new ResizeObserver(resize);
  sizing.observe(host);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    render();
  });
  visibility.observe(host);
  const lost = (event) => {
    event.preventDefault();
    available = false;
    onLost();
  };
  const restored = () => {
    available = true;
    ready = false;
    render();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  renderer.domElement.addEventListener("webglcontextrestored", restored);
  document.addEventListener("visibilitychange", render);
  resize();
  return {
    render,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      sizing.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", render);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("webglcontextrestored", restored);
      disposeCut();
      sandBed.dispose();
      [light].forEach((mesh) => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
