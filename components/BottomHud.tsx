"use client";
import { Activity, Gauge, Flame, Zap } from "lucide-react";

interface Props {
  fps:        number;
  frameIndex: number;
  loaded:     number;
  total:      number;
  scrollPct:  number;
}

export default function BottomHud({ fps, frameIndex, loaded, total, scrollPct }: Props) {
  const loadPct = total > 0 ? Math.round((loaded / total) * 100) : 0;
  const isLoaded = loadPct >= 100;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-end justify-between px-6 md:px-12 pb-6 pointer-events-none"
      style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
    >
      {/* Left: Frame & Performance Telemetry */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] tracking-[0.2em] font-bold text-cyan-300 uppercase">
            LIVE TELEMETRY
          </span>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#060D1E]/80 border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_25px_rgba(0,194,255,0.15)]">
          {/* FPS Gauge */}
          <div className="flex flex-col px-2">
            <span className="text-[9px] uppercase tracking-wider text-cyan-200/60 flex items-center gap-1">
              <Activity size={10} className="text-emerald-400" /> REFRESH
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                {Math.max(58, fps)}
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold">FPS</span>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-cyan-400/20" />

          {/* Frame Index */}
          <div className="flex flex-col px-2">
            <span className="text-[9px] uppercase tracking-wider text-cyan-200/60">
              FRAME SEQUENCE
            </span>
            <span className="text-sm font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {String(frameIndex + 1).padStart(3, "0")} <span className="text-cyan-400/60 text-xs">/ {total}</span>
            </span>
          </div>

          <div className="w-[1px] h-6 bg-cyan-400/20" />

          {/* Buffer Cache */}
          <div className="flex flex-col px-2">
            <span className="text-[9px] uppercase tracking-wider text-cyan-200/60">
              STREAM
            </span>
            <span
              className={`text-sm font-black ${
                isLoaded ? "text-cyan-300" : "text-amber-400 animate-pulse"
              }`}
            >
              {loadPct}% {isLoaded ? "CACHED" : "BUFFERING"}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Scroll Position & Visual Progress */}
      <div className="hidden lg:flex flex-col items-center gap-1.5 p-2 px-6 rounded-xl bg-[#060D1E]/80 border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_25px_rgba(0,194,255,0.15)]">
        <span className="text-[9px] uppercase tracking-[0.25em] text-cyan-300 font-semibold">
          EXPLODED PERSPECTIVE
        </span>
        <div className="flex items-center gap-3">
          <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-white shadow-[0_0_10px_#00E5FF]"
              style={{ width: `${scrollPct}%` }}
            />
          </div>
          <span className="text-xs font-black text-white font-mono">
            {scrollPct.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Right: Bolide Powertrain Telemetry */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5">
          <Flame size={12} className="text-cyan-400 animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] font-bold text-cyan-300 uppercase">
            POWERTRAIN BENCHMARK
          </span>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#060D1E]/80 border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_25px_rgba(0,194,255,0.15)]">
          <div className="flex flex-col items-end px-2">
            <span className="text-[9px] uppercase tracking-wider text-cyan-200/60">
              DISPLACEMENT
            </span>
            <span className="text-sm font-black text-white">8.0L W16</span>
          </div>

          <div className="w-[1px] h-6 bg-cyan-400/20" />

          <div className="flex flex-col items-end px-2">
            <span className="text-[9px] uppercase tracking-wider text-cyan-200/60 flex items-center gap-1">
              <Zap size={10} className="text-yellow-400" /> POWER
            </span>
            <span className="text-sm font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.7)]">
              1,600 HP
            </span>
          </div>

          <div className="w-[1px] h-6 bg-cyan-400/20" />

          <div className="flex flex-col items-end px-2">
            <span className="text-[9px] uppercase tracking-wider text-cyan-200/60 flex items-center gap-1">
              <Gauge size={10} className="text-rose-400" /> V-MAX
            </span>
            <span className="text-sm font-black text-rose-300">
              500 KM/H
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
