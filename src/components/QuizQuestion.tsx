import { useState } from "react";
import { Question } from "@/data/questions";
import { CheckCircle2, XCircle, ChevronRight } from "lucide-react";

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  onAnswer: (correct: boolean) => void;
}

const difficultyColors: Record<string, string> = {
  "iniciante": "bg-success/15 text-success",
  "intermediário": "bg-warning/15 text-warning",
  "avançado": "bg-destructive/15 text-destructive",
};

const QuizQuestion = ({ question, questionNumber, onAnswer }: QuizQuestionProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
  };

  const isCorrect = selected === question.correctIndex;

  const handleNext = () => {
    onAnswer(isCorrect);
    setSelected(null);
    setShowFeedback(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-muted-foreground">
          #{String(questionNumber).padStart(2, "0")}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[question.difficulty]}`}>
          {question.difficulty}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-semibold leading-snug text-balance">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          let optionClass = "rounded-xl neon-border bg-card p-4 cursor-pointer transition-all duration-200 text-left w-full flex items-start gap-3";

          if (showFeedback) {
            if (index === question.correctIndex) {
              optionClass += " card-glow-success border-success/40";
            } else if (index === selected) {
              optionClass += " card-glow-error border-destructive/40 animate-shake";
            } else {
              optionClass += " opacity-40";
            }
          } else {
            optionClass += " hover:bg-muted/50 active:scale-[0.98]";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={optionClass}
              disabled={showFeedback}
            >
              <span className="shrink-0 w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-mono font-semibold text-muted-foreground">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm sm:text-base leading-relaxed pt-0.5">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`rounded-xl p-5 space-y-3 animate-scale-pop ${
            isCorrect
              ? "bg-success/10 neon-border border-success/20"
              : "bg-destructive/10 neon-border border-destructive/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <span className={`font-semibold text-sm ${isCorrect ? "text-success" : "text-destructive"}`}>
              {isCorrect ? "Resposta Correta! +10 pts" : "Resposta Incorreta"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isCorrect ? question.explanationCorrect : question.explanationWrong}
          </p>
          <button
            onClick={handleNext}
            className="mt-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
              transition-all duration-200 hover:brightness-110 active:scale-[0.97] inline-flex items-center gap-2"
          >
            Próxima <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
