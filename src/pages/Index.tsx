import { useState, useCallback } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import QuizQuestion from "@/components/QuizQuestion";
import QuizProgress from "@/components/QuizProgress";
import QuizResult from "@/components/QuizResult";
import { questions } from "@/data/questions";
import { Shield } from "lucide-react";

type Phase = "welcome" | "quiz" | "result";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setCurrentQuestion(0);
    setScore(0);
  }, []);

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) setScore((s) => s + 10);

    if (currentQuestion + 1 >= questions.length) {
      setTimeout(() => setPhase("result"), 300);
    } else {
      setCurrentQuestion((c) => c + 1);
    }
  }, [currentQuestion]);

  const handleRestart = useCallback(() => {
    setPhase("welcome");
    setCurrentQuestion(0);
    setScore(0);
  }, []);

  if (phase === "welcome") return <WelcomeScreen onStart={handleStart} />;

  if (phase === "result") {
    return <QuizResult score={score} total={questions.length * 10} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-grid flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">CyberQuiz</span>
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
