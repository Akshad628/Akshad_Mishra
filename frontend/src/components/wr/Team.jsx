// =============================================================================
// Wandel Reality — Team
//
// Each card: black-and-white portrait next to the name.
//   • Hover  → photo scales up, faint multi-colour scribbles draw across it
//   • Click  → real colours reveal (toggle)
// Cards sweep in from the right along the curved rail (vertical bento).
//
// Replace TEAM[i].photo with real headshots when ready.
// =============================================================================

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useMemo } from "react";

const TEAM = [
  { name: "Aarav Menon", role: "Founder · Creative Director", desc: "Spatial storyteller stitching XR narratives across art and engineering.", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Ishaan Rao", role: "Lead VR Engineer", desc: "Unity & Unreal craftsman with a love for hand-tracked interactions.", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Priya Nair", role: "Immersive UX Designer", desc: "Maps human attention into spatial layouts and tactile micro-flows.", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Kabir Sethi", role: "3D Artist", desc: "Modeling environments with photo-real detail and game-engine economy.", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Meera Iyer", role: "Spatial Audio Designer", desc: "Bends sound through virtual rooms — diegetic, binaural, alive.", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Rohan Das", role: "HCI Researcher", desc: "Writes the studies behind every interaction we ship.", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Sara Khan", role: "Motion Designer", desc: "Choreographer of micro-animations, transitions and scroll arcs.", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Devansh Patel", role: "Tools & Pipelines", desc: "Builds the bridges between Blender, Unity, and the studio's archive.", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Aditi Sharma", role: "Producer", desc: "Keeps timelines, scopes and people aligned across continents.", photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Vikram Joshi", role: "Tech Consultant", desc: "Picks the right rig, the right runtime, the right deployment.", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&crop=faces&q=80" },
  { name: "Nisha George", role: "Strategy & Partnerships", desc: "Connects the studio to museums, agencies and aerospace dreams.", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop&crop=faces&q=80" },
];

// Crayon palette
const CRAYON = ["#ef4444", "#3b82f6", "#f59e0b", "#22c55e", "#a855f7", "#ec4899"];

// Tiny deterministic PRNG so each card's scribble shape is stable across renders
function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Build a single short crayon scratch — bezier with jitter
function scratchPath(r) {
  const x0 = r() * 90 + 5;
  const y0 = r() * 90 + 5;
  const len = 15 + r() * 25;
  const ang = r() * Math.PI * 2;
  const x1 = x0 + Math.cos(ang) * len;
  const y1 = y0 + Math.sin(ang) * len;
  const cx = (x0 + x1) / 2 + (r() - 0.5) * 16;
  const cy = (y0 + y1) / 2 + (r() - 0.5) * 16;
  // small extra wiggle to make it look like crayon scribble
  const wx = x1 + (r() - 0.5) * 14;
  const wy = y1 + (r() - 0.5) * 14;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)} T ${wx.toFixed(1)} ${wy.toFixed(1)}`;
}

function buildScribbles(seed, count = 10) {
  const r = rand(seed * 7919 + 13);
  return Array.from({ length: count }, (_, i) => ({
    d: scratchPath(r),
    color: CRAYON[Math.floor(r() * CRAYON.length)],
    width: 0.5 + r() * 0.7, // very light strokes
    delay: i * 70 + r() * 60,
  }));
}

function MemberCard({ m, i, total, progress }) {
  const t0 = i / total;
  const t1 = (i + 1) / total;
  // sweep in from the right along the curve
  const x = useTransform(progress, [t0, t1], [220, -40]);
  const y = useTransform(progress, [t0, t1], [120, 0]);
  const rot = useTransform(progress, [t0, t1], [8, 0]);
  const op = useTransform(progress, [t0 - 0.05, t0 + 0.05, t1 - 0.05, t1 + 0.1], [0, 1, 1, 0.7]);
  const scale = useTransform(progress, [t0, t1], [0.92, 1]);

  const [color, setColor] = useState(false);
  const scribbles = useMemo(() => buildScribbles(i + 1, 14), [i]);

  return (
    <motion.article
      data-testid={`team-card-${i}`}
      style={{ x, y, rotate: rot, opacity: op, scale }}
      className="wr-glass rounded-3xl p-4 sm:p-5 w-full sm:w-[92%] sm:max-w-[560px] sm:ml-auto"
    >
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Photo with hover scale + click reveals true colour */}
        <button
          type="button"
          aria-pressed={color}
          aria-label={`Toggle colour for ${m.name}`}
          onClick={() => setColor((v) => !v)}
          data-testid={`team-photo-${i}`}
          className="group relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.1), 0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={m.photo}
            alt={m.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.12]"
            style={{ filter: color ? "none" : "grayscale(1) contrast(1.05)" }}
          />
          {/* Crayon scribble overlay — light random strokes */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-95 transition-opacity duration-300"
            aria-hidden="true"
          >
            <defs>
              <filter id={`crayon-${i}`}>
                <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed={i + 5} />
                <feDisplacementMap in="SourceGraphic" scale="2.2" />
              </filter>
            </defs>
            {scribbles.map((s, k) => (
              <path
                key={k}
                d={s.d}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
                filter={`url(#crayon-${i})`}
                className="wr-scribble-path"
                style={{ animationDelay: `${s.delay}ms` }}
              />
            ))}
          </svg>
          {/* tiny "click for colour" hint */}
          <span
            className={`absolute bottom-1 right-1 text-[8px] font-mono uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full transition-opacity ${
              color ? "bg-white/90 text-neutral-900" : "bg-black/55 text-white opacity-0 group-hover:opacity-100"
            }`}
          >
            {color ? "color" : "tap"}
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg sm:text-2xl text-neutral-900 leading-tight">
            {m.name}
          </h3>
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-neutral-500 mt-1">
            {m.role}
          </p>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {m.desc}
          </p>
        </div>
        <span className="font-mono text-[10px] text-neutral-400 hidden sm:block">
          {String(i + 1).padStart(2, "0")}
        </span>
      </div>
    </motion.article>
  );
}

export default function Team() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="team"
      ref={ref}
      data-testid="team-section"
      className="relative py-24 sm:py-44"
    >
      <div className="mx-auto w-[min(1240px,94%)] grid md:grid-cols-12 gap-6 md:gap-10 md:items-end">
        <div className="md:col-span-7 md:col-start-6 md:text-right">
          <p className="overline mb-3 sm:mb-4">the studio · 11 makers</p>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl tracking-tighter">
            Eleven puzzle pieces
          </h2>
        </div>
        <p className="md:col-span-5 md:col-start-8 text-neutral-600 text-sm sm:text-lg md:text-right md:ml-auto">
          Designers, engineers, artists, researchers — each one a piece of the
          larger picture. Hover to scribble, tap a face to see it in colour.
        </p>
      </div>

      <div className="relative mt-12 sm:mt-24">
        <svg
          className="absolute right-0 top-0 h-full w-[40%] pointer-events-none hidden md:block"
          viewBox="0 0 200 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M 200 0 C -20 250, 320 500, 0 750 L 0 1000 L 200 1000 Z"
            fill="rgba(10,10,10,0.04)"
          />
          <path
            d="M 180 20 C -20 250, 300 500, 0 760"
            stroke="rgba(10,10,10,0.18)"
            strokeWidth="1"
            strokeDasharray="3 6"
            fill="none"
          />
        </svg>

        <div className="mx-auto w-[min(1240px,94%)] flex flex-col gap-16 sm:gap-24 md:gap-32 md:pr-[18%]">
          {TEAM.map((m, i) => (
            <MemberCard
              key={m.name}
              m={m}
              i={i}
              total={TEAM.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
