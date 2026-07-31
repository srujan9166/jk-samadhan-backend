$(function () {
  userList("department")
  // 24 May 2024 - user Profile (Account Settings) Change Password - SKY
  bindValPwdRules();
  // if (window.location.href.indexOf("/userProfile") != -1) {

  // }
  // 24 May 2024 - user Profile (Account Settings) Change Password - SKY
});

// 27 May 2024 - SKY
function bindValPwdRules() {
  $(document).on("input", "#newPassword, #renewPassword", valPwdRules);
}

//Naitik changes Start 13/04/2026
function valPwdRules() {
  var isValid = true;
  var password = $("#newPassword").val();
  var confirmPassword = $("#renewPassword").val();

  $("#rule-1").attr("class", password.length >= 8 ? "text-success" : "text-danger");
  if (password.length < 8) isValid = false;

  $("#rule-2").attr("class", /[A-Z]/.test(password) ? "text-success" : "text-danger");
  if (!/[A-Z]/.test(password)) isValid = false;

  $("#rule-3").attr("class", /[a-z]/.test(password) ? "text-success" : "text-danger");
  if (!/[a-z]/.test(password)) isValid = false;

  var digitAndSpecialCharPattern = /(?=.*\d)(?=.*[@$!%*?&])/;
  $("#rule-4").attr("class", digitAndSpecialCharPattern.test(password) ? "text-success" : "text-danger");
  if (!digitAndSpecialCharPattern.test(password)) isValid = false;

  if (password !== "" && password !== null && password !== " ") {

    var passwordsValid = (password === confirmPassword) && isValid;
    var captchaVerified = $('#changePwdCaptchaVerifyBtn').hasClass('btn-success');
    var isDisabled = (passwordsValid && captchaVerified) ? false : true;

    $(".updatePwd").attr("disabled", isDisabled);

    // show message based on password rules and match only
    if (!isValid) {
      $('.appendAlert').html('<p class="text-danger">Password does not meet the required rules.</p>');
    } else if (password !== confirmPassword) {
      $('.appendAlert').html('<p class="text-danger">Passwords do not match.</p>');
    } else if (passwordsValid && !captchaVerified) {
      $('.appendAlert').html('<p class="text-warning">Passwords match. Please verify captcha to proceed.</p>');
    } else if (passwordsValid && captchaVerified) {
      $('.appendAlert').html('<p class="text-success">Password matches and is validated.</p>');
    }

  } else {
    $('.appendAlert').html('');
    $(".updatePwd").attr("disabled", true);
  }
}

//Naitik changes End 13/04/2026

$('#currentPassword, #newPassword, #renewPassword').on('input', function () {
  const validPattern = /^[^<>]*$/; // Pattern to disallow '<' and '>'
  let input = $(this).val();

  // Remove any invalid characters from the input
  if (!validPattern.test(input)) {
    $(this).val(input.replace(/[<>]/g, '')); // Remove '<' and '>'
  }
});


function format_date(created_date) {
  var formatted_date = "";
  if (created_date != null && created_date != "") {
    var date_parts = created_date.split(" ");
    var date = date_parts[0].split("-");
    var time = date_parts[1];
    formatted_date = date[2] + "-" + date[1] + "-" + date[0] + " " + time;
  }
  return formatted_date;
}

// Verify Logged in user details for further actions
var statusVerification = false;
$(".verfiyCurrrentPwd").click(function () {
  var cEmailId = $("#currentEmailId").val().trim();
  var cPassword = $("#currentPassword2").val().trim();
  if ((cEmailId != "") & (cPassword != "")) {
    chckExtUsrCrendentials(cEmailId, cPassword, function () {
      // console.log(statusVerification);
    });
  } else {
    alert("Email id and password cannot be empty...");
    $(".tDetailsDiv").addClass("d-none");
  }
});

// ajax to verify the logged in users credentials
function chckExtUsrCrendentials(currentUsrEmail, currentUsrPwd, callback) {

  var c = JSON.stringify({
    currentEmailId: currentUsrEmail,
    currentPassword: currentUsrPwd,
  });
  var d = chkV(c);
  // console.log(c);
  var settings = {
    url: "chckExtUsrCredentials?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    console.log(j)
    if (j.statusCode == "1" && j.strforsafe == currentUsrPwd) {
      statusVerification = true;
      if (window.location.href.indexOf("/basedUlUpdProfile") != -1) {
        $(".tDetailsDiv").removeClass("d-none");
        $("#currentPassword2, .verfiyCurrrentPwd").attr("disabled", true);
        $(".verfiyCurrrentPwd ").text("User Verified !");
        $(".verfiyCurrrentPwd").removeClass("btn-primary");
        $(".verfiyCurrrentPwd").addClass("btn-success");
      } else if (window.location.href.indexOf("/userProfile") != -1) {
        $(".chngPwdDiv").removeClass("d-none");
        $("#currentPassword, .verfiyCurrrentPwd2").attr("disabled", true);
        $(".verfiyCurrrentPwd2 ").text("Password Verified !");
        $(".verfiyCurrrentPwd2").removeClass("btn-warning");
        $(".verfiyCurrrentPwd2").addClass("btn-success");
        bindValPwdRules();
      }
      callback(true);
    } else if (j.statusCode == "2") {
      statusVerification = false;
      if (window.location.href.indexOf("/basedUlUpdProfile") != -1) {
        $(".tDetailsDiv").addClass("d-none");
        $("#currentPassword2").val("");
      } else if (window.location.href.indexOf("/userProfile") != -1) {
        $(".chngPwdDiv").addClass("d-none");
        $("#currentPassword").val("");
      }
      // SKY - setTimeout is used to first render DOM then alert will trigger.
      setTimeout(function () {
        alert("Wrong Credentials. Unable to verify logged in user.");
      }, 10);
      callback(false);
    } else {
      alert("Something went wrong");
      window.location.reload();
      callback(false);
    }
  });
}
// Verify Logged in user details for further actions

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isMobile(mobile) {
  var regex = /^([6789][0-9]{9})$/;
  return regex.test(mobile);
}

$("#email, #transfereeEmailId").keyup(function (e) {
  isEmail(e.target.value);
});

$("#transfereeMobileNo").bind("keyup paste", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

$("#userMobileNo").bind("keyup paste", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

$(".profileTransferBtn").click(function () {

  //Designations & Offices Logic
  var tDepartment = $("#usrDepartment").val().trim();
  var tOfficeName = $("#usrOffice").find(":selected").val().trim();
  var tDesignation = $("#usrDesignation").find(":selected").val().trim();
  //Designations & Offices Logic

  console.log(tDepartment)
  console.log(tOfficeName)
  console.log(tDesignation != "0")

  var usrEmailId = $(".ddTls").text().trim();
  var tFirstName = $("#transfereeFname").val().trim();
  var tMiddleName = $("#transfereeMname").val().trim();
  var tLastName = $("#transfereeLname").val().trim();
  var tEmailId = $("#transfereeEmailId").val().trim();
  var tMobileNo = $("#transfereeMobileNo").val().trim();
  var tPassword = $("#transfereePassword").val().trim();
  if (
    //Designations & Offices Logic
    (tDepartment != "") &
    (tOfficeName != "" && tOfficeName != "0") &
    (tDesignation != "" && tDesignation != "0") &
    //Designations & Offices Logic

    (usrEmailId != "") &
    (tEmailId != "") &
    (tMobileNo != "") &
    (tPassword != "") &
    (tFirstName != "") &
    (tLastName != "")
  ) {

    // First Check new password with our password Regex
    var checkPass = tPassword;
    var d = chkV(checkPass);
    var settings = {
      url: "passwordMatcher?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      // if new password matches passwordMatcher then execute below code. 
      if (j.statusCode == "1") {
        $("#errMsg1").hide();
        var result = confirm("Are you sure you want to proceed?");
        if (result) {
          chckExtUsrCrendentials(
            $("#currentEmailId").val().trim(),
            $("#currentPassword2").val().trim(),
            function () {
              // console.log(statusVerification);
              if (statusVerification) {
                // proceed furthur for account transfer
                if (isEmail(tEmailId)) {
                  var c = JSON.stringify({
                    cEmailId: usrEmailId,
                    tFirstName: tFirstName,
                    tMiddleName: tMiddleName,
                    tLastName: tLastName,
                    tEmailId: tEmailId,
                    tMobileNo: tMobileNo,
                    tPassword: tPassword,

                    //Designations & Offices Logic
                    tDepartment: tDepartment,
                    tOfficeName: tOfficeName,
                    tDesignation: tDesignation
                    //Designations & Offices Logic
                  });
                  // proceed furthur for account transfer
                  createTransfereeAcc(c);
                } else {
                  alert("Enter valid email and mobile.");
                }
              } else {
                //alert("User verification failed!");
                window.location.reload();
              }
            }
          );
        }
      } else {
        $("#errMsg").show();
        $("#errMsg1").html(j.msg);
        return false;
      }
    });


  } else {
    alert("All fields are mandatory except middle name.");
    // window.location.reload();
  }
});

function createTransfereeAcc(jsonData) {
  var extUsr = $(".ddTls").text().trim();
  // console.log(jsonData);
  var d = chkV(jsonData);
  var settings = {
    url: "addUserAccTransfer?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    console.log(j)
    if (j.statusCode == "1") {
      alert(
        "Account transferred successfully. " +
        extUsr +
        " account will be disabled and automatically logged out."
      );
      window.location.href = "home";
      //$(".closeLogout").closest("form").submit();
    } else if (j.statusCode == "3") {
      alert("Email Id already exists.")
    }
    else {
      alert("Something went wrong.");
      window.location.reload();
    }
  });
}
$("#sendOTPButtonMChangepass").click(function () {
  // debugger

  var usr = $("#currentEmailId2").val() || $("#currentEmailId2").val();
  globalMobileRequirement = false; // For fresh registration

  if ($("#currentEmailId2").val() != null && $("#currentEmailId2").val() != "") {
    globalMobileRequirement = true; // For forgot password
  }
  // console.log("requirement1 at Mobile :: " + globalMobileRequirement);
  var usr = JSON.stringify({
    value: usr,
    requirement: globalMobileRequirement,
  });
  var dd = chkV(usr);

  var settings1 = {
    url: "checkUserforchangepass?d=" + dd,
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
    url: "otpforpass?d=" + dd,
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
function sendOTPM() {
  var usr =
    $("#currentEmailId2").val();
  if (usr != null && usr != "") {
    var c = JSON.stringify({
      mobile: usr,
      value: "mobile",
      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });

    // console.log(c)
    var d = chkV(c);
    var settings = {
      url: "regotppasschnage?d=" + d,
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

        alert("OTP sent on given mobile.");

      } else {
        alert("Something went wrong.");

      }
    });
  } else {
    alert("Please enter mobile!");
  }
}
$("#verifyOTPButtonM").click(
  function () {
    verifyOTPM();
  }
);
function verifyOTPM() {
  // debugger
  var otpV = $("#OTPValueM").val();
  var usr = $("#currentEmailId2").val();

  if (otpV != null && otpV != "") {
    var c = JSON.stringify({
      mobile: usr,
      passw: otpV,
      value: "mobile",
    });
    var d = chkV(c);
    var settings = {
      url: "verifyMobileOTPforpasschange?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      if (j != null) {
        j = JSON.parse(j);
        if (j.statusCode == "1" && j.strforsafe == otpV) {
          alert("OTP verified Successfully.");
          otpM = 1;
          $("#passwordDiv").show();
          return true;
        } else {
          alert("Invalid OTP. Please try again.");
          otpM = 0;
          return false;
        }
      } else {
        alert("Authentication Failed. Please try again.");
        return false;
      }
    });
  } else {
    alert("Please enter OTP to proceed.");
    return false;
  }
}
$("#OTPValueM").on("keyup", function () {
  this.value = this.value.replace(/[^0-9]/g, '');

});

// 24 May 2024 - user Profile (Account Settings) Change Password - start - SKY
$(".verfiyCurrrentPwd2").click(function () {
  $("#verifyOTPButtonM").hide();
  $("#sendOTPButtonMChangepass").hide();

  //debugger

  //var cEmailId = $("#currentEmailId2").val().trim();
  var cEmailId = $("#username").val().trim();
  var cPassword = $("#currentPassword").val().trim();
  if (cPassword != null && cPassword != "" && cPassword != " ") {
    chckExtUsrCrendentials(cEmailId, cPassword, function () {
      // console.log(statusVerification);
      if (statusVerification) {
        $(".updatePwd").click(function () {
          var newPwd = $("#newPassword").val().trim();
          var cNewPwd = $("#renewPassword").val().trim();
          // console.log(newPwd);
          // console.log(cNewPwd);
          // console.log(newPwd === cNewPwd);
          if (
            newPwd != null &&
            newPwd != "" &&
            newPwd != " " &&
            cNewPwd != null &&
            cNewPwd != "" &&
            cNewPwd != " " &&
            newPwd === cNewPwd
          ) {

            // Check Password through Backend First - 23/12/2024
            var passwordToCheck = cNewPwd;
            var dd = chkV(passwordToCheck);
            var settings = {
              url: "passwordMatcher?d=" + dd,
              method: "POST",
              timeout: 0,
              headers: {
                "Content-Type": "application/json",
              },
            };
            $.ajax(settings).done(function (j) {
              j = setV(j);
              j = JSON.parse(j);

              // if new password matches passwordMatcher then execute below code. 
              if (j.statusCode == "1") {
                // update user password
                var c = JSON.stringify({
                  newpassword: cNewPwd
                });
                var d = chkV(c);
                var settings = {
                  url: "updateUsrPwd?d=" + d,
                  method: "POST",
                  timeout: 0,
                  headers: {
                    "Content-Type": "application/json",
                  },
                };
                $.ajax(settings).done(function (j) {
                  j = setV(j);
                  j = JSON.parse(j);
                  //  console.log(j)
                  if (j.statusCode == "1") {
                    alert("Password Updated Successfully. Please Login Again.");
                    $(".closeLogout").closest("form").submit();
                  } else if (j.statusCode == "2") {

                    alert("Old and New Password cannot be same.")
                  } else {
                    alert("Something went wrong. Invalid Password");
                    window.location.reload();
                  }
                });
              } else {
                alert(j.msg);
              }
            })
          }
        });
      }
    });
  } else {
    alert("Kindly Verify your current password. It cannot be blank.")
  }
});
var table;
var table2;
$(document).on("click", ".data1-search", function (e) {
  //// console.log($(this).val());
  if ($(this).val() == 'attached') {
    table.destroy();
    $('#depTable').hide();
    $('#attachTable').show();
    userList2($(this).val())
  } else {
    table2.destroy();
    $('#attachTable').hide();
    $('#depTable').show();
    userList($(this).val())
  }

});



var usrListGlobal;

function applyAllFilters() {
  const selectedDept = $("#filterUserDept").val()?.trim();
  const selectedDepType = $("#depType").val()?.trim();
  const selectedDistrict = $("#district").val()?.trim().toLowerCase();
  const selectedUserType = $("#userType").val()?.trim();

  const filteredData = usrListGlobal.filter(function (item) {
    // Department filter
    const deptMatch = !selectedDept || selectedDept === "0" || item.department === selectedDept;

    // Department type filter
    const depTypeMatch = !selectedDepType || selectedDepType === "0" || item.department_type === selectedDepType;

    // User type filter
    const userTypeMatch = !selectedUserType || selectedUserType === "0" ||
      (item.user_assigned && item.user_assigned.toLowerCase() === selectedUserType.toLowerCase());

    // District filter (IN-style match)
    const districtMatch = (() => {
      if (!selectedDistrict || selectedDistrict === "0") return true;
      if (!item.district) return false;

      const districtList = item.district
        .replace(/'/g, "")
        .split(",")
        .map(d => d.trim().toLowerCase());

      return districtList.includes(selectedDistrict);
    })();

    return deptMatch && depTypeMatch && userTypeMatch && districtMatch;
  });

  $('#depTable').DataTable().clear().rows.add(filteredData).draw();
}


// Attach the single function to all filters
$("#filterUserDept, #depType, #district,#userType").change(applyAllFilters);


var usrFlg = $('#usrFlg').val();
function userList(attach) {
  //alert(usrFlg)

  var c = JSON.stringify({

    attStatus: attach

  });
  //console.log(c)
  var d = chkV(c);

  var settings = {
    "url": "usrListAttachOrDep?d=" + d,
    "method": "POST",
    "timeout": 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    //console.log(j);
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.created_date != null) {
          current.created_date = format_date(current.created_date);
        }
        return current;
      });

      usrListGlobal = j.data;
    }
    //	if (j.statusCode == '1') {
    var columns = [
      {
        title: "S. No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "department",
        defaultContent: "",
        title: "Department",
      },
      {
        data: "department_type",
        defaultContent: "",
        title: "Type Of Department",
      },
      {
        data: "district",
        defaultContent: "",
        title: "District",
      },
      {
        data: "office_name",
        defaultContent: "",
        title: "Office",
      },
        /* {
				   data: "designation",
				   defaultContent: "",
				   title: "Designation",
				 },*/
        // {
        //   data: "mobile",
        //   defaultContent: "",
        //   title: "Mobile Number",
        // },
        // {
        //   data: "username",
        //   defaultContent: "",
        //   title: "Email Id",
        // },
        /* {
					data: "username",
					defaultContent: "",
					title: "Username",
				  },
				*/ {
        data: "username",
        defaultContent: "",
        title: "Name And Designation",
        render: function (data, type, row, meta) {
          // SKY - created helper function to return empty ("") if any of them is empty or null. - 06th August 2024
          function safeValue(value) {
            return value || "";
          }

          var name;
          if (attach === 'attached') {
            name = safeValue(row.name) + " (" + safeValue(row.designation) + ")";
          } else {
            name =
              safeValue(row.first_name) + " " +
              safeValue(row.middle_name) + " " +
              safeValue(row.last_name) + " (" +
              safeValue(row.designation) + ")";
          }

          return name.trim();
        },
      },
      {
        data: "user_assigned",
        defaultContent: "",
        title: "User Type",
      },
      {
        data: "created_by",
        defaultContent: "",
        title: "Created By",
      },
      {
        data: "created_date",
        defaultContent: "",
        title: "Created On",
      },
      {
        data: "mobile",
        defaultContent: "",
        title: "Mobile No.",
      },

      // {
      //   data: "created_by_name",
      //   defaultContent: "",
      //   title: "Created By",
      // },
    ]
    // alert($('#userRole').val())
    if ($('#userRole').val() != 'ROLE_SuperAdmin') {
      columns.push({
        data: "attached_with",
        defaultContent: "",
        title: "Additionally Attached With",
        render: function (data, type, row, meta) {

          if (row.attached == "false" || row.attached == false) {

            return "";
          } else {
            return data;

          }


        },
      },
        {
          data: "attached_on",
          defaultContent: "",
          title: "Attached On",
          render: function (data, type, row, meta) {

            if (row.attached == "false" || row.attached == false) {
              return "";
            } else {
              return data;

            }


          },
        },
        {
          data: "detached_on",
          defaultContent: "",
          title: "Detached On",
          render: function (data, type, row, meta) {

            if (row.attached == "false" || row.attached == false) {

              return "";
            } else {
              return data;

            }

          },
        },
        // {
        //   data: "username",
        //   defaultContent: "",
        //   class: "noExport",
        //   title: "Action",
        //   render: function (data, type, row, meta) {
        //     var btn =
        //       '<div class="dropdown">' +
        //       '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
        //       '<i class="bi bi-three-dots"></i>' +
        //       "</button>" +
        //       '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
        //       '<li class=""><button class="btn btn-sm shwUptDetails" value="' + data + '">Account Settings</button></li></ul></div>';

        //     return btn;
        //   }
        // }
      )

      if (usrFlg != "depSecretary") {
        columns.push({
          data: "username",
          defaultContent: "",
          class: "noExport",
          title: "Action",
          render: function (data, type, row, meta) {
            var btn =
              '<div class="dropdown">' +
              '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
              '<i class="bi bi-three-dots"></i>' +
              "</button>" +
              '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
              '<li class=""><button class="btn btn-sm shwUptDetails" value="' + data + '">Account Settings</button></li></ul></div>';

            return btn;
          }
        })
      }

    } else {

      if (usrFlg != "depSecretary") {
        columns.push({
          data: "username",
          defaultContent: "",
          class: "noExport",
          title: "Action",
          render: function (data, type, row, meta) {
            var btn =
              '<div class="dropdown">' +
              '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
              '<i class="bi bi-three-dots"></i>' +
              "</button>" +
              '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
              '<li class=""><button class="btn btn-sm  shwUptDetails" value="' + data + '">Account Settings</button></li></ul></div>';

            return btn;
          }
        })
      }

    }

    $(".btn-customBtn1").on("click", function () {
      // console.log("." + $(this).val())
      table.button("." + $(this).val()).trigger();

    });

    table = $('#depTable').DataTable({
      data: j.data,
      destroy: true,
      lengthMenu: [5, 10, 25],
      pageLength: 10,
      buttons: [
        {
          extend: "excel",
          title: "JKGOVT",
          messageTop: "The information in this table is copyright to JK GOVT.",
          exportOptions: {
            columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
          },
        },

        {
          extend: 'pdf',
          title: 'JKGOVT',
          messageBottom: 'The information in this table is copyright to JK GOVT.',
          pageSize: 'A4',
          download: 'true', // Automatically triggers PDF download
          customize: function (doc) {
            // Set the page orientation and size
            doc.pageSize = 'A4';
            doc.pageOrientation = 'landscape';

            // Adjust the content styling
            doc.styles.tableHeader.fontSize = 8;
            doc.styles.tableBodyOdd.fontSize = 8;
            doc.styles.tableBodyEven.fontSize = 8;

            // Center the table content
            var rowCount = doc.content[1].table.body.length;
            for (var i = 0; i < rowCount; i++) {
              var row = doc.content[1].table.body[i];
              for (var j = 0; j < row.length; j++) {
                row[j].alignment = 'center';
              }
            }

            // Dynamically adjust the first few columns, and then use '*' for others
            var totalColumns = doc.content[1].table.body[0].length;
            var columnWidths = [];

            // Adjust width of the first column dynamically
            columnWidths.push('auto'); // 'auto' for the first column
            columnWidths.push('auto'); // Adjust others similarly if needed

            // Use '*' for other columns to distribute evenly
            for (var i = 2; i < totalColumns; i++) {
              columnWidths.push('*');
            }

            // Set calculated column widths
            doc.content[1].table.widths = columnWidths;
          },
          exportOptions: {
            columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
          }
        },

      ],
      columns: columns
    });
    //  table.columns.adjust().draw();

    //}
    $("#depTable_filter input[type='search']").on("input", function () {
      // alert("jjjds")
      var regex = /^[A-Za-z0-9._-\s]*$/;

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      table.search(cleanValue).draw(); // Update DataTable search
    });
  });


}

$("#transfereeEmailId").keypress(function (e) {
  //console.log($(this).val())
  return validTextArea(e);
});

$("#transfereePassword").keypress(function (e) {
  //console.log($(this).val())
  return validPassword(e);
});

$("#newEmail").keypress(function (e) {
  //console.log($(this).val())
  return validTextArea(e);
});

$("#usrpwd").keypress(function (e) {
  //console.log($(this).val())
  return validPassword(e);
});

function validTextArea(e) {
  var keyCode = e.keyCode || e.which;


  var regex = /^[A-Za-z0-9._@-\s]*$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}

function validPassword(e) {
  var keyCode = e.keyCode || e.which;


  var regex = /^[A-Za-z0-9._@#!%*?&-\s]*$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}





function userList2(attach) {
  // alert(attach)

  var c = JSON.stringify({

    attStatus: attach

  });
  // console.log(c)
  var d = chkV(c);

  var settings = {
    "url": "usrListAttachOrDep?d=" + d,
    "method": "POST",
    "timeout": 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(j);
    //	if (j.statusCode == '1') {
    var columns = [
      {
        title: "S. No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "department",
        defaultContent: "",
        title: "Department",
      },
      {
        data: "department_type",
        defaultContent: "",
        title: "Type Of Department",
      },
      {
        data: "office_name",
        defaultContent: "",
        title: "Office",
      },
         /* {
            data: "designation",
            defaultContent: "",
            title: "Designation",
          },*/
        //  {
        //    data: "mobile",
        //    defaultContent: "",
        //    title: "Mobile Number",
        //  },
        //  {
        //    data: "username",
        //    defaultContent: "",
        //    title: "Email Id",
        //  },
         /* {
           data: "username",
           defaultContent: "",
           title: "Username",
           },
         */ {
        data: "username",
        defaultContent: "",
        title: "Name And Designation",
        render: function (data, type, row, meta) {
          var name;
          if (attach == 'attached') {
            name = row.name + " (" + row.designation + ")";
          } else {
            name =
              row.first_name +
              " " +
              row.middle_name +
              " " +
              row.last_name +
              " (" +
              row.designation +
              ")";

          }

          return name;
        },
      },
      {
        data: "user_assigned",
        defaultContent: "",
        title: "User Type",
      },
      {
        data: "created_date",
        defaultContent: "",
        title: "Created On",
      },
      {
        data: "username",
        defaultContent: "",
        class: "noExport",
        title: "Action",
        render: function (data, type, row, meta) {
          var btn =
            '<div class="dropdown">' +
            '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
            '<i class="bi bi-three-dots"></i>' +
            "</button>" +
            '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
            '<li class=""><button class="btn btn-sm detachUser" value="' + data + '">Detach</button></li></ul></div>';

          return btn;
        }
      }

      // {
      //   data: "created_by_name",
      //   defaultContent: "",
      //   title: "Created By",
      // },
    ]

    if (usrFlg != "depSecretary") {
      columns.push({
        data: "username",
        defaultContent: "",
        class: "noExport",
        title: "Action",
        render: function (data, type, row, meta) {
          var btn =
            '<div class="dropdown">' +
            '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
            '<i class="bi bi-three-dots"></i>' +
            "</button>" +
            '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
            '<li class=""><button class="btn btn-sm detachUser" value="' + data + '">Detach</button></li></ul></div>';

          return btn;

        }
      })
    }

    table2 = $('#attachTable').DataTable({
      data: j.data,
      destroy: true,
      lengthMenu: [5, 10, 25],
      pageLength: 10,
      columns: columns
    });
    // table.columns.adjust().draw();

    //}
  });
}

$(document).on("click", ".detachUser", function (e) {
  let attUser = $(this).val();


  var c = JSON.stringify({

    username: attUser

  });
  //console.log(c)
  var d = chkV(c);

  var settings = {
    "url": "detacheuser?d=" + d,
    "method": "POST",
    "timeout": 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    if (j.statusCode == "1") {
      alert("User detached successfully.")
      window.location.reload();
    } else {
      alert("Something went wrong.")
      window.location.reload();
    }
  })
  // window.location.href = "basedUlUpdProfile?d=" + d;
});

// Designations & Offices for Account Transfer Logic
// if ($('#isNodalNo').val() === 'no') {
//   // Initially disable the designation select box
//   $('#usrDesignation').prop('disabled', true);
//   $('#usrOffice').on('change', function () {
//     var selectedOffice = $(this).val();
//     if (selectedOffice !== "0") {
//       $('#usrDesignation').prop('disabled', false);
//       $('#usrDesignation option').hide();
//       $('#usrDesignation option[data-office="' + selectedOffice + '"]').show();
//     } else {
//       $('#usrDesignation').prop('disabled', true);
//       $('#usrDesignation option').hide();
//       $('#usrDesignation').val('0');
//     }
//   });
// }
// ADD THIS BLOCK at the bottom of the existing
// "Designations & Offices for Account Transfer Logic" section

//  filter on page load using the already-set office value
// if ($('#isNodalNo').val() === 'no') {
//   var currentOffice = $('#useroffice').val().trim();   //  read current office value on load
//   if (currentOffice && currentOffice !== "") {
//     $('#userdesignation option').hide();
//     $('#userdesignation option[data-office="' + currentOffice + '"]').show();  //  show only matching options

//   }
// }
if ($('#isNodalNo').val() === 'no') {

  function filterDesignation(office) {
    if (office !== "0" && office !== "") {
      $('#userdesignation').prop('disabled', false);
      $('#userdesignation option').hide();
      $('#userdesignation option[value="0"]').show(); // keep default
      $('#userdesignation option[data-office="' + office + '"]').show();
    } else {
      $('#userdesignation').prop('disabled', true);
      $('#userdesignation option').hide();
      $('#userdesignation').val('0');
    }
  }

  //  On page load (edit case)
  filterDesignation($('#useroffice').val().trim());

  //  On change (user interaction)
  $('#useroffice').on('change', function () {
    filterDesignation($(this).val());
  });
}
//Account Deletion Logic :: 
$(document).ready(function () {
  $('.checkEmailAvailability').on('click', function () {
    var emailForDeletion = $("#emailForDeletion").val().trim();

    if (isEmail(emailForDeletion)) {
      var c = JSON.stringify({
        useremail: emailForDeletion,
        check: 1
      });
      var d = chkV(c);
      var settings = {
        "url": "chckForDeletion?d=" + d,
        "method": "POST",
        "timeout": 0,
      };

      // Show progress bar, hide status and reason messages
      $('.progress').show();
      $('#statusMessage').hide();
      $('#reasonMessage').hide();
      $('#deleteButton').remove();

      let progressBar = $('#progressBar');
      progressBar.css('width', '0%').attr('aria-valuenow', 0);

      let duration = 5000; // 5 seconds
      let interval = 100; // Update every 100 milliseconds
      let step = (duration / interval); // Calculate steps for progress
      let progress = 0;

      let intervalId = setInterval(function () {
        progress += 100 / step;
        progressBar.css('width', progress + '%').attr('aria-valuenow', progress);
        if (progress >= 100) {
          clearInterval(intervalId);
        }
      }, interval);

      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);

        // Ensure progress bar reaches 100%
        progress = 100;
        progressBar.css('width', '100%').attr('aria-valuenow', '100');

        // Update status and reason messages based on j
        if (j.statusCode === "1") {
          $('#statusMessage').show().text('Available').addClass("text-success").removeClass("text-danger");
          $('#reasonMessage').show().text('Available').addClass("text-success").removeClass("text-danger");
          $('.renderBtn').html('<button class="common-dg-btn" id="deleteButton" type="button">Delete</button>');
        } else if (j.statusCode === "2") {
          alert(j.statusName);
          $('.progress').hide();
          window.location.reload();
        }
        else {
          $('#statusMessage').show().text('Not Available').addClass("text-danger").removeClass("text-success");
          $('#reasonMessage').show().text('Not Available').addClass("text-danger").removeClass("text-success");
          $('#deleteButton').remove();
        }
      });
    } else {
      alert("Invalid Email");
    }
  });
});


// Naitik - Citizen Profile Updation Module - 18/11/2025

var _suppressDistrictChange = false;

function setSelectVal(selector, val) {
  if (val === undefined || val === null || val === "" || val == 0) return;

  var $sel = $(selector);
  var strVal = String(val).trim();
  $sel.val(strVal);
  if ($sel.val() && $sel.val() !== "0") return;

  var lower = strVal.toLowerCase();
  $sel.find("option").each(function () {
    if (
      $(this).val().toLowerCase().trim() === lower ||
      $(this).text().toLowerCase().trim() === lower
    ) {
      $sel.val($(this).val());
      return false;
    }
  });
}

$('[data-bs-target="#profile-update-details"]').on("click", function () {
  loadUserProfile();
});

function loadUserProfile() {
  $.get(cp + "/getUserProfile", function (u) {

    $("#firstName").val(u.first_name || "");
    $("#middleName").val(u.middle_name || "");
    $("#lastName").val(u.last_name || "");
    $("#Ugender").val(u.gender || "0");
    $("#mobileNo").val(u.mobile || "");
    $("#email").val(u.email || "");
    $("#dob").val(u.date_of_birth || "");
    $("#pincode").val(u.pincode || "");
    $("#address").val(u.address || "");

    var isJK = isJammuKashmir(u.region);

    loadStates(function () {
      setSelectVal("#state", u.region);
      toggleUMRBSection();

      loadDistricts(u.region, function () {
        setSelectVal("#district", u.district);

        var districtName = $("#district option:selected").text();
        if (!districtName || districtName === "Select District") {
          // fallback to raw value from API
          districtName = u.district || "";
        }

        if (!isJK) return;

        if (!districtName || districtName === "0") {
          console.warn("[PROFILE] No district — skipping UMRB");
          return;
        }

        var municipalityName = u.municipality || "";
        var blockName = u.block || "";
        var hasMunicipality = municipalityName.trim() !== "";
        var hasBlock = blockName.trim() !== "";

        if (hasMunicipality) {

          // Set radio first
          $('input[name="umrb"][value="Municipality"]').prop("checked", true);
          $(".umrb1").removeClass("d-none");
          $(".umrb2").addClass("d-none");

          // Load municipality
          loadMunicipality(districtName, function () {
            setSelectVal("#municipality", municipalityName);

            var selectedMuni = $("#municipality option:selected").text();
            if (!selectedMuni || selectedMuni === "Select Municipality") {
              selectedMuni = municipalityName;
            }


            if (u.ward && u.ward.trim() !== "") {
              loadWard(selectedMuni, function () {
                setSelectVal("#ward", u.ward);
              });
            }
          });

        } else if (hasBlock) {

          // Set radio first
          $('input[name="umrb"][value="Block"]').prop("checked", true);
          $(".umrb2").removeClass("d-none");
          $(".umrb1").addClass("d-none");

          //load Block
          loadBlock(districtName, function () {
            setSelectVal("#block", blockName);

            var selectedBlock = $("#block option:selected").text();
            if (!selectedBlock || selectedBlock === "Select Block") {
              selectedBlock = blockName;
            }


            if (u.panchayat && u.panchayat.trim() !== "") {
              loadPanchayat(selectedBlock, function () {
                setSelectVal("#panchayat", u.panchayat);
              });
            }
          });
        }
      });
    });
  });
}

function isJammuKashmir(region) {
  if (!region) return false;
  var r = region.toLowerCase().trim();
  return r.includes("jammu") && r.includes("kashmir");
}

function toggleUMRBSection() {
  if (isJammuKashmir($("#state").val())) {
    $(".umrb-section").removeClass("d-none");
  } else {
    $(".umrb-section").addClass("d-none");
    $('input[name="umrb"]').prop("checked", false);
    $(".umrb1").addClass("d-none");
    $(".umrb2").addClass("d-none");
    resetUMRBDropdowns();
  }
}

// $('input[name="umrb"]').on("change", function () {
//   var type = $(this).val();


//   var districtName = $("#district option:selected").text();
//   if (!districtName || districtName === "Select District") {
//     districtName = $("#district").val();
//   }

//   $("#state").on("change", function () {
//     var selectedState = $(this).val();
//     toggleUMRBSection();
//     $("#district").html('<option value="0">Select District</option>');
//     resetUMRBDropdowns();
//     if (selectedState && selectedState !== "0") {
//       loadDistricts(selectedState);
//     }
//   });
// });

$('input[name="umrb"]').on("change", function () {
  var type = $(this).val();

  if (type === "Municipality") {
    $(".umrb1").removeClass("d-none");
    $(".umrb2").addClass("d-none");
  } else if (type === "Block") {
    $(".umrb2").removeClass("d-none");
    $(".umrb1").addClass("d-none");
  }

  resetUMRBDropdowns();

  var districtName = $("#district option:selected").text();
  if (!districtName || districtName === "Select District") {
    districtName = $("#district").val();
  }

  var isJK = isJammuKashmir($("#state").val());
  if (!isJK || !districtName || districtName === "0") return;

  if (type === "Municipality") {
    loadMunicipality(districtName);
  } else if (type === "Block") {
    loadBlock(districtName);
  }
});


$("#state").on("change", function () {
  var selectedState = $(this).val();
  toggleUMRBSection();
  $("#district").html('<option value="0">Select District</option>');
  resetUMRBDropdowns();
  if (selectedState && selectedState !== "0") {
    loadDistricts(selectedState);
  }
});

$(document).on("change", "#district", function () {
  if (_suppressDistrictChange) return;


  var districtName = $("#district option:selected").text();
  if (!districtName || districtName === "Select District") {
    districtName = $(this).val();
  }

  var isJK = isJammuKashmir($("#state").val());

  resetUMRBDropdowns();

  if (!isJK || !districtName || districtName === "0") return;

  var umrbVal = $('input[name="umrb"]:checked').val();
  if (umrbVal === "Municipality") {
    loadMunicipality(districtName);
  } else if (umrbVal === "Block") {
    loadBlock(districtName);
  }
});

$(document).on("change", "#municipality", function () {
  var municipalityName = $(this).val();
  $("#ward").html('<option value="0">Select Ward</option>');
  if (municipalityName && municipalityName !== "0") {
    loadWard(municipalityName);
  }
});

$(document).on("change", "#block", function () {
  var blockName = $(this).val();
  $("#panchayat").html('<option value="0">Select Panchayat</option>');
  if (blockName && blockName !== "0") {
    loadPanchayat(blockName);
  }
});

function resetUMRBDropdowns() {
  $("#municipality").html('<option value="0">Select Municipality</option>');
  $("#ward").html('<option value="0">Select Ward</option>');
  $("#block").html('<option value="0">Select Block</option>');
  $("#panchayat").html('<option value="0">Select Panchayat</option>');
}

function loadStates(callback) {
  $.ajax({
    url: cp + "/analytics/allState?d=" + chkV(JSON.stringify({ flag: "STATE" })),
    method: "POST",
    success: function (res) {
      res = JSON.parse(setV(res));
      $("#state").empty().append('<option value="0">Select State</option>');
      if (res.statusCode === "1" && res.data.length > 0) {
        res.data.forEach(function (item) {
          $("#state").append('<option value="' + item.values + '">' + item.values + '</option>');
        });
      }
      if (typeof callback === "function") callback();
    }
  });
}

function loadDistricts(stateName, callback) {
  _suppressDistrictChange = true;

  $.ajax({
    url: cp + "/analytics/allDistrictByState?d=" + chkV(JSON.stringify({ value: stateName })),
    method: "POST",
    success: function (res) {
      res = JSON.parse(setV(res));
      $("#district").empty().append('<option value="0">Select District</option>');

      if (res.statusCode === "1" && res.data.length > 0) {
        res.data.forEach(function (item) {
          $("#district").append('<option value="' + item.values + '">' + item.values + '</option>');
        });
      }

      _suppressDistrictChange = false;
      if (typeof callback === "function") callback();
    },
    error: function () {
      _suppressDistrictChange = false;
    }
  });
}

function loadMunicipality(districtName, callback) {
  if (!districtName || districtName === "0") {
    console.error("[PROFILE] loadMunicipality — missing districtName");
    return;
  }
  // console.log("districtName", districtName);

  $.ajax({
    url: cp + "/analytics/municipalityByDistrict?d=" + chkV(JSON.stringify({ value: districtName })),
    method: "POST",
    success: function (res) {
      res = JSON.parse(setV(res));
      $("#municipality").empty().append('<option value="0">Select Municipality</option>');
      if (res.statusCode === "1" && res.data.length > 0) {
        res.data.forEach(function (item) {
          $("#municipality").append('<option value="' + item.values + '">' + item.values + '</option>');
        });
      }
      if (typeof callback === "function") callback();
    }
  });
}

function loadBlock(districtName, callback) {
  if (!districtName || districtName === "0") {
    console.error("[PROFILE] loadBlock — missing districtName");
    return;
  }
  //  console.log("districtName", districtName);

  $.ajax({
    url: cp + "/analytics/blockByDistrict?d=" + chkV(JSON.stringify({ value: districtName })),
    method: "POST",
    success: function (res) {
      res = JSON.parse(setV(res));
      $("#block").empty().append('<option value="0">Select Block</option>');
      if (res.statusCode === "1" && res.data.length > 0) {
        res.data.forEach(function (item) {
          $("#block").append('<option value="' + item.values + '">' + item.values + '</option>');
        });
      }
      if (typeof callback === "function") callback();
    }
  });
}

function loadWard(municipalityName, callback) {
  if (!municipalityName || municipalityName === "0") {
    console.error("[PROFILE] loadWard — missing municipalityName");
    return;
  }
  // console.log("municipalityName", municipalityName);

  $.ajax({
    url: cp + "/analytics/wardByMunicipality?d=" + chkV(JSON.stringify({ value: municipalityName })),
    method: "POST",
    success: function (res) {
      res = JSON.parse(setV(res));
      $("#ward").empty().append('<option value="0">Select Ward</option>');
      if (res.statusCode === "1" && res.data.length > 0) {
        res.data.forEach(function (item) {
          $("#ward").append('<option value="' + item.values + '">' + item.values + '</option>');
        });
      }
      if (typeof callback === "function") callback();
    }
  });
}

function loadPanchayat(blockName, callback) {
  if (!blockName || blockName === "0") {
    console.error("[PROFILE] loadPanchayat — missing blockName");
    return;
  }
  //  console.log("blockName", blockName);

  $.ajax({
    url: cp + "/analytics/panchayatByBlock?d=" + chkV(JSON.stringify({ value: blockName })),
    method: "POST",
    success: function (res) {
      res = JSON.parse(setV(res));
      $("#panchayat").empty().append('<option value="0">Select Panchayat</option>');
      if (res.statusCode === "1" && res.data.length > 0) {
        res.data.forEach(function (item) {
          $("#panchayat").append('<option value="' + item.values + '">' + item.values + '</option>');
        });
      }
      if (typeof callback === "function") callback();
    }
  });
}

//update profile module by Naitik 

$("#updateProfileBtn").on("click", function () {
  var isValid = true;

  // if (!$("#name").val().trim()) {
  //   $("#uName").text("Name is required."); isValid = false;
  // } else { $("#uName").text(""); }

  if (!$("#firstName").val().trim()) {
    $("#uName").text("First Name is required."); isValid = false;
  } else { $("#uName").text(""); }

  if (!$("#lastName").val().trim()) {
    $("#uLastName").text("Last Name is required."); isValid = false;
  } else { $("#uLastName").text(""); }

  if (!$("#Ugender").val() || $("#Ugender").val() === "0") {
    $("#genderup").text("Please select a gender."); isValid = false;
  } else { $("#genderup").text(""); }

  if (!$("#dob").val()) {
    $("#dobup").text("Date of Birth is required."); isValid = false;
  } else { $("#dobup").text(""); }

  if ($("#mobileNo").val().trim().length !== 10) {
    $("#mNo").text("Valid 10-digit mobile number is required."); isValid = false;
  } else { $("#mNo").text(""); }

  var emailVal = $("#email").val().trim();
  if (emailVal !== "") {
    var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailVal)) {
      $("#emailup").text("Please enter a valid email address.").css("color", "red");
      isValid = false;
    } else {
      $("#emailup").text("");
    }
  }

  var pincodeVal = $("#pincode").val().trim();
  if (!pincodeVal.match(/^[1-9][0-9]{5}$/)) {
    $("#pinup").text("Please enter a valid Indian pincode."); isValid = false;
  } else { $("#pinup").text(""); }

  if (!$("#address").val().trim()) {
    $("#addrup").text("Address is required."); isValid = false;
  } else { $("#addrup").text(""); }

  if (!$("#state").val() || $("#state").val() === "0") {
    $("#stateup").text("Please select a state."); isValid = false;
  } else { $("#stateup").text(""); }

  if (!$("#district").val() || $("#district").val() === "0") {
    $("#districtup").text("Please select a district."); isValid = false;
  } else { $("#districtup").text(""); }

  if (!isValid) return;

  var isJK = isJammuKashmir($("#state").val());
  var umrbVal = $('input[name="umrb"]:checked').val();

  if (isJK) {
    if (!umrbVal) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please select Municipality or Block." });
      return;
    }
    if (umrbVal === "Municipality" && (!$("#municipality").val() || $("#municipality").val() === "0")) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please select a Municipality." });
      return;
    }
    if (umrbVal === "Block" && (!$("#block").val() || $("#block").val() === "0")) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please select a Block." });
      return;
    }
  }

  var req = {
    // name: $("#name").val().trim(),
    name: [$("#firstName").val().trim(), $("#middleName").val().trim(), $("#lastName").val().trim()].filter(Boolean).join(" "),
    gender: $("#Ugender").val(),
    mobile: $("#mobileNo").val().trim(),
    email: $("#email").val().trim(),
    date_of_birth: $("#dob").val(),
    pincode: $("#pincode").val().trim(),
    address: $("#address").val().trim(),
    region: $("#state option:selected").text(),
    district: $("#district option:selected").text(),
    municipality: (isJK && umrbVal === "Municipality") ? $("#municipality option:selected").text() : "",
    ward: (isJK && umrbVal === "Municipality") ? $("#ward option:selected").text() : "",
    block: (isJK && umrbVal === "Block") ? $("#block option:selected").text() : "",
    panchayat: (isJK && umrbVal === "Block") ? $("#panchayat option:selected").text() : ""
  };

  // console.log("save payload", JSON.stringify(req));

  $.ajax({
    url: cp + "/updateProfile?d=" + chkV(JSON.stringify(req)),
    method: "POST",
    success: function (res) {
      res = JSON.parse(setV(res));
      if (res.statusCode === 1) {
        Swal.fire({ icon: "success", title: "Profile Updated!", text: res.message || "Your profile has been successfully updated." })
          .then(function () {
            // sessionStorage.removeItem('profileIncomplete');
            window.location.href = cp + "/user/home";
          });
      } else {
        Swal.fire({ icon: "error", title: "Update Failed", text: "Please try again later." });
      }
    },
    error: function () {
      Swal.fire({ icon: "error", title: "Error", text: "Something went wrong. Please try again." });
    }
  });
});

$("#address").on("input", function () {
  this.value = this.value.replace(/[^a-zA-Z0-9\s,;().\-\/]/g, '');
  $("#Addup").toggle(this.value.length >= 200);
});

$("#firstName, #middleName, #lastName").on("input", function () {
  this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});

$("#pincode").on("input", function () {
  this.value = this.value.replace(/[^0-9]/g, '');
});

$("#email").on("input", function () {
  this.value = this.value.replace(/[^a-zA-Z0-9@._+\-]/g, '');
});
//Naitik Update Profile Module END  

// Change Password Captcha 

async function loadChangePwdCaptcha() {
  try {
    const response = await fetch(`${cp}/api/jks/auth/captcha`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'X-Client-Type': 'web' }
    });

    if (!response.ok) throw new Error('Captcha load failed');

    const captchaId = response.headers.get('Captcha-Id');
    if (!captchaId) throw new Error('Captcha-Id missing');

    window.changePwdCaptchaId = captchaId;
    document.getElementById('changePwdCaptchaId').value = captchaId;

    const imgUrl = URL.createObjectURL(await response.blob());
    document.getElementById('changePwdCaptchaImage').src = imgUrl;

    document.getElementById('changePwdCaptchaInput').value = '';

  } catch (e) {
    console.error('Change pwd captcha error:', e);
    alert('Failed to load captcha');
  }
}

// Load captcha when Change Password tab is clicked
$(document).on('click', '[data-bs-target="#profile-change-password"]', function () {
  loadChangePwdCaptcha();
  $('#changePwdCaptchaVerifyBtn').prop('disabled', false).text('Verify Captcha')
    .removeClass('btn-success').addClass('btn-primary');
  $('.updatePwd').prop('disabled', true);
});

// Refresh icon
$(document).on('click', '.changePwdResetCap', function () {
  $(this).css('transform', 'rotate(180deg)');
  setTimeout(() => $(this).css('transform', 'rotate(0deg)'), 300);
  loadChangePwdCaptcha();
  $('.updatePwd').prop('disabled', true);
  $('#changePwdCaptchaVerifyBtn').prop('disabled', false).text('Verify Captcha')
    .removeClass('btn-success').addClass('btn-primary');
});

// Verify captcha button
$(document).on('click', '#changePwdCaptchaVerifyBtn', function () {
  const captchaVal = $('#changePwdCaptchaInput').val().trim();

  if (!captchaVal || !window.changePwdCaptchaId) {
    alert('Please enter the captcha.');
    return;
  }

  const captchaPayload = {
    captchaId: window.changePwdCaptchaId,
    captcha: captchaVal
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
        return res.text().then(() => {
          let seconds = 600;
          $('#changePwdCaptchaVerifyBtn').prop('disabled', true);
          $('#changePwdCaptchaInput').prop('disabled', true);

          const interval = setInterval(() => {
            seconds--;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            $('#changePwdCaptchaVerifyBtn').text(`Try again in ${mins}m ${secs}s`);
            if (seconds <= 0) {
              clearInterval(interval);
              $('#changePwdCaptchaVerifyBtn').prop('disabled', false).text('Verify Captcha');
              $('#changePwdCaptchaInput').prop('disabled', false);
              loadChangePwdCaptcha();
            }
          }, 1000);

          alert('Too many wrong attempts. Please wait 10 minutes before trying again.');
          throw new Error('RATE_LIMITED');
        });
      }
      if (!res.ok) throw new Error('Verify failed');
      return res.text();
    })
    .then(resp => {
      if (!resp) return;

      if (resp === 'CAPTCHA Verified') {
        $('.updatePwd').prop('disabled', false);
        $('#changePwdCaptchaVerifyBtn').prop('disabled', true).text('Verified ✓')
          .removeClass('btn-primary').addClass('btn-success');
      } else {
        alert(resp || 'Invalid captcha. Please try again.');
        loadChangePwdCaptcha();
      }
    })
    .catch(err => {
      if (err.message === 'RATE_LIMITED') return;
      alert('Captcha verification failed. Please try again.');
      loadChangePwdCaptcha();
    });
});

// Refresh icon - target by id to avoid conflicting with login/register resetCap
$(document).on('click', '#changePwdResetCap', function () {
  $(this).css('transform', 'rotate(180deg)');
  setTimeout(() => $(this).css('transform', 'rotate(0deg)'), 300);
  loadChangePwdCaptcha();
  $('.updatePwd').prop('disabled', true);
  $('#changePwdCaptchaVerifyBtn').prop('disabled', false).text('Verify Captcha')
    .removeClass('btn-success').addClass('btn-primary');
});

// Auto-open Update Profile tab if redirected from profile check(if anything is missing in profile) by Naitik 20/04/2026
$(document).ready(function () {

  var urlParams = new URLSearchParams(window.location.search);
  var isIncomplete = urlParams.get('profileIncomplete') === 'true'
    || window.location.hash === '#profile-update-details';

  if (isIncomplete) {

    // Show red banner
    if (!document.getElementById('profileIncompleteBanner')) {
      const banner = document.createElement('div');
      banner.id = 'profileIncompleteBanner';

      Object.assign(banner.style, {
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: '9999',
        background: '#dc3545',
        color: '#fff',
        padding: '10px 16px',
        fontSize: '13px',
        fontWeight: '600',
        borderRadius: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
      });

      banner.addEventListener('click', () => {
        window.location.href = cp + '/user/userProfile?profileIncomplete=true';
      });

      const icon = document.createElement('span');
      icon.style.fontSize = '16px';
      icon.textContent = '⚠️';

      const label = document.createElement('span');
      label.textContent = 'Complete Your Profile';

      banner.appendChild(icon);
      banner.appendChild(label);
      document.body.appendChild(banner);
    }

    // Auto open Update Profile tab
    var $tabBtn = $('[data-bs-target="#profile-update-details"]');
    if ($tabBtn.length) {
      setTimeout(function () {
        $tabBtn.tab('show');
        $('html, body').animate({
          scrollTop: $tabBtn.offset().top - 80
        }, 400);
        loadUserProfile();
        history.replaceState(null, '', window.location.pathname);
      }, 300);
    }
  }
});

//End Auto-open Update Profile by Naitik 21/04/2026