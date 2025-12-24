// Hebrew Alphabet with letter names
const hebrewAlphabet = [
    { letter: 'א', name: 'אָלֶף', transliteration: 'Alef' },
    { letter: 'ב', name: 'בֵּית', transliteration: 'Bet' },
    { letter: 'ג', name: 'גִּימֶאל', transliteration: 'Gimel' },
    { letter: 'ד', name: 'דָּלֶת', transliteration: 'Dalet' },
    { letter: 'ה', name: 'הֵהֵי', transliteration: 'Hey' },
    { letter: 'ו', name: 'וָו', transliteration: 'Vav' },
    { letter: 'ז', name: 'זַיִן', transliteration: 'Zayin' },
    { letter: 'ח', name: 'חֵית', transliteration: 'Chet' },
    { letter: 'ט', name: 'טֵית', transliteration: 'Tet' },
    { letter: 'י', name: 'יוֹד', transliteration: 'Yod' },
    { letter: 'כ', name: 'כַּף', transliteration: 'Kaf' },
    { letter: 'ל', name: 'לָמֶד', transliteration: 'Lamed' },
    { letter: 'מ', name: 'מֵם', transliteration: 'Mem' },
    { letter: 'נ', name: 'נוּן', transliteration: 'Nun' },
    { letter: 'ס', name: 'סָמֶךְ', transliteration: 'Samech' },
    { letter: 'ע', name: 'עַיִן', transliteration: 'Ayin' },
    { letter: 'פ', name: 'פֵּא', transliteration: 'Pey' },
    { letter: 'צ', name: 'צדיק', transliteration: 'Tzadi' },
    { letter: 'ק', name: 'קוֹף', transliteration: 'Kuf' },
    { letter: 'ר', name: 'רֵישׁ', transliteration: 'Resh' },
    { letter: 'ש', name: 'שִׁין', transliteration: 'Shin' },
    { letter: 'ת', name: 'תָּאפ', transliteration: 'Tav' }
];

// Game state
let score = 0;
let questionNumber = 0;
let currentLetter = null;
let currentOptions = [];
let availableVoices = [];
let voicesLoaded = false;

// Adaptive learning - track wrong answers
let wrongAnswers = {}; // { letter: count }

// Load voices
function loadVoices() {
    availableVoices = window.speechSynthesis.getVoices();
    voicesLoaded = true;
    console.log('Voices loaded:', availableVoices.length);
    console.log('Hebrew voices:', availableVoices.filter(v => v.lang.includes('he')));
}

// Initialize wrong answers tracking
function initWrongAnswers() {
    hebrewAlphabet.forEach(item => {
        wrongAnswers[item.letter] = 0;
    });
}

// Get a letter with weighted probability (letters with more wrong answers appear more often)
function getWeightedRandomLetter() {
    // Create a weighted array - letters with wrong answers appear multiple times
    const weightedArray = [];

    hebrewAlphabet.forEach(item => {
        const wrongCount = wrongAnswers[item.letter] || 0;
        // Add the letter once, plus extra times based on wrong count (up to 5 extra)
        const weight = Math.min(1 + wrongCount, 6);
        for (let i = 0; i < weight; i++) {
            weightedArray.push(item);
        }
    });

    // Pick a random letter from the weighted array
    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    return weightedArray[randomIndex];
}

// Generate a new question
function generateQuestion() {
    questionNumber++;
    document.getElementById('progressText').textContent = `שאלה ${questionNumber}`;

    // Clear feedback
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';

    // Choose target letter using adaptive learning
    currentLetter = getWeightedRandomLetter();

    // Choose 3 random different letters as wrong options
    const otherLetters = hebrewAlphabet.filter(l => l.letter !== currentLetter.letter);
    const shuffled = otherLetters.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffled.slice(0, 3);

    // Combine and shuffle all options
    currentOptions = [currentLetter, ...wrongOptions].sort(() => Math.random() - 0.5);

    // Render options
    renderOptions();

    // Auto-play the letter name after a short delay
    setTimeout(() => {
        speakLetterName(currentLetter.name);
    }, 500);
}

// Render option cards
function renderOptions() {
    const optionsGrid = document.getElementById('optionsGrid');
    optionsGrid.innerHTML = '';

    currentOptions.forEach(option => {
        const card = document.createElement('div');
        card.className = 'option-card';

        card.innerHTML = `
            <span class="option-emoji">${option.letter}</span>
            <div class="option-word">${option.name}</div>
            <div class="option-meaning">${option.transliteration}</div>
        `;

        card.addEventListener('click', () => handleAnswer(card, option));

        optionsGrid.appendChild(card);
    });
}

// Handle answer selection
function handleAnswer(cardElement, selectedOption) {
    const feedback = document.getElementById('feedback');
    const allCards = document.querySelectorAll('.option-card');

    // Disable all cards
    allCards.forEach(card => card.classList.add('disabled'));

    if (selectedOption.letter === currentLetter.letter) {
        // Correct answer
        cardElement.classList.add('correct');
        feedback.textContent = '🎉 מצוין! כל הכבוד!';
        feedback.className = 'feedback correct';

        score += 10;
        document.getElementById('score').textContent = score;

        // Play success sound
        playSuccessSound();

        // Reset wrong count for this letter (they got it right!)
        if (wrongAnswers[currentLetter.letter] > 0) {
            wrongAnswers[currentLetter.letter] = Math.max(0, wrongAnswers[currentLetter.letter] - 1);
        }

        // Next question after delay
        setTimeout(() => {
            generateQuestion();
        }, 2500);

    } else {
        // Wrong answer
        cardElement.classList.add('wrong');
        feedback.textContent = '❌ לא נכון, נסה שוב!';
        feedback.className = 'feedback wrong';

        // Increase wrong count for this letter
        wrongAnswers[currentLetter.letter] = (wrongAnswers[currentLetter.letter] || 0) + 1;

        // Play letter name again to help them learn
        setTimeout(() => {
            speakLetterName(currentLetter.name);
            feedback.textContent = 'תקשיב שוב...';
        }, 1000);

        // Re-enable cards after animation
        setTimeout(() => {
            cardElement.classList.remove('wrong');
            allCards.forEach(card => card.classList.remove('disabled'));
        }, 2000);
    }
}

// Text-to-speech with improved pronunciation
function speakLetterName(letterName) {
    console.log('Speaking:', letterName);

    // Make sure voices are loaded
    if (!voicesLoaded || availableVoices.length === 0) {
        loadVoices();
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Small delay to ensure cancel completes
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(letterName);
        utterance.lang = 'he-IL';

        // Better settings for clearer pronunciation
        utterance.rate = 0.75; // Slower for better clarity
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 1.0; // Full volume

        // Try to find the best Hebrew voice
        const hebrewVoice = availableVoices.find(voice =>
            voice.lang === 'he-IL' || voice.lang === 'he'
        );

        if (hebrewVoice) {
            utterance.voice = hebrewVoice;
            console.log('Using Hebrew voice:', hebrewVoice.name);
        } else {
            console.log('No Hebrew voice found, using default');
        }

        utterance.onstart = () => {
            console.log('Speech started');
            document.getElementById('listenBtn').classList.add('playing');
        };

        utterance.onend = () => {
            console.log('Speech ended');
            document.getElementById('listenBtn').classList.remove('playing');
        };

        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            document.getElementById('listenBtn').classList.remove('playing');
        };

        window.speechSynthesis.speak(utterance);
    }, 100);
}

// Success sound effect
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 523.25; // C note
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
    loadVoices();
    initWrongAnswers();

    // Setup listen button
    document.getElementById('listenBtn').addEventListener('click', () => {
        if (currentLetter) {
            speakLetterName(currentLetter.name);
        }
    });

    // Start first question
    generateQuestion();
}

// Load voices when they become available
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Ensure voices are loaded after a delay
setTimeout(loadVoices, 100);
