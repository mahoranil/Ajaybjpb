import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { updateProfile, User } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User as UserIcon, Save, Camera, Mail, Heart, Sparkles, Award, Upload } from 'lucide-react';

export default function Profile({ user }: { user: User | null }) {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 1MB for base64 storage in Firestore)
    if (file.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 1MB' });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPhotoURL(base64String);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(user, { displayName, photoURL });
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { displayName, photoURL });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error updating profile: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Please Log In</h2>
          <p className="text-zinc-500">You need to be logged in to view and edit your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-zinc-200 bg-zinc-50">
          <h1 className="text-2xl font-bold text-zinc-900">Edit Profile</h1>
          <p className="text-zinc-500 mt-1">Update your personal information and profile picture.</p>
        </div>

        <div className="p-8">
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center space-x-6">
              <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                {photoURL || user.photoURL ? (
                  <img 
                    src={photoURL || user.photoURL || ''} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-75 transition-opacity"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName || 'User') + '&background=random';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg group-hover:opacity-75 transition-opacity">
                    {displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full shadow-md border-2 border-white flex items-center justify-center text-white">
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-zinc-900">Profile Picture</h3>
                <p className="text-sm text-zinc-500">Click the avatar to upload a new photo (Max 1MB).</p>
                <button
                  type="button"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Display Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address (Cannot be changed)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user.email || ''}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 bg-zinc-50 rounded-xl text-zinc-500 sm:text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Photo URL (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Camera className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="url"
                    value={photoURL.startsWith('data:') ? 'Image uploaded' : photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    disabled={photoURL.startsWith('data:')}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors disabled:bg-zinc-50 disabled:text-zinc-500"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
                {photoURL.startsWith('data:') && (
                  <button 
                    type="button" 
                    onClick={() => setPhotoURL('')}
                    className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear uploaded image
                  </button>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm shadow-indigo-200"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Wish You By Name Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-zinc-200 bg-indigo-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Wish You By Name</h2>
            <p className="text-zinc-500 text-sm">Personalized wishes for your journey / आपकी यात्रा के लिए व्यक्तिगत शुभकामनाएं</p>
          </div>
          <Heart className="w-6 h-6 text-indigo-600" />
        </div>

        <div className="p-8">
          <div className="relative p-8 rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl" />
            
            <div className="relative flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center">
                <Award className="w-8 h-8 text-indigo-600" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-zinc-900">
                  Dearest {user.displayName || 'Aspirant'},
                </h3>
                <p className="text-lg text-zinc-700 font-medium leading-relaxed">
                  "Success is not final, failure is not fatal: it is the courage to continue that counts."
                </p>
                <p className="text-zinc-500 italic">
                  "सफलता अंतिम नहीं है, विफलता घातक नहीं है: यह जारी रखने का साहस है जो मायने रखता है।"
                </p>
              </div>

              <div className="pt-6 border-t border-indigo-100 w-full flex flex-col items-center">
                <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">
                  UPSC AI Prep Team
                </p>
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs">Empowering Your Dreams</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
