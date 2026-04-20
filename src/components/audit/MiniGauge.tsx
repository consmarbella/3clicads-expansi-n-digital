import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface MiniGaugeProps {
  label: string;
  target: number;
  color?: "red" | "amber" | "green";
  size?: number;
}

const colorMap = {
  red: "hsl(var(--destructive))",
  amber: "hsl(33 85% 55%)",
  green: "hsl(var(--primary))",
};

const MiniGauge = ({ label, target, color = "red", size = 90 }: MiniGaugeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [score, setScore] = useState(0);

  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const c = colorMap[color];

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const duration = 1200;
    const animate = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setScore(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={c}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{
              transition: "stroke-dashoffset 60ms linear",
              filter: `drop-shadow(0 0 8px ${c})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-xl font-bold tabular-nums"
            style={{ color: c, fontFamily: "var(--font-heading)" }}
          >
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground text-center">
        {label}
      </span>
    </div>
  );
};

export default MiniGauge;
