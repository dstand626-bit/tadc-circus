import { useState, useEffect, useCallback, useRef } from 'react';

/* ─── shared styles ─────────────────────────────────────── */
const wrap: React.CSSProperties = { padding: 20, textAlign: 'center', minHeight: 400, position: 'relative', background: 'linear-gradient(135deg,rgba(10,0,37,0.9),rgba(26,0,64,0.8))', borderRadius: 20, border: '1px solid rgba(168,85,247,0.3)' };
const titleS: React.CSSProperties = { fontFamily: "'Press Start 2P',monospace", fontSize: 13, color: '#ffcc00', marginBottom: 10, textShadow: '0 0 15px rgba(255,204,0,0.4),2px 0 #ff0044,-2px 0 #00e5ff' };
const scoreS: React.CSSProperties = { fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: '#a855f7', marginBottom: 8 };
const qS: React.CSSProperties = { fontSize: 14, color: '#e0d8f0', marginBottom: 16, lineHeight: 1.7, padding: '16px 20px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 14, maxWidth: 480, margin: '0 auto 16px' };
const btn: React.CSSProperties = { padding: '10px 20px', borderRadius: 12, border: '2px solid rgba(168,85,247,0.3)', background: 'rgba(10,0,37,0.8)', color: '#c8bce4', fontSize: 12, cursor: 'pointer', margin: 4, transition: 'all 0.2s', minWidth: 200 };
const btnGood: React.CSSProperties = { ...btn, background: 'rgba(34,197,94,0.2)', borderColor: 'rgba(34,197,94,0.7)', color: '#22c55e', transform: 'scale(1.04)' };
const btnBad: React.CSSProperties = { ...btn, background: 'rgba(255,0,68,0.2)', borderColor: 'rgba(255,0,68,0.7)', color: '#ff0044' };
const timerBarWrap: React.CSSProperties = { height: 8, background: 'rgba(168,85,247,0.1)', borderRadius: 4, marginBottom: 12, overflow: 'hidden', border: '1px solid rgba(168,85,247,0.1)' };
const timerFill: React.CSSProperties = { height: '100%', background: 'linear-gradient(90deg,#ff0044,#ffcc00)', borderRadius: 4, transition: 'width 0.3s' };
const resultBox: React.CSSProperties = { marginTop: 24, padding: '20px 28px', background: 'rgba(34,197,94,0.08)', border: '2px solid rgba(34,197,94,0.3)', borderRadius: 16, display: 'inline-block' };
const resultText: React.CSSProperties = { fontFamily: "'Press Start 2P',monospace", fontSize: 14, color: '#22c55e', textShadow: '0 0 12px rgba(34,197,94,0.4)' };

interface TriviaQ { q: string; options: string[]; answer: number; }

/** ── TRIVIA GAME ── */
export function TriviaGame({ title, questions, onReward }: { title: string; questions: TriviaQ[]; onReward: (coins: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === questions[idx].answer;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(idx + 1); setSelected(null); }
      else { setDone(true); onReward(score * 10 + (correct ? 10 : 0)); }
    }, 900);
  };

  if (done) return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={resultBox}><div style={resultText}>🎉 {score}/{questions.length} correct!</div><div style={{ color: '#ffcc00', fontSize: 12, marginTop: 8 }}>+{score * 10} coins earned</div></div>
    </div>
  );

  const q = questions[idx];
  return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={{ ...scoreS, marginBottom: 4 }}>Q{idx + 1}/{questions.length} · Score: {score}</div>
      <div style={timerBarWrap}><div style={{ ...timerFill, width: `${((idx) / questions.length) * 100}%`, background: 'linear-gradient(90deg,#a855f7,#ffcc00)' }} /></div>
      <div style={qS}>{q.q}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {q.options.map((o, i) => (
          <button key={i} onClick={() => pick(i)} style={selected === null ? { ...btn, ':hover': undefined } : selected === i ? (i === q.answer ? btnGood : btnBad) : (i === q.answer && selected !== null ? btnGood : { ...btn, opacity: 0.5 })}>
            <span style={{ marginRight: 8, fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: '#a855f7' }}>{['A', 'B', 'C', 'D'][i]}.</span>{o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** ── REACTION TIME ── */
export function ReactionGame({ onReward }: { onReward: (coins: number) => void }) {
  const [phase, setPhase] = useState<'wait' | 'ready' | 'go' | 'done'>('wait');
  const [startTime, setStartTime] = useState(0);
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const startRound = useCallback(() => {
    setPhase('ready');
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => { setPhase('go'); setStartTime(Date.now()); }, delay);
  }, []);

  useEffect(() => { startRound(); return () => clearTimeout(timerRef.current); }, []);

  const handleClick = () => {
    if (phase === 'ready') { clearTimeout(timerRef.current); setPhase('wait'); setTimeout(startRound, 500); return; }
    if (phase === 'go') {
      const t = Date.now() - startTime;
      const newTimes = [...times, t];
      setTimes(newTimes);
      if (round + 1 >= 5) {
        const avg = Math.round(newTimes.reduce((a, b) => a + b) / newTimes.length);
        setPhase('done');
        onReward(avg < 250 ? 60 : avg < 400 ? 40 : avg < 600 ? 25 : 15);
      } else { setRound(round + 1); setPhase('wait'); setTimeout(startRound, 600); }
    }
  };

  const avg = times.length ? Math.round(times.reduce((a, b) => a + b) / times.length) : 0;
  const bgs = { wait: 'rgba(10,0,37,0.9)', ready: 'rgba(80,0,0,0.9)', go: 'rgba(0,50,0,0.9)', done: 'rgba(10,0,37,0.9)' };

  if (phase === 'done') return (
    <div style={wrap}>
      <div style={titleS}>⚡ Reaction Time</div>
      <div style={resultBox}>
        <div style={resultText}>Avg: {avg}ms</div>
        <div style={{ color: avg < 250 ? '#22c55e' : avg < 400 ? '#ffcc00' : '#ff6600', fontSize: 11, marginTop: 8 }}>
          {avg < 250 ? '⚡ LIGHTNING FAST!' : avg < 400 ? '👍 Pretty good!' : '🐢 Keep practicing!'}
        </div>
        <div style={{ color: '#a855f7', fontSize: 9, marginTop: 6, fontFamily: "'Press Start 2P',monospace" }}>
          +{avg < 250 ? 60 : avg < 400 ? 40 : avg < 600 ? 25 : 15} coins
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ ...wrap, background: bgs[phase], cursor: 'pointer', userSelect: 'none', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }} onClick={handleClick}>
      <div style={titleS}>⚡ Reaction Time — Round {round + 1}/5</div>
      <div style={{ fontSize: 72 }}>{phase === 'go' ? '🟢' : phase === 'ready' ? '🔴' : '⚪'}</div>
      <div style={{ fontSize: 16, color: phase === 'go' ? '#22c55e' : phase === 'ready' ? '#ff0044' : '#a855f7', fontFamily: "'Press Start 2P',monospace", fontSize: 11 }}>
        {phase === 'wait' ? 'Get ready...' : phase === 'ready' ? '⚠️ Wait for GREEN...' : '🖱️ CLICK NOW!'}
      </div>
      {times.length > 0 && <div style={{ ...scoreS, color: '#ffcc00' }}>Last: {times[times.length - 1]}ms</div>}
    </div>
  );
}

/** ── MEMORY MATCH ── */
export function MemoryGame({ emojis, onReward }: { emojis: string[]; onReward: (coins: number) => void }) {
  const pairs = emojis.slice(0, 6);
  const [cards] = useState(() => [...pairs, ...pairs].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const flip = (i: number) => {
    if (flipped.length === 2 || flipped.includes(i) || matched.includes(i)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (cards[next[0]] === cards[next[1]]) {
        setMatched(m => [...m, ...next]); setFlipped([]);
        if (matched.length + 2 === cards.length) onReward(Math.max(10, 70 - moves * 3));
      } else { setTimeout(() => setFlipped([]), 700); }
    }
  };

  if (matched.length === cards.length) return (
    <div style={wrap}>
      <div style={titleS}>🃏 Memory Match</div>
      <div style={resultBox}><div style={resultText}>🎉 Matched in {moves} moves!</div><div style={{ color: '#ffcc00', fontSize: 11, marginTop: 8 }}>+{Math.max(10, 70 - moves * 3)} coins</div></div>
    </div>
  );

  return (
    <div style={wrap}>
      <div style={titleS}>🃏 Memory Match</div>
      <div style={scoreS}>Moves: {moves} · Pairs: {matched.length / 2}/{pairs.length}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxWidth: 280, margin: '0 auto' }}>
        {cards.map((c, i) => {
          const show = flipped.includes(i) || matched.includes(i);
          const isMatch = matched.includes(i);
          return (
            <div key={i} onClick={() => flip(i)} style={{ width: 60, height: 60, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: show ? 28 : 20, cursor: 'pointer', background: isMatch ? 'rgba(34,197,94,0.15)' : show ? 'rgba(168,85,247,0.15)' : 'rgba(10,0,37,0.8)', border: `2px solid ${isMatch ? 'rgba(34,197,94,0.5)' : show ? 'rgba(168,85,247,0.5)' : 'rgba(168,85,247,0.15)'}`, transition: 'all 0.2s', transform: show ? 'scale(1.05)' : 'scale(1)', boxShadow: show ? '0 0 12px rgba(168,85,247,0.2)' : 'none' }}>
              {show ? c : '?'}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** ── DODGE GAME (Action) — move left/right to dodge falling enemies ── */
export function DodgeGame({ enemy, title, onReward }: { enemy: string; title: string; onReward: (coins: number) => void }) {
  const [playerX, setPlayerX] = useState(50);
  const [enemies, setEnemies] = useState<{ id: number; x: number; y: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(25);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [hit, setHit] = useState(false);
  const [lives, setLives] = useState(3);
  const idRef = useRef(0);
  const playerRef = useRef(50);
  const livesRef = useRef(3);
  const doneRef = useRef(false);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') { setPlayerX(p => Math.max(5, p - 8)); playerRef.current = Math.max(5, playerRef.current - 8); }
      if (e.key === 'ArrowRight' || e.key === 'd') { setPlayerX(p => Math.min(90, p + 8)); playerRef.current = Math.min(90, playerRef.current + 8); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => {
      if (p <= 1) { doneRef.current = true; setDone(true); clearInterval(t); return 0; }
      return p - 1;
    }), 1000);
    return () => clearInterval(t);
  }, []);

  // Spawn enemies
  useEffect(() => {
    const spawn = setInterval(() => {
      if (doneRef.current) return;
      idRef.current++;
      setEnemies(prev => [...prev, { id: idRef.current, x: 5 + Math.random() * 85, y: -5 }]);
    }, 600);
    return () => clearInterval(spawn);
  }, []);

  // Move enemies + collision
  useEffect(() => {
    const fall = setInterval(() => {
      if (doneRef.current) return;
      setEnemies(prev => {
        const next = prev.map(e => ({ ...e, y: e.y + 5 }));
        const survived: typeof next = [];
        let hitThisFrame = false;
        for (const e of next) {
          if (e.y > 105) { setScore(s => s + 1); continue; } // dodged
          const dist = Math.abs(e.x - playerRef.current);
          if (e.y > 82 && dist < 8) { hitThisFrame = true; continue; } // hit
          survived.push(e);
        }
        if (hitThisFrame) {
          setHit(true);
          setTimeout(() => setHit(false), 400);
          livesRef.current -= 1;
          setLives(livesRef.current);
          if (livesRef.current <= 0) { doneRef.current = true; setDone(true); }
        }
        return survived;
      });
    }, 80);
    return () => clearInterval(fall);
  }, []);

  const movePlayer = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(90, pct)));
    playerRef.current = Math.max(5, Math.min(90, pct));
  };

  useEffect(() => { if (done) onReward(score * 4); }, [done]);

  const coins = score * 4;

  if (done) return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={resultBox}>
        <div style={resultText}>🛡️ Survived {score} attacks!</div>
        <div style={{ color: livesRef.current <= 0 ? '#ff0044' : '#22c55e', fontSize: 11, marginTop: 8 }}>
          {livesRef.current <= 0 ? '💀 You were hit too many times!' : '🎉 Time survived!'}
        </div>
        <div style={{ color: '#ffcc00', fontFamily: "'Press Start 2P',monospace", fontSize: 9, marginTop: 8 }}>+{coins} coins</div>
      </div>
    </div>
  );

  return (
    <div style={{ ...wrap, padding: 12 }}>
      <div style={titleS}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, padding: '0 8px' }}>
        <div style={scoreS}>Score: {score}</div>
        <div style={{ ...scoreS, color: '#ff0044' }}>{'❤️'.repeat(lives)}{'🖤'.repeat(Math.max(0, 3 - lives))}</div>
        <div style={scoreS}>⏱️ {timeLeft}s</div>
      </div>
      <div style={timerBarWrap}><div style={{ ...timerFill, width: `${(timeLeft / 25) * 100}%` }} /></div>
      {/* Game arena */}
      <div onMouseMove={movePlayer} style={{ position: 'relative', width: '100%', height: 280, background: 'rgba(0,0,0,0.4)', borderRadius: 12, border: `2px solid ${hit ? '#ff0044' : 'rgba(168,85,247,0.3)'}`, overflow: 'hidden', cursor: 'none', transition: 'border-color 0.1s' }}>
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(168,85,247,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.05) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
        {/* Player */}
        <div style={{ position: 'absolute', bottom: 16, left: `${playerX}%`, transform: 'translateX(-50%)', fontSize: 32, filter: hit ? 'brightness(0.3)' : 'drop-shadow(0 0 12px rgba(0,229,255,0.6))', transition: 'left 0.05s', zIndex: 2 }}>🤡</div>
        {/* Enemies */}
        {enemies.map(e => (
          <div key={e.id} style={{ position: 'absolute', top: `${e.y}%`, left: `${e.x}%`, transform: 'translateX(-50%)', fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(255,0,68,0.5))', zIndex: 1 }}>{enemy}</div>
        ))}
        {/* Instructions */}
        {score === 0 && timeLeft > 22 && <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#6b5f8a' }}>← → Arrow keys or move mouse to dodge!</div>}
      </div>
    </div>
  );
}

/** ── WHACK GAME ── */
export function WhackGame({ emoji, title, onReward }: { emoji: string; title: string; onReward: (coins: number) => void }) {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(20);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(-1);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { setDone(true); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => {
    if (done) return;
    const speed = Math.max(400, 900 - score * 15);
    const i = setInterval(() => {
      const pos = Math.floor(Math.random() * 9);
      setActive(pos);
      setTimeout(() => setActive(-1), speed - 100);
    }, speed);
    return () => clearInterval(i);
  }, [done, score]);

  useEffect(() => { if (done) onReward(score * 6); }, [done]);

  const whack = (i: number) => {
    if (i !== active) return;
    setScore(s => s + 1);
    setFlash(i);
    setActive(-1);
    setTimeout(() => setFlash(-1), 200);
  };

  if (done) return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={resultBox}><div style={resultText}>🎯 Score: {score}!</div><div style={{ color: '#ffcc00', fontSize: 11, marginTop: 8 }}>+{score * 6} coins</div></div>
    </div>
  );

  return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', marginBottom: 6 }}>
        <div style={scoreS}>Score: {score}</div>
        <div style={{ ...scoreS, color: timeLeft <= 5 ? '#ff0044' : '#ffcc00' }}>⏱️ {timeLeft}s</div>
      </div>
      <div style={timerBarWrap}><div style={{ ...timerFill, width: `${(timeLeft / 20) * 100}%` }} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxWidth: 260, margin: '0 auto' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} onClick={() => whack(i)} style={{ width: 76, height: 76, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === active ? 32 : 14, cursor: 'pointer', background: flash === i ? 'rgba(255,204,0,0.3)' : i === active ? 'rgba(34,197,94,0.2)' : 'rgba(10,0,37,0.7)', border: `2px solid ${i === active ? 'rgba(34,197,94,0.6)' : 'rgba(168,85,247,0.15)'}`, transition: 'all 0.1s', transform: i === active ? 'scale(1.1)' : 'scale(1)', boxShadow: i === active ? '0 0 20px rgba(34,197,94,0.3)' : 'none' }}>
            {i === active ? emoji : '🕳️'}
          </div>
        ))}
      </div>
    </div>
  );
}

/** ── WORD SCRAMBLE ── */
export function ScrambleGame({ words, title, onReward }: { words: { word: string; hint: string }[]; title: string; onReward: (coins: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [scrambled] = useState(() => words.map(w => w.word.split('').sort(() => Math.random() - 0.5).join('')));

  const check = () => {
    if (!input.trim()) return;
    const correct = input.trim().toUpperCase() === words[idx].word.toUpperCase();
    setFeedback(correct ? '✓ Correct!' : `✗ Answer: ${words[idx].word}`);
    if (correct) setScore(s => s + 1);
    setInput('');
    setTimeout(() => {
      setFeedback('');
      if (idx + 1 < words.length) setIdx(idx + 1);
      else { setDone(true); onReward((score + (correct ? 1 : 0)) * 12); }
    }, 900);
  };

  if (done) return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={resultBox}><div style={resultText}>🔤 {score}/{words.length}!</div><div style={{ color: '#ffcc00', fontSize: 11, marginTop: 8 }}>+{score * 12} coins</div></div>
    </div>
  );

  return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={scoreS}>Word {idx + 1}/{words.length} · Score: {score}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        {scrambled[idx].split('').map((l, i) => (
          <div key={i} style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(168,85,247,0.12)', border: '2px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P',monospace", fontSize: 14, color: '#ffcc00' }}>{l}</div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#6b5f8a', marginBottom: 12, fontStyle: 'italic' }}>💡 Hint: {words[idx].hint}</div>
      {feedback && <div style={{ padding: '6px 16px', borderRadius: 10, display: 'inline-block', background: feedback.startsWith('✓') ? 'rgba(34,197,94,0.1)' : 'rgba(255,0,68,0.1)', color: feedback.startsWith('✓') ? '#22c55e' : '#ff0044', fontSize: 12, marginBottom: 10, border: `1px solid ${feedback.startsWith('✓') ? 'rgba(34,197,94,0.3)' : 'rgba(255,0,68,0.3)'}` }}>{feedback}</div>}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} placeholder="Type answer..." style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid rgba(168,85,247,0.3)', background: 'rgba(10,0,37,0.8)', color: '#e0d8f0', fontSize: 14, outline: 'none', width: 180 }} autoFocus />
        <button onClick={check} style={{ ...btn, minWidth: 80, background: 'rgba(168,85,247,0.2)', borderColor: 'rgba(168,85,247,0.5)', color: '#a855f7' }}>Submit</button>
      </div>
    </div>
  );
}

/** ── COIN CATCH ── */
export function CoinCatchGame({ onReward }: { onReward: (coins: number) => void }) {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<{ id: number; x: number; y: number; emoji: string; pts: number }[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [done, setDone] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { setDone(true); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (done) return;
    const spawn = setInterval(() => {
      const options = [{ emoji: '🪙', pts: 1 }, { emoji: '🪙', pts: 1 }, { emoji: '🪙', pts: 1 }, { emoji: '💎', pts: 5 }, { emoji: '⭐', pts: 3 }];
      const o = options[Math.floor(Math.random() * options.length)];
      setItems(prev => [...prev, { id: idRef.current++, x: 5 + Math.random() * 88, y: 0, ...o }]);
    }, 350);
    return () => clearInterval(spawn);
  }, [done]);

  useEffect(() => {
    if (done) return;
    const fall = setInterval(() => setItems(prev => prev.map(i => ({ ...i, y: i.y + 5 })).filter(i => i.y < 105)), 80);
    return () => clearInterval(fall);
  }, [done]);

  useEffect(() => { if (done) onReward(score * 3); }, [done]);

  const catchItem = (id: number, pts: number) => { setScore(s => s + pts); setItems(prev => prev.filter(i => i.id !== id)); };

  if (done) return (
    <div style={wrap}>
      <div style={titleS}>🪙 Coin Catch</div>
      <div style={resultBox}><div style={resultText}>🎉 {score} points!</div><div style={{ color: '#ffcc00', fontSize: 11, marginTop: 8 }}>+{score * 3} coins</div></div>
    </div>
  );

  return (
    <div style={{ ...wrap, padding: 12 }}>
      <div style={titleS}>🪙 Coin Catch</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginBottom: 6 }}>
        <div style={scoreS}>Score: {score}</div>
        <div style={{ ...scoreS, color: '#00e5ff' }}>🪙=1pt 💎=5pt ⭐=3pt</div>
        <div style={{ ...scoreS, color: timeLeft <= 5 ? '#ff0044' : '#ffcc00' }}>⏱️ {timeLeft}s</div>
      </div>
      <div style={timerBarWrap}><div style={{ ...timerFill, width: `${(timeLeft / 15) * 100}%` }} /></div>
      <div style={{ position: 'relative', width: '100%', height: 260, background: 'rgba(0,0,0,0.4)', borderRadius: 12, border: '2px solid rgba(168,85,247,0.2)', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(168,85,247,0.04) 1px,transparent 1px)', backgroundSize: '100% 40px' }}>
        {items.map(item => (
          <div key={item.id} onClick={() => catchItem(item.id, item.pts)} style={{ position: 'absolute', top: `${item.y}%`, left: `${item.x}%`, transform: 'translateX(-50%)', fontSize: 28, cursor: 'pointer', userSelect: 'none', filter: item.pts === 5 ? 'drop-shadow(0 0 10px rgba(0,229,255,0.8))' : item.pts === 3 ? 'drop-shadow(0 0 8px rgba(255,204,0,0.8))' : 'none', transition: 'top 0.08s' }}>
            {item.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

/** ── TRUE/FALSE ── */
export function TrueFalseGame({ statements, title, onReward }: { statements: { text: string; answer: boolean }[]; title: string; onReward: (coins: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(0);

  const pick = (ans: boolean) => {
    if (feedback) return;
    const correct = ans === statements[idx].answer;
    if (correct) { setScore(s => s + 1 + Math.floor(streak / 3)); setStreak(s => s + 1); setFeedback(`✓ Correct! ${streak >= 3 ? '🔥 Streak!' : ''}`); }
    else { setStreak(0); setFeedback('✗ Wrong!'); }
    setTimeout(() => {
      setFeedback('');
      if (idx + 1 < statements.length) setIdx(idx + 1);
      else { setDone(true); onReward(score * 8); }
    }, 900);
  };

  if (done) return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={resultBox}><div style={resultText}>⚖️ {score}/{statements.length}!</div><div style={{ color: '#ffcc00', fontSize: 11, marginTop: 8 }}>+{score * 8} coins</div></div>
    </div>
  );

  return (
    <div style={wrap}>
      <div style={titleS}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={scoreS}>Q{idx + 1}/{statements.length} · Score: {score}</div>
        {streak >= 3 && <div style={{ ...scoreS, color: '#ff6600' }}>🔥 x{streak} streak!</div>}
      </div>
      <div style={{ ...timerBarWrap, marginBottom: 16 }}><div style={{ ...timerFill, width: `${(idx / statements.length) * 100}%`, background: 'linear-gradient(90deg,#00e5ff,#a855f7)' }} /></div>
      <div style={qS}>{statements[idx].text}</div>
      {feedback && <div style={{ padding: '8px 20px', borderRadius: 12, display: 'inline-block', marginBottom: 12, background: feedback.startsWith('✓') ? 'rgba(34,197,94,0.12)' : 'rgba(255,0,68,0.12)', color: feedback.startsWith('✓') ? '#22c55e' : '#ff0044', fontSize: 12, border: `1px solid ${feedback.startsWith('✓') ? 'rgba(34,197,94,0.3)' : 'rgba(255,0,68,0.3)'}` }}>{feedback}</div>}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <button onClick={() => pick(true)} style={{ ...btn, minWidth: 120, borderColor: 'rgba(34,197,94,0.4)', color: '#22c55e' }}>✅ TRUE</button>
        <button onClick={() => pick(false)} style={{ ...btn, minWidth: 120, borderColor: 'rgba(255,0,68,0.4)', color: '#ff0044' }}>❌ FALSE</button>
      </div>
    </div>
  );
}
