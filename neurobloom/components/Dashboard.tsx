"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { 
  Play, 
  Activity,
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
        <div className="p-6 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="hidden lg:block font-black text-lg tracking-tight text-slate-800">NeuroBloom</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">

  <Link href="/">
    <NavItem
      icon={<LayoutDashboard size={18} />}
      label="Overview"
      active
    />
  </Link>

  <Link href="/assessments">
    <NavItem
      icon={<FileText size={18} />}
      label="Assessments"
    />
  </Link>

  <Link href="/patients">
    <NavItem
      icon={<Users size={18} />}
      label="Patient List"
    />
  </Link>

  <Link href="/analytics">
    <NavItem
      icon={<TrendingUp size={18} />}
      label="Analytics"
    />
  </Link>

</nav>


        <div className="p-4 border-t border-slate-100 space-y-1">
          <NavItem icon={<Settings size={18} />} label="Settings" />
          <NavItem icon={<HelpCircle size={18} />} label="Support" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-10 flex items-center justify-between">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Diagnostic Terminal</h2>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-800">Dr. Sarah Chen</p>
              <p className="text-[10px] text-slate-400 font-medium">Chief Neurologist</p>
            </div>
            <div className="w-9 h-9 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
              SC
            </div>
          </div>
        </header>

        {/* Content - Aligned Left & Top */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto flex flex-col items-start">
            
            {/* Section Header */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Modules</h3>
              <p className="text-sm text-slate-500 mt-1">Select an environment to begin patient screening.</p>
            </div>

            {/* Assessment Card - Smaller (max-w-md) & Left Aligned */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-md bg-white border border-slate-200 rounded-[1.25rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden group"
            >
              <div className="h-1.5 w-full bg-indigo-600" />
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md mb-3 border border-emerald-100">
                      <Zap size={12} className="fill-emerald-700" />
                      <span className="text-[9px] font-black uppercase tracking-wider">System Ready</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                      Cognitive Reading
                    </h1>
                    <p className="text-slate-400 mt-1 text-xs font-medium">
                      AI-Analysis Module v4.2
                    </p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <ShieldCheck className="text-indigo-600" size={20} />
                  </div>
                </div>

                {/* Specs Grid - Compact */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 mb-1 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Duration</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">18 Mins</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 mb-1 text-slate-400">
                      <Activity size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Method</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">Biometric</p>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onStartTest}
                  className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                >
                  <Play size={16} className="fill-current" />
                  Launch Environment
                </motion.button>

                <p className="text-center text-[9px] text-slate-400 mt-5 leading-relaxed font-medium uppercase tracking-tighter">
                  Authorized Clinical Use Only
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Status */}
        <footer className="h-10 bg-white border-t border-slate-200 px-10 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Connectivity: Optimal</span>
           </div>
           <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Terminal ID: 882-NB</span>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all
      ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}
    `}>
      <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span>
      <span className="hidden lg:block font-bold text-xs uppercase tracking-wider">{label}</span>
    </div>
  );
}