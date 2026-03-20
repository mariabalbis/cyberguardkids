interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
}

const QuizProgress = ({ current, total, score }: QuizProgressProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-mono">
          {current}/{total}
        </span>
        <span className="font-semibold text-accent font-mono">
          {score} pts
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;
