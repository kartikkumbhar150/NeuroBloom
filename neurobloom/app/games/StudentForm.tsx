"use client";

import { useState } from 'react';
import { motion } from "framer-motion";
import { User, Calendar, Users, ArrowRight } from 'lucide-react';

interface StudentFormProps {
  onNext: (data: StudentData) => void;
  onBack?: () => void;
}

export interface StudentData {
  name: string;
  age: number;
  gender: string;
}

export function StudentForm({ onNext, onBack }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentData>({
    name: '',
    age: 6,
    gender: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter the child\'s name';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  const res = await fetch("/api/session/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  const { sessionId } = await res.json();

  localStorage.setItem("sessionId", sessionId); // store session id
  onNext(formData);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              👋
            </motion.div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
              Let's Get Started!
            </h1>
            <p className="text-xl text-gray-600">
              Tell us a little about the young learner
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-3 text-xl font-bold text-gray-700 mb-3">
                <User className="w-6 h-6 text-purple-500" />
                Child's Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                className={`w-full px-6 py-4 text-xl rounded-2xl border-2 ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                } focus:border-purple-500 focus:outline-none transition-colors`}
              />
              {errors.name && (
                <p className="text-red-500 mt-2 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Age Field */}
            <div>
              <label className="flex items-center gap-3 text-xl font-bold text-gray-700 mb-3">
                <Calendar className="w-6 h-6 text-purple-500" />
                Age
              </label>
              <div className="flex gap-3">
                {[6, 7, 8].map((age) => (
                  <motion.button
                    key={age}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, age })}
                    className={`flex-1 py-6 text-3xl font-black rounded-2xl border-2 transition-all ${
                      formData.age === age
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {age}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label className="flex items-center gap-3 text-xl font-bold text-gray-700 mb-3">
                <Users className="w-6 h-6 text-purple-500" />
                Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'male', label: 'Boy', emoji: '👦' },
                  { value: 'female', label: 'Girl', emoji: '👧' },
                  { value: 'other', label: 'Other', emoji: '🧒' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, gender: option.value })}
                    className={`py-6 rounded-2xl border-2 transition-all ${
                      formData.gender === option.value
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div className="text-lg font-bold">{option.label}</div>
                  </motion.button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 mt-2 text-sm">{errors.gender}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-black py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                Continue
                <ArrowRight className="w-8 h-8" />
              </motion.button>
            </div>
          </form>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-12 h-2 bg-purple-500 rounded-full"></div>
          <div className="w-12 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-12 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
}
