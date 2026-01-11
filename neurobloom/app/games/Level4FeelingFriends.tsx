"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { Check, X } from 'lucide-react';

interface Level4Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

type Emotion = 'happy' | 'sad' | 'angry' | 'crying';

export function Level4FeelingFriends({ onComplete, onProgress }: Level4Props) {
  const [currentGame, setCurrentGame] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedFace, setSelectedFace] = useState<number | null>(null);

  const questionStartTime = useRef<number>(Date.now());

useEffect(() => {
  questionStartTime.current = Date.now();
}, [currentGame]);


  const emotions: { emotion: Emotion; label: string; emoji: string ; correctIndex: number }[] = [
    { emotion: 'happy', label: 'Happy', emoji: '😊', correctIndex: 1 },
    { emotion: 'sad', label: 'Sad', emoji: '😢', correctIndex: 0 },
    { emotion: 'angry', label: 'Angry', emoji: '😡', correctIndex: 2 },
    { emotion: 'crying', label: 'Crying', emoji: '😭', correctIndex: 1 },
  ];

  const faces = {
    happy: [
      { emoji: '😐', emotion: 'neutral' },
      { emoji: '😊', emotion: 'happy' },
      { emoji: '😢', emotion: 'sad' },
    ],
    sad: [
      { emoji: '😢', emotion: 'sad' },
      { emoji: '😊', emotion: 'happy' },
      { emoji: '😡', emotion: 'angry' },
    ],
    angry: [
      { emoji: '😊', emotion: 'happy' },
      { emoji: '😐', emotion: 'neutral' },
      { emoji: '😡', emotion: 'angry' },
    ],
    crying: [
      { emoji: '😊', emotion: 'happy' },
      { emoji: '😭', emotion: 'crying' },
      { emoji: '😐', emotion: 'neutral' },
    ],
  };

  const currentEmotion = emotions[currentGame];

  const handleAnswer = async (faceIndex: number) => {
  const isCorrect = faceIndex === currentEmotion.correctIndex;
  const score = isCorrect ? 1 : 0;
  const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
  const sessionId = localStorage.getItem("sessionId");

  const payloadMap: any = {
    0: { test4_q1: score, test4_q1_time: timeTaken },
    1: { test4_q2: score, test4_q2_time: timeTaken },
    2: { test4_q3: score, test4_q3_time: timeTaken },
    3: { test4_q4: score, test4_q4_time: timeTaken },
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
};


  return (
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-black text-orange-600 mb-8">
        😊 Feeling Friends! 😊
      </h2>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-8xl mb-8"
      >
        {currentEmotion.emoji || '🌈'}
      </motion.div>

      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-12 rounded-3xl shadow-2xl mb-12">
        <p className="text-4xl font-black text-orange-700 mb-6">
          Find the {currentEmotion.label} face!
        </p>
        <p className="text-2xl text-orange-600">
          Tap the face that shows {currentEmotion.label.toLowerCase()} emotion
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
        {faces[currentEmotion.emotion].map((face, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: feedback === null ? 1.1 : 1 }}
            whileTap={{ scale: feedback === null ? 0.9 : 1 }}
            onClick={() => handleAnswer(index)}
            disabled={feedback !== null}
            className={`relative bg-white p-12 rounded-3xl shadow-2xl transition-all ${
              selectedFace === index
                ? feedback === 'correct'
                  ? 'ring-8 ring-green-500 bg-green-50'
                  : 'ring-8 ring-red-500 bg-red-50'
                : 'hover:shadow-3xl'
            }`}
          >
            <div className="text-8xl mb-4">{face.emoji}</div>
            
            {selectedFace === index && feedback && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4"
              >
                {feedback === 'correct' ? (
                  <Check className="w-12 h-12 text-green-600" />
                ) : (
                  <X className="w-12 h-12 text-red-600" />
                )}
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-12 flex justify-center gap-3">
        {emotions.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full ${
              index < currentGame
                ? 'bg-green-500'
                : index === currentGame
                ? 'bg-orange-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-5xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['💛', '💙', '💚', '💜', '❤️'][Math.floor(Math.random() * 5)]}
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
