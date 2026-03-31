import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useLocation 
} from 'react-router-dom';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from './types';
import { 
  Menu,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ErrorBoundary from './components/ErrorBoundary';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import MCQGenerator from './pages/MCQGenerator';
import MainsEvaluation from './pages/MainsEvaluation';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import CurrentAffairs from './pages/CurrentAffairs';
import Leaderboard from './pages/Leaderboard';
import PYQ from './pages/PYQ';
import PYQTestSeries from './pages/PYQTestSeries';
import UPSCMap from './pages/UPSCMap';
import Payment from './pages/Payment';
import Feedback from './pages/Feedback';
import Syllabus from './pages/Syllabus';
import Profile from './pages/Profile';
import MentorChat from './pages/MentorChat';
import DailyAnswerWriting from './pages/DailyAnswerWriting';
import History from './pages/History';
import StatePSC from './pages/StatePSC';



export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    }
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user exists in Firestore, if not create profile
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            const newUser: UserProfile & { totalScore: number, testsTaken: number } = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || null,
              photoURL: firebaseUser.photoURL || null,
              role: 'user',
              createdAt: new Date().toISOString(),
              totalScore: 0,
              testsTaken: 0,
              isPremium: false,
              testsGeneratedCount: 0
            };
            await setDoc(userRef, newUser);
            setUserProfile(newUser);
          } else {
            setUserProfile(userSnap.data() as UserProfile);
          }
        } catch (error) {
          console.error("Firestore Error during login (Rules might be missing):", error);
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          // We still set the user so they can at least see they are logged in,
          // even if Firestore rules are blocking data access.
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex h-screen bg-zinc-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-4 shrink-0">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-bold text-lg text-zinc-900">UPSC AI</span>
              <div className="w-10" /> {/* Spacer for centering */}
            </header>

            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home user={user} onLogin={handleLogin} />} />
                <Route path="/mcq" element={<MCQGenerator user={user} userProfile={userProfile} />} />
                <Route path="/mains" element={<MainsEvaluation user={user} userProfile={userProfile} />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/current-affairs" element={<CurrentAffairs user={user} />} />
                <Route path="/leaderboard" element={<Leaderboard user={user} />} />
                <Route path="/pyq" element={<PYQ user={user} userProfile={userProfile} />} />
                <Route path="/pyq-test" element={<PYQTestSeries user={user} userProfile={userProfile} />} />
                <Route path="/map" element={<UPSCMap />} />
                <Route path="/payment" element={<Payment user={user} />} />
                <Route path="/feedback" element={<Feedback user={user} />} />
                <Route path="/syllabus" element={<Syllabus />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/mentor-chat" element={<MentorChat user={user} />} />
                <Route path="/daily-answer" element={<DailyAnswerWriting user={user} userProfile={userProfile} />} />
                <Route path="/history" element={<History user={user} />} />
                <Route path="/state-psc" element={<StatePSC />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              
              <footer className="bg-white border-t border-zinc-200 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                      <BookOpen className="text-white w-4 h-4" />
                    </div>
                    <span className="text-lg font-bold text-zinc-900">UPSC AI Prep</span>
                  </div>
                  <p className="text-zinc-500 text-sm mb-4">
                    © 2026 UPSC AI Prep. Empowering aspirants with AI.
                  </p>
                  <div className="pt-4 border-t border-zinc-100 max-w-xs mx-auto">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                      Build by Navodayabale
                    </p>
                  </div>
                </div>
              </footer>
            </main>
          </div>
          
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </Router>
    </ErrorBoundary>
  );
}
