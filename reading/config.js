// Configuration and Constants for Hebrew Reading Practice App

const CONFIG = {
  // API Provider Options
  API_PROVIDERS: {
    ANTHROPIC: 'anthropic',
    OPENAI: 'openai',
    OPENROUTER: 'openrouter'
  },

  // Grade Level Settings
  GRADE_LEVEL: {
    hebrew: 'כיתה ג\'',
    number: 3,
    ageRange: '8-9'
  },

  // Quiz Configuration
  QUIZ_SETTINGS: {
    questionsPerText: 5,
    optionsPerQuestion: 4,
    minWordCount: 120,
    maxWordCount: 150
  },

  // Hebrew Letters for Options (א, ב, ג, ד)
  HEBREW_LETTERS: ['א', 'ב', 'ג', 'ד', 'ה'],

  // Topics for Reading Passages
  TOPICS: [
    'בעלי חיים',      // Animals
    'משפחה',          // Family
    'בית ספר',        // School
    'טבע',            // Nature
    'הרפתקאות',       // Adventures
    'חברות',          // Friendship
    'ספורט',          // Sports
    'מדע פשוט',       // Simple Science
    'חגים',           // Holidays
    'אוכל',           // Food
    'מזג אוויר',      // Weather
    'צמחים'           // Plants
  ],

  // Encouragement Messages Based on Score
  ENCOURAGEMENT_MESSAGES: {
    perfect: [
      'מצוין!',
      'כל הכבוד!',
      'פנטסטי!',
      'מושלם!',
      'יופי של עבודה!'
    ],
    good: [
      'עבודה טובה!',
      'יפה מאוד!',
      'כמעט מושלם!',
      'ממש יפה!',
      'עבודה מעולה!'
    ],
    okay: [
      'לא רע!',
      'אפשר להשתפר!',
      'עבודה סבירה',
      'כיוון טוב!',
      'בדרך הנכונה'
    ],
    needsWork: [
      'כדאי לנסות שוב',
      'בואו ננסה עוד פעם',
      'אל תוותרו!',
      'נמשיך לתרגל',
      'בפעם הבאה יהיה יותר טוב'
    ]
  },

  // Storage Keys for localStorage
  STORAGE_KEYS: {
    apiKey: 'hebrewReadingApp_apiKey',
    apiProvider: 'hebrewReadingApp_provider'
  },

  // API Configuration
  API_CONFIG: {
    anthropic: {
      endpoint: 'https://api.anthropic.com/v1/messages',
      model: 'claude-3-5-sonnet-20241022',
      version: '2023-06-01',
      maxTokens: 2000
    },
    openai: {
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.7
    },
    openrouter: {
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'anthropic/claude-3.5-sonnet',
      maxTokens: 2000,
      temperature: 0.7
    }
  },

  // UI Messages
  UI_MESSAGES: {
    loading: 'מייצר טקסט חדש...',
    apiKeyWarning: 'מפתח זה נשמר במחשב שלך בלבד',
    apiKeyPlaceholder: 'הכנס את מפתח ה-API כאן',
    errors: {
      invalidApiKey: 'מפתח API לא תקין. אנא בדוק את ההגדרות.',
      tooManyRequests: 'יותר מדי בקשות. אנא נסה שוב בעוד כמה רגעים.',
      networkError: 'בעיית חיבור לאינטרנט. אנא בדוק את החיבור.',
      parseError: 'לא הצלחנו לפענח את התוכן שנוצר',
      invalidContent: 'התוכן שנוצר אינו תקין',
      generalError: 'אירעה שגיאה. אנא נסה שוב.'
    }
  }
};
