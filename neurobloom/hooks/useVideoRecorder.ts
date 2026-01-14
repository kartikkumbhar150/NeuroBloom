"use client";

import { useRef } from "react";
import { getCameraStream, stopCameraStream } from "@/lib/cameraManager";

export function useVideoRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sessionIdRef = useRef<number | null>(null);

  const setSessionId = (id: number) => {
    sessionIdRef.current = id;
  };

  const startRecording = async () => {
    const stream = await getCameraStream();

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.start();
    console.log("🎥 Recording started");
  };

  const stopAndUpload = async () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      console.warn("⚠️ Recorder not active");
      stopCameraStream();
      return;
    }

    recorder.onstop = async () => {
      console.log("🛑 Recorder stopped, preparing upload");

      stopCameraStream(); // camera off AFTER blob ready

      if (!chunksRef.current.length) {
        console.error("❌ No video chunks");
        return;
      }

      if (!sessionIdRef.current) {
        console.error("❌ sessionId missing");
        return;
      }

      const blob = new Blob(chunksRef.current, { type: "video/webm" });

      const formData = new FormData();
      formData.append("file", blob);

      console.log("🚀 Calling /api/session/upload");

      const res = await fetch("/api/session/upload", {
        method: "POST",
        headers: {
          "x-session-id": sessionIdRef.current.toString(),
        },
        body: formData,
      });

      console.log("✅ Upload response:", await res.json());
    };

    recorder.stop();
  };

  return {
    startRecording,
    stopAndUpload,
    setSessionId,
  };
}
