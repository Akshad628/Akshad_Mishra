// =============================================================================
// Wandel Reality — Team
// Each card shows a black-and-white photo of the member next to their name.
// On hover, animated crayon scribbles draw across the photo (inspired by the
// reference image the founder shared).
// To swap in real team headshots, replace the `photo` URL in each TEAM entry
// below. Any square portrait will work — the card will grayscale it via CSS.
// =============================================================================

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TEAM = [
  {
    name: "Aarav Menon",
    role: "Founder · Creative Director",
    desc: "Spatial storyteller stitching XR narratives across art and engineering.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Ishaan Rao",
    role: "Lead VR Engineer",
    desc: "Unity & Unreal craftsman with a love for hand-tracked interactions.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Priya Nair",
    role: "Immersive UX Designer",
    desc: "Maps human attention into spatial layouts and tactile micro-flows.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Kabir Sethi",
    role: "3D Artist",
    desc: "Modeling environments with photo-real detail and game-engine economy.",
    photo:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Meera Iyer",
    role: "Spatial Audio Designer",
    desc: "Bends sound through virtual rooms — diegetic, binaural, alive.",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Rohan Das",
    role: "HCI Researcher",
    desc: "Writes the studies behind every interaction we ship.",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Sara Khan",
    role: "Motion Designer",
    desc: "Choreographer of micro-animations, transitions and scroll arcs.",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Devansh Patel",
    role: "Tools & Pipelines",
    desc: "Builds the bridges between Blender, Unity, and the studio's archive.",
    photo:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Aditi Sharma",
    role: "Producer",
    desc: "Keeps timelines, scopes and people aligned across continents.",
    photo:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Vikram Joshi",
    role: "Tech Consultant",
    desc: "Picks the right rig, the right runtime, the right deployment.",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&crop=faces&q=80",
  },
  {
    name: "Nisha George",
    role: "Strategy & Partnerships",
    desc: "Connects the studio to museums, agencies and aerospace dreams.",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop&crop=faces&q=80",
  },
];

// 4 distinct scribble path-strings — hand-drawn-ish bezier loops.
const SCRIBBLES = [
  { d: "M5 35 C 20 5, 40 65, 60 25 S 95 55, 75 80 60 30 30 70 10 40 5 35 Z", color: "#ef4444" },
  { d: "M10 70 C 30 50, 25 10, 55 20 80 30 70 60 90 75 50 90 20 80 10 70 Z", color: "#3b82f6" },
  { d: "M20 15 C 35 30, 65 5, 80 35 95 60 60 50 70 80 40 95 25 60 20 15 Z", color: "#facc15" },
  { d: "M15 50 C 25 25, 50 45, 70 20 90 5 95 45 75 60 55 75 35 90 15 50 Z", color: "#22c55e" },
];

function MemberCard({ m, i, total, progress }) {
  const t0 = i / total;
  const t1 = (i + 1) / total;
  const y = useTransform(progress, [t0, t1], [80, 0]);
  const op = useTransform(progress, [t0 - 0.05, t0 + 0.05], [0.2, 1]);
  const scale = useTransform(progress, [t0, t1], [0.96, 1]);

  return (
    <motion.article
      data-testid={`team-card-${i}`}
      style={{ y, opacity: op, scale }}
      className="group wr-glass rounded-3xl p-4 sm:p-5 w-full sm:w-[92%] sm:max-w-[560px] sm:ml-auto"
    >
      <div className="flex items-start gap-4 sm:gap-5">
        {/* Photo + scribble overlay */}
        <div
          data-testid={`team-photo-${i}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.1), 0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={m.photo}
            alt={m.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            style={{ filter: "grayscale(1) contrast(1.05)" }}
          />
          {/* Crayon scribble overlay */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden="true"
          >
            <defs>
              <filter id={`crayon-${i}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={i + 1} />
                <feDisplacementMap in="SourceGraphic" scale="2" />
              </filter>
            </defs>
            {SCRIBBLES.map((s, k) => {
              const len = 600;
              return (
                <path
                  key={k}
                  d={s.d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#crayon-${i})`}
                  className="wr-scribble-path"
                  style={{
                    strokeDasharray: len,
                    strokeDashoffset: len,
                    animationDelay: `${k * 90}ms`,
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* Text */}
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
          A studio is its people. Designers, engineers, artists, researchers —
          each one a piece of the larger picture. Hover a face to scribble.
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

        <div className="mx-auto w-[min(1240px,94%)] flex flex-col gap-6 sm:gap-12 md:gap-20 md:pr-[18%]">
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
