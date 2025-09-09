import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Workout {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration_minutes: number | null;
  exercises: any;
}

export interface UserWorkout {
  id: string;
  workout_id: string;
  completed_at: string;
  duration_minutes: number | null;
  notes: string | null;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string | null;
  target_reps: number | null;
  target_duration: number | null;
  difficulty: string;
  challenge_date: string;
}

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [userWorkouts, setUserWorkouts] = useState<UserWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkouts();
    fetchDailyChallenge();
    fetchUserWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading workouts",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyChallenge = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_date', today)
        .maybeSingle();

      if (error) throw error;
      setDailyChallenge(data);
    } catch (error: any) {
      toast({
        title: "Error loading daily challenge",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchUserWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_workouts')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setUserWorkouts(data || []);
    } catch (error: any) {
      // Don't show error for unauthenticated users
      console.log('User workouts fetch error:', error.message);
    }
  };

  const completeWorkout = async (workoutId: string, durationMinutes?: number, notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_workouts')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          duration_minutes: durationMinutes,
          notes
        });

      if (error) throw error;

      toast({
        title: "Workout Completed!",
        description: "Your victory has been recorded, warrior!"
      });

      // Refresh user workouts
      fetchUserWorkouts();
    } catch (error: any) {
      toast({
        title: "Error completing workout",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const completeChallenge = async (challengeId: string, completionTimeSeconds?: number, repsCompleted?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_challenge_completions')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          completion_time_seconds: completionTimeSeconds,
          reps_completed: repsCompleted
        });

      if (error) throw error;

      toast({
        title: "Challenge Conquered!",
        description: "You've proven your Spartan strength!"
      });
    } catch (error: any) {
      toast({
        title: "Error completing challenge",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    workouts,
    dailyChallenge,
    userWorkouts,
    loading,
    completeWorkout,
    completeChallenge,
    refetch: () => {
      fetchWorkouts();
      fetchDailyChallenge();
      fetchUserWorkouts();
    }
  };
};