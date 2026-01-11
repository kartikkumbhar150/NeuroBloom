"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the structure of our assessment data
export interface AssessmentData {
    dyscalculia: Record<string, unknown>;
    dyslexia: Record<string, unknown>;
    dysgraphia: Record<string, unknown>;
    apd: Record<string, unknown>;
    vpd: Record<string, unknown>;
    emotion: Record<string, unknown>;
    userDetails: {
        name: string;
        age: string;
        gender: string;
    };
    metadata: {
        startTime: string;
        endTime?: string;
        totalDurationSeconds?: number;
        moduleDurations: Record<string, number>; // Seconds spent per module
    };
}

interface AssessmentContextType {
    data: AssessmentData;
    updateModuleData: (module: keyof AssessmentData, key: string, value: unknown) => void;
    setUserDetails: (details: AssessmentData['userDetails']) => void;
    startModuleTimer: (moduleName: string) => void;
    endModuleTimer: (moduleName: string) => void;
    submitAssessment: () => Promise<void>;
}

const defaultData: AssessmentData = {
    dyscalculia: {},
    dyslexia: {},
    dysgraphia: {},
    apd: {},
    vpd: {},
    emotion: {},
    userDetails: {
        name: "",
        age: "",
        gender: ""
    },
    metadata: {
        startTime: new Date().toISOString(),
        moduleDurations: {},
    }
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AssessmentData>(defaultData);
    const currentModuleStartRef = React.useRef<number | null>(null);
    const dataRef = React.useRef<AssessmentData>(data);

    // Keep dataRef in sync with data
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    // Initialize global start time on mount (or reset)
    useEffect(() => {
        setData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                startTime: new Date().toISOString(),
            }
        }));
    }, []);

    const updateModuleData = React.useCallback((module: keyof AssessmentData | 'metadata', key: string, value: unknown) => {
        if (module === 'metadata') return; // Handled separately if needed

        setData((prev) => ({
            ...prev,
            [module]: {
                ...prev[module as keyof Omit<AssessmentData, 'metadata'>],
                [key]: value,
            },
        }));
    }, []);

    const startModuleTimer = React.useCallback((moduleName: string) => {
        currentModuleStartRef.current = Date.now();
        console.log(`[Timer] Started ${moduleName} at ${new Date().toLocaleTimeString()}`);
    }, []);

    const endModuleTimer = React.useCallback((moduleName: string) => {
        if (currentModuleStartRef.current) {
            const durationMs = Date.now() - currentModuleStartRef.current;
            const durationSec = Math.round(durationMs / 1000);

            setData(prev => ({
                ...prev,
                metadata: {
                    ...prev.metadata,
                    moduleDurations: {
                        ...prev.metadata.moduleDurations,
                        [moduleName]: (prev.metadata.moduleDurations[moduleName] || 0) + durationSec
                    }
                }
            }));
            console.log(`[Timer] Ended ${moduleName}: ${durationSec}s`);
            currentModuleStartRef.current = null;
        }
    }, []);

    const submitAssessment = React.useCallback(async () => {
        const currentData = dataRef.current;
        const endTime = new Date().toISOString();
        const startTime = new Date(currentData.metadata.startTime).getTime();
        const totalDurationCall = Math.round((Date.now() - startTime) / 1000);

        const finalData = {
            ...currentData,
            metadata: {
                ...currentData.metadata,
                endTime,
                totalDurationSeconds: totalDurationCall
            }
        };

        console.log("🚀 Submitting Final Assessment Data:", finalData);

        // Update state so we can display it in ResultsPage
        setData(finalData);

        // TODO: Replace with actual API call to Python backend
        // await fetch('/api/submit', { method: 'POST', body: JSON.stringify(finalData) });

        // Save to local storage for results page dev
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('neurobloom_results', JSON.stringify(finalData));
            } catch (error) {
                console.error("Failed to save results to localStorage:", error);
            }
        }
    }, []); // Empty dependencies!

    const setUserDetails = React.useCallback((details: AssessmentData['userDetails']) => {
        setData(prev => ({
            ...prev,
            userDetails: details
        }));
    }, []);

    const value = React.useMemo(() => ({
        data,
        updateModuleData,
        setUserDetails,
        startModuleTimer,
        endModuleTimer,
        submitAssessment
    }), [data, updateModuleData, setUserDetails, startModuleTimer, endModuleTimer, submitAssessment]);

    return (
        <AssessmentContext.Provider value={value}>
            {children}
        </AssessmentContext.Provider>
    );
}

export function useAssessment() {
    const context = useContext(AssessmentContext);
    if (context === undefined) {
        throw new Error('useAssessment must be used within an AssessmentProvider');
    }
    return context;
}
