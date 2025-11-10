// Floating chatbot open/close logic
const openChatBtn = document.getElementById("openChat");
const closeChatBtn = document.getElementById("closeChat");
const chatbot = document.getElementById("chatbot");
const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

openChatBtn.addEventListener("click", () => chatbot.style.display = "flex");
closeChatBtn.addEventListener("click", () => chatbot.style.display = "none");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if(e.key === "Enter") sendMessage(); });

async function sendMessage() {
  const text = userInput.value.trim();
  if(!text) return;
  appendMessage("user", text);
  userInput.value = "";
  const res = await fetch("http://localhost:5000/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  appendMessage("bot", data.summary || "Sorry, I couldn’t respond.");
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.classList.add(sender === "user" ? "user-msg" : "bot-msg");
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}
