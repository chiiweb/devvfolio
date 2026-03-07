import { useState } from "react";
import { Github, Loader2, Search, AlertCircle } from "lucide-react";
import { GitHubRepo } from "./ProjectCard";

interface GitHubImportProps {
  onImport: (username: string, repos: GitHubRepo[], avatar: string, bio: string, name: string) => void;
}

export function GitHubImport({ onImport }: GitHubImportProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username.trim()}`),
        fetch(`https://api.github.com/users/${username.trim()}/repos?sort=stars&per_page=12`),
      ]);

      if (!userRes.ok) {
        throw new Error(userRes.status === 404 ? "GitHub user not found" : "Failed to fetch GitHub data");
      }

      const userData = await userRes.json();
      const reposData: GitHubRepo[] = await reposRes.json();

      // Filter out forks for cleaner display
      const ownRepos = reposData.filter((r) => !r.fork);

      onImport(
        username.trim(),
        ownRepos,
        userData.avatar_url,
        userData.bio || "",
        userData.name || username.trim()
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImport()}
              placeholder="Enter GitHub username..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <button
            onClick={handleImport}
            disabled={!username.trim() || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? "Importing..." : "Import"}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-2 text-destructive text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">Try:</span>
        {["torvalds", "gaearon", "sindresorhus", "yyx990803"].map((name) => (
          <button
            key={name}
            onClick={() => setUsername(name)}
            className="px-2.5 py-1 rounded-full text-xs font-mono bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
          >
            @{name}
          </button>
        ))}
      </div>
    </div>
  );
}
