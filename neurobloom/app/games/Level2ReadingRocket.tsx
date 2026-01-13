"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Mic, Check, Square } from 'lucide-react';
import { useRef, useEffect } from "react";
import { set } from 'react-hook-form';


interface Level2Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level2ReadingRocket({ onComplete, onProgress }: Level2Props) {
  const [currentGame, setCurrentGame] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const recordStartTime = useRef<number>(0);


  const startRecording = async () => {
  if (isRecording) return;

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

  mediaRecorderRef.current = mediaRecorder;
  audioChunks.current = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) audioChunks.current.push(e.data);
  };

  mediaRecorder.onstop = async () => {
  setIsSaving(true);
  const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });

  const formData = new FormData();
  formData.append("file", audioBlob, "reading.webm");

  try {
    // Step 1: Upload to Cloudinary via our API
    const upload = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const uploadRes = await upload.json();
    const url = uploadRes.url; 

    if (!url) {
      console.error("Upload failed:", uploadRes.error);
      setIsSaving(false);
      setIsRecording(false);
      return;
    }

    // Step 2: Save the Cloudinary URL to your existing PostgreSQL DB
    const sessionId = localStorage.getItem("sessionId");
    await fetch("/api/session/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        payload: currentGame === 0 
          ? { test2_audio1: url } 
          : { test2_audio2: url }
      })
    });

    setHasRecorded(true);

  } catch (error) {
    console.error("Process failed:", error);
  } finally {
    mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
    setIsRecording(false);
    setIsSaving(false);
  }
};

  mediaRecorder.start();
  setIsRecording(true);


};
  const finishRecording = () => {
  if (!mediaRecorderRef.current) return;

  mediaRecorderRef.current.stop(); // sirf stop karo, stream ko yahan mat chhedo
};




  const handleNext = () => {
    if (currentGame < 1) {
      setCurrentGame(currentGame + 1);
      onProgress(currentGame + 1);
      setHasRecorded(false);
    } else {
      onComplete();
    }
  };

  const games = [
    // Reading 1
    <div key="reading1" className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-black text-blue-700 mb-8">
        🚀 Reading Mission 1 🚀
      </h2>
      
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl mb-8"
      >
        🚀
      </motion.div>

      <div className="bg-white p-12 rounded-3xl shadow-2xl mb-8 border-4 border-blue-200">
        <p className="text-4xl leading-relaxed text-gray-800 text-left space-y-4">
          <span className="block">🐕 Dogs eat bones.</span>
          <span className="block">🚴 Mike likes bikes.</span>
          <span className="block">📚 Elsa wants a book.</span>
          <span className="block">🏀 Adam plays basketball.</span>
        </p>
      </div>

      <p className="text-2xl text-blue-600 mb-8">
        {!hasRecorded ? '👆 Read the sentences above, then press the microphone!' : '✅ Great job! Ready for the next one?'}
      </p>

      {!hasRecorded ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? finishRecording : startRecording}
          disabled={isSaving}
          className={`relative ${
            isRecording
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          } text-white px-16 py-12 rounded-full shadow-2xl transition-all`}
        >
          {isRecording ? (
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Square className="w-12 h-12 fill-white" />
              </motion.div>
              <span className="text-3xl font-black">Recording...</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Mic className="w-12 h-12" />
              <span className="text-3xl font-black">Start Reading</span>
            </div>
          )}

          {isRecording && (
            <motion.div
              className="absolute inset-0 border-4 border-white rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      ) : (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl font-black px-16 py-12 rounded-full shadow-2xl"
        >
          Next Mission →
        </motion.button>
      )}
    </div>,

    // Reading 2
    <div key="reading2" className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-black text-blue-700 mb-8">
        🚀 Reading Mission 2 🚀
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="text-8xl mb-8"
      >
        🌍
      </motion.div>

      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-12 rounded-3xl shadow-2xl mb-8 border-4 border-green-200">
        <p className="text-4xl leading-relaxed text-gray-800">
          🌿 Nature gives us fruits, vegetables and grains to eat.
        </p>
      </div>

      <p className="text-2xl text-blue-600 mb-8">
        {!hasRecorded ? '👆 Read this sentence, then press the microphone!' : '🎉 Excellent work, astronaut!'}
      </p>

      {!hasRecorded ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? finishRecording : startRecording}
          disabled={isSaving}
          className={`relative ${
            isRecording
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
          } text-white px-16 py-12 rounded-full shadow-2xl transition-all`}
        >
          {isRecording ? (
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Square className="w-12 h-12 fill-white" />
              </motion.div>
              <span className="text-3xl font-black">Recording...</span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Mic className="w-12 h-12" />
              <span className="text-3xl font-black">Start Reading</span>
            </div>
          )}

          {isRecording && (
            <motion.div
              className="absolute inset-0 border-4 border-white rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      ) : (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl font-black px-16 py-12 rounded-full shadow-2xl"
        >
          Complete Mission! 🎉
        </motion.button>
      )}
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

      {/* Space background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>
    </div>
  );
}
