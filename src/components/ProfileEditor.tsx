import { useState } from "react";
import { MapPin, Link2, Twitter, Edit3, Check, X } from "lucide-react";

interface ProfileEditorProps {
  name: string;
  bio: string;
  avatar: string;
  username: string;
  onUpdate: (updates: { name?: string; bio?: string; location?: string; website?: string; twitter?: string }) => void;
  location: string;
  website: string;
  twitter: string;
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
}: ProfileEditorProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState({
    name,
    bio,
    location,
    website,
    twitter,
  });

  const save = (field: string) => {
    onUpdate({ [field]: tempValues[field as keyof typeof tempValues] });
    setEditing(null);
  };

  const cancel = () => {
    setTempValues({ name, bio, location, website, twitter });
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
              <path d="M12 0c-6.626 0-12 5.373-12 12..." />
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
    </div>
  );
}
