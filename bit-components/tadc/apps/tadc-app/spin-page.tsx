import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from './use-wallet.js';
import styles from './spin-page.module.css';

const prizes = [
  { label: '50 Coins', short: '50🪙', value: 50, type: 'coins', color: '#ffcc00', chance: 25, weight: 25 },
  { label: '100 Coins', short: '100🪙', value: 100, type: 'coins', color: '#eab308', chance: 20, weight: 20 },
  { label: '5 Gems', short: '5💎', value: 5, type: 'gems', color: '#00e5ff', chance: 15, weight: 15 },
  { label: '200 Coins', short: '200🪙', value: 200, type: 'coins', color: '#22c55e', chance: 15, weight: 15 },
  { label: '10 Gems', short: '10💎', value: 10, type: 'gems', color: '#3b82f6', chance: 10, weight: 10 },
  { label: '500 Coins', short: '500🪙', value: 500, type: 'coins', color: '#f97316', chance: 7, weight: 7 },
  { label: 'Spin Pass', short: '🎡', value: 1, type: 'pass', color: '#a855f7', chance: 5, weight: 5 },
  { label: '1000 Coins', short: '1K🪙', value: 1000, type: 'coins', color: '#ff0044', chance: 3, weight: 3 },
];

const COOLDOWN_MS = 4 * 60 * 60 * 1000;
const caineWinQuotes = [
  "Congratulations! ...I suppose.",
  "A winner! How novel!",
  "Don't spend it all in one place! ...There IS only one place.",
  "The wheel provides! Sometimes!",
  "Lucky you! Or unlucky. Depends on perspective!",
];

function formatCountdown(ms: number): string {
  if (ms <= 0) return '';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

/**
 * Redesigned Spin page with canvas wheel, chance bars, and TADC aesthetic
 */
export function SpinPage() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<typeof prizes[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  const { addCoins, addGems, addToInventory, useItem, getItemCount, coins, gems } = useWallet();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  const spinPassCount = getItemCount('Spin Pass x1') + getItemCount('Spin Pass x3') + getItemCount('Spin Pass x10');

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 320;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2, cy = size / 2, r = size / 2 - 12;
    const sliceAngle = (Math.PI * 2) / prizes.length;

    // Outer glow
    ctx.shadowBlur = 30;
    ctx.shadowColor = 'rgba(168,85,247,0.4)';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(168,85,247,0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.shadowBlur = 0;

    for (let i = 0; i < prizes.length; i++) {
      const startA = i * sliceAngle - Math.PI / 2;
      const endA = startA + sliceAngle;
      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startA, endA);
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(10,0,37,0.9)');
      grad.addColorStop(0.6, `${prizes[i].color}22`);
      grad.addColorStop(1, `${prizes[i].color}55`);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = `${prizes[i].color}66`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startA + sliceAngle / 2);
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = prizes[i].color;
      ctx.shadowColor = prizes[i].color;
      ctx.shadowBlur = 6;
      ctx.fillText(prizes[i].short, r * 0.6, 5);
      ctx.restore();
    }
    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    cGrad.addColorStop(0, '#1a0040');
    cGrad.addColorStop(1, '#0a0025');
    ctx.fillStyle = cGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,204,0,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎪', cx, cy + 8);
  }, []);

  // Cooldown check
  useEffect(() => {
    const check = () => {
      const lastSpin = localStorage.getItem('tadc_last_spin');
      if (lastSpin) {
        const diff = Date.now() - Number(lastSpin);
        if (diff < COOLDOWN_MS) { setCooldownLeft(COOLDOWN_MS - diff); setCanSpin(false); }
        else { setCooldownLeft(0); setCanSpin(true); }
      } else { setCanSpin(true); setCooldownLeft(0); }
    };
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  // Confetti on win
  useEffect(() => {
    if (!showResult || !resultCanvasRef.current) return;
    const canvas = resultCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number; rot: number }[] = [];
    const colors = ['#ffcc00', '#ff0044', '#00e5ff', '#a855f7', '#22c55e', '#f97316', '#ff69b4'];
    for (let i = 0; i < 100; i++) {
      particles.push({ x: canvas.width / 2, y: canvas.height / 2, vx: (Math.random() - 0.5) * 14, vy: (Math.random() - 0.5) * 14 - 5, color: colors[Math.floor(Math.random() * colors.length)], size: 3 + Math.random() * 5, life: 1, rot: Math.random() * 360 });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= 0.01; p.rot += 3;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      }
      if (alive) animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [showResult]);

  const doSpin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setShowResult(false);
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + extraSpins * 360 + randomAngle;
    setRotation(totalRotation);
    const finalAngle = totalRotation % 360;
    const sliceAngle = 360 / prizes.length;
    const idx = Math.floor(((360 - finalAngle + sliceAngle / 2) % 360) / sliceAngle) % prizes.length;
    const won = prizes[idx];
    setResult(won);
    setTimeout(() => {
      if (won.type === 'coins') addCoins(won.value);
      if (won.type === 'gems') addGems(won.value);
      if (won.type === 'pass') addToInventory('Spin Pass x1', '🎡', 'spin-passes');
      setSpinning(false);
      setShowResult(true);
    }, 4000);
  }, [spinning, rotation, addCoins, addGems, addToInventory]);

  const spinFree = useCallback(() => {
    if (!canSpin || spinning) return;
    localStorage.setItem('tadc_last_spin', String(Date.now()));
    setCanSpin(false);
    setCooldownLeft(COOLDOWN_MS);
    doSpin();
  }, [canSpin, spinning, doSpin]);

  const spinWithPass = useCallback(() => {
    if (spinning) return;
    const used = useItem('Spin Pass x1') || useItem('Spin Pass x3') || useItem('Spin Pass x10');
    if (!used) return;
    doSpin();
  }, [spinning, useItem, doSpin]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🎡 CAINE'S WHEEL OF FORTUNE</h1>
      <p className={styles.subtitle}>"Spin the wheel! What could go wrong? ...Don't answer that." — Caine</p>
      <div className={styles.walletBar}>🪙 {coins} · 💎 {gems}</div>

      <div className={styles.layout}>
        {/* Left: Chance bars */}
        <div className={styles.chanceSidebar}>
          <h3 className={styles.chanceTitle}>📊 CHANCES</h3>
          {prizes.map((p, i) => (
            <div key={i} className={styles.chanceItem}>
              <div className={styles.chanceInfo}>
                <span className={styles.chanceLabel} style={{ color: p.color }}>{p.short}</span>
                <span className={styles.chancePercent}>{p.chance}%</span>
              </div>
              <div className={styles.chanceBarBg}>
                <div className={styles.chanceBarFill} style={{ width: `${p.chance * 3}%`, background: p.color, boxShadow: `0 0 8px ${p.color}66` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Center: Wheel */}
        <div className={styles.wheelArea}>
          {!canSpin && cooldownLeft > 0 && (
            <div className={styles.cooldownBar}>
              <span>⏳</span>
              <span>Next free spin: <strong>{formatCountdown(cooldownLeft)}</strong></span>
            </div>
          )}
          {spinPassCount > 0 && (
            <div className={styles.passInfo}>🎡 <strong>{spinPassCount}</strong> Spin Pass{spinPassCount > 1 ? 'es' : ''} available</div>
          )}
          <div className={styles.wheelContainer}>
            <div className={styles.pointerArrow}>▼</div>
            <div className={styles.wheelSpin} style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }}>
              <canvas ref={canvasRef} className={styles.wheelCanvas} />
            </div>
            <div className={styles.wheelGlow} />
          </div>
          <div className={styles.btnRow}>
            <button className={styles.spinBtn} onClick={spinFree} disabled={spinning || !canSpin}>
              {spinning ? '🌀 SPINNING...' : !canSpin ? '⏳ ON COOLDOWN' : '🎡 FREE SPIN!'}
            </button>
            {spinPassCount > 0 && (
              <button className={styles.passBtn} onClick={spinWithPass} disabled={spinning}>
                🎡 USE PASS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Win overlay */}
      {showResult && result && (
        <div className={styles.resultOverlay} onClick={() => setShowResult(false)}>
          <canvas ref={resultCanvasRef} className={styles.resultCanvas} />
          <div className={styles.resultPopup} onClick={e => e.stopPropagation()}>
            <div className={styles.resultGlow} style={{ background: `radial-gradient(circle, ${result.color}33 0%, transparent 70%)` }} />
            <div className={styles.resultTitle}>🎉 YOU WON!</div>
            <div className={styles.resultPrize} style={{ color: result.color }}>{result.label}</div>
            <div className={styles.resultChance}>{result.chance}% chance — {result.chance <= 5 ? 'INCREDIBLE LUCK!' : result.chance <= 10 ? 'Nice pull!' : 'Common but welcome!'}</div>
            <div className={styles.resultCaine}>🎩 "{caineWinQuotes[Math.floor(Math.random() * caineWinQuotes.length)]}"</div>
            <button className={styles.resultClose} onClick={() => setShowResult(false)}>COLLECT</button>
          </div>
        </div>
      )}
    </div>
  );
}
