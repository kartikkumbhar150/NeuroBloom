"use client";

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Star, Sparkles, Trophy } from 'lucide-react';
import { Level1MathAdventure } from '../games/Level1MathAdventure';
import { Level2ReadingRocket } from '../games/Level2ReadingRocket';
import { Level3WritingWizard } from '../games/Level3WritingWizard';
import { Level4FeelingFriends } from '../games/Level4FeelingFriends';
import { Level5SuperEars } from '../games/Level5SuperEars';
import { Level6EagleEyes } from '../games/Level6EagleEyes';
import { StudentData } from './StudentForm';

interface ContinuousAssessmentProps {
  studentData: StudentData;
  onComplete: () => void;
}

type LevelId = 1 | 2 | 3 | 4 | 5 | 6;

interface Level {
  id: LevelId;
  name: string;
  theme: string;
  icon: string;
  color: string;
  totalGames: number;
}

export function ContinuousAssessment({ studentData, onComplete }: ContinuousAssessmentProps) {
  const [currentLevel, setCurrentLevel] = useState<LevelId>(1);
  const [currentGame, setCurrentGame] = useState<number>(0);
  const [showTransition, setShowTransition] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<LevelId[]>([]);

  const levels: Level[] = [
    {
      id: 1,
      name: 'Math Adventure',
      theme: 'Magic Math Forest',
      icon: '🌳',
      color: 'from-green-400 to-emerald-500',
      totalGames: 6,
    },
    {
      id: 2,
      name: 'Reading Rocket',
      theme: 'Space Reading Mission',
      icon: '🚀',
      color: 'from-blue-400 to-indigo-500',
      totalGames: 2,
    },
    {
      id: 3,
      name: 'Writing Wizard',
      theme: 'Magic Notebook',
      icon: '✨',
      color: 'from-purple-400 to-pink-500',
      totalGames: 1,
    },
    {
      id: 4,
      name: 'Feeling Friends',
      theme: 'Emotion Playground',
      icon: '😊',
      color: 'from-yellow-400 to-orange-500',
      totalGames: 4,
    },
    {
      id: 5,
      name: 'Super Ears',
      theme: 'Sound Island',
      icon: '🔊',
      color: 'from-cyan-400 to-teal-500',
      totalGames: 3,
    },
    {
      id: 6,
      name: 'Eagle Eyes',
      theme: 'Jungle Vision Quest',
      icon: '👀',
      color: 'from-rose-400 to-red-500',
      totalGames: 4,
    },
  ];

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not supported or denied');
      }
    };
    enterFullscreen();

    // Exit fullscreen on unmount
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const handleLevelComplete = () => {
    setCompletedLevels([...completedLevels, currentLevel]);
    
    if (currentLevel < 6) {
      // Show transition to next level
      setShowTransition(true);
      setTimeout(() => {
        setCurrentLevel((currentLevel + 1) as LevelId);
        setCurrentGame(0);
        setShowTransition(false);
      }, 3000);
    } else {
      // All levels complete
      onComplete();
    }
  };

  const selectedLevel = levels.find(l => l.id === currentLevel)!;
  const totalGames = levels.reduce((sum, level) => sum + level.totalGames, 0);
  const completedGames = levels
    .slice(0, currentLevel - 1)
    .reduce((sum, level) => sum + level.totalGames, 0) + currentGame;
  const overallProgress = (completedGames / totalGames) * 100;

  // Level transition screen
  if (showTransition) {
    const nextLevel = levels.find(l => l.id === currentLevel + 1)!;
    return (
      <div className={`min-h-screen bg-gradient-to-br ${nextLevel.color} flex items-center justify-center overflow-hidden`}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <Trophy className="w-32 h-32 text-yellow-400" />
          </motion.div>
          <h1 className="text-6xl font-black text-white mb-4">
            Level Complete! 🎉
          </h1>
          <div className="flex gap-2 justify-center mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-12 h-12 fill-yellow-300 text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto">
            <p className="text-2xl text-white mb-4">Get ready for...</p>
            <div className="text-8xl mb-4">{nextLevel.icon}</div>
            <h2 className="text-4xl font-black text-white mb-2">{nextLevel.name}</h2>
            <p className="text-xl text-white/90">{nextLevel.theme}</p>
          </div>
        </motion.div>
        
        {/* Floating sparkles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: Math.random() * window.innerWidth, opacity: 1 }}
            animate={{ y: '-100vh', opacity: 0 }}
            transition={{ duration: 3, delay: Math.random() * 2, repeat: Infinity }}
            className="absolute"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        ))}
      </div>
    );
  }

  const renderLevelContent = () => {
    switch (currentLevel) {
      case 1:
        return (
          <Level1MathAdventure
            onComplete={handleLevelComplete}
          />
        );
      case 2:
        return (
          <Level2ReadingRocket
            onComplete={handleLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 3:
        return (
          <Level3WritingWizard
            onComplete={handleLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 4:
        return (
          <Level4FeelingFriends
            onComplete={handleLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 5:
        return (
          <Level5SuperEars
            onComplete={handleLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
      case 6:
        return (
          <Level6EagleEyes
            onComplete={handleLevelComplete}
            onProgress={(gameIndex) => setCurrentGame(gameIndex)}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedLevel.color} p-8`}>
      <div className="max-w-5xl mx-auto">
        
        </div>

  

        {/* Game Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          {renderLevelContent()}
        </div>

  
      </div>
    
  );
}
