// Konami code: ↑ ↑ ↓ ↓ ← → ← → B A
import { useEffect } from "react";
import { toast } from "sonner";
import { useCollectibles } from "./CollectibleSpot";

const CODE = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export default function Konami() {
  const { fillAll } = useCollectibles();
  useEffect(() => {
    let buf = [];
    const onKey = (e) => {
      buf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (buf.length > CODE.length) buf.shift();
      if (buf.length === CODE.length && buf.every((k, i) => k === CODE[i])) {
        buf = [];
        toast.success("🌈 GOD MODE — all collectibles unlocked", { duration: 4000 });
        document.body.classList.add("wr-god-mode");
        fillAll();
        setTimeout(() => document.body.classList.remove("wr-god-mode"), 8000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fillAll]);
  return null;
}
