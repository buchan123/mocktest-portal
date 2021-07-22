function showPassword() {
  let x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
let elem = document.getElementById("test");

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function toggleFullscreen() {
  if (document.getElementById("fullscreen-toggler").checked == true) {
    openFullscreen();
  } else {
    closeFullscreen();
  }
}

function displayResultModal(correct, incorrect, unattempted, total) {
  let modal = document.getElementById("modal-1");

  let span = document.getElementsByClassName("close")[0];

  document.getElementById("correct-questions").innerText =
    "Correct Questions: " + correct;

  document.getElementById("incorrect-questions").innerText =
    "Incorrect Questions: " + incorrect;

  document.getElementById("unattempted-questions").innerText =
    "Unattempted Questions: " + unattempted;

  document.getElementById("total-questions").innerText =
    "Total Questions: " + total;

  modal.style.display = "block";

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
