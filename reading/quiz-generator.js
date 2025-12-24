// Quiz Manager for Hebrew Reading Practice App
// Handles quiz logic, validation, scoring, and results

class QuizManager {
  constructor() {
    this.currentQuiz = null;
    this.userAnswers = [];
    this.score = 0;
  }

  /**
   * Load a new quiz
   * @param {Object} quizData - Quiz data with text and questions
   */
  loadQuiz(quizData) {
    this.validateQuizData(quizData);
    this.currentQuiz = quizData;
    this.userAnswers = new Array(CONFIG.QUIZ_SETTINGS.questionsPerText).fill(null);
    this.score = 0;
  }

  /**
   * Validate quiz data structure
   * @param {Object} data - Quiz data to validate
   * @throws {Error} If validation fails
   */
  validateQuizData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('מבנה שאלון לא תקין');
    }

    if (!data.text || typeof data.text !== 'string' || data.text.trim().length === 0) {
      throw new Error('טקסט הקריאה חסר או לא תקין');
    }

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      throw new Error('כותרת חסרה או לא תקינה');
    }

    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error('שאלות חסרות או לא תקינות');
    }

    if (data.questions.length !== CONFIG.QUIZ_SETTINGS.questionsPerText) {
      throw new Error(`חייב להיות בדיוק ${CONFIG.QUIZ_SETTINGS.questionsPerText} שאלות`);
    }

    // Validate each question
    data.questions.forEach((question, idx) => {
      this.validateQuestion(question, idx);
    });
  }

  /**
   * Validate a single question
   * @param {Object} question - Question to validate
   * @param {number} idx - Question index
   * @throws {Error} If validation fails
   */
  validateQuestion(question, idx) {
    const questionNum = idx + 1;

    if (!question.question || typeof question.question !== 'string' || question.question.trim().length === 0) {
      throw new Error(`שאלה ${questionNum} לא תקינה`);
    }

    if (!question.options || !Array.isArray(question.options)) {
      throw new Error(`אפשרויות תשובה חסרות בשאלה ${questionNum}`);
    }

    if (question.options.length !== CONFIG.QUIZ_SETTINGS.optionsPerQuestion) {
      throw new Error(`שאלה ${questionNum} חייבת להכיל ${CONFIG.QUIZ_SETTINGS.optionsPerQuestion} אפשרויות`);
    }

    // Check that all options are non-empty strings
    question.options.forEach((option, optIdx) => {
      if (typeof option !== 'string' || option.trim().length === 0) {
        throw new Error(`אפשרות ${optIdx + 1} בשאלה ${questionNum} לא תקינה`);
      }
    });

    if (typeof question.correctIndex !== 'number') {
      throw new Error(`אינדקס תשובה נכונה חסר בשאלה ${questionNum}`);
    }

    if (question.correctIndex < 0 || question.correctIndex >= CONFIG.QUIZ_SETTINGS.optionsPerQuestion) {
      throw new Error(`אינדקס תשובה נכונה לא תקין בשאלה ${questionNum}`);
    }
  }

  /**
   * Record user's answer to a question
   * @param {number} questionIndex - Index of the question (0-4)
   * @param {number} answerIndex - Index of the selected answer (0-3)
   */
  recordAnswer(questionIndex, answerIndex) {
    if (questionIndex < 0 || questionIndex >= CONFIG.QUIZ_SETTINGS.questionsPerText) {
      throw new Error('מספר שאלה לא תקין');
    }

    if (answerIndex < 0 || answerIndex >= CONFIG.QUIZ_SETTINGS.optionsPerQuestion) {
      throw new Error('מספר תשובה לא תקין');
    }

    this.userAnswers[questionIndex] = answerIndex;
  }

  /**
   * Check if all questions have been answered
   * @returns {boolean} True if quiz is complete
   */
  isQuizComplete() {
    return this.userAnswers.every(answer => answer !== null);
  }

  /**
   * Calculate the score
   * @returns {number} Number of correct answers
   */
  calculateScore() {
    if (!this.currentQuiz) {
      return 0;
    }

    this.score = 0;
    this.userAnswers.forEach((answer, idx) => {
      if (answer !== null && answer === this.currentQuiz.questions[idx].correctIndex) {
        this.score++;
      }
    });

    return this.score;
  }

  /**
   * Get complete results with details
   * @returns {Object} Results object
   */
  getResults() {
    const score = this.calculateScore();
    const total = CONFIG.QUIZ_SETTINGS.questionsPerText;
    const percentage = Math.round((score / total) * 100);

    return {
      score: score,
      total: total,
      percentage: percentage,
      message: this.getEncouragementMessage(percentage),
      details: this.getDetailedResults()
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

    // Return random message from the appropriate category
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Get detailed results for each question
   * @returns {Array} Array of result objects
   */
  getDetailedResults() {
    if (!this.currentQuiz) {
      return [];
    }

    return this.currentQuiz.questions.map((question, idx) => {
      const userAnswerIndex = this.userAnswers[idx];
      const isCorrect = userAnswerIndex === question.correctIndex;

      return {
        questionNumber: idx + 1,
        question: question.question,
        userAnswerIndex: userAnswerIndex,
        userAnswer: userAnswerIndex !== null ? question.options[userAnswerIndex] : 'לא נענה',
        correctAnswerIndex: question.correctIndex,
        correctAnswer: question.options[question.correctIndex],
        isCorrect: isCorrect,
        allOptions: question.options
      };
    });
  }

  /**
   * Reset the quiz manager
   */
  reset() {
    this.currentQuiz = null;
    this.userAnswers = [];
    this.score = 0;
  }

  /**
   * Get current quiz data
   * @returns {Object|null} Current quiz or null
   */
  getCurrentQuiz() {
    return this.currentQuiz;
  }

  /**
   * Get user answers
   * @returns {Array} User answers array
   */
  getUserAnswers() {
    return [...this.userAnswers];
  }

  /**
   * Check if a specific question has been answered
   * @param {number} questionIndex - Index of the question
   * @returns {boolean} True if answered
   */
  isQuestionAnswered(questionIndex) {
    if (questionIndex < 0 || questionIndex >= this.userAnswers.length) {
      return false;
    }
    return this.userAnswers[questionIndex] !== null;
  }

  /**
   * Get number of answered questions
   * @returns {number} Count of answered questions
   */
  getAnsweredCount() {
    return this.userAnswers.filter(answer => answer !== null).length;
  }
}
