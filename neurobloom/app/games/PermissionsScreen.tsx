"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Camera, Mic, ArrowRight, Check, X, AlertCircle } from 'lucide-react';

interface PermissionsScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function PermissionsScreen({ onComplete, onBack }: PermissionsScreenProps) {
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [requestingCamera, setRequestingCamera] = useState(false);
  const [requestingMic, setRequestingMic] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-100 to-blue-100 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🎥
            </motion.div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 mb-3">
              Permissions Required
            </h1>
            <p className="text-xl text-gray-600">
              We need access to your camera and microphone for the assessment
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Why do we need these permissions?</h3>
                <ul className="space-y-1 text-blue-800">
                  <li className="flex items-center gap-2">
                    <span className="text-xl">📹</span>
                    <span>Camera: To record reading sessions and monitor engagement</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xl">🎤</span>
                    <span>Microphone: To capture and analyze speech during reading tasks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Permission Cards */}
          <div className="space-y-6 mb-10">
            {/* Camera Permission */}
            <div
              className={`border-2 rounded-2xl p-6 transition-all ${
                cameraPermission === 'granted'
                  ? 'bg-green-50 border-green-500'
                  : cameraPermission === 'denied'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      cameraPermission === 'granted'
                        ? 'bg-green-500'
                        : cameraPermission === 'denied'
                        ? 'bg-red-500'
                        : 'bg-cyan-500'
                    }`}
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Camera Access</h3>
                    <p className="text-gray-600">
                      {cameraPermission === 'granted'
                        ? '✅ Permission granted'
                        : cameraPermission === 'denied'
                        ? '❌ Permission denied - please enable in browser settings'
                        : 'Click to grant camera access'}
                    </p>
                  </div>
                </div>
                {cameraPermission === 'pending' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestCameraPermission}
                    disabled={requestingCamera}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {requestingCamera ? 'Requesting...' : 'Allow Camera'}
                  </motion.button>
                )}
                {cameraPermission === 'granted' && (
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                )}
                {cameraPermission === 'denied' && (
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Microphone Permission */}
            <div
              className={`border-2 rounded-2xl p-6 transition-all ${
                micPermission === 'granted'
                  ? 'bg-green-50 border-green-500'
                  : micPermission === 'denied'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      micPermission === 'granted'
                        ? 'bg-green-500'
                        : micPermission === 'denied'
                        ? 'bg-red-500'
                        : 'bg-teal-500'
                    }`}
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Microphone Access</h3>
                    <p className="text-gray-600">
                      {micPermission === 'granted'
                        ? '✅ Permission granted'
                        : micPermission === 'denied'
                        ? '❌ Permission denied - please enable in browser settings'
                        : 'Click to grant microphone access'}
                    </p>
                  </div>
                </div>
                {micPermission === 'pending' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={requestMicPermission}
                    disabled={requestingMic}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {requestingMic ? 'Requesting...' : 'Allow Microphone'}
                  </motion.button>
                )}
                {micPermission === 'granted' && (
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                )}
                {micPermission === 'denied' && (
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <motion.button
            whileHover={{ scale: canProceed ? 1.02 : 1 }}
            whileTap={{ scale: canProceed ? 0.98 : 1 }}
            onClick={onComplete}
            disabled={!canProceed}
            className={`w-full text-white text-2xl font-black py-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 ${
              canProceed
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {canProceed ? 'Start Assessment' : 'Grant All Permissions to Continue'}
            {canProceed && <ArrowRight className="w-8 h-8" />}
          </motion.button>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-12 h-2 bg-cyan-500 rounded-full"></div>
          <div className="w-12 h-2 bg-cyan-500 rounded-full"></div>
          <div className="w-12 h-2 bg-cyan-500 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
