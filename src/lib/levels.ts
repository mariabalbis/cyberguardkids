import { questions, Category, categories } from "@/data/questions";
import type { RankingEntry } from "@/lib/ranking";

export const QUESTIONS_PER_LEVEL = 10;
export const LEVELS_PER_CATEGORY = 4;
export const DAILY_LEVEL_LIMIT = 2;

export interface LevelInfo {
  index: number; // 1..4
  category: Category;
  total: number;
}

export function getQuestionsForLevel(category: Category, levelIndex: number) {
  const pool = questions
    .filter((q) => q.category === category)
    .sort((a, b) => a.id - b.id);
  const start = (levelIndex - 1) * QUESTIONS_PER_LEVEL;
  return pool.slice(start, start + QUESTIONS_PER_LEVEL);
}

export function getLevelsForCategory(category: Category): LevelInfo[] {
  const total = questions.filter((q) => q.category === category).length;
  const count = Math.min(LEVELS_PER_CATEGORY, Math.ceil(total / QUESTIONS_PER_LEVEL));
  return Array.from({ length: count }, (_, i) => ({
    index: i + 1,
    category,
    total: Math.min(QUESTIONS_PER_LEVEL, total - i * QUESTIONS_PER_LEVEL),
  }));
}

export function getCompletedLevels(
  history: RankingEntry[],
  category: Category
): Set<number> {
  const set = new Set<number>();
  for (const e of history) {
    if (e.category === category && typeof e.levelIndex === "number") {
      set.add(e.levelIndex);
    }
  }
  return set;
}

export function isLevelUnlocked(
  history: RankingEntry[],
  category: Category,
  levelIndex: number
): boolean {
  if (levelIndex <= 1) return true;
  const completed = getCompletedLevels(history, category);
  return completed.has(levelIndex - 1);
}

export function getLevelsPlayedToday(history: RankingEntry[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = today.getTime();
  // Only count entries that were level-based (have levelIndex)
  return history.filter(
    (e) => typeof e.levelIndex === "number" && (e.timestamp ?? 0) >= start
  ).length;
}

export function categoryLabelOf(cat: Category): string {
  return categories.find((c) => c.id === cat)?.label ?? cat;
}
