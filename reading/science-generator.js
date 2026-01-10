// Science Enrichment Generator for Hebrew Learning App
// Generates age-appropriate science articles in Hebrew with quiz questions

class ScienceGenerator {
  constructor(apiHandler) {
    this.apiHandler = apiHandler;
    this.currentQuiz = null;
    this.userAnswers = {};
  }

  /**
   * Generate science article based on user age
   * @param {number} age - User's age
   * @returns {Promise<Object>} Science quiz data with article and questions
   */
  async generateScienceContent(age) {
    try {
      const prompt = this.buildSciencePrompt(age);
      const response = await this.makeAPICall(prompt);
      const parsedContent = this.parseResponse(response);

      // Validate content structure
      if (!this.validateScienceContent(parsedContent)) {
        throw new Error(CONFIG.UI_MESSAGES.errors.invalidContent);
      }

      this.currentQuiz = parsedContent;
      return parsedContent;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build the prompt for science article generation
   * @param {number} age - User's age
   * @returns {string} Complete prompt
   */
  buildSciencePrompt(age) {
    const selectedTopic = this.getRandomScienceTopic();
    const gradeLevel = this.getGradeFromAge(age);

    return `אתה מורה למדעים המתמחה בהעשרה מדעית לילדים. צור מאמר מדעי מעניין ומדויק עובדתית בעברית ושאלות אמריקאיות (בחירה מרובה).

דרישות למאמר המדעי:
1. אורך: ${CONFIG.SCIENCE_QUIZ_SETTINGS.minWordCount}-${CONFIG.SCIENCE_QUIZ_SETTINGS.maxWordCount} מילים
2. רמת קושי: מתאים לגיל ${age} (כיתה ${gradeLevel})
3. נושא: ${selectedTopic}
4. **חשוב מאוד: כל המידע חייב להיות מדויק ועובדתי מבחינה מדעית**
5. הסבר תופעות מדעיות באופן ברור ומעניין
6. השתמש במושגים מדעיים מתאימים לגיל
7. ללא נקודות (כתיב חסר)
8. הוסף עובדות מעניינות ודוגמאות מהחיים
9. הטקסט צריך להיות חינוכי ולעורר סקרנות מדעית

דרישות לשאלות אמריקאיות:
1. בדיוק ${CONFIG.SCIENCE_QUIZ_SETTINGS.questionsPerArticle} שאלות סגורות (אמריקאיות)
2. כל שאלה עם ${CONFIG.SCIENCE_QUIZ_SETTINGS.optionsPerQuestion} אפשרויות תשובה
3. תשובה אחת נכונה בלבד
4. שאלות שבודקות:
   - הבנת תופעות מדעיות (2 שאלות)
   - זכירת עובדות מדעיות (2 שאלות)
   - הסקת מסקנות מדעיות (1 שאלה)
5. **כל התשובות חייבות להיות מדויקות מדעית**
6. אפשרויות התשובה השגויות צריכות להיות סבירות אך ברור שגויות
7. כל האפשרויות צריכות להיות באורך דומה

החזר את התשובה בפורמט JSON הבא בדיוק:
{
  "text": "המאמר המדעי המלא כאן...",
  "title": "כותרת מעניינת למאמר",
  "questions": [
    {
      "question": "השאלה?",
      "options": ["תשובה 1", "תשובה 2", "תשובה 3", "תשובה 4"],
      "correctIndex": 0
    }
  ]
}

חשוב מאוד: החזר רק את ה-JSON, ללא טקסט נוסף לפני או אחרי.`;
  }

  /**
   * Get random science topic
   * @returns {string} Random science topic
   */
  getRandomScienceTopic() {
    const topics = CONFIG.SCIENCE_TOPICS;
    return topics[Math.floor(Math.random() * topics.length)];
  }

  /**
   * Convert age to grade level (Hebrew)
   * @param {number} age - User's age
   * @returns {string} Grade level in Hebrew
   */
  getGradeFromAge(age) {
    const gradeMap = {
      6: 'א\'',
      7: 'ב\'',
      8: 'ג\'',
      9: 'ד\'',
      10: 'ה\'',
      11: 'ו\'',
      12: 'ז\'',
      13: 'ח\'',
      14: 'ט\'',
      15: 'י\'',
      16: 'י"א',
      17: 'י"ב',
      18: 'י"ב'
    };
    return gradeMap[age] || 'ד\'-ה\'';
  }

  /**
   * Make API call using the API handler
   * @param {string} prompt - The prompt to send
   * @returns {Promise<Object>} API response
   */
  async makeAPICall(prompt) {
    if (this.apiHandler.provider === 'anthropic') {
      return await this.apiHandler.callAnthropicAPI(prompt);
    } else if (this.apiHandler.provider === 'openrouter') {
      return await this.apiHandler.callOpenRouterAPI(prompt);
    } else {
      return await this.apiHandler.callOpenAIAPI(prompt);
    }
  }

  /**
   * Parse API response
   * @param {Object} response - API response
   * @returns {Object} Parsed content
   */
  parseResponse(response) {
    return this.apiHandler.parseResponse(response);
  }

  /**
   * Validate science content structure
   * @param {Object} content - Parsed content
   * @returns {boolean} True if valid
   */
  validateScienceContent(content) {
    // Check if content has required fields
    if (!content.text || !content.title || !content.questions) {
      return false;
    }

    // Check if there are exactly 5 questions
    if (!Array.isArray(content.questions) ||
        content.questions.length !== CONFIG.SCIENCE_QUIZ_SETTINGS.questionsPerArticle) {
      return false;
    }

    // Validate each question
    for (let i = 0; i < content.questions.length; i++) {
      const question = content.questions[i];

      // Check question structure
      if (!question.question || !question.options || typeof question.correctIndex !== 'number') {
        return false;
      }

      // Check if there are exactly 4 options
      if (!Array.isArray(question.options) ||
          question.options.length !== CONFIG.SCIENCE_QUIZ_SETTINGS.optionsPerQuestion) {
        return false;
      }

      // Check if correctIndex is valid (0-3)
      if (question.correctIndex < 0 ||
          question.correctIndex >= CONFIG.SCIENCE_QUIZ_SETTINGS.optionsPerQuestion) {
        return false;
      }

      // Check if all options are non-empty strings
      if (!question.options.every(opt => typeof opt === 'string' && opt.trim().length > 0)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Load quiz data
   * @param {Object} quizData - Quiz data to load
   */
  loadQuiz(quizData) {
    this.currentQuiz = quizData;
    this.userAnswers = {};
  }

  /**
   * Get current quiz
   * @returns {Object} Current quiz data
   */
  getCurrentQuiz() {
    return this.currentQuiz;
  }

  /**
   * Record user answer
   * @param {number} questionIndex - Question index
   * @param {number} answerIndex - Selected answer index
   */
  recordAnswer(questionIndex, answerIndex) {
    this.userAnswers[questionIndex] = answerIndex;
  }

  /**
   * Check if quiz is complete
   * @returns {boolean} True if all questions answered
   */
  isQuizComplete() {
    if (!this.currentQuiz) return false;
    const totalQuestions = this.currentQuiz.questions.length;
    return Object.keys(this.userAnswers).length === totalQuestions;
  }

  /**
   * Get number of answered questions
   * @returns {number} Count of answered questions
   */
  getAnsweredCount() {
    return Object.keys(this.userAnswers).length;
  }

  /**
   * Calculate results
   * @returns {Object} Results with score, percentage, and details
   */
  getResults() {
    if (!this.currentQuiz) return null;

    const questions = this.currentQuiz.questions;
    let correctCount = 0;
    const details = [];

    questions.forEach((question, index) => {
      const userAnswerIndex = this.userAnswers[index];
      const isCorrect = userAnswerIndex === question.correctIndex;

      if (isCorrect) {
        correctCount++;
      }

      details.push({
        questionNumber: index + 1,
        question: question.question,
        userAnswer: question.options[userAnswerIndex],
        correctAnswer: question.options[question.correctIndex],
        isCorrect: isCorrect
      });
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const message = this.getEncouragementMessage(percentage);

    return {
      score: correctCount,
      total: total,
      percentage: percentage,
      message: message,
      details: details
    };
  }

  /**
   * Get encouragement message based on score
   * @param {number} percentage - Score percentage
   * @returns {string} Encouragement message
   */
  getEncouragementMessage(percentage) {
    let messages;

    if (percentage === 100) {
      messages = CONFIG.ENCOURAGEMENT_MESSAGES.perfect;
    } else if (percentage >= 80) {
      messages = CONFIG.ENCOURAGEMENT_MESSAGES.good;
    } else if (percentage >= 60) {
      messages = CONFIG.ENCOURAGEMENT_MESSAGES.okay;
    } else {
      messages = CONFIG.ENCOURAGEMENT_MESSAGES.needsWork;
    }

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Handle errors
   * @param {Error} error - The error object
   * @returns {Error} User-friendly error
   */
  handleError(error) {
    return this.apiHandler.handleError(error);
  }
}
