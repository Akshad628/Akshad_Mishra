import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const HERO_IMG =
  "https://images.pexels.com/photos/9789216/pexels-photo-9789216.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900";

const PIECES = [
  { x: 0, y: 0, dx: -260, dy: -180, depth: 1.4 },
  { x: 1, y: 0, dx: 0, dy: -220, depth: 0.9 },
  { x: 2, y: 0, dx: 280, dy: -200, depth: 1.6 },
  { x: 0, y: 1, dx: -320, dy: 20, depth: 1.1 },
  { x: 1, y: 1, dx: 30, dy: -30, depth: 0.5 },
  { x: 2, y: 1, dx: 340, dy: 40, depth: 1.3 },
  { x: 0, y: 2, dx: -240, dy: 220, depth: 1.0 },
  { x: 1, y: 2, dx: 10, dy: 260, depth: 0.8 },
  { x: 2, y: 2, dx: 300, dy: 240, depth: 1.5 },
];

function Piece({ p, i, progress, mouse }) {
  const tx = useTransform(progress, [0, 1], [0, p.dx]);
  const ty = useTransform(progress, [0, 1], [0, p.dy]);
  const rot = useTransform(progress, [0, 1], [0, (i % 2 === 0 ? -1 : 1) * (8 + i * 1.4)]);
  const op = useTransform(progress, [0, 0.85, 1], [1, 0.5, 0]);
  const mx = mouse.x * 28 * p.depth;
  const my = mouse.y * 28 * p.depth;
  return (
    <motion.div
      data-testid={`puzzle-piece-${i}`}
      className="absolute wr-piece rounded-[14px]"
      style={{
        left: `${(p.x / 3) * 100}%`,
        top: `${(p.y / 3) * 100}%`,
        width: "33.34%",
        height: "33.34%",
        backgroundImage: `url(${HERO_IMG})`,
        backgroundSize: "300% 300%",
        backgroundPosition: `${p.x * 50}% ${p.y * 50}%`,
        x: tx,
        y: ty,
        rotate: rot,
        opacity: op,
        translateX: mx,
        translateY: my,
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    />
  );
}

export default function Hero() {
  const ref = useRef(null);
  const heroEl = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = heroEl.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setMouse({ x, y });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-[160vh] w-full"
    >
      <div
        ref={heroEl}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="absolute top-28 left-6 sm:left-12 z-20">
          <p className="overline">An XR Studio · est. wandel</p>
        </div>
        <div className="absolute top-28 right-6 sm:right-12 z-20 text-right">
          <p className="overline">Scroll · puzzle 01 / 09</p>
        </div>

        <div className="relative w-[min(86vw,720px)] aspect-square z-10">
          {PIECES.map((p, i) => (
            <Piece key={i} p={p} i={i} progress={scrollYProgress} mouse={mouse} />
          ))}
        </div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center text-center px-6"
        >
          <p className="overline mb-6">spatial · puzzle · reality</p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[8rem] leading-[0.92] tracking-tighter text-neutral-900">
            Wandel
            <br />
            <span className="italic font-light">Reality</span>
          </h1>
          <p className="mt-8 max-w-xl text-neutral-600 text-base sm:text-lg">
            We craft immersive XR — VR, spatial design and research — one
            puzzle piece at a time.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
            <a href="#ateliers" data-testid="hero-cta-projects" className="wr-skeu-btn">
              Enter the ateliers
            </a>
            <a
              href="#reach"
              data-testid="hero-cta-reach"
              className="px-6 py-3 rounded-full border border-neutral-300 bg-white/60 backdrop-blur-md text-sm font-medium hover:bg-white transition"
            >
              Reach out
            </a>
          </div>
        </motion.div>

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
