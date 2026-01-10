// Hebrew words for writing practice
const hebrewWords = [
    { word: 'אבא', meaning: 'Dad', emoji: '👨' },
    { word: 'אמא', meaning: 'Mom', emoji: '👩' },
    { word: 'בית', meaning: 'House', emoji: '🏠' },
    { word: 'גמל', meaning: 'Camel', emoji: '🐪' },
    { word: 'דג', meaning: 'Fish', emoji: '🐟' },
    { word: 'הר', meaning: 'Mountain', emoji: '⛰️' },
    { word: 'ורד', meaning: 'Rose', emoji: '🌹' },
    { word: 'חתול', meaning: 'Cat', emoji: '🐱' },
    { word: 'יד', meaning: 'Hand', emoji: '✋' },
    { word: 'ים', meaning: 'Sea', emoji: '🌊' },
    { word: 'כלב', meaning: 'Dog', emoji: '🐕' },
    { word: 'לב', meaning: 'Heart', emoji: '❤️' },
    { word: 'מים', meaning: 'Water', emoji: '💧' },
    { word: 'נר', meaning: 'Candle', emoji: '🕯️' },
    { word: 'סוס', meaning: 'Horse', emoji: '🐴' },
    { word: 'עץ', meaning: 'Tree', emoji: '🌳' },
    { word: 'פיל', meaning: 'Elephant', emoji: '🐘' },
    { word: 'קוף', meaning: 'Monkey', emoji: '🐵' },
    { word: 'שמש', meaning: 'Sun', emoji: '☀️' },
    { word: 'תות', meaning: 'Strawberry', emoji: '🍓' }
];

// Hebrew alphabet for keyboard
const hebrewAlphabet = [
    'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ',
    'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'
];

// Game state
let score = 0;
let questionNumber = 0;
let currentWord = null;
let userInput = [];

// Adaptive learning - track wrong answers
let wrongWords = {}; // { word: count }

// Initialize wrong words tracking
function initWrongWords() {
    hebrewWords.forEach(item => {
        wrongWords[item.word] = 0;
    });
}

// Get a word with weighted probability
function getWeightedRandomWord() {
    const weightedArray = [];

    hebrewWords.forEach(item => {
        const wrongCount = wrongWords[item.word] || 0;
        const weight = Math.min(1 + wrongCount, 6);
        for (let i = 0; i < weight; i++) {
            weightedArray.push(item);
        }
    });

    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    return weightedArray[randomIndex];
}

// Generate a new question
function generateQuestion() {
    questionNumber++;
    document.getElementById('progressText').textContent = `מילה ${questionNumber}`;

    // Clear feedback and input
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';

    userInput = [];
    updateWrittenWord();

    // Choose word using adaptive learning
    currentWord = getWeightedRandomWord();

    // Update emoji
    document.getElementById('wordEmoji').textContent = currentWord.emoji;

    // Auto-play the word after a short delay
    setTimeout(() => {
        speakWord(currentWord.word);
    }, 500);
}

// Create keyboard
function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';

    hebrewAlphabet.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'key-btn';
        btn.textContent = letter;
        btn.addEventListener('click', () => addLetter(letter));
        keyboard.appendChild(btn);
    });
}

// Add letter to user input
function addLetter(letter) {
    userInput.push(letter);
    updateWrittenWord();
}

// Update the written word display
function updateWrittenWord() {
    const writtenWordDiv = document.getElementById('writtenWord');

    if (userInput.length === 0) {
        writtenWordDiv.className = 'written-word empty';
        writtenWordDiv.innerHTML = '';
    } else {
        writtenWordDiv.className = 'written-word';
        writtenWordDiv.innerHTML = userInput.map(letter =>
            `<span class="letter-box">${letter}</span>`
        ).join('');
    }
}

// Clear the input
function clearInput() {
    userInput = [];
    updateWrittenWord();
}

// Check the answer
function checkAnswer() {
    const userWord = userInput.join('');
    const correctWord = currentWord.word;
    const feedback = document.getElementById('feedback');

    if (userWord === '') {
        feedback.textContent = '⚠️ כתוב משהו קודם!';
        feedback.className = 'feedback wrong';
        return;
    }

    if (userWord === correctWord) {
        // Correct!
        feedback.innerHTML = '🎉 מצוין! כל הכבוד!';
        feedback.className = 'feedback correct';

        score += 10;
        document.getElementById('score').textContent = score;

        // Play success sound
        playSuccessSound();

        // Decrease wrong count
        if (wrongWords[currentWord.word] > 0) {
            wrongWords[currentWord.word] = Math.max(0, wrongWords[currentWord.word] - 1);
        }

        // Next word after delay
        setTimeout(() => {
            generateQuestion();
        }, 2500);

    } else {
        // Wrong answer
        feedback.innerHTML = `
            ❌ לא נכון, נסה שוב!
            <div class="correction">המילה הנכונה היא: ${correctWord}</div>
        `;
        feedback.className = 'feedback wrong';

        // Increase wrong count
        wrongWords[currentWord.word] = (wrongWords[currentWord.word] || 0) + 1;

        // Speak the correct word
        setTimeout(() => {
            speakWord(correctWord);
        }, 1000);

        // Clear input and allow retry after delay
        setTimeout(() => {
            clearInput();
            feedback.textContent = 'נסה לכתוב שוב...';
        }, 3500);
    }
}

// Text-to-speech using gTTS
function speakWord(word) {
    console.log('Speaking:', word);

    const listenBtn = document.getElementById('listenBtn');
    listenBtn.classList.add('playing');

    // Use the Flask /speak endpoint with gTTS
    const audio = new Audio(`/speak/${encodeURIComponent(word)}/he`);

    audio.onended = () => {
        listenBtn.classList.remove('playing');
    };

    audio.onerror = (e) => {
        console.error('Error playing audio:', e);
        listenBtn.classList.remove('playing');
    };

    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        listenBtn.classList.remove('playing');
    });
}

// Success sound effect
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.error('Audio error:', e);
    }
}

// Initialize the game
function init() {
    initWrongWords();
    createKeyboard();

    // Setup event listeners
    document.getElementById('listenBtn').addEventListener('click', () => {
        if (currentWord) {
            speakWord(currentWord.word);
        }
    });

    document.getElementById('clearBtn').addEventListener('click', clearInput);
    document.getElementById('checkBtn').addEventListener('click', checkAnswer);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (hebrewAlphabet.includes(key)) {
            addLetter(key);
        } else if (key === 'Backspace') {
            userInput.pop();
            updateWrittenWord();
        } else if (key === 'Enter') {
            checkAnswer();
        }
    });

    // Start first question
    generateQuestion();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
