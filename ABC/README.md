# Hebrew Alphabet Learning App - למד את האלף-בית

A fun, interactive Flask web application to help children learn the Hebrew alphabet (Alef-Bet) by connecting letters with words.

## Features

🔤 **All 22 Hebrew Letters** - Complete Alef-Bet from א to ת

🎮 **Three Interactive Games**:
   - **Hebrew ABC Learning** - Match letters with words
   - **Listening Game** - Listen and identify letters
   - **Writing Game** - Spell words using Hebrew letters

🔊 **Text-to-Speech** - Hear the pronunciation of letters and words in Hebrew

🌈 **Colorful, Child-Friendly Design** - Engaging animations and vibrant colors

📊 **Progress Tracking** - Visual indicators show which letters have been learned

🎯 **Instant Feedback** - Positive reinforcement for correct answers

## Installation

1. **Clone or download this repository**

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5000`
   - The main menu will appear with all available games

## How to Use

1. **Start the Application**
   - Run `python app.py` from the command line
   - Open your browser to `http://localhost:5000`
   - Select a game from the main menu

2. **Hebrew ABC Learning Game**
   - The current letter is displayed in large text at the top
   - Click the "🔊 שמע את האות" button to hear the letter pronounced
   - Four words are shown below - click on the words that START with the current letter
   - Correct answers will turn green with celebration
   - Wrong answers will shake and turn red
   - Click "אות הבאה" to move to the next letter

3. **Listening Game**
   - Click the listen button to hear a letter name
   - Choose the correct letter from the options
   - Track your score as you progress

4. **Writing Game**
   - Listen to a Hebrew word
   - Spell it using the on-screen Hebrew keyboard
   - Check your answer and earn points

5. **Quick Navigation**
   - Use the back button to return to the main menu
   - Navigate between different games freely

## Technical Requirements

- Python 3.7 or higher
- Flask web framework (installed via requirements.txt)
- Modern web browser with JavaScript enabled
- Browser with Hebrew font support (all modern browsers)
- Text-to-speech requires browser support (works in Chrome, Firefox, Safari, Edge)

## Features Explained

### Text-to-Speech (TTS)
- The app uses your browser's built-in Hebrew speech synthesis
- Automatically speaks each letter when loaded
- Click the speaker buttons (🔊) to hear letters and words again
- Speech is slowed down for easier learning

### Word Examples
Each letter comes with 4 example words:
- 2 words that START with that letter (correct answers)
- 2 words that DON'T start with that letter (wrong answers)
- All words include Hebrew text and English meaning

### Responsive Design
- Works on desktop computers, tablets, and mobile devices
- Adapts layout for different screen sizes
- Touch-friendly buttons for tablets

## Tips for Parents

1. **Practice Together** - Sit with your child and practice together
2. **Repetition** - Go through letters multiple times
3. **Celebrate Success** - Encourage your child when they get correct answers
4. **Use the Audio** - Make sure to use the speaker buttons to reinforce pronunciation
5. **No Pressure** - Learning should be fun! Take breaks when needed

## Browser Compatibility

✅ Google Chrome (Recommended - best Hebrew TTS support)
✅ Microsoft Edge
✅ Firefox
✅ Safari
⚠️ Older browsers may have limited TTS support

## Project Structure

```
ABC/
├── app.py                      # Flask application (main entry point)
├── requirements.txt            # Python dependencies
├── templates/                  # HTML templates
│   ├── menu.html              # Main menu
│   ├── index.html             # Hebrew ABC learning game
│   ├── listening-game.html    # Listening game
│   └── writing-game.html      # Writing game
├── static/                     # Static assets
│   ├── css/                   # Stylesheets
│   │   ├── menu-styles.css
│   │   ├── styles.css
│   │   ├── listening-game.css
│   │   └── writing-game.css
│   └── js/                    # JavaScript files
│       ├── script.js
│       ├── listening-game.js
│       └── writing-game.js
└── README.md                   # This file
```

## Troubleshooting

**No sound/speech?**
- Check your device volume
- Try using Google Chrome for best Hebrew TTS support
- Some browsers require user interaction before playing audio

**Text appears backwards?**
- This is normal! Hebrew is written right-to-left
- The app automatically handles Hebrew text direction

**Words or letters don't display correctly?**
- Update your browser to the latest version
- Ensure Hebrew language support is installed on your system

## Learning Progress

The app tracks which letters your child has practiced by marking them green in the bottom grid. This provides visual motivation and helps you see progress!

## Enjoy Learning! בהצלחה! 🎉

Have fun learning the Hebrew alphabet!
