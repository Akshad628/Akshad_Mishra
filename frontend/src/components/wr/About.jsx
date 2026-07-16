import { motion } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Briefcase, MapPin, User } from "lucide-react";
import { useAchievement } from "./Achievements";
import CollectibleSpot from "./CollectibleSpot";

const NODES = [
  {
    type: "edu", icon: GraduationCap,
    title: "B.Tech · CSE",
    where: "Geethanjali College of Engineering & Technology, Hyderabad",
    when: "2023 – 2027",
    body: "Current CGPA 8.41/10 (3rd yr, 2nd sem). Head, National Entrepreneurship Network (NEN) student chapter.",
  },
  {
    type: "work", icon: Briefcase,
    title: "3D Architecture Modelling Intern",
    where: "Infosys · Keesara, TG",
    when: "May – Jun 2025",
    body: "Full Blender pipeline: block-out → modeling → UV → PBR → lighting → render. Delivered lit architectural assets with AO, Principled BSDF, HDRI.",
  },
  {
    type: "work", icon: Briefcase,
    title: "AI Developer Intern",
    where: "Visvam.ai · Gachibowli, TG",
    when: "Aug – Sep 2025",
    body: "Shipped Macro — a context-aware AI fitness coach. Streamlit → Hugging Face Inference API → Mistral 7B LLM. Live on Streamlit Cloud.",
  },
  {
    type: "work", icon: Briefcase,
    title: "Machine Learning Intern",
    where: "NRSC · Jeedimeta, TG",
    when: "Jan – Mar 2026",
    body: "Interactive analytics platform for large-scale satellite + geospatial data. K-Means segmentation with silhouette validation, drill-down BI dashboards.",
  },
  {
    type: "edu", icon: GraduationCap,
    title: "Intermediate · CBSE (Science)",
    where: "Kendriya Vidyalaya Picket, Secunderabad",
    when: "2021 – 2023",
    body: "82% overall.",
  },
];

export default function About() {
  const ref = useRef(null);
  useAchievement(ref, "about", { title: "Backstory revealed", icon: User });

  return (
    <section id="about" ref={ref} data-testid="about-section" className="relative py-32 sm:py-44">
      <CollectibleSpot id="c-about" top="10%" right="6%" />
      <div className="mx-auto w-[min(1240px,94%)] grid md:grid-cols-12 gap-10 items-end mb-12">
        <div className="md:col-span-7">
          <p className="overline mb-4">about · level 06</p>
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter">The journey</h2>
        </div>
        <div className="md:col-span-5">
          <p className="text-neutral-600 text-base sm:text-lg">
            Computer Science undergrad in Hyderabad. I like when engineering meets story — full-stack
            apps, ML pipelines, Blender worlds. Try <kbd className="wr-glass rounded px-1.5 py-0.5 mx-1 text-[11px]">/whoami</kbd> in the command palette for the short version.
          </p>
          <p className="mt-4 text-neutral-600 text-sm inline-flex items-center gap-2">
            <MapPin size={14} /> Hyderabad, Telangana
          </p>
        </div>
      </div>

      <div className="mx-auto w-[min(1240px,94%)] relative">
        {/* Center rail */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-neutral-300 md:-translate-x-1/2" />
        <ul className="space-y-10 sm:space-y-14">
          {NODES.map((n, i) => {
            const Icon = n.icon;
            const left = i % 2 === 0;
            return (
              <li key={i} className="relative md:grid md:grid-cols-2 md:gap-10">
                <div className={`hidden md:block ${left ? "md:col-start-1" : "md:col-start-2"}`} />
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7 }}
                  className={`relative pl-14 md:pl-0 ${left ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"}`}>
                  {/* Dot */}
                  <span className={`absolute left-4 md:left-1/2 top-1 w-7 h-7 rounded-full bg-white border border-neutral-900 flex items-center justify-center md:-translate-x-1/2 ${left ? "md:-translate-x-1/2" : "md:-translate-x-1/2"}`}
                    style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.12)" }}>
                    <Icon size={13} />
                  </span>
                  <div className="wr-glass rounded-2xl p-5">
                    <p className="overline">{n.when}</p>
                    <h3 className="font-display text-2xl mt-1 leading-tight">{n.title}</h3>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">{n.where}</p>
                    <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{n.body}</p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
