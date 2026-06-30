const mistakes = [
  {
    id: 1,
    title: "Findability",
    short: "Users should be able to find a digital service through search, navigation and wording that match their real-world intent. If a service is hidden deep in a menu or search only understands internal category names, the service may technically exist online but still fail for residents."
  },
  {
    id: 2,
    title: "Media Break",
    short: "A media break happens when an online process suddenly switches to paper, postal mail, manual signatures, phone calls or in-person steps. OZG services should ideally be digital from application to processing and response."
  },
  {
    id: 3,
    title: "Duplicate Data Entry",
    short: "Once-only means residents should not have to type data again when the administration already has it or has just verified it. Repeated name, address, date-of-birth or vehicle fields create effort and increase error risk."
  },
  {
    id: 4,
    title: "Official Jargon",
    short: "Digital public services need clear, plain language. Cryptic field labels, legal shorthand, unexplained file numbers or technical error codes can make users feel like they need administrative expertise just to complete a normal request."
  },
  {
    id: 5,
    title: "Missing digital identity",
    short: "A mature online service should offer a secure digital identity route, such as a trusted citizen account or eID-based login. Workarounds like uploading ID photos are less integrated and can create privacy and trust problems."
  },
  {
    id: 6,
    title: "Accessibility / Mobile Layout",
    short: "An online service should work for people using phones, keyboard navigation, screen readers and different visual needs. Tiny text, weak contrast, missing labels or broken mobile layouts exclude users."
  },
  {
    id: 7,
    title: "No Status Feedback",
    short: "After submitting a request, users need confidence that it arrived. Good services provide a confirmation, case or reference number, expected next steps and ideally a way to track the processing status."
  },
  {
    id: 8,
    title: "No Online Payment",
    short: "If a fee is part of the administrative service, payment should be integrated into the digital transaction. Bank transfers after processing or separate offline payment instructions interrupt the service journey."
  },
  {
    id: 9,
    title: "Isolated Local Solution",
    short: "Services should be reusable, standardized and compatible across public administration portals where possible. One-off local solutions create inconsistent wording, behavior and technical integration."
  },
  {
    id: 10,
    title: "Form Download",
    short: "A PDF download can be helpful, but it is not the same as an online application. If the user still has to download, print, fill, sign or mail a form, the service remains at a low digital maturity level."
  }
];

const screens = Array.from(document.querySelectorAll(".screen"));
const modalSteps = Array.from(document.querySelectorAll(".modal-step"));
const modalStepNames = modalSteps.map((step) => step.dataset.modalStep);
const mistakeList = document.querySelector("#mistakeList");
const portalPanel = document.querySelector("#portalPanel");
const scenarioOverlay = document.querySelector("#scenarioOverlay");
const toast = document.querySelector("#toast");
let toastTimer;
let currentModalStep = 0;

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

function showModalStep(stepName) {
  modalSteps.forEach((step) => {
    step.classList.toggle("is-active", step.dataset.modalStep === stepName);
  });
  currentModalStep = Math.max(0, modalStepNames.indexOf(stepName));
}

function moveModalStep(direction) {
  const nextStep = currentModalStep + direction;
  if (nextStep < 0 || nextStep >= modalStepNames.length) {
    return;
  }
  showModalStep(modalStepNames[nextStep]);
}

function closeScenarioModal() {
  document.body.classList.remove("scenario-modal-open");
  scenarioOverlay.setAttribute("hidden", "");
  goTo("portal");
}

function renderMistakes() {
  mistakeList.innerHTML = mistakes.map((mistake) => {
    return `
      <article class="mistake-item" data-mistake="${mistake.id}">
        <button class="mistake-trigger" type="button" aria-expanded="false">
          <span class="mistake-number">${mistake.id}</span>
          <span class="mistake-title">${mistake.title}</span>
          <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </button>
        <div class="mistake-body">
          <p>${mistake.short}</p>
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

  const nextModalButton = event.target.closest("[data-modal-next]");
  if (nextModalButton) {
    moveModalStep(1);
    return;
  }

  const prevModalButton = event.target.closest("[data-modal-prev]");
  if (prevModalButton) {
    moveModalStep(-1);
    return;
  }

  const closeScenarioButton = event.target.closest("[data-close-scenario]");
  if (closeScenarioButton) {
    closeScenarioModal();
    return;
  }

  const trigger = event.target.closest(".mistake-trigger");
  if (trigger) {
    const item = trigger.closest(".mistake-item");
    const isOpen = item.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  }
});

renderMistakes();
