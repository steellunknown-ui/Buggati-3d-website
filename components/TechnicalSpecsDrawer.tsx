"use client";
import { useEffect } from "react";
import { X, ShieldCheck, Zap, Gauge, Wind, Award } from "lucide-react";

const SPECS = [
  { group: "POWERTRAIN & ENGINE", icon: Zap, items: [
    { label: "Engine Architecture",   value: "8.0L Quad-Turbocharged W16 (7993 cc)" },
    { label: "Maximum Power Output",  value: "1,600 HP (1,176 kW) @ 7,000 RPM" },
    { label: "Peak Torque",           value: "1,600 Nm (1,180 lb-ft) @ 2,000–7,025 RPM" },
    { label: "Transmission",          value: "7-Speed Dual-Clutch DSG All-Wheel Drive" },
    { label: "Power-to-Weight Ratio", value: "0.91 kg per HP (World Record)" },
  ]},
  { group: "ACCELERATION & BRAKING", icon: Gauge, items: [
    { label: "0 – 100 km/h (0–62 mph)",   value: "2.17 seconds" },
    { label: "0 – 200 km/h (0–124 mph)",  value: "4.36 seconds" },
    { label: "0 – 300 km/h (0–186 mph)",  value: "7.37 seconds" },
    { label: "0 – 400 km/h (0–249 mph)",  value: "12.08 seconds" },
    { label: "0 – 500 km/h (0–311 mph)",  value: "20.16 seconds (Simulated)" },
    { label: "Top Speed (V-Max)",         value: "> 500 km/h (311+ mph)" },
    { label: "Braking 100 – 0 km/h",      value: "31.4 metres" },
  ]},
  { group: "AERODYNAMICS & CHASSIS", icon: Wind, items: [
    { label: "Downforce at 320 km/h",     value: "3,000 kg (Rear 1,800kg // Front 1,200kg)" },
    { label: "Lateral Acceleration",      value: "Up to 3.5 G" },
    { label: "Dry Curb Weight",           value: "1,240 kg (2,733 lbs)" },
    { label: "Chassis Construction",      value: "Aerospace CFRP Monocoque Tub (FIA LMH)" },
    { label: "Brake Discs",               value: "Carbon-Silicon Carbide (CSiC) 420mm" },
  ]},
  { group: "PRODUCTION & EXCLUSIVITY", icon: Award, items: [
    { label: "Production Volume",         value: "Strictly 40 Units Worldwide" },
    { label: "Intended Usage",            value: "Extreme Track Only // Non-Street Legal" },
    { label: "Base Price",                value: "€4,000,000 EUR ($4,400,000 USD)" },
    { label: "Heritage Code",             value: "EB.01 Bolide Prototype — Molsheim, France" },
  ]},
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
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(4, 8, 18, 0.75)",
          backdropFilter: "blur(12px)",
        }}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-xl bg-[#060D1E]/95 border-l border-cyan-400/30 shadow-[-10px_0_40px_rgba(0,194,255,0.2)] backdrop-blur-2xl transition-transform duration-500 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-cyan-400/20 flex items-center justify-between bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-transparent">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00E5FF]" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-300 font-bold">
                MOLSHEIM MOTORSPORT DIVISION
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
              BUGATTI BOLIDE EB.01
            </h2>
            <span className="text-xs text-cyan-200/70 font-sans font-light">
              Official Technical Dossier & Engineering Telemetry
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-300 hover:text-white transition-all shadow-[0_0_15px_rgba(0,194,255,0.2)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 divide-y divide-white/10">
          {SPECS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.group} className="pt-6 first:pt-0">
                <div className="flex items-center gap-2 mb-4">
                  <Icon size={14} className="text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                    {group.group}
                  </h3>
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-4 py-1.5 px-3 rounded-lg hover:bg-cyan-950/30 transition-colors border border-transparent hover:border-cyan-400/20"
                    >
                      <span className="text-[11px] uppercase tracking-wider text-white/60">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-white text-right drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cyan-400/20 bg-blue-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300">
            <ShieldCheck size={16} />
            <span className="text-[10px] tracking-wider font-semibold">
              OFFICIAL BUGATTI HOMOLOGATION DATA
            </span>
          </div>
          <span className="text-[10px] text-white/50 font-mono">
            40 UNITS WORLDWIDE
          </span>
        </div>
      </div>
    </>
  );
}
