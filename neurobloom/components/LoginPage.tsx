"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Lock, Mail, ArrowLeft, ShieldCheck, Activity, Globe } from 'lucide-react';

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 overflow-hidden font-sans">
      {/* Back to home - Professional floating button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all text-xs font-bold uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Back to Portal
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Side: Branding & Context (Hidden on small mobile) */}
          <div className="hidden md:flex w-2/5 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
            {/* Background Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                  <Brain className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">NeuroBloom</span>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                Advanced <br /> 
                <span className="text-indigo-400">Cognitive Diagnostics</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Enter your credentials to access the clinical screening environment and patient analytics.
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Globe size={18} className="text-indigo-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Regional Data Compliance</span>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Practitioner Login</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Authentication required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Protocol</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter clinical email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Security Token</label>
                  <button type="button" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">Reset</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "Authorizing..." : "Initialize Session"}
                  {!loading && <Activity size={18} />}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-xs font-medium">
                New practitioner?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  Request Access
                </button>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Meta */}
        <div className="mt-6 flex justify-center gap-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          <span>© 2026 NeuroBloom AI</span>
          <span>•</span>
          <span>System Status: Optimal</span>
          <span>•</span>
          <span>v4.0.2</span>
        </div>
      </motion.div>
    </div>
  );
}