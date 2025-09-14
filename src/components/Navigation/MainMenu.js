import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, Users, BookOpen, Settings } from 'lucide-react';

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'daily-quiz',
      title: '🎯 Daily Quiz',
      subtitle: 'For registered students (Hindi-English)',
      description: 'Uses student-specific questions',
      icon: Target,
      color: 'from-green-600 to-emerald-800',
      hoverColor: 'hover:from-green-700 hover:to-emerald-900',
      onClick: () => navigate('/daily-quiz')
    },
    {
      id: 'practice',
      title: '📚 Single Player Practice',
      subtitle: 'Practice Class 6 curriculum by subject',
      description: 'Uses NCERT-aligned questions',
      icon: BookOpen,
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'hover:from-blue-700 hover:to-blue-900',
      onClick: () => navigate('/practice')
    },
    {
      id: 'multiplayer',
      title: '⚔️ Multiplayer Challenge',
      subtitle: 'Challenge friends with Class 6 topics',
      description: 'Real-time curriculum-based battles',
      icon: Users,
      color: 'from-purple-600 to-purple-800',
      hoverColor: 'hover:from-purple-700 hover:to-purple-900',
      onClick: () => navigate('/multiplayer')
    },
    // Quiz Battle option removed - using original multiplayer component
    {
      id: 'teacher-mode',
      title: '👨‍🏫 Teacher Mode',
      subtitle: 'Coming soon - Student management',
      description: 'Track progress and create assignments',
      icon: Settings,
      color: 'from-gray-600 to-gray-800',
      hoverColor: 'hover:from-gray-700 hover:to-gray-900',
      onClick: () => {}, // Disabled
      disabled: true
    }
  ];

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
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fluence Quiz
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Challenge your knowledge, compete with friends, and become the ultimate quiz champion
          </p>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 4), duration: 0.6 }}
              whileHover={{ scale: item.disabled ? 1 : 1.02, y: item.disabled ? 0 : -5 }}
              whileTap={{ scale: item.disabled ? 1 : 0.98 }}
              onClick={item.disabled ? undefined : item.onClick}
              className={`bg-gradient-to-br ${item.color} ${item.disabled ? '' : item.hoverColor} p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 ${
                item.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-4 rounded-xl">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-200 opacity-90 mb-1">
                    {item.subtitle}
                  </p>
                  <p className="text-gray-400 text-sm opacity-75">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
            <div className="text-gray-300">Subjects Available</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
            <div className="text-gray-300">Questions to Explore</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-pink-400 mb-2">🏆</div>
            <div className="text-gray-300">Achievements to Unlock</div>
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
            Made with ❤️ for learning enthusiasts
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

export default MainMenu;