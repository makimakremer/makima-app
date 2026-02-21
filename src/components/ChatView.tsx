'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'makima';
  timestamp: Date;
  audioUrl?: string;
  isVoice?: boolean;
}

interface ChatViewProps {
  messages: Message[];
  isTyping: boolean;
}

export default function ChatView({ messages, isTyping }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto pt-[60px] pb-[120px]"
      style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom))' }}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full px-4">
          <div className="text-8xl mb-4 float">🔗</div>
          <p className="text-[#888888] text-center">Sag etwas zu Makima</p>
        </div>
      ) : (
        <div className="py-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.text}
              sender={msg.sender}
              timestamp={msg.timestamp}
              audioUrl={msg.audioUrl}
              isVoice={msg.isVoice}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      )}
    </div>
  );
}
