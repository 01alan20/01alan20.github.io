/* --------------------------
   Tiny SPA Router + Blog
---------------------------*/

// 👉 Edit your posts here.
// - If `external_url` is present, the card opens that link.
// - If not, clicking opens an internal post page at #/post/<slug>.
const POSTS = [
  {
    id: 1,
    slug: "sg-condo-roi",
    title: "Singapore Condo ROI: What the Data Says (2020–2025)",
    date: "2025-08-20",
    excerpt:
      "I built a Plotly-based explorer to visualize purchase prices, rental yields, and ROI for SG properties.",
    tags: ["real estate", "singapore", "plotly", "csv"],
    external_url: "https://example.com/condo-roi" // ← replace with your live app
  },
  {
    id: 2,
    slug: "enrollment-predictive-model",
    title: "Practical Notes on Enrollment Forecasting",
    date: "2025-07-14",
    excerpt:
      "Quick overview of features, leakage points, and a lightweight approach to forecasting using logistic models and clean funnel definitions.",
    tags: ["enrollment", "higher ed", "analytics"],
    content: `
      <p>Forecasting enrollment doesn't require a massive stack. Start with a clean funnel: clearly defined MQL/SQL, agreed SLAs, and a deduped source of truth.</p>
      <p>From there, a simple logistic regression (offer -> enroll) with cohorts by channel and term can outperform complex, opaque models—especially when paired with an early-warning layer.</p>
      <p>I’ll share a simplified workbook and code in a future post. For now, the key: <em>own the definitions</em>, audit the data weekly, and socialize the insights in ops standups.</p>
    `
  },
  {
    id: 3,
    slug: "kaust-partnership-notes",
    title: "Notes on Building International Partnerships",
    date: "2025-06-29",
    excerpt:
      "Governance, quality assurance, and a simple MOU checklist that speeds up evaluation while protecting academic standards.",
    tags: ["partnerships", "qa", "mobility"],
    content: `
      <p>When evaluating a partnership, I start with context: mission fit, student value, and operational feasibility.</p>
      <p>My one-pager includes: governance contacts, assessment alignment, advising implications, CRM tagging, and a draft outcomes dashboard.</p>
    `
  }
];

// ---------- Utilities ----------
const byId = (id) => document.getElementById(id);
const pages = ["home", "blog", "post", "projects", "cv", "contact"];

function setActiveNav(pageId){
  document.querySelectorAll(".nav-link").forEach(a=>{
    a.classList.toggle("active", a.dataset.page === pageId);
    if (a.dataset.page === pageId) a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
}

function showPage(pageId){
  pages.forEach(id => byId(id)?.classList.remove("active"));
  const target = byId(pageId);
  if (target){ target.classList.add("active"); window.scrollTo({top:0,behavior:"smooth"}); }
  setActiveNav(pageId);
}

// ---------- Blog rendering ----------
function formatDate(iso){ return new Date(iso).toLocaleDateString(undefined, {year:"numeric", month:"short", day:"numeric"}); }

function uniqueTags(posts){
  const all = new Set();
  posts.forEach(p => (p.tags||[]).forEach(t => all.add(t)));
  return Array.from(all).sort();
}

function renderTagPills(posts){
  const wrap = byId("tag-list");
  wrap.innerHTML = "";
  const tags = uniqueTags(posts);
  tags.forEach(tag=>{
    const btn = document.createElement("button");
    btn.className = "tag";
    btn.textContent = tag;
    btn.addEventListener("click", ()=>{
      btn.classList.toggle("active");
      filterAndRender();
    });
    wrap.appendChild(btn);
  });
}

function getActiveTags(){
  return Array.from(document.querySelectorAll(".tag.active")).map(b=>b.textContent);
}

function filterAndRender(){
  const q = byId("search").value.trim().toLowerCase();
  const activeTags = getActiveTags();
  const filtered = POSTS.filter(p=>{
    const inText = (p.title + " " + (p.excerpt||"")).toLowerCase().includes(q);
    const tagOK = activeTags.length ? activeTags.every(t => (p.tags||[]).includes(t)) : true;
    return inText && tagOK;
  }).sort((a,b)=> b.date.localeCompare(a.date));
  renderBlogList(filtered);
}

function renderBlogList(list = POSTS){
  const el = byId("blog-list");
  el.innerHTML = "";
  if (!list.length){
    el.innerHTML = `<p class="muted">No posts found.</p>`;
    return;
  }
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "post-card";
    const href = p.external_url ? p.external_url : `#/post/${p.slug}`;
    const target = p.external_url ? ` target="_blank" rel="noopener"` : "";
    const tags = (p.tags||[]).map(t=>`<span class="post-tag">${t}</span>`).join("");
    card.innerHTML = `
      <a href="${href}"${target}>
        <h3>${p.title}</h3>
        <div class="post-meta">${formatDate(p.date)}</div>
        <p>${p.excerpt||""}</p>
        <div class="post-tags">${tags}</div>
      </a>
    `;
    // For internal posts, intercept click to route without full reload
    if (!p.external_url) {
      card.querySelector("a").addEventListener("click", (e)=>{
        e.preventDefault();
        location.hash = `#/post/${p.slug}`;
      });
    }
    el.appendChild(card);
  });
}

function renderPost(slug){
  const post = POSTS.find(p => p.slug === slug);
  const wrap = byId("post-article");
  if (!post){
    wrap.innerHTML = `<p>Post not found.</p>`;
    return;
  }
  // If it's an external link post, just go there
  if (post.external_url){
    window.location.href = post.external_url;
    return;
  }
  wrap.innerHTML = `
    <h1>${post.title}</h1>
    <div class="post-meta">${formatDate(post.date)} · ${(post.tags||[]).join(" • ")}</div>
    ${post.content || "<p>No content yet.</p>"}
  `;
}

// ---------- Routing ----------
function route(){
  // routes: #home, #blog, #projects, #cv, #contact, #/post/<slug>
  const hash = location.hash || "#home";
  const [, first, second] = hash.split("/"); // e.g. ["#","post","slug"]
  const page = hash.startsWith("#/post/") ? "post" : hash.replace("#","");

  if (page === "post" && second){
    showPage("post"); renderPost(second);
  } else if (pages.includes(page)) {
    showPage(page);
    if (page === "blog") filterAndRender();
  } else {
    showPage("home");
  }
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  // Build tag pills and blog list UI once
  renderTagPills(POSTS);
  renderBlogList(POSTS);

  // Search binding
  const search = byId("search");
  if (search) search.addEventListener("input", filterAndRender);

  // Initial route + update on hash change
  route();
  window.addEventListener("hashchange", route);
});
