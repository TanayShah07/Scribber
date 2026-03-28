// === BASE URL (IMPORTANT) ===
const BASE_URL = "https://scribber-qxvl.onrender.com";

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

// === CANCEL ===
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
  modal.style.display = "none";
  renderNotes(true);
});

// === RENDER NOTES ===
function renderNotes(animate = false) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");

  if (!notes.length) {
    notesList.innerHTML = `<p>No notes yet. Click + to add one.</p>`;
    return;
  }

  notesList.innerHTML = notes
    .map(
      (n) => `
    <div class="note-card ${animate ? "fade-in" : ""}">
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

  document.querySelectorAll(".edit").forEach((btn, i) =>
    btn.addEventListener("click", () => editNote(notes[i].id))
  );

  document.querySelectorAll(".delete").forEach((btn, i) =>
    btn.addEventListener("click", () => deleteNote(notes[i].id))
  );

  document.querySelectorAll(".summarize").forEach((btn, i) =>
    btn.addEventListener("click", () => summarizeNote(notes[i].id))
  );

  document.querySelectorAll(".view").forEach((btn, i) =>
    btn.addEventListener("click", () => viewNote(notes[i].id))
  );
}

// === DELETE ===
function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  notes = notes.filter((n) => n.id !== id);
  localStorage.setItem("scibber-notes", JSON.stringify(notes));
  renderNotes();
}

// === EDIT ===
function editNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find((n) => n.id === id);

  modal.style.display = "flex";
  titleInput.value = note.title;
  bodyInput.value = note.body;
  editId = id;
}

// === AI SUMMARIZE ===
async function summarizeNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find((n) => n.id === id);

  const summaryDiv = document.getElementById(`summary-${id}`);
  summaryDiv.textContent = "✨ Summarizing...";

  try {
    const res = await fetch(`${BASE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: note.body }),
    });

    const data = await res.json();
    summaryDiv.textContent = data.summary || "Error summarizing";
  } catch (err) {
    summaryDiv.textContent = "❌ Server error";
  }
}

// === VIEW NOTE ===
function viewNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find((n) => n.id === id);

  document.getElementById("viewTitle").textContent = note.title;
  document.getElementById("viewBody").textContent = note.body;
  document.getElementById("viewDate").textContent =
    new Date(note.createdAt).toLocaleString();

  const summary = document.getElementById(`summary-${id}`).textContent;
  document.getElementById("viewSummary").textContent =
    summary || "No summary available";

  viewModal.style.display = "flex";
}

// === CLOSE VIEW ===
closeView.addEventListener("click", () => {
  viewModal.style.display = "none";
});

// === INIT ===
renderNotes();