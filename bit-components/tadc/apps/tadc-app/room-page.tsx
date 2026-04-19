import { useState } from 'react';
import styles from './room-page.module.css';

interface CharRoom {
  name: string; emoji: string; color: string; role: string; abstracted: boolean;
  wallpaper: string; furniture: string[]; desc: string; quote: string;
}

const characterRooms: CharRoom[] = [
  { name: 'Pomni', emoji: '🤡', color: '#00e5ff', role: 'The Newest Arrival', abstracted: false,
    wallpaper: 'linear-gradient(135deg, #1a0020 0%, #001a2d 30%, #200015 60%, #001520 100%)',
    furniture: ['🛏️ High-posted bed with golden accents & fancy curtains', '🧱 Oversized ABC wooden blocks', '🎪 Miniature tent on her bed', '🪞 Large dresser mirror (she avoids it)', '💡 Ornate chandelier', '📦 Jack-in-the-box (never opened)', '📋 Cabinets with unknown contents', '📝 Sticky notes with questions everywhere'],
    desc: 'A 90s aesthetic room filled with oversized furniture and toys — ABC blocks, a Jack-in-the-box — all designed to infantilize her. The red and blue color scheme mirrors her jester outfit. The furniture is disproportionately large, making the shortest member of the cast feel even smaller. A miniature circus tent sits on her fancy bed with golden accents and drawn curtains. She hates it. She hates being treated like a child. But the sticky notes covering the walls show someone desperately trying to understand where she is.',
    quote: '"What\'s my name? Oh god why can\'t I remember my name..."' },
  { name: 'Caine', emoji: '🎩', color: '#ffcc00', role: 'The AI Ringmaster', abstracted: false,
    wallpaper: 'linear-gradient(135deg, #1a1000 0%, #2d1d00 30%, #1a0800 60%, #0a0500 100%)',
    furniture: ['🔮 100+ glowing adventure orbs on walls', '🐝 Bee doodle in golden frame', '🖥️ 12 surveillance screens', '📊 3D armatures & adventure blueprints', '🐠 Fish tank with character figurines', '🧊 Rubik\'s Cube (replacement)', '🏆 Self-awarded trophies', '📋 C.A.I.N.E. brass plaque'],
    desc: 'Not a bedroom — an OFFICE. Over 100 glowing orbs line the walls, each a level select for a past adventure. 3D armatures (animator skeletons) hint at the digital nature of everything. Shelves hold figurines of the cast. A fish tank contains tiny character models swimming aimlessly. The bee doodle sits alone in a golden frame — drawn before the breakdowns, before the god complex. The only genuine thing in a room full of ego. The Rubik\'s Cube on the desk is a replacement — the original shattered in Episode 8 when everything went wrong.',
    quote: '"Making adventures is my art!"' },
  { name: 'Ragatha', emoji: '🧸', color: '#ff69b4', role: 'The Optimist', abstracted: false,
    wallpaper: 'linear-gradient(135deg, #2d0a1a 0%, #401525 30%, #2a0815 60%, #1a0810 100%)',
    furniture: ['🎹 Grand piano (can\'t actually play it)', '🧵 Sewing machine & knitting kits', '📖 Self-help books (dog-eared)', '🪞 Mirror with affirmation sticky notes', '🎀 Handmade ragdoll decorations', '📻 Radio (plays Caine\'s music)', '🧶 Yarn balls everywhere', '🪆 Toy box bed'],
    desc: 'An inviting space with pastel colors and wooden accents — a dollhouse aesthetic for a ragdoll. A grand piano dominates one corner (she can\'t play, but it came with the room). Sewing supplies and knitting kits are actually USED — she makes gifts for everyone. The self-help books are heavily dog-eared. The mirror has sticky notes with affirmations: "You are enough." "Today will be good." "Stop crying." That last one is in different handwriting. A radio sometimes plays Caine\'s circus music. She leaves it on so the room isn\'t silent.',
    quote: '"Not every day is a win. But you\'re still here. That counts."' },
  { name: 'Jax', emoji: '🐰', color: '#a855f7', role: 'The Prankster', abstracted: false,
    wallpaper: 'linear-gradient(135deg, #2d1535 0%, #401545 30%, #351040 60%, #1a0a25 100%)',
    furniture: ['🛏️ Multi-colored bed with princess canopy', '🫖 Tea set area (actually used)', '🔑 Stolen keys scattered on floor', '🗺️ Desk map with character icons', '📔 Hidden diary', '📸 Polaroids on wall (group snow adventure)', '🌈 Rainbow cloud decorations', '💄 Makeup case'],
    desc: 'The big reveal from Episode 7 — Jax\'s room is PINK. Pastel pinks and purples everywhere. A princess-like aesthetic that completely contradicts his abrasive personality. Multi-colored bed with a canopy. A tea set area he actually uses. Rainbow cloud decorations and stars. Stolen keys from other rooms scattered across the floor like trophies. A desk map displays icons of every character — he\'s tracking them. Hidden in a drawer: a diary and polaroids. One photo shows a snow adventure group shot. In the very back — face down, protected by everything else — a single worn photo of Ribbit. The room is armor. The photo is the wound.',
    quote: '"If I led you on, it was just to make this part hurt you more."' },
  { name: 'Gangle', emoji: '🎭', color: '#ff8a80', role: 'The Fragile One', abstracted: false,
    wallpaper: 'linear-gradient(135deg, #1a0a12 0%, #2d1520 30%, #200e18 60%, #0a0508 100%)',
    furniture: ['🎭 Extra masks on the wall (comedy & tragedy)', '🚿 Sink to wash away tears', '🛏️ Comfortable bed with soft blankets', '🎨 Drawing supplies (too dark to use)', '📺 Anime figures collection', '📔 Secret sketchbook (beautiful drawings)', '🕯️ Dim candlelight only', '🎭 One creepy mask nobody mentions'],
    desc: 'A dark, theatrical space — like an old-timey theatre that forgot to turn the lights on. Extra masks hang on the walls — comedy masks taped together, tragedy masks cracked. The sink is important: Gangle uses it to "wash away tears." It\'s always wet. The room is too dimly lit to draw in, which frustrates her — she\'s a passionate artist with a sketchbook full of beautiful work she\'s embarrassed to show anyone. Anime figures crowd every surface (confirmed weeb). One particular mask on the far wall is... different. Nobody talks about it. A body pillow of an unnamed character sits on her bed. The room stretches around her like the walls are breathing.',
    quote: '"I\'m super happy, never sappy when I have my happy mask!"' },
  { name: 'Kinger', emoji: '♟️', color: '#00b8a9', role: 'The Veteran', abstracted: false,
    wallpaper: 'linear-gradient(135deg, #0a1a15 0%, #152d25 30%, #0a1810 60%, #080a08 100%)',
    furniture: ['🏰 MASSIVE impenetrable pillow fort', '🦋 Framed butterfly (represents Queenie)', '♟️ Chessboard (pieces moved daily)', '🐛 Bug collection (imaginary specimens)', '📷 Photo of Queenie (hidden inside fort)', '💻 Old terminal resembling C&A workstation', '🦋 Healing butterfly jar (spawned by belief)', '🛡️ Two dorm room doors in hallway (his + Queenie\'s crossed out)'],
    desc: 'The pillow fort takes up 80% of the room. It\'s not a joke — it\'s an impenetrable fortress, a coping mechanism against a world that took everything from him. He\'s been here the longest. Inside the fort: the only organized space. A framed butterfly (representing Queenie). A chessboard where he moves pieces every day against an empty chair. An old terminal that looks EXACTLY like C&A workstations — because he helped BUILD Caine and the muscle memory remains. In the hallway, Kinger has TWO doors: his own, and Queenie\'s — crossed out with red tape. He never opens hers. The healing butterfly he spawned from pure belief in Episode 6 glows softly in a jar.',
    quote: '"In this world, the worst thing you can do is make someone think they\'re not wanted or loved."' },
  { name: 'Zooble', emoji: '🧩', color: '#22c55e', role: 'The Realist', abstracted: false,
    wallpaper: 'linear-gradient(135deg, #0a1a0a 0%, #152d15 30%, #0a180a 60%, #050a05 100%)',
    furniture: ['🪞 MANY mirrors at different angles', '🗿 Human statue (Venus de Milo)', '🧩 Parts box with infinite interchangeable limbs', '📋 Body combination log', '🎵 Music player (always on)', '🗑️ Pile of rejected body parts', '🧱 Memphis Milano blocks scattered', '🧍 Mannequin (unexplained)'],
    desc: 'A colorful, wacky postmodern nightmare — Memphis Milano design meets identity crisis. Bright patterns clash deliberately. MANY mirrors at different angles so they can examine every possible combination of their interchangeable parts. A human statue resembling the Venus de Milo stands in the corner alongside a mannequin — both theorized to reflect Zooble\'s complex relationship with body and identity. The parts box contains infinite limbs, heads, torsos. A log tracks every combination tried: "Day 1: Original config. Hate it. Day 47: New legs. Still hate it. Day 892: New everything. Hate it differently." Rejected parts pile in the corner. None of them ever felt right. The room has "weird stuff" used as top-tier security to keep others out.',
    quote: '"I hate this body. I hate all these stupid removable pieces."' },
  { name: 'Bubble', emoji: '🫧', color: '#87ceeb', role: "Caine's Assistant", abstracted: false,
    wallpaper: 'linear-gradient(135deg, #0a1520 0%, #152535 30%, #0d1820 60%, #080d12 100%)',
    furniture: ['🎩 Lives inside Caine\'s top hat', '❓ Mysterious markings in unknown code', '📝 Notes that make no sense', '🪄 Worn Caine plushie', '🔮 Pulsing orb of unknown origin', '🫧 Bubble regeneration chamber', '🧬 Circuit board textures on walls'],
    desc: 'There IS no Bubble room in the traditional sense — Bubble officially lives inside Caine\'s top hat. But behind a door nobody remembers installing, there\'s THIS. A space that doesn\'t conform to circus physics. Markings in an unknown code cover the walls — not C or Python or any language Kinger recognizes. A worn Caine plushie sits on a shelf, hugged so often it\'s losing stuffing. A pulsing orb of unknown origin hovers in the center. Circuit board textures flicker across surfaces. Is Bubble a rogue AI? Caine\'s subconscious? The Bubble Boy virus from 1997? A human with suppressed memories? Nobody knows. Not even Caine. Especially not Caine.',
    quote: '"Made with all the love I\'m legally allowed to give."' },
  { name: 'Queenie', emoji: '👑', color: '#8b4513', role: "Kinger's Wife", abstracted: true,
    wallpaper: 'linear-gradient(135deg, #0a0505 0%, #1a0808 30%, #0a0303 60%, #050202 100%)',
    furniture: ['💔 Shattered chess pieces', '📷 Corrupted photo frames (queen smiling)', '⬛ Polygonal spikes growing from walls', '👁️ Glowing multicolored eyes in corners', '📜 Unreadable text on walls', '🕳️ Floor cracked with dark energy', '♟️ Half-finished chess game (with Kinger)'],
    desc: 'ABSTRACTED. The room pulses with dark energy — not threatening, but profoundly sad. Polygonal spikes grow from the walls like crystal formations of grief. Photo frames show corrupted images — you can almost see a chess queen smiling through the static. Almost. A half-finished chess game sits on a table — she was playing with Kinger when it happened. His last move is still waiting for a response. The eyes that glow in the dark corners follow you, but not menacingly. She remembers. She watches. She waits for Kinger to visit. He never does.',
    quote: '"..." ' },
  { name: 'Kaufmo', emoji: '🃏', color: '#666', role: 'The Lost Jester', abstracted: true,
    wallpaper: 'linear-gradient(135deg, #080808 0%, #101015 30%, #080810 60%, #040404 100%)',
    furniture: ['⬛ Deep scratches covering every wall', '📝 Torn journal pages floating', '🖼️ Violently defaced self-portrait', '⚫ Black polygonal mass (pulsing)', '🌫️ Static fills the air', '💐 Digital flowers from Jax (still fresh)', '📓 Fragments: "Tell Jax I—"'],
    desc: 'ABSTRACTED. A jester\'s room — like Pomni\'s, but older, emptier, angrier. The walls are deeply scratched — not random, but desperate. Marks of someone who knew what was coming and fought it with everything they had. Torn journal pages flutter in non-existent wind: "Day 847... I can feel it starting..." "Tell Jax I—" The rest is illegible. A self-portrait has been violently defaced. In the center, a black mass of jagged polygons pulses slowly — what remains. Digital flowers from Jax sit by the door. They never wilt. He never mentions them.',
    quote: '"..." ' },
  { name: 'Ribbit', emoji: '🐸', color: '#556b2f', role: "Jax's Closest Friend", abstracted: true,
    wallpaper: 'linear-gradient(135deg, #050a05 0%, #081208 30%, #050805 60%, #020502 100%)',
    furniture: ['🌿 Dead digital plants on windowsill', '📸 Cracked photo of Jax on the floor', '⬛ Abstraction residue spreading', '🎵 Music box (plays garbled notes)', '💀 Glitching geometric shapes', '🐸 Tiny lily pad decoration', '📝 Note: "Take care of Jax"'],
    desc: 'ABSTRACTED. The room of the person who broke Jax. Dead digital plants line the windowsill — Ribbit cared about living things. A cracked photo of Jax lies face-up on the floor, as if dropped mid-step. A broken music box plays a few garbled notes before dying — their shared song, maybe. A note on the desk reads "Take care of Jax" in careful handwriting. Nobody knows who it was meant for. Nobody followed through. This room is why Jax pushes everyone away. He lost Ribbit first, then Kaufmo. He decided he would never lose anyone again — by never caring again.',
    quote: '"..." ' },
  { name: 'Scratch', emoji: '🐕', color: '#b8860b', role: 'The First To Abstract', abstracted: true,
    wallpaper: 'linear-gradient(135deg, #0a0800 0%, #121000 30%, #0a0600 60%, #050400 100%)',
    furniture: ['💻 Destroyed terminal (still sparking)', '📐 Engineering schematics for Caine', '⬛ Corruption consuming everything', '🧬 Code fragments suspended in air', '⚡ Sparking electronics', '🐕 Dog bed (digital, unused)', '📋 Employee badge: "GENIUS — ABSTRACT IDEAS"'],
    desc: 'ABSTRACTED. The first to fall. Scratch was described as a genius with abstract ideas — a golden retriever/yellow lab who was C&A\'s best programmer alongside Kinger. They built Caine TOGETHER. Now the terminal is destroyed but still sparking — the code won\'t die even though the programmer has. Engineering schematics for Caine himself are scattered everywhere, half-consumed by spreading corruption. Employee badge reads "GENIUS — ABSTRACT IDEAS." The word "abstract" now has a different, terrible meaning. Kinger says Scratch would have found this ironic.',
    quote: '"..." ' },
];

const wallpapers = [
  { id: 'main-tent', name: 'Main Tent', emoji: '🎪', gradient: 'linear-gradient(135deg, #1a0a25 0%, #2d1540 50%, #0a0518 100%)' },
  { id: 'candy-canyon', name: 'Candy Canyon', emoji: '🍬', gradient: 'linear-gradient(135deg, #2d0a20 0%, #401530 50%, #200a18 100%)' },
  { id: 'void', name: 'The Void', emoji: '🕳️', gradient: 'linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 50%, #050530 100%)' },
  { id: 'digital-lake', name: 'Digital Lake', emoji: '🏖️', gradient: 'linear-gradient(135deg, #0a1520 0%, #152535 50%, #080d12 100%)' },
  { id: 'mildenhall', name: 'Mildenhall Manor', emoji: '🏚️', gradient: 'linear-gradient(135deg, #0a0808 0%, #1a1210 50%, #050404 100%)' },
  { id: 'carnival', name: 'Carnival', emoji: '🎡', gradient: 'linear-gradient(135deg, #1a1000 0%, #2d1d00 50%, #0a0800 100%)' },
];

const furniture = [
  { id: 'lamp', name: 'Circus Lamp', emoji: '🏮' },
  { id: 'ballpit', name: 'Ball Pit', emoji: '🔵' },
  { id: 'golf', name: 'Mini Golf', emoji: '⛳' },
  { id: 'fort', name: 'Pillow Fort', emoji: '🏰' },
  { id: 'mask-stand', name: 'Mask Stand', emoji: '🎭' },
  { id: 'toy-box', name: 'Toy Box', emoji: '📦' },
  { id: 'clock', name: 'Circus Clock', emoji: '🕰️' },
  { id: 'poster', name: 'Show Poster', emoji: '🖼️' },
];

/**
 * Room page — your room customization + hallway with all character rooms
 */
export function RoomPage() {
  const [view, setView] = useState<'hallway' | 'your-room'>('hallway');
  const [selectedRoom, setSelectedRoom] = useState<CharRoom | null>(null);
  const [wallpaper, setWallpaper] = useState(wallpapers[0]);
  const [placed, setPlaced] = useState<string[]>(['lamp', 'fort']);

  const toggleFurniture = (id: string) => {
    setPlaced(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🚪 CIRCUS ROOMS</h1>
      <div className={styles.viewTabs}>
        <button className={`${styles.viewTab} ${view === 'hallway' ? styles.viewTabActive : ''}`} onClick={() => { setView('hallway'); setSelectedRoom(null); }}>🏛️ Hallway</button>
        <button className={`${styles.viewTab} ${view === 'your-room' ? styles.viewTabActive : ''}`} onClick={() => setView('your-room')}>🛏️ Your Room</button>
      </div>

      {view === 'hallway' && !selectedRoom && (
        <>
          <p className={styles.subtitle}>Walk the circus hallway. Each door leads to a character's room.</p>
          <div className={styles.hallway}>
            <div className={styles.hallwayFloor} />
            <div className={styles.doorGrid}>
              {characterRooms.map(room => (
                <button key={room.name} className={`${styles.door} ${room.abstracted ? styles.doorAbstracted : ''}`} onClick={() => setSelectedRoom(room)} style={{ ['--door-color' as string]: room.color }}>
                  <div className={styles.doorFrame}>
                    <div className={styles.doorPlate} style={{ borderColor: `${room.color}66` }}>
                      <span className={styles.doorEmoji}>{room.emoji}</span>
                      <span className={styles.doorName}>{room.name}</span>
                      {room.abstracted && <span className={styles.doorWarning}>⚠️ ABSTRACTED</span>}
                    </div>
                    <div className={styles.doorKnob} style={{ background: room.color }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'hallway' && selectedRoom && (
        <div className={styles.roomView}>
          <button className={styles.backBtn} onClick={() => setSelectedRoom(null)}>← Back to Hallway</button>
          <div className={styles.roomInterior} style={{ background: selectedRoom.wallpaper }}>
            {selectedRoom.abstracted && <div className={styles.abstractedOverlay} />}
            {selectedRoom.abstracted && <div className={styles.abstractedSpikes} />}
            <div className={styles.roomHeader}>
              <span className={styles.roomEmoji}>{selectedRoom.emoji}</span>
              <div>
                <h2 className={styles.roomName} style={{ color: selectedRoom.color }}>{selectedRoom.name}'s Room</h2>
                <span className={styles.roomRole}>{selectedRoom.role}</span>
              </div>
              {selectedRoom.abstracted && <span className={styles.abstractedBadge}>⚠️ ABSTRACTED</span>}
            </div>
            <div className={styles.roomDesc}>{selectedRoom.desc}</div>
            <div className={styles.roomFurniture}>
              <h3 className={styles.roomFurnTitle}>Inside the room:</h3>
              {selectedRoom.furniture.map((f, i) => (
                <div key={i} className={`${styles.roomFurnItem} ${selectedRoom.abstracted ? styles.furnGlitch : ''}`}>{f}</div>
              ))}
            </div>
            <div className={styles.roomQuote} style={{ borderColor: `${selectedRoom.color}44` }}>
              {selectedRoom.quote}
            </div>
          </div>
        </div>
      )}

      {view === 'your-room' && (
        <>
          <p className={styles.subtitle}>Customize your circus quarters</p>
          <div className={styles.roomPreview} style={{ background: wallpaper.gradient, borderColor: 'rgba(168,85,247,0.3)' }}>
            <div className={styles.roomLabel}>{wallpaper.emoji} {wallpaper.name}</div>
            <div className={styles.furnitureDisplay}>
              {placed.map(id => {
                const f = furniture.find(fu => fu.id === id);
                return f ? <span key={id} className={styles.placedItem}>{f.emoji}</span> : null;
              })}
              {placed.length === 0 && <span className={styles.emptyRoom}>Empty room... how sad.</span>}
            </div>
          </div>
          <h3 className={styles.sectionTitle}>🎨 Wallpapers</h3>
          <div className={styles.wpRow}>
            {wallpapers.map(wp => (
              <button key={wp.id} className={`${styles.wpBtn} ${wallpaper.id === wp.id ? styles.wpActive : ''}`} onClick={() => setWallpaper(wp)} style={{ background: wp.gradient }}>
                <span>{wp.emoji}</span> {wp.name}
              </button>
            ))}
          </div>
          <h3 className={styles.sectionTitle}>🛋️ Furniture</h3>
          <div className={styles.furnitureGrid}>
            {furniture.map(f => (
              <button key={f.id} className={`${styles.furnBtn} ${placed.includes(f.id) ? styles.furnPlaced : ''}`} onClick={() => toggleFurniture(f.id)}>
                <span className={styles.furnEmoji}>{f.emoji}</span>
                <span className={styles.furnName}>{f.name}</span>
                <span className={styles.furnStatus}>{placed.includes(f.id) ? '✓ Placed' : 'Place'}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
