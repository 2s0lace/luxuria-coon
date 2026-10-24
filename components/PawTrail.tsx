import type { CSSProperties } from "react";
import { CAT_SHAPES } from "@/lib/m3Shapes";

/** Steps across the gap: x in %, left/right foot, colour tone. */
const STEPS = [
  { x: 8, side: 1, tone: 2 },
  { x: 21, side: -1, tone: 1 },
  { x: 34, side: 1, tone: 3 },
  { x: 47, side: -1, tone: 2 },
  { x: 60, side: 1, tone: 4 },
  { x: 73, side: -1, tone: 3 },
  { x: 86, side: 1, tone: 1 },
] as const;

/** Decorative paw prints walking across the gap between the status cards and the launcher. */
export default function PawTrail() {
  return (
    <div className="welcome-paw-trail" aria-hidden>
      {STEPS.map((step, i) => (
        <svg
          key={step.x}
          viewBox="0 0 100 100"
          className={`welcome-paw hero-tone-${step.tone}`}
          style={{
            left: `${step.x}%`,
            top: `${50 + step.side * 16}%`,
            "--paw-rot": `${90 + step.side * 12}deg`,
            "--paw-delay": `${i * 0.35}s`,
          } as CSSProperties}
        >
          <path d={CAT_SHAPES.paw} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
