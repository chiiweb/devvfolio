import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { ThemeSelector, Theme } from "@/components/ThemeSelector";
import { GitHubImport } from "@/components/GitHubImport";
import { ProjectCard, GitHubRepo } from "@/components/ProjectCard";
import { ProfileEditor } from "@/components/ProfileEditor";
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
  ChevronRight,
  Sparkles,
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
}

const steps = [
  { icon: Github, label: "Import from GitHub", desc: "Auto-fetch all your projects" },
  { icon: Palette, label: "Pick a theme", desc: "4 stunning designs" },
  { icon: User, label: "Customize profile", desc: "Edit your info inline" },
  { icon: Download, label: "Export & publish", desc: "Share your portfolio" },
];

export default function Index() {
  const [step, setStep] = useState<Step>("landing");
  const [theme, setTheme] = useState<Theme>("default");
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<"github" | "theme" | "profile" | "preview">("github");

  const themeClass =
    theme === "default"
      ? ""
      : theme === "minimal"
      ? "theme-minimal"
      : theme === "cyberpunk"
      ? "theme-cyberpunk"
      : "theme-ocean";

  const handleImport = (
    username: string,
    repos: GitHubRepo[],
    avatar: string,
    bio: string,
    name: string
  ) => {
    setPortfolio({ username, repos, avatar, bio, name, location: "", website: "", twitter: "" });
    setStep("builder");
    setActiveTab("theme");
  };

  const handleProfileUpdate = (updates: Partial<PortfolioData>) => {
    setPortfolio((p) => (p ? { ...p, ...updates } : p));
  };

  if (step === "landing") {
    return (
      <div className={`min-h-screen bg-background ${themeClass} scan-effect`}>
        {/* Hero */}
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
              v1.0.0
            </div>
          </nav>

          {/* Hero Content */}
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

            {/* Import Section */}
            <div className="w-full max-w-lg mb-12 p-6 rounded-2xl border border-border card-bg card-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Github className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-card-foreground font-mono">
                  Import GitHub Projects
                </span>
              </div>
              <GitHubImport onImport={handleImport} />
            </div>

            {/* Steps */}
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
                    {i < steps.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-muted-foreground hidden sm:block absolute right-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Builder view
  if (!portfolio) return null;

  const tabs = [
    { id: "github" as const, icon: Github, label: "Projects" },
    { id: "theme" as const, icon: Palette, label: "Theme" },
    { id: "profile" as const, icon: User, label: "Profile" },
    { id: "preview" as const, icon: LayoutGrid, label: "Preview" },
  ];

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
            Re-import
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg gradient-bg text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all glow">
            <Download className="w-3.5 h-3.5" />
            Export
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
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* GitHub Projects tab */}
        {activeTab === "github" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-foreground">Your Projects</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {portfolio.repos.length} repos imported from @{portfolio.username}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Star className="w-3.5 h-3.5 text-primary" />
                {portfolio.repos.reduce((sum, r) => sum + r.stargazers_count, 0)} total stars
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.repos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
          </div>
        )}

        {/* Theme tab */}
        {activeTab === "theme" && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="font-bold text-lg text-foreground">Choose a Theme</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your entire portfolio changes instantly
              </p>
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
              onUpdate={handleProfileUpdate}
            />
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
                  <div className="flex items-center gap-4 mt-3">
                    {portfolio.location && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        📍 {portfolio.location}
                      </span>
                    )}
                    {portfolio.website && (
                      <a
                        href={portfolio.website}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        🔗 {portfolio.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Repositories", value: portfolio.repos.length },
                {
                  label: "Total Stars",
                  value: portfolio.repos.reduce((s, r) => s + r.stargazers_count, 0),
                },
                {
                  label: "Total Forks",
                  value: portfolio.repos.reduce((s, r) => s + r.forks_count, 0),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border card-bg p-4 text-center card-shadow"
                >
                  <p className="text-2xl font-black gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Projects grid */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-foreground">Featured Projects</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.repos.slice(0, 6).map((repo) => (
                  <ProjectCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
