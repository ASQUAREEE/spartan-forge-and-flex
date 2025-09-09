import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { 
  Sword, 
  Shield, 
  Zap, 
  Target, 
  Mountain, 
  Flame,
  ChevronRight,
  Dumbbell,
  Heart,
  Activity,
  Swords
} from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'strength': return Dumbbell;
    case 'cardio': return Heart;
    case 'flexibility': return Zap;
    case 'combat': return Swords;
    case 'endurance': return Activity;
    default: return Shield;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'strength': return { color: "text-primary", bgColor: "bg-primary/10" };
    case 'cardio': return { color: "text-red-500", bgColor: "bg-red-500/10" };
    case 'flexibility': return { color: "text-blue-500", bgColor: "bg-blue-500/10" };
    case 'combat': return { color: "text-orange-500", bgColor: "bg-orange-500/10" };
    case 'endurance': return { color: "text-green-500", bgColor: "bg-green-500/10" };
    default: return { color: "text-purple-500", bgColor: "bg-purple-500/10" };
  }
};

export const WorkoutCategories = () => {
  const { workouts, loading, completeWorkout } = useWorkouts();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Group workouts by category and count them
  const categoryStats = workouts.reduce((acc, workout) => {
    acc[workout.category] = (acc[workout.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    { name: 'strength', title: 'STRENGTH', description: 'Build the power of ancient warriors through resistance training and weightlifting.' },
    { name: 'cardio', title: 'CARDIO', description: 'Develop the endurance needed for battle with high-intensity cardiovascular training.' },
    { name: 'flexibility', title: 'FLEXIBILITY', description: 'Maintain agility and prevent injury with warrior stretching and mobility work.' },
    { name: 'combat', title: 'COMBAT', description: 'Learn the fighting techniques and martial arts of elite Spartan warriors.' },
    { name: 'endurance', title: 'ENDURANCE', description: 'Push your limits with long-distance challenges and stamina-building exercises.' }
  ];

  const handleStartTraining = (category: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // For now, complete a random workout from this category
    const categoryWorkouts = workouts.filter(w => w.category === category);
    if (categoryWorkouts.length > 0) {
      const randomWorkout = categoryWorkouts[Math.floor(Math.random() * categoryWorkouts.length)];
      completeWorkout(randomWorkout.id, randomWorkout.duration_minutes || undefined);
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="spartan-title text-4xl md:text-6xl mb-4 text-gradient">
            CHOOSE YOUR BATTLEFIELD
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your training discipline and begin the transformation into an elite warrior
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const CategoryIcon = getCategoryIcon(category.name);
            const { color, bgColor } = getCategoryColor(category.name);
            const workoutCount = categoryStats[category.name] || 0;
            
            return (
              <Card 
                key={category.name} 
                className="group hover:scale-105 transition-all duration-300 cursor-pointer border-primary/20 bg-card/50 backdrop-blur"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${bgColor} flex items-center justify-center mb-4`}>
                    <CategoryIcon className={`h-8 w-8 ${color}`} />
                  </div>
                  <CardTitle className="spartan-title text-xl text-foreground">
                    {category.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary">{workoutCount}</span>
                    <span className="text-muted-foreground ml-1">workouts</span>
                  </div>
                  <Button 
                    onClick={() => handleStartTraining(category.name)}
                    disabled={loading || workoutCount === 0}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    {!user ? 'SIGN IN TO TRAIN' : 'START TRAINING'}
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};