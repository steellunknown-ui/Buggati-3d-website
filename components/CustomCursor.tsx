"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    function loop() {
      raf = requestAnimationFrame(loop);
      dot!.style.left = `${mx}px`;
      dot!.style.top = `${my}px`;
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring!.style.left = `${rx}px`;
      ring!.style.top = `${ry}px`;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    loop();
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[100] w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#00E5FF,0_0_24px_rgba(0,212,255,0.8)] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[99] w-8 h-8 rounded-full border border-cyan-400/50 shadow-[0_0_15px_rgba(0,194,255,0.3)] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}
