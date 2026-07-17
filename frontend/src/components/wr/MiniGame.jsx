// Breakout-lite — arrow keys or mouse to move paddle. Balls-per-life = 3.
import { useEffect, useRef, useState } from "react";

const W = 720, H = 420;
const PADDLE_W = 90, PADDLE_H = 12;
const BALL_R = 7;
const ROWS = 4, COLS = 10, BRICK_H = 18, BRICK_GAP = 4;

export default function MiniGame() {
  const cvsRef = useRef(null);
  const stateRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState("ready"); // ready|playing|over|win
  const [best, setBest] = useState(() => Number(localStorage.getItem("wr-best") || 0));

  useEffect(() => {
    const canvas = cvsRef.current;
    const ctx = canvas.getContext("2d");
    const bricks = [];
    const bw = (W - (COLS + 1) * BRICK_GAP) / COLS;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        bricks.push({ x: BRICK_GAP + c * (bw + BRICK_GAP), y: 40 + r * (BRICK_H + BRICK_GAP), w: bw, h: BRICK_H, alive: true, row: r });
      }
    }
    const s = {
      paddleX: (W - PADDLE_W) / 2,
      ballX: W / 2, ballY: H - 40, vx: 3, vy: -3,
      bricks, keys: { l: false, r: false },
    };
    stateRef.current = s;

    const kd = (e) => {
      if (e.key === "ArrowLeft") s.keys.l = true;
      if (e.key === "ArrowRight") s.keys.r = true;
      if (e.key === " ") setStatus((st) => (st === "ready" || st === "over" || st === "win" ? "playing" : st));
    };
    const ku = (e) => {
      if (e.key === "ArrowLeft") s.keys.l = false;
      if (e.key === "ArrowRight") s.keys.r = false;
    };
    const mm = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * W;
      s.paddleX = Math.max(0, Math.min(W - PADDLE_W, x - PADDLE_W / 2));
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    canvas.addEventListener("mousemove", mm);

    let raf;
    const loop = () => {
      // clear
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, W, H);
      // border
      ctx.strokeStyle = "#0a0a0a"; ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, W - 2, H - 2);

      if (status === "playing") {
        if (s.keys.l) s.paddleX = Math.max(0, s.paddleX - 6);
        if (s.keys.r) s.paddleX = Math.min(W - PADDLE_W, s.paddleX + 6);
        s.ballX += s.vx; s.ballY += s.vy;
        // walls
        if (s.ballX < BALL_R || s.ballX > W - BALL_R) s.vx *= -1;
        if (s.ballY < BALL_R) s.vy *= -1;
        // paddle
        if (s.ballY > H - 30 - BALL_R && s.ballX > s.paddleX && s.ballX < s.paddleX + PADDLE_W && s.vy > 0) {
          s.vy *= -1;
          const hit = (s.ballX - (s.paddleX + PADDLE_W / 2)) / (PADDLE_W / 2);
          s.vx = 3.4 * hit;
        }
        // bricks
        for (const b of s.bricks) {
          if (!b.alive) continue;
          if (s.ballX > b.x && s.ballX < b.x + b.w && s.ballY - BALL_R < b.y + b.h && s.ballY + BALL_R > b.y) {
            b.alive = false;
            s.vy *= -1;
            setScore((v) => {
              const n = v + (ROWS - b.row) * 10;
              if (n > best) { setBest(n); localStorage.setItem("wr-best", String(n)); }
              return n;
            });
          }
        }
        // lose ball
        if (s.ballY > H) {
          setLives((l) => {
            const n = l - 1;
            if (n <= 0) setStatus("over");
            return n;
          });
          s.ballX = W / 2; s.ballY = H - 40; s.vx = 3; s.vy = -3;
        }
        // win
        if (s.bricks.every((b) => !b.alive)) setStatus("win");
      }

      // draw bricks
      for (const b of s.bricks) {
        if (!b.alive) continue;
        const shade = 20 + b.row * 20;
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
      // paddle
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(s.paddleX, H - 20, PADDLE_W, PADDLE_H);
      // ball
      ctx.beginPath(); ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0a0a"; ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      canvas.removeEventListener("mousemove", mm);
    };
  }, [status, best]);

  const restart = () => { setScore(0); setLives(3); setStatus("ready"); };

  return (
    <div data-testid="minigame" className="p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="overline">/play · breakout</p>
          <p className="font-display text-xl">Score {score} · lives {lives}</p>
        </div>
        <div className="text-right font-mono text-xs text-neutral-500">
          arrow keys or mouse<br />space to start<br />best: {best}
        </div>
      </div>
      <div className="relative w-full aspect-[720/420] rounded-2xl overflow-hidden">
        <canvas ref={cvsRef} width={W} height={H} className="w-full h-full block bg-white rounded-2xl" />
        {status !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur rounded-2xl">
            <div className="text-center">
              <p className="font-display text-2xl mb-2">
                {status === "over" ? "Game Over" : status === "win" ? "Cleared!" : "Ready?"}
              </p>
              <button onClick={restart} className="wr-skeu-btn">
                {status === "ready" ? "Start (or press Space)" : "Play again"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
