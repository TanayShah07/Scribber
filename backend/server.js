import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 FINAL CORS FIX (MANUAL — GUARANTEED WORKING)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models
const primaryModel = "gemini-2.5-flash";
const fallbackModel = "gemini-1.5-pro-latest";

// 🔁 Retry + fallback logic
async function generateWithRetry(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const model = genAI.getGenerativeModel({ model: primaryModel });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      const msg = error.message || String(error);

      // Retry if overloaded
      if (msg.includes("503") && i < retries - 1) {
        console.log(`⚠️ Retry ${i + 1}/${retries}...`);
        await new Promise((res) => setTimeout(res, 2000));
      }
      // Fallback model
      else if (msg.includes("503")) {
        console.log("🚨 Switching to fallback model...");
        const backup = genAI.getGenerativeModel({ model: fallbackModel });
        const backupRes = await backup.generateContent(prompt);
        return backupRes.response.text();
      } else {
        throw error;
      }
    }
  }
}

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Scribber Backend Running!");
});

// 🧠 Summarization Route
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "No text provided." });
    }

    const prompt = `Summarize this text in 2-3 sentences:\n\n${text}`;
    const summary = await generateWithRetry(prompt);

    res.status(200).json({ summary });
  } catch (error) {
    console.error("❌ Summarize error:", error.message);
    res.status(500).json({ error: "Summarization failed." });
  }
});

// 💬 Chat Route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "No message provided." });
    }

    const reply = await generateWithRetry(message);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Chat error:", error.message);
    res.status(500).json({ error: "Chat failed." });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(
    "🌱 API:",
    process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing"
  );
});