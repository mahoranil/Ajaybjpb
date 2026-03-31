import React from 'react';
import { User } from 'firebase/auth';
import { motion } from 'motion/react';
import { FileText, Lock, ExternalLink, Calculator, Landmark, Scale, Globe, BookOpen } from 'lucide-react';

const pyqFiles = [
  { 
    id: 'csat', 
    title: 'CSAT (Civil Services Aptitude Test)', 
    url: 'https://drive.google.com/file/d/1QlhNYPNRTLJ1K-G43dkOuP_804ZO52HO/view?usp=drivesdk', 
    icon: Calculator, 
    color: 'text-blue-600', 
    bg: 'bg-blue-100' 
  },
  { 
    id: 'history', 
    title: 'History', 
    url: 'https://drive.google.com/file/d/1S6X8QsxtnBuUFxwQi2xyMSZJ4WIo0GFT/view?usp=drivesdk', 
    icon: Landmark, 
    color: 'text-amber-600', 
    bg: 'bg-amber-100' 
  },
  { 
    id: 'ethics', 
    title: 'Ethics, Integrity and Aptitude (GS 4)', 
    url: 'https://drive.google.com/file/d/1tQHr-rTqQONpnoaX9b4vHgXhMv9gK6u0/view?usp=drivesdk', 
    icon: Scale, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-100' 
  },
  { 
    id: 'gs1', 
    title: 'General Studies 1', 
    url: 'https://drive.google.com/file/d/1uT3HnNjFmuR5aoROQT-a1kCRQuv3xYTN/view?usp=drivesdk', 
    icon: Globe, 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-100' 
  },
  { 
    id: 'hindi', 
    title: 'Hindi (Compulsory)', 
    url: 'https://drive.google.com/file/d/1QkAoRufqnFUIrbYDSuFpsqMbHgSbOexH/view?usp=drivesdk', 
    icon: FileText, 
    color: 'text-rose-600', 
    bg: 'bg-rose-100' 
  },
  { 
    id: 'gs_pre', 
    title: 'GS Prelims', 
    url: 'https://drive.google.com/file/d/1j4RgrcXlGPCzzHlVo33F9FkpRaDIFoFH/view?usp=drivesdk', 
    icon: BookOpen, 
    color: 'text-violet-600', 
    bg: 'bg-violet-100' 
  },
];

import { UserProfile } from '../types';
import { Link } from 'react-router-dom';

export default function PYQ({ user, userProfile }: { user: User | null, userProfile: UserProfile | null }) {
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
            <Lock className="w-10 h-10 text-zinc-400" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Authentication Required</h2>
          <p className="text-zinc-500 mb-8">
            Previous Year Questions (PYQs) are premium resources available only to registered aspirants. Please login to access these materials.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!userProfile?.isPremium) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl border border-zinc-200 shadow-sm max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-100">
            <Lock className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Premium Required</h2>
          <p className="text-zinc-500 mb-8">
            Previous Year Questions (PYQs) are premium resources. Please upgrade to a Premium plan to access these official UPSC materials.
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
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Previous Year Questions</h2>
        <p className="text-xl text-zinc-500">Access official UPSC PYQs to understand the exam pattern and test your preparation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pyqFiles.map((file, idx) => (
          <motion.a
            key={file.id}
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex items-start space-x-4"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${file.bg} ${file.color}`}>
              <file.icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors flex items-center">
                {file.title}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">PDF Document • Google Drive</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors shrink-0">
              <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
