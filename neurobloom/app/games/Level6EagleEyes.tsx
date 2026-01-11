"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";

import { Check, X, Eye } from 'lucide-react';

interface Level6Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level6EagleEyes({ onComplete, onProgress }: Level6Props) {
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showMemoryItems, setShowMemoryItems] = useState(true);
  const [memoryTimer, setMemoryTimer] = useState(5);
  const questionStartTime = useRef<number>(Date.now());

  useEffect(() => {
  questionStartTime.current = Date.now();
}, [currentGame]);

  const handleAnswer = async (isCorrect: boolean, answerIndex?: number) => {
  const score = isCorrect ? 1 : 0;
  const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
  const sessionId = localStorage.getItem("sessionId");

  const payloadMap: any = {
    0: { test6_q1_score: score, test6_q1_time: timeTaken },
    1: { test6_q2_score: score, test6_q2_time: timeTaken },
    2: { test6_q3_score: score, test6_q3_time: timeTaken },
    3: { test6_q4_score: score, test6_q4_time: timeTaken },
  };

  await fetch("/api/session/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      payload: payloadMap[currentGame]
    })
  });

  if (currentGame < 3) {
    setCurrentGame(currentGame + 1);
    onProgress(currentGame + 1);
  } else {
    onComplete();
  }

  setSelectedAnswer(answerIndex ?? null);
};


  // Memory game timer
  useEffect(() => {
    if (currentGame === 1 && showMemoryItems && memoryTimer > 0) {
      const timer = setTimeout(() => {
        setMemoryTimer(memoryTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (memoryTimer === 0) {
      setShowMemoryItems(false);
    }
  }, [currentGame, memoryTimer, showMemoryItems]);

  const originalMemoryItems = [0, 2, 4, 6, 8, 9]; // Indices of original 6 items
  const allMemoryItems = ['🍎', '🚗', '⚽', '🌟', '🎨', '📚', '🍕', '🎮', '🌈', '🦋'];

  const games = [
    // Game 1: Odd One Out
    <div key="odd-one-out" className="text-center">
      <h2 className="text-4xl font-black text-rose-700 mb-8">
        👀 Find the Odd One Out! 👀
      </h2>
      
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl mb-8"
      >
        🦅
      </motion.div>

      <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-12 rounded-3xl shadow-2xl mb-8">
        <p className="text-3xl font-bold text-rose-700 mb-8">
          Which shape is different?
        </p>
        
        <div className="flex justify-center items-center gap-8">
          {['●', '●', '■', '●'].map((shape, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(index === 2, index)}
              disabled={feedback !== null}
              className={`text-8xl p-8 rounded-3xl transition-all ${
                selectedAnswer === index
                  ? feedback === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-xl`}
            >
              {shape}
            </motion.button>
          ))}
        </div>
      </div>
    </div>,

    // Game 2: Memory
    <div key="memory" className="text-center">
      <h2 className="text-4xl font-black text-rose-700 mb-8">
        🧠 Memory Challenge! 🧠
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl mb-8"
      >
        🎯
      </motion.div>

      {showMemoryItems ? (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-12 rounded-3xl shadow-2xl">
          <div className="bg-yellow-200 text-yellow-900 text-3xl font-black px-8 py-4 rounded-full inline-block mb-8">
            Remember these! Time: {memoryTimer}s
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {originalMemoryItems.map((itemIndex) => (
              <motion.div
                key={itemIndex}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: itemIndex * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-xl"
              >
                <div className="text-7xl">{allMemoryItems[itemIndex]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-12 rounded-3xl shadow-2xl">
          <p className="text-3xl font-bold text-rose-700 mb-8">
            Select the 6 items you saw! ({selectedItems.length}/6)
          </p>
          <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
            {allMemoryItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (selectedItems.includes(index)) {
                    setSelectedItems(selectedItems.filter(i => i !== index));
                  } else if (selectedItems.length < 6) {
                    setSelectedItems([...selectedItems, index]);
                  }
                }}
                disabled={feedback !== null}
                className={`p-6 rounded-2xl shadow-lg transition-all ${
                  selectedItems.includes(index)
                    ? 'bg-blue-500 text-white ring-4 ring-blue-300'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-5xl">{item}</div>
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const correct = selectedItems.length === 6 && 
                selectedItems.every(i => originalMemoryItems.includes(i));
              handleAnswer(correct);
            }}
            disabled={selectedItems.length !== 6 || feedback !== null}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl font-black px-16 py-8 rounded-full shadow-2xl disabled:opacity-50"
          >
            Check Answer
          </motion.button>
        </div>
      )}
    </div>,

    // Game 3: Mirror Letters
    <div key="mirror-letters" className="text-center">
      <h2 className="text-4xl font-black text-rose-700 mb-8">
        🪞 Mirror Letters! 🪞
      </h2>
      
      <motion.div
        animate={{ scaleX: [-1, 1, -1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-9xl mb-8"
      >
        🦋
      </motion.div>

      <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-12 rounded-3xl shadow-2xl mb-8">
        <p className="text-3xl font-bold text-rose-700 mb-8">
          Which is the mirror image of the letter "b"?
        </p>
        
        <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto">
          {['b', 'd', 'p', 'q'].map((letter, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(index === 1, index)} // 'd' is mirror of 'b'
              disabled={feedback !== null}
              className={`text-9xl font-bold p-12 rounded-3xl shadow-2xl transition-all ${
                selectedAnswer === index
                  ? feedback === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {letter}
            </motion.button>
          ))}
        </div>
      </div>
    </div>,

    // Game 4: Visual Puzzle
    <div key="visual-puzzle" className="text-center">
      <h2 className="text-4xl font-black text-rose-700 mb-8">
        🧩 Complete the Pattern! 🧩
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        className="text-9xl mb-8"
      >
        🎨
      </motion.div>

      <div className="bg-gradient-to-br from-orange-100 to-rose-100 p-12 rounded-3xl shadow-2xl mb-8">
        <p className="text-3xl font-bold text-rose-700 mb-8">
          What comes next in the pattern?
        </p>
        
        <div className="flex justify-center items-center gap-4 mb-12 bg-white p-8 rounded-2xl">
          <div className="text-7xl">🔴</div>
          <div className="text-7xl">🔵</div>
          <div className="text-7xl">🔴</div>
          <div className="text-7xl">🔵</div>
          <div className="text-7xl">❓</div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { emoji: '🔴', label: 'Red', correct: true },
            { emoji: '🔵', label: 'Blue', correct: false },
            { emoji: '🟢', label: 'Green', correct: false },
          ].map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(option.correct, index)}
              disabled={feedback !== null}
              className={`p-12 rounded-3xl shadow-2xl transition-all ${
                selectedAnswer === index
                  ? feedback === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <div className="text-8xl mb-4">{option.emoji}</div>
              <p className="text-2xl font-bold text-gray-700">{option.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="relative">
      <motion.div
        key={currentGame}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        {games[currentGame]}
      </motion.div>

      {/* Jungle leaves animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            🌿
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
