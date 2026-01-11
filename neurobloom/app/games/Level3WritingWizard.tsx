"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Upload, Check, FileImage } from 'lucide-react';

interface Level3Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level3WritingWizard({ onComplete, onProgress }: Level3Props) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    setUploadedImage(e.target?.result as string);
  };
  reader.readAsDataURL(file);

  // Upload to backend
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const { url } = await res.json();

  const sessionId = localStorage.getItem("sessionId");

  // Save image URL in session
  await fetch("/api/session/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId,
      payload: {
        test3_image: url
      }
    })
  });
};


  const handleSubmit = () => {
    onProgress(1);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <h2 className="text-4xl font-black text-purple-700 mb-8">
        ✨ Writing Wizard Challenge! ✨
      </h2>
      
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="text-8xl mb-8"
      >
        🧙‍♂️
      </motion.div>

      <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-12 rounded-3xl shadow-2xl mb-8 border-4 border-purple-300">
        <div className="bg-white p-8 rounded-2xl shadow-inner mb-6">
          <p className="text-3xl text-gray-800 leading-relaxed">
            ☀️ The sun is bright and warm.
          </p>
        </div>
        <p className="text-2xl text-purple-700 font-bold">
          Write this sentence on paper, then upload a photo! 📝
        </p>
      </div>

      {!uploadedImage ? (
        <div>
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-block"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-16 py-12 rounded-full shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <Upload className="w-12 h-12" />
                <span className="text-3xl font-black">Upload Your Writing</span>
              </div>
            </motion.div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <p className="text-gray-600 mt-6 text-lg">
            📸 Take a photo of your handwriting!
          </p>
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-br from-green-100 to-teal-100 p-6 rounded-3xl shadow-lg mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Check className="w-8 h-8 text-green-600" />
              <p className="text-2xl font-bold text-green-700">
                Photo Uploaded! 🎉
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-inner">
              <img
                src={uploadedImage}
                alt="Uploaded writing"
                className="max-h-64 mx-auto rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl font-black px-16 py-12 rounded-full shadow-2xl"
            >
              Submit My Work! ✨
            </motion.button>

            <label
              htmlFor="file-upload-replace"
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-300 text-gray-700 text-xl font-bold px-8 py-12 rounded-full shadow-lg"
              >
                Upload Different Photo
              </motion.div>
            </label>
            <input
              id="file-upload-replace"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Magical sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-purple-300 text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
}
