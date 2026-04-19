import { useState, useEffect, useRef } from 'react';
import { useWallet } from './use-wallet.js';
import { getCaineQuote } from './caine-quotes.js';
import styles from './shop-page.module.css';

interface ShopItem { name: string; emoji: string; category: string; cost: number; currency: 'coins' | 'gems'; desc?: string; }

const shopCategories = [
  { id: 'all', label: '🎪 All', emoji: '🎪' },
  { id: 'coin-chests', label: '🪙 Coin Chests', emoji: '🪙' },
  { id: 'gem-chests', label: '💎 Gem Chests', emoji: '💎' },
  { id: 'spin-passes', label: '🎡 Spin Passes', emoji: '🎡' },
  { id: 'arcade-packs', label: '🕹️ Arcade Packs', emoji: '🕹️' },
  { id: 'secret-passes', label: '🔑 Secret Passes', emoji: '🔑' },

  { id: 'avatars', label: '👤 Avatars', emoji: '👤' },
  { id: 'titles', label: '🏷️ Titles', emoji: '🏷️' },
  { id: 'collectibles', label: '🎭 Collectibles', emoji: '🎭' },
  { id: 'furniture', label: '🛋️ Furniture', emoji: '🛋️' },
  { id: 'lore-notes', label: '📝 Lore Notes', emoji: '📝' },
  { id: 'backgrounds', label: '🎨 Backgrounds', emoji: '🎨' },
];

const items: ShopItem[] = [
  { name: 'Tiny Coin Chest', emoji: '🪙', category: 'coin-chests', cost: 50, currency: 'coins', desc: 'Contains 75 coins' },
  { name: 'Small Coin Chest', emoji: '🪙', category: 'coin-chests', cost: 100, currency: 'coins', desc: 'Contains 150 coins' },
  { name: 'Medium Coin Chest', emoji: '🪙', category: 'coin-chests', cost: 250, currency: 'coins', desc: 'Contains 400 coins' },
  { name: 'Big Coin Chest', emoji: '🪙', category: 'coin-chests', cost: 500, currency: 'coins', desc: 'Contains 900 coins' },
  { name: 'Huge Coin Chest', emoji: '🪙', category: 'coin-chests', cost: 25, currency: 'gems', desc: 'Contains 2000 coins' },
  { name: 'Titanic Coin Chest', emoji: '💰', category: 'coin-chests', cost: 50, currency: 'gems', desc: 'Contains 5000 coins' },
  { name: "Caine's Gold Stash", emoji: '👑', category: 'coin-chests', cost: 100, currency: 'gems', desc: 'Contains 12000 coins' },
  { name: 'Tiny Gem Chest', emoji: '💎', category: 'gem-chests', cost: 100, currency: 'coins', desc: 'Contains 3 gems' },
  { name: 'Small Gem Chest', emoji: '💎', category: 'gem-chests', cost: 200, currency: 'coins', desc: 'Contains 8 gems' },
  { name: 'Medium Gem Chest', emoji: '💎', category: 'gem-chests', cost: 400, currency: 'coins', desc: 'Contains 18 gems' },
  { name: 'Big Gem Chest', emoji: '💎', category: 'gem-chests', cost: 25, currency: 'gems', desc: 'Contains 40 gems' },
  { name: 'Huge Gem Chest', emoji: '💎', category: 'gem-chests', cost: 50, currency: 'gems', desc: 'Contains 90 gems' },
  { name: 'Titanic Gem Chest', emoji: '🔮', category: 'gem-chests', cost: 80, currency: 'gems', desc: 'Contains 180 gems' },
  { name: 'Void Crystal Cache', emoji: '🌌', category: 'gem-chests', cost: 150, currency: 'gems', desc: 'Contains 400 gems' },
  { name: 'Spin Pass x1', emoji: '🎡', category: 'spin-passes', cost: 100, currency: 'coins', desc: 'Skip the 4h cooldown once' },
  { name: 'Spin Pass x3', emoji: '🎡', category: 'spin-passes', cost: 250, currency: 'coins', desc: 'Three extra spins' },
  { name: 'Spin Pass x10', emoji: '🎡', category: 'spin-passes', cost: 20, currency: 'gems', desc: 'Ten extra spins' },
  { name: 'Infinite Spin Token', emoji: '♾️', category: 'spin-passes', cost: 75, currency: 'gems', desc: 'Unlimited spins for 24 hours' },
  { name: 'Action Pack', emoji: '👾', category: 'arcade-packs', cost: 300, currency: 'coins', desc: 'Unlocks 8 action games' },
  { name: 'Puzzle Pack', emoji: '🧩', category: 'arcade-packs', cost: 300, currency: 'coins', desc: 'Unlocks 9 puzzle games' },
  { name: 'Trivia Pack', emoji: '🧠', category: 'arcade-packs', cost: 300, currency: 'coins', desc: 'Unlocks 8 trivia games' },
  { name: 'Lore Pack', emoji: '📜', category: 'arcade-packs', cost: 400, currency: 'coins', desc: 'Unlocks 8 lore games' },
  { name: 'All Games Bundle', emoji: '🎪', category: 'arcade-packs', cost: 75, currency: 'gems', desc: 'Unlocks ALL locked games' },
  { name: 'Boss Rush Pack', emoji: '💀', category: 'arcade-packs', cost: 500, currency: 'coins', desc: 'Unlocks 5 boss rush challenges' },
  { name: 'Speedrun Pack', emoji: '⏱️', category: 'arcade-packs', cost: 350, currency: 'coins', desc: 'Unlocks timed challenge modes' },
  { name: 'Nightmare Pack', emoji: '💀', category: 'arcade-packs', cost: 600, currency: 'coins', desc: 'Unlocks 8 nightmare difficulty games' },
  { name: 'Void Pass', emoji: '🕳️', category: 'secret-passes', cost: 200, currency: 'coins', desc: 'Enter The Void (consumed on use)' },
  { name: "Caine's Office Pass", emoji: '🎩', category: 'secret-passes', cost: 300, currency: 'coins', desc: "Enter Caine's Office (consumed)" },
  { name: 'Cellar Pass', emoji: '🪜', category: 'secret-passes', cost: 15, currency: 'gems', desc: 'Enter The Cellar (consumed)' },
  { name: "Kaufmo's Room Pass", emoji: '🚪', category: 'secret-passes', cost: 200, currency: 'coins', desc: "Enter Kaufmo's Room (consumed)" },
  { name: 'Glitch Zone Pass', emoji: '⚡', category: 'secret-passes', cost: 15, currency: 'gems', desc: 'Enter Glitch Zone (consumed)' },
  { name: 'Original Circus Pass', emoji: '🎠', category: 'secret-passes', cost: 300, currency: 'coins', desc: 'Enter Original Circus (consumed)' },
  { name: 'Candy Canyon Pass', emoji: '🍬', category: 'secret-passes', cost: 200, currency: 'coins', desc: 'Enter Candy Canyon (consumed)' },
  { name: 'Manor Pass', emoji: '🏚️', category: 'secret-passes', cost: 200, currency: 'coins', desc: 'Enter Mildenhall Manor (consumed)' },
  { name: "Spudsy's Pass", emoji: '🍟', category: 'secret-passes', cost: 150, currency: 'coins', desc: "Enter Spudsy's (consumed)" },
  { name: 'Digital Lake Pass', emoji: '🏖️', category: 'secret-passes', cost: 150, currency: 'coins', desc: 'Enter Digital Lake (consumed)' },
  { name: 'Carnival Pass', emoji: '🎡', category: 'secret-passes', cost: 100, currency: 'coins', desc: 'Enter Carnival Grounds (consumed)' },
  { name: "C&A Offices Pass", emoji: '🏢', category: 'secret-passes', cost: 25, currency: 'gems', desc: 'Enter C&A Offices (consumed)' },
  { name: 'Stasis Pods Pass', emoji: '💊', category: 'secret-passes', cost: 25, currency: 'gems', desc: 'Enter Stasis Pods (consumed)' },
  { name: 'Underwater Pass', emoji: '🫧', category: 'secret-passes', cost: 30, currency: 'gems', desc: 'Under the Digital Lake (consumed)' },
  { name: "Abel's Hideout Pass", emoji: '🎭', category: 'secret-passes', cost: 40, currency: 'gems', desc: "Enter Abel's Hideout (consumed)" },
  { name: 'All Secrets Bundle', emoji: '🔑', category: 'secret-passes', cost: 100, currency: 'gems', desc: 'Permanent access to ALL 15 areas' },

  { name: 'Pomni Avatar', emoji: '🤡', category: 'avatars', cost: 150, currency: 'coins', desc: 'The Newest Arrival' },
  { name: 'Caine Avatar', emoji: '🎩', category: 'avatars', cost: 150, currency: 'coins', desc: 'The AI Ringmaster' },
  { name: 'Jax Avatar', emoji: '🐰', category: 'avatars', cost: 150, currency: 'coins', desc: 'The Prankster' },
  { name: 'Ragatha Avatar', emoji: '🧸', category: 'avatars', cost: 150, currency: 'coins', desc: 'The Optimist' },
  { name: 'Gangle Avatar', emoji: '🎭', category: 'avatars', cost: 150, currency: 'coins', desc: 'The Fragile One' },
  { name: 'Kinger Avatar', emoji: '♟️', category: 'avatars', cost: 150, currency: 'coins', desc: 'The Veteran' },
  { name: 'Zooble Avatar', emoji: '🧩', category: 'avatars', cost: 150, currency: 'coins', desc: 'The Realist' },
  { name: 'Bubble Avatar', emoji: '🫧', category: 'avatars', cost: 150, currency: 'coins', desc: "Caine's Assistant" },
  { name: 'Abstracted Avatar', emoji: '💀', category: 'avatars', cost: 30, currency: 'gems', desc: 'Black polygonal spikes...' },
  { name: 'Gummigoo Avatar', emoji: '🤠', category: 'avatars', cost: 200, currency: 'coins', desc: 'The NPC who felt' },
  { name: 'Abel Avatar', emoji: '🎭', category: 'avatars', cost: 35, currency: 'gems', desc: 'The Mannequin' },
  { name: 'Queenie Avatar', emoji: '👑', category: 'avatars', cost: 35, currency: 'gems', desc: 'The Lost Queen' },
  { name: 'Circus Performer', emoji: '🎪', category: 'titles', cost: 100, currency: 'coins', desc: 'Basic performer title' },
  { name: 'Void Walker', emoji: '🌀', category: 'titles', cost: 200, currency: 'coins', desc: "You've seen the void" },
  { name: 'Lore Master', emoji: '📖', category: 'titles', cost: 300, currency: 'coins', desc: 'Knows all the secrets' },
  { name: 'Abstraction Survivor', emoji: '💀', category: 'titles', cost: 25, currency: 'gems', desc: 'Survived the collapse' },
  { name: "Caine's Favorite", emoji: '🎩', category: 'titles', cost: 400, currency: 'coins', desc: '"Any torment is accidental!"' },
  { name: 'Ringmaster', emoji: '🎪', category: 'titles', cost: 50, currency: 'gems', desc: 'You ARE the circus' },
  { name: 'Digital Ghost', emoji: '👻', category: 'titles', cost: 30, currency: 'gems', desc: 'Neither here nor there' },
  { name: 'War Criminal', emoji: '⚔️', category: 'titles', cost: 500, currency: 'coins', desc: 'Like any good one!' },
  { name: 'Parasite', emoji: '🫧', category: 'titles', cost: 35, currency: 'gems', desc: 'YOU PARASITE!' },
  { name: 'Bee Doodle', emoji: '🐝', category: 'collectibles', cost: 500, currency: 'coins', desc: "Caine's innocent drawing" },
  { name: 'Comedy Mask', emoji: '😊', category: 'collectibles', cost: 200, currency: 'coins', desc: "Gangle's happy side" },
  { name: 'Tragedy Mask', emoji: '😢', category: 'collectibles', cost: 200, currency: 'coins', desc: "Gangle's default" },
  { name: 'Exit Door', emoji: '🚪', category: 'collectibles', cost: 50, currency: 'gems', desc: "It's fake. It's always fake." },
  { name: 'Red Button', emoji: '🔴', category: 'collectibles', cost: 40, currency: 'gems', desc: 'Jax pressed it.' },
  { name: 'VR Headset', emoji: '🥽', category: 'collectibles', cost: 45, currency: 'gems', desc: 'How it all began' },
  { name: 'Gloink', emoji: '🟢', category: 'collectibles', cost: 150, currency: 'coins', desc: 'Squishy. Annoying.' },
  { name: 'Candy Cane Sword', emoji: '🗡️', category: 'collectibles', cost: 300, currency: 'coins', desc: 'From Candy Canyon' },
  { name: "C&A Badge", emoji: '🏷️', category: 'collectibles', cost: 250, currency: 'coins', desc: 'Employee of the month' },
  { name: 'Healing Butterfly', emoji: '🦋', category: 'collectibles', cost: 60, currency: 'gems', desc: "Kinger's creation from belief" },
  { name: 'Circus Tent Lamp', emoji: '🏮', category: 'furniture', cost: 150, currency: 'coins', desc: 'Warm circus glow' },
  { name: 'Ball Pit', emoji: '🔵', category: 'furniture', cost: 300, currency: 'coins', desc: "Don't fall in" },
  { name: 'Mini Golf Set', emoji: '⛳', category: 'furniture', cost: 250, currency: 'coins', desc: 'Digital holes in one' },
  { name: "Kinger's Pillow Fort", emoji: '🏰', category: 'furniture', cost: 40, currency: 'gems', desc: 'Ultimate defense' },
  { name: 'Neon Sign', emoji: '💡', category: 'furniture', cost: 200, currency: 'coins', desc: '"The show must go on"' },
  { name: 'Jester Hat Stand', emoji: '🃏', category: 'furniture', cost: 175, currency: 'coins', desc: 'For your hat collection' },
  { name: 'Digital Aquarium', emoji: '🐠', category: 'furniture', cost: 350, currency: 'coins', desc: "Fish aren't real either" },
  { name: 'Void Window', emoji: '🪟', category: 'furniture', cost: 50, currency: 'gems', desc: 'Stare into nothing' },
  { name: 'Abstracted Trophy', emoji: '🏆', category: 'furniture', cost: 45, currency: 'gems', desc: 'A dark reminder' },
  { name: "C&A Employee File", emoji: '📄', category: 'lore-notes', cost: 200, currency: 'coins', desc: 'Personnel records' },
  { name: "Queenie's Letter", emoji: '💌', category: 'lore-notes', cost: 300, currency: 'coins', desc: 'To Kinger, forever' },
  { name: 'Abel Manifest', emoji: '📋', category: 'lore-notes', cost: 30, currency: 'gems', desc: "The other AI's plan" },
  { name: "Kaufmo's Journal", emoji: '📔', category: 'lore-notes', cost: 250, currency: 'coins', desc: 'His last days...' },
  { name: "Caine's Source Code", emoji: '💻', category: 'lore-notes', cost: 50, currency: 'gems', desc: 'First-draft creative AI' },
  { name: "Ribbit's Goodbye", emoji: '🐸', category: 'lore-notes', cost: 200, currency: 'coins', desc: 'Jax never recovered' },
  { name: "Scratch's Blueprints", emoji: '🐕', category: 'lore-notes', cost: 35, currency: 'gems', desc: 'Genius with abstract ideas' },
  { name: 'SOMA Theory Report', emoji: '🧬', category: 'lore-notes', cost: 40, currency: 'gems', desc: 'Digital copies, walking away' },
  { name: 'Main Tent', emoji: '🎪', category: 'backgrounds', cost: 100, currency: 'coins', desc: 'Garish sensory overload' },
  { name: 'Candy Canyon', emoji: '🍬', category: 'backgrounds', cost: 150, currency: 'coins', desc: 'Everything is edible' },
  { name: 'Mildenhall Manor', emoji: '🏚️', category: 'backgrounds', cost: 150, currency: 'coins', desc: 'Body horror warning' },
  { name: 'The Void', emoji: '🕳️', category: 'backgrounds', cost: 200, currency: 'coins', desc: 'Infinite. Silent.' },
  { name: 'Digital Lake', emoji: '🏖️', category: 'backgrounds', cost: 25, currency: 'gems', desc: 'Calm before the storm' },
  { name: "Spudsy's", emoji: '🍟', category: 'backgrounds', cost: 150, currency: 'coins', desc: 'ORDER UP!' },
  { name: 'The Carnival', emoji: '🎡', category: 'backgrounds', cost: 175, currency: 'coins', desc: 'Rides and nightmares' },
  { name: "C&A Offices", emoji: '🏢', category: 'backgrounds', cost: 30, currency: 'gems', desc: 'Computer still running' },
  { name: 'The Cellar', emoji: '🪜', category: 'backgrounds', cost: 35, currency: 'gems', desc: "Where they're kept" },
  { name: 'Stasis Pods', emoji: '💊', category: 'backgrounds', cost: 40, currency: 'gems', desc: 'VR headsets active' },
];

const coinChestAmounts: Record<string, number> = { 'Tiny Coin Chest': 75, 'Small Coin Chest': 150, 'Medium Coin Chest': 400, 'Big Coin Chest': 900, 'Huge Coin Chest': 2000, 'Titanic Coin Chest': 5000, "Caine's Gold Stash": 12000 };
const gemChestAmounts: Record<string, number> = { 'Tiny Gem Chest': 3, 'Small Gem Chest': 8, 'Medium Gem Chest': 18, 'Big Gem Chest': 40, 'Huge Gem Chest': 90, 'Titanic Gem Chest': 180, 'Void Crystal Cache': 400 };

/** Categories where items can only be purchased once */
const oneTimeCats = ['avatars', 'titles', 'collectibles', 'furniture', 'lore-notes', 'backgrounds', 'arcade-packs'];

/**
 * Shop page — grouped categories, one-time purchase enforcement, confetti effects
 */
export function ShopPage() {
  const [cat, setCat] = useState('all');
  const [purchaseInfo, setPurchaseInfo] = useState<{ name: string; quote: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wallet = useWallet();
  const { coins, gems, spendCoins, spendGems, addCoins, addGems, addToInventory } = wallet;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { if (purchaseInfo) { const t = setTimeout(() => setPurchaseInfo(null), 3500); return () => clearTimeout(t); } }, [purchaseInfo]);
  useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 2000); return () => clearTimeout(t); } }, [error]);

  useEffect(() => {
    if (!purchaseInfo || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }[] = [];
    const colors = ['#ffcc00', '#ff0044', '#00e5ff', '#a855f7', '#22c55e', '#f97316', '#ff69b4', '#3b82f6'];
    for (let i = 0; i < 120; i++) {
      particles.push({ x: canvas.width / 2 + (Math.random() - 0.5) * 200, y: canvas.height / 2 + (Math.random() - 0.5) * 100, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 4, color: colors[Math.floor(Math.random() * colors.length)], size: 3 + Math.random() * 5, life: 1 });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.012;
        ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
      }
      if (alive) animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [purchaseInfo]);

  /** Check if an item is one-time and already owned */
  const checkOwned = (item: ShopItem): boolean => {
    if (!oneTimeCats.includes(item.category)) return false;
    return wallet.hasItem(item.name);
  };

  const handleBuy = (item: ShopItem) => {
    if (checkOwned(item)) { setError('Already owned!'); return; }
    const success = item.currency === 'coins' ? spendCoins(item.cost) : spendGems(item.cost);
    if (!success) { setError(`Not enough ${item.currency}!`); return; }
    if (coinChestAmounts[item.name]) { addCoins(coinChestAmounts[item.name]); }
    else if (gemChestAmounts[item.name]) { addGems(gemChestAmounts[item.name]); }
    else { addToInventory(item.name, item.emoji, item.category); }
    const quote = getCaineQuote(item.category);
    setPurchaseInfo({ name: item.name, quote });
  };

  const renderCard = (item: ShopItem) => {
    const owned = checkOwned(item);
    return (
      <div key={item.name} className={styles.card} style={owned ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
        <div className={styles.cardEmoji}>{item.emoji}</div>
        <div className={styles.cardName}>{item.name}</div>
        {item.desc && <div className={styles.cardDesc}>{item.desc}</div>}
        <div className={styles.cardCost}>{item.currency === 'coins' ? '🪙' : '💎'} {item.cost}</div>
        {owned ? <div style={{ color: '#22c55e', fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}>✓ OWNED</div> : <button className={styles.buyBtn} onClick={() => handleBuy(item)}>BUY</button>}
      </div>
    );
  };

  const renderItems = () => {
    if (cat !== 'all') {
      return <div className={styles.grid}>{items.filter(i => i.category === cat).map(renderCard)}</div>;
    }
    return shopCategories.filter(c => c.id !== 'all').map(catDef => {
      const catItems = items.filter(i => i.category === catDef.id);
      if (catItems.length === 0) return null;
      return (
        <div key={catDef.id} className={styles.catSection}>
          <h3 className={styles.catHeader}>{catDef.label}</h3>
          <div className={styles.grid}>{catItems.map(renderCard)}</div>
        </div>
      );
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🛒 CAINE'S SHOP</h1>
      <p className={styles.subtitle}>{items.length} items · 🪙 {coins} coins · 💎 {gems} gems</p>
      <div className={styles.catRow}>
        {shopCategories.map(c => (
          <button key={c.id} className={`${styles.catBtn} ${cat === c.id ? styles.catActive : ''}`} onClick={() => setCat(c.id)}>{c.label}</button>
        ))}
      </div>
      {renderItems()}
      {error && (
        <div className={styles.purchaseOverlay}>
          <div className={styles.purchasePopup} style={{ borderColor: 'rgba(255,0,68,0.5)' }}>
            <div className={styles.purchaseEmoji}>❌</div>
            <div className={styles.purchaseTitle} style={{ color: '#ff0044' }}>{error}</div>
          </div>
        </div>
      )}
      {purchaseInfo && (
        <div className={styles.purchaseOverlay}>
          <canvas ref={canvasRef} className={styles.confettiCanvas} />
          <div className={styles.purchasePopup}>
            <div className={styles.purchaseTitle}>PURCHASED!</div>
            <div className={styles.purchaseItem}>{purchaseInfo.name}</div>
            <div className={styles.purchaseCaine}>🎩 "{purchaseInfo.quote}" — Caine</div>
          </div>
        </div>
      )}
    </div>
  );
}
