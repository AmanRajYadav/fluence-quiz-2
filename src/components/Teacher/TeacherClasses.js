// src/components/Teacher/TeacherClasses.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from '../../config/students';

// Mock data manager for class management
const mockDataManager = {
  getTeacherProfile: () => {
    const saved = localStorage.getItem('fluence_user_profile');
    return saved ? JSON.parse(saved) : { 
      id: 'teacher1', 
      username: 'Aman Raj Yadav', 
      role: 'teacher'
    };
  },
  
  getClasses: () => {
    return JSON.parse(localStorage.getItem('fluence_teacher_classes') || '[]');
  },
  
  createClass: (className, subject, description) => {
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newClass = {
      id: `class_${Date.now()}`,
      name: className,
      code: classCode,
      subject: subject,
      description: description,
      teacherId: 'teacher1',
      teacherName: 'Aman Raj Yadav',
      students: [],
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    const classes = mockDataManager.getClasses();
    classes.push(newClass);
    localStorage.setItem('fluence_teacher_classes', JSON.stringify(classes));
    return newClass;
  },
  
  updateClass: (classId, updates) => {
    const classes = mockDataManager.getClasses();
    const index = classes.findIndex(c => c.id === classId);
    if (index !== -1) {
      classes[index] = { ...classes[index], ...updates };
      localStorage.setItem('fluence_teacher_classes', JSON.stringify(classes));
      return classes[index];
    }
    return null;
  },
  
  deleteClass: (classId) => {
    const classes = mockDataManager.getClasses();
    const filtered = classes.filter(c => c.id !== classId);
    localStorage.setItem('fluence_teacher_classes', JSON.stringify(filtered));
    return true;
  },
  
  getStudentsInClass: (classId) => {
    // Return all configured students with their course progress
    return getAllStudents().map(student => {
      const progressKey = `fluence_course_progress_${student.name}`;
      const progress = localStorage.getItem(progressKey);
      const courseData = progress ? JSON.parse(progress) : { courseXP: 0, levelsCompleted: 0 };
      
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        courseXP: courseData.courseXP || 0,
        levelsCompleted: courseData.levelsCompleted || 0,
        joinedDate: Date.now() - 86400000 // 1 day ago
      };
    });
  }
};

const TeacherClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [teacherProfile, setTeacherProfile] = useState(null);

  useEffect(() => {
    const profile = mockDataManager.getTeacherProfile();
    setTeacherProfile(profile);
    loadClasses();
  }, []);

  const loadClasses = () => {
    const classData = mockDataManager.getClasses();
    setClasses(classData);
  };

  const handleCreateClass = (className, subject, description) => {
    const newClass = mockDataManager.createClass(className, subject, description);
    setClasses(prev => [...prev, newClass]);
    setShowCreateModal(false);
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class? This cannot be undone.')) {
      mockDataManager.deleteClass(classId);
      setClasses(prev => prev.filter(c => c.id !== classId));
      setSelectedClass(null);
    }
  };

  const handleToggleClassStatus = (classId, currentStatus) => {
    const updated = mockDataManager.updateClass(classId, { isActive: !currentStatus });
    if (updated) {
      setClasses(prev => prev.map(c => c.id === classId ? updated : c));
    }
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
              <h1 className="text-3xl font-bold text-white">🏫 Class Management</h1>
              <p className="text-purple-200">Create and manage your classes</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ➕ Create Class
              </button>
              
              <button
                onClick={() => navigate('/teacher')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <StatCard
            icon="🏫"
            title="Total Classes"
            value={classes.length}
            subtitle={`${classes.filter(c => c.isActive).length} active`}
            color="from-blue-500 to-cyan-500"
          />
          
          <StatCard
            icon="👥"
            title="Total Students"
            value={classes.reduce((sum, c) => sum + c.students.length, 0)}
            subtitle="across all classes"
            color="from-green-500 to-emerald-500"
          />
          
          <StatCard
            icon="📊"
            title="Active Classes"
            value={classes.filter(c => c.isActive).length}
            subtitle="currently running"
            color="from-purple-500 to-pink-500"
          />
          
          <StatCard
            icon="📅"
            title="This Month"
            value={classes.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length}
            subtitle="new classes"
            color="from-orange-500 to-red-500"
          />
        </motion.div>

        {/* Classes Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {classes.map((classItem, index) => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              onSelect={() => setSelectedClass(classItem)}
              onToggleStatus={() => handleToggleClassStatus(classItem.id, classItem.isActive)}
              onDelete={() => handleDeleteClass(classItem.id)}
              index={index}
            />
          ))}
          
          {classes.length === 0 && (
            <div className="col-span-full bg-white/10 backdrop-blur-md rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🏫</div>
              <h2 className="text-2xl font-bold text-white mb-2">No classes yet</h2>
              <p className="text-purple-200 mb-6">Create your first class to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create First Class
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateClassModal
            onCreateClass={handleCreateClass}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Class Detail Modal */}
      <AnimatePresence>
        {selectedClass && (
          <ClassDetailModal
            classData={selectedClass}
            onClose={() => setSelectedClass(null)}
            onDelete={() => handleDeleteClass(selectedClass.id)}
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

// Class Card Component
const ClassCard = ({ classData, onSelect, onToggleStatus, onDelete, index }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-colors cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    onClick={onSelect}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1">{classData.name}</h3>
        <p className="text-purple-200 text-sm mb-2">{classData.subject}</p>
        <p className="text-purple-300 text-xs">{classData.description}</p>
      </div>
      
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        classData.isActive 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-red-500/20 text-red-400'
      }`}>
        {classData.isActive ? 'Active' : 'Inactive'}
      </div>
    </div>

    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-purple-200">Class Code:</span>
        <span className="text-white font-mono font-bold">{classData.code}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-purple-200">Students:</span>
        <span className="text-white">{classData.students.length}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-purple-200">Created:</span>
        <span className="text-white">{new Date(classData.createdAt).toLocaleDateString()}</span>
      </div>
    </div>

    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onToggleStatus}
        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          classData.isActive
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {classData.isActive ? 'Deactivate' : 'Activate'}
      </button>
      
      <button
        onClick={onDelete}
        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
      >
        Delete
      </button>
    </div>
  </motion.div>
);

// Create Class Modal
const CreateClassModal = ({ onCreateClass, onClose }) => {
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (className.trim()) {
      onCreateClass(className.trim(), subject, description.trim());
      setClassName('');
      setSubject('Mathematics');
      setDescription('');
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
        <h2 className="text-2xl font-bold text-white mb-6">🏫 Create New Class</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-semibold">Class Name *</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
              placeholder="e.g., Class 6A, Morning Batch..."
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-semibold">Subject *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
              placeholder="Brief description of the class..."
              rows="3"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
            >
              Create Class
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Class Detail Modal
const ClassDetailModal = ({ classData, onClose, onDelete }) => {
  const students = mockDataManager.getStudentsInClass(classData.id);

  return (
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
          <div>
            <h2 className="text-2xl font-bold text-white">{classData.name}</h2>
            <p className="text-purple-200">{classData.subject}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{classData.code}</div>
            <div className="text-sm text-purple-200">Class Code</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{students.length}</div>
            <div className="text-sm text-purple-200">Students</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4">📚 Students</h3>
          <div className="space-y-2">
            {students.map(student => (
              <div key={student.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="text-white font-medium">{student.name}</div>
                  <div className="text-purple-200 text-sm">{student.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">XP: {student.courseXP}</div>
                  <div className="text-purple-200 text-xs">Levels: {student.levelsCompleted}</div>
                </div>
              </div>
            ))}
            
            {students.length === 0 && (
              <div className="text-center py-4 text-purple-200">
                No students have joined this class yet
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🗑️ Delete Class
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeacherClasses;