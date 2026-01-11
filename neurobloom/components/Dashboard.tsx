"use client";

import { motion } from "framer-motion";
import { Play, FileText, User, TrendingUp, Award, Clock } from 'lucide-react';

interface DashboardProps {
  onStartTest: () => void;
}

export default function Dashboard({ onStartTest }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">NeuroBloom Dashboard</h1>
          <p className="text-xl text-indigo-200">AI-Powered Learning Assessment Platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Start Test Card - Featured */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="lg:col-span-2 cursor-pointer"
            onClick={onStartTest}
          >
            <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 right-8 text-9xl">🎯</div>
                <div className="absolute bottom-8 left-8 text-7xl">✨</div>
              </div>

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                      <span className="text-white font-semibold">New Assessment</span>
                    </div>
                    <h2 className="text-5xl font-black text-white mb-4">
                      Start New Test
                    </h2>
                    <p className="text-2xl text-white/90 mb-8">
                      Begin a comprehensive learning assessment for children aged 6-8
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl"
                  >
                    🎨
                  </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-3xl mb-2">📚</div>
                    <p className="text-white font-bold">6 Levels</p>
                    <p className="text-white/70 text-sm">Complete assessment</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-3xl mb-2">⏱️</div>
                    <p className="text-white font-bold">~20 mins</p>
                    <p className="text-white/70 text-sm">Estimated time</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <div className="text-3xl mb-2">🎮</div>
                    <p className="text-white font-bold">20+ Games</p>
                    <p className="text-white/70 text-sm">Fun activities</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white text-teal-600 text-2xl font-black py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  <Play className="w-8 h-8 fill-teal-600" />
                  Start Assessment
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <Award className="w-12 h-12 text-white" />
                <span className="text-5xl">🏆</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-2">0</h3>
              <p className="text-white/80">Tests Completed</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-12 h-12 text-white" />
                <span className="text-5xl">📊</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-2">-</h3>
              <p className="text-white/80">Average Score</p>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-white/60">No assessments yet</p>
              <p className="text-white/40 mt-2">Start your first test to see results here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
