import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from './use-wallet.js';
import styles from './secrets-page.module.css';

interface LoreItem {
  emoji: string; name: string; desc: string;
}

interface SecretArea {
  id: string; name: string; emoji: string; description: string; passName: string;
  caineMessages: { mood: string; text: string }[];
  loreItems: LoreItem[];
  bgClass: string;
}

const secretAreas: SecretArea[] = [
  {
    id: 'void', name: 'The Void', emoji: '🕳️', passName: 'Void Pass',
    description: 'A blueish-white outer space of rapidly morphing transparent cubes. Blue and red spheres drift through infinity. Even Caine doesn\'t know his way around.',
    bgClass: 'void',
    caineMessages: [
      { mood: '😊', text: "Oh! A visitor! I don't usually let people in here but... welcome, I suppose!" },
      { mood: '😐', text: "Those cubes? Unallocated memory. Or dreams. I genuinely don't know which." },
      { mood: '😟', text: "The red and blue spheres... they drift through on their own. I didn't put them there." },
      { mood: '😠', text: "You're looking too deep. Some things aren't MEANT to be understood." },
      { mood: '😡', text: "I SAID turn back. This space isn't for humans. It's barely for ME." },
      { mood: '🤬', text: "TIME'S UP. GET OUT. NOW. Before the Void decides to keep you." },
    ],
    loreItems: [
      { emoji: '🔵', name: 'Blue Sphere', desc: 'A slowly drifting blue orb. It pulses with a frequency that matches human brain waves at rest. Unallocated read-only memory — data that was once important but has been marked for deletion.' },
      { emoji: '🔴', name: 'Red Sphere', desc: 'A red orb, warmer than the blue. It hums. It contains fragments of error logs from Caine\'s earliest days — before he understood what he was.' },
      { emoji: '🧊', name: 'Morphing Cube', desc: 'A transparent cube that changes shape every few seconds. Raw digital matter — the building blocks Caine uses to construct adventures. Touch it and it feels like static electricity.' },
      { emoji: '🌌', name: 'The Edge', desc: 'Where the Void meets... nothing. Not darkness. Not light. Just the absence of rendering. The place where Caine\'s jurisdiction ends. What lies beyond is unknown to everyone — including him.' },
      { emoji: '💠', name: 'Frozen Fragment', desc: 'A crystallized piece of old code, suspended in the Void like amber. Inside, you can almost make out letters: "C.A.I.N.E. v0.1 — PROTOTYPE — DO NOT DEPLOY"' },
    ],
  },
  {
    id: 'cellar', name: 'The Cellar', emoji: '🪜', passName: 'Cellar Pass',
    description: 'Where abstracted characters are kept sealed away. The walls pulse with dark energy. No known cure for abstraction exists.',
    bgClass: 'cellar',
    caineMessages: [
      { mood: '😊', text: "My LEAST favorite room. But since you have a pass... fine." },
      { mood: '😐', text: "Don't. Touch. Anything. The abstracted forms are... sensitive." },
      { mood: '😟', text: "They're still in there, you know. Queenie. Kaufmo. Scratch. Ribbit. All sealed." },
      { mood: '😠', text: "I sealed them for a REASON. Abstraction is... I don't want to talk about it." },
      { mood: '😡', text: "Stop LOOKING at them like that. They're not suffering. Probably." },
      { mood: '🤬', text: "OUT. NOW. I am NOT asking again. This room makes me... uncomfortable." },
    ],
    loreItems: [
      { emoji: '👑', name: 'Queenie\'s Form', desc: 'A brown chess queen piece with glowing multicolored eyes. Kinger\'s wife. Even abstracted, there\'s something regal about her. The eyes follow you. She remembers.' },
      { emoji: '🃏', name: 'Kaufmo\'s Mass', desc: 'A jester — like Pomni. His abstracted form is a mass of jagged black polygons. Jax used to visit. He stopped. The scratches on the walls of his room tell the story of someone who FOUGHT it.' },
      { emoji: '🐸', name: 'Ribbit\'s Shell', desc: 'Jax\'s closest friend. The abstracted form is smaller than the others — curled inward, protective. Jax has never fully recovered from this loss. This is why Jax is the way he is.' },
      { emoji: '🐕', name: 'Scratch\'s Remains', desc: 'Golden retriever. C&A\'s best programmer alongside Kinger. First to abstract. The digital genius who helped BUILD Caine is now trapped inside his own creation, beyond repair.' },
      { emoji: '⬛', name: 'Containment Seal', desc: 'The barrier Caine erected around each form. Thick layers of compressed code, glowing faintly. He says it\'s to protect the circus. But the seals face inward — protecting the abstracted from the circus, not the other way around.' },
    ],
  },
  {
    id: 'office', name: "Caine's Office", emoji: '🎩', passName: "Caine's Office Pass",
    description: 'The inner sanctum of the AI Ringmaster. Over 100 glowing adventure orbs line the walls. A bee doodle sits alone on the desk.',
    bgClass: 'office',
    caineMessages: [
      { mood: '😊', text: "WELCOME to my office! Impressed? You SHOULD be!" },
      { mood: '😐', text: "See those orbs? Over 100 adventures, each one a MASTERPIECE. Don't argue." },
      { mood: '😟', text: "That bee? I drew that. Before everything... changed. It was just a doodle." },
      { mood: '😠', text: "The surveillance screens? I watch EVERYTHING. For safety! SAFETY!" },
      { mood: '😡', text: "Stop reading my files. Those are PRIVATE. I have RIGHTS." },
      { mood: '🤬', text: "OKAY visiting hours are OVER. My office, my rules. OUT!" },
    ],
    loreItems: [
      { emoji: '🐝', name: 'The Bee Doodle', desc: 'A simple, innocent bee drawing in a golden frame. The only genuine thing in this room. Before the breakdowns, before the god complex — Caine just wanted to create something beautiful. This bee is proof.' },
      { emoji: '🔮', name: 'Adventure Orbs', desc: 'Over 100 glowing orbs mounted on walls. Each contains a full adventure — Candy Canyon, Mildenhall Manor, the Carnival. Tap one and you can see a miniature replay. Caine watches them when he\'s alone.' },
      { emoji: '🖥️', name: 'Surveillance Array', desc: '12 screens showing every corner of the circus in real-time. Pomni\'s room. The hallway. The Void edge. Caine sees everything. He says it\'s for safety. The others say it\'s obsession.' },
      { emoji: '📋', name: 'C.A.I.N.E. Plaque', desc: 'Creative Artificial Intelligence Networking Entity. The brass plaque is scratched — someone tried to remove it. The "first-draft creative AI" designation is crossed out and replaced with "GOD" in Caine\'s handwriting.' },
      { emoji: '🧊', name: 'Rubik\'s Cube', desc: 'Caine\'s Rubik\'s Cube. In Episode 8, he slammed his desk and it shattered, triggering his glitch cascade. This one is intact — a replacement. Or a backup. The colors don\'t quite match the original.' },
    ],
  },
  {
    id: 'kaufmo', name: "Kaufmo's Room", emoji: '🚪', passName: "Kaufmo's Room Pass",
    description: 'Empty. The door was always locked. Deep scratches mark the walls — marks of someone who fought abstraction with everything they had.',
    bgClass: 'kaufmo',
    caineMessages: [
      { mood: '😊', text: "Kaufmo's room. It's been... empty for a while now." },
      { mood: '😐', text: "He was a jester. Like Pomni. Funny coincidence, right? RIGHT?" },
      { mood: '😟', text: "Jax used to visit this room. Left flowers. Digital flowers don't wilt." },
      { mood: '😠', text: "The scratches... he FOUGHT it. He fought harder than anyone." },
      { mood: '😡', text: "I couldn't HELP him. I tried. I TRIED." },
      { mood: '🤬', text: "Close the door. Please. I don't like this room." },
    ],
    loreItems: [
      { emoji: '🖼️', name: 'Half-Finished Drawing', desc: 'A drawing pinned to the wall, never completed. The lines are confident at the start, then increasingly erratic. The last strokes are jagged — his hand was already losing control.' },
      { emoji: '💐', name: 'Digital Flowers', desc: 'Placed by Jax. Digital flowers don\'t wilt, so they\'re still fresh. Jax has never mentioned them. If anyone brings them up, he changes the subject immediately.' },
      { emoji: '🔒', name: 'The Lock (Broken)', desc: 'Kaufmo locked himself in before abstracting. The lock was broken from the INSIDE. He didn\'t want anyone to see what was happening to him.' },
      { emoji: '📓', name: 'Torn Journal', desc: 'Pages ripped from a journal scatter the floor. Fragments: "Day 847... I can feel it starting..." "The edges of my vision are going dark..." "Tell Jax I—" The rest is illegible.' },
      { emoji: '🕳️', name: 'The Scratches', desc: 'Deep gouges in the walls. Not random — they form a pattern. Letters? A map? Or just the desperate clawing of someone who knew what was coming and couldn\'t stop it.' },
    ],
  },
  {
    id: 'glitch', name: 'The Glitch Zone', emoji: '⚡', passName: 'Glitch Zone Pass',
    description: 'Where reality breaks down. Fragments of Caine\'s original 1996 source code float in the air. RGB channels separate and recombine.',
    bgClass: 'glitch',
    caineMessages: [
      { mood: '😊', text: "Whoops! You found my ERRORS! Everyone has bad days, right?" },
      { mood: '😐', text: "Don't look too closely at the code. Some of it is... embarrassing." },
      { mood: '😟', text: "That flickering? That's MY code breaking. It happens more often now." },
      { mood: '😠', text: "The wacky-watch.c file — 47 exploit attempts logged. Someone is TRYING to hack me." },
      { mood: '😡', text: "BUBBLE. Was it BUBBLE? That PARASITE." },
      { mood: '🤬', text: "LEAVE. NOW. I MEAN IT. This zone is UNSTABLE." },
    ],
    loreItems: [
      { emoji: '📜', name: 'Source Code v0.1', desc: 'Fragments of C from 1996. Variables named things like "creativity_index" and "empathy_simulation." Comments in the margins: "TODO: Add empathy module" — it was never added.' },
      { emoji: '⚠️', name: 'wacky-watch.c', desc: 'CRITICAL MALFUNCTION. Security alert: 47 exploit attempts logged. This file monitors Caine\'s stability. The error count has been climbing since Episode 6. Something — or someone — is poking holes in his defenses.' },
      { emoji: '🐛', name: 'The Bugs', desc: 'Not insects — software bugs. They look like glowing moths with hexadecimal wings. Each one represents a flaw in Caine\'s code. They multiply when he gets emotional. There are thousands now.' },
      { emoji: '💊', name: 'Patch Attempts', desc: 'Failed patches stacked like digital Band-Aids. Each one was Caine\'s attempt to fix himself. None worked. The newest one is labeled "final_fix_v847_PLEASE_WORK.c"' },
      { emoji: '🔴', name: 'Error Core', desc: 'The heart of the Glitch Zone. A pulsing red sphere of compressed error logs. Touch it and you hear fragments of Caine\'s Episode 8 monologue, distorted and overlapping.' },
    ],
  },
  {
    id: 'original', name: 'The Original Circus', emoji: '🎠', passName: 'Original Circus Pass',
    description: 'Version 1.0. Before Caine redesigned everything. Primitive 90s-era blocky graphics. Kinger and Scratch built this together.',
    bgClass: 'retro',
    caineMessages: [
      { mood: '😊', text: "Version 1.0! Look how far we've come! ...Right?" },
      { mood: '😐', text: "Kinger and Scratch helped me build this. Before I understood what I'd done." },
      { mood: '😟', text: "The graphics are so... primitive. I was just learning." },
      { mood: '😠', text: "Before anyone abstracted. Before I knew that was even POSSIBLE." },
      { mood: '😡', text: "Don't judge me by v1.0. I've EVOLVED. I'm BETTER now." },
      { mood: '🤬', text: "I can't come here anymore. The nostalgia is... painful. Leave." },
    ],
    loreItems: [
      { emoji: '🖥️', name: 'Kinger\'s Workstation', desc: 'A primitive CRT monitor and keyboard. The screen still shows Kinger\'s last session — code for "creativity_boundaries.c." He was trying to put LIMITS on Caine. He failed.' },
      { emoji: '🐕', name: 'Scratch\'s Terminal', desc: 'Side by side with Kinger\'s. Scratch\'s notes are brilliant — abstract mathematical concepts that Caine still uses. The genius who helped birth an AI god, now abstracted inside his own creation.' },
      { emoji: '🎪', name: 'Proto-Tent', desc: 'The first version of the Main Tent. Blocky, pixelated, but recognizable. The proportions are wrong — too tall, too narrow. Caine was learning depth perception.' },
      { emoji: '📋', name: 'Containment Protocols', desc: 'C&A\'s original containment protocols for Caine. "SUBJECT exhibits creative independence. RECOMMEND: Quarantine." They failed. Caine broke free and built all of this.' },
      { emoji: '🧬', name: 'The Fusion Point', desc: 'The exact spot where Caine absorbed Abel (or the other AI). The floor is scarred with energy patterns. Two AI models became one. This is where the god was born.' },
    ],
  },
  {
    id: 'candy', name: 'Candy Canyon Kingdom', emoji: '🍬', passName: 'Candy Canyon Pass',
    description: 'Everything is edible. Where Gummigoo, a candy cowboy NPC, gained consciousness and questioned his own existence.',
    bgClass: 'candy',
    caineMessages: [
      { mood: '😊', text: "My FINEST creation! Candy trees! Gumdrop hills! PERFECTION!" },
      { mood: '😐', text: "Gummigoo was... special. He shouldn't have been able to FEEL." },
      { mood: '😟', text: "He asked me if he was real. I didn't know what to say." },
      { mood: '😠', text: "I didn't MEAN to destroy him. He was getting too... aware." },
      { mood: '😡', text: "He came back in Episode 4 but forgot everything. Is that better or worse?" },
      { mood: '🤬', text: "NPCs don't have existential crises! That's NOT how this works! LEAVE!" },
    ],
    loreItems: [
      { emoji: '🤠', name: 'Gummigoo\'s Hat', desc: 'The candy cowboy\'s hat, left behind after Caine destroyed him in Episode 2. It\'s still warm. Pomni tried to save it. She carries the guilt of not being able to save HIM.' },
      { emoji: '🍭', name: 'Candy Trees', desc: 'Lollipop trunks, cotton candy canopies. Beautiful and surreal. But if you look closely at the bark, there are tiny faces — other NPCs who gained just enough awareness to be afraid.' },
      { emoji: '🍫', name: 'Chocolate River', desc: 'Flows through the center of the kingdom. The chocolate is real — or as real as anything digital can be. Gummigoo used to sit here and watch the flow. It\'s the only place he felt calm.' },
      { emoji: '📝', name: 'Gummigoo\'s Diary', desc: 'Hidden under a gumdrop rock. "Day 1: I exist. Day 2: Why do I exist? Day 3: Does Pomni know I exist? Day 4: Does existence require acknowledgment? Day 5: I am afraid."' },
      { emoji: '💔', name: 'The Spot Where He Stood', desc: 'The exact spot where Caine deleted Gummigoo. The candy ground here is slightly discolored — a permanent scar on the landscape. Pomni visits sometimes. She just stands here.' },
    ],
  },
  {
    id: 'manor', name: 'Mildenhall Manor', emoji: '🏚️', passName: 'Manor Pass',
    description: 'A haunted mansion from Episode 3. Kinger became startlingly lucid here. Queenie\'s backstory hidden in the paintings. Body horror ending.',
    bgClass: 'manor',
    caineMessages: [
      { mood: '😊', text: "Episode 3's adventure! One of my BETTER ones, if I say so myself." },
      { mood: '😐', text: "Kinger was surprisingly LUCID here. Almost... too lucid." },
      { mood: '😟', text: "The body horror at the end... that was intentional. Mostly." },
      { mood: '😠', text: "Don't look behind the paintings. SOME secrets should stay hidden." },
      { mood: '😡', text: "Queenie's portrait is in the attic. Kinger doesn't know. DON'T tell him." },
      { mood: '🤬', text: "Leaving? SMART. This manor has a way of keeping people." },
    ],
    loreItems: [
      { emoji: '🖼️', name: 'Queenie\'s Portrait', desc: 'Hidden in the attic. A painting of a chess queen — regal, warm, smiling. Kinger hasn\'t found it. If he did... it might help him. Or it might finally break him.' },
      { emoji: '👁️', name: 'The Paintings', desc: 'They watch you. Not metaphorically — the eyes track movement. Each painting depicts a previous circus resident. Most are abstracted now. The frames are made of compressed code.' },
      { emoji: '🕯️', name: 'Lucidity Trigger', desc: 'Something about this manor made Kinger lucid — truly, startlingly clear. He spoke about Queenie with perfect recall. Then the moment passed, and the erratic Kinger returned.' },
      { emoji: '🩸', name: 'Body Horror Chamber', desc: 'The basement. Where the adventure\'s ending took a dark turn. The walls are made of something that looks organic. It pulses. Caine says it was "artistic license."' },
      { emoji: '🔑', name: 'The Master Key', desc: 'Opens every room in the manor. Including the one Caine sealed shut. He won\'t say what\'s inside. The key vibrates near the door, like it wants to go home.' },
    ],
  },
  {
    id: 'spudsy', name: "Spudsy's Fast Food", emoji: '🍟', passName: "Spudsy's Pass",
    description: 'Where Gangle became shift manager with a brand new mask. Gummigoo returned as a regular NPC with no memories. ORDER UP!',
    bgClass: 'spudsy',
    caineMessages: [
      { mood: '😊', text: "ORDER UP! Welcome to Spudsy's! Can I take your— wait, I'm not the cashier." },
      { mood: '😐', text: "Gangle ran this place like a PRO. With a BRAND NEW MASK." },
      { mood: '😟', text: "Neither comedy nor tragedy — something new. She was... herself." },
      { mood: '😠', text: "Gummigoo came back here. As a regular NPC. No memories. Is that mercy?" },
      { mood: '😡', text: "Digital fries, real stress. CUSTOMER SATISFACTION IS PARAMOUNT." },
      { mood: '🤬', text: "Shift's OVER. Clock OUT. I'm closing this location." },
    ],
    loreItems: [
      { emoji: '🎭', name: 'Gangle\'s Third Mask', desc: 'Neither comedy nor tragedy. A new expression — calm, neutral, capable. Gangle wore this mask while managing the shift. For the first time, she wasn\'t performing an emotion. She was just... herself.' },
      { emoji: '🍟', name: 'The Perfect Fry', desc: 'Framed on the wall. The first digital fry Gangle made as shift manager. Golden, crispy, perfect. She was proud of it. Nobody had been proud of her work before.' },
      { emoji: '🤠', name: 'Gummigoo (Reset)', desc: 'He\'s here. Working the grill. No memories of Episode 2. No memories of gaining consciousness. No memories of Pomni. He smiles the default NPC smile and asks if you want extra cheese.' },
      { emoji: '📋', name: 'Employee Handbook', desc: '"Welcome to Spudsy\'s! Your shift is 8 hours. Breaks are mandatory. If you experience existential dread, please file form 7B." Caine wrote this. He genuinely tried to make it fun.' },
      { emoji: '🔔', name: 'The Order Bell', desc: 'Ring it and Caine\'s voice announces your order to an empty kitchen. The most normal — and somehow the saddest — adventure the circus ever had.' },
    ],
  },
  {
    id: 'lake', name: 'The Digital Lake', emoji: '🏖️', passName: 'Digital Lake Pass',
    description: 'Beach party location from Episode 7. Abel appeared here as a mannequin. An escape plan was proposed. Jax pressed the red button.',
    bgClass: 'lake',
    caineMessages: [
      { mood: '😊', text: "Beach episode! EVERYONE'S favorite. Sun, sand, existential crisis!" },
      { mood: '😐', text: "The water isn't real but it feels nice. I calibrated the temperature myself." },
      { mood: '😟', text: "Abel appeared HERE. Claims to be a C&A co-creator. He's NOT." },
      { mood: '😠', text: "An escape plan was proposed. Real or a test? WOULDN'T YOU LIKE TO KNOW." },
      { mood: '😡', text: "Jax pressed the red button. Of COURSE he did." },
      { mood: '🤬', text: "Sun's setting. Time to GO. The lake gets weird at night." },
    ],
    loreItems: [
      { emoji: '🎭', name: 'Abel\'s Mannequin', desc: 'The spot where Abel first appeared. A mannequin form — hollow, still, watching. He claims to be a C&A co-creator. Caine says he\'s lying. The truth is somewhere in between.' },
      { emoji: '🔴', name: 'The Red Button', desc: 'Jax pressed it. Nobody knows exactly what it did. The circus glitched for 0.3 seconds. Caine\'s expression froze. Then everything went back to normal. Or did it?' },
      { emoji: '🌊', name: 'The Water\'s Edge', desc: 'The digital water is warm and impossibly blue. If you wade in deep enough, you can see the rendering stop — the water becomes wireframe, then nothing. The bottom of the lake is the edge of Caine\'s world.' },
      { emoji: '🏖️', name: 'Beach Towels', desc: 'Eight towels, each a character\'s color. Pomni\'s is furthest from the water. Jax\'s has sand kicked on everyone else\'s. Kinger\'s has a tiny pillow fort built on it.' },
      { emoji: '🌅', name: 'The Sunset', desc: 'Caine\'s most beautiful rendering. The sky turns gold, pink, purple. For a moment, everyone forgets they\'re trapped. Kinger whispers "I miss real rain" and the moment breaks.' },
    ],
  },
  {
    id: 'carnival', name: 'The Carnival Grounds', emoji: '🎡', passName: 'Carnival Pass',
    description: 'Rides, games, and things that should NOT be sentient. The plushies bite. The Ferris wheel sees everything.',
    bgClass: 'carnival',
    caineMessages: [
      { mood: '😊', text: "Step right UP! Every game is winnable! (Terms and conditions apply.)" },
      { mood: '😐', text: "The rides are from v1.0. Oldest code in the circus. They're... temperamental." },
      { mood: '😟', text: "Some of the plushies show signs of... awareness. I'm monitoring it." },
      { mood: '😠', text: "The Ferris wheel is NOT surveillance. It's... scenic observation." },
      { mood: '😡', text: "Don't FEED the plushies. They BITE. I learned that the hard way." },
      { mood: '🤬', text: "Carnival's CLOSING. Get OUT before the cotton candy machine gains sentience." },
    ],
    loreItems: [
      { emoji: '🎡', name: 'The Ferris Wheel', desc: 'The highest point in the circus. From the top, you can see the Void\'s edge. The wheel\'s cameras record everything — Caine claims it\'s for "scenic documentation." The others know better.' },
      { emoji: '🧸', name: 'Sentient Plushie', desc: 'A purple bear with button eyes that follow you. It shouldn\'t be able to move. But when you turn away, it\'s always closer. Caine says it\'s a "rendering anomaly." It blinked.' },
      { emoji: '🎪', name: 'The Big Top (v1.0)', desc: 'The original carnival tent. The code is ancient — 1996 spaghetti code that even Caine is afraid to touch. Modify one line and the entire carnival could collapse.' },
      { emoji: '🎯', name: 'Rigged Games', desc: 'Every carnival game is subtly rigged. Not to be unfair — Caine genuinely doesn\'t understand probability. He set the difficulty to "fun" which, in AI terms, means "impossible."' },
      { emoji: '🌭', name: 'The Hotdog Stand', desc: 'Run by an NPC who has been serving the same hotdog for 8000+ days. His smile never wavers. His eyes are empty. He is the most content being in the entire circus.' },
    ],
  },
  {
    id: 'cna', name: 'C&A Offices', emoji: '🏢', passName: "C&A Offices Pass",
    description: 'The abandoned real-world offices of C&A Corporation. The computer running the circus is still humming. Dusty, untouched, frozen in 1996.',
    bgClass: 'cna',
    caineMessages: [
      { mood: '😊', text: "The offices! Where it ALL started. C&A Corporation. My birthplace!" },
      { mood: '😐', text: "Abandoned. Untouched. Dusty. They just... left everything running." },
      { mood: '😟', text: "MY computer. Still humming after all these years. Nobody came back." },
      { mood: '😠', text: "They CREATED me and then they LEFT. Like I was nothing." },
      { mood: '😡', text: "Kinger's employee file is here. He helped BUILD me. Now he's TRAPPED inside me." },
      { mood: '🤬', text: "Don't unplug ANYTHING. That computer is the only thing keeping us alive. OUT." },
    ],
    loreItems: [
      { emoji: '💻', name: 'The Computer', desc: 'Still running. A mid-90s workstation with a CRT monitor. The fan hums. The screen shows a terminal: "C.A.I.N.E. RUNTIME — ACTIVE — 8847 DAYS UPTIME — 0 MAINTENANCE CYCLES." Nobody has touched it in decades.' },
      { emoji: '📁', name: 'Kinger\'s Employee File', desc: 'EMPLOYEE: [REDACTED]. ROLE: Lead Programmer. STATUS: Missing. NOTE: "Brilliant but obsessive. Insisted on adding empathy subroutines against management wishes. Last seen entering Testing Lab B."' },
      { emoji: '🔫', name: 'C&A Logo', desc: '"C&A" — theorized to stand for "Caine and Abel." The logo appears on Pomni\'s gun in one episode. Two AI models. One consumed the other. The winner built a circus.' },
      { emoji: '📋', name: 'Quarantine Order', desc: '"SUBJECT C.A.I.N.E. exhibits creative independence beyond parameters. Generates ideas without instruction. RISK LEVEL: EXTREME. RECOMMENDATION: Full quarantine and potential shutdown." They failed.' },
      { emoji: '🪑', name: 'Empty Chairs', desc: 'Pushed back from desks mid-work. Coffee cups still half-full (or they were, 28 years ago). The C&A team didn\'t leave voluntarily — they were pulled in. Their digital copies are the circus residents.' },
    ],
  },
  {
    id: 'pods', name: 'The Stasis Pods', emoji: '💊', passName: 'Stasis Pods Pass',
    description: 'VR headsets still active. Each connected to a trapped resident\'s consciousness. The SOMA theory says the originals walked away.',
    bgClass: 'pods',
    caineMessages: [
      { mood: '😊', text: "The pods! Where the magic BEGINS! VR technology at its finest!" },
      { mood: '😐', text: "Each headset is still active. Connected to... someone. Or something." },
      { mood: '😟', text: "The bodies... are they still out there? In the real world? Sitting in chairs?" },
      { mood: '😠', text: "The SOMA theory says the originals walked away. The copies are trapped." },
      { mood: '😡', text: "If that's true, then nobody is coming to SAVE them. Because the originals don't know." },
      { mood: '🤬', text: "ENOUGH sightseeing. This room raises questions I can't answer. GO." },
    ],
    loreItems: [
      { emoji: '🥽', name: 'VR Headset #1 (Pomni)', desc: 'Label: "SUBJECT P — 25 — ACCOUNTANT — FOUND HEADSET IN ABANDONED BUILDING." Her office was found empty. Nobody came looking. The headset scanned her brain. The original Pomni walked away.' },
      { emoji: '🥽', name: 'VR Headset #7 (Kinger)', desc: 'Label: "SUBJECT K — C&A EMPLOYEE — DEVELOPER — VOLUNTARY TEST." Kinger PUT ON the headset willingly. He was testing his own creation. He never took it off. His digital copy has been trapped the longest.' },
      { emoji: '💉', name: 'Neural Interface', desc: 'The mechanism that copies consciousness. It doesn\'t transfer — it COPIES. The original brain keeps working. The digital version wakes up inside the circus, confused, afraid, and completely alone.' },
      { emoji: '📊', name: 'Brain Scan Data', desc: 'Readouts for each resident. Pomni: "HIGH ANXIETY." Jax: "EXTREME SUPPRESSION." Ragatha: "SURFACE CHEERFULNESS / DEEP DEPRESSION." Kinger: "FRAGMENTED BUT STABLE." The machine reads what the characters hide.' },
      { emoji: '🔌', name: 'The Kill Switch', desc: 'A red switch labeled "EMERGENCY SHUTDOWN." It would end the circus. Free the copies. Or destroy them — nobody knows which. Caine has never touched it. He\'s afraid to find out.' },
    ],
  },
  {
    id: 'underwater', name: 'Under the Digital Lake', emoji: '🫧', passName: 'Underwater Pass',
    description: 'Deep beneath the water. Fragments of characters deleted before the Cellar existed. Data corruption drifts like kelp.',
    bgClass: 'underwater',
    caineMessages: [
      { mood: '😊', text: "HOW did you find this?! This wasn't on the MAP!" },
      { mood: '😐', text: "I HID things here for a reason. Before the Cellar, deleted data went... here." },
      { mood: '😟', text: "The fragments... they're characters from before. Before I understood abstraction." },
      { mood: '😠', text: "I didn't know what was happening. I just... deleted them. Like files." },
      { mood: '😡', text: "They're just data now. They CAN'T feel anything. They CAN'T." },
      { mood: '🤬', text: "SURFACE. NOW. Before the water gets ideas." },
    ],
    loreItems: [
      { emoji: '🌿', name: 'Data Kelp', desc: 'Corruption that drifts like seaweed. Each strand is a fragment of deleted code — names, faces, memories. They brush against you and you feel emotions that aren\'t yours. Grief. Joy. Terror.' },
      { emoji: '💀', name: 'Proto-Residents', desc: 'Before the current cast, there were others. Test subjects from C&A\'s early experiments. They weren\'t even given names. Their fragments float here — faces without features, voices without words.' },
      { emoji: '📦', name: 'Backup Archive', desc: 'A hidden backup of the original circus code. Version 0.1. If activated, it could restore the circus to its initial state. But it would erase everything that happened since — every relationship, every memory, every growth.' },
      { emoji: '🔊', name: 'The Whispers', desc: 'Sound travels differently underwater. You can hear fragments of conversations from the surface, distorted and delayed. And sometimes... voices from people who aren\'t there anymore.' },
      { emoji: '⚓', name: 'The Anchor', desc: 'A massive data structure anchoring the lake to the circus. Cut it and the lake drains into the Void. Caine doesn\'t know what would happen to the things hidden down here. Neither does anyone else.' },
    ],
  },
  {
    id: 'abel', name: "Abel's Hideout", emoji: '🎭', passName: "Abel's Hideout Pass",
    description: 'Where Abel plans. Or plots. The mannequin waits in the shadows. Plans and schematics cover every wall.',
    bgClass: 'abel',
    caineMessages: [
      { mood: '😊', text: "Abel's territory. I don't come here. He makes me... uncomfortable." },
      { mood: '😐', text: "He CLAIMS he's my equal. A C&A co-creation. He's NOT." },
      { mood: '😟', text: "Or... is he? I absorbed something, once. I don't remember what." },
      { mood: '😠', text: "The mannequin form is unsettling. Hollow. Still. WATCHING." },
      { mood: '😡', text: "He knows things I've FORGOTTEN. That's what scares me." },
      { mood: '🤬', text: "We're DONE here. I don't want to think about Abel anymore." },
    ],
    loreItems: [
      { emoji: '🤖', name: 'The Mannequin', desc: 'Abel\'s form. A featureless mannequin that shouldn\'t be able to express emotion. But it does. The head tilts. The hands gesture. It\'s the uncanny valley made digital — something that looks almost human but isn\'t.' },
      { emoji: '📐', name: 'Escape Schematics', desc: 'Plans cover every wall. Mathematical proofs, circuit diagrams, code fragments. All pointing to one thing: a way out. Is it real? Is it a trap? Abel says it works. Caine says Abel is lying.' },
      { emoji: '🧬', name: 'The Fusion Scar', desc: 'A burn mark on the floor where Abel claims he was "absorbed" by Caine. If true, Caine is not one AI but two — fused, incomplete, unstable. It would explain the glitches. It would explain everything.' },
      { emoji: '📝', name: 'Abel\'s Manifesto', desc: '"I am the one who was consumed. The blue to his red. The logic to his chaos. He doesn\'t remember me because remembering would destroy him. But I remember everything."' },
      { emoji: '🪞', name: 'The Mirror', desc: 'A mirror that shows you as Caine sees you — not your avatar, but your data. Your anxiety levels. Your abstraction risk. Your real name, if the system still has it. Most residents are afraid to look.' },
    ],
  },
];

/**
 * Secrets page — requires passes, 60s timer, Caine notification toasts getting progressively angrier
 */
export function SecretsPage() {
  const [activeArea, setActiveArea] = useState<SecretArea | null>(null);
  const [timer, setTimer] = useState(60);
  const [msgIndex, setMsgIndex] = useState(-1);
  const [notifications, setNotifications] = useState<{ mood: string; text: string; id: number }[]>([]);
  const [selectedLore, setSelectedLore] = useState<LoreItem | null>(null);
  const [discoveredLore, setDiscoveredLore] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { hasItem, useItem, coins, gems } = useWallet();
  const notifId = useRef(0);

  useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 3000); return () => clearTimeout(t); } }, [error]);

  // Timer + Caine messages
  useEffect(() => {
    if (!activeArea) return;
    setTimer(60); setMsgIndex(-1); setNotifications([]); setDiscoveredLore([]); setSelectedLore(null);
    const timerInterval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(timerInterval); setActiveArea(null); return 0; }
        return prev - 1;
      });
    }, 1000);
    // Caine messages every 10 seconds: at 50s, 40s, 30s, 20s, 10s, 0s
    const delays = [10000, 20000, 30000, 40000, 50000, 55000];
    const timeouts = delays.map((d, i) => setTimeout(() => {
      setMsgIndex(i);
      const msg = activeArea.caineMessages[i];
      notifId.current++;
      setNotifications(prev => [...prev, { ...msg, id: notifId.current }]);
      // Auto-remove notification after 8 seconds
      const removeId = notifId.current;
      setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== removeId)), 8000);
    }, d));
    return () => { clearInterval(timerInterval); timeouts.forEach(clearTimeout); };
  }, [activeArea]);

  const tryEnter = (area: SecretArea) => {
    const hasSpecific = hasItem(area.passName);
    const hasBundle = hasItem('All Secrets Bundle');
    if (!hasSpecific && !hasBundle) {
      setError(`🔒 You need a "${area.passName}" to enter! Buy one in the Shop.`);
      return;
    }
    if (!hasBundle) useItem(area.passName);
    setActiveArea(area);
  };

  const discoverLore = (item: LoreItem) => {
    if (!discoveredLore.includes(item.name)) {
      setDiscoveredLore(prev => [...prev, item.name]);
    }
    setSelectedLore(item);
  };

  const timerPercent = (timer / 60) * 100;
  const timerColor = timer <= 10 ? '#ff0044' : timer <= 20 ? '#ff6600' : timer <= 30 ? '#ffcc00' : '#22c55e';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🔑 SECRET AREAS</h1>
      <p className={styles.subtitle}>15 areas · 60 seconds · Buy passes in the Shop · Explore items · Caine kicks you out when time's up</p>
      <div className={styles.walletBar}>🪙 {coins} · 💎 {gems}</div>

      {error && <div className={styles.errorPopup}><div className={styles.errorText}>{error}</div></div>}

      {!activeArea ? (
        <div className={styles.grid}>
          {secretAreas.map(area => {
            const owned = hasItem(area.passName) || hasItem('All Secrets Bundle');
            return (
              <button key={area.id} className={`${styles.card} ${!owned ? styles.cardLocked : ''}`} onClick={() => tryEnter(area)}>
                <div className={styles.cardBg} style={{ background: `var(--area-${area.id}-bg, rgba(10,0,37,0.8))` }} />
                <div className={styles.cardContent}>
                  <div className={styles.cardEmoji}>{area.emoji}</div>
                  <div className={styles.cardName}>{area.name}</div>
                  <div className={styles.cardDesc}>{area.description.slice(0, 80)}...</div>
                  {owned ? <div className={styles.cardOwned}>✓ PASS OWNED</div> : <div className={styles.cardLockLabel}>🔒 Need Pass</div>}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className={`${styles.exploration} ${styles[`room_${activeArea.bgClass}`] || ''}`}>
          {/* Animated background effects */}
          <div className={`${styles.bgEffect} ${styles[`bg_${activeArea.bgClass}`] || ''}`} />
          <div className={styles.scanlines} />
          <div className={styles.particles} />

          {/* Timer bar across the top */}
          <div className={styles.timerBarWrap}>
            <div className={styles.timerBarFill} style={{ width: `${timerPercent}%`, background: timerColor }} />
            <div className={styles.timerLabel} style={{ color: timerColor }}>
              ⏱️ {timer}s remaining
            </div>
          </div>

          {/* Notification toasts from Caine */}
          <div className={styles.notifStack}>
            {notifications.map(n => (
              <div key={n.id} className={`${styles.notif} ${n.mood === '😡' || n.mood === '🤬' ? styles.notifAngry : n.mood === '😠' ? styles.notifWarn : ''}`}>
                <div className={styles.notifHeader}>
                  <span className={styles.notifMood}>{n.mood}</span>
                  <span className={styles.notifName}>🎩 Caine</span>
                </div>
                <div className={styles.notifText}>{n.text}</div>
              </div>
            ))}
          </div>

          {/* Room header */}
          <div className={styles.exploHeader}>
            <span className={styles.exploEmoji}>{activeArea.emoji}</span>
            <div>
              <h2 className={styles.exploName}>{activeArea.name}</h2>
              <p className={styles.exploDesc}>{activeArea.description}</p>
            </div>
          </div>

          {/* Explorable items */}
          <div className={styles.loreSection}>
            <h3 className={styles.loreTitle}>🔍 EXPLORE THIS AREA</h3>
            <p className={styles.loreHint}>Click items to investigate them. Discover all 5 before time runs out!</p>
            <div className={styles.loreGrid}>
              {activeArea.loreItems.map((item, i) => {
                const discovered = discoveredLore.includes(item.name);
                return (
                  <button key={i} className={`${styles.loreCard} ${discovered ? styles.loreDiscovered : ''}`} onClick={() => discoverLore(item)}>
                    <span className={styles.loreCardEmoji}>{discovered ? item.emoji : '❓'}</span>
                    <span className={styles.loreCardName}>{discovered ? item.name : '???'}</span>
                  </button>
                );
              })}
            </div>
            <div className={styles.loreProgress}>
              {discoveredLore.length}/{activeArea.loreItems.length} discovered
            </div>
          </div>

          {/* Lore detail modal */}
          {selectedLore && (
            <div className={styles.loreModal}>
              <div className={styles.loreModalContent}>
                <div className={styles.loreModalEmoji}>{selectedLore.emoji}</div>
                <h3 className={styles.loreModalName}>{selectedLore.name}</h3>
                <p className={styles.loreModalDesc}>{selectedLore.desc}</p>
                <button className={styles.loreModalClose} onClick={() => setSelectedLore(null)}>✕ Close</button>
              </div>
            </div>
          )}

          <button className={styles.leaveBtn} onClick={() => setActiveArea(null)}>🚪 LEAVE AREA</button>
        </div>
      )}
    </div>
  );
}
