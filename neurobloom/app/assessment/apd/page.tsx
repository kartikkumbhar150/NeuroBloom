"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight, Volume2, Play, RotateCcw } from "lucide-react";

// Questions array remains identical to your data structure
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
            { id: "green_triangle", color: "bg-green-600", shape: "rounded-lg" }, 
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
        if (!('speechSynthesis' in window)) return;
        setIsPlaying(true);
        const synth = window.speechSynthesis;
        synth.cancel();

        if (currentQuestion.type === "discrimination") {
            const u1 = new SpeechSynthesisUtterance(currentQuestion.sound1);
            const u2 = new SpeechSynthesisUtterance(currentQuestion.sound2);
            u1.rate = 0.8; u2.rate = 0.8;
            u1.onend = () => setTimeout(() => synth.speak(u2), 500);
            u2.onend = () => setIsPlaying(false);
            synth.speak(u1);
        } else if (currentQuestion.type === "memory") {
            const sequence = currentQuestion.sequence || [];
            let i = 0;
            const speakNext = () => {
                if (i < sequence.length) {
                    const u = new SpeechSynthesisUtterance(sequence[i]);
                    u.rate = 0.7;
                    u.onend = () => { i++; setTimeout(speakNext, 600); };
                    synth.speak(u);
                } else { setIsPlaying(false); }
            };
            speakNext();
        } else {
            const utterance = new SpeechSynthesisUtterance(text || currentQuestion.audio || "sound");
            utterance.rate = 0.8;
            utterance.onend = () => setIsPlaying(false);
            synth.speak(utterance);
        }
    };

    const handleAnswer = (answer: string) => {
        if (currentQuestion.type === "memory") {
            const newSequence = [...memorySequence, answer];
            if (newSequence.length <= (currentQuestion.sequence?.length || 0)) {
                setMemorySequence(newSequence);
                if (newSequence.length === currentQuestion.sequence?.length) {
                    setSelectedAnswer(newSequence.join("-"));
                }
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
            {/* Main Container locked to viewport height */}
            <div className="flex flex-col h-[calc(100vh-160px)] w-full max-w-5xl mx-auto overflow-hidden px-4">
                
                {/* Header Section */}
                <div className="flex-none py-6 text-center">
                    <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-2">Module 01: Discrimination</p>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                        {currentQuestion.question}
                    </h2>
                </div>

                {/* Main Interaction Area - Grows to fill space */}
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 shadow-inner p-8 relative">
                    
                    {/* Audio Control */}
                    <div className="absolute top-8 right-8">
                         <div className={`flex gap-1 h-8 items-end ${isPlaying ? "opacity-100" : "opacity-0 transition-opacity"}`}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className={`w-1.5 bg-indigo-500 rounded-full animate-pulse`} style={{ height: `${20 + (i * 15)}%`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                         </div>
                    </div>

                    <button
                        onClick={() => playAudio()}
                        disabled={isPlaying}
                        className={`mb-12 group relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
                            isPlaying 
                            ? "bg-slate-100 scale-90" 
                            : "bg-white shadow-xl hover:shadow-indigo-200/50 hover:scale-110 active:scale-95 border border-slate-100"
                        }`}
                    >
                        {isPlaying ? (
                            <Volume2 className="w-10 h-10 text-indigo-400 animate-pulse" />
                        ) : (
                            <Play className="w-10 h-10 text-indigo-600 fill-indigo-600 group-hover:text-indigo-500" />
                        )}
                    </button>

                    {/* Options Grid - Dynamic Height but constrained */}
                    <div className="w-full flex justify-center items-center min-h-[280px]">
                        
                        {currentQuestion.type === "discrimination" && (
                            <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
                                {(currentQuestion.options as string[]).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        className={`py-8 rounded-3xl text-2xl font-bold transition-all border-4 ${
                                            selectedAnswer === option
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-2xl translate-y-[-4px]"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 shadow-sm"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === "listen_choose" && (
                            <div className="grid grid-cols-3 gap-8">
                                {currentQuestion.options?.map((option: any) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswer(option.id)}
                                        className={`text-8xl p-10 rounded-[2rem] transition-all bg-white border-2 ${
                                            selectedAnswer === option.id
                                                ? "border-indigo-500 shadow-2xl scale-110 ring-4 ring-indigo-50"
                                                : "border-transparent shadow-md hover:shadow-xl hover:scale-105"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === "instruction" && (
                            <div className="flex gap-12">
                                {currentQuestion.options?.map((option: any) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswer(option.id)}
                                        className={`w-36 h-36 transition-all shadow-xl hover:scale-110 ${option.color} ${option.shape} ${
                                            selectedAnswer === option.id ? "ring-[12px] ring-indigo-100 border-4 border-indigo-500" : ""
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === "memory" && (
                            <div className="flex flex-col items-center w-full max-w-2xl">
                                <div className="flex gap-4 mb-10 h-20 items-center justify-center">
                                    {memorySequence.map((num, idx) => (
                                        <div key={idx} className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg animate-in fade-in zoom-in duration-300">
                                            {num}
                                        </div>
                                    ))}
                                    {memorySequence.length === 0 && <p className="text-slate-300 font-medium italic">Repeat the sequence...</p>}
                                </div>
                                <div className="grid grid-cols-5 gap-4">
                                    {(currentQuestion.options as string[]).map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleAnswer(num)}
                                            disabled={memorySequence.length >= (currentQuestion.sequence?.length || 0)}
                                            className="w-16 h-16 rounded-xl border-2 border-slate-200 bg-white text-2xl font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 transition-all active:scale-90"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => { setMemorySequence([]); setSelectedAnswer(null); }} className="mt-8 flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-sm uppercase tracking-tighter">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Section - Fixed to bottom */}
                <div className="flex-none py-8 flex justify-center">
                    <button
                        onClick={handleNext}
                        disabled={!selectedAnswer}
                        className={`group px-16 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 transition-all duration-300 ${
                            selectedAnswer
                                ? "bg-slate-900 text-white shadow-2xl hover:bg-black hover:px-20"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                        }`}
                    >
                        <span>{isLastQuestion ? "Finalize Assessment" : "Next Challenge"}</span>
                        {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                    </button>
                </div>
            </div>
        </AssessmentLayout>
    );
}