import { useState, useMemo, useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { ThemeSelector, Theme } from "@/components/ThemeSelector";
import { GitHubImport } from "@/components/GitHubImport";
import { ProjectCard, GitHubRepo } from "@/components/ProjectCard";
import { ProfileEditor } from "@/components/ProfileEditor";
import { SkillsEditor } from "@/components/SkillsEditor";
import { RepoPinSelector } from "@/components/RepoPinSelector";
import { downloadPortfolio } from "@/lib/exportPortfolio";
import { toast } from "@/hooks/use-toast";
import {
  Github,
  Palette,
  User,
  LayoutGrid,
  Download,
  RefreshCw,
  Star,
  Code2,
  Terminal,
  Sparkles,
  Pin,
  Link,
  Copy,
  Check,
  Search,
  SortAsc,
  GitFork,
  Filter,
  Eye,
  Zap,
  Globe,
  Shield,
  ChevronDown,
  ExternalLink,
  Users,
  Clock,
  Layers,
} from "lucide-react";

type Step = "landing" | "builder";

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

type SortOption = "stars" | "forks" | "updated" | "name";

const steps = [
  { icon: Github, label: "Import from GitHub", desc: "Auto-fetch all your projects" },
  { icon: Palette, label: "Pick a theme", desc: "5 stunning designs" },
  { icon: User, label: "Customize profile", desc: "Edit your info inline" },
  { icon: Download, label: "Export & publish", desc: "Share your portfolio" },
];

const features = [
  {
    icon: Zap,
    title: "60-Second Setup",
    desc: "Enter your GitHub username and your entire project history is imported instantly — no manual entry.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
  },
  {
    icon: Palette,
    title: "5 Unique Themes",
    desc: "Terminal dark, minimal light, cyberpunk, ocean depth, and sunset — each pixel-perfect and ready to ship.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: Globe,
    title: "Self-Contained Export",
    desc: "One HTML file with all styles baked in. Host on Netlify, GitHub Pages, or any static host for free.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: Shield,
    title: "No Account Needed",
    desc: "Zero sign-ups, zero data stored. Everything runs in your browser — your data stays yours.",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
  {
    icon: Layers,
    title: "Skills & Tech Stack",
    desc: "Showcase your languages and frameworks with a beautiful tag cloud in your exported portfolio.",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  {
    icon: Pin,
    title: "Pin Featured Work",
    desc: "Curate up to 6 repositories to appear front-and-center. Let your best work lead the conversation.",
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
];

const faqs = [
  {
    q: "Do I need a GitHub account?",
    a: "You just need a public GitHub username. We read your public profile and repos via the GitHub API — no OAuth, no tokens.",
  },
  {
    q: "Is my data stored anywhere?",
    a: "No. Everything runs entirely in your browser. No backend, no analytics on your data, nothing stored.",
  },
  {
    q: "Can I host the exported file for free?",
    a: "Absolutely. The exported HTML is fully self-contained. Drop it on Netlify Drop, GitHub Pages, or any static hosting — many offer free tiers.",
  },
  {
    q: "How many repos are imported?",
    a: "We fetch up to 12 of your most-starred public repositories, automatically filtering out forks for a cleaner result.",
  },
  {
    q: "Can I edit the generated HTML?",
    a: "Yes! The exported file is clean, readable HTML/CSS with no framework dependencies. Edit it in any text editor.",
  },
];

// Animated counter hook
function useCounter(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function Index() {
  const [step, setStep] = useState<Step>("landing");
  const [theme, setTheme] = useState<Theme>("default");
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<"github" | "theme" | "profile" | "skills" | "preview">("github");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Repo filtering state
  const [repoSearch, setRepoSearch] = useState("");
  const [repoSort, setRepoSort] = useState<SortOption>("stars");
  const [langFilter, setLangFilter] = useState<string>("all");

  const themeClass =
    theme === "default" ? "" :
    theme === "minimal" ? "theme-minimal" :
    theme === "cyberpunk" ? "theme-cyberpunk" :
    theme === "sunset" ? "theme-sunset" :
    "theme-ocean";

  const handleImport = (
    username: string,
    repos: GitHubRepo[],
    avatar: string,
    bio: string,
    name: string
  ) => {
    setPortfolio({
      username, repos, avatar, bio, name,
      location: "", website: "", twitter: "", linkedin: "",
      pinnedRepos: [], skills: [],
    });
    setStep("builder");
    setActiveTab("theme");
  };

  const handleProfileUpdate = (updates: Partial<PortfolioData>) => {
    setPortfolio((p) => (p ? { ...p, ...updates } : p));
  };

  const handleExport = () => {
    if (!portfolio) return;
    setExporting(true);
    try {
      downloadPortfolio({ ...portfolio, linkedin: portfolio.linkedin || "" }, theme);
      toast({ title: "✅ Portfolio exported!", description: `${portfolio.username}-portfolio.html downloaded successfully.` });
    } catch {
      toast({ title: "Export failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = () => {
    if (!portfolio) return;
    const shareData = {
      username: portfolio.username,
      name: portfolio.name,
      bio: portfolio.bio,
      avatar: portfolio.avatar,
      location: portfolio.location,
      website: portfolio.website,
      twitter: portfolio.twitter,
      linkedin: portfolio.linkedin,
      skills: portfolio.skills,
      pinnedRepos: portfolio.pinnedRepos,
      theme,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: "🔗 Link copied!", description: "Share this link to show your portfolio." });
    setTimeout(() => setCopied(false), 2000);
  };

  // Derived: unique languages for filter
  const uniqueLangs = useMemo(() => {
    if (!portfolio) return [];
    const langs = portfolio.repos
      .map((r) => r.language)
      .filter((l): l is string => !!l);
    return Array.from(new Set(langs)).sort();
  }, [portfolio]);

  // Derived: filtered + sorted repos
  const filteredRepos = useMemo(() => {
    if (!portfolio) return [];
    let list = [...portfolio.repos];
    if (repoSearch.trim()) {
      const q = repoSearch.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (r.topics || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (langFilter !== "all") {
      list = list.filter((r) => r.language === langFilter);
    }
    list.sort((a, b) => {
      if (repoSort === "stars") return b.stargazers_count - a.stargazers_count;
      if (repoSort === "forks") return b.forks_count - a.forks_count;
      if (repoSort === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (repoSort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [portfolio, repoSearch, repoSort, langFilter]);

  if (step === "landing") {
    return (
      <div className={`min-h-screen bg-background ${themeClass} scan-effect`}>
        <div className="relative min-h-screen flex flex-col">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

          {/* Nav */}
          <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-mono font-bold text-sm text-foreground">DevFolio</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              v2.1.0
            </div>
          </nav>

          {/* Hero */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Portfolio in under 1 minute
            </div>

            <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
              <span className="text-foreground">Your dev story,</span>
              <br />
              <span className="gradient-text">beautifully told.</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
              Import from GitHub, pick a theme, customize your profile — portfolio ready in{" "}
              <span className="text-primary font-mono font-semibold">60 seconds</span>.
            </p>

            <div className="w-full max-w-lg mb-12 p-6 rounded-2xl border border-border card-bg card-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Github className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-card-foreground font-mono">
                  Import GitHub Projects
                </span>
              </div>
              <GitHubImport onImport={handleImport} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl w-full">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-secondary/20">
                    <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-foreground">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) return null;

  const tabs = [
    { id: "github" as const, icon: Github, label: "Projects" },
    { id: "theme" as const, icon: Palette, label: "Theme" },
    { id: "profile" as const, icon: User, label: "Profile" },
    { id: "skills" as const, icon: Code2, label: "Skills" },
    { id: "preview" as const, icon: LayoutGrid, label: "Preview" },
  ];

  const featuredRepos = portfolio.pinnedRepos.length > 0
    ? portfolio.repos.filter((r) => portfolio.pinnedRepos.includes(r.id))
    : portfolio.repos.slice(0, 6);

  const totalStars = portfolio.repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = portfolio.repos.reduce((s, r) => s + r.forks_count, 0);

  return (
    <div className={`min-h-screen bg-background ${themeClass}`}>
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("landing")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono font-bold text-sm hidden sm:block text-foreground">DevFolio</span>
          </button>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5">
            <img
              src={portfolio.avatar}
              alt={portfolio.name}
              className="w-6 h-6 rounded-full border border-border"
            />
            <span className="text-xs font-mono text-muted-foreground">@{portfolio.username}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep("landing")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Re-import</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Link className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg gradient-bg text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-70 transition-all glow"
          >
            {exporting ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            Export HTML
          </button>
        </div>
      </nav>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 sm:px-6 py-2 border-b border-border overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
              {t.id === "github" && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
                  {portfolio.repos.length}
                </span>
              )}
              {t.id === "skills" && portfolio.skills.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
                  {portfolio.skills.length}
                </span>
              )}
              {t.id === "preview" && (
                <Eye className="w-3 h-3 ml-0.5 opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* GitHub Projects tab */}
        {activeTab === "github" && (
          <div className="space-y-5">
            {/* Header stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Repositories", value: portfolio.repos.length, icon: Github },
                { label: "Total Stars", value: totalStars, icon: Star },
                { label: "Total Forks", value: totalForks, icon: GitFork },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-border card-bg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-black gradient-text leading-none">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Search + filter bar */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  placeholder="Search repos..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground font-mono text-xs focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Language filter */}
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={langFilter}
                  onChange={(e) => setLangFilter(e.target.value)}
                  className="px-2 py-2 rounded-lg bg-secondary border border-border text-foreground font-mono text-xs focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="all">All Languages</option>
                  {uniqueLangs.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-1">
                <SortAsc className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={repoSort}
                  onChange={(e) => setRepoSort(e.target.value as SortOption)}
                  className="px-2 py-2 rounded-lg bg-secondary border border-border text-foreground font-mono text-xs focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="stars">Most Stars</option>
                  <option value="forks">Most Forks</option>
                  <option value="updated">Recently Updated</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>

              <button
                onClick={() => setActiveTab("skills")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
              >
                <Pin className="w-3.5 h-3.5" />
                Pin featured
              </button>
            </div>

            {/* Results count */}
            {(repoSearch || langFilter !== "all") && (
              <p className="text-xs text-muted-foreground font-mono">
                Showing <span className="text-primary font-semibold">{filteredRepos.length}</span> of {portfolio.repos.length} repos
                {repoSearch && <> matching "<span className="text-foreground">{repoSearch}</span>"</>}
                {langFilter !== "all" && <> in <span className="text-foreground">{langFilter}</span></>}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <ProjectCard key={repo.id} repo={repo} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-muted-foreground text-sm font-mono">
                  No repos match your search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Theme tab */}
        {activeTab === "theme" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="font-bold text-lg text-foreground">Choose a Theme</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Your entire portfolio changes instantly — 5 themes available</p>
            </div>
            <ThemeSelector currentTheme={theme} onChange={setTheme} />
            <div className="p-4 rounded-xl border border-border card-bg">
              <p className="text-xs font-mono text-muted-foreground mb-2">// Theme preview</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-bg animate-pulse-glow" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2 w-3/4 rounded-full gradient-bg opacity-80" />
                  <div className="h-1.5 w-1/2 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="space-y-5 max-w-md">
            <div>
              <h2 className="font-bold text-lg text-foreground">Edit Profile</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Click any field to edit inline</p>
            </div>
            <ProfileEditor
              name={portfolio.name}
              bio={portfolio.bio}
              avatar={portfolio.avatar}
              username={portfolio.username}
              location={portfolio.location}
              website={portfolio.website}
              twitter={portfolio.twitter}
              linkedin={portfolio.linkedin}
              onUpdate={handleProfileUpdate}
            />
          </div>
        )}

        {/* Skills tab */}
        {activeTab === "skills" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="font-bold text-lg text-foreground">Skills & Featured Repos</h2>
              <p className="text-xs text-muted-foreground mt-0.5">These appear prominently in your exported portfolio</p>
            </div>

            <SkillsEditor
              skills={portfolio.skills}
              onChange={(skills) => handleProfileUpdate({ skills })}
            />

            <div className="rounded-xl border border-border card-bg p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-card-foreground">Pin Featured Projects</span>
              </div>
              <RepoPinSelector
                repos={portfolio.repos}
                pinnedIds={portfolio.pinnedRepos}
                onChange={(pinnedRepos) => handleProfileUpdate({ pinnedRepos })}
              />
            </div>
          </div>
        )}

        {/* Preview tab */}
        {activeTab === "preview" && (
          <div className="space-y-8">
            {/* Profile hero */}
            <div className="rounded-2xl border border-border card-bg overflow-hidden card-shadow">
              <div className="h-24 gradient-bg opacity-30" />
              <div className="px-6 pb-6 -mt-10">
                <img
                  src={portfolio.avatar}
                  alt={portfolio.name}
                  className="w-20 h-20 rounded-2xl border-4 border-background object-cover"
                />
                <div className="mt-3">
                  <h1 className="text-2xl font-black text-foreground">{portfolio.name}</h1>
                  <p className="font-mono text-sm text-muted-foreground">@{portfolio.username}</p>
                  {portfolio.bio && (
                    <p className="mt-2 text-sm text-foreground/80 max-w-lg">{portfolio.bio}</p>
                  )}
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    {portfolio.location && (
                      <span className="text-xs text-muted-foreground">📍 {portfolio.location}</span>
                    )}
                    {portfolio.website && (
                      <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">🔗 {portfolio.website}</a>
                    )}
                    {portfolio.twitter && (
                      <a href={`https://twitter.com/${portfolio.twitter.replace("@","")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">🐦 {portfolio.twitter}</a>
                    )}
                    {portfolio.linkedin && (
                      <a href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">💼 LinkedIn</a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Repositories", value: portfolio.repos.length },
                { label: "Total Stars", value: totalStars },
                { label: "Total Forks", value: totalForks },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border card-bg p-4 text-center card-shadow">
                  <p className="text-2xl font-black gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            {portfolio.skills.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-foreground">Skills & Technologies</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-mono font-semibold border border-primary/40 bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-foreground">Featured Projects</h2>
                </div>
                {portfolio.pinnedRepos.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                    <Pin className="w-3 h-3" /> {portfolio.pinnedRepos.length} pinned
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredRepos.map((repo) => (
                  <ProjectCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>

            {/* Export CTA */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto glow">
                <Download className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Ready to publish?</h3>
                <p className="text-xs text-muted-foreground mt-1">Download a self-contained HTML file you can host anywhere — Netlify, GitHub Pages, Vercel.</p>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-bg text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-70 transition-all glow"
                >
                  {exporting ? (
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Download HTML
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:border-primary/50 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Share Link"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
