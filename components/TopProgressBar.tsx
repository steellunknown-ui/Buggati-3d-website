"use client";

interface Props {
  scrollPct: number;
}

export default function TopProgressBar({ scrollPct }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-black/40 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-white shadow-[0_0_15px_#00E5FF,0_0_25px_rgba(0,212,255,0.8)] transition-all duration-75"
        style={{ width: `${Math.min(100, Math.max(0, scrollPct))}%` }}
      />
    </div>
  );
}
