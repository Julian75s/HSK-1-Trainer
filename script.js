let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let isAnswered = false; // Bloque les clics multiples pendant le délai

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startNewGame() {
  currentIndex = 0;
  score = 0;
  isAnswered = false;
  
  const shuffledAll = shuffle([...hsk1Data]);
  currentQuestions = shuffledAll.slice(0, 20);

  document.getElementById("quiz-box").style.display = "block";
  document.getElementById("result-box").style.display = "none";
  
  loadQuestion();
}

function loadQuestion() {
  isAnswered = false;
  const currentWord = currentQuestions[currentIndex];
  
  document.getElementById("hanzi").textContent = currentWord.hanzi;
  document.getElementById("progress").textContent = `Question ${currentIndex + 1} / 20`;

  const otherWords = hsk1Data.filter(w => w.hanzi !== currentWord.hanzi);
  const falseChoices = shuffle(otherWords).slice(0, 3);
  const choices = shuffle([currentWord, ...falseChoices]);

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  choices.forEach(choice => {
    const button = document.createElement("button");
    button.className = "btn";
    button.textContent = choice.answer;
    button.onclick = () => checkAnswer(choice === currentWord, choice, currentWord);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(isCorrect, choice, currentWord) {
  if (isAnswered) return; // Sécurité anti-spam
  isAnswered = true;

  const buttons = document.querySelectorAll("#options .btn");
  
  buttons.forEach(btn => {
    btn.disabled = true;
    
    // Révèle la bonne réponse en vert
    if (btn.textContent === currentWord.answer) {
      btn.classList.add("correct");
    }
    // Si mauvaise réponse, passe le bouton cliqué en rouge
    if (!isCorrect && btn.textContent === choice.answer) {
      btn.classList.add("wrong");
    }
  });

  if (isCorrect) score++;
  currentIndex++;

  // Pause d'1 seconde pour mémoriser
  setTimeout(() => {
    if (currentIndex < currentQuestions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("result-box").style.display = "block";
  document.getElementById("final-score").textContent = `Ton score : ${score} / 20`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("restart-btn").addEventListener("click", startNewGame);
  startNewGame();
});
