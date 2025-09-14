# Fluence Quiz App - Complete User Manual

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Student Features](#student-features)
4. [Teacher Features](#teacher-features)
5. [Build & Deployment](#build--deployment)
6. [Troubleshooting](#troubleshooting)

## Overview

The Fluence Quiz App is an interactive educational platform designed for students and teachers. Students can practice quizzes across multiple subjects, track their progress, and compete on leaderboards. Teachers can create classes, manage students, and monitor progress.

### Key Features
- **Role-based Access**: Student and Teacher roles with different features
- **Subject Coverage**: Mathematics, Science, English, Hindi, Social Science, Sanskrit
- **Progress Tracking**: XP system, levels, achievements, and streaks
- **Analytics**: Detailed performance metrics and reports
- **Class Management**: Teachers can create classes and invite students

## Getting Started

### First-Time Setup

1. **Open the Application**
   - Navigate to the app URL in your web browser
   - You'll see the welcome screen with role selection

2. **Choose Your Role**
   - **Student**: For learners who want to take quizzes and track progress
   - **Teacher**: For educators who want to manage classes and students

3. **Student Setup**
   - Click "Student" button
   - Enter your name (e.g., "Anaya" or "Kavya")
   - Choose an emoji avatar
   - Your profile is automatically created with 0 XP and Level 1

4. **Teacher Setup** 
   - Click "Teacher" button
   - Enter credentials:
     - Name: `Aman Raj Yadav`
     - Password: `Helloaman@1947`
   - Access the teacher dashboard

## Student Features

### 📚 Practice Mode
**Purpose**: Solo learning with immediate feedback

**How to Use**:
1. From main menu, click "📚 Practice Mode"
2. Select your class level (6-12)
3. Choose a subject (Mathematics, Science, English, etc.)
4. Pick a chapter or topic
5. Take the quiz and get instant results
6. Earn XP for correct answers

**Benefits**:
- Self-paced learning
- Immediate feedback
- XP rewards for progress

### ⭐ Daily Quiz
**Purpose**: Fresh challenges every day

**How to Use**:
1. Click "⭐ Daily Quiz" from main menu
2. New quiz available daily with mixed questions
3. Limited attempts per day
4. Bonus XP for daily completion

**Benefits**:
- Consistent practice habit
- Varied question types
- Streak bonuses

### 📈 Course Progress
**Purpose**: Track your learning journey with XP and levels

**Features**:
- **Course XP**: Total experience points earned (0-1000)
- **Levels Completed**: Progress through 20 course levels
- **Subject Breakdown**: XP by subject (Mathematics, Science, English, Hindi, Social Science)
- **Learning Path**: Visual representation of completed and upcoming levels

**How XP & Levels Work**:
- Level 1: Getting Started (50 XP)
- Level 2: Basic Operations (100 XP)
- Level 3: Number Patterns (150 XP)
- ...continuing to Level 20: Course Master (1000 XP)

**Teacher Management**: Teachers can manually update student XP and levels from their dashboard

### 🏆 Achievements
**Purpose**: Recognize milestones and accomplishments

**Achievement Types**:
- **First Steps**: Complete first quiz
- **Quick Learner**: Complete 10 quizzes in one day
- **Perfect Score**: Get 100% on any quiz
- **Subject Master**: Complete all chapters in a subject
- **Streak Champion**: Maintain 7-day daily streak
- **XP Collector**: Earn 500 total XP

### 🥇 Leaderboard
**Purpose**: Compete with other students

**Features**:
- Overall rankings by total XP
- Subject-specific leaderboards
- Friend comparisons
- Weekly/monthly views

### 👤 My Profile
**Purpose**: View personal statistics and progress

**Information Displayed**:
- Avatar and basic info
- Current level and XP
- Total quizzes taken
- Average score
- Subject performance
- Achievement gallery
- Daily streak counter

## Teacher Features

### 👨‍🏫 Teacher Dashboard
**Purpose**: Overview of all classes and student performance

**Key Metrics**:
- Total active students
- Class average scores
- Recent quiz activity
- Weekly performance trends
- Subject-wise performance breakdown

**Quick Actions**:
- Create new classes
- View detailed analytics
- Manage students
- Generate reports

### 🏫 Class Management
**Purpose**: Create and organize classes

**How to Create a Class**:
1. Go to "🏫 Class Management"
2. Click "➕ Create Class"
3. Enter class details:
   - Class Name (e.g., "Class 6A", "Morning Batch")
   - Subject focus
   - Description
4. Get unique class code for student enrollment
5. Share class code with students

**Class Features**:
- Unique 6-character class codes
- Student enrollment tracking
- Class-specific analytics
- Activate/deactivate classes

### 👥 Student Management
**Purpose**: Monitor and manage individual students

**Features**:
- View all enrolled students
- Search and filter students
- Individual student profiles
- Performance tracking
- Send messages to students
- Assign specific quizzes

**Managing Course Progress**:
- Access "📈 Course Progress Manager" from teacher dashboard
- Update student Course XP (for Course Progress section only)
- Set Course levels completed (0-20 levels)
- Track subject-wise XP progress
- Award achievements and manage student learning paths

### 📊 Analytics & Reports
**Purpose**: Detailed insights into student performance

**Analytics Views**:
- **Overview**: High-level metrics
- **Performance**: Subject and student analysis
- **Engagement**: Daily activity and peak hours
- **Trends**: Weekly progress and comparisons

**Report Types**:
- Student progress reports
- Class performance summaries
- Subject analysis
- Time-based trends

### 📈 Course Progress Manager
**Purpose**: Manually manage student Course XP and levels

**Features**:
- Individual student Course XP management (0-1000)
- Course levels management (0-20 levels) 
- Subject-specific XP tracking
- Quick actions for bulk updates
- Real-time progress visualization

**How to Use**:
1. Go to Teacher Dashboard
2. Click "📈 Course Progress Manager"
3. Select student to edit
4. Update Course XP and levels
5. Changes reflect immediately in student's Course Progress section

**Quick Actions**:
- Give all students +50 XP bonus
- Auto-update levels based on XP
- Reset all progress (use with caution)

### ⚙️ Settings
**Purpose**: Customize teacher experience

**Setting Categories**:
- **Profile**: Basic info and avatar
- **Notifications**: Email and push preferences
- **Privacy**: Visibility settings
- **Quiz Defaults**: Time limits, difficulty levels
- **Classroom**: Auto-approval and display options

## Build & Deployment

### Development Setup

1. **Prerequisites**:
   ```bash
   Node.js (v18 or higher)
   npm or yarn package manager
   ```

2. **Installation**:
   ```bash
   cd fluence-quiz-2
   npm install
   ```

3. **Development Mode**:
   ```bash
   npm start
   # App opens at http://localhost:3000
   ```

### Production Build

1. **Create Production Build**:
   ```bash
   npm run build
   ```
   This creates a `build` folder with optimized files.

2. **Test Production Build Locally**:
   ```bash
   npm install -g serve
   serve -s build -l 3000
   ```

### Deployment Options

#### Option 1: Netlify (Recommended)
1. Push code to GitHub repository
2. Connect Netlify to your repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Deploy automatically on commits

#### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow prompts to deploy

#### Option 3: GitHub Pages
1. Install: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/fluence-quiz-2",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Run: `npm run deploy`

#### Option 4: Traditional Web Hosting
1. Create production build: `npm run build`
2. Upload `build` folder contents to web server
3. Configure server for SPA (Single Page Application)

### Environment Configuration

Create `.env` file in root directory:
```
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_VERSION=2.0.0
```

## Current Student Setup

The app is initialized for three students with consistent IDs:

### Student 1: Anaya
- **Student ID**: `student1`
- **Daily Quiz ID**: `1`
- **Username**: Anaya
- **Course XP**: 0
- **Levels Completed**: 0
- **Ready to start**: Yes

### Student 2: Kavya  
- **Student ID**: `student2`
- **Daily Quiz ID**: `2`
- **Username**: Kavya
- **Course XP**: 0
- **Levels Completed**: 0
- **Ready to start**: Yes

### Student 3: Mamta
- **Student ID**: `student3`
- **Daily Quiz ID**: `3`
- **Username**: Mamta
- **Course XP**: 0
- **Levels Completed**: 0
- **Ready to start**: Yes

All students can begin using the app immediately with their profiles automatically created when they first log in. These IDs are used consistently across all features including daily quiz assignment and progress tracking.

## Troubleshooting

### Common Issues

**Issue: Role selection not working**
- Solution: Clear browser cache and reload
- Check browser console for errors

**Issue: Data not saving**
- Solution: Ensure localStorage is enabled in browser
- Try private/incognito mode

**Issue: Teacher authentication fails**
- Solution: Use exact credentials:
  - Name: `Aman Raj Yadav` (case-sensitive)
  - Password: `Helloaman@1947`

**Issue: Quiz questions not loading**
- Solution: Check browser network tab
- Verify all components are properly imported

**Issue: Build fails**
- Solution: Run `npm install` again
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`

### Performance Optimization

1. **Images**: Optimize images before adding
2. **Code Splitting**: Use React.lazy() for large components
3. **Caching**: Enable browser caching in deployment
4. **CDN**: Use CDN for static assets in production

### Browser Support

- **Minimum**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Recommended**: Latest versions of major browsers
- **Mobile**: iOS Safari 12+, Chrome Mobile 70+

### Data Management

- **Storage**: Uses localStorage for persistence
- **Backup**: Export data regularly in production
- **Migration**: Plan for data structure updates

## Support & Updates

For technical issues or feature requests:
1. Check this manual first
2. Review browser console for errors
3. Test in different browsers
4. Contact development team with specific error messages

## Version History

- **v2.0.0**: Full student and teacher features
- **v1.0.0**: Basic quiz functionality

---

*This manual covers all current features as of version 2.0.0. Keep this document updated as new features are added.*