"use client";

import * as React from "react";
import {
  Heading1,
  Heading2,
  Bold,
  Underline,
  List,
  Highlighter,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudySet, StudySection } from "@/lib/types";

/**
 * In-place editor for a study section — the learner owns their material, so
 * they can fix, restructure, or expand any section. Edits the markdown
 * directly (headings for topic/subtopic, ++underline++, bullet points,
 * ==highlight==) plus the section's place in the topic hierarchy, and saves
 * to the server via PATCH studysets/{id}/sections/{index}/.
 */

const LEVELS = [
  { v: 0, label: "Topic" },
  { v: 1, label: "Subtopic" },
  { v: 2, label: "Sub-subtopic" },
];

export function SectionEditor({
  studySetId,
  index,
  section,
  onSaved,
  onCancel,
}: {
  studySetId: string;
  index: number;
  section: StudySection;
  onSaved: (updated: StudySet) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = React.useState(section.title);
  const [content, setContent] = React.useState(section.content);
  const [level, setLevel] = React.useState(section.level ?? 0);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const areaRef = React.useRef<HTMLTextAreaElement>(null);

  /** Wrap the current selection (or insert at the caret) with markdown. */
  function wrap(before: string, after = before, blockPrefix = false) {
    const el = areaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = content.slice(start, end) || "text";
    let insert: string;
    let caret: number;
    if (blockPrefix) {
      // line-level (heading / bullet): prefix the line start
      const lineStart = content.lastIndexOf("\n", start - 1) + 1;
      insert =
        content.slice(0, lineStart) +
        before +
        content.slice(lineStart);
      caret = end + before.length;
      setContent(insert);
    } else {
      insert = content.slice(0, start) + before + sel + after + content.slice(end);
      caret = start + before.length + sel.length + after.length;
      setContent(insert);
    }
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const updated = await api.patch<StudySet>(
        `studysets/${studySetId}/sections/${index}/`,
        { title, content, level },
      );
      onSaved(updated);
    } catch {
      setError("Couldn't save your changes. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border-2 border-primary/40 bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Section title"
          className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-1.5 text-lg font-semibold outline-none focus:border-primary"
        />
        <div className="flex overflow-hidden rounded-lg border">
          {LEVELS.map((l) => (
            <button
              key={l.v}
              onClick={() => setLevel(l.v)}
              className={cn(
                "px-2.5 py-1.5 text-xs transition-colors",
                level === l.v
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent",
              )}
              title={`Set as ${l.label}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* formatting toolbar */}
      <div className="mb-2 flex flex-wrap items-center gap-1 rounded-lg border bg-muted/40 p-1">
        <ToolBtn onClick={() => wrap("## ", "", true)} label="Subtopic heading">
          <Heading1 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => wrap("### ", "", true)} label="Sub-subtopic heading">
          <Heading2 className="h-4 w-4" />
        </ToolBtn>
        <span className="mx-1 h-5 w-px bg-border" />
        <ToolBtn onClick={() => wrap("**")} label="Bold">
          <Bold className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => wrap("++")} label="Underline">
          <Underline className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => wrap("==")} label="Highlight">
          <Highlighter className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={() => wrap("- ", "", true)} label="Bullet point">
          <List className="h-4 w-4" />
        </ToolBtn>
      </div>

      <textarea
        ref={areaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        spellCheck
        className="w-full resize-y rounded-lg border bg-background p-3 font-mono text-sm leading-relaxed outline-none focus:border-primary"
        placeholder={"Write with markdown:\n## Subtopic\n### Sub-subtopic\n- bullet point\n**bold**, ++underline++, ==highlight=="}
      />

      <div className="mt-3 flex items-center gap-2">
        <Button size="sm" onClick={save} disabled={saving || !title.trim()}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Save section
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4" /> Cancel
        </Button>
        {error && <span className="text-xs text-destructive">{error}</span>}
        <span className="ml-auto text-[11px] text-muted-foreground">
          ## subtopic · ### sub-subtopic · ++underline++ · - bullets
        </span>
      </div>
    </div>
  );
}

function ToolBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {children}
    </button>
  );
}
