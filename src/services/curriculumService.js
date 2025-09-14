import FileTestService from './FileTestService';

class CurriculumService {
  static async fetchQuestions(classId, subjectId, chapterId) {
    try {
      console.log('Fetching questions for:', { classId, subjectId, chapterId });
      
      // Use FileTestService to find the correct path and load actual JSON files
      console.log('🎯 Using FileTestService to find working path...');
      const result = await FileTestService.findWorkingPath(classId, subjectId, chapterId);
      
      if (result) {
        console.log('✅ FileTestService found working path:', result.path);
        const normalizedQuestions = this.normalizeQuestions(result.data);
        if (normalizedQuestions.length > 0) {
          return normalizedQuestions;
        }
            } else {
        console.log('❌ FileTestService could not find working path');
        throw new Error(`No valid JSON files found for ${classId}/${subjectId}/${chapterId}`);
      }
      
    } catch (error) {
      console.error('❌ All fetch attempts failed:', error);
      
      // Use comprehensive fallback
      return this.getFallbackQuestions(classId, subjectId, chapterId);
    }
  }

  static normalizeQuestions(data) {
    if (!data.questions || !Array.isArray(data.questions)) {
      console.error('Invalid question data structure:', data);
      return [];
    }

    console.log(`Processing ${data.questions.length} questions from curriculum`);
    
    return data.questions.map(q => {
      // CRITICAL FIX: Handle the correct field as INDEX, not text
      const correctAnswerText = q.options[q.correct];
      
      if (!correctAnswerText) {
        console.error('Invalid question structure:', q);
        return null;
      }

      return {
        id: q.id,
        text: q.question,
        options: q.options,
        correctAnswer: correctAnswerText, // Convert index to actual text
        correctIndex: q.correct, // Keep original index for reference
        explanation: q.explanation || `The correct answer is ${correctAnswerText}`,
        difficulty: q.difficulty || 'medium',
        points: q.points || 10,
        topic: q.topic || data.chapterInfo?.chapterName
      };
    }).filter(q => q !== null); // Remove any invalid questions
  }

  static getFallbackQuestions(classId, subjectId, chapterId) {
    // Comprehensive fallback database matching your exact file structure
    const fallbackData = {
      'mathematics': {
        'lines-and-angles': {
          "questions": [
            {
              "id": 1,
              "question": "A tiny dot that determines a precise location but has no length, breadth, or height is called a:",
              "options": ["Line", "Point", "Ray", "Plane"],
              "correct": 1,
              "explanation": "A point determines a precise location but has no dimensions like length, breadth, or height."
            },
            {
              "id": 2,
              "question": "What is the shortest path between two points called?",
              "options": ["A line", "A curve", "A ray", "A line segment"],
              "correct": 3,
              "explanation": "The shortest path from one point to another is called a line segment."
            },
            {
              "id": 3,
              "question": "An angle that measures exactly 90° is called a:",
              "options": ["Right angle", "Straight angle", "Acute angle", "Reflex angle"],
              "correct": 0,
              "explanation": "A right angle is exactly half of a straight angle and measures 90°."
            },
            {
              "id": 4,
              "question": "An angle that is less than 90° is known as an:",
              "options": ["Obtuse angle", "Right angle", "Straight angle", "Acute angle"],
              "correct": 3,
              "explanation": "Angles that are smaller than a right angle (less than 90°) are called acute angles."
            },
            {
              "id": 5,
              "question": "How many degrees are in a full turn or a complete circle?",
              "options": ["90°", "180°", "360°", "270°"],
              "correct": 2,
              "explanation": "A full turn is divided into 360 equal parts, where each part is one degree."
            }
          ]
        },
        'patterns-in-mathematics': {
          "questions": [
            {
              "id": 1,
              "question": "What comes next in the pattern: 2, 4, 6, 8, ?",
              "options": ["9", "10", "11", "12"],
              "correct": 1,
              "explanation": "This is an even number pattern, so 10 comes next"
            },
            {
              "id": 2,
              "question": "Complete the pattern: 1, 4, 7, 10, ?",
              "options": ["12", "13", "14", "15"],
              "correct": 1,
              "explanation": "Add 3 each time: 1+3=4, 4+3=7, 7+3=10, 10+3=13"
            },
            {
              "id": 3,
              "question": "What is the rule for this pattern: 5, 10, 15, 20?",
              "options": ["Add 5", "Multiply by 2", "Add 10", "Subtract 5"],
              "correct": 0,
              "explanation": "Each number increases by 5: 5+5=10, 10+5=15, 15+5=20"
            },
            {
              "id": 4,
              "question": "Find the next number: 3, 6, 9, 12, ?",
              "options": ["14", "15", "16", "18"],
              "correct": 1,
              "explanation": "This is the 3 times table: 3×5=15"
            },
            {
              "id": 5,
              "question": "What comes next: 1, 1, 2, 3, 5, 8, ?",
              "options": ["11", "13", "15", "16"],
              "correct": 1,
              "explanation": "This is the Fibonacci sequence: 5+8=13"
            }
          ]
        },
        'number-play': {
          "questions": [
            {
              "id": 1,
              "question": "What is the place value of 5 in the number 2,547?",
              "options": ["Units", "Tens", "Hundreds", "Thousands"],
              "correct": 2,
              "explanation": "The digit 5 is in the hundreds place in 2,547"
            },
            {
              "id": 2,
              "question": "Which is the largest 3-digit number?",
              "options": ["999", "1000", "998", "900"],
              "correct": 0,
              "explanation": "999 is the largest 3-digit number"
            },
            {
              "id": 3,
              "question": "What is 4,567 rounded to the nearest hundred?",
              "options": ["4,500", "4,600", "4,000", "5,000"],
              "correct": 1,
              "explanation": "4,567 rounds to 4,600 when rounded to the nearest hundred"
            },
            {
              "id": 4,
              "question": "How many thousands are in 25,000?",
              "options": ["2", "5", "25", "250"],
              "correct": 2,
              "explanation": "25,000 contains 25 thousands"
            },
            {
              "id": 5,
              "question": "What comes after 9,999?",
              "options": ["10,000", "9,998", "10,001", "1,000"],
              "correct": 0,
              "explanation": "After 9,999 comes 10,000"
            }
          ]
        },
        'fractions': {
          "questions": [
            {
              "id": 1,
              "question": "What fraction of this circle is shaded if half is colored?",
              "options": ["1/4", "1/2", "3/4", "1/3"],
              "correct": 1,
              "explanation": "Half of the circle means 1/2 is shaded"
            },
            {
              "id": 2,
              "question": "Which fraction is equivalent to 2/4?",
              "options": ["1/2", "1/4", "3/4", "2/3"],
              "correct": 0,
              "explanation": "2/4 = 1/2 when simplified"
            },
            {
              "id": 3,
              "question": "What is 1/3 + 1/3?",
              "options": ["1/6", "2/6", "2/3", "1/3"],
              "correct": 2,
              "explanation": "1/3 + 1/3 = 2/3"
            },
            {
              "id": 4,
              "question": "Which is larger: 1/2 or 1/4?",
              "options": ["1/4", "1/2", "They are equal", "Cannot tell"],
              "correct": 1,
              "explanation": "1/2 is larger than 1/4"
            },
            {
              "id": 5,
              "question": "How many quarters make one whole?",
              "options": ["2", "3", "4", "5"],
              "correct": 2,
              "explanation": "Four quarters (1/4 + 1/4 + 1/4 + 1/4) make one whole"
            }
          ]
        }
      },
      'science': {
        'wonderful-world-of-science': {
          "questions": [
            {
              "id": 1,
              "question": "Science helps us understand the world around us through:",
              "options": ["Observation", "Guessing", "Magic", "Stories"],
              "correct": 0,
              "explanation": "Science is based on careful observation and experimentation"
            },
            {
              "id": 2,
              "question": "What is the first step in the scientific method?",
              "options": ["Hypothesis", "Observation", "Experiment", "Conclusion"],
              "correct": 1,
              "explanation": "Observation is the first step in understanding any phenomenon"
            },
            {
              "id": 3,
              "question": "Which of the following is a scientific tool?",
              "options": ["Wand", "Microscope", "Crystal ball", "Fortune cookie"],
              "correct": 1,
              "explanation": "A microscope is a scientific instrument used for observation"
            },
            {
              "id": 4,
              "question": "What do scientists do when they want to test an idea?",
              "options": ["Guess", "Experiment", "Pray", "Ask friends"],
              "correct": 1,
              "explanation": "Scientists conduct experiments to test their ideas"
            },
            {
              "id": 5,
              "question": "Why is measurement important in science?",
              "options": ["To waste time", "To be accurate", "To confuse people", "To make things difficult"],
              "correct": 1,
              "explanation": "Accurate measurement is essential for reliable scientific results"
            }
          ]
        },
        'diversity-in-living-world': {
          "questions": [
            {
              "id": 1,
              "question": "Which of these is a living thing?",
              "options": ["Rock", "Tree", "Car", "Book"],
              "correct": 1,
              "explanation": "A tree is a living thing that grows, reproduces, and responds to its environment"
            },
            {
              "id": 2,
              "question": "What do all living things need to survive?",
              "options": ["Only water", "Only food", "Food and water", "Only air"],
              "correct": 2,
              "explanation": "All living things need both food and water to survive"
            },
            {
              "id": 3,
              "question": "How many legs does a spider have?",
              "options": ["6", "8", "10", "12"],
              "correct": 1,
              "explanation": "Spiders have 8 legs"
            },
            {
              "id": 4,
              "question": "Which animal is a mammal?",
              "options": ["Fish", "Bird", "Dog", "Butterfly"],
              "correct": 2,
              "explanation": "A dog is a mammal"
            },
            {
              "id": 5,
              "question": "What do plants produce during photosynthesis?",
              "options": ["Carbon dioxide", "Oxygen", "Nitrogen", "Water"],
              "correct": 1,
              "explanation": "Plants produce oxygen during photosynthesis"
            }
          ]
        }
      },
      'english': {
        'grammar': {
          "questions": [
            {
              "id": 1,
              "question": "What is the plural form of 'child'?",
              "options": ["Children", "Childs", "Childes", "Child"],
              "correct": 0,
              "explanation": "The plural of 'child' is 'children' - it's an irregular plural"
            },
            {
              "id": 2,
              "question": "Which is a noun?",
              "options": ["Run", "Happy", "Book", "Quickly"],
              "correct": 2,
              "explanation": "A book is a thing, so it's a noun"
            },
            {
              "id": 3,
              "question": "What type of word is 'beautiful'?",
              "options": ["Noun", "Verb", "Adjective", "Adverb"],
              "correct": 2,
              "explanation": "'Beautiful' describes something, so it's an adjective"
            },
            {
              "id": 4,
              "question": "Which sentence is correct?",
              "options": ["I are happy", "I am happy", "I is happy", "I be happy"],
              "correct": 1,
              "explanation": "'I am happy' uses the correct form of the verb 'to be'"
            },
            {
              "id": 5,
              "question": "What is the past tense of 'go'?",
              "options": ["Goed", "Gone", "Went", "Going"],
              "correct": 2,
              "explanation": "The past tense of 'go' is 'went'"
            }
          ]
        },
        'literature': {
          "questions": [
            {
              "id": 1,
              "question": "Who wrote 'Romeo and Juliet'?",
              "options": ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
              "correct": 0,
              "explanation": "William Shakespeare wrote the famous play 'Romeo and Juliet'"
            },
            {
              "id": 2,
              "question": "What is a story that teaches a lesson called?",
              "options": ["Biography", "Fable", "Dictionary", "Recipe"],
              "correct": 1,
              "explanation": "A fable is a story that teaches a moral lesson"
            },
            {
              "id": 3,
              "question": "What do we call the person who writes a book?",
              "options": ["Reader", "Author", "Character", "Publisher"],
              "correct": 1,
              "explanation": "An author is the person who writes a book"
            },
            {
              "id": 4,
              "question": "What is a poem that tells a story called?",
              "options": ["Haiku", "Limerick", "Narrative poem", "Sonnet"],
              "correct": 2,
              "explanation": "A narrative poem tells a story"
            },
            {
              "id": 5,
              "question": "In a story, what is the main character called?",
              "options": ["Villain", "Hero", "Protagonist", "Narrator"],
              "correct": 2,
              "explanation": "The main character in a story is called the protagonist"
            }
          ]
        }
      },
      'hindi': {
        'vyakaran': {
          "questions": [
            {
              "id": 1,
              "question": "'पुस्तक' का बहुवचन क्या है?",
              "options": ["पुस्तकें", "पुस्तकों", "पुस्तक", "पुस्तकएं"],
              "correct": 0,
              "explanation": "'पुस्तक' का बहुवचन 'पुस्तकें' होता है"
            },
            {
              "id": 2,
              "question": "'लड़का' का स्त्रीलिंग क्या है?",
              "options": ["लड़की", "लड़के", "लड़कों", "लड़का"],
              "correct": 0,
              "explanation": "'लड़का' का स्त्रीलिंग 'लड़की' होता है"
            },
            {
              "id": 3,
              "question": "कौन सा शब्द संज्ञा है?",
              "options": ["दौड़ना", "सुंदर", "मेज", "धीरे"],
              "correct": 2,
              "explanation": "'मेज' एक वस्तु है, इसलिए यह संज्ञा है"
            },
            {
              "id": 4,
              "question": "'खुश' का विपरीत शब्द क्या है?",
              "options": ["प्रसन्न", "दुखी", "हर्षित", "आनंदित"],
              "correct": 1,
              "explanation": "'खुश' का विपरीत शब्द 'दुखी' है"
            },
            {
              "id": 5,
              "question": "हिंदी वर्णमाला में कितने स्वर हैं?",
              "options": ["10", "11", "12", "13"],
              "correct": 1,
              "explanation": "हिंदी वर्णमाला में 11 स्वर हैं"
            }
          ]
        }
      },
      'social-science': {
        'oceans-and-continents': {
          "questions": [
            {
              "id": 1,
              "question": "How many continents are there on Earth?",
              "options": ["5", "6", "7", "8"],
              "correct": 2,
              "explanation": "There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia"
            },
            {
              "id": 2,
              "question": "Which is the largest continent?",
              "options": ["Africa", "Asia", "North America", "Europe"],
              "correct": 1,
              "explanation": "Asia is the largest continent"
            },
            {
              "id": 3,
              "question": "How many oceans are there?",
              "options": ["3", "4", "5", "6"],
              "correct": 2,
              "explanation": "There are 5 oceans: Pacific, Atlantic, Indian, Arctic, and Southern"
            },
            {
              "id": 4,
              "question": "Which ocean is the largest?",
              "options": ["Atlantic", "Pacific", "Indian", "Arctic"],
              "correct": 1,
              "explanation": "The Pacific Ocean is the largest ocean"
            },
            {
              "id": 5,
              "question": "On which continent is India located?",
              "options": ["Africa", "Europe", "Asia", "Australia"],
              "correct": 2,
              "explanation": "India is located on the continent of Asia"
            }
          ]
        }
      },
      'sanskrit': {
        'devanagari-parichay': {
          "questions": [
            {
              "id": 1,
              "question": "संस्कृत भाषा की लिपि कौन सी है?",
              "options": ["देवनागरी", "रोमन", "गुरुमुखी", "बंगाली"],
              "correct": 0,
              "explanation": "संस्कृत भाषा की लिपि देवनागरी है"
            },
            {
              "id": 2,
              "question": "देवनागरी लिपि में कितने स्वर हैं?",
              "options": ["10", "12", "14", "16"],
              "correct": 2,
              "explanation": "देवनागरी लिपि में 14 स्वर हैं"
            },
            {
              "id": 3,
              "question": "'अ' का मात्रा चिह्न क्या है?",
              "options": ["कोई नहीं", "ा", "ि", "ी"],
              "correct": 0,
              "explanation": "'अ' का कोई मात्रा चिह्न नहीं होता"
            },
            {
              "id": 4,
              "question": "'आ' की मात्रा का चिह्न क्या है?",
              "options": ["ा", "ि", "ी", "ु"],
              "correct": 0,
              "explanation": "'आ' की मात्रा का चिह्न 'ा' है"
            },
            {
              "id": 5,
              "question": "संस्कृत को किस भाषा की जननी कहा जाता है?",
              "options": ["अंग्रेजी", "हिंदी", "सभी भारतीय भाषाओं", "तमिल"],
              "correct": 2,
              "explanation": "संस्कृत को सभी भारतीय भाषाओं की जननी कहा जाता है"
            }
          ]
        }
      }
    };

    // Try to find questions for the specific chapter
    const chapterQuestions = fallbackData[subjectId]?.[chapterId]?.questions;
    if (chapterQuestions && chapterQuestions.length > 0) {
      console.log(`✅ Using fallback questions for ${subjectId}/${chapterId}:`, chapterQuestions.length);
      return this.normalizeQuestions({ questions: chapterQuestions });
    }

    // If specific chapter not found, try to find any questions for the subject
    const subjectData = fallbackData[subjectId];
    if (subjectData) {
      const allSubjectQuestions = [];
      Object.values(subjectData).forEach(chapterData => {
        if (chapterData.questions) {
          allSubjectQuestions.push(...chapterData.questions);
        }
      });
      
      if (allSubjectQuestions.length > 0) {
        console.log(`✅ Using mixed fallback questions for ${subjectId}:`, allSubjectQuestions.length);
        return this.normalizeQuestions({ questions: allSubjectQuestions });
      }
    }
    
    console.error(`❌ No fallback questions available for ${classId}/${subjectId}/${chapterId}`);
    return [];
  }

  static getHardcodedQuestions(classId, subjectId, chapterId) {
    // Wrapper for backwards compatibility
    return this.getFallbackQuestions(classId, subjectId, chapterId);
  }

  static async getAvailableChapters(classId, subjectId) {
    try {
      const response = await fetch(`/data/classes/class${classId}/${subjectId}/index.json`);
      if (response.ok) {
        const data = await response.json();
        return data.chapters || [];
      }
      
      // Fallback: return common chapter names based on subject (matching ChapterSelection.js)
      const commonChapters = {
        mathematics: [
          { id: 'all-chapters', name: 'All Chapters' },
          { id: 'patterns-in-mathematics', name: 'Patterns in Mathematics' },
          { id: 'lines-and-angles', name: 'Lines and Angles' },
          { id: 'number-play', name: 'Number Play' },
          { id: 'data-handling-and-presentation', name: 'Data Handling and Presentation' },
          { id: 'prime-time', name: 'Prime Time' },
          { id: 'perimeter-and-area', name: 'Perimeter and Area' },
          { id: 'fractions', name: 'Fractions' },
          { id: 'playing-with-constructions', name: 'Playing with Constructions' },
          { id: 'symmetry', name: 'Symmetry' },
          { id: 'the-other-side-of-zero', name: 'The Other Side of Zero' }
        ],
        science: [
          { id: 'all-chapters', name: 'All Chapters' },
          { id: 'wonderful-world-of-science', name: 'The Wonderful World of Science' },
          { id: 'diversity-in-living-world', name: 'Diversity in the Living World' },
          { id: 'mindful-eating', name: 'Mindful Eating: A Path to a Healthy Body' },
          { id: 'exploring-magnets', name: 'Exploring Magnets' },
          { id: 'measurement-length-motion', name: 'Measurement of Length and Motion' },
          { id: 'materials-around-us', name: 'Materials Around Us' },
          { id: 'temperature-measurement', name: 'Temperature and its Measurement' },
          { id: 'journey-through-states-water', name: 'A Journey through States of Water' },
          { id: 'methods-separation', name: 'Methods of Separation in Everyday Life' },
          { id: 'living-creatures', name: 'Living Creatures: Exploring their Characteristics' },
          { id: 'natures-treasures', name: "Nature's Treasures" },
          { id: 'beyond-earth', name: 'Beyond Earth' }
        ],
        'social-science': [
          { id: 'all-chapters', name: 'All Chapters' },
          { id: 'locating-places-on-earth', name: 'Locating Places on the Earth' },
          { id: 'oceans-and-continents', name: 'Oceans and Continents' },
          { id: 'landforms-and-life', name: 'Landforms and Life' },
          { id: 'timeline-and-sources-of-history', name: 'Timeline and Sources of History' },
          { id: 'india-that-is-bharat', name: 'India, That Is Bharat' },
          { id: 'beginnings-of-indian-civilisation', name: 'The Beginnings of Indian Civilisation' },
          { id: 'indias-cultural-roots', name: "India's Cultural Roots" },
          { id: 'unity-in-diversity', name: "Unity in Diversity, or 'Many in the One'" },
          { id: 'family-and-community', name: 'Family and Community' },
          { id: 'grassroots-democracy-part1-governance', name: 'Grassroots Democracy — Part 1: Governance' },
          { id: 'grassroots-democracy-part2-rural', name: 'Grassroots Democracy — Part 2: Local Government in Rural Areas' },
          { id: 'grassroots-democracy-part3-urban', name: 'Grassroots Democracy — Part 3: Local Government in Urban' },
          { id: 'value-of-work', name: 'The Value of Work' },
          { id: 'economic-activities-around-us', name: 'Economic Activities Around Us' }
        ],
        english: [
          { id: 'combined', name: 'Combined' },
          { id: 'grammar', name: 'Grammar' },
          { id: 'literature', name: 'Literature' }
        ],
        hindi: [
          { id: 'combined', name: 'संयुक्त (Combined)' },
          { id: 'gadya', name: 'गद्य (Prose)' },
          { id: 'kavya', name: 'काव्य (Poetry)' },
          { id: 'vyakaran', name: 'व्याकरण (Grammar)' }
        ],
        sanskrit: [
          { id: 'combined', name: 'संयुक्त (Combined)' },
          { id: 'devanagari-parichay', name: 'देवनागरी परिचय (Devanagari Introduction)' },
          { id: 'saral-shlok', name: 'सरल श्लोक (Simple Shlokas)' },
          { id: 'vyakaran-aadhar', name: 'व्याकरण आधार (Grammar Foundation)' }
        ]
      };
      
      return commonChapters[subjectId] || [{ id: 'all-chapters', name: 'All Chapters' }];
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [{ id: 'all-chapters', name: 'All Chapters' }];
    }
  }

  static async validateCurriculumSelection(classId, subjectId, chapterId) {
    const questions = await this.fetchQuestions(classId, subjectId, chapterId);
    return {
      isValid: questions.length > 0,
      questionCount: questions.length,
      questions
    };
  }
}

export default CurriculumService;