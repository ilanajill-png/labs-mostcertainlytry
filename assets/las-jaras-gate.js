(function () {
  const passwordHash = "16ae5772938502";
  const sessionKey = "las-jaras-labs-unlocked-v1";

  function hashString(value) {
    let h1 = 0xdeadbeef ^ value.length;
    let h2 = 0x41c6ce57 ^ value.length;
    for (let i = 0, ch; i < value.length; i += 1) {
      ch = value.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }

  function unlock() {
    sessionStorage.setItem(sessionKey, "yes");
    document.documentElement.classList.remove("lj-locked");
    const gate = document.querySelector(".las-jaras-gate");
    if (gate) gate.remove();
  }

  function showGate() {
    if (sessionStorage.getItem(sessionKey) === "yes") {
      unlock();
      return;
    }

    const gate = document.createElement("div");
    gate.className = "las-jaras-gate";
    gate.innerHTML = `
      <form class="las-jaras-gate__panel">
        <h1>Las Jaras</h1>
        <p>This Labs page is private household planning context.</p>
        <label>
          Password
          <input type="password" autocomplete="current-password" required autofocus>
        </label>
        <button type="submit">Open Page</button>
        <p class="las-jaras-gate__error" aria-live="polite"></p>
      </form>
    `;
    document.body.appendChild(gate);

    const form = gate.querySelector("form");
    const input = gate.querySelector("input");
    const error = gate.querySelector(".las-jaras-gate__error");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      try {
        const enteredHash = hashString(input.value);
        if (enteredHash === passwordHash) {
          unlock();
        } else {
          error.textContent = "Wrong password.";
          input.select();
        }
      } catch {
        error.textContent = "This browser cannot unlock the page. Try the laptop or a newer browser.";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showGate);
  } else {
    showGate();
  }
})();
