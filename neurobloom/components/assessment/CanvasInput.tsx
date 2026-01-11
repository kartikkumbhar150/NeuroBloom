"use client";

import { useRef, useEffect, useState } from "react";
import { Eraser, PenTool } from "lucide-react";

interface CanvasInputProps {
    width?: number;
    height?: number;
    backgroundImage?: string; // URL or data URI for tracing
    onDrawEnd?: (dataUrl: string) => void;
    label?: string;
}

export default function CanvasInput({
    width = 600,
    height = 300,
    backgroundImage,
    onDrawEnd,
    label,
}: CanvasInputProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#4f46e5"; // Indigo-600
                setContext(ctx);

                // Draw background if provided (e.g., dotted letter)
                if (backgroundImage) {
                    // In a real app, we'd load the image and draw it.
                    // For now, we'll just set a CSS background or simple text if it's a letter
                }
            }
        }
    }, [backgroundImage]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (!context) return;
        setIsDrawing(true);
        const { offsetX, offsetY } = getCoordinates(e);
        context.beginPath();
        context.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !context) return;
        const { offsetX, offsetY } = getCoordinates(e);
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing || !context) return;
        context.closePath();
        setIsDrawing(false);
        if (onDrawEnd && canvasRef.current) {
            onDrawEnd(canvasRef.current.toDataURL());
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
        };
    };

    const clearCanvas = () => {
        if (context && canvasRef.current) {
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {label && <p className="text-gray-600 font-medium">{label}</p>}
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm touch-none">
                {/* Placeholder for tracing background (e.g. big letter A) */}
                {backgroundImage && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-9xl font-mono select-none">
                        {backgroundImage}
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair w-full h-full"
                    style={{ width: '100%', maxWidth: width, height: 'auto', aspectRatio: `${width}/${height}` }}
                />
            </div>

            <div className="flex gap-4">
                <button
                    onClick={clearCanvas}
                    className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Eraser className="w-4 h-4" />
                    Clear
                </button>
                <div className="flex items-center gap-2 text-indigo-600 text-sm">
                    <PenTool className="w-4 h-4" />
                    Draw with your finger or mouse
                </div>
            </div>
        </div>
    );
}
