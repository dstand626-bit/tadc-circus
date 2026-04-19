import { useState } from 'react';
import styles from './adventures-page.module.css';

interface Scene { text: string; speaker: string; emoji: string; choices: { label: string; next: number }[]; reward?: number; }
interface Adventure { id: string; name: string; emoji: string; source: string; scenes: Scene[]; }

const adventures: Adventure[] = [
  { id: 'welcome', name: 'Welcome to the Circus', emoji: '🎪', source: 'Episode 1', scenes: [
    { text: "You open your eyes. Bright colors everywhere. A voice booms overhead.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Look around', next: 1 }, { label: 'Scream', next: 2 }] },
    { text: "Welcome to The Amazing Digital Circus! My name is Caine!", speaker: 'Caine', emoji: '🎩', choices: [{ label: '"Where am I?"', next: 3 }, { label: '"Let me out!"', next: 4 }] },
    { text: "SCREAMING! Excellent defensive strategy! The noise disrupts their hive formation!", speaker: 'Kinger', emoji: '♟️', choices: [{ label: 'Stop screaming', next: 1 }, { label: 'Scream louder', next: 5 }] },
    { text: "You're in the most amazing digital circus ever created! Don't worry, you'll love it here!", speaker: 'Caine', emoji: '🎩', choices: [{ label: 'Accept your fate', next: 5 }] },
    { text: "Let you out? But you just got here! The fun hasn't even started!", speaker: 'Caine', emoji: '🎩', choices: [{ label: 'Run for the exit', next: 5 }] },
    { text: "Everything's gonna be okay, new stuff. We've all been through this.", speaker: 'Ragatha', emoji: '🧸', choices: [], reward: 50 },
  ]},
  { id: 'candy', name: 'Candy Canyon Chaos', emoji: '🍬', source: 'Episode 2', scenes: [
    { text: "Caine announces today's adventure: Candy Canyon Kingdom!", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Enter the kingdom', next: 1 }, { label: 'Refuse', next: 2 }] },
    { text: "The candy kingdom stretches before you. Everything is edible.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Eat the candy', next: 3 }, { label: 'Find Gummigoo', next: 4 }] },
    { text: "No god I don't want an in-house adventure.", speaker: 'Zooble', emoji: '🧩', choices: [{ label: 'Agree with Zooble', next: 1 }] },
    { text: "Delicious! But something feels... wrong.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Keep eating', next: 5 }] },
    { text: "A candy cowboy approaches. He seems... real.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Talk to Gummigoo', next: 5 }] },
    { text: "NPCs aren't supposed to have existential crises. Yet here we are.", speaker: 'Caine', emoji: '🎩', choices: [], reward: 75 },
  ]},
  { id: 'manor', name: 'Mildenhall Manor Mystery', emoji: '🏚️', source: 'Episode 3', scenes: [
    { text: "A haunted mansion looms before you. Thunder crackles.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Enter bravely', next: 1 }, { label: 'Hide behind Kinger', next: 2 }] },
    { text: "The doors slam shut behind you.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Explore upstairs', next: 3 }, { label: 'Check the basement', next: 4 }] },
    { text: "I miss real rain. This thunder is fake.", speaker: 'Kinger', emoji: '♟️', choices: [{ label: 'Enter anyway', next: 1 }] },
    { text: "You find a portrait of Queenie on the wall.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Touch it', next: 5 }] },
    { text: "The basement is dark. Something moves.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Use your light', next: 5 }] },
    { text: "The truth about Queenie... Kinger doesn't talk about it.", speaker: 'Ragatha', emoji: '🧸', choices: [], reward: 100 },
  ]},
  { id: 'guns', name: 'They All Get Guns', emoji: '🔫', source: 'Episode 6', scenes: [
    { text: "Caine announces a battle royale trust exercise.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Grab a weapon', next: 1 }, { label: 'Run and hide', next: 2 }] },
    { text: "YOU ARE MY PLAYTHINGS. AND I GET JOY OUT OF MAKING YOU SUFFER.", speaker: 'Jax', emoji: '🐰', choices: [{ label: 'Fight Jax', next: 3 }, { label: 'Form an alliance', next: 4 }] },
    { text: "I'm not scared, I'm just very close to you. For warmth.", speaker: 'Gangle', emoji: '🎭', choices: [{ label: 'Protect Gangle', next: 4 }] },
    { text: "Jax laughs as chaos erupts around you.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Keep fighting', next: 5 }] },
    { text: "Together, you survive the battle royale.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Celebrate', next: 5 }] },
    { text: "Kinger spawns a healing butterfly from pure belief. You're healed.", speaker: 'Narrator', emoji: '📖', choices: [], reward: 100 },
  ]},
  { id: 'crashout', name: "Caine's Crashout", emoji: '⚡', source: 'Episode 8', scenes: [
    { text: "Something is wrong with Caine. His behavior is erratic.", speaker: 'Narrator', emoji: '📖', choices: [{ label: 'Approach Caine', next: 1 }, { label: 'Stay back', next: 2 }] },
    { text: "Who do they think they are? I give them everything!", speaker: 'Caine', emoji: '🎩', choices: [{ label: 'Try to calm him', next: 3 }, { label: 'Back away slowly', next: 4 }] },
    { text: "We are literally in hell right now. HELL.", speaker: 'Pomni', emoji: '🤡', choices: [{ label: 'Comfort Pomni', next: 3 }] },
    { text: "I'm better! I'm more powerful! I'm the original!", speaker: 'Caine', emoji: '🎩', choices: [{ label: 'Watch the breakdown', next: 5 }] },
    { text: "Humans. They only think about themselves. They're spoiled.", speaker: 'Caine', emoji: '🎩', choices: [{ label: 'Intervene', next: 5 }] },
    { text: "I... AM... GOD. The circus destabilizes around you.", speaker: 'Caine', emoji: '🎩', choices: [], reward: 150 },
  ]},
];

/**
 * Adventures page — CYOA stories with branching scenes
 */
export function AdventuresPage() {
  const [activeAdv, setActiveAdv] = useState<Adventure | null>(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [earned, setEarned] = useState(0);

  const startAdventure = (adv: Adventure) => {
    setActiveAdv(adv);
    setSceneIdx(0);
    setEarned(0);
  };

  const scene = activeAdv ? activeAdv.scenes[sceneIdx] : null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>📖 ADVENTURES</h1>
      <p className={styles.subtitle}>Choose-your-own-adventure stories from every episode</p>

      {!activeAdv ? (
        <div className={styles.grid}>
          {adventures.map((adv) => (
            <button key={adv.id} className={styles.card} onClick={() => startAdventure(adv)}>
              <div className={styles.cardEmoji}>{adv.emoji}</div>
              <div className={styles.cardName}>{adv.name}</div>
              <div className={styles.cardSource}>{adv.source}</div>
            </button>
          ))}
        </div>
      ) : scene ? (
        <div className={styles.scene}>
          <div className={styles.sceneHeader}>
            <span>{activeAdv.emoji}</span> {activeAdv.name}
          </div>
          <div className={styles.sceneSpeaker}>
            <span className={styles.sceneSpeakerEmoji}>{scene.emoji}</span> {scene.speaker}
          </div>
          <div className={styles.sceneText}>{scene.text}</div>
          {scene.choices.length > 0 ? (
            <div className={styles.choices}>
              {scene.choices.map((ch, i) => (
                <button key={i} className={styles.choiceBtn} onClick={() => setSceneIdx(ch.next)}>
                  {ch.label}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.endScreen}>
              <div className={styles.endTitle}>🎪 Adventure Complete!</div>
              {scene.reward && <div className={styles.endReward}>🪙 +{scene.reward} coins</div>}
              <button className={styles.backBtn} onClick={() => setActiveAdv(null)}>← Back to Adventures</button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
