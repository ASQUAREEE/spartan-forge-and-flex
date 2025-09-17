import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WorkoutPreferences {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  categories?: string[];
  goals?: string;
}

interface WorkoutRecommendation {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration_minutes: number;
  description: string;
  reason: string;
  priority: number;
}

interface RecommendationResponse {
  recommendations: WorkoutRecommendation[];
  userContext: {
    totalWorkouts: number;
    currentStreak: number;
    rankLevel: number;
  };
}

export const useWorkoutRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<WorkoutRecommendation[]>([]);
  const { toast } = useToast();

  const getRecommendations = async (preferences: WorkoutPreferences = {}, count: number = 3) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('workout-recommendations', {
        body: { preferences, count }
      });

      if (error) {
        console.error('Error getting workout recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to get workout recommendations. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const response = data as RecommendationResponse;
      setRecommendations(response.recommendations);
      
      toast({
        title: "Recommendations Ready!",
        description: `Generated ${response.recommendations.length} personalized workout recommendations.`,
      });

      return response;
    } catch (error) {
      console.error('Error calling workout recommendations function:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    getRecommendations,
    recommendations,
    loading
  };
};