import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock, Brain, Zap, Award } from 'lucide-react';

interface FocusInsightsProps {
  todayStats: {
    sessionsCompleted: number;
    totalFocusTime: number;
    averageFocusScore: number;
    bestStreak: number;
    xpEarned: number;
  };
}

export const FocusInsights = ({ todayStats }: FocusInsightsProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-accent';
    return 'text-warning';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'outline';
  };

  const motivationalQuotes = [
    "Focus is the gateway to thinking clearly.",
    "Your future is created by what you do today.",
    "Excellence is never an accident.",
    "Success is the sum of small efforts.",
    "The expert in anything was once a beginner."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-primary text-white border-0 shadow-glow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-6 h-6 mr-2 text-accent" />
            AI Focus Insights
          </h2>
          <Badge variant="outline" className="border-white/20 text-white">
            Today's Report
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <Target className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{todayStats.sessionsCompleted}</div>
            <div className="text-xs opacity-75">Sessions</div>
          </div>
          
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{formatTime(todayStats.totalFocusTime)}</div>
            <div className="text-xs opacity-75">Focus Time</div>
          </div>
          
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${getScoreColor(todayStats.averageFocusScore)}`} />
            <div className={`text-2xl font-bold ${getScoreColor(todayStats.averageFocusScore)}`}>
              {todayStats.averageFocusScore}%
            </div>
            <div className="text-xs opacity-75">Avg Score</div>
          </div>
          
          <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{todayStats.xpEarned}</div>
            <div className="text-xs opacity-75">XP Earned</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">Daily Focus Goal</span>
              <span className="text-sm font-medium">{Math.min(100, Math.round((todayStats.totalFocusTime / 3600) * 100))}%</span>
            </div>
            <Progress value={Math.min(100, (todayStats.totalFocusTime / 3600) * 100)} className="h-2" />
            <p className="text-xs opacity-75 mt-1">Target: 1 hour of focused study</p>
          </div>

          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 text-accent mr-2" />
              <span className="font-semibold">Performance Insights</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Focus Score</span>
                <Badge variant={getScoreBadgeVariant(todayStats.averageFocusScore)} className="text-xs">
                  {todayStats.averageFocusScore >= 90 ? 'Excellent' : 
                   todayStats.averageFocusScore >= 70 ? 'Good' : 'Needs Work'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Best Streak</span>
                <span className="font-medium">{formatTime(todayStats.bestStreak)}</span>
              </div>
              <div className="flex justify-between">
                <span>Optimal Study Time</span>
                <span className="font-medium text-accent">Morning</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border shadow-card">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold mb-2">Daily Motivation</h3>
          <p className="text-muted-foreground italic">"{randomQuote}"</p>
        </div>
      </Card>
    </div>
  );
};