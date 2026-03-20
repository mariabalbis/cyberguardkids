export interface RankingEntry {
  score: number;
  total: number;
  percentage: number;
  date: string;
}

const RANKING_KEY = "cyberquiz-ranking";
const MAX_ENTRIES = 10;

export function getRanking(): RankingEntry[] {
  try {
    const data = localStorage.getItem(RANKING_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToRanking(score: number, total: number): RankingEntry[] {
  const entry: RankingEntry = {
    score,
    total,
    percentage: Math.round((score / total) * 100),
    date: new Date().toLocaleDateString("pt-BR"),
  };
  const ranking = getRanking();
  ranking.push(entry);
  ranking.sort((a, b) => b.score - a.score || a.date.localeCompare(b.date));
  const trimmed = ranking.slice(0, MAX_ENTRIES);
  localStorage.setItem(RANKING_KEY, JSON.stringify(trimmed));
  return trimmed;
}
