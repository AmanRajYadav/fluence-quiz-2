// src/components/Student/EnhancedCourseProgress.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RoleSwitcher from '../Navigation/RoleSwitcher';
import { getStudentByName, getCourseById } from '../../config/students';
import { WORLDS, STAGES, getAvailableTrophies, getNextTrophy, isGiftLevel, getLevelProgress } from '../../config/courseStructure';

// Mock data manager for enhanced course progress
const mockDataManager = {
  getUserProfile: () => {
    const saved = localStorage.getItem('fluence_user_profile');
    return saved ? JSON.parse(saved) : null;
  },
  
  getCourseProgress: (studentName) => {
    const progressKey = `fluence_course_progress_${studentName}`;
    const saved = localStorage.getItem(progressKey);
    
    if (saved) {
      const progress = JSON.parse(saved);
      // Ensure student ID is set
      const student = getStudentByName(studentName);
      if (student && !progress.studentId) {
        progress.studentId = student.id;
      }
      
      // Migrate old format if needed
      if (!progress.completedLevels) {
        progress.completedLevels = [];
        progress.totalLevels = 100;
        progress.currentWorld = 1;
        progress.currentStage = 1;
        progress.trophies = [];
        progress.certificates = [];
        progress.gifts = [];
        progress.courseMapLink = '';
        
        // Calculate completed levels based on XP
        const maxLevel = getLevelProgress(progress.courseXP || 0);
        for (let i = 1; i <= maxLevel; i++) {
          progress.completedLevels.push(i);
        }
        
        // Set initial values for specific students
        if (studentName === 'Anaya') {
          progress.courseXP = 5170;
          progress.completedLevels = Array.from({length: 52}, (_, i) => i + 1); // Level 52 based on XP
          progress.currentWorld = 6;
          progress.currentStage = 2;
          progress.trophies = ['🥉'];
          progress.certificates = ['Bronze Achievement Certificate'];
        } else if (studentName === 'Kavya') {
          progress.courseXP = 1790;
          progress.completedLevels = Array.from({length: 18}, (_, i) => i + 1); // Level 18 based on XP
          progress.currentWorld = 2;
          progress.currentStage = 1;
        }
        
        localStorage.setItem(progressKey, JSON.stringify(progress));
      }
      
      return progress;
    }
    
    // Create initial progress for new students
    const student = getStudentByName(studentName);
    if (student) {
      const initialProgress = {
        studentId: student.id,
        studentName: studentName,
        enrolledCourse: student.enrolledCourse,
        courseXP: 0,
        totalLevels: 100,
        completedLevels: [],
        currentWorld: 1,
        currentStage: 1,
        trophies: [],
        certificates: [],
        gifts: [],
        courseMapLink: '',
        lastUpdated: new Date().toISOString()
      };
      
      // Set specific values for existing students
      if (studentName === 'Anaya') {
        initialProgress.courseXP = 5170;
        initialProgress.completedLevels = Array.from({length: 52}, (_, i) => i + 1);
        initialProgress.currentWorld = 6;
        initialProgress.currentStage = 2;
        initialProgress.trophies = ['🥉'];
        initialProgress.certificates = ['Bronze Achievement Certificate'];
        initialProgress.gifts = ['Level 10 Gift', 'Level 20 Gift', 'Level 30 Gift', 'Level 40 Gift', 'Level 50 Gift'];
      } else if (studentName === 'Kavya') {
        initialProgress.courseXP = 1790;
        initialProgress.completedLevels = Array.from({length: 18}, (_, i) => i + 1);
        initialProgress.currentWorld = 2;
        initialProgress.currentStage = 1;
        initialProgress.gifts = ['Level 10 Gift'];
      }
      
      localStorage.setItem(progressKey, JSON.stringify(initialProgress));
      return initialProgress;
    }
    
    return null;
  },
  
  updateCourseProgress: (studentName, updates) => {
    const current = mockDataManager.getCourseProgress(studentName);
    if (current) {
      const updated = { 
        ...current, 
        ...updates, 
        lastUpdated: new Date().toISOString() 
      };
      localStorage.setItem(`fluence_course_progress_${studentName}`, JSON.stringify(updated));
      return updated;
    }
    return null;
  },
  
  toggleLevel: (studentName, level) => {
    const current = mockDataManager.getCourseProgress(studentName);
    if (current) {
      const completedLevels = [...current.completedLevels];
      const index = completedLevels.indexOf(level);
      
      if (index > -1) {
        completedLevels.splice(index, 1);
      } else {
        completedLevels.push(level);
        completedLevels.sort((a, b) => a - b);
      }
      
      return mockDataManager.updateCourseProgress(studentName, { completedLevels });
    }
    return null;
  }
};

const EnhancedCourseProgress = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [showWorldView, setShowWorldView] = useState(false);
  const [showCourseMap, setShowCourseMap] = useState(false);

  useEffect(() => {
    const profile = mockDataManager.getUserProfile();
    if (!profile || profile.role !== 'student') {
      navigate('/');
      return;
    }
    
    setUserProfile(profile);
    const courseProgress = mockDataManager.getCourseProgress(profile.username);
    setProgress(courseProgress);
  }, [navigate]);

  const handleLevelToggle = (level) => {
    const updated = mockDataManager.toggleLevel(userProfile.username, level);
    if (updated) {
      setProgress(updated);
    }
  };

  const handleRoleSwitch = (newRole, profile = null) => {
    if (newRole === 'logout') {
      navigate('/');
    } else if (newRole === 'home') {
      navigate('/');
    } else if (newRole === 'teacher') {
      navigate('/teacher');
    } else if (newRole === 'student') {
      // Refresh current page for new student
      navigate('/course-progress');
    }
  };

  if (!userProfile || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading course progress...</div>
      </div>
    );
  }

  const availableTrophies = getAvailableTrophies(progress.courseXP);
  const nextTrophy = getNextTrophy(progress.courseXP);
  const completedPercentage = (progress.completedLevels.length / 100) * 100;
  const currentWorldData = WORLDS.find(w => w.id === progress.currentWorld);
  const currentStageData = progress.currentStage === 1 ? STAGES.STAGE_1 : STAGES.STAGE_2;
  const enrolledCourse = getCourseById(progress.enrolledCourse);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logout */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">📈 Course Progress</h1>
                {enrolledCourse && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${enrolledCourse.color}`}>
                    {enrolledCourse.icon} {enrolledCourse.name}
                  </span>
                )}
              </div>
              <p className="text-purple-200">Track your learning journey, {userProfile.username}!</p>
              {enrolledCourse && (
                <p className="text-purple-300 text-sm">{enrolledCourse.description}</p>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🏠 Home
              </button>
              
              <button
                onClick={() => setShowCourseMap(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🗺️ Course Map
              </button>
              
              <RoleSwitcher 
                currentRole="student" 
                onSwitch={handleRoleSwitch}
              />
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <OverviewCard
            icon="⚡"
            title="Course XP"
            value={progress.courseXP.toLocaleString()}
            subtitle="Experience Points"
            color="from-yellow-500 to-orange-500"
          />
          
          <OverviewCard
            icon="🏆"
            title="Levels Completed"
            value={progress.completedLevels.length}
            subtitle={`/ 100 levels (${completedPercentage.toFixed(1)}%)`}
            color="from-green-500 to-emerald-500"
          />
          
          <OverviewCard
            icon={currentWorldData?.theme || '🌟'}
            title="Current World"
            value={`World ${progress.currentWorld}`}
            subtitle={currentWorldData?.name || 'Unknown World'}
            color="from-blue-500 to-cyan-500"
          />
          
          <OverviewCard
            icon="🎭"
            title="Current Stage"
            value={`Stage ${progress.currentStage}`}
            subtitle={currentStageData?.name || 'Unknown Stage'}
            color="from-purple-500 to-pink-500"
          />
        </motion.div>

        {/* Trophies Section */}
        {availableTrophies.length > 0 && (
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">🏆 Your Trophies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableTrophies.map((trophy, index) => (
                <TrophyCard key={index} trophy={trophy} />
              ))}
            </div>
            
            {nextTrophy && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-bold mb-2">Next Trophy: {nextTrophy.name}</h3>
                <div className="w-full bg-white/20 rounded-full h-4">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full flex items-center justify-center"
                    style={{ width: `${Math.min((progress.courseXP / nextTrophy.xp) * 100, 100)}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((progress.courseXP / nextTrophy.xp) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <span className="text-white text-xs font-bold">
                      {progress.courseXP} / {nextTrophy.xp.toLocaleString()} XP
                    </span>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* World Overview */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">🌍 Worlds Overview</h2>
            <button
              onClick={() => setShowWorldView(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📋 View All Levels
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {WORLDS.map((world, index) => {
              const worldCompletedLevels = world.levels.filter(level => 
                progress.completedLevels.includes(level)
              ).length;
              const worldProgress = (worldCompletedLevels / world.levels.length) * 100;
              const isCurrentWorld = world.id === progress.currentWorld;
              
              return (
                <WorldCard
                  key={world.id}
                  world={world}
                  progress={worldProgress}
                  completedLevels={worldCompletedLevels}
                  isCurrent={isCurrentWorld}
                  onClick={() => setSelectedWorld(world)}
                  index={index}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Gifts and Achievements */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🎁 Gifts Earned</h2>
            {progress.gifts && progress.gifts.length > 0 ? (
              <div className="space-y-2">
                {progress.gifts.map((gift, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 text-white">
                    🎁 {gift}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-purple-200 text-center py-4">
                Complete levels 10, 20, 30... to earn gifts!
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🏅 Certificates</h2>
            {progress.certificates && progress.certificates.length > 0 ? (
              <div className="space-y-2">
                {progress.certificates.map((cert, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 text-white">
                    🏅 {cert}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-purple-200 text-center py-4">
                Earn trophies to receive certificates!
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* World Detail Modal */}
      <AnimatePresence>
        {selectedWorld && (
          <WorldDetailModal
            world={selectedWorld}
            completedLevels={progress.completedLevels}
            onToggleLevel={handleLevelToggle}
            onClose={() => setSelectedWorld(null)}
          />
        )}
      </AnimatePresence>

      {/* All Levels View Modal */}
      <AnimatePresence>
        {showWorldView && (
          <AllLevelsModal
            progress={progress}
            onToggleLevel={handleLevelToggle}
            onClose={() => setShowWorldView(false)}
          />
        )}
      </AnimatePresence>

      {/* Course Map Modal */}
      <AnimatePresence>
        {showCourseMap && (
          <CourseMapModal
            mapLink={progress.courseMapLink}
            onClose={() => setShowCourseMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Component definitions for cards and modals
const OverviewCard = ({ icon, title, value, subtitle, color }) => (
  <motion.div
    className={`bg-gradient-to-r ${color} p-6 rounded-xl text-white shadow-lg`}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-xs opacity-75">{subtitle}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </motion.div>
);

const TrophyCard = ({ trophy }) => (
  <motion.div
    className="bg-white/10 rounded-lg p-4 text-center"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="text-4xl mb-2">{trophy.icon}</div>
    <div className="text-white font-bold text-sm">{trophy.name}</div>
    <div className="text-purple-200 text-xs">{trophy.xp.toLocaleString()} XP</div>
  </motion.div>
);

const WorldCard = ({ world, progress, completedLevels, isCurrent, onClick, index }) => (
  <motion.div
    className={`p-4 rounded-lg cursor-pointer transition-all ${
      isCurrent 
        ? 'bg-yellow-500/20 border-2 border-yellow-400' 
        : 'bg-white/10 hover:bg-white/15'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="text-2xl mb-2">{world.theme}</div>
    <div className="text-white font-bold text-sm mb-1">World {world.id}</div>
    <div className="text-purple-200 text-xs mb-2">{world.name}</div>
    <div className="w-full bg-white/20 rounded-full h-2">
      <motion.div
        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
      />
    </div>
    <div className="text-xs text-purple-200 mt-1">{completedLevels}/10</div>
  </motion.div>
);

// Additional modal components would go here...
// For brevity, I'll create placeholder components

const WorldDetailModal = ({ world, completedLevels, onToggleLevel, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{world.theme} {world.name}</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300 text-xl">✕</button>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {world.levels.map(level => (
          <LevelCheckbox
            key={level}
            level={level}
            completed={completedLevels.includes(level)}
            onToggle={() => onToggleLevel(level)}
            isGift={isGiftLevel(level)}
          />
        ))}
      </div>
    </motion.div>
  </motion.div>
);

const AllLevelsModal = ({ progress, onToggleLevel, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">📋 All 100 Levels</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300 text-xl">✕</button>
      </div>
      
      {WORLDS.map(world => (
        <div key={world.id} className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3">{world.theme} {world.name}</h3>
          <div className="grid grid-cols-10 gap-2">
            {world.levels.map(level => (
              <LevelCheckbox
                key={level}
                level={level}
                completed={progress.completedLevels.includes(level)}
                onToggle={() => onToggleLevel(level)}
                isGift={isGiftLevel(level)}
              />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  </motion.div>
);

const LevelCheckbox = ({ level, completed, onToggle, isGift }) => (
  <motion.div
    className={`w-12 h-12 rounded-lg border-2 cursor-pointer flex items-center justify-center text-sm font-bold transition-all ${
      completed 
        ? isGift 
          ? 'bg-yellow-500 border-yellow-400 text-white' 
          : 'bg-green-500 border-green-400 text-white'
        : 'bg-white/10 border-white/30 text-purple-200 hover:bg-white/20'
    }`}
    onClick={onToggle}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {completed ? (isGift ? '🎁' : '✓') : level}
  </motion.div>
);

const CourseMapModal = ({ mapLink, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">🗺️ Course Map</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300 text-xl">✕</button>
      </div>
      
      {mapLink ? (
        <div className="space-y-4">
          <p className="text-purple-200">Access your detailed course roadmap:</p>
          <button
            onClick={() => window.open(mapLink, '_blank')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          >
            🗺️ Open Course Map
          </button>
        </div>
      ) : (
        <div className="text-center py-8 text-purple-200">
          <div className="text-4xl mb-4">🗺️</div>
          <p>Course map will be available soon!</p>
          <p className="text-sm">Your teacher will provide the link.</p>
        </div>
      )}
    </motion.div>
  </motion.div>
);

export default EnhancedCourseProgress;