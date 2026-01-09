"use client";

import { useRouter } from "next/navigation";
import {
  Brain,
  Calculator,
  BookOpen,
  PenTool,
  Ear,
  Eye,
  Smile,
  ArrowRight,
  Star,
  Trophy,
  History,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // Mock History Data
  const history = [
    { id: 1, date: "Oct 24, 2023", module: "Math Magic", score: 85, badge: "🌟" },
    { id: 2, date: "Oct 22, 2023", module: "Reading Rocket", score: 70, badge: "🚀" },
    { id: 3, date: "Oct 20, 2023", module: "Super Ears", score: 90, badge: "👂" },
  ];

  const modules = [
    {
      id: "dyscalculia",
      name: "Math Magic",
      description: "Play with numbers and counting!",
      icon: Calculator,
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      path: "/assessment/dyscalculia",
    },
    {
      id: "dyslexia",
      name: "Reading Rocket",
      description: "Explore letters and sounds!",
      icon: BookOpen,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      path: "/assessment/dyslexia",
    },
    {
      id: "dysgraphia",
      name: "Writing Wizard",
      description: "Draw and trace shapes!",
      icon: PenTool,
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      path: "/assessment/dysgraphia",
    },
    {
      id: "apd",
      name: "Super Ears",
      description: "Listen to fun sounds!",
      icon: Ear,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      path: "/assessment/apd",
    },
    {
      id: "vpd",
      name: "Eagle Eyes",
      description: "Spot the hidden shapes!",
      icon: Eye,
      color: "bg-teal-500",
      lightColor: "bg-teal-50",
      textColor: "text-teal-600",
      path: "/assessment/vpd",
    },
    {
      id: "emotion",
      name: "Feeling Friend",
      description: "Understand feelings!",
      icon: Smile,
      color: "bg-pink-500",
      lightColor: "bg-pink-50",
      textColor: "text-pink-600",
      path: "/assessment/emotion",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4 animate-pop">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-indigo-900">Level 2 Explorer</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-4 leading-tight">
              Welcome Back! 🚀
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Ready for your next adventure? Pick a game below!
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100 border border-white/50 transform rotate-2 hover:rotate-0 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Score</p>
                <p className="text-2xl font-black text-indigo-900">1,250 XP</p>
              </div>
            </div>
            <div className="w-48 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="bg-indigo-500 h-full w-[65%] rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Modules (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              Available Missions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className="group bg-white rounded-[2rem] p-6 shadow-lg shadow-indigo-50/50 border border-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-200/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                  onClick={() => router.push(module.path)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${module.color}`}></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${module.lightColor} ${module.textColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <module.icon className="w-7 h-7" />
                    </div>
                    <div className={`w-8 h-8 rounded-full ${module.lightColor} ${module.textColor} flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors">
                    {module.name}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium">
                    {module.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: History & Progress (1/3 width) */}
          <div className="space-y-8">

            {/* Adventure Log */}
            <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-indigo-50">
              <h2 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                Adventure Log
              </h2>
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                      {item.badge}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm">{item.module}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </div>
                    </div>
                    <div className="font-black text-indigo-600">{item.score}%</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors">
                View All History
              </button>
            </div>

            {/* Progress Chart Mockup */}
            <div className="bg-indigo-900 rounded-[2rem] p-6 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -mr-10 -mt-10 opacity-50"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-300" />
                  Your Growth
                </h2>
                <div className="flex items-end justify-between h-32 gap-2">
                  {[40, 60, 55, 75, 65, 85, 90].map((height, i) => (
                    <div key={i} className="w-full bg-indigo-800 rounded-t-lg relative group">
                      <div
                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-lg transition-all duration-1000 group-hover:opacity-90"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-indigo-300 font-medium">
                  <span>Mon</span>
                  <span>Sun</span>
                </div>
                <p className="mt-4 text-sm text-indigo-200">
                  You're getting stronger every day! Keep it up! 💪
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
