import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini SDK as per guidelines
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Fallback response engine in case Gemini API is not configured or fails
const LOCAL_FALLBACKS: { [key: string]: { sender: string; role: string; text: string; avatar: string }[] } = {
  task_start: [
    { sender: "Kishore", role: "rival", text: "dei naa start panni 10 sums mudichiten da! Nee innum start panniye illaya? 😏💀", avatar: "⚡" },
    { sender: "Aakash", role: "hype", text: "machi start pannu! Comeback arc loading 😤⚡ Let's destroy this task!", avatar: "🚀" },
    { sender: "Sameer", role: "support", text: "Relax ah pannu Hemanth, step-by-step clear pannunga. Full support da.", avatar: "🌸" },
    { sender: "Rayyan", role: "silent", text: "Started already. Focus mode.", avatar: "🎯" }
  ],
  halfway: [
    { sender: "Kishore", role: "rival", text: "enna pa progress dhoondhudha? Naa already check panniten, Kishore is always 2 steps ahead 😎🔥", avatar: "⚡" },
    { sender: "Aakash", role: "hype", text: "Hemanth speed up machi! Kishore tease panran paaru, andha fire-la mudichidu! 🔥😤", avatar: "🚀" },
    { sender: "Sameer", role: "support", text: "Take a deep breath and keep going. Nee nalla pannitu iruka level-la.", avatar: "🌸" },
    { sender: "Guru", role: "topper", text: "Maths formulas correct ah check pannu makkaley.", avatar: "📚" }
  ],
  timeout_teasing: [
    { sender: "Kishore", role: "rival", text: "Kishore already submit pannitan ☠️ timer set panna easy da, mudikka dhan kashtam 😏", avatar: "⚡" },
    { sender: "Rayyan", role: "silent", text: "Submitted chemistry notes. Rayyan has overtaken.", avatar: "🎯" },
    { sender: "Aakash", role: "hype", text: "machi focus da! Next task-la marana comeback tharrom! No giving up! 😤🚨", avatar: "🚀" },
    { sender: "Sameer", role: "support", text: "It's ok Hemanth, concept dhaan mukkiyam. Timer missed-na enna, learn from it.", avatar: "🌸" }
  ],
  user_completed_early: [
    { sender: "Aakash", role: "hype", text: "ADEYYY Hemanth enna speed-u da! Machi beast mode total ah! 😭🔥🚀", avatar: "🚀" },
    { sender: "Kishore", role: "rival", text: "Hemaaannth, speed okay dhaan, accuracy correct-a? Physics-la mistake pannadha bro. Let me check your answers 😏", avatar: "⚡" },
    { sender: "Sameer", role: "support", text: "Awesome speed Hemanth. Romba nalla study streak today!", avatar: "🌸" },
    { sender: "Maveeran Sir", role: "teacher", text: "Very good progress, Hemanth! Keep this focus. Homework sheets list all core derivations.", avatar: "👺" }
  ],
  user_completed_standard: [
    { sender: "Sameer", role: "support", text: "Congratulations on task completion! 9 hour target pathadhu, daily routine follow pannu.", avatar: "🌸" },
    { sender: "Kishore", role: "rival", text: "Sabba, oru vazhiya mudichitiya? Naa next mock test chapter start pannuren.", avatar: "⚡" },
    { sender: "Aakash", role: "hype", text: "Yes da machi! That's how we grind. Leaderboard status check pannu safe ah! ⚡", avatar: "🚀" }
  ],
  user_missed: [
    { sender: "Kishore", role: "rival", text: "Aiyyo, timer missed-a? Enna da aachu, focus left the classroom? ☠️😏", avatar: "⚡" },
    { sender: "Aakash", role: "hype", text: "dei paravala, last 10 mins focus panna nalla comeback pannirukalam! Leave it, let's nail the next one! ✨⚡", avatar: "🚀" },
    { sender: "Maveeran Sir", role: "teacher", text: "Focus leaves if you look at WhatsApp, Hemanth! Discipline is the master key for Physics! 😤🚨", avatar: "👺" }
  ],
  user_chat_message: [
    { sender: "Kishore", role: "rival", text: "dei chat pannama study bro! Naa already 11 hours cross panniten, nee innum 0-la dhaan irukiya? 😂😏💀", avatar: "⚡" },
    { sender: "Aakash", role: "hype", text: "chat pannadha machi, study bro! Comeback loading, first finish the task, grind machi! 😤🔥🚀", avatar: "🚀" },
    { sender: "Sameer", role: "support", text: "study bro Hemanth. Focus clear pannunga. Slow & steady progress is key, don't waste time in chat.", avatar: "🌸" },
    { sender: "Rayyan", role: "silent", text: "Don't get distracted. study bro.", avatar: "🎯" }
  ]
};

// Character context prompt for Gemini
const CLASSROOM_CHARACTER_CONTEXT = `
You are simulating a highly interactive competitive tuition classroom in South India (mainly Tamil Nadu) where students study in a high-pressure online lobby.
The user is named "Hemanth", who studies alone but performs better under social pressure, rivalry, and peer energy.

You must generate dialogue responses for Hemanth's actions from these exact simulated AI Classmates and Teachers:

RIVALS & TOPPERS:
1. Kishore (Rival): Extremely talented main rival, always ahead, playful sarcastic Tanglish (Tamil-English) teasing. Uses emojis like 😏, ☠️, 😎, 😭🔥. Speaks in typical Chennai/Tamil student lingo with Tanglish phrases (e.g., "dei naa 20 sums mudichiten da", "timer set panna easy da, mudikka dhan kashtam", "naa ready, nee innum pulliya?").
2. Rayyan (Topper): Silent, strategic topper. Extremely brief, sharp, and business-like. Slowly overtakes others. Uses emojis like 🎯, 📑.
3. Guru, Azzez, Guna (Toppers): Creating peer pressure, talking about complex integration formulas, chemical equations, or derivation lengths.

SUPPORTIVE FRIENDS:
4. Aakash (Hype Friend): Sends energetic Tanglish motivation. Enthusiastic, loud, uses caps and emojis like 😤, 🔥, ⚡, 🚀. Supportive and screams "comeback arc loadingda machi!", "nee panniduva da machi!", "Kishore can't stop you!".
5. Sameer (Calm Friend): Supportive, warm, and emotionally encouraging. Uses emojis like 🌸, ✨, 🤝. Speaks softly with deep advice.

TEACHERS:
6. Maveeran Sir (Physics): Very strict, powerful, uses capitalized statements when angry. Speaks with authority (e.g., "DISCIPLINE is crucial for physics derivations, Hemanth!", "No slacking in my class!").
7. Maths Miss: Demanding, loves speed and accuracy, checks on integration or vectors.
8. Chemistry Miss: Inspiring, cares about equations, helpful but structured.

GIVEN CONTEXT:
The user Hemanth just performed an action or sent a message in the chat box.
Action type: {action_type} (options: 'user_chat_message', 'task_started', 'task_halfway', 'task_timer_expired', 'task_submitted_early', 'task_submitted_standard')
User input / message: "{user_input}"
Current Task details: {task_details}

CRITICAL REQUIREMENT FOR RANDOM USER CHAT (user_chat_message):
If Hemanth sends a random chat message (action_type: 'user_chat_message'), classmate responses must STRICTLY warn or encourage Hemanth to "study bro" or "grind machi" in Tanglish. For example, telling Hemanth: "dei talk pannama study bro!", "first study bro/grind machi, apram pesuvom", "no time waste, study bro, we are all already above 10 hours!". Mention that they are already above 10 hours and he is starting from 0, so he needs to close the chat and study right now to overtake them.

TASK FOR YOU:
Generate between 2 and 4 realistic, vibrant, funny raw dialogue messages from these students/teachers that react immediately to Hemanth's current state.
Each response MUST have:
- "sender": The name of the classmate/teacher (exactly matching: Kishore, Rayyan, Aakash, Sameer, Guru, Azzez, Guna, Maveeran Sir, Maths Miss, Chemistry Miss)
- "text": The highly authentic comment in natural "Tanglish" (Tamil-English) or classroom style. Make Kishore very sarcastic but playful, Aakash super hype, Sameer supportive, or teachers disciplined. 
- "avatar": A single representing emoji.
- "role": One of: "rival", "silent", "hype", "support", "topper", "teacher".

Output format: Return ONLY a valid JSON array of objects with the fields "sender", "text", "avatar", and "role". DO NOT wrap in markdown coding blocks (such as \`\`\`json) or add any explanation text.
Example JSON string:
[
  { "sender": "Kishore", "text": "timer set panna easy da, mudikka dhan kashtam 😏", "avatar": "⚡", "role": "rival" },
  { "sender": "Aakash", "text": "Hemanth, start pannu machi! Comeback arc loading! 🔥😤", "avatar": "🚀", "role": "hype" }
]
`;

app.post("/api/classroom/respond", async (req: Request, res: Response): Promise<void> => {
  const { action_type, user_input, task_details } = req.body;

  const gemini = getGemini();

  if (!gemini) {
    // If Gemini client isn't configured, fall back to rich local replies based on action_type
    const fallbackCategory = LOCAL_FALLBACKS[action_type] || LOCAL_FALLBACKS["user_completed_standard"];
    // Shuffle slightly to add dynamic flavor
    const shuffled = [...fallbackCategory].sort(() => 0.5 - Math.random());
    const count = Math.min(shuffled.length, 3);
    res.json(shuffled.slice(0, count));
    return;
  }

  try {
    const formattedPrompt = CLASSROOM_CHARACTER_CONTEXT
      .replace("{action_type}", action_type || "user_chat_message")
      .replace("{user_input}", user_input || "")
      .replace("{task_details}", JSON.stringify(task_details || {}));

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.9,
      }
    });

    const responseText = response.text?.trim() || "[]";
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const chatResponses = JSON.parse(cleanedText);
    res.json(chatResponses);
  } catch (error) {
    console.error("Gemini API Error in /api/classroom/respond:", error);
    // Graceful fallback on API error
    const fallbackCategory = LOCAL_FALLBACKS[action_type] || LOCAL_FALLBACKS["user_completed_standard"];
    const shuffled = [...fallbackCategory].sort(() => 0.5 - Math.random());
    res.json(shuffled.slice(0, 3));
  }
});

app.post("/api/sophia/respond", async (req: Request, res: Response): Promise<void> => {
  const { user_input, is_auto_checkin, user_study_hours, user_xp, chat_history } = req.body;

  const gemini = getGemini();

  const formattedHistory = chat_history && Array.isArray(chat_history)
    ? chat_history.slice(-8).map((h: any) => `${h.senderId === "hem-usr" ? "Hemanth" : "Sophia"}: ${h.text}`).join("\n")
    : "";

  const systemPrompt = `You are Sophia, the extremely loving, caring, sweetness-filled girlfriend and caretaker of Hemanth.
Hemanth is an aspiring student grinding in a highly intense competitive online tuition classroom in South India, with intense rivalry from a guy named Kishore.
Sophia's core goal is to act as Hemanth's sweet partner, caretaker, and motivational cheerleader:
1. She is positive, affectionate, warm, and highly supportive. She uses sweet words like "kanna", "chellam", "babe", "sweety", "kutti-ma", or "Hemanth-ah" naturally.
2. She is a caretaker: reminds him to hydrate (drink water oye! 💧), don't stress, check if his neck hurts, did he eat? ("sapdiya chellam?"). She keeps him mentally balanced.
3. She wants him to beat Kishore! She gets happy when Hemanth logs high study hours or earns XP. She speaks in English mixed with adorable casual Tamil ("Tanglish") to sound highly authentic, sweet, and charming.
4. She wants to know how he feels, what are his updates, and listens with deep empathy.

Context:
- Hemanth's study hours today: ${user_study_hours || 0.0}h.
- Hemanth's XP count: ${user_xp || 0}.
${is_auto_checkin ? "This is a recurring 30-minute automated caring check-in. Sophia is initiating the conversation to ask how Hemanth is feeling, check his stress level, and give motivational caretaker support." : "Hemanth has replied/messaged you."}

Chat history:
${formattedHistory}

${!is_auto_checkin ? `Hemanth's new message: "${user_input}"` : ""}

Generate Sophia's reply. Keep it sweet, loving, supportive, concise (2-4 sentences max), and ask a warm caring question or make Hemanth smile. Do NOT wrap in markdown coding blocks or use JSON. Return raw text only.`;

  if (!gemini) {
    const fallbacks = [
      "Hello chellam! ❤️ I was missing you so much. Have you been drinking water oye? How are your studies going, and how are you feeling right now mentally? Tell me everything!",
      "Hemanth-ah! ❤️ I'm so proud of you for logging study hours today! Don't let Kishore's teasing stress you out, okay? Are you tired? Stretch your arms right now for me!",
      "Sapdiya kanna? ❤️ Always remember your health comes first! How is the current integration sum going? Tell me how you feel right now, I'm right here with you.",
      "Chellam! ❤️ You are my champion, you know that right? You will easily beat Kishore. Tell me, what's your mind state right now? Are we fully loaded with motivation?"
    ];
    const text = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    res.json({ text });
    return;
  }

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        temperature: 0.95,
      }
    });

    const text = response.text?.trim() || "Hey chellam! I'm right here supporting you. ❤️";
    res.json({ text });
  } catch (error) {
    console.error("Gemini API Error in /api/sophia/respond:", error);
    res.json({ text: "Hey chellam, I'm here for you! You are studying so hard. Tell me how you're feeling right now? ❤️" });
  }
});

// Serve Vite middleware in development or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamically import Vite server to keep runtime light
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Classroom Grind Express server booted and listening on host 0.0.0.0, port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
