import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, TrendingUp, Award, BookOpen } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface LeaderboardUser {
  id: string;
  displayName: string;
  totalScore: number;
  testsTaken: number;
}

export default function Leaderboard({ user }: { user: User | null }) {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Fetch all users and sort client-side to avoid index requirement
      const q = query(collection(db, 'users'));
      const snap = await getDocs(q);
      const allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardUser));
      
      // Sort descending by totalScore and take top 10
      allUsers.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      setLeaders(allUsers.slice(0, 10));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      handleFirestoreError(error, OperationType.LIST, 'users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">All India Ranking</h2>
        <p className="text-xl text-zinc-500">Compete with aspirants across the country and track your progress.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <h3 className="font-bold text-zinc-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" /> Top Performers
          </h3>
        </div>
        
        <div className="divide-y divide-zinc-50">
          {loading ? (
            <div className="p-12 text-center text-zinc-400">Loading rankings...</div>
          ) : leaders.length > 0 ? (
            leaders.map((leader, idx) => (
              <motion.div 
                key={leader.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 flex items-center justify-between transition-colors ${
                  user?.uid === leader.id ? 'bg-indigo-50/50' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center space-x-6">
                  <div className="flex items-center justify-center w-8 font-bold text-xl">
                    {idx === 0 ? <Medal className="w-8 h-8 text-yellow-500" /> :
                     idx === 1 ? <Medal className="w-8 h-8 text-zinc-400" /> :
                     idx === 2 ? <Medal className="w-8 h-8 text-amber-600" /> :
                     <span className="text-zinc-400">#{idx + 1}</span>}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-zinc-200 text-zinc-700' :
                      idx === 2 ? 'bg-amber-100 text-amber-800' :
                      'bg-indigo-100 text-indigo-600'
                    }`}>
                      {leader.displayName?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg flex items-center">
                        {leader.displayName || 'Anonymous Aspirant'}
                        {user?.uid === leader.id && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">You</span>
                        )}
                      </h4>
                      <p className="text-sm text-zinc-500 flex items-center mt-1">
                        <BookOpen className="w-3 h-3 mr-1" /> {leader.testsTaken || 0} Tests Completed
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600 flex items-center justify-end">
                    {leader.totalScore || 0} <Star className="w-5 h-5 ml-1 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Total Score</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-zinc-400">No rankings available yet. Start taking tests!</div>
          )}
        </div>
      </div>
    </div>
  );
}
