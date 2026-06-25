const questions = [
    {
        question: "Which language is used for web page structure?",
        options: ["CSS", "JavaScript", "HTML", "Python"],
        answer: "HTML"
    },
    {
        question: "Which CSS property changes text color?",
        options: ["font-size", "color", "background", "border"],
        answer: "color"
    },
    {
        question: "Which company developed JavaScript?",
        options: ["Google", "Microsoft", "Netscape", "Apple"],
        answer: "Netscape"
    },
    {
        question: "Which symbol is used for ID selector in CSS?",
        options: [".", "#", "@", "&"],
        answer: "#"
    },
    {
        question: "Which HTML tag creates a hyperlink?",
        options: ["link", "href", "a", "url"],
        answer: "a"
    },
    {
        question: "Which method selects an element by ID?",
        options: [
            "querySelector",
            "getElementById",
            "getElementsByClassName",
            "findElement"
        ],
        answer: "getElementById"
    },
    {
        question: "Which CSS layout system is one-dimensional?",
        options: ["Grid", "Flexbox", "Table", "Float"],
        answer: "Flexbox"
    },
    {
        question: "Which keyword declares a variable?",
        options: ["var", "let", "const", "All of these"],
        answer: "All of these"
    },
    {
        question: "Which HTML tag inserts an image?",
        options: ["img", "image", "src", "picture"],
        answer: "img"
    },
    {
        question: "Which operator checks equality?",
        options: ["=", "==", "===", "Both == and ==="],
        answer: "Both == and ==="
    }
];

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");

const scoreText = document.getElementById("scoreText");
const percentageEl = document.getElementById("percentage");
const performanceEl = document.getElementById("performance");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");

// Elements for Circular Progress
const circle = document.querySelector(".progress-circle");
const circleText = document.getElementById("circleText");
const circumference = 440; // 2 * pi * r (r=70)

let currentQuestion = 0;
let score = 0;
let timer = 30;
let interval;

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
    currentQuestion = 0;
    score = 0;

    // Reset circle animations
    circle.style.strokeDashoffset = circumference;
    circleText.textContent = "0%";

    startScreen.classList.remove("active");
    resultScreen.classList.remove("active");
    quizScreen.classList.add("active");

    loadQuestion();
}

function loadQuestion() {
    clearInterval(interval);
    timer = 30;
    timerEl.textContent = timer;
    startTimer();

    nextBtn.classList.add("hidden");

    const q = questions[currentQuestion];
    progressEl.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";

    q.options.forEach(option => {
        const btn = document.createElement("div");
        btn.classList.add("option");
        btn.textContent = option;

        btn.addEventListener("click", () => {
            clearInterval(interval); // Stop timer on answer
            document.querySelectorAll(".option").forEach(opt => opt.style.pointerEvents = "none");

            if (option === q.answer) {
                btn.classList.add("correct");
                score++;
            } else {
                btn.classList.add("wrong");
                document.querySelectorAll(".option").forEach(opt => {
                    if (opt.textContent === q.answer) {
                        opt.classList.add("correct");
                    }
                });
            }
            nextBtn.classList.remove("hidden");
        });

        optionsEl.appendChild(btn);
    });
}

function startTimer() {
    interval = setInterval(() => {
        timer--;
        timerEl.textContent = timer;

        if (timer <= 0) {
            clearInterval(interval);
            // Time out hone par sahi answer auto-highlight karein
            document.querySelectorAll(".option").forEach(opt => {
                opt.style.pointerEvents = "none";
                if (opt.textContent === questions[currentQuestion].answer) {
                    opt.classList.add("correct");
                }
            });
            nextBtn.classList.remove("hidden");
        }
    }, 1000);
}

nextBtn.addEventListener("click", nextQuestion);

function nextQuestion() {
    clearInterval(interval);
    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    const percentage = Math.round((score / questions.length) * 100);

    scoreText.textContent = `Your Score: ${score} / ${questions.length}`;
    percentageEl.textContent = `Percentage: ${percentage}%`;

    let message = "";
    if (percentage >= 90) message = "Excellent 🎯";
    else if (percentage >= 70) message = "Great Job 🚀";
    else if (percentage >= 50) message = "Good Effort 👍";
    else message = "Keep Practicing 📚";

    performanceEl.textContent = message;

    // --- Circular Progress Animation ---
    const offset = circumference - (percentage / 100) * circumference;
    
    // Animate Stroke
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 150);

    // Animate Number Counter inside Circle
    let count = 0;
    circleText.textContent = "0%";
    
    if (percentage > 0) {
        const counter = setInterval(() => {
            count++;
            circleText.textContent = count + "%";
            if (count >= percentage) {
                clearInterval(counter);
            }
        }, 15); // Smooth counter effect
    }
}

restartBtn.addEventListener("click", () => {
    startQuiz();
});

backBtn.addEventListener("click", () => {
    resultScreen.classList.remove("active");
    startScreen.classList.add("active");
});