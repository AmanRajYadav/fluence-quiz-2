import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { getAllClasses } from '../../data/curriculum/class6-structure';

const ClassSelection = ({ mode = 'practice' }) => {
  const navigate = useNavigate();
  const classes = getAllClasses();

  const handleClassSelect = (classInfo) => {
    if (!classInfo.isActive) {
      // Show coming soon message for inactive classes
      return;
    }

    // Pass simple strings via URL parameters, not objects
    const searchParams = new URLSearchParams({
      class: classInfo.id,
      mode: mode
    });
    
    navigate(`/${mode}/subject-selection?${searchParams.toString()}`);
  };

  const handleBack = () => {
    navigate('/');
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
            Back to Main Menu
          </button>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Select Your Class
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {mode === 'practice' 
              ? 'Choose your class to start learning' 
              : 'Choose your class for multiplayer challenge'
            }
          </p>
        </motion.div>

        {/* Class Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {classes.map((classInfo, index) => (
            <motion.div
              key={classInfo.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 3), duration: 0.6 }}
              whileHover={{ scale: classInfo.isActive ? 1.02 : 1, y: classInfo.isActive ? -5 : 0 }}
              whileTap={{ scale: classInfo.isActive ? 0.98 : 1 }}
              onClick={() => handleClassSelect(classInfo)}
              className={`relative p-8 rounded-2xl shadow-2xl cursor-pointer border transition-all duration-300 ${
                classInfo.isActive
                  ? 'bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 border-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-br from-gray-600 to-gray-800 border-gray-500/20 backdrop-blur-sm cursor-not-allowed opacity-75'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {classInfo.isActive ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Clock className="w-6 h-6 text-yellow-400" />
                )}
              </div>

              {/* Class Icon/Number */}
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${
                classInfo.isActive 
                  ? 'bg-white/20' 
                  : 'bg-gray-400/20'
              }`}>
                <span className="text-3xl font-bold text-white">
                  {classInfo.id}
                </span>
              </div>

              {/* Class Info */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {classInfo.name}
                </h3>
                <p className={`leading-relaxed ${
                  classInfo.isActive ? 'text-gray-200' : 'text-gray-400'
                }`}>
                  {classInfo.description}
                </p>
              </div>

              {/* Status */}
              {classInfo.isActive ? (
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-300 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Available Now</span>
                  </div>
                  <p className="text-green-200 text-sm mt-1">
                    Full curriculum ready
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-300 font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>Coming Soon</span>
                  </div>
                  <p className="text-yellow-200 text-sm mt-1">
                    Curriculum in development
                  </p>
                </div>
              )}

              {/* Subjects Preview for inactive classes */}
              {!classInfo.isActive && classInfo.subjects && (
                <div className="mt-4 pt-4 border-t border-gray-600/30">
                  <p className="text-gray-400 text-sm font-semibold mb-2">Planned Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {classInfo.subjects.map((subject, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <BookOpen className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">NCERT Aligned</h3>
            <div className="text-gray-300 text-sm">
              Based on official NCERT curriculum
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Chapter-wise</h3>
            <div className="text-gray-300 text-sm">
              Organized by subjects and chapters
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <Award className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Progressive</h3>
            <div className="text-gray-300 text-sm">
              Builds knowledge step by step
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm">
            More classes coming soon! Currently featuring Class 6 with full NCERT coverage.
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

export default ClassSelection;