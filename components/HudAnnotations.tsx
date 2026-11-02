"use client";

/* ─── Annotation pins that appear at specific scroll ranges ──────── */
interface Annotation {
  id:     string;
  from:   number;   // scroll % start
  to:     number;   // scroll % end
  x:      string;   // CSS left
  y:      string;   // CSS top
  label:  string;
  value:  string;
  side:   "left" | "right";
}

const ANNOTATIONS: Annotation[] = [
  {
    id: "body",  from: 15, to: 35,
    x: "12%", y: "28%", side: "right",
    label: "AERODYNAMIC BODY PANELS",
    value: "Full carbon composite / 1240 kg total",
  },
  {
    id: "w16",   from: 42, to: 62,
    x: "58%", y: "55%", side: "left",
    label: "8.0L QUAD-TURBO W16",
    value: "1,600 HP  //  1,600 Nm @ 7,000 rpm",
  },
  {
    id: "brakes", from: 58, to: 76,
    x: "18%", y: "68%", side: "right",
    label: "CSiC BRAKE ROTORS",
    value: "420 mm  //  100–0 in 31.4 m",
  },
  {
    id: "chassis", from: 74, to: 95,
    x: "55%", y: "30%", side: "left",
    label: "AEROSPACE MONOCOQUE",
    value: "CFRP tub  //  Active aero 3.5 G downforce",
  },
];

interface Props { scrollPct: number }

export default function HudAnnotations({ scrollPct }: Props) {
  return (
    <>
      {ANNOTATIONS.map((a) => {
        const visible = scrollPct >= a.from && scrollPct <= a.to;
        const fadeProgress = visible
          ? Math.min(1, (scrollPct - a.from) / 4)
          : 0;

        return (
          <div
            key={a.id}
            className="fixed z-40 pointer-events-none"
            style={{
              left:    a.x,
              top:     a.y,
              opacity: fadeProgress,
              transition: "opacity 0.5s ease",
            }}
          >
            <div className={`flex items-center gap-3 ${a.side === "left" ? "flex-row-reverse" : ""}`}>
              {/* Line */}
              <div
                style={{
                  width: 48,
                  height: 1,
                  background: "linear-gradient(90deg, var(--accent), transparent)",
                  transform: a.side === "left" ? "scaleX(-1)" : "none",
                }}
              />
              {/* Text block */}
              <div className={`flex flex-col gap-0.5 ${a.side === "left" ? "items-end text-right" : ""}`}>
                <span className="label-caps text-accent" style={{ fontSize: "0.48rem", letterSpacing: "0.2em" }}>
                  {a.label}
                </span>
                <span className="hud-value" style={{ fontSize: "0.62rem", color: "var(--dim)" }}>
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
