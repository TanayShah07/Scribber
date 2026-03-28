// === BASE URL (IMPORTANT) ===
const BASE_URL = "https://scribber-qxvl.onrender.com";

// === Floating Chatbot Open/Close Logic ===
const openChatBtn = document.getElementById("openChat");
const closeChatBtn = document.getElementById("closeChat");
const chatbot = document.getElementById("chatbot");
const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// --- Open Chat ---
openChatBtn.addEventListener("click", () => {
  chatbot.style.display = "flex";
  chatbot.classList.add("fade-in");
});

// --- Close Chat ---
closeChatBtn.addEventListener("click", () => {
  chatbot.classList.remove("fade-in");
  setTimeout(() => (chatbot.style.display = "none"), 150);
});

// --- Send Message ---
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// === SEND MESSAGE TO BACKEND ===
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage("user", text);
  userInput.value = "";

  try {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();

    if (data.reply) {
      appendMessage("bot", data.reply);
    } else {
      appendMessage("bot", "⚠️ No response from AI");
    }
  } catch (error) {
    console.error("Chat error:", error);
    appendMessage("bot", "❌ Error connecting to AI");
  }

  chatBody.scrollTop = chatBody.scrollHeight;
}

// === APPEND MESSAGE ===
function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add(sender === "user" ? "user-msg" : "bot-msg");
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}