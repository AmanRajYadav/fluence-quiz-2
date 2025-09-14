// src/utils/integrationHelpers.js
// Helper functions for integrating Phase 2 with existing codebase

import { dataManager } from '../managers/DataManager';

/**
 * Quiz Integration Helper
 * Use this to wrap your existing quiz completion logic
 */
export const handleQuizCompletion = (quizResult) => {
  const {
    selectedSubject,
    selectedChapter,
    score,
    totalQuestions,
    correctAnswers,
    timeTaken,
    questions = []
  } = quizResult;

  // Record the game result in our enhanced system
  const gameData = {
    subject: selectedSubject,
    chapter: selectedChapter,
    score: Math.round((correctAnswers / totalQuestions) * 100),
    totalQuestions,
    correctAnswers,
    timeTaken: Math.floor(timeTaken / 1000), // Convert to seconds
    pointsEarned: score || (correctAnswers * 100)
  };

  // Record and get results (XP, level up, achievements)
  const result = dataManager.recordGameResult(gameData);
  
  return {
    ...result,
    // Add any additional data your existing system needs
    originalScore: score,
    questions: questions
  };
};

/**
 * Progress Tracker Hook
 * Use this in any component that needs to track user progress
 */
export const useUserProgress = () => {
  const [userStats, setUserStats] = React.useState(null);
  const [userProfile, setUserProfile] = React.useState(null);

  React.useEffect(() => {
    refreshProgress();
  }, []);

  const refreshProgress = () => {
    const profile = dataManager.getUserProfile();
    const stats = dataManager.getUserStats();
    setUserProfile(profile);
    setUserStats(stats);
  };

  return {
    userStats,
    userProfile,
    refreshProgress
  };
};

/**
 * Subject Mapping Helper
 * Maps your existing subject IDs to our enhanced system
 */
export const mapSubjectId = (existingSubjectId) => {
  const mapping = {
    'math': 'mathematics',
    'maths': 'mathematics',
    'science': 'science',
    'social': 'social-science',
    'social_science': 'social-science',
    'english': 'english',
    'hindi': 'hindi',
    'sanskrit': 'sanskrit'
  };
  
  return mapping[existingSubjectId.toLowerCase()] || existingSubjectId;
};

/**
 * Achievement Notification Component
 * Use this to show achievement popups anywhere in your app
 */
export const showAchievementNotification = (achievement) => {
  // Create achievement notification element
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm animate-bounce';
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="text-2xl">${achievement.icon}</div>
      <div>
        <div class="font-bold">🎉 Achievement Unlocked!</div>
        <div class="text-sm">${achievement.title}</div>
        <div class="text-xs text-yellow-100">+${achievement.xpReward} XP</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white ml-auto">✕</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
};

/**
 * Level Up Notification Component
 */
export const showLevelUpNotification = (newLevel) => {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg z-50 max-w-sm animate-pulse';
  notification.innerHTML = `
    <div class="text-center">
      <div class="text-4xl mb-2">🎉</div>
      <div class="text-xl font-bold">Level Up!</div>
      <div class="text-lg">You reached Level ${newLevel}!</div>
      <button onclick="this.parentElement.parentElement.remove()" class="mt-3 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors">
        Awesome!
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 8000);
};

/**
 * Data Migration Helper
 * Use this to migrate existing user data to the new system
 */
export const migrateExistingData = (existingUserData) => {
  // Example migration from old format to new format
  if (existingUserData && typeof existingUserData === 'object') {
    const migrationData = {
      username: existingUserData.name || existingUserData.username || 'Student',
      totalGamesPlayed: existingUserData.gamesPlayed || 0,
      // Map any other existing data fields
    };
    
    // Update profile with migrated data
    return dataManager.updateUserProfile(migrationData);
  }
  
  return dataManager.getUserProfile();
};

/**
 * Route Protection Helper
 * Use this to check if user can access teacher routes
 */
export const isTeacher = () => {
  const profile = dataManager.getUserProfile();
  return profile.role === 'teacher';
};

export const requireTeacher = (navigate) => {
  if (!isTeacher()) {
    navigate('/');
    return false;
  }
  return true;
};

/**
 * Class Code Generator Helper
 */
export const generateFriendlyClassCode = () => {
  const adjectives = ['SMART', 'BRIGHT', 'QUICK', 'SHARP', 'WISE', 'BOLD'];
  const nouns = ['MINDS', 'STARS', 'GEMS', 'ACES', 'PROS', 'WHIZ'];
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  
  return `${adj}${num}`;
};

/**
 * Performance Tracker
 * Use this to track subject-wise performance
 */
export const getSubjectPerformance = (subjectId) => {
  const stats = dataManager.getUserStats();
  const subjectStats = stats.subjects[subjectId];
  
  if (!subjectStats || subjectStats.gamesPlayed === 0) {
    return {
      level: 'Beginner',
      progress: 0,
      recommendation: 'Start your first quiz!'
    };
  }
  
  const avgScore = subjectStats.averageScore;
  let level, progress, recommendation;
  
  if (avgScore >= 90) {
    level = 'Expert';
    progress = 100;
    recommendation = 'You\'ve mastered this subject!';
  } else if (avgScore >= 80) {
    level = 'Advanced';
    progress = 85;
    recommendation = 'Great progress! Aim for perfection.';
  } else if (avgScore >= 70) {
    level = 'Intermediate';
    progress = 70;
    recommendation = 'Good work! Keep practicing.';
  } else if (avgScore >= 60) {
    level = 'Developing';
    progress = 50;
    recommendation = 'You\'re improving! Focus on weak areas.';
  } else {
    level = 'Beginner';
    progress = 25;
    recommendation = 'Keep practicing! You can do it.';
  }
  
  return { level, progress, recommendation, avgScore };
};

/**
 * Streak Motivation Messages
 */
export const getStreakMessage = (streakCount) => {
  if (streakCount >= 50) return "🔥 LEGENDARY STREAK! You're unstoppable!";
  if (streakCount >= 25) return "⚡ AMAZING STREAK! Keep the momentum!";
  if (streakCount >= 15) return "🌟 FANTASTIC! You're on fire!";
  if (streakCount >= 10) return "🎯 EXCELLENT! Great consistency!";
  if (streakCount >= 5) return "👏 GOOD JOB! You're building momentum!";
  if (streakCount >= 3) return "😊 NICE! Keep it going!";
  if (streakCount >= 1) return "🚀 GREAT START! Build your streak!";
  return "💪 Ready to start your streak?";
};

/**
 * Daily Goal Checker
 */
export const checkDailyGoals = () => {
  const profile = dataManager.getUserProfile();
  const today = new Date().toDateString();
  const lastPlayDate = profile.dailyStreaks?.lastPlayDate;
  
  return {
    playedToday: lastPlayDate === today,
    dailyStreak: profile.dailyStreaks?.currentStreak || 0,
    needsToPlay: lastPlayDate !== today
  };
};

/**
 * XP Calculator
 * Use this for consistent XP calculations across the app
 */
export const calculateXPGain = (correctAnswers, totalQuestions, timeTaken, bonuses = {}) => {
  let baseXP = correctAnswers * 10; // 10 XP per correct answer
  
  // Perfect game bonus
  if (correctAnswers === totalQuestions) {
    baseXP += 50;
  }
  
  // Speed bonus (if completed in under 60 seconds)
  if (timeTaken < 60) {
    baseXP += 25;
  }
  
  // First game of the day bonus
  if (bonuses.firstGameToday) {
    baseXP += 30;
  }
  
  // Streak bonus
  if (bonuses.streakCount >= 5) {
    baseXP += Math.min(50, bonuses.streakCount * 2);
  }
  
  return Math.max(0, baseXP);
};

/**
 * Teacher Analytics Helper
 */
export const getTeacherAnalytics = (teacherId) => {
  // This would normally fetch from backend
  // For now, return mock analytics based on localStorage data
  const students = dataManager.getStudentsForTeacher(teacherId);
  
  const analytics = {
    totalStudents: students.length,
    activeStudents: Math.floor(students.length * 0.8),
    totalQuizzesTaken: students.length * 12, // Mock data
    averageClassScore: 76,
    weeklyActivity: generateMockWeeklyActivity(),
    topPerformers: students.slice(0, 3),
    subjectPerformance: generateMockSubjectPerformance()
  };
  
  return analytics;
};

const generateMockWeeklyActivity = () => {
  return [
    { day: 'Mon', quizzes: 23, avgScore: 76 },
    { day: 'Tue', quizzes: 34, avgScore: 79 },
    { day: 'Wed', quizzes: 28, avgScore: 82 },
    { day: 'Thu', quizzes: 31, avgScore: 78 },
    { day: 'Fri', quizzes: 26, avgScore: 80 },
    { day: 'Sat', quizzes: 19, avgScore: 83 },
    { day: 'Sun', quizzes: 15, avgScore: 85 }
  ];
};

const generateMockSubjectPerformance = () => {
  return {
    mathematics: { average: 82, trend: '+5%', students: 12 },
    science: { average: 79, trend: '+3%', students: 10 },
    'social-science': { average: 75, trend: '-2%', students: 8 },
    english: { average: 81, trend: '+7%', students: 15 },
    hindi: { average: 73, trend: '+1%', students: 9 },
    sanskrit: { average: 69, trend: '-1%', students: 6 }
  };
};

/**
 * Question Loading Integration Helper
 * Wrapper for your existing question loading logic
 */
export const enhancedQuestionLoader = async (subject, chapter, existingLoader) => {
  try {
    // Use your existing question loading logic
    const questions = await existingLoader(subject, chapter);
    
    // Add any enhancements (shuffle, difficulty rating, etc.)
    const enhancedQuestions = questions.map((question, index) => ({
      ...question,
      id: `${subject}-${chapter}-${index}`,
      difficulty: calculateQuestionDifficulty(question),
      category: subject
    }));
    
    return enhancedQuestions;
  } catch (error) {
    console.error('Error loading questions:', error);
    throw error;
  }
};

const calculateQuestionDifficulty = (question) => {
  // Simple difficulty calculation based on question characteristics
  const textLength = question.question.length;
  const optionsCount = question.options.length;
  
  if (textLength > 100 || optionsCount > 4) return 'hard';
  if (textLength > 50) return 'medium';
  return 'easy';
};

/**
 * Local Storage Management
 */
export const storageHelpers = {
  // Clear all Phase 2 data (for testing/reset)
  clearPhase2Data: () => {
    localStorage.removeItem('fluence_user_profile');
    localStorage.removeItem('fluence_app_data');
    console.log('Phase 2 data cleared');
  },
  
  // Export user data for backup
  exportUserData: () => {
    return dataManager.exportUserData();
  },
  
  // Import user data from backup
  importUserData: (userData) => {
    return dataManager.importUserData(userData);
  },
  
  // Get storage usage
  getStorageUsage: () => {
    const profile = localStorage.getItem('fluence_user_profile');
    const appData = localStorage.getItem('fluence_app_data');
    
    return {
      profileSize: profile ? profile.length : 0,
      appDataSize: appData ? appData.length : 0,
      totalSize: (profile?.length || 0) + (appData?.length || 0)
    };
  }
};

/**
 * Debug Helpers for Development
 */
export const debugHelpers = {
  // Add fake achievements for testing
  unlockAllAchievements: () => {
    const config = dataManager.getAchievementsConfig();
    const profile = dataManager.getUserProfile();
    
    profile.achievements = Object.entries(config).map(([id, achievement]) => ({
      id,
      ...achievement,
      unlockedAt: new Date().toISOString()
    }));
    
    dataManager.updateUserProfile(profile);
    console.log('All achievements unlocked');
  },
  
  // Add fake XP for testing
  addXP: (amount) => {
    const profile = dataManager.getUserProfile();
    profile.currentXP += amount;
    profile.level = dataManager.calculateLevel(profile.currentXP);
    dataManager.updateUserProfile(profile);
    console.log(`Added ${amount} XP. New level: ${profile.level}`);
  },
  
  // Generate fake game history
  generateFakeHistory: (count = 10) => {
    const subjects = ['mathematics', 'science', 'english'];
    const chapters = ['chapter-1', 'chapter-2', 'chapter-3'];
    
    for (let i = 0; i < count; i++) {
      const gameData = {
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        chapter: chapters[Math.floor(Math.random() * chapters.length)],
        score: Math.floor(Math.random() * 40) + 60, // 60-100%
        totalQuestions: 10,
        correctAnswers: Math.floor(Math.random() * 4) + 6, // 6-10
        timeTaken: Math.floor(Math.random() * 120) + 60 // 60-180 seconds
      };
      
      dataManager.recordGameResult(gameData);
    }
    
    console.log(`Generated ${count} fake game records`);
  },
  
  // Log current user stats
  logUserStats: () => {
    console.log('User Profile:', dataManager.getUserProfile());
    console.log('User Stats:', dataManager.getUserStats());
    console.log('Storage Usage:', storageHelpers.getStorageUsage());
  }
};

/**
 * Integration Test Helper
 * Use this to verify Phase 2 integration is working
 */
export const runIntegrationTest = () => {
  console.log('🧪 Running Phase 2 Integration Test...');
  
  try {
    // Test 1: DataManager initialization
    const profile = dataManager.getUserProfile();
    console.log('✅ DataManager initialized, profile:', profile.username);
    
    // Test 2: Record a test game
    const testResult = dataManager.recordGameResult({
      subject: 'mathematics',
      chapter: 'test-chapter',
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeTaken: 120
    });
    console.log('✅ Game result recorded, XP gained:', testResult.xpGained);
    
    // Test 3: Check achievements
    const achievements = dataManager.checkAchievements(profile);
    console.log('✅ Achievement system working, new achievements:', achievements.length);
    
    // Test 4: User stats
    const stats = dataManager.getUserStats();
    console.log('✅ User stats calculated, level:', stats.basic.level);
    
    console.log('🎉 Integration test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
};