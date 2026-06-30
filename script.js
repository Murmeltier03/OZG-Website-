const mistakes = [
  {
    id: 1,
    title: "Poor findability",
    short: "The service is hidden deep in the navigation and search does not find it.",
    note: "Included in this click path."
  },
  {
    id: 2,
    title: "Media break",
    short: "The application cannot be completed digitally and switches to paper/post.",
    note: "Included in this click path."
  },
  {
    id: 3,
    title: "Duplicate data entry",
    short: "Data that was already read from ID and registers must be entered again.",
    note: "Included in this click path."
  },
  {
    id: 4,
    title: "Missing digital identity",
    short: "A flawed service might ask for ID photos instead of using a trusted account.",
    note: "Reference item."
  },
  {
    id: 5,
    title: "Official jargon",
    short: "Unclear labels and technical errors make the service hard to understand.",
    note: "Reference item."
  },
  {
    id: 6,
    title: "Poor accessibility or mobile layout",
    short: "A service can fail when contrast, labels, keyboard access or responsive layout are weak.",
    note: "Reference item."
  },
  {
    id: 7,
    title: "No status feedback",
    short: "Users need confirmation, a case number and a way to track progress.",
    note: "Reference item."
  },
  {
    id: 8,
    title: "No online payment",
    short: "The portal shows a fee but does not let the user pay online.",
    note: "Included in this click path."
  },
  {
    id: 9,
    title: "Isolated local solution",
    short: "Services should be reusable and consistent across portal networks, not one-off local builds.",
    note: "Reference item."
  },
  {
    id: 10,
    title: "Form download instead of online application",
    short: "A service advertised as online only provides a downloadable form.",
    note: "Included in this click path."
  }
];

const screens = Array.from(document.querySelectorAll(".screen"));
const mistakeList = document.querySelector("#mistakeList");
const portalPanel = document.querySelector("#portalPanel");
const toast = document.querySelector("#toast");
let toastTimer;

function goTo(screenName) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === screenName);
  });
  portalPanel.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

function renderMistakes() {
  mistakeList.innerHTML = mistakes.map((mistake) => {
    return `
      <article class="mistake-item" data-mistake="${mistake.id}">
        <div class="mistake-summary">
          <span class="mistake-number">${mistake.id}</span>
          <div>
            <h3>${mistake.title}</h3>
            <p>${mistake.short}</p>
            <span>${mistake.note}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

document.addEventListener("click", (event) => {
  const goButton = event.target.closest("[data-go]");
  if (goButton) {
    goTo(goButton.dataset.go);
    return;
  }

  const startButton = event.target.closest("[data-start-application]");
  if (startButton) {
    goTo("applicant");
    return;
  }

  const directoryItem = event.target.closest("[data-menu]");
  if (directoryItem) {
    document.querySelectorAll(".directory-item").forEach((item) => {
      item.classList.toggle("is-selected", item === directoryItem);
    });
    showToast(`Opened category: ${directoryItem.textContent.trim()}`);
    return;
  }
});

document.querySelector("#serviceSearch").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#serviceSearchInput").value.trim();
  const result = document.querySelector("#searchResult");

  if (query.toLowerCase() === "traffic") {
    result.textContent = "1 category found: Traffic. The actual parking permit service is still hidden several levels deeper.";
  } else {
    result.textContent = `No service result for "${query}". Search only checks exact category names, not service titles.`;
  }
});

document.querySelector("#topSearch").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#searchInput").value.trim() || "your search";
  showToast(`No direct service result for "${query}". Try the service directory.`);
  goTo("portal");
});

renderMistakes();
