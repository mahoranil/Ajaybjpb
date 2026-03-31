import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  PenTool, 
  LayoutDashboard, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Zap,
  Shield,
  ChevronRight,
  Star,
  Trophy,
  Users,
  Target,
  Sparkles,
  Heart,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';

export default function Home({ user, onLogin }: { user: User | null, onLogin: () => void }) {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.08),transparent_50%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full text-indigo-600 text-sm font-bold mb-4 border border-indigo-100 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>THE NEXT GEN OF UPSC PREP</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl sm:text-8xl font-black text-zinc-900 tracking-tight leading-[0.9] mb-8">
                Master UPSC with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AI Intelligence</span>
              </h1>
              <p className="mt-8 text-xl sm:text-2xl text-zinc-500 leading-relaxed max-w-3xl mx-auto font-medium">
                तैयारी को और अधिक प्रभावी और सुलभ बनाएं। AI-जनरेटेड MCQ और मेन्स इवैल्यूएशन के साथ अपनी सफलता सुनिश्चित करें।
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              {user ? (
                <Link
                  to="/mcq"
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center group"
                >
                  Start Practice <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={onLogin}
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center group"
                >
                  Get Started Free <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              )}
              <Link
                to="/syllabus"
                className="w-full sm:w-auto px-10 py-5 bg-white text-zinc-900 border-2 border-zinc-100 rounded-2xl font-black text-xl hover:bg-zinc-50 transition-all flex items-center justify-center"
              >
                View Syllabus
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { label: 'Active Users', value: '10K+' },
                { label: 'Tests Taken', value: '50K+' },
                { label: 'AI Accuracy', value: '99%' },
                { label: 'Success Rate', value: '85%' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-zinc-900">{stat.value}</div>
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid - Bento Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">Everything You Need to Succeed</h2>
          <p className="text-zinc-500 font-medium">Powerful AI tools designed specifically for UPSC & PCS aspirants.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI MCQ Generator",
              desc: "Customizable tests for every subject in Hindi & English.",
              icon: BookOpen,
              color: "bg-blue-500",
              link: "/mcq",
              tag: "FREE"
            },
            {
              title: "Mains Evaluation",
              desc: "Detailed AI feedback and scoring for your descriptive answers.",
              icon: PenTool,
              color: "bg-indigo-600",
              link: "/mains",
              tag: "PRO"
            },
            {
              title: "PYQ Test Series",
              desc: "Timed practice with last 10 years of UPSC papers.",
              icon: Trophy,
              color: "bg-amber-500",
              link: "/pyq-test",
              tag: "PRO"
            },
            {
              title: "Interactive Maps",
              desc: "Master geography with our interactive mapping tool.",
              icon: Globe,
              color: "bg-emerald-500",
              link: "/map",
              tag: "FREE"
            },
            {
              title: "Current Affairs",
              desc: "Daily updates and analysis for Prelims & Mains.",
              icon: Zap,
              color: "bg-rose-500",
              link: "/current-affairs",
              tag: "FREE"
            },
            {
              title: "Smart Dashboard",
              desc: "Track your progress and analyze performance trends.",
              icon: LayoutDashboard,
              color: "bg-violet-500",
              link: "/dashboard",
              tag: "FREE"
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-8 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all relative overflow-hidden"
            >
              <div className="absolute top-6 right-6 px-3 py-1 bg-zinc-50 rounded-full text-[10px] font-black text-zinc-400 tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                {feature.tag}
              </div>
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 text-white shadow-xl transform group-hover:rotate-6 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 mb-4">{feature.title}</h3>
              <p className="text-zinc-500 mb-8 leading-relaxed font-medium">{feature.desc}</p>
              <Link to={feature.link} className="inline-flex items-center text-indigo-600 font-black text-sm uppercase tracking-wider hover:translate-x-2 transition-transform">
                Explore Now <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mentor Chat Section - NEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 blur-[80px] rounded-full -ml-10 -mb-10" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-bold border border-white/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span>24/7 PERSONALIZED GUIDANCE</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-tight">
                Your Personal <br />
                <span className="text-indigo-200">UPSC AI Mentor</span>
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 font-medium leading-relaxed">
                तैयारी के दौरान आने वाले हर सवाल का जवाब पाएं। रणनीति से लेकर मोटिवेशन तक, आपका मेंटर हमेशा आपके साथ है।
              </p>
              <Link
                to="/mentor-chat"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all shadow-xl group"
              >
                Chat with Mentor <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Study Plan", icon: Target },
                { title: "Mains Tips", icon: PenTool },
                { title: "Motivation", icon: Heart },
                { title: "Strategy", icon: Brain }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced Section */}
      <section className="bg-gradient-to-b from-zinc-900 to-indigo-950 py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl sm:text-6xl font-black mb-8 leading-[0.9] tracking-tight">
                  The Future of <br />
                  <span className="text-indigo-400">UPSC Preparation</span>
                </h2>
                <p className="text-xl text-zinc-400 font-medium max-w-lg">
                  We combine advanced AI models with expert UPSC curriculum to give you an unfair advantage.
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  { title: "Bilingual Intelligence", desc: "Full support for both Hindi and English mediums.", icon: Globe },
                  { title: "Personalized Roadmap", desc: "AI identifies your weak areas and suggests improvements.", icon: Target },
                  { title: "Community Support", desc: "Join thousands of aspirants on their journey to success.", icon: Users }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex space-x-6 group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl mb-1">{item.title}</h4>
                      <p className="text-zinc-400 font-medium">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-indigo-600/20 to-violet-600/20 rounded-[3rem] border border-indigo-500/30 overflow-hidden flex items-center justify-center backdrop-blur-3xl">
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/50">
                    <Zap className="w-12 h-12 text-white fill-white" />
                  </div>
                  <div className="text-7xl font-black text-white mb-4">100%</div>
                  <div className="text-2xl font-black text-indigo-400 uppercase tracking-widest">AI-Powered</div>
                  <p className="text-zinc-400 mt-6 text-lg font-medium">Get instant results and deep insights into your preparation level.</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-500/20 blur-[100px] rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
