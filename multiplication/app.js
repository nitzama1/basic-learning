// Question tracking system with spaced repetition
class QuestionTracker {
    constructor(maxNumber = 12) {
        this.maxNumber = maxNumber;
        this.questions = this.initializeQuestions();
        this.loadProgress();
    }

    initializeQuestions() {
        const questions = [];
        for (let i = 1; i <= this.maxNumber; i++) {
            for (let j = 1; j <= this.maxNumber; j++) {
                questions.push({
                    num1: i,
                    num2: j,
                    answer: i * j,
                    correctCount: 0,
                    wrongCount: 0,
                    lastAsked: 0,
                    weight: 10 // Higher weight = more likely to appear
                });
            }
        }
        return questions;
    }

    updateRange(maxNumber) {
        this.maxNumber = maxNumber;
        const oldQuestions = this.questions;
        this.questions = this.initializeQuestions();

        // Preserve progress for questions in the new range
        this.questions.forEach(newQ => {
            const oldQ = oldQuestions.find(
                q => q.num1 === newQ.num1 && q.num2 === newQ.num2
            );
            if (oldQ) {
                newQ.correctCount = oldQ.correctCount;
                newQ.wrongCount = oldQ.wrongCount;
                newQ.lastAsked = oldQ.lastAsked;
                newQ.weight = oldQ.weight;
            }
        });
    }

    recordAnswer(question, isCorrect) {
        if (isCorrect) {
            question.correctCount++;
            question.weight = Math.max(1, question.weight - 2); // Reduce frequency

            // If answered correctly 5 times, significantly reduce weight
            if (question.correctCount >= 5) {
                question.weight = Math.max(0.5, question.weight * 0.5);
            }
        } else {
            question.wrongCount++;
            question.weight = Math.min(20, question.weight + 5); // Increase frequency
        }

        question.lastAsked = Date.now();
        this.saveProgress();
    }

    getNextQuestion() {
        // Weighted random selection based on performance
        const now = Date.now();
        const weights = this.questions.map(q => {
            let weight = q.weight;

            // Increase weight if not asked recently
            const timeSinceAsked = now - q.lastAsked;
            if (timeSinceAsked > 60000) { // 1 minute
                weight *= 1.5;
            }

            return weight;
        });

        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < this.questions.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return this.createQuestionVariant(this.questions[i]);
            }
        }

        return this.createQuestionVariant(this.questions[0]);
    }

    createQuestionVariant(baseQuestion) {
        // Randomly choose between multiplication or division (50/50)
        const isDivision = Math.random() < 0.5;

        if (isDivision) {
            // For division, we can create two variants from multiplication:
            // If multiplication is: num1 × num2 = answer
            // Division can be: answer ÷ num1 = num2 OR answer ÷ num2 = num1
            const divideByFirst = Math.random() < 0.5;

            return {
                ...baseQuestion,
                isDivision: true,
                displayNum1: baseQuestion.answer,  // The product
                displayNum2: divideByFirst ? baseQuestion.num1 : baseQuestion.num2,  // What we divide by
                displayAnswer: divideByFirst ? baseQuestion.num2 : baseQuestion.num1  // The result
            };
        } else {
            // Regular multiplication
            return {
                ...baseQuestion,
                isDivision: false,
                displayNum1: baseQuestion.num1,
                displayNum2: baseQuestion.num2,
                displayAnswer: baseQuestion.answer
            };
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('multiplicationProgress', JSON.stringify(this.questions));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('multiplicationProgress');
            if (saved) {
                const savedQuestions = JSON.parse(saved);
                // Only load if the range matches
                if (savedQuestions.length === this.questions.length) {
                    this.questions = savedQuestions;
                }
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
    }

    resetProgress() {
        this.questions = this.initializeQuestions();
        localStorage.removeItem('multiplicationProgress');
    }
}

// Game Controller
class MultiplicationGame {
    constructor() {
        const savedRange = this.loadRangeSetting();
        this.tracker = new QuestionTracker(savedRange);
        this.score = 0;
        this.streak = 0;
        this.questionCount = 0; // Number of questions answered in current session
        this.totalTimeSpent = 0; // Total accumulated time in seconds
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.isPlaying = false;
        this.timeStarted = 0;
        this.timerInterval = null;
        this.soundEnabled = true;
        this.typeAnswerMode = this.loadTypeAnswerSetting();

        this.initElements();
        this.applySavedRange(savedRange);
        this.initEventListeners();
        this.initSounds();
        this.loadSessionProgress(); // Load saved progress
    }

    initElements() {
        this.questionEl = document.getElementById('question');
        this.answersContainer = document.getElementById('answers-container');
        this.answerBtns = document.querySelectorAll('.answer-btn');
        this.typeAnswerContainer = document.getElementById('type-answer-container');
        this.answerInput = document.getElementById('answer-input');
        this.submitAnswerBtn = document.getElementById('submit-answer-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.scoreEl = document.getElementById('score');
        this.streakEl = document.getElementById('streak');
        this.questionCountEl = document.getElementById('question-count');
        this.timerEl = document.getElementById('timer');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.soundToggle = document.getElementById('sound-toggle');
        this.typeAnswerToggle = document.getElementById('type-answer-toggle');
        this.rangeSelect = document.getElementById('range-select');
        this.languageToggle = document.getElementById('language-toggle');

        // Recall elements
        this.recallContainer = document.getElementById('recall-container');
        this.recallNum1 = document.getElementById('recall-num1');
        this.recallNum2 = document.getElementById('recall-num2');
        this.recallAnswer = document.getElementById('recall-answer');
        this.recallOperator = document.getElementById('recall-operator');
        this.recallSubmitBtn = document.getElementById('recall-submit-btn');
        this.recallFeedback = document.getElementById('recall-feedback');

        // Visualization elements
        this.vizStep1 = document.getElementById('step1').querySelector('.viz-equation');
        this.vizStep2 = document.getElementById('step2').querySelector('.viz-equation');
        this.vizStep3 = document.getElementById('step3').querySelector('.viz-equation');
        this.vizExplanation = document.getElementById('viz-explanation');

        // Dots visualization
        this.dotsVisualization = document.getElementById('dots-visualization');
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetProgress());
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
        this.typeAnswerToggle.addEventListener('change', (e) => {
            this.typeAnswerMode = e.target.checked;
            this.saveTypeAnswerSetting(this.typeAnswerMode);
            this.updateAnswerMode();
        });
        this.rangeSelect.addEventListener('change', (e) => {
            const newRange = parseInt(e.target.value);
            this.tracker.updateRange(newRange);
            this.saveRangeSetting(newRange);
        });
        this.languageToggle.addEventListener('change', (e) => {
            const newLang = e.target.checked ? 'he' : 'en';
            languageManager.setLanguage(newLang);
            this.updateButtonText();
        });

        this.answerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.checkAnswer(e.target));
        });

        // Submit button for type answer mode
        this.submitAnswerBtn.addEventListener('click', () => this.submitTypedAnswer());

        // Enter key to submit typed answer
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitTypedAnswer();
            }
        });

        // Recall submit button
        this.recallSubmitBtn.addEventListener('click', () => this.checkRecall());

        // Enter key to submit recall
        this.recallNum1.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.recallNum2.focus();
            }
        });
        this.recallNum2.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.recallAnswer.focus();
            }
        });
        this.recallAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkRecall();
            }
        });

        // Set initial toggle states
        this.languageToggle.checked = (languageManager.currentLanguage === 'he');
        this.typeAnswerToggle.checked = this.typeAnswerMode;

        // Set initial answer mode
        this.updateAnswerMode();
    }

    initSounds() {
        // Create Web Audio API context for sound effects
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playCorrectSound() {
        if (!this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 523.25; // C5
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);

        // Add a second note for harmony
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode2 = this.audioContext.createGain();

        oscillator2.connect(gainNode2);
        gainNode2.connect(this.audioContext.destination);

        oscillator2.frequency.value = 659.25; // E5
        oscillator2.type = 'sine';

        gainNode2.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator2.start(this.audioContext.currentTime + 0.05);
        oscillator2.stop(this.audioContext.currentTime + 0.35);
    }

    playWrongSound() {
        if (!this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    startGame() {
        this.isPlaying = true;
        this.timeStarted = Date.now();
        this.questionCount = 0; // Reset question count when starting a new session
        this.questionCountEl.textContent = '0';
        this.startBtn.textContent = languageManager.t('playing');
        this.startBtn.disabled = true;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            const currentSessionTime = Math.floor((Date.now() - this.timeStarted) / 1000);
            const totalTime = this.totalTimeSpent + currentSessionTime;
            this.timerEl.textContent = this.formatTime(totalTime);
        }, 1000);

        this.showNextQuestion();
    }

    updateButtonText() {
        if (this.isPlaying) {
            this.startBtn.textContent = languageManager.t('playing');
        } else if (this.score > 0 || this.totalTimeSpent > 0) {
            this.startBtn.textContent = languageManager.t('continuePractice');
        } else {
            this.startBtn.textContent = languageManager.t('startPractice');
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0) {
            return `${mins}m ${secs}s`;
        }
        return `${secs}s`;
    }

    showNextQuestion() {
        if (!this.isPlaying) return;

        this.currentQuestion = this.tracker.getNextQuestion();
        this.correctAnswer = this.currentQuestion.displayAnswer;

        // Display question based on type
        const operator = this.currentQuestion.isDivision ? '÷' : '×';
        this.questionEl.textContent = `${this.currentQuestion.displayNum1} ${operator} ${this.currentQuestion.displayNum2} = ?`;

        // Update dot visualization
        this.updateDotsVisualization();

        // Update visualization
        this.updateVisualization();

        if (this.typeAnswerMode) {
            // Type answer mode
            this.answerInput.value = '';
            this.answerInput.disabled = false;
            this.answerInput.classList.remove('correct', 'wrong');
            this.submitAnswerBtn.disabled = false;
            this.typeAnswerContainer.style.pointerEvents = 'auto';

            // Focus on input
            setTimeout(() => this.answerInput.focus(), 100);
        } else {
            // Multiple choice mode
            const answers = this.generateAnswerOptions(this.correctAnswer);

            // Shuffle and assign to buttons
            answers.forEach((answer, index) => {
                this.answerBtns[index].textContent = answer;
                this.answerBtns[index].disabled = false;
                this.answerBtns[index].classList.remove('correct', 'wrong');
            });

            this.answersContainer.style.pointerEvents = 'auto';
        }

        this.feedbackEl.classList.add('hidden');
    }

    updateAnswerMode() {
        if (this.typeAnswerMode) {
            this.answersContainer.classList.add('hidden');
            this.typeAnswerContainer.classList.remove('hidden');
        } else {
            this.answersContainer.classList.remove('hidden');
            this.typeAnswerContainer.classList.add('hidden');
        }
    }

    submitTypedAnswer() {
        const typedAnswer = parseInt(this.answerInput.value);

        if (isNaN(typedAnswer) || this.answerInput.value.trim() === '') {
            return; // Don't process empty or invalid input
        }

        const isCorrect = typedAnswer === this.correctAnswer;

        // Disable input and button
        this.typeAnswerContainer.style.pointerEvents = 'none';
        this.answerInput.disabled = true;
        this.submitAnswerBtn.disabled = true;

        // Show visual feedback on input
        if (isCorrect) {
            this.answerInput.classList.add('correct');
        } else {
            this.answerInput.classList.add('wrong');
        }

        // Process the answer
        this.processAnswer(isCorrect);
    }

    processAnswer(isCorrect) {
        // Show the answer in visualization
        this.updateVisualization(true);

        // Increment question count
        this.questionCount++;
        this.questionCountEl.textContent = this.questionCount;

        if (isCorrect) {
            this.feedbackEl.innerHTML = languageManager.t('correct');
            this.feedbackEl.className = 'feedback correct';
            this.playCorrectSound();
            this.score++;
            this.streak++;
            this.scoreEl.textContent = this.score;
            this.streakEl.textContent = this.streak;

            // Record the answer
            this.tracker.recordAnswer(this.currentQuestion, isCorrect);
            this.saveSessionProgress();
        } else {
            // Create explanation showing the relationship
            let explanation = '';
            if (this.currentQuestion.isDivision) {
                explanation = `${languageManager.t('wrong')} ${this.correctAnswer}<br>`;
                explanation += `<span class="relationship">${languageManager.t('because')} ${this.correctAnswer} × ${this.currentQuestion.displayNum2} = ${this.currentQuestion.displayNum1}</span>`;
            } else {
                explanation = `${languageManager.t('wrong')} ${this.correctAnswer}<br>`;
                explanation += `<span class="relationship">${languageManager.t('youCanCheck')} ${this.correctAnswer} ÷ ${this.currentQuestion.displayNum2} = ${this.currentQuestion.displayNum1}</span>`;
            }

            this.feedbackEl.innerHTML = explanation;
            this.feedbackEl.className = 'feedback wrong';
            this.playWrongSound();
            this.streak = 0;
            this.streakEl.textContent = this.streak;

            // Record the answer
            this.tracker.recordAnswer(this.currentQuestion, isCorrect);
            this.saveSessionProgress();
        }

        // After showing the feedback, wait a moment then ask for recall
        setTimeout(() => {
            this.showRecallQuestion();
        }, 2000);
    }

    showRecallQuestion() {
        // Hide feedback
        this.feedbackEl.classList.add('hidden');

        // Hide the question to force memory recall
        this.questionEl.style.filter = 'blur(10px)';
        this.questionEl.style.userSelect = 'none';

        // Show recall container
        this.recallContainer.classList.remove('hidden');

        // Update operator symbol
        const operator = this.currentQuestion.isDivision ? '÷' : '×';
        this.recallOperator.textContent = operator;

        // Clear inputs
        this.recallNum1.value = '';
        this.recallNum2.value = '';
        this.recallAnswer.value = '';
        this.recallNum1.disabled = false;
        this.recallNum2.disabled = false;
        this.recallAnswer.disabled = false;
        this.recallSubmitBtn.disabled = false;
        this.recallFeedback.classList.add('hidden');

        // Focus on first input
        setTimeout(() => this.recallNum1.focus(), 100);
    }

    checkRecall() {
        const num1 = parseInt(this.recallNum1.value);
        const num2 = parseInt(this.recallNum2.value);
        const answer = parseInt(this.recallAnswer.value);

        if (isNaN(num1) || isNaN(num2) || isNaN(answer) ||
            this.recallNum1.value.trim() === '' ||
            this.recallNum2.value.trim() === '' ||
            this.recallAnswer.value.trim() === '') {
            return; // Don't process empty or invalid input
        }

        const questionCorrect = num1 === this.currentQuestion.displayNum1 && num2 === this.currentQuestion.displayNum2;
        const answerCorrect = answer === this.correctAnswer;
        const isCorrect = questionCorrect && answerCorrect;

        // Disable inputs
        this.recallNum1.disabled = true;
        this.recallNum2.disabled = true;
        this.recallAnswer.disabled = true;
        this.recallSubmitBtn.disabled = true;

        if (isCorrect) {
            this.recallFeedback.textContent = languageManager.t('recallCorrect');
            this.recallFeedback.className = 'recall-feedback correct';
            this.recallFeedback.classList.remove('hidden');
            this.playCorrectSound();

            // Show next question after a delay
            setTimeout(() => {
                this.recallContainer.classList.add('hidden');
                // Restore question visibility
                this.questionEl.style.filter = 'none';
                this.questionEl.style.userSelect = 'auto';
                this.showNextQuestion();
            }, 1500);
        } else {
            const operator = this.currentQuestion.isDivision ? '÷' : '×';
            let feedbackMsg = `${languageManager.t('recallWrong')} ${this.currentQuestion.displayNum1} ${operator} ${this.currentQuestion.displayNum2} = ${this.correctAnswer}`;

            // Provide specific feedback
            if (!questionCorrect && !answerCorrect) {
                feedbackMsg = `${languageManager.t('recallWrongBoth')} ${this.currentQuestion.displayNum1} ${operator} ${this.currentQuestion.displayNum2} = ${this.correctAnswer}`;
            } else if (!questionCorrect) {
                feedbackMsg = `${languageManager.t('recallWrongQuestion')} ${this.currentQuestion.displayNum1} ${operator} ${this.currentQuestion.displayNum2}`;
            } else if (!answerCorrect) {
                feedbackMsg = `${languageManager.t('recallWrongAnswer')} ${this.correctAnswer}`;
            }

            this.recallFeedback.textContent = feedbackMsg;
            this.recallFeedback.className = 'recall-feedback wrong';
            this.recallFeedback.classList.remove('hidden');
            this.playWrongSound();

            // Allow retry
            setTimeout(() => {
                this.recallNum1.value = '';
                this.recallNum2.value = '';
                this.recallAnswer.value = '';
                this.recallNum1.disabled = false;
                this.recallNum2.disabled = false;
                this.recallAnswer.disabled = false;
                this.recallSubmitBtn.disabled = false;
                this.recallFeedback.classList.add('hidden');
                this.recallNum1.focus();
            }, 2500);
        }
    }

    updateDotsVisualization() {
        const q = this.currentQuestion;
        this.dotsVisualization.innerHTML = '';

        if (q.isDivision) {
            // Division: Show total dots divided into groups
            // Example: 8 ÷ 4 shows [••••] [••••] (8 dots in 2 groups of 4)
            const total = q.displayNum1;
            const divisor = q.displayNum2;
            const numGroups = q.displayAnswer; // This is the result of division

            // Only show dots if total is reasonable and division is exact
            if (total > 100 || total % divisor !== 0) {
                return;
            }

            const container = document.createElement('div');
            container.className = 'dot-group';

            for (let i = 0; i < numGroups; i++) {
                const group = document.createElement('div');
                group.className = 'dot-row';

                for (let j = 0; j < divisor; j++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.style.animationDelay = `${(i * divisor + j) * 0.05}s`;
                    group.appendChild(dot);
                }

                container.appendChild(group);

                // Add separator between groups (except last)
                if (i < numGroups - 1) {
                    const separator = document.createElement('span');
                    separator.className = 'division-separator';
                    separator.textContent = '|';
                    container.appendChild(separator);
                }
            }

            this.dotsVisualization.appendChild(container);
        } else {
            // Multiplication: Show groups of dots
            // Example: 2 × 4 shows [••••] [••••] (2 groups of 4 dots each)
            const groups = q.displayNum1;
            const dotsPerGroup = q.displayNum2;
            const total = groups * dotsPerGroup;

            // Only show dots if total is reasonable
            if (total > 100) {
                return;
            }

            for (let i = 0; i < groups; i++) {
                const row = document.createElement('div');
                row.className = 'dot-row';

                for (let j = 0; j < dotsPerGroup; j++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.style.animationDelay = `${(i * dotsPerGroup + j) * 0.05}s`;
                    row.appendChild(dot);
                }

                this.dotsVisualization.appendChild(row);
            }
        }
    }

    updateVisualization(showAnswer = false) {
        const q = this.currentQuestion;

        // Clear previous animations
        [this.vizStep1, this.vizStep2, this.vizStep3].forEach(el => {
            el.classList.remove('fade-in', 'slide-in', 'highlight');
        });

        if (!showAnswer) {
            // Before answer - just show the question and thinking step
            if (q.isDivision) {
                setTimeout(() => {
                    this.vizStep1.textContent = `${q.displayNum1} ÷ ${q.displayNum2} = ?`;
                    this.vizStep1.classList.add('slide-in');
                }, 100);

                setTimeout(() => {
                    this.vizStep2.textContent = `? × ${q.displayNum2} = ${q.displayNum1}`;
                    this.vizStep2.classList.add('slide-in');
                }, 800);

                this.vizStep3.textContent = '?';
                this.vizExplanation.textContent = `${languageManager.t('divisionAsks')} ${q.displayNum2} ${languageManager.t('equals')} ${q.displayNum1}?"`;
            } else {
                setTimeout(() => {
                    this.vizStep1.textContent = `${q.displayNum1} × ${q.displayNum2} = ?`;
                    this.vizStep1.classList.add('slide-in');
                }, 100);

                this.vizStep2.textContent = '?';
                this.vizStep3.textContent = '';
                this.vizExplanation.textContent = `${languageManager.t('thinkAbout')} ${q.displayNum1} ${languageManager.t('groupsOf')} ${q.displayNum2}...`;
            }
        } else {
            // After answer - show the complete transformation
            if (q.isDivision) {
                setTimeout(() => {
                    this.vizStep1.textContent = `${q.displayNum1} ÷ ${q.displayNum2} = ${q.displayAnswer}`;
                    this.vizStep1.classList.add('slide-in', 'highlight');
                }, 100);

                setTimeout(() => {
                    this.vizStep2.textContent = `${q.displayAnswer} × ${q.displayNum2} = ${q.displayNum1}`;
                    this.vizStep2.classList.add('slide-in');
                }, 800);

                setTimeout(() => {
                    this.vizStep3.textContent = languageManager.t('divisionMultiplication');
                    this.vizStep3.classList.add('slide-in');
                }, 1500);

                this.vizExplanation.textContent = `${languageManager.t('divisionAndMultiplication')} ${q.displayNum1} ÷ ${q.displayNum2} = ${q.displayAnswer} ${languageManager.t('because')} ${q.displayAnswer} × ${q.displayNum2} = ${q.displayNum1}`;
            } else {
                setTimeout(() => {
                    this.vizStep1.textContent = `${q.displayNum1} × ${q.displayNum2} = ${q.displayAnswer}`;
                    this.vizStep1.classList.add('slide-in', 'highlight');
                }, 100);

                setTimeout(() => {
                    this.vizStep2.textContent = `${q.displayAnswer} ÷ ${q.displayNum2} = ${q.displayNum1}`;
                    this.vizStep2.classList.add('slide-in');
                }, 800);

                setTimeout(() => {
                    this.vizStep3.textContent = languageManager.t('multiplicationDivision');
                    this.vizStep3.classList.add('slide-in');
                }, 1500);

                this.vizExplanation.textContent = `${languageManager.t('youCanCheck')} ${q.displayAnswer} ÷ ${q.displayNum2} = ${q.displayNum1}`;
            }
        }
    }

    generateAnswerOptions(correctAnswer) {
        const options = [correctAnswer];
        const usedAnswers = new Set([correctAnswer]);

        while (options.length < 4) {
            let wrongAnswer;
            const rand = Math.random();

            if (this.currentQuestion.isDivision) {
                // For division questions, create more targeted wrong answers
                if (rand < 0.4) {
                    // Close wrong answer (±1 to ±3)
                    wrongAnswer = correctAnswer + (Math.floor(Math.random() * 6) - 3);
                } else if (rand < 0.6) {
                    // Common division mistake: swap the numbers
                    wrongAnswer = this.currentQuestion.displayNum2;
                } else if (rand < 0.8) {
                    // Use one of the original multiplication factors
                    wrongAnswer = this.currentQuestion.displayNum1;
                } else {
                    // Random from smaller range for division
                    wrongAnswer = Math.floor(Math.random() * this.tracker.maxNumber) + 1;
                }
            } else {
                // For multiplication questions
                if (rand < 0.4) {
                    // Close wrong answer (±1 to ±5)
                    wrongAnswer = correctAnswer + (Math.floor(Math.random() * 10) - 5);
                } else if (rand < 0.7) {
                    // Common mistake (off by one factor)
                    const factor = Math.random() < 0.5 ? this.currentQuestion.displayNum1 : this.currentQuestion.displayNum2;
                    wrongAnswer = correctAnswer + factor * (Math.random() < 0.5 ? 1 : -1);
                } else {
                    // Random from range
                    wrongAnswer = Math.floor(Math.random() * this.tracker.maxNumber * this.tracker.maxNumber);
                }
            }

            // Ensure positive and not duplicate
            const maxValue = this.currentQuestion.isDivision ? this.tracker.maxNumber * 2 : 225;
            if (wrongAnswer > 0 && wrongAnswer <= maxValue && !usedAnswers.has(wrongAnswer)) {
                options.push(wrongAnswer);
                usedAnswers.add(wrongAnswer);
            }
        }

        // Shuffle array
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return options;
    }

    checkAnswer(button) {
        const selectedAnswer = parseInt(button.textContent);
        const isCorrect = selectedAnswer === this.correctAnswer;

        // Disable all buttons
        this.answersContainer.style.pointerEvents = 'none';
        this.answerBtns.forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.textContent) === this.correctAnswer) {
                btn.classList.add('correct');
            }
        });

        // Visual feedback
        if (isCorrect) {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
        }

        // Process the answer
        this.processAnswer(isCorrect);
    }

    saveSessionProgress() {
        try {
            const currentSessionTime = this.isPlaying ? Math.floor((Date.now() - this.timeStarted) / 1000) : 0;
            const progress = {
                score: this.score,
                streak: this.streak,
                totalTimeSpent: this.totalTimeSpent + currentSessionTime,
                lastPlayed: Date.now()
            };
            localStorage.setItem('multiplicationSession', JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save session progress:', e);
        }
    }

    loadSessionProgress() {
        try {
            const saved = localStorage.getItem('multiplicationSession');
            if (saved) {
                const progress = JSON.parse(saved);
                this.score = progress.score || 0;
                this.streak = progress.streak || 0;
                this.totalTimeSpent = progress.totalTimeSpent || 0;

                // Update UI
                this.scoreEl.textContent = this.score;
                this.streakEl.textContent = this.streak;
                this.timerEl.textContent = this.formatTime(this.totalTimeSpent);

                // Show welcome back message if progress exists
                if (this.score > 0 || this.totalTimeSpent > 0) {
                    this.showWelcomeBackMessage(progress.lastPlayed);
                }
            }
        } catch (e) {
            console.error('Failed to load session progress:', e);
        }
    }

    showWelcomeBackMessage(lastPlayed) {
        const now = Date.now();
        const hoursSince = Math.floor((now - lastPlayed) / (1000 * 60 * 60));

        let message = languageManager.t('welcomeBack') + ' ';
        if (hoursSince < 1) {
            message += languageManager.t('readyToContinue');
        } else if (hoursSince < 24) {
            const hourWord = hoursSince > 1 ? languageManager.t('hoursAgo') : languageManager.t('hourAgo');
            message += `${languageManager.t('lastPracticed')} ${hoursSince} ${hourWord}.`;
        } else {
            const daysSince = Math.floor(hoursSince / 24);
            const dayWord = daysSince > 1 ? languageManager.t('daysAgo') : languageManager.t('dayAgo');
            message += `${languageManager.t('lastPracticed')} ${daysSince} ${dayWord}.`;
        }

        this.startBtn.textContent = languageManager.t('continuePractice');
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = 'feedback welcome';
        this.feedbackEl.classList.remove('hidden');
    }

    saveRangeSetting(range) {
        try {
            localStorage.setItem('multiplicationRange', range.toString());
        } catch (e) {
            console.error('Failed to save range setting:', e);
        }
    }

    loadRangeSetting() {
        try {
            const saved = localStorage.getItem('multiplicationRange');
            return saved ? parseInt(saved) : 5; // Default to 5 (1-6 range)
        } catch (e) {
            console.error('Failed to load range setting:', e);
            return 5; // Default to 5 (1-6 range)
        }
    }

    applySavedRange(range) {
        // Set the select element to the saved range
        this.rangeSelect.value = range.toString();
    }

    saveTypeAnswerSetting(enabled) {
        try {
            localStorage.setItem('multiplicationTypeAnswer', enabled.toString());
        } catch (e) {
            console.error('Failed to save type answer setting:', e);
        }
    }

    loadTypeAnswerSetting() {
        try {
            const saved = localStorage.getItem('multiplicationTypeAnswer');
            return saved === 'true';
        } catch (e) {
            console.error('Failed to load type answer setting:', e);
            return false;
        }
    }

    resetProgress() {
        if (confirm(languageManager.t('resetConfirm'))) {
            this.tracker.resetProgress();
            this.score = 0;
            this.streak = 0;
            this.totalTimeSpent = 0;
            this.scoreEl.textContent = '0';
            this.streakEl.textContent = '0';
            this.timerEl.textContent = '0s';

            // Clear session progress
            localStorage.removeItem('multiplicationSession');

            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }

            this.isPlaying = false;
            this.startBtn.textContent = languageManager.t('startPractice');
            this.startBtn.disabled = false;
            this.feedbackEl.classList.add('hidden');

            alert(languageManager.t('progressReset'));
        }
    }
}

// Translation system
const translations = {
    en: {
        title: '🌟 Multiplication Practice 🌟',
        score: 'Score:',
        streak: 'Streak:',
        questions: 'Questions:',
        time: 'Time:',
        startPractice: 'Start Practice',
        continuePractice: 'Continue Practice',
        playing: 'Playing...',
        resetProgress: 'Reset Progress',
        soundEffects: 'Sound Effects',
        typeAnswer: 'Type Answer',
        submitAnswer: 'Submit',
        practiceRange: 'Practice Range:',
        hebrew: 'עברית',
        backToMenu: '← Back to Menu',
        howTheyConnect: 'How They Connect',
        startHere: 'Start here',
        correct: '✓ Correct!',
        wrong: '✗ Wrong! The answer is',
        nextQuestion: 'Next Question',
        clickToContinue: 'Click to Continue',
        because: 'Because',
        youCanCheck: 'You can check:',
        divisionAsks: 'Division asks: "What number times',
        equals: 'equals',
        thinkAbout: 'Think about',
        groupsOf: 'groups of',
        think: 'Think:',
        check: 'Check:',
        divisionMultiplication: '✓ Division ↔ Multiplication',
        multiplicationDivision: '✓ Multiplication ↔ Division',
        divisionAndMultiplication: 'Division and multiplication are opposites!',
        welcomeBack: 'Welcome back!',
        readyToContinue: 'Ready to continue practicing?',
        lastPracticed: 'You last practiced',
        hourAgo: 'hour ago',
        hoursAgo: 'hours ago',
        dayAgo: 'day ago',
        daysAgo: 'days ago',
        resetConfirm: 'Are you sure you want to reset all progress?',
        progressReset: 'Progress reset! Start practicing again.',
        answerQuestions: 'Answer questions to see the magic! ✨',
        recallQuestion: 'What was the question and answer?',
        checkRecall: 'Check',
        recallCorrect: '✓ Great memory!',
        recallWrong: '✗ It was:',
        recallWrongBoth: '✗ It was:',
        recallWrongQuestion: '✗ The question was:',
        recallWrongAnswer: '✗ The answer was:'
    },
    he: {
        title: '🌟 תרגול כפל וחילוק 🌟',
        score: 'ניקוד:',
        streak: 'רצף:',
        questions: 'שאלות:',
        time: 'זמן:',
        startPractice: 'התחל תרגול',
        continuePractice: 'המשך תרגול',
        playing: 'מתרגל...',
        resetProgress: 'אפס התקדמות',
        soundEffects: 'אפקטי קול',
        typeAnswer: 'הקלד תשובה',
        submitAnswer: 'שלח',
        practiceRange: 'טווח תרגול:',
        hebrew: 'English',
        backToMenu: 'חזרה לתפריט ←',
        howTheyConnect: 'איך הם מתחברים',
        startHere: 'התחל כאן',
        correct: '✓ נכון!',
        wrong: '✗ טעות! התשובה היא',
        nextQuestion: 'שאלה הבאה',
        clickToContinue: 'לחץ להמשך',
        because: 'כי',
        youCanCheck: 'אפשר לבדוק:',
        divisionAsks: 'חילוק שואל: "איזה מספר כפול',
        equals: 'שווה',
        thinkAbout: 'חשוב על',
        groupsOf: 'קבוצות של',
        think: 'חשוב:',
        check: 'בדיקה:',
        divisionMultiplication: '✓ חילוק ↔ כפל',
        multiplicationDivision: '✓ כפל ↔ חילוק',
        divisionAndMultiplication: 'חילוק וכפל הם הפוכים!',
        welcomeBack: 'ברוך שובך!',
        readyToContinue: 'מוכן להמשיך לתרגל?',
        lastPracticed: 'תרגלת לאחרונה לפני',
        hourAgo: 'שעה',
        hoursAgo: 'שעות',
        dayAgo: 'יום',
        daysAgo: 'ימים',
        resetConfirm: 'האם אתה בטוח שברצונך לאפס את כל ההתקדמות?',
        progressReset: 'ההתקדמות אופסה! התחל לתרגל שוב.',
        answerQuestions: 'ענה על שאלות כדי לראות את הקסם! ✨',
        recallQuestion: 'מה היו השאלה והתשובה?',
        checkRecall: 'בדוק',
        recallCorrect: '✓ זיכרון מעולה!',
        recallWrong: '✗ זה היה:',
        recallWrongBoth: '✗ זה היה:',
        recallWrongQuestion: '✗ השאלה הייתה:',
        recallWrongAnswer: '✗ התשובה הייתה:'
    }
};

class LanguageManager {
    constructor() {
        this.currentLanguage = this.loadLanguage();
    }

    loadLanguage() {
        try {
            const saved = localStorage.getItem('multiplicationLanguage');
            return saved || 'en';
        } catch (e) {
            return 'en';
        }
    }

    saveLanguage(lang) {
        try {
            localStorage.setItem('multiplicationLanguage', lang);
        } catch (e) {
            console.error('Failed to save language:', e);
        }
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.saveLanguage(lang);
        this.updateUI();

        // Update body direction for RTL
        if (lang === 'he') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.setAttribute('dir', 'ltr');
        }
    }

    updateUI() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[this.currentLanguage][key]) {
                element.textContent = translations[this.currentLanguage][key];
            }
        });
    }

    t(key) {
        return translations[this.currentLanguage][key] || translations.en[key] || key;
    }

    isHebrew() {
        return this.currentLanguage === 'he';
    }
}

// Initialize game when page loads
let game;
let languageManager;
window.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
    languageManager.updateUI();
    game = new MultiplicationGame();
});
