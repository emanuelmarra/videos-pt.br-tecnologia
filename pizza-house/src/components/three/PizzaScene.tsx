"use client";

import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Pizza } from "./Pizza";

/** Avisa a página quando a cena já desenhou os primeiros quadros (para o fade-in). */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 3) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

function CameraRig() {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

export default function PizzaScene({ active, onReady }: { active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.1, 6.6], fov: 34, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      <CameraRig />
      <ambientLight intensity={0.16} color="#ffe2bf" />
      <directionalLight position={[-3, 8, 3]} intensity={3.1} color="#ffdcae" />
      <directionalLight position={[4, 2.5, -5]} intensity={2.4} color="#ff8f3f" />
      <pointLight position={[2, 2, 4]} intensity={4} distance={10} color="#ffbe7a" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.5} color="#ffd8a3" position={[-3, 5, 3]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#ff8a3d" position={[5, 2, -2]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={0.6} color="#fff1dc" position={[0, 6, -4]} scale={3} />
      </Environment>
      <Pizza />
      <Sparkles count={36} scale={[9, 4, 5]} position={[0, 1, 0]} size={2.4} speed={0.25} opacity={0.55} color="#f2c27e" />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
