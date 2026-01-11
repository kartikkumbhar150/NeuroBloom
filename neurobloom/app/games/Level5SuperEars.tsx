"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";

import { Volume2, Check, X } from 'lucide-react';

interface Level5Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level5SuperEars({ onComplete, onProgress }: Level5Props) {
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [beepActive, setBeepActive] = useState(false);
  const [beepCount, setBeepCount] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState(false);

  const beepStartTime = useRef(0);
  const reactions = useRef<number[]>([]);
  const questionStartTime = useRef(0);

  useEffect(() => {
  questionStartTime.current = Date.now();
}, [currentGame]);



  const handleAnswer = async (isCorrect: boolean, answerIndex?: number) => {
  const score = isCorrect ? 1 : 0;
  const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
  const sessionId = localStorage.getItem("sessionId");

  const payload =
    currentGame === 1
      ? { test5_q2_score: score, test5_q2_time: timeTaken }
      : { test5_q3_score: score, test5_q3_time: timeTaken };

  await fetch("/api/session/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, payload })
  });

  if (currentGame < 2) {
    setCurrentGame(currentGame + 1);
    onProgress(currentGame + 1);
  } else {
    onComplete();
  }
};


  const startBeepTest = () => {
  setBeepActive(true);
  reactions.current = [];
  let count = 0;

  const interval = setInterval(() => {
    count++;
    setBeepCount(count);

    beepStartTime.current = Date.now();   // beep started

    if (count >= 5) {
      clearInterval(interval);

      setTimeout(async () => {
        const sessionId = localStorage.getItem("sessionId");

        await fetch("/api/session/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            payload: {
              test5_q1_r1: reactions.current[0] || null,
              test5_q1_r2: reactions.current[1] || null,
              test5_q1_r3: reactions.current[2] || null,
              test5_q1_r4: reactions.current[3] || null,
              test5_q1_r5: reactions.current[4] || null,
            }
          })
        });

        setBeepActive(false);
        setBeepCount(0);
        setCurrentGame(1);
        onProgress(1);
      }, 1000);
    }
  }, 1500);
};


  const playSound = (word: string) => {
    setSoundPlaying(true);
    // In a real app, this would play actual audio
    // For now, we'll just show visual feedback
    setTimeout(() => {
      setSoundPlaying(false);
    }, 1000);
  };

  const games = [
    // Game 1: Beep Test
    <div key="beep-test" className="text-center">
      <h2 className="text-4xl font-black text-cyan-700 mb-8">
        🔔 Beep Test! 🔔
      </h2>
      
      <motion.div
  onClick={() => {
    const rt = Date.now() - beepStartTime.current;
    reactions.current.push(rt);
  }}
  animate={{ scale: [1, 1.5, 1] }}
  className="w-64 h-64 mx-auto bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
>

        👂
      </motion.div>

      <div className="bg-gradient-to-br from-cyan-100 to-teal-100 p-12 rounded-3xl shadow-2xl mb-8">
        <p className="text-3xl font-bold text-cyan-700 mb-6">
          When you hear a beep, tap the circle!
        </p>
        
        {!beepActive ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startBeepTest}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-3xl font-black px-16 py-12 rounded-full shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <Volume2 className="w-12 h-12" />
              <span>Start Listening</span>
            </div>
          </motion.button>
        ) : (
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                backgroundColor: beepCount > 0 ? ['#06b6d4', '#14b8a6', '#06b6d4'] : '#06b6d4'
              }}
              transition={{ duration: 0.3 }}
              className="w-64 h-64 mx-auto bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
            >
              <span className="text-white text-6xl font-black">👂</span>
            </motion.div>
            <p className="text-2xl text-cyan-600 mt-6">
              Beeps heard: {beepCount}/3
            </p>
          </div>
        )}
      </div>
    </div>,

    // Game 2: Word & Picture
    <div key="word-picture" className="text-center">
      <h2 className="text-4xl font-black text-cyan-700 mb-8">
        🎵 Listen & Match! 🎵
      </h2>
      
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl mb-8"
      >
        🎧
      </motion.div>

      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-3xl shadow-lg mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playSound('playing')}
          className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-3xl font-black px-16 py-8 rounded-full shadow-xl ${
            soundPlaying ? 'animate-pulse' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <Volume2 className="w-12 h-12" />
            <span>Play Word: "playing"</span>
          </div>
        </motion.button>
      </div>

      <p className="text-2xl text-cyan-700 mb-6 font-bold">
        Which picture matches the word?
      </p>

      <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
        {[
          { emoji: '⚽', label: 'playing', correct: true },
          { emoji: '📚', label: 'studying', correct: false },
          { emoji: '😴', label: 'sleeping', correct: false },
          { emoji: '🍽️', label: 'eating', correct: false },
        ].map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(item.correct, index)}
            disabled={feedback !== null}
            className={`bg-white p-12 rounded-3xl shadow-2xl transition-all ${
              selectedAnswer === index
                ? feedback === 'correct'
                  ? 'ring-8 ring-green-500 bg-green-50'
                  : 'ring-8 ring-red-500 bg-red-50'
                : 'hover:shadow-3xl'
            }`}
          >
            <div className="text-7xl mb-4">{item.emoji}</div>
            <p className="text-2xl font-bold text-gray-700">{item.label}</p>
          </motion.button>
        ))}
      </div>
    </div>,

    // Game 3: Sound Discrimination
    <div key="sound-discrimination" className="text-center">
      <h2 className="text-4xl font-black text-cyan-700 mb-8">
        🎶 Are They the Same? 🎶
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl mb-8"
      >
        🔊
      </motion.div>

      <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-12 rounded-3xl shadow-2xl mb-8 max-w-2xl mx-auto">
        <p className="text-3xl font-bold text-cyan-700 mb-8">
          Listen to these two sounds:
        </p>
        
        <div className="flex gap-6 justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound('gaaa')}
            className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-xl"
          >
            <div className="flex flex-col items-center gap-2">
              <Volume2 className="w-10 h-10" />
              <span>"gaaa"</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound('kaaa')}
            className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-4xl font-black px-12 py-8 rounded-3xl shadow-xl"
          >
            <div className="flex flex-col items-center gap-2">
              <Volume2 className="w-10 h-10" />
              <span>"kaaa"</span>
            </div>
          </motion.button>
        </div>

        <p className="text-2xl text-cyan-700 mb-6">
          Are these sounds the same or different?
        </p>

        <div className="flex gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(false, 0)}
            disabled={feedback !== null}
            className={`text-3xl font-black px-16 py-10 rounded-full shadow-lg transition-all ${
              selectedAnswer === 0
                ? feedback === 'incorrect'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Same
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAnswer(true, 1)}
            disabled={feedback !== null}
            className={`text-3xl font-black px-16 py-10 rounded-full shadow-lg transition-all ${
              selectedAnswer === 1
                ? feedback === 'correct'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Different
          </motion.button>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="relative">
      <motion.div
        key={currentGame}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {games[currentGame]}
      </motion.div>

      {/* Sound waves animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-300 text-5xl"
            style={{
              top: `${20 + i * 15}%`,
              left: '10%',
            }}
            animate={{
              x: ['0%', '80vw'],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            〰️
          </motion.div>
        ))}
      </div>

      {/* Feedback animation */}
      {feedback && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <div
            className={`text-9xl ${
              feedback === 'correct' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedback === 'correct' ? (
              <Check className="w-48 h-48" />
            ) : (
              <X className="w-48 h-48" />
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
