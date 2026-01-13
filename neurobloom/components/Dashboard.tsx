"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Activity,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp,
  Settings,
  HelpCircle,
  ShieldCheck,
  Clock,
  Zap
} from 'lucide-react';

interface DashboardProps {
  onStartTest: () => void;
}

export default function Dashboard({ onStartTest }: DashboardProps) {
  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 flex overflow-hidden font-sans">
      {/* Sidebar - Minimalist Professional */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block font-bold text-lg tracking-tight text-slate-800">NeuroBloom</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<FileText size={20} />} label="Assessments" />
          <NavItem icon={<Users size={20} />} label="Patient List" />
          <NavItem icon={<TrendingUp size={20} />} label="Analytics" />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <NavItem icon={<Settings size={20} />} label="System Settings" />
          <NavItem icon={<HelpCircle size={20} />} label="Support" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em]">Diagnostic Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-800">Dr. Sarah Chen</p>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-full border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
              SC
            </div>
          </div>
        </header>

        {/* Centered Small Assessment Card */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden"
          >
            {/* Card Header Pattern */}
            <div className="h-2 w-full bg-indigo-600" />
            
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md mb-4">
                    <Zap size={14} className="fill-emerald-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ready for Session</span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Start Assessment
                  </h1>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                    Module: AI-Cognitive Reading Analysis v4.2
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShieldCheck className="text-indigo-600" size={24} />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 text-slate-400">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">~18 Minutes</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 text-slate-400">
                    <Activity size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Tracking</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">Biometric + AI</p>
                </div>
              </div>

              {/* Action Button */}
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onStartTest}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
              >
                <Play size={20} className="fill-current" />
                Launch Environment
              </motion.button>

              <p className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
                By launching, you agree to the clinical data processing protocols <br /> and privacy standards.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer Status */}
        <footer className="h-12 bg-white border-t border-slate-200 px-8 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Server: Encrypted</span>
           </div>
           <span className="text-[10px] text-slate-300 font-medium">NeuroBloom Terminal v2.0.4</span>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all
      ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}
    `}>
      <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span>
      <span className="hidden lg:block font-semibold text-sm tracking-tight">{label}</span>
    </div>
  );
}