import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Globe, MapPin, MessageSquare, Send, RefreshCw, Calendar } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { getDailyCurrentAffairs } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface CurrentAffairsItem {
  title: string;
  context: string;
  analysis: string;
  locationRelevance: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: any;
}

export default function CurrentAffairs({ user }: { user: User | null }) {
  const [news, setNews] = useState<CurrentAffairsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchComments();
  }, [language]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getDailyCurrentAffairs(language);
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    } catch (error) {
      console.error('Error fetching comments:', error);
      handleFirestoreError(error, OperationType.LIST, 'comments');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setCommenting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        text: newComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      handleFirestoreError(error, OperationType.CREATE, 'comments');
    } finally {
      setCommenting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <Globe className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Daily Current Affairs</h2>
            <p className="text-zinc-500">UPSC level analysis with Maps & Locations in News.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            {['English', 'Hindi'].map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l as any)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  language === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-8 mb-16">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm animate-pulse">
                <div className="h-6 bg-zinc-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-zinc-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          news.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-4">{item.title}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Context</h4>
                  <p className="text-zinc-700 leading-relaxed">{item.context}</p>
                </div>
                
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">UPSC Analysis</h4>
                  <div className="prose prose-indigo max-w-none text-indigo-900">
                    <ReactMarkdown>{item.analysis}</ReactMarkdown>
                  </div>
                </div>

                {item.locationRelevance && item.locationRelevance !== "None" && (
                  <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">Places in News</h4>
                      <p className="text-amber-900 text-sm">{item.locationRelevance}</p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.locationRelevance)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-2 text-sm font-bold text-amber-700 hover:text-amber-800 hover:underline"
                      >
                        View on Google Maps <Globe className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Discussion Forum */}
      <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div className="flex items-center space-x-3 mb-8">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          <h3 className="text-2xl font-bold text-zinc-900">Discussion & Queries</h3>
        </div>

        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or share your thoughts..."
                className="flex-1 p-4 rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={commenting || !newComment.trim()}
                className="px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {commenting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span className="hidden sm:inline">Post</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200 text-center mb-8">
            <p className="text-zinc-600">Please login to participate in the discussion.</p>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
                {comment.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-zinc-50 p-4 rounded-2xl rounded-tl-none border border-zinc-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-zinc-900">{comment.userName}</span>
                  <span className="text-xs text-zinc-400">
                    {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p className="text-zinc-700">{comment.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-zinc-500 py-8">No queries yet. Be the first to start a discussion!</p>
          )}
        </div>
      </div>
    </div>
  );
}
