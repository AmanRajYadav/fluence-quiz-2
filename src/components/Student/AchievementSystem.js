// src/components/Student/AchievementSystem.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock data manager to replace the real one
const mockDataManager = {
  getUserProfile: () => {
    const saved = localStorage.getItem('fluence_user_profile');
    return saved ? JSON.parse(saved) : { 
      id: '1', 
      username: 'Student User', 
      role: 'student', 
      level: 1, 
      xp: 150, 
      lastActive: Date.now(),
      avatarEmoji: '🎓',
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
      ]
    };
  },
  getUserStats: () => ({
    basic: {
      level: 2,
      xp: 150,
      totalGamesPlayed: 8,
      totalQuestionsAnswered: 85,
      accuracyRate: 78
    },
    streaks: {
      current: 5,
      max: 8,
      dailyCurrent: 3,
      dailyMax: 5
    },
    subjects: {
      mathematics: {
        gamesPlayed: 3,
        averageScore: 82,
        bestScore: 95
      },
      science: {
        gamesPlayed: 2,
        averageScore: 75,
        bestScore: 88
      },
      english: {
        gamesPlayed: 3,
        averageScore: 68,
        bestScore: 78
      }
    }
  }),
  getAchievementsConfig: () => ({
    first_game: {
      title: 'First Steps',
      description: 'Complete your first quiz',
      icon: '🎯',
      xpReward: 10
    },
    games_10: {
      title: 'Quiz Enthusiast',
      description: 'Complete 10 quizzes',
      icon: '🎮',
      xpReward: 50
    },
    games_50: {
      title: 'Quiz Master',
      description: 'Complete 50 quizzes',
      icon: '🏆',
      xpReward: 150
    },
    games_100: {
      title: 'Quiz Legend',
      description: 'Complete 100 quizzes',
      icon: '👑',
      xpReward: 300
    },
    streak_3: {
      title: 'Getting Warmed Up',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      xpReward: 25
    },
    streak_5: {
      title: 'Streak Master',
      description: 'Get 5 consecutive correct answers',
      icon: '⚡',
      xpReward: 30
    },
    streak_10: {
      title: 'Perfect Streak',
      description: 'Get 10 consecutive correct answers',
      icon: '✨',
      xpReward: 60
    },
    streak_25: {
      title: 'Unstoppable',
      description: 'Get 25 consecutive correct answers',
      icon: '🌟',
      xpReward: 120
    },
    daily_3: {
      title: 'Three Days Strong',
      description: 'Maintain a 3-day daily streak',
      icon: '📅',
      xpReward: 40
    },
    daily_7: {
      title: 'Weekly Warrior',
      description: 'Maintain a 7-day daily streak',
      icon: '🗓️',
      xpReward: 80
    },
    daily_30: {
      title: 'Monthly Champion',
      description: 'Maintain a 30-day daily streak',
      icon: '🏅',
      xpReward: 200
    },
    level_5: {
      title: 'Rising Star',
      description: 'Reach level 5',
      icon: '⭐',
      xpReward: 75
    },
    level_10: {
      title: 'Advanced Learner',
      description: 'Reach level 10',
      icon: '🌟',
      xpReward: 150
    },
    perfect_score: {
      title: 'Perfect Score',
      description: 'Get 100% on any quiz',
      icon: '💯',
      xpReward: 40
    },
    speed_demon: {
      title: 'Speed Demon',
      description: 'Complete a quiz in under 2 minutes',
      icon: '💨',
      xpReward: 35
    },
    math_master: {
      title: 'Math Master',
      description: 'Complete 20 math quizzes',
      icon: '🔢',
      xpReward: 100
    },
    science_genius: {
      title: 'Science Genius',
      description: 'Complete 20 science quizzes',
      icon: '🔬',
      xpReward: 100
    }
  }),
  getXPForNextLevel: (currentLevel) => {
    return currentLevel * 100 + 100; // Simple XP calculation
  }
};

const AchievementSystem = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [achievementConfig, setAchievementConfig] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAchievementDetail, setShowAchievementDetail] = useState(null);

  useEffect(() => {
    loadAchievementData();
  }, []);

  const loadAchievementData = () => {
    const profile = mockDataManager.getUserProfile();
    const config = mockDataManager.getAchievementsConfig();
    
    setUserProfile(profile);
    setAchievements(profile.achievements || []);
    setAchievementConfig(config);
  };

  const getAchievementsByCategory = () => {
    const categories = {
      all: Object.entries(achievementConfig),
      progress: Object.entries(achievementConfig).filter(([id, achievement]) => 
        id.includes('level') || id.includes('games') || id.includes('first')
      ),
      streaks: Object.entries(achievementConfig).filter(([id]) => 
        id.includes('streak') || id.includes('daily')
      ),
      subjects: Object.entries(achievementConfig).filter(([id]) => 
        id.includes('master') || id.includes('genius')
      ),
      special: Object.entries(achievementConfig).filter(([id]) => 
        id.includes('perfect') || id.includes('speed')
      )
    };

    return categories[selectedCategory] || [];
  };

  const isAchievementUnlocked = (achievementId) => {
    return achievements.some(a => a.id === achievementId);
  };

  const getUnlockedAchievement = (achievementId) => {
    return achievements.find(a => a.id === achievementId);
  };

  const getProgressTowardsAchievement = (achievementId) => {
    const userStats = mockDataManager.getUserStats();
    
    // Calculate progress based on achievement type
    switch (achievementId) {
      case 'first_game':
        return Math.min(100, (userStats.basic.totalGamesPlayed / 1) * 100);
      case 'games_10':
        return Math.min(100, (userStats.basic.totalGamesPlayed / 10) * 100);
      case 'games_50':
        return Math.min(100, (userStats.basic.totalGamesPlayed / 50) * 100);
      case 'games_100':
        return Math.min(100, (userStats.basic.totalGamesPlayed / 100) * 100);
      case 'streak_5':
        return Math.min(100, (userStats.streaks.max / 5) * 100);
      case 'streak_10':
        return Math.min(100, (userStats.streaks.max / 10) * 100);
      case 'streak_25':
        return Math.min(100, (userStats.streaks.max / 25) * 100);
      case 'daily_3':
        return Math.min(100, (userStats.streaks.dailyMax / 3) * 100);
      case 'daily_7':
        return Math.min(100, (userStats.streaks.dailyMax / 7) * 100);
      case 'daily_30':
        return Math.min(100, (userStats.streaks.dailyMax / 30) * 100);
      case 'level_5':
        return Math.min(100, (userStats.basic.level / 5) * 100);
      case 'level_10':
        return Math.min(100, (userStats.basic.level / 10) * 100);
      case 'math_master':
        return Math.min(100, (userStats.subjects.mathematics?.gamesPlayed / 20) * 100);
      case 'science_genius':
        return Math.min(100, (userStats.subjects.science?.gamesPlayed / 20) * 100);
      default:
        return 0;
    }
  };

  const getTotalXPFromAchievements = () => {
    return achievements.reduce((total, achievement) => {
      const config = achievementConfig[achievement.id];
      return total + (config?.xpReward || 0);
    }, 0);
  };

  const getAchievementStats = () => {
    const totalAchievements = Object.keys(achievementConfig).length;
    const unlockedCount = achievements.length;
    const lockedCount = totalAchievements - unlockedCount;
    
    return {
      total: totalAchievements,
      unlocked: unlockedCount,
      locked: lockedCount,
      completionRate: Math.round((unlockedCount / totalAchievements) * 100),
      totalXP: getTotalXPFromAchievements()
    };
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading achievements...</div>
      </div>
    );
  }

  const achievementStats = getAchievementStats();
  const achievementsList = getAchievementsByCategory();

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
              <h1 className="text-3xl font-bold text-white">🏆 Achievements</h1>
              <p className="text-purple-200">Your learning milestones and accomplishments</p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🏠 Back Home
            </button>
          </div>
        </motion.div>

        {/* Achievement Stats Overview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon="🎯"
            title="Unlocked"
            value={achievementStats.unlocked}
            subtitle={`of ${achievementStats.total}`}
            color="from-green-500 to-emerald-500"
          />
          
          <StatCard
            icon="📊"
            title="Completion"
            value={`${achievementStats.completionRate}%`}
            subtitle="progress"
            color="from-blue-500 to-cyan-500"
          />
          
          <StatCard
            icon="⭐"
            title="Achievement XP"
            value={achievementStats.totalXP}
            subtitle="total earned"
            color="from-yellow-500 to-orange-500"
          />
          
          <StatCard
            icon="🔒"
            title="Remaining"
            value={achievementStats.locked}
            subtitle="to unlock"
            color="from-purple-500 to-pink-500"
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', label: '🎯 All Achievements', count: Object.keys(achievementConfig).length },
              { id: 'progress', label: '📈 Progress', count: Object.entries(achievementConfig).filter(([id]) => id.includes('level') || id.includes('games') || id.includes('first')).length },
              { id: 'streaks', label: '🔥 Streaks', count: Object.entries(achievementConfig).filter(([id]) => id.includes('streak') || id.includes('daily')).length },
              { id: 'subjects', label: '📚 Subject Mastery', count: Object.entries(achievementConfig).filter(([id]) => id.includes('master') || id.includes('genius')).length },
              { id: 'special', label: '⭐ Special', count: Object.entries(achievementConfig).filter(([id]) => id.includes('perfect') || id.includes('speed')).length }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white scale-105'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {achievementsList.map(([achievementId, achievement], index) => {
            const isUnlocked = isAchievementUnlocked(achievementId);
            const unlockedAchievement = getUnlockedAchievement(achievementId);
            const progress = getProgressTowardsAchievement(achievementId);
            
            return (
              <AchievementCard
                key={achievementId}
                achievement={{
                  id: achievementId,
                  ...achievement,
                  progress,
                  unlockedAt: unlockedAchievement?.unlockedAt
                }}
                isUnlocked={isUnlocked}
                onClick={() => setShowAchievementDetail({ id: achievementId, ...achievement, isUnlocked, progress })}
                index={index}
              />
            );
          })}
        </motion.div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <motion.div
            className="mt-12 bg-white/10 backdrop-blur-md rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">🎉 Recent Achievements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements
                .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
                .slice(0, 6)
                .map((achievement) => (
                  <RecentAchievementItem
                    key={achievement.id}
                    achievement={achievement}
                    config={achievementConfig[achievement.id]}
                  />
                ))}
            </div>
          </motion.div>
        )}

        {/* Next Achievement Hint */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-yellow-300 mb-4">💡 Next Achievement</h2>
          <NextAchievementHint 
            userProfile={userProfile}
            achievementConfig={achievementConfig}
            unlockedAchievements={achievements}
          />
        </motion.div>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {showAchievementDetail && (
          <AchievementDetailModal
            achievement={showAchievementDetail}
            onClose={() => setShowAchievementDetail(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Achievement Card Component
const AchievementCard = ({ achievement, isUnlocked, onClick, index }) => {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
        isUnlocked
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 hover:border-yellow-400'
          : 'bg-white/5 border-2 border-gray-600/30 hover:border-gray-500/50'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      {/* Glow Effect for Unlocked Achievements */}
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 animate-pulse" />
      )}
      
      <div className="relative p-6">
        {/* Achievement Icon */}
        <div className={`text-4xl mb-3 text-center transition-all duration-300 ${
          isUnlocked ? 'scale-110' : 'grayscale opacity-60'
        }`}>
          {achievement.icon}
        </div>
        
        {/* Achievement Title */}
        <h3 className={`text-lg font-bold mb-2 text-center ${
          isUnlocked ? 'text-yellow-300' : 'text-gray-400'
        }`}>
          {achievement.title}
        </h3>
        
        {/* Achievement Description */}
        <p className={`text-sm text-center mb-4 ${
          isUnlocked ? 'text-yellow-100' : 'text-gray-500'
        }`}>
          {achievement.description}
        </p>
        
        {/* XP Reward */}
        <div className="text-center mb-4">
          <span className={`text-sm px-3 py-1 rounded-full ${
            isUnlocked 
              ? 'bg-yellow-500/20 text-yellow-300' 
              : 'bg-gray-600/20 text-gray-400'
          }`}>
            +{achievement.xpReward} XP
          </span>
        </div>
        
        {/* Progress Bar for Locked Achievements */}
        {!isUnlocked && achievement.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(achievement.progress)}%</span>
            </div>
            <div className="w-full bg-gray-600/30 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${achievement.progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${achievement.progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}
        
        {/* Unlock Date for Unlocked Achievements */}
        {isUnlocked && achievement.unlockedAt && (
          <div className="text-xs text-yellow-400 text-center">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
        
        {/* Locked Indicator */}
        {!isUnlocked && (
          <div className="absolute top-3 right-3 text-gray-500">
            🔒
          </div>
        )}
        
        {/* Unlocked Indicator */}
        {isUnlocked && (
          <div className="absolute top-3 right-3 text-yellow-400">
            ✅
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Stats Card Component
const StatCard = ({ icon, title, value, subtitle, color }) => (
  <motion.div
    className={`bg-gradient-to-r ${color} p-4 rounded-xl text-white shadow-lg`}
    whileHover={{ scale: 1.05 }}
  >
    <div className="text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-xs opacity-75">{subtitle}</div>
    </div>
  </motion.div>
);

// Recent Achievement Item Component
const RecentAchievementItem = ({ achievement, config }) => (
  <motion.div
    className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg"
    whileHover={{ scale: 1.02 }}
  >
    <div className="text-2xl">{config?.icon}</div>
    <div className="flex-1">
      <div className="text-yellow-300 font-medium text-sm">{config?.title}</div>
      <div className="text-yellow-100 text-xs">
        {new Date(achievement.unlockedAt).toLocaleDateString()}
      </div>
    </div>
    <div className="text-yellow-400 text-xs">
      +{config?.xpReward} XP
    </div>
  </motion.div>
);

// Next Achievement Hint Component
const NextAchievementHint = ({ userProfile, achievementConfig, unlockedAchievements }) => {
  const getNextAchievement = () => {
    const userStats = mockDataManager.getUserStats();
    const unlockedIds = unlockedAchievements.map(a => a.id);
    
    // Find achievements that are close to being unlocked
    const nearbyAchievements = Object.entries(achievementConfig)
      .filter(([id]) => !unlockedIds.includes(id))
      .map(([id, achievement]) => {
        let progress = 0;
        let progressText = '';
        
        switch (id) {
          case 'games_10':
            progress = (userStats.basic.totalGamesPlayed / 10) * 100;
            progressText = `Play ${10 - userStats.basic.totalGamesPlayed} more games`;
            break;
          case 'streak_5':
            progress = (userStats.streaks.max / 5) * 100;
            progressText = `Get ${5 - userStats.streaks.max} more consecutive correct answers`;
            break;
          case 'level_5':
            progress = (userStats.basic.level / 5) * 100;
            progressText = `Gain ${mockDataManager.getXPForNextLevel(userStats.basic.level) - userStats.basic.xp} more XP`;
            break;
          default:
            progress = 0;
            progressText = 'Keep playing to unlock!';
        }
        
        return {
          id,
          ...achievement,
          progress: Math.min(100, progress),
          progressText
        };
      })
      .sort((a, b) => b.progress - a.progress);
    
    return nearbyAchievements[0];
  };

  const nextAchievement = getNextAchievement();
  
  if (!nextAchievement) {
    return (
      <div className="text-center text-yellow-100">
        🎉 Congratulations! You've unlocked all available achievements!
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-4xl">{nextAchievement.icon}</div>
      <div className="flex-1">
        <h3 className="text-yellow-300 font-bold">{nextAchievement.title}</h3>
        <p className="text-yellow-100 text-sm mb-2">{nextAchievement.description}</p>
        <p className="text-yellow-200 text-xs">{nextAchievement.progressText}</p>
        
        {nextAchievement.progress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-yellow-600/30 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${nextAchievement.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="text-yellow-400 text-sm">
        +{nextAchievement.xpReward} XP
      </div>
    </div>
  );
};

// Achievement Detail Modal
const AchievementDetailModal = ({ achievement, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className={`max-w-md w-full rounded-xl p-8 text-center ${
        achievement.isUnlocked
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50'
          : 'bg-white/10 backdrop-blur-md border-2 border-gray-600/30'
      }`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`text-8xl mb-6 ${achievement.isUnlocked ? '' : 'grayscale opacity-60'}`}>
        {achievement.icon}
      </div>
      
      <h2 className={`text-3xl font-bold mb-4 ${
        achievement.isUnlocked ? 'text-yellow-300' : 'text-gray-400'
      }`}>
        {achievement.title}
      </h2>
      
      <p className={`text-lg mb-6 ${
        achievement.isUnlocked ? 'text-yellow-100' : 'text-gray-500'
      }`}>
        {achievement.description}
      </p>
      
      <div className={`text-lg mb-6 px-4 py-2 rounded-full inline-block ${
        achievement.isUnlocked 
          ? 'bg-yellow-500/20 text-yellow-300' 
          : 'bg-gray-600/20 text-gray-400'
      }`}>
        +{achievement.xpReward} XP Reward
      </div>
      
      {!achievement.isUnlocked && achievement.progress > 0 && (
        <div className="mb-6">
          <div className="text-gray-400 mb-2">Progress: {Math.round(achievement.progress)}%</div>
          <div className="w-full bg-gray-600/30 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              style={{ width: `${achievement.progress}%` }}
            />
          </div>
        </div>
      )}
      
      {achievement.isUnlocked && (
        <div className="text-yellow-400 mb-6">
          ✅ Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
        </div>
      )}
      
      <button
        onClick={onClose}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        Close
      </button>
    </motion.div>
  </motion.div>
);

export default AchievementSystem;