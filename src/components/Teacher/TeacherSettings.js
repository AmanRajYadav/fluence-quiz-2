// src/components/Teacher/TeacherSettings.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock data manager for teacher settings
const mockDataManager = {
  getTeacherProfile: () => {
    const saved = localStorage.getItem('fluence_teacher_profile');
    return saved ? JSON.parse(saved) : {
      id: 'teacher1',
      name: 'Aman Raj Yadav',
      email: 'aman.yadav@school.edu',
      avatarEmoji: '👨‍🏫',
      school: 'Excellence Academy',
      subject: 'Mathematics',
      experience: '8 years',
      bio: 'Passionate educator focused on making learning fun and engaging.',
      preferences: {
        notifications: {
          email: true,
          push: true,
          studentProgress: true,
          newQuizzes: false,
          weeklyReports: true
        },
        privacy: {
          profileVisible: true,
          statsVisible: false,
          allowStudentMessages: true
        },
        quiz: {
          defaultTimeLimit: 30,
          autoGrading: true,
          showAnswers: true,
          allowRetakes: false,
          difficultyLevel: 'medium'
        },
        classroom: {
          autoApproveStudents: false,
          allowAnonymousQuestions: true,
          showLeaderboard: true,
          enablePeerReview: false
        }
      }
    };
  },
  updateTeacherProfile: (updates) => {
    const current = mockDataManager.getTeacherProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem('fluence_teacher_profile', JSON.stringify(updated));
    return updated;
  }
};

const TeacherSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const teacherProfile = mockDataManager.getTeacherProfile();
    setProfile(teacherProfile);
    setFormData(teacherProfile);
  }, []);

  const handleSave = () => {
    const updatedProfile = mockDataManager.updateTeacherProfile(formData);
    setProfile(updatedProfile);
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (category, setting, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [setting]: value
        }
      }
    }));
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-white">⚙️ Teacher Settings</h1>
              <p className="text-purple-200">Manage your profile and preferences</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                💾 Save Changes
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

        {/* Save Confirmation */}
        <AnimatePresence>
          {showSaveConfirmation && (
            <motion.div
              className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
            >
              ✅ Settings saved successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: '👤 Profile', icon: '👤' },
                  { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
                  { id: 'privacy', label: '🔒 Privacy', icon: '🔒' },
                  { id: 'quiz', label: '📝 Quiz Settings', icon: '📝' },
                  { id: 'classroom', label: '🏫 Classroom', icon: '🏫' },
                  { id: 'account', label: '🔧 Account', icon: '🔧' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-200 hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <ProfileSettings
                    profile={formData}
                    onChange={handleInputChange}
                  />
                )}
                
                {activeTab === 'notifications' && (
                  <NotificationSettings
                    preferences={formData.preferences?.notifications}
                    onChange={handlePreferenceChange}
                  />
                )}
                
                {activeTab === 'privacy' && (
                  <PrivacySettings
                    preferences={formData.preferences?.privacy}
                    onChange={handlePreferenceChange}
                  />
                )}
                
                {activeTab === 'quiz' && (
                  <QuizSettings
                    preferences={formData.preferences?.quiz}
                    onChange={handlePreferenceChange}
                  />
                )}
                
                {activeTab === 'classroom' && (
                  <ClassroomSettings
                    preferences={formData.preferences?.classroom}
                    onChange={handlePreferenceChange}
                  />
                )}
                
                {activeTab === 'account' && (
                  <AccountSettings
                    profile={formData}
                    onChange={handleInputChange}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ profile, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <h2 className="text-2xl font-bold text-white mb-6">👤 Profile Information</h2>
    
    <div className="space-y-6">
      {/* Avatar Selection */}
      <div>
        <label className="block text-white mb-2 font-semibold">Avatar</label>
        <div className="flex space-x-3">
          {['👨‍🏫', '👩‍🏫', '🧑‍🏫', '👨‍💼', '👩‍💼', '🧑‍💻'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => onChange('avatarEmoji', '', emoji)}
              className={`text-3xl p-3 rounded-lg transition-all ${
                profile.avatarEmoji === emoji
                  ? 'bg-purple-600 scale-110'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white mb-2 font-semibold">Full Name</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => onChange('name', '', e.target.value)}
            className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={profile.email || ''}
            onChange={(e) => onChange('email', '', e.target.value)}
            className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2 font-semibold">School</label>
          <input
            type="text"
            value={profile.school || ''}
            onChange={(e) => onChange('school', '', e.target.value)}
            className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2 font-semibold">Subject</label>
          <select
            value={profile.subject || ''}
            onChange={(e) => onChange('subject', '', e.target.value)}
            className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-white mb-2 font-semibold">Bio</label>
        <textarea
          value={profile.bio || ''}
          onChange={(e) => onChange('bio', '', e.target.value)}
          rows={4}
          className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
          placeholder="Tell students about yourself..."
        />
      </div>
    </div>
  </motion.div>
);

// Notification Settings Component
const NotificationSettings = ({ preferences, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <h2 className="text-2xl font-bold text-white mb-6">🔔 Notification Preferences</h2>
    
    <div className="space-y-6">
      {[
        { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
        { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
        { key: 'studentProgress', label: 'Student Progress', desc: 'When students complete quizzes' },
        { key: 'newQuizzes', label: 'New Quiz Alerts', desc: 'When new quizzes are available' },
        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of class performance' }
      ].map((setting) => (
        <ToggleSetting
          key={setting.key}
          label={setting.label}
          description={setting.desc}
          checked={preferences?.[setting.key] || false}
          onChange={(value) => onChange('notifications', setting.key, value)}
        />
      ))}
    </div>
  </motion.div>
);

// Privacy Settings Component
const PrivacySettings = ({ preferences, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <h2 className="text-2xl font-bold text-white mb-6">🔒 Privacy Settings</h2>
    
    <div className="space-y-6">
      {[
        { key: 'profileVisible', label: 'Profile Visibility', desc: 'Allow students to see your profile' },
        { key: 'statsVisible', label: 'Stats Visibility', desc: 'Show your teaching stats to students' },
        { key: 'allowStudentMessages', label: 'Student Messages', desc: 'Allow students to message you directly' }
      ].map((setting) => (
        <ToggleSetting
          key={setting.key}
          label={setting.label}
          description={setting.desc}
          checked={preferences?.[setting.key] || false}
          onChange={(value) => onChange('privacy', setting.key, value)}
        />
      ))}
    </div>
  </motion.div>
);

// Quiz Settings Component
const QuizSettings = ({ preferences, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <h2 className="text-2xl font-bold text-white mb-6">📝 Quiz Settings</h2>
    
    <div className="space-y-6">
      <div>
        <label className="block text-white mb-2 font-semibold">Default Time Limit (minutes)</label>
        <input
          type="number"
          value={preferences?.defaultTimeLimit || 30}
          onChange={(e) => onChange('quiz', 'defaultTimeLimit', parseInt(e.target.value))}
          min="5"
          max="120"
          className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
        />
      </div>

      <div>
        <label className="block text-white mb-2 font-semibold">Default Difficulty</label>
        <select
          value={preferences?.difficultyLevel || 'medium'}
          onChange={(e) => onChange('quiz', 'difficultyLevel', e.target.value)}
          className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {[
        { key: 'autoGrading', label: 'Auto Grading', desc: 'Automatically grade quizzes when submitted' },
        { key: 'showAnswers', label: 'Show Answers', desc: 'Show correct answers after quiz completion' },
        { key: 'allowRetakes', label: 'Allow Retakes', desc: 'Let students retake quizzes' }
      ].map((setting) => (
        <ToggleSetting
          key={setting.key}
          label={setting.label}
          description={setting.desc}
          checked={preferences?.[setting.key] || false}
          onChange={(value) => onChange('quiz', setting.key, value)}
        />
      ))}
    </div>
  </motion.div>
);

// Classroom Settings Component
const ClassroomSettings = ({ preferences, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <h2 className="text-2xl font-bold text-white mb-6">🏫 Classroom Management</h2>
    
    <div className="space-y-6">
      {[
        { key: 'autoApproveStudents', label: 'Auto-approve Students', desc: 'Automatically approve student join requests' },
        { key: 'allowAnonymousQuestions', label: 'Anonymous Questions', desc: 'Allow students to ask questions anonymously' },
        { key: 'showLeaderboard', label: 'Show Leaderboard', desc: 'Display class leaderboard to students' },
        { key: 'enablePeerReview', label: 'Peer Review', desc: 'Enable peer review features' }
      ].map((setting) => (
        <ToggleSetting
          key={setting.key}
          label={setting.label}
          description={setting.desc}
          checked={preferences?.[setting.key] || false}
          onChange={(value) => onChange('classroom', setting.key, value)}
        />
      ))}
    </div>
  </motion.div>
);

// Account Settings Component
const AccountSettings = ({ profile, onChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <h2 className="text-2xl font-bold text-white mb-6">🔧 Account Settings</h2>
    
    <div className="space-y-6">
      <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-300 mb-4">⚠️ Danger Zone</h3>
        
        <div className="space-y-4">
          <button
            onClick={() => alert('Password reset email sent!')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition-colors"
          >
            🔑 Reset Password
          </button>
          
          <button
            onClick={() => alert('Export feature coming soon!')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          >
            📦 Export Data
          </button>
          
          <button
            onClick={() => alert('Are you sure? This cannot be undone!')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>

      <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-300 mb-4">📊 Account Statistics</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">156</div>
            <div className="text-sm text-blue-200">Quizzes Created</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">25</div>
            <div className="text-sm text-blue-200">Students Taught</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">2,450</div>
            <div className="text-sm text-blue-200">Hours Teaching</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">89%</div>
            <div className="text-sm text-blue-200">Student Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Toggle Setting Component
const ToggleSetting = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
    <div>
      <h3 className="text-white font-medium">{label}</h3>
      <p className="text-purple-200 text-sm">{description}</p>
    </div>
    
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-green-600' : 'bg-gray-600'
      }`}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full"
        animate={{ x: checked ? 26 : 2 }}
        transition={{ duration: 0.2 }}
      />
    </button>
  </div>
);

export default TeacherSettings;