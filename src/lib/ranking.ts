export interface RankingEntry {
  score: number;
  total: number;
  percentage: number;
  date: string;
  timestamp: number;
  category: string;
  categoryLabel: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
}

const RANKING_KEY = "cyberquiz-ranking";
const HISTORY_KEY = "cyberquiz-history";
const WEEKLY_GOAL_KEY = "cyberquiz-weekly-goal";
const MAX_RANKING = 10;
const MAX_HISTORY = 50;
export const DEFAULT_WEEKLY_GOAL = 3;

// Returns the Monday 00:00 timestamp of the week containing `date`.
const getWeekStart = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = (day + 6) % 7; // days since Monday
  d.setDate(d.getDate() - diff);
  return d.getTime();
};

const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const ONE_DAY = 24 * 60 * 60 * 1000;

export function getWeeklyGoal(): number {
  try {
    const v = localStorage.getItem(WEEKLY_GOAL_KEY);
    const n = v ? parseInt(v, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_WEEKLY_GOAL;
  } catch {
    return DEFAULT_WEEKLY_GOAL;
  }
}

export function setWeeklyGoal(goal: number) {
  try {
    localStorage.setItem(WEEKLY_GOAL_KEY, String(Math.max(1, Math.min(50, Math.round(goal)))));
  } catch {
    // ignore
  }
}

export function getWeeklyProgress(): { count: number; goal: number; weekStart: number } {
  const goal = getWeeklyGoal();
  const weekStart = getWeekStart(new Date());
  const history = readList(HISTORY_KEY);
  const count = history.filter((e) => (e.timestamp ?? 0) >= weekStart).length;
  return { count, goal, weekStart };
}

export function getStreak(): { current: number; longest: number } {
  const history = readList(HISTORY_KEY);
  if (history.length === 0) return { current: 0, longest: 0 };

  // unique days that have at least one attempt
  const days = Array.from(
    new Set(history.map((e) => startOfDay(e.timestamp ?? 0)))
  ).sort((a, b) => a - b);

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

  // current streak: counting back from today (or yesterday if no quiz today)
  const today = startOfDay(Date.now());
  const daySet = new Set(days);
  let current = 0;
  let cursor = today;
  if (!daySet.has(cursor)) cursor -= ONE_DAY; // allow yesterday-based streak
  while (daySet.has(cursor)) {
    current++;
    cursor -= ONE_DAY;
  }

  return { current, longest };
}

const getLevelFromPercentage = (percentage: number): RankingEntry["level"] => {
  if (percentage >= 80) return "Avançado";
  if (percentage >= 50) return "Intermediário";
  return "Iniciante";
};

const readList = (key: string): RankingEntry[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export function getRanking(): RankingEntry[] {
  return readList(RANKING_KEY);
}

export function getHistory(): RankingEntry[] {
  const list = readList(HISTORY_KEY);
  // newest first
  return [...list].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(RANKING_KEY);
  } catch {
    // ignore
  }
}

export function addToRanking(
  score: number,
  total: number,
  meta?: { category?: string; categoryLabel?: string }
): RankingEntry[] {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const now = new Date();
  const entry: RankingEntry = {
    score,
    total,
    percentage,
    date: now.toLocaleDateString("pt-BR"),
    timestamp: now.getTime(),
    category: meta?.category ?? "all",
    categoryLabel: meta?.categoryLabel ?? "Todas as categorias",
    level: getLevelFromPercentage(percentage),
  };

  // Top ranking (best scores)
  const ranking = readList(RANKING_KEY);
  ranking.push(entry);
  ranking.sort((a, b) => b.percentage - a.percentage || b.score - a.score);
  const trimmedRanking = ranking.slice(0, MAX_RANKING);
  localStorage.setItem(RANKING_KEY, JSON.stringify(trimmedRanking));

  // Full history
  const history = readList(HISTORY_KEY);
  history.push(entry);
  const trimmedHistory = history.slice(-MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));

  return trimmedRanking;
}
