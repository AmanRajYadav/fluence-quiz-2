// src/components/Social/Leaderboard.js
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
      xp: 150, 
      lastActive: Date.now(),
      avatarEmoji: '🎓'
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
  updateLeaderboard: () => {
    // Mock function that would update leaderboard in real app
    return true;
  }
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('xp');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all-time');
  const [showFriendRequest, setShowFriendRequest] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    loadLeaderboardData();
  }, [selectedCategory, selectedTimeframe]);

  const loadLeaderboardData = () => {
    const user = mockDataManager.getUserProfile();
    setCurrentUser(user);

    // Update user's position in leaderboard
    const updatedLeaderboard = mockDataManager.updateLeaderboard();
    
    // Generate mock leaderboard data (in a real app, this would come from backend)
    const mockLeaderboard = generateMockLeaderboard(user);
    setLeaderboardData(mockLeaderboard);
    
    // Load friends (mock data)
    setFriends(generateMockFriends(user));
    setFriendRequests(generateMockFriendRequests());
  };

  const generateMockLeaderboard = (currentUser) => {
    const userStats = mockDataManager.getUserStats();
    
    // Generate mock competitors
    const mockUsers = [
      { id: '1', username: 'QuizMaster2024', level: 15, xp: 3250, totalGamesPlayed: 156, averageScore: 89, avatarEmoji: '🎓' },
      { id: '2', username: 'StudyHero', level: 14, xp: 3100, totalGamesPlayed: 142, averageScore: 87, avatarEmoji: '📚' },
      { id: '3', username: 'BrainAce', level: 13, xp: 2980, totalGamesPlayed: 139, averageScore: 91, avatarEmoji: '🧠' },
      { id: '4', username: 'LearningLegend', level: 12, xp: 2750, totalGamesPlayed: 128, averageScore: 85, avatarEmoji: '⭐' },
      { id: '5', username: 'KnowledgeKnight', level: 11, xp: 2500, totalGamesPlayed: 118, averageScore: 83, avatarEmoji: '🏆' },
      { 
        id: currentUser.id, 
        username: currentUser.username, 
        level: userStats.basic.level, 
        xp: userStats.basic.xp, 
        totalGamesPlayed: userStats.basic.totalGamesPlayed, 
        averageScore: userStats.basic.accuracyRate,
        avatarEmoji: currentUser.avatarEmoji
      },
      { id: '6', username: 'SmartStudent', level: 10, xp: 2200, totalGamesPlayed: 102, averageScore: 82, avatarEmoji: '🤓' },
      { id: '7', username: 'QuizChamp', level: 9, xp: 1950, totalGamesPlayed: 95, averageScore: 79, avatarEmoji: '🚀' },
      { id: '8', username: 'StudyStar', level: 8, xp: 1700, totalGamesPlayed: 87, averageScore: 77, avatarEmoji: '🌟' },
      { id: '9', username: 'BrightMind', level: 7, xp: 1450, totalGamesPlayed: 78, averageScore: 75, avatarEmoji: '💡' },
    ];

    // Sort based on selected category
    return mockUsers.sort((a, b) => {
      switch (selectedCategory) {
        case 'xp':
          return b.xp - a.xp;
        case 'level':
          return b.level - a.level;
        case 'games':
          return b.totalGamesPlayed - a.totalGamesPlayed;
        case 'accuracy':
          return b.averageScore - a.averageScore;
        default:
          return b.xp - a.xp;
      }
    });
  };

  const generateMockFriends = (currentUser) => {
    return [
      { id: 'f1', username: 'StudyBuddy', level: 8, xp: 1600, status: 'online', avatarEmoji: '😊' },
      { id: 'f2', username: 'QuizPartner', level: 10, xp: 2100, status: 'offline', avatarEmoji: '🎯' },
      { id: 'f3', username: 'LearningPal', level: 9, xp: 1850, status: 'online', avatarEmoji: '📖' }
    ];
  };

  const generateMockFriendRequests = () => {
    return [
      { id: 'r1', username: 'NewFriend', level: 6, message: 'Hi! Let\'s study together!', avatarEmoji: '🤝' },
      { id: 'r2', username: 'ClassMate', level: 7, message: 'We\'re in the same class!', avatarEmoji: '🎓' }
    ];
  };

  const getUserRank = () => {
    return leaderboardData.findIndex(user => user.id === currentUser?.id) + 1;
  };

  const handleSendFriendRequest = (userId) => {
    // Mock friend request logic
    console.log('Sending friend request to:', userId);
    // In a real app, this would send an actual friend request
  };

  const handleAcceptFriendRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    // In a real app, this would accept the friend request and add to friends list
  };

  const handleDeclineFriendRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(req => req.id !== requestId));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading leaderboard...</div>
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
              <h1 className="text-3xl font-bold text-white">🏆 Leaderboard</h1>
              <p className="text-purple-200">Compete with fellow learners</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFriendRequest(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                👥 Friends
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

        {/* Current User Rank Card */}
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentUser.avatarEmoji}</div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Rank</h2>
                <p className="text-purple-100">{currentUser.username}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">#{getUserRank()}</div>
              <div className="text-purple-100 text-sm">out of {leaderboardData.length}</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Leaderboard */}
          <div className="lg:col-span-2">
            {/* Category and Time Filters */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-white font-medium">Rank by:</span>
                  {[
                    { id: 'xp', label: '⭐ XP', icon: '⭐' },
                    { id: 'level', label: '📊 Level', icon: '📊' },
                    { id: 'games', label: '🎮 Games', icon: '🎮' },
                    { id: 'accuracy', label: '🎯 Accuracy', icon: '🎯' }
                  ].map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-purple-200 hover:bg-white/20'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-white font-medium">Time:</span>
                {[
                  { id: 'all-time', label: 'All Time' },
                  { id: 'month', label: 'This Month' },
                  { id: 'week', label: 'This Week' }
                ].map((timeframe) => (
                  <button
                    key={timeframe.id}
                    onClick={() => setSelectedTimeframe(timeframe.id)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      selectedTimeframe === timeframe.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">🏅 Top Players</h2>
              
              <div className="space-y-3">
                {leaderboardData.slice(0, 20).map((user, index) => (
                  <LeaderboardItem
                    key={user.id}
                    user={user}
                    rank={index + 1}
                    category={selectedCategory}
                    isCurrentUser={user.id === currentUser.id}
                    onSendFriendRequest={() => handleSendFriendRequest(user.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Friends & Stats */}
          <div className="space-y-6">
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-xl p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  👤 Friend Requests ({friendRequests.length})
                </h3>
                
                <div className="space-y-3">
                  {friendRequests.map((request) => (
                    <FriendRequestItem
                      key={request.id}
                      request={request}
                      onAccept={() => handleAcceptFriendRequest(request.id)}
                      onDecline={() => handleDeclineFriendRequest(request.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Friends List */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">
                👥 Friends ({friends.length})
              </h3>
              
              {friends.length === 0 ? (
                <div className="text-center py-6 text-purple-200">
                  <div className="text-3xl mb-2">👋</div>
                  <p className="text-sm">No friends yet!</p>
                  <p className="text-xs">Add friends to compete together</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {friends.map((friend) => (
                    <FriendItem key={friend.id} friend={friend} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">📊 Your Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-200">Current Rank:</span>
                  <span className="text-white font-bold">#{getUserRank()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-purple-200">Total XP:</span>
                  <span className="text-white font-bold">{mockDataManager.getUserStats().basic.xp}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-purple-200">Level:</span>
                  <span className="text-white font-bold">{mockDataManager.getUserStats().basic.level}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-purple-200">Games Won:</span>
                  <span className="text-white font-bold">
                    {Math.floor(mockDataManager.getUserStats().basic.totalGamesPlayed * 0.7)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Subject Rankings */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">📚 Subject Rankings</h3>
              
              <div className="space-y-3">
                {Object.entries(mockDataManager.getUserStats().subjects)
                  .filter(([_, stats]) => stats.gamesPlayed > 0)
                  .slice(0, 3)
                  .map(([subjectId, stats]) => {
                    const subject = Object.values(SUBJECTS).find(s => s.id === subjectId);
                    return (
                      <div key={subjectId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{subject?.icon}</span>
                          <span className="text-purple-200 text-sm">{subject?.name}</span>
                        </div>
                        <span className="text-white text-sm font-bold">
                          #{Math.floor(Math.random() * 10) + 1}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Friends Modal */}
      <AnimatePresence>
        {showFriendRequest && (
          <FriendsModal
            friends={friends}
            friendRequests={friendRequests}
            onClose={() => setShowFriendRequest(false)}
            onAcceptRequest={handleAcceptFriendRequest}
            onDeclineRequest={handleDeclineFriendRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Leaderboard Item Component
const LeaderboardItem = ({ user, rank, category, isCurrentUser, onSendFriendRequest }) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getCategoryValue = () => {
    switch (category) {
      case 'xp':
        return `${user.xp} XP`;
      case 'level':
        return `Level ${user.level}`;
      case 'games':
        return `${user.totalGamesPlayed} games`;
      case 'accuracy':
        return `${user.averageScore}%`;
      default:
        return `${user.xp} XP`;
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
        isCurrentUser
          ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400'
          : 'bg-white/5 hover:bg-white/10'
      }`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-white min-w-[3rem]">
          {getRankIcon(rank)}
        </div>
        
        <div className="text-3xl">{user.avatarEmoji}</div>
        
        <div>
          <div className="flex items-center space-x-2">
            <h3 className={`font-bold ${isCurrentUser ? 'text-yellow-300' : 'text-white'}`}>
              {user.username}
            </h3>
            {isCurrentUser && (
              <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full font-bold">
                YOU
              </span>
            )}
          </div>
          
          <div className="text-purple-200 text-sm">
            Level {user.level} • {user.totalGamesPlayed} games
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-lg font-bold text-white">
          {getCategoryValue()}
        </div>
        
        {!isCurrentUser && (
          <button
            onClick={onSendFriendRequest}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors mt-1"
          >
            Add Friend
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Friend Item Component
const FriendItem = ({ friend }) => (
  <motion.div
    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="text-2xl">{friend.avatarEmoji}</div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
        }`}></div>
      </div>
      
      <div>
        <div className="text-white font-medium">{friend.username}</div>
        <div className="text-purple-200 text-xs">
          Level {friend.level} • {friend.xp} XP
        </div>
      </div>
    </div>
    
    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors">
      Challenge
    </button>
  </motion.div>
);

// Friend Request Item Component
const FriendRequestItem = ({ request, onAccept, onDecline }) => (
  <motion.div
    className="p-3 bg-blue-500/20 border border-blue-400/50 rounded-lg"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="flex items-center space-x-3 mb-3">
      <div className="text-2xl">{request.avatarEmoji}</div>
      <div>
        <div className="text-white font-medium">{request.username}</div>
        <div className="text-blue-200 text-xs">Level {request.level}</div>
      </div>
    </div>
    
    {request.message && (
      <p className="text-blue-100 text-sm mb-3 italic">"{request.message}"</p>
    )}
    
    <div className="flex space-x-2">
      <button
        onClick={onAccept}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-xs transition-colors"
      >
        Accept
      </button>
      
      <button
        onClick={onDecline}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-xs transition-colors"
      >
        Decline
      </button>
    </div>
  </motion.div>
);

// Friends Modal Component
const FriendsModal = ({ friends, friendRequests, onClose, onAcceptRequest, onDeclineRequest }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">👥 Friends & Requests</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-xl"
        >
          ✕
        </button>
      </div>
      
      {/* Friend Requests Section */}
      {friendRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            🔔 Friend Requests ({friendRequests.length})
          </h3>
          
          <div className="space-y-3">
            {friendRequests.map((request) => (
              <FriendRequestItem
                key={request.id}
                request={request}
                onAccept={() => onAcceptRequest(request.id)}
                onDecline={() => onDeclineRequest(request.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Friends Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          👥 My Friends ({friends.length})
        </h3>
        
        {friends.length === 0 ? (
          <div className="text-center py-8 text-purple-200">
            <div className="text-4xl mb-4">👋</div>
            <p>No friends yet!</p>
            <p className="text-sm">Add friends from the leaderboard to start competing together</p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <FriendItem key={friend.id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
);

export default Leaderboard;