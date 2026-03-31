import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, LayoutDashboard, PenTool, LogOut, LogIn, 
  X, MessageSquare, Globe, Trophy, FileText, Map, Clock, CreditCard, Heart, Sparkles, MapPin, History as HistoryIcon
} from 'lucide-react';
import { User } from 'firebase/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, onClose, user, onLogin, onLogout }: SidebarProps) {
  const location = useLocation();

  const coreLinks = [
    { name: 'Home', path: '/', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: HistoryIcon },
    { name: 'Ranking', path: '/leaderboard', icon: Trophy },
  ];

  const practiceLinks = [
    { name: 'MCQ Test', path: '/mcq', icon: PenTool },
    { name: 'Mains Eval', path: '/mains', icon: MessageSquare },
    { name: 'Daily Answer', path: '/daily-answer', icon: PenTool },
    { name: 'Mentor Chat', path: '/mentor-chat', icon: Sparkles },
    { name: 'PYQ PDFs', path: '/pyq', icon: BookOpen },
    { name: 'PYQ Tests', path: '/pyq-test', icon: Clock },
  ];

  const resourceLinks = [
    { name: 'Syllabus', path: '/syllabus', icon: FileText },
    { name: 'Daily News', path: '/current-affairs', icon: Globe },
    { name: 'UPSC Map', path: '/map', icon: Map },
    { name: 'State PSC', path: '/state-psc', icon: MapPin },
  ];

  const supportLinks = [
    { name: 'Premium', path: '/payment', icon: CreditCard },
    { name: 'Feedback', path: '/feedback', icon: Heart },
  ];

  const renderLinks = (links: any[], title: string) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === link.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-indigo-600'
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-zinc-200 w-64 shadow-2xl md:shadow-none">
      <div className="p-6 flex items-center justify-between">
        <Link to="/" onClick={onClose} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-zinc-900 tracking-tight">UPSC AI</span>
        </Link>
        <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-zinc-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        {renderLinks(coreLinks, 'Core')}
        {renderLinks(practiceLinks, 'Practice')}
        {renderLinks(resourceLinks, 'Resources')}
        {renderLinks(supportLinks, 'Support')}
      </div>

      <div className="p-4 border-t border-zinc-200">
        {user ? (
          <div className="space-y-2">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-zinc-200" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-zinc-500 truncate">View Profile</p>
              </div>
            </Link>
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => { onLogin(); onClose(); }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <LogIn className="w-5 h-5" />
            <span>Log In / Sign Up</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>
    </>
  );
}
