import { useState, useEffect, useRef } from 'react';
import { useWallet } from './use-wallet.js';
import { itemLore } from './item-lore.js';
import styles from './profile-page.module.css';

const TITLE_KEY = 'tadc_active_title';
const BADGES_KEY = 'tadc_badges';
const NAME_KEY = 'tadc_username';
const BIO_KEY = 'tadc_bio';
const AVATAR_KEY = 'tadc_avatar';

const invCatLabels: Record<string, string> = {
  'spin-passes': '🎡 Spin Passes', 'arcade-packs': '🕹️ Arcade Packs', 'secret-passes': '🔑 Secret Passes',
  'avatars': '👤 Avatars', 'titles': '🏷️ Titles', 'collectibles': '🎭 Collectibles',
  'furniture': '🛋️ Furniture', 'lore-notes': '📝 Lore Notes', 'backgrounds': '🎨 Backgrounds',
};

interface Badge { id: string; name: string; emoji: string; desc: string; bio: string; check: (c: number, g: number, ic: number) => boolean; }
const badgeDefs: Badge[] = [
  { id: 'first-steps', name: 'First Steps', emoji: '🎪', desc: 'Enter the circus', bio: 'You put on the headset. You\'re here. Welcome to The Amazing Digital Circus. There\'s no going back.', check: () => true },
  { id: 'coin-collector', name: 'Coin Collector', emoji: '💰', desc: 'Have 1000+ coins', bio: 'Gold, gold, GOLD! You\'ve amassed a fortune in Caine\'s digital economy. He\'s simultaneously impressed and threatened.', check: (c) => c >= 1000 },
  { id: 'gem-hoarder', name: 'Gem Hoarder', emoji: '💎', desc: 'Have 100+ gems', bio: 'Precious stones for a precious prisoner. You\'ve collected more gems than Caine thought possible from inside a digital circus.', check: (_, g) => g >= 100 },
  { id: 'big-spender', name: 'Big Spender', emoji: '🛒', desc: 'Own 10+ items', bio: 'Your inventory bursts with circus memorabilia. Caine: "Decorating your prison — I mean, ROOM! How domestic!"', check: (_, __, ic) => ic >= 10 },
  { id: 'spinner', name: 'Daily Spinner', emoji: '🎡', desc: 'Use the spin wheel', bio: 'You\'ve spun Caine\'s Wheel of Fortune. Gambling in a digital hell — truly the TADC experience.', check: () => !!localStorage.getItem('tadc_last_spin') },
  { id: 'witness', name: 'Witness', emoji: '⚡', desc: "Trigger Caine's Glitch", bio: 'You watched the breakdown. "I AM GOD." The circus destabilized. Caine\'s code cracked. You saw the truth.', check: () => true },
  { id: 'wealthy', name: 'Digital Tycoon', emoji: '👑', desc: 'Have 5000+ coins', bio: 'You own the circus economy. Caine mutters: "Don\'t they know what I\'m CAPABLE of?!" He\'s jealous.', check: (c) => c >= 5000 },
  { id: 'collector', name: 'Collector', emoji: '📦', desc: 'Own 25+ items', bio: 'A fine addition to your collection! Just like YOU are a fine addition to MINE! An impressive hoard of artifacts.', check: (_, __, ic) => ic >= 25 },
  { id: 'veteran', name: 'Circus Veteran', emoji: '♟️', desc: 'Spent 1+ hour here', bio: 'Like Kinger, you\'ve been here a while. The longest-surviving visitor. He nods with recognition. "I miss real rain."', check: () => { const fv = localStorage.getItem('tadc_first_visit'); return fv ? (Date.now() - Number(fv)) > 3600000 : false; } },
  { id: 'gem-rich', name: 'Crystal Lord', emoji: '🔮', desc: 'Have 500+ gems', bio: 'More gems than the Void has cubes. An astronomical fortune in digital precious stones. Even Caine is impressed.', check: (_, g) => g >= 500 },
];

const defaultAvatars = ['🤡', '🎩', '🧸', '🐰', '🎭', '♟️', '🧩', '🫧', '👤', '🎪'];

function getSaved(key: string, def: string) { return localStorage.getItem(key) || def; }
function setSaved(key: string, val: string) { localStorage.setItem(key, val); }
function getEarnedBadges(): Record<string, string> {
  try { const r = localStorage.getItem(BADGES_KEY); if (r) return JSON.parse(r); } catch { }
  return {};
}
function saveEarnedBadges(b: Record<string, string>) { localStorage.setItem(BADGES_KEY, JSON.stringify(b)); }

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m ${s % 60}s`;
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

/**
 * Full profile page — editable name, bio, avatar, title, badges, inventory
 */
export function ProfilePage() {
  const [tab, setTab] = useState<'profile' | 'inventory' | 'badges'>('profile');
  const [elapsed, setElapsed] = useState('');
  const [readingItem, setReadingItem] = useState<{ name: string; emoji: string; category: string } | null>(null);
  const [viewingBadge, setViewingBadge] = useState<Badge | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const { coins, gems, inventory } = useWallet();
  const [earnedBadges, setEarnedBadges] = useState<Record<string, string>>(getEarnedBadges());

  // Editable profile fields
  const [username, setUsername] = useState(getSaved(NAME_KEY, 'Circus Visitor'));
  const [bio, setBio] = useState(getSaved(BIO_KEY, 'Trapped in the Amazing Digital Circus. Still looking for the exit.'));
  const [avatar, setAvatar] = useState(getSaved(AVATAR_KEY, '🤡'));
  const [title, setTitle] = useState(getSaved(TITLE_KEY, 'Circus Performer'));
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showTitlePicker, setShowTitlePicker] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingName) nameRef.current?.focus();
  }, [editingName]);
  useEffect(() => {
    if (editingBio) bioRef.current?.focus();
  }, [editingBio]);

  const saveUsername = () => { setSaved(NAME_KEY, username); setEditingName(false); };
  const saveBio = () => { setSaved(BIO_KEY, bio); setEditingBio(false); };
  const selectAvatar = (a: string) => { setAvatar(a); setSaved(AVATAR_KEY, a); setShowAvatarPicker(false); };
  const selectTitle = (t: string) => { setTitle(t); setSaved(TITLE_KEY, t); setShowTitlePicker(false); };

  // Timer
  useEffect(() => {
    const key = 'tadc_first_visit';
    let fv = localStorage.getItem(key);
    if (!fv) { fv = String(Date.now()); localStorage.setItem(key, fv); }
    const start = Number(fv);
    const tick = () => setElapsed(formatElapsed(Date.now() - start));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Badge checker
  useEffect(() => {
    const invCount = inventory.reduce((s, i) => s + i.count, 0);
    const current = getEarnedBadges();
    let changed = false;
    for (const b of badgeDefs) {
      if (!current[b.id] && b.check(coins, gems, invCount)) {
        current[b.id] = new Date().toISOString();
        changed = true;
        setNotification(`🏅 Badge earned: ${b.emoji} ${b.name}! — Caine: "How... impressive."`);
      }
    }
    if (changed) { saveEarnedBadges(current); setEarnedBadges({ ...current }); }
  }, [coins, gems, inventory]);

  useEffect(() => { if (notification) { const t = setTimeout(() => setNotification(null), 4500); return () => clearTimeout(t); } }, [notification]);

  // Inventory grouping
  const groupedInventory: Record<string, typeof inventory> = {};
  for (const item of inventory) {
    if (!groupedInventory[item.category]) groupedInventory[item.category] = [];
    groupedInventory[item.category].push(item);
  }

  const ownedAvatarItems = inventory.filter(i => i.category === 'avatars').map(i => i.emoji);
  const allAvatars = [...defaultAvatars, ...ownedAvatarItems];
  const ownedTitles = inventory.filter(i => i.category === 'titles').map(i => i.name);
  const allTitles = ['Circus Performer', 'Void Walker', ...ownedTitles];

  const lore = readingItem ? itemLore[readingItem.name] : null;
  const earnedCount = Object.keys(earnedBadges).length;
  const invTotal = inventory.reduce((s, i) => s + i.count, 0);

  return (
    <div className={styles.page}>
      {/* Badge notification */}
      {notification && <div className={styles.notification}>{notification}</div>}

      <h1 className={styles.title}>👤 YOUR PROFILE</h1>

      <div className={styles.tabs}>
        {(['profile', 'inventory', 'badges'] as const).map(t => (
          <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
            {t === 'profile' ? '👤 Profile' : t === 'inventory' ? `🎒 Inventory (${invTotal})` : `🏅 Badges (${earnedCount}/${badgeDefs.length})`}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <div className={styles.profileCard}>
          <div className={styles.profileGlow} />
          {/* Rainbow top bar */}
          <div className={styles.profileTopBar} />

          {/* Avatar */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatar} onClick={() => { setShowAvatarPicker(p => !p); setShowTitlePicker(false); }}>{avatar}</div>
            <div className={styles.avatarHint}>Click to change</div>
          </div>

          {/* Avatar picker */}
          {showAvatarPicker && (
            <div className={styles.pickerGrid}>
              {allAvatars.map((a, i) => (
                <button key={i} className={`${styles.pickerItem} ${a === avatar ? styles.pickerActive : ''}`} onClick={() => selectAvatar(a)}>{a}</button>
              ))}
            </div>
          )}

          {/* Editable username */}
          <div className={styles.usernameRow}>
            {editingName ? (
              <div className={styles.editRow}>
                <input ref={nameRef} className={styles.editInput} value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveUsername()} maxLength={24} placeholder="Your name..." />
                <button className={styles.editSave} onClick={saveUsername}>✓</button>
                <button className={styles.editCancel} onClick={() => setEditingName(false)}>✕</button>
              </div>
            ) : (
              <div className={styles.usernameDisplay} onClick={() => { setEditingName(true); setShowAvatarPicker(false); }}>
                {username} <span className={styles.editIcon}>✏️</span>
              </div>
            )}
          </div>

          {/* Title picker */}
          <div className={styles.titleSection}>
            <button className={styles.titleBtn} onClick={() => { setShowTitlePicker(p => !p); setShowAvatarPicker(false); }}>
              🎪 {title} ▾
            </button>
            {showTitlePicker && (
              <div className={styles.titleDropdown}>
                {allTitles.map(t => (
                  <button key={t} className={`${styles.titleOption} ${title === t ? styles.titleOptionActive : ''}`} onClick={() => selectTitle(t)}>{t}</button>
                ))}
                <div className={styles.titleHint}>Buy more titles in the Shop!</div>
              </div>
            )}
          </div>

          {/* Editable bio */}
          <div className={styles.bioSection}>
            {editingBio ? (
              <div className={styles.bioEditWrap}>
                <textarea ref={bioRef} className={styles.bioEdit} value={bio} onChange={e => setBio(e.target.value)} maxLength={140} rows={3} placeholder="Write your circus bio..." />
                <div className={styles.bioEditRow}>
                  <span className={styles.bioCount}>{bio.length}/140</span>
                  <button className={styles.editSave} onClick={saveBio}>Save Bio</button>
                  <button className={styles.editCancel} onClick={() => setEditingBio(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className={styles.bioDisplay} onClick={() => { setEditingBio(true); setShowAvatarPicker(false); }}>
                <span className={styles.bioText}>{bio}</span>
                <span className={styles.bioEditHint}>✏️ Click to edit</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statEmoji}>🪙</span>
              <span className={styles.statVal}>{coins.toLocaleString()}</span>
              <span className={styles.statLabel}>Coins</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statEmoji}>💎</span>
              <span className={styles.statVal}>{gems.toLocaleString()}</span>
              <span className={styles.statLabel}>Gems</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statEmoji}>🏅</span>
              <span className={styles.statVal}>{earnedCount}</span>
              <span className={styles.statLabel}>Badges</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statEmoji}>📦</span>
              <span className={styles.statVal}>{invTotal}</span>
              <span className={styles.statLabel}>Items</span>
            </div>
          </div>

          {/* Time trapped */}
          <div className={styles.daysTrapped}>
            <span className={styles.daysLabel}>⏱️ TIME TRAPPED IN THE CIRCUS</span>
            <span className={styles.daysNumber}>{elapsed}</span>
          </div>

          <div className={styles.note}>"We are literally in hell right now. HELL." — Pomni</div>
        </div>
      )}

      {/* ── INVENTORY TAB ── */}
      {tab === 'inventory' && (
        <div className={styles.inventoryWrap}>
          {Object.keys(groupedInventory).length === 0 && (
            <div className={styles.emptyInv}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎒</div>
              <div>Your inventory is empty!</div>
              <div style={{ fontSize: 11, marginTop: 6, color: '#6b5f8a' }}>Visit the Shop to buy items</div>
            </div>
          )}
          {Object.entries(groupedInventory).map(([catKey, items]) => (
            <div key={catKey} className={styles.invCatSection}>
              <h3 className={styles.invCatHeader}>{invCatLabels[catKey] || catKey}</h3>
              <div className={styles.invGrid}>
                {items.map(item => {
                  const hasLore = !!itemLore[item.name];
                  return (
                    <div key={item.name} className={`${styles.invCard} ${hasLore ? styles.invCardLore : ''}`} onClick={() => hasLore ? setReadingItem(item) : null}>
                      <span className={styles.invEmoji}>{item.emoji}</span>
                      <span className={styles.invName}>{item.name}</span>
                      {item.count > 1 && <span className={styles.invCount}>x{item.count}</span>}
                      {hasLore ? <span className={styles.invReadable}>📖 Read</span> : <span className={styles.invOwned}>✓ Owned</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── BADGES TAB ── */}
      {tab === 'badges' && (
        <div className={styles.badgesWrap}>
          <div className={styles.badgesHeader}>
            <span className={styles.badgesCount}>{earnedCount} / {badgeDefs.length} earned</span>
            <div className={styles.badgesBar}>
              <div className={styles.badgesBarFill} style={{ width: `${(earnedCount / badgeDefs.length) * 100}%` }} />
            </div>
          </div>
          <div className={styles.badgeGrid}>
            {badgeDefs.map(b => {
              const earned = !!earnedBadges[b.id];
              return (
                <div key={b.id} className={`${styles.badge} ${earned ? styles.badgeEarned : styles.badgeLocked}`} onClick={() => earned ? setViewingBadge(b) : null}>
                  <span className={styles.badgeEmoji}>{b.emoji}</span>
                  <span className={styles.badgeName}>{b.name}</span>
                  <span className={styles.badgeDesc}>{earned ? b.desc : '???'}</span>
                  {earned && <span className={styles.badgeCheck}>✓</span>}
                  {!earned && <span className={styles.badgeLockIcon}>🔒</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Item reading modal */}
      {readingItem && lore && (
        <div className={styles.readOverlay} onClick={() => setReadingItem(null)}>
          <div className={styles.readModal} onClick={e => e.stopPropagation()}>
            <button className={styles.readClose} onClick={() => setReadingItem(null)}>✕</button>
            <div className={styles.readEmoji}>{readingItem.emoji}</div>
            <div className={styles.readName}>{readingItem.name}</div>
            <div className={styles.readCat}>{invCatLabels[readingItem.category] || readingItem.category}</div>
            <div className={styles.readBio}>{lore.bio}</div>
            {lore.loreText && (
              <div className={styles.readLoreWrap}>
                <div className={styles.readLoreLabel}>📜 FULL TEXT</div>
                <pre className={styles.readLoreText}>{lore.loreText}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badge viewing modal */}
      {viewingBadge && (
        <div className={styles.readOverlay} onClick={() => setViewingBadge(null)}>
          <div className={styles.readModal} onClick={e => e.stopPropagation()}>
            <button className={styles.readClose} onClick={() => setViewingBadge(null)}>✕</button>
            <div className={styles.readEmoji}>{viewingBadge.emoji}</div>
            <div className={styles.readName}>{viewingBadge.name}</div>
            <div className={styles.readCat}>🏅 BADGE EARNED</div>
            <div className={styles.readBio}>{viewingBadge.bio}</div>
            {earnedBadges[viewingBadge.id] && (
              <div className={styles.badgeDateEarned}>
                ✓ Earned on {new Date(earnedBadges[viewingBadge.id]).toLocaleDateString()} at {new Date(earnedBadges[viewingBadge.id]).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
