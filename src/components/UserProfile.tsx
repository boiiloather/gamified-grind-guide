import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Coins, Zap, Target } from 'lucide-react';
import avatarRobot from '@/assets/avatar-robot.png';

interface UserProfileProps {
  user: {
    name: string;
    level: number;
    xp: number;
    coins: number;
    streak: number;
    avatar: string;
    totalXP: number;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const xpToNextLevel = user.level * 1000;
  const currentLevelXP = user.xp % 1000;
  const progressPercent = (currentLevelXP / 1000) * 100;

  return (
    <Card className="p-6 bg-gradient-primary text-white border-0 shadow-glow">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img 
            src={avatarRobot} 
            alt="User Avatar" 
            className="w-20 h-20 rounded-full border-4 border-white/20 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground rounded-full px-2 py-1 text-xs font-bold flex items-center">
            <Crown className="w-3 h-3 mr-1" />
            {user.level}
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-1">{user.name}</h2>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <Badge variant="outline" className="border-white/20 text-white">
              Level {user.level}
            </Badge>
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              {user.streak} day streak
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-75">Progress to Level {user.level + 1}</span>
            <span className="text-sm font-medium">{currentLevelXP} / {xpToNextLevel} XP</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-5 h-5 text-accent mr-2" />
              <span className="text-2xl font-bold">{user.xp.toLocaleString()}</span>
            </div>
            <p className="text-xs opacity-75">Total XP</p>
          </div>
          
          <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-center mb-1">
              <Coins className="w-5 h-5 text-accent mr-2" />
              <span className="text-2xl font-bold">{user.coins.toLocaleString()}</span>
            </div>
            <p className="text-xs opacity-75">Coins</p>
          </div>
        </div>
      </div>
    </Card>
  );
};