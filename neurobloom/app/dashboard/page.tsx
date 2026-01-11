"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAssessment } from '@/components/providers/AssessmentProvider';
import {
  Brain,
  Calculator,
  BookOpen,
  PenTool,
  Ear,
  Eye,
  Smile,
  ArrowRight,
  FileText,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  Check,
  Mic,
  Camera,
  Bluetooth
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const { setUserDetails } = useAssessment();
  const [step, setStep] = useState<'details' | 'permissions' | 'terms'>('details');
  const [formData, setFormData] = useState({ name: '', age: '', gender: '' });
  const [permissions, setPermissions] = useState({ mic: false, camera: false, eeg: false });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Reset state when dialog opens
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setStep('details');
      setFormData({ name: '', age: '', gender: '' });
      setPermissions({ mic: false, camera: false, eeg: false });
      setTermsAccepted(false);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.gender) {
      setUserDetails(formData);
      setStep('permissions');
    }
  };

  const requestMediaPermission = async (type: 'mic' | 'camera') => {
    try {
      if (type === 'mic') {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermissions(prev => ({ ...prev, mic: true }));
      } else if (type === 'camera') {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissions(prev => ({ ...prev, camera: true }));
      }
    } catch (err) {
      console.error(`Error requesting ${type} permission:`, err);
      alert(`Could not access ${type}. Please allow permission in your browser settings.`);
    }
  };

  const handleManualPermission = (type: 'eeg') => {
    // Mock permission for EEG
    setPermissions(prev => ({ ...prev, [type]: true }));
  };

  const allPermissionsGranted = permissions.mic && permissions.camera && permissions.eeg;

  const handleStartFirstTest = () => {
    if (termsAccepted) {
      // Direct to first module (Math Magic / Dyscalculia) as per request
      router.push('/assessment/dyscalculia');
    }
  };

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
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar - Fixed Left */}
      <aside className="w-64 bg-indigo-900 text-white hidden md:flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-2xl font-bold tracking-tight">NeuroBloom</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          <div className="px-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">Menu</div>

          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-800 rounded-xl text-white font-medium shadow-sm">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => router.push('/results')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-100 hover:bg-indigo-800/50 hover:text-white transition-colors"
          >
            <FileText className="w-5 h-5" />
            View Reports
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-100 hover:bg-indigo-800/50 hover:text-white transition-colors"
          >
            <User className="w-5 h-5" />
            Profile
          </button>

          <div className="pt-8 px-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">Settings</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-100 hover:bg-indigo-800/50 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            Preferences
          </button>
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-indigo-800/50 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content - Right Side */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">

        {/* Header - Fixed Top */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4 text-gray-500">
            <Menu className="w-6 h-6 md:hidden text-gray-700" />
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div
              className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/profile')}
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Level 2 Explorer</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-50">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-7xl mx-auto w-full">

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl mb-12 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 skew-x-12 translate-x-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, Explorer! 🚀</h1>
              <p className="text-indigo-100 max-w-xl">
                You&apos;re doing great! Ready to unlock some new superpowers today?
              </p>
            </div>
          </div>

          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Moved Button to Left Side (Flex Start) */}
            <div className="flex items-center gap-4">
              <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Start New Test
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-[#F0F4F8] border-none shadow-none p-8">

                  {/* Step 1: User Details */}
                  {step === 'details' && (
                    <div className="max-w-md mx-auto w-full bg-white p-6 rounded-2xl shadow-sm">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-indigo-900 text-center">Explorer Details</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleDetailsSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="Enter your age"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select onValueChange={(val) => setFormData({ ...formData, gender: val })} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold mt-4">
                          Next: System Check
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* Step 2: Permissions Check */}
                  {step === 'permissions' && (
                    <div className="max-w-md mx-auto w-full bg-white p-6 rounded-2xl shadow-sm text-center">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-indigo-900">System Check</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${permissions.mic ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                              <Mic className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-gray-800">Microphone</h4>
                              <p className="text-xs text-gray-500">Required for voice tasks</p>
                            </div>
                          </div>
                          <Button
                            variant={permissions.mic ? "secondary" : "outline"}
                            className={permissions.mic ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                            onClick={() => requestMediaPermission('mic')}
                          >
                            {permissions.mic ? <Check className="w-4 h-4" /> : "Allow"}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${permissions.camera ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                              <Camera className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-gray-800">Camera</h4>
                              <p className="text-xs text-gray-500">Required for facial tracking</p>
                            </div>
                          </div>
                          <Button
                            variant={permissions.camera ? "secondary" : "outline"}
                            className={permissions.camera ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}
                            onClick={() => requestMediaPermission('camera')}
                          >
                            {permissions.camera ? <Check className="w-4 h-4" /> : "Allow"}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-indigo-100">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${permissions.eeg ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                              <Bluetooth className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-gray-800">EEG Headset</h4>
                              <p className="text-xs text-gray-500">Connect via Bluetooth</p>
                            </div>
                          </div>
                          <Button
                            variant={permissions.eeg ? "secondary" : "default"}
                            className={permissions.eeg ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
                            onClick={() => handleManualPermission('eeg')}
                          >
                            {permissions.eeg ? "Connected" : "Connect"}
                          </Button>
                        </div>

                        <Button
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold mt-4"
                          disabled={!allPermissionsGranted}
                          onClick={() => setStep('terms')}
                        >
                          Proceed to Terms
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Terms & Conditions */}
                  {step === 'terms' && (
                    <div className="max-w-md mx-auto w-full bg-white p-6 rounded-2xl shadow-sm">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-indigo-900 text-center">Safety First</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="h-48 overflow-y-auto bg-gray-50 p-4 rounded-xl text-sm text-gray-600 text-justify border border-gray-100">
                          <p className="font-bold text-gray-800 mb-2">Terms and Conditions</p>
                          <p>
                            By proceeding with this assessment, you agree to the use of your camera and microphone for the purpose of analyzing responses.
                            All data is processed securely and is used solely for the purpose of generating your cognitive profile.
                            <br /><br />
                            This assessment is not a medical diagnosis. Please consult a professional for medical advice.
                            <br /><br />
                            Ensure you are in a quiet, well-lit environment for the best results.
                          </p>
                        </div>

                        <div className="flex items-center gap-3 p-2">
                          <input
                            type="checkbox"
                            id="terms"
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                          />
                          <label htmlFor="terms" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                            I agree to the Terms and Conditions
                          </label>
                        </div>

                        <Button
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold mt-4 py-6 text-lg"
                          disabled={!termsAccepted}
                          onClick={handleStartFirstTest}
                        >
                          Start Adventure 🚀
                        </Button>
                      </div>
                    </div>
                  )}

                </DialogContent>
              </Dialog>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          </div>

          {/* Stats / Quick Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div onClick={() => router.push('/results')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Last Report</h3>
              <p className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">View details →</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">1,250 XP</h3>
              <p className="text-sm text-gray-500">Total Score</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <Smile className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Level 2</h3>
              <p className="text-sm text-gray-500">Explorer Rank</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
