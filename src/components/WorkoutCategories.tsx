import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sword, 
  Shield, 
  Zap, 
  Target, 
  Mountain, 
  Flame,
  ChevronRight
} from "lucide-react";

const categories = [
  {
    icon: Sword,
    title: "STRENGTH",
    description: "Build raw power like ancient warriors",
    workouts: 42,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Zap,
    title: "ENDURANCE",
    description: "Forge unbreakable stamina and willpower",
    workouts: 38,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Target,
    title: "COMBAT",
    description: "Master tactical fitness and agility",
    workouts: 29,
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: Mountain,
    title: "CONDITIONING",
    description: "Total body transformation program",
    workouts: 35,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Flame,
    title: "HIIT",
    description: "High-intensity warrior protocols",
    workouts: 24,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    icon: Shield,
    title: "RECOVERY",
    description: "Restore and rebuild like a champion",
    workouts: 18,
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  }
];

export const WorkoutCategories = () => {
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
          {categories.map((category, index) => (
            <Card 
              key={category.title} 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer border-primary/20 bg-card/50 backdrop-blur"
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full ${category.bgColor} flex items-center justify-center mb-4`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <CardTitle className="spartan-title text-xl text-foreground">
                  {category.title}
                </CardTitle>
                <p className="text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-primary">{category.workouts}</span>
                  <span className="text-muted-foreground ml-1">workouts</span>
                </div>
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                  START TRAINING
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};