/* Clay 3D objects in the konkos.design style (cream + black, soft matte, rounded bevels).
   Loaded only when a scene is about to scroll into view. If WebGL is missing or the visitor
   prefers reduced motion, the static image inside the container stays and nothing else happens. */
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const CREAM = 0xEEE5D8, BLACK = 0x0E0D0C;
const K_PATH = 'M30.9 56.1 L70.4 96.3 L73.7 98.5 L77.1 99.8 L78.6 99.9 L113.7 99.9 L113.6 99.5 L79.2 64.9 L74.2 60.0 L70.8 57.5 L68.6 56.5 L66.1 56.0ZM25.8 0.1 L24.0 0.3 L18.1 4.1 L12.3 8.2 L7.5 12.2 L3.2 16.8 L1.8 18.9 L0.5 21.8 L0.0 25.0 L0.2 99.9 L2.5 99.8 L3.8 99.4 L7.7 97.5 L24.0 86.5 L25.8 84.6ZM115.4 0.1 L80.2 0.1 L77.1 0.7 L74.6 1.9 L71.9 3.8 L35.5 38.3 L30.8 43.2 L65.0 43.2 L67.8 42.9 L71.0 41.6 L73.6 39.9Z';
const PHONE = 'M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z';
const PIN = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

const clay = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: c === BLACK ? .55 : .82, metalness: 0 });

function extrudeSvg(d, viewW, size, depth, bevel) {
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewW}"><path d="${d}"/></svg>`);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const s = size / viewW;
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: depth / s, bevelEnabled: true, bevelThickness: bevel / s, bevelSize: bevel * .8 / s, bevelSegments: 8, curveSegments: 28 });
  geo.scale(s, -s, -s);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

function bubbleGeo() {
  const sh = new THREE.Shape(), a1 = -2.15, a2 = -2.8;
  sh.moveTo(-1.18, -1.2);
  sh.lineTo(Math.cos(a1), Math.sin(a1));
  sh.absarc(0, 0, 1, a1, a2 + Math.PI * 2, false);
  sh.lineTo(-1.18, -1.2);
  const g = new THREE.ExtrudeGeometry(sh, { depth: .32, bevelEnabled: true, bevelThickness: .14, bevelSize: .12, bevelSegments: 10, curveSegments: 48 });
  g.center(); return g;
}

function setup(host, build) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  const mobile = matchMedia('(max-width: 899px)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement; canvas.className = 'clay__canvas'; canvas.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
  camera.position.set(0, .3, 8.2);
  scene.add(new THREE.HemisphereLight(0xfff8ef, 0x6b6157, 1.25));
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(-3.5, 6, 6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 8; key.shadow.bias = -.0004;
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: .5, far: 25 });
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xfff1e0, .7); rim.position.set(4, 2, -3); scene.add(rim);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: .16 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.0; floor.receiveShadow = true; scene.add(floor);

  const rig = new THREE.Group(); scene.add(rig);
  const parts = build(rig);
  rig.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  host.appendChild(canvas);
  const fit = () => { const r = host.getBoundingClientRect(); if (!r.width) return; renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); };
  new ResizeObserver(fit).observe(host); fit();

  let px = 0, py = 0, tx = 0, ty = 0, visible = false, raf = 0;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clock = new THREE.Clock();
  const loop = () => {
    raf = visible ? requestAnimationFrame(loop) : 0;
    const t = clock.getElapsedTime();
    const r = host.getBoundingClientRect();
    const sp = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));   // -1..1 scroll position
    if (still) { renderer.render(scene, camera); return; }
    px += (tx - px) * .06; py += (ty - py) * .06;
    rig.rotation.y = px * .6 + sp * -.35;
    rig.rotation.x = py * .35 + sp * .12;
    rig.position.y = sp * -.35;
    parts.forEach((p, i) => { p.position.y = p.userData.y + Math.sin(t * .9 + i * 1.7) * .09; p.rotation.z = p.userData.rz + Math.sin(t * .6 + i) * .04; });
    renderer.render(scene, camera);
  };
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible && !raf) { clock.getDelta(); loop(); } }, { rootMargin: '120px' }).observe(host);
  host.classList.add('is-3d');
  return { setColors(ink, paper) { rig.traverse((o) => { if (o.isMesh && o.userData.role) o.material.color.set(o.userData.role === 'ink' ? ink : paper); }); renderer.render(scene, camera); } };
}

const place = (o, x, y, z, rx, ry, rz) => { o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.userData.y = y; o.userData.rz = rz; return o; };
const role = (m, r) => { m.userData.role = r; return m; };

/* Scene 1: "message me" set - phone tile, pin tile, chat bubble */
function contactSet(rig) {
  const tileA = new THREE.Group();
  tileA.add(role(new THREE.Mesh(new RoundedBoxGeometry(2.3, 2.3, .55, 6, .26), clay(CREAM)), 'paper'));
  const phone = role(new THREE.Mesh(extrudeSvg(PHONE, 24, 1.6, .16, .07), clay(BLACK)), 'ink');
  phone.position.z = .38; tileA.add(phone);
  const tileB = new THREE.Group();
  tileB.add(role(new THREE.Mesh(new RoundedBoxGeometry(1.3, 1.3, .45, 6, .2), clay(CREAM)), 'paper'));
  const pin = role(new THREE.Mesh(extrudeSvg(PIN, 24, 1.05, .14, .06), clay(BLACK)), 'ink');
  pin.position.z = .32; tileB.add(pin);
  const bubble = new THREE.Group();
  bubble.add(role(new THREE.Mesh(bubbleGeo(), clay(BLACK)), 'ink'));
  for (let i = -1; i <= 1; i++) { const d = role(new THREE.Mesh(new THREE.SphereGeometry(.17, 32, 24), clay(CREAM)), 'paper'); d.scale.z = .6; d.position.set(i * .48, .05, .3); bubble.add(d); }
  bubble.scale.setScalar(.95);
  rig.scale.setScalar(.8);
  rig.add(place(tileA, -1.0, .35, 0, -.18, .32, .12), place(tileB, 1.35, 1.25, -.6, -.1, -.25, -.08), place(bubble, 1.15, -.8, .7, -.05, -.2, -.06));
  return [tileA, tileB, bubble];
}

/* Scene 2: the K mark */
function kMark(rig) {
  const k = role(new THREE.Mesh(extrudeSvg(K_PATH, 115.4, 3.3, .55, .14), clay(CREAM)), 'paper');
  const g = new THREE.Group(); g.add(k);
  const tile = role(new THREE.Mesh(new RoundedBoxGeometry(1.2, 1.2, .4, 6, .18), clay(BLACK)), 'ink');
  const t2 = role(new THREE.Mesh(new RoundedBoxGeometry(.8, .8, .32, 6, .14), clay(CREAM)), 'paper');
  rig.scale.setScalar(.78);
  rig.add(place(g, 0, .1, 0, -.12, .35, .05), place(tile, -1.85, -1.15, -.8, .3, .5, .3), place(t2, 1.75, 1.35, -1.2, -.2, -.4, -.25));
  return [g, tile, t2];
}

export function mount() {
  const ok = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
  if (!ok) return [];
  const out = [];
  document.querySelectorAll('[data-clay]').forEach((host) => {
    const kind = host.dataset.clay;
    try { out.push(setup(host, kind === 'k' ? kMark : contactSet)); } catch (e) { console.warn('clay', e); }
  });
  return out;
}
