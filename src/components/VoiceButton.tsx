'use client';

import { useState, useRef, useCallback } from 'react';

interface VoiceButtonProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export default function VoiceButton({ onRecordingComplete, isRecording, setIsRecording }: VoiceButtonProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Mikrofon-Zugriff verweigert. Bitte Berechtigungen prüfen.');
    }
  }, [onRecordingComplete, setIsRecording]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording, setIsRecording]);

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    startRecording();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    stopRecording();
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
        isRecording
          ? 'bg-[#ef4444] pulse'
          : 'bg-transparent hover:bg-[#2a2a2a]'
      }`}
      aria-label="Voice record"
    >
      🎤
    </button>
  );
}
