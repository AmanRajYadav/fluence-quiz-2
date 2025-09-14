// Initialize course progress for Anaya, Kavya, and Mamta
const students = ['Anaya', 'Kavya', 'Mamta'];

students.forEach(studentName => {
  const initialProgress = {
    studentName: studentName,
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
  
  console.log(`Initialized course progress for ${studentName}:`);
  console.log('Key:', `fluence_course_progress_${studentName}`);
  console.log('Data:', JSON.stringify(initialProgress, null, 2));
  console.log('---');
});

console.log('\nTo set these in localStorage when students first visit:');
console.log('localStorage.setItem("fluence_course_progress_Anaya", JSON.stringify(initialProgress))');
console.log('localStorage.setItem("fluence_course_progress_Kavya", JSON.stringify(initialProgress))');