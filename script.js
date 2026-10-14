const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("gameSearch");
const clearSearch = document.getElementById("clearSearch");
const cards = [...document.querySelectorAll(".game-card")];
const filters = [...document.querySelectorAll(".filter")];
const emptyState = document.getElementById("emptyState");

searchToggle.addEventListener("click", () => {
  searchPanel.classList.toggle("open");
  if (searchPanel.classList.contains("open")) setTimeout(() => searchInput.focus(), 100);
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  applyFilters();
  searchInput.focus();
});

let activeCategory = "all";

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const category = card.dataset.category;
    const categoryMatch = activeCategory === "all" || category.includes(activeCategory);
    const searchMatch = !query || title.includes(query);
    const show = categoryMatch && searchMatch;

    card.style.display = show ? "" : "none";
    if (show) {
      card.animate(
        [{opacity: .45, transform: "translateY(5px)"}, {opacity: 1, transform: "translateY(0)"}],
        {duration: 220, easing: "ease-out"}
      );
      visible++;
    }
  });

  emptyState.classList.toggle("show", visible === 0);
}

filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");
    activeCategory = filter.dataset.category;
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

// Small offline particle field.
const particleLayer = document.getElementById("particles");
for (let i = 0; i < 42; i++) {
  const p = document.createElement("span");
  p.className = "particle";
  p.style.left = `${Math.random() * 100}%`;
  p.style.animationDuration = `${10 + Math.random() * 18}s`;
  p.style.animationDelay = `${-Math.random() * 18}s`;
  p.style.opacity = `${0.08 + Math.random() * .25}`;
  particleLayer.appendChild(p);
}

// Animated number counters when statistics enter the viewport.
const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = "1";
    const target = Number(entry.target.dataset.count);
    const start = performance.now();
    const duration = 900;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, {threshold: .5});

counters.forEach(counter => counterObserver.observe(counter));

// Highlight the current navigation section.
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle(
      "active", link.getAttribute("href") === `#${entry.target.id}`
    ));
  });
}, {rootMargin: "-35% 0px -55% 0px"});

sections.forEach(section => navObserver.observe(section));

// Keyboard shortcut: "/" opens search.
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    searchPanel.classList.add("open");
    searchInput.focus();
  }
});
