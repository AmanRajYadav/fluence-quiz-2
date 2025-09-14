// src/components/Student/CourseProgress.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { STUDENTS, getStudentByName, initializeAllStudentProgress } from '../../config/students';
import { WORLDS, STAGES, TROPHY_MILESTONES, GIFT_LEVELS, LEVEL_DETAILS, getWorldByLevel, getStageByLevel, getAvailableTrophies, getNextTrophy, isGiftLevel, getLevelProgress } from '../../config/courseStructure';

// Mock data manager for course progress
const mockDataManager = {
  getUserProfile: () => {
    const saved = localStorage.getItem('fluence_user_profile');
    return saved ? JSON.parse(saved) : null;
  },
  
  getCourseProgress: (studentName) => {
    // Ensure all students are initialized
    initializeAllStudentProgress();
    
    const saved = localStorage.getItem(`fluence_course_progress_${studentName}`);
    if (saved) {
      const progress = JSON.parse(saved);
      // Ensure student ID is set
      const student = getStudentByName(studentName);
      if (student && !progress.studentId) {
        progress.studentId = student.id;
        localStorage.setItem(`fluence_course_progress_${studentName}`, JSON.stringify(progress));
      }
      return progress;
    }
    
    // If no saved data, get from initialization
    const student = getStudentByName(studentName);
    if (student) {
      const saved = localStorage.getItem(`fluence_course_progress_${studentName}`);
      return saved ? JSON.parse(saved) : null;
    }
    
    return null;
  },
  
  updateCourseProgress: (studentName, updates) => {
    const current = mockDataManager.getCourseProgress(studentName);
    const updated = { 
      ...current, 
      ...updates, 
      lastUpdated: new Date().toISOString() 
    };
    localStorage.setItem(`fluence_course_progress_${studentName}`, JSON.stringify(updated));
    return updated;
  }
};

// Course structure with levels and XP requirements
const courseStructure = [
  { level: 1, name: 'Getting Started', xpRequired: 50, subject: 'mathematics' },
  { level: 2, name: 'Basic Operations', xpRequired: 100, subject: 'mathematics' },
  { level: 3, name: 'Number Patterns', xpRequired: 150, subject: 'mathematics' },
  { level: 4, name: 'Fractions & Decimals', xpRequired: 200, subject: 'mathematics' },
  { level: 5, name: 'Geometry Basics', xpRequired: 250, subject: 'mathematics' },
  { level: 6, name: 'Matter & Energy', xpRequired: 300, subject: 'science' },
  { level: 7, name: 'Living Things', xpRequired: 350, subject: 'science' },
  { level: 8, name: 'Forces & Motion', xpRequired: 400, subject: 'science' },
  { level: 9, name: 'Earth & Space', xpRequired: 450, subject: 'science' },
  { level: 10, name: 'Ecosystems', xpRequired: 500, subject: 'science' },
  { level: 11, name: 'Reading Skills', xpRequired: 550, subject: 'english' },
  { level: 12, name: 'Grammar Master', xpRequired: 600, subject: 'english' },
  { level: 13, name: 'Creative Writing', xpRequired: 650, subject: 'english' },
  { level: 14, name: 'Literature Explorer', xpRequired: 700, subject: 'english' },
  { level: 15, name: 'Communication Expert', xpRequired: 750, subject: 'english' },
  { level: 16, name: 'Hindi Basics', xpRequired: 800, subject: 'hindi' },
  { level: 17, name: 'Hindi Literature', xpRequired: 850, subject: 'hindi' },
  { level: 18, name: 'Hindi Mastery', xpRequired: 900, subject: 'hindi' },
  { level: 19, name: 'Social Studies', xpRequired: 950, subject: 'social-science' },
  { level: 20, name: 'Course Master', xpRequired: 1000, subject: 'social-science' }
];

const CourseProgress = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');

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

  const getNextLevel = () => {
    if (!progress) return null;
    return courseStructure.find(level => level.xpRequired > progress.courseXP);
  };

  const getCompletedLevels = () => {
    if (!progress) return [];
    return courseStructure.filter(level => level.xpRequired <= progress.courseXP);
  };

  const getXPProgress = () => {
    if (!progress) return { current: 0, next: 0, percentage: 0 };
    
    const nextLevel = getNextLevel();
    if (!nextLevel) {
      return { current: progress.courseXP, next: 1000, percentage: 100 };
    }
    
    const completedLevels = getCompletedLevels();
    const lastCompletedXP = completedLevels.length > 0 
      ? completedLevels[completedLevels.length - 1].xpRequired 
      : 0;
    
    const currentLevelProgress = progress.courseXP - lastCompletedXP;
    const levelXPRange = nextLevel.xpRequired - lastCompletedXP;
    const percentage = levelXPRange > 0 ? (currentLevelProgress / levelXPRange) * 100 : 0;
    
    return {
      current: progress.courseXP,
      next: nextLevel.xpRequired,
      percentage: Math.max(0, Math.min(100, percentage))
    };
  };

  const getSubjectIcon = (subject) => {
    const icons = {
      mathematics: '🔢',
      science: '🔬',
      english: '📚',
      hindi: '🇮🇳',
      'social-science': '🌍'
    };
    return icons[subject] || '📖';
  };

  if (!userProfile || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading course progress...</div>
      </div>
    );
  }

  const xpProgress = getXPProgress();
  const nextLevel = getNextLevel();
  const completedLevels = getCompletedLevels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">📈 Course Progress</h1>
              <p className="text-purple-200">Track your learning journey, {userProfile.username}!</p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🏠 Back Home
            </button>
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
            value={progress.courseXP}
            subtitle={`/ ${courseStructure[courseStructure.length - 1].xpRequired}`}
            color="from-yellow-500 to-orange-500"
          />
          
          <OverviewCard
            icon="🏆"
            title="Levels Completed"
            value={completedLevels.length}
            subtitle={`/ ${courseStructure.length}`}
            color="from-green-500 to-emerald-500"
          />
          
          <OverviewCard
            icon="🎯"
            title="Current Level"
            value={completedLevels.length + 1}
            subtitle={nextLevel ? nextLevel.name : 'Course Complete!'}
            color="from-blue-500 to-cyan-500"
          />
          
          <OverviewCard
            icon="🔥"
            title="Streak"
            value={progress.streakDays}
            subtitle="days"
            color="from-red-500 to-pink-500"
          />
        </motion.div>

        {/* XP Progress Bar */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🚀 XP Progress</h2>
            {nextLevel && (
              <div className="text-purple-200 text-sm">
                Next: {nextLevel.name} ({nextLevel.xpRequired} XP)
              </div>
            )}
          </div>
          
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-6">
              <motion.div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-6 rounded-full flex items-center justify-center"
                style={{ width: `${xpProgress.percentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {xpProgress.percentage > 20 && (
                  <span className="text-white font-bold text-sm">
                    {xpProgress.current} XP
                  </span>
                )}
              </motion.div>
            </div>
            
            {xpProgress.percentage <= 20 && (
              <div className="absolute -top-8 left-2 text-white font-bold text-sm">
                {xpProgress.current} XP
              </div>
            )}
          </div>
        </motion.div>

        {/* Subject Filter */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedSubject === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              📚 All Subjects
            </button>
            
            {Object.entries(progress.subjects).map(([subject, data]) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubject === subject
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {getSubjectIcon(subject)} {subject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Course Path */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">🛤️ Learning Path</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courseStructure
              .filter(level => selectedSubject === 'all' || level.subject === selectedSubject)
              .map((level, index) => {
                const isCompleted = progress.courseXP >= level.xpRequired;
                const isCurrent = nextLevel && level.level === nextLevel.level;
                
                return (
                  <LevelCard
                    key={level.level}
                    level={level}
                    isCompleted={isCompleted}
                    isCurrent={isCurrent}
                    index={index}
                    subjectIcon={getSubjectIcon(level.subject)}
                  />
                );
              })}
          </div>
          
          {selectedSubject !== 'all' && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-bold mb-2">
                {getSubjectIcon(selectedSubject)} {selectedSubject.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Progress
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{progress.subjects[selectedSubject]?.xp || 0}</div>
                  <div className="text-sm text-purple-200">XP Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{progress.subjects[selectedSubject]?.levelsCompleted || 0}</div>
                  <div className="text-sm text-purple-200">Levels Done</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{progress.subjects[selectedSubject]?.totalLevels || 0}</div>
                  <div className="text-sm text-purple-200">Total Levels</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Overview Card Component
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

// Level Card Component
const LevelCard = ({ level, isCompleted, isCurrent, index, subjectIcon }) => (
  <motion.div
    className={`p-4 rounded-lg border-2 transition-all ${
      isCompleted 
        ? 'bg-green-500/20 border-green-400 text-green-200'
        : isCurrent
        ? 'bg-yellow-500/20 border-yellow-400 text-yellow-200'
        : 'bg-white/5 border-white/20 text-purple-200'
    }`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="text-xl">{subjectIcon}</div>
      <div className="text-lg font-bold">#{level.level}</div>
    </div>
    
    <div className="mb-2">
      <h3 className="font-medium text-sm">{level.name}</h3>
      <p className="text-xs opacity-75">{level.xpRequired} XP required</p>
    </div>
    
    <div className={`text-xs font-bold text-center py-1 px-2 rounded ${
      isCompleted 
        ? 'bg-green-600 text-white'
        : isCurrent
        ? 'bg-yellow-600 text-white'
        : 'bg-gray-600 text-gray-300'
    }`}>
      {isCompleted ? '✓ Complete' : isCurrent ? '⚡ Current' : '🔒 Locked'}
    </div>
  </motion.div>
);

export default CourseProgress;