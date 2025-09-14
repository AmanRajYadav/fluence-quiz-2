// src/App.js - Enhanced with Phase 2 Features
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CurriculumProvider } from './contexts/CurriculumContext';

// Original Components (keeping existing functionality)
import MainMenu from './components/Navigation/MainMenu';
import ClassSelection from './components/Navigation/ClassSelection';
import SubjectSelection from './components/Navigation/SubjectSelection';
import ChapterSelection from './components/Navigation/ChapterSelection';
import SinglePlayerQuiz from './components/SinglePlayerQuiz';
import DailyQuiz from './components/DailyQuiz';
import MultiplayerChallenge from './components/MultiplayerChallenge';

// New Phase 2 Components
import EnhancedMainMenu from './components/Navigation/EnhancedMainMenu';
// import EnhancedSinglePlayerQuiz from './components/EnhancedSinglePlayerQuiz';
import StudentProfile from './components/Student/StudentProfile';
import Leaderboard from './components/Social/Leaderboard';
import AchievementSystem from './components/Student/AchievementSystem';
import EnhancedCourseProgress from './components/Student/EnhancedCourseProgress';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import TeacherStudents from './components/Teacher/TeacherStudents';
import TeacherAnalytics from './components/Teacher/TeacherAnalytics';
import TeacherSettings from './components/Teacher/TeacherSettings';
import TeacherClasses from './components/Teacher/TeacherClasses';
import StudentXPManager from './components/Teacher/StudentXPManager';
// import JoinClass from './components/Student/JoinClass'; // Using placeholder for now

import './App.css';

function App() {
  return (
    <CurriculumProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main menu - Enhanced version with mock data manager */}
            <Route path="/" element={<EnhancedMainMenu />} />
            
            {/* Legacy main menu (fallback) */}
            <Route path="/legacy" element={<MainMenu />} />
            
            {/* Daily Quiz (Original functionality preserved) */}
            <Route path="/daily-quiz" element={<DailyQuiz />} />
            
            {/* Enhanced Single Player Practice Flow */}
            <Route path="/practice" element={<ClassSelection mode="practice" />} />
            <Route path="/practice/subject-selection" element={<SubjectSelection mode="practice" />} />
            <Route path="/practice/chapter-selection" element={<ChapterSelection mode="practice" />} />
            <Route path="/practice/quiz" element={<SinglePlayerQuiz />} />
            
            {/* Original single player for backward compatibility */}
            <Route path="/practice/quiz-legacy" element={<SinglePlayerQuiz />} />
            
            {/* Student Features */}
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/achievements" element={<AchievementSystem />} />
            <Route path="/course-progress" element={<EnhancedCourseProgress />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* <Route path="/join-class" element={<JoinClass />} />
            <Route path="/join-class/:classCode" element={<JoinClass />} /> */}
            
            {/* Teacher Dashboard and Management */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
            <Route path="/teacher/settings" element={<TeacherSettings />} />
            <Route path="/teacher/classes" element={<TeacherClasses />} />
            <Route path="/teacher/xp-manager" element={<StudentXPManager />} />
            <Route path="/teacher/reports" element={<TeacherReports />} />
            
            {/* Multiplayer (Phase 1 - Keep existing) */}
            <Route path="/multiplayer" element={<ClassSelection mode="multiplayer" />} />
            <Route path="/multiplayer/subject-selection" element={<SubjectSelection mode="multiplayer" />} />
            <Route path="/multiplayer/chapter-selection" element={<ChapterSelection mode="multiplayer" />} />
            <Route path="/multiplayer/create-room" element={<MultiplayerChallenge />} />
            
            {/* Future Features (Coming Soon pages) */}
            <Route path="/friends" element={<ComingSoon feature="Friends System" />} />
            <Route path="/tournaments" element={<ComingSoon feature="Tournaments" />} />
            <Route path="/study-groups" element={<ComingSoon feature="Study Groups" />} />
            
            {/* Redirect unknown routes to main menu */}
            <Route path="/404" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </CurriculumProvider>
  );
}

// Enhanced Coming Soon Component
// eslint-disable-next-line no-unused-vars
const ComingSoon = ({ feature }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-3xl font-bold text-white mb-4">{feature}</h1>
        <p className="text-gray-300 mb-6">This exciting feature is coming in Phase 3!</p>
        <div className="space-y-3 mb-6">
          <p className="text-sm text-purple-200">
            We're working hard to bring you amazing new features:
          </p>
          <ul className="text-sm text-purple-300 space-y-1">
            <li>🎮 Real-time multiplayer challenges</li>
            <li>👥 Friend system and social features</li>
            <li>🏆 Tournaments and competitions</li>
            <li>📚 Study groups and collaboration</li>
            <li>🎯 Advanced analytics and insights</li>
          </ul>
        </div>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors mr-3"
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Home
        </button>
      </div>
    </div>
  );
};

// Placeholder components for teacher features (you can implement these later)
const TeacherClassManagement = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Class Management</h1>
        <p className="text-gray-600 mb-6">Manage your classes and student enrollment</p>
        <div className="text-4xl mb-4">🏫</div>
        <p className="text-gray-500">Coming soon - Advanced class management features</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
);


const TeacherReports = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Generate Reports</h1>
        <p className="text-gray-600 mb-6">Create detailed progress reports for students and parents</p>
        <div className="text-4xl mb-4">📄</div>
        <p className="text-gray-500">Automated report generation and export features coming soon</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
);

// Additional Components needed
// Achievements component replaced with AchievementSystem import

const JoinClass = () => {
  const [classCode, setClassCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      setError('Please enter a class code');
      return;
    }

    // Mock join class logic
    const userProfile = JSON.parse(localStorage.getItem('fluence_user_profile') || '{}');
    
    // In a real app, this would make an API call
    setTimeout(() => {
      if (classCode.toUpperCase() === 'ABC123') {
        setSuccess(`Successfully joined class with code: ${classCode}`);
        setError('');
        
        // Update user profile with class info
        userProfile.classCode = classCode.toUpperCase();
        userProfile.teacherId = 'teacher_123';
        localStorage.setItem('fluence_user_profile', JSON.stringify(userProfile));
        
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError('Invalid class code. Try "ABC123" for demo.');
        setSuccess('');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🏫</div>
          <h1 className="text-2xl font-bold text-white mb-2">Join a Class</h1>
          <p className="text-purple-200">Enter your teacher's class code to join</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-semibold">
              Class Code
            </label>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="w-full bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-400 uppercase"
              placeholder="e.g., ABC123"
              maxLength={10}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <button
            onClick={handleJoinClass}
            disabled={!classCode.trim()}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              classCode.trim()
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Join Class
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-400/50 rounded-lg">
          <div className="text-sm text-blue-200">
            <strong>💡 For Demo:</strong>
            <br />
            Try class code: <span className="font-mono font-bold">ABC123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;