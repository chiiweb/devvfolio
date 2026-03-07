import { Monitor, Sun, Zap, Waves } from "lucide-react";

export type Theme = "default" | "minimal" | "cyberpunk" | "ocean";

interface ThemeSelectorProps {
  currentTheme: Theme;
  onChange: (theme: Theme) => void;
}

const themes = [
  {
    id: "default" as Theme,
    name: "Terminal",
    icon: Monitor,
    description: "Matrix green on dark",
    preview: ["#0d1117", "#22c55e", "#0ea5e9"],
  },
  {
    id: "minimal" as Theme,
    name: "Minimal",
    icon: Sun,
    description: "Clean & professional",
    preview: ["#f9fafb", "#3b82f6", "#6b7280"],
  },
  {
    id: "cyberpunk" as Theme,
    name: "Cyberpunk",
    icon: Zap,
    description: "Neon purple & gold",
    preview: ["#12080f", "#d946ef", "#facc15"],
  },
  {
    id: "ocean" as Theme,
    name: "Ocean",
    icon: Waves,
    description: "Deep blue & teal",
    preview: ["#071520", "#06b6d4", "#34d399"],
  },
];

export function ThemeSelector({ currentTheme, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {themes.map((theme) => {
        const Icon = theme.icon;
        const isActive = currentTheme === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`relative group rounded-xl p-3 border-2 transition-all duration-300 text-left ${
              isActive
                ? "border-primary glow"
                : "border-border hover:border-primary/50"
            } card-bg`}
          >
            {/* Color swatch */}
            <div className="flex gap-1 mb-2">
              {theme.preview.map((color, i) => (
                <div
                  key={i}
                  className="h-4 w-4 rounded-full border border-white/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 mb-0.5">
              <Icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-card-foreground font-mono">
                {theme.name}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">{theme.description}</p>

            {isActive && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            )}
          </button>
        );
      })}
    </div>
  );
}
