import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calculator, FlaskConical, Globe, Languages, Scroll, Star } from 'lucide-react';
import { useCurriculum } from '../../contexts/CurriculumContext';
import CurriculumService from '../../services/curriculumService';

const SubjectSelection = ({ mode = 'practice' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedClass, setSelectedClass] = useState('');
  const { setSelectedClass: setCurriculumClass, setSelectedSubject } = useCurriculum();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const classParam = params.get('class');
    
    if (!classParam) {
      navigate(`/${mode}`);
      return;
    }
    
    setSelectedClass(classParam);
    // Save to curriculum context
    setCurriculumClass(classParam);
  }, [location, mode, navigate, setCurriculumClass]);

  const handleSubjectSelect = async (subject) => {
    // Save to curriculum context
    setSelectedSubject(subject);
    
    const navigationState = {
      class: selectedClass,
      subject: subject,
      mode: mode
    };

    if (subject === 'combined') {
      // Combined subjects skip chapter selection
      const searchParams = new URLSearchParams({
        ...navigationState,
        chapter: 'combined'
      });
      
      if (mode === 'practice') {
        navigate(`/practice/quiz?${searchParams.toString()}`);
      } else {
        navigate(`/multiplayer/create-room?${searchParams.toString()}`);
      }
    } else {
      // Regular subjects go to chapter selection
      // Pre-fetch available chapters for the context
      try {
        const chapters = await CurriculumService.getAvailableChapters(selectedClass, subject);
        console.log('Available chapters for', subject, ':', chapters);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
      
      const searchParams = new URLSearchParams(navigationState);
      navigate(`/${mode}/chapter-selection?${searchParams.toString()}`);
    }
  };

  const handleBack = () => {
    navigate(`/${mode}`);
  };

  const subjects = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'from-blue-600 to-blue-800',
      description: 'Numbers, algebra, geometry, and problem solving',
      chapters: 14
    },
    {
      id: 'science',
      name: 'Science',
      icon: FlaskConical,
      color: 'from-green-600 to-green-800',
      description: 'Physics, chemistry, and biology fundamentals',
      chapters: 16
    },
    {
      id: 'social-science',
      name: 'Social Science',
      icon: Globe,
      color: 'from-orange-600 to-orange-800',
      description: 'History, geography, and civics',
      chapters: 22
    },
    {
      id: 'english',
      name: 'English',
      icon: BookOpen,
      color: 'from-purple-600 to-purple-800',
      description: 'Grammar, literature, and comprehension',
      chapters: 12
    },
    {
      id: 'hindi',
      name: 'Hindi',
      icon: Languages,
      color: 'from-red-600 to-red-800',
      description: 'हिंदी व्याकरण और साहित्य',
      chapters: 17
    },
    {
      id: 'sanskrit',
      name: 'Sanskrit',
      icon: Scroll,
      color: 'from-yellow-600 to-yellow-800',
      description: 'संस्कृत भाषा और श्लोक',
      chapters: 15
    }
  ];

  const combinedSubject = {
    id: 'combined',
    name: 'Combined (All Subjects)',
    icon: Star,
    color: 'from-gradient-to-r from-yellow-500 to-orange-500',
    description: 'Mixed questions from all subjects',
    chapters: 'All'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Class Selection
          </button>

          <div className="mb-4">
            <span className="inline-block bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm text-white/80 border border-white/20">
              {selectedClass?.toUpperCase()}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Choose Subject
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Select a subject to explore chapters and start your learning journey
          </p>
        </motion.div>

        {/* Combined Subject (Special) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSubjectSelect('combined')}
            className="relative p-8 rounded-2xl shadow-2xl cursor-pointer border border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm transition-all duration-300 hover:from-yellow-500/30 hover:to-orange-500/30"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {combinedSubject.name}
              </h3>
              <p className="text-gray-200 leading-relaxed">
                {combinedSubject.description}
              </p>
              <div className="mt-4 inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-lg px-4 py-2">
                <span className="text-yellow-300 font-semibold">🎯 Comprehensive Practice</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Regular Subjects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 4), duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSubjectSelect(subject.id)}
              className={`relative p-6 rounded-2xl shadow-2xl cursor-pointer border border-white/20 bg-gradient-to-br ${subject.color} backdrop-blur-sm transition-all duration-300 hover:shadow-3xl`}
            >
              {/* Subject Icon */}
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <subject.icon className="w-8 h-8 text-white" />
              </div>

              {/* Subject Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {subject.name}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {subject.description}
                </p>
              </div>

              {/* Chapter Count */}
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-white/90 font-semibold text-sm mb-1">
                  Chapters Available:
                </div>
                <div className="text-white text-lg font-bold">
                  {subject.chapters}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-3xl mx-auto border border-white/20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {mode === 'practice' ? '🎯 Ready to Learn?' : '⚔️ Ready to Challenge?'}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {mode === 'practice' 
              ? 'Select any subject to explore chapters and start practicing questions. Master concepts at your own pace.'
              : 'Choose a subject to create a multiplayer challenge room. Compete with friends in real-time quiz battles!'
            }
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm">
            {selectedClass?.toUpperCase()} • NCERT Aligned Content • {subjects.reduce((total, subject) => total + subject.chapters, 0)} Total Chapters
          </p>
        </motion.div>
      </div>

              <style jsx="true">{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SubjectSelection;