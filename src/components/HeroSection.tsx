import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sword, Shield, Trophy, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import spartanHero from "@/assets/spartan-hero.jpg";

export const HeroSection = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Navigation */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">
                {profile?.display_name || user.email?.split('@')[0]}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="border-primary/20 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => navigate('/auth')}
            className="gradient-spartan"
          >
            Enter Arena
          </Button>
        )}
      </div>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={spartanHero} 
          alt="Spartan warrior training" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <h1 className="spartan-title text-6xl md:text-8xl mb-6 text-gradient">
          FORGE THE WARRIOR
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-foreground/90 max-w-2xl mx-auto">
          Train like a Spartan. Build unbreakable discipline. Achieve legendary strength.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="gradient-spartan text-lg px-8 py-6 warrior-pulse">
            <Sword className="mr-2 h-5 w-5" />
            BEGIN TRAINING
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Shield className="mr-2 h-5 w-5" />
            VIEW PROGRESS
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="bg-card/80 backdrop-blur border-primary/20 p-6">
            <div className="text-center">
              <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">300+</div>
              <div className="text-muted-foreground">Workouts</div>
            </div>
          </Card>
          <Card className="bg-card/80 backdrop-blur border-primary/20 p-6">
            <div className="text-center">
              <Sword className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">ELITE</div>
              <div className="text-muted-foreground">Training</div>
            </div>
          </Card>
          <Card className="bg-card/80 backdrop-blur border-primary/20 p-6">
            <div className="text-center">
              <Shield className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">UNBROKEN</div>
              <div className="text-muted-foreground">Discipline</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};