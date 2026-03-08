import { useState } from "react";
import { MapPin, Link2, Twitter, Edit3, Check, X, Linkedin } from "lucide-react";

interface ProfileEditorProps {
  name: string;
  bio: string;
  avatar: string;
  username: string;
  onUpdate: (updates: { name?: string; bio?: string; location?: string; website?: string; twitter?: string; linkedin?: string }) => void;
  location: string;
  website: string;
  twitter: string;
  linkedin?: string;
}

export function ProfileEditor({
  name,
  bio,
  avatar,
  username,
  onUpdate,
  location,
  website,
  twitter,
  linkedin = "",
}: ProfileEditorProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState({
    name,
    bio,
    location,
    website,
    twitter,
    linkedin,
  });

  const save = (field: string) => {
    onUpdate({ [field]: tempValues[field as keyof typeof tempValues] });
    setEditing(null);
  };

  const cancel = () => {
    setTempValues({ name, bio, location, website, twitter, linkedin });
    setEditing(null);
  };

  const EditableField = ({
    field,
    value,
    placeholder,
    icon: Icon,
    multiline,
  }: {
    field: string;
    value: string;
    placeholder: string;
    icon: React.ComponentType<{ className?: string }>;
    multiline?: boolean;
  }) => (
    <div className="group flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
      {editing === field ? (
        <div className="flex-1 flex items-start gap-1.5">
          {multiline ? (
            <textarea
              value={tempValues[field as keyof typeof tempValues]}
              onChange={(e) =>
                setTempValues((p) => ({ ...p, [field]: e.target.value }))
              }
              className="flex-1 text-xs font-mono bg-secondary border border-primary rounded-lg px-2 py-1 text-foreground resize-none focus:outline-none"
              rows={2}
              autoFocus
            />
          ) : (
            <input
              value={tempValues[field as keyof typeof tempValues]}
              onChange={(e) =>
                setTempValues((p) => ({ ...p, [field]: e.target.value }))
              }
              className="flex-1 text-xs font-mono bg-secondary border border-primary rounded-lg px-2 py-1 text-foreground focus:outline-none"
              autoFocus
            />
          )}
          <button onClick={() => save(field)} className="p-1 text-primary hover:text-primary/80">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={cancel} className="p-1 text-muted-foreground hover:text-destructive">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          className="flex-1 flex items-center justify-between cursor-pointer rounded-lg px-1.5 py-0.5 hover:bg-secondary/50 transition-colors"
          onClick={() => setEditing(field)}
        >
          <span className={`text-xs ${value ? "text-card-foreground" : "text-muted-foreground"}`}>
            {value || placeholder}
          </span>
          <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-xl border border-border card-bg p-5 space-y-4">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={avatar || `https://avatars.githubusercontent.com/${username}`}
            alt={name}
            className="w-16 h-16 rounded-2xl border-2 border-primary/30 object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full gradient-bg flex items-center justify-center text-primary-foreground">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="group cursor-pointer flex items-center gap-1.5"
            onClick={() => setEditing("name")}
          >
            {editing === "name" ? (
              <div className="flex items-center gap-1.5">
                <input
                  value={tempValues.name}
                  onChange={(e) => setTempValues((p) => ({ ...p, name: e.target.value }))}
                  className="text-sm font-bold bg-secondary border border-primary rounded-lg px-2 py-1 text-foreground focus:outline-none"
                  autoFocus
                />
                <button onClick={() => save("name")} className="p-1 text-primary">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={cancel} className="p-1 text-muted-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <span className="font-bold text-sm text-card-foreground truncate">{name}</span>
                <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">@{username}</p>
        </div>
      </div>

      {/* Bio */}
      <EditableField
        field="bio"
        value={bio}
        placeholder="Write your bio..."
        icon={Edit3}
        multiline
      />

      {/* Location */}
      <EditableField
        field="location"
        value={location}
        placeholder="Your location"
        icon={MapPin}
      />

      {/* Website */}
      <EditableField
        field="website"
        value={website}
        placeholder="https://yourwebsite.com"
        icon={Link2}
      />

      {/* Twitter */}
      <EditableField
        field="twitter"
        value={twitter}
        placeholder="@yourhandle"
        icon={Twitter}
      />

      {/* LinkedIn */}
      <EditableField
        field="linkedin"
        value={linkedin}
        placeholder="linkedin.com/in/yourprofile"
        icon={Linkedin}
      />
    </div>
  );
}
