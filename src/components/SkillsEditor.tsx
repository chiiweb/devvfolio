import { useState } from "react";
import { X, Plus, Code2 } from "lucide-react";

const SUGGESTED_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "Go", "Rust",
  "Docker", "AWS", "PostgreSQL", "GraphQL", "Next.js", "Vue",
  "TailwindCSS", "Redis", "Kubernetes", "Git",
];

interface SkillsEditorProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [input, setInput] = useState("");

  const add = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput("");
  };

  const remove = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const suggestions = SUGGESTED_SKILLS.filter(
    (s) => !skills.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="rounded-xl border border-border card-bg p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Code2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-card-foreground">Skills & Technologies</span>
      </div>

      {/* Current skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border border-primary/40 bg-primary/10 text-primary"
            >
              {skill}
              <button
                onClick={() => remove(skill)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); add(input); }
            }}
            placeholder="Add a skill..."
            className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground font-mono text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <button
            onClick={() => add(input)}
            disabled={!input.trim()}
            className="flex items-center gap-1 px-3 py-2 rounded-lg gradient-bg text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div>
        <p className="text-[10px] text-muted-foreground mb-2 font-mono">Suggested:</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 10).map((s) => (
            <button
              key={s}
              onClick={() => add(s)}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-secondary border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
