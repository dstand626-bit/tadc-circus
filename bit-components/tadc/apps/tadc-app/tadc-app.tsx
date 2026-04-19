import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { HomePage } from './home-page.js';
import { CharactersPage } from './characters-page.js';
import { ArcadePage } from './arcade-page.js';
import { ShopPage } from './shop-page.js';
import { SecretsPage } from './secrets-page.js';
import { RoomPage } from './room-page.js';
import { ProfilePage } from './profile-page.js';
import { ChatAdventurePage } from './chat-adventure-page.js';
import { SpinPage } from './spin-page.js';
import { GlitchOverlay } from './glitch-overlay.js';
import { navItems } from './characters-data.js';
import { allQuotes } from './popup-quotes.js';
import { useWallet } from './use-wallet.js';
import styles from './tadc-app.module.css';

/**
 * The Amazing Digital Circus — main application shell
 */
export function TadcApp() {
  const location = useLocation();
  const { coins, gems } = useWallet();
  const [showGlitch, setShowGlitch] = useState(false);
  const [popupQuote, setPopupQuote] = useState<typeof allQuotes[0] | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    const showQuote = () => {
      const q = allQuotes[Math.floor(Math.random() * allQuotes.length)];
      setPopupQuote(q);
      setTimeout(() => setPopupQuote(null), 5000);
    };
    const delay = 30000 + Math.random() * 30000;
    const timeout = setTimeout(showQuote, delay);
    return () => clearTimeout(timeout);
  }, [popupQuote]);

  const handleGlitch = useCallback(() => { setShowGlitch(true); setShowRecovery(false); }, []);
  const closeGlitch = useCallback(() => {
    setShowGlitch(false);
    setShowRecovery(true);
    setTimeout(() => setShowRecovery(false), 2000);
  }, []);

  const filteredNav = navItems.filter(n => n.path !== '/adventures');

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoEmoji}>🎪</span>
          <div className={styles.logoTitle}>THE AMAZING<br />DIGITAL CIRCUS</div>
          <div className={styles.logoSubtitle}>EST. 1996</div>
        </div>
        <div className={styles.wallet}>
          <span className={`${styles.walletItem} ${styles.coins}`}>🪙 {coins}</span>
          <span className={`${styles.walletItem} ${styles.gems}`}>💎 {gems}</span>
        </div>
        <nav className={styles.nav}>
          {filteredNav.map((item) => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `${styles.navLink} ${isActive && location.pathname === item.path ? styles.navLinkActive : ''}`}
              end={item.path === '/'}>
              <span className={styles.navEmoji}>{item.emoji}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className={styles.glitchBtn} onClick={handleGlitch}>⚡ CAINE'S GLITCH ⚡</button>
      </aside>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/arcade" element={<ArcadePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/secrets" element={<SecretsPage />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatAdventurePage />} />
          <Route path="/adventures" element={<ChatAdventurePage />} />
          <Route path="/spin" element={<SpinPage />} />
        </Routes>
      </main>

      {showRecovery && <div className={styles.glitchRecovery} />}
      {showGlitch && <GlitchOverlay onClose={closeGlitch} />}

      {popupQuote && (
        <div className={styles.popupQuote}>
          <button className={styles.popupQuoteClose} onClick={() => setPopupQuote(null)}>✕</button>
          <div className={styles.popupQuoteText}>{popupQuote.emoji} "{popupQuote.text}"</div>
          <div className={styles.popupQuoteAuthor}>— {popupQuote.character}</div>
        </div>
      )}
    </div>
  );
}
