import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Crown, Trophy, UserPlus, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import avatarRobot from '@/assets/avatar-robot.png';
import avatarWizard from '@/assets/avatar-wizard.png';

interface TeamMember {
  id: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  country: string;
  role: 'leader' | 'member';
  avatar: string;
}

interface Team {
  id: string;
  name: string;
  type: 'private' | 'public';
  members: TeamMember[];
  inviteCode: string;
}

interface TeamOverviewProps {
  currentTeam: Team | null;
  onJoinTeam: (teamId: string) => void;
  onCreateTeam: () => void;
}

const mockTeam: Team = {
  id: 'team-1',
  name: 'Focus Warriors',
  type: 'private',
  inviteCode: 'FW2024',
  members: [
    {
      id: '1',
      name: 'Alex Chen',
      level: 25,
      xp: 15420,
      streak: 12,
      country: '🇺🇸',
      role: 'leader',
      avatar: avatarRobot
    },
    {
      id: '2',
      name: 'You',
      level: 8,
      xp: 4250,
      streak: 5,
      country: '🌍',
      role: 'member',
      avatar: avatarRobot
    },
    {
      id: '3',
      name: 'Sarah Kim',
      level: 18,
      xp: 9800,
      streak: 8,
      country: '🇰🇷',
      role: 'member',
      avatar: avatarWizard
    },
    {
      id: '4',
      name: 'Miguel Torres',
      level: 22,
      xp: 12650,
      streak: 15,
      country: '🇲🇽',
      role: 'member',
      avatar: avatarRobot
    }
  ]
};

export const TeamOverview = ({ currentTeam = mockTeam, onJoinTeam, onCreateTeam }: TeamOverviewProps) => {
  const [showInviteCode, setShowInviteCode] = useState(false);
  const { toast } = useToast();

  const sortedMembers = currentTeam ? [...currentTeam.members].sort((a, b) => b.xp - a.xp) : [];

  const copyInviteCode = () => {
    if (currentTeam) {
      navigator.clipboard.writeText(currentTeam.inviteCode);
      toast({
        title: "📋 Invite Code Copied!",
        description: "Share this code with friends to join your team!",
      });
    }
  };

  const shareInviteLink = () => {
    const inviteLink = `https://productivitycoach.app/join/${currentTeam?.inviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "🔗 Invite Link Copied!",
      description: "Share this link to invite friends!",
    });
  };

  if (!currentTeam) {
    return (
      <Card className="p-6 bg-card border shadow-card">
        <div className="text-center">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Join a Study Team</h3>
          <p className="text-muted-foreground mb-6">
            Team up with friends to boost motivation and compete on leaderboards!
          </p>
          <div className="space-y-3">
            <Button onClick={onCreateTeam} className="w-full bg-gradient-primary text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
            <Button variant="outline" className="w-full">
              Join with Code
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            {currentTeam.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={currentTeam.type === 'private' ? 'outline' : 'default'}>
              {currentTeam.type}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentTeam.members.length} members
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInviteCode(!showInviteCode)}
        >
          <Share className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>

      {showInviteCode && (
        <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-3 text-sm">Invite Friends</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-background border rounded text-sm font-mono">
                {currentTeam.inviteCode}
              </code>
              <Button size="sm" onClick={copyInviteCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Button size="sm" variant="outline" onClick={shareInviteLink} className="w-full">
              Share Invite Link
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Leaderboard</h3>
          <Trophy className="w-5 h-5 text-accent" />
        </div>

        <div className="space-y-3">
          {sortedMembers.map((member, index) => (
            <div
              key={member.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                index === 0 
                  ? 'bg-gradient-reward text-white shadow-reward' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className={`text-lg font-bold ${index === 0 ? 'text-white' : 'text-muted-foreground'}`}>
                    #{index + 1}
                  </span>
                  {index === 0 && <Crown className="w-4 h-4 text-accent absolute -top-2 -right-2" />}
                </div>
                <Avatar className="w-10 h-10 border-2 border-white/20">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`font-semibold truncate ${index === 0 ? 'text-white' : 'text-foreground'}`}>
                    {member.name}
                  </h4>
                  <span className="text-sm">{member.country}</span>
                  {member.role === 'leader' && (
                    <Badge variant="outline" className={index === 0 ? 'border-white text-white' : ''}>
                      Leader
                    </Badge>
                  )}
                </div>
                <div className={`text-sm ${index === 0 ? 'text-white/80' : 'text-muted-foreground'}`}>
                  Level {member.level} • {member.xp.toLocaleString()} XP • {member.streak} day streak
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Team Progress</span>
          <span className="text-sm text-muted-foreground">This Week</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total XP Earned</span>
            <span className="font-bold text-primary">24,580 XP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Study Sessions</span>
            <span className="font-bold text-primary">156 sessions</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Team Rank</span>
            <span className="font-bold text-accent">#3 Global</span>
          </div>
        </div>
      </div>
    </Card>
  );
};