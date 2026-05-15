import { useMemo, useState, useCallback, useEffect } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import CategorySelect from "@/components/CategorySelect";
import QuizQuestion from "@/components/QuizQuestion";
import QuizProgress from "@/components/QuizProgress";
import QuizResult from "@/components/QuizResult";
import { questions as allQuestions, Category, categories } from "@/data/questions";
import { Shield } from "lucide-react";

type Phase = "welcome" | "category" | "quiz" | "result";

const LAST_CATEGORY_KEY = "cyberquiz:last-category";

const isValidCategory = (value: string | null): value is Category | "all" => {
  if (!value) return false;
  if (value === "all") return true;
  return categories.some((c) => c.id === value);
};

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(() => {
    if (typeof window === "undefined") return "all";
    const stored = window.localStorage.getItem(LAST_CATEGORY_KEY);
    return isValidCategory(stored) ? stored : "all";
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LAST_CATEGORY_KEY, selectedCategory);
    } catch {
      // ignore
    }
  }, [selectedCategory]);

  const questions = useMemo(() => {
    const pool =
      selectedCategory === "all"
        ? allQuestions
        : allQuestions.filter((q) => q.category === selectedCategory);
    // Shuffle question order each time a quiz is started
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
    // Re-shuffle when category changes or when restarting (phase becomes "quiz")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, phase]);

  const categoryLabel =
    selectedCategory === "all"
      ? "Todas as categorias"
      : categories.find((c) => c.id === selectedCategory)?.label ?? "";

  const handleStart = useCallback(() => {
    setPhase("category");
  }, []);

  const handleSelectCategory = useCallback((cat: Category | "all") => {
    setSelectedCategory(cat);
    setCurrentQuestion(0);
    setScore(0);
    setPhase("quiz");
  }, []);

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) setScore((s) => s + 10);

    if (currentQuestion + 1 >= questions.length) {
      setTimeout(() => setPhase("result"), 300);
    } else {
      setCurrentQuestion((c) => c + 1);
    }
  }, [currentQuestion, questions.length]);

  const handleRestart = useCallback(() => {
    setPhase("welcome");
    setCurrentQuestion(0);
    setScore(0);
  }, []);

  if (phase === "welcome") return <WelcomeScreen onStart={handleStart} />;

  if (phase === "category")
    return <CategorySelect onSelect={handleSelectCategory} onBack={handleRestart} selected={selectedCategory} />;

  if (phase === "result") {
    return (
      <QuizResult
        score={score}
        total={questions.length * 10}
        onRestart={handleRestart}
        category={selectedCategory}
        categoryLabel={categoryLabel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">CyberQuiz</span>
          <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
            · {categoryLabel}
          </span>
        </div>
        <button
          onClick={handleRestart}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Sair
        </button>
      </header>

      {/* Progress */}
      <div className="w-full max-w-2xl mx-auto px-6 pt-6">
        <QuizProgress current={currentQuestion + 1} total={questions.length} score={score} />
      </div>

      {/* Question */}
      <div className="flex-1 flex items-start justify-center px-6 py-8" key={currentQuestion}>
        <QuizQuestion
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
};

export default Index;
