import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { ThemeSelector, Theme, CustomThemeColors } from "@/components/ThemeSelector";
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
  ArrowRight,
  FileCode,
  Rocket,
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
    accent: "hsl(var(--accent))",
  },
  {
    icon: Palette,
    title: "5 Unique Themes",
    desc: "Terminal dark, minimal light, cyberpunk, ocean depth, and sunset — each pixel-perfect and ready to ship.",
    accent: "hsl(var(--primary))",
  },
  {
    icon: Globe,
    title: "Self-Contained Export",
    desc: "One HTML file with all styles baked in. Host on Netlify, GitHub Pages, or any static host for free.",
    accent: "hsl(195 100% 50%)",
  },
  {
    icon: Shield,
    title: "No Account Needed",
    desc: "Zero sign-ups, zero data stored. Everything runs in your browser — your data stays yours.",
    accent: "hsl(142 76% 45%)",
  },
  {
    icon: Layers,
    title: "Skills & Tech Stack",
    desc: "Showcase your languages and frameworks with a beautiful tag cloud in your exported portfolio.",
    accent: "hsl(270 80% 65%)",
  },
  {
    icon: Pin,
    title: "Pin Featured Work",
    desc: "Curate up to 6 repositories to appear front-and-center. Let your best work lead the conversation.",
    accent: "hsl(25 95% 58%)",
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

const themes = [
  { name: "Terminal", colors: ["#22c55e", "#0ea5e9"], bg: "#0d1117", accent: "#22c55e" },
  { name: "Minimal", colors: ["#3b82f6", "#60a5fa"], bg: "#f8fafc", accent: "#3b82f6" },
  { name: "Cyberpunk", colors: ["#e040fb", "#facc15"], bg: "#110a1c", accent: "#e040fb" },
  { name: "Ocean", colors: ["#00bcd4", "#34d399"], bg: "#0d1e2e", accent: "#00bcd4" },
  { name: "Sunset", colors: ["#f97316", "#ec4899"], bg: "#150c05", accent: "#f97316" },
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
      const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Stats Banner
function StatsBanner({ statsVisible, statsRef }: { statsVisible: boolean; statsRef: React.RefObject<HTMLDivElement> }) {
  const c1 = useCounter(10000, 2000, statsVisible);
  const c2 = useCounter(85000, 2000, statsVisible);
  const c3 = useCounter(5, 1000, statsVisible);
  const c4 = useCounter(60, 1200, statsVisible);
  const stats = [
    { label: "Portfolios Built", value: c1, suffix: "+", icon: Users },
    { label: "GitHub Repos Imported", value: c2, suffix: "+", icon: Github },
    { label: "Themes Available", value: c3, suffix: "", icon: Palette },
    { label: "Seconds to Build", value: c4, suffix: "s", icon: Clock },
  ];
  return (
    <div ref={statsRef} className="border-y border-border py-12 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="relative max-w-4xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-1">
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-3xl font-black gradient-text font-mono">
                {stat.value.toLocaleString()}{stat.suffix}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

export default function Index() {
  const [step, setStep] = useState<Step>("landing");
  const [theme, setTheme] = useState<Theme>("default");
  const [customColors, setCustomColors] = useState<CustomThemeColors>({
    bg: "#0d1117", fg: "#c9d1d9", primary: "#58a6ff",
    accent: "#79c0ff", card: "#161b22", border: "#30363d",
  });
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<"github" | "theme" | "profile" | "skills" | "preview">("github");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [hoveredTheme, setHoveredTheme] = useState<number | null>(null);

  // Repo filtering state
  const [repoSearch, setRepoSearch] = useState("");
  const [repoSort, setRepoSort] = useState<SortOption>("stars");
  const [langFilter, setLangFilter] = useState<string>("all");

  // Intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll reveal
  useScrollReveal();

  // Inject custom theme CSS variables into document root
  useEffect(() => {
    if (theme !== "custom") return;
    const hexToHsl = (hex: string): string => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    const root = document.documentElement;
    if (customColors.bg.length === 7) root.style.setProperty("--background", hexToHsl(customColors.bg));
    if (customColors.fg.length === 7) root.style.setProperty("--foreground", hexToHsl(customColors.fg));
    if (customColors.primary.length === 7) {
      root.style.setProperty("--primary", hexToHsl(customColors.primary));
      root.style.setProperty("--ring", hexToHsl(customColors.primary));
    }
    if (customColors.accent.length === 7) root.style.setProperty("--accent", hexToHsl(customColors.accent));
    if (customColors.card.length === 7) {
      root.style.setProperty("--card", hexToHsl(customColors.card));
      root.style.setProperty("--muted", hexToHsl(customColors.card));
    }
    if (customColors.border.length === 7) {
      root.style.setProperty("--border", hexToHsl(customColors.border));
      root.style.setProperty("--input", hexToHsl(customColors.border));
    }
    return () => {
      ["--background","--foreground","--primary","--ring","--accent","--card","--muted","--border","--input"]
        .forEach((v) => root.style.removeProperty(v));
    };
  }, [theme, customColors]);

  const themeClass =
    theme === "default" ? "" :
    theme === "minimal" ? "theme-minimal" :
    theme === "cyberpunk" ? "theme-cyberpunk" :
    theme === "sunset" ? "theme-sunset" :
    theme === "forest" ? "theme-forest" :
    theme === "arctic" ? "theme-arctic" :
    theme === "midnight" ? "theme-midnight" :
    theme === "volcano" ? "theme-volcano" :
    theme === "custom" ? "" :
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

  const handleExport = useCallback(() => {
    if (!portfolio) return;
    setExporting(true);
    try {
      downloadPortfolio({ ...portfolio, linkedin: portfolio.linkedin || "" }, theme, customColors);
      toast({ title: "✅ Portfolio exported!", description: `${portfolio.username}-portfolio.html downloaded.` });
    } catch {
      toast({ title: "Export failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setTimeout(() => setExporting(false), 800);
    }
  }, [portfolio, theme, customColors]);

  const handleCopyLink = useCallback(() => {
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
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
      const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "🔗 Link copied!", description: "Share this link to show your portfolio." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Could not copy link.", variant: "destructive" });
    }
  }, [portfolio, theme]);

  // Derived: unique languages for filter
  const uniqueLangs = useMemo(() => {
    if (!portfolio) return [];
    const langs = portfolio.repos.map((r) => r.language).filter((l): l is string => !!l);
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

  /* ================================================================
     LANDING PAGE
     ================================================================ */
  if (step === "landing") {
    return (
      <div className={`min-h-screen bg-background ${themeClass} scan-effect`}>

        {/* ── Sticky Nav ── */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border/40 glass">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center glow animate-pulse-glow">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono font-bold text-sm text-foreground tracking-tight">DevFolio</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors px-3 py-1.5 rounded-lg border border-border/40 hover:border-primary/40"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono border border-border/40 px-2.5 py-1.5 rounded-full bg-primary/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              v2.1.0
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          {/* Layered backgrounds */}
          <div className="absolute inset-0 bg-cover bg-center opacity-8" style={{ backgroundImage: `url(${heroBg})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          <div className="absolute inset-0 dot-grid opacity-30" />

          {/* Glow orbs */}
          <div className="absolute top-24 left-1/4 w-80 h-80 rounded-full opacity-[0.07] blur-3xl" style={{ background: "hsl(var(--primary))" }} />
          <div className="absolute top-40 right-1/4 w-56 h-56 rounded-full opacity-[0.06] blur-3xl" style={{ background: "hsl(var(--accent))" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 blur-3xl opacity-10" style={{ background: "hsl(var(--primary))" }} />

          <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center pt-24 pb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-8 animate-fade-up neon-border">
              <Sparkles className="w-3.5 h-3.5" />
              Free · No signup · Works in 60 seconds
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1" />
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight animate-fade-up-delay-1">
              <span className="text-foreground">Your dev story,</span>
              <br />
              <span className="gradient-text">beautifully told.</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-xl max-w-xl mb-5 leading-relaxed animate-fade-up-delay-2">
              Import from GitHub, pick a theme, customize your profile — portfolio ready in{" "}
              <span className="text-primary font-mono font-semibold">60 seconds</span>.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-4 mb-10 flex-wrap justify-center animate-fade-up-delay-2">
              {[
                { icon: Users, text: "10,000+ portfolios built" },
                { icon: Star, text: "No account needed" },
                { icon: Shield, text: "100% private" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Import card */}
            <div className="w-full max-w-lg mb-12 p-6 rounded-2xl glass neon-border animate-fade-up-delay-3 animate-scale-in">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
                  <Github className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-card-foreground font-mono">
                  Start with your GitHub username
                </span>
              </div>
              <GitHubImport onImport={handleImport} />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full animate-fade-up-delay-3">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="relative flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 glass hover:border-primary/40 hover:neon-border transition-all hover:-translate-y-1 cursor-default"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="absolute -top-2.5 -left-1.5 w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-mono font-bold text-[10px] glow">
                      {i + 1}
                    </div>
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
        </section>

        {/* ── Stats ── */}
        <StatsBanner statsVisible={statsVisible} statsRef={statsRef} />

        {/* ── Features Grid ── */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-secondary/30 text-muted-foreground text-xs font-mono mb-4">
              <Layers className="w-3.5 h-3.5" />
              Everything you need
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
              Built for <span className="gradient-text">developers</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
              Every feature is designed to take your GitHub projects and turn them into a professional portfolio in record time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="reveal group relative p-6 rounded-2xl border border-border/50 card-bg card-hover overflow-hidden"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {/* Accent glow on hover */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: f.accent }}
                  />
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.accent}20`, border: `1px solid ${f.accent}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.accent }} />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-2">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Theme Showcase ── */}
        <section className="border-t border-border bg-secondary/5 py-24 relative overflow-hidden">
          <div className="absolute inset-0 line-grid opacity-30" />
          <div className="relative max-w-5xl mx-auto px-6">
            <div className="text-center mb-14 reveal">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
                5 stunning <span className="gradient-text">themes</span>
              </h2>
              <p className="text-muted-foreground text-sm">Pick the aesthetic that matches your personality</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 reveal">
              {themes.map((t, i) => (
                <div
                  key={t.name}
                  className="group rounded-2xl border border-border overflow-hidden transition-all duration-300 cursor-pointer"
                  style={{
                    transform: hoveredTheme === i ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                    boxShadow: hoveredTheme === i ? `0 16px 40px ${t.accent}30` : "none",
                    borderColor: hoveredTheme === i ? `${t.accent}60` : undefined,
                  }}
                  onMouseEnter={() => setHoveredTheme(i)}
                  onMouseLeave={() => setHoveredTheme(null)}
                >
                  {/* Preview */}
                  <div className="h-28 relative p-3 flex flex-col gap-1.5" style={{ background: t.bg }}>
                    {/* Fake nav bar */}
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 rounded-full opacity-60" style={{ background: t.colors[0] }} />
                      <div className="flex-1 h-1.5 rounded-full opacity-20" style={{ background: t.colors[0] }} />
                    </div>
                    {/* Fake heading */}
                    <div className="h-2.5 w-3/4 rounded-full" style={{ background: `${t.colors[0]}cc` }} />
                    <div className="h-1.5 w-1/2 rounded-full" style={{ background: `${t.colors[1]}66` }} />
                    {/* Fake cards */}
                    <div className="mt-auto flex gap-1.5">
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          className="flex-1 h-7 rounded-lg"
                          style={{ background: `${t.colors[0]}18`, border: `1px solid ${t.colors[0]}22` }}
                        />
                      ))}
                    </div>
                    {/* Accent dot */}
                    <div
                      className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
                      style={{ background: t.colors[0], boxShadow: `0 0 6px ${t.colors[0]}80` }}
                    />
                  </div>
                  {/* Label */}
                  <div className="p-2.5 border-t" style={{ background: `${t.bg}ee`, borderColor: `${t.colors[0]}20` }}>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-mono font-bold" style={{ color: t.colors[0] }}>{t.name}</p>
                      <div className="flex gap-1">
                        {t.colors.map((c, ci) => (
                          <div key={ci} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 bg-secondary/30 text-muted-foreground text-xs font-mono mb-4">
              <Rocket className="w-3.5 h-3.5" />
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">
              Ready in <span className="gradient-text">4 steps</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-8 left-8 right-8 h-px gradient-bg opacity-20 hidden sm:block" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 reveal">
              {[
                { icon: Github, title: "Import GitHub", desc: "Enter your username and we fetch everything automatically.", num: "01" },
                { icon: Palette, title: "Choose Theme", desc: "Select from 5 hand-crafted themes that fit your style.", num: "02" },
                { icon: User, title: "Edit Profile", desc: "Tweak your bio, skills, social links, and pin your best repos.", num: "03" },
                { icon: FileCode, title: "Export & Share", desc: "Download one HTML file. Host it anywhere, share the link.", num: "04" },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-3 group">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center glow group-hover:animate-pulse-glow transition-all">
                        <Icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                        <span className="text-[9px] font-black font-mono text-primary">{step.num}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 py-20">
          <div className="text-center mb-10 reveal">
            <h2 className="text-3xl font-black text-foreground mb-2">
              Common <span className="gradient-text">questions</span>
            </h2>
            <p className="text-muted-foreground text-sm">Everything you need to know before getting started</p>
          </div>

          <div className="space-y-2 reveal">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-border overflow-hidden transition-all duration-200"
                style={{ borderColor: openFaq === i ? "hsl(var(--primary) / 0.4)" : undefined }}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openFaq === i ? "200px" : "0" }}
                >
                  <div className="px-5 pb-4 pt-0 border-t border-border/50">
                    <p className="text-sm text-muted-foreground leading-relaxed pt-3">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="border-t border-border bg-secondary/5 py-20 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] blur-3xl opacity-5 rounded-full" style={{ background: "hsl(var(--primary))" }} />
          <div className="relative max-w-2xl mx-auto px-6 text-center reveal">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 glow animate-float">
              <Terminal className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
              Ready to build your <span className="gradient-text">portfolio</span>?
            </h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              It takes under 60 seconds. No account, no credit card, no setup required.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => document.querySelector("input")?.focus()}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-bg text-primary-foreground font-bold text-sm hover:opacity-90 transition-all glow hover:scale-105"
              >
                <Github className="w-4 h-4" />
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Check className="w-3.5 h-3.5 text-primary" />
                No signup needed
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-border py-8 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
                <Terminal className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-mono text-xs text-muted-foreground font-semibold">DevFolio</span>
              <span className="text-border">—</span>
              <span className="font-mono text-xs text-muted-foreground">built for developers</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground font-mono">
              {["Free forever", "No tracking", "Open source friendly"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-primary" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    );
  }

  /* ================================================================
     BUILDER
     ================================================================ */
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

      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border glass">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("landing")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center glow">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono font-bold text-sm hidden sm:block text-foreground">DevFolio</span>
          </button>
          <span className="text-border text-xs">|</span>
          <div className="flex items-center gap-1.5">
            <img
              src={portfolio.avatar}
              alt={portfolio.name}
              className="w-6 h-6 rounded-full border-2 border-primary/40"
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

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 px-4 sm:px-6 py-2 border-b border-border overflow-x-auto bg-background/60 backdrop-blur-sm">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-lg gradient-bg opacity-90" />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{t.label}</span>
              {t.id === "github" && (
                <span className={`relative z-10 ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                  {portfolio.repos.length}
                </span>
              )}
              {t.id === "skills" && portfolio.skills.length > 0 && (
                <span className={`relative z-10 ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                  {portfolio.skills.length}
                </span>
              )}
              {t.id === "preview" && (
                <Eye className="w-3 h-3 ml-0.5 relative z-10 opacity-70" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Projects Tab */}
        {activeTab === "github" && (
          <div className="space-y-5 animate-fade-up">
            {/* Header stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Repositories", value: portfolio.repos.length, icon: Github },
                { label: "Total Stars", value: totalStars, icon: Star },
                { label: "Total Forks", value: totalForks, icon: GitFork },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-border card-bg p-3 flex items-center gap-3 card-hover">
                    <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0 glow">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-xl font-black gradient-text leading-none">{stat.value.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Search + filter bar */}
            <div className="flex flex-wrap gap-2 items-center p-3 rounded-xl border border-border bg-secondary/20">
              <div className="relative flex-1 min-w-44">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  placeholder="Search repos..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground font-mono text-xs focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={langFilter}
                  onChange={(e) => setLangFilter(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono text-xs focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="all">All Languages</option>
                  {uniqueLangs.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <SortAsc className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={repoSort}
                  onChange={(e) => setRepoSort(e.target.value as SortOption)}
                  className="px-2 py-1.5 rounded-lg bg-background border border-border text-foreground font-mono text-xs focus:outline-none focus:border-primary transition-all cursor-pointer"
                >
                  <option value="stars">Most Stars</option>
                  <option value="forks">Most Forks</option>
                  <option value="updated">Recently Updated</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
              <button
                onClick={() => setActiveTab("skills")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
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
                <div className="col-span-3 flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <Search className="w-8 h-8 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground text-sm font-mono">No repos match your search.</p>
                  <button
                    onClick={() => { setRepoSearch(""); setLangFilter("all"); }}
                    className="text-xs text-primary hover:underline font-mono"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === "theme" && (
          <div className="space-y-6 max-w-2xl animate-fade-up">
            <div>
              <h2 className="font-bold text-lg text-foreground">Choose a Theme</h2>
              <p className="text-xs text-muted-foreground mt-0.5">9 preset themes + build your own custom theme</p>
            </div>
            <ThemeSelector
              currentTheme={theme}
              onChange={setTheme}
              customColors={customColors}
              onCustomColorsChange={setCustomColors}
            />
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                The chosen theme is embedded in your exported HTML — switch to <strong>Preview</strong> to see how it looks!
              </p>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-5 max-w-md animate-fade-up">
            <div>
              <h2 className="font-bold text-lg text-foreground">Edit Profile</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Customize how you appear in the exported portfolio</p>
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

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-6 max-w-xl animate-fade-up">
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
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  {portfolio.pinnedRepos.length}/6 selected
                </span>
              </div>
              <RepoPinSelector
                repos={portfolio.repos}
                pinnedIds={portfolio.pinnedRepos}
                onChange={(pinnedRepos) => handleProfileUpdate({ pinnedRepos })}
              />
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === "preview" && (
          <div className="space-y-6 animate-fade-up">
            {/* Profile hero */}
            <div className="rounded-2xl border border-border card-bg overflow-hidden card-shadow">
              {/* Banner */}
              <div className="h-32 gradient-bg relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-20" />
              </div>
              {/* Profile row — avatar sits half over the banner */}
              <div className="px-6 pt-0 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                  <img
                    src={portfolio.avatar}
                    alt={portfolio.name}
                    className="w-20 h-20 rounded-2xl border-4 border-card object-cover glow shrink-0 bg-background"
                  />
                  <div className="sm:pb-1 min-w-0 flex-1">
                    <h1 className="text-2xl font-black text-foreground leading-tight">{portfolio.name}</h1>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">@{portfolio.username}</p>
                  </div>
                </div>
                <div className="mt-4">
                  {portfolio.bio && (
                    <p className="text-sm text-foreground/80 max-w-lg leading-relaxed">{portfolio.bio}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {portfolio.location && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>📍</span>{portfolio.location}
                      </span>
                    )}
                    {portfolio.website && (
                      <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Globe className="w-3 h-3" />{portfolio.website}
                      </a>
                    )}
                    {portfolio.twitter && (
                      <a href={`https://twitter.com/${portfolio.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        🐦 {portfolio.twitter}
                      </a>
                    )}
                    {portfolio.linkedin && (
                      <a href={portfolio.linkedin.startsWith("http") ? portfolio.linkedin : `https://${portfolio.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        💼 LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Repositories", value: portfolio.repos.length, icon: Github },
                { label: "Total Stars", value: totalStars, icon: Star },
                { label: "Total Forks", value: totalForks, icon: GitFork },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-xl border border-border card-bg p-4 text-center">
                    <Icon className="w-4 h-4 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-black gradient-text">{stat.value.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Skills */}
            {portfolio.skills.length > 0 && (
              <div className="rounded-xl border border-border card-bg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-sm text-foreground">Skills & Technologies</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-xs font-mono font-semibold border border-primary/30 bg-primary/8 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Featured projects */}
            <div className="rounded-xl border border-border card-bg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-sm text-foreground">Featured Projects</h2>
                </div>
                {portfolio.pinnedRepos.length > 0 && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/20">
                    <Pin className="w-3 h-3" /> {portfolio.pinnedRepos.length} pinned
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {featuredRepos.map((repo) => (
                  <ProjectCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>

            {/* Export CTA */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center space-y-4 gradient-border">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto glow animate-float">
                <Download className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Ready to publish?</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                  Download a self-contained HTML file you can host anywhere — Netlify, GitHub Pages, Vercel.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl gradient-bg text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-70 transition-all glow hover:scale-105"
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
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:border-primary/50 transition-all"
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
