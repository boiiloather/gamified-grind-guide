import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Palette, User, Music, Check, Coins, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import avatarRobot from '@/assets/avatar-robot.png';
import avatarWizard from '@/assets/avatar-wizard.png';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: 'theme' | 'avatar' | 'music';
  image?: string;
  preview?: string;
  owned: boolean;
  equipped: boolean;
}

interface ShopSidebarProps {
  coins: number;
  onPurchase: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

const shopItems: ShopItem[] = [
  // Themes
  { id: 'theme-cosmic', name: 'Cosmic Purple', price: 500, category: 'theme', owned: true, equipped: true },
  { id: 'theme-forest', name: 'Forest Calm', price: 750, category: 'theme', owned: false, equipped: false },
  { id: 'theme-ocean', name: 'Ocean Waves', price: 1000, category: 'theme', owned: false, equipped: false },
  { id: 'theme-sunset', name: 'Golden Sunset', price: 1250, category: 'theme', owned: false, equipped: false },
  
  // Avatars
  { id: 'avatar-robot', name: 'Cyber Bot', price: 300, category: 'avatar', image: avatarRobot, owned: true, equipped: true },
  { id: 'avatar-wizard', name: 'Wise Wizard', price: 400, category: 'avatar', image: avatarWizard, owned: false, equipped: false },
  { id: 'avatar-ninja', name: 'Shadow Ninja', price: 500, category: 'avatar', owned: false, equipped: false },
  { id: 'avatar-dragon', name: 'Fire Dragon', price: 750, category: 'avatar', owned: false, equipped: false },
  
  // Music
  { id: 'music-lofi', name: 'Lo-fi Beats', price: 200, category: 'music', owned: true, equipped: true },
  { id: 'music-classical', name: 'Classical Focus', price: 250, category: 'music', owned: false, equipped: false },
  { id: 'music-nature', name: 'Nature Sounds', price: 300, category: 'music', owned: false, equipped: false },
  { id: 'music-electronic', name: 'Electronic Vibes', price: 400, category: 'music', owned: false, equipped: false },
];

export const ShopSidebar = ({ coins, onPurchase, onEquip }: ShopSidebarProps) => {
  const [items, setItems] = useState(shopItems);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const { toast } = useToast();

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price && !item.owned) {
      const updatedItems = items.map(i => 
        i.id === item.id ? { ...i, owned: true } : i
      );
      setItems(updatedItems);
      onPurchase(item);
      
      toast({
        title: "🎉 Purchase Successful!",
        description: `You bought ${item.name} for ${item.price} coins!`,
      });
    }
  };

  const handleEquip = (item: ShopItem) => {
    if (item.owned) {
      const updatedItems = items.map(i => {
        if (i.category === item.category) {
          return { ...i, equipped: i.id === item.id };
        }
        return i;
      });
      setItems(updatedItems);
      onEquip(item);
      
      toast({
        title: "✨ Item Equipped!",
        description: `${item.name} is now active!`,
      });
    }
  };

  const getItemsByCategory = (category: string) => {
    return items.filter(item => item.category === category);
  };

  const equippedMusic = items.find(item => item.category === 'music' && item.equipped);

  return (
    <Card className="h-full bg-gradient-secondary text-white border-0 shadow-glow">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2 text-accent" />
            Rewards Shop
          </h2>
          <div className="flex items-center bg-white/10 px-3 py-1 rounded-full">
            <Coins className="w-4 h-4 mr-2 text-accent" />
            <span className="font-bold">{coins.toLocaleString()}</span>
          </div>
        </div>

        {equippedMusic && (
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">🎵 {equippedMusic.name}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setMusicPlaying(!musicPlaying)}
                  className="text-white hover:bg-white/10 p-1 h-7 w-7"
                >
                  {musicPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setMusicMuted(!musicMuted)}
                  className="text-white hover:bg-white/10 p-1 h-7 w-7"
                >
                  {musicMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div className={`h-full bg-accent transition-all duration-1000 ${musicPlaying ? 'w-full animate-pulse' : 'w-0'}`} />
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="h-[calc(100%-140px)]">
        <Tabs defaultValue="themes" className="p-6">
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-white/10">
            <TabsTrigger value="themes" className="flex items-center gap-2 text-xs">
              <Palette className="w-4 h-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="avatars" className="flex items-center gap-2 text-xs">
              <User className="w-4 h-4" />
              Avatars
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2 text-xs">
              <Music className="w-4 h-4" />
              Music
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-4">
            {getItemsByCategory('theme').map(item => (
              <Card key={item.id} className="p-4 bg-white/5 border-white/20 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-cosmic rounded-full border-2 border-white/20" />
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.equipped && <Badge variant="outline" className="border-accent text-accent text-xs">Equipped</Badge>}
                    </div>
                  </div>
                  {item.owned && <Check className="w-5 h-5 text-success" />}
                </div>
                
                {item.owned ? (
                  <Button
                    onClick={() => handleEquip(item)}
                    disabled={item.equipped}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    size="sm"
                  >
                    {item.equipped ? 'Equipped' : 'Equip Theme'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={coins < item.price}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="sm"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    {item.price}
                  </Button>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="avatars" className="space-y-4">
            {getItemsByCategory('avatar').map(item => (
              <Card key={item.id} className="p-4 bg-white/5 border-white/20 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full border-2 border-white/20" />
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.equipped && <Badge variant="outline" className="border-accent text-accent text-xs">Equipped</Badge>}
                    </div>
                  </div>
                  {item.owned && <Check className="w-5 h-5 text-success" />}
                </div>
                
                {item.owned ? (
                  <Button
                    onClick={() => handleEquip(item)}
                    disabled={item.equipped}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    size="sm"
                  >
                    {item.equipped ? 'Equipped' : 'Equip Avatar'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={coins < item.price}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="sm"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    {item.price}
                  </Button>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="music" className="space-y-4">
            {getItemsByCategory('music').map(item => (
              <Card key={item.id} className="p-4 bg-white/5 border-white/20 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <Music className="w-8 h-8 text-accent" />
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      {item.equipped && <Badge variant="outline" className="border-accent text-accent text-xs">Playing</Badge>}
                    </div>
                  </div>
                  {item.owned && <Check className="w-5 h-5 text-success" />}
                </div>
                
                {item.owned ? (
                  <Button
                    onClick={() => handleEquip(item)}
                    disabled={item.equipped}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    size="sm"
                  >
                    {item.equipped ? 'Playing' : 'Play Music'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={coins < item.price}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="sm"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    {item.price}
                  </Button>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </Card>
  );
};