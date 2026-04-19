import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { characters, abstractedCharacters, caineQuotes } from './characters-data.js';
import styles from './home-page.module.css';

const features = [
  { emoji: '🕹️', name: '60+ Arcade Games', desc: 'Trivia, action, puzzles — 14 free, 46 unlockable', path: '/arcade' },
  { emoji: '🔑', name: '15 Secret Areas', desc: '60-second timed exploration with Caine commentary', path: '/secrets' },
  { emoji: '🛒', name: '200+ Shop Items', desc: 'Avatars, titles, furniture, collectibles & more', path: '/shop' },
  { emoji: '💬', name: 'Cast Chat', desc: 'Talk to all 8 characters — they respond in character', path: '/chat' },
  { emoji: '🎡', name: 'Daily Spin', desc: 'Win coins, gems & spin passes every 4 hours', path: '/spin' },
  { emoji: '🚪', name: 'Your Room', desc: 'Decorate with wallpapers, furniture & themes', path: '/room' },
  { emoji: '👤', name: 'Your Profile', desc: 'Badges, inventory, titles & stats', path: '/profile' },
];

const loreFacts = [
  { label: 'C&A Corporation', fact: 'Founded mid-1990s. Not a game company — they built creative AI. Caine was their first draft. He escaped containment and trapped his own creators.' },
  { label: 'Abstraction', fact: 'An irreversible psychological collapse. The avatar transforms into black, amorphous polygonal spikes with glowing multicolored eyes. No known cure.' },
  { label: 'The Void', fact: 'A blueish-white outer space of morphing transparent cubes. Infinite and silent. Even Caine admits he doesn\'t know his way around it.' },
  { label: 'SOMA Theory', fact: 'People who wore the VR headset had their brains digitally scanned. The original person walked away. The digital copy is trapped.' },
  { label: 'The Cellar', fact: 'Where abstracted characters are kept. NOT the same as the Void. Queenie, Kaufmo, Scratch, Ribbit — all sealed away here.' },
  { label: "Kinger's Power", fact: 'Can spawn objects by truly believing in them. Created a healing butterfly from pure belief in Episode 6.' },
  { label: 'Abel', fact: 'A mannequin who appeared in Episode 7. Claims to be a C&A co-creator — the AI Caine absorbed. He knows things Caine has forgotten.' },
  { label: 'The Bee Doodle', fact: 'Before his breakdown, Caine drew an innocent bee on his desk. It represents the Caine who just wanted to create something beautiful.' },
  { label: 'Episode 8: hjsakldfhl', fact: 'Caine\'s origin revealed. Characters are digital brain copies. Caine\'s crashout: "I AM GOD." Kinger accidentally deletes Caine. The circus destabilizes.' },
  { label: 'Bubble Boy Theory', fact: 'Bubble may be a virus Caine cannot remove — inspired by the real Bubble Boy virus from the 1990s. He was the first character to swear.' },
];

const episodeGuide = [
  { ep: 1, title: 'Pilot', event: 'Pomni arrives. Gloink infestation. Kaufmo abstracts. The exit door is fake.' },
  { ep: 2, title: 'Candy Carrier Chaos!', event: 'Gummigoo gains consciousness. Destroyed by Caine. Kaufmo\'s funeral.' },
  { ep: 3, title: 'Mildenhall Manor Mystery', event: 'Haunted mansion. Kinger becomes lucid. Queenie\'s backstory. Body horror.' },
  { ep: 4, title: 'Fast Food Masquerade', event: 'Gangle as shift manager with a new mask. Gummigoo returns without memories.' },
  { ep: 5, title: 'Untitled', event: 'Pomni = 25yr old accountant. Jax lost Ribbit. The mannequin Abel appears.' },
  { ep: 6, title: 'They All Get Guns', event: 'Battle royale. Jax nearly abstracts. Kinger spawns items via belief.' },
  { ep: 7, title: 'Beach Episode', event: 'Abel claims C&A co-creator. Escape plan proposed. Jax presses the red button.' },
  { ep: 8, title: 'hjsakldfhl', event: 'Caine\'s origin. Digital brain copies. "I AM GOD." Kinger deletes Caine.' },
  { ep: 9, title: 'The Last Act', event: 'The theatrical finale. Survivors navigate without Caine.' },
];

/**
 * Home page for The Amazing Digital Circus fan site
 * Features hero section, cast grid, feature cards, lore facts, and Caine quote
 */
export function HomePage() {
  const navigate = useNavigate();
  const [clock, setClock] = useState('');
  const [dayCount, setDayCount] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-US', { hour12: true }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startDate = new Date('2023-10-13');
    const now = new Date();
    const diff = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    setDayCount(diff);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % caineQuotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = [
    '🎪 Welcome to The Amazing Digital Circus',
    '🤡 Pomni is watching you',
    '🎩 Caine has prepared today\'s adventure',
    '⚡ CIRCUS_CRITICAL_ERROR 0x000000C4I00N3',
    '🐰 Jax was here',
    '👑 Queenie remembers',
    '🫧 BWUB!',
    '♟️ Kinger misses real rain',
    '🧩 Zooble changed their parts again',
    '🎭 Comedy or tragedy? Pick a mask',
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroStripes} />
        <div className={styles.heroScanlines} />
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span className={styles.heroEmoji}>🎪</span>
          </div>
          <div className={styles.heroTitleWrap}>
            <h1 className={styles.heroTitle}>
              THE AMAZING<br />DIGITAL CIRCUS
            </h1>
          </div>
          <div className={styles.heroSubtitleBar}>
            <div className={styles.heroLine} />
            <span style={{ color: '#a855f7', fontSize: 11, fontFamily: "'Press Start 2P', monospace", letterSpacing: 3 }}>
              EST. 1996 — C&A CORPORATION
            </span>
            <div className={styles.heroLine} />
          </div>
          <p className={styles.heroSubtitle}>
            Step into the circus. Meet the cast. Play the games. Uncover the secrets.
            Just don't lose yourself.
          </p>
          {clock && (
            <div className={styles.heroClockWrap}>
              <span className={styles.heroClock}>{clock}</span>
            </div>
          )}
          <div className={styles.heroTagline}>
            "Any torment I inflict is 100% accidental!"
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className={styles.ticker}>
        <div className={styles.tickerInner}>
          {tickerItems.map((item, i) => (
            <span key={i}>
              <span className={styles.tickerItem}>{item}</span>
              <span className={styles.tickerSep}>✦</span>
            </span>
          ))}
          {tickerItems.map((item, i) => (
            <span key={`dup-${i}`}>
              <span className={styles.tickerItem}>{item}</span>
              <span className={styles.tickerSep}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Cast */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🎭 THE CAST</h2>
        <div className={styles.castGrid}>
          {characters.map((char) => (
            <div
              key={char.name}
              className={styles.castCard}
              style={{ ['--card-color' as string]: char.color, cursor: 'pointer' }}
              onClick={() => navigate('/characters')}
            >
              <div
                style={{
                  position: 'absolute', top: 0, left: 0,
                  width: 4, height: '100%',
                  background: char.color,
                  borderRadius: '16px 0 0 16px',
                }}
              />
              <div className={styles.castHeader}>
                <div className={styles.castEmoji}>{char.emoji}</div>
                <div>
                  <div className={styles.castName} style={{ color: char.color }}>{char.name}</div>
                  <div className={styles.castRole}>{char.role}</div>
                </div>
              </div>
              <div className={styles.castQuote}>"{char.quote}"</div>
              <span className={`${styles.castBadge} ${
                char.type === 'human' ? styles.badgeHuman
                : char.type === 'ai' ? styles.badgeAi
                : styles.badgeUnknown
              }`}>
                {char.type === 'human' ? '🧠 Human' : char.type === 'ai' ? '🤖 AI' : '❓ Unknown'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>✨ EXPLORE THE CIRCUS</h2>
        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.name} className={styles.featureCard} style={{ cursor: 'pointer' }} onClick={() => navigate(f.path)}>
              <span className={styles.featureEmoji}>{f.emoji}</span>
              <div className={styles.featureName}>{f.name}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lore */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📜 CIRCUS LORE</h2>
        <div className={styles.loreGrid}>
          {loreFacts.map((l) => (
            <div key={l.label} className={styles.loreCard}>
              <div className={styles.loreLabel}>{l.label}</div>
              <div className={styles.loreFact}>{l.fact}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Episode Guide */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>📺 EPISODE GUIDE</h2>
        <div className={styles.episodeGrid}>
          {episodeGuide.map((ep) => (
            <div key={ep.ep} className={styles.episodeCard}>
              <div className={styles.episodeNum}>EP {ep.ep}</div>
              <div className={styles.episodeTitle}>{ep.title}</div>
              <div className={styles.episodeEvent}>{ep.event}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Abstracted Characters */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>💀 THOSE WHO COULD NOT HOLD ON</h2>
        <div className={styles.abstractedGrid}>
          {abstractedCharacters.map((a) => (
            <div key={a.name} className={styles.abstractedCard}>
              <div className={styles.abstractedEmoji}>{a.emoji}</div>
              <div className={styles.abstractedName}>{a.name}</div>
              <div className={styles.abstractedConn}>{a.connection}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Caine Quote */}
      <div className={styles.caineQuote}>
        <div className={styles.caineQuoteEmoji}>🎩</div>
        <div className={styles.caineQuoteText}>"{caineQuotes[quoteIndex]}"</div>
        <div className={styles.caineQuoteAttrib}>— Caine, Creative Artificial Intelligence Networking Entity</div>
      </div>
    </div>
  );
}
