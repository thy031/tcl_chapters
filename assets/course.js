function showPanel(id) {
  document.querySelectorAll("[data-panel]").forEach(function (el) {
    el.classList.toggle("hidden", el.getAttribute("data-panel") !== id);
  });
  document.querySelectorAll(".tabs button").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-show") === id);
  });
}

document.addEventListener("click", function (ev) {
  var btn = ev.target.closest(".tabs button");
  if (!btn) return;
  showPanel(btn.getAttribute("data-show"));
});

if (typeof window !== "undefined") {
  window.showPanel = showPanel;
}
