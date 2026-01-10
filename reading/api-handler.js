// API Handler for Hebrew Reading Practice App
// Manages communication with Anthropic Claude API

class APIHandler {
  constructor(apiKey, provider = 'anthropic') {
    this.apiKey = apiKey;
    this.provider = provider;
    this.config = CONFIG.API_CONFIG[provider];
  }

  /**
   * Generate reading content with questions
   * @param {string} topic - Optional topic for the reading passage
   * @returns {Promise<Object>} Quiz data with text and questions
   */
  async generateContent(topic = null) {
    try {
      const prompt = this.buildPrompt(topic);
      const response = await this.makeAPICall(prompt);
      const parsedContent = this.parseResponse(response);

      // Validate content structure
      if (!this.validateContent(parsedContent)) {
        throw new Error(CONFIG.UI_MESSAGES.errors.invalidContent);
      }

      return parsedContent;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build the prompt for content generation
   * @param {string} topic - Topic for the reading passage
   * @returns {string} Complete prompt
   */
  buildPrompt(topic) {
    const selectedTopic = topic || this.getRandomTopic();

    return `אתה מורה לעברית לכיתות ד'-ה'. צור קטע קריאה מעניין ומאתגר ושאלות הבנה.

דרישות לקטע הקריאה:
1. אורך: 180-220 מילים
2. רמת קושי: מתאים לילדים בכיתות ד'-ה' (גילאי 9-11)
3. נושא: ${selectedTopic}
4. משפטים מגוונים (10-16 מילים למשפט, כולל משפטים מורכבים)
5. אוצר מילים עשיר ומגוון - השתמש במילים מתקדמות יותר ובביטויים ספרוטיים
6. תוכן מעניין וחינוכי עם עומק רעיוני
7. ללא נקודות (כתיב חסר) - כמו בספרי לימוד לכיתות ד'-ה'
8. הטקסט צריך להיות קוהרנטי עם עלילה מורכבת או מסר עמוק

דרישות לשאלות:
1. בדיוק 5 שאלות הבנה מאתגרות
2. כל שאלה עם 4 אפשרויות תשובה
3. תשובה אחת נכונה בלבד
4. שאלות שבודקות:
   - הבנת הנקרא ברמה גבוהה (2 שאלות)
   - זכירת פרטים ספציפיים (1 שאלה)
   - הסקת מסקנות ומשמעויות (2 שאלות)
5. אפשרויות התשובה צריכות להיות מאתגרות ולא ברורות מיד
6. כל האפשרויות צריכות להיות באורך דומה ולהיראות סבירות

החזר את התשובה בפורמט JSON הבא בדיוק:
{
  "text": "הטקסט המלא כאן...",
  "title": "כותרת קצרה לטקסט",
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
   * Get random topic from the topics list
   * @returns {string} Random topic
   */
  getRandomTopic() {
    const topics = CONFIG.TOPICS;
    return topics[Math.floor(Math.random() * topics.length)];
  }

  /**
   * Make API call based on provider
   * @param {string} prompt - The prompt to send
   * @returns {Promise<Object>} API response
   */
  async makeAPICall(prompt) {
    if (this.provider === 'anthropic') {
      return await this.callAnthropicAPI(prompt);
    } else if (this.provider === 'openrouter') {
      return await this.callOpenRouterAPI(prompt);
    } else {
      return await this.callOpenAIAPI(prompt);
    }
  }

  /**
   * Call Anthropic Claude API
   * @param {string} prompt - The prompt to send
   * @returns {Promise<Object>} API response
   */
  async callAnthropicAPI(prompt) {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': this.config.version
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Call OpenAI API
   * @param {string} prompt - The prompt to send
   * @returns {Promise<Object>} API response
   */
  async callOpenAIAPI(prompt) {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Call OpenRouter API
   * @param {string} prompt - The prompt to send
   * @returns {Promise<Object>} API response
   */
  async callOpenRouterAPI(prompt) {
    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Hebrew Reading Practice'
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Parse API response and extract JSON content
   * @param {Object} response - API response
   * @returns {Object} Parsed content
   */
  parseResponse(response) {
    let content;

    // Extract content based on provider
    if (this.provider === 'anthropic') {
      content = response.content[0].text;
    } else if (this.provider === 'openrouter' || this.provider === 'openai') {
      content = response.choices[0].message.content;
    } else {
      content = response.choices[0].message.content;
    }

    // Try to extract JSON if wrapped in markdown code blocks
    const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }

    // Try to parse JSON
    try {
      return JSON.parse(content);
    } catch (error) {
      // If parsing fails, try to find JSON object in the content
      const objectMatch = content.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        try {
          return JSON.parse(objectMatch[0]);
        } catch (e) {
          throw new Error(CONFIG.UI_MESSAGES.errors.parseError);
        }
      }
      throw new Error(CONFIG.UI_MESSAGES.errors.parseError);
    }
  }

  /**
   * Validate the generated content structure
   * @param {Object} content - Parsed content
   * @returns {boolean} True if valid
   */
  validateContent(content) {
    // Check if content has required fields
    if (!content.text || !content.title || !content.questions) {
      return false;
    }

    // Check if there are exactly 5 questions
    if (!Array.isArray(content.questions) || content.questions.length !== 5) {
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
      if (!Array.isArray(question.options) || question.options.length !== 4) {
        return false;
      }

      // Check if correctIndex is valid (0-3)
      if (question.correctIndex < 0 || question.correctIndex > 3) {
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
   * Handle API errors and return user-friendly messages
   * @param {Error} error - The error object
   * @returns {Error} User-friendly error
   */
  handleError(error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('401') || errorMessage.includes('unauthorized') || errorMessage.includes('invalid api key')) {
      return new Error(CONFIG.UI_MESSAGES.errors.invalidApiKey);
    } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return new Error(CONFIG.UI_MESSAGES.errors.tooManyRequests);
    } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return new Error(CONFIG.UI_MESSAGES.errors.networkError);
    } else if (errorMessage.includes(CONFIG.UI_MESSAGES.errors.parseError.toLowerCase())) {
      return new Error(CONFIG.UI_MESSAGES.errors.parseError);
    } else if (errorMessage.includes(CONFIG.UI_MESSAGES.errors.invalidContent.toLowerCase())) {
      return new Error(CONFIG.UI_MESSAGES.errors.invalidContent);
    } else {
      return new Error(`${CONFIG.UI_MESSAGES.errors.generalError}\n${error.message}`);
    }
  }
}
