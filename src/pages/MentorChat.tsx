import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles, 
  Trash2, 
  MessageSquare,
  ChevronRight,
  Brain,
  Lightbulb,
  Target,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { User } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function MentorChat({ user }: { user: User | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing');
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: "AI Mentor is currently unavailable (API Key missing). Please contact support or check your settings.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: `You are an expert UPSC Mentor. Your goal is to guide aspirants through their preparation journey. 
          Be encouraging, strategic, and provide actionable advice. 
          Focus on:
          1. Study planning and time management.
          2. Subject-specific strategies (History, Geography, Polity, etc.).
          3. Answer writing tips for Mains.
          4. Current affairs integration.
          5. Mental well-being and motivation.
          Keep your responses professional, and in a mix of Hindi and English (Hinglish) if appropriate, as many UPSC aspirants prefer that. 
          Use Markdown for formatting (bold, lists, etc.) to make your advice readable.`,
        },
        history: messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.text }]
        }))
      });

      const response = await chat.sendMessage({ message: input });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      if (isVoiceEnabled) {
        speak(aiMessage.text);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Something went wrong while connecting to the AI Mentor. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const speak = async (text: string) => {
    const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) return;

    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      // Clean text for TTS (remove markdown)
      const cleanText = text.replace(/[#*`_~]/g, '').slice(0, 500); // Limit length for TTS

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Female-sounding voice
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))],
          { type: 'audio/wav' }
        );
        const url = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        } else {
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.play();
        }
        audioRef.current!.onended = () => setIsSpeaking(false);
      }
    } catch (err) {
      console.error("TTS error:", err);
      setIsSpeaking(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const suggestions = [
    "How should I start my UPSC prep?",
    "Suggest a 6-month study plan.",
    "How to improve Mains answer writing?",
    "Best resources for Ethics (GS4)?",
    "How to stay motivated during long hours?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-zinc-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900 tracking-tight">AI Mentor</h1>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Online & Ready</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsVoiceEnabled(!isVoiceEnabled);
              if (isSpeaking && audioRef.current) {
                audioRef.current.pause();
                setIsSpeaking(false);
              }
            }}
            className={`p-2 rounded-lg transition-all flex items-center space-x-2 ${
              isVoiceEnabled ? 'bg-indigo-100 text-indigo-600' : 'text-zinc-400 hover:bg-zinc-100'
            }`}
            title={isVoiceEnabled ? "Disable Voice" : "Enable Voice (Female)"}
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
              {isVoiceEnabled ? "Voice On" : "Voice Off"}
            </span>
          </button>
          <button 
            onClick={clearChat}
          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>

    {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-12 space-y-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Welcome, Aspirant!</h2>
              <p className="text-zinc-500 font-medium text-lg">
                I am your AI Mentor, here to help you navigate the complex path of UPSC preparation. What's on your mind today?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Strategy", icon: Target, desc: "Plan your roadmap" },
                { title: "Insights", icon: Brain, desc: "Deep subject analysis" },
                { title: "Tips", icon: Lightbulb, desc: "Quick writing hacks" },
                { title: "Support", icon: MessageSquare, desc: "Always here to help" }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900">{item.title}</h4>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] text-center">Try asking</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.role === 'user' ? 'ml-3 bg-zinc-200 text-zinc-600' : 'mr-3 bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  }`}>
                    {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-zinc-900 text-white rounded-tr-none' 
                      : 'bg-white border border-zinc-100 text-zinc-800 shadow-sm rounded-tl-none'
                  }`}>
                    <div className="space-y-2 [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_strong]:font-black [&_p]:leading-relaxed">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${
                      msg.role === 'user' ? 'text-zinc-400' : 'text-zinc-300'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-white border border-zinc-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-zinc-200 shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask your mentor anything..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-4 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all resize-none min-h-[56px] max-h-32"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
              !input.trim() || isTyping 
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center mt-3 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
          AI Mentor can make mistakes. Always verify with official UPSC sources.
        </p>
      </div>
    </div>
  );
}
