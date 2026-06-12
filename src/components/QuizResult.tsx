import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { achievements, Achievement } from "@/data/questions";
import { addToRanking } from "@/lib/ranking";
import Ranking from "@/components/Ranking";
import { RotateCcw, Trophy, Shield, Star, History } from "lucide-react";

interface QuizResultProps {
  score: number;
  total: number;
  onRestart: () => void;
  category?: string;
  categoryLabel?: string;
  levelIndex?: number | null;
}

const getLevel = (percentage: number) => {
  if (percentage >= 80) return { label: "Avançado", icon: Trophy, color: "text-accent" };
  if (percentage >= 50) return { label: "Intermediário", icon: Shield, color: "text-warning" };
  return { label: "Iniciante", icon: Star, color: "text-destructive" };
};

const getMessage = (percentage: number) => {
  if (percentage === 100) return "Incrível! Você é um verdadeiro CyberGuardian, mestre da segurança digital! 🏆";
  if (percentage >= 80) return "Excelente! Você é um CyberGuardian preparado para proteger a internet! 🛡️";
  if (percentage >= 60) return "Bom trabalho, futuro CyberGuardian! Você sabe bastante, mas ainda pode evoluir. 💪";
  if (percentage >= 40) return "Você tem noções básicas, CyberGuardian em treinamento — siga aprendendo! 📚";
  return "Atenção, CyberGuardian iniciante! É hora de reforçar seus conhecimentos. ⚠️";
};

const getRecommendations = (level: string): { title: string; tips: string[] } => {
  if (level === "Avançado") {
    return {
      title: "Recomendações para CyberGuardians Avançados",
      tips: [
        "Ative autenticação em duas etapas em todas as contas importantes.",
        "Compartilhe seu conhecimento e ajude amigos e familiares a se protegerem.",
        "Acompanhe notícias sobre novas ameaças e vazamentos de dados.",
      ],
    };
  }
  if (level === "Intermediário") {
    return {
      title: "Recomendações para CyberGuardians Intermediários",
      tips: [
        "Use um gerenciador de senhas para criar e guardar senhas fortes e únicas.",
        "Desconfie de links e anexos suspeitos, mesmo de contatos conhecidos.",
        "Revise as configurações de privacidade das suas redes sociais.",
      ],
    };
  }
  return {
    title: "Recomendações para CyberGuardians Iniciantes",
    tips: [
      "Nunca compartilhe suas senhas — nem com amigos próximos.",
      "Evite clicar em links recebidos por mensagens ou e-mails desconhecidos.",
      "Mantenha seus aplicativos e sistema sempre atualizados.",
    ],
  };
};

const QuizResult = ({ score, total, onRestart, category, categoryLabel, levelIndex }: QuizResultProps) => {
  const percentage = Math.round((score / total) * 100);
  const level = getLevel(percentage);
  const LevelIcon = level.icon;
  const recommendations = getRecommendations(level.label);
  const earnedAchievements = achievements.filter((a) => a.condition(score / 10, total / 10));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) {
      setSaved(true);
      addToRanking(score, total, { category, categoryLabel, levelIndex });
    }
  }, [score, total, saved, category, categoryLabel, levelIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-grid">
      <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-36 h-36 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative z-10 max-w-lg w-full space-y-8 text-center">
        {/* Score circle */}
        <div className="animate-scale-pop">
          <div className="mx-auto w-28 h-28 rounded-full bg-card neon-border flex flex-col items-center justify-center card-glow">
            <span className="text-3xl font-bold font-mono text-foreground">{score}</span>
            <span className="text-xs text-muted-foreground">de {total} pts</span>
          </div>
        </div>

        {/* Level */}
        <div className="space-y-2 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-center gap-2">
            <LevelIcon className={`w-5 h-5 ${level.color}`} />
            <span className={`text-sm font-semibold ${level.color}`}>
              Nível {level.label}
            </span>
          </div>
          <p className="text-lg font-semibold text-foreground">{getMessage(percentage)}</p>
          <p className="text-sm text-muted-foreground">
            Você acertou {percentage}% das perguntas
          </p>
        </div>

        {/* Percentage bar */}
        <div className="w-full max-w-xs mx-auto opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Achievements */}
        {earnedAchievements.length > 0 && (
          <div className="space-y-3 opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Conquistas Desbloqueadas
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {earnedAchievements.map((achievement: Achievement, i: number) => (
                <div
                  key={achievement.id}
                  className="rounded-xl bg-card neon-border p-3 space-y-1 opacity-0 animate-scale-pop"
                  style={{ animationDelay: `${500 + i * 100}ms` }}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <p className="text-xs font-semibold text-foreground">{achievement.title}</p>
                  <p className="text-[10px] text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div
          className="text-left rounded-xl bg-card neon-border p-5 space-y-3 opacity-0 animate-fade-up"
          style={{ animationDelay: "550ms" }}
        >
          <h3 className={`text-sm font-bold uppercase tracking-wider ${level.color}`}>
            {recommendations.title}
          </h3>
          <ul className="space-y-2">
            {recommendations.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                <Shield className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ranking */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: "700ms" }}>
          <Ranking />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <button
            onClick={onRestart}
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold
              transition-all duration-200 hover:brightness-110 active:scale-[0.97] card-glow
              inline-flex items-center gap-2 opacity-0 animate-fade-up"
            style={{ animationDelay: "800ms" }}
          >
            <RotateCcw className="w-4 h-4" />
            Jogar Novamente
          </button>
          <Link
            to="/historico"
            className="px-6 py-3.5 rounded-xl bg-card neon-border text-foreground font-semibold
              transition-all duration-200 hover:brightness-110 active:scale-[0.97]
              inline-flex items-center gap-2 opacity-0 animate-fade-up"
            style={{ animationDelay: "850ms" }}
          >
            <History className="w-4 h-4" />
            Ver Histórico
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
