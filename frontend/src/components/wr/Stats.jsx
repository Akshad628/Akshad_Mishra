// Live GitHub + LeetCode stats — public endpoints, no keys required.

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, Code, TrendingUp, Trophy } from "lucide-react";
import { useAchievement } from "./Achievements";
import CollectibleSpot from "./CollectibleSpot";

const GH_USER = process.env.REACT_APP_GITHUB_USER || "Akshad628";
const LC_USER = process.env.REACT_APP_LEETCODE_USER || "akshad_mishra";

function GithubBlock() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const [uRes, rRes, gRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GH_USER}`),
          fetch(`https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=6`),
          fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`),
        ]);
        if (uRes.ok && !cancel) setUser(await uRes.json());
        if (rRes.ok && !cancel) {
          const list = await rRes.json();
          setRepos(list.filter((r) => !r.fork).slice(0, 6));
        }
        if (gRes.ok && !cancel) setGrid(await gRes.json());
      } catch (e) { /* silent */ }
    })();
    return () => { cancel = true; };
  }, []);

  const total = grid?.total?.[Object.keys(grid?.total || {}).pop()] ?? user?.public_repos ?? "—";

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.9 }}
      data-testid="github-block" className="wr-glass rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-neutral-900 flex items-center justify-center">
            <Github size={18} className="text-white" />
          </div>
          <div>
            <p className="overline">github · live</p>
            <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noreferrer"
              className="font-display text-2xl hover:underline underline-offset-4">
              @{GH_USER}
            </a>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl">{total}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            contributions · last yr
          </p>
        </div>
      </div>

      {/* Contribution grid */}
      {grid?.contributions && (
        <div className="mt-6 overflow-x-auto wr-no-scrollbar">
          <div className="grid grid-flow-col grid-rows-7 gap-[3px] min-w-[600px]">
            {grid.contributions.slice(-364).map((d, i) => {
              const c = d.count;
              const bg =
                c === 0 ? "#eaeaea"
                : c < 3 ? "#c8d4d0"
                : c < 6 ? "#8fb0a6"
                : c < 10 ? "#4d7a6b"
                : "#0a0a0a";
              return <div key={i} title={`${d.date}: ${c}`} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: bg }} />;
            })}
          </div>
        </div>
      )}

      {/* Repos */}
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {repos.map((r) => (
          <a key={r.id} href={r.html_url} target="_blank" rel="noreferrer"
            data-testid={`repo-${r.name}`}
            className="group block rounded-2xl border border-neutral-200 bg-white/70 p-4 hover:border-neutral-900 transition">
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm text-neutral-900 truncate">{r.name}</p>
              <Code size={13} className="text-neutral-500" />
            </div>
            <p className="text-xs text-neutral-600 mt-1 line-clamp-2 min-h-[2rem]">
              {r.description || "—"}
            </p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-neutral-500">
              {r.language && <span>{r.language}</span>}
              <span className="inline-flex items-center gap-1"><Star size={11} />{r.stargazers_count}</span>
              <span className="inline-flex items-center gap-1"><GitFork size={11} />{r.forks_count}</span>
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

function LeetCodeBlock() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    let cancel = false;
    (async () => {
      const endpoints = [
        `https://leetcode-api-faisalshohag.vercel.app/${LC_USER}`,
        `https://alfa-leetcode-api.onrender.com/${LC_USER}/solved`,
      ];
      for (const url of endpoints) {
        try {
          const r = await fetch(url);
          if (r.ok) {
            const j = await r.json();
            const total = j.totalSolved ?? j.solvedProblem;
            if (!cancel && total !== undefined) {
              setStats({
                total,
                easy: j.easySolved ?? 0,
                medium: j.mediumSolved ?? 0,
                hard: j.hardSolved ?? 0,
                totalQuestions: j.totalQuestions ?? null,
                ranking: j.ranking ?? null,
              });
              return;
            }
          }
        } catch (e) { /* try next */ }
      }
    })();
    return () => { cancel = true; };
  }, []);

  const bars = [
    { label: "Easy",   value: stats?.easy   ?? 0, color: "#16a34a" },
    { label: "Medium", value: stats?.medium ?? 0, color: "#facc15" },
    { label: "Hard",   value: stats?.hard   ?? 0, color: "#dc2626" },
  ];
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }}
      data-testid="leetcode-block" className="wr-glass rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(180deg, #fda4af 0%, #f97316 100%)" }}>
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <p className="overline">leetcode · live</p>
            <a href={`https://leetcode.com/${LC_USER}/`} target="_blank" rel="noreferrer"
              className="font-display text-2xl hover:underline underline-offset-4">
              @{LC_USER}
            </a>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl">{stats?.total ?? "—"}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">solved</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
              <span>{b.label}</span><span>{b.value}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
              <motion.div className="h-full" style={{ background: b.color }}
                initial={{ width: 0 }} whileInView={{ width: `${(b.value / max) * 100}%` }}
                viewport={{ once: true }} transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }} />
            </div>
          </div>
        ))}
      </div>

      {stats?.ranking && (
        <p className="mt-5 text-xs text-neutral-500">
          Global rank <span className="font-mono text-neutral-900">#{stats.ranking.toLocaleString()}</span>
        </p>
      )}
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  useAchievement(ref, "stats", { title: "Proof unlocked", icon: TrendingUp });

  return (
    <section id="stats" ref={ref} data-testid="stats-section" className="relative py-32 sm:py-44">
      <CollectibleSpot id="c-stats" top="14%" left="8%" />
      <div className="mx-auto w-[min(1240px,94%)]">
        <div className="grid md:grid-cols-12 gap-10 items-end mb-12">
          <div className="md:col-span-7">
            <p className="overline mb-4">live stats · level 05</p>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter">Receipts</h2>
          </div>
          <p className="md:col-span-5 text-neutral-600 text-base sm:text-lg">
            Fetched live from GitHub + LeetCode on every visit. Nothing hard-coded.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <GithubBlock />
          <LeetCodeBlock />
        </div>
      </div>
    </section>
  );
}
