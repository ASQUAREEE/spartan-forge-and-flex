import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Flame, 
  Users, 
  Trophy,
  Timer,
  Target
} from "lucide-react";

export const DailyChallenge = () => {
  return (
    <section className="py-20 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="spartan-title text-4xl md:text-6xl mb-4 text-gradient">
            TODAY'S BATTLE
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Face the daily challenge and prove your warrior spirit
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Challenge Card */}
          <Card className="gradient-spartan p-1 rounded-lg">
            <div className="bg-background rounded-md p-8 h-full">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="border-accent text-accent">
                    <Flame className="mr-1 h-3 w-3" />
                    DAILY CHALLENGE
                  </Badge>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    23h 42m left
                  </div>
                </div>
                <CardTitle className="spartan-title text-3xl text-foreground">
                  300 SPARTAN GAUNTLET
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Complete the legendary 300-rep warrior workout that forged the greatest fighters in history
                </p>
              </CardHeader>

              <CardContent className="p-0 space-y-6">
                {/* Workout Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">45 Minutes</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-accent" />
                    <div>
                      <div className="font-semibold">300 Reps</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Flame className="mr-2 h-5 w-5 text-secondary" />
                    <div>
                      <div className="font-semibold">Elite</div>
                      <div className="text-sm text-muted-foreground">Difficulty</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">1,247</div>
                      <div className="text-sm text-muted-foreground">Warriors</div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your Progress</span>
                    <span>187/300 reps</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>

                <Button size="lg" className="w-full gradient-bronze text-lg py-6">
                  <Trophy className="mr-2 h-5 w-5" />
                  CONTINUE BATTLE
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="spartan-title text-2xl flex items-center">
                <Trophy className="mr-2 h-6 w-6 text-accent" />
                HALL OF LEGENDS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { rank: 1, name: "LEONIDAS", time: "42:15", badge: "🏆" },
                { rank: 2, name: "ACHILLES", time: "43:22", badge: "🥈" },
                { rank: 3, name: "HERCULES", time: "44:01", badge: "🥉" },
                { rank: 4, name: "ARES", time: "45:33", badge: "" },
                { rank: 5, name: "AJAX", time: "46:12", badge: "" },
              ].map((warrior) => (
                <div key={warrior.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                      {warrior.badge || warrior.rank}
                    </div>
                    <div>
                      <div className="font-semibold">{warrior.name}</div>
                      <div className="text-sm text-muted-foreground">Warrior #{warrior.rank}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{warrior.time}</div>
                    <div className="text-xs text-muted-foreground">Completion</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};