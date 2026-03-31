import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  BookOpen, 
  Award, 
  ChevronRight, 
  Search,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

const stateData = [
  {
    id: 'bpsc',
    name: 'Bihar (BPSC)',
    fullName: 'Bihar Public Service Commission',
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
    syllabus: [
      { title: 'General Studies I', topics: ['Modern History of India', 'Indian Culture', 'Current events of national and international importance', 'Statistical analysis, graphs and diagrams'] },
      { title: 'General Studies II', topics: ['Indian Polity', 'Indian Economy', 'Geography of India', 'Role and impact of science and technology in the development of India'] },
      { title: 'Bihar Special', topics: ['History of Bihar', 'Geography of Bihar', 'Economy of Bihar', 'Polity of Bihar'] }
    ],
    pyqs: [
      { id: 'bpsc-69', title: '69th BPSC Prelims', year: 2023 },
      { id: 'bpsc-68', title: '68th BPSC Prelims', year: 2022 },
      { id: 'bpsc-67', title: '67th BPSC Prelims', year: 2021 }
    ]
  },
  {
    id: 'uppcs',
    name: 'Uttar Pradesh (UPPCS)',
    fullName: 'Uttar Pradesh Public Service Commission',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    syllabus: [
      { title: 'General Studies I', topics: ['History of India', 'Indian National Movement', 'Indian and World Geography', 'Indian Polity and Governance'] },
      { title: 'General Studies II (CSAT)', topics: ['Comprehension', 'Interpersonal skills', 'Logical reasoning', 'General mental ability'] },
      { title: 'UP Special (GS V & VI)', topics: ['History, Culture of UP', 'Geography, Economy of UP', 'Polity, Social Issues of UP'] }
    ],
    pyqs: [
      { id: 'uppcs-23', title: 'UPPCS Prelims 2023', year: 2023 },
      { id: 'uppcs-22', title: 'UPPCS Prelims 2022', year: 2022 }
    ]
  },
  {
    id: 'ras',
    name: 'Rajasthan (RAS)',
    fullName: 'Rajasthan Public Service Commission',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    syllabus: [
      { title: 'General Knowledge & General Studies', topics: ['History, Art, Culture, Literature, Tradition & Heritage of Rajasthan', 'Indian History', 'Geography of World and India', 'Geography of Rajasthan'] }
    ],
    pyqs: [
      { id: 'ras-23', title: 'RAS Prelims 2023', year: 2023 },
      { id: 'ras-21', title: 'RAS Prelims 2021', year: 2021 }
    ]
  },
  {
    id: 'mppsc',
    name: 'Madhya Pradesh (MPPSC)',
    fullName: 'Madhya Pradesh Public Service Commission',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    syllabus: [
      { title: 'General Studies', topics: ['History, Culture and Literature of MP', 'History of India', 'Geography of MP', 'Geography of India and World'] }
    ],
    pyqs: [
      { id: 'mppsc-23', title: 'MPPSC Prelims 2023', year: 2023 }
    ]
  }
];

export default function StatePSC() {
  const [selectedState, setSelectedState] = useState(stateData[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStates = stateData.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <MapPin className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">State PSC Hub</h2>
            <p className="text-zinc-500">Dedicated resources for BPSC, UPPCS, RAS, and other State PSCs.</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search State PSC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* State Selection List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 px-2">Select State</h3>
          {filteredStates.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state)}
              className={`w-full text-left p-5 rounded-3xl border transition-all flex items-center justify-between group ${
                selectedState.id === state.id 
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl' 
                  : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${state.color}`} />
                <span className="font-bold">{state.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedState.id === state.id ? 'translate-x-1' : 'group-hover:translate-x-1 opacity-40'}`} />
            </button>
          ))}
        </div>

        {/* State Content Area */}
        <div className="lg:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedState.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* State Header Card */}
              <div className={`p-10 rounded-[3rem] ${selectedState.lightColor} border border-white shadow-sm relative overflow-hidden`}>
                <div className="relative z-10">
                  <h3 className={`text-4xl font-black ${selectedState.textColor} mb-2 tracking-tight`}>
                    {selectedState.fullName}
                  </h3>
                  <p className="text-zinc-600 font-medium text-lg max-w-xl">
                    Comprehensive preparation material, syllabus, and previous year questions specifically for {selectedState.name} aspirants.
                  </p>
                  
                  <div className="mt-8 flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 bg-white/60 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-zinc-700 border border-white">
                      <BookOpen className="w-4 h-4" />
                      <span>Detailed Syllabus</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/60 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-zinc-700 border border-white">
                      <Award className="w-4 h-4" />
                      <span>PYQ Test Series</span>
                    </div>
                  </div>
                </div>
                {/* Abstract Shape */}
                <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full ${selectedState.color} opacity-5 blur-3xl`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Syllabus Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                  <h4 className="text-xl font-black text-zinc-900 mb-6 flex items-center">
                    <BookOpen className="w-5 h-5 mr-3 text-indigo-600" /> Exam Syllabus
                  </h4>
                  <div className="space-y-6">
                    {selectedState.syllabus.map((item, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="font-black text-zinc-800 text-sm uppercase tracking-wider flex items-center">
                          <span className="w-6 h-0.5 bg-indigo-600 mr-2" />
                          {item.title}
                        </div>
                        <ul className="space-y-2 pl-8">
                          {item.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="text-sm text-zinc-500 flex items-start">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-400 shrink-0 mt-0.5" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PYQ Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                  <h4 className="text-xl font-black text-zinc-900 mb-6 flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-indigo-600" /> Previous Year Tests
                  </h4>
                  <div className="space-y-4">
                    {selectedState.pyqs.map((pyq) => (
                      <div key={pyq.id} className="p-6 rounded-3xl border border-zinc-50 bg-zinc-50/50 hover:bg-zinc-50 transition-all flex items-center justify-between group">
                        <div>
                          <h5 className="font-black text-zinc-900">{pyq.title}</h5>
                          <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">{pyq.year}</p>
                        </div>
                        <Link
                          to="/pyq-test"
                          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all"
                        >
                          <Play className="w-5 h-5 fill-current" />
                        </Link>
                      </div>
                    ))}
                    <div className="p-8 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                      <p className="text-sm font-bold text-zinc-400">More tests being added daily...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
