// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZojSg3KU0ba3XbwjWAxdNb8yoAp0tG1Y",
  authDomain: "edencrest-1c056.firebaseapp.com",
  projectId: "edencrest-1c056",
  storageBucket: "edencrest-1c056.firebasestorage.app",
  messagingSenderId: "254496276391",
  appId: "1:254496276391:web:5604569f601782d6c04082",
  measurementId: "G-J04MG4TNT3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Scroll cards (moved from main.js) ─────────────────────────────
window.scrollCards = function(direction) {
  const loader = document.getElementById('reviewLoader');
  loader.scrollBy({ left: direction * 320, behavior: 'smooth' });
};

// ── Shared submit handler ──────────────────────────────────────────
async function submitBooking(formEl, btnEl) {
  const name  = formEl.querySelector('[id$="name"]').value.trim();
  const email = formEl.querySelector('[id$="email"]').value.trim();
  const phone = formEl.querySelector('[id$="phone"]').value.trim();
  const date  = formEl.querySelector('[id$="date"]').value;

  // Basic validation
  if (!name || !email || !phone || !date) {
    btnEl.textContent = "Please fill all fields.";
    btnEl.style.background = "#c0392b";
    setTimeout(() => {
      btnEl.textContent = "Book Visit";
      btnEl.style.background = "";
    }, 2000);
    return;
  }

  btnEl.textContent = "Submitting...";
  btnEl.disabled = true;

  try {
    await addDoc(collection(db, "bookings"), {
      name,
      email,
      phone,
      date,
      submittedAt: serverTimestamp()
    });

    btnEl.textContent = "✓ Booked! We'll call you soon.";
    btnEl.style.background = "#3a4d28";

    setTimeout(() => {
      document.getElementById("popupOverlay")?.classList.remove("active");
      btnEl.textContent = "Book Visit";
      btnEl.style.background = "";
      btnEl.disabled = false;
      formEl.reset();
    }, 3000);

  } catch (err) {
    console.error("Firestore error:", err);
    btnEl.textContent = "Something went wrong. Try again.";
    btnEl.style.background = "#c0392b";
    btnEl.disabled = false;

    setTimeout(() => {
      btnEl.textContent = "Book Visit";
      btnEl.style.background = "";
    }, 3000);
  }
}

// ── Wire up everything after DOM loads ────────────────────────────
window.addEventListener("load", () => {

  // Hero "Book Your Site Visit" → open popup
  document.getElementById("bookVisit").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("popupOverlay").classList.add("active");
  });

  // Close popup via X button
  document.getElementById("popupClose").addEventListener("click", () => {
    document.getElementById("popupOverlay").classList.remove("active");
  });

  // Close popup by clicking backdrop
  document.getElementById("popupOverlay").addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("active");
  });

  // Popup form → Firestore
  document.getElementById("popup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitBooking(e.target, e.target.querySelector("button"));
  });

  // Bottom contact section form → Firestore
  document.getElementById("visit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitBooking(e.target, e.target.querySelector("button"));
  });

});