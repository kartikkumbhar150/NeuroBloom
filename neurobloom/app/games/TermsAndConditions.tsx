"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface TermsAndConditionsProps {
  onAccept: () => void;
  onBack?: () => void;
}

export function TermsAndConditions({ onAccept, onBack }: TermsAndConditionsProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Shield className="w-20 h-20 text-indigo-600" />
            </motion.div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600">
              Please review before starting the assessment
            </p>
          </div>

          {/* Terms Content */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 max-h-96 overflow-y-auto">
            <div className="space-y-6 text-gray-700">
              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Purpose of Assessment
                </h3>
                <p className="leading-relaxed">
                  This assessment is designed to evaluate cognitive development, reading behavior, 
                  and early learning patterns in children aged 6-8. The results will help identify 
                  potential areas for support and celebrate strengths.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔒</span>
                  Privacy & Data Protection
                </h3>
                <ul className="space-y-2 list-disc list-inside leading-relaxed">
                  <li>All data collected during this assessment is encrypted and stored securely</li>
                  <li>Information will only be used for educational assessment purposes</li>
                  <li>No personally identifiable information will be shared with third parties</li>
                  <li>Parents/guardians have the right to request data deletion at any time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📹</span>
                  Recording & Monitoring
                </h3>
                <p className="leading-relaxed">
                  This assessment may use camera and microphone to:
                </p>
                <ul className="mt-2 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Record reading sessions for analysis</li>
                  <li>Monitor engagement and behavioral patterns</li>
                  <li>Capture handwriting samples for evaluation</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚖️</span>
                  Ethical Use
                </h3>
                <p className="leading-relaxed">
                  NeuroBloom is committed to ethical AI use in healthcare. This platform is designed 
                  to support—not replace—professional educational and medical assessment. Results 
                  should be reviewed by qualified professionals.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">👨‍👩‍👧</span>
                  Parental Consent
                </h3>
                <p className="leading-relaxed">
                  By proceeding, you confirm that you are the parent or legal guardian of the child 
                  and consent to their participation in this assessment.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎮</span>
                  Assessment Environment
                </h3>
                <ul className="space-y-2 list-disc list-inside leading-relaxed">
                  <li>Ensure a quiet, comfortable environment for the child</li>
                  <li>The assessment will take approximately 20 minutes</li>
                  <li>The child can take breaks if needed</li>
                  <li>No pressure—this is a supportive learning experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Acceptance Checkbox */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAccepted(!accepted)}
            className={`cursor-pointer mb-8 p-6 rounded-2xl border-2 transition-all ${
              accepted
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
                : 'bg-gray-50 border-gray-300 hover:border-indigo-400'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                  accepted
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-400'
                }`}
              >
                {accepted && <CheckCircle className="w-6 h-6 text-white" />}
              </div>
              <p className="text-lg font-semibold text-gray-700">
                I have read and accept the terms and conditions, and consent to the assessment
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAccept}
              disabled={!accepted}
              className={`flex-1 text-white text-2xl font-black py-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 ${
                accepted
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Accept & Continue
              <ArrowRight className="w-8 h-8" />
            </motion.button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-12 h-2 bg-indigo-500 rounded-full"></div>
          <div className="w-12 h-2 bg-indigo-500 rounded-full"></div>
          <div className="w-12 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
