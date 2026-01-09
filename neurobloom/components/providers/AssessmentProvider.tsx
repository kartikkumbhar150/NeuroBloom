"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of our assessment data
export interface AssessmentData {
    dyscalculia: Record<string, any>;
    dyslexia: Record<string, any>;
    dysgraphia: Record<string, any>;
    apd: Record<string, any>;
    vpd: Record<string, any>;
    emotion: Record<string, any>;
}

interface AssessmentContextType {
    data: AssessmentData;
    updateModuleData: (module: keyof AssessmentData, key: string, value: any) => void;
    submitAssessment: () => Promise<void>;
}

const defaultData: AssessmentData = {
    dyscalculia: {},
    dyslexia: {},
    dysgraphia: {},
    apd: {},
    vpd: {},
    emotion: {},
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<AssessmentData>(defaultData);

    const updateModuleData = (module: keyof AssessmentData, key: string, value: any) => {
        setData((prev) => ({
            ...prev,
            [module]: {
                ...prev[module],
                [key]: value,
            },
        }));
    };

    const submitAssessment = async () => {
        console.log("Submitting Assessment Data:", data);
        // TODO: Replace with actual API call to Python backend
        // await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
        alert("Assessment Completed! Data logged to console.");
    };

    return (
        <AssessmentContext.Provider value={{ data, updateModuleData, submitAssessment }}>
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
