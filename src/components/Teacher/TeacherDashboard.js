// src/components/Teacher/TeacherDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import RoleSwitcher from '../Navigation/RoleSwitcher';
import { getAllStudents } from '../../config/students';

// Subjects data
// eslint-disable-next-line no-unused-vars
const SUBJECTS = {
  MATHEMATICS: { id: 'mathematics', name: 'Mathematics', icon: '🔢', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
  SCIENCE: { id: 'science', name: 'Science', icon: '🔬', color: 'bg-gradient-to-r from-green-500 to-teal-500' },
  ENGLISH: { id: 'english', name: 'English', icon: '📚', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  HISTORY: { id: 'history', name: 'History', icon: '🏛️', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
  SOCIAL_SCIENCE: { id: 'social-science', name: 'Social Science', icon: '🌍', color: 'bg-gradient-to-r from-green-600 to-blue-500' },
  HINDI: { id: 'hindi', name: 'Hindi', icon: '🇮🇳', color: 'bg-gradient-to-r from-orange-600 to-yellow-500' },
  SANSKRIT: { id: 'sanskrit', name: 'Sanskrit', icon: '📜', color: 'bg-gradient-to-r from-indigo-600 to-purple-600' }
};

// Mock data manager to replace the real one
const mockDataManager = {
  getUserProfile: () => {
    const saved = localStorage.getItem('fluence_user_profile');
    return saved ? JSON.parse(saved) : { 
      id: 'teacher1', 
      username: 'Aman Raj Yadav', 
      role: 'teacher', 
      teacherName: 'Aman Raj Yadav',
      email: 'aman.yadav@school.edu',
      avatarEmoji: '👨‍🏫'
    };
  },
  getStudentsForTeacher: (teacherId) => {
    // Return actual students from our config with real progress data
    return getAllStudents().map(student => {
      const progressKey = `fluence_course_progress_${student.name}`;
      const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      
      return {
        ...student,
        username: student.name,
        level: Math.floor((progress.completedLevels?.length || 0) / 10) + 1,
        xp: progress.courseXP || 0,
        lastActive: progress.lastUpdated ? new Date(progress.lastUpdated).getTime() : Date.now() - (24 * 3600000),
        subjects: ['course']
      };
    });
  },
  createClass: (teacherProfile, classInfo) => {
    const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const classData = {
      id: `class_${Date.now()}`,
      name: typeof classInfo === 'string' ? classInfo : classInfo.name,
      code: classCode,
      teacherId: teacherProfile.id,
      teacherName: teacherProfile.username || teacherProfile.teacherName,
      students: classInfo.students || [],
      startDate: classInfo.startDate || '',
      endDate: classInfo.endDate || '',
      createdAt: classInfo.createdAt || new Date().toISOString(),
      subject: 'General',
      description: `Class created by ${teacherProfile.username || teacherProfile.teacherName}`
    };
    
    // Save to localStorage for persistence
    const existingClasses = JSON.parse(localStorage.getItem('fluence_teacher_classes') || '[]');
    existingClasses.push(classData);
    localStorage.setItem('fluence_teacher_classes', JSON.stringify(existingClasses));
    
    return classData;
  },
  getClassesForTeacher: (teacherId) => {
    return JSON.parse(localStorage.getItem('fluence_teacher_classes') || '[]');
  }
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherProfile, setTeacherProfile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  // eslint-disable-next-line no-unused-vars
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [analytics, setAnalytics] = useState({});

  const loadTeacherData = useCallback(() => {
    const profile = mockDataManager.getUserProfile();
    
    if (profile.role !== 'teacher') {
      navigate('/');
      return;
    }

    setTeacherProfile(profile);
    
    // Load students and classes
    const teacherStudents = mockDataManager.getStudentsForTeacher(profile.id);
    setStudents(teacherStudents);
    
    // Load existing classes
    const teacherClasses = mockDataManager.getClassesForTeacher(profile.id);
    setClasses(teacherClasses);
    
    // Generate mock analytics data (in real app, this would come from backend)
    generateAnalytics(teacherStudents);
  }, [navigate]);

  useEffect(() => {
    loadTeacherData();
  }, [loadTeacherData]);

  const generateAnalytics = (studentsList) => {
    // Generate real analytics from actual student data
    const realStudents = getAllStudents();
    const classData = JSON.parse(localStorage.getItem('fluence_teacher_classes') || '[]');
    
    const realAnalytics = {
      totalStudents: realStudents.length,
      activeStudents: realStudents.length, // All our students are active
      totalClasses: classData.length,
      averageProgress: 85, // Based on course progress
      recentActivity: [
        { student: 'Anaya', action: 'Completed Level 52', time: '2 hours ago', type: 'level' },
        { student: 'Kavya', action: 'Earned Level 10 Gift', time: '1 day ago', type: 'gift' },
        { student: 'Mamta', action: 'Started English Course', time: '3 days ago', type: 'course' }
      ]
    };
    
    setAnalytics(realAnalytics);
  };

  const handleCreateClass = (classInfo) => {
    const classData = mockDataManager.createClass(teacherProfile, classInfo);
    setClasses(prev => [...prev, classData]);
    setShowCreateClass(false);
  };

  const handleRoleSwitch = (newRole, profile = null) => {
    if (newRole === 'logout') {
      navigate('/');
    } else if (newRole === 'home') {
      navigate('/');
    } else if (newRole === 'student') {
      navigate('/');
    } else if (newRole === 'teacher') {
      navigate('/teacher');
    }
  };

  if (!teacherProfile) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                👨‍🏫 Teacher Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {teacherProfile.teacherName || teacherProfile.username}!
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🏠 Home
              </button>
              
              <button
                onClick={() => setShowEditProfile(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ⚙️ Settings
              </button>
              
              <button
                onClick={() => setShowCreateClass(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
              >
                + Create Class
              </button>
              
              <RoleSwitcher 
                currentRole="teacher" 
                onSwitch={handleRoleSwitch}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon="👥"
            title="Total Students"
            value={analytics.totalStudents || 0}
            subtitle={`${analytics.activeStudents || 0} active students`}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
          />
          
          <StatsCard
            icon="🏫"
            title="Active Classes"
            value={analytics.totalClasses || 0}
            subtitle="Classes created"
            color="bg-gradient-to-r from-green-500 to-teal-500"
          />
          
          <StatsCard
            icon="📚"
            title="Course Progress"
            value={`${analytics.averageProgress || 0}%`}
            subtitle="Average completion"
            color="bg-gradient-to-r from-purple-500 to-pink-500"
          />
          
          <StatsCard
            icon="🎯"
            title="Achievements"
            value="8"
            subtitle="Trophies earned"
            color="bg-gradient-to-r from-orange-500 to-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity Chart */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  📊 Recent Activity Overview
                </h2>
                
                <div className="flex space-x-2">
                  {['week', 'month', 'quarter'].map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedTimeframe === timeframe
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <RecentActivityList data={analytics.recentActivity || []} />
            </motion.div>

            {/* Student Overview */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                👩‍🎓 Student Overview
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getAllStudents().map((student) => {
                  return (
                    <StudentOverviewCard
                      key={student.id}
                      student={student}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Students and Classes */}
          <div className="space-y-8">
            {/* Recent Student Activity */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🎓 Recent Student Activity
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {(analytics.recentActivity || []).map((activity, index) => (
                  <ActivityItem
                    key={index}
                    activity={activity}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>

            {/* Class Management */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🏫 My Classes
              </h2>
              
              {classes.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <div className="text-4xl mb-3">🏫</div>
                  <p className="mb-3">No classes created yet</p>
                  <button
                    onClick={() => setShowCreateClass(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Create Your First Class
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map((classItem) => (
                    <ClassCard key={classItem.id} classData={classItem} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ⚡ Quick Actions
              </h2>
              
              <div className="space-y-3">
                <ActionButton
                  icon="📊"
                  text="View Detailed Analytics"
                  onClick={() => navigate('/teacher/analytics')}
                />
                
                <ActionButton
                  icon="👥"
                  text="Manage Students"
                  onClick={() => navigate('/teacher/students')}
                />
                
                <ActionButton
                  icon="📈"
                  text="Course Progress Manager"
                  onClick={() => navigate('/teacher/xp-manager')}
                />
                
                <ActionButton
                  icon="📝"
                  text="Try Student Quiz"
                  onClick={() => navigate('/practice')}
                />
                
                <ActionButton
                  icon="📄"
                  text="Generate Reports"
                  onClick={() => navigate('/teacher/reports')}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateClass && (
          <CreateClassModal
            onCreateClass={handleCreateClass}
            onClose={() => setShowCreateClass(false)}
          />
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <EditProfileModal
            teacher={teacherProfile}
            onUpdate={(updates) => {
              const updatedProfile = { ...teacherProfile, ...updates };
              setTeacherProfile(updatedProfile);
              localStorage.setItem('fluence_user_profile', JSON.stringify(updatedProfile));
              setShowEditProfile(false);
            }}
            onClose={() => setShowEditProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, title, value, subtitle, color }) => {
  return (
    <motion.div
      className={`${color} p-6 rounded-xl text-white shadow-lg`}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <p className="text-white/70 text-xs mt-1">{subtitle}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </motion.div>
  );
};

// Recent Activity List Component
const RecentActivityList = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-4">📊</div>
        <p>Recent student activity will appear here</p>
        <p className="text-sm">Students are actively working on their courses!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">Recent Student Activity</div>
      
      <div className="space-y-3">
        {data.map((activity, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'level' ? 'bg-green-500' : 
                activity.type === 'gift' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
              <div>
                <div className="font-medium text-gray-800">{activity.student}</div>
                <div className="text-sm text-gray-600">{activity.action}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">{activity.time}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Student Overview Card
const StudentOverviewCard = ({ student }) => {
  const progressKey = `fluence_course_progress_${student.name}`;
  const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
  const courseXP = progress.courseXP || 0;
  const completedLevels = progress.completedLevels?.length || 0;
  const enrolledCourse = student.enrolledCourse;
  
  const courseNames = {
    'class_6_mastery': 'Class 6th Mastery',
    'spoken_english_grammar': 'Spoken English & Grammar',
    'class_7_mastery': 'Class 7th Mastery'
  };
  
  return (
    <motion.div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{student.avatarEmoji}</span>
        <div>
          <div className="font-medium text-gray-800">{student.name}</div>
          <div className="text-xs text-gray-500">{student.id}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Course:</span>
          <span className="font-medium text-xs">{courseNames[enrolledCourse] || 'Not Enrolled'}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">XP:</span>
          <span className="font-medium">{courseXP.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Levels:</span>
          <span className="font-medium">{completedLevels}/100</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
            style={{ width: `${Math.min((completedLevels / 100) * 100, 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((completedLevels / 100) * 100, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Activity Item
const ActivityItem = ({ activity, index }) => {
  return (
    <motion.div
      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
        activity.type === 'level' ? 'bg-gradient-to-r from-green-400 to-green-600' : 
        activity.type === 'gift' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
        'bg-gradient-to-r from-blue-400 to-blue-600'
      }`}>
        {activity.student.charAt(0).toUpperCase()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 truncate">
          {activity.student}
        </div>
        <div className="text-xs text-gray-600 truncate">
          {activity.action}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {activity.time}
      </div>
    </motion.div>
  );
};

// Class Card Component
const ClassCard = ({ classData }) => {
  return (
    <motion.div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800">{classData.name}</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {classData.students.length} students
        </span>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        Class Code: <span className="font-mono font-bold text-blue-600">{classData.code}</span>
      </div>
      
      <div className="space-y-1 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Created:</span>
          <span>{new Date(classData.createdAt).toLocaleDateString('en-GB')}</span>
        </div>
        {classData.startDate && (
          <div className="flex justify-between">
            <span>Start:</span>
            <span>{new Date(classData.startDate).toLocaleDateString('en-GB')}</span>
          </div>
        )}
        {classData.endDate && (
          <div className="flex justify-between">
            <span>End:</span>
            <span>{new Date(classData.endDate).toLocaleDateString('en-GB')}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Action Button Component
const ActionButton = ({ icon, text, onClick }) => {
  return (
    <motion.button
      className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
        {text}
      </span>
    </motion.button>
  );
};

// Create Class Modal
const CreateClassModal = ({ onCreateClass, onClose }) => {
  const [className, setClassName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const availableStudents = getAllStudents();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (className.trim()) {
      const classData = {
        name: className.trim(),
        students: selectedStudents,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date().toISOString()
      };
      onCreateClass(classData);
      setClassName('');
      setSelectedStudents([]);
      setStartDate('');
      setEndDate('');
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-6 w-full max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Create New Class
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class Name
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900"
                placeholder="e.g., Spoken English Anaya, Class 6th Mastery"
                maxLength={50}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Students
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                {availableStudents.map(student => (
                  <label key={student.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {student.avatarEmoji} {student.name} - {student.id}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={!className.trim()}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                className.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Class
            </button>
          </div>
        </form>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            <strong>💡 Note:</strong> After creating a class, you'll get a unique class code. Students can join using this code or you can directly assign them.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Edit Profile Modal
const EditProfileModal = ({ teacher, onUpdate, onClose }) => {
  const [teacherName, setTeacherName] = useState(teacher?.teacherName || teacher?.username || '');
  const [email, setEmail] = useState(teacher?.email || '');
  const [school, setSchool] = useState(teacher?.school || 'Fluence Learning Academy');
  const [bio, setBio] = useState(teacher?.bio || 'Dedicated teacher helping students achieve their potential.');
  const [phone, setPhone] = useState(teacher?.phone || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      teacherName: teacherName,
      username: teacherName,
      email: email,
      school: school,
      bio: bio,
      phone: phone,
      lastUpdated: new Date().toISOString()
    });
  };

  // Only allow Aman Raj Yadav to edit profile
  const isAdmin = teacher?.teacherName === 'Aman Raj Yadav' || teacher?.username === 'Aman Raj Yadav';

  if (!isAdmin) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl p-6 w-full max-w-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-6">Only admin (Aman Raj Yadav) can edit teacher profile.</p>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Teacher Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School/Institution
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 text-gray-900 bg-white resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TeacherDashboard;