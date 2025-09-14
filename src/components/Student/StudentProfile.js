// src/components/Student/StudentProfile.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock subjects data
const SUBJECTS = {
  mathematics: { id: 'mathematics', name: 'Mathematics', icon: '🔢', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  science: { id: 'science', name: 'Science', icon: '🔬', color: 'bg-gradient-to-r from-green-500 to-teal-500' },
  english: { id: 'english', name: 'English', icon: '📚', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  history: { id: 'history', name: 'History', icon: '🏛️', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
  geography: { id: 'geography', name: 'Geography', icon: '🌍', color: 'bg-gradient-to-r from-green-600 to-blue-500' }
};

// Mock data manager to replace the real one
const mockDataManager = {
  getUserProfile: () => {
    const saved = localStorage.getItem('fluence_user_profile');
    return saved ? JSON.parse(saved) : { 
      id: '1', 
      username: 'Student User', 
      role: 'student', 
      level: 1, 
      xp: 0, 
      lastActive: Date.now(),
      avatarEmoji: '🎓',
      classCode: null,
      dailyStreaks: { streakDates: [] }
    };
  },
  updateUserProfile: (updates) => {
    const current = mockDataManager.getUserProfile();
    const updated = { ...current, ...updates, lastActive: Date.now() };
    localStorage.setItem('fluence_user_profile', JSON.stringify(updated));
    return updated;
  },
  getUserStats: () => {
    const profile = mockDataManager.getUserProfile();
    return {
      basic: {
        level: profile.level || 1,
        xp: profile.xp || 150,
        xpForNextLevel: 300,
        totalQuestionsAnswered: 85,
        totalGamesPlayed: 12,
        accuracyRate: 78
      },
      streaks: {
        current: 5,
        max: 12,
        dailyCurrent: 3,
        dailyMax: 7
      },
      subjects: {
        mathematics: {
          gamesPlayed: 5,
          averageScore: 82,
          bestScore: 95,
          xpEarned: 120
        },
        science: {
          gamesPlayed: 3,
          averageScore: 75,
          bestScore: 88,
          xpEarned: 90
        },
        english: {
          gamesPlayed: 4,
          averageScore: 68,
          bestScore: 78,
          xpEarned: 85
        }
      },
      achievements: [
        {
          id: 'first_game',
          title: 'First Steps',
          description: 'Complete your first quiz',
          icon: '🎯',
          xpReward: 10,
          unlockedAt: Date.now() - 86400000
        },
        {
          id: 'streak_3',
          title: 'Getting Warmed Up',
          description: 'Maintain a 3-day streak',
          icon: '🔥',
          xpReward: 25,
          unlockedAt: Date.now() - 43200000
        }
      ],
      recentGames: [
        {
          id: 1,
          subject: 'mathematics',
          chapter: 'Algebra Basics',
          score: 85,
          totalQuestions: 10,
          correctAnswers: 8,
          xpGained: 25,
          completedAt: Date.now() - 3600000
        },
        {
          id: 2,
          subject: 'science',
          chapter: 'Cell Biology',
          score: 70,
          totalQuestions: 10,
          correctAnswers: 7,
          xpGained: 20,
          completedAt: Date.now() - 7200000
        },
        {
          id: 3,
          subject: 'english',
          chapter: 'Grammar Rules',
          score: 90,
          totalQuestions: 10,
          correctAnswers: 9,
          xpGained: 30,
          completedAt: Date.now() - 10800000
        }
      ]
    };
  },
  getAchievementsConfig: () => ({
    first_game: {
      title: 'First Steps',
      description: 'Complete your first quiz',
      icon: '🎯',
      xpReward: 10
    },
    streak_3: {
      title: 'Getting Warmed Up', 
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      xpReward: 25
    },
    streak_7: {
      title: 'Weekly Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🏆',
      xpReward: 50
    },
    perfect_score: {
      title: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '⭐',
      xpReward: 40
    },
    math_master: {
      title: 'Math Master',
      description: 'Complete 10 math quizzes',
      icon: '🔢',
      xpReward: 75
    },
    speed_demon: {
      title: 'Speed Demon',
      description: 'Complete a quiz in under 2 minutes',
      icon: '⚡',
      xpReward: 35
    }
  })
};

const StudentProfile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const profile = mockDataManager.getUserProfile();
    const stats = mockDataManager.getUserStats();
    
    setUserProfile(profile);
    setUserStats(stats);
  };

  const handleEditProfile = (updates) => {
    const updatedProfile = mockDataManager.updateUserProfile(updates);
    setUserProfile(updatedProfile);
    setUserStats(mockDataManager.getUserStats());
    setShowEditProfile(false);
  };

  if (!userProfile || !userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <p className="text-purple-200">Track your learning journey</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditProfile(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ✏️ Edit Profile
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🏠 Back Home
              </button>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar & Basic Info */}
            <div className="text-center md:text-left">
              <div className="text-8xl mb-4">{userProfile.avatarEmoji}</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {userProfile.username}
              </h2>
              <div className="space-y-1 text-purple-200">
                <p>Level {userStats.basic.level}</p>
                <p>{userStats.basic.xp} XP</p>
                {userProfile.classCode && (
                  <p className="text-yellow-300">
                    Class: {userProfile.classCode}
                  </p>
                )}
              </div>
            </div>

            {/* Level Progress */}
            <div className="flex-1 w-full md:w-auto">
              <div className="mb-4">
                <div className="flex justify-between text-sm text-purple-200 mb-2">
                  <span>Level {userStats.basic.level}</span>
                  <span>Level {userStats.basic.level + 1}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full relative overflow-hidden"
                    style={{
                      width: `${(userStats.basic.xp / userStats.basic.xpForNextLevel) * 100}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(userStats.basic.xp / userStats.basic.xpForNextLevel) * 100}%`
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <p className="text-center text-xs text-purple-300 mt-1">
                  {userStats.basic.xpForNextLevel - userStats.basic.xp} XP to next level
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userStats.basic.totalGamesPlayed}
                  </div>
                  <div className="text-xs text-purple-200">Games</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userStats.basic.accuracyRate}%
                  </div>
                  <div className="text-xs text-purple-200">Accuracy</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {userStats.streaks.dailyCurrent}
                  </div>
                  <div className="text-xs text-purple-200">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'subjects', label: '📚 Subjects', icon: '📚' },
              { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
              { id: 'history', label: '📋 History', icon: '📋' },
              { id: 'streaks', label: '🔥 Streaks', icon: '🔥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-white/20 text-white scale-105'
                    : 'bg-white/10 text-purple-200 hover:bg-white/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <OverviewTab 
              userStats={userStats} 
              userProfile={userProfile} 
            />
          )}
          
          {selectedTab === 'subjects' && (
            <SubjectsTab 
              userStats={userStats} 
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
            />
          )}
          
          {selectedTab === 'achievements' && (
            <AchievementsTab achievements={userStats.achievements} />
          )}
          
          {selectedTab === 'history' && (
            <HistoryTab history={userStats.recentGames} />
          )}
          
          {selectedTab === 'streaks' && (
            <StreaksTab streaks={userStats.streaks} userProfile={userProfile} />
          )}
        </AnimatePresence>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <EditProfileModal
            userProfile={userProfile}
            onSave={handleEditProfile}
            onClose={() => setShowEditProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ userStats, userProfile }) => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="🎯"
          title="Total Questions"
          value={userStats.basic.totalQuestionsAnswered}
          subtitle="answered correctly"
        />
        
        <StatCard
          icon="⚡"
          title="Best Streak"
          value={userStats.streaks.max}
          subtitle="consecutive correct"
        />
        
        <StatCard
          icon="📈"
          title="Current Level"
          value={userStats.basic.level}
          subtitle={`${userStats.basic.xp} XP total`}
        />
        
        <StatCard
          icon="🔥"
          title="Daily Streak"
          value={userStats.streaks.dailyCurrent}
          subtitle="days in a row"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">📈 Recent Performance</h3>
        
        {userStats.recentGames.length === 0 ? (
          <div className="text-center py-8 text-purple-200">
            <div className="text-4xl mb-4">🎯</div>
            <p>No quizzes played yet!</p>
            <p className="text-sm">Start your learning journey</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userStats.recentGames.slice(0, 5).map((game, index) => (
              <RecentGameItem key={game.id || index} game={game} />
            ))}
          </div>
        )}
      </div>

      {/* Subject Overview */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">📚 Subject Mastery</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(userStats.subjects).map(([subjectId, stats]) => {
            const subject = Object.values(SUBJECTS).find(s => s.id === subjectId);
            if (!subject || stats.gamesPlayed === 0) return null;
            
            return (
              <SubjectMasteryCard
                key={subjectId}
                subject={subject}
                stats={stats}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Subjects Tab Component
const SubjectsTab = ({ userStats, selectedSubject, onSubjectChange }) => {
  const subjects = Object.entries(userStats.subjects)
    .filter(([_, stats]) => stats.gamesPlayed > 0)
    .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Subject Selector */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => onSubjectChange('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedSubject === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-purple-200 hover:bg-white/15'
            }`}
          >
            All Subjects
          </button>
          
          {subjects.map(([subjectId]) => {
            const subject = Object.values(SUBJECTS).find(s => s.id === subjectId);
            return (
              <button
                key={subjectId}
                onClick={() => onSubjectChange(subjectId)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedSubject === subjectId
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/15'
                }`}
              >
                <span>{subject?.icon}</span>
                <span>{subject?.name}</span>
              </button>
            );
          })}
        </div>

        {/* Subject Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedSubject === 'all' ? subjects : subjects.filter(([id]) => id === selectedSubject))
            .map(([subjectId, stats]) => {
              const subject = Object.values(SUBJECTS).find(s => s.id === subjectId);
              return (
                <DetailedSubjectCard
                  key={subjectId}
                  subject={subject}
                  stats={stats}
                />
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};

// Achievements Tab Component
const AchievementsTab = ({ achievements }) => {
  const achievementConfig = mockDataManager.getAchievementsConfig();
  const unlockedIds = achievements.map(a => a.id);
  const lockedAchievements = Object.entries(achievementConfig)
    .filter(([id]) => !unlockedIds.includes(id));

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Unlocked Achievements */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          🏆 Unlocked Achievements ({achievements.length})
        </h3>
        
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-purple-200">
            <div className="text-4xl mb-4">🎯</div>
            <p>No achievements yet!</p>
            <p className="text-sm">Complete quizzes to unlock achievements</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">
          🔒 Locked Achievements ({lockedAchievements.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedAchievements.map(([id, achievement]) => (
            <AchievementCard
              key={id}
              achievement={{ id, ...achievement }}
              unlocked={false}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// History Tab Component
const HistoryTab = ({ history }) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="text-xl font-bold text-white mb-6">📋 Quiz History</h3>
      
      {history.length === 0 ? (
        <div className="text-center py-8 text-purple-200">
          <div className="text-4xl mb-4">📚</div>
          <p>No quiz history yet!</p>
          <p className="text-sm">Your completed quizzes will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((game, index) => (
            <DetailedGameItem key={game.id || index} game={game} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Streaks Tab Component
const StreaksTab = ({ streaks, userProfile }) => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Current Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔥 Daily Streak</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-orange-400 mb-2">
              {streaks.dailyCurrent}
            </div>
            <p className="text-purple-200">days in a row</p>
            <p className="text-sm text-purple-300 mt-2">
              Best: {streaks.dailyMax} days
            </p>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">⚡ Answer Streak</h3>
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-400 mb-2">
              {streaks.current}
            </div>
            <p className="text-purple-200">correct answers</p>
            <p className="text-sm text-purple-300 mt-2">
              Best: {streaks.max} answers
            </p>
          </div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">📅 Activity Calendar</h3>
        <StreakCalendar streakDates={userProfile.dailyStreaks?.streakDates || []} />
      </div>
    </motion.div>
  );
};

// Reusable Components
const StatCard = ({ icon, title, value, subtitle }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-white/15 transition-colors"
    whileHover={{ scale: 1.02 }}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-purple-200">{title}</div>
    <div className="text-xs text-purple-300">{subtitle}</div>
  </motion.div>
);

const RecentGameItem = ({ game }) => {
  const subject = Object.values(SUBJECTS).find(s => s.id === game.subject);
  const timeAgo = new Date(game.completedAt).toLocaleDateString();
  
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="text-xl">{subject?.icon || '📝'}</span>
        <div>
          <p className="text-white font-medium">{subject?.name || game.subject}</p>
          <p className="text-purple-200 text-sm">{game.chapter}</p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-white font-bold">{game.score}%</p>
        <p className="text-purple-300 text-xs">{timeAgo}</p>
      </div>
    </div>
  );
};

const SubjectMasteryCard = ({ subject, stats }) => {
  const masteryLevel = Math.min(100, (stats.averageScore / 100) * 100);
  
  return (
    <motion.div
      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{subject.icon}</span>
        <div>
          <h4 className="text-white font-medium">{subject.name}</h4>
          <p className="text-purple-200 text-xs">{stats.gamesPlayed} games</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-purple-200">Mastery</span>
          <span className="text-white">{Math.round(masteryLevel)}%</span>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${subject.color}`}
            style={{ width: `${masteryLevel}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${masteryLevel}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        
        <div className="text-xs text-purple-300">
          Best: {stats.bestScore}% • Avg: {Math.round(stats.averageScore)}%
        </div>
      </div>
    </motion.div>
  );
};

const DetailedSubjectCard = ({ subject, stats }) => (
  <motion.div
    className="bg-white/5 rounded-xl p-6"
    whileHover={{ scale: 1.02 }}
  >
    <div className="text-center mb-4">
      <div className="text-4xl mb-2">{subject.icon}</div>
      <h4 className="text-xl font-bold text-white">{subject.name}</h4>
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-purple-200">Games Played:</span>
        <span className="text-white font-bold">{stats.gamesPlayed}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-purple-200">Average Score:</span>
        <span className="text-white font-bold">{Math.round(stats.averageScore)}%</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-purple-200">Best Score:</span>
        <span className="text-white font-bold">{stats.bestScore}%</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-purple-200">XP Earned:</span>
        <span className="text-white font-bold">{stats.xpEarned}</span>
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-2 mt-4">
        <motion.div
          className={`h-2 rounded-full ${subject.color}`}
          style={{ width: `${Math.min(100, stats.averageScore)}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, stats.averageScore)}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  </motion.div>
);

const AchievementCard = ({ achievement, unlocked }) => (
  <motion.div
    className={`p-4 rounded-xl border-2 transition-all ${
      unlocked
        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50'
        : 'bg-white/5 border-gray-600/50 opacity-60'
    }`}
    whileHover={{ scale: unlocked ? 1.02 : 1 }}
  >
    <div className="text-center">
      <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
        {achievement.icon}
      </div>
      <h4 className="text-white font-bold mb-1">{achievement.title}</h4>
      <p className="text-purple-200 text-sm mb-2">{achievement.description}</p>
      
      {achievement.xpReward && (
        <div className="text-xs text-yellow-400">
          +{achievement.xpReward} XP
        </div>
      )}
      
      {unlocked && achievement.unlockedAt && (
        <div className="text-xs text-green-400 mt-1">
          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  </motion.div>
);

const DetailedGameItem = ({ game }) => {
  const subject = Object.values(SUBJECTS).find(s => s.id === game.subject);
  
  return (
    <motion.div
      className="bg-white/5 rounded-lg p-4"
      whileHover={{ bg: 'white/10' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{subject?.icon || '📝'}</span>
          <div>
            <h4 className="text-white font-medium">{subject?.name || game.subject}</h4>
            <p className="text-purple-200 text-sm">{game.chapter}</p>
            <p className="text-purple-300 text-xs">
              {new Date(game.completedAt).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold text-white">{game.score}%</div>
          <div className="text-purple-200 text-sm">
            {game.correctAnswers}/{game.totalQuestions}
          </div>
          <div className="text-purple-300 text-xs">
            +{game.xpGained} XP
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StreakCalendar = ({ streakDates }) => {
  // Generate last 30 days
  const days = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date.toDateString());
  }
  
  return (
    <div className="grid grid-cols-10 gap-1">
      {days.map((day, index) => {
        const hasActivity = streakDates.includes(day);
        return (
          <div
            key={day}
            className={`w-6 h-6 rounded-sm ${
              hasActivity
                ? 'bg-orange-500'
                : 'bg-white/10'
            }`}
            title={new Date(day).toLocaleDateString()}
          />
        );
      })}
    </div>
  );
};

// Edit Profile Modal
const EditProfileModal = ({ userProfile, onSave, onClose }) => {
  const [username, setUsername] = useState(userProfile.username);
  const [selectedEmoji, setSelectedEmoji] = useState(userProfile.avatarEmoji);
  
  const emojiOptions = ['😊', '🎓', '🚀', '⭐', '🌟', '🔥', '💎', '🏆', '🎯', '📚', '🤓', '😎'];
  
  const handleSave = () => {
    if (username.trim()) {
      onSave({
        username: username.trim(),
        avatarEmoji: selectedEmoji
      });
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
              maxLength={20}
            />
          </div>
          
          <div>
            <label className="block text-white mb-2 font-semibold">Avatar</label>
            <div className="grid grid-cols-6 gap-2">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-3 rounded-lg transition-all ${
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
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={!username.trim()}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              username.trim()
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentProfile;