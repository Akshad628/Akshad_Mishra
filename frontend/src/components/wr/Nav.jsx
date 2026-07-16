import { useEffect, useState } from "react";
import { Menu, X, Command } from "lucide-react";

const links = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "reel", label: "3D Reel" },
  { id: "stats", label: "Stats" },
  { id: "about", label: "About" },
  { id: "reach", label: "Reach" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.id);
    const compute = () => {
      const trigger = window.innerHeight * 0.35;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= trigger) current = id;
      }
      const first = document.getElementById(ids[0]);
      if (first && first.getBoundingClientRect().top > trigger) current = "";
      setActive(current);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  const openCmdK = () => window.dispatchEvent(new CustomEvent("wr:cmdk-open"));

  return (
    <header data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
      <div className="mx-auto w-[min(1240px,94%)] flex items-center justify-between gap-3">
        <a href="#top" data-testid="nav-logo"
          className="flex items-center gap-2 font-display text-base sm:text-lg tracking-tight">
          <span className="inline-block w-3 h-3 bg-neutral-900 rounded-sm rotate-45" />
          <span>akshad<span className="italic font-light">.dev</span></span>
        </a>

        <nav className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full wr-glass">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a key={l.id} href={`#${l.id}`} data-testid={`nav-${l.id}`}
                data-active={isActive ? "true" : "false"}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive ? "text-white" : "text-neutral-700 hover:text-neutral-900"
                }`}>
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-neutral-900 -z-0"
                    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 16px -6px rgba(0,0,0,0.4)" }} />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={openCmdK} data-testid="nav-cmdk"
            className="hidden sm:inline-flex items-center gap-2 wr-glass rounded-full px-3 py-2 text-xs text-neutral-600 hover:text-neutral-900">
            <Command size={13} /> K
          </button>
          <a href="#reach" data-testid="nav-cta" className="hidden sm:inline-flex wr-skeu-btn !py-2.5 !px-5 text-sm">
            Say hi
          </a>
          <button data-testid="nav-mobile-toggle" onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full wr-glass" aria-label="Toggle menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mx-auto mt-3 w-[min(1240px,94%)] wr-glass rounded-2xl p-3 flex flex-col gap-1">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}
                data-testid={`nav-mobile-${l.id}`}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-neutral-900 text-white" : "text-neutral-800 hover:bg-white/70"
                }`}>
                {l.label}
              </a>
            );
          })}
          <button onClick={() => { openCmdK(); setOpen(false); }}
            className="mt-1 wr-skeu-btn !py-2.5 text-sm justify-center inline-flex items-center gap-2">
            <Command size={14} /> Command palette
          </button>
        </div>
      )}
    </header>
  );
}
