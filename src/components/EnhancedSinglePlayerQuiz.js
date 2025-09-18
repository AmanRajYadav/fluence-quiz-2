// src/components/EnhancedSinglePlayerQuiz.js
// This enhances your existing SinglePlayerQuiz component with progress tracking

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dataManager } from '../managers/DataManager';
import { useCurriculum } from '../contexts/CurriculumContext';
import CurriculumService from '../services/curriculumService';
import FileTestService from '../services/FileTestService';

const EnhancedSinglePlayerQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get from curriculum context (same as your existing SinglePlayerQuiz)
  const { 
    selectedClass, 
    selectedSubject, 
    selectedChapter,
    curriculumQuestions,
    setCurriculumQuestions 
  } = useCurriculum();
  
  // Get quiz parameters from URL params or location state
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievements, setShowAchievements] = useState([]);

  // Initialize quiz
  useEffect(() => {
    const { selectedClass, selectedSubject, selectedChapter } = location.state || {};
    
    if (!selectedSubject || !selectedChapter) {
      navigate('/practice');
      return;
    }

    initializeQuiz(selectedClass, selectedSubject, selectedChapter);
  }, [location.state, navigate]);

  // Timer effect
  useEffect(() => {
    if (!showResult && questions.length > 0 && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, questions.length]);

  const initializeQuiz = async (selectedClass, selectedSubject, selectedChapter) => {
    try {
      // Load questions - you would replace this with your existing question loading logic
      const loadedQuestions = await loadQuestionsForChapter(selectedSubject, selectedChapter);
      
      if (!loadedQuestions || loadedQuestions.length === 0) {
        alert('No questions found for this chapter');
        navigate('/practice');
        return;
      }

      setQuizData({
        class: selectedClass,
        subject: selectedSubject,
        chapter: selectedChapter
      });
      
      setQuestions(shuffleArray(loadedQuestions).slice(0, 30)); // Take 30 random questions
      setGameStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setTimeLeft(30); // 30 seconds per question
    } catch (error) {
      console.error('Error loading quiz:', error);
      navigate('/practice');
    }
  };

  // Enhanced question loading using your existing FileTestService and CurriculumService
  const loadQuestionsForChapter = async (subject, chapter) => {
    try {
      console.log('🎯 Enhanced quiz loading questions for:', { selectedClass, subject, chapter });
      
      // First try to use questions from curriculum context (if already loaded)
      if (curriculumQuestions && curriculumQuestions.length > 0) {
        console.log('✅ Using questions from curriculum context:', curriculumQuestions.length);
        return curriculumQuestions.map(q => ({
          question: q.text || q.question,
          options: q.options || [],
          correctAnswer: q.options ? q.options[q.correct || 0] : q.correctAnswer,
          explanation: q.explanation || `The correct answer is ${q.correctAnswer || q.options?.[q.correct || 0]}`
        }));
      }

      // Try to fetch questions using your existing CurriculumService
      const fetchedQuestions = await CurriculumService.fetchQuestions(
        selectedClass, 
        subject, 
        chapter
      );
      
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        console.log('✅ Fetched questions via CurriculumService:', fetchedQuestions.length);
        setCurriculumQuestions(fetchedQuestions); // Store in context
        
        return fetchedQuestions.map(q => ({
          question: q.text || q.question,
          options: q.options || [],
          correctAnswer: q.options ? q.options[q.correct || 0] : q.correctAnswer,
          explanation: q.explanation || `The correct answer is ${q.correctAnswer || q.options?.[q.correct || 0]}`
        }));
      }

      // Fallback: Try FileTestService directly
      const result = await FileTestService.findWorkingPath(selectedClass, subject, chapter);
      if (result) {
        console.log('✅ FileTestService found working path:', result.path);
        const normalizedQuestions = CurriculumService.normalizeQuestions(result.data);
        if (normalizedQuestions.length > 0) {
          setCurriculumQuestions(normalizedQuestions);
          return normalizedQuestions.map(q => ({
            question: q.text || q.question,
            options: q.options || [],
            correctAnswer: q.options ? q.options[q.correct || 0] : q.correctAnswer,
            explanation: q.explanation || `The correct answer is ${q.correctAnswer || q.options?.[q.correct || 0]}`
          }));
        }
      }

      // Ultimate fallback - some sample questions
      console.warn('⚠️ Using fallback questions');
      return [
        {
          question: `Sample ${subject} question from ${chapter}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "This is the correct answer because..."
        }
      ];
      
    } catch (error) {
      console.error('❌ Error loading questions:', error);
      return [
        {
          question: `Sample ${subject} question from ${chapter}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "This is the correct answer because..."
        }
      ];
    }
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const responseTime = Date.now() - questionStartTime;
    
    // Calculate points (base 100 + time bonus)
    let points = 0;
    if (isCorrect) {
      const timeBonus = Math.max(0, Math.floor((30 - (30 - timeLeft)) / 30 * 50));
      points = 100 + timeBonus;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setStreak(0);
      setLives(prev => prev - 1);
    }

    // Show result for this question
    setShowResult({
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation,
      points,
      responseTime
    });

    // Remove auto-advance - user will click Next Question button
  };

  const handleTimeUp = () => {
    if (showResult) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    setStreak(0);
    setLives(prev => prev - 1);
    
    setShowResult({
      isCorrect: false,
      correctAnswer: currentQuestion.correctAnswer,
      explanation: currentQuestion.explanation || "Time's up!",
      points: 0,
      responseTime: 30000
    });

    // Remove auto-advance - user will click Next Question button
  };

  const moveToNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer('');
    
    if (currentQuestionIndex + 1 >= questions.length || lives <= 0) {
      endQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
      setQuestionStartTime(Date.now());
    }
  };

  const endQuiz = async () => {
    const totalTime = Date.now() - gameStartTime;
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    
    // Record game result using DataManager
    const gameData = {
      subject: quizData.subject,
      chapter: quizData.chapter,
      score: finalScore,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken: Math.floor(totalTime / 1000), // in seconds
      pointsEarned: score
    };

    const result = dataManager.recordGameResult(gameData);
    
    // Check for level up
    if (result.leveledUp) {
      setShowLevelUp(true);
    }
    
    // Check for new achievements
    if (result.profile.achievements) {
      const newAchievements = dataManager.checkAchievements(result.profile);
      if (newAchievements.length > 0) {
        setShowAchievements(newAchievements);
      }
    }

    setGameResults({
      ...result,
      finalScore,
      totalTime: Math.floor(totalTime / 1000),
      accuracy: Math.round((correctAnswers / questions.length) * 100),
      maxStreak,
      grade: getGrade(finalScore)
    });
  };

  const getGrade = (score) => {
    if (score >= 90) return { letter: 'A+', emoji: '🌟' };
    if (score >= 80) return { letter: 'A', emoji: '⭐' };
    if (score >= 70) return { letter: 'B', emoji: '👏' };
    if (score >= 60) return { letter: 'C', emoji: '👍' };
    return { letter: 'D', emoji: '💪' };
  };

  const handlePlayAgain = () => {
    // Reset all state
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setSelectedAnswer('');
    setShowResult(false);
    setTimeLeft(30);
    setGameResults(null);
    setLives(3);
    setStreak(0);
    setMaxStreak(0);
    setShowLevelUp(false);
    setShowAchievements([]);
    
    // Shuffle questions again
    setQuestions(shuffleArray(questions));
    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  // Loading state
  if (!questions.length || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  // Game results screen
  if (gameResults) {
    return (
      <GameResultsScreen
        results={gameResults}
        quizData={quizData}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={() => navigate('/')}
        onNextChapter={() => navigate('/practice/chapter-selection')}
        showLevelUp={showLevelUp}
        showAchievements={showAchievements}
        onDismissLevelUp={() => setShowLevelUp(false)}
        onDismissAchievement={(index) => 
          setShowAchievements(prev => prev.filter((_, i) => i !== index))
        }
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">
                {quizData.subject} - {quizData.chapter}
              </h1>
              <p className="text-purple-200">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <span>❤️</span>
                <span>{lives}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>🔥</span>
                <span>{streak}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>⭐</span>
                <span>{score}</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div
          className="text-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className={`text-6xl font-bold ${
            timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'
          }`}>
            {timeLeft}
          </div>
          <p className="text-purple-200 mt-1">seconds remaining</p>
        </motion.div>

        {/* Question Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-6"
          key={currentQuestionIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`p-4 rounded-lg text-left transition-all duration-300 ${
                  selectedAnswer === option
                    ? 'bg-blue-600 text-white scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Submit Button */}
          {selectedAnswer && !showResult && (
            <motion.button
              onClick={handleAnswerSubmit}
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Answer
            </motion.button>
          )}
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              className={`p-6 rounded-xl mb-6 ${
                showResult.isCorrect
                  ? 'bg-green-500/20 border border-green-400'
                  : 'bg-red-500/20 border border-red-400'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {showResult.isCorrect ? '✅' : '❌'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  showResult.isCorrect ? 'text-green-300' : 'text-red-300'
                }`}>
                  {showResult.isCorrect ? 'Correct!' : 'Wrong!'}
                </h3>
                
                {showResult.points > 0 && (
                  <p className="text-yellow-300 text-lg mb-2">
                    +{showResult.points} points!
                  </p>
                )}
                
                <p className="text-white mb-3">
                  <strong>Correct Answer:</strong> {showResult.correctAnswer}
                </p>
                
                {showResult.explanation && (
                  <p className="text-purple-200 text-sm mb-4">
                    {showResult.explanation}
                  </p>
                )}

                {/* Next Question Button */}
                <motion.button
                  onClick={moveToNextQuestion}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-bold transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next Question →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-300"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Game Results Screen Component
const GameResultsScreen = ({
  results,
  quizData,
  onPlayAgain,
  onBackToMenu,
  onNextChapter,
  showLevelUp,
  showAchievements,
  onDismissLevelUp,
  onDismissAchievement
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Level Up Notification */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              className="fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg z-50 max-w-sm"
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold">Level Up!</h3>
                <p>You reached Level {results.profile.level}!</p>
                <button
                  onClick={onDismissLevelUp}
                  className="mt-3 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Notifications */}
        <AnimatePresence>
          {showAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className="fixed top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg z-50 max-w-sm"
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              style={{ top: `${4 + (index * 80) + (showLevelUp ? 80 : 0)}px` }}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="font-bold">Achievement Unlocked!</div>
                  <div className="text-sm">{achievement.title}</div>
                  <div className="text-xs text-purple-100">
                    +{achievement.xpReward} XP
                  </div>
                </div>
                <button
                  onClick={() => onDismissAchievement(index)}
                  className="text-white/70 hover:text-white ml-auto"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Results Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-6xl mb-4">{results.grade.emoji}</div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Quiz Complete!
          </h1>
          
          <div className="text-6xl font-bold text-white mb-6">
            {results.grade.letter}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{results.finalScore}%</div>
              <div className="text-purple-200 text-sm">Score</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{results.xpGained}</div>
              <div className="text-purple-200 text-sm">XP Gained</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{results.maxStreak}</div>
              <div className="text-purple-200 text-sm">Max Streak</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{results.totalTime}s</div>
              <div className="text-purple-200 text-sm">Time Taken</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onPlayAgain}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
            >
              🔄 Play Again
            </button>
            
            <button
              onClick={onNextChapter}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105"
            >
              📚 Next Chapter
            </button>
            
            <button
              onClick={onBackToMenu}
              className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300"
            >
              🏠 Main Menu
            </button>
          </div>

          {/* Progress Summary */}
          <div className="mt-8 p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              Your Progress in {quizData.subject}
            </h3>
            <div className="text-purple-200 text-sm">
              Level {results.profile.level} • {results.profile.currentXP} XP • 
              {results.profile.totalGamesPlayed} games played
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedSinglePlayerQuiz;