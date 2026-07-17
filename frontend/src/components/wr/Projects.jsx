import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Github, ExternalLink, Trophy } from "lucide-react";
import { useAchievement } from "./Achievements";
import CollectibleSpot from "./CollectibleSpot";

const PROJECTS = [
  {
    id: "adhoc",
    title: "ADhoc.ai",
    tag: "Full-Stack · Voice AI · RAG",
    year: "2025",
    desc: "Voice-first admission/education agent. FastRTC (WebSocket + VAD + barge-in) → Groq Llama 70B for inference; Deepgram → ElevenLabs TTS fallback. Auth0 + Supabase + Redis memory pool. Smooth-scrolling glassmorphic UI (GSAP + Lenis).",
    stack: ["TypeScript", "Python", "Groq Llama 70B", "FastRTC", "Deepgram", "ElevenLabs", "Supabase", "Auth0", "Redis"],
    href: "#",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "job-automation",
    title: "AI Job Automation Pipeline",
    tag: "n8n · Gemini · Automation",
    year: "2026",
    desc: "Self-correcting n8n workflow: pulls resume from Drive → parses PDF → queries LinkedIn → Gemini scores relevance and drafts cold emails → Telegram push on qualified matches. Iterates below threshold.",
    stack: ["n8n", "Gemini AI", "LinkedIn API", "Google Drive", "Google Sheets", "Telegram Bot", "PDF extraction"],
    href: "#",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ai-finance",
    title: "AI Financial Tracker",
    tag: "MERN · Gemini · Dashboards",
    year: "2025",
    desc: "Full-stack personal finance app — expense logging, EMI tracking, saving goals, JWT auth, monthly PDF reports, and Gemini-generated spending insights + investment tips. Chart.js visualisations.",
    stack: ["React", "Node", "Express", "MongoDB", "Google Gemini", "JWT", "Chart.js"],
    href: "https://github.com/Akshad628/ai-finance-tracker",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "blender-portfolio",
    title: "3D Creative Portfolio",
    tag: "Blender 4.5 · Modeling · Shading",
    year: "2025 – 2026",
    desc: "Fantasy Sword with emission blade + particle lightning; Minecraft-style ancient temple on a floating island with PBR blocks, AO baking, custom HDRI. Full pipeline: block-out → UV → PBR → lighting → render.",
    stack: ["Blender", "Cycles", "EEVEE", "PBR", "HDRI", "Shader Graph"],
    href: "#reel",
    image: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?auto=format&fit=crop&w=1200&q=80",
  },
];

function Card({ p, i, total, progress }) {
  const t0 = i / total, t1 = (i + 1) / total;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const x = useTransform(progress, [t0, t1], isMobile ? [0, 0] : [-220, 60]);
  const y = useTransform(progress, [t0, t1], [120, 0]);
  const rot = useTransform(progress, [t0, t1], [-8, 0]);
  const op = useTransform(progress, [t0 - 0.05, t0 + 0.05, t1 - 0.05, t1 + 0.1], [0, 1, 1, 0.6]);
  const scale = useTransform(progress, [t0, t1], [0.92, 1]);

  return (
    <motion.article data-testid={`project-${p.id}`}
      style={{ x, y, rotate: rot, opacity: op, scale }}
      className="wr-glass rounded-3xl overflow-hidden p-2 sm:p-3 w-[92%] max-w-[680px]">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 wr-glass-dark text-white text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-full">
          {p.tag}
        </span>
        <span className="absolute bottom-3 right-3 text-white/90 font-mono text-xs">{p.year}</span>
      </div>
      <div className="px-3 sm:px-4 py-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl sm:text-3xl text-neutral-900">{p.title}</h3>
          <a href={p.href} target="_blank" rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900">
            {p.href.startsWith("http") ? <Github size={12} /> : <ExternalLink size={12} />} open
          </a>
        </div>
        <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">{p.desc}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s}
              className="text-[10px] font-mono uppercase tracking-[0.14em] px-2 py-1 rounded-full bg-white/70 border border-neutral-200 text-neutral-700">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  useAchievement(ref, "projects", { title: "Boss level: Projects", icon: Trophy });

  return (
    <section id="projects" ref={ref} data-testid="projects-section" className="relative py-32 sm:py-48">
      <CollectibleSpot id="c-projects" top="12%" left="6%" />
      <div className="mx-auto w-[min(1240px,94%)] grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <p className="overline mb-4">projects · level 02</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter text-neutral-900">
            Things I shipped
          </h2>
        </div>
        <p className="md:col-span-5 text-neutral-600 text-base sm:text-lg">
          AI voice agents, automation pipelines, MERN dashboards, and Blender worlds. Scroll to reveal.
        </p>
      </div>

      <div className="relative mt-24">
        <svg className="absolute left-0 top-0 h-full w-[40%] pointer-events-none hidden md:block"
          viewBox="0 0 200 1000" preserveAspectRatio="none">
          <path d="M 0 0 C 220 250, -120 500, 200 750 L 200 1000 L 0 1000 Z" fill="rgba(10,10,10,0.04)" />
          <path d="M 20 20 C 220 250, -100 500, 200 760" stroke="rgba(10,10,10,0.18)" strokeWidth="1"
            strokeDasharray="3 6" fill="none" />
        </svg>
        <div className="mx-auto w-[min(1240px,94%)] flex flex-col gap-32 md:gap-48 md:pl-[18%]">
          {PROJECTS.map((p, i) => (
            <Card key={p.id} p={p} i={i} total={PROJECTS.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
