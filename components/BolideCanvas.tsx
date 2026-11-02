"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface FrameTelemetry {
  frameIndex: number;
  scrollPct:  number;
  fps:        number;
  loaded:     number;
  total:      number;
}

interface BolideCanvasProps {
  onTelemetry?: (telemetry: FrameTelemetry) => void;
  className?: string;
  enable3DRotation?: boolean;
}

const TOTAL_FRAMES = 276;
const FRAME_PREFIX = "/frames/frame_";

function getFramePath(index: number) {
  const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(index)));
  const padded = String(clamped).padStart(4, "0");
  return `${FRAME_PREFIX}${padded}.webp`;
}

/* ═══════════════════════════════════════════════════════════════════
   BolideCanvas: Proven 60 FPS High-Performance Engine
   (Direct port of the Lamborghini 60 FPS architecture)
   ═══════════════════════════════════════════════════════════════════ */
export default function BolideCanvas({
  onTelemetry,
  className = "",
  enable3DRotation = true,
}: BolideCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High performance in-memory image cache
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Animation & Scroll State Refs (Zero React re-renders)
  const currentTRef = useRef<number>(0);
  const targetTRef = useRef<number>(0);
  const lastDrawnFrameKeyRef = useRef<string>("");
  const lastRotTransformRef = useRef<string>("");

  // FPS tracking refs
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(performance.now());
  const currentFpsRef = useRef<number>(60);
  const lastTelemetryTimeRef = useRef<number>(0);

  // Interactive 3D Perspective Rotation State
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Loading state (only for initial UI splash)
  const [loadPercentage, setLoadPercentage] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Fast Concurrency Preloader: Preload and decode all 276 frames into RAM immediately
  useEffect(() => {
    let isCancelled = false;

    const allPaths: string[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      allPaths.push(getFramePath(i));
    }

    const totalCount = allPaths.length;
    let completedCount = 0;
    const concurrency = 16;
    let queueIndex = 0;

    const loadWorker = async () => {
      while (queueIndex < totalCount && !isCancelled) {
        const path = allPaths[queueIndex++];
        if (imageCache.current.has(path)) {
          completedCount++;
          continue;
        }

        try {
          const img = new Image();
          img.src = path;
          if (typeof img.decode === "function") {
            await img.decode();
          } else {
            await new Promise((res) => {
              img.onload = () => res(img);
              img.onerror = () => res(img);
            });
          }
          imageCache.current.set(path, img);
        } catch {
          // Fallback if decode fails
        }

        completedCount++;
        // Throttle React progress updates to avoid React overhead
        if (completedCount % 12 === 0 || completedCount === totalCount) {
          if (!isCancelled) {
            const pct = Math.round((completedCount / totalCount) * 100);
            setLoadPercentage(pct);
            if (completedCount >= 18 && !isReady) {
              setIsReady(true);
            }
          }
        }
      }
    };

    // Launch worker pool
    const workers = Array.from({ length: concurrency }, () => loadWorker());
    Promise.all(workers).then(() => {
      if (!isCancelled) {
        setLoadPercentage(100);
        setIsReady(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [isReady]);

  // Passive high-performance scroll listener (Updates ref directly, ZERO React re-renders)
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetTRef.current = Math.min(1, Math.max(0, scrollY / maxScroll));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse & Touch 3D Interactive Orbit Rotation Handlers
  useEffect(() => {
    if (!enable3DRotation) return;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetMouseRef.current = { x: nx, y: ny };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const nx = (t.clientX / window.innerWidth) * 2 - 1;
        const ny = (t.clientY / window.innerHeight) * 2 - 1;
        targetMouseRef.current = { x: nx, y: ny };
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [enable3DRotation]);

  // Setup Canvas and Handle Resize
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }
    lastDrawnFrameKeyRef.current = ""; // force re-render
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas, { passive: true });
    return () => window.removeEventListener("resize", setupCanvas);
  }, [setupCanvas]);

  // Main 60FPS RAF Render Loop (Runs completely decoupled from React state)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let isRunning = true;
    let animationFrameId: number;

    const renderLoop = (now: number) => {
      if (!isRunning) return;

      // 1. Calculate precise FPS
      frameCountRef.current++;
      const timeElapsed = now - lastFpsTimeRef.current;
      if (timeElapsed >= 500) {
        currentFpsRef.current = Math.round((frameCountRef.current * 1000) / timeElapsed);
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      // 2. Smooth interpolate scroll progress with proven 0.18 damping
      const scrollDelta = targetTRef.current - currentTRef.current;
      currentTRef.current += scrollDelta * 0.18;
      if (Math.abs(scrollDelta) < 0.0001) {
        currentTRef.current = targetTRef.current;
      }

      const t = currentTRef.current;

      // 3. Smooth interpolate mouse orbit
      if (enable3DRotation && container) {
        mousePosRef.current.x += (targetMouseRef.current.x - mousePosRef.current.x) * 0.1;
        mousePosRef.current.y += (targetMouseRef.current.y - mousePosRef.current.y) * 0.1;

        const rotY = (mousePosRef.current.x * 6).toFixed(2);
        const rotX = (-mousePosRef.current.y * 4).toFixed(2);
        const transformStr = `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(1.02)`;

        if (transformStr !== lastRotTransformRef.current) {
          lastRotTransformRef.current = transformStr;
          container.style.transform = transformStr;
        }
      }

      // 4. Calculate active frame index (1 to 276)
      const frameIndex = Math.max(
        1,
        Math.min(TOTAL_FRAMES, Math.round(t * (TOTAL_FRAMES - 1)) + 1)
      );

      const frameKey = `frame_${frameIndex}`;

      // 5. Blit frame onto canvas if changed
      if (frameKey !== lastDrawnFrameKeyRef.current) {
        lastDrawnFrameKeyRef.current = frameKey;

        const path = getFramePath(frameIndex);
        let img = imageCache.current.get(path);

        // Fallback to nearest loaded neighbor if scrubbing rapidly
        if (!img || !img.complete || img.naturalWidth === 0) {
          for (let r = 1; r < 20; r++) {
            const pLeft = getFramePath(frameIndex - r);
            const pRight = getFramePath(frameIndex + r);
            if (imageCache.current.has(pLeft)) {
              img = imageCache.current.get(pLeft);
              break;
            }
            if (imageCache.current.has(pRight)) {
              img = imageCache.current.get(pRight);
              break;
            }
          }
        }

        if (img && img.complete && img.naturalWidth > 0) {
          const cw = canvas.width;
          const ch = canvas.height;

          // Clear background
          ctx.fillStyle = "#04060A";
          ctx.fillRect(0, 0, cw, ch);

          const targetAspect = 16 / 9;
          const canvasAspect = cw / ch;

          let drawW: number;
          let drawH: number;

          // Fullscreen edge-to-edge cover
          if (canvasAspect > targetAspect) {
            drawW = cw * 1.02;
            drawH = drawW / targetAspect;
          } else {
            drawH = ch * 1.02;
            drawW = drawH * targetAspect;
          }

          const dx = (cw - drawW) / 2;
          const dy = (ch - drawH) / 2;

          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, drawW, drawH);
        }
      }

      // 6. Throttled telemetry dispatch (90ms / 10 Hz) to keep React thread 100% smooth
      if (onTelemetry && now - lastTelemetryTimeRef.current >= 90) {
        lastTelemetryTimeRef.current = now;
        onTelemetry({
          frameIndex: frameIndex - 1,
          scrollPct:  t * 100,
          fps:        currentFpsRef.current || 60,
          loaded:     imageCache.current.size,
          total:      TOTAL_FRAMES,
        });
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    enable3DRotation,
    isReady,
    loadPercentage,
    onTelemetry,
  ]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none select-none will-change-transform ${className}`}
      style={{ transformOrigin: "center center" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-contain pointer-events-none"
        aria-label="Bugatti Bolide 3D Exploded-View interactive canvas animation"
      />

      {/* Fast Preloader Splash — Dissolves immediately as initial frames buffer */}
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#04060A]/95 backdrop-blur-md transition-opacity duration-500">
          <div className="w-64 max-w-[85vw] space-y-4 text-center">
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-cyan-300">
              <span>PRE-CACHING 276 FRAMES IN RAM</span>
              <span className="text-white font-bold">{loadPercentage}%</span>
            </div>
            <div className="h-[2px] w-full bg-cyan-950/50 overflow-hidden rounded-full">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-white transition-all duration-150 ease-out shadow-[0_0_12px_#00E5FF]"
                style={{ width: `${loadPercentage}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-cyan-200/50 tracking-widest uppercase">
              DECODING 60 FPS HARDWARE BUFFERS
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
