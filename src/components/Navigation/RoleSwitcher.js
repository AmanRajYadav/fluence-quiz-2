// src/components/Navigation/RoleSwitcher.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RoleSwitcher = ({ currentRole, onSwitch }) => {
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [authError, setAuthError] = useState('');
  const [switchingTo, setSwitchingTo] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('fluence_user_profile');
    localStorage.removeItem('fluence_user_role');
    onSwitch('logout');
  };
  
  const handleGoHome = () => {
    onSwitch('home');
  };

  const handleSwitchToStudent = () => {
    setSwitchingTo('student');
    setShowSwitchModal(true);
    setAuthError('');
  };

  const handleSwitchToTeacher = () => {
    setSwitchingTo('teacher');
    setShowSwitchModal(true);
    setAuthError('');
  };

  const handleStudentSwitch = () => {
    if (!studentName.trim()) {
      setAuthError('Please enter your name');
      return;
    }

    // Create student profile
    const studentProfile = {
      id: `student_${Date.now()}`,
      username: studentName.trim(),
      role: 'student',
      avatarEmoji: '🎓',
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('fluence_user_profile', JSON.stringify(studentProfile));
    localStorage.setItem('fluence_user_role', 'student');
    
    setShowSwitchModal(false);
    onSwitch('student', studentProfile);
  };

  const handleTeacherSwitch = () => {
    if (teacherName.trim() === 'Aman Raj Yadav' && teacherPassword === 'Helloaman@1947') {
      const teacherProfile = {
        id: 'teacher1',
        username: 'Aman Raj Yadav',
        role: 'teacher',
        teacherName: 'Aman Raj Yadav',
        email: 'aman.yadav@school.edu',
        avatarEmoji: '👨‍🏫',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('fluence_user_profile', JSON.stringify(teacherProfile));
      localStorage.setItem('fluence_user_role', 'teacher');
      
      setShowSwitchModal(false);
      setAuthError('');
      onSwitch('teacher', teacherProfile);
    } else {
      setAuthError('Invalid teacher credentials. Please check your name and password.');
    }
  };

  const resetForm = () => {
    setTeacherName('');
    setTeacherPassword('');
    setStudentName('');
    setAuthError('');
    setSwitchingTo('');
  };

  const handleClose = () => {
    setShowSwitchModal(false);
    resetForm();
  };

  return (
    <>
      {/* Role Switch Buttons */}
      <div className="flex items-center space-x-2">
        {currentRole === 'student' && (
          <button
            onClick={handleSwitchToTeacher}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            title="Switch to Teacher"
          >
            👨‍🏫 Teacher
          </button>
        )}
        
        {currentRole === 'teacher' && (
          <button
            onClick={handleSwitchToStudent}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            title="Switch to Student"
          >
            🎓 Student
          </button>
        )}
        
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          title="Logout"
        >
          🚪 Logout
        </button>
      </div>

      {/* Role Switch Modal */}
      <AnimatePresence>
        {showSwitchModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {switchingTo === 'teacher' ? '👨‍🏫 Switch to Teacher' : '🎓 Switch to Student'}
                </h2>
                <p className="text-purple-200">
                  {switchingTo === 'teacher' 
                    ? 'Enter teacher credentials to continue'
                    : 'Enter your name to continue as student'
                  }
                </p>
              </div>

              {switchingTo === 'teacher' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2 font-semibold">
                      Teacher Name:
                    </label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-semibold">
                      Password:
                    </label>
                    <input
                      type="password"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              )}

              {switchingTo === 'student' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2 font-semibold">
                      Student Name:
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
                      placeholder="Enter your name (e.g., Anaya, Kavya, Mamta)"
                    />
                  </div>
                </div>
              )}

              {authError && (
                <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-lg mt-4">
                  {authError}
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={switchingTo === 'teacher' ? handleTeacherSwitch : handleStudentSwitch}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors"
                >
                  {switchingTo === 'teacher' ? 'Switch to Teacher' : 'Switch to Student'}
                </button>
              </div>

              {switchingTo === 'teacher' && (
                <div className="mt-4 p-4 bg-blue-500/20 border border-blue-400/50 rounded-lg">
                  <div className="text-sm text-blue-200">
                    <strong>💡 Teacher Credentials:</strong>
                    <br />
                    Name: Aman Raj Yadav
                    <br />
                    Password: Helloaman@1947
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RoleSwitcher;