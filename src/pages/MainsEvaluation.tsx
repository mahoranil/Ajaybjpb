import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenTool, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Award,
  BookOpen,
  Camera,
  Upload,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { evaluateMainsAnswer } from '../services/geminiService';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MainsEvaluationResult, UserProfile } from '../types';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function MainsEvaluation({ user, userProfile }: { user: User | null, userProfile: UserProfile | null }) {
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [totalMarks, setTotalMarks] = useState(10);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MainsEvaluationResult | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subjects = [
    'GS Paper I', 'GS Paper II', 'GS Paper III', 'GS Paper IV', 
    'Essay', 'Optional Subject'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("File size must be less than 1MB.");
      return;
    }
    
    setError(null);
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEvaluate = async () => {
    if (!subject || !question || (!answer && !imageFile)) {
      setError("Please provide either text answer or upload an image.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let imageData;
      if (imageFile) {
        const base64Data = imagePreview?.split(',')[1];
        if (base64Data) {
          imageData = {
            data: base64Data,
            mimeType: imageFile.type
          };
        }
      }

      const evaluation = await evaluateMainsAnswer(subject, question, answer, totalMarks, language, imageData);
      
      const evalResult: MainsEvaluationResult = {
        uid: user?.uid || '',
        subject,
        question,
        answer,
        language,
        marks: evaluation.marks,
        totalMarks,
        feedback: evaluation.feedback,
        createdAt: new Date().toISOString()
      };

      if (user) {
        try {
          await addDoc(collection(db, 'mains_evaluations'), evalResult);
          
          // Update user's total score and tests taken
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, {
            totalScore: increment(evaluation.marks),
            testsTaken: increment(1)
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'mains_evaluations');
        }
      }
      
      setResult(evalResult);
    } catch (error) {
      console.error('Error evaluating answer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm max-w-2xl mx-auto">
          <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Login Required</h2>
          <p className="text-zinc-600 mb-8">Please login to submit your Mains answers for AI evaluation.</p>
        </div>
      </div>
    );
  }

  if (!userProfile?.isPremium) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm max-w-2xl mx-auto"
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100">
            <Lock className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Premium Required</h2>
          <p className="text-zinc-600 mb-8">
            Mains Answer Evaluation is a premium feature. Please upgrade to a Premium plan to get detailed AI-powered feedback on your descriptive answers.
          </p>
          <Link
            to="/payment"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Upgrade to Premium
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
          <PenTool className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Mains Answer Evaluation</h2>
          <p className="text-zinc-500">Get instant AI-powered feedback on your descriptive answers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Subject / Paper</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Paper</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Total Marks</label>
                <select
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {[10, 15, 20, 25].map(m => <option key={m} value={m}>{m} Marks</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Language</label>
              <div className="flex gap-2">
                {['English', 'Hindi'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l as any)}
                    className={`flex-1 py-2 rounded-lg border transition-all ${
                      language === l 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-600'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Paste the question here..."
                className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 flex justify-between items-center">
                <span>Your Answer</span>
                <span className="text-xs text-zinc-500 font-normal">Max 1MB</span>
              </label>
              
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 p-2">
                  <img src={imagePreview} alt="Answer preview" className="w-full h-auto max-h-[300px] object-contain rounded-lg" />
                  <button 
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-zinc-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type or paste your answer here..."
                    className="w-full p-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[200px]"
                  />
                  <div className="flex gap-3">
                    <label className="flex-1 flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-zinc-600">
                      <Camera className="w-5 h-5" />
                      <span className="font-medium text-sm">Take Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                    <label className="flex-1 flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-zinc-600">
                      <Upload className="w-5 h-5" />
                      <span className="font-medium text-sm">Upload File</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleEvaluate}
              disabled={loading || !subject || !question || (!answer && !imageFile)}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit for Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Evaluation Result */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm h-full"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-zinc-900">Evaluation Report</h3>
                  <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-bold">
                    {result.marks} / {result.totalMarks} Marks
                  </div>
                </div>

                <div className="space-y-8">
                  <section>
                    <h4 className="flex items-center text-indigo-600 font-bold mb-3">
                      <CheckCircle2 className="w-5 h-5 mr-2" /> Feedback & Analysis
                    </h4>
                    <div className="prose prose-zinc max-w-none bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      <ReactMarkdown>{result.feedback}</ReactMarkdown>
                    </div>
                  </section>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      This evaluation is AI-generated based on standard UPSC/PCS marking schemes. Use it as a guide to improve your structure, content, and presentation.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="w-full mt-10 py-3 border border-zinc-200 text-zinc-600 rounded-xl font-bold hover:bg-zinc-50 transition-all"
                >
                  Evaluate Another Answer
                </button>
              </motion.div>
            ) : (
              <div className="bg-zinc-100 border-2 border-dashed border-zinc-200 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center text-zinc-400">
                <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Your evaluation report will appear here.</p>
                <p className="text-sm">Submit your answer to get instant feedback.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
