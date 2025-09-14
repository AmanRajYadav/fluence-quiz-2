// Student configuration with consistent IDs across the application
// Available courses
export const COURSES = {
  CLASS_6_MASTERY: {
    id: 'class_6_mastery',
    name: 'Class 6th Mastery',
    description: 'Complete academic mastery for Class 6 students',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500',
    subjects: ['mathematics', 'science', 'english', 'hindi', 'social-science'],
    maxXP: 10000,
    maxLevels: 100
  },
  CLASS_7_MASTERY: {
    id: 'class_7_mastery',
    name: 'Class 7th Mastery',
    description: 'Complete academic mastery for Class 7 students',
    icon: '📖',
    color: 'from-green-500 to-teal-500',
    subjects: ['mathematics', 'science', 'english', 'hindi', 'social-science'],
    maxXP: 12000,
    maxLevels: 100
  },
  SPOKEN_ENGLISH: {
    id: 'spoken_english_grammar',
    name: 'Spoken English & Grammar Course',
    description: 'Master English communication and grammar skills',
    icon: '🗣️',
    color: 'from-purple-500 to-pink-500',
    subjects: ['english', 'speaking', 'grammar', 'vocabulary'],
    maxXP: 15000,
    maxLevels: 100
  },
  CLASS_8_MASTERY: {
    id: 'class_8_mastery',
    name: 'Class 8th Mastery',
    description: 'Complete academic mastery for Class 8 students',
    icon: '📝',
    color: 'from-orange-500 to-red-500',
    subjects: ['mathematics', 'science', 'english', 'hindi', 'social-science'],
    maxXP: 14000,
    maxLevels: 100
  }
};

export const STUDENTS = {
  anaya: {
    id: 'student1',
    name: 'Anaya',
    email: 'anaya@school.edu',
    avatarEmoji: '👩‍🎓',
    dailyQuizId: '1',
    enrolledCourse: 'spoken_english_grammar'
  },
  kavya: {
    id: 'student2', 
    name: 'Kavya',
    email: 'kavya@school.edu',
    avatarEmoji: '👩‍🎓',
    dailyQuizId: '2',
    enrolledCourse: 'class_6_mastery'
  },
  mamta: {
    id: 'student3',
    name: 'Mamta', 
    email: 'mamta@school.edu',
    avatarEmoji: '👩‍🎓',
    dailyQuizId: '3',
    enrolledCourse: 'class_6_mastery'
  }
};

// Helper functions
export const getStudentByName = (name) => {
  const normalizedName = name.toLowerCase().trim();
  return Object.values(STUDENTS).find(student => 
    student.name.toLowerCase() === normalizedName
  );
};

export const getStudentById = (id) => {
  return Object.values(STUDENTS).find(student => student.id === id);
};

export const getStudentByDailyQuizId = (dailyQuizId) => {
  return Object.values(STUDENTS).find(student => student.dailyQuizId === dailyQuizId);
};

export const getAllStudents = () => {
  return Object.values(STUDENTS);
};

export const getCourseById = (courseId) => {
  return Object.values(COURSES).find(course => course.id === courseId);
};

export const getStudentCourse = (studentName) => {
  const student = getStudentByName(studentName);
  return student ? getCourseById(student.enrolledCourse) : null;
};

export const getAllCourses = () => {
  return Object.values(COURSES);
};

// Initialize course progress for all students
export const initializeAllStudentProgress = () => {
  getAllStudents().forEach(student => {
    const progressKey = `fluence_course_progress_${student.name}`;
    const existing = localStorage.getItem(progressKey);
    
    if (!existing) {
      const initialProgress = {
        studentId: student.id,
        studentName: student.name,
        courseXP: 0,
        levelsCompleted: 0,
        totalLevels: 20,
        subjects: {
          mathematics: { xp: 0, levelsCompleted: 0, totalLevels: 5 },
          science: { xp: 0, levelsCompleted: 0, totalLevels: 5 },
          english: { xp: 0, levelsCompleted: 0, totalLevels: 5 },
          hindi: { xp: 0, levelsCompleted: 0, totalLevels: 3 },
          'social-science': { xp: 0, levelsCompleted: 0, totalLevels: 2 }
        },
        achievements: [],
        streakDays: 0,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(progressKey, JSON.stringify(initialProgress));
    }
  });
};