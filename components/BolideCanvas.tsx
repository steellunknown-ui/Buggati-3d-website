"use client";
import { useEffect, useRef, useState } from "react";

/* ─── Constants ───────────────────────────────────────────────────── */
const TOTAL_FRAMES = 276;
const FRAME_PREFIX = "/frames/frame_";
const WORKERS      = 16;
const LERP_FACTOR  = 0.14;   // smoothing (lower = smoother/slower)
const TELEMETRY_HZ = 10;      // how often to push telemetry to React

function padded(n: number) {
  return String(n).padStart(4, "0");
}
function frameSrc(n: number) {
  return `${FRAME_PREFIX}${padded(n)}.webp`;
}

/* ─── Types ───────────────────────────────────────────────────────── */
export interface FrameTelemetry {
  frameIndex: number;
  scrollPct:  number;
  fps:        number;
  loaded:     number;
  total:      number;
}

interface Props {
  onTelemetry?: (t: FrameTelemetry) => void;
  scrollEl?:    React.RefObject<HTMLElement | null>;
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function BolideCanvas({ onTelemetry }: Props) {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const imagesRef         = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const loadedCountRef    = useRef(0);
  const targetTRef        = useRef(0);           // 0..1 desired progress
  const currentTRef       = useRef(0);           // 0..1 smoothed progress
  const lastDrawnKeyRef   = useRef(-1);
  const rafRef            = useRef<number | null>(null);
  const lastFrameTimeRef  = useRef(performance.now());
  const fpsRef            = useRef(0);
  const lastTelemetryRef  = useRef(0);
  const canvasCtxRef      = useRef<CanvasRenderingContext2D | null>(null);
  const isOnScreenRef     = useRef(true);

  /* ─── Scroll handler ──────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      targetTRef.current = docH > 0 ? window.scrollY / docH : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── Intersection observer ───────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obs = new IntersectionObserver(
      ([e]) => { isOnScreenRef.current = e.isIntersecting; },
      { threshold: 0 }
    );
    obs.observe(canvas);
    return () => obs.disconnect();
  }, []);

  /* ─── Eager preload ───────────────────────────────────────────── */
  useEffect(() => {
    const imgs = imagesRef.current;
    let cancelled = false;

    async function loadBatch(indices: number[]) {
      await Promise.all(
        indices.map(async (i) => {
          if (cancelled || imgs[i]) return;
          const img = new Image();
          img.src = frameSrc(i + 1);
          try {
            if (typeof img.decode === "function") {
              await img.decode();
            } else {
              await new Promise<HTMLImageElement>((res, rej) => {
                img.onload = () => res(img);
                img.onerror = rej;
              });
            }
            if (!cancelled) {
              imgs[i] = img;
              loadedCountRef.current++;
            }
          } catch {
            // graceful — frame will be skipped in render
          }
        })
      );
    }

    // First: load frames 1–30 immediately (hero frames)
    loadBatch(Array.from({ length: 30 }, (_, i) => i)).then(() => {
      if (cancelled) return;
      // Then load the rest in WORKERS-sized batches
      const rest = Array.from({ length: TOTAL_FRAMES - 30 }, (_, i) => i + 30);
      const batches: number[][] = [];
      for (let i = 0; i < rest.length; i += WORKERS) {
        batches.push(rest.slice(i, i + WORKERS));
      }
      (async () => {
        for (const batch of batches) {
          if (cancelled) break;
          await loadBatch(batch);
        }
      })();
    });

    return () => { cancelled = true; };
  }, []);

  /* ─── Canvas context init ─────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    canvasCtxRef.current = ctx;
  }, []);

  /* ─── RAF render loop ─────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;

    function tick(now: number) {
      rafRef.current = requestAnimationFrame(tick);

      // FPS calculation
      const dt  = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      fpsRef.current = dt > 0 ? Math.round(1000 / dt) : 0;

      if (!isOnScreenRef.current) return;

      // Smooth interpolation
      const prev    = currentTRef.current;
      const target  = targetTRef.current;
      const diff    = target - prev;
      currentTRef.current = Math.abs(diff) < 0.0001 ? target : prev + diff * LERP_FACTOR;

      // Frame index (0-based)
      const t          = Math.max(0, Math.min(1, currentTRef.current));
      const frameIndex = Math.round(t * (TOTAL_FRAMES - 1));

      // Skip if same frame
      if (frameIndex === lastDrawnKeyRef.current) {
        // Still push telemetry periodically
        if (now - lastTelemetryRef.current > 1000 / TELEMETRY_HZ) {
          lastTelemetryRef.current = now;
          onTelemetry?.({
            frameIndex, scrollPct: t * 100,
            fps: fpsRef.current,
            loaded: loadedCountRef.current,
            total:  TOTAL_FRAMES,
          });
        }
        return;
      }

      const ctx    = canvasCtxRef.current;
      const img    = imagesRef.current[frameIndex];
      if (!ctx || !canvas) return;

      // Draw frame — letter-box fit
      if (img && img.complete && img.naturalWidth > 0) {
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const scale = Math.min(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = (ch - dh) / 2;

        ctx.fillStyle = "#07070A";
        ctx.fillRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
        lastDrawnKeyRef.current = frameIndex;
      }

      // Telemetry
      if (now - lastTelemetryRef.current > 1000 / TELEMETRY_HZ) {
        lastTelemetryRef.current = now;
        onTelemetry?.({
          frameIndex, scrollPct: t * 100,
          fps: fpsRef.current,
          loaded: loadedCountRef.current,
          total:  TOTAL_FRAMES,
        });
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onTelemetry]);

  /* ─── Resize handler ──────────────────────────────────────────── */
  useEffect(() => {
    function onResize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width  = canvas.clientWidth  * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      lastDrawnKeyRef.current = -1; // force redraw
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ─── Loading state ───────────────────────────────────────────── */
  const [firstLoaded, setFirstLoaded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (loadedCountRef.current > 0) {
        setFirstLoaded(true);
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-full bg-void">
      {/* Loading screen */}
      {!firstLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-void">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue to-transparent animate-pulse" />
          <p className="label-caps text-dim">Initialising sequence</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: firstLoaded ? 1 : 0, transition: "opacity 0.8s ease" }}
      />
    </div>
  );
}
