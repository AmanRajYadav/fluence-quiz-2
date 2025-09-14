const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Game rooms storage
const gameRooms = new Map();

// Sample questions for the quiz
const sampleQuestions = [
  {
    text: "What is 12 + 8?",
    options: ["18", "19", "20", "21"],
    correctAnswer: "20",
    explanation: "12 + 8 = 20"
  },
  {
    text: "What is 7 × 3?",
    options: ["20", "21", "22", "23"],
    correctAnswer: "21",
    explanation: "7 × 3 = 21"
  },
  {
    text: "What is 24 ÷ 6?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    explanation: "24 ÷ 6 = 4"
  },
  {
    text: "Which number comes next: 2, 4, 6, 8, ?",
    options: ["9", "10", "11", "12"],
    correctAnswer: "10",
    explanation: "The pattern increases by 2: 2, 4, 6, 8, 10"
  },
  {
    text: "What is the area of a rectangle with length 5 and width 3?",
    options: ["8", "12", "15", "18"],
    correctAnswer: "15",
    explanation: "Area = length × width = 5 × 3 = 15"
  },
  {
    text: "What do plants need to make food?",
    options: ["Water only", "Sunlight only", "Water and sunlight", "Soil only"],
    correctAnswer: "Water and sunlight",
    explanation: "Plants need both water and sunlight for photosynthesis"
  },
  {
    text: "Which of these is a magnet attracted to?",
    options: ["Wood", "Plastic", "Iron", "Glass"],
    correctAnswer: "Iron",
    explanation: "Magnets are attracted to iron and other magnetic materials"
  },
  {
    text: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    correctAnswer: "Delhi",
    explanation: "Delhi is the capital of India"
  },
  {
    text: "What is the past tense of 'run'?",
    options: ["runned", "ran", "runs", "running"],
    correctAnswer: "ran",
    explanation: "The past tense of 'run' is 'ran'"
  },
  {
    text: "What is the plural of 'child'?",
    options: ["childs", "children", "childes", "child"],
    correctAnswer: "children",
    explanation: "The plural of 'child' is 'children'"
  }
];

// Generate unique room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Calculate score based on correctness and response time
function calculateScore(isCorrect, responseTime, maxTime = 15000) {
  if (!isCorrect) return 0;
  
  const timeBonus = Math.max(0, (maxTime - responseTime) / maxTime);
  const baseScore = 100;
  const bonusScore = Math.floor(timeBonus * 50);
  
  return baseScore + bonusScore;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', (data) => {
    const roomId = generateRoomId();
    const room = {
      id: roomId,
      host: socket.id,
      players: [{
        id: socket.id,
        name: data.playerName,
        score: 0,
        ready: false
      }],
      gameState: 'waiting',
      currentQuestion: 0,
      questions: sampleQuestions.sort(() => Math.random() - 0.5).slice(0, 10),
      questionStartTime: null,
      answers: new Map()
    };
    
    gameRooms.set(roomId, room);
    socket.join(roomId);
    socket.roomId = roomId;
    
    socket.emit('room_created', { success: true, roomId });
    console.log(`Room created: ${roomId} by ${data.playerName}`);
  });

  socket.on('join_room', (data) => {
    const room = gameRooms.get(data.roomId);
    
    if (!room) {
      socket.emit('room_joined', { success: false, message: 'Room not found' });
      return;
    }
    
    if (room.players.length >= 2) {
      socket.emit('room_joined', { success: false, message: 'Room is full' });
      return;
    }
    
    if (room.gameState !== 'waiting') {
      socket.emit('room_joined', { success: false, message: 'Game already in progress' });
      return;
    }
    
    room.players.push({
      id: socket.id,
      name: data.playerName,
      score: 0,
      ready: false
    });
    
    socket.join(data.roomId);
    socket.roomId = data.roomId;
    
    socket.emit('room_joined', { success: true, roomId: data.roomId });
    
    // Notify all players in room
    io.to(data.roomId).emit('player_joined', {
      playerId: socket.id,
      playerName: data.playerName,
      totalPlayers: room.players.length
    });
    
    console.log(`${data.playerName} joined room: ${data.roomId}`);
    
    // Auto-start game when 2 players join
    if (room.players.length === 2) {
      setTimeout(() => {
        startGame(data.roomId);
      }, 2000);
    }
  });

  socket.on('submit_answer', (data) => {
    const room = gameRooms.get(socket.roomId);
    if (!room || room.gameState !== 'playing') return;
    
    const responseTime = Date.now() - room.questionStartTime;
    const currentQuestion = room.questions[room.currentQuestion];
    const isCorrect = data.answer === currentQuestion.correctAnswer;
    
    // Store answer
    room.answers.set(socket.id, {
      answer: data.answer,
      isCorrect,
      responseTime,
      timestamp: Date.now()
    });
    
    // Update player score
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      const points = calculateScore(isCorrect, responseTime);
      player.score += points;
    }
    
    socket.emit('answer_received', { success: true });
    
    // Check if all players have answered
    if (room.answers.size === room.players.length) {
      processQuestionResults(socket.roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.roomId) {
      const room = gameRooms.get(socket.roomId);
      if (room) {
        room.players = room.players.filter(p => p.id !== socket.id);
        
        if (room.players.length === 0) {
          gameRooms.delete(socket.roomId);
          console.log(`Room ${socket.roomId} deleted - no players left`);
        } else {
          // Notify remaining players
          io.to(socket.roomId).emit('player_left', { playerId: socket.id });
        }
      }
    }
  });
});

function startGame(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  room.gameState = 'playing';
  room.currentQuestion = 0;
  
  io.to(roomId).emit('game_started', {
    totalQuestions: room.questions.length
  });
  
  console.log(`Game started in room: ${roomId}`);
  
  // Send first question after countdown
  setTimeout(() => {
    sendQuestion(roomId);
  }, 3000);
}

function sendQuestion(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  const question = room.questions[room.currentQuestion];
  room.questionStartTime = Date.now();
  room.answers.clear();
  
  io.to(roomId).emit('new_question', {
    questionIndex: room.currentQuestion,
    question: {
      text: question.text,
      options: question.options
    },
    timeLimit: 15000,
    startTime: room.questionStartTime
  });
  
  console.log(`Question ${room.currentQuestion + 1} sent to room: ${roomId}`);
  
  // Auto-process results after timeout
  setTimeout(() => {
    if (room.gameState === 'playing') {
      processQuestionResults(roomId);
    }
  }, 15000);
}

function processQuestionResults(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  const question = room.questions[room.currentQuestion];
  const results = room.players.map(player => {
    const answer = room.answers.get(player.id);
    const pointsEarned = answer ? calculateScore(answer.isCorrect, answer.responseTime) : 0;
    
    return {
      playerId: player.id,
      playerName: player.name,
      answer: answer?.answer || null,
      isCorrect: answer?.isCorrect || false,
      responseTime: answer?.responseTime || 15000,
      pointsEarned,
      totalScore: player.score
    };
  });
  
  io.to(roomId).emit('question_results', {
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    results
  });
  
  console.log(`Question ${room.currentQuestion + 1} results sent to room: ${roomId}`);
  
  // Move to next question or end game
  setTimeout(() => {
    room.currentQuestion++;
    
    if (room.currentQuestion >= room.questions.length) {
      endGame(roomId);
    } else {
      sendQuestion(roomId);
    }
  }, 5000);
}

function endGame(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;
  
  room.gameState = 'finished';
  
  // Sort players by score
  const finalResults = [...room.players]
    .sort((a, b) => b.score - a.score)
    .map(player => ({
      playerId: player.id,
      playerName: player.name,
      totalScore: player.score
    }));
  
  let gameResult = 'completed';
  let winner = null;
  
  if (finalResults.length >= 2) {
    if (finalResults[0].totalScore === finalResults[1].totalScore) {
      gameResult = 'tie';
    } else {
      gameResult = 'winner';
      winner = finalResults[0];
    }
  }
  
  io.to(roomId).emit('game_ended', {
    results: finalResults,
    gameResult,
    winner
  });
  
  console.log(`Game ended in room: ${roomId}`, { gameResult, winner: winner?.playerName });
  
  // Clean up room after delay
  setTimeout(() => {
    gameRooms.delete(roomId);
    console.log(`Room ${roomId} cleaned up`);
  }, 30000);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});