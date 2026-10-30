(() => {
  "use strict";
  const screens = [...document.querySelectorAll(".screen")];
  const indicator = document.getElementById("stepIndicator");
  const modal = document.getElementById("playfulModal");
  const modalOkay = document.getElementById("modalOkay");
  const dinnerNo = document.getElementById("dinnerNo");
  const heartsLayer = document.getElementById("heartsLayer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentScreen = 0;
  let lastFocused = null;

  const labels = [
    "A LITTLE SOMETHING FOR YOU", "A HEARTFELT APOLOGY", "A LITTLE DATE, JUST US",
    "DINNER DATE ACCEPTED", "A MOMENT TO TREASURE", "TOMORROW MORNING",
    "A PROMISE FOR TOMORROW", "A LITTLE LOVING PERSISTENCE"
  ];

  function showScreen(index) {
    if (!Number.isInteger(index) || index < 0 || index >= screens.length) return;
    currentScreen = index;
    screens.forEach((screen, i) => {
      const active = i === index;
      screen.hidden = !active;
      screen.classList.toggle("active", active);
    });
    indicator.textContent = labels[index];
    // Move keyboard focus to the new screen heading for a clear, accessible transition.
    const heading = screens[index].querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  document.querySelectorAll("[data-next]").forEach(button => {
    button.addEventListener("click", () => showScreen(Number(button.dataset.next)));
  });

  function openModal() {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modalOkay.focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }
  dinnerNo.addEventListener("click", openModal);
  modalOkay.addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    } else if (event.key === "Tab") {
      // Keep keyboard focus inside the modal.
      event.preventDefault();
      modalOkay.focus();
    }
  });

  if (!reducedMotion) {
    const symbols = ["♥", "♡", "✧"];
    function addHeart() {
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${12 + Math.random() * 15}px`;
      heart.style.animationDuration = `${8 + Math.random() * 7}s`;
      heartsLayer.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove(), { once: true });
    }
    for (let i = 0; i < 8; i++) setTimeout(addHeart, i * 550);
    // A low-frequency decorative drift; no timers are used when reduced motion is requested.
    setInterval(addHeart, 1900);
  }

  showScreen(0);
})();
