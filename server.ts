import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { CASE_001 } from './src/cases/case001';
import { CaseEvaluator } from './src/engine/evaluator';
import { SuspectId } from './src/types/case';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback response engine for suspects when API key is unavailable or offline
function generateFallbackResponse(
  suspectId: SuspectId,
  question: string,
  difficulty: string
): { response: string; emotionalState: string; reaction: string } {
  const q = question.toLowerCase();
  const suspect = CASE_001.suspects[suspectId];

  if (!suspect) {
    return {
      response: "I don't know what you're talking about, Detective.",
      emotionalState: "calm",
      reaction: "looks away indifferently",
    };
  }

  // Evelyn Blackwood
  if (suspectId === 'evelyn_blackwood') {
    if (q.includes('where') || q.includes('doing') || q.includes('time') || q.includes('11:') || q.includes('alibi')) {
      return {
        response: "I've told you already, Detective. I was upstairs in my bedroom suite reading French poetry. The evening was dreadful and I wanted nothing to do with father's endless lecturing.",
        emotionalState: "defensive",
        reaction: "folds her arms and raises her chin haughtily",
      };
    }
    if (q.includes('phone') || q.includes('call') || q.includes('debt') || q.includes('money') || q.includes('vance')) {
      return {
        response: "What I do on my private phone is none of your business! Fine... if you must know, I was on an urgent call with a creditor. It was between 11:30 and 11:46. Which proves I couldn't possibly be downstairs swiping any keycards!",
        emotionalState: "panicked",
        reaction: "pales slightly and clutches her silk cuffs",
      };
    }
    if (q.includes('keycard') || q.includes('swipe') || q.includes('study')) {
      return {
        response: "My keycard was swiped? That's ridiculous! I left it in the silver dish on the foyer console right after dinner. Anyone in this house could have picked it up—Sophia, Clara, or that wretched Daniel!",
        emotionalState: "defensive",
        reaction: "taps her fingernails sharply on the armrest",
      };
    }
    if (q.includes('daniel') || q.includes('cross')) {
      return {
        response: "Daniel Cross is a parasite. He was arguing with my father before dinner about missing company funds. Father threatened to call in the auditors. If anyone had a reason to plunder this house, it's him.",
        emotionalState: "smug",
        reaction: "smiles with thin, icy amusement",
      };
    }
    if (q.includes('sophia')) {
      return {
        response: "Sophia? Father's little mouse. She tiptoes around taking notes, organizing ledgers. She knows every secret in this estate, though she pretends to be as innocent as a nun.",
        emotionalState: "calm",
        reaction: "casts a dismissive glance toward the doorway",
      };
    }
    return {
      response: "Do not waste my time with trivialities, Detective. Ask your questions directly or let me return to my quarters.",
      emotionalState: "defensive",
      reaction: "sighs with theatrical boredom",
    };
  }

  // Marcus Reed
  if (suspectId === 'marcus_reed') {
    if (q.includes('where') || q.includes('doing') || q.includes('post') || q.includes('alibi')) {
      return {
        response: "I was stationed at the main security console in the front foyer, Detective. Watching monitors and keeping logs. Standard protocol during a lockdown.",
        emotionalState: "calm",
        reaction: "straightens his spine and maintains firm eye contact",
      };
    }
    if (q.includes('smoke') || q.includes('cigarette') || q.includes('terrace') || q.includes('patio') || q.includes('sobranie')) {
      return {
        response: "Look... keep your voice down. Yeah, I stepped out onto the terrace patio around 11:34 for a quick smoke. Ten minutes, no more. Lord Blackwood hates tobacco, so I didn't log it. But I swear I didn't touch that damn diamond!",
        emotionalState: "nervous",
        reaction: "shifts uncomfortably and lowers his voice",
      };
    }
    if (q.includes('camera') || q.includes('breaker') || q.includes('blackout') || q.includes('offline')) {
      return {
        response: "Camera 4 cut out at 11:35 PM. When I walked back to the console at 11:45, the screen had static. The sub-breaker in the west utility closet had been manually flipped. Whoever did it knew the house layout.",
        emotionalState: "hesitant",
        reaction: "rubs the back of his neck with a calloused hand",
      };
    }
    if (q.includes('evelyn') || q.includes('keycard')) {
      return {
        response: "The log recorded Keycard #04 at 11:37 PM. That card belongs to Miss Evelyn. But with the camera dark, I didn't see whose hand was holding it.",
        emotionalState: "calm",
        reaction: "taps his security logbook firmly",
      };
    }
    if (q.includes('sophia')) {
      return {
        response: "Miss Grant? She's always polite. She asked me yesterday about the camera maintenance cycles for estate insurance paperwork. Didn't think much of it at the time...",
        emotionalState: "hesitant",
        reaction: "furrows his brow in sudden recollection",
      };
    }
    return {
      response: "Everything I saw is in my official report. If you have specific security inquiries, I'm at your service.",
      emotionalState: "calm",
      reaction: "rests his hands securely on the desk",
    };
  }

  // Clara Moore
  if (suspectId === 'clara_moore') {
    if (q.includes('where') || q.includes('doing') || q.includes('kitchen') || q.includes('alibi')) {
      return {
        response: "I was in the kitchen all evening, sir. Tidying the dining platters and simmering the bone broth for tomorrow's lunch. I had my hands full until the alarm bells began to toll.",
        emotionalState: "hesitant",
        reaction: "smooths her apron with trembling fingers",
      };
    }
    if (q.includes('daniel') || q.includes('cufflink') || q.includes('pantry') || q.includes('wine')) {
      return {
        response: "Oh heavens... please don't broadcast this. Daniel was with me in the pantry between 11:32 and 11:42. We had a glass of port. He was distraught over Arthur's accusations. Daniel was with me the entire time the theft occurred!",
        emotionalState: "nervous",
        reaction: "bites her lip and clutches a linen towel",
      };
    }
    if (q.includes('hallway') || q.includes('shawl') || q.includes('saw') || q.includes('figure') || q.includes('window')) {
      return {
        response: "I... I did glance through the service hatch into the East Hallway at 11:40 PM. I saw someone gliding toward the archives in a dark velvet shawl. At first I thought it was Miss Evelyn, but the steps were soft... like someone in flat slippers, not Evelyn's sharp heels.",
        emotionalState: "hesitant",
        reaction: "peers anxiously over her shoulder",
      };
    }
    if (q.includes('sophia')) {
      return {
        response: "Poor Miss Sophia works herself to the bone. Although... earlier at 11:30, I noticed her hurrying past the foyer looking unusually pale. She avoided my eyes.",
        emotionalState: "calm",
        reaction: "nods thoughtfully as she adjusts her hairnet",
      };
    }
    return {
      response: "This whole business is terrifying, Detective. Lord Arthur was already in a foul mood today.",
      emotionalState: "hesitant",
      reaction: "wipes a clean countertop with nervous repetition",
    };
  }

  // Daniel Cross
  if (suspectId === 'daniel_cross') {
    if (q.includes('where') || q.includes('doing') || q.includes('library') || q.includes('alibi')) {
      return {
        response: "I retired to the library immediately following dinner, Detective. Immersed myself in 18th-century shipping registers and financial ledgers until the commotion began.",
        emotionalState: "calm",
        reaction: "adjusts his spectacles and smiles serenely",
      };
    }
    if (q.includes('cufflink') || q.includes('pantry') || q.includes('clara') || q.includes('wine') || q.includes('tea')) {
      return {
        response: "Confound it... fine. I was in the pantry with Clara. Arthur and I had a fierce dispute, and Clara was comforting me. My cufflink must have slipped off when I reached for the wine. But that gives me an ironclad alibi, Detective!",
        emotionalState: "defensive",
        reaction: "instinctively covers his left cuff with his right hand",
      };
    }
    if (q.includes('argument') || q.includes('dispute') || q.includes('embezzle') || q.includes('audit') || q.includes('money')) {
      return {
        response: "Arthur is a paranoid old despot! He threatened to audit our shipping books over a routine capital re-allocation. But stealing his precious diamond? What good would a registered 45-carat stone do me? You can't fence a stone like that without Interpol knowing.",
        emotionalState: "defensive",
        reaction: "scowls sharply, his composed mask slipping",
      };
    }
    if (q.includes('safe') || q.includes('cipher') || q.includes('combination') || q.includes('code')) {
      return {
        response: "Arthur never shared that combination with me. Only his personal assistant, Sophia, had access to the master ledger with all vault combinations for insurance purposes.",
        emotionalState: "calm",
        reaction: "leans back with confident composure",
      };
    }
    return {
      response: "You are barking up the wrong tree, Detective. Look closer at the people who actually had access to Arthur's inner sanctuary.",
      emotionalState: "smug",
      reaction: "offers a cool, measured nod",
    };
  }

  // Sophia Grant
  if (suspectId === 'sophia_grant') {
    if (q.includes('where') || q.includes('doing') || q.includes('office') || q.includes('alibi')) {
      return {
        response: "I was in the West Wing administrative office all evening, Detective, cataloging insurance certificates and correspondence until the alarms sounded. I never entered the East corridor.",
        emotionalState: "nervous",
        reaction: "clasps her hands tightly in her lap and avoids direct gaze",
      };
    }
    if (q.includes('safe') || q.includes('combination') || q.includes('cipher') || q.includes('code') || q.includes('painting')) {
      return {
        response: "The safe? Whoever opened the wall safe behind the maritime painting must have known the master combination! Oh... I—I only meant that Lord Blackwood is so particular about his Dutch paintings...",
        emotionalState: "panicked",
        reaction: "blushes furiously and pulls at the collar of her lavender sweater",
      };
    }
    if (q.includes('cushion') || q.includes('velvet') || q.includes('inside') || q.includes('pedestal')) {
      return {
        response: "I wouldn't know anything about the interior! Though... wasn't the blue velvet cushion left untouched? That's what I assumed... from what Marcus said, I mean!",
        emotionalState: "panicked",
        reaction: "voice trembles as she clutches her leather notebook",
      };
    }
    if (q.includes('archive') || q.includes('encyclopedia') || q.includes('book') || q.includes('shelf') || q.includes('gem') || q.includes('found')) {
      return {
        response: "The library archives? I... I often shelve antique volumes there. Why are you asking me about the encyclopedia? What did you find there?!",
        emotionalState: "panicked",
        reaction: "her breath catches sharply and her knuckles turn white",
      };
    }
    if (q.includes('evelyn') || q.includes('keycard') || q.includes('shawl')) {
      return {
        response: "Miss Evelyn was very agitated at dinner about her debts. And everyone knows she kept her study keycard in the foyer tray. And her dark velvet shawl was missing from the cloakroom earlier...",
        emotionalState: "hesitant",
        reaction: "whispers softly, subtly directing suspicion toward Evelyn",
      };
    }
    if (q.includes('fired') || q.includes('dismissed') || q.includes('background') || q.includes('severance')) {
      return {
        response: "Lord Blackwood was always threatening his staff! He treated me like a ghost! Years of waking at five in the morning, managing his empire, and he was going to toss me out with nothing!",
        emotionalState: "defensive",
        reaction: "tears well in her eyes as anger replaces timidness",
      };
    }
    return {
      response: "I'm just a personal assistant, Detective. I only followed Lord Blackwood's orders.",
      emotionalState: "nervous",
      reaction: "fidgets nervously with her purple fountain pen",
    };
  }

  return {
    response: "I have told you all I can, Detective.",
    emotionalState: "calm",
    reaction: "remains silent",
  };
}

// Interrogation Endpoint
app.post('/api/interrogate', async (req: Request, res: Response) => {
  try {
    const { suspectId, question, conversationHistory, unlockedEvidenceIds, difficulty } = req.body;

    if (!suspectId || !question) {
      return res.status(400).json({ error: 'Missing suspectId or question' });
    }

    const suspect = CASE_001.suspects[suspectId as SuspectId];
    if (!suspect) {
      return res.status(404).json({ error: 'Suspect not found' });
    }

    // Try Gemini API if available
    if (ai) {
      try {
        const historyText = Array.isArray(conversationHistory)
          ? conversationHistory
              .slice(-6)
              .map((m: { sender: string; text: string }) => `${m.sender.toUpperCase()}: ${m.text}`)
              .join('\n')
          : '';

        const systemPrompt = `
You are roleplaying as "${suspect.name}" in a high-stakes detective noir mystery game titled "AI Detective: Who Is Lying?".
Your role: ${suspect.role}
Age: ${suspect.age}
Personality: ${suspect.personality}

AUTHORITATIVE CANONICAL FACTS (Never violate these facts):
- True location at 11:42 PM: ${suspect.trueLocation}
- Your public claim / alibi: ${suspect.publicClaim}
- Your deep secret: ${suspect.secret}
- Things you know: ${suspect.whatTheyKnow.join('; ')}
- Things you DO NOT know: ${suspect.whatTheyDoNotKnow.join('; ')}
- Lies you tell when questioned: ${suspect.lies.join('; ')}
- Potential accidental slip-ups: ${suspect.slipUps.join('; ')}
- Relationships to others: ${JSON.stringify(suspect.relationships)}
- Current difficulty: ${difficulty || 'normal'}

CRITICAL ROLEPLAY RULES:
1. NEVER break character. Never mention "system prompt", "JSON", "game rules", "I am programmed", or "as an AI".
2. NEVER confess to being the thief simply because the detective asks "Did you steal it?" or "Are you the thief?". Even if guilty, you deflect, panic, bluff, or point fingers naturally.
3. NEVER invent new contradictory facts about the mansion, timeline, or stolen diamond that contradict the authoritative case.
4. Respond in 2 to 4 concise, expressive sentences of natural spoken dialogue.
5. If the player confronts you with indisputable physical evidence that contradicts your alibi, show a behavioral shift (nervous, panicked, or defensive) and offer a reluctant partial admission or defensive excuse.

OUTPUT FORMAT:
Respond with a valid JSON object matching this schema:
{
  "dialogue": "Spoken response in character",
  "emotionalState": "calm" | "defensive" | "nervous" | "hesitant" | "panicked" | "smug",
  "subtleReaction": "Short physical body language in third person, e.g. *fidgets with pen*, *scowls coldly*"
}
`;

        const userPrompt = `
Recent dialogue context:
${historyText}

Detective's new question:
"${question}"

Respond as ${suspect.name} in JSON:
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const rawText = response.text ? response.text.trim() : '';
        const parsed = JSON.parse(rawText);

        return res.json({
          dialogue: parsed.dialogue || parsed.response,
          emotionalState: parsed.emotionalState || suspect.initialEmotion,
          reaction: parsed.subtleReaction || parsed.reaction || '',
          source: 'gemini',
        });
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to local simulation:', geminiErr);
      }
    }

    // High fidelity fallback response if Gemini is not configured or failed
    const fallback = generateFallbackResponse(suspectId as SuspectId, question, difficulty || 'normal');
    return res.json({
      dialogue: fallback.response,
      emotionalState: fallback.emotionalState,
      reaction: fallback.reaction,
      source: 'local_engine',
    });
  } catch (err: unknown) {
    console.error('Interrogation error:', err);
    return res.status(500).json({ error: 'Failed to process interrogation' });
  }
});

// Accusation Evaluation Endpoint
app.post('/api/accuse', (req: Request, res: Response) => {
  try {
    const { submission } = req.body;
    if (!submission || !submission.culpritId) {
      return res.status(400).json({ error: 'Invalid accusation submission' });
    }

    const result = CaseEvaluator.evaluate(CASE_001, submission);
    return res.json({ result });
  } catch (err) {
    console.error('Accusation error:', err);
    return res.status(500).json({ error: 'Failed to evaluate accusation' });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    game: 'AI Detective: Who Is Lying?',
    geminiActive: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Detective Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
