import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import { useCurriculum } from '../contexts/CurriculumContext';
import CurriculumService from '../services/curriculumService';
import FileTestService from '../services/FileTestService';

// Ultimate fallback - guaranteed 20 questions
const getUltimateFallbackQuestions = (subject = 'mathematics') => {
  const baseQuestions = {
    mathematics: [
      { question: "What is 5 + 3?", options: ["6", "7", "8", "9"], correct: 2, explanation: "5 + 3 = 8" },
      { question: "What is 10 - 4?", options: ["5", "6", "7", "8"], correct: 1, explanation: "10 - 4 = 6" },
      { question: "What is 3 × 4?", options: ["10", "11", "12", "13"], correct: 2, explanation: "3 × 4 = 12" },
      { question: "What is 16 ÷ 4?", options: ["3", "4", "5", "6"], correct: 1, explanation: "16 ÷ 4 = 4" },
      { question: "What is 7 + 6?", options: ["12", "13", "14", "15"], correct: 1, explanation: "7 + 6 = 13" },
      { question: "What is 9 × 2?", options: ["16", "17", "18", "19"], correct: 2, explanation: "9 × 2 = 18" },
      { question: "What is 15 ÷ 3?", options: ["4", "5", "6", "7"], correct: 1, explanation: "15 ÷ 3 = 5" },
      { question: "What is 8 + 7?", options: ["14", "15", "16", "17"], correct: 1, explanation: "8 + 7 = 15" },
      { question: "What is 6 × 3?", options: ["16", "17", "18", "19"], correct: 2, explanation: "6 × 3 = 18" },
      { question: "What is 20 ÷ 5?", options: ["3", "4", "5", "6"], correct: 1, explanation: "20 ÷ 5 = 4" }
    ],
    science: [
      { question: "What do plants need to grow?", options: ["Only water", "Only sunlight", "Water and sunlight", "Only soil"], correct: 2, explanation: "Plants need both water and sunlight" },
      { question: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Silver"], correct: 2, explanation: "Diamond is the hardest natural substance" },
      { question: "How many legs does a spider have?", options: ["6", "8", "10", "12"], correct: 1, explanation: "Spiders have 8 legs" },
      { question: "What gas do plants produce?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correct: 1, explanation: "Plants produce oxygen during photosynthesis" },
      { question: "What is the center of an atom called?", options: ["Electron", "Proton", "Neutron", "Nucleus"], correct: 3, explanation: "The center of an atom is called the nucleus" }
    ]
  };
  
  const questions = baseQuestions[subject] || baseQuestions.mathematics;
  
  // Repeat questions to make exactly 20
  const result = [];
  while (result.length < 20) {
    const remaining = 20 - result.length;
    const questionsToAdd = questions.slice(0, Math.min(remaining, questions.length));
    
    // Add some variation to repeated questions
    const modifiedQuestions = questionsToAdd.map((q, index) => ({
      ...q,
      question: result.length > questions.length ? `[Bonus] ${q.question}` : q.question
    }));
    
    result.push(...modifiedQuestions);
  }
  
  return result.slice(0, 20);
};
// Test function to verify file access
const testFileAccess = async () => {
  console.log('🧪 Testing access to files we know exist...');
  
  // Use FileTestService to test
  const result = await FileTestService.testFileAccess();
  if (result) {
    console.log('✅ FileTestService found working path:', result.path);
    return result.data;
  } else {
    console.log('❌ FileTestService could not find any working paths');
    return null;
  }
};



const SinglePlayerQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get from curriculum context (same as MultiplayerQuiz)
  const { 
    selectedClass, 
    selectedSubject, 
    selectedChapter,
    curriculumQuestions,
    setCurriculumQuestions 
  } = useCurriculum();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState('loading');
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [showResult, setShowResult] = useState(false);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    // Check if we have curriculum context data
    if (selectedClass && selectedSubject && selectedChapter) {
      console.log('Using curriculum context:', { selectedClass, selectedSubject, selectedChapter });
      loadQuestions(selectedClass, selectedSubject, selectedChapter);
      return;
    }
    
    // Fallback to URL parameters
    const params = new URLSearchParams(location.search);
    const classParam = params.get('class');
    const subjectParam = params.get('subject');
    const chapterParam = params.get('chapter');
    
    if (!classParam || !subjectParam || !chapterParam) {
      navigate('/practice');
      return;
    }
    
    console.log('Using URL parameters:', { classParam, subjectParam, chapterParam });
    loadQuestions(classParam, subjectParam, chapterParam);
  }, [selectedClass, selectedSubject, selectedChapter, location, navigate]);

  // Force load questions if missing (same logic as MultiplayerQuiz)
  useEffect(() => {
    const loadQuestionsIfMissing = async () => {
      if (selectedClass && selectedSubject && selectedChapter && curriculumQuestions.length === 0) {
        console.log('Questions missing in SinglePlayer, loading...');
        
        try {
          const questions = await CurriculumService.fetchQuestions(
            selectedClass, 
            selectedSubject, 
            selectedChapter
          );
          
          console.log('Loaded questions in SinglePlayer:', questions.length);
          setCurriculumQuestions(questions);
          
        } catch (error) {
          console.error('Failed to load questions in SinglePlayer:', error);
          // Try direct fetch as fallback
          try {
            const response = await fetch(`/data/classes/${selectedClass}/${selectedSubject}/${selectedChapter}.json`);
            const data = await response.json();
            const processedQuestions = CurriculumService.normalizeQuestions(data);
            if (processedQuestions.length > 0) {
              setCurriculumQuestions(processedQuestions);
            }
          } catch (directError) {
            console.error('Direct fetch also failed:', directError);
          }
        }
      }
    };

    loadQuestionsIfMissing();
  }, [selectedClass, selectedSubject, selectedChapter, curriculumQuestions.length, setCurriculumQuestions]);

  // Copy exact working logic from MultiplayerQuiz
  useEffect(() => {
    if (curriculumQuestions.length === 0 && selectedClass && selectedSubject && selectedChapter) {
      const testQuestions = CurriculumService.getHardcodedQuestions(
        selectedClass, 
        selectedSubject, 
        selectedChapter
      );
      
      if (testQuestions.length > 0) {
        setCurriculumQuestions(testQuestions);
        console.log('Using test questions from MultiplayerQuiz logic:', testQuestions.length);
      }
    }
  }, [selectedClass, selectedSubject, selectedChapter, curriculumQuestions.length, setCurriculumQuestions]);

  // Test file access on component mount
  useEffect(() => {
    testFileAccess();
  }, []);


  const loadQuestions = async (classParam, subjectParam, chapterParam) => {
    try {
      console.log('Loading questions for SinglePlayer:', { classParam, subjectParam, chapterParam });
      setGameState('loading');
      
      let questionsToUse = [];
      
      // First try to use questions from curriculum context (if already loaded)
      if (curriculumQuestions && curriculumQuestions.length > 0) {
        console.log('Using questions from curriculum context:', curriculumQuestions.length);
        questionsToUse = curriculumQuestions;
      } else {
        // Try to fetch questions using CurriculumService (same as MultiplayerQuiz)
        try {
          console.log('Fetching questions from curriculum service...');
          const fetchedQuestions = await CurriculumService.fetchQuestions(
            classParam, 
            subjectParam, 
            chapterParam
          );
          
          if (fetchedQuestions && fetchedQuestions.length > 0) {
            console.log('Successfully fetched questions:', fetchedQuestions.length);
            questionsToUse = fetchedQuestions;
            setCurriculumQuestions(fetchedQuestions); // Store in context
          }
        } catch (error) {
          console.error('CurriculumService.fetchQuestions failed:', error);
        }
        
        // If still no questions, try hardcoded fallback
        if (questionsToUse.length === 0) {
          console.log('Trying hardcoded questions fallback...');
          const hardcodedQuestions = CurriculumService.getHardcodedQuestions(
            classParam, 
            subjectParam, 
            chapterParam
          );
          
          if (hardcodedQuestions && hardcodedQuestions.length > 0) {
            console.log('Using hardcoded questions:', hardcodedQuestions.length);
            questionsToUse = hardcodedQuestions;
            setCurriculumQuestions(hardcodedQuestions);
          }
        }
        
        // Enhanced fallback with multiple path attempts
        if (questionsToUse.length === 0) {
          console.log('Testing multiple fetch paths...');
          
          // Try paths matching your exact directory structure
          const possiblePaths = [
            `/data/classes/${classParam}/${subjectParam}/${chapterParam}.json`,
            `/data/classes/${classParam}/${subjectParam}/all-chapters.json`,
            `/data/classes/${classParam}/combined.json`,
            `./data/classes/${classParam}/${subjectParam}/${chapterParam}.json`,
            `./data/classes/${classParam}/${subjectParam}/all-chapters.json`,
            `./data/classes/${classParam}/combined.json`
          ];

          console.log('Testing paths for:', {
            classParam,    // should be "class6"
            subjectParam,  // should be "mathematics", "english", etc.
            chapterParam   // should be "patterns-in-mathematics", etc.
          });

          // Debug: Log what we expect vs what we're trying
          console.log('Expected file structure based on your directory:');
          console.log(`Main path: /data/classes/${classParam}/${subjectParam}/${chapterParam}.json`);
          console.log(`Fallback: /data/classes/${classParam}/${subjectParam}/all-chapters.json`);
          console.log(`Combined: /data/classes/${classParam}/combined.json`);

          // Test specific files we know exist from your screenshots
          if (classParam === 'class6' && subjectParam === 'mathematics') {
            const knownFiles = [
              'patterns-in-mathematics.json',
              'number-play.json', 
              'all-chapters.json',
              'fractions.json',
              'lines-and-angles.json'
            ];
            
            console.log('Known math files in your directory:', knownFiles);
            
            // Try the specific file we know exists (patterns-in-mathematics.json is 9 KB)
            if (chapterParam === 'patterns-in-mathematics') {
              possiblePaths.unshift(`/data/classes/class6/mathematics/patterns-in-mathematics.json`);
            }
          }
          
          for (const path of possiblePaths) {
            try {
              console.log(`Trying path: ${path}`);
              const response = await fetch(path);
              
              if (response.ok) {
                const contentType = response.headers.get('content-type');
                console.log(`Response content-type: ${contentType}`);
                
                if (contentType && contentType.includes('application/json')) {
                  const data = await response.json();
                  console.log('Direct fetch success from path:', path, data);
                  
                  const processedQuestions = CurriculumService.normalizeQuestions(data);
                  console.log('Processed questions:', processedQuestions.length);
                  
                  if (processedQuestions.length > 0) {
                    questionsToUse = processedQuestions;
                    setCurriculumQuestions(processedQuestions);
                    break; // Exit loop on success
                  }
                } else {
                  console.log(`Path ${path} returned non-JSON content (likely 404 HTML)`);
                }
              } else {
                console.log(`Path ${path} returned status: ${response.status}`);
              }
            } catch (error) {
              console.log(`Path ${path} failed:`, error.message);
            }
          }
        }
      }
      
      // Convert questions to SinglePlayer format and take 20 questions
      if (questionsToUse.length > 0) {
        const convertedQuestions = questionsToUse.map((q, index) => ({
          question: q.text || q.question,
          options: q.options || [],
          correct: q.options ? q.options.findIndex(opt => opt === q.correctAnswer) : 0,
          explanation: q.explanation || `The correct answer is ${q.correctAnswer}`
        }));
        
        // Ensure we get 20 questions by repeating if necessary
        let shuffled = convertedQuestions.sort(() => Math.random() - 0.5);

        // If we have fewer than 20 questions, repeat them to reach 20
        while (shuffled.length < 20) {
          const additionalQuestions = convertedQuestions
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(20 - shuffled.length, convertedQuestions.length));
          shuffled = [...shuffled, ...additionalQuestions];
        }

        // Take exactly 20 questions
        shuffled = shuffled.slice(0, 20);
        console.log('Final questions for SinglePlayer (should be 20):', shuffled.length);
        setQuestions(shuffled);
        setGameState('playing');
      } else {
        console.warn('Individual files failed, trying combined.json from your directory');
        
        try {
          // Try your combined.json file (3 KB file we saw in class6 folder)
          const response = await fetch(`/data/classes/${classParam}/combined.json`);
          if (response.ok) {
            const combinedData = await response.json();
            console.log('Loaded combined.json successfully:', combinedData);
            
            // Extract questions for the specific subject
            let subjectQuestions = [];
            if (combinedData[subjectParam]) {
              subjectQuestions = combinedData[subjectParam];
            } else if (combinedData.questions && combinedData.questions[subjectParam]) {
              subjectQuestions = combinedData.questions[subjectParam];
            } else {
              // Try to find any questions in the combined file
              subjectQuestions = Object.values(combinedData).flat().slice(0, 20);
            }
            
            if (subjectQuestions.length > 0) {
              const convertedQuestions = subjectQuestions.map((q, index) => ({
                question: q.text || q.question,
                options: q.options || [],
                correct: q.options ? q.options.findIndex(opt => opt === q.correctAnswer) : 0,
                explanation: q.explanation || `The correct answer is ${q.correctAnswer}`
              }));
              
              // Ensure exactly 20 questions
              let finalQuestions = convertedQuestions.sort(() => Math.random() - 0.5);
              while (finalQuestions.length < 20 && convertedQuestions.length > 0) {
                finalQuestions = [...finalQuestions, ...convertedQuestions.slice(0, 20 - finalQuestions.length)];
              }
              finalQuestions = finalQuestions.slice(0, 20);
              
              console.log('Using combined.json questions:', finalQuestions.length);
              setQuestions(finalQuestions);
              setGameState('playing');
              return;
            }
          }
        } catch (combinedError) {
          console.error('Combined.json also failed:', combinedError);
        }
        
        // Ultimate fallback
        console.warn('All file loading failed, using built-in fallback');
        const fallbackQuestions = getUltimateFallbackQuestions(subjectParam);
        console.log('Using ultimate fallback questions:', fallbackQuestions.length);
        setQuestions(fallbackQuestions);
        setGameState('playing');
      }
      
    } catch (error) {
      console.error('Error in loadQuestions:', error);
      setGameState('error');
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    if (showResult) return;
    
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionIndex === currentQ.correct;
    
    if (isCorrect) {
      setScore(score + 100);
      setStreak(streak + 1);
    } else {
      setStreak(0);
      setLives(lives - 1);
    }
    
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length && lives > (isCorrect ? 0 : 1)) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(-1);
        setShowResult(false);
      } else {
        setGameState('results');
      }
    }, 2500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setLives(3);
    setSelectedAnswer(-1);
    setShowResult(false);
    loadQuestions(selectedClass, selectedSubject, selectedChapter);
  };

  const formatSubjectName = (subject) => {
    return subject?.charAt(0).toUpperCase() + subject?.slice(1).replace('-', ' ');
  };

  const formatChapterName = (chapter) => {
    if (chapter === 'combined') return 'All Subjects';
    if (chapter === 'all-chapters') return 'All Chapters';
    return chapter?.charAt(0).toUpperCase() + chapter?.slice(1).replace(/-/g, ' ');
  };

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          Loading questions...
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ Error Loading Questions</div>
          <p className="text-white mb-6">Could not load questions for this topic</p>
          <button 
            onClick={() => navigate('/practice')} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const accuracy = questions.length > 0 ? ((score / 100) / questions.length * 100).toFixed(1) : 0;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Practice Complete!</h2>
          
          <div className="bg-white/20 rounded-xl p-4 mb-6">
            <h3 className="text-white font-bold mb-2">Your Results</h3>
            <p className="text-white text-xl">Score: {score}</p>
            <p className="text-white">Accuracy: {accuracy}%</p>
            <p className="text-white">Questions: {currentQuestion + 1}/{questions.length} (Target: 20)</p>
            <p className="text-white">Best Streak: {streak}</p>
          </div>
          
          <div className="bg-white/20 rounded-xl p-4 mb-6">
            <h3 className="text-white font-bold mb-2">Practice Session</h3>
            <p className="text-white/80 text-sm">Class: {selectedClass?.toUpperCase()}</p>
            <p className="text-white/80 text-sm">Subject: {formatSubjectName(selectedSubject)}</p>
            <p className="text-white/80 text-sm">Chapter: {formatChapterName(selectedChapter)}</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={restartQuiz} 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button 
              onClick={() => navigate('/practice')} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl"
            >
              Choose Different Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 flex justify-between items-center">
          <button 
            onClick={() => navigate('/practice')} 
            className="text-white flex items-center gap-2 hover:text-blue-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Practice
          </button>
          <div className="flex items-center gap-6 text-white">
            <div className="text-center">
              <div className="text-sm opacity-80">Score</div>
              <div className="font-bold text-lg">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Streak</div>
              <div className="font-bold text-lg">{streak} 🔥</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Lives</div>
              <div className="text-lg">{'❤️'.repeat(lives)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Progress</div>
              <div className="font-bold text-lg">{currentQuestion + 1}/{questions.length}</div>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6">
          <div className="text-white/80 text-center">
            <span className="font-semibold">{selectedClass?.toUpperCase()}</span>
            <span className="mx-2">•</span>
            <span className="font-semibold">{formatSubjectName(selectedSubject)}</span>
            <span className="mx-2">•</span>
            <span className="font-semibold">{formatChapterName(selectedChapter)}</span>
          </div>
        </div>

        {/* Question */}
        {questions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
            <div className="mb-4">
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                Question {currentQuestion + 1}
              </span>
            </div>
            <p className="text-white text-xl font-bold mb-6 leading-relaxed">
              {questions[currentQuestion].question}
            </p>
          </div>
        )}

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.length > 0 && questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`p-4 rounded-xl font-bold text-left transition-all duration-300 transform hover:scale-105 shadow-lg ${
                showResult
                  ? index === questions[currentQuestion].correct
                    ? 'bg-green-500 text-white'
                    : index === selectedAnswer
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white/60'
                  : selectedAnswer === index
                  ? 'bg-white/30 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span className="text-lg">{String.fromCharCode(65 + index)}.</span>
              <span className="ml-3 text-lg">{option}</span>
            </button>
          ))}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div className="mt-6 text-center">
            <div className={`text-4xl font-bold mb-2 ${
              selectedAnswer === questions[currentQuestion].correct ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedAnswer === questions[currentQuestion].correct ? '🎉 Correct!' : '❌ Wrong!'}
            </div>
            {questions[currentQuestion].explanation && (
              <div className="bg-white/10 rounded-xl p-4 mt-4">
                <p className="text-white/90 font-semibold mb-1">Explanation:</p>
                <p className="text-white/80">{questions[currentQuestion].explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePlayerQuiz;