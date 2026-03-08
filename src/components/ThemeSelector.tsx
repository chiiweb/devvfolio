import { useState } from "react";
import { Monitor, Sun, Zap, Waves, Sunset, Leaf, Snowflake, Moon, Flame, Paintbrush, Check } from "lucide-react";

export type Theme =
  | "default" | "minimal" | "cyberpunk" | "ocean" | "sunset"
  | "forest" | "arctic" | "midnight" | "volcano" | "custom";

export interface CustomThemeColors {
  bg: string;
  fg: string;
  primary: string;
  accent: string;
  card: string;
  border: string;
}

interface ThemeSelectorProps {
  currentTheme: Theme;
  onChange: (theme: Theme) => void;
  customColors: CustomThemeColors;
  onCustomColorsChange: (colors: CustomThemeColors) => void;
}

const PRESET_THEMES = [
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
  {
    id: "sunset" as Theme,
    name: "Sunset",
    icon: Sunset,
    description: "Warm orange & rose",
    preview: ["#1a0a08", "#f97316", "#ec4899"],
  },
  {
    id: "forest" as Theme,
    name: "Forest",
    icon: Leaf,
    description: "Earthy greens & amber",
    preview: ["#0a130a", "#4ade80", "#fbbf24"],
  },
  {
    id: "arctic" as Theme,
    name: "Arctic",
    icon: Snowflake,
    description: "Icy white & cool blue",
    preview: ["#f0f7ff", "#38bdf8", "#64748b"],
  },
  {
    id: "midnight" as Theme,
    name: "Midnight",
    icon: Moon,
    description: "Deep indigo & violet",
    preview: ["#06050f", "#818cf8", "#a78bfa"],
  },
  {
    id: "volcano" as Theme,
    name: "Volcano",
    icon: Flame,
    description: "Crimson & molten gold",
    preview: ["#0f0606", "#ef4444", "#f59e0b"],
  },
];

const COLOR_PRESETS: Record<keyof CustomThemeColors, string> = {
  bg: "#0d1117",
  fg: "#c9d1d9",
  primary: "#58a6ff",
  accent: "#79c0ff",
  card: "#161b22",
  border: "#30363d",
};

const COLOR_LABELS: Record<keyof CustomThemeColors, string> = {
  bg: "Background",
  fg: "Text",
  primary: "Primary / Accent",
  accent: "Highlight",
  card: "Card Surface",
  border: "Borders",
};

export function ThemeSelector({ currentTheme, onChange, customColors, onCustomColorsChange }: ThemeSelectorProps) {
  const [showCustom, setShowCustom] = useState(currentTheme === "custom");

  const handlePresetClick = (id: Theme) => {
    onChange(id);
    setShowCustom(false);
  };

  const handleCustomClick = () => {
    onChange("custom");
    setShowCustom(true);
  };

  return (
    <div className="space-y-4">
      {/* Preset grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {PRESET_THEMES.map((theme) => {
          const Icon = theme.icon;
          const isActive = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => handlePresetClick(theme.id)}
              className={`relative group rounded-xl p-3 border-2 transition-all duration-200 text-left ${
                isActive ? "border-primary glow" : "border-border hover:border-primary/40"
              } card-bg`}
            >
              {/* Mini preview bar */}
              <div
                className="h-7 w-full rounded-lg mb-2.5 relative overflow-hidden"
                style={{ background: theme.preview[0] }}
              >
                <div className="absolute bottom-1 left-2 flex gap-1">
                  <div className="h-1.5 w-8 rounded-full" style={{ background: theme.preview[1] }} />
                  <div className="h-1.5 w-5 rounded-full opacity-60" style={{ background: theme.preview[2] }} />
                </div>
                <div className="absolute top-1 right-1.5 w-2 h-2 rounded-full" style={{ background: theme.preview[1] }} />
              </div>

              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className="w-3 h-3 text-primary shrink-0" />
                <span className="text-xs font-semibold text-card-foreground font-mono truncate">{theme.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">{theme.description}</p>

              {isActive && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full gradient-bg flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}

        {/* Custom theme card */}
        <button
          onClick={handleCustomClick}
          className={`relative group rounded-xl p-3 border-2 transition-all duration-200 text-left ${
            currentTheme === "custom" ? "border-primary glow" : "border-dashed border-border hover:border-primary/40"
          } card-bg`}
        >
          <div className="h-7 w-full rounded-lg mb-2.5 overflow-hidden flex">
            {(["bg", "primary", "accent"] as const).map((k) => (
              <div key={k} className="flex-1 h-full" style={{ background: customColors[k] }} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Paintbrush className="w-3 h-3 text-primary shrink-0" />
            <span className="text-xs font-semibold text-card-foreground font-mono">Custom</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Design your own theme</p>
          {currentTheme === "custom" && (
            <div className="absolute top-2 right-2 w-4 h-4 rounded-full gradient-bg flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          )}
        </button>
      </div>

      {/* Custom theme builder — shown when custom is selected */}
      {showCustom && currentTheme === "custom" && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3 animate-fade-up">
          <div className="flex items-center gap-2 mb-1">
            <Paintbrush className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Custom Theme Builder</span>
          </div>
          <p className="text-xs text-muted-foreground">Pick your colors — changes apply to the preview and export instantly.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(COLOR_LABELS) as Array<keyof CustomThemeColors>).map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] font-mono text-muted-foreground font-medium">{COLOR_LABELS[key]}</label>
                <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background">
                  <div className="relative w-7 h-7 rounded-md overflow-hidden shrink-0 border border-border">
                    <input
                      type="color"
                      value={customColors[key]}
                      onChange={(e) => onCustomColorsChange({ ...customColors, [key]: e.target.value })}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                    />
                    <div className="w-full h-full" style={{ background: customColors[key] }} />
                  </div>
                  <input
                    type="text"
                    value={customColors[key]}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                        onCustomColorsChange({ ...customColors, [key]: val });
                      }
                    }}
                    maxLength={7}
                    className="flex-1 bg-transparent text-foreground font-mono text-xs focus:outline-none min-w-0"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick presets row */}
          <div className="pt-1">
            <p className="text-[10px] text-muted-foreground font-mono mb-2">Quick presets:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "GitHub Dark", colors: { bg: "#0d1117", fg: "#c9d1d9", primary: "#58a6ff", accent: "#79c0ff", card: "#161b22", border: "#30363d" } },
                { name: "Dracula", colors: { bg: "#282a36", fg: "#f8f8f2", primary: "#bd93f9", accent: "#ff79c6", card: "#1e1f29", border: "#44475a" } },
                { name: "Solarized", colors: { bg: "#002b36", fg: "#839496", primary: "#2aa198", accent: "#268bd2", card: "#073642", border: "#073642" } },
                { name: "Monokai", colors: { bg: "#272822", fg: "#f8f8f2", primary: "#a6e22e", accent: "#66d9e8", card: "#1e1e18", border: "#3d3d35" } },
                { name: "Rose Pine", colors: { bg: "#191724", fg: "#e0def4", primary: "#c4a7e7", accent: "#eb6f92", card: "#1f1d2e", border: "#403d52" } },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onCustomColorsChange(preset.colors)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Live mini preview */}
          <div className="rounded-lg overflow-hidden border border-border mt-2" style={{ background: customColors.bg }}>
            <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: `1px solid ${customColors.border}` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: customColors.primary }} />
              <div className="h-1.5 w-16 rounded-full" style={{ background: `${customColors.primary}80` }} />
              <div className="ml-auto h-1.5 w-8 rounded-full" style={{ background: `${customColors.fg}30` }} />
            </div>
            <div className="p-3 space-y-2">
              <div className="h-3 w-3/4 rounded-full" style={{ background: `linear-gradient(90deg, ${customColors.primary}, ${customColors.accent})` }} />
              <div className="h-2 w-full rounded-full" style={{ background: `${customColors.fg}20` }} />
              <div className="h-2 w-2/3 rounded-full" style={{ background: `${customColors.fg}15` }} />
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 h-10 rounded-lg" style={{ background: customColors.card, border: `1px solid ${customColors.border}` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
