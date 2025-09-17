import { HeroSection } from "@/components/HeroSection";
import { WorkoutCategories } from "@/components/WorkoutCategories";
import { DailyChallenge } from "@/components/DailyChallenge";
import { WorkoutRecommendations } from "@/components/WorkoutRecommendations";
import { StatsSection } from "@/components/StatsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <WorkoutCategories />
      <DailyChallenge />
      <WorkoutRecommendations />
      <StatsSection />
    </div>
  );
};

export default Index;
