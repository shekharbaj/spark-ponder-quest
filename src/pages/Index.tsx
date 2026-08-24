import { useState, useMemo, useCallback } from "react";
import { Search, Shuffle, Star, X } from "lucide-react";
import { problems, categories, difficulties, type Category, type Difficulty } from "@/data/problems";
import ProblemCard from "@/components/ProblemCard";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("pb-favorites") || "[]");
    } catch {
      return [];
    }
  });
  const [randomPick, setRandomPick] = useState<number | null>(null);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("pb-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setRandomPick(null);
  };

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (showFavoritesOnly && !favorites.includes(p.id)) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
      if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.hmw.toLowerCase().includes(q) ||
          p.context.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedCategories, selectedDifficulty, showFavoritesOnly, favorites]);

  const displayed = randomPick !== null ? filtered.filter((p) => p.id === randomPick) : filtered;

  const surpriseMe = () => {
    if (filtered.length === 0) return;
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    setRandomPick(pick.id);
  };

  const clearRandom = () => setRandomPick(null);

  const clearAll = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedDifficulty(null);
    setShowFavoritesOnly(false);
    setRandomPick(null);
  };

  const hasFilters = search || selectedCategories.length > 0 || selectedDifficulty || showFavoritesOnly || randomPick !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Challenge Bank
            </h1>
            <p className="text-base text-muted-foreground">
              {problems.length} design thinking challenges to spark your next breakthrough.
            </p>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Search + Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setRandomPick(null); }}
                placeholder="Search challenges…"
                className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={surpriseMe}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Shuffle size={15} /> Surprise Me
              </button>
              <button
                onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setRandomPick(null); }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  showFavoritesOnly
                    ? "border-star bg-star/10 text-foreground"
                    : "border-input bg-background text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Star size={15} className={showFavoritesOnly ? "fill-star text-star" : ""} />
                Favorites{favorites.length > 0 && ` (${favorites.length})`}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Difficulty */}
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => { setSelectedDifficulty(selectedDifficulty === d ? null : d); setRandomPick(null); }}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedDifficulty === d
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input bg-background text-muted-foreground hover:bg-secondary"
                }`}
              >
                {d}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-border" />
            {/* Categories */}
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategories.includes(cat)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input bg-background text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {randomPick !== null && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm text-accent-foreground">
            <Shuffle size={14} />
            <span className="font-medium">Random pick!</span>
            <button onClick={clearRandom} className="ml-auto text-xs underline hover:no-underline">
              Show all results
            </button>
          </div>
        )}

        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No challenges found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Showing {displayed.length} of {problems.length} challenges
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  isFavorite={favorites.includes(problem.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
