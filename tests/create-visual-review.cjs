const fs = require("node:fs");

const html = fs.readFileSync("dist/index.html", "utf8");
const script = `
window.addEventListener("load", async () => {
  const params = new URLSearchParams(location.search);
  const view = params.get("view");
  const theme = params.get("theme");
  const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
  if (view === "home") return;
  document.querySelector("#play-button").click();
  const themeInput = document.querySelector('input[name="theme"][value="' + theme + '"]');
  if (themeInput) {
    themeInput.checked = true;
    themeInput.dispatchEvent(new Event("change", { bubbles: true }));
  }
  if (view === "settings") return;
  if (view === "hover-gaming") {
    document.querySelector('[data-preview-theme="gaming"]').dispatchEvent(new MouseEvent("mouseenter"));
    return;
  }
  document.querySelector("#settings-form").requestSubmit();
  if (view === "game") return;
  if (view === "exit") {
    document.querySelector("#exit-button").click();
    return;
  }
  if (view === "flipped") {
    document.querySelector(".memory-card").click();
    return;
  }
  if (view === "result") {
    const cards = [...document.querySelectorAll(".memory-card")];
    const groups = Map.groupBy(cards, (card) => card.querySelector("img")?.src || card.querySelector(".memory-card__front").textContent);
    for (const pair of groups.values()) {
      pair[0].click();
      pair[1].click();
      await wait(520);
    }
  }
});
`;

fs.writeFileSync("dist/visual-review.html", html.replace("</body>", `<script>${script}</script></body>`));
