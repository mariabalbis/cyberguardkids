import { useEffect, useState } from "react";
import { Bot, X, HelpCircle, Sparkles } from "lucide-react";

export type MascotMood = "idle" | "tutorial" | "tip" | "celebrate";

interface RobotMascotProps {
  mood?: MascotMood;
  message?: string;
  onDismiss?: () => void;
  /** Show a floating help button that opens a tip when clicked */
  showHelpButton?: boolean;
  helpMessage?: string;
}

const moodStyles: Record<MascotMood, { ring: string; glow: string; bubble: string; emoji: string }> = {
  idle: {
    ring: "ring-primary/40",
    glow: "shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]",
    bubble: "border-primary/40 bg-primary/5",
    emoji: "🤖",
  },
  tutorial: {
    ring: "ring-accent/60",
    glow: "shadow-[0_0_50px_-10px_hsl(var(--accent)/0.6)]",
    bubble: "border-accent/40 bg-accent/5",
    emoji: "🤖",
  },
  tip: {
    ring: "ring-warning/60",
    glow: "shadow-[0_0_50px_-10px_hsl(var(--warning)/0.6)]",
    bubble: "border-warning/40 bg-warning/5",
    emoji: "💡",
  },
  celebrate: {
    ring: "ring-success/60",
    glow: "shadow-[0_0_60px_-10px_hsl(var(--success)/0.7)]",
    bubble: "border-success/40 bg-success/5",
    emoji: "🎉",
  },
};

const RobotMascot = ({
  mood = "idle",
  message,
  onDismiss,
  showHelpButton = true,
  helpMessage = "Leia cada pergunta com calma, elimine as alternativas claramente erradas e confie no que você já sabe sobre segurança digital. Se errar, leia a explicação — é assim que você aprende!",
}: RobotMascotProps) => {
  const [open, setOpen] = useState(Boolean(message));
  const [helpOpen, setHelpOpen] = useState(false);
  const style = moodStyles[mood];

  useEffect(() => {
    if (message) {
      setOpen(true);
      setHelpOpen(false);
    }
  }, [message, mood]);

  const activeMessage = helpOpen ? helpMessage : message;
  const activeStyle = helpOpen ? moodStyles.idle : style;
  const isOpen = open && Boolean(activeMessage);

  const handleClose = () => {
    setOpen(false);
    setHelpOpen(false);
    onDismiss?.();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Speech bubble */}
      {isOpen && activeMessage && (
        <div
          className={`pointer-events-auto max-w-xs sm:max-w-sm rounded-2xl border ${activeStyle.bubble} backdrop-blur-md p-4 pr-9 text-sm leading-relaxed text-foreground animate-scale-pop relative`}
        >
          <button
            onClick={handleClose}
            aria-label="Fechar dica"
            className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-2">
            <span className="text-lg leading-none mt-0.5">{activeStyle.emoji}</span>
            <p className="text-[13px]">{activeMessage}</p>
          </div>
          <div className="absolute -bottom-1.5 right-8 w-3 h-3 rotate-45 border-r border-b border-inherit bg-inherit" />
        </div>
      )}

      {/* Robot avatar + help button */}
      <div className="pointer-events-auto flex items-center gap-2">
        {showHelpButton && (
          <button
            onClick={() => {
              setHelpOpen(true);
              setOpen(true);
            }}
            aria-label="Ajuda do CyberBot"
            className="w-10 h-10 rounded-full bg-card neon-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => {
            if (message && !isOpen) setOpen(true);
            else if (!message) {
              setHelpOpen(true);
              setOpen(true);
            }
          }}
          aria-label="CyberBot"
          className={`relative w-14 h-14 rounded-full bg-card ring-2 ${activeStyle.ring} ${activeStyle.glow} flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
            mood === "celebrate" ? "animate-bounce" : mood === "tip" ? "animate-pulse-glow" : ""
          }`}
        >
          <Bot className="w-7 h-7 text-primary" />
          {mood === "celebrate" && (
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-success animate-scale-pop" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RobotMascot;
