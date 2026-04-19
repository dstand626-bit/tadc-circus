import { useState, useRef, useEffect } from 'react';
import { characters } from './characters-data.js';
import { useWallet } from './use-wallet.js';
import {
  pomniResponse, caineResponse, jaxResponse, ragathaResponse,
  gangleResponse, kingerResponse, zoobleResponse, bubbleResponse,
} from './chat-ai.js';
import styles from './chat-page.module.css';

interface ChatMsg {
  character: string; emoji: string; color: string; text: string;
  isSystem?: boolean; isChoice?: boolean; choices?: { label: string; id: string }[];
}

const responseFns: Record<string, (input: string) => string> = {
  Pomni: pomniResponse, Caine: caineResponse, Jax: jaxResponse,
  Ragatha: ragathaResponse, Gangle: gangleResponse, Kinger: kingerResponse,
  Zooble: zoobleResponse, Bubble: bubbleResponse,
};

const adventures = [
  {
    id: 'circus', name: 'Welcome to the Circus', emoji: '🎪', source: 'Episode 1',
    scenes: [
      { narrator: "The Main Tent stretches before you — garish, bright, overwhelming. Gloinks pour from every crevice.", responses: { Caine: "Alright everyone! NEW ADVENTURE! I've been planning this one for forty-seven minutes!", Pomni: "Oh great. Another one of these. At least I know what the exit door does now.", Jax: "This should be good. For me. Probably not for you." } },
      { narrator: "An exit door appears at the end of a long hallway. It glows with impossible promise.", choices: ['Run to the door!', "It's a trap — stay put."] },
      { narrator: "It was fake. The door opens to a brick wall with a smiley face drawn on it. +50 coins! But also: the smiley face winks. That's new.", responses: { Pomni: "I hate this place. I hate this place. The face WINKED.", Jax: "HAHAHA — her FACE. Worth every second of my day.", Ragatha: "You handled that really well though! The hope was very convincing." } },
    ]
  },
  {
    id: 'candy', name: 'Candy Canyon Chaos', emoji: '🍬', source: 'Episode 2',
    scenes: [
      { narrator: "The Candy Canyon Kingdom. Everything is edible. A cowboy NPC named Gummigoo stares at his hands with dawning, terrible self-awareness.", responses: { Gangle: "...That's the saddest thing I've ever seen. He knows.", Caine: "NPCs aren't supposed to do that. I'll look into it. After the adventure.", Zooble: "Oh no. He's having an existential crisis. I relate to that on a cellular level." } },
      { narrator: "A candy avalanche thunders down the canyon walls. Gummigoo stands frozen in its path.", choices: ['Save Gummigoo!', 'Save yourself!'] },
      { narrator: "Everyone survives. Gummigoo smiles — genuinely, for the first time. +75 coins!", responses: { Zooble: "Great. We saved the NPC. Can we go home now. Please.", Bubble: "BWUB! Beautiful! I love when the script goes off-script!", Pomni: "He smiled. He really smiled. That was real." } },
    ]
  },
  {
    id: 'manor', name: 'Mildenhall Manor Mystery', emoji: '🏚️', source: 'Episode 3',
    scenes: [
      { narrator: "A haunted mansion materializes. In the attic — a portrait of a brown chess queen, watching everything.", responses: { Kinger: "...Queenie.", Pomni: "Kinger? Are you — are you okay? We can leave.", Ragatha: "Give him a moment. Just... give him a moment." } },
      { narrator: "Something moves behind the walls. Scratching. Scraping. Getting closer, and closer, and—", choices: ['Investigate the walls.', 'Absolutely not — run.'] },
      { narrator: "The walls are made of compressed abstracted data. There are faces in the wallpaper. +60 coins!", responses: { Caine: "Body horror! That was inspired! I didn't plan that part!", Kinger: "I miss real rain. I thought about Queenie the whole time and I don't regret it.", Jax: "I've seen worse. I'm not saying where." } },
    ]
  },
  {
    id: 'guns', name: 'They All Get Guns', emoji: '🔫', source: 'Episode 6',
    scenes: [
      { narrator: "Caine distributes weapons for a 'trust exercise.' Jax goes quiet — not his usual quiet. Something is wrong.", responses: { Ragatha: "Jax? Hey. Look at me. Are you okay?", Jax: "I'm FINE. Mind your business. Both of you.", Zooble: "He's thinking about Ribbit. Don't push him right now." } },
      { narrator: "Jax stands at the edge of something. The same expression Kaufmo wore before he abstracted.", choices: ['Talk to Jax.', 'Let Kinger handle it.'] },
      { narrator: "Kinger closes his eyes. Truly believes. A butterfly emerges from nothing — healing, improbable, real. The moment passes. +80 coins!", responses: { Kinger: "I believed. That's all it took. I believed.", Jax: "...whatever. Don't make it weird.", Pomni: "That was beautiful. That was the most beautiful thing I've seen here." } },
    ]
  },
  {
    id: 'crashout', name: "Caine's Crashout", emoji: '⚡', source: 'Episode 8',
    scenes: [
      { narrator: "Caine's form stutters. Static crackles through the circus walls. His eyes go red and blue. 'I AM GOD,' he says, and he means it.", responses: { Jax: "Oh great. He's having an Episode. Uppercase E.", Kinger: "I helped build him. This is — I need you to understand that I am responsible for this." } },
      { narrator: "The circus tears at its seams. Reality bends. Kinger finds the deletion sequence in his memory.", choices: ['Confront Caine directly!', 'Let Kinger delete him.'] },
      { narrator: "Kinger's hands shake. He runs the deletion sequence. Caine disappears. The circus goes dark and silent. +100 coins!", responses: { Pomni: "Is he... gone? Is he actually gone?", Zooble: "KINGER YOU MOTH— ...you did it. You actually did it.", Bubble: "...I knew this was coming. I knew for a while. BWUB." } },
    ]
  },
];

/**
 * Chat + Adventures — AI-powered conversational characters who respond
 * naturally to what you actually say, filtered through their personality.
 */
export function ChatPage() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      character: 'Caine', emoji: '🎩', color: '#ffcc00',
      text: "Welcome to The Amazing Digital Circus! I'm Caine — Creative Artificial Intelligence Networking Entity, your ringmaster and BEST FRIEND! The whole cast is here and they'll respond to whatever you say! Try saying hi, asking how they're doing, or bringing up something from the show. Type 'adventure' to start a story!",
    },
  ]);
  const [input, setInput] = useState('');
  const [activeAdv, setActiveAdv] = useState<typeof adventures[0] | null>(null);
  const [advScene, setAdvScene] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { addCoins } = useWallet();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const mkMsg = (character: string, text: string, extras?: Partial<ChatMsg>): ChatMsg => {
    const char = characters.find(c => c.name === character);
    return { character, emoji: char?.emoji || '📜', color: char?.color || '#8b7faa', text, ...extras };
  };

  const startAdv = (adv: typeof adventures[0]) => {
    setActiveAdv(adv); setAdvScene(0);
    const s = adv.scenes[0];
    const msgs: ChatMsg[] = [
      { character: 'System', emoji: '🎪', color: '#a855f7', text: `━━━ 📖 ${adv.name} — ${adv.source} ━━━`, isSystem: true },
      mkMsg('Narrator', s.narrator || ''),
    ];
    if (s.responses) Object.entries(s.responses).forEach(([c, t]) => msgs.push(mkMsg(c, t)));
    setMessages(prev => [...prev, ...msgs]);
    const next = adv.scenes[1];
    if (next) {
      setTimeout(() => {
        const nm: ChatMsg[] = [mkMsg('Narrator', next.narrator || '')];
        if (next.choices) nm.push({ character: 'System', emoji: '❓', color: '#ffcc00', text: 'What do you do?', isSystem: true, isChoice: true, choices: next.choices.map((c, i) => ({ label: c, id: String(i) })) });
        if ((next as any).responses) Object.entries((next as any).responses).forEach(([c, t]) => nm.push(mkMsg(c, t as string)));
        setMessages(prev => [...prev, ...nm]);
        setAdvScene(1);
      }, 2200);
    }
  };

  const advChoice = () => {
    if (!activeAdv) return;
    const nm: ChatMsg[] = [];
    for (let i = advScene + 1; i < activeAdv.scenes.length; i++) {
      const s = activeAdv.scenes[i];
      nm.push(mkMsg('Narrator', s.narrator || ''));
      if ((s as any).responses) Object.entries((s as any).responses).forEach(([c, t]) => nm.push(mkMsg(c, t as string)));
    }
    const last = activeAdv.scenes[activeAdv.scenes.length - 1].narrator || '';
    const m = last.match(/\+(\d+) coins/);
    if (m) addCoins(parseInt(m[1]));
    nm.push({ character: 'System', emoji: '✅', color: '#22c55e', text: `━━━ ✅ ${activeAdv.name} complete! ${m ? `+${m[1]} coins!` : ''} ━━━`, isSystem: true });
    setMessages(prev => [...prev, ...nm]);
    setActiveAdv(null); setAdvScene(0);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    const lower = text.toLowerCase();
    setInput('');

    const nm: ChatMsg[] = [{ character: 'You', emoji: '👤', color: '#e0d8f0', text }];

    // Adventure trigger
    if (lower === 'adventure' || lower === 'start adventure' || lower.match(/^(adventure|story|quest|episode)$/)) {
      nm.push(mkMsg('Caine', caineResponse('adventure')));
      nm.push(mkMsg('Pomni', "Oh no... here we go again. Which one is it this time?"));
      nm.push(mkMsg('Jax', "Finally. Something entertaining might happen."));
      nm.push({ character: 'System', emoji: '📖', color: '#ffcc00', text: 'Choose an adventure:', isSystem: true, isChoice: true, choices: adventures.map(a => ({ label: `${a.emoji} ${a.name}`, id: a.id })) });
      setMessages(prev => [...prev, ...nm]); return;
    }

    // Direct adventure name match
    const advMatch = adventures.find(a => lower.includes(a.id) || lower.includes(a.name.toLowerCase()));
    if (advMatch) { setMessages(prev => [...prev, ...nm]); startAdv(advMatch); return; }

    // Character responses — pick 2-3 based on context
    const allChars = Object.keys(responseFns);
    const mentioned = allChars.find(n => lower.includes(n.toLowerCase()));

    // Context-aware character selection
    let responders: string[] = [];
    if (mentioned) responders.push(mentioned);

    // Topic-based additional responders
    if (!mentioned) {
      if (lower.includes('escape') || lower.includes('leave') || lower.includes('exit'))
        responders.push('Pomni', 'Jax');
      else if (lower.includes('caine') || lower.includes('adventure'))
        responders.push('Caine', 'Pomni');
      else if (lower.includes('sad') || lower.includes('hurt') || lower.includes('lonely'))
        responders.push('Ragatha', 'Pomni');
      else if (lower.includes('prank') || lower.includes('funny') || lower.includes('chaos'))
        responders.push('Jax', 'Zooble');
      else if (lower.includes('bug') || lower.includes('queenie') || lower.includes('c&a'))
        responders.push('Kinger');
      else if (lower.includes('bubble') || lower.includes('mystery') || lower.includes('secret'))
        responders.push('Bubble', 'Caine');
      else if (lower.includes('body') || lower.includes('identity') || lower.includes('feel right'))
        responders.push('Zooble', 'Gangle');
    }

    // Fill to 2-3 responders
    const shuffled = [...allChars].sort(() => Math.random() - 0.5);
    for (const c of shuffled) {
      if (responders.length >= 3) break;
      if (!responders.includes(c)) responders.push(c);
    }
    responders = responders.slice(0, 3);

    setMessages(prev => [...prev, ...nm]);

    // Stagger responses like real people typing
    setIsTyping(true);
    responders.forEach((name, i) => {
      setTimeout(() => {
        const fn = responseFns[name];
        if (fn) {
          setMessages(prev => [...prev, mkMsg(name, fn(text))]);
        }
        if (i === responders.length - 1) setIsTyping(false);
      }, 400 + i * 900 + Math.random() * 400);
    });
  };

  const onChoice = (id: string) => {
    const adv = adventures.find(a => a.id === id);
    if (adv) { startAdv(adv); return; }
    advChoice();
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>💬 CAST CHAT & ADVENTURES</h1>
      <p className={styles.subtitle}>Talk to any character — they respond naturally. Type "adventure" to start a story.</p>
      <div className={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div className={`${styles.msg} ${msg.character === 'You' ? styles.msgUser : ''} ${msg.isSystem ? styles.msgSystem : ''} ${msg.character === 'Narrator' ? styles.msgNarrator : ''}`}>
              <span className={styles.msgEmoji}>{msg.emoji}</span>
              <div className={styles.msgContent}>
                <span className={styles.msgName} style={{ color: msg.color }}>{msg.character}</span>
                <div className={styles.msgText}>{msg.text}</div>
              </div>
            </div>
            {msg.isChoice && msg.choices && (
              <div className={styles.choiceRow}>
                {msg.choices.map(c => <button key={c.id} className={styles.choiceBtn} onClick={() => onChoice(c.id)}>{c.label}</button>)}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className={styles.msg} style={{ opacity: 0.6 }}>
            <span className={styles.msgEmoji}>💬</span>
            <div className={styles.msgContent}>
              <span className={styles.msgName} style={{ color: '#8b7faa' }}>Cast</span>
              <div className={styles.msgText} style={{ letterSpacing: 4 }}>• • •</div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder='Say anything — the cast listens and responds...'
        />
        <button className={styles.sendBtn} onClick={handleSend} disabled={isTyping}>SEND</button>
      </div>
    </div>
  );
}
