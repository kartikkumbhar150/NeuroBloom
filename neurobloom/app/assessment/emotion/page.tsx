"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight, Smile, Frown, Meh } from "lucide-react";

const questions = [
    {
        id: "facial_id",
        type: "identify",
        question: "How is the child feeling?",
        image: "😢", // Placeholder
        options: ["Happy", "Sad", "Angry", "Scared"],
        correct: "Sad",
    },
    {
        id: "situation",
        type: "situation",
        question: "A child's toy is broken. How will they feel?",
        image: "🧸💔",
        options: ["Happy", "Sad", "Angry"],
        correct: "Sad",
    },
    {
        id: "face_match",
        type: "match",
        question: "Which face looks Sad?",
        target: "Sad",
        options: ["😊", "😢", "😡"],
        correct: "😢",
    },
    {
        id: "change_detect",
        type: "change",
        question: "Did the feeling change?",
        image1: "😊",
        image2: "😢",
        options: ["Yes", "No"],
        correct: "Yes",
    },
];

export default function EmotionPage() {
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
            updateModuleData("emotion", currentQuestion.id, {
                answer: selectedAnswer,
                correct: selectedAnswer === currentQuestion.correct,
                timestamp: new Date().toISOString(),
            });

            if (isLastQuestion) {
                router.push("/results");
            } else {
                setCurrentStep((prev) => prev + 1);
                setSelectedAnswer(null);
            }
        }
    };

    return (
        <AssessmentLayout
            title="Feeling Friend Adventure"
            moduleName="Emotional Awareness"
            currentStep={currentStep + 1}
            totalSteps={questions.length}
        >
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-pink-50 px-8 py-4 rounded-3xl mb-10 shadow-sm border border-pink-100 animate-pop">
                    <h2 className="text-2xl md:text-3xl font-bold text-pink-900 text-center">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Visual Content */}
                <div className="mb-12 flex items-center gap-10">
                    {currentQuestion.type === "change" ? (
                        <div className="flex items-center gap-6 bg-white p-6 rounded-3xl shadow-md border-2 border-pink-50">
                            <div className="text-9xl animate-bounce-slow">{currentQuestion.image1}</div>
                            <ArrowRight className="w-12 h-12 text-pink-300 animate-pulse" />
                            <div className="text-9xl animate-bounce-slow" style={{ animationDelay: "0.5s" }}>{currentQuestion.image2}</div>
                        </div>
                    ) : (
                        currentQuestion.image && (
                            <div className="text-9xl p-8 bg-white rounded-full border-4 border-pink-100 shadow-xl animate-pop">
                                {currentQuestion.image}
                            </div>
                        )
                    )}

                    {currentQuestion.type === "match" && (
                        <div className="text-6xl font-black text-pink-500 bg-pink-50 px-8 py-4 rounded-2xl border-2 border-pink-200 transform -rotate-3">
                            {currentQuestion.target}
                        </div>
                    )}
                </div>

                {/* Options */}
                <div className="flex gap-8 mb-12">
                    {currentQuestion.options?.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className={`px-10 py-6 rounded-3xl text-2xl font-bold transition-all transform hover:scale-110 ${selectedAnswer === option
                                ? "bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-xl scale-110 rotate-2 ring-4 ring-pink-200"
                                : "bg-white border-4 border-pink-50 text-pink-600 hover:border-pink-300 hover:shadow-lg"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className={`px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${selectedAnswer
                        ? "bg-gradient-to-r from-teal-400 to-green-500 text-white hover:scale-105 hover:shadow-xl"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                >
                    {isLastQuestion ? "Finish Feelings Mission" : "Next Challenge"}
                    {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </button>
            </div>
        </AssessmentLayout>
    );
}
