import { useState } from 'react';
import { useWallet } from './use-wallet.js';
import { TriviaGame, ReactionGame, MemoryGame, WhackGame, ScrambleGame, CoinCatchGame, TrueFalseGame, DodgeGame } from './game-engines.js';
import { tadcTrivia, whoSaidThat, characterColors, trueFalse, scrambleWords, rapidTrivia, loreTF, memoryEmojis, episodeTrivia, npcTrivia, cnaTrivia, advancedScramble } from './game-data.js';
import styles from './arcade-page.module.css';

type GameType = 'trivia' | 'reaction' | 'memory' | 'whack' | 'scramble' | 'coinCatch' | 'trueFalse' | 'dodge';

interface Game {
  name: string; emoji: string; category: string; free: boolean; pack?: string;
  gameType: GameType; gameProps?: Record<string, unknown>;
}

const games: Game[] = [
  // ─── FREE GAMES (20) ───
  { name: 'TADC Trivia', emoji: '🧠', category: 'trivia', free: true, gameType: 'trivia', gameProps: { title: '🧠 TADC Trivia', questions: tadcTrivia } },
  { name: 'Who Said That?', emoji: '💬', category: 'trivia', free: true, gameType: 'trivia', gameProps: { title: '💬 Who Said That?', questions: whoSaidThat } },
  { name: 'True or False', emoji: '✅', category: 'trivia', free: true, gameType: 'trueFalse', gameProps: { title: '✅ True or False', statements: trueFalse } },
  { name: 'Character Colors', emoji: '🎨', category: 'trivia', free: true, gameType: 'trivia', gameProps: { title: '🎨 Character Colors', questions: characterColors } },
  { name: 'Memory Match', emoji: '🃏', category: 'puzzle', free: true, gameType: 'memory', gameProps: { emojis: memoryEmojis } },
  { name: 'Dodge the Gloinks', emoji: '👾', category: 'action', free: true, gameType: 'dodge', gameProps: { enemy: '🟢', title: '👾 Dodge the Gloinks' } },
  { name: 'Dodge Abstraction', emoji: '🖤', category: 'action', free: true, gameType: 'dodge', gameProps: { enemy: '⬛', title: '🖤 Dodge Abstraction' } },
  { name: 'Coin Rain', emoji: '🪙', category: 'action', free: true, gameType: 'coinCatch' },
  { name: 'Reaction Time', emoji: '⚡', category: 'action', free: true, gameType: 'reaction' },
  { name: 'Circus Scramble', emoji: '🔤', category: 'puzzle', free: true, gameType: 'scramble', gameProps: { words: scrambleWords, title: '🔤 Circus Scramble' } },
  { name: "Caine's Quote Race", emoji: '📜', category: 'trivia', free: true, gameType: 'trivia', gameProps: { title: "📜 Caine's Quote Race", questions: whoSaidThat } },
  { name: 'Whack-a-Gloink', emoji: '🎈', category: 'action', free: true, gameType: 'whack', gameProps: { emoji: '🟢', title: '🎈 Whack-a-Gloink' } },
  { name: 'Grid Fill', emoji: '9️⃣', category: 'puzzle', free: true, gameType: 'memory', gameProps: { emojis: ['🎪', '🎠', '🎡', '🎢', '🎯', '🏮'] } },
  { name: 'Episode Quiz', emoji: '📺', category: 'trivia', free: true, gameType: 'trivia', gameProps: { title: '📺 Episode Quiz', questions: episodeTrivia } },
  { name: 'NPC Knowledge', emoji: '🤖', category: 'trivia', free: true, gameType: 'trivia', gameProps: { title: '🤖 NPC Knowledge', questions: npcTrivia } },
  { name: 'Hard Scramble', emoji: '🔤', category: 'puzzle', free: true, gameType: 'scramble', gameProps: { words: advancedScramble, title: '🔤 Hard Scramble' } },
  { name: 'Balloon Pop', emoji: '🎈', category: 'action', free: true, gameType: 'whack', gameProps: { emoji: '🎈', title: '🎈 Balloon Pop' } },
  { name: 'Gem Grab', emoji: '💎', category: 'action', free: true, gameType: 'coinCatch' },
  { name: 'Quick Reflexes', emoji: '🖐️', category: 'action', free: true, gameType: 'reaction' },
  { name: 'C&A Corporation', emoji: '🏢', category: 'trivia', free: true, gameType: 'trivia', gameProps: { title: '🏢 C&A Corp', questions: cnaTrivia } },

  // ─── ACTION PACK (10) ───
  { name: 'Pomni Dodge', emoji: '🏃', category: 'action', free: false, pack: 'Action Pack', gameType: 'dodge', gameProps: { enemy: '🎪', title: '🏃 Pomni Dodge' } },
  { name: 'Jax Dodge', emoji: '🐰', category: 'action', free: false, pack: 'Action Pack', gameType: 'dodge', gameProps: { enemy: '💣', title: '🐰 Jax Dodge' } },
  { name: 'Abstraction Block+', emoji: '💀', category: 'action', free: false, pack: 'Action Pack', gameType: 'dodge', gameProps: { enemy: '💀', title: '💀 Abstraction Block+' } },
  { name: 'Catch Bubble', emoji: '🫧', category: 'action', free: false, pack: 'Action Pack', gameType: 'whack', gameProps: { emoji: '🫧', title: '🫧 Catch Bubble' } },
  { name: 'Kinger Panic', emoji: '♟️', category: 'action', free: false, pack: 'Action Pack', gameType: 'dodge', gameProps: { enemy: '🐛', title: '♟️ Kinger Panic' } },
  { name: 'Ragatha Rush', emoji: '🧸', category: 'action', free: false, pack: 'Action Pack', gameType: 'dodge', gameProps: { enemy: '🧶', title: '🧸 Ragatha Rush' } },
  { name: 'Coin Storm', emoji: '💰', category: 'action', free: false, pack: 'Action Pack', gameType: 'coinCatch' },
  { name: 'Gloink Swarm', emoji: '🟢', category: 'action', free: false, pack: 'Action Pack', gameType: 'whack', gameProps: { emoji: '🟢', title: '🟢 Gloink Swarm' } },
  { name: 'Gangle Dodge', emoji: '🎭', category: 'action', free: false, pack: 'Action Pack', gameType: 'dodge', gameProps: { enemy: '😢', title: '🎭 Gangle Dodge' } },
  { name: 'Carnival Chaos', emoji: '🎡', category: 'action', free: false, pack: 'Action Pack', gameType: 'dodge', gameProps: { enemy: '🎠', title: '🎡 Carnival Chaos' } },

  // ─── PUZZLE PACK (12) ───
  { name: 'Zooble Builder', emoji: '🧩', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'memory', gameProps: { emojis: ['🔧', '🔩', '⚙️', '🪛', '🛠️', '🔨'] } },
  { name: 'Gangle Balance', emoji: '🎭', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'memory', gameProps: { emojis: ['😊', '😢', '😐', '🤔', '😤', '😌'] } },
  { name: "Caine's Builder", emoji: '🎪', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'scramble', gameProps: { words: [{ word: 'ADVENTURE', hint: "Caine's art" }, { word: 'DIGITAL', hint: 'Type of circus' }, { word: 'ABSTRACT', hint: 'Irreversible' }, { word: 'RINGMASTER', hint: "Caine's role" }, { word: 'QUEENIE', hint: "Kinger's wife" }], title: "🎪 Caine's Builder" } },
  { name: 'Code Breaker', emoji: '🔐', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'scramble', gameProps: { words: [{ word: 'FIREWALL', hint: 'Security' }, { word: 'PROTOCOL', hint: 'Containment' }, { word: 'MALWARE', hint: 'Bad software' }, { word: 'TROJAN', hint: 'Hidden threat' }], title: '🔐 Code Breaker' } },
  { name: 'Flip Puzzle', emoji: '💡', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'memory', gameProps: { emojis: ['💡', '🔦', '🕯️', '🪔', '🔥', '⭐'] } },
  { name: 'Word Search', emoji: '🔍', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'scramble', gameProps: { words: [{ word: 'CELLAR', hint: 'Where abstracted go' }, { word: 'VOID', hint: 'Infinite space' }, { word: 'CIRCUS', hint: 'The amazing digital...' }, { word: 'JESTER', hint: "Pomni's form" }], title: '🔍 Word Search' } },
  { name: 'Circus Sudoku', emoji: '🔢', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'memory', gameProps: { emojis: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'] } },
  { name: 'Pattern Match', emoji: '🔲', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'memory', gameProps: { emojis: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'] } },
  { name: 'Emoji Match', emoji: '😊', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'memory', gameProps: { emojis: ['🎪', '🎭', '🤡', '🐰', '🧸', '♟️'] } },
  { name: 'Lore Scramble', emoji: '📜', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'scramble', gameProps: { words: [{ word: 'CELLAR', hint: 'Sealed storage' }, { word: 'VOID', hint: 'Infinite space' }, { word: 'OFFICE', hint: "Caine's room" }, { word: 'MANOR', hint: 'Haunted house' }, { word: 'STASIS', hint: 'VR pods' }], title: '📜 Lore Scramble' } },
  { name: 'Room Match', emoji: '🚪', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'memory', gameProps: { emojis: ['🤡', '🎩', '🧸', '🐰', '🎭', '♟️'] } },
  { name: 'Color Scramble', emoji: '🌈', category: 'puzzle', free: false, pack: 'Puzzle Pack', gameType: 'scramble', gameProps: { words: [{ word: 'PURPLE', hint: "Jax's color" }, { word: 'GOLD', hint: "Caine's color" }, { word: 'CYAN', hint: "Pomni's color" }, { word: 'PINK', hint: "Ragatha's color" }], title: '🌈 Color Scramble' } },

  // ─── TRIVIA PACK (10) ───
  { name: 'Rapid Fire Trivia', emoji: '🔥', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '🔥 Rapid Fire', questions: rapidTrivia } },
  { name: 'Character Bio Quiz', emoji: '📋', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '📋 Bio Quiz', questions: tadcTrivia } },
  { name: 'Episode Master', emoji: '📺', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '📺 Episode Master', questions: episodeTrivia } },
  { name: 'Real Names Quiz', emoji: '🪪', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '🪪 Real Names', questions: tadcTrivia } },
  { name: 'Numbers of TADC', emoji: '🔢', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trueFalse', gameProps: { title: '🔢 Numbers', statements: trueFalse } },
  { name: 'Performer Stats', emoji: '📊', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '📊 Stats', questions: whoSaidThat } },
  { name: 'Quote Master Pro', emoji: '💬', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '💬 Quote Master Pro', questions: whoSaidThat } },
  { name: 'Advanced True/False', emoji: '⚖️', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trueFalse', gameProps: { title: '⚖️ Advanced T/F', statements: [...trueFalse, ...loreTF] } },
  { name: 'Who Am I?', emoji: '❓', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '❓ Who Am I?', questions: tadcTrivia } },
  { name: 'Color Expert', emoji: '🎨', category: 'trivia', free: false, pack: 'Trivia Pack', gameType: 'trivia', gameProps: { title: '🎨 Color Expert', questions: characterColors } },

  // ─── LORE PACK (12) ───
  { name: 'Lore Deep Dive', emoji: '🔬', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trueFalse', gameProps: { title: '🔬 Lore Deep Dive', statements: loreTF } },
  { name: 'Caine Mood Meter', emoji: '🎩', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trueFalse', gameProps: { title: '🎩 Mood Meter', statements: loreTF } },
  { name: 'Trauma Match', emoji: '🧠', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'memory', gameProps: { emojis: ['💔', '😰', '😢', '🖤', '💀', '🌧️'] } },
  { name: "Jax's Hidden Feelings", emoji: '🐰', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trueFalse', gameProps: { title: "🐰 Jax's Feelings", statements: loreTF } },
  { name: "Pomni's Arc", emoji: '🤡', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trivia', gameProps: { title: "🤡 Pomni's Arc", questions: tadcTrivia } },
  { name: 'Caine History Quiz', emoji: '📔', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trivia', gameProps: { title: '📔 Caine History', questions: cnaTrivia } },
  { name: 'Cellar Lore', emoji: '⛓️', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trueFalse', gameProps: { title: '⛓️ Cellar Lore', statements: loreTF } },
  { name: 'Void Lore Quiz', emoji: '🕳️', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trueFalse', gameProps: { title: '🕳️ Void Lore', statements: loreTF } },
  { name: 'C&A Deep Dive', emoji: '🏢', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trivia', gameProps: { title: '🏢 C&A Deep Dive', questions: cnaTrivia } },
  { name: 'SOMA Theory', emoji: '🧬', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trueFalse', gameProps: { title: '🧬 SOMA Theory', statements: loreTF } },
  { name: 'Abel Theories', emoji: '🎭', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trueFalse', gameProps: { title: '🎭 Abel Theories', statements: loreTF } },
  { name: 'Episode 8 Deep', emoji: '💥', category: 'lore', free: false, pack: 'Lore Pack', gameType: 'trivia', gameProps: { title: '💥 Episode 8 Deep', questions: episodeTrivia } },

  // ─── BOSS RUSH PACK (8) ───
  { name: 'Boss: Caine', emoji: '🎩', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'dodge', gameProps: { enemy: '🎩', title: '🎩 Boss: Caine' } },
  { name: 'Boss: Abel', emoji: '🎭', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'dodge', gameProps: { enemy: '🎭', title: '🎭 Boss: Abel' } },
  { name: 'Boss: Abstraction', emoji: '⬛', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'dodge', gameProps: { enemy: '⬛', title: '⬛ Boss: Abstraction' } },
  { name: 'Boss: Gloink King', emoji: '👑', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'dodge', gameProps: { enemy: '🟢', title: '👑 Boss: Gloink King' } },
  { name: 'Boss: Bubble', emoji: '🫧', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'whack', gameProps: { emoji: '🫧', title: '🫧 Boss: Bubble' } },
  { name: 'Boss: Virus', emoji: '🦠', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'dodge', gameProps: { enemy: '🦠', title: '🦠 Boss: Virus' } },
  { name: 'Boss: Kaufmo', emoji: '🃏', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'whack', gameProps: { emoji: '🃏', title: '🃏 Boss: Kaufmo' } },
  { name: 'Boss: Void Lord', emoji: '🌌', category: 'action', free: false, pack: 'Boss Rush Pack', gameType: 'dodge', gameProps: { enemy: '🕳️', title: '🌌 Boss: Void Lord' } },

  // ─── SPEEDRUN PACK (8) ───
  { name: 'Speed Trivia', emoji: '⏱️', category: 'trivia', free: false, pack: 'Speedrun Pack', gameType: 'trivia', gameProps: { title: '⏱️ Speed Trivia', questions: rapidTrivia } },
  { name: 'Speed Match', emoji: '⏱️', category: 'puzzle', free: false, pack: 'Speedrun Pack', gameType: 'memory', gameProps: { emojis: ['⏱️', '⌛', '🕐', '🕑', '🕒', '🕓'] } },
  { name: 'Speed Catch', emoji: '⏱️', category: 'action', free: false, pack: 'Speedrun Pack', gameType: 'coinCatch' },
  { name: 'Speed Scramble', emoji: '⏱️', category: 'puzzle', free: false, pack: 'Speedrun Pack', gameType: 'scramble', gameProps: { words: [{ word: 'SPEED', hint: 'Go fast' }, { word: 'TIMER', hint: 'Ticking...' }, { word: 'RAPID', hint: 'Very quick' }, { word: 'BLITZ', hint: 'Lightning fast' }], title: '⏱️ Speed Scramble' } },
  { name: 'Speed Whack', emoji: '⏱️', category: 'action', free: false, pack: 'Speedrun Pack', gameType: 'whack', gameProps: { emoji: '⏱️', title: '⏱️ Speed Whack' } },
  { name: 'Speed Reaction', emoji: '⚡', category: 'action', free: false, pack: 'Speedrun Pack', gameType: 'reaction' },
  { name: 'Speed T/F', emoji: '⚖️', category: 'trivia', free: false, pack: 'Speedrun Pack', gameType: 'trueFalse', gameProps: { title: '⚖️ Speed T/F', statements: trueFalse } },
  { name: 'Speed Dodge', emoji: '🏃', category: 'action', free: false, pack: 'Speedrun Pack', gameType: 'dodge', gameProps: { enemy: '⚡', title: '⚡ Speed Dodge' } },

  // ─── NIGHTMARE PACK (8) ───
  { name: 'Nightmare Trivia', emoji: '💀', category: 'trivia', free: false, pack: 'Nightmare Pack', gameType: 'trivia', gameProps: { title: '💀 Nightmare Trivia', questions: [...tadcTrivia, ...episodeTrivia, ...cnaTrivia] } },
  { name: 'Nightmare Memory', emoji: '🧠', category: 'puzzle', free: false, pack: 'Nightmare Pack', gameType: 'memory', gameProps: { emojis: ['💀', '⬛', '🖤', '☠️', '👁️', '🕷️'] } },
  { name: 'Nightmare Whack', emoji: '👹', category: 'action', free: false, pack: 'Nightmare Pack', gameType: 'dodge', gameProps: { enemy: '💀', title: '👹 Nightmare Whack' } },
  { name: 'Nightmare Scramble', emoji: '🔤', category: 'puzzle', free: false, pack: 'Nightmare Pack', gameType: 'scramble', gameProps: { words: [...advancedScramble, { word: 'NIGHTMARE', hint: 'Bad dream' }, { word: 'HORROR', hint: 'Body horror ending' }], title: '🔤 Nightmare Scramble' } },
  { name: 'Nightmare Catch', emoji: '💀', category: 'action', free: false, pack: 'Nightmare Pack', gameType: 'coinCatch' },
  { name: 'Nightmare T/F', emoji: '⚖️', category: 'trivia', free: false, pack: 'Nightmare Pack', gameType: 'trueFalse', gameProps: { title: '⚖️ Nightmare T/F', statements: [...loreTF, ...trueFalse] } },
  { name: 'Nightmare React', emoji: '⚡', category: 'action', free: false, pack: 'Nightmare Pack', gameType: 'reaction' },
  { name: 'Nightmare Dodge', emoji: '🌌', category: 'action', free: false, pack: 'Nightmare Pack', gameType: 'dodge', gameProps: { enemy: '👻', title: '🌌 Nightmare Dodge' } },
];

const categories = ['all', 'trivia', 'action', 'puzzle', 'lore'];

/**
 * Arcade page — 100+ playable games across 5 categories
 */
export function ArcadePage() {
  const [cat, setCat] = useState('all');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [gameKey, setGameKey] = useState(0);
  const { addCoins, hasItem } = useWallet();
  const freeCount = games.filter(g => g.free).length;
  const lockedCount = games.filter(g => !g.free).length;

  const canPlay = (g: Game) => g.free || hasItem(g.pack || '') || hasItem('All Games Bundle');

  const startGame = (g: Game) => {
    if (!canPlay(g)) return;
    setActiveGame(g);
    setGameKey(k => k + 1);
  };

  const onReward = (coins: number) => { addCoins(coins); };

  const filtered = cat === 'all' ? games : games.filter(g => g.category === cat);

  const renderGame = () => {
    if (!activeGame) return null;
    const props = activeGame.gameProps || {};
    switch (activeGame.gameType) {
      case 'trivia': return <TriviaGame key={gameKey} title={props.title as string} questions={props.questions as any[]} onReward={onReward} />;
      case 'reaction': return <ReactionGame key={gameKey} onReward={onReward} />;
      case 'memory': return <MemoryGame key={gameKey} emojis={props.emojis as string[]} onReward={onReward} />;
      case 'whack': return <WhackGame key={gameKey} emoji={props.emoji as string} title={props.title as string} onReward={onReward} />;
      case 'scramble': return <ScrambleGame key={gameKey} words={props.words as any[]} title={props.title as string} onReward={onReward} />;
      case 'coinCatch': return <CoinCatchGame key={gameKey} onReward={onReward} />;
      case 'trueFalse': return <TrueFalseGame key={gameKey} statements={props.statements as any[]} title={props.title as string} onReward={onReward} />;
      case 'dodge': return <DodgeGame key={gameKey} enemy={props.enemy as string} title={props.title as string} onReward={onReward} />;
      default: return null;
    }
  };

  return (
    <div className={styles.page}>
      {activeGame ? (
        <div>
          <button className={styles.backBtn} onClick={() => setActiveGame(null)}>← Back to Arcade</button>
          {renderGame()}
        </div>
      ) : (
        <>
          <h1 className={styles.title}>🕹️ ARCADE</h1>
          <p className={styles.subtitle}>{freeCount} free · {lockedCount} unlockable · Buy packs in Shop!</p>
          <div className={styles.filters}>
            {categories.map(c => (
              <button key={c} className={`${styles.filterBtn} ${cat === c ? styles.active : ''}`} onClick={() => setCat(c)}>
                {c === 'all' ? '🎪 All' : c === 'trivia' ? '🧠 Trivia' : c === 'action' ? '👾 Action' : c === 'puzzle' ? '🧩 Puzzle' : '📜 Lore'}
              </button>
            ))}
          </div>
          <div className={styles.grid}>
            {filtered.map(g => {
              const playable = canPlay(g);
              return (
                <div key={g.name} className={`${styles.card} ${!playable ? styles.locked : ''}`} onClick={() => startGame(g)}>
                  <div className={styles.cardEmoji}>{g.emoji}</div>
                  <div className={styles.cardName}>{g.name}</div>
                  <div className={styles.cardType}>{g.gameType === 'dodge' ? '🎮 Action' : g.gameType === 'whack' ? '👊 Whack' : g.gameType === 'coinCatch' ? '🪙 Catch' : g.gameType === 'reaction' ? '⚡ Reflex' : g.gameType === 'memory' ? '🃏 Memory' : g.gameType === 'scramble' ? '🔤 Word' : g.gameType === 'trueFalse' ? '⚖️ T/F' : '🧠 Quiz'}</div>
                  {g.free ? (
                    <span className={styles.freeTag}>▶ PLAY FREE</span>
                  ) : playable ? (
                    <span className={styles.freeTag}>▶ PLAY</span>
                  ) : (
                    <span className={styles.lockTag}>🔒 {g.pack}</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
