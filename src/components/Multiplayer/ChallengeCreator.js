import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getAllSubjects } from '../../config/subjects';
import { Users, Play, Copy, Check } from 'lucide-react';

const ChallengeCreator = ({ onCreateChallenge, onJoinChallenge }) => {
  const [mode, setMode] = useState('create');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  const subjects = getAllSubjects();

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateChallenge = () => {
    if (!selectedSubject) return;
    
    const code = generateRoomCode();
    setRoomCode(code);
    onCreateChallenge({
      roomCode: code,
      subject: selectedSubject,
      isHost: true
    });
  };

  const handleJoinChallenge = () => {
    if (!joinCode.trim()) return;
    
    onJoinChallenge({
      roomCode: joinCode.toUpperCase(),
      isHost: false
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            🚀 Multiplayer Challenge
          </h1>
          <p className="text-xl text-gray-300">
            Challenge your friends in real-time quiz battles!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex">
            <button
              onClick={() => setMode('create')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'create'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Create Challenge
            </button>
            <button
              onClick={() => setMode('join')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                mode === 'join'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Join Challenge
            </button>
          </div>
        </motion.div>

        {mode === 'create' ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Select Subject
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <motion.button
                    key={subject.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubject(subject)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedSubject?.id === subject.id
                        ? 'border-yellow-400 bg-yellow-400/20'
                        : 'border-gray-600 bg-white/5 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-4xl mb-2">{subject.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {subject.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {selectedSubject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Ready to create challenge for {selectedSubject.name}?
                </h3>
                {!roomCode ? (
                  <button
                    onClick={handleCreateChallenge}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Create Challenge
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/20 rounded-lg p-4">
                      <p className="text-gray-300 mb-2">Room Code:</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-mono font-bold text-yellow-400">
                          {roomCode}
                        </span>
                        <button
                          onClick={copyRoomCode}
                          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-400" />
                          ) : (
                            <Copy className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      Share this code with your friend to join the challenge!
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Join Challenge
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Enter Room Code:
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="w-full p-3 bg-black/20 border border-gray-600 rounded-lg text-white text-center text-xl font-mono tracking-widest focus:border-blue-500 focus:outline-none"
                  maxLength="6"
                />
              </div>
              <button
                onClick={handleJoinChallenge}
                disabled={!joinCode.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                Join Challenge
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChallengeCreator;