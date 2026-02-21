'use client';

import { useState } from 'react';
import AudioWaveform from './AudioWaveform';

interface MessageBubbleProps {
  message: string;
  sender: 'user' | 'makima';
  timestamp: Date;
  audioUrl?: string;
  isVoice?: boolean;
}

export default function MessageBubble({ message, sender, timestamp, audioUrl, isVoice }: MessageBubbleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isUser = sender === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  return (
    <div className={`flex items-start gap-2 mb-4 px-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <span className="text-lg mt-1">🔗</span>}
      <div
        className={`max-w-[80%] rounded-[20px] px-4 py-3 ${
          isUser
            ? 'bg-[#ff914d] text-white rounded-br-[4px] shadow-lg'
            : 'bg-[#1a1a1a] text-white rounded-bl-[4px]'
        }`}
      >
        {isVoice && audioUrl ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            >
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <AudioWaveform barCount={5} className="flex-1" />
            <span className="text-xs text-white/70">0:05</span>
          </div>
        ) : (
          <p className="text-[16px] leading-relaxed">{message}</p>
        )}
        <div className={`text-[12px] mt-1 ${isUser ? 'text-white/70' : 'text-[#888888]'}`}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}
