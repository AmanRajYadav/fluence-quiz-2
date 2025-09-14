// INSTRUCTIONS: Replace your entire quiz component with this code
// Make sure you have installed: npm install socket.io-client
// Your server should be running on port 3001

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Users, Trophy, Target, Zap, AlertCircle } from 'lucide-react';
import io from 'socket.io-client';

console.log('QuizGame component loaded');

const QuizGame = () => {
  const [gameState, setGameState] = useState('menu'); // menu, waiting, countdown, playing, results, finished
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

  const initializeSocket = () => {
    try {
      console.log('Attempting to connect to server...');
      const socket = io('http://localhost:3001', {
        transports: ['websocket'],
        upgrade: false
      });
      
      socket.on('connect', () => {
        console.log('Connected to server');
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
    } else {
      alert('Failed to create room');
      setIsLoading(false);
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
    
    setTimeout(() => {
      // Will be set to 'playing' when first question arrives
    }, 3000);
  };

  const handleNewQuestion = (data) => {
    console.log('New question received:', data);
    setGameState('playing');
    setQuestionIndex(data.questionIndex);
    setCurrentQuestion(data.question);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setQuestionResults(null);
    setTimeLeft(Math.ceil(data.timeLimit / 1000));
    questionStartTime.current = data.startTime;

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
    console.log('Question results:', data);
    setQuestionResults(data);
    setGameState('results');
    
    const myResult = data.results.find(r => r.playerId === socketRef.current?.id);
    if (myResult) {
      setMyScore(myResult.totalScore);
    }
  };

  const handleGameEnded = (data) => {
    console.log('Game ended:', data);
    setFinalResults(data.results);
    setGameState('finished');
    
    const myResult = data.results.find(r => r.playerId === socketRef.current?.id);
    if (data.gameResult === 'tie') {
      setGameResult('tie');
    } else if (data.winner?.playerId === socketRef.current?.id) {
      setGameResult('won');
    } else {
      setGameResult('lost');
    }
  };

  const submitAnswer = (answer) => {
    console.log('Submitting answer:', answer);
    
    if (hasAnswered || gameState !== 'playing') {
      console.log('Cannot submit - already answered or wrong state');
      return;
    }
    
    setSelectedAnswer(answer);
    
    if (socketRef.current) {
      socketRef.current.emit('submit_answer', { answer });
    }
  };

  const createRoom = () => {
    if (!playerName.trim()) return;
    
    setIsLoading(true);
    initializeSocket();
    
    setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('create_room', {
          playerName: playerName.trim()
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
      timerRef.current = null;
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
    questionStartTime.current = null;
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionStatus('disconnected');
  };

  // Render different states
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Math Quiz Battle</h1>
            <p className="text-white/80">Real-time Multiplayer Quiz</p>
            <div className={`mt-2 text-sm ${connectionStatus === 'connected' ? 'text-green-300' : connectionStatus === 'error' ? 'text-red-300' : 'text-yellow-300'}`}>
              {connectionStatus === 'connected' ? '🟢 Connected' : 
               connectionStatus === 'error' ? '🔴 Connection Error' : 
               '🟡 Ready to Connect'}
            </div>
            <div className="mt-2 text-sm text-white/60">
              {totalQuestions} Questions • Speed Matters!
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
              disabled={!playerName.trim() || isLoading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Room'
              )}
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
              disabled={!playerName.trim() || !roomId.trim() || isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Joining...
                </>
              ) : (
                'Join Room'
              )}
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
              <div key={player.id} className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                <span>{player.name} {player.id === 'me' && '(You)'}</span>
                <span className="text-green-300">✓</span>
              </div>
            ))}
          </div>

          {players.length < 2 && (
            <div className="mt-6 text-sm text-white/60">
              Share room code: <span className="font-mono font-bold text-lg">{roomId}</span>
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
          <p className="text-white/80 mb-4">The quiz is about to begin...</p>
          <div className="text-6xl font-bold text-yellow-400 animate-pulse">3</div>
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
                  className={`p-4 rounded-lg border-2 transition duration-200 text-left relative ${
                    selectedAnswer === option
                      ? 'bg-blue-500 border-blue-400 transform scale-105'
                      : 'bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/50'
                  } ${hasAnswered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:transform hover:scale-105'}`}
                >
                  <span className="font-semibold mr-2 text-yellow-300">{String.fromCharCode(65 + index)}.</span>
                  {option}
                  {selectedAnswer === option && (
                    <div className="absolute top-2 right-2">
                      <Zap className="w-5 h-5 text-yellow-300" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {hasAnswered && (
            <div className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-4 text-white text-center">
              <Zap className="w-6 h-6 mx-auto mb-2" />
              Answer submitted! Waiting for results...
            </div>
          )}

          {timeLeft === 0 && !hasAnswered && (
            <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-4 text-white text-center">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              Time's up! Processing results...
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
                <div key={result.playerId} className={`rounded-lg p-4 ${result.playerId === socketRef.current?.id ? 'bg-blue-500/30' : 'bg-white/20'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">
                        {result.playerName} {result.playerId === socketRef.current?.id && '(You)'}
                      </div>
                      <div className="text-sm text-white/80">
                        Answer: {result.answer || 'No answer'} 
                        {result.isCorrect ? ' ✅' : result.answer ? ' ❌' : ' ⏰'}
                      </div>
                      <div className="text-xs text-white/60">
                        Response time: {(result.responseTime / 1000).toFixed(1)}s
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${result.pointsEarned > 0 ? 'text-green-300' : result.pointsEarned < 0 ? 'text-red-300' : 'text-white/60'}`}>
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

            <div className="text-center mt-6 text-white/80">
              {questionIndex + 1 < totalQuestions ? 
                `Next question in 3 seconds... (${questionIndex + 2}/${totalQuestions})` : 
                'Calculating final results...'
              }
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
                <p className="text-white/80 mt-2">Excellent performance!</p>
              </>
            )}
            {gameResult === 'lost' && (
              <>
                <Target className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h2 className="text-3xl font-bold text-red-400">Good Try!</h2>
                <p className="text-white/80 mt-2">Better luck next time!</p>
              </>
            )}
            {gameResult === 'tie' && (
              <>
                <Users className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h2 className="text-3xl font-bold text-blue-400">💛 Perfect Tie!</h2>
                <p className="text-white/80 mt-2">Evenly matched!</p>
              </>
            )}
          </div>

          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-3">Final Scores</h3>
            <div className="space-y-2">
              {finalResults?.map((result, index) => (
                <div key={result.playerId} className="flex justify-between items-center">
                  <span className="flex items-center">
                    {index === 0 && <Trophy className="w-4 h-4 mr-1 text-yellow-400" />}
                    {index + 1}. {result.playerName} {result.playerId === socketRef.current?.id && '(You)'}
                  </span>
                  <span className="font-bold text-lg">{result.totalScore}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              🎮 Play Again
            </button>
            
            <button
              onClick={resetGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              📚 Choose Different Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizGame;