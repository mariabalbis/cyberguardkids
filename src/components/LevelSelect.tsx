import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Check, Play, CalendarClock } from "lucide-react";
import { Category, categories } from "@/data/questions";
import { getHistory, RankingEntry } from "@/lib/ranking";
import {
  getLevelsForCategory,
  getCompletedLevels,
  isLevelUnlocked,
  getLevelsPlayedToday,
  DAILY_LEVEL_LIMIT,
} from "@/lib/levels";
import { cn } from "@/lib/utils";

interface LevelSelectProps {
  category: Category;
  onSelect: (levelIndex: number) => void;
  onBack: () => void;
}

const LevelSelect = ({ category, onSelect, onBack }: LevelSelectProps) => {
  const [history, setHistory] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const h = await getHistory();
      setHistory(h);
      setLoading(false);
    })();
  }, []);

  const cat = categories.find((c) => c.id === category);
  const levels = getLevelsForCategory(category);
  const completed = getCompletedLevels(history, category);
  const playedToday = getLevelsPlayedToday(history);
  const dailyExhausted = playedToday >= DAILY_LEVEL_LIMIT;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-grid">
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full space-y-6 animate-fade-up">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Trocar de tema
        </button>

        <div className="text-center space-y-2">
          <span className="text-3xl">{cat?.icon}</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-glow">
            {cat?.label}
          </h2>
          <p className="text-sm text-muted-foreground">
            Avance um nível por vez. Cada nível tem 10 perguntas.
          </p>
        </div>

        <div
          className={cn(
            "rounded-xl border p-3 flex items-center gap-3 text-xs",
            dailyExhausted
              ? "border-warning/40 bg-warning/5 text-warning"
              : "border-border/60 bg-card/40 text-muted-foreground"
          )}
        >
          <CalendarClock className="w-4 h-4 shrink-0" />
          <p>
            Limite diário: <span className="font-mono font-semibold">{playedToday}/{DAILY_LEVEL_LIMIT}</span> níveis hoje.
            {dailyExhausted
              ? " Volte amanhã para continuar — assim você não 'gasta' as perguntas de uma vez!"
              : " Mantenha o ritmo: um pouco por dia rende uma sequência (streak) maior."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-card neon-border p-4 h-24 animate-pulse opacity-50" />
              ))
            : levels.map((lvl, i) => {
                const isDone = completed.has(lvl.index);
                const unlocked = isLevelUnlocked(history, category, lvl.index);
                const blockedByDaily = !isDone && dailyExhausted;
                const disabled = !unlocked || blockedByDaily;
                return (
                  <button
                    key={lvl.index}
                    disabled={disabled}
                    onClick={() => onSelect(lvl.index)}
                    className={cn(
                      "rounded-xl bg-card neon-border p-4 text-left transition-all duration-200 opacity-0 animate-fade-up",
                      disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:brightness-110 active:scale-[0.98] card-glow",
                      isDone && "ring-2 ring-success/40"
                    )}
                    style={{ animationDelay: `${100 + i * 80}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-bold text-primary">
                        {lvl.index}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          Nível {lvl.index}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lvl.total} perguntas
                          {isDone
                            ? " · concluído"
                            : !unlocked
                              ? " · bloqueado"
                              : blockedByDaily
                                ? " · volte amanhã"
                                : " · pronto pra jogar"}
                        </p>
                      </div>
                      {isDone ? (
                        <Check className="w-4 h-4 text-success shrink-0" />
                      ) : !unlocked || blockedByDaily ? (
                        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                      ) : (
                        <Play className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
