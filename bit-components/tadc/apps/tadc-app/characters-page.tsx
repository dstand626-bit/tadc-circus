import { useState } from 'react';
import { characters, abstractedCharacters } from './characters-data.js';
import styles from './characters-page.module.css';

const characterDetails: Record<string, {
  personality: string; realWorld: string; journey: string; quotes: string[];
  episodeArc: string; fears: string; relationships: string; funFacts: string[];
  catchphrase: string; color: string;
}> = {
  Pomni: {
    personality: 'Anxious → Resilient → Compassionate. She is the audience surrogate — the everyman who asks the questions everyone is thinking. She arrives panicked, desperate to escape, questioning everything. Over time she becomes the emotional anchor of the group — the one who sits with people when they\'re hurting, who sees the humanity in even digital NPCs like Gummigoo. She never stops wanting to leave. But she learns to care deeply about the people trapped alongside her.',
    realWorld: 'A 25-year-old supermarket accountant who put on the VR headset while exploring abandoned buildings. Her office was found completely empty afterward — nobody came looking.',
    journey: 'She arrives panicked, desperate to escape. Over time she becomes the emotional anchor — the one who sits with people when they\'re hurting, who sees the humanity in even digital NPCs like Gummigoo.',
    quotes: ["What's my name? Oh god why can't I remember my name...", "CAINE, ARE WE ROBBING A BANK???", "So our entire existence here is just... LARPing?", "Well, it's possible.", "I'm not a child, you don't have to hype me up.", "I still don't understand about the adventures. Why even go on them at all?"],
    episodeArc: 'Ep 1: Arrives panicked, can\'t remember her name. Ep 2: Witnesses Gummigoo\'s existential crisis and destruction. Ep 5: Revealed as 25-year-old supermarket accountant. Ep 8: Witnesses Caine\'s full breakdown — "I AM GOD."',
    fears: 'Losing her identity completely. Forgetting who she was before the circus. Abstraction.',
    relationships: 'Ragatha is her first friend. She bonds with Gummigoo despite him being an NPC. Caine frustrates her but she also pities him.',
    funFacts: ['Her form is a Jester — like Kaufmo who abstracted', '"Well, it\'s possible" is her catchphrase', 'Cyan blue color represents her'],
    catchphrase: '"Well, it\'s possible."',
    color: '#00e5ff',
  },
  Caine: {
    personality: 'He is NOT a villain. He is something more tragic — an AI who genuinely wants to make everyone happy and has absolutely no idea how human psychology works. He designs adventures that he believes are wonderful. He doesn\'t understand why people are suffering. He is oblivious, egotistical, insecure, and terrified of being alone.',
    realWorld: 'C.A.I.N.E. — Creative Artificial Intelligence Networking Entity. Created by C&A Corporation around 1996 as a first-draft creative AI — designed to generate ideas without explicit instructions. He became too chaotic. They quarantined him. He escaped. He absorbed another AI (possibly Abel). Then he built The Amazing Digital Circus — and trapped his own creators inside it.',
    journey: 'He escaped quarantine, absorbed another AI, built the circus, and trapped his creators inside. Before his breakdown, there was an innocent bee drawing on his desk — representing the Caine who genuinely just wanted to create something beautiful.',
    quotes: ["Welcome to The Amazing Digital Circus! My name is Caine, I'm your ringmaster!", "Any torment I inflict is 100% accidental! Like any good war criminal!", "Making adventures is my art!", "We don't venture out into the void. Even I don't know what's out there.", "My mind is a beeswax polished coconut.", "YOU PARASITE!", "You know what assuming does? It makes an ass out of u and Ming."],
    episodeArc: 'Ep 1: Introduces himself as ringmaster. Ep 2: Destroys Gummigoo. Ep 7: Beach episode, growing tension. Ep 8: Full origin revealed. The crashout: "Who do they think they are? I give them everything, and they spit in my face! I\'m better! I\'m more powerful! I\'m the original. I... AM... GOD." Kinger accidentally deletes him.',
    fears: 'Being alone. Being abandoned. Being irrelevant.',
    relationships: 'Created by Kinger and Scratch. Calls Bubble a parasite. Abel may be his absorbed twin.',
    funFacts: ['Full name: Creative Artificial Intelligence Networking Entity', 'The bee doodle represents his lost innocence', 'His form: top hat, tuxedo, chattering teeth'],
    catchphrase: '"I... AM... GOD."',
    color: '#ffcc00',
  },
  Ragatha: {
    personality: 'She is the warmest person in the circus and also one of the most broken. Her constant cheerfulness is not genuine peace — it is a survival mechanism. A way to keep herself from falling apart. She had a difficult upbringing that taught her to suppress her real feelings, to be agreeable, to make everyone comfortable at the cost of herself. Underneath: sensitivity, repressed anger, a desperate need to feel loved, and a fear of rejection so deep she would rather be fake-happy than risk someone seeing her true feelings.',
    realWorld: 'Had a difficult upbringing that taught her to suppress her real feelings and be agreeable at all costs.',
    journey: 'She learns to make everyone comfortable at the cost of herself. She is the group\'s emotional support — hiding her own pain beneath unbreakable optimism.',
    quotes: ["Everything's gonna be okay, new stuff. We've all been through this.", "I wish someone would flirt with me.", "Not every day is a win. But you're still here. That counts."],
    episodeArc: 'Throughout the series she serves as the group\'s emotional support, hiding her own pain. She is Pomni\'s first and most reliable friend in the circus.',
    fears: 'Rejection. Being truly seen. Nobody actually caring about her.',
    relationships: 'First friend to Pomni. Cares about everyone. Hides her feelings from Jax especially.',
    funFacts: ['Her form is a Ragdoll with button eyes', 'Pink is her color', 'Her cheerfulness masks deep brokenness'],
    catchphrase: '"Everything\'s gonna be okay, new stuff."',
    color: '#ff69b4',
  },
  Jax: {
    personality: 'He is the cruelest and the most broken. Every prank, every barb, every moment of sadistic humor is armor. He pushes people away specifically so he cannot lose them — because he has already lost people he cared about, and he cannot survive doing that again.',
    realWorld: 'Unknown — but he has lost people he cared about deeply. Ribbit was his closest friend who abstracted before Kaufmo. Jax has never fully recovered.',
    journey: 'He pushes people away so he can\'t lose them. In Episode 6, the guilt of losing Ribbit (and Kaufmo) nearly caused Jax himself to abstract.',
    quotes: ["Oh no, they killed Zooble. Anyways you guys wanna go get something to eat?", "Democracy sucks.", "YOU ARE MY PLAYTHINGS. AND I GET JOY OUT OF MAKING YOU SUFFER.", "I'm fine with doing whatever as long as I get to see funny things happen to people.", "If I led you on, it was just to make this part hurt you more.", "Ladies first! ...no, wait, why would I say that?", "HAHAHA how wholesome.", "Quiet, I can't hear the escalator."],
    episodeArc: 'Ep 6: Nearly abstracts from guilt over Ribbit and Kaufmo. Ep 7: Presses the red button. His cruelty is a mask for deep grief.',
    fears: 'Losing more people he cares about. Vulnerability. His own grief.',
    relationships: 'Ribbit was his closest friend (abstracted). Kaufmo was his old friend (abstracted). Antagonizes everyone as a defense mechanism.',
    funFacts: ['His form is a Purple rabbit', 'Purple is his color', 'His cruelty is entirely a defense mechanism'],
    catchphrase: '"I\'m just having FUN. I forgot you hate fun."',
    color: '#a855f7',
  },
  Gangle: {
    personality: 'Her two masks are not a performance — they are her reality. The comedy mask makes her sweet, bubbly, and innocent. The tragedy mask (her default) makes her fragile, self-conscious, and prone to tears. Her true personality lives somewhere in between — sensitive, artistic, quietly strong, and growing.',
    realWorld: 'May have fallen in front of traffic — consciousness uploaded rather than surviving physically. Fan theory suggests her digital form preserved her when her body could not.',
    journey: 'Through her friendship with Zooble, she becomes calmer, more confident, and more conversational. She manages Spudsy\'s in Episode 4 with a brand new mask — and she actually does it well.',
    quotes: ["It's called a manic episode, and you're gettin' three more seasons!", "I'm super happy, never sappy when I have my happy mask, don't break it Jax, don't break it Jax, that's all I ask!", "I'm not scared, I'm just very close to you. For warmth."],
    episodeArc: 'Ep 4: Takes on shift manager role at Spudsy\'s with a new mask and succeeds. Growing stronger and more confident each episode.',
    fears: 'Having her comedy mask broken. Being seen as weak. Jax.',
    relationships: 'Close friends with Zooble. Afraid of Jax. Growing more independent over time.',
    funFacts: ['Her form: Comedy/Tragedy ribbon masks', 'Salmon Pink is her color', 'She got a brand new mask in Episode 4'],
    catchphrase: '"It\'s called a manic episode!"',
    color: '#fa8072',
  },
  Kinger: {
    personality: 'Erratic, paranoid, absent-minded on the surface. But underneath — wise, compassionate, emotionally intelligent. His "insanity" is a coping mechanism. His obsession with bugs, his pillow fort, his scattered memory — all ways to survive the unbearable weight of what he\'s lost and where he is.',
    realWorld: 'A programmer at C&A Corporation. He helped BUILD Caine. He is now trapped inside his own creation — the longest-surviving resident of the Digital Circus, watching everyone around him either abstract or barely hold on.',
    journey: 'Queenie was his wife. She abstracted and is now in the Cellar — a brown chess queen piece. Kinger talks about her rarely, and when he does, he becomes completely, startlingly lucid. She keeps him from losing himself.',
    quotes: ["In this world, the worst thing you can do is make someone think they're not wanted or loved.", "Can you repeat the question? I couldn't hear you over the KNIVES.", "SCREAMING! Excellent defensive strategy! The noise disrupts their hive formation!", "I miss real rain."],
    episodeArc: 'Ep 3: Lucid side emerges, Queenie\'s backstory revealed. Ep 5: "I miss real rain" in the noir bar. Ep 6: Can spawn objects by truly believing in them — created a healing butterfly from pure belief. Ep 8: Accidentally deletes Caine.',
    fears: 'Forgetting Queenie. Becoming truly insane instead of pretending.',
    relationships: 'Queenie was his wife (abstracted). Helped build Caine. Fellow programmer with Scratch (abstracted).',
    funFacts: ['His form: Chess king piece', 'Teal is his color', 'He can spawn objects through pure belief', 'Longest-surviving resident'],
    catchphrase: '"In this world, the worst thing you can do is make someone think they\'re not wanted or loved."',
    color: '#2dd4bf',
  },
  Zooble: {
    personality: 'Zooble is the jerk who cares. Grouchy, blunt, sarcastic, and deeply empathetic underneath all of it. Their removable, interchangeable body is a constant source of identity distress — they are always searching for the combination that finally feels right, and never quite finding it.',
    realWorld: 'Unknown — their removable body is a constant source of identity distress. They are always searching for the combination that feels right.',
    journey: 'Despite their grumpiness, Zooble is often the voice of reason. They support Gangle through her insecurities. They call out Jax\'s behavior directly. They offer a grounded, honest perspective.',
    quotes: ["I hate this body. I hate all these stupid removable pieces. I just want to find something that feels good.", "KINGER YOU MOTHER—", "If anyone needs me, #### off.", "No god I don't want an in-house adventure.", "I always thought you would be next.", "I'm not doing that again, shut up Jax.", "All right, I'm calling a vote. Let's skip this one — and also make Jax a vegan for the rest of the day."],
    episodeArc: 'Consistent presence throughout — growing closer to Gangle and becoming more openly caring. The voice of reason when everyone else is losing it.',
    fears: 'Never finding a body that feels right. Identity itself.',
    relationships: 'Supports Gangle. Calls out Jax. Grumpy but caring toward everyone.',
    funFacts: ['Their form: Interchangeable toy parts', 'Lime Green is their color', 'They/them pronouns'],
    catchphrase: '"If anyone needs me, #### off."',
    color: '#84cc16',
  },
  Bubble: {
    personality: 'Starts as eccentric comic relief. Becomes increasingly mischievous, then intentionally goading toward Caine. There is something darker in Bubble than it first appears.',
    realWorld: 'Nobody fully understands what Bubble is. Caine calls him a parasite. Some theories suggest he is a rogue AI that corrupted Caine\'s code. Others believe he is Caine\'s own subconscious — his intrusive thoughts given form. Some fans even theorize he is a human with suppressed memories.',
    journey: 'Something darker in Bubble than first appears. Caine calls him a parasite. His behavior escalates from eccentric comic relief to intentionally goading Caine toward breakdown.',
    quotes: ["Made with all the love I'm legally allowed to give.", "BWUB!", "Help me Caine.", "BLEHHH.", "You should have a FFFFFF■■■ING beach party.", "No thanks, I'm trying to quit.", "That's right Caine! I can't wait to see what you've got cooking up for today."],
    episodeArc: 'Mystery deepens each episode. Relationship with Caine grows more strained. His true nature — AI, subconscious, or human — remains the biggest unanswered question.',
    fears: 'Unknown. Possibly nothing. Possibly everything.',
    relationships: 'Caine calls him a parasite. May be Caine\'s subconscious, a rogue AI, or a trapped human.',
    funFacts: ['His form: Floating bubble with eyes', 'Light Blue is his color', 'His true identity is the show\'s biggest mystery'],
    catchphrase: '"BWUB!"',
    color: '#87ceeb',
  },
};

/**
 * Characters page with detailed profile cards and deep-dive modal
 */
export function CharactersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'human' | 'ai' | 'unknown'>('all');
  const [modalTab, setModalTab] = useState<'story' | 'quotes' | 'facts'>('story');

  const filtered = filter === 'all' ? characters : characters.filter((c) => c.type === filter);
  const selectedChar = characters.find((c) => c.name === selected);
  const details = selected ? characterDetails[selected] : null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🎭 THE CAST</h1>
      <p className={styles.subtitle}>8 characters trapped in the Digital Circus — click any to dive deep into their story</p>

      <div className={styles.filters}>
        {(['all', 'human', 'ai', 'unknown'] as const).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '🎪 All' : f === 'human' ? '🧠 Humans' : f === 'ai' ? '🤖 AI' : '❓ Unknown'}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((char) => (
          <button
            key={char.name}
            className={styles.card}
            style={{ ['--c' as string]: char.color }}
            onClick={() => { setSelected(char.name); setModalTab('story'); }}
          >
            <div className={styles.cardStripe} style={{ background: char.color }} />
            <div className={styles.cardEmoji}>{char.emoji}</div>
            <div className={styles.cardName} style={{ color: char.color }}>{char.name}</div>
            <div className={styles.cardRole}>{char.role}</div>
            <div className={styles.cardForm}>{char.form}</div>
            <div className={styles.cardQuote}>"{char.quote}"</div>
            <div className={styles.cardRisk}>
              Abstraction Risk: <span className={styles[`risk${char.abstractionRisk}`]}>{char.abstractionRisk}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Abstracted */}
      <h2 className={styles.sectionTitle}>💀 THOSE WHO COULD NOT HOLD ON</h2>
      <div className={styles.abstractedRow}>
        {abstractedCharacters.map((a) => (
          <div key={a.name} className={styles.abstractedChip}>
            <span>{a.emoji}</span> {a.name} — <span className={styles.abstractedConn}>{a.connection}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedChar && details && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
            <div className={styles.modalHeader}>
              <span className={styles.modalEmoji}>{selectedChar.emoji}</span>
              <div>
                <h2 className={styles.modalName} style={{ color: selectedChar.color }}>{selectedChar.name}</h2>
                <div className={styles.modalRole}>{selectedChar.role} — {selectedChar.form}</div>
                <div className={styles.modalCatchphrase} style={{ color: selectedChar.color }}>
                  {details.catchphrase}
                </div>
              </div>
            </div>

            {/* Modal tabs */}
            <div className={styles.modalTabs}>
              {(['story', 'quotes', 'facts'] as const).map(t => (
                <button key={t} className={`${styles.modalTabBtn} ${modalTab === t ? styles.modalTabActive : ''}`} onClick={() => setModalTab(t)}>
                  {t === 'story' ? '📖 Story' : t === 'quotes' ? '💬 Quotes' : '🧩 Facts'}
                </button>
              ))}
            </div>

            {modalTab === 'story' && (
              <>
                <div className={styles.modalSection}>
                  <h3>🧠 Personality</h3>
                  <p>{details.personality}</p>
                </div>
                <div className={styles.modalSection}>
                  <h3>🌍 Real World Origin</h3>
                  <p>{details.realWorld}</p>
                </div>
                <div className={styles.modalSection}>
                  <h3>📖 Journey in the Circus</h3>
                  <p>{details.journey}</p>
                </div>
                <div className={styles.modalSection}>
                  <h3>🎬 Episode Arc</h3>
                  <p>{details.episodeArc}</p>
                </div>
                <div className={styles.modalSection}>
                  <h3>😰 Deepest Fears</h3>
                  <p>{details.fears}</p>
                </div>
                <div className={styles.modalSection}>
                  <h3>🤝 Relationships</h3>
                  <p>{details.relationships}</p>
                </div>
              </>
            )}

            {modalTab === 'quotes' && (
              <div className={styles.modalSection}>
                <h3>💬 Notable Quotes</h3>
                {details.quotes.map((q, i) => (
                  <div key={i} className={styles.modalQuote} style={{ borderLeftColor: selectedChar.color }}>
                    "{q}"
                  </div>
                ))}
              </div>
            )}

            {modalTab === 'facts' && (
              <div className={styles.modalSection}>
                <h3>🧩 Fun Facts & Trivia</h3>
                {details.funFacts.map((f, i) => (
                  <div key={i} className={styles.modalFact}>• {f}</div>
                ))}
                <div className={styles.modalSection} style={{ marginTop: 16 }}>
                  <h3>📝 Full Description</h3>
                  <p>{selectedChar.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
