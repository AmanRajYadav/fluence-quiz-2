import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Trophy, Zap, Shield, Target } from 'lucide-react';

const LiveChallenge = ({ 
  questions, 
  currentQuestion, 
  onAnswerSelect, 
  playerScore, 
  opponentScore, 
  playerName, 
  opponentName,
  timeLeft,
  gameOver,
  onGameEnd
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [opponentAnswered, setOpponentAnswered] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    onAnswerSelect(answerIndex);
  };

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        onGameEnd({
          playerScore,
          opponentScore,
          winner: playerScore > opponentScore ? 'player' : opponentScore > playerScore ? 'opponent' : 'tie'
        });
      }, 2000);
    }
  }, [gameOver, playerScore, opponentScore, onGameEnd]);

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with scores and progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{playerScore}</div>
                  <div className="text-sm text-gray-300">{playerName}</div>
                </div>
                <div className="text-white text-xl font-bold">VS</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{opponentScore}</div>
                  <div className="text-sm text-gray-300">{opponentName}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-mono">{timeLeft}s</span>
                </div>
                <div className="text-white">
                  <span className="text-lg font-semibold">
                    {currentQuestion + 1} / {questions.length}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center leading-relaxed">
            {question.question}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: hasAnswered ? 1 : 1.02 }}
                whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                disabled={hasAnswered}
                className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${
                  hasAnswered
                    ? selectedAnswer === index
                      ? index === question.correct
                        ? 'border-green-500 bg-green-500/20 text-green-300'
                        : 'border-red-500 bg-red-500/20 text-red-300'
                      : index === question.correct
                        ? 'border-green-500 bg-green-500/20 text-green-300'
                        : 'border-gray-600 bg-gray-600/20 text-gray-400'
                    : 'border-gray-600 bg-white/5 text-white hover:border-blue-500 hover:bg-blue-500/20 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    hasAnswered && selectedAnswer === index
                      ? index === question.correct
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : hasAnswered && index === question.correct
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 text-white'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Answer status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-6"
        >
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 ${
            hasAnswered ? 'border-2 border-green-500' : 'border-2 border-gray-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${hasAnswered ? 'bg-green-500' : 'bg-gray-500 animate-pulse'}`} />
            <span className="text-white font-semibold">
              {hasAnswered ? 'You answered!' : 'Waiting for your answer...'}
            </span>
          </div>
          
          <div className={`bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 ${
            opponentAnswered ? 'border-2 border-green-500' : 'border-2 border-gray-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${opponentAnswered ? 'bg-green-500' : 'bg-gray-500 animate-pulse'}`} />
            <span className="text-white font-semibold">
              {opponentAnswered ? 'Opponent answered!' : 'Waiting for opponent...'}
            </span>
          </div>
        </motion.div>

        {/* Power-ups (if you want to add them later) */}
        {!hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-center gap-4"
          >
            <button className="bg-yellow-600/20 border border-yellow-600 text-yellow-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600/30 transition-colors">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Skip (1)</span>
            </button>
            <button className="bg-blue-600/20 border border-blue-600 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600/30 transition-colors">
              <Shield className="w-4 h-4" />
              <span className="text-sm">50/50 (1)</span>
            </button>
            <button className="bg-purple-600/20 border border-purple-600 text-purple-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600/30 transition-colors">
              <Target className="w-4 h-4" />
              <span className="text-sm">Hint (1)</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveChallenge;