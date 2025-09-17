import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWorkoutRecommendations } from "@/hooks/useWorkoutRecommendations";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Brain, 
  Clock, 
  Zap,
  Target,
  Star,
  Play
} from "lucide-react";

export const WorkoutRecommendations = () => {
  const { getRecommendations, recommendations, loading } = useWorkoutRecommendations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [preferences, setPreferences] = useState({
    difficulty: '',
    duration: '',
    categories: [] as string[],
    goals: ''
  });

  const handleGetRecommendations = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const cleanPrefs = {
      ...(preferences.difficulty && { difficulty: preferences.difficulty as 'beginner' | 'intermediate' | 'advanced' }),
      ...(preferences.duration && { duration: parseInt(preferences.duration) }),
      ...(preferences.categories.length > 0 && { categories: preferences.categories }),
      ...(preferences.goals && { goals: preferences.goals })
    };

    await getRecommendations(cleanPrefs, 3);
    setShowForm(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-500 bg-green-500/10';
      case 'intermediate': return 'text-yellow-500 bg-yellow-500/10';
      case 'advanced': return 'text-red-500 bg-red-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  const handleCategoryToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const categories = ['strength', 'cardio', 'flexibility', 'combat', 'endurance'];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="spartan-title text-4xl md:text-6xl mb-4 text-gradient">
            AI TRAINING ORACLE
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let our AI analyze your warrior journey and recommend the perfect training regimen
          </p>
        </div>

        {/* Main CTA or Recommendations */}
        {recommendations.length === 0 ? (
          <Card className="max-w-2xl mx-auto gradient-spartan p-1 rounded-lg">
            <div className="bg-background rounded-md p-8 text-center">
              <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="spartan-title text-2xl mb-4">Unlock Your Potential</h3>
              <p className="text-muted-foreground mb-6">
                Our AI will analyze your training history, current fitness level, and goals to recommend 
                the most effective workouts for your warrior transformation.
              </p>
              
              {!showForm ? (
                <Button 
                  size="lg" 
                  className="gradient-bronze text-lg px-8 py-6"
                  onClick={() => setShowForm(true)}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  GET AI RECOMMENDATIONS
                </Button>
              ) : (
                <div className="space-y-6 text-left">
                  {/* Preferences Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Difficulty Preference</label>
                      <Select value={preferences.difficulty} onValueChange={(value) => setPreferences(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                      <Select value={preferences.duration} onValueChange={(value) => setPreferences(prev => ({ ...prev, duration: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Badge
                          key={category}
                          variant={preferences.categories.includes(category) ? "default" : "outline"}
                          className="cursor-pointer capitalize"
                          onClick={() => handleCategoryToggle(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Training Goals</label>
                    <Textarea
                      placeholder="e.g., Build upper body strength, improve cardio endurance, prepare for competition..."
                      value={preferences.goals}
                      onChange={(e) => setPreferences(prev => ({ ...prev, goals: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      size="lg" 
                      className="flex-1 gradient-bronze"
                      onClick={handleGetRecommendations}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                          ANALYZING...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-5 w-5" />
                          GET RECOMMENDATIONS
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Header with new recommendations button */}
            <div className="flex justify-between items-center">
              <h3 className="spartan-title text-2xl">Your AI-Powered Recommendations</h3>
              <Button 
                onClick={() => setShowForm(true)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                New Recommendations
              </Button>
            </div>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((workout, index) => (
                <Card key={workout.id} className="group hover:scale-105 transition-all duration-300 border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getDifficultyColor(workout.difficulty)}>
                        {workout.difficulty}
                      </Badge>
                      <div className="flex items-center">
                        {Array.from({ length: workout.priority }, (_, i) => (
                          <Star key={i} className="h-4 w-4 text-accent fill-current" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="spartan-title text-xl text-foreground">
                      {workout.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {workout.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Target className="mr-1 h-4 w-4 text-primary" />
                          <span className="capitalize">{workout.category}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-secondary" />
                          <span>{workout.duration_minutes} min</span>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Why recommended:</strong> {workout.reason}
                        </p>
                      </div>

                      <Button 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        START WORKOUT
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};