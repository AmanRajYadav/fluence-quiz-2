import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Target, Award, Play, Hash } from 'lucide-react';
import { useCurriculum } from '../../contexts/CurriculumContext';
import CurriculumService from '../../services/curriculumService';

const ChapterSelection = ({ mode = 'practice' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const { setSelectedClass: setCurriculumClass, setSelectedSubject: setCurriculumSubject, setSelectedChapter, setCurriculumQuestions } = useCurriculum();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const classParam = params.get('class');
    const subjectParam = params.get('subject');
    
    if (!classParam || !subjectParam) {
      navigate(`/${mode}`);
      return;
    }
    
    setSelectedClass(classParam);
    setSelectedSubject(subjectParam);
    
    // Save to curriculum context
    setCurriculumClass(classParam);
    setCurriculumSubject(subjectParam);
  }, [location, mode, navigate, setCurriculumClass, setCurriculumSubject]);

  const handleChapterSelect = async (chapter) => {
    // Save to curriculum context
    setSelectedChapter(chapter);
    
    // Load curriculum questions into context
    try {
      const questions = await CurriculumService.fetchQuestions(selectedClass, selectedSubject, chapter);
      setCurriculumQuestions(questions);
      console.log('Loaded curriculum questions:', questions.length);
    } catch (error) {
      console.error('Failed to load curriculum questions:', error);
      setCurriculumQuestions([]);
    }
    
    const searchParams = new URLSearchParams({
      class: selectedClass,
      subject: selectedSubject,
      chapter: chapter,
      mode: mode
    });
    
    if (mode === 'practice') {
      navigate(`/practice/quiz?${searchParams.toString()}`);
    } else {
      navigate(`/multiplayer/create-room?${searchParams.toString()}`);
    }
  };

  const handleBack = () => {
    const searchParams = new URLSearchParams({
      class: selectedClass,
      mode: mode
    });
    navigate(`/${mode}/subject-selection?${searchParams.toString()}`);
  };

  const getChapters = () => {
    if (selectedSubject === 'mathematics') {
      return [
        { id: 'all-chapters', name: 'All Chapters', description: 'Mixed questions from all math chapters', isSpecial: true },
        { id: 'patterns-in-mathematics', name: 'Patterns in Mathematics', chapterNumber: 1 },
        { id: 'lines-and-angles', name: 'Lines and Angles', chapterNumber: 2 },
        { id: 'number-play', name: 'Number Play', chapterNumber: 3 },
        { id: 'data-handling-and-presentation', name: 'Data Handling and Presentation', chapterNumber: 4 },
        { id: 'prime-time', name: 'Prime Time', chapterNumber: 5 },
        { id: 'perimeter-and-area', name: 'Perimeter and Area', chapterNumber: 6 },
        { id: 'fractions', name: 'Fractions', chapterNumber: 7 },
        { id: 'playing-with-constructions', name: 'Playing with Constructions', chapterNumber: 8 },
        { id: 'symmetry', name: 'Symmetry', chapterNumber: 9 },
        { id: 'the-other-side-of-zero', name: 'The Other Side of Zero', chapterNumber: 10 }
      ];
    } else if (selectedSubject === 'science') {
      return [
        { id: 'all-chapters', name: 'All Chapters', description: 'Mixed questions from all science chapters', isSpecial: true },
        { id: 'wonderful-world-of-science', name: 'The Wonderful World of Science', chapterNumber: 1 },
        { id: 'diversity-in-living-world', name: 'Diversity in the Living World', chapterNumber: 2 },
        { id: 'mindful-eating', name: 'Mindful Eating: A Path to a Healthy Body', chapterNumber: 3 },
        { id: 'exploring-magnets', name: 'Exploring Magnets', chapterNumber: 4 },
        { id: 'measurement-length-motion', name: 'Measurement of Length and Motion', chapterNumber: 5 },
        { id: 'materials-around-us', name: 'Materials Around Us', chapterNumber: 6 },
        { id: 'temperature-measurement', name: 'Temperature and its Measurement', chapterNumber: 7 },
        { id: 'journey-through-states-water', name: 'A Journey through States of Water', chapterNumber: 8 },
        { id: 'methods-separation', name: 'Methods of Separation in Everyday Life', chapterNumber: 9 },
        { id: 'living-creatures', name: 'Living Creatures: Exploring their Characteristics', chapterNumber: 10 },
        { id: 'natures-treasures', name: "Nature's Treasures", chapterNumber: 11 },
        { id: 'beyond-earth', name: 'Beyond Earth', chapterNumber: 12 }
      ];
    } else if (selectedSubject === 'social-science') {
      return [
        { id: 'all-chapters', name: 'All Chapters', description: 'Mixed questions from all social science chapters', isSpecial: true },
        { id: 'locating-places-on-earth', name: 'Locating Places on the Earth', chapterNumber: 1 },
        { id: 'oceans-and-continents', name: 'Oceans and Continents', chapterNumber: 2 },
        { id: 'landforms-and-life', name: 'Landforms and Life', chapterNumber: 3 },
        { id: 'timeline-and-sources-of-history', name: 'Timeline and Sources of History', chapterNumber: 4 },
        { id: 'india-that-is-bharat', name: 'India, That Is Bharat', chapterNumber: 5 },
        { id: 'beginnings-of-indian-civilisation', name: 'The Beginnings of Indian Civilisation', chapterNumber: 6 },
        { id: 'indias-cultural-roots', name: "India's Cultural Roots", chapterNumber: 7 },
        { id: 'unity-in-diversity', name: "Unity in Diversity, or 'Many in the One'", chapterNumber: 8 },
        { id: 'family-and-community', name: 'Family and Community', chapterNumber: 9 },
        { id: 'grassroots-democracy-part1-governance', name: 'Grassroots Democracy — Part 1: Governance', chapterNumber: 10 },
        { id: 'grassroots-democracy-part2-rural', name: 'Grassroots Democracy — Part 2: Local Government in Rural Areas', chapterNumber: 11 },
        { id: 'grassroots-democracy-part3-urban', name: 'Grassroots Democracy — Part 3: Local Government in Urban', chapterNumber: 12 },
        { id: 'value-of-work', name: 'The Value of Work', chapterNumber: 13 },
        { id: 'economic-activities-around-us', name: 'Economic Activities Around Us', chapterNumber: 14 }
      ];
    } else if (selectedSubject === 'english') {
      return [
        { id: 'combined', name: 'Combined', description: 'All English topics combined', isSpecial: true },
        { id: 'grammar', name: 'Grammar', description: 'Tenses, parts of speech, sentence structure' },
        { id: 'literature', name: 'Literature', description: 'Stories, poems, comprehension' }
      ];
    } else if (selectedSubject === 'hindi') {
      return [
        { id: 'combined', name: 'संयुक्त (Combined)', description: 'सभी हिंदी विषयों का संयोजन', isSpecial: true },
        { id: 'gadya', name: 'गद्य (Prose)', description: 'कहानी, निबंध और अन्य गद्य सामग्री' },
        { id: 'kavya', name: 'काव्य (Poetry)', description: 'कविताएं और काव्य रचनाएं' },
        { id: 'vyakaran', name: 'व्याकरण (Grammar)', description: 'हिंदी भाषा के नियम और संरचना' }
      ];
    } else if (selectedSubject === 'sanskrit') {
      return [
        { id: 'combined', name: 'संयुक्त (Combined)', description: 'सभी संस्कृत विषयों का संयोजन', isSpecial: true },
        { id: 'devanagari-parichay', name: 'देवनागरी परिचय (Devanagari Introduction)', description: 'देवनागरी लिपि का परिचय' },
        { id: 'saral-shlok', name: 'सरल श्लोक (Simple Shlokas)', description: 'आसान संस्कृत श्लोक' },
        { id: 'vyakaran-aadhar', name: 'व्याकरण आधार (Grammar Foundation)', description: 'संस्कृत व्याकरण की बुनियादी बातें' }
      ];
    }
    
    return [
      { id: 'all-chapters', name: 'All Chapters', description: 'Mixed questions from all chapters', isSpecial: true }
    ];
  };

  const getContentTypeName = () => {
    return 'Chapter';
  };

  const getContentIcon = (item) => {
    if (item.isSpecial) return <Target className="w-6 h-6" />;
    if (item.chapterNumber) return <Hash className="w-6 h-6" />;
    return <Award className="w-6 h-6" />;
  };

  const getContentTitle = (item) => {
    if (item.chapterNumber) {
      return `Chapter ${item.chapterNumber}`;
    }
    return item.name;
  };

  const chapters = getChapters();

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
            Back to Subject Selection
          </button>

          {/* Breadcrumb */}
          <div className="mb-4 flex items-center justify-center gap-2 text-sm">
            <span className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-white/80 border border-white/20">
              {selectedClass?.toUpperCase()}
            </span>
            <span className="text-white/60">→</span>
            <span className="bg-blue-500/20 backdrop-blur-md rounded-full px-3 py-1 text-white border border-blue-400/30">
              {selectedSubject?.charAt(0).toUpperCase() + selectedSubject?.slice(1).replace('-', ' ')}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Choose {getContentTypeName()}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Select a {getContentTypeName().toLowerCase()} to start practicing questions
          </p>
        </motion.div>

        {/* Special Content (All Chapters/Combined) */}
        {chapters.filter(item => item.isSpecial).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChapterSelect(item.id)}
              className="relative p-8 rounded-2xl shadow-2xl cursor-pointer border border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm transition-all duration-300 hover:from-yellow-500/30 hover:to-orange-500/30"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  {getContentIcon(item)}
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 inline-block bg-yellow-400/20 border border-yellow-400/30 rounded-lg px-4 py-2">
                  <span className="text-yellow-300 font-semibold">🎯 Comprehensive Practice</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Regular Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {chapters.filter(item => !item.isSpecial).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 4), duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChapterSelect(item.id)}
              className="relative p-6 rounded-2xl shadow-2xl cursor-pointer border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:shadow-3xl"
            >
              {/* Content Number/Icon */}
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                {item.chapterNumber ? (
                  <span className="text-xl font-bold text-white">{item.chapterNumber}</span>
                ) : (
                  getContentIcon(item)
                )}
              </div>

              {/* Content Info */}
              <div className="mb-4">
                {item.chapterNumber && (
                  <div className="text-sm text-gray-400 mb-1">
                    {getContentTitle(item)}
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Play Button Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
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
            {mode === 'practice' ? '🎯 Ready to Practice?' : '⚔️ Ready to Challenge?'}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {mode === 'practice' 
              ? 'Select any chapter to start practicing questions. Track your progress and improve your understanding.'
              : 'Choose a chapter to create a multiplayer challenge room. Invite friends and compete in real-time!'
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
            {selectedClass?.toUpperCase()} • {selectedSubject?.charAt(0).toUpperCase() + selectedSubject?.slice(1).replace('-', ' ')} • NCERT Aligned Content
          </p>
        </motion.div>
      </div>

      <style jsx>{`
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

export default ChapterSelection;