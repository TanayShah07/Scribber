import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- ES Module setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from parent folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// --- Express setup ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(
  cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// --- ✅ Initialize Gemini Client ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Primary (fastest) model
const primaryModel = "gemini-2.5-flash";
// Fallback (very stable) model
const fallbackModel = "gemini-1.5-pro-latest";

// --- Helper: Generate response with auto-retry and fallback ---
async function generateWithRetry(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const model = genAI.getGenerativeModel({ model: primaryModel });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      const msg = error.message || String(error);
      if (msg.includes("503") && i < retries - 1) {
        console.log(`⚠️ Gemini overloaded (attempt ${i + 1}/${retries})... retrying in 2s`);
        await new Promise((res) => setTimeout(res, 2000));
      } else if (msg.includes("503")) {
        console.log("🚨 Primary model down — switching to fallback model...");
        const backup = genAI.getGenerativeModel({ model: fallbackModel });
        const backupRes = await backup.generateContent(prompt);
        return backupRes.response.text();
      } else {
        throw error;
      }
    }
  }
}

// --- Health check ---
app.get("/", (req, res) => {
  res.send("✅ Scribber (Gemini AI) Backend running successfully!");
});

// --- 🧠 AI Summarization Route ---
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("🧾 Summarizing text:", text?.slice(0, 60) + "...");

    if (!text || text.trim() === "")
      return res.status(400).json({ error: "No text provided for summarization." });

    const prompt = `Summarize this text clearly and concisely in 2–3 sentences:\n\n${text}`;
    const summary = await generateWithRetry(prompt);

    console.log("✅ Summary generated successfully!");
    res.status(200).json({ summary });
  } catch (error) {
    console.error("❌ Summarization error:", error.message || error);
    res.status(500).json({ error: "Error summarizing text. Please try again later." });
  }
});

// --- 💬 AI Chat Route ---
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("💬 User message:", message);

    if (!message || message.trim() === "")
      return res.status(400).json({ error: "No message provided." });

    const reply = await generateWithRetry(message);
    console.log("🤖 Gemini reply:", reply);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Chat error:", error.message || error);
    res.status(500).json({ error: "Error chatting with AI. Please try again later." });
  }
});

// --- Serve frontend (optional for deployment) ---
const clientPath = path.join(__dirname, "../frontend");
app.use(express.static(clientPath));

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Scribber (Gemini AI) backend running on http://localhost:${PORT}`);
  console.log(
    "🌱 Environment:",
    process.env.GEMINI_API_KEY ? "✅ Gemini API Key Loaded" : "❌ Missing Gemini API Key"
  );
});
