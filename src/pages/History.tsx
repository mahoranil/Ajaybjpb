import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { MCQTestResult, MainsEvaluationResult } from '../types';
import { motion } from 'motion/react';
import { Clock, BookOpen, CheckCircle, FileText, ChevronRight, History as HistoryIcon } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryProps {
  user: User | null;
}

type ActivityItem = 
  | { type: 'mcq'; data: MCQTestResult }
  | { type: 'mains'; data: MainsEvaluationResult };

export default function History({ user }: HistoryProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const mcqQuery = query(
          collection(db, 'mcq_results'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const mainsQuery = query(
          collection(db, 'mains_evaluations'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const [mcqSnap, mainsSnap] = await Promise.all([
          getDocs(mcqQuery),
          getDocs(mainsQuery)
        ]);

        const mcqItems: ActivityItem[] = mcqSnap.docs.map(doc => ({
          type: 'mcq',
          data: { id: doc.id, ...doc.data() } as MCQTestResult
        }));

        const mainsItems: ActivityItem[] = mainsSnap.docs.map(doc => ({
          type: 'mains',
          data: { id: doc.id, ...doc.data() } as MainsEvaluationResult
        }));

        const combined = [...mcqItems, ...mainsItems].sort((a, b) => 
          new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime()
        );

        setActivities(combined);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <HistoryIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Please Log In / कृपया लॉगिन करें</h2>
          <p className="text-zinc-500">You need to be logged in to view your history. / अपना इतिहास देखने के लिए आपको लॉगिन करना होगा।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Activity History</h1>
          <h2 className="text-xl text-zinc-500 font-medium">गतिविधि इतिहास</h2>
        </div>
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
          <HistoryIcon className="w-6 h-6" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {activities.map((item, index) => (
            <motion.div
              key={item.data.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    item.type === 'mcq' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.type === 'mcq' ? <CheckCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {item.type === 'mcq' ? 'MCQ Test / एमसीक्यू टेस्ट' : 'Mains Evaluation / मुख्य परीक्षा मूल्यांकन'}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-xs text-zinc-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(item.data.createdAt), 'MMM dd, yyyy • hh:mm a')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 mt-1">
                      {item.data.subject}
                    </h3>
                    <p className="text-sm text-zinc-600 line-clamp-1">
                      {item.type === 'mcq' 
                        ? `Scored ${item.data.score}/${item.data.totalQuestions} in ${item.data.language}`
                        : `Evaluated: ${item.data.marks}/${item.data.totalMarks} marks in ${item.data.language}`
                      }
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 italic">
                      {item.type === 'mcq' 
                        ? `${item.data.language === 'Hindi' ? 'स्कोर' : 'Scored'}: ${item.data.score}/${item.data.totalQuestions}`
                        : `${item.data.language === 'Hindi' ? 'मूल्यांकन' : 'Evaluated'}: ${item.data.marks}/${item.data.totalMarks}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-zinc-400 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
          <HistoryIcon className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900">No history found / कोई इतिहास नहीं मिला</h3>
          <p className="text-zinc-500">Start practicing to see your activities here. / अपनी गतिविधियों को यहां देखने के लिए अभ्यास शुरू करें।</p>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f4f4f5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa;
        }
      `}</style>
    </div>
  );
}
