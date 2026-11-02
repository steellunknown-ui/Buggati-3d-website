"use client";

interface Props {
  fps:        number;
  frameIndex: number;
  loaded:     number;
  total:      number;
  scrollPct:  number;
}

export default function BottomHud({ fps, frameIndex, loaded, total, scrollPct }: Props) {
  const loadPct = total > 0 ? Math.round((loaded / total) * 100) : 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-between px-6 pb-5 pointer-events-none"
      style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
    >
      {/* Left */}
      <div className="flex flex-col gap-1">
        <span className="label-caps">System</span>
        <div className="flex gap-4">
          <HudCell label="FPS"    value={String(fps).padStart(3, " ")} />
          <HudCell label="FRAME"  value={`${String(frameIndex + 1).padStart(3, "0")} / ${total}`} />
          <HudCell label="ASSETS" value={`${loadPct}%`} color={loadPct < 100 ? "var(--accent)" : "var(--dim)"} />
        </div>
      </div>

      {/* Centre mark */}
      <div className="flex flex-col items-center gap-1 hidden md:flex">
        <span className="label-caps">Bolide EB.01</span>
        <span className="hud-value text-accent" style={{ fontSize: "0.65rem" }}>
          {scrollPct.toFixed(1)}% —
        </span>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1">
        <span className="label-caps">Render</span>
        <div className="flex gap-4">
          <HudCell label="W16"    value="8.0L" />
          <HudCell label="POWER"  value="1600HP" />
          <HudCell label="VMax"   value="500 km/h" />
        </div>
      </div>
    </div>
  );
}

function HudCell({ label, value, color = "var(--ink)" }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="label-caps" style={{ fontSize: "0.5rem" }}>{label}</span>
      <span className="hud-value" style={{ color, fontSize: "0.68rem" }}>{value}</span>
    </div>
  );
}
