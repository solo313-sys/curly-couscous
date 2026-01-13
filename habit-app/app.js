/* ========= Habits ========= */
const habits = [
  { id: "skin", name: "🧖‍♀️ Skin Care" },
  { id: "plan", name: "📝 Plan Tomorrow" },
  { id: "learn", name: "📚 Learn" },
  { id: "meal", name: "🥕 Eat a Healthy Meal" },
  { id: "calis", name: "🏃‍♂️ Calisthenics" },
  { id: "read", name: "📖 Read a Book" },
  { id: "walk", name: "🚶‍♂️ Go for a Walk" },
];

const habitsDiv = document.getElementById("habits");
const totalSpan = document.getElementById("total");
const calendarDiv = document.getElementById("calendar");
const currentDateDiv = document.getElementById("currentDate");
const dailyProgressDiv = document.getElementById("dailyProgress");

/* ========= Dates ========= */
let selectedDate = new Date();
const minDate = new Date("2024-01-01");
const maxDate = new Date("2027-12-31");

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

/* ========= Calendar ========= */
function renderCalendar() {
  calendarDiv.innerHTML = "";

  for (let i = -3; i <= 3; i++) {
    const d = new Date(selectedDate);
    d.setDate(selectedDate.getDate() + i);

    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dayNum = d.getDate();
    const savedProgress =
      localStorage.getItem("progress-" + dateKey(d)) || 0;

    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = `
      <div>${dayName}</div>
      <div>${dayNum}</div>
      <small>${savedProgress}%</small>
    `;

    if (dateKey(d) === dateKey(selectedDate)) {
      div.classList.add("active");
    }

    div.onclick = () => {
      selectedDate = d;
      renderAll();
    };

    calendarDiv.appendChild(div);
  }

  currentDateDiv.textContent =
    selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
}

/* ========= Habits ========= */
function renderHabits() {
  habitsDiv.innerHTML = "";
  let completed = 0;

  habits.forEach(habit => {
    const key = habit.id + "-" + dateKey(selectedDate);
    const done = localStorage.getItem(key) === "yes";
    if (done) completed++;

    const div = document.createElement("div");
    div.className = "habit" + (done ? " done" : "");

    const span = document.createElement("span");
    span.textContent = habit.name;

    const btn = document.createElement("button");
    btn.textContent = done ? "✔️" : "⭕";

    btn.onclick = () => {
      if (done) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, "yes");
      }
      renderAll();
    };

    div.appendChild(span);
    div.appendChild(btn);
    habitsDiv.appendChild(div);
  });

  const percent = Math.round((completed / habits.length) * 100);
  localStorage.setItem("progress-" + dateKey(selectedDate), percent);

  totalSpan.textContent = completed;
  dailyProgressDiv.textContent = `Progress: ${percent}%`;
}

/* ========= Navigation ========= */
document.getElementById("prevDay").onclick = () => {
  const d = new Date(selectedDate);
  d.setDate(d.getDate() - 1);
  if (d >= minDate) {
    selectedDate = d;
    renderAll();
  }
};

document.getElementById("nextDay").onclick = () => {
  const d = new Date(selectedDate);
  d.setDate(d.getDate() + 1);
  if (d <= maxDate) {
    selectedDate = d;
    renderAll();
  }
};

/* ========= Init ========= */
function renderAll() {
  renderCalendar();
  renderHabits();
}

renderAll();
