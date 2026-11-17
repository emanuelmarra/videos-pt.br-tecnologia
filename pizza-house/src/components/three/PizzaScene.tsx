"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import { Pizza } from "./Pizza";
import { experience } from "./state";

/** Avisa a página quando a cena já desenhou os primeiros quadros (para o fade-in). */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(({ invalidate }) => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 3) {
      done.current = true;
      onReady();
    } else invalidate();
  });
  return null;
}

/**
 * Renderização sob demanda: a cena só é desenhada quando a pessoa rola a página
 * ou mexe o mouse (e por mais ~0,8 s para as transições suaves terminarem).
 * Parada, a pizza não consome processamento — a página não trava.
 */
function DemandDriver({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  useEffect(() => {
    if (!active) return;
    const kick = () => {
      experience.until = performance.now() + 800;
      invalidate();
    };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("pointermove", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", kick);
      window.removeEventListener("resize", kick);
    };
  }, [active, invalidate]);
  return null;
}

interface Props {
  active: boolean;
  onReady: () => void;
  onSlow: () => void;
  forced: boolean;
}

export default function PizzaScene({ active, onReady, onSlow, forced }: Props) {
  const small = typeof window !== "undefined" && window.innerWidth < 768;
  // orçamento de pixels: telas grandes/2K/4K não desenham mais que ~3,2 milhões de pixels por quadro
  const area = typeof window !== "undefined" ? window.innerWidth * window.innerHeight : 1;
  const maxDpr = Math.min(small ? 1.25 : 1.5, Math.max(0.75, Math.sqrt(3.2e6 / area)));
  return (
    <Canvas
      frameloop={active ? "demand" : "never"}
      dpr={[Math.min(1, maxDpr), maxDpr]}
      camera={{ position: [0, 3.1, 6.6], fov: 34, near: 0.1, far: 50 }}
      gl={{ antialias: !small, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <DemandDriver active={active} />
      <hemisphereLight args={["#ffe3c2", "#2a160b", 0.55]} />
      <ambientLight intensity={0.12} color="#ffe2bf" />
      <directionalLight position={[-3, 8, 3]} intensity={3.2} color="#ffdcae" />
      <directionalLight position={[4, 2.5, -5]} intensity={2.4} color="#ff8f3f" />
      <pointLight position={[2, 2, 4]} intensity={4} distance={10} color="#ffbe7a" />
      <Suspense fallback={null}>
        <Pizza onSlow={onSlow} forced={forced} />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
