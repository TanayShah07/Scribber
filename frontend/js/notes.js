const openAdd = document.getElementById("openAdd");
const modal = document.getElementById("noteModal");
const saveNote = document.getElementById("saveNote");
const cancelNote = document.getElementById("cancelNote");
const titleInput = document.getElementById("noteTitle");
const bodyInput = document.getElementById("noteBody");
const notesList = document.getElementById("notesList");

let editId = null;

openAdd.addEventListener("click", () => {
  modal.style.display = "flex";
  titleInput.value = "";
  bodyInput.value = "";
  editId = null;
  document.getElementById("modalTitle").textContent = "Add Note";
});

cancelNote.addEventListener("click", () => { modal.style.display = "none"; });

saveNote.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title || !body) return alert("Please fill all fields");
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  if (editId) {
    const idx = notes.findIndex(n => n.id === editId);
    notes[idx] = { ...notes[idx], title, body };
  } else {
    notes.unshift({ id: Date.now(), title, body, createdAt: new Date().toISOString() });
  }
  localStorage.setItem("scibber-notes", JSON.stringify(notes));
  modal.style.display = "none";
  renderNotes();
});

function renderNotes() {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  if (!notes.length) {
    notesList.innerHTML = `<p>No notes yet. Click the + to add one.</p>`;
    return;
  }
  notesList.innerHTML = notes.map(n => `
    <div class="note-card" data-id="${n.id}">
      <h3>${n.title}</h3>
      <p>${n.body}</p>
      <small>${new Date(n.createdAt).toLocaleString()}</small>
      <div class="note-actions">
        <button class="edit" onclick="editNote(${n.id})">Edit</button>
        <button class="delete" onclick="deleteNote(${n.id})">Delete</button>
        <button class="summarize" onclick="summarizeNote(${n.id})">AI Summarize</button>
      </div>
      <div class="summary" id="summary-${n.id}"></div>
    </div>
  `).join('');
}

function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem("scibber-notes", JSON.stringify(notes));
  renderNotes();
}

function editNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find(n => n.id === id);
  if (!note) return;
  modal.style.display = "flex";
  titleInput.value = note.title;
  bodyInput.value = note.body;
  editId = id;
  document.getElementById("modalTitle").textContent = "Edit Note";
}

async function summarizeNote(id) {
  const notes = JSON.parse(localStorage.getItem("scibber-notes") || "[]");
  const note = notes.find(n => n.id === id);
  if (!note) return;
  const summaryDiv = document.getElementById(`summary-${id}`);
  summaryDiv.textContent = "Summarizing...";
  const res = await fetch("http://localhost:5000/summarize", {
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ text: note.body })
  });
  const data = await res.json();
  summaryDiv.textContent = data.summary ? `Summary: ${data.summary}` : "Error summarizing";
}

renderNotes();
