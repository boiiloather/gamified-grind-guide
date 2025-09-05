import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StudyTimer } from '@/components/StudyTimer';
import { UserProfile } from '@/components/UserProfile';
import { QuizModal } from '@/components/QuizModal';
import { ShopSidebar } from '@/components/ShopSidebar';
import { FocusInsights } from '@/components/FocusInsights';
import { TeamOverview } from '@/components/TeamOverview';
import { Brain, Users, Trophy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import cosmicTheme from '@/assets/theme-cosmic.jpg';

export const Dashboard = () => {
  const [user, setUser] = useState({
    name: "Productivity Hero",
    level: 8,
    xp: 4250,
    coins: 1200,
    streak: 5,
    avatar: "robot",
    totalXP: 4250
  });

  const [showQuiz, setShowQuiz] = useState(false);
  const [todayStats, setTodayStats] = useState({
    sessionsCompleted: 3,
    totalFocusTime: 2340, // seconds
    averageFocusScore: 87,
    bestStreak: 1800,
    xpEarned: 350
  });

  const { toast } = useToast();

  useEffect(() => {
    // Welcome message
    toast({
      title: "🚀 Welcome to ProductivityCoach!",
      description: "Start your focus journey and earn rewards!",
    });
  }, [toast]);

  const handleSessionComplete = (data: {
    duration: number;
    xpEarned: number;
    coinsEarned: number;
    distractions: number;
  }) => {
    // Update user stats
    setUser(prev => ({
      ...prev,
      xp: prev.xp + data.xpEarned,
      coins: prev.coins + data.coinsEarned,
      totalXP: prev.totalXP + data.xpEarned,
      level: Math.floor((prev.totalXP + data.xpEarned) / 1000) + 1
    }));

    // Update today's stats
    setTodayStats(prev => ({
      ...prev,
      sessionsCompleted: prev.sessionsCompleted + 1,
      totalFocusTime: prev.totalFocusTime + data.duration,
      xpEarned: prev.xpEarned + data.xpEarned,
      averageFocusScore: Math.round((prev.averageFocusScore + (100 - data.distractions * 10)) / 2)
    }));
  };

  const handleQuizComplete = (score: number, xp: number, coins: number) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + xp,
      coins: prev.coins + coins,
      totalXP: prev.totalXP + xp,
      level: Math.floor((prev.totalXP + xp) / 1000) + 1
    }));

    toast({
      title: "🧠 Quiz Mastery!",
      description: `Scored ${score}/5! Earned ${xp} XP and ${coins} coins!`,
    });
  };

  const handlePurchase = (item: any) => {
    if (user.coins >= item.price) {
      setUser(prev => ({
        ...prev,
        coins: prev.coins - item.price
      }));
    }
  };

  const handleEquip = (item: any) => {
    // Handle item equipping logic here
    console.log('Equipped:', item);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${cosmicTheme})` }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ProductivityCoach</h1>
                <p className="text-white/80">Gamified Focus & Learning Platform</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowQuiz(true)}
                className="bg-secondary hover:bg-secondary/90 text-white shadow-glow"
              >
                <Brain className="w-4 h-4 mr-2" />
                Quick Quiz
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4 mr-2" />
                Teams
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-3 space-y-6">
              {/* User Profile */}
              <UserProfile user={user} />

              {/* Study Timer */}
              <StudyTimer onSessionComplete={handleSessionComplete} />

              {/* Bottom Row - Focus Insights and Team */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <FocusInsights todayStats={todayStats} />
                <TeamOverview 
                  currentTeam={null}
                  onJoinTeam={(teamId) => console.log('Join team:', teamId)}
                  onCreateTeam={() => console.log('Create team')}
                />
              </div>
            </div>

            {/* Sidebar - Shop */}
            <div className="lg:col-span-1">
              <ShopSidebar 
                coins={user.coins}
                onPurchase={handlePurchase}
                onEquip={handleEquip}
              />
            </div>
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={() => setShowQuiz(true)}
              size="lg"
              className="rounded-full w-16 h-16 bg-gradient-reward text-white shadow-reward animate-pulse-reward"
            >
              <Sparkles className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal
        open={showQuiz}
        onOpenChange={setShowQuiz}
        onComplete={handleQuizComplete}
      />
    </div>
  );
};