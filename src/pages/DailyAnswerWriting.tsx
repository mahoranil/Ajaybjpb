import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenTool, 
  Send, 
  ChevronRight, 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const dailyQuestions = [
  {
    id: 'q1',
    date: '2026-03-29',
    subject: 'Polity',
    question: "Discuss the significance of the 73rd and 74th Constitutional Amendment Acts in the context of democratic decentralization in India. What are the major challenges faced by Panchayati Raj Institutions today?",
    wordLimit: 250,
    marks: 15
  },
  {
    id: 'q2',
    date: '2026-03-28',
    subject: 'Economy',
    question: "Explain the concept of 'Inclusive Growth'. How can the digital revolution in India contribute to achieving more inclusive economic outcomes?",
    wordLimit: 150,
    marks: 10
  },
  {
    id: 'q3',
    date: '2026-03-27',
    subject: 'Environment',
    question: "Analyze the impact of climate change on India's monsoon patterns and its subsequent effect on food security. Suggest measures for climate-resilient agriculture.",
    wordLimit: 250,
    marks: 15
  }
];

export default function DailyAnswerWriting({ user, userProfile }: { user: User | null, userProfile: UserProfile | null }) {
  const [selectedQuestion, setSelectedQuestion] = useState(dailyQuestions[0]);
  const [answer, setAnswer] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!answer.trim() && !capturedImage) {
      setError("Please provide an answer (text or photo).");
      return;
    }
    
    if (answer.trim() && answer.split(/\s+/).length < 50 && !capturedImage) {
      setError("Text answer is too short. Please write at least 50 words or upload a photo.");
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is missing.");

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are a senior UPSC evaluator. Evaluate the following answer for the question: "${selectedQuestion.question}"
        
        ${answer ? `Answer Text: "${answer}"` : 'The answer is provided as an image.'}
        
        Provide a detailed evaluation in JSON format with the following structure:
        {
          "score": number (out of ${selectedQuestion.marks}),
          "feedback": {
            "structure": "string",
            "content": "string",
            "language": "string",
            "conclusion": "string"
          },
          "strengths": ["string"],
          "improvements": ["string"],
          "modelPoints": ["string"]
        }
      `;

      const parts: any[] = [{ text: prompt }];
      
      if (capturedImage) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: capturedImage.split(',')[1]
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
      });

      const text = response.text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setEvaluation(JSON.parse(jsonMatch[0]));
      } else {
        throw new Error("Failed to parse evaluation result.");
      }
    } catch (err: any) {
      console.error("Evaluation error:", err);
      setError(err.message || "An error occurred during evaluation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Could not access camera.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        setCapturedImage(canvasRef.current.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-[2.5rem] border border-zinc-200 shadow-sm max-w-lg mx-auto">
          <PenTool className="w-16 h-16 text-zinc-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">Login Required</h2>
          <p className="text-zinc-500 mb-8">Please login to participate in the Daily Answer Writing challenge.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
            <PenTool className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Daily Answer Writing</h2>
            <p className="text-zinc-500">Master the art of mains answer writing with AI feedback.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-zinc-100 shadow-sm">
          <Clock className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-bold text-zinc-600">Next Question in 14h 22m</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Past Questions */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Past Challenges</h3>
          {dailyQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => {
                setSelectedQuestion(q);
                setEvaluation(null);
                setAnswer('');
              }}
              className={`w-full text-left p-6 rounded-3xl border transition-all ${
                selectedQuestion.id === q.id 
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl' 
                  : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                  selectedQuestion.id === q.id ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {q.subject}
                </span>
                <span className="text-[10px] opacity-60 font-medium">{q.date}</span>
              </div>
              <p className="font-bold line-clamp-2 leading-snug">{q.question}</p>
            </button>
          ))}
        </div>

        {/* Main Content: Editor & Evaluation */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!evaluation ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden"
              >
                <div className="p-8 border-b border-zinc-50 bg-zinc-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                      Question of the Day
                    </span>
                    <div className="flex items-center space-x-4 text-xs font-bold text-zinc-400">
                      <span className="flex items-center"><Award className="w-4 h-4 mr-1" /> {selectedQuestion.marks} Marks</span>
                      <span className="flex items-center"><BookOpen className="w-4 h-4 mr-1" /> {selectedQuestion.wordLimit} Words</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 leading-tight">
                    {selectedQuestion.question}
                  </h3>
                </div>

                <div className="p-8">
                  <div className="mb-6 flex flex-wrap gap-4">
                    <button
                      onClick={() => setIsCameraOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                    <label className="flex items-center space-x-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold transition-all cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Upload Image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>

                  {isCameraOpen && (
                    <div className="mb-6 relative bg-black rounded-3xl overflow-hidden aspect-video flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                        <button
                          onClick={capturePhoto}
                          className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-zinc-200"
                        >
                          <div className="w-10 h-10 bg-red-500 rounded-full" />
                        </button>
                        <button
                          onClick={stopCamera}
                          className="w-14 h-14 bg-zinc-800 text-white rounded-full flex items-center justify-center shadow-xl"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  )}

                  {capturedImage && (
                    <div className="mb-6 relative group">
                      <img src={capturedImage} alt="Captured answer" className="w-full rounded-3xl border border-zinc-200 shadow-sm" />
                      <button
                        onClick={() => setCapturedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                        Answer Photo Attached
                      </div>
                    </div>
                  )}

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Or start typing your answer here..."
                    className="w-full h-80 p-6 bg-zinc-50 rounded-3xl border-none focus:ring-2 focus:ring-purple-500 text-zinc-800 leading-relaxed resize-none font-medium text-lg"
                  />
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm font-bold text-zinc-400">
                      Word Count: <span className={answer.split(/\s+/).filter(Boolean).length > selectedQuestion.wordLimit ? 'text-red-500' : 'text-zinc-900'}>
                        {answer.split(/\s+/).filter(Boolean).length}
                      </span> / {selectedQuestion.wordLimit}
                    </div>
                    
                    <button
                      onClick={handleEvaluate}
                      disabled={isEvaluating || !answer.trim()}
                      className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all flex items-center space-x-2 shadow-lg shadow-purple-100 disabled:opacity-50"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Evaluating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Submit for AI Evaluation</span>
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center text-sm font-bold">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {error}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="evaluation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-zinc-900">Evaluation Result</h3>
                    <div className="flex flex-col items-end">
                      <div className="text-4xl font-black text-purple-600">{evaluation.score}/{selectedQuestion.marks}</div>
                      <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Final Score</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-zinc-50 rounded-3xl">
                      <h4 className="font-black text-zinc-900 mb-2 flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> Strengths
                      </h4>
                      <ul className="space-y-2">
                        {evaluation.strengths.map((s: string, i: number) => (
                          <li key={i} className="text-sm text-zinc-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 bg-zinc-50 rounded-3xl">
                      <h4 className="font-black text-zinc-900 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-orange-600" /> Improvements
                      </h4>
                      <ul className="space-y-2">
                        {evaluation.improvements.map((s: string, i: number) => (
                          <li key={i} className="text-sm text-zinc-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-black text-zinc-900 mb-2">Detailed Feedback</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(evaluation.feedback).map(([key, value]: [string, any]) => (
                          <div key={key} className="p-4 border border-zinc-100 rounded-2xl">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">{key}</span>
                            <p className="text-sm text-zinc-600 leading-relaxed">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-black text-zinc-900 mb-2">Model Answer Points</h4>
                      <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100">
                        <ul className="space-y-3">
                          {evaluation.modelPoints.map((p: string, i: number) => (
                            <li key={i} className="text-sm text-purple-900 flex items-start">
                              <Sparkles className="w-4 h-4 mr-2 text-purple-400 shrink-0 mt-0.5" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setEvaluation(null)}
                    className="mt-8 w-full py-4 bg-zinc-900 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all"
                  >
                    Try Another Question
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
