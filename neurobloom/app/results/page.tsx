"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, Home, Star, TrendingUp, Brain, Activity, Calendar } from "lucide-react";

export default function ResultsPage() {
    const router = useRouter();
    const { submitAssessment, data } = useAssessment(); // Get data from context
    const [isSubmitting, setIsSubmitting] = useState(true);

    const hasSubmitted = useRef(false);

    useEffect(() => {
        if (hasSubmitted.current) return;

        const submit = async () => {
            hasSubmitted.current = true;
            await submitAssessment();
            setIsSubmitting(false);
        };
        submit();
    }, [submitAssessment]);

    // Mock Analysis Data (In real app, this comes from backend)
    const analysis = {
        overallScore: 85,
        level: "Brain Explorer",
        strengths: ["Visual Memory", "Pattern Recognition"],
        areasToImprove: ["Auditory Attention"],
        modules: [
            { name: "Dyscalculia", score: 90, status: "Excellent", icon: "🧮" },
            { name: "Dyslexia", score: 75, status: "Good", icon: "📚" },
            { name: "Dysgraphia", score: 80, status: "Great", icon: "✍️" },
            { name: "APD", score: 60, status: "Keep Practicing", icon: "👂" },
            { name: "VPD", score: 95, status: "Superb", icon: "👁️" },
            { name: "Emotion", score: 88, status: "Great", icon: "😊" },
        ]
    };

    if (isSubmitting) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50">
                <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-bold text-indigo-900 animate-pulse">Analyzing your adventure...</h2>
                <p className="text-indigo-500 mt-2">Our AI is checking your super skills!</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0F4F8] p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-indigo-900 mb-2">Mission Complete! 🎉</h1>
                        <p className="text-xl text-indigo-600">Here is your Adventure Report</p>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Back to Base
                    </button>
                </header>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Overall Score Card */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4 opacity-90">
                                <Star className="w-6 h-6" />
                                <span className="font-bold tracking-wider uppercase text-sm">Overall Score</span>
                            </div>
                            <div className="text-7xl font-black mb-2">{analysis.overallScore}%</div>
                            <div className="text-indigo-100 font-medium">Level: {analysis.level}</div>
                        </div>
                    </div>

                    {/* Strengths Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-6 text-green-600">
                            <Brain className="w-6 h-6" />
                            <span className="font-bold tracking-wider uppercase text-sm">Super Powers</span>
                        </div>
                        <ul className="space-y-3">
                            {analysis.strengths.map((strength, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium bg-green-50 p-3 rounded-xl">
                                    <Check className="w-5 h-5 text-green-500" />
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Focus Areas Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-orange-100">
                        <div className="flex items-center gap-3 mb-6 text-orange-500">
                            <TrendingUp className="w-6 h-6" />
                            <span className="font-bold tracking-wider uppercase text-sm">Power Up Next</span>
                        </div>
                        <ul className="space-y-3">
                            {analysis.areasToImprove.map((area, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium bg-orange-50 p-3 rounded-xl">
                                    <Activity className="w-5 h-5 text-orange-400" />
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Duration Analytics (Debug / Backend Data) */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-100 mb-12">
                    <div className="flex items-center gap-3 mb-6 text-blue-600">
                        <Calendar className="w-6 h-6" />
                        <span className="font-bold tracking-wider uppercase text-sm">Time Analysis (Backend Data)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-blue-400 font-bold uppercase text-xs mb-2">Total Assessment Time</span>
                            <span className="text-5xl font-black text-blue-900">
                                {Math.floor((data.metadata?.totalDurationSeconds || 0) / 60)}m {(data.metadata?.totalDurationSeconds || 0) % 60}s
                            </span>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700 mb-4">Module Breakdown</h4>
                            <div className="space-y-3">
                                {Object.entries(data.metadata?.moduleDurations || {}).map(([mod, time]) => (
                                    <div key={mod} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                        <span className="capitalize font-medium text-gray-600">{mod}</span>
                                        <span className="font-bold text-gray-800">{time as React.ReactNode}s</span>
                                    </div>
                                ))}
                                {Object.keys(data.metadata?.moduleDurations || {}).length === 0 && (
                                    <div className="text-gray-400 italic">No module data recorded yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Module Breakdown */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-indigo-500" />
                    Mission Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {analysis.modules.map((module) => (
                        <div key={module.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                                    {module.icon}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${module.score >= 80 ? "bg-green-100 text-green-700" :
                                    module.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                    {module.status}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{module.name}</h3>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${module.score}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-sm font-bold text-gray-500 mt-2">{module.score}%</div>
                        </div>
                    ))}
                </div>

                {/* AI Insights / Next Steps */}
                <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full -mr-20 -mt-20 opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Brain className="w-8 h-8 text-indigo-300" />
                            Dr. Bloom's Insights
                        </h2>
                        <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-3xl">
                            "Based on today's adventure, you showed incredible focus in visual tasks! 🌟
                            To level up your auditory skills, try playing 'Simon Says' or listening to audiobooks this week.
                            Keep up the amazing work, explorer!"
                        </p>
                        <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
                            Download Full Medical Report (PDF)
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
