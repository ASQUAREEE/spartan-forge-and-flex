-- Create enum for workout difficulty
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'legendary');

-- Create enum for workout categories
CREATE TYPE public.workout_category AS ENUM ('strength', 'cardio', 'flexibility', 'combat', 'endurance');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  current_streak INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  rank_level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category workout_category NOT NULL,
  difficulty difficulty_level NOT NULL,
  duration_minutes INTEGER,
  exercises JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_workouts table to track completed workouts
CREATE TABLE public.user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  duration_minutes INTEGER,
  notes TEXT
);

-- Create daily challenges table
CREATE TABLE public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  target_reps INTEGER,
  target_duration INTEGER,
  difficulty difficulty_level NOT NULL,
  challenge_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_challenge_completions table
CREATE TABLE public.user_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_time_seconds INTEGER,
  reps_completed INTEGER,
  UNIQUE(user_id, challenge_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for workouts (public read)
CREATE POLICY "Anyone can view workouts" ON public.workouts
  FOR SELECT USING (true);

-- RLS Policies for user_workouts
CREATE POLICY "Users can view their own workout history" ON public.user_workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout completions" ON public.user_workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily challenges (public read)
CREATE POLICY "Anyone can view daily challenges" ON public.daily_challenges
  FOR SELECT USING (true);

-- RLS Policies for user_challenge_completions
CREATE POLICY "Users can view their own challenge completions" ON public.user_challenge_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenge completions" ON public.user_challenge_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample workouts
INSERT INTO public.workouts (title, description, category, difficulty, duration_minutes, exercises) VALUES
('Spartan 300', 'The legendary 300-rep workout inspired by the movie', 'strength', 'legendary', 45, '[
  {"name": "Pull-ups", "reps": 25},
  {"name": "Deadlifts", "reps": 50},
  {"name": "Push-ups", "reps": 50},
  {"name": "Box jumps", "reps": 50},
  {"name": "Floor wipers", "reps": 50},
  {"name": "Kettlebell clean and press", "reps": 50},
  {"name": "Pull-ups", "reps": 25}
]'::jsonb),
('Warrior Cardio', 'High-intensity cardio for battle readiness', 'cardio', 'advanced', 30, '[
  {"name": "Burpees", "duration": "2 minutes"},
  {"name": "Mountain climbers", "duration": "2 minutes"},
  {"name": "Sprint intervals", "duration": "10 minutes"},
  {"name": "Battle ropes", "duration": "5 minutes"}
]'::jsonb),
('Shield Wall Strength', 'Build the strength of a Spartan shield bearer', 'strength', 'intermediate', 40, '[
  {"name": "Squats", "reps": 100},
  {"name": "Overhead press", "reps": 75},
  {"name": "Rows", "reps": 75},
  {"name": "Planks", "duration": "5 minutes"}
]'::jsonb);

-- Insert today's daily challenge
INSERT INTO public.daily_challenges (title, description, target_reps, target_duration, difficulty, challenge_date) VALUES
('300 Spartan Push-ups', 'Complete 300 push-ups in the fastest time possible. Break them down however you need, but finish strong like a true Spartan warrior!', 300, null, 'advanced', CURRENT_DATE);