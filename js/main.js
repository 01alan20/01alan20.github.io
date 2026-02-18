/* --------------------------
   Tiny SPA Router + Insights
---------------------------*/

// Edit insights posts here.
// - If `external_url` is present, the card opens that link.
// - If not, clicking opens an internal post page at /post/<slug>.
const POSTS = [
  {
    id: 1,
    slug: "enrollment-predictive-model",
    title: "Practical Notes on Enrollment Forecasting",
    date: "2025-07-14",
    excerpt:
      "Quick overview of features, leakage points, and a lightweight approach to forecasting using logistic models and clean funnel definitions.",
    tags: ["enrollment", "higher ed", "analytics"],
    content: `
      <p>Forecasting enrollment does not require a massive stack. Start with a clean funnel: clearly defined stages, agreed SLAs, and a deduped source of truth.</p>
      <p>From there, a simple logistic model can outperform complex, opaque models when paired with an early-warning layer and weekly governance.</p>
      <p>The key is to own the definitions, audit the data every week, and socialize insights in operations standups.</p>
    `
  },
  {
    id: 2,
    slug: "kaust-partnership-notes",
    title: "Notes on Building International Partnerships",
    date: "2025-06-29",
    excerpt:
      "Governance, quality assurance, and a practical MOU checklist that speeds evaluation while protecting academic standards.",
    tags: ["partnerships", "qa", "mobility"],
    content: `
      <p>When evaluating a partnership, start with mission fit, student value, and operational feasibility.</p>
      <p>A practical one-pager should include governance contacts, assessment alignment, advising implications, CRM tagging, and expected outcomes.</p>
    `
  }
];

const WRITINGS = [
  {
    bucket: "Academic Journals",
    title: "Assessing student burnout using the AllWell? survey at Aalto University: an evaluation study",
    year: "2019",
    url: "https://digitallibrary.usc.edu/asset-management/2A3BF1W21RX8?&WS"
  },
  {
    bucket: "Academic Journals",
    title: "Anonymity and Online Learning",
    path: "writings/Finals/Anony_Online_Learning_FINAL.pdf"
  },
  {
    bucket: "Academic Journals",
    title: "Coaching Based on Hope Theory to Address Hopelessness",
    path: "writings/Finals/Coach_Based_on_Hope_Theory_Address_Hopelessness_June_4_2017.pdf"
  },
  {
    bucket: "Academic Journals",
    title: "Reframing Solutions to Mental Health in Higher Education",
    path: "writings/Finals/Reframing Solutions to Mental Health in Higher Education.pdf"
  },
  {
    bucket: "Newspaper",
    title: "PERMA and Well-Being",
    path: "writings/Newspaper/2018 11 PERMA - Well-Being_Alan Cromlish.pdf"
  },
  {
    bucket: "Newspaper",
    title: "Take a Break",
    path: "writings/Newspaper/2018 12 Take a Break_Alan Cromlish.pdf"
  },
  {
    bucket: "Times Higher Education",
    title: "Universities Must Shift from Treating Mental Illness to Promoting Mental Health",
    path: "writings/times higher education/2019 june 5 cromlish - final - Universities must shift from treating mental illness to promoting mental health.pdf"
  }
];

const WRITING_BUCKET_ORDER = ["Academic Journals", "Newspaper", "Times Higher Education"];

// ---------- Utilities ----------
const byId = (id) => document.getElementById(id);
const pages = ["home", "about", "projects", "writings", "insights", "post", "contact"];

function setActiveNav(pageId) {
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === pageId);
    if (a.dataset.page === pageId) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}

function showPage(pageId, navPageId = pageId) {
  pages.forEach((id) => byId(id)?.classList.remove("active"));
  const target = byId(pageId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  setActiveNav(navPageId);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function uniqueTags(posts) {
  const all = new Set();
  posts.forEach((p) => (p.tags || []).forEach((t) => all.add(t)));
  return Array.from(all).sort();
}

function parseYearFromPath(path) {
  const m = path.match(/(19|20)\d{2}/);
  return m ? m[0] : "";
}

// ---------- Insights rendering ----------
function renderTagPills(posts) {
  const wrap = byId("insights-tag-list");
  if (!wrap) {
    return;
  }
  wrap.innerHTML = "";
  const tags = uniqueTags(posts);
  tags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "tag";
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      filterAndRenderInsights();
    });
    wrap.appendChild(btn);
  });
}

function getActiveTags() {
  return Array.from(document.querySelectorAll(".tag.active")).map((b) => b.textContent);
}

function filterAndRenderInsights() {
  const search = byId("insights-search");
  const q = (search?.value || "").trim().toLowerCase();
  const activeTags = getActiveTags();

  const filtered = POSTS.filter((p) => {
    const inText = (p.title + " " + (p.excerpt || "")).toLowerCase().includes(q);
    const tagOK = activeTags.length ? activeTags.every((t) => (p.tags || []).includes(t)) : true;
    return inText && tagOK;
  }).sort((a, b) => b.date.localeCompare(a.date));

  renderInsightsList(filtered);
}

function renderInsightsList(list = POSTS) {
  const el = byId("insights-list");
  if (!el) {
    return;
  }

  el.innerHTML = "";
  if (!list.length) {
    el.innerHTML = `<p class="muted">No insights found.</p>`;
    return;
  }

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "post-card";
    const href = p.external_url ? p.external_url : `/post/${encodeURIComponent(p.slug)}`;
    const target = p.external_url ? ` target="_blank" rel="noopener"` : "";
    const tags = (p.tags || []).map((t) => `<span class="post-tag">${t}</span>`).join("");

    card.innerHTML = `
      <a href="${href}"${target}>
        <h3>${p.title}</h3>
        <div class="post-meta">${formatDate(p.date)}</div>
        <p>${p.excerpt || ""}</p>
        <div class="post-tags">${tags}</div>
      </a>
    `;

    if (!p.external_url) {
      card.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();
        navigate(`/post/${encodeURIComponent(p.slug)}`);
      });
    }

    el.appendChild(card);
  });
}

function renderPost(slug) {
  const post = POSTS.find((p) => p.slug === slug);
  const wrap = byId("post-article");

  if (!wrap) {
    return;
  }

  if (!post) {
    wrap.innerHTML = `<p>Post not found.</p>`;
    return;
  }

  if (post.external_url) {
    window.location.href = post.external_url;
    return;
  }

  wrap.innerHTML = `
    <h1>${post.title}</h1>
    <div class="post-meta">${formatDate(post.date)} | ${(post.tags || []).join(" | ")}</div>
    ${post.content || "<p>No content yet.</p>"}
  `;
}

// ---------- Writings rendering ----------
function renderWritings() {
  const wrap = byId("writings-groups");
  if (!wrap) {
    return;
  }

  const grouped = new Map();
  WRITINGS.forEach((item) => {
    if (!grouped.has(item.bucket)) {
      grouped.set(item.bucket, []);
    }
    grouped.get(item.bucket).push(item);
  });

  const sections = WRITING_BUCKET_ORDER
    .filter((bucket) => grouped.has(bucket))
    .map((bucket) => {
      const entries = grouped.get(bucket);
      const cards = entries
        .map((item) => {
          const linkTarget = item.url || encodeURI(item.path);
          const linkLabel = item.url ? "Open Link" : "Open PDF";
          const year = item.year || parseYearFromPath(item.path || item.url || "");
          const yearMarkup = year ? `<span class="writing-year">${year}</span>` : "";
          return `
            <article class="writing-card">
              <div class="writing-head">
                <h3>${item.title}</h3>
                ${yearMarkup}
              </div>
              <p class="writing-source">${item.bucket}</p>
              <a class="writing-link" href="${linkTarget}" target="_blank" rel="noopener">${linkLabel}</a>
            </article>
          `;
        })
        .join("");

      return `
        <section class="writing-group">
          <h2>${bucket} <span class="writing-count">(${entries.length})</span></h2>
          <div class="writings-grid">${cards}</div>
        </section>
      `;
    })
    .join("");

  wrap.innerHTML = sections;
}

// ---------- Routing ----------
function route() {
  if (redirectLegacyHash()) {
    return;
  }

  const path = currentPath();
  if (path === "/cv") {
    navigate("/contact", true);
    return;
  }

  if (path.startsWith("/post/")) {
    const slug = decodeURIComponent(path.slice("/post/".length));
    showPage("post", "insights");
    renderPost(slug);
    return;
  }

  if (path === "/" || path === "/home") {
    showPage("home");
    return;
  }

  const page = path.slice(1);
  if (pages.includes(page)) {
    showPage(page);
    if (page === "insights") {
      filterAndRenderInsights();
    }
    if (page === "writings") {
      renderWritings();
    }
    return;
  }

  navigate("/", true);
}

function currentPath() {
  const raw = window.location.pathname || "/";
  if (raw.length > 1 && raw.endsWith("/")) {
    return raw.slice(0, -1);
  }
  return raw;
}

function navigate(path, replace = false) {
  const next = path.startsWith("/") ? path : `/${path}`;
  if (replace) {
    window.history.replaceState({}, "", next);
  } else {
    window.history.pushState({}, "", next);
  }
  route();
}

function redirectLegacyHash() {
  const hash = window.location.hash;
  if (!hash) {
    return false;
  }

  if (hash === "#blog") {
    navigate("/insights", true);
    return true;
  }

  if (hash === "#cv") {
    navigate("/contact", true);
    return true;
  }

  if (hash.startsWith("#/post/")) {
    const slug = hash.slice("#/post/".length);
    navigate(`/post/${slug}`, true);
    return true;
  }

  const page = hash.replace("#", "");
  if (page === "home") {
    navigate("/", true);
    return true;
  }
  if (pages.includes(page)) {
    navigate(`/${page}`, true);
    return true;
  }

  return false;
}

function isAppPath(pathname) {
  return (
    pathname === "/" ||
    pathname === "/home" ||
    pathname === "/about" ||
    pathname === "/projects" ||
    pathname === "/writings" ||
    pathname === "/insights" ||
    pathname === "/contact" ||
    pathname === "/cv" ||
    pathname.startsWith("/post/")
  );
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderTagPills(POSTS);
  renderInsightsList(POSTS);
  renderWritings();

  const search = byId("insights-search");
  if (search) {
    search.addEventListener("input", filterAndRenderInsights);
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    const link = e.target.closest("a[href]");
    if (!link) {
      return;
    }
    if (link.target === "_blank" || link.hasAttribute("download")) {
      return;
    }

    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) {
      return;
    }
    if (!isAppPath(url.pathname)) {
      return;
    }

    e.preventDefault();
    navigate(url.pathname);
  });

  route();
  window.addEventListener("popstate", route);
});
