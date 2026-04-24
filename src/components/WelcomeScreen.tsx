import { Shield, Zap, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-grid">
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8 animate-fade-up">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 neon-border flex items-center justify-center animate-pulse-glow">
          <Shield className="w-10 h-10 text-primary" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-glow">
            CyberGuardian
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
            Teste seus conhecimentos sobre segurança digital e aprenda a se proteger na internet!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Zap, label: "5 categorias", sub: "para escolher" },
            { icon: Shield, label: "3 níveis", sub: "de dificuldade" },
            { icon: Lock, label: "Conquistas", sub: "e medalhas" },
          ].map((item, i) => (
            <div
              key={item.label}
              className="rounded-xl bg-card neon-border p-4 space-y-1 opacity-0 animate-fade-up"
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <item.icon className="w-5 h-5 text-accent mx-auto" />
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg
            transition-all duration-200 hover:brightness-110 active:scale-[0.97] card-glow
            opacity-0 animate-fade-up"
          style={{ animationDelay: "500ms" }}
        >
          Escolher Tema
        </button>

        <p className="text-xs text-muted-foreground opacity-0 animate-fade-up" style={{ animationDelay: "600ms" }}>
          Descubra seu nível de segurança digital 🔒
        </p>

        <Link
          to="/historico"
          className="inline-block text-xs text-accent hover:text-primary transition-colors opacity-0 animate-fade-up underline-offset-4 hover:underline"
          style={{ animationDelay: "700ms" }}
        >
          Ver meu histórico →
        </Link>
      </div>
    </div>
  );
};

export default WelcomeScreen;
