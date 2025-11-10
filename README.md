<div align="center">
  <img src="./frontend/assets/logo.png" alt="Scribber Logo" width="120" />

  # ✨ Scribber — Smart AI Note Assistant
  <p>
    A modern, AI-powered note-taking web app built using <b>HTML, CSS, JavaScript, Express.js</b>, and <b>Gemini API</b>.  
    Create, summarize, and chat with your AI assistant — all in one beautifully designed workspace.
  </p>
</div>

---

## 🚀 Overview

**Scribber** is your intelligent notebook —  
It lets you write, organize, and summarize your notes using **Google’s Gemini AI**.  
You can also **chat with the AI** in real time, ask questions about your notes, or brainstorm ideas.  

Whether you’re a student or developer, Scribber helps you keep your thoughts structured and smarter.

---

## 🧠 Features

✅ **Create, Edit, and Delete Notes**  
Keep all your notes organized neatly with timestamps.  

✅ **AI Summarization**  
Get instant 2–3 sentence summaries of long notes using Gemini AI.  

✅ **AI Chat Assistant**  
Talk to an AI right inside the app — for ideas, rewording, or learning help.  

✅ **View Notes in Detail**  
Open any note in a modal with full content and its AI summary.  

✅ **Light & Dark Mode**  
Seamlessly switch themes to suit your mood or workspace.  

✅ **Offline Local Storage**  
All notes are stored locally — no signup or backend DB needed.  

---

## 🧩 Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript  
- LocalStorage for data persistence  
- Responsive & modern UI with theme toggle  

**Backend:**
- Node.js + Express.js  
- Google Gemini API for AI responses  
- CORS & dotenv for secure API usage  

**AI Model Used:**  
`gemini-2.5-flash` (with fallback to `gemini-1.5-pro-latest`)

---

## ⚙️ Installation & Setup

### 🪄 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/scribber.git
cd scribber

```

### 🪄 2️⃣ Install dependencies
```bash
cd backend
npm install

```

### 🔐 3️⃣ Create a .env file in the root folder
```
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000

```

### ▶️ 4️⃣ Run the backend server
```
cd backend
node server.js

```

### 🌐 5️⃣ Open the frontend
```
Simply open:
frontend/home.html
💡 Tip: Use VSCode Live Server for best experience.

```

### 🗂️ Folder Structure
```
Scribber/
│
├── .env                              # Gemini API key & environment config
│
├── backend/
│   ├── server.js                     # Express.js + Gemini AI backend logic
│   ├── package.json                  # Backend dependencies
│   ├── package-lock.json             # Dependency lock file
│
├── frontend/
│   ├── assets/
│   │   └── logo.png                  # Scribber logo
│   │
│   ├── css/
│   │   ├── styles.css                # Shared global styles
│   │   ├── home.css                  # Homepage styling
│   │   └── notes.css                 # Notes page styling
│   │
│   ├── js/
│   │   ├── auth.js                   # Handles signup/login/logout logic
│   │   ├── home.js                   # Home page interactions & chatbot
│   │   └── notes.js                  # Notes CRUD, AI summarize & view logic
│   │
│   ├── signup.html                   # Signup & login page
│   ├── home.html                     # Homepage (chatbot + navigation)
│   └── notes.html                    # My Notes page (AI summarize + view)
│
└── README.md                         # Project documentation

```

### 💡 How It Works
Notes are stored locally using LocalStorage.

AI Summarization and Chat features send data to the Express backend (server.js).

The backend connects to Google Gemini API to process and respond.

Smooth animations and dark/light modes make the experience modern and intuitive.

### 🤝 Contribution

Want to improve Scribber?
Fork this repo, make your changes, and submit a pull request.
Suggestions, bug fixes, and feature ideas are always welcome!
