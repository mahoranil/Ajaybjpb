import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenTool, 
  Settings, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RefreshCw,
  Award,
  BookOpen
} from 'lucide-react';
import { generateMCQs } from '../services/geminiService';
import { MCQQuestion, MCQTestResult, UserProfile } from '../types';
import { collection, addDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Link } from 'react-router-dom';

export default function MCQGenerator({ user, userProfile }: { user: User | null, userProfile: UserProfile | null }) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);

  const subjects = [
    'History', 'Geography', 'Polity', 'Economy', 
    'Environment', 'Science & Tech', 'Current Affairs'
  ];

  const handleStart = async () => {
    if (!subject || !topic || !user) return;

    // Check premium status and test count
    if (!userProfile?.isPremium && (userProfile?.testsGeneratedCount || 0) >= 10) {
      alert("You have reached the limit of 10 free tests. Please upgrade to Premium to generate more tests.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateMCQs(subject, topic, count, language);
      setQuestions(data);
      setAnswers(new Array(data.length).fill(null));
      setCurrentIdx(0);
      setShowResults(false);

      // Increment test generation count
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        testsGeneratedCount: increment(1)
      });
    } catch (error) {
      console.error('Error generating MCQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setShowResults(true);
    if (user) {
      setSaving(true);
      const score = answers.reduce((acc, ans, idx) => 
        ans === questions[idx].correctAnswer ? acc + 1 : acc, 0
      );
      
      const result: MCQTestResult = {
        uid: user.uid,
        subject,
        topic,
        language,
        questionCount: questions.length,
        score,
        totalQuestions: questions.length,
        questions: questions.map((q, idx) => ({ ...q, userAnswer: answers[idx] ?? undefined })),
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, 'mcq_tests'), result);
        
        // Update user's total score and tests taken
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          totalScore: increment(score),
          testsTaken: increment(1)
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'mcq_tests');
      } finally {
        setSaving(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm max-w-2xl mx-auto">
          <Award className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Login Required</h2>
          <p className="text-zinc-600 mb-8">Please login to access AI-generated MCQ tests and track your progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {!questions.length ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <Settings className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900">Configure Your Test</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Mughal Empire, Fundamental Rights"
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Question Count</label>
                <div className="flex gap-2">
                  {[5, 10, 15, 25].map(n => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={`flex-1 py-2 rounded-lg border transition-all ${
                        count === n 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-600'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
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
            </div>

            <button
              onClick={handleStart}
              disabled={loading || !subject || !topic}
              className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating Questions...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Start AI Test</span>
                </>
              )}
            </button>
          </motion.div>
        ) : showResults ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Award className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-900">Test Completed!</h2>
              <p className="text-zinc-500 mt-2">You scored {answers.reduce((acc, ans, idx) => ans === questions[idx].correctAnswer ? acc + 1 : acc, 0)} out of {questions.length}</p>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50">
                  <p className="font-bold text-zinc-900 mb-4">{idx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          oIdx === q.correctAnswer
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                            : answers[idx] === oIdx
                            ? 'bg-red-50 border-red-200 text-red-800'
                            : 'bg-white border-zinc-200 text-zinc-600'
                        }`}
                      >
                        <span>{opt}</span>
                        {oIdx === q.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                        {answers[idx] === oIdx && oIdx !== q.correctAnswer && <XCircle className="w-5 h-5" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl text-sm text-indigo-800 border border-indigo-100">
                    <span className="font-bold">Explanation:</span> {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setQuestions([])}
              className="w-full mt-10 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
            >
              Take Another Test
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="test"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold text-zinc-600 uppercase tracking-wider">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <div className="flex-1 h-2 bg-zinc-100 mx-4 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300" 
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-zinc-900 mb-8 leading-relaxed">
              {questions[currentIdx].question}
            </h3>

            <div className="space-y-3">
              {questions[currentIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                    answers[currentIdx] === idx
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-white border-zinc-200 text-zinc-700 hover:border-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <span className="font-medium">{opt}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${answers[currentIdx] === idx ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-12">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(currentIdx - 1)}
                className="px-6 py-3 text-zinc-600 font-bold disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={answers[currentIdx] === null}
                onClick={handleNext}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
              >
                {currentIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
