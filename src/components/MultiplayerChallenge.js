import React, { useState, useEffect, useRef } from 'react';
import { Clock, Users, Trophy, Target, Zap, AlertCircle } from 'lucide-react';
import io from 'socket.io-client';
import { useCurriculum } from '../contexts/CurriculumContext';
import CurriculumService from '../services/curriculumService';

const MultiplayerQuiz = () => {
  // Get from curriculum context (READ-ONLY)
  const { 
    selectedClass, 
    selectedSubject, 
    selectedChapter,
    curriculumQuestions,
    setCurriculumQuestions 
  } = useCurriculum();

  // Local component state
  const [gameState, setGameState] = useState('menu');
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [questionResults, setQuestionResults] = useState(null);
  const [finalResults, setFinalResults] = useState(null);
  const [players, setPlayers] = useState([]);
  const [myScore, setMyScore] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  
  // Immediate feedback like QuizUp
  const [immediateFeedback, setImmediateFeedback] = useState({
    isCorrect: false,
    pointsEarned: 0,
    responseTime: 0,
    showAnimation: false
  });
  
  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const questionStartTime = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Force load questions if not available
  useEffect(() => {
    const loadQuestionsIfMissing = async () => {
      if (selectedClass && selectedSubject && selectedChapter && curriculumQuestions.length === 0) {
        console.log('Questions missing, loading...');
        
        try {
          const questions = await CurriculumService.fetchQuestions(
            selectedClass, 
            selectedSubject, 
            selectedChapter
          );
          
          console.log('Loaded questions in multiplayer:', questions.length);
          setCurriculumQuestions(questions);
          
        } catch (error) {
          console.error('Failed to load questions in multiplayer:', error);
        }
      }
    };

    loadQuestionsIfMissing();
  }, [selectedClass, selectedSubject, selectedChapter, curriculumQuestions.length, setCurriculumQuestions]);

  // TEMPORARY: Force questions for testing
  useEffect(() => {
    if (curriculumQuestions.length === 0 && selectedClass && selectedSubject && selectedChapter) {
      const testQuestions = CurriculumService.getHardcodedQuestions(
        selectedClass, 
        selectedSubject, 
        selectedChapter
      );
      
      if (testQuestions.length > 0) {
        setCurriculumQuestions(testQuestions);
        console.log('Using test questions:', testQuestions.length);
      }
    }
  }, [selectedClass, selectedSubject, selectedChapter, curriculumQuestions.length, setCurriculumQuestions]);

  // Debug logging for curriculum questions
  useEffect(() => {
    if (curriculumQuestions.length > 0) {
      console.log('First curriculum question:', curriculumQuestions[0]);
      console.log('Correct answer for first question:', curriculumQuestions[0].correctAnswer);
      console.log('Options for first question:', curriculumQuestions[0].options);
    }
  }, [curriculumQuestions]);

  // Test direct fetch for debugging
  useEffect(() => {
    const testDirectFetch = async () => {
      try {
        console.log('Testing direct fetch...');
        const response = await fetch('/data/classes/class6/mathematics/patterns-in-mathematics.json');
        const data = await response.json();
        console.log('Direct fetch success:', data);
        
        // Process the questions immediately
        const processedQuestions = CurriculumService.normalizeQuestions(data);
        console.log('Processed questions:', processedQuestions);
        
        if (processedQuestions.length > 0) {
          setCurriculumQuestions(processedQuestions);
        }
        
      } catch (error) {
        console.error('Direct fetch failed:', error);
      }
    };

    // Only run if no questions are loaded yet
    if (curriculumQuestions.length === 0 && selectedClass && selectedSubject && selectedChapter) {
      testDirectFetch();
    }
  }, [selectedClass, selectedSubject, selectedChapter, curriculumQuestions.length, setCurriculumQuestions]);

  // Default questions fallback
  const defaultQuestions = [
    {
      text: "What is 3²?",
      options: ["6", "8", "9", "12"],
      correctAnswer: "9",
      explanation: "3² = 3 × 3 = 9"
    },
    {
      text: "What is 144 ÷ 12?",
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      explanation: "144 ÷ 12 = 12"
    },
    {
      text: "What is the square root of 64?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "8",
      explanation: "√64 = 8"
    },
    {
      text: "What is 15% of 200?",
      options: ["25", "30", "35", "40"],
      correctAnswer: "30",
      explanation: "15% of 200 = 0.15 × 200 = 30"
    },
    {
      text: "What is 7 × 8?",
      options: ["54", "56", "58", "60"],
      correctAnswer: "56",
      explanation: "7 × 8 = 56"
    }
  ];


  const initializeSocket = () => {
    try {
      const socket = io('http://localhost:3001', {
        transports: ['websocket'],
        upgrade: false
      });
      
      socket.on('connect', () => {
        console.log('Connected to server with ID:', socket.id);
        setConnectionStatus('connected');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnectionStatus('disconnected');
      });

      socket.on('room_created', handleRoomCreated);
      socket.on('room_joined', handleRoomJoined);
      socket.on('player_joined', handlePlayerJoined);
      socket.on('game_started', handleGameStarted);
      socket.on('new_question', handleNewQuestion);
      socket.on('answer_received', handleAnswerReceived);
      socket.on('question_results', handleQuestionResults);
      socket.on('game_ended', handleGameEnded);
      
      socketRef.current = socket;
      
    } catch (error) {
      console.error('Socket connection failed:', error);
      setConnectionStatus('error');
    }
  };

  const handleRoomCreated = (data) => {
    if (data.success) {
      setRoomId(data.roomId);
      setGameState('waiting');
      setPlayers([{ id: 'me', name: playerName, score: 0 }]);
    }
  };

  const handleRoomJoined = (data) => {
    if (data.success) {
      setRoomId(data.roomId);
      setGameState('waiting');
    } else {
      alert(data.message || 'Failed to join room');
      setIsLoading(false);
    }
  };

  const handlePlayerJoined = (data) => {
    console.log('Player joined:', data);
    setPlayers(prev => {
      const newPlayers = [...prev];
      const existingIndex = newPlayers.findIndex(p => p.id === data.playerId);
      if (existingIndex === -1) {
        newPlayers.push({ id: data.playerId, name: data.playerName, score: 0 });
      }
      return newPlayers;
    });
  };

  const handleGameStarted = (data) => {
    console.log('Game started:', data);
    setGameState('countdown');
    setTotalQuestions(data.totalQuestions);
  };

  const handleNewQuestion = (data) => {
    console.log('New question from server:', data);
    
    // Use curriculum question from context
    const curriculumQuestion = curriculumQuestions[data.questionIndex];
    
    if (!curriculumQuestion) {
      console.error('Curriculum question not found for index:', data.questionIndex);
      return;
    }

    setGameState('playing');
    setQuestionIndex(data.questionIndex);
    setCurrentQuestion(curriculumQuestion);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setQuestionResults(null);
    setTimeLeft(Math.ceil(data.timeLimit / 1000));
    questionStartTime.current = data.startTime;

    // Reset immediate feedback
    setImmediateFeedback({
      isCorrect: false,
      pointsEarned: 0,
      responseTime: 0,
      showAnimation: false
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - data.startTime;
      const remaining = Math.max(0, Math.ceil((data.timeLimit - elapsed) / 1000));
      
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timerRef.current);
      }
    }, 100);
  };

  const handleAnswerReceived = (data) => {
    if (data.success) {
      setHasAnswered(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleQuestionResults = (data) => {
    console.log('Server results received:', data);
    
    // Update with authoritative server results for final synchronization
    const myResult = data.results.find(r => r.playerId === socketRef.current?.id);
    if (myResult) {
      // Sync score with server (in case of discrepancies)
      setMyScore(myResult.totalScore);
    }
    
    // Store results but don't immediately show - keep the flow going
    setQuestionResults(data);
    
    // Move to next question faster (reduced delay)
    setTimeout(() => {
      if (questionIndex + 1 < totalQuestions) {
        // Next question starts immediately - no results screen
        setGameState('playing');
      } else {
        // Only show results at the very end
        setGameState('finished');
      }
    }, 1000); // Much shorter delay
  };

  const handleGameEnded = (data) => {
    console.log('Game ended:', data);
    setFinalResults(data.results);
    setGameState('finished');
    
    if (data.gameResult === 'tie') {
      setGameResult('tie');
    } else if (data.winner?.playerId === socketRef.current?.id) {
      setGameResult('won');
    } else {
      setGameResult('lost');
    }
  };

  const submitAnswer = (answer) => {
    if (hasAnswered || gameState !== 'playing' || !currentQuestion) {
      return;
    }
    
    setSelectedAnswer(answer);
    setHasAnswered(true);
    
    // FIXED: Use the actual correct answer text (not index)
    const isCorrect = answer === currentQuestion.correctAnswer;
    const responseTime = Date.now() - questionStartTime.current;
    
    console.log('Answer validation:', {
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
      allOptions: currentQuestion.options
    });
    
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = 100 + Math.max(0, 50 - Math.floor(responseTime / 200));
    } else {
      pointsEarned = -25;
    }
    
    setImmediateFeedback({
      isCorrect: isCorrect,
      pointsEarned: pointsEarned,
      showAnimation: true
    });
    
    setMyScore(prev => prev + pointsEarned);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Submit to server for synchronization (but don't wait for response)
    if (socketRef.current) {
      socketRef.current.emit('submit_answer', { 
        answer,
        clientResponseTime: responseTime,
        clientPointsEarned: pointsEarned
      });
    }
    
    // Hide animation after 2 seconds
    setTimeout(() => {
      setImmediateFeedback(prev => ({ ...prev, showAnimation: false }));
    }, 2000);
  };

  const createRoom = () => {
    if (!playerName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!curriculumQuestions || curriculumQuestions.length === 0) {
      alert('No questions available. Please go back and select a chapter.');
      return;
    }

    setIsLoading(true);
    initializeSocket();
    
    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('create_room', {
          playerName: playerName.trim(),
          questions: curriculumQuestions, // Use questions from context
          gameConfig: {
            classId: selectedClass,
            subjectId: selectedSubject,
            chapterId: selectedChapter
          }
        });
      }
    }, 1000);
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) return;
    
    setIsLoading(true);
    initializeSocket();
    
    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('join_room', {
          roomId: roomId.trim().toUpperCase(),
          playerName: playerName.trim()
        });
      }
    }, 1000);
  };

  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setGameState('menu');
    setRoomId('');
    setCurrentQuestion(null);
    setTimeLeft(0);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setQuestionResults(null);
    setFinalResults(null);
    setPlayers([]);
    setMyScore(0);
    setGameResult(null);
    setIsLoading(false);
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionStatus('disconnected');
  };

  // Return the SAME UI structure but with working functionality
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Multiplayer Challenge</h1>
            <p className="text-white/80">Ready for real-time competition?</p>
            <div className={`mt-2 text-sm ${connectionStatus === 'connected' ? 'text-green-300' : 'text-yellow-300'}`}>
              {connectionStatus === 'connected' ? '🟢 Connected' : '🟡 Ready to Connect'}
            </div>
          </div>

          {/* Show selected curriculum info */}
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Selected Curriculum:</h3>
            <div className="text-sm space-y-1">
              <div>📚 Class: {selectedClass || 'Not selected'}</div>
              <div>📖 Subject: {selectedSubject || 'Not selected'}</div>
              <div>📝 Chapter: {selectedChapter || 'Not selected'}</div>
              <div>❓ Questions: {curriculumQuestions?.length || 0} loaded</div>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />

            <button
              onClick={createRoom}
              disabled={!playerName.trim() || !curriculumQuestions?.length || isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              {isLoading ? 'Creating...' : 
               !curriculumQuestions?.length ? 'No Questions Available' : 
               'Create Room'}
            </button>

            <div className="text-center text-white/60">or</div>

            <input
              type="text"
              placeholder="Enter room code"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-white/20 rounded-lg border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />

            <button
              onClick={joinRoom}
              disabled={!playerName.trim() || !roomId.trim() || !curriculumQuestions?.length}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-white text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl font-bold mb-4">Room: {roomId}</h2>
          <p className="text-white/80 mb-6">Waiting for players to join...</p>
          
          <div className="space-y-2">
            {players.map((player, index) => (
              <div key={player.id} className="bg-white/20 rounded-lg p-3">
                {player.name} {player.id === 'me' && '(You)'}
              </div>
            ))}
          </div>

          {players.length < 2 && (
            <div className="mt-6 text-sm text-white/60">
              Share room code: <span className="font-mono font-bold">{roomId}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'countdown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-4">Get Ready!</h2>
          <p className="text-white/80">The quiz is about to begin...</p>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Question {questionIndex + 1} of {totalQuestions}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Score: {myScore}</span>
                </div>
              </div>
              
              <div className={`flex items-center space-x-2 ${timeLeft <= 3 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                <Clock className="w-5 h-5" />
                <span className="text-2xl font-bold">{timeLeft}s</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 text-white">
            <h2 className="text-2xl font-bold mb-8 text-center">{currentQuestion?.text}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => submitAnswer(option)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 text-left relative ${
                    hasAnswered && selectedAnswer === option
                      ? currentQuestion.correctAnswer === option
                        ? 'bg-green-500 border-green-400 text-white transform scale-105' // IMMEDIATE GREEN
                        : 'bg-red-500 border-red-400 text-white transform scale-105'     // IMMEDIATE RED
                      : hasAnswered && currentQuestion.correctAnswer === option
                        ? 'bg-green-500 border-green-400 text-white'  // Show correct answer
                        : selectedAnswer === option
                          ? 'bg-blue-500 border-blue-400 transform scale-105'
                          : 'bg-white/20 border-white/30 hover:bg-white/30'
                  } ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  
                  {/* Immediate feedback icons like QuizUp */}
                  {hasAnswered && selectedAnswer === option && (
                    <div className="absolute top-2 right-2">
                      {currentQuestion.correctAnswer === option ? 
                        <span className="text-2xl">✅</span> : 
                        <span className="text-2xl">❌</span>
                      }
                    </div>
                  )}
                  
                  {/* Show correct answer icon for unselected correct option */}
                  {hasAnswered && selectedAnswer !== option && currentQuestion.correctAnswer === option && (
                    <div className="absolute top-2 right-2">
                      <span className="text-2xl">✅</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {hasAnswered && (
            <div className={`backdrop-blur-lg rounded-2xl p-4 text-white text-center ${
              immediateFeedback.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <Zap className="w-6 h-6 mx-auto mb-2" />
              <div className="flex items-center justify-center gap-2">
                <span>Answer submitted!</span>
                <span className={`font-bold ${
                  immediateFeedback.isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                  {immediateFeedback.isCorrect ? '+' : ''}{immediateFeedback.pointsEarned} pts
                </span>
              </div>
            </div>
          )}

          {/* Immediate points animation overlay */}
          {immediateFeedback.showAnimation && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className={`text-6xl font-bold animate-bounce ${
                immediateFeedback.isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {immediateFeedback.isCorrect ? '+' : ''}{immediateFeedback.pointsEarned}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Question Results</h2>
            
            <div className="text-center mb-6">
              <div className="text-lg mb-2">
                Correct Answer: <span className="font-bold text-green-300">{questionResults?.correctAnswer}</span>
              </div>
              <div className="text-white/80">{questionResults?.explanation}</div>
            </div>

            <div className="space-y-4">
              {questionResults?.results.map((result) => (
                <div key={result.playerId} className="bg-white/20 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">
                        {result.playerName} {result.playerId === socketRef.current?.id && '(You)'}
                      </div>
                      <div className="text-sm text-white/80">
                        Answer: {result.answer || 'No answer'} 
                        {result.isCorrect ? ' ✅' : result.answer ? ' ❌' : ' ⏰'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${result.pointsEarned > 0 ? 'text-green-300' : result.pointsEarned < 0 ? 'text-red-300' : 'text-white/60'}`}>
                        {result.pointsEarned > 0 ? '+' : ''}{result.pointsEarned}
                      </div>
                      <div className="text-sm text-white/80">
                        Total: {result.totalScore}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-white text-center">
          <div className="mb-6">
            {gameResult === 'won' && (
              <>
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-3xl font-bold text-yellow-400">🎉 Victory!</h2>
              </>
            )}
            {gameResult === 'lost' && (
              <>
                <Target className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h2 className="text-3xl font-bold text-red-400">Good Try!</h2>
              </>
            )}
            {gameResult === 'tie' && (
              <>
                <Users className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h2 className="text-3xl font-bold text-blue-400">💛 Perfect Tie!</h2>
              </>
            )}
          </div>

          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Final Scores</h3>
            <div className="space-y-2">
              {finalResults?.map((result, index) => (
                <div key={result.playerId} className="flex justify-between items-center">
                  <span>
                    {index + 1}. {result.playerName} {result.playerId === socketRef.current?.id && '(You)'}
                  </span>
                  <span className="font-bold">{result.totalScore}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            🎮 Play Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MultiplayerQuiz;