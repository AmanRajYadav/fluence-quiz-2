import React, { createContext, useContext, useState, useEffect } from 'react';

const CurriculumContext = createContext();

export const CurriculumProvider = ({ children }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [curriculumQuestions, setCurriculumQuestions] = useState([]);

  // Debug logging
  useEffect(() => {
    console.log('Curriculum Context State:', {
      selectedClass,
      selectedSubject,
      selectedChapter,
      questionsCount: curriculumQuestions.length
    });
  }, [selectedClass, selectedSubject, selectedChapter, curriculumQuestions]);

  const value = {
    selectedClass,
    setSelectedClass,
    selectedSubject, 
    setSelectedSubject,
    selectedChapter,
    setSelectedChapter,
    curriculumQuestions,
    setCurriculumQuestions
  };

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error('useCurriculum must be used within CurriculumProvider');
  }
  return context;
};