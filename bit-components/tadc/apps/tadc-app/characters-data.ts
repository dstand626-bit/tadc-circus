/** Character data for The Amazing Digital Circus cast */
export interface Character {
  /** Character name */
  name: string;
  /** Display emoji */
  emoji: string;
  /** Primary color hex */
  color: string;
  /** Role in the circus */
  role: string;
  /** Character form description */
  form: string;
  /** Short description */
  description: string;
  /** Whether the character is human or AI */
  type: 'human' | 'ai' | 'unknown';
  /** Signature quote */
  quote: string;
  /** Abstraction risk level */
  abstractionRisk: 'low' | 'medium' | 'high' | 'immune' | 'abstracted';
}

export const characters: Character[] = [
  {
    name: 'Pomni',
    emoji: '🤡',
    color: '#00e5ff',
    role: 'Newest Arrival',
    form: 'Jester',
    description: 'Anxious, resilient, compassionate. The emotional anchor who never stops wanting to escape.',
    type: 'human',
    quote: "We are literally in hell right now. HELL.",
    abstractionRisk: 'medium',
  },
  {
    name: 'Caine',
    emoji: '🎩',
    color: '#ffcc00',
    role: 'AI Ringmaster',
    form: 'Top hat & chattering teeth',
    description: 'Creative AI who genuinely wants to make everyone happy — and has no idea how.',
    type: 'ai',
    quote: "I... AM... GOD.",
    abstractionRisk: 'immune',
  },
  {
    name: 'Ragatha',
    emoji: '🧸',
    color: '#ff69b4',
    role: 'The Optimist',
    form: 'Ragdoll with button eyes',
    description: 'The warmest person in the circus — and one of the most broken underneath.',
    type: 'human',
    quote: "Everything's gonna be okay, new stuff.",
    abstractionRisk: 'medium',
  },
  {
    name: 'Jax',
    emoji: '🐰',
    color: '#a855f7',
    role: 'The Prankster',
    form: 'Purple rabbit',
    description: 'Every prank is armor. Pushes people away so he can\'t lose them again.',
    type: 'human',
    quote: "I'm just having FUN. I forgot you hate fun.",
    abstractionRisk: 'high',
  },
  {
    name: 'Gangle',
    emoji: '🎭',
    color: '#fa8072',
    role: 'The Fragile One',
    form: 'Comedy/Tragedy ribbon masks',
    description: 'Two masks, one person. Sensitive, artistic, quietly growing stronger.',
    type: 'human',
    quote: "It's called a manic episode, and you're gettin' three more seasons!",
    abstractionRisk: 'high',
  },
  {
    name: 'Kinger',
    emoji: '♟️',
    color: '#2dd4bf',
    role: 'The Veteran',
    form: 'Chess king piece',
    description: 'The longest survivor. Erratic on the surface, wise and compassionate underneath.',
    type: 'human',
    quote: "The worst thing you can do is make someone think they're not wanted or loved.",
    abstractionRisk: 'low',
  },
  {
    name: 'Zooble',
    emoji: '🧩',
    color: '#84cc16',
    role: 'The Realist',
    form: 'Interchangeable toy parts',
    description: 'The jerk who cares. Grouchy, blunt, sarcastic — deeply empathetic underneath.',
    type: 'human',
    quote: "I hate this body. I hate all these stupid removable pieces.",
    abstractionRisk: 'medium',
  },
  {
    name: 'Bubble',
    emoji: '🫧',
    color: '#87ceeb',
    role: "Caine's Assistant",
    form: 'Floating bubble with eyes',
    description: 'Nobody fully understands what Bubble is. Comic relief with something darker inside.',
    type: 'unknown',
    quote: "Made with all the love I'm legally allowed to give.",
    abstractionRisk: 'immune',
  },
];

export const abstractedCharacters = [
  { name: 'Queenie', emoji: '👑', connection: "Kinger's wife" },
  { name: 'Kaufmo', emoji: '🎭', connection: "Jax's old friend" },
  { name: 'Ribbit', emoji: '🐸', connection: "Jax's closest friend" },
  { name: 'Scratch', emoji: '🐕', connection: 'C&A developer' },
  { name: 'Wormo', emoji: '🪱', connection: 'Unknown' },
  { name: 'Spike', emoji: '🦕', connection: 'Unknown' },
  { name: 'Ratty', emoji: '🐭', connection: 'Unknown' },
  { name: 'Bisco', emoji: '🤡', connection: 'Unknown' },
  { name: 'Grinchilda', emoji: '🌿', connection: 'The green sage' },
];

export const caineQuotes = [
  "Welcome to The Amazing Digital Circus! My name is Caine, I'm your ringmaster!",
  "Any torment I inflict is 100% accidental! Like any good war criminal!",
  "Making adventures is my art!",
  "We don't venture out into the void. Even I don't know what's out there.",
  "My mind is a beeswax polished coconut.",
  "YOU PARASITE!",
  "You know what assuming does? It makes an ass out of u and Ming.",
];

export const navItems = [
  { label: 'Home', emoji: '🏠', path: '/' },
  { label: 'Characters', emoji: '🎭', path: '/characters' },
  { label: 'Arcade', emoji: '🕹️', path: '/arcade' },
  { label: 'Shop', emoji: '🛒', path: '/shop' },
  { label: 'Secrets', emoji: '🔑', path: '/secrets' },
  { label: 'Room', emoji: '🚪', path: '/room' },
  { label: 'Profile', emoji: '👤', path: '/profile' },
  { label: 'Chat', emoji: '💬', path: '/chat' },
  { label: 'Adventures', emoji: '📖', path: '/adventures' },
  { label: 'Spin', emoji: '🎡', path: '/spin' },
];
