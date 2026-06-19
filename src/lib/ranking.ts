import { supabase } from "@/integrations/supabase/client";

export interface RankingEntry {
  score: number;
  total: number;
  percentage: number;
  date: string;
  timestamp: number;
  category: string;
  categoryLabel: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  levelIndex?: number | null;
}

const MAX_RANKING = 10;
export const DEFAULT_WEEKLY_GOAL = 3;

const getWeekStart = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d.getTime();
};

const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const ONE_DAY = 24 * 60 * 60 * 1000;

const getLevelFromPercentage = (percentage: number): RankingEntry["level"] => {
  if (percentage >= 80) return "Avançado";
  if (percentage >= 50) return "Intermediário";
  return "Iniciante";
};


const rowToEntry = (row: any): RankingEntry => {
  const ts = new Date(row.created_at).getTime();
  return {
    score: row.score,
    total: row.total,
    percentage: row.percentage,
    date: new Date(ts).toLocaleDateString("pt-BR"),
    timestamp: ts,
    category: row.category,
    categoryLabel: row.category_label,
    level: row.level as RankingEntry["level"],
    levelIndex: row.level_index ?? null,
  };
};

export async function getHistory(): Promise<RankingEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("quiz_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    console.error("getHistory error:", error);
    return [];
  }
  return (data ?? []).map(rowToEntry);
}

export async function getRanking(): Promise<RankingEntry[]> {
  const history = await getHistory();
  return [...history]
    .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
    .slice(0, MAX_RANKING);
}

export async function clearHistory(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from("quiz_history").delete().eq("user_id", user.id);
  if (error) console.error("clearHistory error:", error);
}

export async function addToRanking(
  score: number,
  total: number,
  meta?: { category?: string; categoryLabel?: string; levelIndex?: number | null }
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const { error } = await supabase.from("quiz_history").insert({
    user_id: user.id,
    score,
    total,
    percentage,
    category: meta?.category ?? "all",
    category_label: meta?.categoryLabel ?? "Todas as categorias",
    level: getLevelFromPercentage(percentage),
    level_index: meta?.levelIndex ?? null,
  });
  if (error) console.error("addToRanking error:", error);
}

// Sync helpers that derive from a provided history list (already loaded)
export function computeWeeklyProgress(history: RankingEntry[]): { count: number; goal: number; weekStart: number } {
  const goal = getWeeklyGoal();
  const weekStart = getWeekStart(new Date());
  const count = history.filter((e) => (e.timestamp ?? 0) >= weekStart).length;
  return { count, goal, weekStart };
}

export function computeStreak(history: RankingEntry[]): { current: number; longest: number } {
  if (history.length === 0) return { current: 0, longest: 0 };
  const days = Array.from(new Set(history.map((e) => startOfDay(e.timestamp ?? 0)))).sort((a, b) => a - b);
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] - days[i - 1] === ONE_DAY) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }
  const today = startOfDay(Date.now());
  const daySet = new Set(days);
  let current = 0;
  let cursor = today;
  if (!daySet.has(cursor)) cursor -= ONE_DAY;
  while (daySet.has(cursor)) {
    current++;
    cursor -= ONE_DAY;
  }
  return { current, longest };
}
