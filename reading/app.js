// Main Application Logic for Hebrew Reading Practice App

class ReadingApp {
  constructor() {
    this.apiHandler = null;
    this.quizManager = new QuizManager();
    this.scienceGenerator = null;
    this.currentMode = 'reading'; // 'reading' or 'science'
    this.currentState = 'init'; // init, config, ready, loading, answering, results

    this.initializeApp();
  }

  /**
   * Initialize the application
   */
  initializeApp() {
    // Check for stored API key
    const storedKey = localStorage.getItem(CONFIG.STORAGE_KEYS.apiKey);
    const storedProvider = localStorage.getItem(CONFIG.STORAGE_KEYS.apiProvider) || CONFIG.API_PROVIDERS.OPENROUTER;

    // Pre-configure OpenRouter API key if not already set
    if (!storedKey || storedKey.trim().length === 0) {
      const defaultKey = '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';
      localStorage.setItem(CONFIG.STORAGE_KEYS.apiKey, defaultKey);
      localStorage.setItem(CONFIG.STORAGE_KEYS.apiProvider, CONFIG.API_PROVIDERS.OPENROUTER);

      // Initialize API handler with default key
      this.apiHandler = new APIHandler(defaultKey, CONFIG.API_PROVIDERS.OPENROUTER);
      this.scienceGenerator = new ScienceGenerator(this.apiHandler);
      this.setState('ready');
      this.showMenu();
    } else if (storedKey && storedKey.trim().length > 0) {
      // API key exists, initialize handler and show menu
      this.apiHandler = new APIHandler(storedKey, storedProvider);
      this.scienceGenerator = new ScienceGenerator(this.apiHandler);
      this.setState('ready');
      this.showMenu();
    } else {
      // No API key, show configuration
      this.setState('config');
      this.showConfigInterface();
    }

    this.attachEventListeners();
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Menu navigation
    const menuReadingBtn = document.getElementById('menuReading');
    if (menuReadingBtn) {
      menuReadingBtn.addEventListener('click', () => this.switchToReading());
    }

    const menuScienceBtn = document.getElementById('menuScience');
    if (menuScienceBtn) {
      menuScienceBtn.addEventListener('click', () => this.switchToScience());
    }

    // Back to menu buttons
    const backToMenuFromReading = document.getElementById('backToMenuFromReading');
    if (backToMenuFromReading) {
      backToMenuFromReading.addEventListener('click', () => this.backToMenu());
    }

    const backToMenuFromScience = document.getElementById('backToMenuFromScience');
    if (backToMenuFromScience) {
      backToMenuFromScience.addEventListener('click', () => this.backToMenu());
    }

    // Menu settings button
    const menuSettingsBtn = document.getElementById('menuSettingsButton');
    if (menuSettingsBtn) {
      menuSettingsBtn.addEventListener('click', () => this.showSettings());
    }

    // API Key submission
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    if (saveApiKeyBtn) {
      saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
    }

    // API Key input - allow Enter key
    const apiKeyInput = document.getElementById('apiKeyInput');
    if (apiKeyInput) {
      apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.saveApiKey();
        }
      });
    }

    // Generate new text
    const generateBtn = document.getElementById('generateText');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateNewText());
    }

    // Submit answers
    const submitBtn = document.getElementById('submitAnswers');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitAnswers());
    }

    // Settings buttons
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.showSettings());
    }

    const scienceSettingsBtn = document.getElementById('scienceSettingsButton');
    if (scienceSettingsBtn) {
      scienceSettingsBtn.addEventListener('click', () => this.showSettings());
    }

    // Close settings
    const closeSettingsBtn = document.getElementById('closeSettings');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => this.hideSettings());
    }

    // Clear API key
    const clearApiKeyBtn = document.getElementById('clearApiKey');
    if (clearApiKeyBtn) {
      clearApiKeyBtn.addEventListener('click', () => this.clearApiKey());
    }

    // Science section event listeners
    const generateScienceBtn = document.getElementById('generateScience');
    if (generateScienceBtn) {
      generateScienceBtn.addEventListener('click', () => this.generateScienceArticle());
    }

    const submitScienceBtn = document.getElementById('submitScienceAnswers');
    if (submitScienceBtn) {
      submitScienceBtn.addEventListener('click', () => this.submitScienceAnswers());
    }

    // Allow Enter key in age input
    const ageInput = document.getElementById('userAge');
    if (ageInput) {
      ageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.generateScienceArticle();
        }
      });
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.closeModals();
      }
    });
  }

  /**
   * Save API key to localStorage
   */
  saveApiKey() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
      this.showError('אנא הכנס מפתח API');
      return;
    }

    // Save to localStorage
    localStorage.setItem(CONFIG.STORAGE_KEYS.apiKey, apiKey);
    localStorage.setItem(CONFIG.STORAGE_KEYS.apiProvider, CONFIG.API_PROVIDERS.OPENROUTER);

    // Initialize API handler and science generator
    this.apiHandler = new APIHandler(apiKey, CONFIG.API_PROVIDERS.OPENROUTER);
    this.scienceGenerator = new ScienceGenerator(this.apiHandler);

    // Hide config and show menu
    this.setState('ready');
    this.hideConfigInterface();
    this.showMenu();
  }

  /**
   * Clear stored API key
   */
  clearApiKey() {
    if (confirm('האם אתה בטוח שברצונך למחוק את מפתח ה-API?')) {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.apiKey);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.apiProvider);
      this.apiHandler = null;
      this.scienceGenerator = null;
      this.hideSettings();
      this.setState('config');
      this.showConfigInterface();

      // Hide menu and all content
      this.hideMenu();
      const mainContent = document.getElementById('mainContent');
      if (mainContent) {
        mainContent.style.display = 'none';
      }
      const scienceContent = document.getElementById('scienceContent');
      if (scienceContent) {
        scienceContent.style.display = 'none';
      }
    }
  }

  /**
   * Generate new reading text and questions
   */
  async generateNewText() {
    if (!this.apiHandler) {
      this.showError('מפתח API חסר. אנא הגדר מפתח תחילה.');
      return;
    }

    this.setState('loading');
    this.showLoading(CONFIG.UI_MESSAGES.loading);

    // Disable generate button
    const generateBtn = document.getElementById('generateText');
    if (generateBtn) {
      generateBtn.disabled = true;
    }

    try {
      const quizData = await this.apiHandler.generateContent();
      this.quizManager.loadQuiz(quizData);
      this.displayQuiz();
      this.setState('answering');
      this.hideLoading();
    } catch (error) {
      console.error('Error generating content:', error);
      this.showError(error.message);
      this.setState('ready');
      this.hideLoading();
    } finally {
      // Re-enable generate button
      if (generateBtn) {
        generateBtn.disabled = false;
      }
    }
  }

  /**
   * Display the quiz (text and questions)
   */
  displayQuiz() {
    const quiz = this.quizManager.getCurrentQuiz();
    if (!quiz) return;

    // Display title
    const titleElement = document.getElementById('textTitle');
    if (titleElement) {
      titleElement.textContent = quiz.title;
    }

    // Display text
    const textElement = document.getElementById('readingText');
    if (textElement) {
      textElement.textContent = quiz.text;
    }

    // Display questions
    const questionsContainer = document.getElementById('questionsContainer');
    if (questionsContainer) {
      questionsContainer.innerHTML = '';

      quiz.questions.forEach((question, qIdx) => {
        const questionElement = this.createQuestionElement(question, qIdx);
        questionsContainer.appendChild(questionElement);
      });
    }

    // Reset submit button
    this.resetSubmitButton();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Create HTML element for a question
   * @param {Object} question - Question data
   * @param {number} questionIndex - Question index
   * @returns {HTMLElement} Question element
   */
  createQuestionElement(question, questionIndex) {
    const div = document.createElement('div');
    div.className = 'question';

    const questionText = document.createElement('div');
    questionText.className = 'question-text';

    const questionNumber = document.createElement('span');
    questionNumber.className = 'question-number';
    questionNumber.textContent = questionIndex + 1;

    const questionContent = document.createTextNode(' ' + question.question);

    questionText.appendChild(questionNumber);
    questionText.appendChild(questionContent);
    div.appendChild(questionText);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    question.options.forEach((option, optIdx) => {
      const label = document.createElement('label');
      label.className = 'option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question${questionIndex}`;
      radio.value = optIdx;
      radio.dataset.question = questionIndex;
      radio.addEventListener('change', (e) => this.handleAnswerSelection(e));

      const optionLabel = document.createElement('span');
      optionLabel.className = 'option-label';
      optionLabel.textContent = CONFIG.HEBREW_LETTERS[optIdx] + '.';

      const optionText = document.createElement('span');
      optionText.className = 'option-text';
      optionText.textContent = option;

      label.appendChild(radio);
      label.appendChild(optionLabel);
      label.appendChild(optionText);
      optionsDiv.appendChild(label);
    });

    div.appendChild(optionsDiv);
    return div;
  }

  /**
   * Handle answer selection
   * @param {Event} event - Change event
   */
  handleAnswerSelection(event) {
    const questionIndex = parseInt(event.target.dataset.question);
    const answerIndex = parseInt(event.target.value);

    this.quizManager.recordAnswer(questionIndex, answerIndex);

    // Update submit button state
    this.updateSubmitButton();
  }

  /**
   * Update submit button enabled/disabled state
   */
  updateSubmitButton() {
    const submitBtn = document.getElementById('submitAnswers');
    if (submitBtn) {
      submitBtn.disabled = !this.quizManager.isQuizComplete();

      // Update button text to show progress
      const answeredCount = this.quizManager.getAnsweredCount();
      const totalCount = CONFIG.QUIZ_SETTINGS.questionsPerText;

      if (answeredCount === totalCount) {
        submitBtn.textContent = 'שלח תשובות';
      } else {
        submitBtn.textContent = `נענו ${answeredCount} מתוך ${totalCount}`;
      }
    }
  }

  /**
   * Reset submit button to initial state
   */
  resetSubmitButton() {
    const submitBtn = document.getElementById('submitAnswers');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'שלח תשובות';
    }
  }

  /**
   * Submit answers and show results
   */
  submitAnswers() {
    if (!this.quizManager.isQuizComplete()) {
      this.showError('אנא ענה על כל השאלות לפני שליחה');
      return;
    }

    const results = this.quizManager.getResults();
    this.displayResults(results);
    this.setState('results');
  }

  /**
   * Display quiz results
   * @param {Object} results - Results object
   */
  displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) return;

    const resultsHTML = `
      <div class="modal-content results-content">
        <h2>תוצאות</h2>
        <div class="score-display">${results.score}/${results.total}</div>
        <div class="percentage">${results.percentage}%</div>
        <div class="message">${results.message}</div>

        <div class="detailed-results">
          ${results.details.map((detail) => `
            <div class="result-item ${detail.isCorrect ? 'correct' : 'incorrect'}">
              <div class="result-question">
                <strong>${detail.questionNumber}.</strong> ${detail.question}
              </div>
              <div class="result-answer">
                ${detail.isCorrect
                  ? `<span class="correct-mark">✓</span> התשובה שלך נכונה: ${detail.userAnswer}`
                  : `<span class="wrong-mark">✗</span> התשובה שלך: ${detail.userAnswer}<br>
                     <span class="correct-answer">התשובה הנכונה: ${detail.correctAnswer}</span>`
                }
              </div>
            </div>
          `).join('')}
        </div>

        <button id="tryAgainBtn" class="button button-success">
          נסה טקסט חדש
        </button>
        <button id="closeResultsBtn" class="button button-secondary">
          סגור
        </button>
      </div>
    `;

    resultsContainer.innerHTML = resultsHTML;
    resultsContainer.classList.add('visible');

    // Attach event listeners for results buttons
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) {
      tryAgainBtn.addEventListener('click', () => {
        this.closeResults();
        this.generateNewText();
      });
    }

    const closeResultsBtn = document.getElementById('closeResultsBtn');
    if (closeResultsBtn) {
      closeResultsBtn.addEventListener('click', () => this.closeResults());
    }
  }

  /**
   * Close results modal
   */
  closeResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
      resultsContainer.classList.remove('visible');
    }
    this.setState('ready');
  }

  /**
   * Show settings modal
   */
  showSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.classList.add('visible');
    }
  }

  /**
   * Hide settings modal
   */
  hideSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.classList.remove('visible');
    }
  }

  /**
   * Close all modals
   */
  closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (modal.id !== 'configContainer') {
        modal.classList.remove('visible');
      }
    });
  }

  /**
   * Show configuration interface
   */
  showConfigInterface() {
    const configContainer = document.getElementById('configContainer');
    if (configContainer) {
      configContainer.classList.add('visible');
    }
  }

  /**
   * Hide configuration interface
   */
  hideConfigInterface() {
    const configContainer = document.getElementById('configContainer');
    if (configContainer) {
      configContainer.classList.remove('visible');
    }
  }

  /**
   * Show main interface
   */
  showMainInterface() {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.style.display = 'block';
    }
  }

  /**
   * Show menu
   */
  showMenu() {
    const menu = document.getElementById('mainMenu');
    if (menu) {
      menu.style.display = 'block';
    }
  }

  /**
   * Hide menu
   */
  hideMenu() {
    const menu = document.getElementById('mainMenu');
    if (menu) {
      menu.style.display = 'none';
    }
  }

  /**
   * Set application state
   * @param {string} state - New state
   */
  setState(state) {
    this.currentState = state;
    document.body.dataset.state = state;
  }

  /**
   * Show loading overlay
   * @param {string} message - Loading message
   */
  showLoading(message) {
    const loadingContainer = document.getElementById('loadingContainer');
    const loadingMessage = document.getElementById('loadingMessage');

    if (loadingMessage) {
      loadingMessage.textContent = message;
    }

    if (loadingContainer) {
      loadingContainer.classList.add('visible');
    }
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    const loadingContainer = document.getElementById('loadingContainer');
    if (loadingContainer) {
      loadingContainer.classList.remove('visible');
    }
  }

  /**
   * Show error notification
   * @param {string} message - Error message
   */
  showError(message) {
    // Create error notification element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    // Remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  /**
   * Switch to reading mode
   */
  switchToReading() {
    this.currentMode = 'reading';

    // Hide menu, show reading content
    this.hideMenu();
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('scienceContent').style.display = 'none';

    // Close any open modals
    this.closeModals();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Switch to science enrichment mode
   */
  switchToScience() {
    this.currentMode = 'science';

    // Hide menu, show science content
    this.hideMenu();
    document.getElementById('scienceContent').style.display = 'block';
    document.getElementById('mainContent').style.display = 'none';

    // Close any open modals
    this.closeModals();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Go back to main menu
   */
  backToMenu() {
    // Show menu, hide all content
    this.showMenu();
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('scienceContent').style.display = 'none';

    // Close any open modals
    this.closeModals();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Generate science article based on user age
   */
  async generateScienceArticle() {
    const ageInput = document.getElementById('userAge');
    const age = parseInt(ageInput.value);

    // Validate age
    if (!age || age < 6 || age > 18) {
      this.showError('אנא הכנס גיל תקין (6-18)');
      return;
    }

    if (!this.scienceGenerator) {
      this.showError('מפתח API חסר. אנא הגדר מפתח תחילה.');
      return;
    }

    this.setState('loading');
    this.showLoading('מייצר מאמר מדעי...');

    // Disable generate button
    const generateBtn = document.getElementById('generateScience');
    if (generateBtn) {
      generateBtn.disabled = true;
    }

    try {
      const scienceData = await this.scienceGenerator.generateScienceContent(age);
      this.scienceGenerator.loadQuiz(scienceData);
      this.displayScienceQuiz();
      this.setState('answering');
      this.hideLoading();
    } catch (error) {
      console.error('Error generating science content:', error);
      this.showError(error.message);
      this.setState('ready');
      this.hideLoading();
    } finally {
      // Re-enable generate button
      if (generateBtn) {
        generateBtn.disabled = false;
      }
    }
  }

  /**
   * Display science quiz (article and questions)
   */
  displayScienceQuiz() {
    const quiz = this.scienceGenerator.getCurrentQuiz();
    if (!quiz) return;

    // Display title
    const titleElement = document.getElementById('scienceTitle');
    if (titleElement) {
      titleElement.textContent = quiz.title;
    }

    // Display article text
    const textElement = document.getElementById('scienceText');
    if (textElement) {
      textElement.textContent = quiz.text;
    }

    // Show sections
    document.getElementById('scienceTextSection').style.display = 'block';
    document.getElementById('scienceQuestionsSection').style.display = 'block';

    // Display questions
    const questionsContainer = document.getElementById('scienceQuestionsContainer');
    if (questionsContainer) {
      questionsContainer.innerHTML = '';

      quiz.questions.forEach((question, qIdx) => {
        const questionElement = this.createScienceQuestionElement(question, qIdx);
        questionsContainer.appendChild(questionElement);
      });
    }

    // Reset submit button
    this.resetScienceSubmitButton();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Create HTML element for a science question
   * @param {Object} question - Question data
   * @param {number} questionIndex - Question index
   * @returns {HTMLElement} Question element
   */
  createScienceQuestionElement(question, questionIndex) {
    const div = document.createElement('div');
    div.className = 'question';

    const questionText = document.createElement('div');
    questionText.className = 'question-text';

    const questionNumber = document.createElement('span');
    questionNumber.className = 'question-number';
    questionNumber.textContent = questionIndex + 1;

    const questionContent = document.createTextNode(' ' + question.question);

    questionText.appendChild(questionNumber);
    questionText.appendChild(questionContent);
    div.appendChild(questionText);

    // Check question type
    if (question.type === 'typed') {
      // Create text input for typed answer
      const inputDiv = document.createElement('div');
      inputDiv.className = 'typed-answer-container';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'typed-answer-input';
      input.placeholder = 'הקלד את תשובתך כאן...';
      input.dataset.question = questionIndex;
      input.addEventListener('input', (e) => this.handleTypedAnswerInput(e));

      inputDiv.appendChild(input);
      div.appendChild(inputDiv);
    } else {
      // Create multiple choice options
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'options';

      question.options.forEach((option, optIdx) => {
        const label = document.createElement('label');
        label.className = 'option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `scienceQuestion${questionIndex}`;
        radio.value = optIdx;
        radio.dataset.question = questionIndex;
        radio.addEventListener('change', (e) => this.handleScienceAnswerSelection(e));

        const optionLabel = document.createElement('span');
        optionLabel.className = 'option-label';
        optionLabel.textContent = CONFIG.HEBREW_LETTERS[optIdx] + '.';

        const optionText = document.createElement('span');
        optionText.className = 'option-text';
        optionText.textContent = option;

        label.appendChild(radio);
        label.appendChild(optionLabel);
        label.appendChild(optionText);
        optionsDiv.appendChild(label);
      });

      div.appendChild(optionsDiv);
    }

    return div;
  }

  /**
   * Handle science answer selection
   * @param {Event} event - Change event
   */
  handleScienceAnswerSelection(event) {
    const questionIndex = parseInt(event.target.dataset.question);
    const answerIndex = parseInt(event.target.value);

    this.scienceGenerator.recordAnswer(questionIndex, answerIndex);

    // Update submit button state
    this.updateScienceSubmitButton();
  }

  /**
   * Handle typed answer input
   * @param {Event} event - Input event
   */
  handleTypedAnswerInput(event) {
    const questionIndex = parseInt(event.target.dataset.question);
    const answer = event.target.value.trim();

    if (answer.length > 0) {
      this.scienceGenerator.recordAnswer(questionIndex, answer);
    } else {
      // Remove answer if input is empty
      delete this.scienceGenerator.userAnswers[questionIndex];
    }

    // Update submit button state
    this.updateScienceSubmitButton();
  }

  /**
   * Update science submit button state
   */
  updateScienceSubmitButton() {
    const submitBtn = document.getElementById('submitScienceAnswers');
    if (submitBtn) {
      submitBtn.disabled = !this.scienceGenerator.isQuizComplete();

      // Update button text to show progress
      const answeredCount = this.scienceGenerator.getAnsweredCount();
      const totalCount = CONFIG.SCIENCE_QUIZ_SETTINGS.questionsPerArticle;

      if (answeredCount === totalCount) {
        submitBtn.textContent = 'שלח תשובות';
      } else {
        submitBtn.textContent = `נענו ${answeredCount} מתוך ${totalCount}`;
      }
    }
  }

  /**
   * Reset science submit button
   */
  resetScienceSubmitButton() {
    const submitBtn = document.getElementById('submitScienceAnswers');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'שלח תשובות';
    }
  }

  /**
   * Submit science answers and show results
   */
  async submitScienceAnswers() {
    if (!this.scienceGenerator.isQuizComplete()) {
      this.showError('אנא ענה על כל השאלות לפני שליחה');
      return;
    }

    // Show loading for AI checking
    this.setState('loading');
    this.showLoading('בודק תשובות...');

    try {
      const results = await this.getScienceResultsWithAICheck();
      this.displayResults(results);
      this.setState('results');
    } catch (error) {
      console.error('Error checking answers:', error);
      this.showError(error.message);
      this.setState('answering');
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Get science results with AI checking for typed answers
   * @returns {Promise<Object>} Results object
   */
  async getScienceResultsWithAICheck() {
    const quiz = this.scienceGenerator.getCurrentQuiz();
    const userAnswers = this.scienceGenerator.userAnswers;
    let correctCount = 0;
    const details = [];

    // Process each question
    for (let index = 0; index < quiz.questions.length; index++) {
      const question = quiz.questions[index];
      const userAnswer = userAnswers[index];
      let isCorrect = false;
      let correctAnswerText = '';
      let userAnswerText = '';

      if (question.type === 'typed') {
        // Check typed answer using AI
        try {
          const aiResult = await this.apiHandler.checkTypedAnswer(
            question.question,
            userAnswer,
            question.correctAnswer,
            question.acceptableAnswers || [],
            quiz.text
          );

          isCorrect = aiResult.isCorrect;
          correctAnswerText = question.correctAnswer;
          userAnswerText = userAnswer;
        } catch (error) {
          console.error('AI check error:', error);
          // Fallback to simple string comparison
          isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          correctAnswerText = question.correctAnswer;
          userAnswerText = userAnswer;
        }
      } else {
        // Multiple choice - standard checking
        isCorrect = userAnswer === question.correctIndex;
        correctAnswerText = question.options[question.correctIndex];
        userAnswerText = question.options[userAnswer];
      }

      if (isCorrect) {
        correctCount++;
      }

      details.push({
        questionNumber: index + 1,
        question: question.question,
        userAnswer: userAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect: isCorrect
      });
    }

    const total = quiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const message = this.scienceGenerator.getEncouragementMessage(percentage);

    return {
      score: correctCount,
      total: total,
      percentage: percentage,
      message: message,
      details: details
    };
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ReadingApp();
});
