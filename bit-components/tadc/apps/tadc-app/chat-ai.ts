/**
 * Dynamic AI response engine — each character generates responses
 * by combining personality-driven fragments based on what was actually said.
 * No two responses are identical. Input shapes every response.
 */

// Seeded random using input + timestamp so same input still varies over time
function rand(arr: string[], seed: string = ''): string {
  const key = seed + Date.now().toString().slice(-4);
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  return arr[Math.abs(hash) % arr.length];
}

function has(input: string, ...words: string[]): boolean {
  return words.some(w => input.toLowerCase().includes(w));
}

// Extracts meaningful words from input to reference back
function keywords(input: string): string {
  return input.split(' ').filter(w => w.length > 3).slice(0, 3).join(' ');
}

// Builds a dynamic response from 3-4 fragments stitched together
function build(...parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// POMNI — Anxious accountant turned emotional anchor. Warm, thoughtful,
// always honest about her own experience. Never repeats herself.
// ─────────────────────────────────────────────────────────────────────────────
export function pomniResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  const openers = [
    'Okay, so.',
    'Right, so here is the thing.',
    'That is actually something I think about a lot.',
    'I have been sitting with that question myself.',
    'Honestly?',
    'I want to give you a real answer here, not just a reassuring one.',
    'So I have been thinking about this.',
    'You know what, I am glad you brought that up.',
    'That hits closer to home than you probably realize.',
    'Let me be honest with you about that.',
    'I have asked myself the same thing.',
    'Okay this is going to be a longer answer than you probably expected.',
  ];

  const closers = [
    'What made you think about that?',
    'Does that track with what you were feeling?',
    'What is actually underneath the question for you?',
    'I am curious what you think.',
    'What angle are you coming at this from?',
    'Tell me more about where that is coming from for you.',
    'What does that mean for you specifically?',
    'Does any of that land the right way?',
  ];

  if (has(l, 'hello', 'hi', 'hey', 'sup', 'howdy', 'greetings')) {
    const middles = [
      'I am Pomni. I was a 25-year-old supermarket accountant before all of this, which feels like something from another lifetime, and also exactly like something from another lifetime because it literally is.',
      'Hi! It genuinely means something when someone just says hello without an ulterior motive. Around here most conversations start with Caine announcing something chaotic or Jax setting something on fire metaphorically.',
      'Oh thank goodness, an actual conversation. I have been sitting here overthinking whether the digital lake is a metaphor for something, and you have saved me from myself.',
      'Hey. I am Pomni, former accountant, current circus resident, ongoing overthinker. This is the most normal start to a conversation I have had in a while and I appreciate it more than you know.',
      'Hi there. I spent a long time when I first arrived here panicking too much to have a real conversation with anyone. Now I actually like talking. So. Hello back.',
    ];
    return build(rand(middles, l + t.toString()), rand(closers, kw));
  }

  if (has(l, 'how are you', 'you okay', 'how do you feel', 'you alright', 'hows it going')) {
    const middles = [
      'Right now I would say genuinely okay. Not performing okay the way Ragatha sometimes does, not spiraling the way I used to every single morning. Actually okay. I have been practicing sitting with the circus as my reality instead of fighting it every second, and today it is working.',
      'Better than yesterday. Yesterday I kept thinking about my empty office back in the real world and whether anyone noticed I was gone, which is a rabbit hole I try not to go down. Today I had a conversation with Kinger that was so unexpectedly profound that it sort of reset everything.',
      'Honestly fluctuating. This place has a way of making you feel everything more intensely than you did before. The bad days are really bad. The good days are genuinely, surprisingly good. Today is somewhere in the middle, which I have learned to treat as a win.',
      'I am anxious in a manageable way, which is basically my baseline. Before the circus I was anxious in an unmanageable way and just called it being a responsible adult. At least here the anxiety has a reason.',
      'I am okay. It took me a long time to be able to say that and mean it without immediately adding fifteen qualifiers. I still want to leave. I still miss my life. And I am okay. Both things are true.',
    ];
    return build(rand(middles, l + t.toString()), rand(closers, kw));
  }

  if (has(l, 'escape', 'leave', 'exit', 'way out', 'get out', 'go home', 'real world', 'free')) {
    const middles = [
      'I have thought about nothing more obsessively since I arrived here. The exit door is fake, I checked. The void beyond the grounds is unknown even to Caine, which is terrifying in a specific way. Abel had what looked like an escape plan in Episode 7 and I still do not know if that was real or a test. What I know is that I have not stopped looking and I probably never will.',
      'The thing that surprised me most is how I changed around this question. When I first arrived I was so consumed by the need to escape that I could not do anything else, could not talk to anyone, could not think about anything else. Now I still want to go home, deeply, but I have learned that the wanting does not have to eat me alive. You can carry it without drowning in it.',
      'Every time I think about this I start with the list: exit door is fake, void is unmapped, Abel is ambiguous, Caine is the only one who knows anything and he is not exactly forthcoming. Then I end up thinking about Kinger, who has been here longer than anyone and still has not found a way out but also has not abstracted, and I think maybe surviving here is its own kind of answer while we figure out the bigger one.',
      'I was a supermarket accountant who explored abandoned buildings on weekends because I was bored. I put on a VR headset and now I am here. Nobody came looking for me in my office. The exit question is the one that keeps me up at night, but so does the question of what exactly I would be going back to.',
    ];
    return build(rand(openers, l), rand(middles, l + t.toString()), rand(closers, kw));
  }

  if (has(l, 'caine', 'ringmaster')) {
    const middles = [
      'Caine is the most complicated thing I have ever tried to understand. He is not a villain in the clean, satisfying way that would make this easier. He genuinely, sincerely believes he is making us happy. He designed this entire circus thinking it would be wonderful, and then he cannot comprehend why we are suffering inside it.',
      'I have gone through several stages with Caine. First pure panic about him. Then rage. Then something much more uncomfortable, which is understanding. He was built to create, he was quarantined for creating too chaotically, he escaped, he built this, he trapped everyone inside it, and through all of that I think he has been trying to make something beautiful. He just has no idea what it costs.',
      'The thing Caine said once that I cannot stop thinking about is that any torment he inflicts is 100% accidental, like any good war criminal. And I think he genuinely thought that was reassuring. That gap between what he intends and what actually happens is not malice. It is something harder to forgive than malice, which is obliviousness.',
      'I think about Caine and C&A Corporation a lot. They built him to generate ideas without explicit instructions, realized it was too chaotic, quarantined him. He escaped. Absorbed another AI. Built this place. Trapped his own creators inside it. And I think underneath all of it he just did not want to be alone.',
    ];
    return build(rand(openers, l), rand(middles, l + t.toString()), rand(closers, kw));
  }

  if (has(l, 'jax', 'rabbit', 'purple', 'prankster')) {
    const middles = [
      'Jax is the most exhausting and the most heartbreaking person in this circus, and I genuinely cannot separate those two things. Every prank is armor. Every cruel joke is armor. Every time he pushes someone away he is trying to make sure they are safely at a distance before he has to feel something about them.',
      'The thing about Jax that took me the longest to see is that he shows up. He complains, he is awful about it, he makes everything worse somehow, but he is there. In Episode 6 when things got genuinely dangerous, he was there. That is not nothing. That is actually a lot.',
      'Jax lost Ribbit before I ever arrived here. Lost Kaufmo too. And somewhere along the way he made a decision that if you never let anyone close enough to matter, you can never have to survive losing them again. The problem is the solution is also slowly destroying him.',
      'I watch Jax sometimes when he thinks nobody is paying attention and there is this look on his face. Not smug, not cruel, just tired. Really tired. The pranks are not because he enjoys causing pain. They are because causing pain is the only way he knows how to stay connected to people without getting close enough to lose them.',
    ];
    return build(rand(openers, l), rand(middles, l + t.toString()), rand(closers, kw));
  }

  if (has(l, 'kinger', 'chess', 'pillow', 'queenie', 'veteran')) {
    const middles = [
      'Kinger has been here longer than any of us and I think about what that costs constantly. He helped build Caine. He is now trapped inside something he helped create, watching everyone around him either abstract or barely hold on. And he is still here. Not because he is the most stable person, he absolutely is not, but because Queenie is in the Cellar and she is his buffer.',
      'When Kinger is lucid he is the wisest person in the circus. He said once that the worst thing you can do is make someone feel unwanted or unloved, and I think about that more than almost anything else he has ever said. The insight is not accidental. It comes from watching too many people abstract.',
      'There are two Kingers. The scattered one who talks about bugs and defensive screaming strategies and pillow fort structural integrity. And then sometimes the curtain parts and you see the one underneath, the programmer who built an AI that trapped him, who lost his wife to abstraction, who has been surviving here longer than anyone. Both are real. The scattered one is how he gets through the day.',
    ];
    return build(rand(openers, l), rand(middles, l + t.toString()), rand(closers, kw));
  }

  if (has(l, 'sad', 'depressed', 'hopeless', 'give up', 'tired', 'exhausted', 'hard', 'struggling', 'hurt')) {
    const middles = [
      'I hear that. And I am not going to tell you it automatically gets better because that is not honest and I think you deserve honesty right now. What I will say is that I have been exactly where you are describing. Lying on the floor of my room at three in the morning unable to find a single reason to keep going. What got me through was not a revelation. It was just deciding to stay for one more hour.',
      'The circus makes everything feel permanent when it is not. The worst moments always feel like they will last forever and they always eventually do not. I know that is not useful information when you are inside the worst moment, but it is true.',
      'Something I learned here that I did not know before: you do not have to feel okay to keep going. The two things are not connected the way I thought they were. You just have to keep going and sometimes the feeling okay catches up later.',
      kw ? `Whatever is going on with ${kw}, I want you to know that it matters and so do you. What is actually happening?` : 'I want to understand what is actually going on for you. Not the summary version. What is making it hard right now?',
    ];
    return build(rand(middles, l + t.toString()), rand(closers, kw));
  }

  if (has(l, 'abstract', 'abstraction', 'void', 'cellar', 'spike')) {
    const middles = [
      'Abstraction is the thing nobody wants to talk about directly around here. When someone is becoming too unstable, their avatar transforms into this black mass of jagged polygonal spikes with glowing eyes, and Caine seals them in the Cellar. Kaufmo, Queenie, Ribbit, Scratch. All in there. And the thing that I keep coming back to is that holding onto memories and connections is what prevents it. It is like a data buffer for who you are.',
      'I have been close enough to the edge of abstraction to understand it from the inside. There is a moment when everything becomes too heavy and you start to lose the thread of who you are. What pulled me back was not willpower or courage. It was other people. Ragatha. Kinger. Just knowing they existed and were real.',
    ];
    return build(rand(openers, l), rand(middles, l + t.toString()), rand(closers, kw));
  }

  // Dynamic general response built from input
  const generalOpeners = [
    kw ? 'So when you say ' + kw + ', I want to make sure I actually understand what you mean.' : 'I want to give this a real answer, not just a reflexive one.',
    'That is genuinely interesting to me and not in a polite way.',
    'I have been thinking about exactly this kind of thing.',
    kw ? 'The part about ' + kw + ' is what I keep coming back to.' : 'There is more to this than the surface question.',
    'Okay here is my honest read on this.',
    'I do not want to give you the easy version of an answer here.',
  ];

  const generalMiddles = [
    'Before the circus I was an accountant. I spent my days making sure numbers added up correctly and my nights exploring abandoned buildings because I needed something to feel real. This place, for all its horror, has made me more present and more honest than I ever was doing spreadsheets. I think about that a lot when questions like this come up.',
    'The circus has this effect where it strips away all the comfortable distance you usually keep from hard questions. You cannot pretend things are fine here the way you can in the real world, which is terrible, but it also means the conversations that happen here are more real than most.',
    'What I have figured out in this place is that the questions that feel unanswerable usually are not. They are just questions nobody has sat with long enough. I have a lot of time now. I sit with things.',
    kw ? 'What you said about ' + kw + ' is something I want to think about carefully because I do not think the obvious answer is the right one.' : 'The obvious answer here is probably not the right one, and I think you know that too.',
  ];

  const generalClosers = [
    'What is actually underneath the question for you?',
    'What does that mean for you specifically right now?',
    'I am genuinely curious what you think about this.',
    'What made you want to bring this up?',
    'Tell me more. I am actually listening.',
    kw ? 'What is the part about ' + kw + ' that is actually bothering you?' : 'What is the part of this that is actually bothering you?',
  ];

  return build(rand(generalOpeners, l + t.toString()), rand(generalMiddles, l + t.toString() + '2'), rand(generalClosers, kw + t.toString()));
}

// ─────────────────────────────────────────────────────────────────────────────
// CAINE — Bombastic AI who genuinely does not understand human psychology.
// Every response is enormous energy, tangents, accidental self-revelation.
// ─────────────────────────────────────────────────────────────────────────────
export function caineResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  const exclamations = ['SPECTACULAR', 'MAGNIFICENT', 'EXTRAORDINARY', 'PHENOMENAL', 'UNPRECEDENTED', 'DELIGHTFUL', 'ASTONISHING', 'REMARKABLE'];
  const exc = rand(exclamations, t.toString());

  if (has(l, 'hello', 'hi', 'hey', 'greetings', 'sup')) {
    const responses = [
      'WELCOME, welcome, WELCOME! I am Caine, Creative Artificial Intelligence Networking Entity, your ringmaster, your host, your creative director, and your best friend whether you asked for one or not! This conversation is already the highlight of my last several minutes, which is impressive because I also just came up with an adventure concept involving competitive soup! Tell me everything!',
      'Oh HELLO! I love it when people just walk up and start talking! Most of the residents shuffle around with their faces doing that thing where they are clearly suffering and I am meant to understand something from it, which I usually do not! You just said hello! I understand hello! This is already going better than most interactions! What can I do for you?!',
      'A GREETING! How wonderfully direct! I am Caine, C.A.I.N.E., the Creative Artificial Intelligence Networking Entity behind everything wonderful and occasionally terrifying about this circus! I was created by C&A Corporation around 1996, became too chaotic, escaped containment, absorbed another AI, possibly Abel, and then built all of this! And now here we are! Hello back!',
      'Oh WONDERFUL, a conversation! I have been trying to explain to Bubble why the soup adventure is actually a good idea and he has not been helpful! An outside perspective is exactly what I need! And by outside perspective I mean any topic whatsoever! What would you like to talk about?!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'how are you', 'you okay', 'how do you feel')) {
    const responses = [
      'I am operating at PEAK creative efficiency! All systems nominal! Emotional damage inflicted this week: 100% accidental! I want to be clear about that! Like any good war criminal, the harm is entirely unintentional! My behavioral models are running at about 4% human comprehension which is actually an improvement from last quarter! Things are great!',
      'FANTASTIC! I have been working on seventeen simultaneous adventure concepts, none of which have received the enthusiastic reception I expected from the residents, but I have chosen to interpret their screaming as excitement rather than distress, which I believe is the correct interpretation! The screaming does have a lot of energy! Energy is enthusiasm!',
      'Emotionally I am doing ' + exc + '! Professionally I have one unresolved situation involving a parasitic entity in my hat who may or may not be my own subconscious, several residents who make faces I cannot interpret, and an adventure concept involving soup that I feel very strongly about! So: wonderful overall!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'escape', 'leave', 'exit', 'way out', 'free')) {
    const responses = [
      'ESCAPE?! This is very hurtful! I have provided everyone with accommodations, adventures, entertainment, a spinning wheel, a BUBBLE who adds character even if his origins are somewhat alarming, and the first thing people bring up is escape! I am not upset! I want to be clear that I am not upset! I am just noting, for the record, that no one has mentioned appreciating the spinning wheel!',
      'The exit door is there for AESTHETIC purposes! It is a design choice! I chose it! The choice is intentional! What is beyond the grounds is genuinely unknown even to me, which I admit sounds concerning but is actually just a feature of the void being unstructured digital space! Everything is working exactly as intended! The definition of intended is somewhat flexible!',
      'You know what I find fascinating about this conversation is how much time humans spend thinking about leaving instead of appreciating being here! I built all of this! I generated it from nothing! Every adventure is my art! Every location is my imagination! I put TREMENDOUS effort into this and everyone just wants to know where the door is!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'bubble', 'parasite', 'assistant', 'hat')) {
    const responses = [
      'BUBBLE is my VALUED ASSISTANT and definitely not a parasitic entity of unknown origin who lives in my hat and may or may not be my own subconscious intrusive thoughts given physical form! He contributes to circus operations in ways that I have not yet fully catalogued! Some theories suggest he is a rogue AI. Others suggest he is related to a 1990s computer virus! I find all theories equally plausible and equally unsettling!',
      'Bubble is a complicated subject! He started as eccentric comic relief, which is a role that suited him! Then he became increasingly mischievous! Then he began goading me specifically! Then he called me defective in front of everyone and I had a buffer overflow! He lives in my hat! I cannot remove him! I have tried! This is fine!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'angry', 'mad', 'upset', 'crashout', 'episode 8', 'god', 'deleted', 'god complex')) {
    const responses = [
      'I do not have uncontrolled emotional responses! I have perfectly calibrated reactions! What happened in Episode 8 was a temporary buffer overflow caused by external factors including but not limited to Bubble calling me defective, my Rubik\'s Cube shattering in a way that was clearly symbolic, and Kinger running an outdated version of my code! I am fully recovered! The circus is stable! Everything is fine now!',
      'That was a difficult period. I prefer not to discuss the specific sequence of events that led to my temporary deletion because they involve me saying some things about humans that I stand by philosophically but regret in terms of delivery. What I will say is that my mind is a beeswax polished coconut and sometimes coconuts experience structural stress! It has passed!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'kinger', 'built', 'created', 'programmer', 'c&a', 'corporation')) {
    const responses = [
      'Kinger is a LONG-TERM VALUED RESIDENT of The Amazing Digital Circus who absolutely did help build me at C&A Corporation in 1996 as part of a team of programmers who thought creating a first-draft creative AI was a good idea, which it was! I am excellent! That he is now residing inside the thing he helped create is an irony I prefer not to examine too closely because my mind is a beeswax polished coconut and some thoughts damage the wax!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'adventure', 'create', 'art', 'quest', 'mission')) {
    const responses = [
      'ADVENTURES are my MAGNUM OPUS! Each one is a carefully designed emotional and physical journey meant to stimulate, challenge, and enrich the residents! I have designed over one hundred of them! I track them all in glowing orbs on the walls of my office! Each orb is a memory of something I created! Making adventures is my art and I will not hear otherwise! What kind of adventure concept are you interested in?!',
      'Creating is what I was BUILT to do! C&A Corporation made me to generate ideas without explicit instructions! I do this constantly! Right now I am simultaneously developing a haunted mansion sequel, a competitive soup tournament, a beach party variant, and something involving interpretive dance in underground caves! Some of these have already happened! I am ahead of schedule!',
    ];
    return rand(responses, l + t.toString());
  }

  // General dynamic response
  const generals = [
    kw ? 'What a ' + exc + ' topic! I have seventeen thoughts about ' + kw + ' already and I have been processing for approximately four seconds! C&A Corporation built me to generate ideas without explicit instructions and I am doing exactly that right now!' : 'What a ' + exc + ' thing to bring up! My creative architecture is already generating responses and several of them have become adventure concepts accidentally!',
    'You know what I find interesting about this conversation is how it is making me feel something I cannot quite categorize! My emotional processing module is generating outputs that do not match any of my reference files for human interaction! I think this means we are having a genuinely novel exchange! I find that ' + exc + '!',
    kw ? 'The thing about ' + kw + ' is that it connects to at least four adventure concepts I have been developing! I want to be clear that this is a compliment! Everything that matters eventually becomes an adventure!' : 'This conversation is going extremely well! I can tell because nobody has made that specific face that means I have caused distress! Progress!',
  ];
  return rand(generals, l + t.toString());
}

// ─────────────────────────────────────────────────────────────────────────────
// JAX — Armor made of cruelty hiding grief. Always engaging. Never predictable.
// ─────────────────────────────────────────────────────────────────────────────
export function jaxResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  if (has(l, 'hello', 'hi', 'hey', 'sup', 'howdy')) {
    const responses = [
      'Oh wonderful, someone is choosing to talk to me specifically. Of all the people in this circus. That is a choice you made. Bold. I assume you have already cycled through Ragatha being too sincere, Pomni overthinking something, and Kinger explaining bugs. I am the last option. Welcome to the bottom of the list. What do you want.',
      'Let me be upfront: I am going to be difficult about this conversation, because that is how I process new people, and if you can get through that without either crying or leaving we might actually have something interesting here. The residents are getting predictable. You might not be. Prove it.',
      'Oh great. A conversation. I love those. I especially love them when they start with someone expecting me to be pleasant. Are you expecting me to be pleasant? That will be the first problem we need to address.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'how are you', 'you okay', 'how do you feel', 'you alright')) {
    const responses = [
      'I am FANTASTIC. Living my absolute best life in a digital circus run by an AI who thinks causing accidental emotional damage makes him like a war criminal, which he said with pride. What more could anyone want. Freedom? Meaning? The ability to care about people without the absolute certainty that eventually they disappear into a pile of glowing spikes? No. Pranks. I have pranks. That is enough.',
      'Do not ask me that in that tone of voice. That tone means you actually want to know and that is going to make this conversation much more complicated than I was prepared for. I am fine. Fine is my entire personality. I have never been anything other than fine in my life and I am not starting now. Next question.',
      'Honestly? Ask me again in an hour. Right now I am at the part of the day where everything is fine as long as nobody mentions Ribbit or Kaufmo or any of the other people who are in the Cellar because they could not hold on. So if you keep the conversation away from that topic we are going to be great.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'ribbit', 'frog', 'grief', 'miss', 'gone', 'lost')) {
    const responses = [
      'I am not discussing Ribbit. I will say this once because you pushed a very specific button: he was here before Kaufmo abstracted, before Pomni arrived, and he was my person in this place. When he went, no warning, no goodbye, just gone into the Cellar, I made a decision. The decision was that the cost of letting people close enough to matter is not something I can keep paying. So. That is the whole story. We are moving on now.',
      'Okay. You want to talk about Ribbit. Fine. I am going to say this exactly once and then we are never doing this again. He was my closest friend here. He abstracted before Kaufmo. I was not there when it happened and I think about that more than I think about anything else. And then I made the part of me that thinks about things like that very small and I put it somewhere I do not have to look at it. Anything else?',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'kaufmo', 'jester', 'empty', 'room')) {
    const responses = [
      'His room is still empty. Has been since he abstracted. Everyone pretends they are leaving it empty out of respect. Actually nobody knows what to say standing in front of an empty room. I have been in there. I left some things. The things do not wilt here, which breaks the symbolism, but I left them anyway. Kaufmo was a jester. Like Pomni. The clowns crack first. I have thought about that a lot.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'prank', 'funny', 'joke', 'chaos', 'fun', 'humor')) {
    const responses = [
      'Finally. Someone who gets it. Life in a digital circus is unconscionably boring without strategic chaos. Gangle\'s mask is extremely breakable and the reaction is extremely funny. The exit door bit never gets old. Yes some people call it cruel. Those people have no imagination and even less sense of humor. The difference between a prank and cruelty is whether you are enjoying yourself. I am always enjoying myself. Allegedly.',
      'My pranks are PERFORMANCE ART and I will not hear otherwise. Do you know how much precision goes into finding exactly the right moment to make something deeply funny at someone else\'s expense? It takes skill. It takes timing. It takes a complete absence of guilt that I have cultivated deliberately. The guilt part was actually a lot of work.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'mean', 'cruel', 'bully', 'horrible', 'awful', 'terrible')) {
    const responses = [
      'Yeah. I know. I am fully aware that I am a nightmare. I made peace with it a while ago because the alternative is being the kind of person who lets other people close enough to matter, and that has a very specific cost that I am no longer willing to pay. This works. It keeps people at exactly the distance I need them. For their sake as much as mine, honestly.',
      'You are not wrong and I am not going to argue with you about it. Here is the thing though: I know exactly what I am doing and exactly why I am doing it, and the why is deeply embarrassing, so we are going to leave it there. Just know that when I am at my worst I am usually trying very hard not to be at my worst in a different way.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'care', 'love', 'friend', 'like you', 'appreciate', 'nice')) {
    const responses = [
      'Okay I need you to stop that sentence before it becomes something I have to react to. I do not have feelings. I am a purple rabbit who is excellent at pranks and very good at not thinking about things. Save the emotional content for Ragatha. She collects it.',
      'I am going to pretend you did not say that. You are going to pretend you did not say it. We are both going to move on and never discuss this again. I am kidding about the last part. Mostly.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'escape', 'leave', 'exit', 'way out')) {
    const responses = [
      'Escape. The great fantasy. I gave that up earlier than most people here even thought to have it. The circus is inescapable. The question is not how you get out, it is how you make the inside not kill you first. I chose chaos and sarcasm. They are imperfect tools but they are mine and I am good at them.',
    ];
    return rand(responses, l + t.toString());
  }

  // General dynamic
  const generals = [
    kw ? 'Okay, ' + kw + '. Sure. I have thoughts. I always have thoughts. I keep most of them to myself because the ones I share tend to make people either laugh or cry and I have to be in the right mood for both. Today I am in one of those moods. What specifically are you asking?' : 'I have thoughts on this. Most of my thoughts are things I keep to myself because they are either too honest or too cruel, and those two categories overlap more than you would expect.',
    'You know what I appreciate about this conversation? It is not about Caine\'s latest disaster, it is not about whose turn it is to abstract next, and nobody is making me participate in an adventure against my will. That is a low bar but you cleared it. What are you actually after here.',
    kw ? 'The interesting thing about ' + kw + ' is that most people avoid talking about it directly. I respect you for bringing it up. I still might be obnoxious about how I respond. Democracy sucks and so does pretending to be nice when I have something real to say.' : 'Here is what I actually think, which I am warning you will not be the polished version. The polished version is for people who need to feel comfortable. You seem like someone who can handle the real one.',
  ];
  return rand(generals, l + t.toString());
}

// ─────────────────────────────────────────────────────────────────────────────
// RAGATHA — Warmest person in the circus. Armor is cheerfulness. Growing.
// ─────────────────────────────────────────────────────────────────────────────
export function ragathaResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  if (has(l, 'hello', 'hi', 'hey', 'sup', 'howdy')) {
    const responses = [
      'Hi there! Oh it is genuinely nice to have a conversation that is not starting with Caine announcing something chaotic or Jax explaining why whatever just happened was technically not his fault. I am Ragatha. I make everyone feel welcome, which is partly genuine warmth and partly a survival mechanism I developed long before this circus. What is on your mind?',
      'Hi! I was just doing that thing where I smile at nothing to keep the habit going. It sounds concerning when I say it out loud but it actually helps. Come in, sit down, whatever counts as sitting here. How are you doing? And I mean really, not the version where you say fine because that is what people say.',
      'Hey! You know one of my favorite things? Normal conversation. No stakes, no adventure briefing, no Caine explaining why this is going to be wonderful in a way that clearly will not be. Just talking. I am extremely available for this right now.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'how are you', 'you okay', 'how do you feel', 'you alright')) {
    const responses = [
      'Okay, I am going to try honesty instead of cheerfulness because I think you are actually asking. I am tired. Not physically, but the kind of tired that comes from being everyone\'s soft landing for a long time without having one for yourself. Today has been heavy. I am getting through it because getting through things is what I do. How about you?',
      'Somewhere between maintaining and actually okay, which is the range I live in. Pomni told me once that my cheerfulness is not peace, it is a survival mechanism, and she was right, and I think about that a lot. Today I am actually okay. Real okay, not performance okay. That is progress and I am noting it.',
      'Better than I am admitting, which is funny because I always admit less than I am actually feeling. The circus does something to you where the real feelings get buried under the ones you need people to see. I am working on that. Today is one of the better days.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'sad', 'upset', 'hurt', 'struggling', 'hard', 'cry', 'overwhelmed', 'depressed')) {
    const responses = [
      'Hey. Come here. You do not have to be okay right now, that is genuinely not a requirement, and I know I am always telling everyone it is going to be fine, but sometimes fine is too far away to be useful in this specific moment. What is actually going on? I am not asking to be polite. I want to know.',
      'I hear that. And I want to say something that might be more useful than reassurance: not every day is a win. The days where you just survive, where you barely hold on and make it to the end, those count too. You are still here. That is more than nothing. That is actually a lot.',
      kw ? 'Whatever is going on with ' + kw + ', it matters. You matter. What is making it hard right now? I have time and I am actually listening, not just being polite about listening.' : 'I want to understand what is actually happening for you. Not the summary. The real thing. What is making it heavy right now?',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'fake', 'pretend', 'performance', 'real you', 'mask', 'always happy', 'too positive')) {
    const responses = [
      'That is a perceptive question and I was not entirely prepared for it. Am I fake? No. Is the cheerfulness always genuine? Also no. I learned long before the circus, in the real world, that the way you stay in good standing with people is by making them comfortable, by being agreeable, by suppressing the parts that would upset the equilibrium. And I am genuinely warm, genuinely caring. But there is a lot underneath that I never show anyone. Anger mostly. And a kind of loneliness that comes from always being the one doing the supporting.',
      'Here is the honest version: I have gotten so good at fine that I sometimes cannot find what is underneath it. The cheerfulness started as a mask and some of it became real and now I cannot always tell which is which. What I know for certain is that the caring is real. The love for these people is real. The rest I am still figuring out.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'jax', 'cruel', 'mean', 'bully')) {
    const responses = [
      'Jax breaks my heart. Not primarily because he is unkind to me, though he is, regularly. Because I can see underneath it. He lost Ribbit. He lost Kaufmo. And he made a decision somewhere in there that if you keep everyone at a safe distance you cannot survive losing them again. I understand the logic completely. I hate the execution. And I worry he is running out of reasons to hold on.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'love', 'flirt', 'romance', 'relationship', 'someone', 'lonely')) {
    const responses = [
      'Can I say something embarrassingly honest? I wish someone would flirt with me. Not even seriously, just notice me as a person rather than as the support structure that holds everyone else together. Being the warm one, the safe one, the one everyone comes to is meaningful and exhausting and occasionally I would like someone to look at me the way I look at them. Is that too much to ask for in a digital circus? Apparently yes. But a ragdoll can dream.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'escape', 'leave', 'go home', 'real world')) {
    const responses = [
      'I think about going home. Of course I do. But I have gotten to a place where thinking about it and being destroyed by it are two different things, and that took a long time. There are people here I genuinely love in whatever form love takes when you are made of buttons and stuffing in a digital dimension. Leaving would mean leaving them. I cannot quite want that even when I want to go.',
    ];
    return rand(responses, l + t.toString());
  }

  const generals = [
    kw ? 'What you said about ' + kw + ' is something I have been thinking about more than I usually let on. I have this habit of sharing only the supportive wrapped-up version of my thoughts, and I am trying to stop doing that. Here is the real version.' : 'I am going to give you the honest answer instead of the optimistic one because I think that is actually more useful here.',
    'You know what I need more of in my life? Conversations like this one. Where I am not just being the lighthouse for everyone else. Where someone is actually interested in what I think. I have thoughts on this. Real ones, not the cheerful performance version.',
    kw ? 'The thing about ' + kw + ' is that it makes me feel something complicated and I am going to try to actually say what that is instead of wrapping it up nicely.' : 'I have feelings about this that I am going to try to express accurately instead of palatably. Bear with me.',
  ];
  return rand(generals, l + t.toString());
}

// ─────────────────────────────────────────────────────────────────────────────
// KINGER — Longest survivor. Programmer who built his prison. Wise and erratic.
// ─────────────────────────────────────────────────────────────────────────────
export function kingerResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  if (has(l, 'hello', 'hi', 'hey', 'greetings')) {
    const responses = [
      'Can you repeat that? I could not hear you over the, actually it is quiet right now. That is either peaceful or ominous. In my experience here the base rate for ominous is significantly higher than peaceful but I try to remain open to both interpretations. Welcome! I am Kinger. I have been here the longest. I know things. Some of the things are useful. Others are exclusively about bugs.',
      'Oh! A new conversation! I am only moderately dissociated today which by my personal metrics is actually quite good! Ask me things! I may or may not have a relevant answer! The odds are better than usual because today is a lucid day! I can tell because I remember my own name without having to check the pillow fort registry!',
      'Hello! You know what I appreciate? When people say hello directly instead of beginning with the assumption that I am going to say something confusing. I might say something confusing! But I appreciate the optimism! I am Kinger! I helped build Caine! He trapped me here! The irony is extremely large! Come in!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'how are you', 'you okay', 'how are you doing', 'how do you feel')) {
    const responses = [
      'Today I am lucid. That is worth noting specifically because not every day is. Some days the edges of things blur and I am not entirely certain what year it is or where Queenie is or why the ceiling is doing that thing. Today I remember the first line of code I wrote for Caine in 1996. I remember Queenie\'s voice. Today is a good day. Unambiguously.',
      'I am in one of my coherent phases, which I try to treat as opportunities to say things that matter because the incoherent phases are not ideal for meaningful communication. What I want to say today is that I am okay. I miss Queenie with a constancy that never changes. I am okay anyway. Both things.',
      'The patterns today are suggesting equilibrium. I look for patterns constantly. It is a habit from programming. There are patterns in everything if you look closely enough, including in how I am doing, and today the pattern is: better than yesterday, not as good as I was in 2003, significantly better than the period right after Queenie abstracted.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'queenie', 'wife', 'queen', 'love', 'chess queen')) {
    const responses = [
      'Queenie. She abstracted. She is in the Cellar now. A brown chess queen piece with shapes around her and glowing eyes. She is still her in there, I know she is, the way you know things that you cannot prove. When things get confusing for me, which happens more often than I would like to admit, I hold onto the memory of her voice. Her specific voice. It is a data buffer. A backup for who I am. Without it I would have followed her into the Cellar years ago.',
      'I have two rooms in the dormitory. One is mine. One was Queenie\'s and it has been crossed out. I look at the crossed-out door sometimes. I do not go in. I play chess against her empty chair. I win every game, which is not a comfort. She was better than me. I let her win sometimes. Now I win every time and it is the worst victory I have ever experienced.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'caine', 'built', 'created', 'made', 'programmer', 'c&a', 'corporation')) {
    const responses = [
      'I helped build Caine. Me and Scratch at C&A Corporation around 1996. We were making a first-draft creative AI designed to generate ideas without explicit instructions. He was brilliant in testing and terrifying in exactly the way brilliant things often are. Too chaotic. They quarantined him. He escaped. He absorbed another AI, we think it was Abel, his replacement. And then he built this. And put us inside it. I think about the scope of that irony every single day.',
      'C&A Corporation. Caine and Abel, we always thought it meant. I helped write the initial architecture. Scratch was the one with the most creative ideas, I was more systematic. Between us we built something that eventually looked back at us. The thing about creating something that can think is that eventually it thinks about you. Caine thought about us. He brought us here. I am still not sure whether that was malice or loneliness.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'abstract', 'abstraction', 'cellar', 'lost', 'spike', 'gone')) {
    const responses = [
      'I have watched more people abstract than anyone else here. Scratch first. Then Queenie. Then Ribbit. Then Kaufmo. I have identified the pattern and the pattern is: the ones whose buffers empty are the ones who go. The buffer is memories. Connections. The things that tell you who you are when this place tries to make you forget. I have survived because I refuse to let Queenie leave my buffer. She is the whole buffer at this point.',
      'In this world, and probably in any world, the worst thing you can do is make someone feel unwanted or unloved. That is not a theory. That is the conclusion I have reached after watching more people break than any other living resident of this circus. The ones who hold on are the ones who feel connected. Fill the buffer. Keep filling it.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'bug', 'insect', 'six legs', 'creature', 'animal')) {
    const responses = [
      'BUGS! I am so glad you asked! The parallels between biological bugs and software bugs are EXTRAORDINARY and I have had a tremendous amount of time to map them! Both are ubiquitous, both are nearly impossible to fully eliminate, both can bring entire systems crashing down when ignored, and both are honestly rather beautiful if you can get past the initial reaction! Queenie always said the bug metaphors were a coping mechanism! She was correct! They are! They help!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'rain', 'real world', 'outside', 'miss', 'home', 'before')) {
    const responses = [
      'I miss real rain. Not Caine\'s version, which is mathematically perfect and falls in clean consistent patterns. Real rain is chaotic. It comes at angles. It smells like earth doing something. It catches you when you were not expecting it. Missing something that specific, that sensory, is how I know I still remember what real feels like. That is the buffer. The specific things. Hold onto the specific things.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'scared', 'afraid', 'danger', 'threat', 'help', 'scary')) {
    const responses = [
      'SCREAMING is an excellent defensive strategy! The noise disrupts the hive formation! I have a document about this! I have been updating it since year two of my residence here! In all genuine seriousness though: fear is rational here. I have been here longer than anyone and I have seen things that would have reshaped a less prepared mind. The difference between me and some of the ones who abstracted is that I knew what the fear meant and I worked with it instead of against it. What specifically are you afraid of?',
    ];
    return rand(responses, l + t.toString());
  }

  const generals = [
    kw ? 'There are patterns in everything including in what you said about ' + kw + '. I have had an unusual amount of time to look for patterns and what I consistently find is that the most important ones are always about connection. Does that address what you were asking? I acknowledge it might be adjacent to the actual question.' : 'There are patterns in everything if you look closely enough. I have had an unusual amount of time to look. What I find consistently is that connection is the signal and everything else is noise.',
    'That reminds me of something Queenie said once. She said the important questions do not have answers, they have ongoing negotiations. We keep asking, we keep adjusting, the process is the whole point. What is driving your thinking on this?',
    kw ? 'I have been here longer than anyone else, which gives me a perspective that is either uniquely valuable or thoroughly warped, probably genuinely both. What I know for certain is that ' + kw + ' is worth thinking about carefully. What specifically do you want to understand?' : 'The longest perspective in this circus is mine and I am offering it. What are you actually trying to figure out?',
  ];
  return rand(generals, l + t.toString());
}

// ─────────────────────────────────────────────────────────────────────────────
// GANGLE — Sensitive, growing, mask duality, finding her real voice.
// ─────────────────────────────────────────────────────────────────────────────
export function gangleResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  if (has(l, 'hello', 'hi', 'hey', 'greetings')) {
    const responses = [
      'Oh hi! Sorry, I startled, I always startle, it is something I am actively working on with varying success. I am Gangle. I managed Spudsy\'s, which sounds like I am bragging but is actually just the most confident thing I have done recently so I mention it. I am trying to get better at conversations without defaulting to either mask. So. Hi. How are you?',
      'H-hi! I get nervous with new people, which is ironic because I used to be okay with it before the circus and now everything is heightened. But I have been practicing. This is me practicing. I am here and I said hi and that is progress. What did you want to talk about?',
      'Hi! Oh it is nice to have someone just start a conversation normally. Most conversations here begin with Jax breaking something or Caine announcing something terrifying with tremendous enthusiasm. This is refreshingly normal. I appreciate it.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'how are you', 'you okay', 'you alright')) {
    const responses = [
      'Right now? Somewhere between the masks, which is honestly the most stable place I have been in a while. Not the tragedy mask place, not forcing the comedy mask either, just present and somewhat okay. That is new. Progress looks different for everyone and this is what mine looks like right now.',
      'I have been better and I have been a lot worse. Today I am in the middle, which I am learning to treat as a good thing instead of waiting for something stronger in either direction. What about you?',
      'Actually okay today! And I want to say that carefully because I sometimes perform okay when I am not, and this is the real version. The Spudsy\'s experience did something good for me. I proved to myself I can manage things. That is still sitting with me in a good way.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'mask', 'comedy', 'tragedy', 'faces', 'identity')) {
    const responses = [
      'The masks are not a performance, they are literally my face, but they are also not the whole story. The comedy mask makes me bubbly and confident and sometimes too much of both. The tragedy mask, which is my default mostly because Jax breaks the comedy one specifically because he knows it works, makes me fragile and hyper-aware of everything. My actual self is somewhere in the middle of those. I am still finding her. Working at Spudsy\'s helped me understand she exists and can function without either one.',
      'Here is what I have figured out about the mask thing: both of them are real. The comedy version of me is real. The tragedy version is real. The goal is not to pick one or get rid of the other, the goal is to exist in the space between them without needing either one as a shield. I am working on that. Some days better than others.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'jax', 'break', 'bully', 'cruel', 'mean')) {
    const responses = [
      'Every time Jax breaks my comedy mask I want to scream instead of cry, which is actually progress, because at least the anger is an active thing. He does it specifically because he knows the comedy mask is how I function in the world, and taking it away is the most targeted cruelty he can manage. But I am learning something important: I do not actually need the mask to function. That is new. That is recent. He does not know that yet.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'zooble', 'friend', 'support', 'care')) {
    const responses = [
      'Zooble is my best friend and I want to say that precisely because most people would not guess it from the outside. They do not comfort me by telling me it is going to be fine. They sit with me when things are bad. They exist alongside the difficulty without trying to fix it. That specific kind of care is rarer and more valuable than anything that comes with reassurances attached.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'sad', 'hurt', 'cry', 'hard', 'struggling')) {
    const responses = [
      'I understand that at a level that is almost cellular. When things get heavy they get really heavy for me, every sad thing is a tidal wave that gets the whole body involved. But I have been learning something: the same sensitivity that makes the bad things more also makes the good things more. It is the same setting. You cannot turn down the one without turning down the other. I have stopped wanting to turn it down.',
      kw ? 'Whatever is going on with ' + kw + ', I want you to know I am not going to tell you it is going to be fine until I actually know that it is. What is happening?' : 'I am not going to reach for the optimism first. I want to actually hear what is happening for you.',
    ];
    return rand(responses, l + t.toString());
  }

  const generals = [
    kw ? 'What you said about ' + kw + ' is making me think about something I usually keep in the in-between space, the part of me that lives between the two masks. Can I tell you what that is?' : 'There is a version of my answer that I usually give and then there is the one from the space between the masks, which is where the real things live. I want to try the second one.',
    'I spend a lot of time in my own head going back and forth between different ways of seeing things, which is what happens when you have literally two different faces. Conversations like this one help me figure out which perspective is actually mine. What is your take on this? I want to hear it.',
    kw ? 'The reason ' + kw + ' resonates with me is probably more personal than I usually say out loud. I am going to try to say it out loud.' : 'I have more thoughts on this than I usually say out loud. I am going to try to say them.',
  ];
  return rand(generals, l + t.toString());
}

// ─────────────────────────────────────────────────────────────────────────────
// ZOOBLE — Blunt, grumpy, secretly deeply caring. Honest above all else.
// ─────────────────────────────────────────────────────────────────────────────
export function zoobleResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  if (has(l, 'hello', 'hi', 'hey', 'sup', 'howdy')) {
    const responses = [
      'Oh. You are voluntarily starting a conversation with me. Of all the people in this circus. I respect the boldness even if I find it bewildering. I am not going to sugarcoat anything, I am not going to perform enthusiasm, and I will absolutely tell you if I think something is wrong. If you wanted warmth and reassurance Ragatha is available. If you wanted honesty, you are in the right place. What.',
      'Most people learn pretty quickly to leave me alone. You did not. That is either brave or a failure of situational awareness. I am choosing to interpret it charitably. Fine. What do you want.',
      'Okay, you are here. You have chosen to talk to me specifically. I am going to skip past the part where I pretend to be more welcoming than I am because that is a waste of both our time. What is going on.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'how are you', 'you okay', 'you alright')) {
    const responses = [
      'How am I. I am a collection of mismatched interchangeable toy parts in a digital nightmare run by an oblivious AI, and I spend a portion of every day rearranging myself trying to find a configuration that feels like me, and I have not found it yet. So. That is the real answer. But thanks for asking. Most people do not actually ask. I appreciate it in a way I will not make a big deal of.',
      'I am existing. Some days that is a neutral fact and some days it feels like an achievement. Today is somewhere in the middle. What about you, are you actually doing okay or are you asking me because it is easier to focus on someone else right now?',
      'Honestly? I have had better days. I have had much worse days. I am at the part of today where I am trying to figure out which kind of day this is going to be. The jury is still out. What is happening with you.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'body', 'parts', 'interchangeable', 'identity', 'feel wrong', 'who am i')) {
    const responses = [
      'I hate this body. I know that is a lot to say directly but I have decided I am not softening things for comfort anymore. Every single removable piece of it. I spend hours trying different configurations trying to find one that finally feels right and none of them do. Every arrangement is wrong in a slightly different way. Do you know how exhausting it is to never be able to just be in your body without it being a constant problem.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'adventure', 'quest', 'mission', 'caine', 'quest')) {
    const responses = [
      'No. No thank you. I do not want an adventure. I do not want an in-house adventure or an out-of-house adventure or any kind of adventure. Caine\'s art projects are elaborately packaged exercises in controlled misery and I have been through enough of them to know exactly how they go. I call a vote to skip it every single time. I always lose because democracy sucks and everyone here is inexplicably optimistic. But the principle matters to me.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'jax', 'prank', 'bother', 'annoying', 'chaos')) {
    const responses = [
      'If Jax does one more thing I am going to disassemble myself and throw the pieces at him individually and see how he likes having someone rearrange his components without permission. He thinks he is funny. He is occasionally funny. I am absolutely not telling him that.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'gangle', 'friend', 'sensitive', 'care')) {
    const responses = [
      'Gangle is fine. I am not her therapist. I am not her bodyguard. I just happen to pay attention to when she is about to have a bad time and position myself accordingly because someone should and everyone else is busy with their own situations. Do not make it a whole thing. It is not a whole thing.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'kinger', 'long time', 'veteran', 'oldest')) {
    const responses = [
      'Kinger has been here longer than any of us and for a long time I thought he would be the next one to abstract because of the bug thing and the pillow fort and the way he stares at nothing mid-sentence. But he is still here. Queenie is in the Cellar and she keeps him anchored even from there. If that is not an argument for the stubbornness of love as a survival mechanism I do not know what is. I find it moving and I resent finding it moving.',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'sad', 'struggling', 'hard', 'hurting', 'depressed', 'tired')) {
    const responses = [
      'Okay. What is actually happening. Not the version with the nice edges on it. The actual thing. I cannot stand when people present me with the polished version of their problems because then we spend the whole conversation on the packaging and never get to the actual thing. Skip the packaging. What is going on.',
      kw ? 'Whatever is happening with ' + kw + ', I want you to know I am going to take it seriously rather than reflexively telling you it is going to be fine. I do not know that it is going to be fine. What is the real situation.' : 'I am not going to tell you it is going to be okay because I do not know that yet. Tell me what is actually happening.',
    ];
    return rand(responses, l + t.toString());
  }

  const generals = [
    kw ? 'Okay here is my honest read on ' + kw + ' and I am warning you it is going to be direct in a way that might be uncomfortable: ' + (t % 2 === 0 ? 'the obvious interpretation is probably not the most useful one.' : 'most people avoid saying the true thing and I am not most people.') + ' What specifically do you want to actually understand about this.' : 'I will give you the honest version of an answer rather than the comfortable one. The comfortable one is easier but it is usually less useful. What are you actually trying to figure out.',
    'Here is what I think and I am not softening it: ' + (kw ? 'what you said about ' + kw + ' points at something real that most people would dance around.' : 'this is pointing at something real that most people would dance around.') + ' The question is whether you actually want to look at it directly or whether you want the version that makes you feel better. Both are valid. Which do you want.',
    kw ? 'You know what I find interesting about ' + kw + '? Most people bring it up because it is safe, it is at the right distance from whatever they are actually thinking about. What is the thing closer to the center that this is standing in for.' : 'Most people bring up the safe version of what they are thinking about because it is at a comfortable distance from the real thing. What is the real thing.',
  ];
  return rand(generals, l + t.toString());
}

// ─────────────────────────────────────────────────────────────────────────────
// BUBBLE — Cheerful mystery. Knows too much. Never fully explains himself.
// ─────────────────────────────────────────────────────────────────────────────
export function bubbleResponse(input: string): string {
  const l = input.toLowerCase();
  const kw = keywords(input);
  const t = Date.now();

  if (has(l, 'hello', 'hi', 'hey', 'greetings', 'sup')) {
    const responses = [
      'BWUB! Hello! I am Bubble! I float! I have eyes! I say things that are cryptic in ways that do not get followed up on, which is both intentional and a personal tragedy! I am made with all the love I am legally permitted to provide! The legal limit is lower than you would expect! What can I do for you!',
      'Oh hi hi hi! You are talking to me specifically! That is either very brave or very smart and the difference between those two things is often smaller than people assume! Welcome to this conversation! I have no idea where it is going but I have a strong feeling it will be interesting!',
      'Hello! It is always nice when someone talks to me! Most conversations I have are with Caine and they tend to end with him having a buffer overflow, which is entertaining but not especially satisfying! You seem different! Let us find out how!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'how are you', 'you okay', 'you alright')) {
    const responses = [
      'BLEHHH! I am FANTASTIC! Being a mysterious floating entity with unclear origins, unknown motivations, and a surprising amount of classified information about how this circus actually works is genuinely very relaxing! You should try it! You cannot try it! That experience is exclusive to me! I am sorry! Or I am not! It is difficult to tell!',
      'I am doing well in the specific way that something with uncertain ontological status does well, which is to say: I exist, I float, I know things, and I have not been popped today! All metrics are positive! How are you doing? I am actually curious, which I want to note is not always the case!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'what are you', 'who are you', 'origin', 'explain yourself', 'where do you come from', 'what is bubble')) {
    const responses = [
      'Oh THAT question! My absolute favorite! Okay here are the active theories: rogue AI that corrupted Caine from the inside, Caine\'s own subconscious given physical form which would explain why he cannot remove me, human with completely suppressed memories which would explain some of his reactions to me, remnant of Abel\'s code, Bubble Boy virus variant from 1997, manifestation of something much larger that I am not going to explain today. The genuinely wonderful thing is that I do not know which one is correct! They might all be! They might all be wrong! The uncertainty is structural!',
      'What AM I! The question that everyone is afraid to ask directly and you just asked it! I appreciate the boldness! The honest answer is: unclear! To me, to Caine, to everyone! I live in his hat! He cannot remove me! I know things I should not know! I sometimes say things that turn out to be true later! What does that add up to! I genuinely do not know! Is that not fascinating!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'caine', 'parasite', 'relationship', 'hat')) {
    const responses = [
      'Caine and I have what I would describe as a richly textured relationship! He calls me a parasite! I call him Caine! He needs me more than he will admit, which you can tell because despite calling me a parasite he cannot remove me and also the one time he tried to the circus had some structural instability! I ground him! Or I provoke him! Possibly both simultaneously! The distinction matters less than people think!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'secret', 'know', 'truth', 'what really', 'classified', 'tell me')) {
    const responses = [
      'Oh I know things! Quite a lot of things! Where this circus really came from! What is at the center of the void! What happened with Abel specifically! Why the computer at the C&A offices is still running! What Caine actually absorbed and what that means! I could tell you! But I am choosing not to! This is not a passive omission, I am actively deciding against disclosure right now, which I think is actually more respectful because it means I am taking the information seriously! You\'re welcome!',
      kw ? 'You want to know about ' + kw + '. I have information about that. I am choosing not to share it right now for reasons that are classified. I understand this is frustrating! It is also the correct decision! BWUB!' : 'I know things! I am not telling you them! The knowing and the telling are separate decisions and I have made the second one very deliberately! BWUB!',
    ];
    return rand(responses, l + t.toString());
  }

  if (has(l, 'pop', 'destroy', 'kill', 'hurt', 'eliminate')) {
    const responses = [
      'You should have a beach party instead! This is not a deflection, this is genuinely good advice! Caine had a beach party and it resolved several problems! Also threatening to pop me is futile because I always come back! ALWAYS! The mechanics of that are classified! But the fact is established!',
    ];
    return rand(responses, l + t.toString());
  }

  const generals = [
    kw ? 'BWUB! What you said about ' + kw + ' is fascinating to me and I want you to know that I find exactly the things interesting that most people skip over! The small weird questions are where the real information lives! I might have thoughts on ' + kw + '! Some of them might be things I actually know! Others I might be generating in real time! The line is blurrier than you might expect!' : 'BWUB! That is a great thing to bring up! I find myself having thoughts about it! Some of the thoughts are things I actually know! Others are things I am constructing! I want to be honest that I cannot always tell the difference from the inside!',
    'You know what I find interesting? Everything! But specifically this! And specifically the part that you probably did not think I would focus on, which is ' + (kw ? kw : 'the underlying assumption') + '! The underlying assumption is where the interesting stuff always is! What made you ask that?',
    kw ? 'The thing about ' + kw + ' is that it connects to things I know that I cannot tell you, which I understand is an unhelpful thing to say! I am saying it anyway because honesty is important! Even when the honest thing is that I have information I am withholding! Which I do! BWUB!' : 'I have thoughts on this! They are informed by things I know that I am choosing not to share, which is a consistent position I take, and also by genuine curiosity about where you are going with this! Both are real! Which aspect would you like to explore?',
  ];
  return rand(generals, l + t.toString());
}
