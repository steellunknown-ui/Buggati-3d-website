"use client";
interface Props {
  scrollPct: number;
}

export default function TopProgressBar({ scrollPct }: Props) {
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${scrollPct.toFixed(2)}%` }}
      />
    </div>
  );
}
