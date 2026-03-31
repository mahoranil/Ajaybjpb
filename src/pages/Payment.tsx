import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CreditCard, Shield, Zap, Star, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const plans = [
  {
    id: 'monthly',
    name: 'Aspirant Pro',
    price: 499,
    duration: 'month',
    features: [
      'Unlimited AI MCQ Generation',
      'Daily Current Affairs Analysis',
      'Mains Answer Evaluation (5/day)',
      'Access to Last 10 Year PYQs',
      'Interactive Map Access'
    ],
    color: 'indigo'
  },
  {
    id: 'yearly',
    name: 'UPSC Conqueror',
    price: 3999,
    duration: 'year',
    features: [
      'Everything in Aspirant Pro',
      'Unlimited Mains Evaluation',
      'Priority AI Processing',
      'Personalized Study Roadmap',
      'Ad-free Experience'
    ],
    featured: true,
    color: 'amber'
  }
];

export default function Payment({ user }: { user: User | null }) {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [promoCode, setPromoCode] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'jnv100') {
      setIsApplied(true);
      setDiscount(100);
    } else {
      alert('Invalid Promo Code');
    }
  };

  const finalPrice = Math.max(0, selectedPlan.price - (selectedPlan.price * discount) / 100);

  const handlePayment = async () => {
    if (!user) {
      alert('Please login to complete your purchase.');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user's premium status in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isPremium: true
      });
      
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert('There was an error processing your payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[2.5rem] border border-zinc-200 shadow-2xl shadow-indigo-100"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-4xl font-black text-zinc-900 mb-4">Welcome to Premium!</h2>
          <p className="text-zinc-500 text-lg mb-8">
            Your subscription is now active. You have unlocked all the premium features to boost your UPSC preparation.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-4 py-12 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-indigo-100 rounded-full text-indigo-600 text-sm font-bold mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>PREMIUM ACCESS</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tight">
            Elevate Your <span className="text-indigo-600">Preparation</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
            Join thousands of successful aspirants who use our AI-powered tools to clear the UPSC Civil Services Exam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Plans */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedPlan(plan)}
                className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 ${
                  selectedPlan.id === plan.id
                    ? 'border-indigo-600 bg-white shadow-[0_20px_50px_rgba(79,70,229,0.15)]'
                    : 'border-white bg-white/60 backdrop-blur-sm hover:border-indigo-200 shadow-sm'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900">{plan.name}</h3>
                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mt-1">
                      {plan.id === 'monthly' ? 'Flexible' : 'Best Value'}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                    plan.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {plan.id === 'monthly' ? <Zap className="w-7 h-7" /> : <Star className="w-7 h-7" />}
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-black text-zinc-900">₹{plan.price}</span>
                    <span className="text-zinc-400 font-bold ml-2">/{plan.duration}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm text-zinc-600 font-semibold">
                      <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center shrink-0 border border-green-100">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className={`w-full py-4 rounded-2xl text-center font-black transition-all duration-300 ${
                  selectedPlan.id === plan.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}>
                  {selectedPlan.id === plan.id ? 'Current Selection' : 'Choose This Plan'}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-2xl shadow-zinc-200/50 sticky top-8">
              <h3 className="text-xl font-black text-zinc-900 mb-8 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-indigo-600" />
                Secure Checkout
              </h3>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-zinc-500 font-bold text-sm uppercase tracking-wider">
                  <span>Plan</span>
                  <span>Price</span>
                </div>
                <div className="flex justify-between text-zinc-900 font-black text-lg">
                  <span>{selectedPlan.name}</span>
                  <span>₹{selectedPlan.price}</span>
                </div>
                {isApplied && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between text-green-600 font-black bg-green-50 p-4 rounded-2xl border border-green-100"
                  >
                    <span className="flex items-center"><Gift className="w-5 h-5 mr-2" /> Promo (jnv100)</span>
                    <span>-₹{selectedPlan.price}</span>
                  </motion.div>
                )}
                <div className="pt-6 border-t-2 border-dashed border-zinc-100 flex justify-between items-center">
                  <span className="text-xl font-black text-zinc-900">Total Due</span>
                  <span className="text-3xl font-black text-indigo-600">₹{finalPrice}</span>
                </div>
              </div>

              <div className="mb-10">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Have a Promo Code?</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-zinc-900 placeholder:text-zinc-300 transition-all"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-6 py-4 bg-zinc-900 text-white rounded-2xl font-black hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center space-x-3 disabled:opacity-50 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Unlock Now</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              <div className="mt-8 flex items-center justify-center space-x-6">
                <div className="flex items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <Shield className="w-3.5 h-3.5 mr-1.5 text-green-500" /> SSL Secure
                </div>
                <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                <div className="flex items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <Star className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> 4.9/5 Trust
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
