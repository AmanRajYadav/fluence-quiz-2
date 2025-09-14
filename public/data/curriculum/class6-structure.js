export const CLASS_6_STRUCTURE = {
  classInfo: {
    id: 6,
    name: "Class 6",
    description: "Foundation level with comprehensive NCERT curriculum",
    isActive: true
  },
  subjects: {
    mathematics: {
      id: "mathematics",
      name: "Mathematics",
      icon: "🔢",
      color: "bg-blue-500",
      chapters: [
        {
          id: "all-chapters",
          name: "All Chapters",
          description: "Random questions from all chapters",
          icon: "🎯",
          isSpecial: true
        },
        {
          id: "patterns-in-mathematics",
          chapterNumber: 1,
          name: "Patterns in Mathematics",
          description: "Understanding patterns and sequences",
          topics: ["Number Patterns", "Shape Patterns", "Growing Patterns"]
        },
        {
          id: "lines-and-angles",
          chapterNumber: 2,
          name: "Lines and Angles",
          description: "Basic geometry concepts",
          topics: ["Lines", "Angles", "Parallel Lines", "Intersecting Lines"]
        },
        {
          id: "number-play",
          chapterNumber: 3,
          name: "Number Play",
          description: "Fun with numbers and operations",
          topics: ["Large Numbers", "Number Games", "Estimation"]
        },
        {
          id: "data-handling-and-presentation",
          chapterNumber: 4,
          name: "Data Handling and Presentation",
          description: "Organizing and presenting data",
          topics: ["Tables", "Pictographs", "Bar Graphs"]
        },
        {
          id: "prime-time",
          chapterNumber: 5,
          name: "Prime Time",
          description: "Prime numbers and factors",
          topics: ["Prime Numbers", "Composite Numbers", "Factors", "Multiples"]
        },
        {
          id: "perimeter-and-area",
          chapterNumber: 6,
          name: "Perimeter and Area",
          description: "Measuring boundaries and surfaces",
          topics: ["Perimeter", "Area", "Rectangle", "Square"]
        },
        {
          id: "fractions",
          chapterNumber: 7,
          name: "Fractions",
          description: "Understanding parts of a whole",
          topics: ["Proper Fractions", "Improper Fractions", "Mixed Numbers"]
        },
        {
          id: "playing-with-constructions",
          chapterNumber: 8,
          name: "Playing with Constructions",
          description: "Geometric constructions",
          topics: ["Circle", "Constructions", "Compass", "Ruler"]
        },
        {
          id: "symmetry",
          chapterNumber: 9,
          name: "Symmetry",
          description: "Line symmetry and patterns",
          topics: ["Line Symmetry", "Symmetric Figures", "Mirror Images"]
        },
        {
          id: "the-other-side-of-zero",
          chapterNumber: 10,
          name: "The Other Side of Zero",
          description: "Introduction to negative numbers",
          topics: ["Negative Numbers", "Number Line", "Integers"]
        }
      ]
    },
    science: {
      id: "science",
      name: "Science",
      icon: "🔬",
      color: "bg-green-500",
      chapters: [
        {
          id: "all-chapters",
          name: "All Chapters",
          description: "Random questions from all chapters",
          icon: "🎯",
          isSpecial: true
        },
        {
          id: "wonderful-world-of-science",
          chapterNumber: 1,
          name: "The Wonderful World of Science",
          description: "Introduction to scientific thinking",
          topics: ["Scientific Method", "Observation", "Curiosity"]
        },
        {
          id: "diversity-in-living-world",
          chapterNumber: 2,
          name: "Diversity in the Living World",
          description: "Classification of living organisms",
          topics: ["Plants", "Animals", "Classification", "Habitat"]
        },
        {
          id: "mindful-eating",
          chapterNumber: 3,
          name: "Mindful Eating: A Path to a Healthy Body",
          description: "Nutrition and healthy eating habits",
          topics: ["Nutrients", "Balanced Diet", "Food Groups"]
        },
        {
          id: "exploring-magnets",
          chapterNumber: 4,
          name: "Exploring Magnets",
          description: "Properties and uses of magnets",
          topics: ["Magnetic Materials", "Poles", "Magnetic Field"]
        },
        {
          id: "measurement-length-motion",
          chapterNumber: 5,
          name: "Measurement of Length and Motion",
          description: "Units and measurement concepts",
          topics: ["Length", "Motion", "Units", "Measurement Tools"]
        },
        {
          id: "materials-around-us",
          chapterNumber: 6,
          name: "Materials Around Us",
          description: "Properties of different materials",
          topics: ["Metals", "Non-metals", "Properties", "Uses"]
        }
      ]
    },
    "social-science": {
      id: "social-science",
      name: "Social Science",
      icon: "🌍",
      color: "bg-orange-500",
      themes: [
        {
          id: "all-themes",
          name: "All Themes",
          description: "Random questions from all themes",
          icon: "🎯",
          isSpecial: true
        },
        {
          id: "theme-a-land-and-people",
          themeLetter: "A",
          name: "India and the World: Land and the People",
          description: "Geography and people of India",
          chapters: ["Locating Places on the Earth", "Globe: Latitudes and Longitudes", "Motions of the Earth"]
        },
        {
          id: "theme-b-tapestry-past",
          themeLetter: "B",
          name: "Tapestry of the Past",
          description: "Historical perspectives",
          chapters: ["What, Where, How and When?", "From Gathering to Growing Food", "In the Earliest Cities"]
        },
        {
          id: "theme-c-cultural-heritage",
          themeLetter: "C",
          name: "Our Cultural Heritage and Knowledge",
          description: "Culture and traditions",
          chapters: ["What Books and Burials Tell Us", "Kingdoms, Kings and an Early Republic"]
        }
      ]
    },
    english: {
      id: "english",
      name: "English",
      icon: "📖",
      color: "bg-purple-500",
      categories: [
        {
          id: "combined",
          name: "Combined",
          description: "Grammar and Literature mixed",
          icon: "🎯",
          isSpecial: true
        },
        {
          id: "grammar",
          name: "Grammar",
          description: "Parts of speech, tenses, sentence structure",
          topics: ["Nouns", "Verbs", "Adjectives", "Tenses", "Sentence Types"]
        },
        {
          id: "literature",
          name: "Literature",
          description: "Stories, poems, and comprehension",
          topics: ["Short Stories", "Poems", "Reading Comprehension", "Vocabulary"]
        }
      ]
    },
    hindi: {
      id: "hindi",
      name: "Hindi",
      icon: "🇮🇳",
      color: "bg-red-500",
      categories: [
        {
          id: "combined",
          name: "संयुक्त (Combined)",
          description: "व्याकरण और साहित्य मिश्रित",
          icon: "🎯",
          isSpecial: true
        },
        {
          id: "vyakaran",
          name: "व्याकरण (Grammar)",
          description: "हिंदी व्याकरण के नियम",
          topics: ["संज्ञा", "सर्वनाम", "विशेषण", "क्रिया", "वाक्य"]
        },
        {
          id: "gadya",
          name: "गद्य (Prose)",
          description: "कहानियां और निबंध",
          topics: ["कहानी", "निबंध", "संवाद"]
        },
        {
          id: "kavya",
          name: "काव्य (Poetry)",
          description: "कविताएं और छंद",
          topics: ["कविता", "छंद", "रस"]
        }
      ]
    },
    sanskrit: {
      id: "sanskrit",
      name: "Sanskrit",
      icon: "🕉️",
      color: "bg-yellow-500",
      categories: [
        {
          id: "combined",
          name: "संयुक्त (Combined)",
          description: "सभी विषयों का मिश्रण",
          icon: "🎯",
          isSpecial: true
        },
        {
          id: "devanagari-parichay",
          name: "देवनागरी परिचय",
          description: "Script introduction and basics",
          topics: ["अक्षर", "मात्रा", "संयुक्ताक्षर"]
        },
        {
          id: "saral-shlok",
          name: "सरल श्लोक",
          description: "Simple verses and mantras",
          topics: ["श्लोक", "मंत्र", "स्तोत्र"]
        },
        {
          id: "vyakaran-aadhar",
          name: "व्याकरण आधार",
          description: "Basic grammar concepts",
          topics: ["धातु", "प्रत्यय", "संधि"]
        }
      ]
    }
  },
  combined: {
    id: "combined",
    name: "Combined (All Subjects)",
    description: "Mixed questions from all 6 subjects",
    icon: "🎯",
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  }
};

export const PLACEHOLDER_CLASSES = [
  {
    id: 7,
    name: "Class 7",
    description: "Coming Soon - Advanced concepts building on Class 6",
    isActive: false,
    subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"]
  },
  {
    id: 8,
    name: "Class 8",
    description: "Coming Soon - Intermediate level curriculum",
    isActive: false,
    subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"]
  },
  {
    id: 9,
    name: "Class 9",
    description: "Coming Soon - Secondary education foundation",
    isActive: false,
    subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"]
  },
  {
    id: 10,
    name: "Class 10",
    description: "Coming Soon - Board examination preparation",
    isActive: false,
    subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"]
  }
];

export const getAllClasses = () => {
  return [CLASS_6_STRUCTURE.classInfo, ...PLACEHOLDER_CLASSES];
};

export const getClassStructure = (classId) => {
  if (classId === 6) {
    return CLASS_6_STRUCTURE;
  }
  return PLACEHOLDER_CLASSES.find(cls => cls.id === classId);
};