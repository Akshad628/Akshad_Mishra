import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Tech chips floating at various depths. Depth = how much they respond to cursor.
const CHIPS = [
  { label: "React",     x: 8,  y: 22, depth: 1.4, delay: 0.15 },
  { label: "Python",    x: 82, y: 18, depth: 1.6, delay: 0.20 },
  { label: "Blender",   x: 14, y: 74, depth: 1.2, delay: 0.30 },
  { label: "Unity",     x: 78, y: 78, depth: 1.7, delay: 0.35 },
  { label: "Gemini",    x: 12, y: 46, depth: 0.9, delay: 0.40 },
  { label: "MongoDB",   x: 86, y: 46, depth: 1.1, delay: 0.45 },
  { label: "n8n",       x: 22, y: 12, depth: 1.8, delay: 0.50 },
  { label: "Node",      x: 72, y: 86, depth: 1.3, delay: 0.55 },
  { label: "Groq",      x: 88, y: 66, depth: 0.7, delay: 0.60 },
  { label: "PBR/HDRI",  x: 6,  y: 60, depth: 1.9, delay: 0.65 },
];

// Decorative silhouettes at even deeper layers
const SHAPES = [
  { kind: "diamond",   x: 26, y: 30, size: 60,  depth: 0.5, rot: 12 },
  { kind: "circle",    x: 74, y: 68, size: 90,  depth: 0.4, rot: 0 },
  { kind: "sword",     x: 84, y: 24, size: 140, depth: 0.6, rot: -22 },
  { kind: "cube",      x: 18, y: 82, size: 80,  depth: 0.55, rot: 8 },
];

function Shape({ s, mouse }) {
  const tx = mouse.x * 22 * s.depth;
  const ty = mouse.y * 22 * s.depth;
  const style = { left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, transform: `translate(${tx}px, ${ty}px) rotate(${s.rot}deg)` };
  if (s.kind === "diamond") return <div className="absolute border border-neutral-900/25 rotate-45" style={style} />;
  if (s.kind === "circle")  return <div className="absolute rounded-full border border-neutral-900/20" style={style} />;
  if (s.kind === "cube") return (
    <svg className="absolute" viewBox="0 0 100 100" style={style}>
      <path d="M 20 30 L 50 15 L 80 30 L 80 70 L 50 85 L 20 70 Z M 20 30 L 50 45 L 80 30 M 50 45 L 50 85"
        fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
  if (s.kind === "sword") return (
    <svg className="absolute" viewBox="0 0 100 100" style={style}>
      <path d="M 50 5 L 45 60 L 40 62 L 40 70 L 46 70 L 46 92 L 54 92 L 54 70 L 60 70 L 60 62 L 55 60 Z"
        fill="none" stroke="rgba(10,10,10,0.28)" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="25" y1="62" x2="75" y2="62" stroke="rgba(10,10,10,0.28)" strokeWidth="1.4" />
    </svg>
  );
  return null;
}

function Chip({ c, mouse }) {
  const tx = mouse.x * 32 * c.depth;
  const ty = mouse.y * 32 * c.depth;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 0.95, y: 0, scale: 1 }}
      transition={{ delay: c.delay, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="absolute wr-glass rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wide text-neutral-800 pointer-events-none"
      style={{
        left: `${c.x}%`, top: `${c.y}%`,
        transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px)`,
        transition: "transform 0.25s ease-out",
      }}
    >
      {c.label}
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const heroEl = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = heroEl.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  // spotlight follows cursor
  const spotlight = `radial-gradient(600px circle at ${(mouse.x + 0.5) * 100}% ${(mouse.y + 0.5) * 100}%, rgba(10,10,10,0.08), transparent 60%)`;

  return (
    <section ref={ref} data-testid="hero-section" className="relative min-h-[160vh] w-full">
      <div ref={heroEl} className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Layer 1: grid (deepest, moves slowest) */}
        <motion.div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "80px 80px", y: bgY,
        }} />

        {/* Layer 2: soft radial gradient wash */}
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0) 0%, rgba(230,230,230,0.5) 90%)" }} />

        {/* Layer 3: cursor spotlight */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: spotlight }} />

        {/* Layer 4: decorative silhouettes (mid depth) */}
        {SHAPES.map((s, i) => <Shape key={i} s={s} mouse={mouse} />)}

        {/* Layer 5: floating tech chips */}
        {CHIPS.map((c, i) => <Chip key={i} c={c} mouse={mouse} />)}

        {/* Corner overlines */}
        <div className="absolute top-28 left-6 sm:left-12 z-20">
          <p className="overline wr-hero-text">CSE · Hyderabad · full-stack + AI + 3D</p>
        </div>
        <div className="absolute top-28 right-6 sm:right-12 z-20 text-right">
          <p className="overline wr-hero-text">portfolio · v.2026 · scroll to play</p>
        </div>

        {/* Center title (moves with scroll) */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity, transform: `translate(${mouse.x * -6}px, ${mouse.y * -6}px)` }}
          className="relative z-30 text-center px-6"
        >
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }} className="overline text-neutral-500 mb-6">
            akshad mishra · builder · storyteller
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-5xl sm:text-7xl lg:text-[9rem] leading-[0.9] tracking-tighter text-neutral-900">
            Akshad
            <br />
            <span className="italic font-light">Mishra</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9 }}
            className="mt-8 max-w-xl mx-auto text-base sm:text-lg text-neutral-600">
            I ship full-stack apps, AI systems and Blender worlds — one puzzle piece at a time.
            Scroll to play through the portfolio.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#projects" data-testid="hero-cta-projects" className="wr-skeu-btn">Play the portfolio</a>
            <a href="#reach" data-testid="hero-cta-reach"
              className="px-6 py-3 rounded-full border border-neutral-300 bg-white/60 backdrop-blur-md text-sm font-medium hover:bg-white transition">
              Say hi
            </a>
          </motion.div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
            press <kbd className="wr-glass rounded px-1.5 py-0.5 mx-1">⌘</kbd>
            <kbd className="wr-glass rounded px-1.5 py-0.5 mx-1">K</kbd>
            for the command palette
          </p>
        </motion.div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-neutral-500">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll</span>
          <div className="w-[1px] h-10 bg-neutral-400/60 relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-3 bg-neutral-900 animate-[wr-float_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
