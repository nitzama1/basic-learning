// Subtraction Game with Progressive Levels
class SubtractionGame {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.streak = 0;
        this.questionCount = 0;
        this.correctInLevel = 0;
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.isPlaying = false;
        this.soundEnabled = true;

        this.levels = [
            { max: 10, description: 'רמה 1: מספרים עד 10' },
            { max: 20, description: 'רמה 2: מספרים עד 20' },
            { max: 50, description: 'רמה 3: מספרים עד 50' },
            { max: 100, description: 'רמה 4: מספרים עד 100' },
            { max: 200, description: 'רמה 5: מספרים עד 200' }
        ];

        this.initElements();
        this.initEventListeners();
        this.initSounds();
        this.loadProgress();
    }

    initElements() {
        this.questionEl = document.getElementById('question');
        this.answersContainer = document.getElementById('answers-container');
        this.answerBtns = document.querySelectorAll('.answer-btn');
        this.feedbackEl = document.getElementById('feedback');
        this.scoreEl = document.getElementById('score');
        this.streakEl = document.getElementById('streak');
        this.questionCountEl = document.getElementById('question-count');
        this.levelEl = document.getElementById('level');
        this.levelDescriptionEl = document.getElementById('level-description');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.soundToggle = document.getElementById('sound-toggle');
        this.verticalSolution = document.getElementById('vertical-solution');
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetProgress());
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });

        this.answerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.checkAnswer(e.target));
        });
    }

    initSounds() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playCorrectSound() {
        if (!this.soundEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
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

    playLevelUpSound() {
        if (!this.soundEnabled) return;

        const notes = [523.25, 587.33, 659.25, 783.99];
        notes.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = this.audioContext.currentTime + (i * 0.1);
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    }

    startGame() {
        this.isPlaying = true;
        this.startBtn.textContent = 'מתרגל...';
        this.startBtn.disabled = true;
        this.showNextQuestion();
    }

    generateQuestion() {
        const levelConfig = this.levels[this.level - 1];
        const max = levelConfig.max;

        // For subtraction, ensure num1 >= num2 to avoid negative results
        let num1 = Math.floor(Math.random() * max) + 1;
        let num2 = Math.floor(Math.random() * num1) + 1; // num2 will be <= num1

        // Make sure we have some variety and not always num1 - 1
        if (num2 === num1) {
            num2 = Math.floor(Math.random() * num1);
        }

        const answer = num1 - num2;

        return {
            num1,
            num2,
            answer
        };
    }

    showNextQuestion() {
        if (!this.isPlaying) return;

        this.currentQuestion = this.generateQuestion();
        this.correctAnswer = this.currentQuestion.answer;

        this.questionEl.textContent = `${this.currentQuestion.num1} - ${this.currentQuestion.num2} = ?`;

        const answers = this.generateAnswerOptions(this.correctAnswer);

        answers.forEach((answer, index) => {
            this.answerBtns[index].textContent = answer;
            this.answerBtns[index].disabled = false;
            this.answerBtns[index].classList.remove('correct', 'wrong');
        });

        this.answersContainer.style.pointerEvents = 'auto';
        this.feedbackEl.classList.add('hidden');

        this.verticalSolution.innerHTML = '<div class="instruction">ענה על השאלה כדי לראות את הפתרון!</div>';
    }

    generateAnswerOptions(correctAnswer) {
        const options = [correctAnswer];
        const usedAnswers = new Set([correctAnswer]);

        while (options.length < 4) {
            let wrongAnswer;
            const rand = Math.random();

            if (rand < 0.5) {
                // Close wrong answer (±1 to ±10)
                wrongAnswer = correctAnswer + (Math.floor(Math.random() * 20) - 10);
            } else {
                // Random from level range
                const levelMax = this.levels[this.level - 1].max;
                wrongAnswer = Math.floor(Math.random() * levelMax);
            }

            // Ensure answer is not negative and not duplicate
            if (wrongAnswer >= 0 && !usedAnswers.has(wrongAnswer)) {
                options.push(wrongAnswer);
                usedAnswers.add(wrongAnswer);
            }
        }

        // Shuffle
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }

        return options;
    }

    checkAnswer(button) {
        const selectedAnswer = parseInt(button.textContent);
        const isCorrect = selectedAnswer === this.correctAnswer;

        this.answersContainer.style.pointerEvents = 'none';
        this.answerBtns.forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.textContent) === this.correctAnswer) {
                btn.classList.add('correct');
            }
        });

        if (isCorrect) {
            button.classList.add('correct');
        } else {
            button.classList.add('wrong');
        }

        this.processAnswer(isCorrect);
    }

    processAnswer(isCorrect) {
        this.questionCount++;
        this.questionCountEl.textContent = this.questionCount;

        this.showVerticalSolution();

        if (isCorrect) {
            this.feedbackEl.innerHTML = '✓ נכון מצוין!';
            this.feedbackEl.className = 'feedback correct';
            this.playCorrectSound();
            this.score++;
            this.streak++;
            this.correctInLevel++;
            this.scoreEl.textContent = this.score;
            this.streakEl.textContent = this.streak;

            if (this.correctInLevel >= 5 && this.level < this.levels.length) {
                setTimeout(() => this.levelUp(), 2000);
            } else {
                setTimeout(() => this.showNextQuestion(), 2000);
            }
        } else {
            this.feedbackEl.innerHTML = `✗ טעות! התשובה הנכונה היא ${this.correctAnswer}`;
            this.feedbackEl.className = 'feedback wrong';
            this.playWrongSound();
            this.streak = 0;
            this.streakEl.textContent = this.streak;
            this.correctInLevel = 0;

            setTimeout(() => this.showNextQuestion(), 3000);
        }

        this.feedbackEl.classList.remove('hidden');
        this.saveProgress();
    }

    showVerticalSolution() {
        const { num1, num2, answer } = this.currentQuestion;

        const maxDigits = Math.max(
            num1.toString().length,
            num2.toString().length,
            answer.toString().length
        );

        const num1Str = num1.toString().padStart(maxDigits, ' ');
        const num2Str = num2.toString().padStart(maxDigits, ' ');
        const answerStr = answer.toString().padStart(maxDigits, ' ');

        // Check if borrowing is needed
        const needsBorrowing = this.checkIfBorrowingNeeded(num1, num2);
        const borrowingExplanation = needsBorrowing ?
            '<p class="tip">💡 שים לב: צריך "לשאול" מהספרה השמאלית</p>' :
            '<p class="tip">💡 פשוט מחסירים ספרה אחרי ספרה</p>';

        this.verticalSolution.innerHTML = `
            <div class="vertical-calc">
                <div class="calc-title">כך פותרים:</div>
                <div class="calc-row">
                    <span class="calc-number">${this.formatNumber(num1Str)}</span>
                </div>
                <div class="calc-row">
                    <span class="calc-operator">-</span>
                    <span class="calc-number">${this.formatNumber(num2Str)}</span>
                </div>
                <div class="calc-line"></div>
                <div class="calc-row answer-row">
                    <span class="calc-number answer">${this.formatNumber(answerStr)}</span>
                </div>
                <div class="calc-explanation">
                    <p>📝 ${num1} - ${num2} = ${answer}</p>
                    ${borrowingExplanation}
                </div>
            </div>
        `;
    }

    checkIfBorrowingNeeded(num1, num2) {
        const str1 = num1.toString();
        const str2 = num2.toString().padStart(str1.length, '0');

        for (let i = str1.length - 1; i >= 0; i--) {
            if (parseInt(str1[i]) < parseInt(str2[i])) {
                return true;
            }
        }
        return false;
    }

    formatNumber(numStr) {
        return numStr.split('').map(char =>
            char === ' ' ? '&nbsp;' : char
        ).join('');
    }

    levelUp() {
        this.level++;
        this.correctInLevel = 0;
        this.levelEl.textContent = this.level;
        this.levelDescriptionEl.textContent = this.levels[this.level - 1].description;

        this.feedbackEl.innerHTML = `🎉 כל הכבוד! עלית לרמה ${this.level}! 🎉`;
        this.feedbackEl.className = 'feedback level-up';
        this.playLevelUpSound();

        this.saveProgress();

        setTimeout(() => this.showNextQuestion(), 3000);
    }

    resetProgress() {
        if (confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות?')) {
            this.level = 1;
            this.score = 0;
            this.streak = 0;
            this.questionCount = 0;
            this.correctInLevel = 0;
            this.scoreEl.textContent = '0';
            this.streakEl.textContent = '0';
            this.questionCountEl.textContent = '0';
            this.levelEl.textContent = '1';
            this.levelDescriptionEl.textContent = this.levels[0].description;

            localStorage.removeItem('subtractionProgress');

            this.isPlaying = false;
            this.startBtn.textContent = 'התחל תרגול';
            this.startBtn.disabled = false;
            this.feedbackEl.classList.add('hidden');
            this.verticalSolution.innerHTML = '<div class="instruction">ענה על שאלה כדי לראות את הפתרון!</div>';

            alert('ההתקדמות אופסה! התחל לתרגל שוב.');
        }
    }

    saveProgress() {
        try {
            const progress = {
                level: this.level,
                score: this.score,
                streak: this.streak,
                questionCount: this.questionCount,
                correctInLevel: this.correctInLevel
            };
            localStorage.setItem('subtractionProgress', JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('subtractionProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.level = progress.level || 1;
                this.score = progress.score || 0;
                this.streak = progress.streak || 0;
                this.questionCount = progress.questionCount || 0;
                this.correctInLevel = progress.correctInLevel || 0;

                this.scoreEl.textContent = this.score;
                this.streakEl.textContent = this.streak;
                this.questionCountEl.textContent = this.questionCount;
                this.levelEl.textContent = this.level;
                this.levelDescriptionEl.textContent = this.levels[this.level - 1].description;

                if (this.score > 0) {
                    this.startBtn.textContent = 'המשך תרגול';
                }
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
    }
}

// Initialize game
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new SubtractionGame();
});
