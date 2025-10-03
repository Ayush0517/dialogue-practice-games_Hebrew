const sentences = [
     { text: "הכל מוכן אנחנו יוצאים לדרך", audio: "1.mp3" },
     { text: "כן אני מוכנה", audio: "1.mp3" },
     { text: "ואני עוטה קסדה", audio: "1.mp3" },
     { text: "יפה מאוד נזכור לרכב לאט ולהיזהר בדרך", audio: "1.mp3" },
     { text: "אבא תראה פרח צהוב", audio: "1.mp3" },
     { text: "כל היער מלא בפרחים יפים", audio: "1.mp3" },
     { text: "אני רואה עץ גדול", audio: "1.mp3" },
     { text: "העץ הזה גבוה כמו מגדל", audio: "1.mp3" },
     { text: "אבא איפה הנהר", audio: "1.mp3" },
     { text: "עוד קילומטר אחד ונראה אותו", audio: "1.mp3" },
     { text: "נהייתי רעבה אנחנו עושים הפסקה בקרוב?, audio: "1.mp3" },
     { text: "בוודאי נשב בצל ונאכל פירות", audio: "1.mp3" },
     { text: "אילו פירות הבאת", audio: "1.mp3" },
     { text: "אני אוהבת טיולים כאלה עם המשפחה", audio: "1.mp3" },
     { text: "גם אני חבל שאמא לא יכלה להצטרף אלינו היום, audio: "1.mp3" },
];

let currentSentenceIndex = 0;
let currentWordIndex = 0;
let errors = [];

const input = document.getElementById("typingInput");
const sentenceDisplay = document.getElementById("sentenceDisplay");
const feedback = document.getElementById("feedback");
const errorsDisplay = document.getElementById("errors");

function removeNikud(str) {
  return str.normalize("NFD").replace(/[\u0591-\u05C7]/g, "");
}

function playAudio(index) {
  const audio = new Audio(`introduction${index + 1}.mp3`);
  audio.play();
}

function displaySentence() {
  const currentQuestion = questions[currentSentenceIndex];
  const words = currentQuestion.hebrewWords;

  sentenceDisplay.innerHTML = words.map((word, index) => {
    return `<span id="word-${index}">${word}</span>`;
  }).join(" ");

  highlightCurrentWord();
  input.value = "";
  input.focus();
  errors = [];
  errorsDisplay.textContent = "";
  playAudio(currentSentenceIndex);
}

function highlightCurrentWord() {
  const spans = sentenceDisplay.querySelectorAll("span");
  spans.forEach((span, i) => {
    span.style.backgroundColor = i === currentWordIndex ? "yellow" : "transparent";
  });
}

input.addEventListener("keydown", function (event) {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    checkWord();
  }
});

function checkWord() {
  const currentQuestion = questions[currentSentenceIndex];
  const correctWord = removeNikud(currentQuestion.answers[currentWordIndex]);
  const typedWord = removeNikud(input.value.trim());

  const wordSpan = document.getElementById(`word-${currentWordIndex}`);

  if (typedWord === correctWord) {
    wordSpan.style.color = "green";
  } else {
    wordSpan.style.color = "red";
    errors.push(`מילה ${currentWordIndex + 1}: היה צריך "${correctWord}", הקלדת "${typedWord}"`);
  }

  currentWordIndex++;
  input.value = "";

  if (currentWordIndex < currentQuestion.answers.length) {
    highlightCurrentWord();
  } else {
    showErrors();
    currentSentenceIndex++;
    currentWordIndex = 0;

    if (currentSentenceIndex < questions.length) {
      setTimeout(displaySentence, 2000);
    } else {
      feedback.textContent = "כל המשפטים הושלמו!";
      input.disabled = true;
    }
  }
}

function showErrors() {
  if (errors.length > 0) {
    errorsDisplay.innerHTML = "<strong>שגיאות:</strong><br>" + errors.join("<br>");
  } else {
    errorsDisplay.innerHTML = "<strong>בלי שגיאות!</strong>";
  }
}

displaySentence();