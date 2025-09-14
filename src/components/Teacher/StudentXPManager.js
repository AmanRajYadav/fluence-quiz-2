// src/components/Teacher/StudentXPManager.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { STUDENTS, COURSES, getAllStudents, getCourseById } from '../../config/students';
import { WORLDS, TROPHY_MILESTONES, GIFT_LEVELS, getLevelProgress, getAvailableTrophies } from '../../config/courseStructure';

const StudentXPManager = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    loadStudentProgress();
  }, []);

  const loadStudentProgress = () => {
    const studentProgressData = getAllStudents().map(student => {
      const progressKey = `fluence_course_progress_${student.name}`;
      const saved = localStorage.getItem(progressKey);
      const progress = saved ? JSON.parse(saved) : {
        studentId: student.id,
        studentName: student.name,
        courseXP: 0,
        totalLevels: 100,
        completedLevels: [],
        currentWorld: 1,
        currentStage: 1,
        trophies: [],
        certificates: [],
        gifts: [],
        courseMapLink: '',
        lastUpdated: new Date().toISOString()
      };

      // Set initial values for existing students
      if (!saved) {
        if (student.name === 'Anaya') {
          progress.courseXP = 5170;
          progress.completedLevels = Array.from({length: 52}, (_, i) => i + 1);
          progress.currentWorld = 6;
          progress.currentStage = 2;
          progress.trophies = ['🥉'];
          progress.certificates = ['Bronze Achievement Certificate'];
          progress.gifts = ['Level 10 Gift', 'Level 20 Gift', 'Level 30 Gift', 'Level 40 Gift', 'Level 50 Gift'];
        } else if (student.name === 'Kavya') {
          progress.courseXP = 1790;
          progress.completedLevels = Array.from({length: 18}, (_, i) => i + 1);
          progress.currentWorld = 2;
          progress.currentStage = 1;
          progress.gifts = ['Level 10 Gift'];
        }
      }

      // Save if it doesn't exist
      if (!saved) {
        localStorage.setItem(progressKey, JSON.stringify(progress));
      }

      return {
        ...student,
        progress
      };
    });

    setStudents(studentProgressData);
  };

  const updateStudentProgress = (studentName, updates) => {
    const progressKey = `fluence_course_progress_${studentName}`;
    const current = localStorage.getItem(progressKey);
    
    if (current) {
      const currentProgress = JSON.parse(current);
      const updatedProgress = {
        ...currentProgress,
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
      loadStudentProgress(); // Reload to update display
      return true;
    }
    return false;
  };

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
              <h1 className="text-3xl font-bold text-white">📈 Course Progress Manager</h1>
              <p className="text-purple-200">Manage Course XP and Levels for the Course Progress section</p>
            </div>
            
            <button
              onClick={() => navigate('/teacher')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🏠 Back to Dashboard
            </button>
          </div>
        </motion.div>

        {/* Students Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {students.map((student, index) => (
            <StudentProgressCard
              key={student.id}
              student={student}
              onEdit={() => {
                setSelectedStudent(student);
                setShowUpdateModal(true);
              }}
              index={index}
            />
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">🚀 Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                students.forEach(student => {
                  updateStudentProgress(student.name, { courseXP: student.progress.courseXP + 50 });
                });
              }}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors"
            >
              🎁 Give All Students +50 XP
            </button>
            
            <button
              onClick={() => {
                students.forEach(student => {
                  // Auto-update levels based on XP milestones
                  const currentXP = student.progress.courseXP;
                  let suggestedLevels = Math.floor(currentXP / 100); // 100 XP per level suggestion
                  suggestedLevels = Math.min(suggestedLevels, 100); // Max 100 levels
                  
                  if (suggestedLevels > (student.progress.completedLevels?.length || 0)) {
                    const completedLevels = Array.from({length: suggestedLevels}, (_, i) => i + 1);
                    const currentWorld = Math.min(Math.ceil(suggestedLevels / 10), 10) || 1;
                    const currentStage = suggestedLevels <= 50 ? 1 : 2;
                    
                    updateStudentProgress(student.name, { 
                      completedLevels,
                      currentWorld,
                      currentStage
                    });
                  }
                });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
            >
              🏆 Auto-Update Levels
            </button>
            
            <button
              onClick={() => {
                const confirmed = window.confirm('This will reset all student progress to 0. Are you sure?');
                if (confirmed) {
                  students.forEach(student => {
                    updateStudentProgress(student.name, { 
                      courseXP: 0, 
                      completedLevels: [],
                      currentWorld: 1,
                      currentStage: 1,
                      trophies: [],
                      certificates: [],
                      gifts: []
                    });
                  });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg transition-colors"
            >
              🔄 Reset All Progress
            </button>
          </div>
        </motion.div>
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {showUpdateModal && selectedStudent && (
          <UpdateStudentModal
            student={selectedStudent}
            onUpdate={(updates) => {
              updateStudentProgress(selectedStudent.name, updates);
              setShowUpdateModal(false);
              setSelectedStudent(null);
            }}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedStudent(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Student Progress Card Component
const StudentProgressCard = ({ student, onEdit, index }) => {
  const { progress } = student;
  const currentLevel = getLevelProgress(progress.courseXP);
  const availableTrophies = getAvailableTrophies(progress.courseXP);
  const progressPercent = Math.min((progress.completedLevels.length / 100) * 100, 100);
  const enrolledCourse = getCourseById(student.enrolledCourse);

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{student.avatarEmoji}</div>
          <div>
            <h3 className="text-lg font-bold text-white">{student.name}</h3>
            <p className="text-purple-200 text-sm">{student.id}</p>
            {enrolledCourse && (
              <div className={`inline-block px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${enrolledCourse.color} mt-1`}>
                {enrolledCourse.icon} {enrolledCourse.name}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onEdit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
        >
          ✏️ Edit
        </button>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{progress.courseXP}</div>
          <div className="text-xs text-purple-200">Course XP</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{progress.completedLevels ? progress.completedLevels.length : 0}</div>
          <div className="text-xs text-purple-200">Levels Done</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-purple-200 mb-1">
          <span>Level Progress</span>
          <span>{progressPercent.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
            style={{ width: `${progressPercent}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Trophies */}
      <div className="flex items-center justify-between">
        <span className="text-purple-200 text-sm">Trophies:</span>
        <div className="flex space-x-1">
          {availableTrophies.length > 0 ? (
            availableTrophies.map((trophy, i) => (
              <span key={i} className="text-lg">{trophy.icon}</span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">None yet</span>
          )}
        </div>
      </div>

      {/* World Info */}
      <div className="flex justify-between text-xs">
        <span className="text-purple-200">Current World:</span>
        <span className="text-white">World {progress.currentWorld || 1}</span>
      </div>
    </motion.div>
  );
};

// Update Student Modal
const UpdateStudentModal = ({ student, onUpdate, onClose }) => {
  const [courseXP, setCourseXP] = useState(student.progress.courseXP);
  const [completedLevelsCount, setCompletedLevelsCount] = useState(student.progress.completedLevels ? student.progress.completedLevels.length : 0);
  const [courseMapLink, setCourseMapLink] = useState(student.progress.courseMapLink || '');

  const handleSubmit = () => {
    // Generate completed levels array based on count
    const completedLevels = Array.from({length: Math.min(parseInt(completedLevelsCount) || 0, 100)}, (_, i) => i + 1);
    
    // Calculate world and stage based on completed levels
    const currentWorld = Math.min(Math.ceil(completedLevels.length / 10), 10) || 1;
    const currentStage = completedLevels.length <= 50 ? 1 : 2;
    
    // Determine trophies based on XP
    const trophies = [];
    const xp = parseInt(courseXP) || 0;
    if (xp >= 5000) trophies.push('🥉');
    if (xp >= 15000) trophies.push('🥈');
    if (xp >= 30000) trophies.push('🥇');
    if (xp >= 50000) trophies.push('💎');
    
    // Generate gifts for every 10th level completed
    const gifts = [];
    for (let i = 10; i <= completedLevels.length; i += 10) {
      gifts.push(`Level ${i} Gift`);
    }

    const updates = {
      courseXP: xp,
      completedLevels: completedLevels,
      currentWorld: currentWorld,
      currentStage: currentStage,
      trophies: trophies,
      gifts: gifts,
      courseMapLink: courseMapLink.trim()
    };

    onUpdate(updates);
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
        className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">✏️ Edit {student.name}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Course XP */}
          <div>
            <label className="block text-white mb-2 font-semibold">Course XP (0-50,000+)</label>
            <input
              type="number"
              value={courseXP}
              onChange={(e) => setCourseXP(e.target.value)}
              min="0"
              max="50000"
              className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
            />
            <div className="text-xs text-purple-300 mt-1">
              Trophies: 5K=🥉, 15K=🥈, 30K=🥇, 50K=💎
            </div>
          </div>

          {/* Levels Completed */}
          <div>
            <label className="block text-white mb-2 font-semibold">Levels Completed (0-100)</label>
            <input
              type="number"
              value={completedLevelsCount}
              onChange={(e) => setCompletedLevelsCount(e.target.value)}
              min="0"
              max="100"
              className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
            />
            <div className="text-xs text-purple-300 mt-1">
              Gifts at every 10th level (10, 20, 30, etc.)
            </div>
          </div>

          {/* Course Map Link */}
          <div>
            <label className="block text-white mb-2 font-semibold">Course Map Link (Optional)</label>
            <input
              type="url"
              value={courseMapLink}
              onChange={(e) => setCourseMapLink(e.target.value)}
              placeholder="https://example.com/course-map"
              className="w-full bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
            />
            <div className="text-xs text-purple-300 mt-1">
              Students can access this via "See Course Map" button
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
          >
            Update Progress
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentXPManager;