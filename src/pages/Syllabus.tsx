import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, FileText, GraduationCap, Landmark } from 'lucide-react';

const syllabusData = {
  UPSC: {
    Prelims: [
      {
        paper: "General Studies Paper I",
        marks: "200 Marks",
        duration: "2 Hours",
        topics: [
          "Current events of national and international importance.",
          "History of India and Indian National Movement.",
          "Indian and World Geography-Physical, Social, Economic Geography of India and the World.",
          "Indian Polity and Governance-Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.",
          "Economic and Social Development-Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.",
          "General issues on Environmental ecology, Bio-diversity and Climate Change - that do not require subject specialization.",
          "General Science."
        ]
      },
      {
        paper: "General Studies Paper II (CSAT)",
        marks: "200 Marks",
        duration: "2 Hours",
        topics: [
          "Comprehension.",
          "Interpersonal skills including communication skills.",
          "Logical reasoning and analytical ability.",
          "Decision making and problem solving.",
          "General mental ability.",
          "Basic numeracy (numbers and their relations, orders of magnitude, etc.) (Class X level), Data interpretation (charts, graphs, tables, data sufficiency etc. — Class X level)."
        ]
      }
    ],
    Mains: [
      {
        paper: "Paper I: Essay",
        marks: "250 Marks",
        topics: ["Candidates may be required to write essays on multiple topics. They will be expected to keep closely to the subject of the essay to arrange their ideas in orderly fashion, and to write concisely."]
      },
      {
        paper: "Paper II: General Studies-I",
        marks: "250 Marks",
        topics: [
          "Indian Heritage and Culture",
          "History and Geography of the World and Society",
          "Salient features of Indian Society, Diversity of India.",
          "Role of women and women's organization, population and associated issues, poverty and developmental issues, urbanization, their problems and their remedies.",
          "Effects of globalization on Indian society.",
          "Social empowerment, communalism, regionalism & secularism.",
          "Salient features of world's physical geography."
        ]
      },
      {
        paper: "Paper III: General Studies-II",
        marks: "250 Marks",
        topics: [
          "Governance, Constitution, Polity, Social Justice and International relations.",
          "Indian Constitution—historical underpinnings, evolution, features, amendments, significant provisions and basic structure.",
          "Functions and responsibilities of the Union and the States.",
          "Separation of powers between various organs dispute redressal mechanisms and institutions.",
          "Parliament and State legislatures—structure, functioning, conduct of business, powers & privileges and issues arising out of these.",
          "Important International institutions, agencies and fora- their structure, mandate."
        ]
      },
      {
        paper: "Paper IV: General Studies-III",
        marks: "250 Marks",
        topics: [
          "Technology, Economic Development, Bio diversity, Environment, Security and Disaster Management",
          "Indian Economy and issues relating to planning, mobilization, of resources, growth, development and employment.",
          "Inclusive growth and issues arising from it.",
          "Major crops-cropping patterns in various parts of the country.",
          "Science and Technology- developments and their applications and effects in everyday life.",
          "Conservation, environmental pollution and degradation, environmental impact assessment.",
          "Disaster and disaster management."
        ]
      },
      {
        paper: "Paper V: General Studies-IV",
        marks: "250 Marks",
        topics: [
          "Ethics, Integrity and Aptitude",
          "Ethics and Human Interface: Essence, determinants and consequences of Ethics in-human actions.",
          "Attitude: content, structure, function; its influence and relation with thought and behaviour.",
          "Aptitude and foundational values for Civil Service.",
          "Emotional intelligence-concepts, and their utilities and application in administration and governance.",
          "Public/Civil service values and Ethics in Public administration.",
          "Probity in Governance."
        ]
      },
      {
        paper: "Paper VI & VII: Optional Subjects",
        marks: "250 Marks Each",
        topics: ["Candidate has to choose one optional subject which has two papers (Paper I and Paper II)."]
      }
    ]
  },
  PSC: {
    Prelims: [
      {
        paper: "General Studies Paper I (State Specific & General)",
        marks: "200 Marks",
        duration: "2 Hours",
        topics: [
          "History of India and Indian National Movement.",
          "Indian and World Geography.",
          "Indian Polity and Governance.",
          "Economic and Social Development.",
          "General issues on Environmental ecology.",
          "General Science.",
          "Specific knowledge of State's History, Geography, Economy, and Culture (e.g., UP, Bihar, MP specific)."
        ]
      },
      {
        paper: "General Studies Paper II (Aptitude)",
        marks: "200 Marks",
        duration: "2 Hours",
        topics: [
          "Comprehension.",
          "Interpersonal skills including communication skills.",
          "Logical reasoning and analytical ability.",
          "Decision making and problem solving.",
          "General mental ability.",
          "Basic numeracy and Data interpretation."
        ]
      }
    ],
    Mains: [
      {
        paper: "General Hindi / Language",
        marks: "150 Marks",
        topics: ["Comprehension, Grammar, Vocabulary, Essay writing in the state's official language."]
      },
      {
        paper: "Essay",
        marks: "150 Marks",
        topics: ["Literature and Culture, Social sphere, Political sphere, Science, Environment and Technology, Economic Sphere, Agriculture, Industry and Trade, National and International Events, Natural Calamities, National Development Programmes and Projects."]
      },
      {
        paper: "General Studies I to IV",
        marks: "200 Marks Each",
        topics: [
          "Similar to UPSC GS I to IV, but with a specific focus on the State's history, geography, polity, and economy in each respective paper."
        ]
      },
      {
        paper: "General Studies V & VI (State Specific - e.g., UPPSC)",
        marks: "200 Marks Each",
        topics: [
          "Detailed history, culture, art, architecture, festival, folk-dance, literature, regional languages, heritage, social customs and tourism of the State.",
          "Political system, governance, public administration, geography, environment, and economy of the State."
        ]
      }
    ]
  }
};

export default function Syllabus() {
  const [exam, setExam] = useState<'UPSC' | 'PSC'>('UPSC');
  const [stage, setStage] = useState<'Prelims' | 'Mains'>('Prelims');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const currentData = syllabusData[exam][stage];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
          Comprehensive <span className="text-indigo-600">Syllabus</span>
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Master the exact requirements of the exam. Explore detailed subject-wise syllabus for UPSC and State PSCs.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
        {/* Exam Toggle */}
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          <button
            onClick={() => { setExam('UPSC'); setExpandedIdx(0); }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              exam === 'UPSC' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Landmark className="w-5 h-5" />
            <span>UPSC (Civil Services)</span>
          </button>
          <button
            onClick={() => { setExam('PSC'); setExpandedIdx(0); }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              exam === 'PSC' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>State PSC</span>
          </button>
        </div>

        {/* Stage Toggle */}
        <div className="flex bg-zinc-100 p-1 rounded-xl">
          <button
            onClick={() => { setStage('Prelims'); setExpandedIdx(0); }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              stage === 'Prelims' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Prelims
          </button>
          <button
            onClick={() => { setStage('Mains'); setExpandedIdx(0); }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              stage === 'Mains' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Mains
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${exam}-${stage}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {currentData.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-zinc-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900">{item.paper}</h3>
                      <div className="flex items-center space-x-3 text-sm text-zinc-500 mt-1">
                        <span className="font-medium text-indigo-600">{item.marks}</span>
                        {item.duration && (
                          <>
                            <span>•</span>
                            <span>{item.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-zinc-400">
                    {expandedIdx === idx ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedIdx === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-zinc-100">
                        <ul className="space-y-3 mt-4">
                          {item.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="flex items-start space-x-3 text-zinc-700">
                              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                              <span className="leading-relaxed">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
