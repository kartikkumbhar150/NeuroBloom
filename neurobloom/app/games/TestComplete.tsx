"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Download, Home, Sparkles } from 'lucide-react';
import { StudentData } from './StudentForm';
import { useEffect } from "react";
import { useVideo } from "@/context/VideoContext";


interface TestCompleteProps {
  studentData: StudentData;
  onReturnHome: () => void;
}

export function TestComplete({ studentData, onReturnHome }: TestCompleteProps) {
  const { stopAndUpload } = useVideo();

  useEffect(() => {
  const stop = async () => {
    await stopAndUpload();
  };
  stop();
}, []);


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center overflow-hidden p-8">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="text-center"
        >
          {/* Trophy Animation */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <Trophy className="w-48 h-48 text-yellow-300" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4"
              >
                <Star className="w-20 h-20 fill-yellow-200 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* Completion Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-7xl font-black text-white mb-6"
          >
            🎉 Amazing Job, {studentData.name}! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl text-white/90 mb-12"
          >
            You've completed all 6 levels of the Learning Adventure!
          </motion.p>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-4xl font-black text-white mb-2">6/6</h3>
              <p className="text-white/80 text-lg">Levels Complete</p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-4xl font-black text-white mb-2">20+</h3>
              <p className="text-white/80 text-lg">Games Played</p>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 border-2 border-white/30">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-4xl font-black text-white mb-2">100%</h3>
              <p className="text-white/80 text-lg">Participation</p>
            </div>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 mb-12 border-2 border-white/20"
          >
            <h2 className="text-3xl font-black text-white mb-6">Achievements Unlocked! 🌟</h2>
            <div className="grid grid-cols-6 gap-4">
              {[
                { icon: '🌳', name: 'Math Master' },
                { icon: '🚀', name: 'Reading Star' },
                { icon: '✨', name: 'Writing Wizard' },
                { icon: '😊', name: 'Emotion Expert' },
                { icon: '🔊', name: 'Sound Sleuth' },
                { icon: '👀', name: 'Vision Champion' },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.1 + index * 0.1, type: 'spring' }}
                  className="bg-white/20 rounded-2xl p-4 hover:bg-white/30 transition-all"
                >
                  <div className="text-5xl mb-2">{badge.icon}</div>
                  <p className="text-white text-sm font-bold">{badge.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-lg rounded-3xl p-8 mb-8 border-2 border-white/30"
          >
            <h3 className="text-2xl font-bold text-white mb-3">📊 What's Next?</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              Your assessment results are being processed by our AI system. 
              A detailed report with insights and recommendations will be available 
              in your dashboard shortly. Great job on completing this learning journey!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReturnHome}
              className="bg-white text-purple-600 text-2xl font-black px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3"
            >
              <Home className="w-8 h-8" />
              Return to Dashboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white text-2xl font-black px-12 py-6 rounded-2xl hover:bg-white/30 transition-all flex items-center gap-3"
            >
              <Download className="w-8 h-8" />
              Download Certificate
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating celebration elements */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            y: '100vh', 
            x: Math.random() * window.innerWidth,
            rotate: Math.random() * 360,
            opacity: 1 
          }}
          animate={{ 
            y: '-100vh', 
            rotate: Math.random() * 360 + 360,
            opacity: 0 
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: Math.random() * 3, 
            repeat: Infinity 
          }}
          className="absolute pointer-events-none"
        >
          {i % 3 === 0 ? (
            <Sparkles className="w-8 h-8 text-yellow-200" />
          ) : i % 3 === 1 ? (
            <Star className="w-6 h-6 fill-yellow-300 text-yellow-200" />
          ) : (
            <div className="text-4xl">
              {['🎉', '🎊', '⭐', '🌟', '✨', '🏆'][Math.floor(Math.random() * 6)]}
            </div>
          )}
        </motion.div>
      ))}

      {/* Confetti burst effect */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          initial={{ 
            y: '50vh',
            x: '50vw',
            scale: 0,
            opacity: 1
          }}
          animate={{ 
            y: Math.random() * window.innerHeight,
            x: Math.random() * window.innerWidth,
            scale: 1,
            opacity: 0,
            rotate: Math.random() * 720
          }}
          transition={{ 
            duration: 2,
            delay: i * 0.02,
            ease: 'easeOut'
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'][i % 6]
          }}
        />
      ))}
    </div>
  );
}
