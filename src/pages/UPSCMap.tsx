import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, MapPin, Navigation, Info, Target, BookOpen, Maximize2, Minimize2, Search, Loader2 } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const locations = [
  {
    id: 1,
    name: 'Kaziranga National Park',
    category: 'Environment',
    description: 'Famous for the Great Indian one-horned rhinoceros. Located in Assam.',
    relevance: 'Frequently asked in UPSC regarding floods, rhino poaching, and Brahmaputra river. It is a UNESCO World Heritage Site and an Important Bird Area (IBA).',
    keyPoints: ['One-horned Rhino', 'UNESCO World Heritage', 'Brahmaputra River', 'Assam'],
    lat: 26.5775,
    lng: 93.1711,
    zoom: 11
  },
  {
    id: 2,
    name: 'Chilika Lake',
    category: 'Geography',
    description: "Asia's largest brackish water lagoon, located in Odisha.",
    relevance: 'Important for Irrawaddy dolphins and migratory birds. First Indian wetland of international importance under Ramsar Convention. It is a highly productive ecosystem.',
    keyPoints: ['Brackish Water', 'Ramsar Site', 'Irrawaddy Dolphins', 'Odisha'],
    lat: 19.8450,
    lng: 85.4788,
    zoom: 10
  },
  {
    id: 3,
    name: 'Gulf of Mannar',
    category: 'Environment',
    description: 'Large shallow bay forming part of the Laccadive Sea in the Indian Ocean.',
    relevance: 'Known for its rich marine biodiversity including coral reefs and dugongs (sea cows). It is India\'s first Marine Biosphere Reserve.',
    keyPoints: ['Biosphere Reserve', 'Dugong (Sea Cow)', 'Coral Reefs', 'Marine Biodiversity'],
    lat: 9.1272,
    lng: 79.0689,
    zoom: 9
  },
  {
    id: 4,
    name: 'Dholavira',
    category: 'History',
    description: 'An archaeological site at Khadirbet in Bhachau Taluka of Kutch District, Gujarat.',
    relevance: 'One of the five largest Harappan sites. Known for its unique water management system and the "Signboard". UNESCO World Heritage Site.',
    keyPoints: ['Indus Valley Civilization', 'Water Management', 'UNESCO Site', 'Gujarat'],
    lat: 23.8812,
    lng: 70.2132,
    zoom: 14
  },
  {
    id: 5,
    name: 'Kuno National Park',
    category: 'Current Affairs',
    description: 'Located in Madhya Pradesh.',
    relevance: 'Recently in news for the reintroduction of Cheetahs in India from Namibia and South Africa. Part of the Project Cheetah initiative.',
    keyPoints: ['Project Cheetah', 'Madhya Pradesh', 'Reintroduction', 'Wildlife Corridor'],
    lat: 25.6333,
    lng: 77.1667,
    zoom: 11
  },
  {
    id: 6,
    name: 'Andaman and Nicobar Islands',
    category: 'Geography & Security',
    description: 'Strategic location for India in the Bay of Bengal.',
    relevance: 'Ten Degree Channel separates Andaman from Nicobar. Home to Particularly Vulnerable Tribal Groups (PVTGs) like Sentinelese. Strategic for Indo-Pacific security.',
    keyPoints: ['Ten Degree Channel', 'PVTGs', 'Strategic Security', 'Volcanic Islands'],
    lat: 11.7401,
    lng: 92.6586,
    zoom: 7
  },
  {
    id: 7,
    name: 'Siachen Glacier',
    category: 'Security & Geography',
    description: 'Located in the eastern Karakoram range in the Himalayas.',
    relevance: 'Highest battlefield in the world. Strategic point near the Line of Control (LoC) and Actual Ground Position Line (AGPL). Source of the Nubra River.',
    keyPoints: ['Highest Battlefield', 'Operation Meghdoot', 'Karakoram Range', 'Nubra River'],
    lat: 35.4212,
    lng: 77.1095,
    zoom: 10
  },
  {
    id: 8,
    name: 'Western Ghats',
    category: 'Environment',
    description: 'Mountain range that covers an area of 160,000 km2 in a stretch of 1,600 km parallel to the western coast of the Indian peninsula.',
    relevance: 'One of the eight "hottest hot-spots" of biological diversity in the world. UNESCO World Heritage Site. Important for monsoon patterns in India.',
    keyPoints: ['Biodiversity Hotspot', 'UNESCO Site', 'Monsoon Influence', 'Endemic Species'],
    lat: 10.1416,
    lng: 77.0595,
    zoom: 8
  },
  {
    id: 9,
    name: "Majuli Island",
    description: "The world's largest river island located in the Brahmaputra River, Assam. It is a hub of Assamese neo-Vaishnavite culture.",
    lat: 26.9544,
    lng: 94.1306,
    zoom: 11,
    category: "Environment & Culture",
    relevance: "First island district of India. Facing severe erosion. Important for biodiversity and Satra culture.",
    keyPoints: ["Brahmaputra River", "Neo-Vaishnavite Satras", "Mishing Tribe", "Erosion challenges"]
  },
  {
    id: 10,
    name: "Rann of Kutch",
    description: "A large area of salt marshes that span the border between India and Pakistan. It is famous for its white salty desert.",
    lat: 23.8000,
    lng: 70.0000,
    zoom: 9,
    category: "Geography",
    relevance: "Unique ecosystem, home to the Indian Wild Ass. Strategic border area (Sir Creek dispute).",
    keyPoints: ["White Desert", "Indian Wild Ass Sanctuary", "Harappan sites (Dholavira)", "Sir Creek dispute"]
  },
  {
    id: 11,
    name: "Chilika Lake",
    description: "Asia's largest brackish water lagoon, located in Odisha. It is a major wintering ground for migratory birds.",
    lat: 19.6667,
    lng: 85.3333,
    zoom: 10,
    category: "Environment",
    relevance: "First Indian wetland of international importance under the Ramsar Convention. Home to Irrawaddy dolphins.",
    keyPoints: ["Ramsar Site", "Irrawaddy Dolphins", "Nalbana Bird Sanctuary", "Mouth of Daya River"]
  },
  {
    id: 12,
    name: "Loktak Lake",
    description: "The largest freshwater lake in Northeast India, famous for the phumdis (floating mass of vegetation) floating over it.",
    lat: 24.5500,
    lng: 93.8500,
    zoom: 12,
    category: "Environment",
    relevance: "Keibul Lamjao National Park is the only floating national park in the world. Home to the endangered Sangai deer.",
    keyPoints: ["Phumdis", "Keibul Lamjao NP", "Sangai (Dancing Deer)", "Montreux Record site"]
  },
  {
    id: 13,
    name: "Silent Valley",
    description: "A national park in Kerala, known for its unique rainforest ecosystem and the 'Save Silent Valley' movement.",
    lat: 11.1300,
    lng: 76.4300,
    zoom: 12,
    category: "Environment",
    relevance: "One of the last undisturbed tracts of South Western Ghats mountain rain forests. Famous for Lion-tailed Macaque.",
    keyPoints: ["Western Ghats", "Lion-tailed Macaque", "Kunthipuzha River", "Biodiversity Hotspot"]
  },
  {
    id: 14,
    name: "Galwan Valley",
    description: "A valley in the Ladakh region, known for the Galwan River and its strategic location near the Line of Actual Control (LAC).",
    lat: 34.7500,
    lng: 78.1800,
    zoom: 11,
    category: "Strategic Geography",
    relevance: "Site of the 2020 India-China border standoff. Strategically located near the DS-DBO road.",
    keyPoints: ["LAC", "Galwan River", "Aksai Chin border", "Strategic infrastructure"]
  },
  {
    id: 15,
    name: "Pangong Tso",
    description: "An endorheic lake in the Himalayas situated at a height of about 4,350 m. It is 134 km long and extends from India to China.",
    lat: 33.7500,
    lng: 78.6667,
    zoom: 10,
    category: "Strategic Geography",
    relevance: "Strategically important due to its location on the LAC. One-third of the lake is in India, the rest in China.",
    keyPoints: ["Endorheic Lake", "LAC", "Finger area dispute", "High altitude saline lake"]
  },
  {
    id: 16,
    name: "Barren Island",
    description: "An island located in the Andaman Sea, dominated by Barren Volcano, the only confirmed active volcano in South Asia.",
    lat: 12.2783,
    lng: 93.8583,
    zoom: 12,
    category: "Geography",
    relevance: "Only active volcano in India. Part of the volcanic arc between the Indonesian and Myanmar plates.",
    keyPoints: ["Active Volcano", "Andaman Sea", "Tectonic activity", "Uninhabited"]
  },
  {
    id: 17,
    name: "Sundarbans",
    description: "A mangrove area in the delta formed by the confluence of the Ganges, Brahmaputra and Meghna Rivers in the Bay of Bengal.",
    lat: 21.9497,
    lng: 89.1833,
    zoom: 10,
    category: "Environment",
    relevance: "Largest mangrove forest in the world. UNESCO World Heritage Site. Home to the Royal Bengal Tiger.",
    keyPoints: ["Mangrove Ecosystem", "Royal Bengal Tiger", "UNESCO Site", "Deltaic region"]
  },
  {
    id: 18,
    name: "Hampi",
    description: "An ancient village in the south Indian state of Karnataka. It's dotted with numerous ruined temple complexes from the Vijayanagara Empire.",
    lat: 15.3350,
    lng: 76.4600,
    zoom: 14,
    category: "History & Culture",
    relevance: "Capital of the Vijayanagara Empire. UNESCO World Heritage Site. Important for Dravidian architecture study.",
    keyPoints: ["Vijayanagara Empire", "UNESCO Site", "Virupaksha Temple", "Tungabhadra River"]
  },
  {
    id: 19,
    name: "Khajuraho",
    description: "A group of Hindu and Jain temples in Chhatarpur district, Madhya Pradesh. They are famous for their nagara-style architectural symbolism.",
    lat: 24.8500,
    lng: 79.9333,
    zoom: 14,
    category: "History & Culture",
    relevance: "Built by the Chandela dynasty. UNESCO World Heritage Site. Masterpiece of Nagara style architecture.",
    keyPoints: ["Chandela Dynasty", "UNESCO Site", "Nagara Architecture", "Erotic sculptures"]
  }
];

export default function UPSCMap() {
  const [selectedLoc, setSelectedLoc] = useState(locations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSearch, setCustomSearch] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  React.useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullScreen]);

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = customSearch.trim();
    if (!query || isSearching) return;

    // First check if it's already in our list
    const existing = locations.find(l => l.name.toLowerCase() === query.toLowerCase());
    if (existing) {
      setSelectedLoc(existing as any);
      setCustomSearch('');
      return;
    }

    setIsSearching(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide UPSC-specific geographical and strategic context for the location: "${query}". Include its description, relevance to the UPSC syllabus, and 4 key points. Also provide its approximate latitude and longitude.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              relevance: { type: Type.STRING },
              keyPoints: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              category: { type: Type.STRING }
            },
            required: ["description", "relevance", "keyPoints", "lat", "lng", "category"]
          }
        }
      });

      const data = JSON.parse(response.text);
      const newLoc = {
        id: Date.now(),
        name: query,
        category: data.category || 'AI Search Result',
        description: data.description,
        relevance: data.relevance,
        keyPoints: data.keyPoints,
        lat: data.lat,
        lng: data.lng,
        zoom: 12,
        isCustom: true
      };
      setSelectedLoc(newLoc as any);
      setCustomSearch('');
    } catch (error) {
      console.error("Search error:", error);
      // Fallback if AI fails
      const fallbackLoc = {
        id: Date.now(),
        name: query,
        category: 'Search Result',
        description: `Showing results for "${query}".`,
        relevance: 'Custom search result. Please verify its relevance to the UPSC syllabus.',
        keyPoints: ['Custom Search', 'Manual Verification Needed'],
        lat: 0,
        lng: 0,
        zoom: 12,
        isCustom: true
      };
      setSelectedLoc(fallbackLoc as any);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-zinc-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
            <MapIcon className="w-4 h-4" />
            <span>Geospatial Learning</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight leading-none">
            UPSC <span className="text-indigo-600">Interactive</span> Map
          </h1>
          <p className="text-zinc-500 max-w-xl text-lg">
            Master geography, environment, and history through interactive spatial exploration.
          </p>
        </div>
        
        <form onSubmit={handleCustomSearch} className="w-full md:w-96 relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors">
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </div>
          <input 
            type="text" 
            placeholder="Search any location (e.g. Siachen, Hampi)..." 
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            disabled={isSearching}
            className="w-full pl-12 pr-24 py-4 bg-white border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-medium text-zinc-900 shadow-sm transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-2 top-2 bottom-2 bg-zinc-900 text-white px-5 rounded-xl font-bold hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: Location List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Preset Locations</h3>
            <div className="relative mb-6">
              <input 
                type="text" 
                placeholder="Filter by name or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              />
            </div>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredLocations.map((loc) => (
                <motion.button
                  key={loc.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedLoc(loc as any)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-4 ${
                    selectedLoc.id === loc.id
                      ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                      : 'bg-white border-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedLoc.id === loc.id ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-400'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold truncate ${selectedLoc.id === loc.id ? 'text-indigo-900' : 'text-zinc-700'}`}>
                      {loc.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{loc.category}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Map and Context */}
        <div className="lg:col-span-8 space-y-8">
          {/* Map View */}
          <div className={`bg-white overflow-hidden rounded-[2.5rem] border border-zinc-200 shadow-xl shadow-zinc-200/50 transition-all duration-500 ${
            isFullScreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'relative'
          }`}>
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Live Satellite View</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-zinc-500 hidden sm:inline-block">{selectedLoc.name}</span>
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-600 flex items-center space-x-2"
                  title={isFullScreen ? "Minimize" : "Full Screen"}
                >
                  {isFullScreen ? (
                    <>
                      <Minimize2 className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Minimize</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Expand View</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className={`w-full bg-zinc-100 relative transition-all duration-500 ${
              isFullScreen ? 'h-[calc(100vh-80px)]' : 'h-[500px] md:h-[600px]'
            }`}>
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={
                  (selectedLoc as any).isCustom 
                    ? `https://maps.google.com/maps?q=${encodeURIComponent(selectedLoc.name)}&t=k&z=${selectedLoc.zoom}&ie=UTF8&iwloc=&output=embed`
                    : `https://maps.google.com/maps?q=${selectedLoc.lat},${selectedLoc.lng}&t=k&z=${selectedLoc.zoom}&ie=UTF8&iwloc=&output=embed`
                }
              ></iframe>
            </div>
          </div>

          {/* UPSC Relevance Context Section */}
          <motion.div 
            key={selectedLoc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Description & Relevance */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Info className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-zinc-900 mb-4 flex items-center space-x-3">
                    <span className="w-8 h-1 bg-indigo-600 rounded-full" />
                    <span>Context & Description</span>
                  </h3>
                  <p className="text-zinc-600 leading-relaxed text-lg mb-8">
                    {selectedLoc.description}
                  </p>
                  
                  <div className="pt-8 border-t border-zinc-100">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                      <Target className="w-3.5 h-3.5" />
                      <span>UPSC Relevance</span>
                    </div>
                    <p className="text-zinc-800 font-semibold leading-relaxed text-xl">
                      {selectedLoc.relevance}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-[2.5rem] text-white h-full shadow-2xl shadow-indigo-900/20 border border-white/5 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                
                <h3 className="text-xl font-bold mb-8 flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Navigation className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span>Key Points</span>
                </h3>
                
                <ul className="space-y-5">
                  {selectedLoc.keyPoints?.map((point, idx) => (
                    <li key={idx} className="flex items-start space-x-4 group">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
                      <span className="text-zinc-300 text-sm font-medium leading-snug group-hover:text-white transition-colors">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-16 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">
                        Syllabus Area
                      </p>
                      <p className="text-indigo-400 font-bold text-lg">{selectedLoc.category}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <BookOpen className="w-6 h-6 text-zinc-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
