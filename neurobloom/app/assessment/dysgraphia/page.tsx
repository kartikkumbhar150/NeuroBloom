"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import CanvasInput from "@/components/assessment/CanvasInput";
import { Check, ArrowRight, Clock, RefreshCw } from "lucide-react";

const questions = [
    {
        id: "trace_letter",
        type: "trace",
        question: "Trace the letter 'A'",
        background: "A",
    },
    {
        id: "copy_word",
        type: "copy",
        question: "Write the word 'cat'",
        word: "cat",
    },
    {
        id: "spacing",
        type: "spacing",
        question: "Copy the sentence inside the box",
        sentence: "I like apples",
    },
    {
        id: "timed_writing",
        type: "timed",
        question: "Write 'a b c d' as fast as you can!",
        target: "a b c d",
        timeLimit: 30,
    },
];

export default function DysgraphiaPage() {
    const router = useRouter();
    const { updateModuleData } = useAssessment();
    const [currentStep, setCurrentStep] = useState(0);
    const [drawingData, setDrawingData] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;

    useEffect(() => {
        if (currentQuestion.type === "timed") {
            setTimeLeft(currentQuestion.timeLimit || 30);
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === null || prev <= 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setTimeLeft(null);
        }
    }, [currentQuestion]);

    const handleDrawEnd = (dataUrl: string) => {
        setDrawingData(dataUrl);
    };

    const handleNext = () => {
        if (drawingData) {
            updateModuleData("dysgraphia", currentQuestion.id, {
                image: drawingData, // In real app, upload this to S3/Cloudinary
                timestamp: new Date().toISOString(),
                timeTaken: currentQuestion.type === "timed" ? (currentQuestion.timeLimit! - (timeLeft || 0)) : undefined,
            });

            if (isLastQuestion) {
                router.push("/assessment/apd");
            } else {
                setCurrentStep((prev) => prev + 1);
                setDrawingData(null);
            }
        }
    };

    return (
        <AssessmentLayout
            title="Writing Wizardry"
            moduleName="Dysgraphia"
            currentStep={currentStep + 1}
            totalSteps={questions.length}
        >
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-purple-50 px-8 py-4 rounded-3xl mb-8 shadow-sm border border-purple-100 animate-pop">
                    <h2 className="text-2xl md:text-3xl font-bold text-purple-900 text-center">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Specific Instructions */}
                {currentQuestion.type === "copy" && (
                    <div className="text-6xl font-mono font-bold text-indigo-900 mb-8 tracking-widest bg-white px-8 py-4 rounded-2xl border-2 border-dashed border-indigo-200 transform -rotate-2">
                        {currentQuestion.word}
                    </div>
                )}

                {currentQuestion.type === "spacing" && (
                    <div className="text-3xl font-serif text-gray-700 mb-8 italic bg-yellow-50 px-8 py-4 rounded-xl border border-yellow-200 shadow-sm transform rotate-1">
                        "{currentQuestion.sentence}"
                    </div>
                )}

                {/* Timed Writing Timer */}
                {currentQuestion.type === "timed" && (
                    <div className="flex flex-col items-center mb-8">
                        <div className="text-5xl font-bold text-indigo-900 mb-6 tracking-widest">
                            {currentQuestion.target}
                        </div>
                        <div className={`flex items-center gap-3 px-6 py-3 rounded-full font-black text-2xl shadow-md animate-pulse ${(timeLeft || 0) < 10 ? "bg-red-100 text-red-600 border-2 border-red-200" : "bg-teal-100 text-teal-600 border-2 border-teal-200"
                            }`}>
                            <Clock className="w-6 h-6" />
                            {timeLeft}s
                        </div>
                    </div>
                )}

                {/* Canvas Area */}
                <div className="relative p-4 bg-white rounded-3xl shadow-xl border-4 border-indigo-100 mb-8 transform rotate-1 hover:rotate-0 transition-transform duration-500 w-full max-w-2xl">
                    {/* Notebook holes decoration */}
                    <div className="absolute top-0 left-4 w-full h-8 flex gap-8 z-10">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded-full shadow-inner mt-2"></div>
                        ))}
                    </div>

                    <div className="mt-4 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
                        <CanvasInput
                            backgroundImage={currentQuestion.type === "trace" ? currentQuestion.background : undefined}
                            onDrawEnd={handleDrawEnd}
                            label={currentQuestion.type === "spacing" ? "Write inside the box:" : "Draw here:"}
                            width={600}
                            height={300}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-6">
                    <button
                        onClick={() => window.location.reload()} // Simple clear for now
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Clear
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!drawingData}
                        className={`px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${drawingData
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 hover:shadow-xl"
                            : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        {isLastQuestion ? "Finish Writing Magic" : "Next Challenge"}
                        {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </AssessmentLayout>
    );
}
