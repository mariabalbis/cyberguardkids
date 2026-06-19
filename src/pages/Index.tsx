import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import CategorySelect from "@/components/CategorySelect";
import LevelSelect from "@/components/LevelSelect";
import QuizQuestion from "@/components/QuizQuestion";
import QuizProgress from "@/components/QuizProgress";
import QuizResult from "@/components/QuizResult";
import RobotMascot, { MascotMood } from "@/components/RobotMascot";
import { questions as allQuestions, Category, categories } from "@/data/questions";
import { getQuestionsForLevel, QUESTIONS_PER_LEVEL } from "@/lib/levels";
import { getPreferences, setLastCategoryPref, setTutorialSeenPref } from "@/lib/preferences";
import { Shield } from "lucide-react";

type Phase = "welcome" | "category" | "level" | "quiz" | "result";

const isValidCategory = (value: string | null | undefined): value is Category | "all" => {
  if (!value) return false;
  if (value === "all") return true;
  return categories.some((c) => c.id === value);
};

const TUTORIAL_MESSAGE =
  "Olá! Sou o CyberBot 🤖. Escolha um tema, depois um nível (10 perguntas). Você pode jogar até 2 níveis por dia para manter sua sequência. Se errar, leio a explicação para você — e estou sempre aqui no canto se precisar!";

const TIP_BY_CATEGORY: Record<Category | "all", string> = {
  senhas: "Dica: senhas fortes são longas, misturam letras, números e símbolos. Nunca compartilhe — nem com amigos.",
  golpes: "Dica: desconfie de urgência, prêmios fáceis e links estranhos. Quando em dúvida, não clique.",
  privacidade: "Dica: pense antes de postar. Dados pessoais (CPF, endereço, localização) são valiosos para golpistas.",
  "redes-sociais": "Dica: revise quem te segue, bloqueie desconhecidos insistentes e jamais combine encontros sozinho.",
  dispositivos: "Dica: mantenha apps atualizados, use Wi-Fi confiável e evite instalar apps fora das lojas oficiais.",
  all: "Dica: leia com calma e elimine as alternativas claramente erradas antes de responder.",
};

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [levelIndex, setLevelIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const prefsLoaded = useRef(false);

  // Mascot state
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const [mascotMessage, setMascotMessage] = useState<string | undefined>();
  const wrongStreak = useRef(0);
  const rightStreak = useRef(0);

  // Load preferences from backend on mount
  useEffect(() => {
    let mounted = true;
    getPreferences().then((prefs) => {
      if (!mounted) return;
      if (isValidCategory(prefs.lastCategory)) {
        setSelectedCategory(prefs.lastCategory);
      }
      if (!prefs.tutorialSeen) {
        setMascotMood("tutorial");
        setMascotMessage(TUTORIAL_MESSAGE);
        void setTutorialSeenPref(true);
      }
      prefsLoaded.current = true;
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Persist last category to backend whenever it changes (after initial load)
  useEffect(() => {
    if (!prefsLoaded.current) return;
    void setLastCategoryPref(selectedCategory);
  }, [selectedCategory]);


  const questions = useMemo(() => {
    let pool;
    if (selectedCategory === "all") {
      pool = [...allQuestions];
    } else if (levelIndex) {
      pool = getQuestionsForLevel(selectedCategory, levelIndex);
    } else {
      pool = allQuestions.filter((q) => q.category === selectedCategory);
    }
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // For "all", cap at QUESTIONS_PER_LEVEL for a quick free-play round
    return selectedCategory === "all" ? shuffled.slice(0, QUESTIONS_PER_LEVEL) : shuffled;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, levelIndex, phase]);

  const categoryLabel =
    selectedCategory === "all"
      ? "Treino livre"
      : categories.find((c) => c.id === selectedCategory)?.label ?? "";

  const handleStart = useCallback(() => {
    setMascotMessage(undefined);
    setMascotMood("idle");
    setPhase("category");
  }, []);

  const handleSelectCategory = useCallback((cat: Category | "all") => {
    setSelectedCategory(cat);
    setCurrentQuestion(0);
    setScore(0);
    if (cat === "all") {
      setLevelIndex(null);
      setPhase("quiz");
    } else {
      setPhase("level");
    }
  }, []);

  const handleSelectLevel = useCallback((idx: number) => {
    setLevelIndex(idx);
    setCurrentQuestion(0);
    setScore(0);
    setPhase("quiz");
    setMascotMood("idle");
    setMascotMessage(`Nível ${idx} iniciado! Boa sorte 🚀`);
    wrongStreak.current = 0;
    rightStreak.current = 0;
  }, []);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) {
        setScore((s) => s + 10);
        rightStreak.current += 1;
        wrongStreak.current = 0;
        if (rightStreak.current >= 3) {
          setMascotMood("celebrate");
          setMascotMessage(`Sequência de ${rightStreak.current} acertos! Você está voando 🎉`);
          rightStreak.current = 0;
        }
      } else {
        wrongStreak.current += 1;
        rightStreak.current = 0;
        if (wrongStreak.current >= 2) {
          setMascotMood("tip");
          setMascotMessage(TIP_BY_CATEGORY[selectedCategory]);
          wrongStreak.current = 0;
        }
      }

      if (currentQuestion + 1 >= questions.length) {
        setTimeout(() => setPhase("result"), 300);
      } else {
        setCurrentQuestion((c) => c + 1);
      }
    },
    [currentQuestion, questions.length, selectedCategory]
  );

  const handleRestart = useCallback(() => {
    setPhase("welcome");
    setCurrentQuestion(0);
    setScore(0);
    setLevelIndex(null);
    setMascotMessage(undefined);
    setMascotMood("idle");
  }, []);

  const mascot = (
    <RobotMascot
      mood={mascotMood}
      message={mascotMessage}
      onDismiss={() => setMascotMessage(undefined)}
    />
  );

  if (phase === "welcome")
    return (
      <>
        <WelcomeScreen onStart={handleStart} />
        {mascot}
      </>
    );

  if (phase === "category")
    return (
      <>
        <CategorySelect onSelect={handleSelectCategory} onBack={handleRestart} selected={selectedCategory} />
        {mascot}
      </>
    );

  if (phase === "level" && selectedCategory !== "all")
    return (
      <>
        <LevelSelect
          category={selectedCategory}
          onSelect={handleSelectLevel}
          onBack={() => setPhase("category")}
        />
        {mascot}
      </>
    );

  if (phase === "result") {
    return (
      <>
        <QuizResult
          score={score}
          total={questions.length * 10}
          onRestart={handleRestart}
          category={selectedCategory}
          categoryLabel={categoryLabel}
          levelIndex={levelIndex}
        />
        {mascot}
      </>
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
            {levelIndex && ` · Nível ${levelIndex}`}
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

      {mascot}
    </div>
  );
};

export default Index;
