"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight, Eye } from "lucide-react";

const questions = [
    {
        id: "visual_discrim",
        type: "discrimination",
        question: "Which shape is different?",
        options: ["●", "●", "■"], // Using simple chars for now
        correct: "■",
    },
    {
        id: "shape_match",
        type: "match",
        question: "Find the matching shape",
        target: "▲",
        options: ["●", "▲", "■", "◆"],
        correct: "▲",
    },
    {
        id: "figure_ground",
        type: "find",
        question: "Find the star ⭐ in the crowd",
        // In real app, this would be an image map or canvas.
        // For now, a grid of emojis.
        grid: ["🍎", "🚗", "⭐", "🐶", "🏠", "🌲"],
        correct: "⭐",
    },
    {
        id: "visual_memory",
        type: "memory",
        question: "Remember these pictures!",
        items: ["🐱", "🍦", "⚽", "🚗"],
        options: ["🐱", "🍦", "⚽", "🚗", "🐶", "🏠"], // Includes distractors
        correct: ["🐱", "🍦", "⚽", "🚗"],
    },
];

export default function VPDPage() {
    const router = useRouter();
    const { updateModuleData } = useAssessment();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
    const [memoryPhase, setMemoryPhase] = useState<"show" | "hide" | "select">("select");
    const [memorySelection, setMemorySelection] = useState<string[]>([]);

    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;

    useEffect(() => {
        if (currentQuestion.type === "memory") {
            setMemoryPhase("show");
            const timer1 = setTimeout(() => setMemoryPhase("hide"), 5000);
            const timer2 = setTimeout(() => setMemoryPhase("select"), 6000); // 1s gap
            return () => { clearTimeout(timer1); clearTimeout(timer2); };
        } else {
            setMemoryPhase("select");
        }
    }, [currentQuestion]);

    const handleAnswer = (answer: any) => {
        if (currentQuestion.type === "memory") {
            if (memoryPhase !== "select") return;

            const newSelection = memorySelection.includes(answer)
                ? memorySelection.filter(i => i !== answer)
                : [...memorySelection, answer];

            setMemorySelection(newSelection);
            // Auto-confirm if 4 items selected (simplified)
            if (newSelection.length === 4) {
                setSelectedAnswer(newSelection);
            } else {
                setSelectedAnswer(null); // Require exactly 4
            }
        } else {
            setSelectedAnswer(answer);
        }
    };

    const handleNext = () => {
        if (selectedAnswer) {
            updateModuleData("vpd", currentQuestion.id, {
                answer: selectedAnswer,
                correct: JSON.stringify(selectedAnswer) === JSON.stringify(currentQuestion.correct), // Simple array compare
                timestamp: new Date().toISOString(),
            });

            if (isLastQuestion) {
                router.push("/assessment/emotion");
            } else {
                setCurrentStep((prev) => prev + 1);
                setSelectedAnswer(null);
                setMemorySelection([]);
            }
        }
    };

    return (
        <AssessmentLayout
            title="Eagle Eyes Adventure"
            moduleName="Visual Processing"
            currentStep={currentStep + 1}
            totalSteps={questions.length}
        >
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-teal-50 px-8 py-4 rounded-3xl mb-10 shadow-sm border border-teal-100 animate-pop">
                    <h2 className="text-2xl md:text-3xl font-bold text-teal-900 text-center">
                        {memoryPhase === "show" ? "Watch carefully..." :
                            memoryPhase === "hide" ? "Wait..." :
                                currentQuestion.question}
                    </h2>
                </div>

                {/* Visual Discrimination & Matching */}
                {(currentQuestion.type === "discrimination" || currentQuestion.type === "match") && (
                    <div className="flex flex-col items-center gap-10 mb-12">
                        {currentQuestion.target && (
                            <div className="text-8xl p-8 bg-white rounded-3xl border-4 border-indigo-100 shadow-lg animate-bounce-slow">
                                {currentQuestion.target}
                            </div>
                        )}
                        <div className="flex gap-8">
                            {currentQuestion.options?.map((option: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-32 h-32 rounded-3xl text-6xl flex items-center justify-center transition-all transform hover:scale-110 ${selectedAnswer === option
                                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl scale-110 rotate-3 ring-4 ring-indigo-200"
                                        : "bg-white border-4 border-gray-100 hover:border-indigo-300 hover:shadow-lg"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Figure Ground (Grid) */}
                {currentQuestion.type === "find" && (
                    <div className="grid grid-cols-3 gap-6 mb-12 bg-indigo-50 p-8 rounded-3xl border-4 border-indigo-100 shadow-inner">
                        {currentQuestion.grid?.map((item: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(item)}
                                className={`w-24 h-24 bg-white rounded-2xl text-5xl flex items-center justify-center transition-all transform hover:scale-110 ${selectedAnswer === item
                                    ? "ring-8 ring-indigo-400 scale-125 z-20 shadow-2xl animate-pop"
                                    : "hover:shadow-md hover:rotate-3"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}

                {/* Visual Memory */}
                {currentQuestion.type === "memory" && (
                    <div className="mb-12 w-full flex flex-col items-center">
                        {memoryPhase === "show" && (
                            <div className="grid grid-cols-2 gap-8 animate-pulse">
                                {currentQuestion.items?.map((item: string, idx: number) => (
                                    <div key={idx} className="text-8xl p-8 bg-white border-4 border-purple-100 rounded-3xl shadow-lg transform rotate-1">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                        {memoryPhase === "hide" && (
                            <div className="w-64 h-64 flex items-center justify-center bg-purple-50 rounded-full animate-pulse">
                                <Eye className="w-24 h-24 text-purple-300 animate-bounce" />
                            </div>
                        )}
                        {memoryPhase === "select" && (
                            <div className="grid grid-cols-3 gap-6">
                                {currentQuestion.options?.map((item: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(item)}
                                        className={`w-24 h-24 rounded-2xl text-5xl flex items-center justify-center transition-all transform hover:scale-105 ${memorySelection.includes(item)
                                            ? "bg-purple-100 border-4 border-purple-500 shadow-inner scale-95"
                                            : "bg-white border-4 border-gray-100 hover:border-purple-300 hover:shadow-lg"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className={`px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${selectedAnswer
                        ? "bg-gradient-to-r from-teal-400 to-green-500 text-white hover:scale-105 hover:shadow-xl"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                >
                    {isLastQuestion ? "Finish Visual Mission" : "Next Challenge"}
                    {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </button>
            </div>
        </AssessmentLayout>
    );
}
