"use client";
import { Brain, BookOpen, Shield, Users, CheckCircle, ArrowRight, Sparkles, Lock, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

/*
interface LandingPageProps {
  onNavigate: (page: 'landing' | 'login' | 'signup') => void;
}*/

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-indigo-900">NeuroBloom</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-gray-600 hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#why" className="text-gray-600 hover:text-indigo-600 transition-colors">Why NeuroBloom</a>
            <a href="#who" className="text-gray-600 hover:text-indigo-600 transition-colors">Who It's For</a>
            <a href="#ethics" className="text-gray-600 hover:text-indigo-600 transition-colors">Ethics</a>
          </nav>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/login")}

              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => router.push("/signup")}

              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-teal-50 to-white opacity-60"></div>
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1750969185331-e03829f72c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG5ldXJhbCUyMG5ldHdvcmt8ZW58MXx8fHwxNzY3Nzc0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Early Cognitive Insight. Brighter Futures.</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-950 mb-6 leading-tight">
            Early Cognitive Insight<br />for Brighter Futures
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            NeuroBloom uses AI to analyze reading behavior and identify children who may be at risk of learning difficulties — early, ethical, and non-diagnostic.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => router.push("/signup")}

              className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 text-lg"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all border-2 border-indigo-200 flex items-center gap-2 text-lg">
              Learn How It Works
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* How NeuroBloom Works */}
      <section id="how" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-950 mb-4">How NeuroBloom Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple, three-step process powered by advanced AI analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-indigo-900 mb-3">1. Record Reading</h3>
              <p className="text-gray-600 leading-relaxed">
                Children read a short passage while our platform captures their speech patterns and reading behavior.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-teal-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-indigo-900 mb-3">2. Analyze Speech & Pauses</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes speech patterns, fluency, pauses, and reading cadence to detect potential indicators.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-indigo-900 mb-3">3. Generate Risk Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive actionable screening insights to help determine if further professional evaluation may be beneficial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why NeuroBloom */}
      <section id="why" className="py-20 px-6 bg-gradient-to-br from-indigo-50 via-white to-teal-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-950 mb-4">Why NeuroBloom</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with responsibility, backed by science, designed for impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Early Screening Support</h3>
                <p className="text-gray-600">Identify potential learning challenges before they become obstacles, giving children the support they need.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">No Medical Diagnosis Claims</h3>
                <p className="text-gray-600">We provide screening insights only. All results should be reviewed with qualified healthcare professionals.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Privacy-First AI</h3>
                <p className="text-gray-600">Your child's data is encrypted, secure, and never shared without explicit consent. HIPAA-aligned practices.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Designed for Schools & Parents</h3>
                <p className="text-gray-600">Whether you're an educator or a parent, NeuroBloom provides accessible insights for every stakeholder.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-950 mb-4">Who It's For</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Supporting everyone involved in a child's learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-white to-indigo-50 rounded-2xl border border-indigo-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-indigo-900 mb-3">Parents</h3>
              <p className="text-gray-600 leading-relaxed">
                Gain peace of mind with early insights into your child's cognitive development and learning patterns.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-white to-teal-50 rounded-2xl border border-teal-100">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-indigo-900 mb-3">Educators</h3>
              <p className="text-gray-600 leading-relaxed">
                Identify students who may benefit from additional support and tailor interventions effectively.
              </p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-white to-indigo-50 rounded-2xl border border-indigo-100">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-indigo-900 mb-3">Researchers</h3>
              <p className="text-gray-600 leading-relaxed">
                Access anonymized data and insights to advance understanding of early cognitive development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics & Trust */}
      <section id="ethics" className="py-20 px-6 bg-gradient-to-br from-indigo-900 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1764336312138-14a5368a6cd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMHRlY2hub2xvZ3klMjBibHVlfGVufDF8fHx8MTc2NzkwMTczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ethics & Trust</h2>
          <p className="text-xl text-indigo-100 mb-12 leading-relaxed">
            NeuroBloom is built on a foundation of ethical AI, transparency, and child-centered design
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-teal-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Screening, Not Diagnosis</h3>
                  <p className="text-indigo-100">
                    We never claim to diagnose. Our platform provides screening insights to guide further professional evaluation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-teal-300 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data Privacy & Consent Focused</h3>
                  <p className="text-indigo-100">
                    Every data point is protected with industry-leading security. Consent is required at every step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-teal-50 via-indigo-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-950 mb-6">
            Start Your Screening Journey with NeuroBloom
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join hundreds of parents and educators using AI-powered insights to support children's learning.
          </p>
          <button 
            onClick={() => router.push("/signup")}

            className="px-10 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 text-lg mx-auto"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 text-indigo-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-teal-400 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">NeuroBloom</span>
              </div>
              <p className="text-sm text-indigo-300">
                Early cognitive insight for brighter futures.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#why" className="hover:text-white transition-colors">Why NeuroBloom</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ethics Statement</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-indigo-800 pt-8 text-center text-sm text-indigo-300">
            <p>&copy; 2026 NeuroBloom. All rights reserved. For screening purposes only, not medical diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
