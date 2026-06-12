ALTER TABLE public.quiz_history ADD COLUMN IF NOT EXISTS level_index INTEGER;
CREATE INDEX IF NOT EXISTS idx_quiz_history_user_created ON public.quiz_history(user_id, created_at DESC);