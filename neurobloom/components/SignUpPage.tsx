import { Brain, Mail, Lock, User, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface SignUpPageProps {
  onNavigate: (page: 'landing' | 'login' | 'signup') => void;
}

export function SignUpPage({ onNavigate }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'parent',
    agreement: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1766788465885-f96073dbf9e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm93dGglMjBwbGFudCUyMGFic3RyYWN0fGVufDF8fHx8MTc2NzkwMTczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Back to home button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      {/* Sign Up Card */}
      <div className="w-full max-w-5xl relative z-10">
        <div className="grid md:grid-cols-5 gap-0 bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
          
          {/* Left Side - Mission Message */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 md:p-10 text-white flex flex-col justify-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              Join NeuroBloom Today
            </h2>
            
            <p className="text-indigo-100 mb-8 leading-relaxed">
              Begin early, ethical cognitive screening with AI support. Together, we can identify learning challenges early and ensure every child gets the support they deserve.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-100">Early screening insights powered by AI</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-100">Privacy-first and HIPAA-aligned security</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-300 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-indigo-100">Designed for parents, educators, and researchers</p>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="md:col-span-3 p-8 md:p-10">
            {/* Logo (mobile only) */}
            <div className="md:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-indigo-900">NeuroBloom</span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-indigo-950 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Begin early, ethical cognitive screening with AI support
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a strong password"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  I am a...
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="parent">Parent</option>
                  <option value="educator">Educator</option>
                  <option value="researcher">Researcher</option>
                </select>
              </div>

              {/* Agreement Checkbox */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.agreement}
                    onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                    required
                    className="mt-1 w-5 h-5 border-2 border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 text-indigo-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I understand that NeuroBloom provides screening insights, not medical diagnosis. All results should be reviewed with qualified healthcare professionals.
                  </span>
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium text-lg"
              >
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Log in
                </button>
              </p>
            </div>

            {/* Privacy Note */}
            <div className="mt-6 flex items-start gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>
                Your information is encrypted and protected. We never share your data without explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
