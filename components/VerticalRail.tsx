"use client";
import { useState, useEffect } from "react";

const STAGES = [
  { pct: 0,   label: "ASSEMBLED",  sub: "Complete configuration" },
  { pct: 25,  label: "CLOSURES",   sub: "Exterior panels" },
  { pct: 52,  label: "POWERTRAIN", sub: "W16 quad-turbo" },
  { pct: 78,  label: "SKELETON",   sub: "Monocoque chassis" },
];

interface Props { scrollPct: number }

export default function VerticalRail({ scrollPct }: Props) {
  const activeIdx = STAGES.reduce((acc, s, i) => (scrollPct >= s.pct ? i : acc), 0);

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end gap-0"
      style={{ pointerEvents: "none" }}
    >
      {STAGES.map((s, i) => {
        const isActive = i === activeIdx;
        const isPassed = i < activeIdx;
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-0.5" style={{ opacity: isActive ? 1 : isPassed ? 0.5 : 0.25 }}>
              {isActive && (
                <span className="label-caps text-accent" style={{ fontSize: "0.48rem", letterSpacing: "0.2em" }}>{s.sub}</span>
              )}
              <span
                className="label-caps"
                style={{
                  fontSize: "0.5rem",
                  color: isActive ? "var(--ink)" : "var(--dim)",
                  letterSpacing: "0.18em",
                }}
              >
                {s.label}
              </span>
            </div>

            {/* Track dot */}
            <div className="flex flex-col items-center">
              <div
                style={{
                  width: isActive ? 5 : 3,
                  height: isActive ? 5 : 3,
                  borderRadius: "50%",
                  background: isActive ? "var(--accent)" : isPassed ? "var(--dim)" : "var(--faint)",
                  boxShadow: isActive ? "0 0 8px var(--accent)" : "none",
                  transition: "all 0.4s ease",
                }}
              />
              {i < STAGES.length - 1 && (
                <div
                  style={{
                    width: 1,
                    height: 40,
                    background: isPassed
                      ? "linear-gradient(to bottom, var(--accent), var(--dim))"
                      : "var(--line)",
                    transition: "background 0.4s ease",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
