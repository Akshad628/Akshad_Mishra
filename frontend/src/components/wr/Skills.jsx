import { motion } from "framer-motion";
import { useRef } from "react";
import { Code2, Braces, Cpu, Boxes, Workflow, Wrench, Sparkles } from "lucide-react";
import { useAchievement } from "./Achievements";
import CollectibleSpot from "./CollectibleSpot";

const GROUPS = [
  {
    icon: Braces, name: "Languages", level: 92,
    items: ["C", "Java", "Python", "JavaScript (ES6+)", "PHP", "C#", "SQL"],
  },
  {
    icon: Code2, name: "Web", level: 88,
    items: ["React", "Node", "Express", "REST APIs", "MongoDB", "MERN"],
  },
  {
    icon: Cpu, name: "ML / AI", level: 85,
    items: ["Pandas", "NumPy", "Scikit-learn", "Plotly", "Ipywidgets", "Gemini", "LLM prompting", "RAG"],
  },
  {
    icon: Boxes, name: "3D & Games", level: 82,
    items: ["Blender 4.5", "Unity", "Shader Graph", "PBR", "HDRI", "Cycles / EEVEE"],
  },
  {
    icon: Workflow, name: "Automation", level: 78,
    items: ["n8n", "Google APIs", "Telegram Bot", "Webhooks", "Cron"],
  },
  {
    icon: Wrench, name: "Tools", level: 90,
    items: ["Git", "DaVinci Resolve", "Postman", "Figma", "VS Code"],
  },
];

export default function Skills() {
  const ref = useRef(null);
  useAchievement(ref, "skills", { title: "Skills unlocked", icon: Sparkles });

  return (
    <section id="skills" ref={ref} data-testid="skills-section" className="relative py-32 sm:py-44">
      <CollectibleSpot id="c-skills" top="14%" right="8%" />
      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-16">
          <div className="md:col-span-7">
            <p className="overline mb-4">skills · level 03</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter">Power levels</h2>
          </div>
          <p className="md:col-span-5 text-neutral-600 text-base sm:text-lg">
            Six disciplines, one player. Each bar represents fluency, not vanity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GROUPS.map((g, i) => {
            const Icon = g.icon;
            return (
              <motion.div key={g.name} data-testid={`skill-${g.name}`}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                whileHover={{ y: -6 }}
                className="group relative wr-glass rounded-3xl p-6 overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(180deg, #fff 0%, #e9e9e9 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)",
                    }}>
                    <Icon size={18} />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
                    lvl {String(g.level).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl text-neutral-900">{g.name}</h3>

                {/* XP bar */}
                <div className="mt-3 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                  <motion.div className="h-full bg-neutral-900"
                    initial={{ width: 0 }} whileInView={{ width: `${g.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2 + i * 0.06, ease: [0.2, 0.8, 0.2, 1] }} />
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <span key={it}
                      className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-1 rounded-full bg-white/80 border border-neutral-200 text-neutral-700">
                      {it}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
