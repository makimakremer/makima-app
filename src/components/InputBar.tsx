'use client';

import { useState } from 'react';
import VoiceButton from './VoiceButton';
import RecordingBanner from './RecordingBanner';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  onSendVoice: (audioBlob: Blob) => void;
}

export default function InputBar({ onSendMessage, onSendVoice }: InputBarProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    onSendVoice(audioBlob);
    setRecordingDuration(0);
  };

  // Recording timer
  useState(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#333333] z-50">
      <div className="relative">
        {isRecording && <RecordingBanner duration={recordingDuration} />}
        <div
          className="flex items-center gap-3 p-3"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nachricht an Makima..."
            className="flex-1 bg-[#2a2a2a] text-white rounded-[24px] px-4 py-3 outline-none focus:ring-2 focus:ring-[#ff914d] transition-all placeholder:text-[#888888]"
            disabled={isRecording}
          />
          <VoiceButton
            onRecordingComplete={handleRecordingComplete}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
          />
          {message.trim() && !isRecording && (
            <button
              onClick={handleSend}
              className="w-12 h-12 rounded-full bg-[#ff914d] flex items-center justify-center text-white text-xl hover:bg-[#ff8040] transition-all"
              aria-label="Send message"
            >
              ↑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
