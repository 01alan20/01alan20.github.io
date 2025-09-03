/* Simple hash router + Projects data
   Routes:
     #home | #projects | #projects/<slug> | #cv | #contact
*/

const PROJECTS = [
  {
    slug: "condo-roi",
    title: "Singapore Condo Investment ROI",
    summary:
      "Interactive dashboard showing purchase prices, rental levels, and estimated ROI in years.",
    badges: ["Plotly", "JS", "CSV"],
    // Update this to your deployed path (GitHub Pages/Netlify)
    externalUrl: "projects/condo-roi/condo.index.html",
    repoUrl: "https://sg-condo-roi.streamlit.app/", // optional
    content: `
      <p>What it is</p>
      <p>A simple, interactive website that helps anyone quickly gauge payback time (ROI in years) for Singapore condos.</p>

      <p>How you use it</p>
      <p>Pick what you care about—Property Type, Area, District, and Tenure (99, 999, 9999, or Freehold). You can also narrow leasehold homes by Year of Lease Start. The charts and the projects table update instantly, showing typical buy and rent levels plus estimated ROI.</p>

      <p>What we did under the hood</p>
      <p>We cleaned the raw dataset, simplified area ranges into a single starting number (e.g., “200–300” → 200), grouped tenure into clear buckets (99/999/9999/Freehold), and pulled the lease start year out of the text when available. Then we built the interactive views in Streamlit and deployed it to Streamlit Community Cloud—so it loads fast and works anywhere.</p>
    `
  },
  // Add more projects here…
  // {
  //   slug: "task-app",
  //   title: "Lightweight Team Task App",
  //   summary: "Tiny project board with real-time updates.",
  //   badges: ["Vue", "Firebase"],
  //   externalUrl: "https://example.com/task-app",
  //   repoUrl: "https://github.com/...",
  //   content: "<p>Details about the project…</p>"
  // },

    // Add more projects here…
  // {
  //   slug: "task-app",
  //   title: "Lightweight Team Task App",
  //   summary: "Tiny project board with real-time updates.",
  //   badges: ["Vue", "Firebase"],
  //   externalUrl: "https://example.com/task-app",
  //   repoUrl: "https://github.com/...",
  //   content: "<p>Details about the project…</p>"
  // },

    // Add more projects here…
  // {
  //   slug: "task-app",
  //   title: "Lightweight Team Task App",
  //   summary: "Tiny project board with real-time updates.",
  //   badges: ["Vue", "Firebase"],
  //   externalUrl: "https://example.com/task-app",
  //   repoUrl: "https://github.com/...",
  //   content: "<p>Details about the project…</p>"
  // },

    // Add more projects here…
  // {
  //   slug: "task-app",
  //   title: "Lightweight Team Task App",
  //   summary: "Tiny project board with real-time updates.",
  //   badges: ["Vue", "Firebase"],
  //   externalUrl: "https://example.com/task-app",
  //   repoUrl: "https://github.com/...",
  //   content: "<p>Details about the project…</p>"
  // },
];

/* ---------- utils ---------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

function setActive(pageId) {
  $$(".page").forEach(s => s.classList.remove("active"));
  const sec = document.getElementById(pageId);
  if (sec) sec.classList.add("active");
  // nav highlight
  $$(".nav-link").forEach(a => a.classList.toggle("active", a.dataset.page === pageId));
}

/* ---------- projects list ---------- */
function buildProjects() {
  const grid = $("#projects-grid");
  if (!grid) return;
  grid.innerHTML = PROJECTS.map(p => {
    const badges = (p.badges || []).map(b => `<span class="tech-tag">${b}</span>`).join("");
    return `
      <a class="card" href="#projects/${p.slug}">
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-excerpt">${p.summary}</p>
          <div class="project-tech">${badges}</div>
        </div>
      </a>
    `;
  }).join("");
}

function showProject(slug) {
  const proj = PROJECTS.find(p => p.slug === slug);
  const article = $("#project-article");
  if (!proj || !article) {
    location.hash = "#projects";
    return;
  }
  article.innerHTML = `
    <header class="post-header">
      <h1>${proj.title}</h1>
      <div class="post-meta">
        ${(proj.badges || []).map(b => `<span class="tech-tag">${b}</span>`).join(" ")}
      </div>
    </header>
    <div class="post-content">
      <p>${proj.summary}</p>
      ${proj.content || ""}
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px">
        ${proj.externalUrl ? `<a class="btn" href="${proj.externalUrl}" target="_blank" rel="noopener">Open Project</a>` : ""}
        ${proj.repoUrl     ? `<a class="btn btn-secondary" href="${proj.repoUrl}" target="_blank" rel="noopener">View Code</a>` : ""}
      </div>
    </div>
  `;
  setActive("project");
}

/* ---------- router ---------- */
function handleRoute() {
  const hash = (location.hash || "#home").replace(/^#/, "");
  if (hash.startsWith("projects/")) {
    const slug = hash.split("/")[1];
    showProject(slug);
    return;
  }
  const page = hash || "home";
  const section = document.getElementById(page);
  if (!section) {
    location.hash = "#home";
    return;
  }
  setActive(page);
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  buildProjects();
  handleRoute();
});
window.addEventListener("hashchange", handleRoute);
