// src/managers/DataManager.js
export class DataManager {
    constructor() {
      this.initializeStorage();
    }
  
    // Initialize storage with default structures
    initializeStorage() {
      if (!localStorage.getItem('fluence_user_profile')) {
        this.createDefaultProfile();
      }
      if (!localStorage.getItem('fluence_app_data')) {
        this.initializeAppData();
      }
    }
  
    // Create default user profile
    createDefaultProfile() {
      const defaultProfile = {
        id: this.generateUniqueId(),
        username: '',
        role: 'student', // 'student' or 'teacher'
        avatarEmoji: '😊',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        
        // Basic Stats
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        currentXP: 0,
        level: 1,
        currentStreak: 0,
        maxStreak: 0,
        
        // Teacher/Class Info
        teacherId: null,
        classId: null,
        classCode: null,
        
        // Subject Progress - matches your existing 6 subjects
        subjectStats: {
          mathematics: this.createSubjectStats(),
          science: this.createSubjectStats(),
          'social-science': this.createSubjectStats(),
          english: this.createSubjectStats(),
          hindi: this.createSubjectStats(),
          sanskrit: this.createSubjectStats()
        },
        
        // Achievement & Social
        achievements: [],
        friends: [],
        gameHistory: [],
        dailyStreaks: this.initializeDailyStreaks()
      };
      
      localStorage.setItem('fluence_user_profile', JSON.stringify(defaultProfile));
      return defaultProfile;
    }
  
    createSubjectStats() {
      return {
        gamesPlayed: 0,
        questionsAnswered: 0,
        correctAnswers: 0,
        bestScore: 0,
        averageScore: 0,
        xpEarned: 0,
        currentStreak: 0,
        maxStreak: 0,
        weakTopics: [],
        lastPlayed: null,
        chapterProgress: {} // chapter_id: { completed: boolean, bestScore: number }
      };
    }
  
    initializeDailyStreaks() {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastPlayDate: null,
        streakDates: []
      };
    }
  
    // App-level data (teachers, classes, achievements config)
    initializeAppData() {
      const appData = {
        teachers: new Map(),
        classes: new Map(),
        globalLeaderboard: [],
        achievements: this.getAchievementsConfig(),
        dailyQuests: this.generateDailyQuests()
      };
      
      localStorage.setItem('fluence_app_data', JSON.stringify(appData));
      return appData;
    }
  
    // Generate unique IDs
    generateUniqueId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
  
    // Generate class codes for teachers
    generateClassCode() {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  
    // =================
    // USER PROFILE METHODS
    // =================
  
    getUserProfile() {
      const profile = localStorage.getItem('fluence_user_profile');
      return profile ? JSON.parse(profile) : this.createDefaultProfile();
    }
  
    updateUserProfile(updates) {
      const profile = this.getUserProfile();
      const updatedProfile = { ...profile, ...updates };
      localStorage.setItem('fluence_user_profile', JSON.stringify(updatedProfile));
      return updatedProfile;
    }
  
    // Update user role (student/teacher)
    setUserRole(role, userData = {}) {
      return this.updateUserProfile({
        role,
        ...userData,
        lastActive: new Date().toISOString()
      });
    }
  
    // =================
    // GAME STATS METHODS
    // =================
  
    // Record a completed quiz game
    recordGameResult(gameData) {
      const profile = this.getUserProfile();
      const { subject, chapter, score, totalQuestions, correctAnswers, timeTaken } = gameData;
      
      // Update overall stats
      profile.totalGamesPlayed += 1;
      profile.totalQuestionsAnswered += totalQuestions;
      profile.totalCorrectAnswers += correctAnswers;
      
      // Calculate XP gain (base: 10 per correct answer + bonus for streaks/perfect games)
      const xpGain = this.calculateXPGain(correctAnswers, totalQuestions, score);
      profile.currentXP += xpGain;
      
      // Level up check
      const newLevel = this.calculateLevel(profile.currentXP);
      if (newLevel > profile.level) {
        profile.level = newLevel;
        // Trigger level up achievement/celebration
      }
      
      // Update subject stats
      const subjectStats = profile.subjectStats[subject];
      subjectStats.gamesPlayed += 1;
      subjectStats.questionsAnswered += totalQuestions;
      subjectStats.correctAnswers += correctAnswers;
      subjectStats.xpEarned += xpGain;
      
      // Update best/average scores
      if (score > subjectStats.bestScore) {
        subjectStats.bestScore = score;
      }
      subjectStats.averageScore = Math.round(
        (subjectStats.averageScore * (subjectStats.gamesPlayed - 1) + score) / subjectStats.gamesPlayed
      );
      
      // Update chapter progress
      if (!subjectStats.chapterProgress[chapter]) {
        subjectStats.chapterProgress[chapter] = { completed: false, bestScore: 0 };
      }
      
      const chapterProgress = subjectStats.chapterProgress[chapter];
      if (score > chapterProgress.bestScore) {
        chapterProgress.bestScore = score;
      }
      
      // Mark chapter as completed if score is above 70%
      if (score >= 70) {
        chapterProgress.completed = true;
      }
      
      // Update streaks
      this.updateStreaks(profile, correctAnswers, totalQuestions);
      
      // Record game history
      profile.gameHistory.unshift({
        id: this.generateUniqueId(),
        subject,
        chapter,
        score,
        totalQuestions,
        correctAnswers,
        xpGained: xpGain,
        timeTaken,
        completedAt: new Date().toISOString()
      });
      
      // Keep only last 50 games
      if (profile.gameHistory.length > 50) {
        profile.gameHistory = profile.gameHistory.slice(0, 50);
      }
      
      // Update last active
      profile.lastActive = new Date().toISOString();
      
      // Save profile
      localStorage.setItem('fluence_user_profile', JSON.stringify(profile));
      
      // Check for new achievements
      this.checkAchievements(profile);
      
      return { profile, xpGained: xpGain, leveledUp: newLevel > profile.level };
    }
  
    // Calculate XP based on performance
    calculateXPGain(correctAnswers, totalQuestions, score) {
      let xp = correctAnswers * 10; // Base XP
      
      // Perfect game bonus
      if (correctAnswers === totalQuestions) {
        xp += 50;
      }
      
      // High score bonus
      if (score >= 90) {
        xp += 25;
      } else if (score >= 80) {
        xp += 15;
      }
      
      return xp;
    }
  
    // Calculate level from XP
    calculateLevel(xp) {
      return Math.floor(Math.sqrt(xp / 100)) + 1;
    }
  
    // Calculate XP needed for next level
    getXPForNextLevel(currentLevel) {
      return (currentLevel * currentLevel) * 100;
    }
  
    // Update daily and question streaks
    updateStreaks(profile, correctAnswers, totalQuestions) {
      const today = new Date().toDateString();
      const lastPlayDate = profile.dailyStreaks.lastPlayDate;
      
      // Update daily streak
      if (lastPlayDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastPlayDate === yesterday.toDateString()) {
          // Consecutive day
          profile.dailyStreaks.currentStreak += 1;
        } else {
          // Streak broken
          profile.dailyStreaks.currentStreak = 1;
        }
        
        profile.dailyStreaks.lastPlayDate = today;
        profile.dailyStreaks.streakDates.push(today);
        
        // Update longest streak
        if (profile.dailyStreaks.currentStreak > profile.dailyStreaks.longestStreak) {
          profile.dailyStreaks.longestStreak = profile.dailyStreaks.currentStreak;
        }
      }
      
      // Update question streak (consecutive correct answers)
      if (correctAnswers === totalQuestions) {
        profile.currentStreak += correctAnswers;
        if (profile.currentStreak > profile.maxStreak) {
          profile.maxStreak = profile.currentStreak;
        }
      } else {
        profile.currentStreak = 0;
      }
    }
  
    // =================
    // ACHIEVEMENT SYSTEM
    // =================
  
    getAchievementsConfig() {
      return {
        // First-time achievements
        first_game: { 
          title: "Getting Started", 
          description: "Complete your first quiz", 
          icon: "🎯",
          xpReward: 25
        },
        first_perfect: { 
          title: "Perfect Score!", 
          description: "Score 100% in a quiz", 
          icon: "💯",
          xpReward: 50
        },
        
        // Streak achievements
        streak_5: { 
          title: "On Fire", 
          description: "5 correct answers in a row", 
          icon: "🔥",
          xpReward: 30
        },
        streak_10: { 
          title: "Unstoppable", 
          description: "10 correct answers in a row", 
          icon: "⚡",
          xpReward: 50
        },
        streak_25: { 
          title: "Quiz Master", 
          description: "25 correct answers in a row", 
          icon: "👑",
          xpReward: 100
        },
        
        // Daily streak achievements
        daily_3: { 
          title: "Consistent Learner", 
          description: "Play for 3 consecutive days", 
          icon: "📅",
          xpReward: 40
        },
        daily_7: { 
          title: "Week Warrior", 
          description: "Play for 7 consecutive days", 
          icon: "🗓️",
          xpReward: 75
        },
        daily_30: { 
          title: "Monthly Master", 
          description: "Play for 30 consecutive days", 
          icon: "🏆",
          xpReward: 200
        },
        
        // Game count achievements
        games_10: { 
          title: "Quiz Enthusiast", 
          description: "Complete 10 quizzes", 
          icon: "🎮",
          xpReward: 60
        },
        games_50: { 
          title: "Quiz Veteran", 
          description: "Complete 50 quizzes", 
          icon: "🎖️",
          xpReward: 150
        },
        games_100: { 
          title: "Century Club", 
          description: "Complete 100 quizzes", 
          icon: "💎",
          xpReward: 300
        },
        
        // Subject mastery achievements
        math_master: { 
          title: "Math Master", 
          description: "Complete 20 math quizzes", 
          icon: "🔢",
          xpReward: 100
        },
        science_genius: { 
          title: "Science Genius", 
          description: "Complete 20 science quizzes", 
          icon: "🔬",
          xpReward: 100
        },
        
        // Level achievements
        level_5: { 
          title: "Rising Star", 
          description: "Reach level 5", 
          icon: "⭐",
          xpReward: 75
        },
        level_10: { 
          title: "Expert Learner", 
          description: "Reach level 10", 
          icon: "🌟",
          xpReward: 150
        }
      };
    }
  
    checkAchievements(profile) {
      const achievements = this.getAchievementsConfig();
      const newAchievements = [];
      
      // Check each achievement
      Object.entries(achievements).forEach(([key, achievement]) => {
        // Skip if already unlocked
        if (profile.achievements.find(a => a.id === key)) return;
        
        let unlocked = false;
        
        // Achievement logic
        switch (key) {
          case 'first_game':
            unlocked = profile.totalGamesPlayed >= 1;
            break;
          case 'first_perfect':
            unlocked = profile.gameHistory.some(game => 
              game.correctAnswers === game.totalQuestions
            );
            break;
          case 'streak_5':
            unlocked = profile.maxStreak >= 5;
            break;
          case 'streak_10':
            unlocked = profile.maxStreak >= 10;
            break;
          case 'streak_25':
            unlocked = profile.maxStreak >= 25;
            break;
          case 'daily_3':
            unlocked = profile.dailyStreaks.longestStreak >= 3;
            break;
          case 'daily_7':
            unlocked = profile.dailyStreaks.longestStreak >= 7;
            break;
          case 'daily_30':
            unlocked = profile.dailyStreaks.longestStreak >= 30;
            break;
          case 'games_10':
            unlocked = profile.totalGamesPlayed >= 10;
            break;
          case 'games_50':
            unlocked = profile.totalGamesPlayed >= 50;
            break;
          case 'games_100':
            unlocked = profile.totalGamesPlayed >= 100;
            break;
          case 'math_master':
            unlocked = profile.subjectStats.mathematics.gamesPlayed >= 20;
            break;
          case 'science_genius':
            unlocked = profile.subjectStats.science.gamesPlayed >= 20;
            break;
          case 'level_5':
            unlocked = profile.level >= 5;
            break;
          case 'level_10':
            unlocked = profile.level >= 10;
            break;
        }
        
        if (unlocked) {
          const newAchievement = {
            id: key,
            ...achievement,
            unlockedAt: new Date().toISOString()
          };
          
          profile.achievements.push(newAchievement);
          newAchievements.push(newAchievement);
          
          // Award XP for achievement
          profile.currentXP += achievement.xpReward;
        }
      });
      
      if (newAchievements.length > 0) {
        localStorage.setItem('fluence_user_profile', JSON.stringify(profile));
      }
      
      return newAchievements;
    }
  
    // =================
    // TEACHER METHODS
    // =================
  
    // Create teacher class
    createClass(teacherProfile, className) {
      const classCode = this.generateClassCode();
      const classData = {
        id: this.generateUniqueId(),
        name: className,
        code: classCode,
        teacherId: teacherProfile.id,
        createdAt: new Date().toISOString(),
        students: [],
        inviteLink: `/join-class/${classCode}`
      };
      
      // Store class data
      const appData = JSON.parse(localStorage.getItem('fluence_app_data'));
      appData.classes.set(classData.id, classData);
      localStorage.setItem('fluence_app_data', JSON.stringify(appData));
      
      return classData;
    }
  
    // Student joins class
    joinClass(studentProfile, classCode) {
      const appData = JSON.parse(localStorage.getItem('fluence_app_data'));
      const classData = Array.from(appData.classes.values()).find(c => c.code === classCode);
      
      if (!classData) {
        return { success: false, message: 'Invalid class code' };
      }
      
      // Add student to class
      if (!classData.students.find(s => s.id === studentProfile.id)) {
        classData.students.push({
          id: studentProfile.id,
          username: studentProfile.username,
          joinedAt: new Date().toISOString()
        });
        
        // Update student profile
        studentProfile.classId = classData.id;
        studentProfile.classCode = classCode;
        studentProfile.teacherId = classData.teacherId;
        localStorage.setItem('fluence_user_profile', JSON.stringify(studentProfile));
        
        // Save updated class data
        appData.classes.set(classData.id, classData);
        localStorage.setItem('fluence_app_data', JSON.stringify(appData));
      }
      
      return { success: true, class: classData };
    }
  
    // Get students for a teacher
    getStudentsForTeacher(teacherId) {
      const appData = JSON.parse(localStorage.getItem('fluence_app_data'));
      const teacherClasses = Array.from(appData.classes.values()).filter(c => c.teacherId === teacherId);
      
      const allStudents = [];
      teacherClasses.forEach(classData => {
        classData.students.forEach(student => {
          // In a real app, we'd fetch full student profiles
          // For now, we'll simulate with the basic data
          allStudents.push({
            ...student,
            className: classData.name,
            classCode: classData.code
          });
        });
      });
      
      return allStudents;
    }
  
    // =================
    // LEADERBOARD & SOCIAL
    // =================
  
    updateLeaderboard() {
      // This would be more complex in a real app with multiple users
      // For now, we'll just store the current user's stats
      const profile = this.getUserProfile();
      const appData = JSON.parse(localStorage.getItem('fluence_app_data'));
      
      // Update global leaderboard entry
      const existingEntry = appData.globalLeaderboard.find(entry => entry.id === profile.id);
      const leaderboardData = {
        id: profile.id,
        username: profile.username,
        level: profile.level,
        xp: profile.currentXP,
        totalGamesPlayed: profile.totalGamesPlayed,
        averageScore: this.calculateOverallAverageScore(profile),
        lastActive: profile.lastActive
      };
      
      if (existingEntry) {
        Object.assign(existingEntry, leaderboardData);
      } else {
        appData.globalLeaderboard.push(leaderboardData);
      }
      
      // Sort by XP (descending)
      appData.globalLeaderboard.sort((a, b) => b.xp - a.xp);
      
      localStorage.setItem('fluence_app_data', JSON.stringify(appData));
      return appData.globalLeaderboard;
    }
  
    calculateOverallAverageScore(profile) {
      const subjects = Object.values(profile.subjectStats);
      const totalGames = subjects.reduce((sum, subject) => sum + subject.gamesPlayed, 0);
      const totalScoreSum = subjects.reduce((sum, subject) => 
        sum + (subject.averageScore * subject.gamesPlayed), 0
      );
      
      return totalGames > 0 ? Math.round(totalScoreSum / totalGames) : 0;
    }
  
    // Generate daily quests
    generateDailyQuests() {
      const today = new Date().toDateString();
      const quests = [
        {
          id: 'daily_quiz',
          title: 'Complete a Quiz',
          description: 'Complete any quiz today',
          xpReward: 20,
          progress: 0,
          target: 1,
          completed: false
        },
        {
          id: 'perfect_score',
          title: 'Perfect Score',
          description: 'Get 100% in any quiz',
          xpReward: 30,
          progress: 0,
          target: 1,
          completed: false
        },
        {
          id: 'three_subjects',
          title: 'Subject Explorer',
          description: 'Play quizzes from 3 different subjects',
          xpReward: 40,
          progress: 0,
          target: 3,
          completed: false
        }
      ];
      
      return {
        date: today,
        quests
      };
    }
  
    // =================
    // UTILITY METHODS
    // =================
  
    // Export user data (for backup/transfer)
    exportUserData() {
      const profile = this.getUserProfile();
      const appData = JSON.parse(localStorage.getItem('fluence_app_data'));
      
      return {
        profile,
        exportedAt: new Date().toISOString(),
        version: '2.0'
      };
    }
  
    // Import user data
    importUserData(userData) {
      if (userData.version === '2.0' && userData.profile) {
        localStorage.setItem('fluence_user_profile', JSON.stringify(userData.profile));
        return { success: true };
      }
      return { success: false, message: 'Invalid data format' };
    }
  
    // Reset user progress (with confirmation)
    resetUserProgress() {
      localStorage.removeItem('fluence_user_profile');
      return this.createDefaultProfile();
    }
  
    // Get comprehensive user statistics
    getUserStats() {
      const profile = this.getUserProfile();
      
      return {
        basic: {
          level: profile.level,
          xp: profile.currentXP,
          xpForNextLevel: this.getXPForNextLevel(profile.level),
          totalGamesPlayed: profile.totalGamesPlayed,
          totalQuestionsAnswered: profile.totalQuestionsAnswered,
          accuracyRate: Math.round((profile.totalCorrectAnswers / profile.totalQuestionsAnswered) * 100) || 0
        },
        streaks: {
          current: profile.currentStreak,
          max: profile.maxStreak,
          dailyCurrent: profile.dailyStreaks.currentStreak,
          dailyMax: profile.dailyStreaks.longestStreak
        },
        subjects: profile.subjectStats,
        achievements: profile.achievements,
        recentGames: profile.gameHistory.slice(0, 10)
      };
    }
  }
  
  // Export singleton instance
  export const dataManager = new DataManager();