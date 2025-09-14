export const SUBJECTS = {
  MATHEMATICS: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '🔢',
    color: 'bg-blue-500',
    description: 'Numbers, algebra, and problem solving'
  },
  SCIENCE: {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'bg-green-500',
    description: 'Physics, chemistry, and biology'
  },
  SOCIAL_SCIENCE: {
    id: 'social-science',
    name: 'Social Science',
    icon: '🌍',
    color: 'bg-orange-500',
    description: 'History, geography, and civics'
  },
  ENGLISH: {
    id: 'english',
    name: 'English',
    icon: '📖',
    color: 'bg-purple-500',
    description: 'Grammar, literature, and comprehension'
  },
  HINDI: {
    id: 'hindi',
    name: 'Hindi',
    icon: '🇮🇳',
    color: 'bg-red-500',
    description: 'हिंदी व्याकरण और साहित्य'
  },
  SANSKRIT: {
    id: 'sanskrit',
    name: 'Sanskrit',
    icon: '🕉️',
    color: 'bg-yellow-500',
    description: 'संस्कृत भाषा और श्लोक'
  }
};

export const getSubjectById = (id) => {
  return Object.values(SUBJECTS).find(subject => subject.id === id);
};

export const getAllSubjects = () => {
  return Object.values(SUBJECTS);
};

export const getSubjectColor = (subjectId) => {
  const subject = getSubjectById(subjectId);
  return subject ? subject.color : 'bg-gray-500';
};

export const getSubjectIcon = (subjectId) => {
  const subject = getSubjectById(subjectId);
  return subject ? subject.icon : '📚';
};