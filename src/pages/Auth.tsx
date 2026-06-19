import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Loader2, Eye, EyeOff, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres").max(72),
});

const Auth = () => {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [connStatus, setConnStatus] = useState<"checking" | "ok" | "fail">("checking");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (!active) return;
        setConnStatus(error ? "fail" : "ok");
      } catch {
        if (active) setConnStatus("fail");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grid">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode jogar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta, CyberGuardian!");
      }
    } catch (err: any) {
      const msg = err?.message ?? "Erro ao autenticar";
      if (msg.toLowerCase().includes("invalid login")) {
        toast.error("E-mail ou senha incorretos.");
      } else if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("user already")) {
        toast.error("Este e-mail já está cadastrado. Faça login.");
      } else if (msg.toLowerCase().includes("password should be at least")) {
        toast.error("A senha deve ter pelo menos 6 caracteres (regra do servidor). Ajuste nas configurações de autenticação.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-grid">
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md space-y-8 animate-fade-up">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 neon-border flex items-center justify-center animate-pulse-glow">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-glow">CyberGuardian</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Entre para salvar sua evolução." : "Crie sua conta e comece a treinar."}
          </p>

          <div
            className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border ${
              connStatus === "ok"
                ? "border-primary/40 text-primary bg-primary/5"
                : connStatus === "fail"
                ? "border-destructive/40 text-destructive bg-destructive/5"
                : "border-border/60 text-muted-foreground"
            }`}
            aria-live="polite"
          >
            {connStatus === "checking" && (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Verificando conexão…
              </>
            )}
            {connStatus === "ok" && (
              <>
                <Wifi className="w-3 h-3" /> Conectado ao servidor
              </>
            )}
            {connStatus === "fail" && (
              <>
                <WifiOff className="w-3 h-3" /> Sem conexão com o servidor
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-card neon-border p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full px-4 py-2.5 pr-11 rounded-lg bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">Mínimo de 4 caracteres.</p>
          </div>

          <button
            type="submit"
            disabled={submitting || connStatus === "fail"}
            className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold transition-all hover:brightness-110 active:scale-[0.97] card-glow disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
          </button>
        </form>

        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Voltar
        </Link>
      </div>
    </div>
  );
};

export default Auth;
