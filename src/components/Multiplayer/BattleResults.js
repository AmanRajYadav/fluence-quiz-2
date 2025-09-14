import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Target, Clock, Users, Home, RotateCcw } from 'lucide-react';

const BattleResults = ({ 
  playerScore, 
  opponentScore, 
  playerName, 
  opponentName, 
  winner,
  totalQuestions,
  onPlayAgain,
  onBackToMenu 
}) => {
  const isPlayerWinner = winner === 'player';
  const isTie = winner === 'tie';

  const getWinnerMessage = () => {
    if (isTie) return "It's a Tie! 🤝";
    if (isPlayerWinner) return "Victory! 🎉";
    return "Defeat 😔";
  };

  const getWinnerSubtext = () => {
    if (isTie) return "Both players performed excellently!";
    if (isPlayerWinner) return "Congratulations on your amazing performance!";
    return "Better luck next time! Keep practicing!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Winner Announcement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-8"
        >
          <div className={`text-8xl mb-4 ${
            isTie ? '🤝' : isPlayerWinner ? '🏆' : '🥈'
          }`}>
            {isTie ? '🤝' : isPlayerWinner ? '🏆' : '🥈'}
          </div>
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
            isTie ? 'text-yellow-400' : isPlayerWinner ? 'text-green-400' : 'text-red-400'
          }`}>
            {getWinnerMessage()}
          </h1>
          <p className="text-xl text-gray-300">
            {getWinnerSubtext()}
          </p>
        </motion.div>

        {/* Score Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Final Scores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Score */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={`bg-white/10 rounded-xl p-6 text-center ${
                isPlayerWinner ? 'ring-2 ring-green-500' : isTie ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{playerName}</h3>
              <div className="text-4xl font-bold text-blue-400 mb-2">{playerScore}</div>
              <div className="text-gray-300">out of {totalQuestions * 20} points</div>
              {isPlayerWinner && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3"
                >
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Winner! 🎉
                  </span>
                </motion.div>
              )}
              {isTie && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3"
                >
                  <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Tied! 🤝
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Opponent Score */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`bg-white/10 rounded-xl p-6 text-center ${
                !isPlayerWinner && !isTie ? 'ring-2 ring-green-500' : isTie ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{opponentName}</h3>
              <div className="text-4xl font-bold text-purple-400 mb-2">{opponentScore}</div>
              <div className="text-gray-300">out of {totalQuestions * 20} points</div>
              {!isPlayerWinner && !isTie && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3"
                >
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Winner! 🎉
                  </span>
                </motion.div>
              )}
              {isTie && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-3"
                >
                  <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Tied! 🤝
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <Target className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Accuracy</h3>
            <div className="text-2xl font-bold text-blue-400">
              {Math.round((playerScore / (totalQuestions * 20)) * 100)}%
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <Clock className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Questions</h3>
            <div className="text-2xl font-bold text-green-400">
              {totalQuestions}
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <Medal className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Performance</h3>
            <div className="text-lg font-bold text-purple-400">
              {playerScore >= opponentScore ? 'Excellent' : 'Good'}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onPlayAgain}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          
          <button
            onClick={onBackToMenu}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BattleResults;