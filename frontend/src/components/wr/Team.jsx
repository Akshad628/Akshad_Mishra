import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TEAM = [
  { name: "Aarav Menon", role: "Founder · Creative Director", desc: "Spatial storyteller stitching XR narratives across art and engineering." },
  { name: "Ishaan Rao", role: "Lead VR Engineer", desc: "Unity & Unreal craftsman with a love for hand-tracked interactions." },
  { name: "Priya Nair", role: "Immersive UX Designer", desc: "Maps human attention into spatial layouts and tactile micro-flows." },
  { name: "Kabir Sethi", role: "3D Artist", desc: "Modeling environments with photo-real detail and game-engine economy." },
  { name: "Meera Iyer", role: "Spatial Audio Designer", desc: "Bends sound through virtual rooms — diegetic, binaural, alive." },
  { name: "Rohan Das", role: "HCI Researcher", desc: "Writes the studies behind every interaction we ship." },
  { name: "Sara Khan", role: "Motion Designer", desc: "Choreographer of micro-animations, transitions and scroll arcs." },
  { name: "Devansh Patel", role: "Tools & Pipelines", desc: "Builds the bridges between Blender, Unity, and the studio's archive." },
  { name: "Aditi Sharma", role: "Producer", desc: "Keeps timelines, scopes and people aligned across continents." },
  { name: "Vikram Joshi", role: "Tech Consultant", desc: "Picks the right rig, the right runtime, the right deployment." },
  { name: "Nisha George", role: "Strategy & Partnerships", desc: "Connects the studio to museums, agencies and aerospace dreams." },
];

function MemberCard({ m, i, total, progress }) {
  const t0 = i / total;
  const t1 = (i + 1) / total;
  const x = useTransform(progress, [t0, t1], [220, -60]);
  const y = useTransform(progress, [t0, t1], [120, 0]);
  const rot = useTransform(progress, [t0, t1], [8, 0]);
  const op = useTransform(progress, [t0 - 0.05, t0 + 0.05, t1 - 0.05, t1 + 0.1], [0, 1, 1, 0.6]);
  const scale = useTransform(progress, [t0, t1], [0.92, 1]);

  const initials = m.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <motion.article
      data-testid={`team-card-${i}`}
      style={{ x, y, rotate: rot, opacity: op, scale }}
      className="wr-glass rounded-3xl p-6 w-[88%] max-w-[560px] ml-auto"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-neutral-900 font-display text-xl"
          style={{
            background:
              "linear-gradient(180deg, #fafafa 0%, #d8d8d8 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.1), 0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl sm:text-2xl text-neutral-900 leading-tight">
            {m.name}
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-500 mt-1">
            {m.role}
          </p>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{m.desc}</p>
        </div>
        <span className="font-mono text-[10px] text-neutral-400">
          0{i + 1 < 10 ? `0${i + 1}` : i + 1}
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
      className="relative py-32 sm:py-44"
    >
      <div className="mx-auto w-[min(1240px,94%)] grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7 md:col-start-6 text-right md:text-right">
          <p className="overline mb-4">the studio · 11 makers</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter">
            Eleven puzzle pieces
          </h2>
        </div>
        <p className="md:col-span-5 md:col-start-8 text-neutral-600 text-base sm:text-lg md:text-right ml-auto">
          A studio is its people. Designers, engineers, artists, researchers —
          each one a piece of the larger picture.
        </p>
      </div>

      <div className="relative mt-24">
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

        <div className="mx-auto w-[min(1240px,94%)] flex flex-col gap-16 md:gap-24 md:pr-[18%]">
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
