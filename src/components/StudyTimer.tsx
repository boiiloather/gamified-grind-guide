import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudyTimerProps {
  onSessionComplete: (data: {
    duration: number;
    xpEarned: number;
    coinsEarned: number;
    distractions: number;
  }) => void;
}

export const StudyTimer = ({ onSessionComplete }: StudyTimerProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [showDangerZone, setShowDangerZone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setIsTabVisible(false);
        setDistractions(prev => prev + 1);
        setShowDangerZone(true);
        toast({
          title: "⚠️ Distraction Detected!",
          description: "Stay focused to maximize your XP rewards!",
          variant: "destructive",
        });
      } else {
        setIsTabVisible(true);
        setTimeout(() => setShowDangerZone(false), 3000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, toast]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setShowDangerZone(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    
    if (time > 0) {
      // Calculate rewards with distraction penalty
      const focusMultiplier = Math.max(0.5, 1 - (distractions * 0.1));
      const baseXP = Math.floor(time / 60) * 10; // 10 XP per minute
      const baseCoins = Math.floor(time / 60) * 5; // 5 coins per minute
      
      const xpEarned = Math.floor(baseXP * focusMultiplier);
      const coinsEarned = Math.floor(baseCoins * focusMultiplier);

      onSessionComplete({
        duration: time,
        xpEarned,
        coinsEarned,
        distractions
      });

      toast({
        title: "🎉 Study Session Complete!",
        description: `Earned ${xpEarned} XP and ${coinsEarned} coins!`,
      });
    }

    // Reset timer
    setTime(0);
    setDistractions(0);
    setShowDangerZone(false);
  };

  const focusScore = time > 0 ? Math.round(((time - distractions * 30) / time) * 100) : 100;

  return (
    <Card className="p-8 bg-gradient-cosmic text-white border-0 shadow-glow relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {showDangerZone && (
        <div className="absolute inset-0 bg-warning/20 animate-pulse rounded-lg border-2 border-warning flex items-center justify-center z-10">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
            <h3 className="text-xl font-bold text-warning">DANGER ZONE</h3>
            <p className="text-warning/80">Stay focused to maximize rewards!</p>
          </div>
        </div>
      )}

      <div className="relative z-20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            {isTabVisible ? (
              <Eye className="w-8 h-8 text-success mr-3" />
            ) : (
              <EyeOff className="w-8 h-8 text-warning mr-3" />
            )}
            <h2 className="text-2xl font-bold">Focus Session</h2>
          </div>
          
          <div className="text-6xl font-mono font-bold mb-6 animate-glow">
            {formatTime(time)}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm opacity-75">Distractions</p>
              <p className="text-2xl font-bold text-warning">{distractions}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-75">Focus Score</p>
              <p className="text-2xl font-bold text-success">{focusScore}%</p>
            </div>
          </div>

          <Progress value={focusScore} className="mb-6" />
        </div>

        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button 
              onClick={startTimer} 
              size="lg"
              className="bg-success hover:bg-success/90 text-success-foreground shadow-glow transition-bounce"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Focus
            </Button>
          ) : (
            <Button 
              onClick={pauseTimer} 
              size="lg"
              className="bg-warning hover:bg-warning/90 text-warning-foreground shadow-glow transition-bounce"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button 
            onClick={stopTimer} 
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 transition-bounce"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop
          </Button>
        </div>
      </div>
    </Card>
  );
};