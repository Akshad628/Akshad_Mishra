// Simple achievements context — fires a sonner toast the first time each
// section scrolls into view.
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Trophy } from "lucide-react";

const Ctx = createContext(null);

export function AchievementsProvider({ children }) {
  const [unlocked, setUnlocked] = useState(new Set());

  const unlock = useCallback((id, meta = {}) => {
    setUnlocked((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      const Icon = meta.icon || Trophy;
      toast.custom(() => (
        <div className="wr-glass rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[260px]"
          style={{ boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(180deg, #fff 0%, #e5e5e5 100%)" }}>
            <Icon size={16} />
          </div>
          <div className="flex-1">
            <p className="overline">achievement unlocked</p>
            <p className="font-display text-base leading-tight">{meta.title || id}</p>
          </div>
        </div>
      ), { duration: 3200 });
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ unlocked, unlock }}>{children}</Ctx.Provider>;
}

export function useAchievements() {
  return useContext(Ctx) || { unlocked: new Set(), unlock: () => {} };
}

// Hook: fires the achievement when the given ref becomes 40% visible
export function useAchievement(ref, id, meta) {
  const { unlock } = useAchievements();
  const fired = useRef(false);
  useEffect(() => {
    if (!ref?.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            unlock(id, meta);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, id, meta, unlock]);
}
