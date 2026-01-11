import { ReactNode, useEffect } from 'react';
import { ArrowLeft, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '@/components/providers/AssessmentProvider';

interface AssessmentLayoutProps {
    children: ReactNode;
    title: string;
    currentStep: number;
    totalSteps: number;
    moduleName: string;
}

export default function AssessmentLayout({
    children,
    title,
    currentStep,
    totalSteps,
    moduleName
}: AssessmentLayoutProps) {
    const router = useRouter();
    const { startModuleTimer, endModuleTimer } = useAssessment();
    const progress = (currentStep / totalSteps) * 100;

    // Track time for this module
    useEffect(() => {
        // Normalize module name to key format (e.g. "Dyscalculia" -> "dyscalculia")
        const key = moduleName.toLowerCase().split(' ')[0]; // Simple normalization
        startModuleTimer(key);

        return () => {
            endModuleTimer(key);
        };
    }, [moduleName, startModuleTimer, endModuleTimer]);

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans relative overflow-hidden">
            {/* Playful Background Patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "1s" }}></div>
                <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>
            </div>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-indigo-50 sticky top-0 z-20 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-400 hover:text-indigo-600 transition-all transform hover:scale-105"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-indigo-900 tracking-wide">{moduleName}</span>
                        </div>

                        <div className="w-10"></div> {/* Spacer */}
                    </div>

                    {/* Fun Progress Bar */}
                    <div className="relative pt-2">
                        <div className="flex mb-2 items-center justify-between text-xs font-bold text-indigo-300 uppercase tracking-wider">
                            <span>Start</span>
                            <span className="text-indigo-600">{Math.round(progress)}% Complete</span>
                            <span>Finish</span>
                        </div>
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-indigo-100 shadow-inner border border-indigo-50">
                            <div
                                style={{ width: `${progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 transition-all duration-700 ease-out relative"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 relative z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-indigo-100/50 border border-white p-8 md:p-12 min-h-[60vh] relative overflow-hidden transition-all duration-500">
                    {/* Content Decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-60 pointer-events-none"></div>

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-10 text-center drop-shadow-sm">
                            {title}
                        </h1>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
