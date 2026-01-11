"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AssessmentLayout from "@/components/assessment/AssessmentLayout";
import { useAssessment } from "@/components/providers/AssessmentProvider";
import { Check, Upload, Image as ImageIcon, X } from "lucide-react";

export default function DysgraphiaPage() {
    const router = useRouter();
    const { updateModuleData } = useAssessment();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClear = () => {
        setSelectedImage(null);
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleNext = () => {
        if (selectedImage) {
            // Save data (In a real app, you'd upload the file here or send the base64)
            updateModuleData("dysgraphia", "handwriting_sample", {
                image: selectedImage, // Storing base64 for now
                fileName: fileName,
                timestamp: new Date().toISOString(),
            });

            // Move to next module
            router.push("/assessment/apd"); // Changed from Dyslexia (which was previous/not next) to APD? Or just back to Dashboard?
            // Task flow: Dyscalculia -> Dyslexia -> Dysgraphia -> APD -> VPD -> Emotion
            // So next is APD.
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <AssessmentLayout
            title="Writing Wizardry"
            moduleName="Dysgraphia"
            currentStep={1}
            totalSteps={1}
        >
            <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto">
                {/* Instruction Bubble */}
                <div className="bg-purple-50 px-8 py-6 rounded-3xl mb-8 shadow-sm border border-purple-100 animate-pop text-center">
                    <h2 className="text-2xl font-bold text-purple-900 mb-2">
                        Show us your handwriting! 📝
                    </h2>
                    <p className="text-purple-700">
                        Please upload a photo of something you have written.
                        <br />
                        <span className="text-sm opacity-75">(Our magic brain will look at it!)</span>
                    </p>
                </div>

                {/* Upload Area */}
                <div
                    className={`w-full h-80 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all bg-white relative overflow-hidden ${selectedImage
                            ? "border-green-300 shadow-lg"
                            : "border-purple-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer"
                        }`}
                    onClick={!selectedImage ? triggerUpload : undefined}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {selectedImage ? (
                        <>
                            <img
                                src={selectedImage}
                                alt="Handwriting Preview"
                                className="w-full h-full object-contain"
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <span className="bg-black/50 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
                                    {fileName}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center p-6 text-purple-300">
                            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-12 h-12 text-purple-500" />
                            </div>
                            <p className="text-xl font-bold text-purple-400">Tap to Upload Photo</p>
                            <p className="text-sm mt-2">Supports JPG, PNG</p>
                        </div>
                    )}
                </div>

                {/* Next Button */}
                <div className="mt-12">
                    <button
                        onClick={handleNext}
                        disabled={!selectedImage}
                        className={`px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all shadow-lg ${selectedImage
                                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-105 hover:shadow-xl hover:ring-4 hover:ring-purple-200"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Analyze Handwriting
                        <Check className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </AssessmentLayout>
    );
}
