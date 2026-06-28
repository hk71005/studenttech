"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  className?: string;
  label?: string;
}

function scoreColor(score: number): string {
  if (score >= 85) return "#22c55e"; // green
  if (score >= 70) return "#6366f1"; // indigo (primary)
  if (score >= 55) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

export function ScoreRing({ score, size = 48, label, className }: ScoreRingProps) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className={cn("flex flex-col items-center gap-0.5 shrink-0", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`Student score: ${score}/100`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={size <= 44 ? 4 : 3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={size <= 44 ? 4 : 3}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="relative" style={{ marginTop: `-${size * 0.75}px` }}>
        <div
          className="flex items-center justify-center font-bold"
          style={{
            width: size,
            height: size * 0.75,
            fontSize: size <= 44 ? "11px" : "13px",
            color,
          }}
        >
          {score}
        </div>
      </div>
      {label && (
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}

interface ScoreBreakdownProps {
  scores: {
    performance: number;
    battery: number;
    value: number;
    portability: number;
    display?: number;
  };
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const entries = [
    { label: "Performance", value: scores.performance },
    { label: "Battery", value: scores.battery },
    { label: "Value", value: scores.value },
    { label: "Portability", value: scores.portability },
    ...(scores.display ? [{ label: "Display", value: scores.display }] : []),
  ];

  return (
    <div className="space-y-3">
      {entries.map(({ label, value }) => (
        <div key={label}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium" style={{ color: scoreColor(value) }}>
              {value}
            </span>
          </div>
          <div className="score-bar">
            <div
              className="score-bar-fill"
              style={{
                width: `${value}%`,
                backgroundColor: scoreColor(value),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
