import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Shield, Star, TrendingUp, TrendingDown, Minus, Trash2, Flame, Target, Pencil, ChevronDown, Loader2, LogOut } from "lucide-react";
import {
  getHistory,
  clearHistory,
  RankingEntry,
  computeWeeklyProgress,
  computeStreak,
  getWeeklyGoal,
  setWeeklyGoal,
} from "@/lib/ranking";
import { useAuth } from "@/hooks/useAuth";

type LevelFilter = "all" | RankingEntry["level"];
const LEVEL_FILTERS: { value: LevelFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "Iniciante", label: "Iniciante" },
  { value: "Intermediário", label: "Intermediário" },
  { value: "Avançado", label: "Avançado" },
];
const PERIOD_OPTIONS = [
  { weeks: 8, label: "2 meses" },
  { weeks: 14, label: "3 meses" },
  { weeks: 26, label: "6 meses" },
  { weeks: 52, label: "1 ano" },
];

const levelStyles: Record<RankingEntry["level"], { color: string; icon: typeof Trophy }> = {
  Avançado: { color: "text-accent", icon: Trophy },
  Intermediário: { color: "text-warning", icon: Shield },
  Iniciante: { color: "text-destructive", icon: Star },
};

const HistoryPage = () => {
  const [version, setVersion] = useState(0);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [calendarWeeks, setCalendarWeeks] = useState<number>(14);
  const history = useMemo(() => getHistory(), [version]);
  const filteredHistory = useMemo(
    () => (levelFilter === "all" ? history : history.filter((e) => e.level === levelFilter)),
    [history, levelFilter]
  );
  const weekly = useMemo(() => getWeeklyProgress(), [version]);
  const streak = useMemo(() => getStreak(), [version]);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const ordered = [...history].reverse(); // chronological
    const avg = Math.round(
      ordered.reduce((sum, e) => sum + e.percentage, 0) / ordered.length
    );
    const best = ordered.reduce((b, e) => (e.percentage > b.percentage ? e : b), ordered[0]);
    const first = ordered[0];
    const last = ordered[ordered.length - 1];
    const evolution = last.percentage - first.percentage;
    return { avg, best, total: ordered.length, evolution, ordered };
  }, [history]);

  const handleClear = () => {
    if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
      clearHistory();
      setVersion((v) => v + 1);
    }
  };

  const handleEditGoal = () => {
    const current = getWeeklyGoal();
    const input = prompt("Defina sua meta semanal de quizzes (1 a 50):", String(current));
    if (input === null) return;
    const n = parseInt(input, 10);
    if (Number.isFinite(n) && n > 0) {
      setWeeklyGoal(n);
      setVersion((v) => v + 1);
    }
  };

  return (
    <div className="min-h-screen bg-grid px-6 py-10">
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-fade-up">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Limpar histórico
            </button>
          )}
        </div>

        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-glow">
            Seu Histórico
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas tentativas, níveis e evolução como CyberGuardian.
          </p>
        </header>

        {/* Weekly goal + streak — sempre visíveis para incentivar o jogo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WeeklyGoalCard count={weekly.count} goal={weekly.goal} onEdit={handleEditGoal} />
          <StreakCard current={streak.current} longest={streak.longest} />
        </div>

        {/* Calendário de atividade com seletor de período */}
        <ActivityCalendar history={history} weeks={calendarWeeks} onWeeksChange={setCalendarWeeks} />

        {!stats ? (
          <div className="rounded-xl bg-card neon-border p-10 text-center text-sm text-muted-foreground">
            Você ainda não fez nenhum quiz. Jogue para começar a registrar sua evolução!
            <div className="mt-5">
              <Link
                to="/"
                className="inline-block px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all card-glow"
              >
                Começar agora
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Tentativas" value={stats.total.toString()} />
              <StatCard label="Média" value={`${stats.avg}%`} />
              <StatCard label="Melhor" value={`${stats.best.percentage}%`} sub={stats.best.categoryLabel} />
              <StatCard
                label="Evolução"
                value={`${stats.evolution > 0 ? "+" : ""}${stats.evolution}%`}
                trend={stats.evolution}
              />
            </div>

            <div className="rounded-xl bg-card neon-border p-5 space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Evolução ao longo do tempo
              </h2>
              <EvolutionChart entries={stats.ordered} />
            </div>

            {/* Attempts list with level filter and expandable details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Tentativas recentes
                </h2>
                <div className="flex flex-wrap gap-1">
                  {LEVEL_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setLevelFilter(f.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                        levelFilter === f.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/40 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="rounded-xl bg-card neon-border p-6 text-center text-xs text-muted-foreground">
                  Nenhuma tentativa neste nível ainda.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredHistory.map((entry, i) => {
                    const { color, icon: Icon } = levelStyles[entry.level];
                    const key = `${entry.timestamp}-${i}`;
                    const expanded = expandedKey === key;
                    const wrong = Math.max(0, entry.total - entry.score);
                    const time = new Date(entry.timestamp ?? 0).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div key={key} className="rounded-xl bg-card neon-border overflow-hidden">
                        <button
                          onClick={() => setExpandedKey(expanded ? null : key)}
                          className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/20 transition-colors"
                        >
                          <div className={`shrink-0 w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center ${color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>
                                {entry.level}
                              </span>
                              <span className="text-xs text-muted-foreground">·</span>
                              <span className="text-xs text-muted-foreground truncate">
                                {entry.categoryLabel}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{entry.date}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-bold font-mono text-foreground">
                              {entry.score}
                              <span className="text-xs text-muted-foreground font-normal"> / {entry.total}</span>
                            </p>
                            <p className="text-xs font-semibold text-primary">{entry.percentage}%</p>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
                          />
                        </button>
                        {expanded && (
                          <div className="px-4 pb-4 pt-0 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-border/50">
                            <DetailItem label="Categoria" value={entry.categoryLabel} />
                            <DetailItem label="Nível" value={entry.level} valueClass={color} />
                            <DetailItem label="Acertos" value={`${entry.score} de ${entry.total}`} />
                            <DetailItem label="Erros" value={String(wrong)} valueClass={wrong > 0 ? "text-destructive" : ""} />
                            <DetailItem label="Aproveitamento" value={`${entry.percentage}%`} valueClass="text-primary" />
                            <DetailItem label="Data" value={entry.date} />
                            <DetailItem label="Horário" value={time} />
                            <DetailItem label="ID da categoria" value={entry.category} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
}) => {
  const TrendIcon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend === undefined ? "" : trend > 0 ? "text-accent" : trend < 0 ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="rounded-xl bg-card neon-border p-4 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold font-mono mt-1 inline-flex items-center gap-1 ${trendColor || "text-foreground"}`}>
        {TrendIcon && <TrendIcon className="w-4 h-4" />}
        {value}
      </p>
      {sub && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{sub}</p>}
    </div>
  );
};

const EvolutionChart = ({ entries }: { entries: RankingEntry[] }) => {
  if (entries.length < 2) {
    return (
      <p className="text-xs text-muted-foreground text-center py-6">
        Faça pelo menos 2 quizzes para ver sua curva de evolução.
      </p>
    );
  }

  const width = 600;
  const height = 140;
  const padding = 20;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = entries.map((e, i) => {
    const x = padding + (i / (entries.length - 1)) * innerW;
    const y = padding + innerH - (e.percentage / 100) * innerH;
    return { x, y, e };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1].x},${padding + innerH} L${points[0].x},${padding + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {[0, 50, 100].map((v) => {
        const y = padding + innerH - (v / 100) * innerH;
        return (
          <g key={v}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} className="stroke-border" strokeDasharray="2 4" strokeWidth="0.5" />
            <text x={4} y={y + 3} className="fill-muted-foreground" fontSize="9">{v}%</text>
          </g>
        );
      })}
      <path d={areaPath} className="fill-primary/10" />
      <path d={path} className="stroke-primary" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" className="fill-primary stroke-background" strokeWidth="1.5">
          <title>{`${p.e.date} · ${p.e.percentage}% (${p.e.level})`}</title>
        </circle>
      ))}
    </svg>
  );
};

const WeeklyGoalCard = ({
  count,
  goal,
  onEdit,
}: {
  count: number;
  goal: number;
  onEdit: () => void;
}) => {
  const pct = Math.min(100, Math.round((count / goal) * 100));
  const reached = count >= goal;
  const remaining = Math.max(0, goal - count);
  return (
    <div className="rounded-xl bg-card neon-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Meta semanal
          </span>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Editar meta semanal"
        >
          <Pencil className="w-3 h-3" /> editar
        </button>
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold font-mono text-foreground">
          {count}
          <span className="text-sm text-muted-foreground font-normal"> / {goal}</span>
        </p>
        <span className={`text-xs font-semibold ${reached ? "text-accent" : "text-primary"}`}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            reached ? "bg-gradient-to-r from-accent to-primary" : "bg-gradient-to-r from-primary to-accent"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">
        {reached
          ? "🎉 Meta da semana concluída! Continue treinando."
          : `Faltam ${remaining} quiz${remaining === 1 ? "" : "zes"} para bater sua meta.`}
      </p>
    </div>
  );
};

const StreakCard = ({ current, longest }: { current: number; longest: number }) => {
  const active = current > 0;
  return (
    <div className="rounded-xl bg-card neon-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className={`w-4 h-4 ${active ? "text-warning" : "text-muted-foreground"}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sequência
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">recorde {longest}d</span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className={`text-2xl font-bold font-mono ${active ? "text-warning" : "text-foreground"}`}>
          {current}
        </p>
        <span className="text-sm text-muted-foreground">
          {current === 1 ? "dia seguido" : "dias seguidos"}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {active
          ? "🔥 Você está numa boa! Faça um quiz hoje para manter."
          : "Comece uma nova sequência fazendo um quiz hoje."}
      </p>
    </div>
  );
};

const DAY_LABELS_OFFSET = 0;
const DAY_LABELS = ["S", "T", "Q", "Q", "S", "S", "D"];
const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const DetailItem = ({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className={`text-xs font-semibold mt-0.5 ${valueClass || "text-foreground"}`}>{value}</p>
  </div>
);

const ActivityCalendar = ({
  history,
  weeks: WEEKS_TO_SHOW,
  onWeeksChange,
}: {
  history: RankingEntry[];
  weeks: number;
  onWeeksChange: (n: number) => void;
}) => {
  const { weeks, monthMarkers, totalDays, maxCount } = useMemo(() => {
    const counts = new Map<number, number>();
    history.forEach((e) => {
      const d = new Date(e.timestamp ?? 0);
      d.setHours(0, 0, 0, 0);
      counts.set(d.getTime(), (counts.get(d.getTime()) ?? 0) + 1);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = today.getDay();
    const diff = (day + 6) % 7;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - diff);

    const startMonday = new Date(currentMonday);
    startMonday.setDate(currentMonday.getDate() - (WEEKS_TO_SHOW - 1) * 7);

    const weeks: { ts: number; count: number; isFuture: boolean; isToday: boolean }[][] = [];
    const monthMarkers: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    let max = 0;
    let total = 0;
    const todayTs = today.getTime();

    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      const week: { ts: number; count: number; isFuture: boolean; isToday: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startMonday);
        date.setDate(startMonday.getDate() + w * 7 + d);
        const ts = date.getTime();
        const count = counts.get(ts) ?? 0;
        if (count > 0) total++;
        if (count > max) max = count;
        week.push({ ts, count, isFuture: ts > todayTs, isToday: ts === todayTs });
        if (d === 0) {
          const m = date.getMonth();
          if (m !== lastMonth) {
            monthMarkers.push({ weekIndex: w, label: MONTH_LABELS[m] });
            lastMonth = m;
          }
        }
      }
      weeks.push(week);
    }
    return { weeks, monthMarkers, totalDays: total, maxCount: max };
  }, [history]);

  const intensityClass = (count: number) => {
    if (count === 0) return "bg-muted/40";
    if (maxCount <= 1) return "bg-primary";
    const ratio = count / maxCount;
    if (ratio > 0.66) return "bg-primary";
    if (ratio > 0.33) return "bg-primary/70";
    return "bg-primary/40";
  };

  return (
    <div className="rounded-xl bg-card neon-border p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Calendário de atividade
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p.weeks}
                onClick={() => onWeeksChange(p.weeks)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  WEEKS_TO_SHOW === p.weeks
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {totalDays} {totalDays === 1 ? "dia ativo" : "dias ativos"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          <div className="flex gap-1 pl-6">
            {weeks.map((_, wi) => {
              const marker = monthMarkers.find((m) => m.weekIndex === wi);
              return (
                <div key={wi} className="w-3.5 text-[9px] text-muted-foreground">
                  {marker?.label ?? ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-1">
              {DAY_LABELS.map((l, i) => (
                <div key={i} className="h-3.5 w-4 text-[9px] leading-[14px] text-muted-foreground">
                  {i % 2 === 1 ? l : ""}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((cell, di) => {
                  const date = new Date(cell.ts);
                  const dateStr = date.toLocaleDateString("pt-BR");
                  const title = cell.isFuture
                    ? dateStr
                    : `${dateStr} · ${cell.count} quiz${cell.count === 1 ? "" : "zes"}`;
                  return (
                    <div
                      key={di}
                      title={title}
                      className={`w-3.5 h-3.5 rounded-sm transition-all ${
                        cell.isFuture ? "bg-transparent" : intensityClass(cell.count)
                      } ${cell.isToday ? "ring-1 ring-accent" : ""}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
        <span>menos</span>
        <span className="w-3 h-3 rounded-sm bg-muted/40" />
        <span className="w-3 h-3 rounded-sm bg-primary/40" />
        <span className="w-3 h-3 rounded-sm bg-primary/70" />
        <span className="w-3 h-3 rounded-sm bg-primary" />
        <span>mais</span>
      </div>
    </div>
  );
};

export default HistoryPage;
