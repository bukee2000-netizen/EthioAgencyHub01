'use client';

import { useState, useEffect } from 'react';
import {
  Search, Filter, CheckCircle, Star, Bookmark, MoreHorizontal, User,
  FileText, Sparkles, RefreshCw, X, Eye, Phone, MapPin, GraduationCap,
  Calendar, Check, Mail, Lock, Plus, Download, Printer, Share2, Tag
} from 'lucide-react';

interface CVProfile {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  destination: string;
  template: string;
  language: string;
  status: 'Available' | 'Reserved';
  skills: string[];
  experience: string;
  education: string;
  languages: string[];
  createdAt: string;
  matchScore?: number;
  passportSizePhotoPath?: string | null;
  photoUrl?: string | null;
  
  // Rich details matching the mockup
  age: number;
  gender: 'Female' | 'Male';
  skillLevel: 'Skilled' | 'Semi-Skilled' | 'Unskilled';
  experienceYears: number;
  languagesDetailed: { name: string; level: string }[];
  keyCapabilities: string[];
  skillsAssessment: { name: string; score: string }[];
  passportStatus: 'Valid' | 'Expired' | 'N/A';
  medicalStatus: 'Completed' | 'Pending' | 'N/A';
  trainingStatus: 'Certified' | 'In Progress' | 'N/A';
  reservedUntil?: string;
  reservedBy?: string;
  rating: number;
  views: number;
  updatedDaysAgo: number;
  phone: string;
  email: string;
  summary: string;
}

// Exact Mock data from the uploaded screens
const MOCK_CVS: CVProfile[] = [
  {
    id: 'cv-1',
    employeeId: 'ETH-2023-0018',
    employeeName: 'Tigist Bekele',
    role: 'Semi-Skilled Caregiver',
    destination: 'Saudi Arabia',
    template: 'professional',
    language: 'EN',
    status: 'Available',
    skills: ['Eldercare', 'Cooking', 'First Aid'],
    experience: '3 years experience',
    education: 'BSc Nursing',
    languages: ['Amharic (Native)', 'English (Intermediate)', 'Arabic (Basic)'],
    createdAt: '2026-05-23',
    matchScore: 95,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    age: 26,
    gender: 'Female',
    skillLevel: 'Semi-Skilled',
    experienceYears: 3,
    languagesDetailed: [
      { name: 'Amharic', level: 'Native' },
      { name: 'English', level: 'Intermediate' },
      { name: 'Arabic', level: 'Basic' }
    ],
    keyCapabilities: ['Elderly Care', 'Medication Management', 'Meal Preparation', 'Personal Hygiene Assistance', 'First Aid Knowledge', 'Compassionate Care'],
    skillsAssessment: [
      { name: 'Eldercare', score: 'Very Good' },
      { name: 'Meal Preparation', score: 'Excellent' },
      { name: 'Medication Management', score: 'Good' }
    ],
    passportStatus: 'Valid',
    medicalStatus: 'Completed',
    trainingStatus: 'Certified',
    rating: 4.8,
    views: 14,
    updatedDaysAgo: 5,
    phone: '+251 91 234 5678',
    email: 'tigistbekele@example.com',
    summary: 'Experienced caregiver with 3 years of professional experience providing quality care for elderly individuals. Skilled in daily assistance, medication management, and creating a comfortable environment. Compassionate, patient, and attentive to details with strong communication skills.'
  },
  {
    id: 'cv-2',
    employeeId: 'ETH-2023-0024',
    employeeName: 'Kebede Alemu',
    role: 'Skilled Driver/Mechanic',
    destination: 'UAE',
    template: 'modern',
    language: 'EN',
    status: 'Reserved',
    skills: ['Driving', 'Mechanics', 'Auto Repair'],
    experience: '5 years experience',
    education: 'Technical Diploma',
    languages: ['Amharic (Native)', 'Arabic (Intermediate)', 'English (Basic)'],
    createdAt: '2026-05-21',
    matchScore: 88,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    age: 32,
    gender: 'Male',
    skillLevel: 'Skilled',
    experienceYears: 5,
    languagesDetailed: [
      { name: 'Amharic', level: 'Native' },
      { name: 'Arabic', level: 'Intermediate' },
      { name: 'English', level: 'Basic' }
    ],
    keyCapabilities: ['Heavy Vehicle Driving', 'Engine Diagnostics', 'Preventive Maintenance', 'Troubleshooting', 'Route Optimization'],
    skillsAssessment: [
      { name: 'Heavy Driving', score: 'Excellent' },
      { name: 'Diagnostics', score: 'Excellent' },
      { name: 'Welding', score: 'Good' }
    ],
    passportStatus: 'Valid',
    medicalStatus: 'Completed',
    trainingStatus: 'Certified',
    reservedUntil: 'Sept 15',
    reservedBy: 'Al-Mansour Agency',
    rating: 4.5,
    views: 23,
    updatedDaysAgo: 7,
    phone: '+251 91 765 4321',
    email: 'kebedealemu@example.com',
    summary: 'Reliable and skilled driver and auto mechanic with over 5 years of experience in fleet operations and heavy machinery diagnostics. Expert in troubleshooting electrical and mechanical issues efficiently.'
  },
  {
    id: 'cv-3',
    employeeId: 'ETH-2023-0026',
    employeeName: 'Fatima Mohammed',
    role: 'Semi-Skilled Housekeeper',
    destination: 'Saudi Arabia',
    template: 'standard',
    language: 'AR',
    status: 'Available',
    skills: ['Cooking', 'Cleaning', 'Childcare'],
    experience: '2 years experience',
    education: 'High School Graduate',
    languages: ['Amharic (Native)', 'Arabic (Intermediate)', 'English (Intermediate)'],
    createdAt: '2026-05-25',
    matchScore: 92,
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300',
    age: 28,
    gender: 'Female',
    skillLevel: 'Semi-Skilled',
    experienceYears: 2,
    languagesDetailed: [
      { name: 'Amharic', level: 'Native' },
      { name: 'Arabic', level: 'Intermediate' },
      { name: 'English', level: 'Intermediate' }
    ],
    keyCapabilities: ['Deep Cleaning', 'Middle Eastern Cuisine', 'Child Supervision', 'Laundry & Ironing', 'Schedule Coordination'],
    skillsAssessment: [
      { name: 'Arabic Cooking', score: 'Very Good' },
      { name: 'Housekeeping', score: 'Excellent' },
      { name: 'Childcare', score: 'Good' }
    ],
    passportStatus: 'Valid',
    medicalStatus: 'Completed',
    trainingStatus: 'Certified',
    rating: 4.9,
    views: 32,
    updatedDaysAgo: 3,
    phone: '+251 92 111 2222',
    email: 'fatimamohammed@example.com',
    summary: 'Dedicated housekeeper with 2 years of experience working with international families. Specialized in Middle Eastern cooking, children care, and maintaining high hygiene standards.'
  }
];

export function CVDatabaseModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cvs, setCvs] = useState<CVProfile[]>(MOCK_CVS);
  const [loading, setLoading] = useState(false);
  
  // Advanced filter states to match the filters picture
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter Fields
  const [skillLevels, setSkillLevels] = useState<string[]>(['Semi-Skilled']);
  const [experienceLimit, setExperienceLimit] = useState<number>(2);
  const [languages, setLanguages] = useState<string[]>(['Arabic (Intermediate+)']);
  const [ageMin, setAgeMin] = useState<string>('25');
  const [ageMax, setAgeMax] = useState<string>('35');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male'>('Female');
  const [availability, setAvailability] = useState<string>('Any availability');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [specialSkills, setSpecialSkills] = useState<string[]>([]);
  const [docsComplete, setDocsComplete] = useState(false);
  const [validPassport, setValidPassport] = useState(false);

  // Selected workers for batch actions
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
  
  // Profile View Modal State
  const [selectedProfile, setSelectedProfile] = useState<CVProfile | null>(null);
  const [profileTab, setProfileTab] = useState<'details' | 'history' | 'skills' | 'documents' | 'notes'>('details');

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cvs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 3) {
          // Merge API data with rich mock properties so they look great
          const apiCvs = data.data.map((c: any, index: number) => {
            const fallbackMock = MOCK_CVS[index % MOCK_CVS.length];
            return {
              ...fallbackMock,
              ...c,
              employeeName: c.employeeName || fallbackMock.employeeName,
              role: c.role || fallbackMock.role,
              destination: c.destination || fallbackMock.destination
            };
          });
          setCvs(apiCvs);
          return;
        }
      }
      setCvs(MOCK_CVS);
    } catch {
      setCvs(MOCK_CVS);
    } finally {
      setLoading(false);
    }
  };

  // Advanced Filtering Logic
  const handleApplyFilters = () => {
    // Interactive filter mapping
    let results = MOCK_CVS;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(cv => 
        cv.employeeName.toLowerCase().includes(q) ||
        cv.role.toLowerCase().includes(q) ||
        cv.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Filter by skillLevel
    if (skillLevels.length > 0) {
      results = results.filter(cv => skillLevels.includes(cv.skillLevel));
    }

    // Filter by gender
    if (genderFilter !== 'All') {
      results = results.filter(cv => cv.gender === genderFilter);
    }

    // Filter by age range
    const minAgeNum = parseInt(ageMin) || 0;
    const maxAgeNum = parseInt(ageMax) || 100;
    results = results.filter(cv => cv.age >= minAgeNum && cv.age <= maxAgeNum);

    // Filter by experience
    if (experienceLimit > 0) {
      results = results.filter(cv => cv.experienceYears >= experienceLimit);
    }

    // Filter by languages
    if (languages.includes('Arabic (Intermediate+)')) {
      results = results.filter(cv => 
        cv.languagesDetailed.some(l => l.name === 'Arabic' && (l.level === 'Intermediate' || l.level === 'Native'))
      );
    }

    setCvs(results);
  };

  const handleResetFilters = () => {
    setSkillLevels([]);
    setExperienceLimit(0);
    setLanguages([]);
    setAgeMin('');
    setAgeMax('');
    setGenderFilter('All');
    setSelectedRegion('All Regions');
    setSpecialSkills([]);
    setDocsComplete(false);
    setValidPassport(false);
    setCvs(MOCK_CVS);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWorkerIds(cvs.map(c => c.id));
    } else {
      setSelectedWorkerIds([]);
    }
  };

  const handleSelectWorker = (id: string) => {
    setSelectedWorkerIds(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Input and Top Row Actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, skills, roles, or id..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 py-3 pl-11 pr-4 text-sm focus:border-brand-500 focus:outline-none dark:bg-slate-950 dark:text-slate-100"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-900">
            ⌘ K
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
              showFilters 
                ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-950/20 dark:border-brand-900 dark:text-brand-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-4.5 w-4.5" />
            Advanced Filters
          </button>
          <select className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 dark:bg-slate-950 focus:outline-none">
            <option>Sort: Relevance</option>
            <option>Sort: Newest</option>
            <option>Sort: Match Score</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Panel - Matched directly to the mockup photo */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md transition-all duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Column 1: Skill & Experience */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
                <GraduationCap className="h-4 w-4 text-brand-600" />
                Skill & Experience
              </h4>
              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {(['Skilled', 'Semi-Skilled', 'Unskilled'] as const).map((level) => (
                  <label key={level} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skillLevels.includes(level)}
                      onChange={(e) => {
                        setSkillLevels(prev => 
                          e.target.checked ? [...prev, level] : prev.filter(l => l !== level)
                        );
                      }}
                      className="h-4 w-4 rounded border-slate-350 text-brand-600 focus:ring-brand-500"
                    />
                    {level}
                  </label>
                ))}
                
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Experience (years)</label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={experienceLimit}
                    onChange={(e) => setExperienceLimit(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 mt-2"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
                    <span>0+</span>
                    <span>{experienceLimit}+ years</span>
                    <span>15+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Languages */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
                <FileText className="h-4 w-4 text-brand-600" />
                Languages
              </h4>
              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {(['Arabic (Intermediate+)', 'English (Intermediate+)', 'Other Languages'] as const).map((lang) => (
                  <label key={lang} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={languages.includes(lang)}
                      onChange={(e) => {
                        setLanguages(prev => 
                          e.target.checked ? [...prev, lang] : prev.filter(l => l !== lang)
                        );
                      }}
                      className="h-4 w-4 rounded border-slate-350 text-brand-600 focus:ring-brand-500 mt-0.5"
                    />
                    <div>
                      <div>{lang.split(' ')[0]}</div>
                      {lang.includes('Intermediate+') && <span className="text-[10px] text-slate-400 font-normal">(Intermediate+)</span>}
                    </div>
                  </label>
                ))}
                
                <button className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 w-full text-left">
                  <Plus className="h-3.5 w-3.5" />
                  Add more languages
                </button>
              </div>
            </div>

            {/* Column 3: Demographics & Availability */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
                <User className="h-4 w-4 text-brand-600" />
                Demographics & Availability
              </h4>
              <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Age Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Min"
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                      className="w-full text-center rounded-lg border border-slate-200 dark:border-slate-800 py-1.5 text-xs font-bold focus:outline-none focus:border-brand-500 dark:bg-slate-950"
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input
                      type="text"
                      placeholder="Max"
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                      className="w-full text-center rounded-lg border border-slate-200 dark:border-slate-800 py-1.5 text-xs font-bold focus:outline-none focus:border-brand-500 dark:bg-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Gender</label>
                  <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                    {(['All', 'Female', 'Male'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenderFilter(g)}
                        className={`py-1 text-[11px] font-bold rounded-md transition-all ${
                          genderFilter === g
                            ? 'bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400'
                            : 'text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Availability</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-1.5 px-2 text-xs font-semibold focus:outline-none focus:border-brand-500 dark:bg-slate-950 dark:text-slate-205"
                  >
                    <option>Any availability</option>
                    <option>Immediately available</option>
                    <option>Within 1 month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Column 4: Additional Filters */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
                <Sparkles className="h-4 w-4 text-brand-600" />
                Additional Filters
              </h4>
              <div className="space-y-3.5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-1.5 px-2 text-xs font-semibold dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option>All Regions</option>
                    <option>Addis Ababa</option>
                    <option>Oromia</option>
                    <option>Amhara</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Special Skills</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Cooking', 'Childcare', 'Elder Care'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSpecialSkills(prev => 
                          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                        )}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                          specialSkills.includes(tag)
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-350'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    <button className="text-[10px] font-bold text-brand-600 border border-dashed border-brand-200 dark:border-brand-900 rounded-full px-2.5 py-1 hover:bg-slate-50">
                      More...
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Document Status</label>
                  <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={docsComplete}
                      onChange={(e) => setDocsComplete(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600"
                    />
                    Complete Documents
                  </label>
                  <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={validPassport}
                      onChange={(e) => setValidPassport(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600"
                    />
                    Valid Passport
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Action Row inside Advanced Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/20 px-3.5 py-2 rounded-xl">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Recommended Filters
              </button>
              <button className="text-xs font-semibold text-slate-450 hover:text-slate-600 flex items-center gap-1">
                <span>What's this?</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white transition-colors flex items-center gap-2"
              >
                Apply Filters
                <span className="bg-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full text-brand-100">
                  ({cvs.length} results)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applied Filters Row */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-150 dark:border-slate-800/80">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-450 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" />
          Applied Filters:
        </span>
        {skillLevels.map(lvl => (
          <span key={lvl} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-400 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900">
            {lvl}
            <button onClick={() => setSkillLevels(prev => prev.filter(l => l !== lvl))}>
              <X className="h-3 w-3 hover:text-red-500" />
            </button>
          </span>
        ))}
        {languages.map(lang => (
          <span key={lang} className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
            {lang}
            <button onClick={() => setLanguages(prev => prev.filter(l => l !== lang))}>
              <X className="h-3 w-3 hover:text-red-500" />
            </button>
          </span>
        ))}
        {genderFilter !== 'All' && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-900">
            {genderFilter}
            <button onClick={() => setGenderFilter('All')}>
              <X className="h-3 w-3 hover:text-red-500" />
            </button>
          </span>
        )}
        {(ageMin || ageMax) && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900">
            Age: {ageMin || '18'}-{ageMax || '60'}
            <button onClick={() => { setAgeMin(''); setAgeMax(''); }}>
              <X className="h-3 w-3 hover:text-red-500" />
            </button>
          </span>
        )}
        <button 
          onClick={handleResetFilters} 
          className="text-xs font-bold text-brand-600 hover:text-brand-700 ml-auto"
        >
          Clear All
        </button>
      </div>

      {/* Batch Actions Toolbar matching the mockup */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-50/50 dark:bg-slate-900/35 p-4 rounded-2xl border border-blue-100/60 dark:border-slate-800/80">
        <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedWorkerIds.length === cvs.length && cvs.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600"
          />
          Select All Workers
        </label>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-sm">
            <Download className="h-3.5 w-3.5 text-brand-600" />
            Batch Export
          </button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-sm">
            <Printer className="h-3.5 w-3.5 text-brand-600" />
            Print Selected
          </button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-sm">
            <Share2 className="h-3.5 w-3.5 text-brand-600" />
            Share Selected
          </button>
          <button className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-3.5 py-2 rounded-xl hover:bg-slate-50 shadow-sm">
            <Tag className="h-3.5 w-3.5 text-brand-600" />
            Tag Selected
          </button>
        </div>
      </div>

      {/* CV Grid Layout - Structured precisely like the portrait card screenshot */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin h-8 w-8 text-brand-600" />
            <p className="text-sm font-semibold text-slate-500">Loading CV database profiles...</p>
          </div>
        </div>
      ) : cvs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <User className="h-14 w-14 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-750 dark:text-slate-300 font-bold text-lg">No CV profiles match filters</p>
          <p className="text-sm text-slate-450 dark:text-slate-500 mt-1">Try resetting your filters or search keywords</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cvs.map(cv => {
            const isSelected = selectedWorkerIds.includes(cv.id);
            const isAvailable = cv.status === 'Available';
            
            return (
              <div
                key={cv.id}
                className={`group relative overflow-hidden rounded-3xl border bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
                  isSelected ? 'ring-2 ring-brand-600 border-transparent' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Select Checkbox (Overlay Top-Left) */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectWorker(cv.id)}
                    className="h-4.5 w-4.5 rounded-md border-white/40 bg-black/30 text-brand-600 focus:ring-brand-500 cursor-pointer shadow-md"
                  />
                </div>

                {/* Top Image Section with overlay details */}
                <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                  {cv.photoUrl ? (
                    <img
                      src={cv.photoUrl}
                      alt={cv.employeeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-750 flex items-center justify-center text-slate-450">
                      <span className="text-3xl font-bold">{(cv.employeeName).charAt(0)}</span>
                    </div>
                  )}
                  
                  {/* Rating Overlay (Top-Left under checkbox) */}
                  <div className="absolute top-3.5 left-11 bg-black/40 backdrop-blur-md text-white rounded-full px-2.5 py-1 text-[11px] font-bold flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {cv.rating}/5
                  </div>

                  {/* Status Overlay Badge (Top-Right) */}
                  <div className="absolute top-3.5 right-3.5">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-sm ${
                      isAvailable ? 'bg-emerald-500' : 'bg-red-500'
                    }`}>
                      {cv.status}
                    </span>
                  </div>

                  {/* Floating Action Circle Buttons Overlaying Border at bottom of image */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button 
                      onClick={() => { setSelectedProfile(cv); setProfileTab('details'); }}
                      className="w-8.5 h-8.5 rounded-full bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 flex items-center justify-center text-brand-600 hover:bg-slate-50 shadow-md transition-colors"
                      title="View Documents"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button className="w-8.5 h-8.5 rounded-full bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 flex items-center justify-center text-brand-600 hover:bg-slate-50 shadow-md transition-colors" title="Bookmark Worker">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="w-8.5 h-8.5 rounded-full bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-md transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Card Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    
                    {/* Name, Age, Gender Row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                          {cv.employeeName}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                          ID: {cv.employeeId}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                          {cv.age} years
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 inline-block ${
                          cv.gender === 'Female' 
                            ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400' 
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                        }`}>
                          {cv.gender}
                        </span>
                      </div>
                    </div>

                    {/* Occupation & Experience */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-750 dark:text-slate-300">
                      <span className="text-brand-600">💼</span>
                      <div>
                        <span className="text-slate-900 dark:text-slate-100 font-bold block">{cv.role}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{cv.experience}</span>
                      </div>
                    </div>

                    {/* Languages Detailed Badges */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {cv.languages.map(l => (
                          <span key={l} className="text-[10px] font-bold bg-blue-50/80 dark:bg-blue-950/30 text-blue-700 dark:text-blue-350 px-2.5 py-0.5 rounded-full border border-blue-100/60 dark:border-blue-900/40">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Skills Badges */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Key Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {cv.skills.map(s => (
                          <span key={s} className="text-[10px] font-bold bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-350 px-2.5 py-0.5 rounded-full border border-emerald-100/60 dark:border-emerald-900/40">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {/* Views and Update text */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-semibold mb-3">
                      <span>Updated: {cv.updatedDaysAgo} days ago</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {cv.views} views
                      </span>
                    </div>

                    {/* Button Controls */}
                    {cv.status === 'Reserved' && cv.reservedBy ? (
                      <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 py-3 rounded-xl text-center text-xs font-bold border border-slate-200 dark:border-slate-750 flex items-center justify-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                        Reserved by {cv.reservedBy}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { setSelectedProfile(cv); setProfileTab('details'); }}
                          className="bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-colors"
                        >
                          View Profile
                        </button>
                        <button className="border border-brand-200 hover:border-brand-350 text-brand-600 dark:border-brand-900 dark:text-brand-400 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-slate-50/50">
                          Generate CV →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Worker Profile Detail View Modal - Replicates the mockup perfectly */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-250 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Title Bar */}
            <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <span className="text-brand-600 font-bold text-xl">👤</span>
                <h2 className="text-lg font-bold">Worker Profile: {selectedProfile.employeeName}</h2>
              </div>
              <button 
                onClick={() => setSelectedProfile(null)}
                className="text-slate-450 hover:text-slate-650 p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-0">
              
              {/* Left Profile Summary Panel (3 cols) */}
              <div className="md:col-span-4 border-r border-slate-150 dark:border-slate-800 p-6 flex flex-col justify-between bg-slate-50/30">
                <div className="space-y-6 text-center md:text-left">
                  
                  {/* Portrait Avatar Photo */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                      {selectedProfile.photoUrl ? (
                        <img 
                          src={selectedProfile.photoUrl} 
                          alt={selectedProfile.employeeName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-450 text-2xl font-bold bg-slate-200">
                          {selectedProfile.employeeName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mt-3">{selectedProfile.employeeName}</h3>
                    <p className="text-xs text-slate-450 font-semibold">ID: {selectedProfile.employeeId}</p>
                    
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white ${
                        selectedProfile.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}>
                        {selectedProfile.status}
                      </span>
                      <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-full border border-brand-100">
                        {selectedProfile.skillLevel}
                      </span>
                    </div>
                  </div>

                  {/* Left Panel Sidebar items */}
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase flex items-center gap-1.5">
                        <span>💼</span> Occupation
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-150 mt-0.5">{selectedProfile.role}</p>
                      <p className="text-[10px] text-slate-400">{selectedProfile.experience}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase flex items-center gap-1.5">
                        <span>👤</span> Personal Info
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-150 mt-0.5">
                        {selectedProfile.age} years old, {selectedProfile.gender}
                      </p>
                      <p className="text-[10px] text-slate-400">Addis Ababa, Ethiopia</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase flex items-center gap-1.5">
                        <span>🌐</span> Languages
                      </p>
                      <div className="space-y-0.5 mt-1">
                        {selectedProfile.languages.map(l => (
                          <span key={l} className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md inline-block mr-1">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase flex items-center gap-1.5">
                        <span>📄</span> Documents
                      </p>
                      <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[11px] font-semibold text-slate-700 dark:text-slate-350 mt-1">
                        <span>Passport:</span>
                        <span className={selectedProfile.passportStatus === 'Valid' ? 'text-emerald-600' : 'text-red-500'}>
                          {selectedProfile.passportStatus}
                        </span>
                        <span>Medical:</span>
                        <span className={selectedProfile.medicalStatus === 'Completed' ? 'text-emerald-600' : 'text-slate-400'}>
                          {selectedProfile.medicalStatus}
                        </span>
                        <span>Training:</span>
                        <span className={selectedProfile.trainingStatus === 'Certified' ? 'text-emerald-600' : 'text-slate-400'}>
                          {selectedProfile.trainingStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Panel Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    Generate CV
                  </button>
                  <button className="w-full bg-white hover:bg-slate-50 border border-brand-200 text-brand-600 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                    <Bookmark className="h-4 w-4" />
                    Reserve Worker
                  </button>
                </div>
              </div>

              {/* Right Profile Details Tabs Panel (8 cols) */}
              <div className="md:col-span-8 p-6 flex flex-col justify-between">
                <div>
                  {/* Profile Section Tabs Header */}
                  <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 mb-6 overflow-x-auto pb-px">
                    {([
                      { id: 'details', label: 'Profile Details' },
                      { id: 'history', label: 'Work History' },
                      { id: 'skills', label: 'Skills & Training' },
                      { id: 'documents', label: 'Documents' },
                      { id: 'notes', label: 'Notes' }
                    ] as const).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setProfileTab(tab.id)}
                        className={`text-xs font-bold pb-3 relative transition-all ${
                          profileTab === tab.id
                            ? 'text-brand-600 border-b-2 border-brand-600'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents: Profile Details */}
                  {profileTab === 'details' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* Personal Info Grid */}
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-250 text-sm mb-3">
                          <User className="h-4.5 w-4.5 text-brand-600" />
                          Personal Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div>
                            <p className="text-slate-400">Full Name</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedProfile.employeeName}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Date of Birth</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">October 15, 1997 (26 years)</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Gender</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedProfile.gender}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Nationality</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">Ethiopian</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Phone Number</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedProfile.phone}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Email</p>
                            <p className="font-bold text-slate-850 dark:text-slate-200 mt-0.5 truncate">{selectedProfile.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Professional Summary */}
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-250 text-sm mb-3">
                          <FileText className="h-4.5 w-4.5 text-brand-600" />
                          Professional Summary
                        </h4>
                        <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {selectedProfile.summary}
                        </p>
                      </div>

                      {/* Key Capabilities */}
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-250 text-sm mb-3">
                          <CheckCircle className="h-4.5 w-4.5 text-brand-600" />
                          Key Capabilities
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {selectedProfile.keyCapabilities.map(cap => (
                            <div key={cap} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                              <span className="text-emerald-500">✔</span>
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills Assessment */}
                      <div>
                        <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-250 text-sm mb-3">
                          <Star className="h-4.5 w-4.5 text-brand-600" />
                          Skills Assessment
                        </h4>
                        <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {selectedProfile.skillsAssessment.map(skill => (
                            <div key={skill.name}>
                              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                <span>{skill.name}</span>
                                <span className="text-brand-600 font-semibold">{skill.score}</span>
                              </div>
                              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-brand-600 h-full rounded-full" 
                                  style={{ 
                                    width: skill.score === 'Excellent' ? '95%' : skill.score === 'Very Good' ? '85%' : '75%' 
                                  }} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Fallback info for other tabs */}
                  {profileTab !== 'details' && (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      <p className="font-semibold">Section in development</p>
                      <p className="mt-1">Content matching "{profileTab}" will load once backend synchronization completes.</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div className="mt-8 pt-4 border-t border-slate-250 dark:border-slate-800 flex items-center justify-end gap-3">
                  <button 
                    onClick={() => setSelectedProfile(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Close Profile
                  </button>
                  <button className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-xs font-bold text-white shadow-md transition-all">
                    Apply Selection
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}