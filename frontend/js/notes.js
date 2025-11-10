// === ELEMENT REFERENCES ===
const openAdd = document.getElementById("openAdd");
const modal = document.getElementById("noteModal");
const saveNote = document.getElementById("saveNote");
const cancelNote = document.getElementById("cancelNote");
const titleInput = document.getElementById("noteTitle");
const bodyInput = document.getElementById("noteBody");
const notesList = document.getElementById("notesList");
const themeToggle = document.getElementById("themeToggle");
const viewModal = document.getElementById("viewModal");
const closeView = document.getElementById("closeView");

let editId = null;

// === THEME TOGGLE ===
const currentTheme = localStorage.getItem("scibber-theme") || "light";
document.body.classList.toggle("dark", currentTheme === "dark");
if (themeToggle)
  themeToggle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const newTheme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("scibber-theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
  });
}

// === ADD NOTE ===
openAdd.addEventListener("click", () => {
  modal.style.display = "flex";
  modal.classList.add("fade-in");
  titleInput.value = "";
  bodyInput.value = "";
  editId = null;
  document.getElementById("modalTitle").textContent = "Add Note";
});

// === CANCEL NOTE MODAL ===
cancelNote.addEventListener("click", () => {
  modal.classList.remove("fade-in");
  setTimeout(() => (modal.style.display = "none"), 150);
});

// === SAVE NOTE ===
saveNote.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title || !body) return alert("Please fill all fields");

  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");

  if (editId) {
    const idx = notes.findIndex((n) => n.id === editId);
    notes[idx] = { ...notes[idx], title, body };
  } else {
    notes.unshift({
      id: Date.now(),
      title,
      body,
      createdAt: new Date().toISOString(),
    });
  }

  localStorage.setItem("scibber-notes", JSON.stringify(notes));
  modal.classList.remove("fade-in");
  setTimeout(() => (modal.style.display = "none"), 150);
  renderNotes(true);
});

// === RENDER NOTES ===
function renderNotes(animate = false) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  if (!notes.length) {
    notesList.innerHTML = `<p>No notes yet. Click the + to add one.</p>`;
    return;
  }

  // 🧱 Generate notes dynamically
  notesList.innerHTML = notes
    .map(
      (n) => `
    <div class="note-card ${animate ? "fade-in" : ""}" data-id="${n.id}">
      <h3>${n.title}</h3>
      <p>${n.body}</p>
      <small>${new Date(n.createdAt).toLocaleString()}</small>

      <div class="note-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
        <button class="summarize">AI Summarize</button>
        <button class="view">View</button>
      </div>

      <div class="summary" id="summary-${n.id}"></div>
    </div>
  `
    )
    .join("");

  // 🧩 Attach button listeners dynamically after rendering
  document.querySelectorAll(".edit").forEach((btn, index) => {
    btn.addEventListener("click", () => editNote(notes[index].id));
  });

  document.querySelectorAll(".delete").forEach((btn, index) => {
    btn.addEventListener("click", () => deleteNote(notes[index].id));
  });

  document.querySelectorAll(".summarize").forEach((btn, index) => {
    btn.addEventListener("click", () => summarizeNote(notes[index].id));
  });

  document.querySelectorAll(".view").forEach((btn, index) => {
    btn.addEventListener("click", () => viewNote(notes[index].id));
  });
}

// === DELETE NOTE ===
function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  notes = notes.filter((n) => n.id !== id);
  localStorage.setItem("scibber-notes", JSON.stringify(notes));
  renderNotes();
}

// === EDIT NOTE ===
function editNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  modal.style.display = "flex";
  modal.classList.add("fade-in");
  titleInput.value = note.title;
  bodyInput.value = note.body;
  editId = id;
  document.getElementById("modalTitle").textContent = "Edit Note";
}

// === AI SUMMARIZE (backend connected) ===
async function summarizeNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  const summaryDiv = document.getElementById(`summary-${id}`);
  summaryDiv.textContent = "✨ Summarizing using AI...";

  try {
    const response = await fetch("http://localhost:5000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: note.body }),
    });

    const data = await response.json();

    if (data.summary) {
      summaryDiv.textContent = `🧠 Summary: ${data.summary}`;
    } else {
      summaryDiv.textContent = "⚠️ Failed to summarize. Try again.";
    }
  } catch (error) {
    summaryDiv.textContent = "❌ Error connecting to AI.";
    console.error("Error summarizing note:", error);
  }
}

// === VIEW NOTE ===
function viewNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  document.getElementById("viewTitle").textContent = note.title;
  document.getElementById("viewBody").textContent = note.body;
  document.getElementById(
    "viewDate"
  ).textContent = `Created on: ${new Date(note.createdAt).toLocaleString()}`;

  const summaryDiv = document.getElementById(`summary-${id}`);
  const summaryText =
    summaryDiv && summaryDiv.textContent
      ? summaryDiv.textContent
      : "No summary available yet.";
  document.getElementById("viewSummary").textContent = summaryText;

  viewModal.style.display = "flex";
  viewModal.classList.add("fade-in");
}

closeView.addEventListener("click", () => {
  viewModal.classList.remove("fade-in");
  setTimeout(() => (viewModal.style.display = "none"), 150);
});

// === INITIAL RENDER ===
renderNotes();
