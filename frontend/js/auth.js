// Handle Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    if (!username) return;

    const users = JSON.parse(localStorage.getItem("scibber-users") || "[]");

    if (users.includes(username)) {
      document.getElementById("signupMsg").textContent = "Username already exists!";
    } else {
      users.push(username);
      localStorage.setItem("scibber-users", JSON.stringify(users));
      localStorage.setItem("scibber-session", username);
      window.location.href = "home.html";
    }
  });
}

// Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    if (!username) return;

    const users = JSON.parse(localStorage.getItem("scibber-users") || "[]");

    if (users.includes(username)) {
      localStorage.setItem("scibber-session", username);
      window.location.href = "home.html";
    } else {
      document.getElementById("loginMsg").textContent = "User not found. Please sign up.";
    }
  });
}

// Logout function (used on home page later)
function logoutUser() {
  localStorage.removeItem("scibber-session");
  window.location.href = "index.html";
}
