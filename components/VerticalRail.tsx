"use client";

const STAGES = [
  { pct: 0,   label: "ASSEMBLED",  sub: "Complete Aerodynamic Shell" },
  { pct: 25,  label: "CLOSURES",   sub: "Carbon Skin Decoupling" },
  { pct: 52,  label: "POWERTRAIN", sub: "8.0L Quad-Turbo W16 Core" },
  { pct: 78,  label: "SKELETON",   sub: "Aerospace CFRP Monocoque" },
];

interface Props { scrollPct: number }

export default function VerticalRail({ scrollPct }: Props) {
  const activeIdx = STAGES.reduce((acc, s, i) => (scrollPct >= s.pct ? i : acc), 0);

  return (
    <div
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-1 pointer-events-none"
      style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
    >
      {STAGES.map((s, i) => {
        const isActive = i === activeIdx;
        const isPassed = i < activeIdx;

        return (
          <div key={s.label} className="flex items-center gap-4 py-2">
            {/* Label and Subtext */}
            <div
              className={`flex flex-col items-end transition-all duration-500 ${
                isActive
                  ? "opacity-100 translate-x-0"
                  : isPassed
                  ? "opacity-60 translate-x-1"
                  : "opacity-30 translate-x-2"
              }`}
            >
              {isActive && (
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">
                  {s.sub}
                </span>
              )}
              <span
                className={`text-[11px] font-black tracking-[0.2em] uppercase transition-colors ${
                  isActive
                    ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : isPassed
                    ? "text-cyan-200/80"
                    : "text-white/40"
                }`}
              >
                {s.label}
              </span>
            </div>

            {/* Glowing Interactive Node & Connecting Line */}
            <div className="flex flex-col items-center">
              <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
                  isActive
                    ? "w-4 h-4 bg-cyan-400 shadow-[0_0_20px_#00E5FF,0_0_40px_rgba(0,212,255,0.8)]"
                    : isPassed
                    ? "w-2.5 h-2.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                    : "w-2 h-2 bg-white/20"
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                )}
              </div>

              {i < STAGES.length - 1 && (
                <div
                  className={`w-[1.5px] h-10 transition-colors duration-500 ${
                    isPassed
                      ? "bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_6px_#00E5FF]"
                      : "bg-white/10"
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
