import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Shield, Star, TrendingUp, TrendingDown, Minus, Trash2 } from "lucide-react";
import { getHistory, clearHistory, RankingEntry } from "@/lib/ranking";
import { useState } from "react";

const levelStyles: Record<RankingEntry["level"], { color: string; icon: typeof Trophy }> = {
  Avançado: { color: "text-accent", icon: Trophy },
  Intermediário: { color: "text-warning", icon: Shield },
  Iniciante: { color: "text-destructive", icon: Star },
};

const HistoryPage = () => {
  const [version, setVersion] = useState(0);
  const history = useMemo(() => getHistory(), [version]);

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
            {/* Summary stats */}
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

            {/* Evolution chart */}
            <div className="rounded-xl bg-card neon-border p-5 space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Evolução ao longo do tempo
              </h2>
              <EvolutionChart entries={stats.ordered} />
            </div>

            {/* Attempts list */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Tentativas recentes
              </h2>
              <div className="space-y-2">
                {history.map((entry, i) => {
                  const { color, icon: Icon } = levelStyles[entry.level];
                  return (
                    <div
                      key={`${entry.timestamp}-${i}`}
                      className="rounded-xl bg-card neon-border p-4 flex items-center gap-4"
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
                    </div>
                  );
                })}
              </div>
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

export default HistoryPage;
