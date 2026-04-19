/**
 * Unique Caine purchase quotes based on item category
 */
export const caineQuotes: Record<string, string[]> = {
  'coin-chests': [
    "More coins! Excellent! You'll need them for what I have planned...",
    "Gold, gold, GOLD! My favorite color! After existential dread!",
    "Investing in the circus economy! Smart human!",
  ],
  'gem-chests': [
    "Gems! Shinier than my teeth! ...Do I have teeth?",
    "These gems are worth more than your freedom! Which is free! Because you CAN'T leave!",
    "Precious stones for a precious prisoner— I mean, GUEST!",
  ],
  'spin-passes': [
    "Another spin! The wheel loves you! Or hates you! Hard to tell!",
    "Gambling addiction is concerning! But also entertaining!",
    "Spin, spin, SPIN! Just like my moral compass!",
  ],
  'arcade-packs': [
    "NEW GAMES UNLOCKED! Making adventures is my art!",
    "More entertainment! Because existing here wasn't fun enough!",
    "You won't be bored! That's MY promise! Any boredom is 100% accidental!",
  ],
  'secret-passes': [
    "Snooping around, are we? Some doors are closed for a REASON.",
    "You want to see behind the curtain? Fine. But don't blame me.",
    "Curiosity killed the... well, you can't die here. So snoop away!",
  ],
  'cyoa-packs': [
    "NEW ADVENTURES! I designed them PERSONALLY! You're welcome!",
    "Choose wisely! Or don't! The endings are all equally traumatic!",
    "Story time! Everyone gather 'round! ...Not you, Bubble.",
  ],
  'avatars': [
    "New face! Same existential crisis! Looking good though!",
    "Identity is fluid here! Especially when I'M in charge of it!",
    "Wearing someone else's face? That's not weird at all!",
  ],
  'titles': [
    "A new title! Very prestigious! Almost as prestigious as MINE!",
    "Titles are just words! Words that define your ENTIRE EXISTENCE HERE!",
    "Wear it proudly! Or shamefully! Either way, you're stuck with it!",
  ],
  'collectibles': [
    "A fine addition to your collection! Just like YOU are to MINE!",
    "Collectibles! Things! Objects! The only things that last here!",
    "Treasure it! Because nothing else here is permanent!",
  ],
  'furniture': [
    "Decorating your prison— I mean, ROOM! How domestic!",
    "Making yourself comfortable? Planning to stay a while? YOU ARE!",
    "Home improvement! For a home you can never leave! Cozy!",
  ],
  'lore-notes': [
    "Knowledge is power! But power won't help you escape! Nothing will!",
    "Reading the fine print? Nobody does that! Except YOU apparently!",
    "The truth is in there. Are you sure you want to find it?",
  ],
  'backgrounds': [
    "Redecorating! A fresh coat of digital paint! Lovely!",
    "Change of scenery! Without actually going anywhere! Perfect!",
    "New wallpaper, same cage! But at least it's PRETTY!",
  ],
};

export function getCaineQuote(category: string): string {
  const quotes = caineQuotes[category] || ["Thanks for buying! You won't regret it... probably."];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
