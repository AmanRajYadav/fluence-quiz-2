// src/components/Teacher/TeacherStudents.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock data for students - using actual student configuration
const mockStudents = [
  {
    id: 'student1',
    name: 'Anaya',
    email: 'anaya@school.edu',
    avatarEmoji: '👩‍🎓',
    level: 1,
    xp: 0,
    totalQuizzes: 0,
    averageScore: 0,
    lastActive: Date.now() - 3600000, // 1 hour ago
    streakDays: 0,
    subjects: {
      mathematics: { score: 0, quizzes: 0 },
      science: { score: 0, quizzes: 0 },
      english: { score: 0, quizzes: 0 }
    },
    joinedDate: Date.now() - 86400000, // 1 day ago
    status: 'active'
  },
  {
    id: 'student2',
    name: 'Kavya',
    email: 'kavya@school.edu',
    avatarEmoji: '👩‍🎓',
    level: 1,
    xp: 0,
    totalQuizzes: 0,
    averageScore: 0,
    lastActive: Date.now() - 1800000, // 30 minutes ago
    streakDays: 0,
    subjects: {
      mathematics: { score: 0, quizzes: 0 },
      science: { score: 0, quizzes: 0 },
      english: { score: 0, quizzes: 0 }
    },
    joinedDate: Date.now() - 86400000, // 1 day ago
    status: 'active'
  },
  {
    id: 'student3',
    name: 'Mamta',
    email: 'mamta@school.edu',
    avatarEmoji: '👩‍🎓',
    level: 1,
    xp: 0,
    totalQuizzes: 0,
    averageScore: 0,
    lastActive: Date.now() - 7200000, // 2 hours ago
    streakDays: 0,
    subjects: {
      mathematics: { score: 0, quizzes: 0 },
      science: { score: 0, quizzes: 0 },
      english: { score: 0, quizzes: 0 }
    },
    joinedDate: Date.now() - 86400000, // 1 day ago
    status: 'active'
  }
];

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredAndSortedStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.averageScore - a.averageScore;
        case 'level':
          return b.level - a.level;
        case 'activity':
          return a.lastActive - b.lastActive;
        default:
          return 0;
      }
    });

  const getStudentStats = () => {
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const avgScore = Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / total);
    const topPerformer = students.reduce((top, current) => 
      current.averageScore > top.averageScore ? current : top
    );

    return { total, active, avgScore, topPerformer };
  };

  const handleInviteStudent = (email, name) => {
    const newStudent = {
      id: `student${students.length + 1}`,
      name: name || 'New Student',
      email: email,
      avatarEmoji: '🎓',
      level: 1,
      xp: 0,
      totalQuizzes: 0,
      averageScore: 0,
      lastActive: Date.now(),
      streakDays: 0,
      subjects: {},
      joinedDate: Date.now(),
      status: 'active'
    };
    
    setStudents([...students, newStudent]);
    setShowInviteModal(false);
  };

  const stats = getStudentStats();

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
              <h1 className="text-3xl font-bold text-white">👥 My Students</h1>
              <p className="text-purple-200">Manage and monitor student progress</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ➕ Invite Student
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

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            icon="👥"
            title="Total Students"
            value={stats.total}
            subtitle={`${stats.active} active`}
            color="from-blue-500 to-cyan-500"
          />
          
          <StatCard
            icon="📊"
            title="Average Score"
            value={`${stats.avgScore}%`}
            subtitle="class average"
            color="from-green-500 to-emerald-500"
          />
          
          <StatCard
            icon="🏆"
            title="Top Performer"
            value={stats.topPerformer.name.split(' ')[0]}
            subtitle={`${stats.topPerformer.averageScore}%`}
            color="from-yellow-500 to-orange-500"
          />
          
          <StatCard
            icon="📈"
            title="Total Quizzes"
            value={students.reduce((sum, s) => sum + s.totalQuizzes, 0)}
            subtitle="completed"
            color="from-purple-500 to-pink-500"
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
            >
              <option value="name">Sort by Name</option>
              <option value="score">Sort by Score</option>
              <option value="level">Sort by Level</option>
              <option value="activity">Sort by Activity</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Students</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </motion.div>

        {/* Students List */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">
            📋 Students ({filteredAndSortedStudents.length})
          </h2>
          
          <div className="space-y-4">
            {filteredAndSortedStudents.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => setSelectedStudent(student)}
                index={index}
              />
            ))}
            
            {filteredAndSortedStudents.length === 0 && (
              <div className="text-center py-8 text-purple-200">
                <div className="text-4xl mb-4">👥</div>
                <p>No students found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>

      {/* Invite Student Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteStudentModal
            onInvite={handleInviteStudent}
            onClose={() => setShowInviteModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Stats Card Component
const StatCard = ({ icon, title, value, subtitle, color }) => (
  <motion.div
    className={`bg-gradient-to-r ${color} p-6 rounded-xl text-white shadow-lg`}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-xs opacity-75">{subtitle}</div>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </motion.div>
);

// Student Card Component
const StudentCard = ({ student, onClick, index }) => {
  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <motion.div
      className="bg-white/5 hover:bg-white/10 rounded-lg p-4 cursor-pointer transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{student.avatarEmoji}</div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white">{student.name}</h3>
              <span className={`text-xs ${getStatusColor(student.status)}`}>
                ●
              </span>
            </div>
            <p className="text-purple-200 text-sm">{student.email}</p>
            <div className="flex items-center space-x-4 text-xs text-purple-300">
              <span>Level {student.level}</span>
              <span>•</span>
              <span>{student.totalQuizzes} quizzes</span>
              <span>•</span>
              <span>Last active: {getTimeAgo(student.lastActive)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {student.averageScore}%
          </div>
          <div className="text-sm text-purple-200">avg score</div>
          
          {student.streakDays > 0 && (
            <div className="text-xs text-orange-400 mt-1">
              🔥 {student.streakDays} day streak
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Student Detail Modal
const StudentDetailModal = ({ student, onClose }) => (
  <motion.div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{student.avatarEmoji}</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{student.name}</h2>
            <p className="text-purple-200">{student.email}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{student.level}</div>
          <div className="text-sm text-purple-200">Level</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{student.xp}</div>
          <div className="text-sm text-purple-200">XP</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{student.totalQuizzes}</div>
          <div className="text-sm text-purple-200">Quizzes</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{student.streakDays}</div>
          <div className="text-sm text-purple-200">Streak</div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">📚 Subject Performance</h3>
        <div className="space-y-3">
          {Object.entries(student.subjects).map(([subject, data]) => (
            <div key={subject} className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-medium capitalize">{subject}</h4>
                  <p className="text-purple-200 text-sm">{data.quizzes} quizzes completed</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{data.score}%</div>
                  <div className="text-sm text-purple-200">avg score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          onClick={() => alert('Send message to ' + student.name)}
        >
          💬 Send Message
        </button>
        
        <button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
          onClick={() => alert('Assign quiz to ' + student.name)}
        >
          📝 Assign Quiz
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Invite Student Modal
const InviteStudentModal = ({ onInvite, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (email.trim()) {
      onInvite(email.trim(), name.trim());
      setEmail('');
      setName('');
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6">➕ Invite Student</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-semibold">
              Student Name (Optional):
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
              placeholder="Enter student name..."
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-semibold">
              Email Address:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
              placeholder="Enter email address..."
            />
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!email.trim()}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              email.trim()
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Send Invite
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherStudents;