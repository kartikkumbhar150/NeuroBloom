"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight, Volume2, Mic } from "lucide-react";

const questions = [
    {
        id: "letter_id",
        type: "choice",
        question: "Click on the letter 'b'",
        options: ["d", "b", "p", "q"],
        correct: "b",
    },
    {
        id: "sound_match",
        type: "audio_choice",
        question: "Which letter makes the sound /m/?",
        audioSrc: "/sounds/m_sound.mp3", // Placeholder
        options: ["m", "n", "s"],
        correct: "m",
    },
    {
        id: "word_reading",
        type: "reading",
        question: "Read this word out loud",
        word: "cat",
        correct: "cat",
    },
    {
        id: "word_pic_match",
        type: "image_choice",
        question: "Which picture matches the word 'cat'?",
        word: "cat",
        options: [
            { id: "cat", label: "🐱" },
            { id: "dog", label: "🐶" },
            { id: "rat", label: "🐀" },
        ],
        correct: "cat",
    },
];

export default function DyslexiaPage() {
    const router = useRouter();
    const { updateModuleData } = useAssessment();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const playAudio = (text: string) => {
        if ('speechSynthesis' in window) {
            setIsPlaying(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.onend = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.start();
            setIsPlaying(true); // Reusing state for "recording" visual

            // Mock recording duration
            setTimeout(() => {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
                setIsPlaying(false);
                handleAnswer("audio_recorded_blob");
            }, 2000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure you have granted permission.");
        }
    };



    const handleNext = () => {
        if (selectedAnswer) {
            updateModuleData("dyslexia", currentQuestion.id, {
                answer: selectedAnswer,
                correct: selectedAnswer === currentQuestion.correct,
                timestamp: new Date().toISOString(),
            });

            if (isLastQuestion) {
                router.push("/assessment/dysgraphia");
            } else {
                setCurrentStep((prev) => prev + 1);
                setSelectedAnswer(null);
            }
        }
    };

    return (
        <AssessmentLayout
            title="Reading Rocket Adventure"
            moduleName="Dyslexia"
            currentStep={currentStep + 1}
            totalSteps={questions.length}
        >
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-green-50 px-8 py-4 rounded-3xl mb-10 shadow-sm border border-green-100 animate-pop">
                    <h2 className="text-2xl md:text-3xl font-bold text-green-900 text-center">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Audio Question */}
                {currentQuestion.type === "audio_choice" && (
                    <button
                        onClick={() => playAudio("Which letter makes the sound mmm?")}
                        className={`mb-12 w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${isPlaying
                            ? "bg-teal-400 text-white shadow-lg ring-4 ring-teal-200 animate-pulse"
                            : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200 shadow-md"
                            }`}
                    >
                        <Volume2 className="w-16 h-16" />
                    </button>
                )}

                {/* Reading Question */}
                {currentQuestion.type === "reading" && (
                    <div className="flex flex-col items-center mb-12 w-full">
                        <div className="bg-white px-12 py-8 rounded-3xl shadow-lg border-4 border-indigo-50 mb-10 transform rotate-1">
                            <div className="text-7xl font-black text-indigo-600 tracking-widest">
                                {currentQuestion.word}
                            </div>
                        </div>
                        <button
                            onClick={startRecording}
                            className={`px-10 py-5 rounded-full flex items-center gap-3 border-4 transition-all transform hover:scale-105 ${selectedAnswer
                                ? "bg-green-500 border-green-600 text-white shadow-xl"
                                : "bg-white border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 shadow-md"
                                }`}
                        >
                            <Mic className={`w-8 h-8 ${isPlaying ? "animate-pulse text-red-500" : ""}`} />
                            <span className="text-xl font-bold">{selectedAnswer ? "Great Job!" : (isPlaying ? "Listening..." : "Tap & Read")}</span>
                        </button>
                    </div>
                )}

                {/* Image Choice Question */}
                {currentQuestion.type === "image_choice" && (
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

                {/* Standard Choice & Audio Choice Options */}
                {(currentQuestion.type === "choice" || currentQuestion.type === "audio_choice") && (
                    <div className="flex gap-8 mb-12">
                        {currentQuestion.options?.map((option: any) => (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                className={`w-32 h-32 rounded-3xl text-5xl font-black transition-all transform hover:scale-110 ${selectedAnswer === option
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl ring-4 ring-indigo-200 rotate-3"
                                    : "bg-white border-4 border-indigo-100 text-indigo-600 hover:border-indigo-300 shadow-md"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
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
                    {isLastQuestion ? "Finish Reading Mission" : "Next Challenge"}
                    {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                </button>
            </div>
        </AssessmentLayout>
    );
}
