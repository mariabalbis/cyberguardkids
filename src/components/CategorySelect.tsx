import { ArrowLeft, Layers } from "lucide-react";
import { categories, questions, Category } from "@/data/questions";

interface CategorySelectProps {
  onSelect: (category: Category | "all") => void;
  onBack: () => void;
}

const CategorySelect = ({ onSelect, onBack }: CategorySelectProps) => {
  const countFor = (id: Category) => questions.filter((q) => q.category === id).length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-grid">
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative z-10 max-w-2xl w-full space-y-6 animate-fade-up">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-glow">
            Escolha um tema
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecione uma categoria ou jogue com todas as perguntas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onSelect("all")}
            className="rounded-xl bg-card neon-border p-4 text-left transition-all duration-200 hover:brightness-110 active:scale-[0.98] card-glow sm:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Todas as categorias</p>
                <p className="text-xs text-muted-foreground">{questions.length} perguntas variadas</p>
              </div>
            </div>
          </button>

          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className="rounded-xl bg-card neon-border p-4 text-left transition-all duration-200 hover:brightness-110 active:scale-[0.98] opacity-0 animate-fade-up"
              style={{ animationDelay: `${100 + i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                  <p className="text-[10px] text-accent mt-1 font-mono">
                    {countFor(cat.id)} perguntas
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelect;
