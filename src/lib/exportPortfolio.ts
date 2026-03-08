import { GitHubRepo } from "@/components/ProjectCard";
import type { Theme, CustomThemeColors } from "@/components/ThemeSelector";

interface PortfolioData {
  username: string;
  name: string;
  bio: string;
  avatar: string;
  repos: GitHubRepo[];
  location: string;
  website: string;
  twitter: string;
  linkedin: string;
  pinnedRepos: number[];
  skills: string[];
}

const themeCSS: Record<Exclude<Theme, "custom">, string> = {
  default: `
    :root { --bg:#0d1117;--fg:#b5f5b5;--card:#161b24;--primary:#22c55e;--muted:#64748b;--border:#21262d;--primary-fg:#0d1117;--gradient:linear-gradient(135deg,#22c55e,#06b6d4); }
    body { background:var(--bg);color:var(--fg);font-family:'JetBrains Mono','Courier New',monospace; }
  `,
  minimal: `
    :root { --bg:#f9fafb;--fg:#111827;--card:#ffffff;--primary:#3b82f6;--muted:#6b7280;--border:#e5e7eb;--primary-fg:#ffffff;--gradient:linear-gradient(135deg,#3b82f6,#06b6d4); }
    body { background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif; }
  `,
  cyberpunk: `
    :root { --bg:#12080f;--fg:#f0b0f0;--card:#1a0f1a;--primary:#d946ef;--muted:#8b5e8b;--border:#2d1a2d;--primary-fg:#12080f;--gradient:linear-gradient(135deg,#d946ef,#facc15); }
    body { background:var(--bg);color:var(--fg);font-family:'JetBrains Mono','Courier New',monospace; }
  `,
  ocean: `
    :root { --bg:#071520;--fg:#b0e0f5;--card:#0d2030;--primary:#06b6d4;--muted:#4b8fa6;--border:#0f2d40;--primary-fg:#071520;--gradient:linear-gradient(135deg,#06b6d4,#34d399); }
    body { background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif; }
  `,
  sunset: `
    :root { --bg:#1a0a08;--fg:#fde0c0;--card:#261410;--primary:#f97316;--muted:#a0633a;--border:#3d1e14;--primary-fg:#1a0a08;--gradient:linear-gradient(135deg,#f97316,#ec4899); }
    body { background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif; }
  `,
  forest: `
    :root { --bg:#060e06;--fg:#c8f0c8;--card:#0d1a0d;--primary:#4ade80;--muted:#5a8a5a;--border:#162416;--primary-fg:#060e06;--gradient:linear-gradient(135deg,#4ade80,#fbbf24); }
    body { background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif; }
  `,
  arctic: `
    :root { --bg:#f0f7ff;--fg:#0f172a;--card:#ffffff;--primary:#38bdf8;--muted:#64748b;--border:#cbd5e1;--primary-fg:#0f172a;--gradient:linear-gradient(135deg,#38bdf8,#818cf8); }
    body { background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif; }
  `,
  midnight: `
    :root { --bg:#06050f;--fg:#e0e0ff;--card:#0e0c1c;--primary:#818cf8;--muted:#6366a0;--border:#1e1a36;--primary-fg:#06050f;--gradient:linear-gradient(135deg,#818cf8,#a78bfa); }
    body { background:var(--bg);color:var(--fg);font-family:'JetBrains Mono','Courier New',monospace; }
  `,
  volcano: `
    :root { --bg:#0f0606;--fg:#ffe5e5;--card:#1c0c0c;--primary:#ef4444;--muted:#8b4444;--border:#2d1010;--primary-fg:#0f0606;--gradient:linear-gradient(135deg,#ef4444,#f59e0b); }
    body { background:var(--bg);color:var(--fg);font-family:'JetBrains Mono','Courier New',monospace; }
  `,
};

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00add8", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", Ruby: "#701516", Swift: "#fa7343", Kotlin: "#A97BFF",
  PHP: "#4f5d95", CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051",
  Vue: "#41b883", Dart: "#00b4ab",
};

function buildCustomCSS(colors: CustomThemeColors): string {
  return `
    :root {
      --bg:${colors.bg};--fg:${colors.fg};--card:${colors.card};
      --primary:${colors.primary};--muted:${colors.border};
      --border:${colors.border};--primary-fg:${colors.bg};
      --gradient:linear-gradient(135deg,${colors.primary},${colors.accent});
    }
    body { background:var(--bg);color:var(--fg);font-family:Inter,system-ui,sans-serif; }
  `;
}

export function generatePortfolioHTML(data: PortfolioData, theme: Theme, customColors?: CustomThemeColors): string {
  const featured = data.pinnedRepos.length > 0
    ? data.repos.filter((r) => data.pinnedRepos.includes(r.id))
    : data.repos.slice(0, 6);

  const totalStars = data.repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = data.repos.reduce((s, r) => s + r.forks_count, 0);

  const resolvedCSS = theme === "custom" && customColors
    ? buildCustomCSS(customColors)
    : themeCSS[theme as Exclude<Theme, "custom">] ?? themeCSS.default;

  const repoCards = featured.map((repo) => {
    const color = repo.language ? (languageColors[repo.language] || "#8b949e") : null;
    const topics = (repo.topics || []).slice(0, 4).map((t) => `<span class="topic">${t}</span>`).join("");
    const updated = new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return `
      <a href="${repo.html_url}" target="_blank" class="card repo-card">
        <div class="repo-header">
          <span class="repo-name">${repo.name}</span>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="live-btn">↗ Live</a>` : ""}
        </div>
        <p class="repo-desc">${repo.description || "No description."}</p>
        ${topics ? `<div class="topics">${topics}</div>` : ""}
        <div class="repo-footer">
          <div class="repo-stats">
            ${color ? `<span class="lang-dot" style="background:${color}"></span><span>${repo.language}</span>` : ""}
            <span>⭐ ${repo.stargazers_count.toLocaleString()}</span>
            <span>🍴 ${repo.forks_count.toLocaleString()}</span>
          </div>
          <span class="updated">${updated}</span>
        </div>
      </a>`;
  }).join("");

  const skillBadges = data.skills.map((s) => `<span class="skill">${s}</span>`).join("");
  const socialLinks = [
    data.website ? `<a href="${data.website}" target="_blank">🔗 Website</a>` : "",
    data.twitter ? `<a href="https://twitter.com/${data.twitter.replace("@", "")}" target="_blank">🐦 Twitter</a>` : "",
    data.linkedin ? `<a href="${data.linkedin.startsWith("http") ? data.linkedin : "https://" + data.linkedin}" target="_blank">💼 LinkedIn</a>` : "",
    `<a href="https://github.com/${data.username}" target="_blank">🐙 GitHub</a>`,
  ].filter(Boolean).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${data.name} — Portfolio</title>
  <meta name="description" content="${data.bio}"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    ${resolvedCSS}
    *, *::before, *::after { box-sizing:border-box;margin:0;padding:0; }
    a { color:inherit;text-decoration:none; }
    .container { max-width:960px;margin:0 auto;padding:0 20px; }
    nav { border-bottom:1px solid var(--border);padding:16px 20px;display:flex;align-items:center;justify-content:space-between; }
    .nav-brand { font-weight:700;font-size:14px;letter-spacing:-0.5px; }
    .nav-user { font-size:12px;color:var(--muted); }
    .hero { padding:48px 0 32px; }
    .hero-inner { display:flex;align-items:flex-start;gap:24px;flex-wrap:wrap; }
    .avatar { width:96px;height:96px;border-radius:20px;border:3px solid var(--primary);object-fit:cover;flex-shrink:0; }
    .hero-info h1 { font-size:2rem;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1.2; }
    .hero-info .handle { color:var(--muted);font-size:14px;margin-top:4px; }
    .hero-info .bio { margin-top:8px;font-size:14px;line-height:1.6;color:var(--fg);opacity:.85;max-width:500px; }
    .meta-links { display:flex;flex-wrap:wrap;gap:16px;margin-top:12px; }
    .meta-links a,.meta-links span { font-size:13px;color:var(--muted); }
    .meta-links a:hover { color:var(--primary); }
    .stats { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:24px 0; }
    .stat { background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;text-align:center; }
    .stat-value { font-size:1.75rem;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
    .stat-label { font-size:11px;color:var(--muted);margin-top:4px; }
    .section { padding:24px 0; }
    .section-title { font-size:1.1rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px; }
    .section-title::before { content:'';display:inline-block;width:3px;height:18px;background:var(--gradient);border-radius:2px; }
    .skills { display:flex;flex-wrap:wrap;gap:8px; }
    .skill { padding:6px 14px;border-radius:9999px;border:1px solid var(--primary);color:var(--primary);font-size:12px;font-weight:600; }
    .repos { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px; }
    .card { background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px;transition:border-color .2s,transform .2s;display:block; }
    .card:hover { border-color:var(--primary);transform:translateY(-2px); }
    .repo-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:8px; }
    .repo-name { font-weight:700;font-size:14px;color:var(--fg); }
    .live-btn { font-size:11px;color:var(--primary);border:1px solid var(--primary);padding:2px 8px;border-radius:6px; }
    .repo-desc { font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
    .topics { display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px; }
    .topic { background:color-mix(in srgb,var(--primary) 15%,transparent);color:var(--primary);border:1px solid color-mix(in srgb,var(--primary) 30%,transparent);padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:600; }
    .repo-footer { display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--muted); }
    .repo-stats { display:flex;align-items:center;gap:10px; }
    .lang-dot { display:inline-block;width:10px;height:10px;border-radius:50%; }
    .updated { font-size:10px; }
    footer { border-top:1px solid var(--border);margin-top:48px;padding:20px 0;text-align:center;font-size:12px;color:var(--muted); }
    @media (max-width:600px) { .stats { grid-template-columns:repeat(3,1fr);gap:8px; } .repos { grid-template-columns:1fr; } .hero-info h1 { font-size:1.5rem; } }
  </style>
</head>
<body>
  <nav>
    <span class="nav-brand">🖥 DevFolio</span>
    <span class="nav-user">@${data.username}</span>
  </nav>
  <div class="container">
    <div class="hero">
      <div class="hero-inner">
        <img src="${data.avatar}" alt="${data.name}" class="avatar"/>
        <div class="hero-info">
          <h1>${data.name}</h1>
          <p class="handle">@${data.username}</p>
          ${data.bio ? `<p class="bio">${data.bio}</p>` : ""}
          <div class="meta-links">
            ${data.location ? `<span>📍 ${data.location}</span>` : ""}
            ${socialLinks}
          </div>
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><div class="stat-value">${data.repos.length}</div><div class="stat-label">Repositories</div></div>
      <div class="stat"><div class="stat-value">${totalStars.toLocaleString()}</div><div class="stat-label">Total Stars</div></div>
      <div class="stat"><div class="stat-value">${totalForks.toLocaleString()}</div><div class="stat-label">Total Forks</div></div>
    </div>
    ${data.skills.length > 0 ? `<div class="section"><div class="section-title">Skills &amp; Technologies</div><div class="skills">${skillBadges}</div></div>` : ""}
    <div class="section"><div class="section-title">Featured Projects</div><div class="repos">${repoCards}</div></div>
  </div>
  <footer>Built with ❤ using <strong>DevFolio</strong> · ${new Date().getFullYear()}</footer>
</body>
</html>`;
}

export function downloadPortfolio(data: PortfolioData, theme: Theme, customColors?: CustomThemeColors) {
  const html = generatePortfolioHTML(data, theme, customColors);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.username}-portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
