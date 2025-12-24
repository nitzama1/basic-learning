# תרגול קריאה בעברית - Hebrew Reading Practice App

אפליקציית אינטרנט לתרגול קריאה והבנת הנקרא בעברית לילדי כיתה ג' (גילאי 8-9).

A web application for practicing Hebrew reading comprehension for 3rd grade students (ages 8-9).

## ✨ Features / תכונות

- 📖 **AI-Generated Content** - Fresh Hebrew reading passages generated automatically
- ❓ **Comprehension Questions** - 5 multiple-choice questions per passage
- 🎯 **Immediate Feedback** - Instant scoring with detailed results
- 🇮🇱 **Full Hebrew Interface** - Complete RTL design optimized for Hebrew
- 👶 **Child-Friendly Design** - Large fonts, clear layouts, positive reinforcement
- 💾 **Simple Setup** - No installation needed, runs in any web browser

## 🚀 Quick Start / התחלה מהירה

### 1. Get an Anthropic API Key / קבלת מפתח API

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to "API Keys"
4. Create a new API key and copy it

**Cost Estimate**: Each quiz generation costs approximately $0.01-0.02 USD. With $5 of credit, you can generate hundreds of reading passages.

### 2. Open the Application / פתיחת האפליקציה

Simply open the `index.html` file in any modern web browser:
- Double-click the file
- Or right-click → "Open with" → Choose your browser
- Or drag the file into an open browser window

### 3. Configure Your API Key / הגדרת מפתח ה-API

On first use:
1. The app will show a configuration screen
2. Paste your Anthropic API key
3. Click "שמור והתחל" (Save and Start)
4. The key is stored locally on your computer only

### 4. Start Practicing! / התחל לתרגל!

1. Click "צור טקסט חדש" (Generate New Text)
2. Wait for the reading passage to be generated
3. Read the text carefully
4. Answer all 5 questions
5. Click "שלח תשובות" (Submit Answers)
6. Review your score and correct answers
7. Generate a new text to keep practicing!

## 📁 File Structure / מבנה הקבצים

```
reading/
├── index.html           # Main HTML file / קובץ HTML ראשי
├── styles.css           # Styling and layout / עיצוב ומבנה
├── config.js            # Configuration constants / קבועי הגדרה
├── api-handler.js       # API communication / תקשורת API
├── quiz-generator.js    # Quiz logic / לוגיקת שאלון
├── app.js               # Main application / אפליקציה ראשית
└── README.md            # This file / קובץ זה
```

## 🎓 For Parents and Educators / להורים ומחנכים

### Educational Benefits / יתרונות חינוכיים

- **Reading Comprehension**: Tests understanding of the text, not just word recognition
- **Age-Appropriate Content**: Vocabulary and complexity matched to 3rd grade level
- **Varied Topics**: Different subjects to maintain interest and engagement
- **Positive Reinforcement**: Encouraging messages regardless of score
- **Unlimited Practice**: Generate as many texts as needed

### Question Types / סוגי שאלות

The app generates three types of questions:
1. **Reading Comprehension** (2 questions) - Understanding the main ideas
2. **Detail Recall** (2 questions) - Remembering specific information
3. **Inference** (1 question) - Drawing conclusions from the text

### Topics Covered / נושאים מכוסים

- Animals (בעלי חיים)
- Family (משפחה)
- School (בית ספר)
- Nature (טבע)
- Adventures (הרפתקאות)
- Friendship (חברות)
- Sports (ספורט)
- Simple Science (מדע פשוט)
- Holidays (חגים)
- Food (אוכל)
- Weather (מזג אוויר)
- Plants (צמחים)

## 🔧 Technical Details / פרטים טכניים

### Requirements / דרישות

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for generating new content)
- Anthropic API key

### Technology Stack / טכנולוגיות

- **Frontend**: Vanilla HTML/CSS/JavaScript (no frameworks)
- **API**: Anthropic Claude 3.5 Sonnet
- **Storage**: localStorage (browser-based)
- **Design**: RTL-optimized for Hebrew

### Browser Compatibility / תאימות דפדפנים

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Privacy & Security / פרטיות ואבטחה

- API key stored **locally** in your browser only
- No data sent to external servers except Anthropic API
- No tracking or analytics
- No user data collection

## 🛠️ Troubleshooting / פתרון בעיות

### "Invalid API Key" Error / שגיאת "מפתח API לא תקין"

- Double-check that you copied the entire API key
- Make sure there are no extra spaces
- Verify the key is active in your Anthropic console
- Try generating a new API key

### "Too Many Requests" Error / שגיאת "יותר מדי בקשות"

- Wait a few moments before generating new content
- You may have hit rate limits; wait 1-2 minutes
- Check your Anthropic account for usage limits

### "Network Error" / שגיאת חיבור

- Check your internet connection
- Try refreshing the page
- Check if your firewall is blocking the connection

### Questions Don't Display Correctly / שאלות לא מוצגות כראוי

- Make sure your browser supports RTL text
- Try refreshing the page
- Clear browser cache and reload

### Need to Change API Key / צריך לשנות מפתח API

1. Click the "הגדרות" (Settings) button
2. Click "מחק מפתח API" (Clear API Key)
3. Enter your new API key

## 💡 Tips for Best Results / טיפים לתוצאות הטובות ביותר

### For Children / לילדים

1. Read the text twice before answering
2. Take your time - there's no rush
3. Try to answer all questions before submitting
4. Learn from the detailed results
5. Generate new texts to practice more

### For Parents / להורים

1. Sit with your child during first use
2. Encourage reading aloud for better comprehension
3. Discuss the correct answers together
4. Use it as a daily practice routine (5-10 minutes)
5. Celebrate progress, not just perfect scores

## 🔒 Data & Costs / נתונים ועלויות

### API Usage Costs / עלויות שימוש ב-API

- Approximately $0.01-0.02 per quiz generation
- $5 credit = ~250-500 quizzes
- $20 credit = ~1,000-2,000 quizzes
- Monitor usage at [console.anthropic.com](https://console.anthropic.com)

### Data Storage / אחסון נתונים

- Only API key is stored locally
- No quiz history saved
- No personal information collected
- All data stays on your computer

## 📝 Customization / התאמה אישית

Advanced users can modify the app:

### Change Topics / שינוי נושאים
Edit `CONFIG.TOPICS` in [config.js](config.js:26) to add or remove topics.

### Adjust Difficulty / התאמת רמת קושי
Edit the prompt in [api-handler.js](api-handler.js:48) to change grade level or text length.

### Change Encouragement Messages / שינוי הודעות עידוד
Edit `CONFIG.ENCOURAGEMENT_MESSAGES` in [config.js](config.js:37) to customize feedback messages.

### Styling Changes / שינויי עיצוב
Edit [styles.css](styles.css) to change colors, fonts, or layout.

## 🤝 Support & Feedback / תמיכה ומשוב

### Issues / בעיות
If you encounter problems, check:
1. Browser console for error messages (F12)
2. API key validity in Anthropic console
3. Internet connection stability

### Feature Requests / בקשות לתכונות
This is an open-source educational tool. Feel free to modify and enhance it for your needs.

## 📜 License / רישיון

This project is provided as-is for educational purposes. Feel free to use, modify, and distribute.

## 🙏 Credits / קרדיטים

- **AI Model**: Anthropic Claude 3.5 Sonnet
- **Fonts**: Google Fonts (Heebo)
- **Design**: Child-friendly RTL web design principles

## 🌟 Version / גרסה

Version 1.0.0 - Initial Release

---

**Made with ❤️ for Hebrew learners**

**נוצר באהבה עבור לומדי עברית**
