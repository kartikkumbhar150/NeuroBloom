"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Upload, Check, Loader2, Sparkles } from 'lucide-react';

interface Level3Props {
  onComplete: () => void;
  onProgress: (gameIndex: number) => void;
}

export function Level3WritingWizard({ onComplete, onProgress }: Level3Props) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. UI par turant preview dikhane ke liye
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 2. Uploading process start
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 3. Cloudinary API Route ko call karna
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!data.url) {
        throw new Error(data.error || "Upload failed");
      }

      console.log("Cloudinary Image URL:", data.url);

      // 4. PostgreSQL Session mein URL save karna
      const sessionId = localStorage.getItem("sessionId");
      await fetch("/api/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          payload: {
            test3_image: data.url
          }
        })
      });

    } catch (error) {
      console.error("Error saving image:", error);
      alert("Oops! Photo save nahi ho payi. Dobara try karein.");
      setUploadedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    onProgress(1);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="text-center max-w-4xl mx-auto px-4">
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
          <p className="text-3xl text-gray-800 leading-relaxed font-medium">
            ☀️ The sun is bright and warm.
          </p>
        </div>
        <p className="text-2xl text-purple-700 font-bold">
          Write this sentence on paper, then upload a photo! 📝
        </p>
      </div>

      {!uploadedImage ? (
        <div className="relative">
          <label
            htmlFor="file-upload"
            className={`cursor-pointer inline-block ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-16 py-12 rounded-full shadow-2xl"
            >
              <div className="flex items-center gap-4">
                {isUploading ? (
                  <Loader2 className="w-12 h-12 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12" />
                )}
                <span className="text-3xl font-black">
                  {isUploading ? "Uploading..." : "Upload Your Writing"}
                </span>
              </div>
            </motion.div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          
          <p className="text-gray-600 mt-6 text-lg font-semibold">
            📸 Take a clear photo of your handwriting!
          </p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-br from-green-100 to-teal-100 p-6 rounded-3xl shadow-lg border-4 border-green-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Check className="w-8 h-8 text-green-600" />
              <p className="text-2xl font-bold text-green-700">
                {isUploading ? "Magical processing..." : "Ready to Fly! 🎉"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-inner overflow-hidden relative">
              {isUploading && (
                 <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                 </div>
              )}
              <img
                src={uploadedImage}
                alt="Uploaded writing"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isUploading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl font-black px-16 py-12 rounded-full shadow-2xl disabled:opacity-50"
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
                className="bg-gray-200 text-gray-600 text-xl font-bold px-8 py-10 rounded-full shadow-lg border-2 border-gray-300"
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
              disabled={isUploading}
            />
          </div>
        </motion.div>
      )}

      {/* Magical sparkles background animation */}
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
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
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