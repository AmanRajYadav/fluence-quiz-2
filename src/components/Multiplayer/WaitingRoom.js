import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Crown, Copy, Check } from 'lucide-react';

const WaitingRoom = ({ roomCode, isHost, playerName, opponentName, onStartGame, onLeaveRoom }) => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onStartGame();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            ⏳ Waiting Room
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gray-300">Room Code:</span>
              <span className="text-2xl font-mono font-bold text-yellow-400">
                {roomCode}
              </span>
              <button
                onClick={copyRoomCode}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors ml-2"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-gray-300 text-sm">
              Share this code with your friend
            </p>
          </div>
        </motion.div>

        {countdown !== null ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <div className="bg-red-600 text-white text-8xl font-bold rounded-full w-48 h-48 flex items-center justify-center mx-auto mb-4 shadow-2xl">
              {countdown}
            </div>
            <h2 className="text-3xl font-bold text-white">
              Game Starting!
            </h2>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Host Player */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-6 ${
                isHost ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  {isHost ? playerName : 'Host'}
                  {isHost && <Crown className="w-5 h-5 text-yellow-400" />}
                </h3>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div className="w-full h-2 bg-green-500 rounded-full"></div>
                </div>
                <p className="text-green-400 text-sm mt-2">Ready</p>
              </div>
            </motion.div>

            {/* Opponent Player */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-6 ${
                !isHost ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="text-center">
                {opponentName ? (
                  <>
                    <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                      {!isHost ? playerName : opponentName}
                      {!isHost && <Crown className="w-5 h-5 text-yellow-400" />}
                    </h3>
                    <div className="w-full h-2 bg-gray-700 rounded-full">
                      <div className="w-full h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-green-400 text-sm mt-2">Ready</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Clock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                      Waiting for opponent...
                    </h3>
                    <div className="w-full h-2 bg-gray-700 rounded-full">
                      <div className="w-1/3 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-yellow-400 text-sm mt-2">Connecting...</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Game Controls */}
        {opponentName && countdown === null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                🎯 Both players are ready!
              </h3>
              <p className="text-gray-300 mb-6">
                Get ready for an epic quiz battle. Good luck!
              </p>
              
              {isHost ? (
                <button
                  onClick={startCountdown}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                >
                  Start Game
                </button>
              ) : (
                <p className="text-yellow-400 font-semibold">
                  Waiting for host to start the game...
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Leave Room Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button
            onClick={onLeaveRoom}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Leave Room
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitingRoom;