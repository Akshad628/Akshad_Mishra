import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const PROJECTS = [
  {
    id: "silence",
    title: "Silence That Remains",
    tag: "Open Brush · Meta Quest",
    year: "2024",
    desc: "An immersive jungle painted in Open Brush across Meta Quests, carousel navigation, scored to Agam's Sakshakaram.",
    image:
      "https://images.pexels.com/photos/13346329/pexels-photo-13346329.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
  },
  {
    id: "hci",
    title: "HCI Showcases",
    tag: "Human–Computer Interaction",
    year: "2024",
    desc: "Participated in HCI conferences and exhibitions — spatial interaction prototypes, hand tracking experiments and embodied UI studies.",
    image:
      "https://images.pexels.com/photos/8066783/pexels-photo-8066783.png?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
  },
  {
    id: "isro",
    title: "ISRO · GSLV Launch",
    tag: "VR Prototype · Aerospace",
    year: "2025",
    desc: "Built an immersive VR experience of a GSLV launch — staging, telemetry overlays and cinematic camera choreography for ISRO.",
    image:
      "https://images.pexels.com/photos/33544772/pexels-photo-33544772.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900",
  },
];

function ProjectCard({ p, i, total, progress }) {
  // sweep along a left-curved arc
  const t0 = i / total;
  const t1 = (i + 1) / total;
  const x = useTransform(progress, [t0, t1], [-220, 60]);
  const y = useTransform(progress, [t0, t1], [120, 0]);
  const rot = useTransform(progress, [t0, t1], [-8, 0]);
  const op = useTransform(progress, [t0 - 0.05, t0 + 0.05, t1 - 0.05, t1 + 0.1], [0, 1, 1, 0.6]);
  const scale = useTransform(progress, [t0, t1], [0.92, 1]);

  return (
    <motion.article
      data-testid={`project-${p.id}`}
      style={{ x, y, rotate: rot, opacity: op, scale }}
      className="wr-glass rounded-3xl overflow-hidden p-2 sm:p-3 w-[88%] max-w-[640px]"
    >
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-3 left-3 wr-glass-dark text-white text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full">
          {p.tag}
        </span>
        <span className="absolute bottom-3 right-3 text-white/90 font-mono text-xs">
          {p.year}
        </span>
      </div>
      <div className="px-3 sm:px-4 py-5">
        <h3 className="font-display text-2xl sm:text-3xl text-neutral-900">{p.title}</h3>
        <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">{p.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            atelier · 0{((PROJECTS.findIndex((x) => x.id === p.id)) + 1)}
          </span>
          <a
            href="#reach"
            className="text-xs font-medium underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900"
          >
            Learn more
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function Ateliers() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      id="ateliers"
      ref={ref}
      data-testid="ateliers-section"
      className="relative py-32 sm:py-48"
    >
      {/* Section heading */}
      <div className="mx-auto w-[min(1240px,94%)] grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <p className="overline mb-4">our ateliers · 01</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-neutral-900">
            Projects, pieced together
          </h2>
        </div>
        <p className="md:col-span-5 text-neutral-600 text-base sm:text-lg">
          Each project is a puzzle — research, story and engineering snapped
          into one immersive frame. Scroll the curve to reveal them.
        </p>
      </div>

      {/* Curved sweep rail on the left */}
      <div className="relative mt-24">
        <svg
          className="absolute left-0 top-0 h-full w-[40%] pointer-events-none hidden md:block"
          viewBox="0 0 200 1000"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 0 C 220 250, -120 500, 200 750 L 200 1000 L 0 1000 Z"
            fill="rgba(10,10,10,0.04)"
          />
          <path
            d="M 20 20 C 220 250, -100 500, 200 760"
            stroke="rgba(10,10,10,0.18)"
            strokeWidth="1"
            strokeDasharray="3 6"
            fill="none"
          />
        </svg>

        <div className="mx-auto w-[min(1240px,94%)] flex flex-col gap-32 md:gap-48 md:pl-[18%]">
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              p={p}
              i={i}
              total={PROJECTS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
