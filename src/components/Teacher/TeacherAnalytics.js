// src/components/Teacher/TeacherAnalytics.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalStudents: 25,
    activeStudents: 22,
    totalQuizzes: 245,
    averageScore: 78.5,
    completionRate: 85.2,
    timeSpent: 1250, // minutes
    improvement: 12.5 // percentage
  },
  performance: {
    bySubject: [
      { subject: 'Mathematics', avgScore: 82, totalQuizzes: 89, students: 25 },
      { subject: 'Science', avgScore: 76, totalQuizzes: 78, students: 23 },
      { subject: 'English', avgScore: 79, totalQuizzes: 78, students: 24 },
      { subject: 'History', avgScore: 74, totalQuizzes: 45, students: 18 }
    ],
    topPerformers: [
      { name: 'Alice Johnson', score: 94, quizzes: 15, improvement: 8 },
      { name: 'Carol Davis', score: 91, quizzes: 18, improvement: 12 },
      { name: 'Emma Brown', score: 88, quizzes: 14, improvement: 6 }
    ],
    strugglingStudents: [
      { name: 'David Wilson', score: 62, quizzes: 8, decline: -5 },
      { name: 'John Parker', score: 68, quizzes: 12, decline: -2 }
    ]
  },
  engagement: {
    dailyActivity: [
      { day: 'Mon', students: 18, quizzes: 45 },
      { day: 'Tue', students: 22, quizzes: 56 },
      { day: 'Wed', students: 20, quizzes: 48 },
      { day: 'Thu', students: 19, quizzes: 42 },
      { day: 'Fri', students: 24, quizzes: 62 },
      { day: 'Sat', students: 15, quizzes: 28 },
      { day: 'Sun', students: 12, quizzes: 22 }
    ],
    peakHours: [
      { hour: '3-4 PM', activity: 85 },
      { hour: '7-8 PM', activity: 78 },
      { hour: '8-9 PM', activity: 72 },
      { hour: '4-5 PM', activity: 65 }
    ]
  },
  trends: {
    weeklyProgress: [
      { week: 'Week 1', avgScore: 72, participation: 80 },
      { week: 'Week 2', avgScore: 75, participation: 85 },
      { week: 'Week 3', avgScore: 78, participation: 88 },
      { week: 'Week 4', avgScore: 81, participation: 90 }
    ],
    monthlyComparison: {
      currentMonth: { score: 78.5, quizzes: 245, students: 25 },
      lastMonth: { score: 74.2, quizzes: 198, students: 23 },
      improvement: { score: 5.8, quizzes: 23.7, students: 8.7 }
    }
  }
};

const TeacherAnalytics = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('this-month');
  const [selectedView, setSelectedView] = useState('overview');
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState(mockAnalyticsData);

  const renderOverviewCards = () => {
    const { overview } = data;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon="👥"
          title="Active Students"
          value={overview.activeStudents}
          total={overview.totalStudents}
          color="from-blue-500 to-cyan-500"
          trend={+8.7}
        />
        
        <MetricCard
          icon="📊"
          title="Average Score"
          value={`${overview.averageScore}%`}
          color="from-green-500 to-emerald-500"
          trend={+5.8}
        />
        
        <MetricCard
          icon="📝"
          title="Total Quizzes"
          value={overview.totalQuizzes}
          color="from-purple-500 to-pink-500"
          trend={+23.7}
        />
        
        <MetricCard
          icon="⏱️"
          title="Study Time"
          value={`${Math.floor(overview.timeSpent / 60)}h ${overview.timeSpent % 60}m`}
          color="from-orange-500 to-red-500"
          trend={+15.2}
        />
      </div>
    );
  };

  const renderPerformanceAnalysis = () => {
    const { performance } = data;
    
    return (
      <div className="space-y-8">
        {/* Subject Performance */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">📚 Subject Performance</h3>
          
          <div className="space-y-4">
            {performance.bySubject.map((subject, index) => (
              <SubjectPerformanceBar
                key={subject.subject}
                subject={subject}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Top & Struggling Students */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">🏆 Top Performers</h3>
            
            <div className="space-y-3">
              {performance.topPerformers.map((student, index) => (
                <StudentPerformanceItem
                  key={student.name}
                  student={student}
                  rank={index + 1}
                  type="top"
                />
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">📉 Needs Attention</h3>
            
            <div className="space-y-3">
              {performance.strugglingStudents.map((student, index) => (
                <StudentPerformanceItem
                  key={student.name}
                  student={student}
                  rank={index + 1}
                  type="struggling"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEngagementMetrics = () => {
    const { engagement } = data;
    
    return (
      <div className="space-y-8">
        {/* Daily Activity */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">📅 Daily Activity</h3>
          
          <div className="grid grid-cols-7 gap-2">
            {engagement.dailyActivity.map((day, index) => (
              <DayActivityCard key={day.day} day={day} index={index} />
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">⏰ Peak Study Hours</h3>
          
          <div className="space-y-3">
            {engagement.peakHours.map((hour, index) => (
              <PeakHourBar key={hour.hour} hour={hour} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTrendsAnalysis = () => {
    const { trends } = data;
    
    return (
      <div className="space-y-8">
        {/* Weekly Progress */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">📈 Weekly Progress</h3>
          
          <div className="space-y-4">
            {trends.weeklyProgress.map((week, index) => (
              <WeekProgressBar key={week.week} week={week} index={index} />
            ))}
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">📊 Monthly Comparison</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ComparisonCard
              title="Average Score"
              current={trends.monthlyComparison.currentMonth.score}
              previous={trends.monthlyComparison.lastMonth.score}
              improvement={trends.monthlyComparison.improvement.score}
              unit="%"
            />
            
            <ComparisonCard
              title="Quizzes Completed"
              current={trends.monthlyComparison.currentMonth.quizzes}
              previous={trends.monthlyComparison.lastMonth.quizzes}
              improvement={trends.monthlyComparison.improvement.quizzes}
              unit=""
            />
            
            <ComparisonCard
              title="Active Students"
              current={trends.monthlyComparison.currentMonth.students}
              previous={trends.monthlyComparison.lastMonth.students}
              improvement={trends.monthlyComparison.improvement.students}
              unit=""
            />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'performance':
        return renderPerformanceAnalysis();
      case 'engagement':
        return renderEngagementMetrics();
      case 'trends':
        return renderTrendsAnalysis();
      default:
        return (
          <div className="space-y-8">
            {renderPerformanceAnalysis()}
            {renderEngagementMetrics()}
          </div>
        );
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
              <h1 className="text-3xl font-bold text-white">📈 Analytics</h1>
              <p className="text-purple-200">Student performance insights and metrics</p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🏠 Back Home
            </button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {renderOverviewCards()}
        </motion.div>

        {/* Controls */}
        <motion.div
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* View Selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: '📊 Overview' },
                { id: 'performance', label: '🎯 Performance' },
                { id: 'engagement', label: '📱 Engagement' },
                { id: 'trends', label: '📈 Trends' }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedView === view.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {/* Timeframe Selector */}
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
            >
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-quarter">This Quarter</option>
            </select>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, title, value, total, color, trend }) => (
  <motion.div
    className={`bg-gradient-to-r ${color} p-6 rounded-xl text-white shadow-lg`}
    whileHover={{ scale: 1.05 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="text-3xl">{icon}</div>
      {trend && (
        <div className={`text-sm font-bold ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
          {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
        </div>
      )}
    </div>
    
    <div className="text-2xl font-bold mb-1">
      {value}{total && `/${total}`}
    </div>
    <div className="text-sm opacity-90">{title}</div>
  </motion.div>
);

// Subject Performance Bar Component
const SubjectPerformanceBar = ({ subject, index }) => (
  <motion.div
    className="bg-white/5 rounded-lg p-4"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-white font-medium">{subject.subject}</h4>
      <span className="text-white font-bold">{subject.avgScore}%</span>
    </div>
    
    <div className="w-full bg-white/20 rounded-full h-3 mb-2">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
        style={{ width: `${subject.avgScore}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${subject.avgScore}%` }}
        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
      />
    </div>
    
    <div className="flex justify-between text-sm text-purple-200">
      <span>{subject.totalQuizzes} quizzes</span>
      <span>{subject.students} students</span>
    </div>
  </motion.div>
);

// Student Performance Item Component
const StudentPerformanceItem = ({ student, rank, type }) => (
  <motion.div
    className={`p-3 rounded-lg ${
      type === 'top' 
        ? 'bg-green-500/20 border border-green-400/50' 
        : 'bg-red-500/20 border border-red-400/50'
    }`}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          type === 'top' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {rank}
        </div>
        <span className="text-white font-medium">{student.name}</span>
      </div>
      
      <div className="text-right">
        <div className="text-white font-bold">{student.score}%</div>
        <div className={`text-xs ${
          type === 'top' ? 'text-green-400' : 'text-red-400'
        }`}>
          {type === 'top' ? `+${student.improvement}%` : `${student.decline}%`}
        </div>
      </div>
    </div>
  </motion.div>
);

// Day Activity Card Component
const DayActivityCard = ({ day, index }) => (
  <motion.div
    className="bg-white/5 rounded-lg p-3 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="text-xs text-purple-200 mb-1">{day.day}</div>
    <div className="text-lg font-bold text-white">{day.students}</div>
    <div className="text-xs text-purple-300">{day.quizzes} quizzes</div>
    
    <div className="w-full bg-white/20 rounded-full h-1 mt-2">
      <motion.div
        className="bg-blue-500 h-1 rounded-full"
        style={{ width: `${(day.students / 25) * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${(day.students / 25) * 100}%` }}
        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
      />
    </div>
  </motion.div>
);

// Peak Hour Bar Component
const PeakHourBar = ({ hour, index }) => (
  <motion.div
    className="flex justify-between items-center"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <span className="text-white font-medium w-20">{hour.hour}</span>
    
    <div className="flex-1 mx-4">
      <div className="w-full bg-white/20 rounded-full h-3">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full"
          style={{ width: `${hour.activity}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${hour.activity}%` }}
          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
        />
      </div>
    </div>
    
    <span className="text-white font-bold w-12 text-right">{hour.activity}%</span>
  </motion.div>
);

// Week Progress Bar Component
const WeekProgressBar = ({ week, index }) => (
  <motion.div
    className="bg-white/5 rounded-lg p-4"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-white font-medium">{week.week}</h4>
      <div className="flex space-x-4">
        <span className="text-green-400">{week.avgScore}% avg</span>
        <span className="text-blue-400">{week.participation}% participation</span>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-2">
      <div className="w-full bg-white/20 rounded-full h-2">
        <motion.div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${week.avgScore}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${week.avgScore}%` }}
          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
        />
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-2">
        <motion.div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${week.participation}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${week.participation}%` }}
          transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
        />
      </div>
    </div>
  </motion.div>
);

// Comparison Card Component
const ComparisonCard = ({ title, current, previous, improvement, unit }) => (
  <motion.div
    className="bg-white/5 rounded-lg p-4"
    whileHover={{ scale: 1.02 }}
  >
    <h4 className="text-white font-medium mb-3">{title}</h4>
    
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-purple-200">Current:</span>
        <span className="text-white font-bold">{current}{unit}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-purple-200">Previous:</span>
        <span className="text-gray-400">{previous}{unit}</span>
      </div>
      
      <div className="flex justify-between">
        <span className="text-purple-200">Change:</span>
        <span className={`font-bold ${improvement > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {improvement > 0 ? '+' : ''}{improvement}%
        </span>
      </div>
    </div>
  </motion.div>
);

export default TeacherAnalytics;