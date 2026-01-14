"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Camera, Mic, ArrowRight, CheckCircle2, XCircle, AlertCircle, Settings2, Video, ShieldCheck } from 'lucide-react';
import { useVideo } from "@/context/VideoContext";
interface PermissionsScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function PermissionsScreen({ onComplete, onBack }: PermissionsScreenProps) {
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [requestingCamera, setRequestingCamera] = useState(false);
  const [requestingMic, setRequestingMic] = useState(false);
  const { startRecording } = useVideo();

  const handleProceed = async () => {
  await startRecording();   // 🔥 IMPORTANT
  onComplete();             // move to assessment
};

  const handleBeginAssessment = async () => {
  try {
    await startRecording();
    onComplete();
  } catch (e) {
    alert("Camera recording failed. Please retry.");
  }
};


  const requestCameraPermission = async () => {
    setRequestingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraPermission('granted');
    } catch (error) {
      setCameraPermission('denied');
    } finally {
      setRequestingCamera(false);
    }
  };

  const requestMicPermission = async () => {
    setRequestingMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicPermission('granted');
    } catch (error) {
      setMicPermission('denied');
    } finally {
      setRequestingMic(false);
    }
  };

  const canProceed = cameraPermission === 'granted' && micPermission === 'granted';

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex items-center justify-center p-6 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white rounded-[1.5rem] shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden">
          
          {/* Clinical Header */}
          <div className="bg-slate-900 px-10 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Settings2 className="text-indigo-400" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Hardware Calibration</h1>
                <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">System Readiness Check</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">Secure Channel</span>
            </div>
          </div>

          <div className="p-8">
            {/* Minimal Info Alert */}
            <div className="flex items-center gap-3 px-5 py-3 bg-indigo-50 border border-indigo-100 rounded-xl mb-8">
              <AlertCircle size={16} className="text-indigo-600" />
              <p className="text-[12px] text-indigo-900 font-medium">
                Clinical assessment requires active audio-visual monitoring for biometric analysis.
              </p>
            </div>

            {/* Permission Grid - Two Columns to save vertical space */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              
              {/* Camera Section */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${
                cameraPermission === 'granted' ? 'bg-emerald-50/30 border-emerald-500/20' : 
                cameraPermission === 'denied' ? 'bg-red-50/30 border-red-500/20' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    cameraPermission === 'granted' ? 'bg-emerald-500' : 
                    cameraPermission === 'denied' ? 'bg-red-500' : 'bg-slate-200'
                  }`}>
                    <Video size={20} className={cameraPermission === 'pending' ? 'text-slate-600' : 'text-white'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Optical Sensor</h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">Required for gaze tracking and engagement metrics.</p>
                  </div>
                  
                  {cameraPermission === 'pending' ? (
                    <button 
                      onClick={requestCameraPermission}
                      disabled={requestingCamera}
                      className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      {requestingCamera ? 'Initializing...' : 'Enable Camera'}
                    </button>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
                      cameraPermission === 'granted' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {cameraPermission === 'granted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {cameraPermission === 'granted' ? 'Configured' : 'Access Blocked'}
                    </div>
                  )}
                </div>
              </div>

              {/* Microphone Section */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${
                micPermission === 'granted' ? 'bg-emerald-50/30 border-emerald-500/20' : 
                micPermission === 'denied' ? 'bg-red-50/30 border-red-500/20' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    micPermission === 'granted' ? 'bg-emerald-500' : 
                    micPermission === 'denied' ? 'bg-red-500' : 'bg-slate-200'
                  }`}>
                    <Mic size={20} className={micPermission === 'pending' ? 'text-slate-600' : 'text-white'} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Acoustic Sensor</h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">Required for phonological and speech evaluation.</p>
                  </div>

                  {micPermission === 'pending' ? (
                    <button 
                      onClick={requestMicPermission}
                      disabled={requestingMic}
                      className="w-full py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      {requestingMic ? 'Initializing...' : 'Enable Mic'}
                    </button>
                  ) : (
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
                      micPermission === 'granted' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {micPermission === 'granted' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {micPermission === 'granted' ? 'Configured' : 'Access Blocked'}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Action Area */}
            <div className="pt-6 border-t border-slate-100">
              <motion.button
                whileHover={canProceed ? { scale: 1.01 } : {}}
                whileTap={canProceed ? { scale: 0.99 } : {}}
                onClick={handleProceed}
                disabled={!canProceed}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${
                  canProceed 
                    ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {canProceed ? 'Begin Assessment Protocol' : 'Complete Hardware Setup to Proceed'}
                {canProceed && <ArrowRight size={18} />}
              </motion.button>
              
              <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed font-bold uppercase tracking-widest">
                Hardware validation verified by NeuroBloom Core
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-8 flex justify-center items-center gap-8">
           <Step label="Patient Info" completed />
           <div className="w-12 h-[1px] bg-indigo-600" />
           <Step label="Legal Consent" completed />
           <div className="w-12 h-[1px] bg-indigo-600" />
           <Step label="Hardware" active />
        </div>
      </motion.div>
    </div>
  );
}

function Step({ label, active = false, completed = false }: { label: string, active?: boolean, completed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full transition-all ${
        completed ? 'bg-indigo-600' : 
        active ? 'bg-indigo-600 ring-4 ring-indigo-50' : 
        'bg-slate-300'
      }`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active || completed ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  );
}