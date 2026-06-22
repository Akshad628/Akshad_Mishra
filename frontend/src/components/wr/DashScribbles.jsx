// =============================================================================
// Wandel Reality — Decor / DashScribbles
// Small, low-opacity dashed strokes scattered in the deepest background layer.
// They never overlap real content because they sit at z-0 inside their parent
// while cards/forms render above. Parent must be `relative` and content `z-10`.
// =============================================================================

import { useMemo } from "react";

function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function DashScribbles({ seed = 1, density = 22 }) {
  const items = useMemo(() => {
    const r = rand(seed * 1009 + 7);
    return Array.from({ length: density }, () => {
      const x = r() * 100;
      const y = r() * 100;
      const len = 30 + r() * 110; // px
      const rot = r() * 360;
      const dash = `${(2 + r() * 4).toFixed(1)} ${(4 + r() * 6).toFixed(1)}`;
      const delay = r() * 6;
      const dur = 6 + r() * 8;
      const op = 0.12 + r() * 0.18;
      const sw = 0.6 + r() * 0.6;
      return { x, y, len, rot, dash, delay, dur, op, sw };
    });
  }, [seed, density]);

  return (
    <div
      aria-hidden="true"
      data-testid={`dash-scribbles-${seed}`}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {items.map((it, i) => (
        <svg
          key={i}
          width={it.len}
          height="4"
          viewBox={`0 0 ${it.len} 4`}
          className="absolute"
          style={{
            top: `${it.y}%`,
            left: `${it.x}%`,
            transform: `translate(-50%, -50%) rotate(${it.rot}deg)`,
            opacity: it.op,
          }}
        >
          <line
            x1="0"
            y1="2"
            x2={it.len}
            y2="2"
            stroke="#0a0a0a"
            strokeWidth={it.sw}
            strokeDasharray={it.dash}
            strokeLinecap="round"
            style={{
              animation: `wr-dash-march ${it.dur}s linear ${-it.delay}s infinite`,
            }}
          />
        </svg>
      ))}
    </div>
  );
}
