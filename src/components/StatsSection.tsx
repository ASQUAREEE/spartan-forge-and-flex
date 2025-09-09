import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { 
  TrendingUp, 
  Flame, 
  Trophy, 
  Target,
  Clock,
  Zap,
  Crown
} from "lucide-react";

export const StatsSection = () => {
  const { profile } = useProfile();
  const { user } = useAuth();

  const getRankName = (level: number) => {
    if (level >= 10) return "Spartan Legend";
    if (level >= 7) return "Spartan Elite";
    if (level >= 5) return "Spartan Warrior";
    if (level >= 3) return "Spartan Fighter";
    return "Recruit";
  };

  const defaultStats = [
    {
      icon: Flame,
      title: "Current Streak",
      value: "0",
      unit: "days",
      progress: 0,
      color: "text-primary"
    },
    {
      icon: Crown,
      title: "Rank",
      value: "Recruit",
      unit: "Level 1",
      progress: 0,
      color: "text-accent"
    },
    {
      icon: Target,
      title: "Workouts Completed",
      value: "0",
      unit: "sessions",
      progress: 0,
      color: "text-secondary"
    },
    {
      icon: Trophy,
      title: "Experience Points",
      value: "0",
      unit: "XP",
      progress: 0,
      color: "text-primary"
    }
  ];

  const stats = user && profile ? [
    {
      icon: Flame,
      title: "Current Streak",
      value: profile.current_streak.toString(),
      unit: "days",
      progress: Math.min(profile.current_streak * 5, 100),
      color: "text-primary"
    },
    {
      icon: Crown,
      title: "Rank",
      value: getRankName(profile.rank_level),
      unit: `Level ${profile.rank_level}`,
      progress: (profile.rank_level / 10) * 100,
      color: "text-accent"
    },
    {
      icon: Target,
      title: "Workouts Completed",
      value: profile.total_workouts.toString(),
      unit: "sessions",
      progress: Math.min(profile.total_workouts * 2, 100),
      color: "text-secondary"
    },
    {
      icon: Trophy,
      title: "Experience Points",
      value: profile.experience_points.toString(),
      unit: "XP",
      progress: Math.min((profile.experience_points / 1000) * 100, 100),
      color: "text-primary"
    }
  ] : defaultStats;

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="spartan-title text-4xl md:text-6xl mb-4 text-gradient">
            WARRIOR PROGRESS
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your journey from recruit to legendary Spartan warrior
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <CardTitle className="text-lg text-muted-foreground font-normal">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.unit}</div>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Badges */}
        <Card className="border-primary/20 bg-card/30 backdrop-blur">
          <CardHeader>
            <CardTitle className="spartan-title text-2xl flex items-center">
              <Trophy className="mr-2 h-6 w-6 text-accent" />
              EARNED HONORS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {[
                { name: "First Victory", icon: "🏆", unlocked: true },
                { name: "Iron Will", icon: "⚔️", unlocked: true },
                { name: "Bronze Warrior", icon: "🛡️", unlocked: true },
                { name: "Fire Keeper", icon: "🔥", unlocked: true },
                { name: "Storm Bringer", icon: "⚡", unlocked: false },
                { name: "Legend", icon: "👑", unlocked: false },
                { name: "Immortal", icon: "💫", unlocked: false },
                { name: "God of War", icon: "⭐", unlocked: false },
              ].map((badge) => (
                <div key={badge.name} className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 transition-all duration-300 ${
                    badge.unlocked 
                      ? 'bg-gradient-to-br from-accent to-primary shadow-lg scale-110' 
                      : 'bg-muted/50 grayscale opacity-50'
                  }`}>
                    {badge.icon}
                  </div>
                  <div className={`text-xs font-semibold ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};