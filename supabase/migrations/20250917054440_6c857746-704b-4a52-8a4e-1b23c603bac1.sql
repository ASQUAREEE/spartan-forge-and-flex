-- Create the missing tables for the fitness app
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration_minutes INTEGER,
  exercises JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.daily_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  target_reps INTEGER,
  target_duration INTEGER,
  difficulty TEXT NOT NULL,
  challenge_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.user_workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workout_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  duration_minutes INTEGER,
  notes TEXT
);

CREATE TABLE public.user_challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_time_seconds INTEGER,
  reps_completed INTEGER
);

-- Update profiles table to match the fitness app needs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_workouts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rank_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 0;

-- Update existing profiles to have user_id same as id
UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

-- Enable RLS
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Workouts are viewable by everyone" ON public.workouts FOR SELECT USING (true);
CREATE POLICY "Daily challenges are viewable by everyone" ON public.daily_challenges FOR SELECT USING (true);
CREATE POLICY "Users can view their own workout history" ON public.user_workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own workouts" ON public.user_workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own challenge completions" ON public.user_challenge_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own challenge completions" ON public.user_challenge_completions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample workouts
INSERT INTO public.workouts (title, description, category, difficulty, duration_minutes, exercises) VALUES
('Spartan Push-Up Challenge', 'Build upper body strength like a true warrior', 'Strength', 'Beginner', 15, '[{"name": "Push-ups", "reps": "3x10", "rest": "60s"}]'),
('Warriors Core Blast', 'Forge an unbreakable core', 'Core', 'Intermediate', 20, '[{"name": "Plank", "duration": "60s"}, {"name": "Mountain Climbers", "reps": "3x20"}]'),
('Gladiator Cardio Storm', 'Test your endurance limits', 'Cardio', 'Advanced', 30, '[{"name": "Burpees", "reps": "5x10"}, {"name": "High Knees", "duration": "45s"}]');

-- Insert sample daily challenge
INSERT INTO public.daily_challenges (title, description, target_reps, difficulty, challenge_date) VALUES
('300 Spartan Challenge', 'Can you complete 300 total reps today?', 300, 'Advanced', CURRENT_DATE);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();