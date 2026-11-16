"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { cheeseTexture, crustTexture, doughTexture, shadowTexture, woodTexture } from "./textures";
import { experience, range } from "./state";

/*
 * Pizza marguerita 3D procedural: tábua, 8 fatias com massa, borda, molho/queijo
 * e coberturas (tomates assados, manjericão e muçarela). Cada fatia tem camadas
 * independentes, que se separam na seção "experiência" conforme a rolagem.
 */

const R = 2; // raio da pizza
const SLICES = 8;
const GAP = 0.012; // espaço entre fatias (rad)
const CRUST = 0.36; // largura da borda
const OFFSET = -Math.PI / SLICES; // gira para uma fatia apontar para a câmera
const LIFT_SLICE = 6; // fatia que é "servida" no final
const BASE_H = 0.08;
const CHEESE_H = 0.035;
const TOP_Y = BASE_H + CHEESE_H;
const CRUST_R = R - CRUST / 2 - 0.02;

function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function sector(r: number, a0: number, a1: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
  s.absarc(0, 0, r, a0, a1, false);
  s.lineTo(0, 0);
  return s;
}

/** Converte coordenadas do plano da forma (x, y) para o mundo (x, z) após deitar a pizza. */
const toWorld = (x: number, y: number) => [x, -y] as const;

function leafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.1, 0.1, 0.3, 0.11, 0.44, 0);
  s.bezierCurveTo(0.3, -0.11, 0.1, -0.1, 0, 0);
  const g = new THREE.ShapeGeometry(s, 14);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, -0.5 * (x - 0.22) ** 2 + 0.9 * y * y + 0.02);
  }
  g.computeVertexNormals();
  g.translate(-0.22, 0, 0);
  g.rotateX(-Math.PI / 2);
  return g;
}

interface Topping {
  kind: "tomato" | "basil" | "mozz";
  x: number;
  z: number;
  rot: number;
  s: number;
}

function sliceToppings(index: number, a0: number, a1: number): Topping[] {
  const rand = random(101 + index * 37);
  const items: Topping[] = [];
  const place = (kind: Topping["kind"], n: number, rMin: number, rMax: number) => {
    for (let k = 0; k < n; k++) {
      const a = a0 + 0.12 + rand() * (a1 - a0 - 0.24);
      const r = rMin + Math.sqrt(rand()) * (rMax - rMin);
      const [x, z] = toWorld(Math.cos(a) * r, Math.sin(a) * r);
      items.push({ kind, x, z, rot: rand() * Math.PI * 2, s: 0.85 + rand() * 0.35 });
    }
  };
  place("mozz", 1, 0.5, R - CRUST - 0.3);
  place("tomato", 3, 0.38, R - CRUST - 0.18);
  place("basil", index % 2 === 0 ? 2 : 1, 0.5, R - CRUST - 0.28);
  return items;
}

export function Pizza() {
  const root = useRef<THREE.Group>(null);
  const slices = useRef<(THREE.Group | null)[]>([]);
  const cheeseLayers = useRef<(THREE.Group | null)[]>([]);
  const toppingLayers = useRef<(THREE.Group | null)[]>([]);
  const spin = useRef(0);

  const assets = useMemo(() => {
    const cheeseMap = cheeseTexture();
    cheeseMap.repeat.set(1 / (2 * R), 1 / (2 * R));
    cheeseMap.offset.set(0.5, 0.5);
    const crust = crustTexture();
    const dough = doughTexture();
    dough.repeat.set(0.6, 0.6);
    const wood = woodTexture();

    const materials = {
      dough: new THREE.MeshStandardMaterial({ map: dough, roughness: 0.92, color: "#f0c58a" }),
      cheese: new THREE.MeshPhysicalMaterial({ map: cheeseMap, bumpMap: cheeseMap, bumpScale: 1.2, roughness: 0.58, clearcoat: 0.25, clearcoatRoughness: 0.6 }),
      crust: new THREE.MeshStandardMaterial({ map: crust, roughness: 0.86, bumpMap: crust, bumpScale: 2.2 }),
      tomato: new THREE.MeshPhysicalMaterial({ color: "#a32314", roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
      tomatoDark: new THREE.MeshPhysicalMaterial({ color: "#6f170d", roughness: 0.5, clearcoat: 0.25 }),
      basil: new THREE.MeshStandardMaterial({ color: "#2e4c1d", roughness: 0.5, side: THREE.DoubleSide }),
      basilDark: new THREE.MeshStandardMaterial({ color: "#1e2f14", roughness: 0.6, side: THREE.DoubleSide }),
      mozz: new THREE.MeshPhysicalMaterial({ color: "#f5e3b8", roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color("#fff3d6") }),
      board: new THREE.MeshStandardMaterial({ map: wood, roughness: 0.78 }),
      shadow: new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, toneMapped: false }),
    };

    const geos = {
      tomato: new THREE.SphereGeometry(0.13, 28, 18),
      mozz: new THREE.SphereGeometry(0.21, 24, 14),
      leaf: leafGeometry(),
      cap: new THREE.SphereGeometry(0.19, 18, 12),
      board: new THREE.CylinderGeometry(R + 0.34, R + 0.38, 0.12, 96),
      shadow: new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    };

    const parts = Array.from({ length: SLICES }, (_, i) => {
      const a0 = OFFSET + (i / SLICES) * Math.PI * 2 + GAP / 2;
      const a1 = OFFSET + ((i + 1) / SLICES) * Math.PI * 2 - GAP / 2;
      const mid = (a0 + a1) / 2;

      const base = new THREE.ExtrudeGeometry(sector(R - 0.06, a0, a1), {
        depth: BASE_H,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2,
        curveSegments: 20,
      });
      base.rotateX(-Math.PI / 2);

      const cheese = new THREE.ExtrudeGeometry(sector(R - CRUST + 0.04, a0 + 0.004, a1 - 0.004), {
        depth: CHEESE_H,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.014,
        bevelSegments: 2,
        curveSegments: 20,
      });
      cheese.rotateX(-Math.PI / 2);
      cheese.translate(0, BASE_H, 0);

      const crust = new THREE.TorusGeometry(CRUST_R, 0.19, 18, 30, a1 - a0);
      crust.rotateZ(a0);
      crust.rotateX(-Math.PI / 2);
      crust.scale(1, 0.78, 1);
      crust.translate(0, BASE_H * 1.1, 0);

      const caps = [a0, a1].map((a) => {
        const [x, z] = toWorld(Math.cos(a) * CRUST_R, Math.sin(a) * CRUST_R);
        return [x, BASE_H * 1.1, z] as const;
      });

      const [dx, dz] = toWorld(Math.cos(mid), Math.sin(mid));
      return { base, cheese, crust, caps, dir: [dx, dz] as const, toppings: sliceToppings(i, a0, a1) };
    });

    return { materials, geos, parts };
  }, []);

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    const { size, viewport, clock } = state;
    const t = clock.elapsedTime;
    const { enter, story, pointerX, pointerY, reduceMotion } = experience;
    const mobile = size.width < 768;
    const tablet = size.width < 1024;
    const dt = Math.min(delta, 0.05);

    // ---- pose do hero e da seção experiência (responsivo)
    const hero = mobile
      ? { x: 0, y: viewport.height * 0.25, s: 0.36 }
      : tablet
        ? { x: 0, y: viewport.height * 0.16, s: 0.6 }
        : { x: viewport.width * 0.255, y: -0.1, s: Math.min(0.72, viewport.width * 0.088) };
    const exp = mobile
      ? { x: 0, y: viewport.height * 0.25, s: 0.34 }
      : tablet
        ? { x: 0, y: viewport.height * 0.12, s: 0.6 }
        : { x: viewport.width * 0.225, y: -0.22, s: Math.min(0.7, viewport.width * 0.086) };

    const k = range(enter, 0.15, 1);
    const bob = reduceMotion ? 0 : Math.sin(t * 0.9) * 0.035 * (1 - k);
    if (tablet) {
      // Layout empilhado: no hero a pizza sobe junto com a página (sem ficar atrás do texto)
      // e reaparece, crescendo, quando a seção "experiência" fixa na tela.
      const inHero = enter < 1;
      const follow = experience.scrollPx * (viewport.height / Math.max(1, experience.vh));
      g.position.x = 0;
      g.position.y = inHero ? hero.y + follow + bob : exp.y;
      const ts = inHero ? hero.s * (1 - range(enter, 0.3, 0.8)) : exp.s * range(story, 0, 0.08);
      g.scale.setScalar(Math.max(0.0001, ts));
    } else {
      const tx = THREE.MathUtils.lerp(hero.x, exp.x, k);
      const ty = THREE.MathUtils.lerp(hero.y, exp.y, k) + bob;
      const ts = THREE.MathUtils.lerp(hero.s, exp.s, k);
      g.position.x = THREE.MathUtils.damp(g.position.x, tx, 4, dt);
      g.position.y = THREE.MathUtils.damp(g.position.y, ty, 4, dt);
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, ts, 4, dt));
    }

    // ---- etapas da história
    const cheeseLift = range(story, 0.1, 0.22) - range(story, 0.36, 0.5);
    const toppingLift = range(story, 0.1, 0.22) - range(story, 0.56, 0.7);
    const explode = range(story, 0.74, 0.86);
    const serve = range(story, 0.8, 0.94);

    // rotação: gira sozinha no hero; na história, para de frente
    if (!reduceMotion) spin.current += dt * 0.18 * (1 - k);
    const settled = Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2 + (reduceMotion ? 0 : Math.sin(t * 0.35) * 0.12);
    const rotY = THREE.MathUtils.lerp(spin.current, settled, k);
    const tilt = !mobile && !reduceMotion;
    const rx = THREE.MathUtils.lerp(0.5, 0.1 + 0.32 * explode, k) + (tilt ? pointerY * 0.1 : 0);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rx, 5, dt);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rotY + (tilt ? pointerX * 0.16 : 0), 5, dt);

    assets.parts.forEach((p, i) => {
      const slice = slices.current[i];
      const cheese = cheeseLayers.current[i];
      const tops = toppingLayers.current[i];
      if (!slice || !cheese || !tops) return;
      const out = explode * (mobile ? 0.28 : 0.4) + (i === LIFT_SLICE ? serve * (mobile ? 0.5 : 0.75) : 0);
      slice.position.set(p.dir[0] * out, i === LIFT_SLICE ? serve * 0.5 : 0, p.dir[1] * out);
      slice.rotation.x = i === LIFT_SLICE ? -serve * 0.25 : 0;
      const wobble = reduceMotion ? 0 : Math.sin(t * 1.4 + i) * 0.03;
      cheese.position.y = cheeseLift * 0.7 + cheeseLift * wobble;
      tops.position.y = toppingLift * 1.45 + toppingLift * wobble * 2;
      tops.rotation.y = toppingLift * (reduceMotion ? 0 : Math.sin(t * 0.6 + i) * 0.08);
    });
  });

  const { materials: m, geos, parts } = assets;

  return (
    <group ref={root}>
      <mesh geometry={geos.shadow} material={m.shadow} position={[0.25, -0.16, 0.35]} scale={[(R + 0.6) * 2.5, 1, (R + 0.6) * 2.2]} renderOrder={-1} />
      <mesh geometry={geos.board} material={m.board} position={[0, -0.075, 0]} />
      {parts.map((p, i) => (
        <group key={i} ref={(el) => void (slices.current[i] = el)}>
          <mesh geometry={p.base} material={m.dough} />
          <mesh geometry={p.crust} material={m.crust} />
          {p.caps.map((c, j) => (
            <mesh key={j} geometry={geos.cap} material={m.crust} position={c} scale={[1, 0.72, 1]} />
          ))}
          <group ref={(el) => void (cheeseLayers.current[i] = el)}>
            <mesh geometry={p.cheese} material={m.cheese} />
          </group>
          <group ref={(el) => void (toppingLayers.current[i] = el)}>
            {p.toppings.map((tp, j) =>
              tp.kind === "tomato" ? (
                <mesh
                  key={j}
                  geometry={geos.tomato}
                  material={j % 3 === 0 ? m.tomatoDark : m.tomato}
                  position={[tp.x, TOP_Y + 0.01, tp.z]}
                  scale={[tp.s, tp.s * 0.34, tp.s * 0.92]}
                  rotation={[0, tp.rot, 0]}
                />
              ) : tp.kind === "basil" ? (
                <mesh
                  key={j}
                  geometry={geos.leaf}
                  material={j % 2 ? m.basilDark : m.basil}
                  position={[tp.x, TOP_Y + 0.045, tp.z]}
                  rotation={[0, tp.rot, 0]}
                  scale={tp.s}
                />
              ) : (
                <mesh
                  key={j}
                  geometry={geos.mozz}
                  material={m.mozz}
                  position={[tp.x, TOP_Y - 0.005, tp.z]}
                  scale={[tp.s * 0.9, 0.11, tp.s * 0.75]}
                  rotation={[0, tp.rot, 0]}
                />
              ),
            )}
          </group>
        </group>
      ))}
    </group>
  );
}
