// Hebrew Math Word Problems Game with Adaptive Difficulty
class HebrewMathGame {
    constructor() {
        this.difficulty = 1; // Starts at 1, increases/decreases based on performance
        this.score = 0;
        this.streak = 0;
        this.questionCount = 0;
        this.currentQuestion = null;
        this.isPlaying = false;
        this.soundEnabled = true;

        // Question bank organized by difficulty (1-10)
        // Math word problems for 3rd grade in Hebrew
        this.questionBank = [
            // Difficulty 1 - Simple addition (up to 10)
            {
                difficulty: 1,
                passage: "לדני יש 3 תפוחים. אמא נתנה לו עוד 2 תפוחים.",
                question: "כמה תפוחים יש לדני עכשיו?",
                answers: ["5", "4", "6", "3"],
                correct: 0
            },
            {
                difficulty: 1,
                passage: "בגן יש 4 ילדים. הגיעו עוד 3 ילדים.",
                question: "כמה ילדים יש בגן עכשיו?",
                answers: ["7", "6", "8", "5"],
                correct: 0
            },
            {
                difficulty: 1,
                passage: "לרונית יש 5 עפרונות. היא קנתה עוד 2 עפרונות.",
                question: "כמה עפרונות יש לרונית?",
                answers: ["7", "6", "8", "5"],
                correct: 0
            },
            {
                difficulty: 1,
                passage: "על השולחן יש 2 כוסות. אבא הוסיף עוד 3 כוסות.",
                question: "כמה כוסות יש על השולחן?",
                answers: ["5", "4", "6", "3"],
                correct: 0
            },
            {
                difficulty: 1,
                passage: "לילי יש 6 בובות. היא קיבלה עוד בובה במתנה.",
                question: "כמה בובות יש לה עכשיו?",
                answers: ["7", "6", "8", "5"],
                correct: 0
            },
            {
                difficulty: 1,
                passage: "בצלחת היו 4 עוגיות. אמא הוסיפה עוד 4 עוגיות.",
                question: "כמה עוגיות יש בצלחת?",
                answers: ["8", "7", "9", "6"],
                correct: 0
            },

            // Difficulty 2 - Simple subtraction (up to 10)
            {
                difficulty: 2,
                passage: "ליוסי היו 8 עוגיות. הוא אכל 3 עוגיות.",
                question: "כמה עוגיות נשארו ליוסי?",
                answers: ["5", "4", "6", "7"],
                correct: 0
            },
            {
                difficulty: 2,
                passage: "בכיס היו 10 שקלים. קניתי ממתק ב-4 שקלים.",
                question: "כמה כסף נשאר בכיס?",
                answers: ["6", "5", "7", "8"],
                correct: 0
            },
            {
                difficulty: 2,
                passage: "בעץ ישבו 9 ציפורים. 4 ציפורים עפו משם.",
                question: "כמה ציפורים נשארו על העץ?",
                answers: ["5", "4", "6", "3"],
                correct: 0
            },
            {
                difficulty: 2,
                passage: "למורה היו 7 עפרונות. היא נתנה 2 עפרונות לתלמידים.",
                question: "כמה עפרונות נשארו למורה?",
                answers: ["5", "4", "6", "3"],
                correct: 0
            },
            {
                difficulty: 2,
                passage: "בקופסה היו 6 סוכריות. אכלתי 3 סוכריות.",
                question: "כמה סוכריות נשארו בקופסה?",
                answers: ["3", "2", "4", "5"],
                correct: 0
            },
            {
                difficulty: 2,
                passage: "היו לי 9 בלונים. 5 בלונים עפו.",
                question: "כמה בלונים נשארו לי?",
                answers: ["4", "3", "5", "6"],
                correct: 0
            },

            // Difficulty 3 - Addition up to 20
            {
                difficulty: 3,
                passage: "בכיתה יש 12 בנות ו-7 בנים.",
                question: "כמה ילדים יש בכיתה בסך הכל?",
                answers: ["19", "18", "20", "17"],
                correct: 0
            },
            {
                difficulty: 3,
                passage: "נועה קראה 8 עמודים בבוקר ו-6 עמודים אחר הצהריים.",
                question: "כמה עמודים נועה קראה בסך הכל?",
                answers: ["14", "13", "15", "12"],
                correct: 0
            },
            {
                difficulty: 3,
                passage: "בחנות יש 11 כדורים אדומים ו-9 כדורים כחולים.",
                question: "כמה כדורים יש בחנות?",
                answers: ["20", "19", "21", "18"],
                correct: 0
            },
            {
                difficulty: 3,
                passage: "אבא קנה 13 תפוחים ו-5 בננות.",
                question: "כמה פירות קנה אבא?",
                answers: ["18", "17", "19", "16"],
                correct: 0
            },
            {
                difficulty: 3,
                passage: "בגינה יש 9 ורדים ו-7 חצבים.",
                question: "כמה פרחים יש בגינה?",
                answers: ["16", "15", "17", "14"],
                correct: 0
            },
            {
                difficulty: 3,
                passage: "לילד יש 14 מכוניות צעצוע ו-6 משאיות צעצוע.",
                question: "כמה כלי רכב יש לו?",
                answers: ["20", "19", "21", "18"],
                correct: 0
            },

            // Difficulty 4 - Subtraction up to 20
            {
                difficulty: 4,
                passage: "לתומר היו 18 מדבקות. הוא נתן לחבר שלו 7 מדבקות.",
                question: "כמה מדבקות נשארו לתומר?",
                answers: ["11", "10", "12", "9"],
                correct: 0
            },
            {
                difficulty: 4,
                passage: "באוטובוס היו 15 נוסעים. 8 נוסעים ירדו בתחנה.",
                question: "כמה נוסעים נשארו באוטובוס?",
                answers: ["7", "6", "8", "9"],
                correct: 0
            },
            {
                difficulty: 4,
                passage: "מיכל אספה 20 קונכיות. היא נתנה לאחותה 6 קונכיות.",
                question: "כמה קונכיות נשארו למיכל?",
                answers: ["14", "13", "15", "12"],
                correct: 0
            },
            {
                difficulty: 4,
                passage: "בסל היו 17 תפוזים. אכלנו 9 תפוזים.",
                question: "כמה תפוזים נשארו בסל?",
                answers: ["8", "7", "9", "10"],
                correct: 0
            },
            {
                difficulty: 4,
                passage: "לחנות היו 19 שקיות שבבים. מכרו 11 שקיות.",
                question: "כמה שקיות נשארו?",
                answers: ["8", "7", "9", "10"],
                correct: 0
            },
            {
                difficulty: 4,
                passage: "בגן היו 16 ילדים. 7 ילדים הלכו הביתה.",
                question: "כמה ילדים נשארו בגן?",
                answers: ["9", "8", "10", "7"],
                correct: 0
            },

            // Difficulty 5 - Simple multiplication (×2, ×3, ×5)
            {
                difficulty: 5,
                passage: "בכל קופסה יש 5 עטים. יש לנו 4 קופסאות.",
                question: "כמה עטים יש לנו בסך הכל?",
                answers: ["20", "15", "25", "10"],
                correct: 0
            },
            {
                difficulty: 5,
                passage: "כל ילד קיבל 3 ממתקים. יש 6 ילדים.",
                question: "כמה ממתקים חולקו בסך הכל?",
                answers: ["18", "15", "21", "12"],
                correct: 0
            },
            {
                difficulty: 5,
                passage: "בכל צלחת יש 2 עוגיות. יש 7 צלחות.",
                question: "כמה עוגיות יש בסך הכל?",
                answers: ["14", "12", "16", "10"],
                correct: 0
            },
            {
                difficulty: 5,
                passage: "בכל שקית יש 5 תפוחים. קניתי 3 שקיות.",
                question: "כמה תפוחים קניתי?",
                answers: ["15", "10", "20", "12"],
                correct: 0
            },
            {
                difficulty: 5,
                passage: "כל תלמיד קיבל 2 דפים. יש 9 תלמידים.",
                question: "כמה דפים חולקו?",
                answers: ["18", "16", "20", "14"],
                correct: 0
            },
            {
                difficulty: 5,
                passage: "בכל שורה יש 3 כוכבים. יש 5 שורות.",
                question: "כמה כוכבים יש בסך הכל?",
                answers: ["15", "12", "18", "10"],
                correct: 0
            },

            // Difficulty 6 - Two-step problems (addition/subtraction)
            {
                difficulty: 6,
                passage: "לדן היו 12 שקלים. הוא קיבל מאמא 8 שקלים וקנה משחק ב-15 שקלים.",
                question: "כמה כסף נשאר לדן?",
                answers: ["5", "4", "6", "3"],
                correct: 0
            },
            {
                difficulty: 6,
                passage: "בספרייה היו 25 ספרים. לקחו 10 ספרים והוסיפו 8 ספרים חדשים.",
                question: "כמה ספרים יש בספרייה עכשיו?",
                answers: ["23", "22", "24", "21"],
                correct: 0
            },
            {
                difficulty: 6,
                passage: "שרה אספה 14 פרחים בבוקר ו-9 פרחים אחר הצהריים. היא נתנה 7 פרחים לאמא.",
                question: "כמה פרחים נשארו לשרה?",
                answers: ["16", "15", "17", "14"],
                correct: 0
            },
            {
                difficulty: 6,
                passage: "ליוסי היו 20 מדבקות. הוא קיבל עוד 15 מדבקות והדביק 18 מדבקות בספר.",
                question: "כמה מדבקות נשארו ליוסי?",
                answers: ["17", "16", "18", "15"],
                correct: 0
            },
            {
                difficulty: 6,
                passage: "בגן היו 30 ילדים. הגיעו עוד 12 ילדים ואז 16 ילדים הלכו הביתה.",
                question: "כמה ילדים יש בגן עכשיו?",
                answers: ["26", "25", "27", "24"],
                correct: 0
            },
            {
                difficulty: 6,
                passage: "רונית קראה 18 עמודים בספר. היא קראה עוד 7 עמודים ואז חזרה אחורה 5 עמודים.",
                question: "באיזה עמוד היא נמצאת עכשיו?",
                answers: ["20", "19", "21", "18"],
                correct: 0
            },

            // Difficulty 7 - Multiplication (×4, ×6, ×7)
            {
                difficulty: 7,
                passage: "בכל שורה יש 6 כיסאות. יש 5 שורות.",
                question: "כמה כיסאות יש בסך הכל?",
                answers: ["30", "25", "35", "28"],
                correct: 0
            },
            {
                difficulty: 7,
                passage: "כל חבילה מכילה 7 מחברות. קנינו 4 חבילות.",
                question: "כמה מחברות קנינו?",
                answers: ["28", "24", "32", "21"],
                correct: 0
            },
            {
                difficulty: 7,
                passage: "בכל קופסה יש 8 עפרונות. יש 6 קופסאות.",
                question: "כמה עפרונות יש בסך הכל?",
                answers: ["48", "42", "54", "40"],
                correct: 0
            },
            {
                difficulty: 7,
                passage: "בכל מגירה יש 4 ספרים. יש 7 מגירות.",
                question: "כמה ספרים יש בסך הכל?",
                answers: ["28", "24", "32", "21"],
                correct: 0
            },
            {
                difficulty: 7,
                passage: "כל שקית מכילה 6 עוגיות. קניתי 8 שקיות.",
                question: "כמה עוגיות קניתי?",
                answers: ["48", "42", "54", "40"],
                correct: 0
            },
            {
                difficulty: 7,
                passage: "בכל חבילה יש 7 סוכריות. יש 6 חבילות.",
                question: "כמה סוכריות יש?",
                answers: ["42", "35", "49", "36"],
                correct: 0
            },

            // Difficulty 8 - Division problems
            {
                difficulty: 8,
                passage: "יש 24 תפוחים שצריך לחלק שווה בין 4 ילדים.",
                question: "כמה תפוחים יקבל כל ילד?",
                answers: ["6", "5", "7", "8"],
                correct: 0
            },
            {
                difficulty: 8,
                passage: "המורה חילקה 35 מדבקות שווה בשווה ל-5 תלמידים.",
                question: "כמה מדבקות קיבל כל תלמיד?",
                answers: ["7", "6", "8", "5"],
                correct: 0
            },
            {
                difficulty: 8,
                passage: "יש 42 כדורים שצריך לשים ב-6 קופסאות באופן שווה.",
                question: "כמה כדורים יהיו בכל קופסה?",
                answers: ["7", "6", "8", "9"],
                correct: 0
            },
            {
                difficulty: 8,
                passage: "חילקנו 32 עוגיות שווה בשווה ל-8 ילדים.",
                question: "כמה עוגיות קיבל כל ילד?",
                answers: ["4", "3", "5", "6"],
                correct: 0
            },
            {
                difficulty: 8,
                passage: "יש 48 עפרונות שצריך לחלק ל-6 תלמידים באופן שווה.",
                question: "כמה עפרונות יקבל כל תלמיד?",
                answers: ["8", "7", "9", "6"],
                correct: 0
            },
            {
                difficulty: 8,
                passage: "בגן יש 36 ילדים שצריך לחלק ל-4 קבוצות שוות.",
                question: "כמה ילדים יהיו בכל קבוצה?",
                answers: ["9", "8", "10", "7"],
                correct: 0
            },

            // Difficulty 9 - Mixed operations with larger numbers
            {
                difficulty: 9,
                passage: "בחנות היו 50 משחקים. מכרו 18 משחקים בבוקר ו-14 משחקים אחר הצהריים. הגיעו 22 משחקים חדשים.",
                question: "כמה משחקים יש בחנות עכשיו?",
                answers: ["40", "38", "42", "36"],
                correct: 0
            },
            {
                difficulty: 9,
                passage: "אבא קנה 3 חבילות של 8 יוגורטים. המשפחה אכלה 12 יוגורטים.",
                question: "כמה יוגורטים נשארו?",
                answers: ["12", "10", "14", "11"],
                correct: 0
            },
            {
                difficulty: 9,
                passage: "בבריכה שחו 45 ילדים. יצאו 19 ילדים ונכנסו 8 ילדים חדשים.",
                question: "כמה ילדים שוחים בבריכה עכשיו?",
                answers: ["34", "32", "36", "30"],
                correct: 0
            },
            {
                difficulty: 9,
                passage: "קניתי 5 שקיות של 6 תפוחים בכל אחת. נתתי 14 תפוחים לשכנה.",
                question: "כמה תפוחים נשארו לי?",
                answers: ["16", "14", "18", "12"],
                correct: 0
            },
            {
                difficulty: 9,
                passage: "היו בחנות 60 ספרים. הגיעו 25 ספרים חדשים ומכרו 38 ספרים.",
                question: "כמה ספרים יש בחנות עכשיו?",
                answers: ["47", "45", "49", "43"],
                correct: 0
            },
            {
                difficulty: 9,
                passage: "מיכל חסכה 80 שקלים. היא קנתה 4 מחברות ב-7 שקלים כל אחת.",
                question: "כמה כסף נשאר למיכל?",
                answers: ["52", "50", "54", "48"],
                correct: 0
            },

            // Difficulty 10 - Complex word problems
            {
                difficulty: 10,
                passage: "לגן יש 8 שורות של פרחים, ובכל שורה 7 פרחים. הגנן הוסיף עוד 15 פרחים וחלקם נקטפו.",
                question: "כמה פרחים היו לפני שנקטפו?",
                answers: ["71", "70", "72", "69"],
                correct: 0
            },
            {
                difficulty: 10,
                passage: "רונית חסכה 12 שקלים בשבוע למשך 5 שבועות. היא קנתה משחק ב-48 שקלים.",
                question: "כמה כסף נשאר לרונית?",
                answers: ["12", "10", "14", "8"],
                correct: 0
            },
            {
                difficulty: 10,
                passage: "בכיתה יש 28 תלמידים. המורה חילקה אותם ל-4 קבוצות שוות. כל קבוצה קיבלה 5 דפים.",
                question: "כמה דפים חולקו בסך הכל?",
                answers: ["20", "18", "22", "24"],
                correct: 0
            },
            {
                difficulty: 10,
                passage: "במשק יש 6 לולים, בכל לול 9 תרנגולות. כל תרנגולת מטילה 2 ביצים ביום.",
                question: "כמה ביצים מייצרים ביום?",
                answers: ["108", "100", "116", "96"],
                correct: 0
            },
            {
                difficulty: 10,
                passage: "אבא קנה 7 קופסאות עם 8 יוגורטים בכל אחת. אכלנו 23 יוגורטים.",
                question: "כמה יוגורטים נשארו?",
                answers: ["33", "31", "35", "29"],
                correct: 0
            },
            {
                difficulty: 10,
                passage: "בספרייה היו 90 ספרים. קנו 45 ספרים נוספים וחילקו את כל הספרים ל-5 מדפים שווים.",
                question: "כמה ספרים יש בכל מדף?",
                answers: ["27", "25", "29", "23"],
                correct: 0
            },

            // Difficulty 11 - Very complex multi-step problems
            {
                difficulty: 11,
                passage: "בחווה יש 12 פרות. כל פרה נותנת 8 ליטר חלב ביום. מחצית מהחלב משמשת לייצור גבינה.",
                question: "כמה ליטר חלב משמשים לייצור גבינה?",
                answers: ["48", "46", "50", "44"],
                correct: 0
            },
            {
                difficulty: 11,
                passage: "לחנות היו 120 עוגיות. בבוקר מכרו 35 עוגיות, אחר הצהריים מכרו עוד 28 עוגיות. הכינו 50 עוגיות חדשות.",
                question: "כמה עוגיות יש בחנות עכשיו?",
                answers: ["107", "105", "109", "103"],
                correct: 0
            },
            {
                difficulty: 11,
                passage: "יש 9 קבוצות של ילדים. בכל קבוצה 6 ילדים. כל ילד קיבל 3 מדבקות.",
                question: "כמה מדבקות חולקו בסך הכל?",
                answers: ["162", "160", "164", "158"],
                correct: 0
            },
            {
                difficulty: 11,
                passage: "דן עבד 8 שעות ביום למשך 5 ימים. הוא מרוויח 15 שקלים לשעה.",
                question: "כמה כסף הרוויח דן?",
                answers: ["600", "580", "620", "560"],
                correct: 0
            },
            {
                difficulty: 11,
                passage: "בבית הספר יש 8 כיתות. בכל כיתה 25 תלמידים. רבע מהתלמידים נרשמו לחוג כדורגל.",
                question: "כמה תלמידים נרשמו לחוג?",
                answers: ["50", "48", "52", "46"],
                correct: 0
            },
            {
                difficulty: 11,
                passage: "אמא קנתה 4 שקיות של תפוחים, בכל שקית 12 תפוחים. היא השתמשה ב-18 תפוחים לעוגה.",
                question: "כמה תפוחים נשארו?",
                answers: ["30", "28", "32", "26"],
                correct: 0
            },

            // Difficulty 12 - Most challenging problems
            {
                difficulty: 12,
                passage: "בגן חיות יש 15 כלובים. בכל כלוב 6 ציפורים. המטפל מאכיל כל ציפור 4 גרגירים בבוקר ו-3 גרגירים בערב.",
                question: "כמה גרגירים צריך המטפל ליום אחד?",
                answers: ["630", "600", "660", "570"],
                correct: 0
            },
            {
                difficulty: 12,
                passage: "בחנות ספרים יש 180 ספרים. מכרו שליש מהספרים ביום הראשון ורבע מהספרים שנותרו ביום השני.",
                question: "כמה ספרים מכרו ביום השני?",
                answers: ["30", "28", "32", "26"],
                correct: 0
            },
            {
                difficulty: 12,
                passage: "משפחה נוסעת לטיול. המכונית נוסעת 80 קילומטר בשעה. הם נסעו 3 שעות, עצרו לשעה, ואז נסעו עוד שעתיים.",
                question: "כמה קילומטרים נסעו בסך הכל?",
                answers: ["400", "380", "420", "360"],
                correct: 0
            },
            {
                difficulty: 12,
                passage: "בבית חרושת מייצרים 250 משחקים ביום. הם עובדים 6 ימים בשבוע. 15% מהמשחקים נפסלים.",
                question: "כמה משחקים טובים מייצרים בשבוע?",
                answers: ["1275", "1250", "1300", "1225"],
                correct: 0
            },
            {
                difficulty: 12,
                passage: "תומר אוסף בולים. יש לו 95 בולים. כל חודש הוא מוסיף 12 בולים חדשים. עברו 4 חודשים.",
                question: "כמה בולים יש לתומר עכשיו?",
                answers: ["143", "140", "146", "137"],
                correct: 0
            },
            {
                difficulty: 12,
                passage: "בבית ספר 240 תלמידים. 45% מהם בנות. מהבנות, 20 משחקות כדורסל.",
                question: "כמה בנות לא משחקות כדורסל?",
                answers: ["88", "86", "90", "84"],
                correct: 0
            }
        ];

        this.initElements();
        this.initEventListeners();
        this.initSounds();
        this.loadProgress();
    }

    initElements() {
        this.passageEl = document.getElementById('passage');
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
        this.nextBtn = document.getElementById('next-btn');
    }

    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetProgress());
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
        this.nextBtn.addEventListener('click', () => this.showNextQuestion());

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

        // Play ascending notes
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

    getQuestionsForDifficulty() {
        // Get questions at current difficulty level
        return this.questionBank.filter(q => q.difficulty === this.difficulty);
    }

    selectRandomQuestion() {
        const availableQuestions = this.getQuestionsForDifficulty();

        if (availableQuestions.length === 0) {
            // If no questions at exact difficulty, find closest
            const closest = this.questionBank.reduce((prev, curr) => {
                return Math.abs(curr.difficulty - this.difficulty) < Math.abs(prev.difficulty - this.difficulty) ? curr : prev;
            });
            return closest;
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        return availableQuestions[randomIndex];
    }

    showNextQuestion() {
        if (!this.isPlaying) return;

        this.currentQuestion = this.selectRandomQuestion();

        // Display passage
        this.passageEl.innerHTML = `<p class="passage-text">${this.currentQuestion.passage}</p>`;

        // Display question
        this.questionEl.textContent = this.currentQuestion.question;

        // Display answer options
        this.currentQuestion.answers.forEach((answer, index) => {
            this.answerBtns[index].textContent = answer;
            this.answerBtns[index].disabled = false;
            this.answerBtns[index].classList.remove('correct', 'wrong');
        });

        this.answersContainer.style.pointerEvents = 'auto';
        this.feedbackEl.classList.add('hidden');
        this.nextBtn.classList.add('hidden');
    }

    checkAnswer(button) {
        const selectedIndex = Array.from(this.answerBtns).indexOf(button);
        const isCorrect = selectedIndex === this.currentQuestion.correct;

        // Disable all buttons
        this.answersContainer.style.pointerEvents = 'none';
        this.answerBtns.forEach((btn, index) => {
            btn.disabled = true;
            if (index === this.currentQuestion.correct) {
                btn.classList.add('correct');
            }
        });

        if (!isCorrect) {
            button.classList.add('wrong');
        }

        this.processAnswer(isCorrect);
    }

    processAnswer(isCorrect) {
        this.questionCount++;
        this.questionCountEl.textContent = this.questionCount;

        if (isCorrect) {
            this.feedbackEl.innerHTML = '✓ מצוין! תשובה נכונה!';
            this.feedbackEl.className = 'feedback correct';
            this.playCorrectSound();
            this.score += this.difficulty; // Score increases based on difficulty
            this.streak++;
            this.scoreEl.textContent = this.score;
            this.streakEl.textContent = this.streak;

            // Increase difficulty (max 12)
            if (this.difficulty < 12) {
                this.difficulty++;
                this.difficultyEl.textContent = this.difficulty;
                this.updateLevelDescription();

                if (this.difficulty % 2 === 0) { // Play sound every 2 levels
                    this.playLevelUpSound();
                }
            }
        } else {
            const correctAnswer = this.currentQuestion.answers[this.currentQuestion.correct];
            this.feedbackEl.innerHTML = `✗ לא נכון. התשובה הנכונה: ${correctAnswer}`;
            this.feedbackEl.className = 'feedback wrong';
            this.playWrongSound();
            this.streak = 0;
            this.streakEl.textContent = this.streak;

            // Decrease difficulty (min 1)
            if (this.difficulty > 1) {
                this.difficulty--;
                this.difficultyEl.textContent = this.difficulty;
                this.updateLevelDescription();
            }
        }

        this.feedbackEl.classList.remove('hidden');
        this.nextBtn.classList.remove('hidden');
        this.saveProgress();
    }

    updateLevelDescription() {
        const descriptions = {
            1: 'רמה 1: חיבור פשוט עד 10',
            2: 'רמה 2: חיסור פשוט עד 10',
            3: 'רמה 3: חיבור עד 20',
            4: 'רמה 4: חיסור עד 20',
            5: 'רמה 5: כפל פשוט (×2, ×3, ×5)',
            6: 'רמה 6: בעיות בשני שלבים',
            7: 'רמה 7: כפל מורכב (×4, ×6, ×7)',
            8: 'רמה 8: חילוק',
            9: 'רמה 9: פעולות מעורבות',
            10: 'רמה 10: בעיות מורכבות',
            11: 'רמה 11: בעיות רב-שלביות מתקדמות',
            12: 'רמה 12: מומחה בעיות מילוליות! 🏆'
        };

        this.levelDescriptionEl.textContent = descriptions[this.difficulty] || 'המשך להתקדם!';
    }

    resetProgress() {
        if (confirm('האם אתה בטוח שברצונך לאפס את כל ההתקדמות?')) {
            this.difficulty = 1;
            this.score = 0;
            this.streak = 0;
            this.questionCount = 0;
            this.scoreEl.textContent = '0';
            this.streakEl.textContent = '0';
            this.questionCountEl.textContent = '0';
            this.difficultyEl.textContent = '1';
            this.updateLevelDescription();

            localStorage.removeItem('hebrewMathProgress');

            this.isPlaying = false;
            this.startBtn.textContent = 'התחל תרגול';
            this.startBtn.disabled = false;
            this.feedbackEl.classList.add('hidden');
            this.nextBtn.classList.add('hidden');
            this.passageEl.innerHTML = '<p class="instruction">לחץ על "התחל תרגול" כדי להתחיל!</p>';
            this.questionEl.textContent = '';

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
            localStorage.setItem('hebrewMathProgress', JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('hebrewMathProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.difficulty = progress.difficulty || 1;
                this.score = progress.score || 0;
                this.streak = progress.streak || 0;
                this.questionCount = progress.questionCount || 0;

                this.scoreEl.textContent = this.score;
                this.streakEl.textContent = this.streak;
                this.questionCountEl.textContent = this.questionCount;
                this.difficultyEl.textContent = this.difficulty;
                this.updateLevelDescription();

                if (this.score > 0) {
                    this.startBtn.textContent = 'המשך תרגול';
                }
            } else {
                this.updateLevelDescription();
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
            this.updateLevelDescription();
        }
    }
}

// Initialize game
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new HebrewMathGame();
});
