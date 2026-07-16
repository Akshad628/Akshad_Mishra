// Hidden collectible spots — small puzzle-piece icons scattered across
// sections. Click to collect. Inventory HUD appears bottom-right after the
// first pick. Full set unlocks the "Puzzle Master" achievement + effect.

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Puzzle } from "lucide-react";

// Lightweight singleton store — no external dep.
const listeners = new Set();
const state = { collected: new Set(), total: 6 };

function notify() { listeners.forEach((l) => l()); }

export function useCollectibles() {
  const [, s] = useState(0);
  useEffect(() => {
    const fn = () => s((x) => x + 1);
    listeners.add(fn);
    return () => listeners.delete(fn);
  }, []);
  return {
    collected: state.collected,
    total: state.total,
    collect: (id) => {
      if (state.collected.has(id)) return;
      state.collected.add(id);
      notify();
      if (state.collected.size === state.total) {
        toast.success("🧩 Puzzle Master — all pieces found!", { duration: 4000 });
        document.body.classList.add("wr-god-mode");
        setTimeout(() => document.body.classList.remove("wr-god-mode"), 6000);
      }
    },
    fillAll: () => {
      ["c-projects","c-skills","c-reel","c-stats","c-about","c-reach"].forEach((id) => state.collected.add(id));
      notify();
    },
  };
}

export default function CollectibleSpot({ id, top, left, right, bottom }) {
  const { collect, collected } = useCollectibles();
  const done = collected.has(id);
  return (
    <button type="button" onClick={() => collect(id)} disabled={done}
      data-testid={`collectible-${id}`} aria-label={`Collectible ${id}`}
      className="absolute z-10 group"
      style={{ top, left, right, bottom }}>
      <span className={`block w-8 h-8 sm:w-9 sm:h-9 rounded-lg wr-glass flex items-center justify-center transition-all
        ${done ? "opacity-40 scale-90" : "opacity-70 group-hover:opacity-100 group-hover:scale-110 animate-[wr-float_3s_ease-in-out_infinite]"}`}>
        <Puzzle size={14} className={done ? "text-neutral-400" : "text-neutral-900"} />
      </span>
    </button>
  );
}

export function InventoryHUD() {
  const { collected, total } = useCollectibles();
  if (collected.size === 0) return null;
  const pct = (collected.size / total) * 100;
  return (
    <div data-testid="inventory-hud"
      className="fixed bottom-4 right-4 z-40 wr-glass rounded-full px-3 py-2 flex items-center gap-2 pointer-events-none">
      <Puzzle size={12} />
      <span className="font-mono text-[11px]">{collected.size} / {total}</span>
      <span className="w-10 h-1 bg-neutral-200 rounded-full overflow-hidden">
        <span className="block h-full bg-neutral-900" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}
