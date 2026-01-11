"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, ArrowRight, Volume2, Mic } from "lucide-react";

const questions = [
    {
        id: "sentence_1",
        type: "reading",
        question: "Read this sentence out loud",
        word: "Dogs eat bones. Mike likes bikes. Elsa wants a book. Adam plays basketball.",
        correct: "Dogs eat bones. Mike likes bikes. Elsa wants a book. Adam plays basketball.",
    },
    {
        id: "sentence_2",
        type: "reading",
        question: "Read this sentence out loud",
        word: "The students wear the uniform and goes to the school daily.",
        correct: "The students wear the uniform and goes to the school daily.",
    },
    {
        id: "sentence_3",
        type: "reading",
        question: "Read this sentence out loud",
        word: "Nature gives us fruits, vegetables and grains to eat.",
        correct: "Nature gives us fruits, vegetables and grains to eat.",
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



    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const uploadAudio = async (blob: Blob, sentenceId: string) => {
        // Mock Backend Upload
        const formData = new FormData();
        formData.append('audio', blob, `${sentenceId}_${new Date().getTime()}.webm`);
        formData.append('sentenceId', sentenceId);

        console.log(`Uploading audio for ${sentenceId}...`, blob);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Audio uploaded successfully (MOCK)");
        return true;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                // Automatically upload after stopping
                await uploadAudio(blob, currentQuestion.id);
                handleAnswer("audio_uploaded");

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
                setIsPlaying(false);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsPlaying(true);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure you have granted permission.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    };

    const handleNext = () => {
        if (selectedAnswer) {
            updateModuleData("dyslexia", currentQuestion.id, {
                answer: selectedAnswer,
                correct: true, // Audio recorded implies completion
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

                {/* Reading Question */}
                <div className="flex flex-col items-center mb-12 w-full">
                    <div className="bg-white px-12 py-8 rounded-3xl shadow-lg border-4 border-indigo-50 mb-10 transform rotate-1 max-w-4xl">
                        <div className="text-3xl md:text-4xl font-black text-indigo-600 tracking-wide text-center leading-relaxed">
                            {currentQuestion.word}
                        </div>
                    </div>

                    {!isPlaying ? (
                        <button
                            onClick={startRecording}
                            className="px-10 py-5 rounded-full flex items-center gap-3 border-4 transition-all transform hover:scale-105 bg-white border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 shadow-md"
                        >
                            <Mic className="w-8 h-8" />
                            <span className="text-xl font-bold">Tap & Read</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="px-10 py-5 rounded-full flex items-center gap-3 border-4 transition-all transform hover:scale-105 bg-red-500 border-red-600 text-white shadow-xl animate-pulse"
                        >
                            <Mic className="w-8 h-8 text-white" />
                            <span className="text-xl font-bold">Stop Recording</span>
                        </button>
                    )}

                    {selectedAnswer === "audio_uploaded" && (
                        <div className="mt-4 text-green-600 font-bold flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            Audio Recorded!
                        </div>
                    )}
                </div>

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
