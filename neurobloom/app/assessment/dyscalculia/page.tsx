"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight } from "lucide-react";

const questions = [
    {
        id: "num_rec",
        type: "choice",
        question: "Click on the number 5",
        options: ["2", "5", "9", "1"],
        correct: "5",
    },
    {
        id: "counting",
        type: "counting",
        question: "How many apples are there?",
        image: "🍎 🍎 🍎", // Using emojis for simplicity, replace with images later
        options: ["2", "3", "4", "5"],
        correct: "3",
    },
    {
        id: "math",
        type: "choice",
        question: "What is 2 + 3?",
        options: ["4", "5", "6", "1"],
        correct: "5",
    },
    {
        id: "comparison",
        type: "comparison",
        question: "Which number is bigger?",
        options: ["2", "8"],
        correct: "8",
    },
];

export default function DyscalculiaPage() {
    const router = useRouter();
    const { updateModuleData } = useAssessment();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNext = () => {
        if (selectedAnswer) {
            // Save data
            updateModuleData("dyscalculia", currentQuestion.id, {
                answer: selectedAnswer,
                correct: selectedAnswer === currentQuestion.correct,
                timestamp: new Date().toISOString(),
            });

            if (isLastQuestion) {
                // Move to next module
                router.push("/assessment/dyslexia");
            } else {
                setCurrentStep((prev) => prev + 1);
                setSelectedAnswer(null);
            }
        }
    };

    return (
        <AssessmentLayout
            title="Math Magic Adventure"
            moduleName="Dyscalculia"
            currentStep={currentStep + 1}
            totalSteps={questions.length}
        >
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                {/* Question Bubble */}
                <div className="bg-blue-50 px-8 py-4 rounded-3xl mb-10 shadow-sm border border-blue-100 animate-pop">
                    <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Visual Content (if any) */}
                {currentQuestion.type === "counting" && (
                    <div className="flex gap-4 mb-12 animate-bounce-slow">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="text-7xl filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-pointer">
                                🍎
                            </div>
                        ))}
                    </div>
                )}

                {/* Comparison Special Layout */}
                {currentQuestion.type === "comparison" ? (
                    <div className="flex gap-12 mb-12">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                className={`w-40 h-40 rounded-3xl text-6xl font-black transition-all transform hover:scale-110 hover:-rotate-3 ${selectedAnswer === option
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl scale-110 rotate-0 ring-4 ring-indigo-200"
                                    : "bg-white border-4 border-indigo-100 text-indigo-500 hover:border-indigo-300 shadow-md"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    /* Standard Grid Layout */
                    <div className="grid grid-cols-2 gap-6 w-full max-w-lg mb-12">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                className={`p-8 rounded-2xl text-4xl font-bold transition-all transform hover:scale-105 ${selectedAnswer === option
                                    ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg ring-4 ring-blue-200"
                                    : "bg-white border-4 border-blue-50 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className={`px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${selectedAnswer
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:scale-105 hover:shadow-xl"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                >
                    {isLastQuestion ? "Finish Math Magic" : "Next Challenge"}
                    {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </button>
            </div>
        </AssessmentLayout>
    );
}
