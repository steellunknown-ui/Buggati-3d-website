"use client";

interface Annotation {
  id:     string;
  from:   number;   // scroll % start
  to:     number;   // scroll % end
  x:      string;   // CSS left
  y:      string;   // CSS top
  label:  string;
  value:  string;
  side:   "left" | "right";
  badge:  string;
}

const ANNOTATIONS: Annotation[] = [
  {
    id: "body",
    from: 14, to: 34,
    x: "10%", y: "30%",
    side: "right",
    badge: "AERODYNAMICS",
    label: "FULL CARBON COMPOSITE SKIN",
    value: "1,240 KG DRY WEIGHT // 3,000 KG DOWNFORCE AT 320 KM/H",
  },
  {
    id: "w16",
    from: 42, to: 62,
    x: "60%", y: "45%",
    side: "left",
    badge: "POWERTRAIN",
    label: "8.0L QUAD-TURBO W16",
    value: "1,600 HP @ 7,000 RPM // 1,600 NM FROM 2,000 RPM",
  },
  {
    id: "brakes",
    from: 60, to: 78,
    x: "15%", y: "65%",
    side: "right",
    badge: "DECELERATION",
    label: "CSiC RACING ROTORS 420MM",
    value: "100–0 KM/H IN 31.4 METRES // F1-CALIBER CALLIPERS",
  },
  {
    id: "chassis",
    from: 76, to: 95,
    x: "56%", y: "28%",
    side: "left",
    badge: "MONOCOQUE",
    label: "AEROSPACE CFRP SAFETY CELL",
    value: "FIA LMH HOMOLOGATED // INTEGRATED FIRE SUPPRESSION",
  },
];

interface Props { scrollPct: number }

export default function HudAnnotations({ scrollPct }: Props) {
  return (
    <>
      {ANNOTATIONS.map((a) => {
        const visible = scrollPct >= a.from && scrollPct <= a.to;
        const progress = visible
          ? Math.min(1, Math.max(0, (scrollPct - a.from) / 3)) *
            Math.min(1, Math.max(0, (a.to - scrollPct) / 3))
          : 0;

        return (
          <div
            key={a.id}
            className="fixed z-30 pointer-events-none transition-all duration-300 hidden md:block"
            style={{
              left: a.x,
              top:  a.y,
              opacity: progress,
              transform: `translateY(${progress < 1 ? (1 - progress) * 12 : 0}px)`,
              fontFamily: "var(--font-ibm-plex-mono)",
            }}
          >
            <div className={`flex items-center gap-4 ${a.side === "left" ? "flex-row-reverse" : ""}`}>
              {/* Glowing Indicator Pin */}
              <div className="relative flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400/40 animate-ping absolute" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_15px_#00E5FF]" />
              </div>

              {/* Connecting Laser Line */}
              <div
                className="h-[1.5px] w-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent shadow-[0_0_8px_#00E5FF]"
                style={{ transform: a.side === "left" ? "scaleX(-1)" : "none" }}
              />

              {/* Data Card */}
              <div
                className={`flex flex-col gap-1 p-3 px-4 rounded-xl bg-[#060D1E]/85 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_30px_rgba(0,194,255,0.2)] ${
                  a.side === "left" ? "items-end text-right" : "items-start text-left"
                }`}
              >
                <span className="text-[8px] font-bold uppercase tracking-[0.25em] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {a.badge}
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                  {a.label}
                </span>
                <span className="text-[10px] font-medium tracking-wide text-cyan-200/90">
                  {a.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
