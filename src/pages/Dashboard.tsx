import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MCQTestResult, MainsEvaluationResult } from '../types';
import { 
  LayoutDashboard, 
  Award, 
  PenTool, 
  BookOpen, 
  Calendar, 
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  MapPin,
  MessageSquare,
  Sparkles,
  Heart,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Dashboard({ user }: { user: User | null }) {
  const [mcqTests, setMcqTests] = useState<MCQTestResult[]>([]);
  const [mainsEvals, setMainsEvals] = useState<MainsEvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // UPSC Prelims 2026 Countdown (Assuming June 1, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-06-01T09:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      
      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch all user's MCQ tests and sort client-side to avoid composite index requirement
        const mcqQuery = query(
          collection(db, 'mcq_tests'),
          where('uid', '==', user.uid)
        );
        const mcqSnap = await getDocs(mcqQuery);
        const allMcqTests = mcqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MCQTestResult));
        // Sort descending by createdAt and take top 5
        allMcqTests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMcqTests(allMcqTests.slice(0, 5));

        // Fetch all user's Mains evaluations and sort client-side to avoid composite index requirement
        const mainsQuery = query(
          collection(db, 'mains_evaluations'),
          where('uid', '==', user.uid)
        );
        const mainsSnap = await getDocs(mainsQuery);
        const allMainsEvals = mainsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MainsEvaluationResult));
        // Sort descending by createdAt and take top 5
        allMainsEvals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMainsEvals(allMainsEvals.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        handleFirestoreError(error, OperationType.LIST, 'dashboard_data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Check for new user welcome
    if (user) {
      const welcomeShown = localStorage.getItem(`welcome_shown_${user.uid}`);
      if (!welcomeShown) {
        setShowWelcome(true);
        localStorage.setItem(`welcome_shown_${user.uid}`, 'true');
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm max-w-2xl mx-auto">
          <LayoutDashboard className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Login Required</h2>
          <p className="text-zinc-600 mb-8">Please login to view your personal dashboard and progress.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Tests Taken', value: mcqTests.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg. MCQ Score', value: mcqTests.length ? `${Math.round(mcqTests.reduce((acc, t) => acc + (t.score / t.totalQuestions), 0) / mcqTests.length * 100)}%` : '0%', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Mains Evaluations', value: mainsEvals.length, icon: PenTool, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Study Streak', value: '3 Days', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const quickActions = [
    { name: 'Daily Answer', path: '/daily-answer', icon: PenTool, color: 'bg-purple-600' },
    { name: 'State PSC', path: '/state-psc', icon: MapPin, color: 'bg-orange-600' },
    { name: 'MCQ Generator', path: '/mcq', icon: Zap, color: 'bg-indigo-600' },
    { name: 'Mentor Chat', path: '/mentor-chat', icon: Sparkles, color: 'bg-blue-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden relative"
            >
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setShowWelcome(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Heart className="w-10 h-10 text-indigo-600 fill-indigo-600" />
                </div>
                
                <h2 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">
                  नमस्ते, {user.displayName?.split(' ')[0]}!
                </h2>
                
                <div className="space-y-4 text-zinc-600 font-medium leading-relaxed">
                  <p className="text-lg">
                    UPSC की इस महान यात्रा में आपका स्वागत है। आपकी मेहनत, आपका जुनून और आपका अटूट विश्वास ही आपको सफलता के शिखर तक ले जाएगा।
                  </p>
                  <p>
                    हर दिन एक नया अवसर है अपनी किस्मत खुद लिखने का। हम आपके साथ हैं हर कदम पर, आपकी तैयारी को धार देने के लिए।
                  </p>
                  <p className="text-indigo-600 font-bold italic">
                    "सफलता उन्हीं को मिलती है जिनके सपनों में जान होती है, पंखों से कुछ नहीं होता हौसलों से उड़ान होती है।"
                  </p>
                </div>

                <div className="mt-10 pt-8 border-t border-zinc-100">
                  <p className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-2">Best Wishes from</p>
                  <div className="font-serif text-2xl italic font-bold text-zinc-800">
                    Mr. Navodayabale
                  </div>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">Founder, UPSC AI Prep</p>
                </div>
                
                <button
                  onClick={() => setShowWelcome(false)}
                  className="mt-10 w-full py-4 bg-zinc-900 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
                >
                  Let's Start Preparation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Welcome back, {user.displayName?.split(' ')[0]}!</h2>
          <p className="text-zinc-500 font-medium mt-1 italic">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
        </div>
        
        {/* Countdown Timer */}
        <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-black">{timeLeft.days}</div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Days</div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="text-center">
            <div className="text-2xl font-black">{timeLeft.hours}</div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Hours</div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="text-center">
            <div className="text-2xl font-black">{timeLeft.minutes}</div>
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mins</div>
          </div>
          <div className="ml-4 pl-4 border-l border-zinc-800">
            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">UPSC PRELIMS</div>
            <div className="text-xs font-bold text-zinc-300">June 1, 2026</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all flex items-center space-x-4"
          >
            <div className={`w-12 h-12 ${action.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-100 group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="font-black text-zinc-900 text-sm">{action.name}</span>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-zinc-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent MCQ Tests */}
        <section className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" /> Recent MCQ Tests
            </h3>
            <button className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-zinc-50">
            {loading ? (
              <div className="p-12 text-center text-zinc-400">Loading tests...</div>
            ) : mcqTests.length > 0 ? (
              mcqTests.map((test) => (
                <div key={test.id} className="p-6 hover:bg-zinc-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{test.subject}</h4>
                      <div className="flex items-center space-x-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(test.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> {test.language}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">{test.score}/{test.totalQuestions}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Score</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-400">No tests taken yet.</div>
            )}
          </div>
        </section>

        {/* Recent Mains Evaluations */}
        <section className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-zinc-900 flex items-center">
              <PenTool className="w-5 h-5 mr-2 text-purple-600" /> Recent Mains Evaluations
            </h3>
            <button className="text-sm text-purple-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-zinc-50">
            {loading ? (
              <div className="p-12 text-center text-zinc-400">Loading evaluations...</div>
            ) : mainsEvals.length > 0 ? (
              mainsEvals.map((evalItem) => (
                <div key={evalItem.id} className="p-6 hover:bg-zinc-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 truncate max-w-[200px]">{evalItem.subject}</h4>
                      <div className="flex items-center space-x-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(evalItem.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> {evalItem.language}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{evalItem.marks}/{evalItem.totalMarks}</div>
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Marks</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-zinc-400">No evaluations yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
