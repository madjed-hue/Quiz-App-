let countSpan = document.querySelector(".quiz-info .count span"),
  buletts = document.querySelector(".bullets"),
  bulletsSpanContainer = document.querySelector(".bullets .spans"),
  quizArea = document.querySelector(".quiz-area"),
  answersArea = document.querySelector(".answers-area"),
  submitButton = document.querySelector(".submit-button"),
  resultsContainer = document.querySelector(".results"),
  countDownElement = document.querySelector(".countdown"),
  spanLang = document.querySelectorAll(".category span"),
  currentIndex = 0,
  rightAnswer = 0,
  countDownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;
      createBullets(questionCount);
      countdownFunc(120, questionCount);
      addQuestionData(questionObject[currentIndex], questionCount);
      submitButton.onclick = () => {
        let theRightAnswer = questionObject[currentIndex].right_answer;
        currentIndex++;
        checkTheAnswer(theRightAnswer, questionCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionObject[currentIndex], questionCount);
        handleBullets();
        clearInterval(countDownInterval);
        countdownFunc(120, questionCount);
        showResults(questionCount);
      };
    }
  };
  let langArray = Array.from(spanLang);
  let apiURL;
  langArray.forEach((lang) => {
    lang.addEventListener("click", function (e) {
      quizArea.innerHTML = "";
      answersArea.innerHTML = "";
      bulletsSpanContainer.innerHTML = "";
      clearInterval(countDownInterval);
      currentIndex = 0;
      if (e.target.className === "html") {
        apiURL = "html__questions.json";
      }
      if (e.target.className === "css") {
        apiURL = "css_question.json";
      }
      if (e.target.className === "js") {
        apiURL = "js_question.json";
      }
      myRequest.open("GET", apiURL, true);
      myRequest.send();
    });
  });
}

getQuestions();

createBullets = (num) => {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
};

addQuestionData = (obj, count) => {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionTitleText = document.createTextNode(obj.title);
    questionTitle.appendChild(questionTitleText);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      answersArea.appendChild(mainDiv);
    }
  }
};
function checkTheAnswer(correctAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (correctAnswer === theChosenAnswer) {
    rightAnswer++;
  }
}

function handleBullets() {
  let langArray = Array.from(spanLang);
  let bulttesSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulttesSpans);
  langArray.forEach((ele) => {
    if (ele.className === "html") {
      arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
          span.classList.add("on");
        }
      });
    }
    if (ele.className === "css") {
      arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
          span.classList.add("on");
        }
      });
    }
    if (ele.className === "js") {
      arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
          span.classList.add("on");
        }
      });
    }
  });
}

showResults = (count) => {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    buletts.remove();
    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count} correct answers`;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect">Perfect</span>, All of your answers are correct !`;
    } else {
      theResults = `<span class="bad">Not Enough</span>, ${rightAnswer} From ${count} correct answers, Try again`;
    }
    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
};

function countdownFunc(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
