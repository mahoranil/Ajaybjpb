import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Star, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function Feedback({ user }: { user: User | null }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        uid: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        rating,
        comment,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'feedback'), feedbackData);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      handleFirestoreError(error, OperationType.CREATE, 'feedback');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] border border-zinc-200 shadow-2xl shadow-indigo-100"
        >
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="w-12 h-12 text-indigo-600 fill-indigo-600" />
          </div>
          <h2 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">Thank You!</h2>
          <p className="text-zinc-500 text-lg mb-8">
            Your feedback helps us build a better UPSC preparation platform for everyone. We truly appreciate your time and support.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-bold mb-6"
        >
          <Sparkles className="w-4 h-4" />
          <span>WE VALUE YOUR VOICE</span>
        </motion.div>
        <h1 className="text-5xl font-black text-zinc-900 mb-6 tracking-tight">
          Help Us Improve
        </h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
          How is your experience with UPSC AI Prep? Share your thoughts, suggestions, or report any issues.
        </p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-200 shadow-xl max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating */}
          <div className="text-center">
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Rate Your Experience</label>
            <div className="flex justify-center space-x-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-2 transition-all transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-zinc-200 fill-zinc-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="mt-4 text-sm font-bold text-zinc-400">
              {rating === 1 && "Terrible"}
              {rating === 2 && "Bad"}
              {rating === 3 && "Average"}
              {rating === 4 && "Good"}
              {rating === 5 && "Amazing!"}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Your Feedback</label>
            <textarea
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you like or what we can improve..."
              className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium text-zinc-700 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Feedback</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-zinc-100 flex items-center justify-center space-x-8 text-zinc-400">
          <div className="flex items-center text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> 100% Anonymous
          </div>
          <div className="flex items-center text-[10px] font-bold uppercase tracking-widest">
            <MessageSquare className="w-4 h-4 mr-2 text-indigo-500" /> Direct to Team
          </div>
        </div>
      </div>
    </div>
  );
}
