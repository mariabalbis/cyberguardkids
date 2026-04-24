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
const MAX_RANKING = 10;
const MAX_HISTORY = 50;

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
