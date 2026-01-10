// Combined Addition and Subtraction Game with Dynamic Difficulty
class AddSubtractGame {
    constructor() {
        this.difficulty = 10; // Starting max number range
        this.score = 0;
        this.streak = 0;
        this.questionCount = 0;
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.isPlaying = false;
        this.soundEnabled = true;

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
        this.difficultyEl = document.getElementById('difficulty');
        this.levelDescriptionEl = document.getElementById('level-description');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.soundToggle = document.getElementById('sound-toggle');
        this.verticalSolution = document.getElementById('vertical-solution');
        this.nextBtn = document.getElementById('next-btn');
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

        this.nextBtn.addEventListener('click', () => {
            if (this.pendingAction === 'levelUp') {
                this.increaseDifficulty();
            } else {
                this.showNextQuestion();
            }
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

    playDifficultyUpSound() {
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
        // Randomly choose addition or subtraction
        const isAddition = Math.random() < 0.5;

        if (isAddition) {
            // Addition
            const num1 = Math.floor(Math.random() * this.difficulty) + 1;
            const num2 = Math.floor(Math.random() * this.difficulty) + 1;
            const answer = num1 + num2;

            return {
                num1,
                num2,
                answer,
                operator: '+',
                isAddition: true
            };
        } else {
            // Subtraction - ensure num1 >= num2
            let num1 = Math.floor(Math.random() * this.difficulty) + 1;
            let num2 = Math.floor(Math.random() * num1) + 1;

            // Ensure variety
            if (num2 === num1) {
                num2 = Math.floor(Math.random() * num1);
            }

            const answer = num1 - num2;

            return {
                num1,
                num2,
                answer,
                operator: '-',
                isAddition: false
            };
        }
    }

    showNextQuestion() {
        if (!this.isPlaying) return;

        this.currentQuestion = this.generateQuestion();
        this.correctAnswer = this.currentQuestion.answer;

        // Use innerHTML with explicit LTR direction to prevent RTL reversal
        this.questionEl.innerHTML = `<span dir="ltr">${this.currentQuestion.num1} ${this.currentQuestion.operator} ${this.currentQuestion.num2} = ?</span>`;

        const answers = this.generateAnswerOptions(this.correctAnswer);

        answers.forEach((answer, index) => {
            this.answerBtns[index].textContent = answer;
            this.answerBtns[index].disabled = false;
            this.answerBtns[index].classList.remove('correct', 'wrong');
        });

        this.answersContainer.style.pointerEvents = 'auto';
        this.feedbackEl.classList.add('hidden');
        this.nextBtn.classList.add('hidden');

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
                // Random from difficulty range
                if (this.currentQuestion.isAddition) {
                    wrongAnswer = Math.floor(Math.random() * (this.difficulty * 2)) + 1;
                } else {
                    wrongAnswer = Math.floor(Math.random() * this.difficulty);
                }
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
            this.scoreEl.textContent = this.score;
            this.streakEl.textContent = this.streak;

            // Increase difficulty gradually on each correct answer
            this.increaseDifficultyGradually();
            this.pendingAction = 'nextQuestion';
        } else {
            this.feedbackEl.innerHTML = `✗ טעות! התשובה הנכונה היא ${this.correctAnswer}`;
            this.feedbackEl.className = 'feedback wrong';
            this.playWrongSound();
            this.streak = 0;
            this.streakEl.textContent = this.streak;

            // Decrease difficulty on wrong answer
            this.decreaseDifficultyGradually();
            this.pendingAction = 'nextQuestion';
        }

        this.feedbackEl.classList.remove('hidden');
        this.nextBtn.classList.remove('hidden');
        this.saveProgress();
    }

    showVerticalSolution() {
        const { num1, num2, answer, operator, isAddition } = this.currentQuestion;

        const maxDigits = Math.max(
            num1.toString().length,
            num2.toString().length,
            answer.toString().length
        );

        const num1Str = num1.toString().padStart(maxDigits, ' ');
        const num2Str = num2.toString().padStart(maxDigits, ' ');
        const answerStr = answer.toString().padStart(maxDigits, ' ');

        let tipText = '';
        if (isAddition) {
            tipText = '<p class="tip">💡 מתחילים לחבר מהספרה הימנית ביותר</p>';
        } else {
            const needsBorrowing = this.checkIfBorrowingNeeded(num1, num2);
            tipText = needsBorrowing ?
                '<p class="tip">💡 שים לב: צריך "לשאול" מהספרה השמאלית</p>' :
                '<p class="tip">💡 פשוט מחסירים ספרה אחרי ספרה</p>';
        }

        this.verticalSolution.innerHTML = `
            <div class="vertical-calc" dir="ltr">
                <div class="calc-title" dir="rtl">כך פותרים:</div>
                <div class="calc-row">
                    <span class="calc-number">${this.formatNumber(num1Str)}</span>
                </div>
                <div class="calc-row">
                    <span class="calc-operator">${operator}</span>
                    <span class="calc-number">${this.formatNumber(num2Str)}</span>
                </div>
                <div class="calc-line"></div>
                <div class="calc-row answer-row">
                    <span class="calc-number answer">${this.formatNumber(answerStr)}</span>
                </div>
                <div class="calc-explanation" dir="rtl">
                    <p><span dir="ltr">📝 ${num1} ${operator} ${num2} = ${answer}</span></p>
                    ${tipText}
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

    increaseDifficultyGradually() {
        const oldDifficulty = this.difficulty;

        // Increase difficulty based on current level:
        // Lower levels (10-50): increase by 2 per correct answer
        // Medium levels (50-100): increase by 3 per correct answer
        // Higher levels (100-200): increase by 5 per correct answer
        let increment;
        if (this.difficulty < 50) {
            increment = 2;
        } else if (this.difficulty < 100) {
            increment = 3;
        } else {
            increment = 5;
        }

        this.difficulty = Math.min(1000, this.difficulty + increment);

        if (this.difficulty !== oldDifficulty) {
            this.difficultyEl.textContent = this.difficulty;

            // Show level up notification every 10 points
            if (Math.floor(this.difficulty / 10) > Math.floor(oldDifficulty / 10)) {
                this.playDifficultyUpSound();
            }
        }
    }

    decreaseDifficultyGradually() {
        const oldDifficulty = this.difficulty;

        // Decrease difficulty on wrong answer:
        // Lower levels (10-50): decrease by 3
        // Medium levels (50-100): decrease by 5
        // Higher levels (100+): decrease by 8
        let decrement;
        if (this.difficulty <= 50) {
            decrement = 3;
        } else if (this.difficulty <= 100) {
            decrement = 5;
        } else {
            decrement = 8;
        }

        this.difficulty = Math.max(10, this.difficulty - decrement);

        if (this.difficulty !== oldDifficulty) {
            this.difficultyEl.textContent = this.difficulty;
        }
    }

    resetProgress() {
        if (confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות?')) {
            this.difficulty = 10;
            this.score = 0;
            this.streak = 0;
            this.questionCount = 0;
            this.scoreEl.textContent = '0';
            this.streakEl.textContent = '0';
            this.questionCountEl.textContent = '0';
            this.difficultyEl.textContent = '10';

            localStorage.removeItem('addSubtractProgress');

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
                difficulty: this.difficulty,
                score: this.score,
                streak: this.streak,
                questionCount: this.questionCount
            };
            localStorage.setItem('addSubtractProgress', JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('addSubtractProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.difficulty = progress.difficulty || 10;
                this.score = progress.score || 0;
                this.streak = progress.streak || 0;
                this.questionCount = progress.questionCount || 0;

                this.scoreEl.textContent = this.score;
                this.streakEl.textContent = this.streak;
                this.questionCountEl.textContent = this.questionCount;
                this.difficultyEl.textContent = this.difficulty;

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
    game = new AddSubtractGame();
});
