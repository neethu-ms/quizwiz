$(() => {
  // Open/close nav menu when navbar-burger is clicked
  // For mobile only
  $("body").on("click", ".navbar-burger", () => {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  // cancel quiz button
  $("body").on("click", "#cancel-quiz", e => {
    e.preventDefault();
    clearInputValues();
    fetchAndRenderQuizzes();
  });

  // cancel questions button
  $("body").on("click", "#cancel-questions", e => {
    e.preventDefault();
    removeQuiz(Number($("#quiz-id")[0].innerText));
    fetchAndRenderQuizzes();
  });

  $("body").on("submit", "#create-quiz", e => {
    e.preventDefault();
    const form = $("#create-quiz")[0];

    const title = form.title.value;
    const description = form.description.value;
    const picture_url = form.picture.value;
    const number_of_questions = form.questions.value;
    const number_of_options = form.options.value;
    let is_public;
    if ($("#public").prop("checked")) {
      is_public = true;
    } else {
      is_public = false;
    }

    const quiz = {
      title,
      description,
      picture_url,
      number_of_questions,
      is_public,
      user_id: 1
    };

    clearInputValues();

    $("#create-quiz").hide();
    $("#cancel-quiz").hide();

    createQuiz(quiz);

    $("#questions").append(createHTML(number_of_questions, number_of_options));
    $(".buttons").append(
      `<button id="cancel-questions" class="button is-link is-light">Cancel</button>`
    );
  });

  fetchAndRenderQuizzes();

  // submit questions
  $("body").on("submit", "#questions", e => {
    e.preventDefault();

    const number_of_answers = $(".optionInput").length / $(".question").length;
    const quiz_id = Number($("#quiz-id")[0].innerText);

    $(".question-container").each(function() {
      let $questionElem = $(this);
      $(this)
        .find(".question")
        .each(function() {
          addQuestion(
            $questionElem,
            quiz_id,
            $(this)[0].value,
            number_of_answers
          );
        });
    });
    fetchSingleQuiz(quiz_id);
  });

  // Checks if user chose correct answer, increments score accordingly
  $(".option").click(event => {
    const correctAnswer = currentOptions.filter(option => option.is_correct);
    console.log("hallooo");
  });

  // Checks if user chose correct answer, increments score accordingly, goes to next question
  $("body").on("click", ".option", () => {
    const userAnswer = event.target.innerText;
    const correctAnswer = currentOptions.filter(option => option.is_correct)[0]
      .option;

    if (userAnswer === correctAnswer) {
      currentScore++;
    }

    $(".option")
      .filter(function() {
        return (
          $(this)
            .children()
            .text() === userAnswer
        );
      })
      .css("backgroundColor", "#e74c3c");

    $(".option")
      .filter(function() {
        return (
          $(this)
            .children()
            .text() === correctAnswer
        );
      })
      .css("backgroundColor", "#2ecc71");

    $(".option").css("pointer-events", "none");

    setTimeout(() => {
      renderQuestion(quizData);
    }, 1000);
  });
});

const createHTML = function(number_of_questions, number_of_options) {
  let html = ``;

  for (let i = 1; i <= number_of_questions; i++) {
    html += `<div class="question-container">
                <div class="field">
                  <label class="label">Question ${i}</label>
                  <div class="control">
                    <input type="text" required="required" id="question${i}" class="input question" />
                  </div>
                </div>`;
    for (let j = 1; j <= number_of_options; j++) {
      if (j === 1) {
        html += `
                    <div class="field">
                      <label class="label">Option ${j}</label>
                      <div class="control">
                        <input type="text" required="required" id="option${j}" class="input correct optionInput" placeholder="Correct option"/>
                      </div>
                    </div>`;
      } else {
        html += `
                    <div class="field">
                      <label class="label">Option ${j}</label>
                      <div class="control">
                        <input type="text" required="required" id="option${j}" class="input optionInput" placeholder="Incorrect option" />
                      </div>
                    </div>`;
      }
    }
    html += `</div><br>`;
  }

  html += `
              <div class="field is-grouped">
                <div class="control buttons">
                  <button id="submit-questions" class="button is-primary">Submit</button>
                </div>
              </div>
              <div>
                Quiz ID:
                <span id="quiz-id"></span>
              </div>
            `;

  return html;
};

const clearInputValues = function() {
  $("input").val("");
  $("textarea").val("");
  $("#public").prop("checked", false);
};
