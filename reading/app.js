// Main Application Logic for Hebrew Reading Practice App

class ReadingApp {
  constructor() {
    this.apiHandler = null;
    this.quizManager = new QuizManager();
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
      this.setState('ready');
      this.showMainInterface();
    } else if (storedKey && storedKey.trim().length > 0) {
      // API key exists, initialize handler and show main interface
      this.apiHandler = new APIHandler(storedKey, storedProvider);
      this.setState('ready');
      this.showMainInterface();
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

    // Settings button
    const settingsBtn = document.getElementById('settingsButton');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.showSettings());
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

    // Initialize API handler
    this.apiHandler = new APIHandler(apiKey, CONFIG.API_PROVIDERS.OPENROUTER);

    // Hide config and show main interface
    this.setState('ready');
    this.hideConfigInterface();
    this.showMainInterface();

    // Generate first text automatically
    this.generateNewText();
  }

  /**
   * Clear stored API key
   */
  clearApiKey() {
    if (confirm('האם אתה בטוח שברצונך למחוק את מפתח ה-API?')) {
      localStorage.removeItem(CONFIG.STORAGE_KEYS.apiKey);
      localStorage.removeItem(CONFIG.STORAGE_KEYS.apiProvider);
      this.apiHandler = null;
      this.hideSettings();
      this.setState('config');
      this.showConfigInterface();

      // Hide main content
      const mainContent = document.getElementById('mainContent');
      if (mainContent) {
        mainContent.style.display = 'none';
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ReadingApp();
});
