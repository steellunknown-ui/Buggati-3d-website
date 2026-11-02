"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const SPECS = [
  { label: "Configuration",   value: "8.0L Quad-Turbocharged W16" },
  { label: "Power Output",    value: "1,600 HP (1,578 bhp)" },
  { label: "Torque",          value: "1,600 Nm @ 7,000 rpm" },
  { label: "Transmission",    value: "7-speed DSG Dual-Clutch" },
  { label: "Top Speed",       value: "500 km/h (311 mph)" },
  { label: "0 → 100 km/h",   value: "2.17 seconds" },
  { label: "0 → 200 km/h",   value: "4.36 seconds" },
  { label: "100 → 0 km/h",   value: "31.4 metres" },
  { label: "Dry Weight",      value: "1,240 kg (2,734 lb)" },
  { label: "Power-to-Weight", value: "1.29 HP/kg" },
  { label: "Body",            value: "Full Carbon Fibre Composite" },
  { label: "Chassis",         value: "CFRP Monocoque Tub" },
  { label: "Brakes",          value: "CSiC — 420 mm front rotors" },
  { label: "Downforce",       value: "3.5 G lateral // Active Aero" },
  { label: "Fuel Tank",       value: "90 litres race-spec" },
  { label: "Wheelbase",       value: "2,750 mm" },
  { label: "Production",      value: "40 units — Track Use Only" },
  { label: "Base Price",      value: "> €4,000,000" },
];

interface Props {
  open:    boolean;
  onClose: () => void;
}

export default function TechnicalSpecsDrawer({ open, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(7,7,10,0.75)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transition: "opacity 0.4s ease",
          backdropFilter: open ? "blur(8px)" : "none",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          right: 0, top: 0, bottom: 0,
          width: "min(480px, 95vw)",
          zIndex: 201,
          background: "var(--surface)",
          borderLeft: "1px solid var(--line)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "32px 32px 24px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="label-caps" style={{ color: "var(--accent)", marginBottom: 8 }}>
              Technical Specification
            </p>
            <h2
              style={{
                fontWeight: 800,
                fontSize: "1.6rem",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                lineHeight: 1,
                color: "var(--ink)",
              }}
            >
              Bugatti<br />Bolide EB.01
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--line)",
              padding: "8px",
              cursor: "pointer",
              color: "var(--dim)",
              borderRadius: 4,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Specs table */}
        <div style={{ padding: "24px 32px", flex: 1 }}>
          {SPECS.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                padding: "12px 0",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--dim)",
                  flexShrink: 0,
                }}
              >
                {s.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.04em",
                  color: "var(--ink)",
                  textAlign: "right",
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 32px",
            borderTop: "1px solid var(--line)",
          }}
        >
          <p className="label-caps" style={{ color: "var(--dim)", fontSize: "0.48rem" }}>
            Specifications from Bugatti Automobiles S.A.S. — 2020 Reveal
          </p>
        </div>
      </div>
    </>
  );
}
