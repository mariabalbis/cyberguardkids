import { getRanking, RankingEntry } from "@/lib/ranking";
import { Trophy, Medal, Award } from "lucide-react";

const positionIcons = [Trophy, Medal, Award];
const positionColors = ["text-yellow-400", "text-zinc-400", "text-amber-600"];

const Ranking = () => {
  const ranking = getRanking();

  if (ranking.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Nenhuma pontuação registrada ainda. Jogue o quiz!
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
        🏆 Melhores Pontuações
      </h3>
      <div className="space-y-2">
        {ranking.map((entry: RankingEntry, i: number) => {
          const Icon = positionIcons[i] || null;
          const color = positionColors[i] || "text-muted-foreground";

          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 bg-card neon-border transition-all
                ${i === 0 ? "card-glow" : ""}`}
            >
              <span className={`text-sm font-bold w-6 text-center ${color}`}>
                {Icon ? <Icon className="w-4 h-4 mx-auto" /> : `${i + 1}º`}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold font-mono text-foreground">
                    {entry.score}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {entry.total} pts
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-primary">
                  {entry.percentage}%
                </span>
                <p className="text-[10px] text-muted-foreground">{entry.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Ranking;
