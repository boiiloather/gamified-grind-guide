import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (score: number, xp: number, coins: number) => void;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is 15 × 8?",
    options: ["120", "110", "130", "140"],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctAnswer: 3
  }
];

export const QuizModal = ({ open, onOpenChange, onComplete }: QuizModalProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(5).fill(null));

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    if (!answered) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setAnswered(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (selectedAnswer === question.correctAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        // Quiz complete
        const finalScore = selectedAnswer === question.correctAnswer ? score + 1 : score;
        const xpEarned = finalScore * 50;
        const coinsEarned = finalScore * 25;
        setShowResult(true);
        onComplete(finalScore, xpEarned, coinsEarned);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
    setAnswers(new Array(5).fill(null));
  };

  const handleClose = () => {
    resetQuiz();
    onOpenChange(false);
  };

  if (showResult) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-gradient-success text-white border-0">
          <div className="text-center p-6">
            <Trophy className="w-20 h-20 text-accent mx-auto mb-6 animate-bounce-subtle" />
            <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
            <div className="space-y-4">
              <div className="text-6xl font-bold text-accent animate-pulse-reward">
                {score}/5
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-75">XP Earned</p>
                  <p className="text-2xl font-bold text-accent">+{score * 50}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm opacity-75">Coins Earned</p>
                  <p className="text-2xl font-bold text-accent">+{score * 25}</p>
                </div>
              </div>
              <Button 
                onClick={handleClose} 
                className="bg-white text-success hover:bg-white/90 w-full mt-6"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-secondary text-white border-0">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Brain className="w-8 h-8 mr-3 text-accent" />
            Knowledge Quiz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-75">Question {currentQuestion + 1} of {sampleQuestions.length}</span>
            <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
          </div>
          
          <Progress value={progress} className="h-2" />

          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left justify-start p-4 h-auto border-white/20 text-white hover:bg-white/10 transition-all ${
                    selectedAnswer === index 
                      ? answered 
                        ? index === question.correctAnswer 
                          ? 'bg-success/20 border-success' 
                          : 'bg-destructive/20 border-destructive'
                        : 'bg-white/20 border-white/40'
                      : answered && index === question.correctAnswer
                        ? 'bg-success/20 border-success'
                        : ''
                  }`}
                  disabled={answered}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                  {answered && selectedAnswer === index && (
                    <div className="ml-auto">
                      {index === question.correctAnswer ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  )}
                  {answered && index === question.correctAnswer && selectedAnswer !== index && (
                    <CheckCircle className="w-6 h-6 text-success ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </Card>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel Quiz
            </Button>
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null || answered}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-reward"
            >
              {answered ? 'Processing...' : 'Submit Answer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};