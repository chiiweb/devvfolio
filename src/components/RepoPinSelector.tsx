import { Pin, PinOff, Star } from "lucide-react";
import { GitHubRepo } from "./ProjectCard";

interface RepoPinSelectorProps {
  repos: GitHubRepo[];
  pinnedIds: number[];
  onChange: (ids: number[]) => void;
}

export function RepoPinSelector({ repos, pinnedIds, onChange }: RepoPinSelectorProps) {
  const toggle = (id: number) => {
    if (pinnedIds.includes(id)) {
      onChange(pinnedIds.filter((p) => p !== id));
    } else if (pinnedIds.length < 6) {
      onChange([...pinnedIds, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Select up to <span className="text-primary font-semibold">6 featured repos</span> — these appear first in your portfolio.
        </p>
        <span className="text-xs font-mono text-muted-foreground">{pinnedIds.length}/6</span>
      </div>

      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {repos.map((repo) => {
          const pinned = pinnedIds.includes(repo.id);
          const disabled = !pinned && pinnedIds.length >= 6;
          return (
            <button
              key={repo.id}
              onClick={() => !disabled && toggle(repo.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
                pinned
                  ? "border-primary/50 bg-primary/10"
                  : disabled
                  ? "border-border opacity-40 cursor-not-allowed"
                  : "border-border hover:border-primary/30 bg-secondary/30 hover:bg-secondary/50"
              }`}
            >
              {pinned ? (
                <Pin className="w-3.5 h-3.5 text-primary shrink-0" />
              ) : (
                <PinOff className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-mono font-semibold truncate ${pinned ? "text-primary" : "text-card-foreground"}`}>
                  {repo.name}
                </p>
                {repo.description && (
                  <p className="text-[10px] text-muted-foreground truncate">{repo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0 text-[10px] text-muted-foreground">
                <Star className="w-3 h-3" />
                {repo.stargazers_count}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
