"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight, Volume2, Play } from "lucide-react";

const questions = [
    {
        id: "sound_discrim",
        type: "discrimination",
        question: "Are these sounds the same or different?",
        sound1: "ba",
        sound2: "da",
        options: ["Same", "Different"],
        correct: "Different",
    },
    {
        id: "word_rec",
        type: "listen_choose",
        question: "Listen and choose the correct picture",
        audio: "cat",
        options: [
            { id: "cat", label: "🐱" },
            { id: "dog", label: "🐶" },
            { id: "rat", label: "🐀" },
        ],
        correct: "cat",
    },
    {
        id: "instructions",
        type: "instruction",
        question: "Listen and follow the instruction",
        audio: "Click the red circle",
        options: [
            { id: "red_circle", color: "bg-red-500", shape: "rounded-full" },
            { id: "blue_square", color: "bg-blue-500", shape: "rounded-none" },
            { id: "green_triangle", color: "bg-green-500", shape: "clip-triangle" }, // CSS clip-path needed for triangle, using square for now
        ],
        correct: "red_circle",
    },
    {
        id: "memory",
        type: "memory",
        question: "Listen and remember the numbers",
        sequence: ["3", "7", "2"],
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        correct: "3-7-2",
    },
];

export default function APDPage() {
    const router = useRouter();
    const { updateModuleData } = useAssessment();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [memorySequence, setMemorySequence] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);

    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;

    const playAudio = (text?: string) => {
        if (!('speechSynthesis' in window)) {
            alert("Sorry, your browser doesn't support text-to-speech.");
            return;
        }

        setIsPlaying(true);
        const synth = window.speechSynthesis;
        synth.cancel(); // Stop any previous speech

        if (currentQuestion.type === "discrimination") {
            // Play sound1, pause, sound2
            const u1 = new SpeechSynthesisUtterance(currentQuestion.sound1);
            const u2 = new SpeechSynthesisUtterance(currentQuestion.sound2);
            u1.rate = 0.8;
            u2.rate = 0.8;

            u1.onend = () => {
                setTimeout(() => synth.speak(u2), 500); // 500ms pause
            };
            u2.onend = () => setIsPlaying(false);

            synth.speak(u1);

        } else if (currentQuestion.type === "memory") {
            // Play sequence
            const sequence = currentQuestion.sequence || [];
            let i = 0;

            const speakNext = () => {
                if (i < sequence.length) {
                    const u = new SpeechSynthesisUtterance(sequence[i]);
                    u.rate = 0.8;
                    u.onend = () => {
                        i++;
                        setTimeout(speakNext, 800); // 800ms pause between numbers
                    };
                    synth.speak(u);
                } else {
                    setIsPlaying(false);
                }
            };
            speakNext();

        } else {
            // Standard audio
            const utterance = new SpeechSynthesisUtterance(text || currentQuestion.audio || "sound");
            utterance.rate = 0.9;
            utterance.onend = () => setIsPlaying(false);
            synth.speak(utterance);
        }
    };

    const handleAnswer = (answer: string) => {
        if (currentQuestion.type === "memory") {
            const newSequence = [...memorySequence, answer];
            setMemorySequence(newSequence);
            if (newSequence.length === currentQuestion.sequence?.length) {
                setSelectedAnswer(newSequence.join("-"));
            }
        } else {
            setSelectedAnswer(answer);
        }
    };

    const handleNext = () => {
        if (selectedAnswer) {
            updateModuleData("apd", currentQuestion.id, {
                answer: selectedAnswer,
                correct: selectedAnswer === currentQuestion.correct,
                timestamp: new Date().toISOString(),
            });

            if (isLastQuestion) {
                router.push("/assessment/vpd");
            } else {
                setCurrentStep((prev) => prev + 1);
                setSelectedAnswer(null);
                setMemorySequence([]);
            }
        }
    };

    return (
        <AssessmentLayout
            title="Super Ears Adventure"
            moduleName="Auditory Processing"
            currentStep={currentStep + 1}
            totalSteps={questions.length}
        >
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-yellow-50 px-8 py-4 rounded-3xl mb-10 shadow-sm border border-yellow-100 animate-pop">
                    <h2 className="text-2xl md:text-3xl font-bold text-yellow-900 text-center">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Audio Player Button */}
                <button
                    onClick={() => playAudio()}
                    className={`mb-12 px-10 py-6 rounded-full flex items-center gap-4 transition-all transform hover:scale-105 ${isPlaying
                        ? "bg-teal-400 text-white shadow-xl ring-4 ring-teal-200 animate-pulse"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-2xl shadow-lg"
                        }`}
                >
                    {isPlaying ? <Volume2 className="w-8 h-8 animate-bounce" /> : <Play className="w-8 h-8" />}
                    <span className="font-black text-2xl tracking-wide">
                        {isPlaying ? "Listening..." : "Play Sound"}
                    </span>
                </button>

                {/* Discrimination Options */}
                {currentQuestion.type === "discrimination" && (
                    <div className="flex gap-8 mb-12">
                        {(currentQuestion.options as string[])?.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                className={`px-10 py-6 rounded-2xl text-2xl font-bold transition-all transform hover:scale-110 ${selectedAnswer === option
                                    ? "bg-indigo-600 text-white shadow-xl ring-4 ring-indigo-200 rotate-2"
                                    : "bg-white border-4 border-indigo-100 text-indigo-600 hover:border-indigo-300 shadow-md"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}

                {/* Image Choice Options */}
                {currentQuestion.type === "listen_choose" && (
                    <div className="grid grid-cols-3 gap-8 mb-12">
                        {currentQuestion.options?.map((option: any) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option.id)}
                                className={`p-8 rounded-3xl text-7xl transition-all transform hover:scale-110 ${selectedAnswer === option.id
                                    ? "bg-indigo-100 ring-4 ring-indigo-300 scale-110 rotate-3"
                                    : "bg-white border-4 border-gray-100 hover:border-indigo-200 hover:shadow-xl"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Instruction Options (Shapes) */}
                {currentQuestion.type === "instruction" && (
                    <div className="flex gap-12 mb-12">
                        {currentQuestion.options?.map((option: any) => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option.id)}
                                className={`w-32 h-32 transition-all transform hover:scale-110 ${option.color} ${option.shape} ${selectedAnswer === option.id ? "ring-8 ring-offset-4 ring-indigo-400 scale-110" : "hover:rotate-6 shadow-lg"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Memory Options */}
                {currentQuestion.type === "memory" && (
                    <div className="flex flex-col items-center mb-12 w-full">
                        <div className="flex gap-4 mb-8 min-h-[80px] bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100">
                            {memorySequence.map((num, idx) => (
                                <div key={idx} className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-3xl font-black text-indigo-600 shadow-sm animate-pop border-2 border-indigo-200">
                                    {num}
                                </div>
                            ))}
                            {memorySequence.length === 0 && (
                                <span className="text-indigo-300 italic self-center">Listen then click numbers...</span>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            {(currentQuestion.options as string[])?.map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleAnswer(num)}
                                    disabled={memorySequence.length >= (currentQuestion.sequence?.length || 0)}
                                    className="w-20 h-20 bg-white border-4 border-gray-100 rounded-2xl text-3xl font-bold text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => { setMemorySequence([]); setSelectedAnswer(null); }}
                            className="mt-6 px-6 py-2 rounded-full text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            Reset Sequence ↺
                        </button>
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
                    {isLastQuestion ? "Finish Listening Mission" : "Next Challenge"}
                    {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </button>
            </div>
        </AssessmentLayout>
    );
}
