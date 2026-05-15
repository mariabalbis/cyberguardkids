
CREATE TABLE public.quiz_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'all',
  category_label TEXT NOT NULL DEFAULT 'Todas as categorias',
  level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz history"
  ON public.quiz_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz history"
  ON public.quiz_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz history"
  ON public.quiz_history FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_quiz_history_user_created ON public.quiz_history(user_id, created_at DESC);
