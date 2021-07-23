class Timer {
  constructor(TIME_LIMIT) {
    this.TIME_LIMIT = TIME_LIMIT;
    this.FULL_DASH_ARRAY = 283;
    this.WARNING_THRESHOLD = this.TIME_LIMIT * 0.5;
    this.ALERT_THRESHOLD = this.WARNING_THRESHOLD * 0.5;

    this.COLOR_CODES = {
      info: {
        color: "green",
      },
      warning: {
        color: "orange",
        threshold: this.WARNING_THRESHOLD,
      },
      alert: {
        color: "red",
        threshold: this.ALERT_THRESHOLD,
      },
    };

    this.timePassed = 0;
    this.timeLeft = this.TIME_LIMIT;
    this.timerInterval = null;
    this.remainingPathColor = this.COLOR_CODES.info.color;
  }

  onTimesUp() {
    clearInterval(this.timerInterval);
  }

  startTimer(refSubmit) {
    this.timerInterval = setInterval(async () => {
      if (
        document
          .getElementById("base-timer-path-remaining")
          .classList.contains(this.COLOR_CODES.warning.color) ||
        document
          .getElementById("base-timer-path-remaining")
          .classList.contains(this.COLOR_CODES.alert.color)
      ) {
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(this.COLOR_CODES.alert.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(this.COLOR_CODES.warning.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.add(this.COLOR_CODES.info.color);
      }
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.TIME_LIMIT - this.timePassed;
      document.getElementById("base-timer-label").innerHTML = this.formatTime(
        this.timeLeft
      );
      this.setCircleDasharray();
      this.setRemainingPathColor(this.timeLeft);

      if (this.timeLeft === 0) {
        refSubmit.submit();
        this.onTimesUp();
      }
    }, 1000);
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = this.COLOR_CODES;
    if (this.timeLeft <= alert.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
    }
  }

  calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }

  setCircleDasharray() {
    const circleDasharray = `${(
      this.calculateTimeFraction() * this.FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }
}

class Question {
  constructor(
    id,
    questionPrompt,
    options,
    correctOption,
    testId,
    subject,
    gateYear
  ) {
    this.id = id;
    this.prompt = questionPrompt;
    this.options = options;
    this.correctOptionIndex = correctOption;
    this.subject = subject;
    this.testId = testId;
    this.gateYear = gateYear;
    this.isDone = false;
    this.flagged = false;
    this.submit = false;
    this.selectedOption;
  }

  getTime() {
    return 1;
  }

  getOptionsDomNode() {
    const optionContainer = document.createElement("div");
    optionContainer.setAttribute("data-id", this.id);
    let idx = 1;
    for (const option of this.options) {
      const optionNo = document.createElement("div");
      optionNo.innerText = idx + ". ";
      optionNo.style.display = "inline";
      idx++;

      const optionInput = document.createElement("input");
      optionInput.type = "radio";
      optionInput.id = option;
      optionInput.name = this.id;
      optionInput.value = option;

      if (this.selectedOption === optionInput.value) {
        optionInput.checked = true;
      }

      const optionLabel = document.createElement("label");
      optionLabel.for = option;
      optionLabel.className = "options";
      optionLabel.appendChild(optionNo);
      optionLabel.appendChild(optionInput);
      optionLabel.appendChild(document.createTextNode(option));

      if (this.submit === true) {
        optionInput.disabled = true;
        const correctOption = this.options[this.correctOptionIndex];
        if (this.selectedOption === optionInput.value) {
          optionLabel.style.color = "red";
        }
        if (correctOption === optionInput.value) {
          optionLabel.style.color = "green";
        }
      }

      optionLabel.addEventListener("click", (event) => {
        event.stopPropagation();
        this.selectedOption = optionInput.value;
        this.isDone = true;
      });
      optionContainer.appendChild(optionLabel);
    }
    return optionContainer;
  }

  getDOMNode(i) {
    const questionContainer = document.createElement("div");
    questionContainer.setAttribute("data-id", this.id);
    const promptElement = document.createElement("h4");
    promptElement.appendChild(document.createTextNode(i + ". " + this.prompt));
    promptElement.className = "question_prompt";
    questionContainer.appendChild(promptElement);

    const tagDiv = document.createElement("div");
    tagDiv.id = "tag-div";

    if (this.gateYear !== undefined) {
      const gateYear = document.createElement("p");
      gateYear.appendChild(document.createTextNode(this.gateYear));
      gateYear.style.color = "green";
      gateYear.className = "tags";
      tagDiv.appendChild(gateYear);
    }

    const subject = document.createElement("p");
    subject.appendChild(document.createTextNode(this.subject));
    subject.style.color = "red";
    subject.className = "tags";
    tagDiv.appendChild(subject);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "flag_" + this.id;
    if (this.flagged) {
      checkbox.checked = true;
    }

    if (this.submit === true) {
      checkbox.disabled = true;
    }
    const flagLabel = document.createElement("label");
    flagLabel.for = "flag_" + this.id;
    flagLabel.appendChild(checkbox);
    flagLabel.appendChild(document.createTextNode("Flag "));
    const flagIcon = document.createElement("i");
    flagIcon.classList = ["fa fa-flag"];
    flagLabel.appendChild(flagIcon);
    flagLabel.style.float = "right";
    flagLabel.style.paddingTop = "1.2em";
    flagLabel.addEventListener("click", (event) => {
      event.stopPropagation();
      if (flagLabel.firstChild.checked === true) {
        this.flagged = true;
      } else {
        this.flagged = false;
      }
    });
    tagDiv.appendChild(flagLabel);
    questionContainer.appendChild(tagDiv);

    const optionsLabel = document.createElement("h4");
    optionsLabel.appendChild(document.createTextNode("Options : "));
    optionsLabel.className = "question_prompt";
    questionContainer.appendChild(optionsLabel);

    const optionContainer = this.getOptionsDomNode();
    questionContainer.appendChild(optionContainer);

    return questionContainer;
  }
}

class Quiz {
  constructor(questions, rootElement) {
    this.questions = questions; // array of Question Objects
    this.root = rootElement;
    this.i = 0;
    this.prevBtn = this.getPrevButton();
    this.nextBtn = this.getNextButton();
    this.submitBtn = this.getSubmitButton();
    this.questionsNav = this.getQuestionsNav();
    this.timerObj = new Timer(
      this.questions.length * this.questions[0].getTime() * 60
    );
  }

  getNextButton() {
    const btn = document.createElement("button");
    btn.textContent = "Next Question ";
    // this = quiz;
    btn.id = "next-btn";
    btn.style.float = "right";
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      this.updateQuestion(this.i + 1); // this = current target
    });
    return btn;
  }

  getPrevButton() {
    const btn = document.createElement("button");
    btn.textContent = "Prev Question ";
    // this = quiz;
    btn.id = "prev-btn";

    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      this.updateQuestion(this.i - 1); // this = current target
    });
    return btn;
  }

  getSubmitButton() {
    const btn = document.createElement("button");
    btn.textContent = "Submit ";
    btn.id = "submit-btn";
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      this.submit();
    });
    return btn;
  }

  getQuestionsNav() {
    const questionsNav = document.createElement("div");
    questionsNav.className = "questions-nav";
    for (let i = 0; i < this.questions.length; i++) {
      const btn = document.createElement("button");
      btn.textContent = i + 1;
      btn.className = "questions-nav-btn";
      btn.id = i;
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        this.updateQuestion(i);
      });
      questionsNav.appendChild(btn);
    }
    return questionsNav;
  }

  disableBtnIfRequire() {
    // this.i, this.prev, this.next
    if (this.i <= 0) {
      this.prevBtn.disabled = true;
    } else {
      this.prevBtn.disabled = false;
    }

    if (this.i + 1 >= this.questions.length) {
      this.nextBtn.disabled = true;
    } else {
      this.nextBtn.disabled = false;
    }
  }

  async updateQuestionNav(flag) {
    const qNavBtns = Array.from(this.questionsNav.children);
    let index = 0;
    qNavBtns.forEach((item) => {
      const q = this.questions[index];
      item.style.background = "whitesmoke";
      if (q.isDone) {
        item.style.background = "lightgreen";
      }
      if (q.flagged) {
        item.style.background = "pink";
      }
      if (q.flagged && q.isDone) {
        item.style.background = "lightblue";
      }
      if (this.i === index) {
        item.style.background = "lightsalmon";
      }
      index++;
    });
  }

  async updateQuestion(index) {
    this.disableBtnIfRequire();
    const q = this.questions[index];
    this.i = index;
    this.root.firstElementChild.replaceWith(q.getDOMNode(this.i + 1));
    this.updateQuestionNav();
    this.disableBtnIfRequire();
  }

  render() {
    this.disableBtnIfRequire();
    const q = this.questions[0];
    this.root.appendChild(q.getDOMNode(this.i + 1));
    this.root.appendChild(this.prevBtn);
    this.root.appendChild(this.nextBtn);

    const questNavPos = document.getElementById("test-nav");
    questNavPos.firstElementChild.replaceWith(this.questionsNav);
    const submitPos = document.getElementById("test-submit");
    submitPos.firstElementChild.replaceWith(this.submitBtn);
  }

  showInstructions(questions, time) {
    displayInstructionModal(questions, time);
    const questionsContainer = document.getElementById("test");
    document.getElementById("home-page-greeting").style.display = "none";
    questionsContainer.style.display = "none";
    const startBtnDiv = document.getElementById("test-start-div");
    const startBtn = document.createElement("button");
    startBtn.id = "test-start-btn";
    startBtn.innerText = "Start Test";
    startBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      document.getElementById("modal-2").style.display = "none";
      const questionsContainer = document.getElementById("test");
      questionsContainer.style.display = "grid";
      this.timerObj.startTimer(this);
    });
    startBtnDiv.firstElementChild.replaceWith(startBtn);
  }

  start() {
    this.showInstructions(
      this.questions.length,
      this.questions.length * this.questions[0].getTime()
    );

    this.render();
    const nav_dis = document.getElementsByClassName("disable-test");
    for (const ele of nav_dis) {
      ele.style.display = "none";
    }

    this.updateQuestionNav();
  }

  submit() {
    this.timerObj.onTimesUp();
    const nav_dis = document.getElementsByClassName("disable-test");
    for (const ele of nav_dis) {
      ele.style.display = "inline";
    }
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    for (let i = 0; i < this.questions.length; i++) {
      const quest = this.questions[i];
      if (quest.isDone === false) {
        unattempted++;
      } else {
        const correctOption = quest.options[quest.correctOptionIndex];
        if (correctOption === quest.selectedOption) {
          correct++;
        } else {
          incorrect++;
        }
      }
      quest.submit = true;
    }
    this.root.innerHTML = "";
    this.i = 0;
    this.updateQuestionNav();
    this.render();
    this.submitBtn.disabled = true;
    displayResultModal(correct, incorrect, unattempted, this.questions.length);
  }
}

class BuildTest {
  renderByTestIdOrNone = async (testId) => {
    const questionsDB = await fetch(BASE_URL + "/api/questions").then(
      (response) => response.json()
    );

    const questionsDiv = document.getElementById("test-questions");
    questionsDiv.innerHTML = "";
    const testHead = document.getElementById("test-head");
    if (testId === undefined) {
      testHead.innerText = "All Questions";
    } else {
      testHead.innerText = testId;
    }

    const questionObjects = [];
    if (testId === undefined) {
      for (const q of questionsDB) {
        questionObjects.push(
          new Question(
            q["_id"]["$oid"],
            q.questionPrompt,
            q.options,
            q.correctOption,
            q.testId,
            q.subject,
            q.gateYear
          )
        );
      }
    } else {
      for (const q of questionsDB) {
        if (testId === q.testId) {
          questionObjects.push(
            new Question(
              q["_id"]["$oid"],
              q.questionPrompt,
              q.options,
              q.correctOption,
              q.testId,
              q.subject,
              q.gateYear
            )
          );
        }
      }
    }

    const test = new Quiz(questionObjects, questionsDiv);
    test.start();
  };

  renderBySubject = async (subject) => {
    const questionsDB = await fetch(BASE_URL + "/api/questions").then(
      (response) => response.json()
    );

    const questionsDiv = document.getElementById("test-questions");
    questionsDiv.innerHTML = "";
    const testHead = document.getElementById("test-head");
    testHead.innerText = subject;

    const questionObjects = [];

    for (const q of questionsDB) {
      if (q.subject === subject) {
        questionObjects.push(
          new Question(
            q["_id"]["$oid"],
            q.questionPrompt,
            q.options,
            q.correctOption,
            q.testId,
            q.subject,
            q.gateYear
          )
        );
      }
    }

    const test = new Quiz(questionObjects, questionsDiv);
    test.start();
  };

  renderByYears = async (gateYear) => {
    const questionsDB = await fetch(BASE_URL + "/api/questions").then(
      (response) => response.json()
    );

    const questionsDiv = document.getElementById("test-questions");
    questionsDiv.innerHTML = "";
    const testHead = document.getElementById("test-head");
    testHead.innerText = gateYear;

    const questionObjects = [];

    for (const q of questionsDB) {
      if (q.gateYear === gateYear) {
        questionObjects.push(
          new Question(
            q["_id"]["$oid"],
            q.questionPrompt,
            q.options,
            q.correctOption,
            q.testId,
            q.subject,
            q.gateYear
          )
        );
      }
    }

    const test = new Quiz(questionObjects, questionsDiv);
    test.start();
  };

  start = async () => {
    const pageMetadata = await fetch(BASE_URL + "/api/metadata").then(
      (response) => response.json()
    );

    // Creating Tests Options
    const tests = pageMetadata["tests"];
    const testOptions = document.getElementById("test-wise");
    for (const test of tests) {
      const t = document.createElement("a");
      t.innerText = test;
      t.addEventListener("click", (event) => {
        event.stopPropagation();
        this.renderByTestIdOrNone(test);
      });
      testOptions.appendChild(t);
    }

    // Creating Subject Options
    const subjects = pageMetadata["subjects"];
    const subjectOptions = document.getElementById("subject-wise");

    for (const subject of subjects) {
      const s = document.createElement("a");
      s.innerText = subject;
      s.addEventListener("click", (event) => {
        event.stopPropagation();
        this.renderBySubject(subject);
      });
      subjectOptions.appendChild(s);
    }

    // Creating GateYear Options
    const gateYears = pageMetadata["gateYears"];
    const gateYearOptions = document.getElementById("year-wise");

    for (const gateYear of gateYears) {
      const g = document.createElement("a");
      g.innerText = gateYear;
      g.addEventListener("click", (event) => {
        event.stopPropagation();
        this.renderByYears(gateYear);
      });
      gateYearOptions.appendChild(g);
    }
  };
}

const obj = new BuildTest();
const BASE_URL = "https://mocktest-api-o77jx.ondigitalocean.app";
obj.start();
