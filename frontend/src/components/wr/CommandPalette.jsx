// Cmd/Ctrl + K command palette. Opens on shortcut or via nav button
// (which dispatches a "wr:cmdk-open" event).
//   /whoami   – quick bio toast
//   /play     – Breakout minigame
//   /resume   – opens resume in new tab (env: REACT_APP_RESUME_URL)
//   /email    – mailto
//   /github   – opens github
//   /leetcode – opens leetcode
//   /linkedin – opens linkedin
//   /theme    – (placeholder, portfolio is intentionally single-theme)
//   jump:*    – scroll to any section

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Command, Search, ArrowRight, X } from "lucide-react";
import MiniGame from "./MiniGame";

const GH = "https://github.com/Akshad628";
const LN = "https://www.linkedin.com/in/akshadmishra";
const LC = "https://leetcode.com/akshad_mishra/";
const EM = "akshadmishra628@gmail.com";
const RESUME = process.env.REACT_APP_RESUME_URL || "https://customer-assets-eiarnc6j.emergentagent.net/job_wandel-reality/artifacts/qro3nj70_Akshad_2026.docx";

const SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "reel", label: "3D Reel" },
  { id: "stats", label: "Stats" },
  { id: "about", label: "About" },
  { id: "reach", label: "Reach" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [game, setGame] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
        setGame(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("wr:cmdk-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wr:cmdk-open", onOpen);
    };
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const run = (cmd) => {
    setOpen(false); setQ("");
    if (cmd === "/whoami") return toast("Akshad Mishra — CSE @ Geethanjali, Hyderabad. Full-stack + AI + Blender. 4th yr, CGPA 8.41.");
    if (cmd === "/play")    return setTimeout(() => setGame(true), 200);
    if (cmd === "/resume")  return window.open(RESUME, "_blank");
    if (cmd === "/email")   return (window.location.href = `mailto:${EM}`);
    if (cmd === "/github")  return window.open(GH, "_blank");
    if (cmd === "/linkedin") return window.open(LN, "_blank");
    if (cmd === "/leetcode") return window.open(LC, "_blank");
    if (cmd === "/theme")   return toast("This portfolio is intentionally single-theme. Puzzle white, always.");
    if (cmd.startsWith("jump:")) {
      const id = cmd.slice(5);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const allCommands = [
    { c: "/whoami", d: "quick bio in a toast" },
    { c: "/play", d: "Breakout minigame · earn a score" },
    { c: "/resume", d: "open resume PDF" },
    { c: "/email", d: "mailto akshadmishra628@gmail.com" },
    { c: "/github", d: "@Akshad628" },
    { c: "/linkedin", d: "/in/akshadmishra" },
    { c: "/leetcode", d: "@akshad_mishra" },
    { c: "/theme", d: "toggle theme (not really)" },
    ...SECTIONS.map((s) => ({ c: `jump:${s.id}`, d: `go to ${s.label}` })),
  ];
  const filtered = q ? allCommands.filter((x) => (x.c + " " + x.d).toLowerCase().includes(q.toLowerCase())) : allCommands;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            data-testid="command-palette"
            className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl wr-glass rounded-3xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/40">
                <Search size={16} className="text-neutral-500" />
                <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && filtered[0] && run(filtered[0].c)}
                  data-testid="cmdk-input"
                  placeholder="type a command… try /whoami or /play"
                  className="flex-1 bg-transparent outline-none font-mono text-sm placeholder:text-neutral-400" />
                <kbd className="font-mono text-[10px] text-neutral-500 wr-glass px-1.5 py-0.5 rounded">ESC</kbd>
              </div>
              <ul className="max-h-[46vh] overflow-y-auto wr-no-scrollbar p-2">
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-neutral-500">No matches.</li>
                )}
                {filtered.map((it, i) => (
                  <li key={it.c}>
                    <button data-testid={`cmd-${it.c.replace(/[/:]/g, "-")}`}
                      onClick={() => run(it.c)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-white/70">
                      <span className="flex items-center gap-3">
                        <Command size={12} className="text-neutral-500" />
                        <span className="font-mono text-sm">{it.c}</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-xs text-neutral-500 truncate max-w-[240px]">{it.d}</span>
                        <ArrowRight size={12} className="text-neutral-400" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 border-t border-white/40 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 flex justify-between">
                <span>↑ ↓ · enter · esc</span>
                <span>tip: try ↑↑↓↓←→←→BA</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {game && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
          onClick={() => setGame(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl wr-glass rounded-3xl overflow-hidden">
            <button onClick={() => setGame(false)} data-testid="minigame-close"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/70 hover:bg-white flex items-center justify-center">
              <X size={16} />
            </button>
            <MiniGame />
          </div>
        </div>
      )}
    </>
  );
}
