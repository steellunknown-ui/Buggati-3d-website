"use client";
import { useState } from "react";

interface Props {
  onSpecsOpen: () => void;
  scrollPct:   number;
}

export default function Navigation({ onSpecsOpen, scrollPct }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 64,
        borderBottom: "1px solid transparent",
        background: scrollPct > 2 ? "rgba(7,7,10,0.65)" : "transparent",
        backdropFilter: scrollPct > 2 ? "blur(24px)" : "none",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease",
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 28, height: 28,
            border: "1.5px solid var(--accent)",
            borderRadius: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.55rem",
              color: "var(--accent)",
              letterSpacing: "0.05em",
            }}
          >
            EB
          </span>
        </div>
        <div className="flex flex-col gap-0">
          <span
            style={{
              fontWeight: 900,
              fontSize: "0.85rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink)",
              lineHeight: 1.1,
            }}
          >
            Bugatti
          </span>
          <span className="label-caps" style={{ fontSize: "0.42rem", letterSpacing: "0.24em" }}>
            Bolide EB.01
          </span>
        </div>
      </div>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {["The Machine", "Powertrain", "Aero", "Specifications"].map((l, i) => (
          <button
            key={l}
            onClick={l === "Specifications" ? onSpecsOpen : undefined}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--dim)",
              transition: "color 0.2s",
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
          >
            {l}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={onSpecsOpen}
          style={{
            background: "none",
            border: "1px solid var(--line)",
            padding: "7px 16px",
            cursor: "pointer",
            fontFamily: "var(--font-ibm-plex-mono)",
            fontSize: "0.55rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--dim)",
            borderRadius: 3,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--line)";
            e.currentTarget.style.color = "var(--dim)";
          }}
        >
          Full Specs
        </button>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 22, height: 1, background: "var(--dim)" }} />
        ))}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 64,
            left: 0,
            right: 0,
            background: "var(--surface)",
            borderBottom: "1px solid var(--line)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {["The Machine", "Powertrain", "Aero", "Specifications"].map((l) => (
            <button
              key={l}
              onClick={() => { if (l === "Specifications") onSpecsOpen(); setMenuOpen(false); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-ibm-plex-mono)",
                fontSize: "0.65rem", letterSpacing: "0.16em",
                textTransform: "uppercase", color: "var(--dim)",
                textAlign: "left", padding: 0,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
