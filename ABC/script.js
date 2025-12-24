// Hebrew Alphabet with example words
const hebrewAlphabet = [
    { letter: 'א', name: 'אָלֶף', words: [
        { word: 'אַבָּא', meaning: 'Abba (Dad)', emoji: '👨', isCorrect: true },
        { word: 'בַּיִת', meaning: 'Bayit (House)', emoji: '🏠', isCorrect: false },
        { word: 'אִמָּא', meaning: 'Ima (Mom)', emoji: '👩', isCorrect: true },
        { word: 'גָּמָל', meaning: 'Gamal (Camel)', emoji: '🐪', isCorrect: false }
    ]},
    { letter: 'ב', name: 'בֵּית', words: [
        { word: 'בַּיִת', meaning: 'Bayit (House)', emoji: '🏠', isCorrect: true },
        { word: 'בָּנָנָה', meaning: 'Banana', emoji: '🍌', isCorrect: true },
        { word: 'אַבָּא', meaning: 'Abba (Dad)', emoji: '👨', isCorrect: false },
        { word: 'כֶּלֶב', meaning: 'Kelev (Dog)', emoji: '🐕', isCorrect: false }
    ]},
    { letter: 'ג', name: 'גִּימֶל', words: [
        { word: 'גָּמָל', meaning: 'Gamal (Camel)', emoji: '🐪', isCorrect: true },
        { word: 'גִּינָה', meaning: 'Gina (Garden)', emoji: '🌻', isCorrect: true },
        { word: 'דַּג', meaning: 'Dag (Fish)', emoji: '🐟', isCorrect: false },
        { word: 'חָתוּל', meaning: 'Chatul (Cat)', emoji: '🐱', isCorrect: false }
    ]},
    { letter: 'ד', name: 'דָּלֶת', words: [
        { word: 'דַּג', meaning: 'Dag (Fish)', emoji: '🐟', isCorrect: true },
        { word: 'דֶּלֶת', meaning: 'Delet (Door)', emoji: '🚪', isCorrect: true },
        { word: 'הַר', meaning: 'Har (Mountain)', emoji: '⛰️', isCorrect: false },
        { word: 'וָרֹד', meaning: 'Vered (Rose)', emoji: '🌹', isCorrect: false }
    ]},
    { letter: 'ה', name: 'הֵא', words: [
        { word: 'הַר', meaning: 'Har (Mountain)', emoji: '⛰️', isCorrect: true },
        { word: 'הוֹרִים', meaning: 'Horim (Parents)', emoji: '👨‍👩‍👧', isCorrect: true },
        { word: 'זֶבְרָה', meaning: 'Zebra', emoji: '🦓', isCorrect: false },
        { word: 'חָלָב', meaning: 'Chalav (Milk)', emoji: '🥛', isCorrect: false }
    ]},
    { letter: 'ו', name: 'וָו', words: [
        { word: 'וָרֹד', meaning: 'Vered (Rose)', emoji: '🌹', isCorrect: true },
        { word: 'וִילוֹן', meaning: 'Vilon (Curtain)', emoji: '🪟', isCorrect: true },
        { word: 'זַיִת', meaning: 'Zayit (Olive)', emoji: '🫒', isCorrect: false },
        { word: 'טֶלֶפוֹן', meaning: 'Telefon (Phone)', emoji: '📱', isCorrect: false }
    ]},
    { letter: 'ז', name: 'זַיִן', words: [
        { word: 'זֶבְרָה', meaning: 'Zebra', emoji: '🦓', isCorrect: true },
        { word: 'זַיִת', meaning: 'Zayit (Olive)', emoji: '🫒', isCorrect: true },
        { word: 'חָתוּל', meaning: 'Chatul (Cat)', emoji: '🐱', isCorrect: false },
        { word: 'יָד', meaning: 'Yad (Hand)', emoji: '✋', isCorrect: false }
    ]},
    { letter: 'ח', name: 'חֵית', words: [
        { word: 'חָתוּל', meaning: 'Chatul (Cat)', emoji: '🐱', isCorrect: true },
        { word: 'חָלָב', meaning: 'Chalav (Milk)', emoji: '🥛', isCorrect: true },
        { word: 'טֶלֶפוֹן', meaning: 'Telefon (Phone)', emoji: '📱', isCorrect: false },
        { word: 'יָם', meaning: 'Yam (Sea)', emoji: '🌊', isCorrect: false }
    ]},
    { letter: 'ט', name: 'טֵית', words: [
        { word: 'טֶלֶפוֹן', meaning: 'Telefon (Phone)', emoji: '📱', isCorrect: true },
        { word: 'טָבָּעַת', meaning: 'Tabaat (Ring)', emoji: '💍', isCorrect: true },
        { word: 'כַּדּוּר', meaning: 'Kadur (Ball)', emoji: '⚽', isCorrect: false },
        { word: 'לֶחֶם', meaning: 'Lechem (Bread)', emoji: '🍞', isCorrect: false }
    ]},
    { letter: 'י', name: 'יוֹד', words: [
        { word: 'יָד', meaning: 'Yad (Hand)', emoji: '✋', isCorrect: true },
        { word: 'יָם', meaning: 'Yam (Sea)', emoji: '🌊', isCorrect: true },
        { word: 'כֶּלֶב', meaning: 'Kelev (Dog)', emoji: '🐕', isCorrect: false },
        { word: 'מַיִם', meaning: 'Mayim (Water)', emoji: '💧', isCorrect: false }
    ]},
    { letter: 'כ', name: 'כַּף', words: [
        { word: 'כֶּלֶב', meaning: 'Kelev (Dog)', emoji: '🐕', isCorrect: true },
        { word: 'כַּדּוּר', meaning: 'Kadur (Ball)', emoji: '⚽', isCorrect: true },
        { word: 'לֶחֶם', meaning: 'Lechem (Bread)', emoji: '🍞', isCorrect: false },
        { word: 'מַיִם', meaning: 'Mayim (Water)', emoji: '💧', isCorrect: false }
    ]},
    { letter: 'ל', name: 'לָמֶד', words: [
        { word: 'לֶחֶם', meaning: 'Lechem (Bread)', emoji: '🍞', isCorrect: true },
        { word: 'לֵב', meaning: 'Lev (Heart)', emoji: '❤️', isCorrect: true },
        { word: 'מַיִם', meaning: 'Mayim (Water)', emoji: '💧', isCorrect: false },
        { word: 'נֵר', meaning: 'Ner (Candle)', emoji: '🕯️', isCorrect: false }
    ]},
    { letter: 'מ', name: 'מֵם', words: [
        { word: 'מַיִם', meaning: 'Mayim (Water)', emoji: '💧', isCorrect: true },
        { word: 'מֶלֶךְ', meaning: 'Melech (King)', emoji: '🤴', isCorrect: true },
        { word: 'נֵר', meaning: 'Ner (Candle)', emoji: '🕯️', isCorrect: false },
        { word: 'סוּס', meaning: 'Sus (Horse)', emoji: '🐴', isCorrect: false }
    ]},
    { letter: 'נ', name: 'נוּן', words: [
        { word: 'נֵר', meaning: 'Ner (Candle)', emoji: '🕯️', isCorrect: true },
        { word: 'נָחָשׁ', meaning: 'Nachash (Snake)', emoji: '🐍', isCorrect: true },
        { word: 'סוּס', meaning: 'Sus (Horse)', emoji: '🐴', isCorrect: false },
        { word: 'עֵץ', meaning: 'Etz (Tree)', emoji: '🌳', isCorrect: false }
    ]},
    { letter: 'ס', name: 'סָמֶךְ', words: [
        { word: 'סוּס', meaning: 'Sus (Horse)', emoji: '🐴', isCorrect: true },
        { word: 'סֵפֶר', meaning: 'Sefer (Book)', emoji: '📖', isCorrect: true },
        { word: 'עֵץ', meaning: 'Etz (Tree)', emoji: '🌳', isCorrect: false },
        { word: 'פֶּרַח', meaning: 'Perach (Flower)', emoji: '🌸', isCorrect: false }
    ]},
    { letter: 'ע', name: 'עַיִן', words: [
        { word: 'עֵץ', meaning: 'Etz (Tree)', emoji: '🌳', isCorrect: true },
        { word: 'עַיִן', meaning: 'Ayin (Eye)', emoji: '👁️', isCorrect: true },
        { word: 'פֶּרַח', meaning: 'Perach (Flower)', emoji: '🌸', isCorrect: false },
        { word: 'צִפּוֹר', meaning: 'Tzipor (Bird)', emoji: '🐦', isCorrect: false }
    ]},
    { letter: 'פ', name: 'פֵּא', words: [
        { word: 'פֶּרַח', meaning: 'Perach (Flower)', emoji: '🌸', isCorrect: true },
        { word: 'פִּיל', meaning: 'Pil (Elephant)', emoji: '🐘', isCorrect: true },
        { word: 'צִפּוֹר', meaning: 'Tzipor (Bird)', emoji: '🐦', isCorrect: false },
        { word: 'קוֹף', meaning: 'Kof (Monkey)', emoji: '🐵', isCorrect: false }
    ]},
    { letter: 'צ', name: 'צַדִּי', words: [
        { word: 'צִפּוֹר', meaning: 'Tzipor (Bird)', emoji: '🐦', isCorrect: true },
        { word: 'צַב', meaning: 'Tzav (Turtle)', emoji: '🐢', isCorrect: true },
        { word: 'קוֹף', meaning: 'Kof (Monkey)', emoji: '🐵', isCorrect: false },
        { word: 'רֹאשׁ', meaning: 'Rosh (Head)', emoji: '🧑', isCorrect: false }
    ]},
    { letter: 'ק', name: 'קוֹף', words: [
        { word: 'קוֹף', meaning: 'Kof (Monkey)', emoji: '🐵', isCorrect: true },
        { word: 'קָפֶה', meaning: 'Kafe (Coffee)', emoji: '☕', isCorrect: true },
        { word: 'רֹאשׁ', meaning: 'Rosh (Head)', emoji: '🧑', isCorrect: false },
        { word: 'שֶׁמֶשׁ', meaning: 'Shemesh (Sun)', emoji: '☀️', isCorrect: false }
    ]},
    { letter: 'ר', name: 'רֵישׁ', words: [
        { word: 'רֹאשׁ', meaning: 'Rosh (Head)', emoji: '🧑', isCorrect: true },
        { word: 'רֶגֶל', meaning: 'Regel (Leg/Foot)', emoji: '🦵', isCorrect: true },
        { word: 'שֶׁמֶשׁ', meaning: 'Shemesh (Sun)', emoji: '☀️', isCorrect: false },
        { word: 'תַּפּוּחַ', meaning: 'Tapuach (Apple)', emoji: '🍎', isCorrect: false }
    ]},
    { letter: 'ש', name: 'שִׁין', words: [
        { word: 'שֶׁמֶשׁ', meaning: 'Shemesh (Sun)', emoji: '☀️', isCorrect: true },
        { word: 'שֻׁלְחָן', meaning: 'Shulchan (Table)', emoji: '🪑', isCorrect: true },
        { word: 'תַּפּוּחַ', meaning: 'Tapuach (Apple)', emoji: '🍎', isCorrect: false },
        { word: 'אַבָּא', meaning: 'Abba (Dad)', emoji: '👨', isCorrect: false }
    ]},
    { letter: 'ת', name: 'תָּו', words: [
        { word: 'תַּפּוּחַ', meaning: 'Tapuach (Apple)', emoji: '🍎', isCorrect: true },
        { word: 'תּוּת', meaning: 'Tut (Strawberry)', emoji: '🍓', isCorrect: true },
        { word: 'אִמָּא', meaning: 'Ima (Mom)', emoji: '👩', isCorrect: false },
        { word: 'בַּיִת', meaning: 'Bayit (House)', emoji: '🏠', isCorrect: false }
    ]}
];

// Game state
let currentLetterIndex = 0;
let learnedLetters = new Set();
let voicesLoaded = false;
let availableVoices = [];

// Load voices
function loadVoices() {
    availableVoices = window.speechSynthesis.getVoices();
    voicesLoaded = true;
    console.log('Voices loaded:', availableVoices.length);
    console.log('Hebrew voices:', availableVoices.filter(v => v.lang.includes('he')));
}

// Initialize the game
function init() {
    // Load voices
    loadVoices();

    // Setup event listeners
    document.getElementById('speakLetter').addEventListener('click', speakLetter);
    document.getElementById('nextBtn').addEventListener('click', nextLetter);

    renderAlphabetGrid();
    loadLetter(currentLetterIndex);
}

// Render all letters in the alphabet grid
function renderAlphabetGrid() {
    const container = document.getElementById('lettersContainer');
    container.innerHTML = '';

    hebrewAlphabet.forEach((item, index) => {
        const letterDiv = document.createElement('div');
        letterDiv.className = 'mini-letter';
        letterDiv.textContent = item.letter;
        letterDiv.onclick = () => {
            currentLetterIndex = index;
            loadLetter(index);
        };

        if (index === currentLetterIndex) {
            letterDiv.classList.add('current');
        }
        if (learnedLetters.has(index)) {
            letterDiv.classList.add('learned');
        }

        container.appendChild(letterDiv);
    });
}

// Load a specific letter
function loadLetter(index) {
    currentLetterIndex = index;
    const letterData = hebrewAlphabet[index];

    // Update letter display
    document.getElementById('currentLetter').textContent = letterData.letter;

    // Update progress
    document.getElementById('progressText').textContent = `אות ${index + 1} מתוך ${hebrewAlphabet.length}`;

    // Clear feedback
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';

    // Render word cards
    renderWords(letterData.words);

    // Update alphabet grid
    renderAlphabetGrid();
}

// Render word options
function renderWords(words) {
    const wordsGrid = document.getElementById('wordsGrid');
    wordsGrid.innerHTML = '';

    // Shuffle words for variety
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    shuffledWords.forEach(wordData => {
        const wordCard = document.createElement('div');
        wordCard.className = 'word-card';

        wordCard.innerHTML = `
            <div class="word-emoji">${wordData.emoji}</div>
            <div class="word-text">${wordData.word}</div>
            <div class="word-meaning">${wordData.meaning}</div>
            <button class="word-speaker">🔊</button>
        `;

        // Add click handler for the speaker button
        const speakerBtn = wordCard.querySelector('.word-speaker');
        speakerBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering word card click
            speakWord(wordData.word);
        });

        // Add click handler for the word card
        wordCard.addEventListener('click', () => handleWordClick(wordCard, wordData));

        wordsGrid.appendChild(wordCard);
    });
}

// Handle word card click
function handleWordClick(cardElement, wordData) {
    const feedback = document.getElementById('feedback');

    // Speak the word
    speakWord(wordData.word);

    if (wordData.isCorrect) {
        cardElement.classList.add('correct');
        feedback.textContent = '🎉 כל הכבוד! Excellent!';
        feedback.className = 'feedback correct';

        // Mark letter as learned
        learnedLetters.add(currentLetterIndex);

        // Celebrate with sound (optional)
        playSuccessSound();

    } else {
        cardElement.classList.add('wrong');
        feedback.textContent = '❌ נסה שוב! Try again!';
        feedback.className = 'feedback wrong';

        // Remove wrong class after animation
        setTimeout(() => {
            cardElement.classList.remove('wrong');
        }, 500);
    }
}

// Move to next letter
function nextLetter() {
    if (currentLetterIndex < hebrewAlphabet.length - 1) {
        currentLetterIndex++;
    } else {
        currentLetterIndex = 0; // Loop back to start
    }
    loadLetter(currentLetterIndex);
}

// Text-to-speech functions
function speakLetter() {
    const letterData = hebrewAlphabet[currentLetterIndex];
    // Speak the full name of the letter (e.g., "אָלֶף" instead of just "א")
    speak(letterData.name);
}

function speakWord(word) {
    speak(word);
}

function speak(text) {
    console.log('Attempting to speak:', text);

    // Make sure voices are loaded
    if (!voicesLoaded || availableVoices.length === 0) {
        loadVoices();
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Small delay to ensure cancel completes
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL'; // Hebrew language

        // Better settings for clearer pronunciation
        utterance.rate = 0.75; // Slower for better clarity
        utterance.pitch = 1.0; // Normal pitch for clearer sound
        utterance.volume = 1.0; // Full volume

        // Try to find the best Hebrew voice (prefer he-IL over generic he)
        const hebrewVoice = availableVoices.find(voice =>
            voice.lang === 'he-IL' || voice.lang === 'he'
        );

        if (hebrewVoice) {
            utterance.voice = hebrewVoice;
            console.log('Using Hebrew voice:', hebrewVoice.name);
        } else {
            console.log('No Hebrew voice found, using default voice');
            console.log('Available voices:', availableVoices.map(v => v.lang + ': ' + v.name));
        }

        utterance.onstart = () => console.log('Speech started');
        utterance.onend = () => console.log('Speech ended');
        utterance.onerror = (e) => console.error('Speech error:', e);

        window.speechSynthesis.speak(utterance);
    }, 100);
}

// Success sound effect (using Web Audio API)
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
        // Ignore errors if Web Audio API is not supported
    }
}

// Load voices when they become available
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Ensure voices are loaded after a delay (for some browsers)
setTimeout(loadVoices, 100);
