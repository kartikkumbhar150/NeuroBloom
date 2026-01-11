"use client";

import React from "react";
import { User, Mail, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F0F4F8] p-6 flex flex-col items-center justify-center font-sans">
            <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-indigo-600"></div>

                <div className="relative z-10 flex flex-col items-center mt-4">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg mb-4">
                        <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-4xl">
                            🧑‍🚀
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800">Space Explorer</h1>
                    <p className="text-gray-500">Level 2</p>

                    <div className="w-full mt-8 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <User className="text-indigo-500" />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Name</p>
                                <p className="font-semibold text-gray-700">Admin User</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <Mail className="text-indigo-500" />
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Email</p>
                                <p className="font-semibold text-gray-700">admin@neurobloom.com</p>
                            </div>
                        </div>

                        <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                            <span className="flex items-center gap-3 font-semibold text-gray-700">
                                <Settings className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                Settings
                            </span>
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </button>
                    </div>
                </div>
            </div>

            <button onClick={() => router.back()} className="mt-8 text-indigo-500 font-semibold hover:underline">
                ← Back to Dashboard
            </button>
        </div>
    );
}
