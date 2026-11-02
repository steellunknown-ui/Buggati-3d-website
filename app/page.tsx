"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { FrameTelemetry } from "@/components/BolideCanvas";
import Navigation          from "@/components/Navigation";
import VerticalRail        from "@/components/VerticalRail";
import BottomHud           from "@/components/BottomHud";
import HudAnnotations      from "@/components/HudAnnotations";
import TopProgressBar      from "@/components/TopProgressBar";
import TechnicalSpecsDrawer from "@/components/TechnicalSpecsDrawer";
import CustomCursor        from "@/components/CustomCursor";
import { ArrowRight } from "lucide-react";

const BolideCanvas = dynamic(() => import("@/components/BolideCanvas"), { ssr: false });

export default function Home() {
  const [telemetry, setTelemetry] = useState<FrameTelemetry>({
    frameIndex: 0,
    scrollPct:  0,
    fps:        60,
    loaded:     0,
    total:      276,
  });
  const [specsOpen, setSpecsOpen] = useState(false);

  // Throttled telemetry receiver from BolideCanvas (steady 10Hz, zero jank)
  const handleTelemetry = useCallback((t: FrameTelemetry) => {
    setTelemetry(t);
  }, []);

  const scrollProgress = (telemetry.scrollPct || 0) / 100;

  // Jump to specific scroll progress
  const jumpToProgress = (targetProgress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: targetProgress * maxScroll,
      behavior: "smooth",
    });
  };

  // Proven smooth opacity & translateY calculation (exact Lamborghini architecture)
  const getSectionStyle = (
    enterStart: number,
    enterEnd: number,
    exitStart: number,
    exitEnd: number
  ) => {
    let opacity = 0;
    let translateY = 18;

    if (scrollProgress >= enterStart && scrollProgress <= exitEnd) {
      if (scrollProgress < enterEnd) {
        const ratio = (scrollProgress - enterStart) / (enterEnd - enterStart);
        opacity = ratio;
        translateY = 18 * (1 - ratio);
      } else if (scrollProgress > exitStart) {
        const ratio = (exitEnd - scrollProgress) / (exitEnd - exitStart);
        opacity = ratio;
        translateY = -18 * (1 - ratio);
      } else {
        opacity = 1;
        translateY = 0;
      }
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translate3d(0, ${translateY.toFixed(1)}px, 0)`,
      pointerEvents: (opacity > 0.3 ? "auto" : "none") as "auto" | "none",
      visibility: (opacity > 0 ? "visible" : "hidden") as "visible" | "hidden",
      transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
    };
  };

  return (
    <main className="relative min-h-[580vh] bg-[#04060A] text-white selection:bg-cyan-500 selection:text-black">
      <CustomCursor />

      {/* Atmospheric overlays */}
      <div className="grain-overlay" />
      <div className="vignette" />
      <div className="ambient-glow" />

      {/* 1. Hardware Accelerated 60FPS WebP Exploded View Scroll Canvas */}
      <BolideCanvas
        onTelemetry={handleTelemetry}
        enable3DRotation={true}
      />

      {/* 2. Top Progress Bar */}
      <TopProgressBar scrollPct={telemetry.scrollPct} />

      {/* 3. Luxury Top Brand Navigation Bar */}
      <Navigation
        onSpecsOpen={() => setSpecsOpen(true)}
        scrollPct={telemetry.scrollPct}
      />

      {/* 4. Precision Vertical Scrubber Rail (Right) */}
      <VerticalRail scrollPct={telemetry.scrollPct} />

      {/* 5. Interactive HUD Leader Annotations */}
      <HudAnnotations scrollPct={telemetry.scrollPct} />

      {/* 6. Telemetry Bottom HUD & Frame Status */}
      <BottomHud
        fps={telemetry.fps}
        frameIndex={telemetry.frameIndex}
        loaded={telemetry.loaded}
        total={telemetry.total}
        scrollPct={telemetry.scrollPct}
      />

      {/* 7. Technical Engineering Datasheet Drawer */}
      <TechnicalSpecsDrawer
        open={specsOpen}
        onClose={() => setSpecsOpen(false)}
      />

      {/* ======================================================== */}
      {/* SECTION OVERLAYS (Scroll Driven Fixed HUD Presentation) */}
      {/* Hidden on mobile to keep Bugatti 100% visible & clean   */}
      {/* ======================================================== */}

      {/* SECTION 00: HERO TITLE */}
      <section
        style={getSectionStyle(0.0, 0.04, 0.12, 0.18)}
        className="fixed inset-0 z-20 hidden md:flex items-center justify-start px-6 md:px-16 pointer-events-none"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-4">
            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm shadow-[0_0_10px_#00E5FF] animate-pulse" />
            <span className="font-bold">BUGATTI AUTOMOBILES S.A.S. // BOLIDE EB.01</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.7)] font-sans">
            ENGINEERED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-400 drop-shadow-[0_0_25px_rgba(0,212,255,0.8)]">
              BEYOND LIMITS.
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-white/80 max-w-lg font-mono leading-relaxed tracking-wide" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
            Scroll to deconstruct the 1,600 HP Bugatti Bolide track monster.
            Inspect every autoclave-cured carbon panel, quad-turbo W16 assembly,
            and titanium monocoque layer by layer in real time.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => jumpToProgress(0.28)}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2.5 transition-all shadow-[0_0_20px_rgba(0,194,255,0.4)] hover:shadow-[0_0_30px_rgba(0,194,255,0.7)] rounded-md"
            >
              <span>DECONSTRUCT PANELS</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setSpecsOpen(true)}
              className="px-6 py-3.5 border border-cyan-400/40 hover:border-cyan-300 bg-[#060D1E]/80 backdrop-blur-md text-cyan-200 hover:text-white font-mono text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(0,194,255,0.15)] rounded-md"
            >
              INSPECT TELEMETRY
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 01: AERODYNAMICS */}
      <section
        style={getSectionStyle(0.20, 0.26, 0.38, 0.44)}
        className="fixed inset-0 z-20 hidden md:flex items-center justify-end px-6 md:px-16 pointer-events-none"
      >
        <div className="max-w-md bg-[#060D1E]/85 backdrop-blur-xl p-6 sm:p-8 border border-cyan-400/40 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(0,194,255,0.15)]">
          <div className="text-xs font-mono tracking-widest text-cyan-300 flex items-center gap-2 mb-3">
            <span className="font-bold">01 //</span>
            <span>AERODYNAMIC DECOUPLING</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
            CARBON FIBRE SKIN
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            Every body panel is full autoclave-cured aerospace carbon fibre composite.
            Sculpted across 2,500 hours of CFD supercomputer simulation to generate
            3,000 kg of downforce at 320 km/h with active morphing surface skin.
          </p>
          <div className="mt-6 pt-4 border-t border-cyan-400/20 flex items-baseline justify-between font-mono">
            <span className="text-[10px] text-cyan-200/60 uppercase">Downforce @ 320 km/h</span>
            <span className="text-sm font-black text-cyan-300">3,000 KG</span>
          </div>
        </div>
      </section>

      {/* SECTION 02: W16 ENGINE */}
      <section
        style={getSectionStyle(0.46, 0.52, 0.64, 0.70)}
        className="fixed inset-0 z-20 hidden md:flex items-center justify-start px-6 md:px-16 pointer-events-none"
      >
        <div className="max-w-md bg-[#060D1E]/85 backdrop-blur-xl p-6 sm:p-8 border border-cyan-400/40 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(0,194,255,0.15)]">
          <div className="text-xs font-mono tracking-widest text-cyan-300 flex items-center gap-2 mb-3">
            <span className="font-bold">02 //</span>
            <span>POWERTRAIN BENCHMARK</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
            THE 8.0L W16 HEART
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            Sixteen cylinders in a W configuration. Four bespoke turbochargers with
            optimized titanium turbine wheels. 1,600 horsepower and 1,600 Nm of torque
            from 2,000 rpm, delivering 0–100 km/h in 2.17 seconds.
          </p>
          <div className="mt-6 pt-4 border-t border-cyan-400/20 flex items-baseline justify-between font-mono">
            <span className="text-[10px] text-cyan-200/60 uppercase">Peak Power Output</span>
            <span className="text-sm font-black text-cyan-300">1,600 HP // 1,600 NM</span>
          </div>
        </div>
      </section>

      {/* SECTION 03: CHASSIS & BRAKES */}
      <section
        style={getSectionStyle(0.72, 0.78, 0.88, 0.94)}
        className="fixed inset-0 z-20 hidden md:flex items-center justify-end px-6 md:px-16 pointer-events-none"
      >
        <div className="max-w-md bg-[#060D1E]/85 backdrop-blur-xl p-6 sm:p-8 border border-cyan-400/40 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(0,194,255,0.15)]">
          <div className="text-xs font-mono tracking-widest text-cyan-300 flex items-center gap-2 mb-3">
            <span className="font-bold">03 //</span>
            <span>STRUCTURAL ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
            SKELETON OF A WEAPON
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-white/80 leading-relaxed font-light">
            FIA LMH homologated carbon monocoque safety cell with integrated roll cage.
            420mm CSiC racing carbon-ceramic rotors bring the 1,240 kg machine from
            100 km/h to zero in 31.4 metres with F1-level deceleration.
          </p>
          <div className="mt-6 pt-4 border-t border-cyan-400/20 flex items-baseline justify-between font-mono">
            <span className="text-[10px] text-cyan-200/60 uppercase">Dry Curb Weight</span>
            <span className="text-sm font-black text-cyan-300">1,240 KG // 0.91 KG/HP</span>
          </div>
        </div>
      </section>
    </main>
  );
}
