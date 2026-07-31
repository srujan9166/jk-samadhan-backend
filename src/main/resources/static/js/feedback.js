$(function () {
  $('input[name="satisfied-feed"]').change(function () {
    if ($(this).val() === "No") {
      $(".noDiv").removeClass("visually-hidden");
    } else {
      $(".noDiv").addClass("visually-hidden");
    }
  });
});

const Listen = (doc) => {
  return {
    on: (type, selector, callback) => {
      doc.addEventListener(
        type,
        (event) => {
          if (!event.target.matches(selector)) return;
          callback.call(event.target, event);
        },
        false
      );
    },
  };
};

Listen(document).on("click", ".closeLogout", function (e) {
  this.closest("form").submit();
});

var ratingValue1, ratingValue2;

$(".rBtn1").on("click", ".rating1", function () {
  $(".rBtn1 .rating1").removeClass("rg-selectedBtn");
  $(this).addClass("rg-selectedBtn");
  ratingValue1 = $(this).text();
  //console.log("Selected rBtn1: " + ratingValue1);
});

$(".rBtn2").on("click", ".rating2", function () {
  $(".rBtn2 .rating2").removeClass("rg-selectedBtn");
  $(this).addClass("rg-selectedBtn");
  ratingValue2 = $(this).text();
  //console.log("Selected rBtn2: " + ratingValue2);
});

$(document).on("click", ".feedB-btn", function (e) {
  var satisfiedValue = $('input[name="satisfied-feed"]:checked').val() || "NA";
  var descriptionValue = satisfiedValue === "No" ? $("#desciption-box").val() : "NA";
  var callMsg = $('input[name="call-msg"]:checked').val() || "NA";
  var finalRating1 = ratingValue1 || "NA";
  var finalRating2 = ratingValue2 || "NA";
  var processValue = $('input[name="process"]:checked').val() || "NA";
  var recommendValue = $('input[name="loading"]:checked').val() || "NA";
  var grvId = $("#uniqueID").text();
  // Log the values
  if (
    satisfiedValue != "NA" &&
    callMsg != "NA" &&
    finalRating1 != "NA" &&
    finalRating2 != "NA" &&
    processValue != "NA" &&
    recommendValue != "NA" &&
    !(satisfiedValue === "No" && descriptionValue == "")
  ) {
    // encrypting varaibles and passing through endpoint
    var c = JSON.stringify({
      satisfiedValue: satisfiedValue,
      descriptionValue: descriptionValue,
      callMsg: callMsg,
      finalRating1: finalRating1,
      finalRating2: finalRating2,
      processValue: processValue,
      recommendValue: recommendValue,
      grvId: grvId,
    });
    var d = chkV(c);
    var settings = {
      url: "getFeedbackData?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = JSON.parse(setV(j));
      //console.log(j);
      if (j.statusCode == "1") {
        alert(
          "Feedback submitted successfully. Your feedback is valuable to us. Your Feedback Score is " +
          j.feedbackscore +
          " % Thank you!"
        );
      } else if (j.statusCode == "2") {
        alert("Feedback already received for "+grvId+".");
      } else {
        alert("Something went wrong.");
      }
      window.location.href = "login";
    });
  } else {
    alert("All fields are mandatory!");
  }
});
