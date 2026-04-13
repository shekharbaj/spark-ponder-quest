import { Star } from "lucide-react";
import type { Problem } from "@/data/problems";

interface ProblemCardProps {
  problem: Problem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const difficultyStyles: Record<string, string> = {
  "Quick Sprint": "bg-badge-quick text-badge-quick-foreground",
  Medium: "bg-badge-medium text-badge-medium-foreground",
  "Deep Dive": "bg-badge-deep text-badge-deep-foreground",
};

const difficultyLabels: Record<string, string> = {
  "Quick Sprint": "1–2 days",
  Medium: "1–2 weeks",
  "Deep Dive": "1 month+",
};

const ProblemCard = ({ problem, isFavorite, onToggleFavorite }: ProblemCardProps) => {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyStyles[problem.difficulty]}`}>
            {problem.difficulty} · {difficultyLabels[problem.difficulty]}
          </span>
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            {problem.category}
          </span>
        </div>
        <button
          onClick={() => onToggleFavorite(problem.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className="shrink-0 rounded-md p-1 transition-colors hover:bg-secondary"
        >
          <Star
            size={18}
            className={isFavorite ? "fill-star text-star" : "text-muted-foreground"}
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold leading-snug text-card-foreground">
        {problem.title}
      </h3>

      {/* HMW */}
      <p className="mb-3 text-sm font-medium italic text-primary">
        "{problem.hmw}"
      </p>

      {/* Context */}
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        {problem.context}
      </p>

      {/* Persona */}
      <div className="mt-auto rounded-lg bg-secondary px-3 py-2">
        <p className="text-xs font-medium text-muted-foreground">
          <span className="font-semibold text-secondary-foreground">Persona:</span>{" "}
          {problem.persona}
        </p>
      </div>
    </div>
  );
};

export default ProblemCard;
