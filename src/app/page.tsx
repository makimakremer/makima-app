'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ChatView from '@/components/ChatView';
import InputBar from '@/components/InputBar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'makima';
  timestamp: Date;
  audioUrl?: string;
  isVoice?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      // Add Makima response
      const makimaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'makima',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, makimaMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendVoice = async (audioBlob: Blob) => {
    // Add user voice message
    const audioUrl = URL.createObjectURL(audioBlob);
    const userMessage: Message = {
      id: Date.now().toString(),
      text: 'Sprachnachricht',
      sender: 'user',
      timestamp: new Date(),
      audioUrl,
      isVoice: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/voice', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Add Makima response
      const makimaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'makima',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, makimaMessage]);
    } catch (error) {
      console.error('Error sending voice:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="h-screen flex flex-col bg-[#0a0a0a]">
      <Header />
      <ChatView messages={messages} isTyping={isTyping} />
      <InputBar onSendMessage={handleSendMessage} onSendVoice={handleSendVoice} />
    </main>
  );
}
