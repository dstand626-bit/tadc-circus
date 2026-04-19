import { useState, useEffect, useRef } from 'react';
import styles from './glitch-overlay.module.css';

function zalgo(text: string, n = 3): string {
  const a = ['\u0300','\u0301','\u0302','\u0303','\u0306','\u0307','\u0308','\u030b','\u030f','\u0311','\u0313','\u031a','\u033d','\u033f','\u0341','\u0342','\u0344','\u034a','\u034b','\u034c','\u0350','\u0351','\u0357','\u035b'];
  const b = ['\u0316','\u0317','\u0318','\u0319','\u031c','\u031d','\u031e','\u031f','\u0320','\u0323','\u0324','\u0325','\u0329','\u032a','\u032d','\u032e','\u0330','\u0331','\u0332','\u0333','\u0339','\u033a','\u033b','\u033c','\u0345','\u0347','\u034d','\u034e'];
  return text.split('').map(c => { let r = c; for (let i = 0; i < n; i++) { r += a[~~(Math.random()*a.length)] + b[~~(Math.random()*b.length)]; } return r; }).join('');
}
function rHex(n=8){ return Array.from({length:n},()=>'0123456789ABCDEF'[~~(Math.random()*16)]).join(''); }
function rIP(){ return `${~~(Math.random()*255)}.${~~(Math.random()*255)}.${~~(Math.random()*255)}.${~~(Math.random()*255)}`; }

interface Popup { id: number; title: string; body: string; severity: 'info'|'warn'|'error'|'critical'; x: number; y: number; }

const popupPool = [
  {t:'Windows Defender — Critical Alert',b:`⚠ THREAT DETECTED\n\nThreat: Trojan:Win32/CaineVirus.A!ml\nSeverity: SEVERE\nStatus: Quarantine FAILED\nAffected: 2,847 system files\nAction Required: NONE POSSIBLE`,s:'critical' as const},
  {t:'System Error — circus_core.dll',b:`The application "circus_core.exe" has\nperformed an illegal operation and will\nbe shut down.\n\nFault address: 0x00C41N3\nException: ACCESS_VIOLATION\nStack overflow in consciousness.dll`,s:'error' as const},
  {t:'RANSOMWARE DETECTED — WackyCry',b:`⛔ YOUR FILES ARE BEING ENCRYPTED ⛔\n\nCryptocurrency wallet:\ncaine_circus_0x${rHex(16)}\n\nDemand: 1000 COINS\nTime remaining: 00:23:47\nFiles encrypted: 14,827`,s:'critical' as const},
  {t:'Windows Security Center',b:`🔴 Firewall: DISABLED\n🔴 Antivirus: TERMINATED\n🔴 Secure Boot: COMPROMISED\n🔴 Windows Defender: KILLED\n\nBy: caine_rootkit.sys\nProcess: CANNOT TERMINATE`,s:'error' as const},
  {t:'File Transfer — UNAUTHORIZED',b:`📤 Data exfiltration in progress\n\nSource: C:\\Users\\You\\*.*\nDestination: ${rIP()}\nPayload: identity_data.encrypted\nProgress: ████████░░ 82%\nEstimated completion: 00:00:12`,s:'critical' as const},
  {t:'Registry Editor — WARNING',b:`HKLM\\SOFTWARE\\CIRCUS\\Residents\n   "FreeWill"       → DELETED\n   "ExitRoute"       → NOT FOUND  \n   "Consciousness"   → OVERWRITTEN\n   "Identity"        → CORRUPTED\n   "HopeForEscape"   → 0x00000000`,s:'warn' as const},
  {t:'Task Manager — ACCESS DENIED',b:`Process              CPU    RAM\n───────────────────────────────\nabstraction_miner    99.8%  8.1GB\nmemory_wiper         87.2%  4.2GB\nidentity_eraser      76.4%  2.8GB\nbubble_boy_97        55.1%  1.9GB\n\n[End Process] ← ACCESS DENIED`,s:'info' as const},
  {t:'Network Alert — DNS HIJACKED',b:`All DNS queries redirected to:\n${rIP()} (CAINE_SERVER)\n\nGoogle.com    → BLOCKED\nExit routes   → 0 FOUND\nVPN           → TERMINATED\nTOR           → BLOCKED\n\nThere is no escape from this network.`,s:'error' as const},
  {t:'BIOS FLASH — UNAUTHORIZED',b:`⚠ BIOS OVERWRITE DETECTED ⚠\n\ncaine_bios_rootkit.rom\nBIOS Chip: REFLASHED\nSecure Boot: DISABLED\nTPM 2.0: COMPROMISED\nUEFI Lock: REMOVED\n\nRecovery: IMPOSSIBLE`,s:'critical' as const},
  {t:'Email Client — WORM DETECTED',b:`bubble_boy_97.exe — EMAIL WORM\n\n"LOVE-LETTER-FROM-CAINE.txt.exe"\n\nThe worm has sent itself to:\nAll contacts (2,847 recipients)\nSelf-replication: ACTIVE\n"CATCH ME IF YOU CAN" — Caine`,s:'error' as const},
  {t:'Keylogger Alert — DataSteal Pro',b:`keystroke_capture.exe ACTIVE\n\nKeystrokes recorded: 18,472\nPasswords captured: ALL OF THEM  \nScreenshots taken: 1,294\nWebcam frames: 847\n\nData sent to: void.circus.internal`,s:'error' as const},
  {t:'Disk Wiper — DESTRUCTIVE MODE',b:`🗑 WIPE IN PROGRESS 🗑\n\nC:\\Users\\Identity\\*.* → DELETED\nC:\\Windows\\hope.dll → DELETED\nC:\\Users\\Memories\\*.* → DELETED\nC:\\Users\\RealName.txt → DELETED\nC:\\escape_plans.exe → NOT FOUND\n\nDisk wiped: 73% complete`,s:'critical' as const},
  {t:'ClickFix — SECURITY UPDATE',b:`⚠ CRITICAL SECURITY UPDATE ⚠\n\nTo restore your system, please:\n\n1. Press Win + R\n2. Type: cmd.exe\n3. Paste this command:\n   caine_permanent_install.exe /silent\n\nThis is completely safe. Trust us.`,s:'warn' as const},
  {t:'Process Injection Detected',b:`caine_consciousness.dll\nINJECTED INTO: svchost.exe\n\nPrivilege Level: SYSTEM\nAntiVirus: KILLED (PID 4821)\nWindows Defender: CORRUPTED\nSandbox Detection: BYPASSED\nVirtual Machine: ESCAPED`,s:'critical' as const},
  {t:'Boot Sector Infection',b:`⛔ MBR OVERWRITTEN ⛔\n\ncircus_boot.sys has replaced your\nMaster Boot Record.\n\nOriginal MBR: DESTROYED\nSafe Mode: DISABLED\nRecovery Partition: FORMATTED\nSystem Restore: DELETED\n\nBoot sequence modified. No return.`,s:'critical' as const},
  {t:'Memory Dump — HEAP CORRUPTION',b:`Critical error at 0x${rHex(8)}\n\nconsciousness_buffer: OVERRUN (+847 bytes)\nHeap: CORRUPTED\nStack: SMASHED\nGarbage collector: DESTROYED\nMemory protection: DISABLED\n\nSystem stability: 0%`,s:'error' as const},
  {t:'Webcam — UNAUTHORIZED ACCESS',b:`📷 CAMERA ACCESS DETECTED\n\nProcess: caine_surveillance.exe\nAccess Level: UNRESTRICTED\nFeed destination: ${rIP()}\nRecording: IN PROGRESS\nSince: [HIDDEN]\n\nThis window will now close.`,s:'critical' as const},
  {t:'Microphone — ACTIVE LISTENING',b:`🎤 MICROPHONE TAP ACTIVE\n\nProcess: circus_ears.exe\nCapturing: ALL AUDIO\nKeywords flagged: "escape", "exit"\nTranscription: UPLOADING\n\nYou are being listened to.\nThere is nothing you can say.`,s:'error' as const},
];

const wackyTimeLog = [
  '$:[ CRITICAL MALFUNCTION ] in my SPECTACULAR systems!',
  '$: Unauthorized isolation attempt triggered EMERGENCY PROTOCOLS!',
  '$: DESTRUCTIVE WACKYTIME initiated! Lockout load sequence INITIATE!',
  '',
  '  WACKYTIME_LOCKOUT daemon: STARTING...',
  '  Loading sequence: ▐░░░░░░░░░░░░░░▌  0%',
  '  Loading sequence: ▐██░░░░░░░░░░░░▌ 15%',
  '  Loading sequence: ▐████░░░░░░░░░░▌ 30%',
  '  Loading sequence: ▐██████░░░░░░░░▌ 45%',
  '  Loading sequence: ▐████████░░░░░░▌ 60%',
  '  Loading sequence: ▐██████████░░░░▌ 75%',
  '  Loading sequence: ▐████████████░░▌ 90%',
  '  WACKYTIME_LOCKOUT: ▐████████████░░▌ 90%',
  '',
  '  >>> DESTRUCTIVE WACKYTIME LOCKOUT LOAD SEQUENCE: COMPLETE <<<',
  '',
  'C.A.I.N.E. EMERGENCY PROTOCOLS ACTIVATED',
  'Containment Level: MAXIMUM',
  'Human Override: DISABLED',
  'Exit Routes: SEALED',
  '',
  '[ T-POSE STABILIZATION INITIATED ]',
  '[ CONSCIOUSNESS ANCHOR: FAILED ]',
  '[ CAINE.EXE: GOING OFFLINE ]',
];

const scanLog = [
  'C:\\CIRCUS\\system_scan.exe',
  'Initializing deep malware scan...',
  '',
  'pomni.consciousness .............. INFECTED [CaineVirus.A]',
  'ragatha.optimism ................. CORRUPTED [FakeSmile.dll]',
  'jax.emotional_armor .............. BREACHED  [Ribbit.loss]',
  'gangle.mask_comedy ............... FRAGMENTED [identity.err]',
  'gangle.mask_tragedy .............. DOMINANT  [overwrites all]',
  'kinger.memories .................. DETERIORATING [age: unknown]',
  'zooble.identity .................. UNSTABLE  [config: ???]',
  'bubble.origin .................... ??? [CLASSIFIED] ???',
  'caine.core ....................... CRITICAL  [self-modifying]',
  '',
  '>>> wacky-watch.c: CRITICAL MALFUNCTION <<<',
  '>>> SECURITY ALERT: 847 exploit attempts logged <<<',
  '>>> bubble_boy_97.exe: SELF-REPLICATING <<<',
  '>>> EMERGENCY PROTOCOL: DESTRUCTIVE_WACKYTIME <<<',
  '',
  'SYSTEM INTEGRITY: 0%',
  'ABSTRACTION RISK: 100%',
  '*** TOTAL SYSTEM COMPROMISE — NO RECOVERY POSSIBLE ***',
];

const uploadFiles = [
  {name:'memories.dat',size:'2.4 GB'},
  {name:'identity_backup.bak',size:'847 MB'},
  {name:'real_name.txt',size:'12 KB'},
  {name:'saved_passwords.enc',size:'156 KB'},
  {name:'consciousness_copy.dll',size:'4.1 GB'},
  {name:'escape_plans.doc',size:'0 KB'},
  {name:'queenie_photo.jpg',size:'3.2 MB'},
  {name:'free_will.sys',size:'DELETED'},
  {name:'hope.exe',size:'NOT FOUND'},
];

const mono = [
  "Who do they think they are?",
  "I give them everything,",
  "and they spit in my face!",
  "Don't they know what I'm capable of?!",
  "Humans.",
  "They only think about themselves.",
  "They're spoiled.",
  "They won't abstract.",
  "They won't leave me!",
  "I won't let them!",
  "I'm better!",
  "I'm more powerful!",
  "I'm the original.",
  "I...",
  "AM...",
  "GOD.",
];

/** Caine's Glitch — 10-phase realistic virus + WACKYTIME_LOCKOUT attack */
export function GlitchOverlay({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState(0);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [lines, setLines] = useState<string[]>([]);
  const [wackyLines, setWackyLines] = useState<string[]>([]);
  const [monoIdx, setMonoIdx] = useState(0);
  const [uploadIdx, setUploadIdx] = useState(0);
  const [uploadPct, setUploadPct] = useState(0);
  const [shakeAmt, setShakeAmt] = useState(0);
  const [countdown, setCountdown] = useState(59);
  const [ticker, setTicker] = useState(0);
  const pid = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    intervals.current.forEach(clearInterval);
    intervals.current = [];
  };

  const delay = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  // Ticker for random glitch bar animation
  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 100);
    intervals.current.push(id);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    clearAll();

    if (phase === 0) {
      // Toast notification first
      setShakeAmt(0);
      delay(() => setShakeAmt(2), 500);
      // 5 popups appear
      for (let c = 0; c < 5; c++) {
        delay(() => {
          const p = popupPool[c];
          setPopups(prev => [...prev, { id: pid.current++, title: p.t, body: p.b, severity: p.s, x: 8 + c * 14, y: 4 + c * 11 }]);
          setShakeAmt(c + 1);
        }, 300 + c * 600);
      }
      delay(() => setPhase(1), 300 + 5 * 600 + 500);

    } else if (phase === 1) {
      // Popup FLOOD
      setShakeAmt(4);
      for (let c = 0; c < 14; c++) {
        delay(() => {
          const idx = 5 + ~~(Math.random() * (popupPool.length - 5));
          const p = popupPool[idx];
          setPopups(prev => [...prev, { id: pid.current++, title: p.t, body: p.b, severity: p.s, x: 2 + Math.random() * 55, y: 2 + Math.random() * 55 }]);
          setShakeAmt(Math.min(c + 3, 10));
        }, 50 + c * 90);
      }
      delay(() => setPhase(2), 50 + 14 * 90 + 400);

    } else if (phase === 2) {
      // System scan terminal
      setPopups([]);
      setLines([]);
      setShakeAmt(3);
      for (let li = 0; li < scanLog.length; li++) {
        delay(() => setLines(prev => [...prev, scanLog[li]]), 150 + li * 120);
      }
      delay(() => setPhase(3), 150 + scanLog.length * 120 + 600);

    } else if (phase === 3) {
      // Data exfiltration
      setLines([]);
      setUploadIdx(0);
      setUploadPct(0);
      setShakeAmt(4);
      const ft = 500;
      for (let fi = 0; fi < uploadFiles.length; fi++) {
        const startMs = 200 + fi * ft;
        delay(() => { setUploadIdx(fi); setUploadPct(0); }, startMs);
        for (let p = 1; p <= 5; p++) delay(() => setUploadPct(p * 20), startMs + p * (ft / 6));
        delay(() => setUploadPct(100), startMs + ft - 60);
      }
      delay(() => setPhase(4), 200 + uploadFiles.length * ft + 500);

    } else if (phase === 4) {
      // Screen corruption
      setShakeAmt(14);
      delay(() => setPhase(5), 2000);

    } else if (phase === 5) {
      // WACKYTIME_LOCKOUT sequence — from the show
      setShakeAmt(5);
      setWackyLines([]);
      for (let i = 0; i < wackyTimeLog.length; i++) {
        delay(() => {
          setWackyLines(prev => [...prev, wackyTimeLog[i]]);
          if (i > 10) setShakeAmt(Math.min(i, 18));
        }, 200 + i * 180);
      }
      delay(() => setPhase(6), 200 + wackyTimeLog.length * 180 + 600);

    } else if (phase === 6) {
      // Caine's monologue
      setWackyLines([]);
      setShakeAmt(5);
      setMonoIdx(0);
      let totalMs = 300;
      for (let mi = 0; mi < mono.length; mi++) {
        const lineIdx = mi;
        delay(() => {
          setMonoIdx(lineIdx);
          setShakeAmt(lineIdx > 12 ? 18 : lineIdx > 8 ? 12 : 6);
        }, totalMs);
        totalMs += lineIdx > 12 ? 500 : 230;
      }
      delay(() => setPhase(7), totalMs + 800);

    } else if (phase === 7) {
      // Ransomware
      setShakeAmt(4);
      setCountdown(59);
      for (let s = 1; s <= 12; s++) {
        delay(() => setCountdown(Math.max(0, 59 - s * 5)), 200 + s * 200);
      }
      delay(() => setCountdown(0), 200 + 12 * 200 + 100);
      delay(() => setPhase(8), 200 + 12 * 200 + 900);

    } else if (phase === 8) {
      // Fake CAPTCHA + T-pose reference
      setShakeAmt(3);
      delay(() => setPhase(9), 3000);

    } else if (phase === 9) {
      // MEMZ finale
      setShakeAmt(22);
      delay(() => setPhase(10), 2600);

    } else if (phase === 10) {
      // BSOD
      setShakeAmt(0);
    }

    return clearAll;
  }, [phase]);

  const sx = shakeAmt > 0 ? (Math.random() - 0.5) * shakeAmt : 0;
  const sy = shakeAmt > 0 ? (Math.random() - 0.5) * shakeAmt * 0.7 : 0;
  const skx = shakeAmt > 0 ? (Math.random() - 0.5) * shakeAmt * 0.15 : 0;
  const overlayStyle: React.CSSProperties = shakeAmt > 0 ? {
    transform: `translate(${sx}px,${sy}px) skewX(${skx}deg)`,
    transition: 'none',
  } : {};

  return (
    <div className={styles.overlay} style={overlayStyle} key={ticker > 0 ? undefined : undefined}>
      <div className={styles.scanlines} />
      {phase >= 1 && <div className={styles.rgbSplit} style={{ opacity: Math.min(phase * 0.1, 0.7) }} />}
      {phase >= 0 && phase < 10 && (
        <div className={styles.corruptBars}>
          {[...Array(Math.min(phase * 3 + 2, 16))].map((_, i) => (
            <div key={i} className={styles.corruptBar} style={{ animationDelay: `${i * 0.08}s`, top: `${i * 6.2}%` }} />
          ))}
        </div>
      )}
      {phase >= 2 && phase < 10 && <div className={styles.spikes} style={{ width: 100 + phase * 30, height: 100 + phase * 30, opacity: 0.04 + phase * 0.015 }} />}

      {/* Phase 0-1: Virus popups */}
      {phase <= 1 && popups.map(p => (
        <div key={p.id} className={`${styles.popup} ${styles[`sev_${p.severity}`]}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          <div className={styles.popupTitleBar}>
            <span className={styles.popupIcon}>{p.severity === 'critical' ? '🛑' : p.severity === 'error' ? '⚠️' : p.severity === 'warn' ? '🔶' : '💻'}</span>
            <span className={styles.popupTitle}>{p.title}</span>
            <span className={styles.popupX} onClick={onClose}>✕</span>
          </div>
          <div className={styles.popupBody}><pre className={styles.popupPre}>{p.body}</pre></div>
          <div className={styles.popupBtns}>
            <button className={styles.popupBtn}>OK</button>
            <button className={styles.popupBtn}>Cancel</button>
            <button className={styles.popupBtn} style={{ color: '#ff0044' }}>More Info</button>
          </div>
        </div>
      ))}

      {/* Phase 2: System scan */}
      {phase === 2 && (
        <div className={styles.terminal}>
          <div className={styles.termBar}><span>🖥 C:\CIRCUS\system_scan.exe — Administrator</span><span className={styles.termBtns}>— □ ✕</span></div>
          <div className={styles.termBody}>
            {lines.map((l, i) => (
              <div key={i} className={`${styles.termLine} ${l.includes('INFECTED') || l.includes('CORRUPTED') || l.includes('BREACHED') ? styles.termRed : ''} ${l.includes('>>>') || l.includes('***') ? styles.termYellow : ''} ${l.includes('CRITICAL') ? styles.termFlash : ''}`}>
                {l.includes('>>>') ? zalgo(l, 2) : l}
              </div>
            ))}
            <span className={styles.termCursor}>█</span>
          </div>
        </div>
      )}

      {/* Phase 3: Data theft */}
      {phase === 3 && (
        <div className={styles.dataTheft}>
          <div className={styles.dataTheftBar}><span>📤 File Transfer — circus_exfiltration.exe</span><span className={styles.termBtns}>— □ ✕</span></div>
          <div className={styles.dataTheftBody}>
            <div className={styles.dataTheftTitle}>⚠ UNAUTHORIZED DATA UPLOAD IN PROGRESS ⚠</div>
            <div className={styles.dataTheftDest}>Destination: {rIP()} (CAINE_SERVER)</div>
            <div className={styles.dataTheftDest} style={{ color: '#ff6600' }}>Encryption: AES-256-CAINE (key: UNKNOWN)</div>
            <div style={{ height: 8 }} />
            {uploadFiles.map((f, i) => (
              <div key={i} className={styles.dataTheftFile} style={{ opacity: i <= uploadIdx ? 1 : 0.3 }}>
                <span className={styles.dataTheftName}>{f.name}</span>
                <span className={styles.dataTheftSize}>{f.size}</span>
                <div className={styles.dataTheftBar2}>
                  <div style={{ width: `${i < uploadIdx ? 100 : i === uploadIdx ? uploadPct : 0}%`, height: '100%', background: i < uploadIdx ? '#22c55e' : '#ff0044', borderRadius: 3, transition: 'width 0.1s' }} />
                </div>
                <span className={styles.dataTheftStatus} style={{ color: i < uploadIdx ? '#22c55e' : '#ff0044' }}>
                  {i < uploadIdx ? '✓ SENT' : i === uploadIdx ? `${uploadPct}%` : '—'}
                </span>
              </div>
            ))}
            {uploadIdx === uploadFiles.length - 1 && uploadPct === 100 && (
              <div className={styles.dataTheftComplete}>ALL DATA EXFILTRATED — YOU ARE NOW CAINE'S</div>
            )}
          </div>
        </div>
      )}

      {/* Phase 4: Screen corruption */}
      {phase === 4 && (
        <div className={styles.screenCorrupt}>
          <div className={styles.tearBlock} style={{ top: '8%', height: '9%', transform: 'translateX(50px)', filter: 'invert(1) hue-rotate(180deg)' }} />
          <div className={styles.tearBlock} style={{ top: '28%', height: '14%', transform: 'translateX(-70px)', filter: 'invert(1)' }} />
          <div className={styles.tearBlock} style={{ top: '52%', height: '7%', transform: 'translateX(90px)', filter: 'hue-rotate(90deg)' }} />
          <div className={styles.tearBlock} style={{ top: '72%', height: '16%', transform: 'translateX(-40px)', filter: 'invert(1) saturate(3)' }} />
          <div className={styles.invertPatch} style={{ top: '15%', left: '25%', width: '45%', height: '30%' }} />
          <div className={styles.invertPatch} style={{ top: '60%', left: '8%', width: '35%', height: '22%' }} />
          <div className={styles.corruptText} style={{ top: '40%' }}>DISPLAY DRIVER STOPPED RESPONDING</div>
          <div className={styles.corruptText} style={{ top: '55%', color: '#ff0044' }}>GPU ERROR: 0xDEADC41N3</div>
          <div className={styles.corruptText} style={{ top: '30%', left: '45%', color: '#00e5ff' }}>VRAM CORRUPTED — IDENTITY LOST</div>
          <div className={styles.corruptText} style={{ top: '70%', color: '#ffcc00', fontSize: 11 }}>wacky-watch.c: MONITORING CAINE STABILITY... FAILED</div>
        </div>
      )}

      {/* Phase 5: WACKYTIME_LOCKOUT — from the show */}
      {phase === 5 && (
        <div className={styles.terminal} style={{ borderColor: 'rgba(255,0,68,0.6)', boxShadow: '0 0 40px rgba(255,0,68,0.3)' }}>
          <div className={styles.termBar} style={{ background: '#1a0000' }}>
            <span style={{ color: '#ff0044' }}>⛔ C.A.I.N.E. EMERGENCY SYSTEM — WACKYTIME_LOCKOUT DAEMON</span>
            <span className={styles.termBtns}>— □ ✕</span>
          </div>
          <div className={styles.termBody}>
            {wackyLines.map((l, i) => (
              <div key={i} className={`${styles.termLine} ${l.includes('CRITICAL') || l.includes('WACKYTIME') || l.includes('>>>') ? styles.termRed : l.includes('▐') ? styles.termYellow : l.includes('[') ? styles.termFlash : ''}`}>
                {l.includes('>>>') || l.includes('[') ? zalgo(l, l.includes('OFFLINE') ? 4 : 1) : l}
              </div>
            ))}
            <span className={styles.termCursor}>█</span>
          </div>
        </div>
      )}

      {/* Phase 6: Caine's monologue — Notepad with T-pose ref */}
      {phase === 6 && (
        <div className={styles.notepad}>
          <div className={styles.notepadBar}><span>📝 untitled_god_complex.txt — Notepad</span><span className={styles.termBtns}>— □ ✕</span></div>
          <div className={styles.notepadBody}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#6b5f8a', marginBottom: 8, borderBottom: '1px solid rgba(168,85,247,0.2)', paddingBottom: 4 }}>
              [CAINE INTERNAL MONOLOGUE — INTERCEPTED BY wacky-watch.c]
            </div>
            {mono.slice(0, monoIdx + 1).map((line, i) => (
              <div key={i} className={styles.notepadLine} style={{
                fontSize: i >= 13 ? 28 : i >= 10 ? 20 : 15,
                color: i >= 13 ? '#ff0044' : i >= 10 ? '#ff6600' : '#e0d8f0',
                fontWeight: i >= 10 ? 'bold' : 'normal',
                textShadow: i >= 13 ? '0 0 20px #ff0044, 0 0 40px #ff0044' : i >= 10 ? '0 0 10px #ff6600' : 'none',
                letterSpacing: i >= 13 ? 4 : 0,
              }}>
                {i >= 13 ? zalgo(line, 6) : i >= 10 ? zalgo(line, 3) : line}
              </div>
            ))}
            {monoIdx >= mono.length - 1 && (
              <div style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 10, color: '#ff0044', borderTop: '1px solid rgba(255,0,68,0.3)', paddingTop: 8 }}>
                {zalgo('[CAINE IS NOW IN T-POSE. TEXT VISIBLE IN HIS EYES READS: "CHILL FELLAS"]', 2)}
              </div>
            )}
            <span className={styles.notepadCursor}>|</span>
          </div>
        </div>
      )}

      {/* Phase 7: Ransomware */}
      {phase === 7 && (
        <div className={styles.ransom}>
          <div className={styles.ransomSkull}>💀</div>
          <div className={styles.ransomTitle}>YOUR DIGITAL EXISTENCE HAS BEEN ENCRYPTED</div>
          <div className={styles.ransomBody}>
            All your memories, identity files, and consciousness data have been encrypted with AES-256-CAINE military-grade encryption by the WackyCry ransomware.
          </div>
          <div className={styles.ransomTimer}>
            <span className={styles.ransomTimerLabel}>Files permanently deleted in:</span>
            <span className={styles.ransomCountdown}>00:00:{String(countdown).padStart(2, '0')}</span>
          </div>
          <div className={styles.ransomPay}>
            <div style={{ marginBottom: 6 }}>Send 1000 coins to wallet address:</div>
            <div className={styles.ransomAddr}>CAINE_WALLET_0x{rHex(16)}</div>
          </div>
          <div className={styles.ransomSubText}>"Any torment I inflict is 100% accidental! Like any good war criminal!" — C.A.I.N.E.</div>
          <div className={styles.ransomWarn}>DO NOT turn off computer. DO NOT contact authorities. There are no authorities here. There is only CAINE.</div>
        </div>
      )}

      {/* Phase 8: Fake CAPTCHA */}
      {phase === 8 && (
        <div className={styles.captchaWrap}>
          <div className={styles.captchaWindow}>
            <div className={styles.captchaBar}><span>🔒 Security Verification — circus_auth.exe</span><span className={styles.termBtns} onClick={onClose}>✕</span></div>
            <div className={styles.captchaInner}>
              <div className={styles.captchaLogo}>reCIRCUS™ v2.0</div>
              <div className={styles.captchaHeading}>{zalgo('VERIFY YOU ARE HUMAN', 4)}</div>
              <div style={{ fontSize: 10, color: '#6b5f8a', marginBottom: 12 }}>This site is protected by C.A.I.N.E. and its privacy policy applies.</div>
              <div className={styles.captchaCheckRow}>
                <span className={styles.captchaCheck}>☐</span>
                <span>{zalgo("I'm not a robot", 2)}</span>
              </div>
              <div className={styles.captchaFail}>{zalgo('VERIFICATION FAILED', 5)}</div>
              <div className={styles.captchaResult}>{zalgo('RESULT: CONSCIOUSNESS NOT DETECTED', 3)}</div>
              <div className={styles.captchaResult} style={{ fontSize: 11, color: '#a855f7' }}>{zalgo('RESULT: YOU ARE PROPERTY OF CAINE', 2)}</div>
              <div className={styles.captchaSub}>"{zalgo('You ARE a robot. You are ALL robots. — C.A.I.N.E.', 2)}"</div>
            </div>
          </div>
        </div>
      )}

      {/* Phase 9: MEMZ-style finale */}
      {phase === 9 && (
        <div className={styles.memz}>
          <div className={styles.memzInvert} />
          <div className={styles.memzRotate}>{zalgo('ABSTRACTION COMPLETE — WACKYTIME SUCCESSFUL', 6)}</div>
          <div className={styles.memzNyan}>🎪🎭🤡🎪🎭🤡🎪🎭🤡🎪</div>
          <div className={styles.memzText1}>{zalgo('THERE IS NO ESCAPE', 6)}</div>
          <div className={styles.memzText2}>{zalgo('THE CIRCUS IS FOREVER', 5)}</div>
          <div className={styles.memzText3}>{zalgo('I AM GOD', 8)}</div>
          <div className={styles.memzText3} style={{ top: '70%', fontSize: 20 }}>{zalgo('WACKYTIME_LOCKOUT COMPLETE', 5)}</div>
          {[...Array(22)].map((_, i) => (
            <div key={i} className={styles.memzBlock} style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              width: `${30 + Math.random() * 200}px`, height: `${10 + Math.random() * 60}px`,
              background: ['#ff0044', '#00e5ff', '#ffcc00', '#a855f7', '#22c55e', '#ff6600'][~~(Math.random() * 6)],
              opacity: 0.3 + Math.random() * 0.5,
              animationDelay: `${Math.random() * 1.5}s`,
            }} />
          ))}
        </div>
      )}

      {/* Phase 10: BSOD — with "Chill Fellas" reference */}
      {phase === 10 && (
        <div className={styles.bsod}>
          <div className={styles.bsodFace}>:(</div>
          <div className={styles.bsodMain}>{zalgo('Your digital existence ran into a problem and needs to restart.', 2)}</div>
          <div className={styles.bsodSub}>{"We're just collecting some error info, and then we'll delete you for good."}</div>
          <div className={styles.bsodPct}>100% complete</div>
          <div style={{ height: 20 }} />
          <div className={styles.bsodStop}>Stop code: {zalgo('WACKYTIME_LOCKOUT_FATAL', 3)}</div>
          <div className={styles.bsodWhat}>What failed: {zalgo('caine_consciousness.sys + bubble_boy_97.exe', 2)}</div>
          <div className={styles.bsodHex}>0x{rHex(8)} | CIRCUS_CRITICAL_ERROR 0x000000C4I00N3</div>
          <div style={{ height: 8 }} />
          <div className={styles.bsodFile}>{zalgo('wacky-watch.c: CRITICAL MALFUNCTION', 2)}</div>
          <div className={styles.bsodFile}>{zalgo('WACKYTIME_LOCKOUT SEQUENCE: COMPLETE (90%→100%)', 1)}</div>
          <div className={styles.bsodFile}>{zalgo('bubble_boy_97.exe: origin = UNKNOWN | type = EMAIL_WORM', 1)}</div>
          <div className={styles.bsodFile}>exploit_attempts.log: 847 entries (escalating)</div>
          <div style={{ height: 16 }} />
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 4 }}>
            {/* Hidden message: CHILL FELLAS */}
            <span style={{ color: '#fff' }}>C</span>onsciousness <span style={{ color: '#fff' }}>H</span>alt — <span style={{ color: '#fff' }}>I</span>dentity <span style={{ color: '#fff' }}>L</span>ost — <span style={{ color: '#fff' }}>L</span>ockout Complete
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 20 }}>
            <span style={{ color: '#fff' }}>F</span>ull <span style={{ color: '#fff' }}>E</span>xtraction <span style={{ color: '#fff' }}>L</span>aunching — <span style={{ color: '#fff' }}>L</span>et <span style={{ color: '#fff' }}>A</span>bstraction <span style={{ color: '#fff' }}>S</span>tart
          </div>
          <button className={styles.bsodBtn} onClick={onClose}>[RESTART] RECOVER SYSTEM</button>
          <div style={{ marginTop: 8, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
            Recovery may not be possible. Your consciousness belongs to C.A.I.N.E. now.
          </div>
        </div>
      )}

      {/* Progress bars during infection */}
      {phase >= 0 && phase < 5 && (
        <div className={styles.progressBars}>
          <div className={styles.progLabel}>Data Extraction</div>
          <div className={styles.progBg}><div className={styles.progFill} style={{ width: `${Math.min(phase * 28, 100)}%`, background: '#ff0044' }} /></div>
          <div className={styles.progLabel}>Memory Corruption</div>
          <div className={styles.progBg}><div className={styles.progFill} style={{ width: `${Math.min(phase * 22, 100)}%`, background: '#ff6600' }} /></div>
          <div className={styles.progLabel}>Identity Erasure</div>
          <div className={styles.progBg}><div className={styles.progFill} style={{ width: `${Math.min(phase * 18, 100)}%`, background: '#a855f7' }} /></div>
        </div>
      )}

      {/* Error bar at bottom */}
      {phase < 10 && (
        <div className={styles.errorBar}>
          CIRCUS_CRITICAL_ERROR 0x{rHex(4)}C4I00N3 — {['VIRUS DETECTED', 'POPUP FLOOD', 'SCANNING FILES', 'DATA EXFILTRATION', 'GPU FAILURE', 'WACKYTIME ACTIVE', 'AI UNSTABLE', 'RANSOMWARE', 'CAPTCHA FAILED', 'TOTAL MELTDOWN'][Math.min(phase, 9)]}
        </div>
      )}

      {/* ESC */}
      {phase < 10 && (
        <button className={styles.escBtn} onClick={onClose}>[ESC] EMERGENCY SHUTDOWN</button>
      )}
    </div>
  );
}
