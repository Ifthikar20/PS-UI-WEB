import Link from "next/link";
import { FileText, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudySet } from "@/lib/types";

const TONES = [
  "bg-pastel-lime",
  "bg-pastel-peach",
  "bg-pastel-mint",
  "bg-pastel-sky",
  "bg-pastel-lavender",
];

export function StudySetCard({
  set,
  index = 0,
}: {
  set: StudySet;
  index?: number;
}) {
  const tone = TONES[index % TONES.length];
  const ready = set.status === "ready";
  return (
    <Link href={`/study/${set.id}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className={`flex h-24 items-center justify-center ${tone}`}>
          <FileText className="h-8 w-8 text-black/70" />
        </div>
        <div className="space-y-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold leading-snug">
              {set.title || "Untitled study set"}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {ready ? (
              <>
                <span>{set.sections?.length ?? 0} sections</span>
                <span>·</span>
                <span>{set.quiz?.length ?? 0} questions</span>
              </>
            ) : (
              <Badge variant="muted" className="gap-1">
                <Clock className="h-3 w-3" />
                {set.status === "failed" ? "Failed" : "Generating…"}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
