"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight, Star, RefreshCw, Play, Coins, PlusCircle, Gamepad2 } from "lucide-react";

const questions = [
    {
        id: "apple_count",
        type: "counting",
        question: "How many apples are there?",
        image: "🍎",
        count: 5,
        options: ["3", "5", "7", "4"],
        correct: "5",
    },
    {
        id: "star_compare",
        type: "comparison",
        question: "Which box has MORE stars?",
        leftCount: 4,
        rightCount: 8,
        options: [4, 8],
        correct: 8,
    },
    {
        id: "bubble_game",
        type: "bubble",
        question: "Watch the game!",
        subQuestion: "Solve the math in the bubble to win!",
        mathProblem: "2 + 3",
        options: ["4", "5", "6"],
        correct: "5",
    },
    {
        id: "coin_add",
        type: "coins",
        question: "Use coins to make the number 7",
        target: 7,
        denominations: [1, 2, 5, 10],
        correct: 7,
    },
];

export default function DyscalculiaPage() {
    const router = useRouter();
    const { updateModuleData } = useAssessment();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

    // State for Coin Game
    const [coinTotal, setCoinTotal] = useState(0);
    const [wallet, setWallet] = useState<number[]>([]);

    // State for Bubble Game
    const [gameStarted, setGameStarted] = useState(false);
    const [bubblePosition, setBubblePosition] = useState(0); // 0 to 100%

    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;

    // Reset states when question changes
    useEffect(() => {
        setSelectedAnswer(null);
        setCoinTotal(0);
        setWallet([]);
        setGameStarted(false);
        setBubblePosition(0);
    }, [currentStep]);

    // Bubble Animation Logic
    useEffect(() => {
        if (currentQuestion.type === "bubble" && gameStarted && !selectedAnswer) {
            const interval = setInterval(() => {
                setBubblePosition((prev) => {
                    if (prev >= 90) { // Hit bottom
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 1; // Falling speed
                });
            }, 50); // Speed of fall
            return () => clearInterval(interval);
        }
    }, [currentQuestion.type, gameStarted, selectedAnswer]);

    const handleAnswer = (answer: any) => {
        setSelectedAnswer(answer);
    };

    const handleCoinClick = (value: number) => {
        const target = currentQuestion.target || 0;
        if (coinTotal + value <= target + 5) { // Allow slight overfill then reset? keeping it simple
            const newTotal = coinTotal + value;
            setCoinTotal(newTotal);
            setWallet([...wallet, value]);

            if (newTotal === target) {
                handleAnswer(newTotal);
            } else {
                handleAnswer(null);
            }
        }
    };

    const handleCoinReset = () => {
        setCoinTotal(0);
        setWallet([]);
        handleAnswer(null);
    };

    const handleNext = () => {
        if (currentQuestion.type === "coins" && coinTotal !== currentQuestion.target) return;

        if (selectedAnswer !== null) {
            updateModuleData("dyscalculia", currentQuestion.id, {
                answer: selectedAnswer,
                correct: selectedAnswer === currentQuestion.correct,
                timestamp: new Date().toISOString(),
            });

            if (isLastQuestion) {
                router.push("/assessment/dyslexia");
            } else {
                setCurrentStep((prev) => prev + 1);
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
                    {currentQuestion.subQuestion && (
                        <p className="text-blue-600 text-center mt-2">{currentQuestion.subQuestion}</p>
                    )}
                </div>

                {/* TEST 1: Counting Apples */}
                {currentQuestion.type === "counting" && (
                    <>
                        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-bounce-slow max-w-xl">
                            {Array.from({ length: currentQuestion.count || 0 }).map((_, i) => (
                                <div key={i} className="text-8xl filter drop-shadow-lg transform hover:scale-110 transition-transform cursor-pointer">
                                    {currentQuestion.image}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 gap-6">
                            {currentQuestion.options?.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-24 h-24 rounded-2xl text-4xl font-black transition-all transform hover:scale-110 ${selectedAnswer === option
                                        ? "bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-xl scale-110 ring-4 ring-green-200"
                                        : "bg-white border-4 border-gray-100 text-gray-700 hover:border-green-300"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* TEST 2: Star Comparison */}
                {currentQuestion.type === "comparison" && (
                    <div className="flex gap-12 mb-12">
                        {[currentQuestion.leftCount, currentQuestion.rightCount].map((count, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(count)}
                                className={`p-8 rounded-3xl transition-all transform hover:scale-105 group ${selectedAnswer === count
                                    ? "bg-indigo-600 shadow-2xl ring-4 ring-indigo-300 scale-105"
                                    : "bg-white border-4 border-indigo-100 hover:border-indigo-400 shadow-lg"
                                    }`}
                            >
                                <div className={`grid grid-cols-2 gap-2 mb-4 ${selectedAnswer === count ? "text-yellow-300" : "text-yellow-400 group-hover:text-yellow-500"}`}>
                                    {Array.from({ length: count || 0 }).map((_, i) => (
                                        <Star key={i} className="w-8 h-8 fill-current animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                                    ))}
                                </div>
                                <div className={`text-2xl font-bold text-center ${selectedAnswer === count ? "text-white" : "text-indigo-900"}`}>
                                    {count} Stars
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* TEST 3: Falling Bubble Game */}
                {currentQuestion.type === "bubble" && (
                    <div className="flex flex-col items-center w-full max-w-2xl">
                        {/* Game Area */}
                        <div className="relative w-full h-80 bg-gradient-to-b from-sky-200 to-sky-50 rounded-3xl border-4 border-sky-300 overflow-hidden shadow-inner mb-8 group cursor-pointer" onClick={() => setGameStarted(true)}>
                            {!gameStarted ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] z-10 transition-opacity group-hover:bg-black/5">
                                    <div className="bg-white px-8 py-4 rounded-full shadow-xl animate-pulse flex items-center gap-3">
                                        <Play className="w-8 h-8 text-sky-500 fill-current" />
                                        <span className="text-xl font-bold text-sky-600">Tap to Start!</span>
                                    </div>
                                </div>
                            ) : (
                                // Falling Bubble
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 w-32 h-32 bg-white/90 rounded-full shadow-lg border-4 border-pink-300 flex items-center justify-center transition-all duration-75"
                                    style={{ top: `${bubblePosition}%` }}
                                >
                                    <span className="text-3xl font-black text-pink-600">{currentQuestion.mathProblem}</span>
                                </div>
                            )}

                            {/* Ground */}
                            <div className="absolute bottom-0 w-full h-4 bg-green-400 border-t-4 border-green-500"></div>
                        </div>

                        {/* Options */}
                        <div className={`grid grid-cols-3 gap-6 transition-all duration-500 ${gameStarted ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4 pointer-events-none"}`}>
                            {currentQuestion.options?.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    className={`w-24 h-24 rounded-full text-3xl font-bold flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 ${selectedAnswer === option
                                        ? "bg-pink-500 text-white ring-4 ring-pink-200 scale-110 shadow-xl"
                                        : "bg-white border-4 border-pink-100 text-pink-500 hover:border-pink-300 shadow-md"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* TEST 4: Advanced Coin Addition */}
                {currentQuestion.type === "coins" && (
                    <div className="w-full max-w-xl flex flex-col items-center">
                        {/* Visualization */}
                        <div className="flex items-center justify-center gap-6 mb-8 w-full">
                            <div className="p-6 bg-white rounded-2xl shadow-sm border-2 border-gray-100 text-center min-w-[140px]">
                                <span className="block text-gray-400 text-sm font-bold uppercase mb-1">Target</span>
                                <span className="text-6xl font-black text-gray-800">{currentQuestion.target}</span>
                            </div>

                            {/* Wallet Display */}
                            <div className="flex-1 p-6 bg-indigo-50 rounded-2xl shadow-inner border-4 border-indigo-100 min-h-[120px] flex flex-wrap gap-2 items-center content-center justify-center relative">
                                {coinTotal === 0 && <span className="text-indigo-300 font-bold absolute">Drop coins here!</span>}
                                {wallet.map((val, i) => (
                                    <div key={i} className="w-12 h-12 bg-yellow-400 rounded-full border-4 border-yellow-500 flex items-center justify-center text-yellow-900 font-bold shadow-sm animate-pop">
                                        {val}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Current Total Indicator */}
                        <div className={`text-2xl font-bold mb-8 ${coinTotal === (currentQuestion.target || 0) ? "text-green-600 animate-bounce" : coinTotal > (currentQuestion.target || 0) ? "text-red-500" : "text-gray-500"}`}>
                            Total: {coinTotal}
                        </div>

                        {/* Coin Denominations */}
                        <div className="flex gap-4 mb-8">
                            {currentQuestion.denominations?.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleCoinClick(val)}
                                    className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-2 active:scale-95"
                                >
                                    <div className="w-20 h-20 bg-yellow-400 rounded-full border-b-8 border-yellow-600 shadow-lg group-hover:shadow-xl flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-yellow-300 opacity-20 rounded-full transform -translate-y-1/2"></div>
                                        <span className="text-2xl font-black text-yellow-900">${val}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleCoinReset}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-500 font-bold transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
                        >
                            <RefreshCw className="w-5 h-5" /> Reset Coins
                        </button>
                    </div>
                )}

                {/* Navigation (Hidden if answer incomplete or game interaction needed) */}
                <div className="mt-12 h-16">
                    <button
                        onClick={handleNext}
                        disabled={
                            (currentQuestion.type === "coins" && coinTotal !== currentQuestion.target) ||
                            (currentQuestion.type !== "coins" && !selectedAnswer)
                        }
                        className={`px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${(currentQuestion.type === "coins" && coinTotal === currentQuestion.target) || (selectedAnswer)
                            ? "bg-gradient-to-r from-teal-400 to-green-500 text-white hover:scale-105 hover:shadow-xl opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4 pointer-events-none"
                            }`}
                    >
                        {isLastQuestion ? "Finish Math Magic" : "Next Challenge"}
                        {isLastQuestion ? <Check className="w-6 h-6" /> : <ArrowRight className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </AssessmentLayout>
    );
}
