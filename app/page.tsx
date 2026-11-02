"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { FrameTelemetry } from "@/components/BolideCanvas";
import Navigation          from "@/components/Navigation";
import VerticalRail        from "@/components/VerticalRail";
import BottomHud           from "@/components/BottomHud";
import HudAnnotations      from "@/components/HudAnnotations";
import TopProgressBar      from "@/components/TopProgressBar";
import TechnicalSpecsDrawer from "@/components/TechnicalSpecsDrawer";
import CustomCursor        from "@/components/CustomCursor";

const BolideCanvas = dynamic(() => import("@/components/BolideCanvas"), { ssr: false });

/* ─── Section definitions ─────────────────────────────────────────── */
const SECTIONS = [
  {
    id:       "hero",
    range:    [0, 18] as [number, number],
    pos:      "left",
    eyebrow:  "Bugatti Automobiles S.A.S. — 2020",
    heading:  ["Engineered", "Beyond", "Limits."],
    body:     "The Bugatti Bolide. A 1,600 hp track weapon weighing only 1,240 kg. Not a road car. Not a concept. A singular act of engineering will.",
    spec:     null,
  },
  {
    id:       "closures",
    range:    [20, 40] as [number, number],
    pos:      "right",
    eyebrow:  "01 — Aerodynamic Surface",
    heading:  ["Carbon", "In", "Motion."],
    body:     "Every body panel is full carbon fibre composite — sculpted by computational fluid dynamics over 2,500 simulation hours. Nothing exists by accident.",
    spec:     "Cd 0.36  //  0.13 m² frontal area",
  },
  {
    id:       "powertrain",
    range:    [46, 66] as [number, number],
    pos:      "left",
    eyebrow:  "02 — Powertrain",
    heading:  ["The W16", "Lives", "Here."],
    body:     "8.0 litres. Four turbochargers. 1,600 horsepowers. 1,600 newton-metres. The most powerful naturally-aspirated internal combustion engine ever placed in an automobile.",
    spec:     "0–100 km/h in 2.17 s  //  500 km/h Vmax",
  },
  {
    id:       "chassis",
    range:    [70, 90] as [number, number],
    pos:      "right",
    eyebrow:  "03 — Structural Architecture",
    heading:  ["Skeleton", "of a", "Weapon."],
    body:     "A CFRP aerospace monocoque tub. Active aerodynamics generating 3.5 G of downforce at terminal velocity. CSiC brake rotors: 420 mm. 100 to zero in 31 metres.",
    spec:     "40 units produced  //  Track-only configuration",
  },
  {
    id:       "finale",
    range:    [92, 100] as [number, number],
    pos:      "center",
    eyebrow:  "Fin",
    heading:  ["A Pure", "Machine."],
    body:     "The Bolide is Bugatti's answer to a question no one dared ask: what if we removed every constraint and built purely for performance? The answer weighs 1,240 kg and does 500 km/h.",
    spec:     "EB.01 — Bolide — 2020",
  },
];

function getSectionStyle(scrollPct: number, range: [number, number]) {
  const [from, to] = range;
  const midPoint   = (from + to) / 2;
  const fadeIn     = Math.min(1, Math.max(0, (scrollPct - from + 4) / 6));
  const fadeOut    = 1 - Math.min(1, Math.max(0, (scrollPct - (to - 6)) / 6));
  const opacity    = Math.min(fadeIn, fadeOut);
  const translateY = opacity < 0.98 && scrollPct < midPoint ? 18 * (1 - fadeIn) : 0;
  return { opacity, transform: `translateY(${translateY}px)` };
}

/* ═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [telemetry,  setTelemetry]  = useState<FrameTelemetry>({ frameIndex: 0, scrollPct: 0, fps: 0, loaded: 0, total: 276 });
  const [specsOpen,  setSpecsOpen]  = useState(false);

  const handleTelemetry = useCallback((t: FrameTelemetry) => {
    setTelemetry(t);
  }, []);

  return (
    <>
      <CustomCursor />

      {/* Fixed layers */}
      <div className="grain-overlay" />
      <div className="vignette" />
      <div className="ambient-glow" />

      {/* Progress bar */}
      <TopProgressBar scrollPct={telemetry.scrollPct} />

      {/* Navigation */}
      <Navigation onSpecsOpen={() => setSpecsOpen(true)} scrollPct={telemetry.scrollPct} />

      {/* Vertical stage rail */}
      <VerticalRail scrollPct={telemetry.scrollPct} />

      {/* HUD annotations */}
      <HudAnnotations scrollPct={telemetry.scrollPct} />

      {/* Bottom telemetry HUD */}
      <BottomHud
        fps={telemetry.fps}
        frameIndex={telemetry.frameIndex}
        loaded={telemetry.loaded}
        total={telemetry.total}
        scrollPct={telemetry.scrollPct}
      />

      {/* Technical specs drawer */}
      <TechnicalSpecsDrawer open={specsOpen} onClose={() => setSpecsOpen(false)} />

      {/* ── Fixed canvas (viewport-pinned) ── */}
      <div
        className="fixed inset-0 z-0"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <BolideCanvas onTelemetry={handleTelemetry} />
      </div>

      {/* ── Scroll spacer — tall enough to drive all 276 frames ── */}
      <div style={{ height: "650vh", position: "relative", zIndex: 10, pointerEvents: "none" }}>

        {/* Section overlays */}
        {SECTIONS.map((s) => {
          const style = getSectionStyle(telemetry.scrollPct, s.range);
          const isCenter = s.pos === "center";
          const isRight  = s.pos === "right";

          return (
            <div
              key={s.id}
              className="fixed z-30 pointer-events-none"
              style={{
                ...style,
                transition: "opacity 0.6s ease, transform 0.6s ease",
                ...(isCenter
                  ? {
                      left: "50%",
                      top:  "50%",
                      transform: `translate(-50%, calc(-50% + ${style.transform.replace("translateY(", "").replace(")", "")}))`,
                      textAlign: "center",
                    }
                  : isRight
                  ? { right: "6vw", bottom: "15vh", textAlign: "right" }
                  : { left:  "6vw", bottom: "15vh", textAlign: "left" }),
                maxWidth: "min(480px, 90vw)",
              }}
            >
              {/* Eyebrow */}
              <p className="section-subhead mb-4">{s.eyebrow}</p>

              {/* Heading */}
              <h2 className="section-heading text-ink mb-6">
                {s.heading.map((line, i) => (
                  <span key={i} style={{ display: "block" }}>
                    {i === s.heading.length - 1
                      ? <span style={{ WebkitTextStroke: "1px var(--ink)", color: "transparent" }}>{line}</span>
                      : line}
                  </span>
                ))}
              </h2>

              {/* Rule */}
              <div
                style={{
                  width: 40, height: 1,
                  background: "var(--accent)",
                  marginBottom: 20,
                  marginLeft: isRight ? "auto" : isCenter ? "auto" : 0,
                  marginRight: isCenter ? "auto" : 0,
                }}
              />

              {/* Body */}
              <p className="section-body" style={{ maxWidth: 380 }}>{s.body}</p>

              {/* Spec tag */}
              {s.spec && (
                <p
                  style={{
                    marginTop: 16,
                    fontFamily: "var(--font-ibm-plex-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.12em",
                    color: "var(--gold)",
                    textTransform: "uppercase",
                  }}
                >
                  {s.spec}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Scroll prompt (only at top) ── */}
      {telemetry.scrollPct < 4 && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          style={{ opacity: 1 - telemetry.scrollPct / 4, transition: "opacity 0.3s ease", pointerEvents: "none" }}
        >
          <span className="label-caps" style={{ fontSize: "0.48rem" }}>Scroll to explore</span>
          <div
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, var(--accent), transparent)",
              animation: "pulse 1.8s ease-in-out infinite",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50%       { opacity: 1;   transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
