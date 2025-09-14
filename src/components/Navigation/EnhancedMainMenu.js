// src/components/Navigation/EnhancedMainMenu.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// import { dataManager } from '../../managers/DataManager'; // Temporarily disabled

// Temporary mock dataManager
const mockDataManager = {
  getUserProfile: () => {
    const saved = localStorage.getItem('fluence_user_profile');
    return saved ? JSON.parse(saved) : { id: '1', username: '', role: 'student', level: 1, xp: 0, lastActive: Date.now() };
  },
  updateUserProfile: (updates) => {
    const current = mockDataManager.getUserProfile();
    const updated = { ...current, ...updates, lastActive: Date.now() };
    localStorage.setItem('fluence_user_profile', JSON.stringify(updated));
    return updated;
  },
  checkAchievements: () => [],
  setUserRole: (role, updates) => {
    const current = mockDataManager.getUserProfile();
    const updated = { ...current, role, ...updates, lastActive: Date.now() };
    localStorage.setItem('fluence_user_profile', JSON.stringify(updated));
    return updated;
  },
  getUserStats: () => ({
    basic: {
      level: 1,
      xp: 150,
      totalQuestions: 45,
      correctAnswers: 38
    },
    streaks: {
      dailyCurrent: 3,
      dailyBest: 7,
      weeklyCurrent: 1,
      weeklyBest: 2
    },
    achievements: {
      total: 5,
      recent: []
    }
  })
};

const EnhancedMainMenu = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    const profile = mockDataManager.getUserProfile();
    setUserProfile(profile);
    
    // Check if user needs to set up profile
    if (!profile.username) {
      setShowProfileSetup(true);
    } else if (!profile.role || profile.role === '') {
      // Show role selection if role is not set
      setShowRoleSelection(true);
    }
    
    // Check for new achievements daily
    checkDailyLogin(profile);
  }, []);

  const checkDailyLogin = (profile) => {
    const today = new Date().toDateString();
    const lastActive = new Date(profile.lastActive).toDateString();
    
    if (lastActive !== today) {
      // Update daily streak and check achievements
      const updatedProfile = mockDataManager.updateUserProfile({
        lastActive: new Date().toISOString()
      });
      
              const achievements = mockDataManager.checkAchievements(updatedProfile);
      if (achievements.length > 0) {
        setNewAchievements(achievements);
      }
      
      setUserProfile(updatedProfile);
    }
  };

  const handleRoleSelection = (role, additionalData = {}) => {
    const updates = { role, ...additionalData };
    if (!showProfileSetup) {
      const updatedProfile = mockDataManager.setUserRole(role, updates);
      setUserProfile(updatedProfile);
    }
    setShowRoleSelection(false);
  };

  const handleProfileSetup = (profileData) => {
          const updatedProfile = mockDataManager.updateUserProfile({
      ...profileData,
      lastActive: new Date().toISOString()
    });
    setUserProfile(updatedProfile);
    setShowProfileSetup(false);
  };

  const getUserStats = () => {
    return mockDataManager.getUserStats();
  };

  if (showProfileSetup) {
    return <ProfileSetupModal onComplete={handleProfileSetup} />;
  }

  if (!userProfile) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  const stats = getUserStats();
  const isTeacher = userProfile.role === 'teacher';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      {/* Achievement Notifications */}
      <AnimatePresence>
        {newAchievements.map((achievement, index) => (
          <AchievementNotification
            key={achievement.id}
            achievement={achievement}
            index={index}
            onDismiss={() => setNewAchievements(prev => 
              prev.filter(a => a.id !== achievement.id)
            )}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            🎯 Fluence Quiz
          </h1>
          <p className="text-xl text-purple-200">
            {isTeacher ? 'Teacher Dashboard' : 'Learn • Play • Grow'}
          </p>
        </motion.div>

        {/* User Profile Header */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{userProfile.avatarEmoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {userProfile.username}
                </h2>
                <div className="flex items-center space-x-4 text-purple-200">
                  <span>Level {stats.basic.level}</span>
                  <span>•</span>
                  <span>{stats.basic.xp} XP</span>
                  {!isTeacher && (
                    <>
                      <span>•</span>
                      <span>🔥 {stats.streaks.dailyCurrent} day streak</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Role Switch Button */}
              <button
                onClick={() => setShowRoleSelection(true)}
                className="bg-purple-600/50 hover:bg-purple-600/70 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                {isTeacher ? '👨‍🏫 Teacher' : '🎓 Student'}
              </button>
              
              {/* Settings/Profile Button */}
              <button
                onClick={() => navigate('/profile')}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-300"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* XP Progress Bar (for students) */}
          {!isTeacher && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-200 mb-1">
                <span>Level {stats.basic.level}</span>
                <span>{stats.basic.xp} / {stats.basic.xpForNextLevel} XP</span>
              </div>
              <div className="w-full bg-purple-800/30 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.basic.xp / stats.basic.xpForNextLevel) * 100}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isTeacher ? (
            <TeacherMenuOptions 
              navigate={navigate} 
              userProfile={userProfile} 
            />
          ) : (
            <StudentMenuOptions 
              navigate={navigate} 
              stats={stats}
              userProfile={userProfile}
            />
          )}
        </div>

        {/* Quick Stats Section */}
        <motion.div
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <StatCard 
            icon="🎮" 
            label="Games Played" 
            value={stats.basic.totalGamesPlayed} 
          />
          <StatCard 
            icon="🎯" 
            label="Accuracy" 
            value={`${stats.basic.accuracyRate}%`} 
          />
          <StatCard 
            icon="🏆" 
            label="Achievements" 
            value={stats.achievements.length} 
          />
          <StatCard 
            icon="📚" 
            label="Questions" 
            value={stats.basic.totalQuestionsAnswered} 
          />
        </motion.div>
      </div>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showRoleSelection && (
          <RoleSelectionModal 
            onSelect={handleRoleSelection}
            onClose={() => setShowRoleSelection(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Student Menu Options Component
const StudentMenuOptions = ({ navigate, stats, userProfile }) => {
  const menuOptions = [
    {
      id: 'practice',
      title: '📚 Practice Mode',
      description: 'Solo learning journey',
      route: '/practice',
      color: 'from-blue-500 to-cyan-500',
      stats: `${stats.basic.totalGamesPlayed} games played`
    },
    {
      id: 'daily-quiz',
      title: '⭐ Daily Quiz',
      description: 'Fresh challenges daily',
      route: '/daily-quiz',
      color: 'from-yellow-500 to-orange-500',
      stats: `Level ${stats.basic.level}`
    },
    {
      id: 'achievements',
      title: '🏆 Achievements',
      description: 'Your accomplishments',
      route: '/achievements',
      color: 'from-purple-500 to-pink-500',
      stats: `${stats.achievements.length} unlocked`
    },
    {
      id: 'leaderboard',
      title: '🥇 Leaderboard',
      description: 'Compare with others',
      route: '/leaderboard',
      color: 'from-green-500 to-teal-500',
      stats: `${stats.basic.xp} XP`
    },
    {
      id: 'course-progress',
      title: '📈 Course Progress',
      description: 'Track your XP & levels',
      route: '/course-progress',
      color: 'from-emerald-500 to-blue-500',
      stats: 'Course XP & Levels'
    },
    {
      id: 'profile',
      title: '👤 My Profile',
      description: 'Stats and progress',
      route: '/profile',
      color: 'from-indigo-500 to-purple-500',
      stats: `🔥 ${stats.streaks.dailyCurrent} streak`
    },
    {
      id: 'multiplayer',
      title: '⚔️ Coming Soon',
      description: 'Challenge friends',
      route: '/multiplayer',
      color: 'from-red-500 to-pink-500',
      stats: 'Phase 3',
      disabled: true
    }
  ];

  return (
    <>
      {menuOptions.map((option, index) => (
        <MenuCard
          key={option.id}
          option={option}
          index={index}
          onClick={() => !option.disabled && navigate(option.route)}
        />
      ))}
    </>
  );
};

// Teacher Menu Options Component
const TeacherMenuOptions = ({ navigate, userProfile }) => {
  const menuOptions = [
    {
      id: 'dashboard',
      title: '📊 Dashboard',
      description: 'Student progress overview',
      route: '/teacher/dashboard',
      color: 'from-blue-500 to-cyan-500',
      stats: 'Analytics & Reports'
    },
    {
      id: 'students',
      title: '👥 My Students',
      description: 'Manage student progress',
      route: '/teacher/students',
      color: 'from-green-500 to-teal-500',
      stats: 'Class Management'
    },
    {
      id: 'analytics',
      title: '📈 Analytics',
      description: 'Performance insights',
      route: '/teacher/analytics',
      color: 'from-purple-500 to-pink-500',
      stats: 'Deep Insights'
    },
    {
      id: 'classes',
      title: '🏫 Classes',
      description: 'Create & manage classes',
      route: '/teacher/classes',
      color: 'from-orange-500 to-red-500',
      stats: 'Class Codes'
    },
    {
      id: 'practice',
      title: '📚 Try Quiz',
      description: 'Experience student view',
      route: '/practice',
      color: 'from-indigo-500 to-purple-500',
      stats: 'Student Mode'
    },
    {
      id: 'settings',
      title: '⚙️ Settings',
      description: 'Account & preferences',
      route: '/teacher/settings',
      color: 'from-gray-500 to-gray-600',
      stats: 'Customize'
    }
  ];

  return (
    <>
      {menuOptions.map((option, index) => (
        <MenuCard
          key={option.id}
          option={option}
          index={index}
          onClick={() => navigate(option.route)}
        />
      ))}
    </>
  );
};

// Reusable Menu Card Component
const MenuCard = ({ option, index, onClick }) => {
  return (
    <motion.div
      className={`bg-gradient-to-br ${option.color} p-6 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-300 ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl'}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      whileHover={!option.disabled ? { y: -5 } : {}}
      whileTap={!option.disabled ? { scale: 0.95 } : {}}
    >
      <h3 className="text-xl font-bold text-white mb-2">
        {option.title}
      </h3>
      <p className="text-white/80 mb-3">
        {option.description}
      </p>
      <div className="text-white/60 text-sm">
        {option.stats}
      </div>
    </motion.div>
  );
};

// Stats Card Component
const StatCard = ({ icon, label, value }) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-white font-bold text-lg">{value}</div>
      <div className="text-purple-200 text-sm">{label}</div>
    </motion.div>
  );
};

// Role Selection Modal
const RoleSelectionModal = ({ onSelect, onClose }) => {
  const [showTeacherAuth, setShowTeacherAuth] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleTeacherAuth = () => {
    // Check if credentials match Aman Raj Yadav
    if (teacherName.trim() === 'Aman Raj Yadav' && teacherPassword === 'Helloaman@1947') {
      onSelect('teacher', { teacherName: teacherName.trim() });
      setShowTeacherAuth(false);
    } else {
      setAuthError('Invalid teacher credentials. Please check your name and password.');
    }
  };

  if (showTeacherAuth) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            👨‍🏫 Teacher Login
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-2 font-semibold">
                Full Name:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                placeholder="Enter your full name..."
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-semibold">
                Password:
              </label>
              <input
                type="password"
                value={teacherPassword}
                onChange={(e) => setTeacherPassword(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                placeholder="Enter your password..."
                onKeyPress={(e) => e.key === 'Enter' && handleTeacherAuth()}
              />
            </div>

            {authError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
                {authError}
              </div>
            )}

            <button
              onClick={handleTeacherAuth}
              disabled={!teacherName.trim() || !teacherPassword.trim()}
              className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                teacherName.trim() && teacherPassword.trim()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105'
                  : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              Login as Teacher
            </button>
          </div>
          
          <button
            onClick={() => setShowTeacherAuth(false)}
            className="w-full mt-4 bg-gray-600/50 hover:bg-gray-600/70 text-white py-3 rounded-lg transition-all duration-300"
          >
            Back
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Choose Your Role
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelect('student')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-2">🎓</div>
            <div className="font-bold text-lg">Student</div>
            <div className="text-white/80 text-sm">
              Learn, play quizzes, and track progress
            </div>
          </button>
          
          <button
            onClick={() => setShowTeacherAuth(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-3xl mb-2">👨‍🏫</div>
            <div className="font-bold text-lg">Teacher</div>
            <div className="text-white/80 text-sm">
              Create classes and monitor student progress
            </div>
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-600/50 hover:bg-gray-600/70 text-white py-3 rounded-lg transition-all duration-300"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
};

// Profile Setup Modal
const ProfileSetupModal = ({ onComplete }) => {
  const [username, setUsername] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [selectedRole, setSelectedRole] = useState('student');

  const emojiOptions = ['😊', '🎓', '🚀', '⭐', '🌟', '🔥', '💎', '🏆', '🎯', '📚'];

  const handleSubmit = () => {
    if (username.trim()) {
      onComplete({
        username: username.trim(),
        avatarEmoji: selectedEmoji,
        role: selectedRole
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Welcome to Fluence Quiz!
        </h2>
        
        <div className="space-y-6">
          {/* Username Input */}
          <div>
            <label className="block text-white mb-2 font-semibold">
              Choose your username:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
              placeholder="Enter your name..."
              maxLength={20}
            />
          </div>

          {/* Emoji Selection */}
          <div>
            <label className="block text-white mb-2 font-semibold">
              Pick your avatar:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-3 rounded-lg transition-all duration-300 ${
                    selectedEmoji === emoji
                      ? 'bg-purple-500 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-white mb-2 font-semibold">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedRole('student')}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  selectedRole === 'student'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <div className="text-2xl mb-1">🎓</div>
                <div className="font-semibold">Student</div>
              </button>
              
              <button
                onClick={() => setSelectedRole('teacher')}
                className={`p-4 rounded-lg transition-all duration-300 ${
                  selectedRole === 'teacher'
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <div className="text-2xl mb-1">👨‍🏫</div>
                <div className="font-semibold">Teacher</div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!username.trim()}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              username.trim()
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105'
                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Learning! 🚀
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Achievement Notification Component
const AchievementNotification = ({ achievement, index, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000 + (index * 1000)); // Stagger dismissals

    return () => clearTimeout(timer);
  }, [onDismiss, index]);

  return (
    <motion.div
      className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.5 }}
      style={{ top: `${4 + (index * 80)}px` }}
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{achievement.icon}</div>
        <div>
          <div className="font-bold">🎉 Achievement Unlocked!</div>
          <div className="text-sm">{achievement.title}</div>
          <div className="text-xs text-yellow-100">
            +{achievement.xpReward} XP
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-white/70 hover:text-white ml-auto"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export default EnhancedMainMenu;