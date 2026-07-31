var clickValueForgetPwd = null;
var globalEmailVerification = 0;
var globalEmailRequirement = false;
var globalMobileRequirement = false;
var otpM = 0;
var otpE = 0;

$(document).ready(function () {
  sessionFunc();
});


$(document).ready(function () {
  // console.log(stateData)

  makeDropdown2(inputRegion, stateData);

});

// Load captcha on page load for status check page
window.addEventListener('load', function () {
  if (document.getElementById('registerCaptchaInput')) {
    loadCaptcha();
  }
});


$("#email").on("keyup", function () {
  this.value = this.value.replace(/[^0-9a-zA-Z@_.-]/g, '');

});
$("#OTPValueM1").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');

});
$("#address").on("keyup", function () {
  this.value = this.value.replace(/[^0-9a-zA-Z:,-. \s]/g, '');

});
/*$("#RegistrationNo").on("keyup", function() {
  this.value = this.value.replace(/[^0-9a-zA-Z/_-\s]/g, '');
 
});*/
$("#EmailOrMobileno").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');

});
$("#OTPValueChkSt").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');
  if (this.value.length > 6) {
    this.value = this.value.substring(0, 6);
  }
});
$("#OTPValueV1").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');

});
$("#email1").on("keyup", function () {
  this.value = this.value.replace(/[^0-9a-zA-Z@_.-]/g, '');

});
$("#pin").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');

});
$("#OTPValueM").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');

});
$("#OTPValueV").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');
  if (this.value.length > 6) {
    this.value = this.value.substring(0, 6);
  }
});
$("#yourUsername").on("keyup", function () {
  this.value = this.value.replace(/[^0-9a-zA-Z@_\s-.]/g, '');
});
$("#yourPassword").on("keyup", function () {
  this.value = this.value.replace(/[^0-9a-zA-Z@_#$!%&*^\s-.]/g, '');
});
$("#newPassword1").on("keyup", function () {
  this.value = this.value.replace(/[^0-9a-zA-Z@_#$!%&*^\s-.]/g, '');
});
$("#confirmNewPassword1").on("keyup", function () {
  this.value = this.value.replace(/[^0-9a-zA-Z@_#$!%&*^\s-.]/g, '');
});
// document ready
$(function () {

  // resetCaptcha()

  // Email Verification Requirement
  $(".emailVerificationDiv").hide();
  $("#grievanceEmail").change(function () {
    globalEmailVerification = $(this).is(":checked") ? 1 : 0;
    $(".emailVerificationDiv").toggle($(this).is(":checked"));
    checkOtp();
  });
  // Email Verification Requirement

  var today = new Date();

  today.setFullYear(today.getFullYear() - 1);
  var lastYear = today.toISOString().split("T")[0];

  document.getElementById("dob").setAttribute("max", lastYear);

  window.onload = function () {
    sessionFunc();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
      alert("Invalid username or password!");
    }
  };

  $("#descriptionsone").on("input", function () {
    var maxLength = 500;
    var text = $(this).val();
    var charCount = text.length;

    if (charCount > maxLength) {
      $(this).val(text.substring(0, maxLength));
      charCount = maxLength;
    }

    var remainingCount = maxLength - charCount;
    $(".remWCounter1").text(remainingCount);
  });
  $("#descriptionstwo").on("input", function () {
    var maxLength = 500;
    var text = $(this).val();
    var charCount = text.length;

    if (charCount > maxLength) {
      $(this).val(text.substring(0, maxLength));
      charCount = maxLength;
    }

    var remainingCount = maxLength - charCount;
    $(".remWCounter2").text(remainingCount);
  });
  $("#descriptionsthree").on("input", function () {
    var maxLength = 500;
    var text = $(this).val();
    var charCount = text.length;

    if (charCount > maxLength) {
      $(this).val(text.substring(0, maxLength));
      charCount = maxLength;
    }

    var remainingCount = maxLength - charCount;
    $(".remWCounter3").text(remainingCount);
  });

});


let context_path = $('#context_path').val();
function sessionFunc() {
  var settings = {
    url: context_path + "/sessionvalue",
    method: "POST",
    data: { sessionname: $('#sessionname').val() },
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    $('.sessionvalue').val(j);
  });
}

function fetchData() {
  $.ajax({
    url: "sky-api",
    type: "POST",
    success: function (responseData) {
      //console.log(responseData.statename);
    },
    error: function (xhr, status, error) {
      // console.error("Request failed with status:", status);
    },
  });
}

$(document).on("click", ".opfaqz", function () {
  // console.log("working faq modals");
  $("#faqModal").show();
});

$(".btn-close").click(function () {
  // forgot password
  // $(".forgotPwd").addClass("d-none");
  $("#mobile1").val("");
  $("#OTPValueM1").val("");
  $("#newPassword1").val("");
  $("#confirmNewPassword1").val("");
  $("#newPassword1").val("");
  $("#email1").val("");
  $("#OTPValueM1").val("");

  // Reset or clear the input fields when the close icon is clicked
  $("#formRegister").find("form")[0].reset();
  $("#formLogin").find("form")[0].reset();
  $("#faqModal").hide();
});

$("#google_translate_element2").hide();

// $("#newCaptchaB").click(function () {
//   $.getJSON("getCaptcha", {}, function (j) {
//     var imageC = document.getElementById("captchaImage");
//     var hCp = document.getElementById("hiddenCaptcha");
//     var userC = document.getElementById("captchaU");
//     var captchaSrc = j.realCaptcha;
//     var hC = j.hiddenCaptcha;
//     var cC = j.captcha;

//     imageC.src = "data:realCaptcha/jpg;base64," + captchaSrc;
//     hCp.value = hC;
//     userC.value = cC;
//   });
// });

$("#sendOTPButton, #sendOTPButton1").click(function () {
  //userExists();
  var usr = $("#email").val() || $("#email1").val();

  globalEmailRequirement = false; // For fresh registration

  if ($("#email1").val() != null && $("#email1").val() != "") {
    globalEmailRequirement = true; // For forgot password
  }

  // console.log("requirement at Email :: " + globalEmailRequirement);

  var usr = JSON.stringify({
    value: usr,
    requirement: globalEmailRequirement,
  });
  var dd = chkV(usr);

  var settings1 = {
    url: "checkUser?d=" + dd,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings1).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(j);
    if (j.statusCode == "1") {
      alert("Email Id already exists.");
    } else if (j.statusCode == "2") {
      callOTPBasedOnStCodeE();
    } else if (j.statusCode == "0" && globalEmailRequirement == false) {
      callOTPBasedOnStCodeE();
    } else {
      alert("Invalid username or password!");
    }
    function callOTPBasedOnStCodeE() {
      var settings = {
        url: "otpL?d=" + dd,
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);

        if (j.statusCode == "1" || j.statusCode == "2") {
          sendOTPE();
        } else {
          alert("Please try again after 10 minutes");
        }
      });
    }
  });
});

$("#sendOTPButtonM, #sendOTPButtonM1").click(function () {
  // debugger
  //userExists();

  var usr = $("#mobile").val() || $("#mobile1").val();
  globalMobileRequirement = false; // For fresh registration

  if ($("#mobile1").val() != null && $("#mobile1").val() != "") {
    globalMobileRequirement = true; // For forgot password
  }

  // console.log("requirement1 at Mobile :: " + globalMobileRequirement);

  var usr = JSON.stringify({
    value: usr,
    requirement: globalMobileRequirement,
  });

  var dd = chkV(usr);

  var settings1 = {
    url: "checkUser?d=" + dd,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings1).done(function (j) {
    // console.log(j)
    j = setV(j);
    j = JSON.parse(j);
    //alert(j.statusCode);
    // console.log(j.data[0])
    if (j.statusCode == "1") {
      alert("Mobile no already exists.");
    } else if (j.statusCode == "2") {
      callOTPBasedOnStCode(dd);
    } else if (j.statusCode == "0" && globalMobileRequirement == false) {
      callOTPBasedOnStCode(dd);
    } else {
      alert("Invalid username or password!");
    }
  });
});

function callOTPBasedOnStCode(dd) {
  var settings = {
    url: "otpL?d=" + dd,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    if (j.statusCode == "1" || j.statusCode == "2") {
      sendOTPM();
    } else {
      alert("Please try again after 10 minutes");
    }
  });
}

$("#sendOTPButtonchkSt").click(function () {
  //userExists();
  var usr = $("#EmailOrMobileno").val();
  var uniqid = $("#RegistrationNo").val();

  if (usr == "" || uniqid == "") {
    alert("Please enter grievance ID and mobile number");
  }
  else {
    globalMobileRequirement = true
    //  console.log("requirement1 at Mobile :: " + globalMobileRequirement);

    var usr = JSON.stringify({
      value: usr,
      requirement: globalMobileRequirement,
      uniqid: uniqid,

    });

    var dd = chkV(usr);

    var settings1 = {
      url: "checkUserfortrackStatus?d=" + dd,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings1).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //alert(j.statusCode);
      if (j.statusCode == "1") {
        callOTPBasedOnStCodetrack(dd);
      } else {
        alert("Invalid mobile no.");
      }
    });
  }
});

function callOTPBasedOnStCodetrack(dd) {
  var settings = {
    url: "otpL?d=" + dd,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    if (j.statusCode == "1" || j.statusCode == "2") {
      sendOTPMtrackapp();
    } else {
      alert("Please try again after 10 minutes");
    }
  });
}


function sendOTPMtrackapp() {
  var usr =
    $("#mobile").val() || $("#mobile1").val() || $("#EmailOrMobileno").val();
  if (usr != null && usr != "") {
    var c = JSON.stringify({
      mobile: usr,
      value: "mobile",
      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });
    var d = chkV(c);
    var settings = {
      url: "regOTP?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //alert(j);
      if (j.statusCode == "1") {
        otpEpirationTime(usr, "lblErroremailtrackapp");
        alert("OTP sent on given mobile.");
        $("#EmailOrMobileno").css("pointer-events", "none");
        $("#EmailOrMobileno").prop("readonly", true);
        //    $("#verifyMDiv, #verifyMDiv1").css("pointer-events", "all");

        $("#sendOTPButtonchkSt").attr("disabled", true);
        $("#OTPValueChkSt").attr("disabled", false);
        $("#verifyOTPButtonChkSt").attr("disabled", false);
      } else {
        alert("Something went wrong.");
        //   $("#verifyMDiv, #verifyMDiv1").css("pointer-events", "none");
      }
    });
  } else {
    alert("Please enter mobile!");
  }
}






$("#yourUsername").keypress(function (e) {
  //console.log($(this).val())
  return validEmail(e);
});

function validEmail(e) {
  var keyCode = e.keyCode || e.which;

  // var lblError5 = document.getElementById("inputGroupPrepend");
  //lblError5.innerHTML = "";

  //Regex for Valid Characters i.e. Alphabets.
  var regex = /^[A-Za-z0-9@._-]*$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  // if (!isValid) {
  //  lblError5.innerHTML = "Please valid email Id.";
  // }

  return isValid;
}

$("#verifyOTPButton, #verifyOTPButton1").click(function () {
  verifyOTP();
});

$("#verifyOTPButtonM, #verifyOTPButtonM1").click(
  function () {
    verifyOTPM();
  }
);

var otp = "";
var encrN = 0;
function userExists() {
  if (encrN == 0) {
    var usr = $("#OTPValue").val();
    if (usr != null && usr != "") {
      var c = JSON.stringify({
        username: usr,
      });
      var d = chkV(c);
      var settings = {
        url: "cU?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        //alert(j);
        if (j.statusCode == "1") {
          checkUser();
        } else {
          alert("Invalid username");
        }
      });
    } else {
      alert("Please enter username!");
    }
  } else {
    checkUser();
  }
}

function checkUserExist(usr) {
  var c = JSON.stringify({
    value: usr,
  });
  var d = chkV(c);
  var settings = {
    url: "checkUser?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(j);
    if (j.statusCode == "1") {
      return true;
    } else {
      return false;
    }
  });
}

function sendOTPE() {
  var usr = $("#email").val() || $("#email1").val();
  if (usr != null && usr != "") {
    var c = JSON.stringify({
      email: usr,
      value: "email",
      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });
    var d = chkV(c);
    var settings = {
      url: "regOTP?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //alert(j);
      if (j.statusCode == "1") {
        otpEpirationTime(usr, "lblErroremailE");
        alert("OTP sent on given email.");
        $("#email, #email1").css("pointer-events", "none");
        $("#email, #email1").prop("readonly", true);
        $("#verifyEDiv, #verifyEDiv1").css("pointer-events", "all");
      } else {
        alert("Something went wrong.");
        $("#verifyEDiv, #verifyEDiv1").css("pointer-events", "none");
      }
    });
  } else {
    alert("Please enter email!");
  }
}

function sendOTPM() {
  var usr =
    $("#mobile").val() || $("#mobile1").val() || $("#EmailOrMobileno").val();
  if (usr != null && usr != "") {
    var c = JSON.stringify({
      mobile: usr,
      value: "mobile",
      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });
    var d = chkV(c);
    var settings = {
      url: "regOTP?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //alert(j);
      if (j.statusCode == "1") {
        otpEpirationTime(usr, "lblErroremail");
        alert("OTP sent on given mobile.");
        $("#mobile, #mobile1, #EmailOrMobileno").css("pointer-events", "none");
        $("#mobile, #mobile1,#EmailOrMobileno").prop("readonly", true);
        $("#verifyMDiv, #verifyMDiv1").css("pointer-events", "all");

        $("#sendOTPButtonchkSt").attr("disabled", true);
        $("#OTPValueChkSt").attr("disabled", false);
        $("#verifyOTPButtonChkSt").attr("disabled", false);
      } else {
        alert("Something went wrong.");
        $("#verifyMDiv, #verifyMDiv1").css("pointer-events", "none");
      }
      $('#sessionvalue').val(j.newSession);
    });
  } else {
    alert("Please enter mobile!");
  }
}

function checkUser() {
  var usr = $("#OTPValue").val();
  if (usr != null && usr != "") {
    var c = JSON.stringify({
      username: usr,
    });
    var d = chkV(c);
    var settings = {
      url: "otpL?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //alert(j);
      if (j.statusCode == "1" || j.statusCode == "2") {
        //otp = j.rows.password;
        sendOTP();
      } else {
        alert("Please try again after 10 minutes");
      }
    });
  } else {
    alert("Please enter username");
  }
}



// old
// function checkOtp() {
//   if (otpM == 1 && otpE == 1) {
//     $("#registerDiv").css("pointer-events", "all");
//   } else {
//     $("#registerDiv").css("pointer-events", "none");
//   }
// }
// new - sky - 27th June 2024
function checkOtp() {
  if (
    (globalEmailVerification === 0 && otpM === 1) ||
    (globalEmailVerification === 1 && otpM === 1 && otpE === 1)
  ) {
    $("#registerB").css("pointer-events", "all");
  } else {
    // $("#registerB").css("pointer-events", "none");
  }
}
// new - sky - 27th June 2024

function verifyOTP() {
  var otpV = $("#OTPValueV").val() || $("#OTPValueV1").val();
  var usr = $("#email").val() || $("#email1").val();
  if (otpV != null && otpV != "") {
    var c = JSON.stringify({
      email: usr,
      passw: otpV,
      value: "email",
    });
    var d = chkV(c);
    var settings = {
      url: "verifyEmailOTP?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      // j = decodewithtime(j);
      //	console.log(j)
      if (j != null) {
        j = JSON.parse(j);
        if (j.statusCode == "1") {
          alert("OTP verification successful.");
          $("#lblErroremailE").hide();
          otpE = 1;
          $(".afterVer2").addClass("text-success bi bi-check-all").text("");
          $("#verifyEDiv, #verifyEDiv1").css("pointer-events", "none");
          $("#sendOTPButton, #sendOTPButton1").css("pointer-events", "none");
          checkOtp();
          forgotPwdSt();
          return true;
        } else {
          //  alert("Invalid OTP");
          otpE = 0;
          return false;
        }
      } else {
        // alert("Authentication Failed");
        return false;
      }
    });
  } else {
    //alert("Please enter OTP!");
    return false;
  }
}

function verifyOTPM() {
  // debugger
  //  console.log("inside verifyOTPM")
  var otpV =
    $("#OTPValueM").val() ||
    $("#OTPValueM1").val() ||
    $("#OTPValueChkSt").val();
  var usr =
    $("#mobile").val() || $("#mobile1").val() || $("#EmailOrMobileno").val();
  if (otpV != null && otpV != "") {
    var c = JSON.stringify({
      mobile: usr,
      passw: otpV,
      value: "mobile",
    });
    var d = chkV(c);
    var settings = {
      url: "verifyMobileOTP?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      //   j = decodewithtime(j);
      //	console.log(j)
      if (j != null) {
        j = JSON.parse(j);
        if (j.statusCode == "1" && j.strforsafe == otpV) {
          alert("OTP verification successful.");
          $("#verifymobilestatus").val("true")
          $("#lblErroremail").hide();
          $(".afterVer").addClass("text-success bi bi-check-all").text("");
          otpM = 1;
          //$("#verifyMDiv, #verifyMDiv1").css("pointer-events", "none");
          //$("#sendOTPButtonM, #sendOTPButtonM1").css("pointer-events", "none");
          checkOtp();
          forgotPwdSt();

          $("#btnpop").attr("disabled", false);
          return true;
        } else {
          alert("Invalid OTP");
          otpM = 0;
          return false;
        }
      } else {
        //   alert("Authentication Failed");
        return false;
      }
    });
  } else {
    alert("Please enter OTP!");
    return false;
  }
}

$("#registerB").click(function () {
  var gender = $("#inputGender").find(":selected").val();
  var region = $("#inputRegion").find(":selected").val();
  var district = $("#inputDistrict").find(":selected").val();
  var blockName = $('#blockName').find(":selected").val();
  var panchayatName = $('#panchayatName').find(":selected").val();
  // var psga = $('input[name="psga"]:checked').val();
  var municipalityName = $('#municipalityName').find(":selected").val();
  var wardName = $('#wardName').find(":selected").val();
  var umrb = $('input[name="umrb"]:checked').val() || "";


  // 28th Jul 2024 - SKY
  var selectedLanguage = $('input[name="prefCommlangauge"]:checked').val();
  // 28th Jul 2024 - SKY

  var validation = selectedLanguage == "" ||
    selectedLanguage == undefined ||
    gender == 0 ||
    region == 0 ||
    district == 0 ||
    $("#fn").val() == null ||
    $("#fn").val().trim() == "" ||
    $("#ln").val() == null ||
    $("#ln").val().trim() == "" ||
    $("#mobile").val() == null ||
    $("#mobile").val().trim() == "" ||
    $("#pin").val() == null ||
    $("#pin").val().trim() == "" ||
    $("#address").val() == null ||
    $("#address").val().trim() == "" ||
    $("#dob").val() == null ||
    $("#dob").val() == "" ||
    (globalEmailVerification == 1 &&
      $("#email").val() == null &&
      $("#email").val().trim() == "");

  if (region == "1") {
    var municipalityOrBlock = 0;
    var wardOrPanchayat = 0;

    if (umrb == "Municipality") {
      municipalityOrBlock = $('#municipalityName').find(":selected").val();
      wardOrPanchayat = $('#wardName').find(":selected").val();
    } else if (umrb == "Block") {
      municipalityOrBlock = $('#blockName').find(":selected").val();
      wardOrPanchayat = $('#panchayatName').find(":selected").val();
    }

    validation ||= +municipalityOrBlock == 0 || wardOrPanchayat == 0;
  }


  // console.log(validation)

  if (validation) {

    alert("All fields except middle name are mandatory.");
  } else if ($("#OTPValueM").val() == "") {
    alert("Please enter Mobile OTP")
  }
  else if ($("#captchaUserreg").val() == "") {
    alert("Enter Captcha!")
  } else {

    $("#registerB").attr("disabled", true);

    // if(verifyOTPM()){
    // 	alert("Please check the OTP!")
    // 	return false;
    // }
    blockName = (blockName == "0") ? $('#blockName').find(":selected").val() : $('#blockName').find(":selected").text();
    panchayatName = (panchayatName == "0") ? $('#panchayatName').find(":selected").val() : $('#panchayatName').find(":selected").text();
    municipalityName = (municipalityName == "0") ? $('#municipalityName').find(":selected").val() : $('#municipalityName').find(":selected").text();
    wardName = (wardName == "0") ? $('#wardName').find(":selected").val() : $('#wardName').find(":selected").text();

    var formString = $("#registerForm").find("input[name!=_csrf]").serialize(); // All data in one String.

    formString =
      formString +
      "&gender=" +
      gender +
      "&region=" +
      $("#inputRegion").find(":selected").text() +
      "&district=" +
      $("#inputDistrict").find(":selected").text() +
      "&address=" +
      $("#address").val() +
      "&usercaptcha=" +
      $("#captchaUserreg").val() +
      "&emailAlert=" +
      globalEmailVerification +
      "&prefCoomunicationLang=" +
      selectedLanguage +
      "&blockName=" +
      blockName +
      "&panchayatName=" +
      panchayatName +
      "&municipalityName=" +
      municipalityName +
      "&wardName=" +
      wardName +
      "&captchaId=" +
      window.registerCaptchaId +
      "&usercaptcha=" +
      window.registerCaptchaInput.value.trim();

    console.log(formString)
    var d = chkV(formString);
    var settings = {
      url: "saveUser?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j.statusCode == "1") {
        alert(
          "Registration Successfull, Credentials to login have been sent on registered mobile no / Email ID"
        );
        window.location.reload();
      } else if (j.statusCode == "2") {
        alert("Error! User already exists. Login to continue.");
        window.location.reload();
      }
      else if (j.statusCode == "3") {
        alert("captcha authenntication failed");
        // window.location.reload();
      }
      else if (j.statusCode == "4") {
        var msg = j.statusName;
        alert(msg);
        //    window.location.reload();
      }
      else {
        alert("Something went wrong. Try again later.");
        window.location.reload();
      }
    });
  }
});

var clickedValue;
$(".logCls li a").click(function () {
  $("#loginF").removeClass("d-none");
  // Get the text content of the clicked li element
  clickedValue = $(this).data("value");
  //	console.log(clickedValue)
  $("#formLogin").modal("show");
  if (clickedValue == 1) {
    $("#formLoginLabel").text($(".citiLog").text());
    $("#yourUsername").attr("type", "text");
    $("#yourUsername").attr("maxlength", 10); // Add this line
    $("#yourUsername").on("keyup", function () {
      var inputVal = $(this).val();
      var pattern = /^\d{0,10}$/;
      if (!pattern.test(inputVal)) {
        $(this).val(inputVal.slice(0, -1));
      }
    });
  } else if (clickedValue == 2) {
    $("#formLoginLabel").text($(".adminisLog").text());
    $("#yourUsername").attr("type", "email");
  }
  // else if (clickedValue == 2) {
  //   $("#formLoginLabel").text($(".deptAdminLog").text());
  // } else if (clickedValue == 3) {
  //   $("#formLoginLabel").text($(".dealHLog").text());
  // } else if (clickedValue == 4) {
  //   $("#formLoginLabel").text($(".dmLog").text());
  // } else if (clickedValue == 5) {
  //   $("#formLoginLabel").text($(".superAdminLog").text());
  // }
  //Clear Prefilled Username, Password, and Captch Fields If Any - SKY - 16 April 2024
  $("#yourUsername").val("");
  $("#yourPassword").val("");
  $("#captchaU").val("");
});

$(".citiLogUser").click(function () {
  clickedValue = $(this).data("value");
  //alert(clickedValue2);
});
function captcha() {
  var cap = document.getElementById("hiddenCaptcha").value;
  var capU = document.getElementById("captchaU").value;
  var usr = JSON.stringify({
    captchaHidden: cap,
    captchaUser: capU,
  });

  return new Promise(function (resolve) {
    var d = chkV(usr);
    var settings = {
      url: "checkCaptcha?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };

    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      if (j.statusCode === "1") {
        //   alert("success");
        resolve(true);
      } else {
        alert("Invalid Captcha");
        resetCaptcha();
        resolve(false);
      }
    });
  });
}


// function resetCaptcha() {
//   //alert("sdsfdfdsf")
//   var settings = {
//     url: "getCaptcha",
//     method: "POST",
//     timeout: 0,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   $.ajax(settings).done(function (j) {
//     j = setV(j);
//     j = JSON.parse(j);

//     var imageC = document.getElementsByClassName('captchaImage');;
//     var hCp = document.getElementById("hiddenCaptcha");
//     var userC = document.getElementById("captchaU");
//     var captchaSrc = j.realCaptcha;
//     var jj = chkV(j.hiddenCaptcha);
//     var hC = jj;

//     var cC = j.captcha;
//     for (var i = 0; i < imageC.length; i++) {
//       imageC[i].src = "data:image/jpg;base64," + captchaSrc;
//     }
//     hCp.value = hC;
//     userC.value = cC;
//   });
// }

$("#loginF").on("keypress", function (e) {
  if (e.key === "Enter" || e.keyCode === 13 || e.which === 13) {
    $("#loginB").click();
  }
});


$("#loginB").click(function () {
  // debugger
  if ($("#yourPassword").val() == "" || $("#yourUsername").val() == "") {
    alert("All fields are mandatory.");
  } else {
    captcha().then(function (success) {
      // Handle success
      if (success) {
        var d = chkV($("#yourUsername").val());
        var settings = {
          url: "checkUserRole?d=" + d,
          method: "POST",
          timeout: 0,
          headers: {
            "Content-Type": "application/json",
          },
        };
        $.ajax(settings).done(function (j) {
          j = setV(j);
          j = JSON.parse(j);
          //					console.log(j)
          if (j.statusCode === clickedValue) {
            $("#loginF").submit();
            $("#yourUsername").val("************************");
          } else {
            alert("Unauthorised user");
            //Clear Prefilled Username, Password, and Captch Fields If Any - SKY - 16 April 2024
            $("#yourUsername").val("");
            $("#yourPassword").val("");
            $("#captchaU").val("");
            //Reset Captcha when User is Unauthorised - SKY - 16 April 2024
            resetCaptcha();
          }
        });
        const now = new Date();
        const timestamp = now.toISOString();
        var up = HybridEncryption_WithTime($("#yourPassword").val());// + "::" + timestamp);
        var us = HybridEncryption_WithTime($("#yourUsername").val());// + "::" + timestamp);
        $("#yourPassword").val(up);
        $("#yourUsername").val(us);
        //$("#loginF").submit();
      } else {
        // Handle failure
      }
    });
  }
  //clickedValue=0;
});



$("#verifyOTPButtonChkSt").click(function () {

  verifyOTPM();
});

$("#btnpop").click(function () {
  var grvApp = $("#RegistrationNo").val();
  var mobEmail = $("#EmailOrMobileno").val();
  var utrackcapt = $("#captchaUsrtrack").val();
  var checkotptrack = $("#OTPValueChkSt").val();

  if ($("#RegistrationNo").val() == "" || $("#EmailOrMobileno").val() == "" || $("#OTPValueChkSt").val() == "" || $("#checkotptrack").val() == "") {
    alert("All fields are mandatory.");
  } else {


    // console.log("name ",$('#sessionvalue').val())
    // console.log("value ",$("#sessionname").val())
    // captcha().then(function (success) {
    // Handle success
    if (true) {
      // alert("success");
      var c = JSON.stringify({
        value: mobEmail,
        uniqid: grvApp,
        sessionvalue: $('#sessionvalue').val()
      });
      console.log(c);
      var d = chkV(c);
      var settings = {
        url: "getDataToTrackApp?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        console.log(j);
        if (j.statusCode === "1") {
          //   alert("Grievance current status : " + j.data[0].status);
          var c = JSON.stringify({
            radioVal: "JKSAMADHAN",
            gId: grvApp,
            mobile: mobEmail,
          });

          console.log(c)
          let dd = chkV(c);
          window.location.href = "trackGrievanceDatail?d=" + dd;

        }
        else if (j.statusCode === "2") {
          alert("captcha authentication failed");
          loadCaptcha();
        } else if (j.statusCode === "3") {
          alert("otp authentication failed");
        }
        else {
          alert("Application not found");
        }
      });


      // var up = chkV($("#yourPassword").val());
      // var us = chkV($("#yourUsername").val());
      // $("#yourPassword").val(up);
      // $("#yourUsername").val(us);
      //$("#loginF").submit();
      // } else {
      //   // Handle failure
    }
    //});
  }
  //clickedValue=0;
});

$("#email, #email1").keyup(function (e) {
  isEmail(e.target.value);
});

$("#mobile, #mobile1").keyup(function (e) {
  isMobile(e.target.value);
});

$("#mobile, #mobile1").bind("keyup paste", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

function validN(e) {
  var keyCode = e.keyCode || e.which;
  //Regex for Valid Characters i.e. Alphabets.
  var regex = /^[A-Za-z]+$/;
  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  return isValid;
}

$(".input-f").keypress(function (e) {
  return validN(e);
});

$(".stopsql").keypress(function (e) {
  // Get the ASCII code of the pressed key
  var charCode = e.which || e.keyCode;

  // ASCII codes: 60 = '<', 62 = '>'
  if (charCode === 60 || charCode === 62) {
    e.preventDefault(); // Prevent the default action (character input)
    //  alert('Characters "<" and ">" are not allowed.');
  }
});

function isEmail(email) {
  // var email = $("#email").val();
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (regex.test(email)) {
    $("#sendOTPButton").attr("disabled", false);
    $("#sendOTPButton1").attr("disabled", false);
  } else {
    $("#sendOTPButton").attr("disabled", true);
    $("#sendOTPButton1").attr("disabled", true);
  }
}

function isMobile(mobile) {
  // var mobile = $("#mobile").val();
  var regex = /^([6789][0-9]{9})$/;
  if (regex.test(mobile)) {
    $("#sendOTPButtonM").attr("disabled", false);
    $("#sendOTPButtonM1").attr("disabled", false);
  } else {
    $("#sendOTPButtonM").attr("disabled", true);
    $("#sendOTPButtonM1").attr("disabled", true);
  }
}

$("#yourUsername").keyup(function (e) {
  if (clickedValue == 1) {
    $("#loginB").attr("disabled", false);
  } else if (clickedValue == 2) {
    isEmail2();
  } else {
    $("#loginB").attr("disabled", true);
  }
});

function isEmail2() {
  var email = $("#yourUsername").val();
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (regex.test(email)) {
    $("#loginB").attr("disabled", false);
  } else {
    $("#loginB").attr("disabled", true);
  }
}

var dtToday = new Date();

var month = dtToday.getMonth() + 1;
var day = dtToday.getDate();
var year = dtToday.getFullYear();

if (month < 10) month = "0" + month.toString();
if (day < 10) day = "0" + day.toString();

var maxDate = year + "-" + month + "-" + day;
$("#dob").attr("max", maxDate);

// var showChat = 0;
// $("#chatBot").click(function () {
//   if (showChat == 0) {
//     //  		local
//     //  		$('#iframeDiv').html('<iframe id="iframe" src="http://localhost:8081/index" width="480" height="450"></iframe>');
//     //  		live
//     $("#iframeDiv").html(
//       '<iframe id="iframe" src="https://stagefive.ncog.gov.in/ChatGrv/index" width="480" height="450"></iframe>'
//     );
//     showChat = 1;
//     $("#iframeDiv").css("z-index", "2222");
//   } else {
//     $("#iframeDiv").html("");
//     showChat = 0;
//     $("#iframeDiv").css("z-index", "");
//   }
// });



function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>").attr("value", value.values).text(value.values)
    );
  });
}

$("#inputRegion").change(function () {
  var addDeptV = $("#inputRegion").find(":selected").val();
  $("#inputDistrict").html("");
  $("#inputDistrict").append('<option value="0">--Select District--</option>');
  if (addDeptV != "0") {

    if (addDeptV == "1") {
      $('#muniPan').removeClass("d-none");
    } else {
      $('#muniPan').addClass("d-none");
      $("#municipalityName").val(0);
      $("#blockName").val(0);
      $("#wardName").val(0);
      $("#panchayatName").val(0);


    }

    $("#inputDistrict").attr("disabled", false);

    //client side json start
    var regValue = $("#inputRegion").find(":selected").text();
    // console.log(regValue)
    var distData = regValue == "JAMMU AND KASHMIR" ? jkDistData : districtData;
    var filteredCities = distData.filter(city => {
      // console.log(regValue.trim().toUpperCase()+"   "+city.statename.trim().toUpperCase());
      return city.statename.trim().toUpperCase() === regValue.trim().toUpperCase();
    });
    makeDropdown2(inputDistrict, filteredCities);

    //client side json end

    // var c = JSON.stringify({
    //   value: $("#inputRegion").find(":selected").text(),
    // });
    // var d = chkV(c);
    // var settings = {
    //   url: "districts?d=" + d,
    //   method: "POST",
    //   timeout: 0,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };
    // $.ajax(settings).done(function (j) {
    //   j = setV(j);
    //   j = JSON.parse(j);
    //   if (j.statusCode == "1") {
    //     //console.log(j.data);
    //     makeDropdown2(inputDistrict, j.data);
    //   }
    // });
  } else {
    $("#inputDistrict").attr("disabled", true);
  }
});

function makeDropdown2(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>")
        .attr("value", value.id)
        .text(value.values.toUpperCase())
    );
  });
}



$("#inputDistrict").change(function () {

  var addDeptV = $("#inputDistrict").find(":selected").val();

  // console.log(addDeptV)

  $("#blockName").html("");
  $("#blockName").append('<option value="0">Select Block</option>');
  $("#panchayatName").html("");
  $("#panchayatName").append('<option value="0">Select Panchayat</option>');


  // municipality
  $("#municipalityName").html("");
  $("#municipalityName").append('<option value="0">Select Municipality</option>');
  $("#wardName").html("");
  $("#wardName").append('<option value="0">Select Ward</option>');

  //console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///

    $("#blockName").prop("disabled", false);
    $("#blockName").val(0);
    $("#panchayatName").prop("disabled", false);
    $("#panchayatName").val(0);


    // municipality
    $("#municipalityName").prop("disabled", false);
    $("#municipalityName").val(0);
    $("#wardName").prop("disabled", false);
    $("#wardName").val(0);


    //client side json start
    var regValue = addDeptV;
    // console.log(regValue)
    // var distData=regValue=="JAMMU AND KASHMIR" ? jkDistData : districtData;
    var filteredBlock = blockData.filter(block => {
      // console.log(regValue+"   "+block.district_id);
      return String(block.district_id) === String(regValue);
    });
    //  console.log(filteredBlock)
    makeDropdown2(blockName, filteredBlock);

    var filteredMuicipality = municipalityData.filter(municipality => {
      //  console.log(regValue+"   "+municipality.district_id);
      return String(municipality.district_id) === String(regValue);
    });
    //console.log(filteredMuicipality)
    makeDropdown2(municipalityName, filteredMuicipality);

    //client side json end


    // var c = JSON.stringify({
    //   value: addDeptV,
    // });
    // var d = chkV(c);

    // // for Block AJAX
    // var settings1 = {
    //   url: "blockByDistrict?d=" + d,
    //   method: "POST",
    //   timeout: 0,
    // };
    // $.ajax(settings1).done(function (j) {
    //   j = setV(j);
    //   j = JSON.parse(j);
    //   //console.log(j)
    //   if (j.statusCode == "1") {
    //     //	console.log(j.data);
    //     $("#blockName").attr("disabled", false);
    //     $("#panchayatName").attr("disabled", false);
    //     //$('#depName').val(j.data[0].department_name);
    //     if (j.data[0].values != "") {
    //       makeDropdown2(blockName, j.data);
    //     } else {
    //       $("#blockName").attr("disabled", true);
    //       $("#panchayatName").attr("disabled", true);
    //     }
    //   } else {
    //     $("#blockName").attr("disabled", false);
    //     $("#panchayatName").attr("disabled", false);
    //   }
    // });

    // for Municipality AJAX
    // var settings2 = {
    //   url: "municipalityByDistrict?d=" + d,
    //   method: "POST",
    //   timeout: 0,
    // };
    // $.ajax(settings2).done(function (j) {
    //   j = setV(j);
    //   j = JSON.parse(j);
    //   //console.log(j)
    //   if (j.statusCode == "1") {
    //     //	console.log(j.data);
    //     $("#municipalityName").attr("disabled", false);
    //     $("#wardName").attr("disabled", false);
    //     //$('#depName').val(j.data[0].department_name);
    //     if (j.data[0].values != "") {
    //       makeDropdown2(municipalityName, j.data);
    //     } else {
    //       $("#municipalityName").attr("disabled", true);
    //       $("#wardName").attr("disabled", true);
    //     }
    //   } else {
    //     $("#municipalityName").attr("disabled", false);
    //     $("#wardName").attr("disabled", false);
    //   }
    // });


  } else {

    $("#blockName").prop("disabled", true);
    $("#blockName").val(0);
    $("#panchayatName").prop("disabled", true);
    $("#panchayatName").val(0);


    // municipality
    $("#municipalityName").prop("disabled", true);
    $("#municipalityName").val(0);
    $("#wardName").prop("disabled", true);
    $("#wardName").val(0);
  }
});


$("#blockName").change(function () {
  var addDeptV = $("#blockName").find(":selected").val();
  //console.log(addDeptV);
  $("#panchayatName").html("");
  $("#panchayatName").append('<option value="0">Select Panchayat</option>');
  if (addDeptV != 0) {
    $("#panchayatName").prop("disabled", false);
    $("#panchayatName").val(0);


    //client side json start

    var filteredPanchayat = panchayatData
      .filter(panchayat => String(panchayat.block_id) === String(addDeptV))
      .sort((a, b) => a.values.localeCompare(b.values));

    //console.log(filteredPanchayat)
    makeDropdown2(panchayatName, filteredPanchayat);

    //client side json end


    // var c = JSON.stringify({
    //   value: addDeptV,
    // });
    // var d = chkV(c);
    // var settings = {
    //   url: "panchayatByBlock?d=" + d,
    //   method: "POST",
    //   timeout: 0,
    // };
    // $.ajax(settings).done(function (j) {
    //   j = setV(j);
    //   j = JSON.parse(j);
    //   //  console.log(j)
    //   if (j.statusCode == "1") {
    //     	// console.log(j.data);
    //     $("#panchayatName").attr("disabled", false);
    //     makeDropdown2(panchayatName, j.data);
    //   } else {
    //     $("#panchayatName").attr("disabled", true);
    //   }
    // });
  } else {
    $("#panchayatName").prop("disabled", true);
    $("#panchayatName").val(0);

  }
});

// municipalityName on change for ward name - 09/01/2025 - SKY
$("#municipalityName").change(function () {
  var addDeptV = $("#municipalityName").find(":selected").val();
  //console.log(addDeptV);
  $("#wardName").html("");
  $("#wardName").append('<option value="0">Select Ward</option>');
  if (addDeptV != 0) {
    $("#wardName").prop("disabled", false);
    $("#wardName").val(0);

    //client side json start

    var filteredWard = wardData.filter(ward => {
      //  console.log(addDeptV+"   "+municipality.district_id);
      return String(ward.ulb_id) === String(addDeptV);
    });
    console.log(filteredWard)
    makeDropdown2(wardName, filteredWard);

    //client side json end

    //   var c = JSON.stringify({
    //     value: addDeptV,
    //   });
    //   var d = chkV(c);
    //   var settings = {
    //     url: "wardByMunicipality?d=" + d,
    //     method: "POST",
    //     timeout: 0,
    //   };
    //   $.ajax(settings).done(function (j) {
    //     j = setV(j);
    //     j = JSON.parse(j);
    //     //  console.log(j)
    //     if (j.statusCode == "1") {
    //       	// console.log(j.data);
    //       $("#wardName").attr("disabled", false);
    //       makeDropdown2(wardName, j.data);
    //     } else {
    //       $("#wardName").attr("disabled", true);
    //     }
    //   });
    // } else {
    //   $("#wardName").prop("disabled", true);
    //   $("#wardName").val(0);

  }
});




function GTranslateGetCurrentLang() {
  var keyValue = document.cookie.match("(^|;) ?googtrans=([^;]*)(;|$)");
  return keyValue ? keyValue[2].split("/")[2] : null;
}

function GTranslateFireEvent(element, event) {
  try {
    if (document.createEventObject) {
      var evt = document.createEventObject();
      element.fireEvent("on" + event, evt);
    } else {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true);
      element.dispatchEvent(evt);
    }
  } catch (e) { }
}
function doGTranslate(lang_pair) {
  if (lang_pair.value) lang_pair = lang_pair.value;
  if (lang_pair == "") return;
  var lang = lang_pair.split("|")[1];
  if (GTranslateGetCurrentLang() == null && lang == lang_pair.split("|")[0])
    return;
  if (typeof ga != "undefined") {
    ga(
      "send",
      "event",
      "GTranslate",
      lang,
      location.hostname + location.pathname + location.search
    );
  } else {
    if (typeof _gaq != "undefined")
      _gaq.push([
        "_trackEvent",
        "GTranslate",
        lang,
        location.hostname + location.pathname + location.search,
      ]);
  }
  var teCombo;
  var sel = document.getElementsByTagName("select");
  for (var i = 0; i < sel.length; i++)
    if (sel[i].className == "goog-te-combo") teCombo = sel[i];
  if (
    document.getElementById("google_translate_element2") == null ||
    document.getElementById("google_translate_element2").innerHTML.length ==
    0 ||
    teCombo.length == 0 ||
    teCombo.innerHTML.length == 0
  ) {
    setTimeout(function () {
      doGTranslate(lang_pair);
    }, 500);
  } else {
    teCombo.value = lang;
    GTranslateFireEvent(teCombo, "change");
    GTranslateFireEvent(teCombo, "change");
  }
}

function googleTranslateElementInit2() {
  new google.translate.TranslateElement(
    { pageLanguage: "en", autoDisplay: false },
    "google_translate_element2"
  );
}

$(document).on("click", ".fabs", function () {
  toggleBtn();
});

$(document).on("click", ".trans", function (e) {
  var lan = $(".trans").find(":selected").val();
  doGTranslate(lan);
});

function toggleBtn() {
  const Btns = document.querySelector(".sticky_btns");
  const add = document.getElementById("add");
  const remove = document.getElementById("remove");
  const btn = document.querySelector(".sticky_btns").querySelectorAll("a");
  Btns.classList.toggle("open");
  if (Btns.classList.contains("open")) {
    remove.style.display = "block";
    add.style.display = "none";
    btn.forEach((e, i) => {
      setTimeout(() => {
        bottom = 50 * i;
        e.style.bottom = bottom + "px";
        // console.log(e);
      }, 100 * i);
    });
  } else {
    add.style.display = "block";
    remove.style.display = "none";
    btn.forEach((e, i) => {
      e.style.bottom = "0px";
    });
  }
}

//Canvas Menu
$(".canvas__open").on("click", function () {
  if ($(".canvas_open").hasClass("canvas_open_close")) {
    //alert("hii");
    $(".header__nav").removeClass("show-offcanvas-menu");
    $(".offcanvas-menu-overlay").removeClass("active");
    $("body").removeClass("over-hid");
    $(".canvas_open").removeClass("canvas_open_close");
  } else {
    //alert("bye");
    $(".header__nav").addClass("show-offcanvas-menu");
    $(".offcanvas-menu-overlay").addClass("active");
    $("body").addClass("over-hid");
    $(".canvas_open").addClass("canvas_open_close");
  }
});

$(".offcanvas-menu-overlay").on("click", function () {
  //alert("bye");
  $(".header__nav").removeClass("show-offcanvas-menu");
  $(".offcanvas-menu-overlay").removeClass("active");
  $("body").removeClass("over-hid");
});

// about us video modal

// var vid = document.getElementById("aboutVideoModal");

function playVid() {
  //alert("hi");
  vid.play();
}

function pauseVid() {
  //alert("bye");
  vid.pause();
}

// $(function () {
//   $("#aboutVideoModal")
//     .modal({
//       show: false,
//     })
//     .on("hidden.bs.modal", function () {
//       $(this).find("video")[0].pause();
//     });

//   $("#aboutVideoModal").find("video")[0].pause();
// });

// mobile app tab script starts

let totalTabsCount = 0;
let activeTabIndex = 1;
let tabChangeTimeout = 3000;

totalTabsCount = $("#v-pills-tab .nav-link").length;

function tabChangeHandler() {
  if (activeTabIndex == totalTabsCount) {
    activeTabIndex = 1;
  } else {
    activeTabIndex++;
  }
  $("#v-pills-tab .nav-link")
    .eq(parseInt(activeTabIndex - 1))
    .trigger("click");
}

//let AUTO_CHANGE_TIMER = setInterval(tabChangeHandler, tabChangeTimeout);

// IF PAUSE AUTO CHANGE ON HOVER THEN FOLLOW BELOW CODE
$("#v-pills-tab .nav-link").hover(
  function () {
    clearInterval(AUTO_CHANGE_TIMER);
  },
  function () {
    AUTO_CHANGE_TIMER = setInterval(tabChangeHandler, tabChangeTimeout);
  }
);

$("#yrLogin").on("hidden.bs.modal", function () {
  var x = document.getElementById("stp1");
  x.pause();
});

$("#yrRegister").on("hidden.bs.modal", function () {
  var x = document.getElementById("stp2");
  x.pause();
});

$("#DOPGLogin").on("hidden.bs.modal", function () {
  var x = document.getElementById("stp3");
  x.pause();
});

function otpEpirationTime(user, id) {
  // $('#'+id).html('');
  var time = 120;
  const countdownInterval = setInterval(() => {
    time--;

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById(id).innerText =
      "OTP will expire in " + minutes + " min " + seconds + " sec.";

    //document.getElementById(id).innerText = 'OTP will expire in '+time+' seconds.';

    if (time <= 0) {
      var c = JSON.stringify({
        value: user,
      });
      var d = chkV(c);
      var settings = {
        url: "deleteOTP?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        if (j.statusCode == "1") {
          clearInterval(countdownInterval);
          //  alert('OTP has expired');
          //console.log(j.data);
        } else {
          alert("Something went wrong");
        }
      });
    }
  }, 1000);
}

// $(document).on("click", ".btn-close", function () {
//   window.location.reload();
// });

// Forgot password - 04th July 2024 - start -sky
$(document).on("click", ".forgetBtn", function () {
  // alert('hello')
  if (clickedValue == 1) {
    // alert("citizen");
    $("#loginF").addClass("d-none");
    $(".emlVerfDiv").addClass("d-none");
    $(".forgotPwd").removeClass("d-none");
  } else if (clickedValue == 2) {
    // alert("administrative");
    $("#loginF").addClass("d-none");
    $(".forgotPwd").removeClass("d-none");
    $(".emlVerfDiv").removeClass("d-none");
  }
});
// Forgot password - 04th July 2024 - end -sky

function forgotPwdSt() {


  if
    (globalEmailRequirement === false) {
    $("#registerB").attr("disabled", false);

  }

  if (
    (globalEmailRequirement === false &&
      globalMobileRequirement === true &&
      otpM === 1 &&
      clickValueForgetPwd === 1) ||
    (globalEmailRequirement === true &&
      globalMobileRequirement === true &&
      otpM === 1 &&
      otpE === 1 &&
      clickValueForgetPwd === 2)
  ) {
    $("#newPassword1").attr("disabled", false);
    $("#confirmNewPassword1").attr("disabled", false);
  } else {
    $("#newPassword1").attr("disabled", true);
    $("#confirmNewPassword1").attr("disabled", true);
  }
}

$("#confirmNewPassword1").on("input", function () {
  var newPassword = $("#newPassword1").val();
  var confirmNewPassword = $("#confirmNewPassword1").val();
  var passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  var messageElement = $("#message");

  if (!passwordPattern.test(newPassword)) {
    messageElement.text(
      "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character."
    );
    messageElement.css("color", "red");
    $("#updateB").attr("disabled", true);
  } else if (newPassword !== confirmNewPassword) {
    messageElement.text("Passwords do not match.");
    messageElement.css("color", "red");
    $("#updateB").attr("disabled", true);
  } else {
    messageElement.text("Password is valid and matches.");
    messageElement.css("color", "green");
    $("#updateB").attr("disabled", false);
  }
});

$(document).on("click", "#updateB", function () {

  var newPwd = $("#newPassword1").val().trim();
  var cNewPwd = $("#confirmNewPassword1").val().trim();
  if (
    newPwd != null &&
    newPwd != "" &&
    newPwd != " " &&
    cNewPwd != null &&
    cNewPwd != "" &&
    cNewPwd != " " &&
    newPwd === cNewPwd
  ) {
    // update user password
    var c = JSON.stringify({
      newpassword: cNewPwd,
      val1: $("#mobile1").val().trim(),
      val2: $("#email1").val().trim(),

      captchaId: window.forgotPwdCaptchaId,
      usercaptcha: window.forgotPwdCaptchaInput.value.trim(),

      clickedValue: clickValueForgetPwd

    });
    var d = chkV(c);
    var settings = {
      url: cp + "forgotUsrPwd?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      console.log('statusCode', j.statusCode);
      if (j.statusCode == "1") {
        alert(
          "Password Updated Successfully. Please Login with updated password."
        );
        window.location.reload();
      }
      else if (j.statusCode == "2") {
        alert("captcha authentication failed");
        loadCaptcha();
        //  window.location.reload();
      } else if (j.statusCode == "3") {
        alert("New password cannot be same as old password");
      } else if (j.statusCode == "4") {
        alert("Credentials are invalid. Either mobile or email does not belong to the Administrative User.");
      }
      else {
        alert("Something went wrong.");
        //  window.location.reload();
      }
    });
  }
  // cmt_25
  else {
    alert("Please verify OTP !!");
  }
});

function captchasuggestion() {

  var cap = document.getElementById("hiddenCaptchasuggstion").value;
  var capU = document.getElementById("captchaUsuggestoin").value;
  var usr = JSON.stringify({
    captchaHidden: cap,
    captchaUser: capU,
  });

  return new Promise(function (resolve) {
    var d = chkV(usr);
    var settings = {
      url: "checkCaptcha?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };

    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      if (j.statusCode === "1") {
        //   alert("success");
        resolve(true);
      } else {
        alert("Invalid Captcha");
        resetCaptcha();
        resolve(false);
      }
    });
  });
}

$("#submitsuggestion").click(function () {
  var sugone = $("#suggestionone").find(":selected").val();
  var sugtwo = $("#suggestiontwo").find(":selected").val();
  var sugthree = $("#suggestionthree").find(":selected").val();
  if (
    sugone == "0" ||
    $("#sname").val() == null ||
    $("#smob").val().trim() == "" ||
    $("#smail").val() == null ||
    $("#descriptionsone").val().trim() == ""
  ) {
    alert("All marked with red star fields are mandatory.");
  } else {
    //	captchasuggestion().then(function (success){
    //  var formString = $("#suggestionofusr").find("input[name!=_csrf]").serialize(); // All data in one String.
    var formString =
      formString +
      "&sname=" +
      $("#sname").val() +
      "&smob=" +
      $("#smob").val() +
      "&smail=" +
      $("#smail").val() +
      "&sugone=" +
      $("#suggestionone").find(":selected").val() +
      "&sugtwo=" +
      $("#suggestiontwo").find(":selected").val() +
      "&sugthree=" +
      $("#suggestionthree").find(":selected").val() +
      "&descone=" +
      $("#descriptionsone").val() +
      "&desctwo=" +
      $("#descriptionstwo").val() +
      "&descthree=" +
      $("#descriptionsthree").val() +
      "&usercaptcha=" +
      $("#captchaUsuggestoin").val();

    var d = chkV(formString);
    var settings = {
      url: "saveSuggestions?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //  alert(j.statusCode)
      if (j.statusCode == "1") {
        alert(
          "Thank you for your suggestion.your suggestion has been saved successfully!!"
        );
      } else if (j.statusCode == "2") {
        alert("Error! User already exists. Login to continue.");
      } else if (j.statusCode == "3") {
        alert("Captcha authentication failed");
        loadCaptcha();
      } else if (j.statusCode == "4") {
        var msg = j.statusName;
        alert(msg);
        // window.location.reload();
      } else {
        alert("Something went wrong. Try again later.");
      }
      window.location.href = "login";
    });
    //	});
  }
});

$('input[name="umrb"]').change(function () {

  $("#municipalityName").val(0);
  $("#blockName").val(0);
  $("#wardName").val(0);
  $("#panchayatName").val(0);

  var selectedValue = $(this).val();
  var umrb = (selectedValue === 'Municipality') ? 'municipalityName,wardName' : 'blockName,panchayatName';

  // Resetting dropdowns
  umrb.split(',').forEach(function (id) {
    $('#' + id).prop('selectedIndex', 0);
  });

  // Toggle visibility of elements
  $('.umrb1').toggleClass('d-none', selectedValue !== 'Municipality');
  $('.umrb2').toggleClass('d-none', selectedValue !== 'Block');
});




//Naitik Changes for new login 16/12/2025

// New Register Form logic
$('[data-bs-target="#formRegister"]').click(function () {
  loadCaptcha();
})

document.addEventListener('DOMContentLoaded', function () {
  let loginType = null;
  window.captchaId = null;
  window.forgotPwdCaptchaId = null;
  window.registerCaptchaId = null;

  const usernameInput = document.getElementById('newUsername');
  const passwordInput = document.getElementById('newPassword');
  const captchaInput = document.getElementById('captchaInput');
  const forgotPwdCaptchaInput = document.getElementById('forgotPwdCaptchaInput');
  const refreshCaptchaBtn = document.querySelector('.resetCap');

  // Login Modal Details & Form
  const modal = document.getElementById('newLoginModal');
  const modalTitle = document.getElementById('newLoginModalLabel');
  const form = document.getElementById('newLoginForm');
  const step1 = document.getElementById('newLoginCredentials');
  const step2 = document.getElementById('newCaptchaVerification');
  const loginBtn = document.getElementById('loginBtnStep1');
  const captchaBtn = document.getElementById('captchaVerifyBtn');

  // Forgot Password Modal Details & Form
  const showEmailDiv = document.getElementById('emlVerfDiv');
  const forgotPwdModal = document.getElementById('newForgotPwdModal');
  const forgotPwdTitle = document.getElementById('newForgotPwdModalLabel');

  // Register Modal Details & Form
  const registerModal = document.getElementById('formRegister');


  //  USERNAME 

  function UsernameRules(type) {

    usernameInput.value = '';
    usernameInput.oninput = null;
    usernameInput.onpaste = e => e.preventDefault();

    if (type === 'CITIZEN') {
      usernameInput.oninput = function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
      };
    }

    if (type === 'ADMIN') {
      usernameInput.oninput = function () {
        let v = this.value.replace(/[^a-zA-Z0-9@._-]/g, '');
        if (/^\d+$/.test(v)) v = '';
        this.value = v;
      };
    }
  }

  // CAPTCHA LOAD 
  window.loadCaptcha = async function () {
    try {
      const response = await fetch(`${cp}/api/jks/auth/captcha`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'X-Client-Type': 'web' }
      });

      if (!response.ok) throw new Error('Captcha load failed');

      const captchaId = response.headers.get('Captcha-Id');
      if (!captchaId) throw new Error('Captcha-Id missing');

      // Save globally
      window.captchaId = captchaId;
      window.forgotPwdCaptchaId = captchaId;
      window.registerCaptchaId = captchaId;

      // Update all captchaId inputs
      ['captchaId', 'forgotPwdCaptchaId', 'registerCaptchaId'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = captchaId;
      });

      // Get blob URL for captcha image
      const imgUrl = URL.createObjectURL(await response.blob());

      // Update all captcha images
      ['captchaImage123', 'captchaImage1234', 'registerCaptchaImage123'].forEach(id => {
        const imgEl = document.getElementById(id);
        if (imgEl) imgEl.src = imgUrl;
      });

      // Clear input fields
      if (captchaInput) captchaInput.value = '';
      if (forgotPwdCaptchaInput) forgotPwdCaptchaInput.value = '';
      if (registerCaptchaInput) registerCaptchaInput.value = '';

    } catch (e) {
      console.error(e);
      alert('Failed to load captcha');
    }
  }

  // ADD above $(".resetCap").on("click", loadCaptcha);
  async function checkCaptchaRateLimit() {
    try {
      const username = encodeURIComponent(usernameInput.value.trim());
      const res = await fetch(`${cp}/api/jks/auth/captcha-status?username=${username}`, {
        method: 'GET',
        headers: { 'X-Client-Type': 'web' }
      });

      if (res.status === 429) {
        const data = await res.json();
        applyCaptchaBlock(data.remainingSeconds);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Rate limit check failed', e);
      return false;
    }
  }

  function applyCaptchaBlock(seconds) {
    if (!seconds || seconds <= 0) seconds = 600;

    const captchaImageEl = document.getElementById('captchaImage123');
    const resetCapBtn = document.querySelector('.resetCap');

    // Show captcha image — do NOT hide it
    if (captchaImageEl) captchaImageEl.style.display = '';

    // Show refresh button but disable it
    if (resetCapBtn) resetCapBtn.style.display = '';
    if (resetCapBtn) resetCapBtn.disabled = true;

    // Disable captcha input and show placeholder
    captchaInput.disabled = true;
    captchaInput.value = '';
    captchaInput.placeholder = 'Too many attempts...';

    // Disable verify button and show countdown on it
    captchaBtn.disabled = true;

    if (window.captchaBlockInterval) {
      clearInterval(window.captchaBlockInterval);
    }

    window.captchaBlockInterval = setInterval(() => {
      seconds--;
      const mins = Math.floor(seconds / 60);
      const secs = String(seconds % 60).padStart(2, '0');
      captchaBtn.textContent = `Too many attempts. Try again in ${mins}m ${secs}s`;

      if (seconds <= 0) {
        clearInterval(window.captchaBlockInterval);
        window.captchaBlockInterval = null;

        // Restore everything when block expires
        captchaBtn.disabled = false;
        captchaBtn.textContent = 'Verify Captcha';
        captchaInput.disabled = false;
        captchaInput.value = '';
        captchaInput.placeholder = '';
        if (resetCapBtn) resetCapBtn.disabled = false;
        loadCaptcha();
      }
    }, 1000);
  }

  $(".resetCap").on("click", loadCaptcha);

  //  LOGIN TYPE 
  document.querySelectorAll('[data-bs-target="#newLoginModal"]').forEach(link => {
    link.addEventListener('click', function () {

      loginType = this.getAttribute('data-login');

      if (loginType === 'CITIZEN') {
        modalTitle.textContent = 'Citizen Login';
        usernameInput.placeholder = 'Enter 10-digit Mobile Number';
      } else {
        modalTitle.textContent = 'Administrative Login';
        usernameInput.placeholder = 'Enter Email Address';
      }

      passwordInput.value = '';
      UsernameRules(loginType);
    });
  });

  // FORGOT PASSWORD TYPE
  document.querySelectorAll('[data-bs-target="#newForgotPwdModal"]').forEach(link => {
    link.addEventListener('click', function () {

      const isCitizen = loginType === 'CITIZEN';
      clickValueForgetPwd = isCitizen ? 1 : 2;


      forgotPwdTitle.textContent = isCitizen
        ? 'Citizen Forgot Password'
        : 'Administrative Forgot Password';

      usernameInput.placeholder = isCitizen
        ? 'Enter 10-digit Mobile Number'
        : 'Enter Email Address';

      passwordInput.value = '';
      UsernameRules(loginType);
      showEmailDiv.classList.toggle('d-none', isCitizen);
      loadCaptcha();
    });
  });

  //  PASSWORD TOGGLE 

  document.getElementById('togglePassword').addEventListener('click', () => {
    passwordInput.type =
      passwordInput.type === 'password' ? 'text' : 'password';
  });


  // LOGIN CLICK → VERIFY CREDENTIALS


  loginBtn.addEventListener('click', async () => {


    let valid = true;

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) valid = false;

    if (loginType === 'CITIZEN' && !/^\d{10}$/.test(username))
      valid = false;

    if (
      loginType === 'ADMIN' &&
      !/^[a-zA-Z][a-zA-Z0-9._-]*@[^\s@]+\.[^\s@]+$/.test(username)
    )
      valid = false;

    if (!valid) {
      alert('Invalid input');
      return;
    }


    const payload = {
      username: username,
      password: password
    };


    const encryptedPayload = chkV(JSON.stringify(payload));

    try {
      const res = await fetch(`${cp}/api/jks/auth/verify-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Type': 'web'
        },
        body: encryptedPayload
      });

      //  Handle invalid credentials 
      if (!res.ok) {
        let errMsg = 'Invalid username or password!';
        try {
          const err = await res.json();
          errMsg = err.message || errMsg;
        } catch (e) {

        }
        alert(errMsg);
        return;
      }


      step1.classList.add('d-none');
      step2.classList.remove('d-none');
      const isBlocked = await checkCaptchaRateLimit();
      if (!isBlocked) {
        loadCaptcha();
      }

    } catch (e) {
      console.error('Credential verification error:', e);
      alert('Login verification failed');
    }
  });




  // CAPTCHA VERIFY naitik changes for rate limit 10/04/2026

  captchaBtn.addEventListener('click', () => {

    if (!captchaInput.value || !window.captchaId) {
      alert('Captcha required');
      return;
    }

    const captchaPayload = {
      captchaId: window.captchaId,
      captcha: captchaInput.value.trim(),
      username: usernameInput.value.trim()
    };

    const encryptedPayload = chkV(JSON.stringify(captchaPayload));

    fetch(`${cp}/api/jks/auth/verify-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'web'
      },
      body: encryptedPayload
    })
      .then(res => {
        if (res.status === 429) {
          return res.json().then(data => {
            const remaining = data.remainingSeconds || 600;
            applyCaptchaBlock(remaining);
            alert('Too many wrong attempts. Please wait 10 minutes before trying again.');
            throw new Error('RATE_LIMITED');
          });
        }

        if (res.status === 400) {
          alert('Invalid captcha. Please try again.');
          loadCaptcha();
          return;
        }
        if (!res.ok) throw new Error('Invalid CAPTCHA');
        return res.text();
      })
      .then(encResp => {
        if (!encResp) return;

        if (encResp === 'CAPTCHA Verified') {

          // only sets flag for Citizen login to check profile completeness changes by Naitik 20/04/2026
          if (loginType === 'CITIZEN') {
            sessionStorage.setItem('checkProfileOnLoad', 'true');
          }
          //End Profile Completeness 20/04/2026 by Naitik
          usernameInput.value = HybridEncryption_WithTime(usernameInput.value);
          passwordInput.value = HybridEncryption_WithTime(passwordInput.value);
          $('#newLoginForm').submit();
        } else {
          alert(encResp || 'Invalid captcha');
          loadCaptcha();
        }
      })
      .catch((err) => {
        if (err.message === 'RATE_LIMITED') return;
        alert('Verification failed. Try again.');
        loadCaptcha();
      });
  });
  // Naitik changes End 10/04/2026

  //Enter button login

  $("#captchaInput").on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $("#captchaVerifyBtn").click();
    }
  });

  //Enter button for loginBtnStep1(next)

  $(document).on("keypress", function (e) {
    if (e.key === "Enter") {
      $("#loginBtnStep1").click();
    }
  });


  // MODAL RESET 

  modal.addEventListener('hidden.bs.modal', () => {
    step1.classList.remove('d-none');
    step2.classList.add('d-none');
    form.reset();
    window.captchaId = null;

    if (!window.captchaBlockInterval) {
      const captchaImageEl = document.getElementById('captchaImage123');
      const resetCapBtn = document.querySelector('.resetCap');
      captchaBtn.disabled = false;
      captchaBtn.textContent = 'Verify Captcha';
      captchaInput.disabled = false;
      captchaInput.value = '';
      captchaInput.style.display = '';
      captchaInput.placeholder = '';
      if (captchaImageEl) captchaImageEl.style.display = '';
      if (resetCapBtn) resetCapBtn.disabled = false;
    }
  });

  forgotPwdModal.addEventListener('hidden.bs.modal', () => {
    window.forgotPwdCaptchaId = null;
  });

  registerModal.addEventListener('hidden.bs.modal', () => {
    window.registerCaptchaId = null;
  });

});


