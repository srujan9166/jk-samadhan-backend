

$(".input-f").keypress(function (e) {
  return validN(e);
});

function validN(e) {
  var keyCode = e.keyCode || e.which;
  //Regex for Valid Characters i.e. Alphabets.
  var regex = /^[A-Za-z,]+$/;
  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  return isValid;
}

$("#email").keypress(function (e) {
  //console.log($(this).val())
  return validEmail(e);
});

function validEmail(e) {
  var keyCode = e.keyCode || e.which;


  var regex = /^[A-Za-z0-9._@-\s]*$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}

function validTextArea(e) {
  var keyCode = e.keyCode || e.which;

  //var lblError5 = document.getElementById("inputGroupPrepend");
  //lblError5.innerHTML = "";

  //Regex for Valid Characters i.e. Alphabets.
  var regex = /^[A-Za-z0-9,._\-/():;\s]+$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}

$("#password").keypress(function (e) {
  //console.log($(this).val())
  return validPassword(e);
});

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


let context_path = $("#context_path").val();
var globalMISRadioValue;

function sessionFunc() {
  var settings = {
    url: context_path + "/sessionvalue",
    method: "POST",
    data: { sessionname: $("#sessionname").val() },
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    $(".sessionvalue").val(j);
  });
}
// document ready function
$(document).ready(function () {
  sessionFunc();
  $(".multi-select2").select2({
    placeholder: "",
    allowClear: true,
  });
  // 20 May 2024
  if (window.location.href.indexOf("/getUserList") != -1) {
    $(document).on("click", ".shwUptDetails", function (e) {
      let c = $(this).val();
      let d = chkV(c);
      window.location.href = "basedUlUpdProfile?d=" + d;
    });
  }
  // 20 May 2024


  $(document).on("change", ".data-whichWise", function (e) {
    var chckRadioVal = $(this).val();
    globalMISRadioValue = chckRadioVal;
    if (window.location.href.indexOf("/agePage") != -1) {
      ageAreportData(chckRadioVal);
    }
    if (window.location.href.indexOf("/uWRpt") != -1) {
      uWRptData(chckRadioVal);
    }
    if (window.location.href.indexOf("/conPenrpt") != -1) {
      conPenrptData(chckRadioVal);
    }
  });

  if (window.location.href.indexOf("/agePendingPage") != -1) {
    agePendingAreportData("userwise");
  }

  if (window.location.href.indexOf("/misReportSection") != -1) {
    $(".usrLis").click(function () {
      window.location.href = "getUserList";
    });
    // $(".dealHLis").click(function () {
    //   window.location.href = "dhlPage";
    // });
    $(".ageLis").click(function () {
      window.location.href = "agePage";
    });
    $(".usrWsLis").click(function () {
      window.location.href = "uWRpt";
    });
  }

  //   for age analysis report on load of agepage endpoint
  if (window.location.href.indexOf("/agePage") != -1) {
    ageAreportData();
  }
  //   for age analysis detailed report on load of dviewAge endpoint
  if (window.location.href.indexOf("/dviewAge") != -1) {
    var dataFromStorage1 = sessionStorage.getItem("actiondata2"); // Retrieve data from session storage
    if (dataFromStorage1) {
      detailedviewAge1(dataFromStorage1);
    } else {
      detailedviewAge1(0);
    }
  }

  //   for user wise status report on load of agepage endpoint
  if (window.location.href.indexOf("/uWRpt") != -1) {
    uWRptData();
  }
  //   for user wise status detailed report on load of detailedviewUW endpoint
  if (window.location.href.indexOf("/detailedviewUW") != -1) {
    var dataFromStorage = sessionStorage.getItem("data"); // Retrieve data from session storage
    if (dataFromStorage) {
      detailedViewForUW(dataFromStorage);
    } else {
      detailedViewForUW(0);
    }
  }

  if (window.location.href.indexOf("/conPenrpt") != -1) {
    $(".data-whichWise:checked").trigger("change");
    conPenrptData("userwise");
  }


  if (
    $(".usrT").val() != "ROLE_Admin" &&
    $(".usrT").val() != "ROLE_SuperAdmin" &&
    $(".usrT").val() != "" &&
    window.location.href.indexOf("/processGrievance") == -1
  ) {
    // console.log("getGrievList working ....");
    // getGrievList("Home");
    serverSideDeptDT();

  }

  $(".custBtn").click(function () {
    console.log(this.value);

    if (this.value == "dash") {
      $("#fwdByOtherDep-tab").removeClass("active");
      $("#home-tab").addClass("active");
      getGrievList("Home");
    } else if (this.value == "jkigrams") {
      jkiGramForDepartment();
    } else if (this.value == "CPGRAM") {
      window.location.href = "cpgramDashboard";
    }
  });
});

function getSelectedValuesMsel(selector, delimiter, defaultValue) {
  var selectedValues = $(selector).val() || defaultValue;
  if (selectedValues.length === 0) {
    return 0;
  }
  var quotedValues = selectedValues.map(function (value) {
    return "'" + value + "'";
  });
  return quotedValues.join(delimiter);
}

// format previous date's
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
// Current Date & Time
function getCurrentDateTime() {
  const currentDate = new Date();
  const day = ("0" + currentDate.getDate()).slice(-2);
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Month starts from 0
  const year = currentDate.getFullYear();
  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);
  let dateAndTime =
    day +
    "-" +
    month +
    "-" +
    year +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return dateAndTime;
}

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

$(".btn-customBtn").on("click", function () {
  // console.log($(this).val());
  table117.button("." + $(this).val()).trigger();
});

var table117 = $("#YRreport").DataTable({
  //  data: j,
  destroy: true,
  lengthMenu: [5, 10, 25],
  pageLength: 10,
  scrollX: true,
  autoWidth: false,
  responsive: true,
  //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
  buttons: [
    {
      extend: "excel",
      title: "JKGOVT",
      messageTop: "The information in this table is copyright to JK GOVT.",
      exportOptions: {
        columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
      },
    },
    {
      extend: "pdf",
      title: "JKGOVT",
      messageBottom: "The information in this table is copyright to JK GOVT.",
      pageSize: "A4",
      download: "open",
      customize: function (doc) {
        // Set the page orientation and size
        doc.pageSize = "A4";
        doc.pageOrientation = "landscape";

        // Adjust the content styling
        doc.styles.tableHeader.fontSize = 8;
        doc.styles.tableBodyOdd.fontSize = 8;
        doc.styles.tableBodyEven.fontSize = 8;

        // Center the table content
        var rowCount = doc.content[1].table.body.length;
        for (var i = 0; i < rowCount; i++) {
          var row = doc.content[1].table.body[i];
          for (var j = 0; j < row.length; j++) {
            row[j].alignment = "center";
          }
        }

        // Scale the table width to fit the page
        var totalColumns = doc.content[1].table.body[0].length;
        var columnWidths = [];
        for (var i = 0; i < totalColumns; i++) {
          columnWidths.push("*");
        }
        doc.content[1].table.widths = columnWidths;
      },
      exportOptions: {
        columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
      },
    },
  ],
});
table117.columns.adjust().draw();

// -----------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------
// $(document).ready(function () {
//   $("#officeSelect").change(function () {
//     //alert($(this).val())
//     //window.location.href="home";

//     officeData($(this).val());
//   });

//   $("#distSelect").change(function () {
//     var offName = $("#officeSelect").val();
//     //alert(offName+"  "+$(this).val())
//     //window.location.href="home";

//     distData(offName, $(this).val());
//   });

//   $(".toggle-input2").change(function () {
//     if ($(this).is(":checked")) {
//       // alert("checked")
//       $(".statusOthersInput").show();
//     } else {
//       $(".statusOthersInput").hide();
//     }
//   });

//   const formattedDateTime = getCurrentDateTime();
//   $(".stDateTime").val(formattedDateTime);
// });

$("#decc").keypress(function (e) {
  //console.log($(this).val())
  return validTextArea(e);
});

$("#dnpRemark").keypress(function (e) {
  //console.log($(this).val())
  return validTextArea(e);
});

function distData(offName, district) {
  var c = JSON.stringify({
    offName: offName,
    district: district,
  });

  var d = chkV(c);

  var settings = {
    url: "getDataByDistrict?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    var list = j.countApp;
    //	console.log(j.data);

    $("#homeDiv").html("");
    $("#homeDiv").append(
      '<table class="table table-bordered" id="all_tblHome" style="width: 100%;"></table>'
    );
    makeDataTable(j, "Home")
    $('#totalG').text(list[0].total);
    $('#pending').text(list[0].pending);
    $('#appealed').text(list[0].appealed);
    $('#resolved').text(list[0].resolved);
    //$('#pendingGri').text(list.underprocess);
    $('#rejected').text(list[0].rejected);
    $('#forwarded').text(list[0].forwarded);
    $('#remark').text(list[0].remarked);
    $('#DNP').text(list[0].dnp);
    $('#webApp').text(list[0].webapp);
    $('#mobApp').text(list[0].mobapp);
  });
}



///appeal --> 03-03-2-24
$(document).on("click", ".appP", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  window.open("showAppealDetails?d=" + d);
  // window.location.href = "procesAppeal?d=" + d;
});

$("#doccss").click(function (e) {
  //alert(e.target.value)
  //var path=$('#doccss').attr('val');
  var path = e.target.value;
  window.location.href = "download1?fileName=" + encodeURIComponent(path);
  // $("#doccss").attr("href", 'download1?fileName=' + encodeURIComponent(path));
});

$(document).on("click", "#doccc2", function (e) {
  var path = e.target.value;
  //console.log(path)
  window.location.href = "download1?fileName=" + encodeURIComponent(path);
  //$("#doccc2").attr("href", 'download1?fileName=' + encodeURIComponent(path));
});

$(document).on("click", "#doccc3", function (e) {
  var path = e.target.value;
  //console.log(path)
  window.location.href = "download1?fileName=" + encodeURIComponent(path);
  //$("#doccc2").attr("href", 'download1?fileName=' + encodeURIComponent(path));
});

// 05th Jan 2024 - SKY - start
$(document).on("click", ".vHis", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  // window.open("historyGrievance?d=" + d, "_blank");
  //   window.location.href = "historyGrievance?d=" + d;
  window.open("historyGrievance?d=" + d, "_blank");
});

$(document).on("click", ".grevP", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  var settings = {
    url: "grievanceAcknowledged?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // if (j.statusCode[0] == 1) {
    //   alert("Pulled Successfully.");
    // } else {
    //   alert("Something went wrong");
    // }
    window.location.href = "processGrievance?d=" + d;
  });
});

$("#stUploadPhoto1").on("change", function () {
  //docss=[];
  //fileValidation()

  var id = $(this).attr("id");
  var fff = fileValidation(id);
  if (fff != false) {
    var t = checkMaliciousFile(id);
    t.then(function (success) {
      if (success == true) {
        return true;

        //fileValidation(id);
      } else {
        $("#" + id).val("");
        alert("Malicious File Detected");
      }
    });
  }
});

function checkMaliciousFile(id) {
  var file = document.getElementById(id).files[0];
  var formData = new FormData();
  formData.append("d", file);
  //    formData.append('file', cdd);

  return new Promise(function (resolve) {
    var settings = {
      url: "checkMeliciousFile",
      method: "POST",
      //	"data": {d:c,file:cdd},
      data: formData,
      contentType: false,
      processData: false,
      //"timeout": 0,
    };

    $.ajax(settings).done(function (j) {
      //j = setV(j);
      //j = JSON.parse(j);
      //console.log(j)
      if (j == "1") {
        resolve(true, j);
      } else {
        resolve(false, j);
      }
    });
  });
}

function fileValidation(id) {
  const fi = document.getElementById(id);
  var filePath = fi.value;
  var filename = filePath.replace(/^.*[\\\/]/, "");
  var allowedExtensions =
    /(\.png|\.PNG|\.jpg|\.JPG|\.jpeg|\.JPEG|\.PDF|\.pdf)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert("Please upload PDF,JPEG,JPG and PNG file only");
    fi.value = "";
    return false;
  }
  if (fi.files.length > 0) {
    //  for (const i = 0; i <= fi.files.length - 1; i++) {

    const fsize = fi.files.item(0).size;
    const file = Math.round(fsize / 1024);
    // The size of the file.
    if (file >= 2048) {
      alert("File size should be less than 2 MB");
      $("#" + id).val("");
      return false;
    }
  }
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isMobile(mobile) {
  var regex = /^([6789][0-9]{9})$/;
  return regex.test(mobile);
}

$("#mobile").bind("keyup paste", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

function dptName() {
  $("#createUserDiv").show();
}

/*$('input[type="radio"][name="userType"]').change( function(){
  var usrType=$(this).val();
  $("#newUserDiv").show();
  if(usrType=='Administrative'){
  	
    $("#distDiv").hide();
    $("#dist").val('');
    $("#division").val('');
  }else{
  	
    $("#distDiv").show();
  }
	
})*/

$("#password").on("input", function () {
  var password = $(this).val();
  validatePassword(password);
});

function validatePassword(password) {
  var uppercasePattern = /[A-Z]/;
  var lowercasePattern = /[a-z]/;
  var digitPattern = /\d/;
  var specialPattern = /[@$!%*?&]/;
  var lengthPattern = /.{8,}/;

  checkPattern(uppercasePattern, password, "#uppercase");
  checkPattern(lowercasePattern, password, "#lowercase");
  checkPattern(digitPattern, password, "#digit");
  checkPattern(specialPattern, password, "#special");
  checkPattern(lengthPattern, password, "#length");
}

function checkPattern(pattern, password, element) {
  if (pattern.test(password)) {
    // console.log("success")
    $(element).addClass("matched");
  } else {
    // console.log("failed")
    $(element).removeClass("matched");
  }
}
$("#submitUser").click(function () {
  var checkPass = $("#password").val();
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

    if (j.statusCode == "1") {
      //$('#errMsg2').hide()

      var dp = $("#selDept").find(":selected").val();
      var chked = "";
      $(".flexCheckChecked:checked").each(function () {
        var vl = $(this).val();
        chked = chked + vl + ",";
      });
      chked = chked.substring(0, chked.length - 1);
      //					alert(chked);
      /*if($('.flexCheckChecked:checked').length == 0 || dp == '0' || $("#fn").val() == null || $("#fn").val().trim() == '' || $("#ln").val() == null || $("#ln").val().trim() == '' || $("#mobile").val() == null || $("#mobile").val().trim() == '' || $("#email").val() == null || $("#email").val().trim() == '' || $("#designation").val() == null || $("#designation").val().trim() == '' || $("#password").val() == null || $("#password").val().trim() == ''){
          alert("All fields except middle name are mandatory.")
        }
        */
      var validation;
      //	var visibility=$('#distDiv').is(':visible')
      var onlyDistrict = $("#distsss").is(":visible");
      var onlyDivision = $("#divvvv").is(":visible");

      //var dist = $('#dist').find(":selected").val();
      var district = $("#dist").val();
      var div = $("#inputRegion").find(":selected").val();
      var usTp = $("#selUsrType").find(":selected").val();
      var des = $("#designation").find(":selected").val();
      //var usLvl = $('#selUsrLevel').find(":selected").val();
      // var usrLvl = $("input[type=radio][name=userType]:checked").val();
      // var isChecked = $("input[type=radio][name=userType]").is(":checked");
      var isChecked = $("#userType").val();
      //	console.log(onlyDistrict+"   "+onlyDivision)

      if (onlyDivision == true && onlyDistrict == true) {
        validation =
          $("#fn").val() == null ||
          $("#fn").val().trim() == "" ||
          $("#ln").val() == null ||
          $("#ln").val().trim() == "" ||
          $("#mobile").val() == null ||
          $("#mobile").val().trim() == "" ||
          $("#email").val() == null ||
          $("#email").val().trim() == "" ||
          $("#offName").val() == null ||
          $("#offName").val().trim() == "" ||
          des == "0" ||
          $("#password").val() == null ||
          $("#password").val().trim() == "" ||
          usTp == "0" ||
          isChecked == "0" ||
          div == "0" ||
          district.length == "0";
      } else if (onlyDivision == true && onlyDistrict == false) {
        validation =
          $("#fn").val() == null ||
          $("#fn").val().trim() == "" ||
          $("#ln").val() == null ||
          $("#ln").val().trim() == "" ||
          $("#mobile").val() == null ||
          $("#mobile").val().trim() == "" ||
          $("#email").val() == null ||
          $("#email").val().trim() == "" ||
          $("#offName").val() == null ||
          $("#offName").val().trim() == "" ||
          des == "0" ||
          $("#password").val() == null ||
          $("#password").val().trim() == "" ||
          usTp == "0" ||
          isChecked == "0" ||
          div == "0";
      } else {
        validation =
          $("#fn").val() == null ||
          $("#fn").val().trim() == "" ||
          $("#ln").val() == null ||
          $("#ln").val().trim() == "" ||
          $("#mobile").val() == null ||
          $("#mobile").val().trim() == "" ||
          $("#email").val() == null ||
          $("#email").val().trim() == "" ||
          $("#offName").val() == null ||
          $("#offName").val().trim() == "" ||
          des == "0" ||
          $("#password").val() == null ||
          $("#password").val().trim() == "" ||
          usTp == "0" ||
          isChecked == "0";
      }

      if (validation) {
        alert("All fields except middle name are mandatory.");
      } else {
        // var checkedValue = $(
        //   'input[type="radio"][name="userType"]:checked'
        // ).val();
        // var dist = $('#dist').find(":selected").val();
        var dist = getSelectedValuesMsel("#dist", ", ", []);
        var div = $("#inputRegion").find(":selected").val();
        var fn = $("#fn").val().trim();
        var mn = $("#mn").val();
        var ln = $("#ln").val().trim();
        var mobile = $("#mobile").val().trim();
        var email = $("#email").val().trim();
        var designation = $("#designation").val().trim();
        var passw = $("#password").val().trim();
        var offName = $("#offName").val().trim();

        if (mn != null) {
          mn = mn;
        } else {
          mn = "";
        }

        if (isEmail(email) && isMobile(mobile)) {

          //Naitik Changes on popup 09/10/2025

          if (!confirm("Are you sure that you want to Create User?")) {
            return;
          }

          //Naitik Changes on popup end 09/10/2025
          var c = JSON.stringify({
            first_name: fn,
            middle_name: mn,
            last_name: ln,
            mobile: mobile,
            email: email,
            designation: designation,
            passw: passw,
            category: chked,
            department_name: dp,
            divison: div,
            district: dist,
            user_assigned: usTp,
            value: isChecked,
            office_name: offName,
            sessionvalue: $("#sessionvalue").val(),
            sessionname: $("#sessionname").val(),
          });

          //console.log(c)

          var d = chkV(c);
          var settings = {
            url: "addUser?d=" + d,
            method: "POST",
            timeout: 0,
          };
          $.ajax(settings).done(function (j) {
            j = setV(j);
            j = JSON.parse(j);
            //console.log(j);
            if (j.statusCode == "1") {
              alert("User added successfully.");
              window.location.reload();
            } else if (j.statusCode == "2") {
              //console.log(j.data);
              alert("Email id already exists.");
              window.location.reload();
            } else if (j.statusCode == "4") {
              var msg = j.statusName;
              alert(msg);
            } else {
              alert("Something went wrong");
              window.location.reload();
            }
          });
        } else {
          alert("Enter valid email and mobile.");
        }
      }
    } else {
      alert("Incorrect Password");
      // $('#errMsg2').show()
      // $('#errMsg2').html(j.msg)
      return false;
    }
  });
});

createdUsersList();
function createdUsersList() {
  var settings = {
    url: "createdUserlist",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };

  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    createdUsers(j.data);
    //console.log(j.data)
  });
}

function createdUsers(d) {
  var table118 = $("#YRreport11").DataTable({
    data: d,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    paging: true,
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)",
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)",
        },
      },
    ],
    columns: [
      {
        title: "S.No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      { data: "office_name", defaultContent: "", title: "Office" },
      { data: "createdUsrName", defaultContent: "", title: "Name And Designation" },
      { data: "user_assigned", defaultContent: "", title: "User Type" },
      { data: "created_date", defaultContent: "", title: "Created On" },
      { data: "created_by_name", defaultContent: "", title: "Created By" },
    ],
  });

  // Trigger Excel export on button click
  $("#exportExcel").on("click", function () {
    table118.button(".buttons-excel").trigger();
  });

  // Trigger PDF export on button click
  $("#exportPdf").on("click", function () {
    table118.button(".buttons-pdf").trigger();
  });
}

// 26 Feb 2024 - for drop-down when does not pertain to this division is clicked... - SKY

var selectedValue21 = "";
var dropdownValue21 = "";

// Reset Button for does not pertain drop-down div
$(".reset-Div").click(function () {
  // hide drop-down div
  $(".doesNper").hide();
  // reset drop-down value
  // $("#pGrevVal").val("0");
  $("#pGrevVal option:first").prop("selected", true);
  // reset radio button
  $(".statusConPer").prop("checked", false);
});

$(".statusRes").click(function () {
  if ($(this).is(":checked")) {
    $(".doesNper").hide();
    $("#pGrevVal option:first").prop("selected", true);
  }
});

$(".statusConPer").click(function () {
  if ($(this).is(":checked")) {
    selectedValue21 = $(".statusConPer").val(); // Capture value when checked
    $(".doesNper").show();
  } else {
    $(".doesNper").hide();
    selectedValue21 = ""; // Reset value when unchecked
  }
});

$("#pGrevVal").change(function () {
  // Validation: Check if a value is selected
  if ($(this).val() == 0) {
    alert("Please select a value.");
    // Optionally, you can reset the dropdown to the default state here
  } else {
    dropdownValue21 = $(this).val(); // Update selectedValue when dropdown changes
  }
});

$(".btn-customBtn").on("click", function () {
  // console.log($(this).val());
  table119.button("." + $(this).val()).trigger();
});

var table119 = $("#YRreportss").DataTable({
  //  data: j,
  destroy: true,
  lengthMenu: [5, 10, 25],
  pageLength: 10,
  dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
  buttons: [
    {
      extend: "excel",
      title: "JKGOVT",
      messageTop: "The information in this table is copyright to JK GOVT.",
      exportOptions: {
        columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
      },
    },
    {
      extend: "pdf",
      title: "JKGOVT",
      messageBottom: "The information in this table is copyright to JK GOVT.",
      pageSize: "A4",
      download: "open",
      customize: function (doc) {
        // Set the page orientation and size
        doc.pageSize = "A4";
        doc.pageOrientation = "landscape";

        // Adjust the content styling
        doc.styles.tableHeader.fontSize = 8;
        doc.styles.tableBodyOdd.fontSize = 8;
        doc.styles.tableBodyEven.fontSize = 8;

        // Center the table content
        var rowCount = doc.content[1].table.body.length;
        for (var i = 0; i < rowCount; i++) {
          var row = doc.content[1].table.body[i];
          for (var j = 0; j < row.length; j++) {
            row[j].alignment = "center";
          }
        }

        // Scale the table width to fit the page
        var totalColumns = doc.content[1].table.body[0].length;
        var columnWidths = [];
        for (var i = 0; i < totalColumns; i++) {
          columnWidths.push("*");
        }
        doc.content[1].table.widths = columnWidths;
      },
      exportOptions: {
        columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
      },
    },
  ],
});

$(document).on("click", ".procGrev", function () {
  // get value(status) of a selected radio button
  let btnVal = $(this).text();
  let selectedValue = $('input[name="actionCheckBox"]:checked').val();
  // alert(selectedValue)

  // if (selectedValue == "Others") {
  //   selectedValue = $(".statusOthersInput").val();
  // } else if (selectedValue != "Others") {
  //   $(".statusOthersInput").hide();
  // }

  var dropdownValue = selectedValue == selectedValue21 ? dropdownValue21 : "NA";

  // console.log(dropdownValue)

  if (
    selectedValue == null ||
    selectedValue == "" ||
    $(".stRemarks").val().trim() == "" ||
    $(".stRemarks").val().trim() == null
  ) {
    alert(
      "Action on Grievance and Remarks are mandatory fields. Please fill them and try again."
    );
  } else {

    // storing values from process-grievance having className's
    var gervId = $(".gGrevId").text();
    var status = selectedValue;
    var remarks = $(".stRemarks").val();
    var dateTime = $(".stDateTime").val();

    //var uploadPhoto = $(".stUploadPhoto").val();
    //   console.log(status : ` + status + ` remarks : ` + remarks + ` dateTime : ` + dateTime + ` uploadPhoto : + uploadPhoto)

    if (!status == "") {
      var userType = $(".usrT").val();

      var c = JSON.stringify({
        greiveanceId: gervId,
        btnVal: btnVal,
        disposedStatus: status,
        remarks: remarks,
        dateTime: dateTime,
        doesNotPertainStatus: dropdownValue,
        sessionvalue: $("#sessionvalue").val(),
        sessionname: $("#sessionname").val(),
        //userType:userType
      });
    }

   $(".procGrev").prop("disabled", true).css("opacity", "0.65");


    // encrypting object
    var d = chkV(c);
    // file upload
    let file = document.getElementById("stUploadPhoto1").files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("d", d);

    // alert(c)
    //  console.log(userType)
    // ajax call
    var settings = {
      //url: "grievanceForm?d=" + d,
      url: "grievanceForm",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 0,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      // console.log(j);
      if (j == 1) {
        //console.log(j.data);
        alert("Grievance processed successfully.");
        window.location.href = "home";
      } else if (j == "2") {
        alert("Malicious file detected");
        window.location.reload();
      } else if(j == "3"){
        alert("Form bombbarding not allowed");
        window.location.reload();
      }else{
        alert("Something went wrong");
         window.location.reload();
      }
    });
  }
});

// 27 Feb 2024 - changeCategory - start - SKY
$(document).on("click", ".cEcatg", function () {
  // storing values from process-grievance
  var currentDeptName = $("#deptName").val();
  var currentCatVal = $("#categName").val();
  var currentCatText = $("#categName").text().trim();
  var newCatVal = $("#categList").find(":selected").val();
  var newCatText = $("#categList").find(":selected").text().trim();
  var dateTime = $(".stDateTime").val();
  var gId = $(".gGrevId").text().trim();

  if (
    currentCatVal == "" ||
    currentCatVal == 0 ||
    newCatVal == "" ||
    newCatVal == 0 ||
    newCatText == "Select" ||
    newCatText == ""
  ) {
    alert("Select Change Category and try again.");
  } else {
    if (!currentDeptName == "") {
      var c = JSON.stringify({
        greiveanceId: gId,
        currentDeptName: currentDeptName,
        currentCatVal: currentCatVal,
        currentCatText: currentCatText,
        newCatVal: newCatVal,
        newCatText: newCatText,
        dateTime: dateTime,
        btnVal: "Change Category",
      });
    }

    // encrypting object
    var d = chkV(c);
    // ajax call
    var settings = {
      url: "changeCategory-changeDepartment?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j == 1) {
        //console.log(j.data);
        alert("Category Changed Successfully.");
        window.location.href = "home";
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }
});
// 27 Feb 2024 - changeCategory - end - SKY

// 27 Feb 2024 - changeDepartment - start - SKY

$("#dpList").on("change", function () {
  var newDeptName = $("#dpList").find(":selected").text();
  var oldDeptName = $("#deptName").val();

  //console.log(oldDeptName)
  $('#cLselDept').html('');
  $("#cLselDept").append('<option value="0">Select</option>');
  var appFlag = $('#appFlag').val();
  //console.log(appFlag)
  if ((newDeptName != "Select" && oldDeptName != newDeptName) && (appFlag != "CPGRAM")) {
    $("#cLselDept").prop("disabled", false);
    var c = JSON.stringify({
      newDeptName: newDeptName,
    });
    var d = chkV(c);
    // ajax call
    var settings = {
      url: "fetchDeptBasedCatg?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j.statusCode == 1) {
        makeDropdown(cLselDept, j.data);
      }
    });
  } else {
    $("#cLselDept").prop("disabled", true);
    $("#cLselDept option:first").prop("selected", true);
  }
});

$(document).on("click", ".changeDeptBtn", function () {
  // storing values from process-grievance

  var currentDeptName = $("#deptName").val();
  var newDeptName = $("#dpList").find(":selected").text();
  var dnpRemark = $("#dnpRemark").val();

  var newCatVal = $('#cLselDept').find(":selected").val();
  var newCatText = $('#cLselDept').find(":selected").text().trim();

  var dateTime = $(".stDateTime").val();
  var gId = $(".gGrevId").text().trim();
  var btnVal = $(this).val();
  var validation = "";
  var appFlag = $('#appFlag').val();

  if ((newDeptName == currentDeptName && btnVal == "ChangeDepartment") || appFlag == "CPGRAM") {
    validation = newDeptName == "" || newDeptName == "Select" || dnpRemark == "";
  } else {
    validation = newDeptName == "" || newDeptName == "Select" || dnpRemark == "" || newCatVal == "" || newCatVal == 0 || newCatText == "Select" || newCatText == "";
  }

  if (validation) {
    alert("Select Change Department, Category and enter remark. Then try again.");
  }
  // if (newDeptName == "" || newDeptName == "Select") {
  //   alert("Select  Department. Then try again.");
  // }
  else {
    if (!currentDeptName == "") {
      var c = JSON.stringify({
        greiveanceId: gId,
        currentDeptName: currentDeptName,
        newDeptName: newDeptName,
        newCatVal: newCatVal,
        newCatText: newCatText,
        dateTime: dateTime,
        btnVal: btnVal,
        appFlag: appFlag,
        dnpRemark: dnpRemark
      });
    }

    console.log(c)

    // encrypting object
    var d = chkV(c);
    // ajax call
    var settings = {
      url: "changeCategory-changeDepartment?d=" + d,
      method: "POST",
      timeout: 0,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //console.log(j);
      if (j.statusCode == 1) {
        //console.log(j.data);
        alert(j.msg);
        window.location.href = "home";
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }
});
// 27 Feb 2024 - changeDepartment - end - SKY

// 16th JAN 2024 - SKY - Pull Application Code
$(document).on("click", ".pullApp12", function (e) {
  let grevID = e.target.value;
  let d = chkV(grevID);
  if (confirm("Are you sure you want to proceed?")) {
    var settings = {
      url: "pullAppDept?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j.statusCode[0] == 1) {
        //console.log(j.data);
        alert("Pulled Successfully.");
        window.location.reload();
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  } else {
    // If user clicks "No," you can handle it here or do nothing
    console.log("User clicked No");
  }
});

$(document).on("click", ".fwdDM", function (e) {
  let gervId = e.target.value;
  let btnVal = $(this).text();
  // console.log(gervId + ", " + btnVal)
  var c = JSON.stringify({
    greiveanceId: gervId,
    btnVal: btnVal,
    finalStatus: "",
    remarks: "",
    dateTime: getCurrentDateTime(),
  });
  // console.log(c)
  var d = chkV(c);
  const formData = new FormData();
  formData.append("d", d);

  // ajax call
  var settings = {
    //url: "grievanceForm?d=" + d,
    url: "grievanceForm",
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(j);
    if (j == 1) {
      //console.log(j.data);
      alert("Grievance successfully forwaded to DM.");
      window.location.href = "home";
    } else {
      alert("Something went wrong");
      window.location.reload();
    }
  });
});

// API_V1
Listen(document).on("click", ".tt_griev", function (e) {
  let btnVal = e.target.value;
  if (btnVal == "Normal" || btnVal == "Priority") {
    $(".backBtn").removeClass("visually-hidden");
  }
  if (btnVal == "Back") {
    btnVal = "Home";
    $(".backBtn").addClass("visually-hidden");
  }
  // alert(btnVal)
  getGrievList(btnVal);
});

// $(document).on("click", ".data-search", function (e) {
//   getGrievList($(this).val());
// });

function officeData(officeName) {
  $("#distSelect").prop("selectedIndex", 0);

  var c = JSON.stringify({
    office_name: officeName,
  });
  var d = chkV(c);
  var settings = {
    url: "OfficeDataList?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    // console.log(j.appCount[0].total)
    var list = j.appCount;
    // if (btnVal == "Home" || btnVal == "Normal" || btnVal == "Priority" || btnVal == "web" || btnVal == "mobile") {
    //btnVal = "Home";
    $("#homeDiv").html("");
    $("#homeDiv").append(
      '<table class="table table-bordered" id="all_tblHome" style="width: 100%;"></table>'
    );
    // }
    //   if(j.statusCode != 0 && j.data.length > 0){
    // 	// format Date to dd MM yyyy hh:mm:ss:ms
    // 	j.data = j.data.map((current) => {
    // 	  if (current.createddate != null) {
    // 		current.createddate = format_date(current.createddate);
    // 	  }
    // 	  return current;
    // 	});
    //   }

    makeDataTable(j, "Home");
    $("#totalG").text(list[0].total);
    $("#pending").text(list[0].pending);
    $("#appealed").text(list[0].appealed);
    $("#resolved").text(list[0].resolved);
    //$('#pendingGri').text(list.underprocess);
    $("#rejected").text(list[0].rejected);
    $("#forwarded").text(list[0].forwarded);
    $("#remark").text(list[0].remarked);
    $("#DNP").text(list[0].dnp);
    $("#webApp").text(list[0].webapp);
    $("#mobApp").text(list[0].mobapp);
  });
}

function getGrievList(btnVal) {
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    "url": "api_v1?d=" + d,
    "method": "POST",
    "timeout": 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    //	 console.log(j)
    if (btnVal == "Home" || btnVal == "Normal" || btnVal == "Priority" || btnVal == "web" || btnVal == "mobile") {
      btnVal = "Home";
      $("#homeDiv").html("");
      $("#homeDiv").append(
        '<table class="table table-bordered" id="all_tblHome" style="width: 100%;"></table>'
      );
    }
    if (j.statusCode != 0 && j.data.length > 0) {
      // format Date to dd MM yyyy hh:mm:ss:ms
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
    }

    makeDataTable(j, btnVal);
  });
}

function makeDataTable(d, val) {
  //console.log(d.data)
  // alert(val)
  if (d.data != null) {
    d.data = d.data.map((current) => {
      if (current.flag === "priority") {
        current.flag = "Priority";
      }
      if (current.flag === "normal") {
        current.flag = "Normal";
      }
      return current;
    });
  }

  var columns = [
    {
      // data: "Sl. No.",
      title: "S.No.",
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      data: "uniqid",
      defaultContent: "",
      title: "Grievance ID",
      render: function (data, type, row, meta) {
        /*if(row.fwd_flag=="Yes"){
        return "<div> "+ data +"</div><span class='text-danger'>Forwarded</span>";
        }else{*/
        return data;
        //}
      },
    },
    {
      data: "category",
      defaultContent: "",
      title: "Main Category",
    },
    {
      data: "sub_category",
      defaultContent: "",
      title: "Sub Category",
    },
    {
      data: "submitted_by",
      defaultContent: "",
      title: "Submitted By",
      render: function (data, type, row, meta) {
        return row.name;
      },
    },
    {
      data: "createdDate",
      defaultContent: "",
      title: "Submitted On",
    },
    {
      data: "key_flag",
      defaultContent: "",
      title: "Classification",
    },
    {
      data: "action",
      defaultContent: "",
      title: "Status",
      render: function (data, type, row, meta) {
        //			if (row.final_status != "Recieved" || row.final_status!="Proposed Disposed" || row.final_status!="Final Disposed"){

        //	console.log(row.finalstatus+"  "+row.uniqid)
        //console.log(row.finalstatus+"  "+data+"  "+row.uniqid)

        if (data === "Pending") {
          var text = "";
          if (row.reminder == "1") {
            text = "Kindly take action";
          } else {
            text = "";
          }

          return (
            '<div class="btn pe-none btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
            data +
            "</div> <span class='text-danger blink'>" +
            text +
            "</span>"
          );
        } else if (data === "Acknowledged") {
          return (
            '<div class="btn pe-none btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Under Process") {
          return (
            '<div class="btn pe-none btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
            data +
            "</div>"
          );
        } else if (
          data === "Rejected" &&
          (row.finalstatus === undefined ||
            row.finalstatus === "Proposed Disposed")
        ) {
          return (
            '<div class="btn pe-none btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (
          data === "Resolved" &&
          (row.finalstatus === undefined ||
            row.finalstatus === "Proposed Disposed")
        ) {
          return (
            '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
            data +
            "</div>"
          );
        }

        // else if (row.finalstatus=='Proposed Disposed') {
        //     return (
        //       '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
        //       data +
        //       "</div>"
        //     );
        // }
        else if (
          (data === "Resolved" || data == "Rejected") &&
          row.finalstatus == "Final Disposed"
        ) {
          return (
            '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
            row.finalstatus +
            "</div>"
          );
        } else if (
          !["Does not pertain to this office", "dnpToOffice"].includes(data) &&
          row.finalstatus === "Recieved"
        ) {
          return '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i>Proposed Disposed</div>';
        } else if (
          data === "Appealed" &&
          (row.finalstatus === undefined ||
            row.finalstatus === "Proposed Disposed" ||
            row.finalstatus === "Final Disposed" ||
            row.finalstatus === "Recieved" ||
            row.finalstatus === "")
        ) {
          return (
            '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (
          ["Does not pertain to this office", "dnpToOffice"].includes(data) ||
          row.finalstatus == "dnpToOffice"
        ) {
          var st = "Does Not Pertain";
          var dd;
          if (row.finalstatus == "dnpToOffice") {
            dd =
              '<div class="btn pe-none btn-dangar btn-sm yr-mw " style="background-color:#fffc33"><i class="bi bi-exclamation-octagon"></i> ' +
              st +
              "</div>";
          } else {
            dd =
              '<div class="btn pe-none btn-dangar btn-sm yr-mw " style="background-color:#33daff" ><i class="bi bi-exclamation-octagon"></i> ' +
              st +
              "</div>";
          }
          return dd;
        } else if (
          data === "Forwarded" &&
          [undefined, ""].includes(row.finalstatus)
        ) {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (
          data === "Remark Added" &&
          row.finalstatus === "Proposed Disposed"
        ) {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #3399FF"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        }
        // }else{
        // 	if (row.final_status == "Recieved" && row.final_status=="Proposed Disposed") {
        // 	  return (
        // 		'<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>Proposed Disposed</div>'
        // 	  );
        // 	}
        // 	else if(row.final_status=="Final Disposed"){
        // 	  return  '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>'+row.final_status+'</div>'

        // 	}

        //   }
      },
    },
    {
      data: "pending_since",
      defaultContent: "",
      title: "Pending Since",
      render: function (data, type, row, meta) {
        if (row.action == "Pending") {
          return data;
        } else {
          return "";
        }
      },
    },
    {
      data: "fwdByName",
      defaultContent: "",
      title: "Forwarded By",
    },

    {
      data: "uniqid",
      defaultContent: "",
      title: "Forwarded To",
      render: function (data, type, row, meta) {
        var btn = "";
        if (row.action == "Forwarded") {
          btn =
            '<div><a href="#" data-value = "' +
            data +
            '"  class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
        }
        return btn;
      },
    },
  ];

  if (d.statusCode != "0" && val != "fwdGrivances") {
    columns.push({
      data: "uniqid",
      defaultContent: "",
      class: "noExport",
      title: "Action",
      render: function (data, type, row, meta) {
        //	var btn="";

        //console.log(row.action+"  "+row.authority+"  "+data)
        var btn =
          '<div class="dropdown">' +
          '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
          '<i class="bi bi-three-dots"></i>' +
          "</button>" +
          '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
          '<li class="border-bottom border-success"><button class="btn btn-sm vDetails" value = "' +
          data +
          '"  data-appflag = "JKSAMADHAN">Grievance Details</button></li>';

        //   var btn ='<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +data + '">History</button>';
        if (
          ["Pending", "Under Process", "Acknowledged"].includes(row.action) &&
          ["", undefined].includes(row.finalstatus)
        ) {
          //  btn = btn +'<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>'+
          //  '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
          btn =
            btn +
            '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' +
            data +
            '">Process</button></li>';

          if (
            ["Pending", "Under Process", "Acknowledged"].includes(row.action) &&
            row.authority == "Process"
          ) {
            //console.log(row.action+"  "+row.authority+"  "+data)
            btn =
              btn +
              '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' +
              data +
              '">Forward</button></li>';
          }
          //+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
        } else if (row.action == "Does not pertain to this office") {
          /*  btn = btn +'<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>'+
                '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';*/

          btn = btn
            + '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
          //	+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
        } else if (row.action == "Forwarded" && row.finalstatus == "Recieved") {
          btn = btn
            + '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
            + '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Send Back</button></li>';
          //	+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
        } else if (row.action == "Forwarded" && row.finalstatus == "Recieved") {
          btn =
            btn +
            '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' +
            data +
            '">Process</button></li>';
        } else if (
          ["Forwarded", "Under Process"].includes(row.action) &&
          row.finalstatus == "dnpToOffice"
        ) {
          btn =
            btn +
            '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' +
            data +
            '">Process</button></li>' +
            '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' +
            data +
            '">Forward</button></li>';
        }
        //else if (row.action == "Pending" && row.authority == "Process") {
        // 	console.log(row.action+"  "+row.authority+"  "+data)
        // 	/*  btn = btn +'<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>'+
        // 			  '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';*/
        // 	btn = btn
        // 	//	+ '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
        // 		+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
        // }
        return btn + "</div>";
      },
    });
  }

  $(".btn-customBtn").on("click", function () {
    table120.button("." + $(this).val()).trigger();
  });
  var table120 = $("#all_tbl" + val).DataTable({
    data: d.data,
    destroy: true,
    responsive: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    //  scrollY: 500,
    paging: true,
    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: columns,
    scrollY: "auto",
  });
  table120.columns.adjust().draw();
}

function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>").attr("value", value.id).text(value.values)
    );
  });
}

$(document).on("click", ".forward", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  window.location.href = "forwardAplication?d=" + d;
});

$(document).on("click", ".fwd", function (e) {
  let gId = this.getAttribute("data-value");
  //alert(gId);
  var c = JSON.stringify({
    value: gId,
  });
  var d = chkV(c);
  var settings = {
    url: "assignedUserByGriId?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    //console.log(j)
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.created_date != null) {
          current.created_date = format_date(current.created_date);
        }
        return current;
      });
    }
    //if(j.statusCode=="1"){
    assignedUsers(j.data);
    //}
  });
});

function assignedUsers(d) {
  //console.log(d)
  $("#assignedTable2").html("");
  $("#assignedUsersList2").modal("show");

  /*console.log()
  if(d.action=="Does not pertain to this office"){
  	
    columns.push( {
          data: "grievance_id",
          defaultContent: "",
          class: "noExport",
          title: "Action",
          render: function (data, type, row, meta) {
            var btn = '<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>';
            return btn;
          }
         },)
  	
  }*/

  var table121;
  function initializeDataTable() {
    if ($.fn.DataTable.isDataTable("#assignedTable2")) {
      //   table.destroy(); // Destroy existing DataTable instance if it exists
    }

    $(".btn-customBtn").on("click", function () {
      // console.log($(this).val());
      table121.button("." + $(this).val()).trigger();
    });

    table121 = $("#assignedTable2").DataTable({
      data: d,
      destroy: true,
      lengthMenu: [10, 50, 100],
      pageLength: 10,
      scrollX: true,

      //"scrollY": 500,
      //"scrollCollapse": true,
      paging: true,
      //dom: 'Blfrtip',
      //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',

      buttons: [
        {
          extend: "excel",
          title: "JKGOVT",
          messageTop: "The information in this table is copyright to JK GOVT.",
          exportOptions: {
            columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
          },
        },
        {
          extend: "pdf",
          title: "JKGOVT",
          messageBottom:
            "The information in this table is copyright to JK GOVT.",
          pageSize: "A4",
          download: "open",
          customize: function (doc) {
            // Set the page orientation and size
            doc.pageSize = "A4";
            doc.pageOrientation = "landscape";

            // Adjust the content styling
            doc.styles.tableHeader.fontSize = 8;
            doc.styles.tableBodyOdd.fontSize = 8;
            doc.styles.tableBodyEven.fontSize = 8;

            // Center the table content
            var rowCount = doc.content[1].table.body.length;
            for (var i = 0; i < rowCount; i++) {
              var row = doc.content[1].table.body[i];
              for (var j = 0; j < row.length; j++) {
                row[j].alignment = "center";
              }
            }

            // Scale the table width to fit the page
            var totalColumns = doc.content[1].table.body[0].length;
            var columnWidths = [];
            for (var i = 0; i < totalColumns; i++) {
              columnWidths.push("*");
            }
            doc.content[1].table.widths = columnWidths;
          },
          exportOptions: {
            columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
          },
        },
      ],
      responsive: true,
      columns: [
        {
          // data: "Sl. No.",
          title: "S.No.",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
        },

        {
          data: "name",
          defaultContent: "",
          title: "Forwarded To",
        },

        {
          data: "office_name",
          defaultContent: "",
          title: "Office",
        },
        {
          data: "action",
          defaultContent: "",
          title: "Status",
        },
        {
          data: "created_date",
          defaultContent: "",
          title: "Forwarded on",
        },
        {
          data: "pending_since",
          defaultContent: "",
          title: "Pending Since",
        },
        {
          data: "authority",
          defaultContent: "",
          title: "Authority",
        },
        {
          data: "grievance_id",
          defaultContent: "",
          class: "noExport",
          title: "Action",
          render: function (data, type, row, meta) {
            //	console.log(data)
            //var btn;
            if (row.action == "Does not pertain to this office") {
              var btn =
                '<button class="btn btn-sm btn-warning forward" value = "' +
                data +
                '">Forward</button>';
              return btn;
            }
          },
        },

        /* {
          data: "grievance_id",
          defaultContent: "",
          class: "noExport",
          title: "Action",
          render: function (data, type, row, meta) {
            var btn = '<div><button href="#" class="btn btn-danger" data-value = "'+row.assigned_to+' , '+data+'" class="fwd">Delete</a>';
            return btn;
          }
         },*/

        /*	{
              "data": "category_id",
              "defaultContent": "",
              class: "noExport",
            title: "Action",
              "render": function ( data, type, row, meta ) { 
                return '<button type="button" value="'+row.category_id+','+row.assigned_to+'" class="btn btn-danger del-btn">Remove</button>' 
                    } 
            },*/
      ],
    });
    table121.columns.adjust().draw();
  }

  $("#assignedUsersList2").on("shown.bs.modal", function () {
    initializeDataTable();
  });
}

/////appeal////
$(document).on("click", ".processAppealV", function (e) {
  var c = JSON.stringify({
    value: e.target.value,
    uniqid: $("#appD").text(),
  });
  var d = chkV(c);
  var settings = {
    url: "proccApp?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // alert(JSON.stringify(j))
    if (j.statusCode == "1") {
      alert(j.message);
      window.location.href = "home";
    } else {
      alert("Something went wrong.");
      window.location.href = "home";
    }
  });
});

$(document).on("click", ".procAppeal", function (e) {
  var c = JSON.stringify({
    value: $("#remarksAppeal").val(),
    uniqid: $("#appD").text(),
  });
  var d = chkV(c);
  var settings = {
    url: "proccAppReply?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // alert(JSON.stringify(j))
    if (j.statusCode == "1") {
      alert(j.message);
      window.location.href = "home";
    } else {
      alert("Something went wrong.");
      window.location.href = "home";
    }
  });
});

function distDropdown(div) {
  var addDeptV = div;
  $("#dist").html("");
  $("#dist").append('<option value="0">--Select District--</option>');
  if (addDeptV != "0") {
    $("#dist").attr("disabled", false);
    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "districts?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //	console.log(j);
      if (j.statusCode == "1") {
        //  CategoryBydept(addDeptV)
        // depData(addDeptV)
        makeDropdown(dist, j.data);
      }
    });
  } else {
    $("#dist").attr("disabled", true);
    // $("#depName").html('');
    // 	$("#depName").append('<option value="0">Select</option>');
  }
}

$("#inputRegion").change(function () {
  var addDeptV = $("#inputRegion").find(":selected").val();
  distDropdown(addDeptV);
});

// $('input[type="radio"][name="userType"]').change(function () {
$("#userType").change(function () {
    $("#divvvv").hide(); // changes by utkarsh 07-05-2026, division level users ke liye district dropdown hide
    $("#distsss").hide(); // changes by utkarsh 07-05-2026, division level users ke liye district dropdown hide
  //$('#selUsrLevel').change( function(){
  //	var usrType=$('#selUsrLevel').find(":selected").val();

  var gg = $("#typeUser").val();
  console.log(gg);
  if (gg == "DISTRICT") {
    var divVal = $("#userDiv").val();
    $("#inputRegion").html("");
    $("#inputRegion").append(
      "<option value=" + divVal + ">" + divVal + "</option>"
    );
    $("#inputRegion").attr("disabled", true);
    //	$('#inputRegion').prop('selectedIndex', 1);
    //	$('#inputRegion').attr("disabled",true);

    var distVal = $("#userDist").val();
    var arr = distVal.split(",").map((item) => item.replace(/'/g, ""));
    // console.log(arr); // Output: ["Jammu", "Kathua", "Kishtwar"]

    //alert(distVal)
    //$("#dist").html('');
    //$("#dist").append('<option value='+distVal+'>'+distVal+'</option>');
    let select = $("#dist");
    arr.forEach(function (item) {
      let option = new Option(item, item);
      select.append(option);
    });
    //	var dist = $('#dist').find(":selected").val();

    //	var addDeptV = $('#inputRegion').find(":selected").val();
    //distDropdown(addDeptV);
  } else if (gg == "DIVISION") {
    //alert(gg)

    $("#inputRegion").prop("selectedIndex", 1);
    $("#inputRegion").attr("disabled", true);
    var addDeptV = $("#inputRegion").find(":selected").val();
    distDropdown(addDeptV);
  }
  $("#newUserDiv").show();
  var usrType = this.value;
  //alert(usrType)
  if (usrType == "UT" || usrType == "OFFICIAL") {
    $("#distDiv").hide();
    $("#dist").hide(); // changes by utkarsh 07-05-2026, department level users ke liye district dropdown hide
    $("#division").hide(); // changes by utkarsh 07-05-2026, department level users ke liye division dropdown hide
  } else if (usrType == "DISTRICT") {
    $("#distDiv").show();
     $("#divvvv").show(); // changes by utkarsh 07-05-2026, division level users ke liye district dropdown show
    $("#distsss").show();
  } else if (usrType == "DIVISION") {
    $("#distDiv").show();
    $("#distsss").hide();
    $("#distsss").val("");
    $("#divvvv").show();
  }
  getUserType(this.value);
});

// $("input[name='userType']").click(function () {
//$("#userType").change(function () {

function getUserType(selectedUserType) {
  var dep = $("#selDept").find(":selected").val();
  // var val = $(this).val();

  var val = selectedUserType;
  //console.log(val)
  $("#selUsrType").html("");
  $("#selUsrType").append('<option value="0">Select User Type</option>');
  var c = JSON.stringify({
    value: val,
    dep: dep,
  });
  var d = chkV(c);
  var settings = {
    url: "getUserTypr?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(j)
    // alert(JSON.stringify(j))
    if (j.statusCode == "1") {
      makeDropdown(selUsrType, j.data);
    } else {
    }
  });

}
//});

$("#selUsrType").change(function () {
  // var usrLvl = $('input[name="userType"]:checked').val();

  var usrLvl = $("#userType").val();
  var dep = $("#selDept").find(":selected").val();
  var val = $("#selUsrType").find(":selected").val();
  $("#offName").html("");
  $("#offName").append('<option value="0">Select Office</option>');
  var c = JSON.stringify({
    value: val,
    dep: dep,
    usrLvl: usrLvl,
  });
  var d = chkV(c);
  var settings = {
    url: "getOfficeList?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    //console.log(j)
    // alert(JSON.stringify(j))
    if (j.statusCode == "1") {
      makeDropdown(offName, j.data);
    } else {
    }
  });
});

$("#offName").change(function () {
  // var usrLvl = $('input[name="userType"]:checked').val();

  var usrLvl = $("#userType").val();
  var dep = $("#selDept").find(":selected").val();
  //var val = $("#selUsrType").find(":selected").val();
  var val = $("#offName").find(":selected").val();
  $("#designation").html("");
  $("#designation").append('<option value="0">Select designation</option>');
  var c = JSON.stringify({
    value: val,
    dep: dep,
    usrLvl: usrLvl,
  });
  var d = chkV(c);
  var settings = {
    url: "getUserDesignation?d=" + d,
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
    // alert(JSON.stringify(j))
    if (j.statusCode == "1") {
      makeDropdown(designation, j.data);
    } else {
    }
  });
});

// Age Analysis Report - 05 April 2024 - SKY
function ageAreportData() {
  var settings = {
    url: "ageAnalysisReport",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j)

    if (j.statusCode == "1") {
      getAgeAnalysis(j.data);
    } else {
      getAgeAnalysis(0);
    }
  });
}

function getAgeAnalysis(data) {
  // console.log(radioVal);

  $(".btn-customBtn").on("click", function () {
    table139.button("." + $(this).val()).trigger();
  });

  var reprotType = $('.reportType').val();
  var columns = [];
  var headingText = "";
  columns = [
    {
      // data: "Sl. No.",
      title: "S. No.",
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      data: "full_name",
      defaultContent: "",
      title: "Officer Name",
      render: function (data, type, row) {
        // Trim whitespace from the full_name
        return $.trim(data);
      },
    },
    {
      data: "office",
      defaultContent: "",
      title: "Office Name & Designation",
    },
    {
      data: "department",
      defaultContent: "",
      title: "Department",
    },
    {
      data: "user_assigned",
      defaultContent: "",
      title: "User Type",
    },
    {
      data: "usertype_of_assigned_user",
      defaultContent: "",
      title: "User Level",
    },
    {
      data: "d1",
      defaultContent: "",
      title: "0 - 7 Days",
      render: function (data, type, row) {
        var dataAttributes = [
          'data-assignedto="' + chkA(row.assigned_to) + '"',
          'data-caseval="' + chkA("case1") + '"',
        ].join(" ");
        return (
          `<button class="btn btn-sm btn-link action-btn2" ${dataAttributes}>` +
          data +
          "</button>"
        );
      },
    },
    {
      data: "d2",
      defaultContent: "",
      title: "7 - 15 Days",
      render: function (data, type, row) {
        var dataAttributes = [
          'data-assignedto="' + chkA(row.assigned_to) + '"',
          'data-caseval="' + chkA("case2") + '"',
        ].join(" ");
        return (
          `<button class="btn btn-sm btn-link action-btn2" ${dataAttributes}>` +
          data +
          "</button>"
        );
      },
    },
    {
      data: "d3",
      defaultContent: "",
      title: "15 - 28 Days",
      render: function (data, type, row) {
        var dataAttributes = [
          'data-assignedto="' + chkA(row.assigned_to) + '"',
          'data-caseval="' + chkA("case3") + '"',
        ].join(" ");
        return (
          `<button class="btn btn-sm btn-link action-btn2" ${dataAttributes}>` +
          data +
          "</button>"
        );
      },
    },
    {
      data: "d4",
      defaultContent: "",
      title: "28 - 60 Days",
      render: function (data, type, row) {
        var dataAttributes = [
          'data-assignedto="' + chkA(row.assigned_to) + '"',
          'data-caseval="' + chkA("case4") + '"',
        ].join(" ");
        return (
          `<button class="btn btn-sm btn-link action-btn2" ${dataAttributes}>` +
          data +
          "</button>"
        );
      },
    },
    {
      data: "d5",
      defaultContent: "",
      title: "Above 60 Days",
      render: function (data, type, row) {
        var dataAttributes = [
          'data-assignedto="' + chkA(row.assigned_to) + '"',
          'data-caseval="' + chkA("case5") + '"',
        ].join(" ");
        return (
          `<button class="btn btn-sm btn-link action-btn2" ${dataAttributes}>` +
          data +
          "</button>"
        );
      },
    },
  ];
  if (reprotType == 'ageAnalysis') {
    headingText = "User Wise Age Analysis";

  } else {
    headingText = "User Wise Pending Age Analysis";

  }

  // Check if DataTable is already initialized
  if ($.fn.DataTable.isDataTable("#dhltbl")) {
    var table = $("#dhltbl").DataTable();
    table.clear(); // Clear the table data
    table.destroy(); // Destroy the table
    $("#dhltbl").empty(); // Empty the table element
  }

  // Reinitialize DataTable with new column settings
  var table139 = $("#dhltbl").DataTable({
    data: data,
    destroy: true, // Ensure existing DataTable instance is destroyed
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    paging: true,
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)",
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)",
        },
      },
    ],
    columns: columns,
  });

  $("#dhltbl_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table139.search(cleanValue).draw(); // Update DataTable search
  });
  $(".whichWiseHeading").text(headingText);
}
// $(document).on("click", ".action-btn2", function (e) {
//   // console.log(setV($(this).data("grvid")));
//   // console.log($(this).data("assignedto"));

//   var assigned_to = $(this).data("assignedto");
//   var grvID = setV($(this).data("grvid"));
//   if (grvID != "NA") {
//     var c = JSON.stringify({
//       grvID: grvID,
//       assigned_to: assigned_to,
//     });
//     var d = chkV(c);
//     sessionStorage.setItem("actiondata2", d);
//     window.location.href = "dviewAge";
//   } else {
//     alert("No Data Available.");
//   }
// });

$(document).on("click", ".action-btn2", function (e) {
  // console.log(setV($(this).data("assignedto")));
  // console.log(setV($(this).data("caseval")));

  var assigned_to = setV($(this).data("assignedto"));
  var caseVal = setV($(this).data("caseval"));
  if (caseVal != "NA") {
    var c = JSON.stringify({
      value: "userwise",
      caseVal: caseVal,
      assigned_to: assigned_to,
    });
    console.log(c)
    var d = chkV(c);
    sessionStorage.setItem("actiondata2", d);
    window.location.href = "dviewAge";
  } else {
    alert("No Data Available.");
  }
});

function detailedviewAge1(data) {
  // console.log(data);
  // console.log("working");
  var settings = {
    url: "detailedviewAgeApi?d=" + data,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    console.log(j);
    if (j.statusCode == "1" && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
      detailsAgeTbl(j.data);
    } else {
      detailsAgeTbl(0);
    }
  });
}

function detailsAgeTbl(data) {
  // console.log("detailsAgeTbl working..")

  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table123.button("." + $(this).val()).trigger();
  });

  var table123 = $("#AgeDetailedDataTable").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    //scrollY: 500,
    paging: true,
    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: [
      {
        // data: "Sl. No.",
        title: "S.No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "name",
        defaultContent: "",
        title: "Officer Name",
      },
      {
        data: "username",
        defaultContent: "",
        title: "Email",
      },
      {
        data: "total_count",
        defaultContent: "",
        title: "Total Grievances",
        render: function (data, type, row) {
          var dataAttributes = 'data-assignedto="' + row.assigned_to + '" ';
          return (
            '<button class="btn btn-sm btn-link action-btn6" data-toggle="modal" data-target="#staticBackdrop" value = "' +
            row.total_count +
            '" data-status = "Total" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "resolved_count",
        defaultContent: "",
        title: "Resolved Grievances",
        render: function (data, type, row) {
          var dataAttributes = 'data-assignedto="' + row.assigned_to + '" ';
          return (
            '<button class="btn btn-sm btn-link action-btn6" data-toggle="modal" data-target="#staticBackdrop" value = "' +
            row.resolved_count +
            '" data-status = "Resolved" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "pending_count",
        defaultContent: "",
        title: "Pending Grievances",
        render: function (data, type, row) {
          var dataAttributes = 'data-assignedto="' + row.assigned_to + '" ';
          return (
            '<button class="btn btn-sm btn-link action-btn6" data-toggle="modal" data-target="#staticBackdrop" value = "' +
            row.pending_count +
            '" data-status = "Pending" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "rejected_count",
        defaultContent: "",
        title: "Rejected Grievances",
        render: function (data, type, row) {
          var dataAttributes = 'data-assignedto="' + row.assigned_to + '" ';
          return (
            '<button class="btn btn-sm btn-link action-btn6" data-toggle="modal" data-target="#staticBackdrop" value = "' +
            row.rejected_count +
            '" data-status = "Rejected" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "appealed_count",
        defaultContent: "",
        title: "Appealed Grievances",
        render: function (data, type, row) {
          var dataAttributes = 'data-assignedto="' + row.assigned_to + '" ';
          return (
            '<button class="btn btn-sm btn-link action-btn6" data-toggle="modal" data-target="#staticBackdrop" value = "' +
            row.appealed_count +
            '" data-status = "Appealed" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
    ],
  });
  $("#AgeDetailedDataTable_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table123.search(cleanValue).draw(); // Update DataTable search
  });
}

$(document).on("click", ".action-btn6", function (e) {
  // console.log($(this).data("grvid"))
  var value = e.target.value;
  var status = $(this).data("status");
  var assignedto = $(this).data("assignedto");
  // console.log(status);
  // console.log(assignedto);
  if (value > 0) {
    var c = JSON.stringify({
      assignedto: assignedto,
      action: status,
    });
    var d = chkV(c);
    var settings = {
      url: "ageStatWiseList?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("Data to be sent is ", c);
    $.ajax(settings).done(function (j) {
      j = JSON.parse(setV(j));
      console.log(j);

      if (j.statusCode == "1" && j.data.length > 0) {
        j.data = j.data.map((current) => {
          if (current.createddate != null) {
            current.createddate = format_date(current.createddate);
          }
          return current;
        });

        $(".btn-customBtn").on("click", function () {
          // console.log($(this).val());
          table124.button("." + $(this).val()).trigger();
        });

        var table124 = $("#ageStatWiseReport").DataTable({
          data: j.data,
          destroy: true,
          lengthMenu: [10, 50, 100],
          pageLength: 10,
          scrollX: true,
          //scrollY: 500,
          paging: true,
          rowCallback: function (row, data) {

            // Check the value of the 'application' column and apply the corresponding class
            const color = {
              Forwarded: "web-application-forwarded",
              Resolved: "web-application-resolved",
              Acknowledged: "web-application-acknowledged",
              "Proposed Disposed": "web-application-proposed-disposed",
              Rejected: "web-application-rejected",
              Appealed: "web-application-appealed",
              "Under Process": "web-application-under-proccess",
              Pending: "web-application-pending",
              dnpToOffice: "web-application-dnptooffice",
            };

            const customClass = color[data.status]
              ? color[data.status]
              : "web-application-row";

            $(row).addClass(customClass);
          },
          //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
          buttons: [
            {
              extend: "excel",
              title: "JKGOVT",
              messageTop:
                "The information in this table is copyright to JK GOVT.",
              exportOptions: {
                columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
              },
            },
            {
              extend: "pdf",
              title: "JKGOVT",
              messageBottom:
                "The information in this table is copyright to JK GOVT.",
              pageSize: "A4",
              download: "open",
              customize: function (doc) {
                // Set the page orientation and size
                doc.pageSize = "A4";
                doc.pageOrientation = "landscape";

                // Adjust the content styling
                doc.styles.tableHeader.fontSize = 8;
                doc.styles.tableBodyOdd.fontSize = 8;
                doc.styles.tableBodyEven.fontSize = 8;

                // Center the table content
                var rowCount = doc.content[1].table.body.length;
                for (var i = 0; i < rowCount; i++) {
                  var row = doc.content[1].table.body[i];
                  for (var j = 0; j < row.length; j++) {
                    row[j].alignment = "center";
                  }
                }

                // Scale the table width to fit the page
                var totalColumns = doc.content[1].table.body[0].length;
                var columnWidths = [];
                for (var i = 0; i < totalColumns; i++) {
                  columnWidths.push("*");
                }
                doc.content[1].table.widths = columnWidths;
              },
              exportOptions: {
                columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
              },
            },
          ],
          columns: [
            {
              title: "S.No.",
              render: function (data, type, row, meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
              },
            },
            {
              data: "uniqid",
              defaultContent: "",
              title: "Grievance ID",
            },
            {
              data: "department",
              defaultContent: "",
              title: "Department",
            },
            {
              data: "category",
              defaultContent: "",
              title: "Category",
            },
            {
              data: "name",
              defaultContent: "",
              title: "Submitted By",
            },
            {
              data: "createddate",
              defaultContent: "",
              title: "Date",
            },
            {
              data: "action",
              defaultContent: "",
              title: "Status",
              render: function (data, type, row, meta) {
                if (data === "Pending") {
                  return (
                    '<div class="btn btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
                    data +
                    "</div>"
                  );
                } else if (data === "Acknowledged") {
                  return (
                    '<div class="btn btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
                    data +
                    "</div>"
                  );
                } else if (data === "Under Process") {
                  return (
                    '<div class="btn btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
                    data +
                    "</div>"
                  );
                } else if (data === "Rejected") {
                  return (
                    '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
                    data +
                    "</div>"
                  );
                } else if (data === "Resolved") {
                  return (
                    '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
                    data +
                    "</div>"
                  );
                } else if (data == "dnpToOffice") {
                  var st = "Does not pertain";
                  return (
                    '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
                    st +
                    "</div>"
                  );
                } else if (data === "Appealed") {
                  return (
                    '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
                    data +
                    "</div>"
                  );
                } else if (data === "Forwarded To CPGRAM") {
                  return (
                    '<div class="btn btn-sm yr-mw " style="background-color: #e7e7e7"><i class="bi bi-exclamation-octagon"></i> ' +
                    data +
                    "</div>"
                  );
                } else if (data === "Forwarded") {
                  return (
                    '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
                    data +
                    "</div>"
                  );
                } else {
                  return (
                    '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
                    data +
                    "</div>"
                  );
                }
              },
            },

            {
              data: "uniqid",
              defaultContent: "",
              title: "History",
              render: function (data, type, row, meta) {
                var btn =
                  '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vHis" title="History" value = "' +
                  data +
                  '"></button>';

                return btn + "</div>";
              },
            },
          ],

        });

        // For Modal
        $("#staticBackdrop").modal("show");
        // readjusting the column / row width of the table to fit in the modal window
        $("#staticBackdrop").one("shown.bs.modal", function () {
          $(".ageStatusWiseDiv").removeClass("visually-hidden");
          $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
        });
      }
    });
  } else {
    alert("No Data Available.");
  }
});

// Age Analysis Report - 05 April 2024 - SKY

// User Wise Status Report - 05 April 2024 - SKY

function uWRptData() {
  var settings = {
    url: "uWRptDataApi",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    console.log(j)

    if (j.statusCode == "1") {
      getUserWiseReport(j.data);
    } else {
      getUserWiseReport(0);
    }
  });
}

function getUserWiseReport(data) {
  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table125.button("." + $(this).val()).trigger();
  });

  var table125 = $("#dhltbl").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    //scrollY: 500,
    paging: true,
    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: [
      {
        // data: "Sl. No.",
        title: "S.No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "full_name",
        defaultContent: "",
        title: "Officer Name",
      },
      {
        data: "office",
        defaultContent: "",
        title: "Office Name & Designation",
      },
      // {
      //   data: "assigned_to",
      //   defaultContent: "",
      //   title: "Email",
      // },
      {
        data: "total_count",
        defaultContent: "",
        title: "Total Grievances",
        render: function (data, type, row) {
          var dataAttributes =
            row.total_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.total_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Total" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "resolved_count",
        defaultContent: "",
        title: "Resolved Grievances",
        render: function (data, type, row) {
          var dataAttributes =
            row.resolved_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.resolved_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Resolved" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "pending_count",
        defaultContent: "",
        title: "Pending Grievances",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.pending_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Pending" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "rejected_count",
        defaultContent: "",
        title: "Rejected Grievances",
        render: function (data, type, row) {
          var dataAttributes =
            row.rejected_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.rejected_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Rejected" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      {
        data: "appealed_count",
        defaultContent: "",
        title: "Appealed Grievances",
        render: function (data, type, row) {
          var dataAttributes =
            row.appealed_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.appealed_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Appealed" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
    ],
  });

  $("#dhltbl_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table125.search(cleanValue).draw(); // Update DataTable search
  });
}

// $(document).on("click", ".action-btn3", function (e) {
//   // console.log($(this).data("grvid"))
//   var status = $(this).data("status");
//   var grvID = $(this).data("grvid");
//   // console.log(grvID);
//   if (setV(grvID) != "NA") {
//     var c = JSON.stringify({
//       status: status,
//       grvID: setV(grvID),
//     });
//     var d = chkV(c);
//     sessionStorage.setItem("data", d);
//     window.location.href = "detailedviewUW";
//   } else {
//     alert("No Data Available.");
//   }
// });
function detailedViewForUW(data) {
  // console.log(data);
  // console.log("working");
  var settings = {
    url: "detailedviewUWApi?d=" + data,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j);
    if (j.statusCode == "1" && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
      detailsUserWiseTbl(j.data);
    } else {
      detailsUserWiseTbl(0);
    }
  });
}
function detailsUserWiseTbl(data) {
  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table126.button("." + $(this).val()).trigger();
  });

  var table126 = $("#UWdetailedDataTable").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    //scrollY: 500,
    paging: true,
    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: [
      {
        title: "S.No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "uniqid",
        defaultContent: "",
        title: "Grievance ID",
      },
      {
        data: "department",
        defaultContent: "",
        title: "Department",
      },
      {
        data: "category",
        defaultContent: "",
        title: "Category",
      },
      {
        data: "name",
        defaultContent: "",
        title: "Submitted By",
      },
      {
        data: "createddate",
        defaultContent: "",
        title: "Date",
      },
      {
        data: "status",
        defaultContent: "",
        title: "Status",
        render: function (data, type, row, meta) {
          if (data === "Pending") {
            return (
              '<div class="btn btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
              data +
              "</div>"
            );
          } else if (data === "Acknowledged") {
            return (
              '<div class="btn btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
              data +
              "</div>"
            );
          } else if (data === "Under Process") {
            return (
              '<div class="btn btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
              data +
              "</div>"
            );
          } else if (data === "Rejected") {
            return (
              '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
              data +
              "</div>"
            );
          } else if (data === "Resolved") {
            return (
              '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
              data +
              "</div>"
            );
          } else {
            var st = "Does not pertain to this department";
            return (
              '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
              st +
              "</div>"
            );
          }
        },
      },

      {
        data: "uniqid",
        defaultContent: "",
        title: "History",
        render: function (data, type, row, meta) {
          var btn =
            '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vHis" title="History" value = "' +
            data +
            '"></button>';

          return btn + "</div>";
        },
      },
    ],
  });
}
// USer Wise

$(document).on("click", ".griDetails", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  // window.location.href = "viewApp?d=" + d;
  window.open("viewApp?d=" + d, "_blank");
});

$(document).on("click", ".vDetails", function (e) {
  $(".descHis").html("");
  $(".descHisDoc").html("");
  $(".descHisDocCitz").html("");

  var appflag = $(this).data("appflag");

  var c = JSON.stringify({
    radioVal: appflag,
    gId: e.target.value,
  });
  let d = chkV(c);
  // window.location.href = "grievanceDatail?d=" + d;
  window.open("grievanceDatail?d=" + d, "_blank");
});

// When the toggle switch is clicked - 09/09/2024 - SKY
var globalToggleValue = false;

$("#toggleEmail").on("change", function () {
  if ($(this).is(":checked")) {
    globalToggleValue = true;
    $("#newEmail").removeClass("d-none");
    $("#userEmail").addClass("d-none");
  } else {
    globalToggleValue = false;
    $("#newEmail").addClass("d-none");
    $("#userEmail").removeClass("d-none");
  }
});

$("#updateUsrDtl").click(function () {
  var isValid = true;
  if ($("#userFirstName").val() == "") {
    alert("First Name is mandatory");
    isValid = false;
  } else if ($("#userLastName").val() == "") {
    alert("Last Name is mandatory");
    isValid = false;
  } else if (
    !isMobile($("#userMobileNo").val()) ||
    $("#userMobileNo").val() == ""
  ) {
    alert(
      "Mobile Number is mandatory and please provide a valid mobile number."
    );
    isValid = false;
  } else if ($("#usrpwd").val() == "") {
    alert("Password is mandatory");
    isValid = false;
  }

  if (globalToggleValue === true) {
    var newEmailVal = $("#newEmail").val();
    if (newEmailVal == "" || !isEmail(newEmailVal)) {
      alert("Please provide a valid email if updating the email address.");
      isValid = false;
    }
  }
  if (isValid) {
    var result = confirm("Are you sure you want to proceed?");
    if (result) {
      var formString =
        "userFirstName=" +
        $("#userFirstName").val() +
        "&userMidname=" +
        $("#userMidname").val() +
        "&userLastName=" +
        $("#userLastName").val() +
        "&userMobileNo=" +
        $("#userMobileNo").val() +
        "&transfereePassword=" +
        $("#usrpwd").val() +
        "&userEmail=" +
        $("#userEmail").val() +
         "&userDesignation=" + ($("#userdesignation").find(":selected").val() !== "0" ? $("#userdesignation").find(":selected").val() : ""); // Add user designation to the form string 01-04-2026
      // If the toggle is on, add the new email to the formString
      if (globalToggleValue === true) {
        formString += "&newEmail=" + $("#newEmail").val();
      }
      console.log("Form Data: ", formString);
      var d = chkV(formString);
      var settings = {
        url: "updateUserDetails?d=" + d,
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
          alert("Details updated successfully!!");
          window.location.reload();
        } else if (j.statusCode == "3") {
          alert("Details updated successfully!!");
          window.location.href = "getUserList";
        } else if (j.statusCode == "4") {
          alert(
            "Details updated successfully! However email id not updated as it already exists!"
          );
          window.location.reload();
        } else {
          alert("Something went wrong. Try again later.");
          window.location.reload();
        }
      });
    }
  }
});

// JKIGRAMS

function jkiGramForDepartment() {
  var columns = [
    {
      title: "S. No.",
      render: function (data, type, row, meta) {
        var pageInfo = $("#YRreport010").DataTable().page.info();
        return meta.row + 1 + pageInfo.page * pageInfo.length;
      },
    },
    {
      data: "reference_id",
      defaultContent: "",
      title: "Reference ID",
    },
    {
      data: "grievance_type",
      defaultContent: "",
      title: "Category",
    },
    {
      data: "application_date",
      defaultContent: "",
      title: "Submitted On",
      render: function (data, type, row, meta) {
        if (data) {
          // Convert the date string to a Date object
          var date = new Date(data);
          // Format the date as YYYY-MM-DD
          var formattedDate = date.toISOString().split("T")[0];
          return formattedDate;
        }
        return "";
      },
    },
    {
      data: "applicant_name",
      defaultContent: "",
      title: "Applicant Name",
    },
    {
      data: "gender",
      defaultContent: "",
      title: "Applicant Gender",
    },
    {
      data: "emailid",
      defaultContent: "",
      title: "Applicant Email",
    },
    {
      data: "mobileno",
      defaultContent: "",
      title: "Mobile No",
    },
    {
      data: "constituency",
      defaultContent: "",
      title: "Constituency",
    },
    {
      data: "cpgrams_regno",
      defaultContent: "",
      title: "CPGRAMS Reg No",
    },

    {
      data: "action",
      defaultContent: "",
      title: "Status",
      render: function (data, type, row, meta) {
        if (data === "Pending") {
          var text = "";
          if (row.reminder == "1") {
            text = "Kindly take action";
          } else {
            text = "";
          }
          return (
            '<div class="btn btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
            data +
            "</div><span class='text-danger d-flex blink'>" +
            text +
            "</span>"
          );
        } else if (data === "Acknowledged") {
          return (
            '<div class="btn btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Under Process") {
          return (
            '<div class="btn btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Rejected") {
          return (
            '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Resolved") {
          return (
            '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
            data +
            "</div>"
          );
        } else if (data == "dnpToOffice") {
          var st = "Does not pertain";
          return (
            '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
            st +
            "</div>"
          );
        } else if (data === "Appealed") {
          return (
            '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Forwarded To CPGRAM") {
          return (
            '<div class="btn btn-sm yr-mw " style="background-color: #e7e7e7"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Forwarded") {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        }
      },
    },
    {
      data: "pending_since",
      defaultContent: "",
      title: "Pending Since",
      render: function (data, type, row, meta) {
        if (row.action == "Pending") {
          return data;
        } else {
          return "";
        }
      },
    },

    {
      data: "reference_id",
      defaultContent: "",
      title: "Forwarded To",
      render: function (data, type, row, meta) {
        if (row.action == "Forwarded") {
          var btn =
            '<div><a href="#" data-value = "' +
            data +
            '" class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
          return btn;
        } else {
          return "";
        }
      },
    },

    {
      data: "reference_id",
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
          '<li class=""><button class="btn btn-sm vDetails" value = "' +
          data +
          '" data-appflag = "JKIGRAMS">Grievance Details</button></li></button></li>';

        if (
          row.action != "Resolved" &&
          row.action != "Rejected" &&
          row.action != "Appealed" &&
          row.action != "dnpToOffice" &&
          row.action != "Closed"
        ) {
          btn =
            btn +
            '<li class=""><button class="btn btn-sm grevPJKI" value = "' +
            data +
            '">Process</button></li>' +
            '<li class=""><button class="btn btn-sm forward" value = "' +
            data +
            '">Forward</button></li></button></li>';
        } else if (row.action == "DoesNotPertain") {
          btn =
            btn +
            '<li><button class="btn btn-sm grevPJKI" value = "' +
            data +
            '">Process</button></li>' +
            '<li><button class="btn btn-sm forward" value = "' +
            data +
            '">Forward</button></li>';
        }

        /*else if (btnVal == "DoesNotPertain"){
           if(row.status == "Does not pertain to this division" && row.doesnotpertain_status == "catMisMatch"){
           btn = btn + '<button class="btn btn-sm btn-danger grevPJKI" value = "' + data + '">Edit</button>';
           return btn;
           }
         }*/
        return btn + "</ul></div>";
      },
    },
  ];

  $(".btn-customBtn").on("click", function () {
    // //console.log($(this).val());
    table161.button("." + $(this).val()).trigger();
  });
  var table161 = $("#YRreport010").DataTable({
    destroy: true,
    processing: true,
    searching: true,
    scrollX: true,
    dom: "lBfrtip",
    lengthMenu: [
      [10, 25, 50, 100, 500, 1000, 2000, 5000, -1],
      [10, 25, 50, 100, 500, 1000, 2000, 5000, "All"],
    ],
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    serverSide: true,
    ajax: {
      url: "jkIgramsforDeptApi",
      type: "GET",
    },
    columns: columns,
    columnDefs: [
      {
        searchable: false,
        orderable: false,
        targets: 0,
      },
      { width: "200px", targets: 3 },
    ],
    order: [[1, "asc"]],
  });
}

// GRV Processing for JKIGRAMS - 30 Agusut 2024 - SKY
$(document).on("click", ".grevPJKI", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  var settings = {
    url: "grievanceAcknowledgedJKI?d=" + d,
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
    // if (j.statusCode[0] == 1) {
    //   alert("Pulled Successfully.");
    // } else {
    //   alert("Something went wrong");
    // }
    window.location.href = "jkiProcessGrievance?d=" + d;
  });
});

// $(document).on("click", ".grievancepdf", function () {
//   // Temporarily hide elements you don't want in the PDF
//   $(".no-print").hide();

//   var contentdiv = $(this).attr("data-value");
//   var element = $("#" + contentdiv);

//   // Debugging: Check if the element is selected correctly
//   //console.log('Selected element:', element);
//   //console.log('Element content:', element.html());

//   if (element.length === 0) {
//     console.error("Element not found with ID:", contentdiv);
//     $(".no-print").show();
//     return;
//   }

//   // Set font size dynamically
//   // element.css('font-size', '12px'); // Set the desired font size

//   // Ensure the table starts on a new page
//   $("#grvDetailsTblComm").css("page-break-before", "always");

//   // Ensure any dynamic content is fully rendered before generating the PDF
//   setTimeout(function () {
//     var opt = {
//       margin: 0.2, // Reduce margins to improve PDF clarity
//       filename: "Grievance_Details.pdf", // Set the filename with the title detail
//       image: { type: "jpeg", quality: 2.0 }, // Set image quality to maximum
//       html2canvas: { scale: 3 }, // Increase scale for better resolution
//       jsPDF: { unit: "in", format: "A4", orientation: "landscape" },
//       pageBreak: { mode: ["css", "legacy"] }, // Use CSS rules to manage page breaks
//     };

//     // Generate the PDF
//     html2pdf()
//       .from(element[0])
//       .set(opt)
//       .toPdf()
//       .get("pdf")
//       .then(function (pdf) {
//         // Set the metadata
//         pdf.setProperties({
//           title: "Grievance Details",
//           subject: "Grievance Report",
//           author: "Your Name",
//           keywords: "grievance, report, details",
//         });
//       })
//       .save()
//       .then(function () {
//         // Show the elements again after the PDF is generated
//         $(".no-print").show();
//       });
//   }, 1000); // Adjust the timeout duration as needed
// });

//   $(".filterData").click(function(e){
// 	var dataValue = $(this).attr('data-value');
// 	filterApi(dataValue)
// 	//alert(dataValue);
//    // return false;

//   })

function filterApi(btnVal) {
  // alert(usrFlg);

  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "filterApi?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    console.log(JSON.stringify(j));
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        // console.log(current)
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });

      makeDataTable(j, "Home");
    }
  });
}
// ALLOWING CLARIFICATION MESSAGE ONLY
$("#clarificationMessage").on("keyup", function () {
  this.value = this.value.replace(/[^a-zA-Z\s.,\-\/()\:;]|(\s{2,})/g, "");
});
// ASK CLARIFICATION FROM USER
$("#askClarificationBtn").on("click", function () {
  const message = $("#clarificationMessage").val();
  const grvId = this.value;
  if (message !== undefined && message.trim().length === 0) {
    alert("Please type your message.");
    return;
  }
  if (grvId !== undefined && grvId.trim().length === 0) {
    alert("Grievance ID not available.");
    return;
  }
  const data = {
    message: message,
    grievanceid: grvId,
  };

  let d = chkV(JSON.stringify(data));
  let settings = {
    url: "askClarification?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    console.log(JSON.stringify(j));
    if (j.statusCode != 0) {
      window.location.reload();
    }
  });
});

var localClickVal = "Appeal";

function makeDataTable2(d, val) {
  d = Array(d.List[0]);
  var columns = [
    {
      // data: "Sl. No.",
      title: "S.No.",
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      // data: d[0].grievance_id,
      defaultContent: "",
      title: "Grievance ID",
      render: function (data, type, row, meta) {
        return d[0].grievance_id;
      },
    },
    {
      // data: d[0].appeal_id,
      defaultContent: "",
      title: "Appeal ID",
      render: function (data, type, row, meta) {
        return d[0].appeal_id;
      },
    },
    {
      // data: d[0].created_by,
      defaultContent: "",
      title: "Created By",
      render: function (data, type, row, meta) {
        return d[0].created_by;
      },
    },
    {
      // data: d[0].created_date,
      defaultContent: "",
      title: "Created Date",
      render: function (data, type, row, meta) {
        return d[0].created_date;
      },
    },
    {
      // data: d[0].created_date,
      defaultContent: "",
      title: "District",
      render: function (data, type, row, meta) {
        return d[0].district;
      },
    },
    {
      // data: d[0].created_date,
      defaultContent: "",
      title: "Assigned to",
      render: function (data, type, row, meta) {
        return d[0].assigned_to;
      },
    },
    {
      // data: "View",
      defaultContent: "",
      title: "Action",
      render: function (data, type, row, meta) {
        return (
          '<button class="btn btn-info btn-sm yr-mw" id="' +
          d[0].appeal_id +
          '" onclick="thisAppeal(this)"><i class="bi bi-exclamation-circle"></i> ' +
          "View" +
          "</button>"
        );
      },
    },
  ];

  var table120 = $("#all_tbl" + val).DataTable({
    data: d,
    destroy: true,
    responsive: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    paging: true,
    columns: columns,
    scrollY: "auto",
  });
  table120.columns.adjust().draw();

}

function thisAppeal(e) {
  let c = e.id;
  let d = chkV(c);
  window.location.href = "showAppealDetails?d=" + d;
}

$(document).on("click", ".appealData", function () {
  // var clickedValue = $(this).attr('data-value');
  var settings = {
    url: "appealList",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };

  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    $("#appealDiv").html("");
    $("#appealDiv").append(
      '<table class="table table-bordered table-striped" id="all_tblAppeal" style="width: 100%;"></table>'
    );
    $("#homeDiv").hide();
    $("#appealDiv").show();
    makeDataTable2(j, "Appeal");
  });
  // localClickVal = clickedValue;
  // table120.ajax.reload();
});

function filterApi(btnVal) {
  // alert(usrFlg);

  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "filterApi?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    console.log(JSON.stringify(j));
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        // console.log(current)
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
      $("#homeDiv").show();
      $("#appealDiv").hide();
      makeDataTable(j, "Home");
    }
  });
}


// $(document).on("click", "#downappealdoc", function (e) {
//   var path = e.target.value;
//   //console.log(path)
//   window.location.href = "download1?fileName=" + encodeURIComponent(path);
//   //$("#doccc2").attr("href", 'download1?fileName=' + encodeURIComponent(path));
// });


function acceptAppeal(e) {
  var c = e.id
  let d = chkV(c);
  var settings = {
    url: "acceptAction?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    // if (j.statusCode[0] == 1) {
    //   alert("Pulled Successfully.");
    // } else {
    // }
    alert("Appeal Accepted Succesfully");
    let accbtn = document.getElementById("accbtn");
    accbtn.style.display = "none";
  });
}

function rejectAppeal(e) {
  var c = e.id
  let d = chkV(c);
  var settings = {
    url: "rejectAction?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    // if (j.statusCode[0] == 1) {
    //   alert("Pulled Successfully.");
    // } else {
    // }
    alert("Appeal Rejected Succesfully");

    let accbtn = document.getElementById("accbtn");
    accbtn.style.display = "none";
  });
}

// Pull Back New implementation - 20 Jan 2025 - SKY - start
$(document).on("click", "#pbInitiated", function (e) {
  let gId = this.getAttribute("data-value");
  let applicantName = this.getAttribute("data-applicant");
  let remarks = $(".stRemarks").val();
  console.log(gId)
  var c = JSON.stringify({
    value: gId,
    applicantName: applicantName,
    remarks: remarks
  });
  var d = chkV(c);
  var settings = {
    url: "pullBackNewV2?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    console.log(JSON.parse(setV(j)))
    var j = JSON.parse(setV(j))
    if (j.statusCode == "1") {
      window.location.reload();
    }
  });
});
// Pull Back New implementation - 20 Jan 2025 - SKY - end

// Server Side datatable - start
var globalUserType;
var globalAllData;
function serverSideDeptDT() {
  var usdd = $("#usrVV").val();
  //console.log("usdd :: " + usdd);

  // Filter table on radio button click
  //  Default value is All i.e is home
  var localFilterVal = "home";
  $(document).on("click", ".data-search", function () {
    var filteredValue = $(this).val();
    //console.log("filteredValue :: " + filteredValue);
    // override localFilterVal based on the click event
    localFilterVal = filteredValue;
    table136.ajax.reload();
  });

  //  Filter table on clickable dashbaord tabs
  // Defualt Value is All i.e is Total
  var localClickVal = "Total";
  $(document).on("click", ".filterData", function () {
    var clickedValue = $(this).attr("data-value");
    // console.log("clickedValue :: " + clickedValue);
    // override localFilterVal based on the click event
    localClickVal = clickedValue;
    table136.ajax.reload();
  });

  //office filter
  var officeFilterVal = "0";
  $(document).on("change", "#officeSelect", function (e) {
    var filteredValue = e.target.value;
    officeFilterVal = filteredValue;
    // console.log("fdFilterVal : " + fdFilterVal)
    table136.ajax.reload();
  });


  // department filter
  var deptFilterVal = "0";
  $("#deptFilter").change(function () {
    var filteredValue = $(this).val();
    deptFilterVal = filteredValue;
    // console.log("deptFilterVal : " + deptFilterVal)
    table136.ajax.reload();
  })

  // category filter
  var catgFilterVal = "0";
  $("#categFilter").change(function () {
    var filteredValue = $(this).val();
    catgFilterVal = filteredValue;
    // console.log("catgFilterVal : " + catgFilterVal)
    table136.ajax.reload();
  })

  // from / on date filter
  var fdFilterVal = "0";
  $(document).on("change", "#dateFrom", function (e) {
    var filteredValue = e.target.value;
    fdFilterVal = filteredValue;
    // console.log("fdFilterVal : " + fdFilterVal)
    table136.ajax.reload();
  });

  // to date filter
  var tdFilterVal = "0";
  $(document).on("change", "#dateTo", function (e) {
    var filteredValue = e.target.value;
    tdFilterVal = filteredValue;
    // console.log("tdFilterVal : " + tdFilterVal)
    table136.ajax.reload();
  });

  // district filter
  var districtFilterVal = "0";
  $("#districtFilter").change(function () {
    var filteredValue = $(this).val();
    districtFilterVal = filteredValue;
    // console.log("districtFilterVal : " + districtFilterVal)
    table136.ajax.reload();
  })


  var column = [
    {
      data: "uniqid",
      defaultContent: "",
      class: "noExport",
      title: "Action",
      render: function (data, type, row, meta) {
        //	var btn="";

        // console.log(row.action+"  "+row.authority+"  "+data)
        var btn =
          '<div class="dropdown">' +
          '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
          '<i class="bi bi-three-dots"></i>' +
          "</button>" +
          '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
          '<li class="border-bottom border-success"><button class="btn btn-sm vDetails" value = "' +
          data +
          '"  data-appflag = "JKSAMADHAN">Grievance Details</button></li>';

        //   var btn ='<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +data + '">History</button>';
        if (
          ["Pending", "Under Process", "Acknowledged"].includes(row.action) &&
          ["", undefined].includes(row.finalstatus)
        ) {
          //  btn = btn +'<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>'+
          //  '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
          btn =
            btn +
            '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' +
            data +
            '">Process</button></li>';

          if (
            ["Pending", "Under Process", "Acknowledged"].includes(row.action) &&
            row.authority == "Process"
          ) {
            //console.log(row.action+"  "+row.authority+"  "+data)
            btn =
              btn +
              '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' +
              data +
              '">Forward</button></li>';
          }
          //+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
        } else if (row.action == "Does not pertain to this office") {
          /*  btn = btn +'<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>'+
                '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';*/

          btn = btn
            + '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
          //	+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
        } else if (row.action == "Forwarded" && row.finalstatus == "Recieved") {
          btn = btn
            + '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
            + '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Send Back</button></li>';
          //	+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
        } else if (row.action == "Forwarded" && row.finalstatus == "Recieved") {
          btn =
            btn +
            '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' +
            data +
            '">Process</button></li>';
        } else if (
          ["Forwarded", "Under Process"].includes(row.action) &&
          row.finalstatus == "dnpToOffice"
        ) {
          btn =
            btn +
            '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' +
            data +
            '">Process</button></li>' +
            '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' +
            data +
            '">Forward</button></li>';
        }
        // else if(["Appealed"].includes(row.action) && (["","Final Disposed"].includes(row.finalstatus))){

        //   btn =
        //   btn +
        //   '<li class=""><button class="btn btn-sm appP" value = "' +
        //   data +
        //   '">Process Appeal</button></li>' ;
        // }

        return btn + "</div>";
      },
    },
    {
      // data: "Sl. No.",
      title: "S.No.",
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      data: "uniqid",
      defaultContent: "",
      title: "Grievance ID",
      render: function (data, type, row, meta) {
        // First, create the button with the grievance ID
        let button = '<span class = "btn btn-link text-decoration-none">' + data + '</span> <br><br>';
        // Append application mode if available
        button += (row.application === "webapp" || row.application === "mobileapp")
          ? `<span class="d-block width-fit fw-bold">Mode : ${row.application.replace('app', '')}</span>`
          : "";

        // Append privilege assigned if available
        let privilegeD = null;
        privilegeD = row.days_assigned === 28 ? "Normal" : "Urgent";
        button += (row.days_assigned === 28 || row.days_assigned === 7)
          ? `<span class="d-block width-fit fw-bold">Privilege Assigned : <span class = "text-${privilegeD === 'Normal' ? 'success' : 'danger'}"> ${privilegeD} </span> </span>`
          : "";

        // Append authority assigned
        button += (row.authority === "Remark" || row.authority === "Process")
          ? `<span class="d-block width-fit fw-bold">Authority Assigned : <span class = "text-${row.authority === 'Remark' ? 'success' : 'danger'}"> ${row.authority} </span> </span>`
          : "";

        // Append feedback if available
        // button += (row.feedbackflag === 1)
        //   ? `<span class="d-block width-fit fw-bold">FeedBack : <span class = "text-${row.privilege_assigned === 'Normal' ? 'success' : 'danger'}"> ${row.privilege_assigned} </span> </span>`
        //   : "";


        return button;
      },
    },
    {
      data: "category",
      defaultContent: "",
      title: "Main Category",
    },
    {
      data: "sub_category",
      defaultContent: "",
      title: "Sub Category",
    },
    {
      data: "name",
      defaultContent: "",
      title: "Submitted By",
    },
    {
      data: "createddate",
      defaultContent: "",
      title: "Submitted On",
    },
    {
      data: "action",
      defaultContent: "",
      title: "Status",
      render: function (data, type, row, meta) {
        //			if (row.final_status != "Recieved" || row.final_status!="Proposed Disposed" || row.final_status!="Final Disposed"){

        //	console.log(row.finalstatus+"  "+row.uniqid)
        //console.log(row.finalstatus+"  "+data+"  "+row.uniqid)

        if (data === "Pending") {
          var text = "";
          if (row.reminder == "1") {
            text = "Kindly take action";
          } else {
            text = "";
          }

          return (
            '<div class="btn pe-none btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
            data +
            "</div> <span class='text-danger blink'>" +
            text +
            "</span>"
          );
        } else if (data === "Acknowledged") {
          return (
            '<div class="btn pe-none btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Under Process") {
          return (
            '<div class="btn pe-none btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
            data +
            "</div>"
          );
        } else if (
          data === "Rejected" &&
          (row.finalstatus === undefined ||
            row.finalstatus === "Proposed Disposed")
        ) {
          return (
            '<div class="btn pe-none btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (
          data === "Resolved" &&
          (row.finalstatus === undefined ||
            row.finalstatus === "Proposed Disposed")
        ) {
          return (
            '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
            data +
            "</div>"
          );
        }

        // else if (row.finalstatus=='Proposed Disposed') {
        //     return (
        //       '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
        //       data +
        //       "</div>"
        //     );
        // }
        else if (
          (["Resolved", "Rejected"].includes(data)) &&
          ["Final Disposed", ""].includes(row.finalstatus)) {
          return (
            '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
            "Final Disposed" +
            "</div>"
          );
        } else if (
          !["Does not pertain to this office", "dnpToOffice"].includes(data) &&
          row.finalstatus === "Recieved"
        ) {
          return '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i>Proposed Disposed</div>';
        } else if (
          data === "Appealed" &&
          (row.finalstatus === undefined ||
            row.finalstatus === "Proposed Disposed" ||
            row.finalstatus === "Final Disposed" ||
            row.finalstatus === "Recieved" ||
            row.finalstatus === "")
        ) {
          return (
            '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (
          ["Does not pertain to this office", "dnpToOffice"].includes(data) ||
          row.finalstatus == "dnpToOffice"
        ) {
          var st = "Does Not Pertain";
          var dd;
          if (row.finalstatus == "dnpToOffice") {
            dd =
              '<div class="btn pe-none btn-dangar btn-sm yr-mw " style="background-color:#fffc33"><i class="bi bi-exclamation-octagon"></i> ' +
              st +
              "</div>";
          } else {
            dd =
              '<div class="btn pe-none btn-dangar btn-sm yr-mw " style="background-color:#33daff" ><i class="bi bi-exclamation-octagon"></i> ' +
              st +
              "</div>";
          }
          return dd;
        } else if (
          data === "Forwarded" &&
          [undefined, ""].includes(row.finalstatus)
        ) {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (
          data === "Remark Added" &&
          row.finalstatus === "Proposed Disposed"
        ) {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #3399FF"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        }
        // }else{
        // 	if (row.final_status == "Recieved" && row.final_status=="Proposed Disposed") {
        // 	  return (
        // 		'<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>Proposed Disposed</div>'
        // 	  );
        // 	}
        // 	else if(row.final_status=="Final Disposed"){
        // 	  return  '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>'+row.final_status+'</div>'

        // 	}

        //   }
      },
    },

    {
      data: "fwdbyname",
      defaultContent: "",
      title: "Forwarded By",
    },

    {
      data: "created_date",
      defaultContent: "",
      title: "Received On",
    },

    {
      data: "uniqid",
      defaultContent: "",
      title: "Forwarded To",
      render: function (data, type, row, meta) {
        var btn = "";
        if (row.action == "Forwarded") {
          btn =
            '<div><a href="#" data-value = "' +
            data +
            '"  class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
        }
        return btn;
      },
    },

    // AI Integration - SKY - 05/02/2025
    {
      data: "key_flag",
      defaultContent: "",
      title: "AI Classification",
      render: function (data, type, row, meta) {
        if (row.key_flag == "Normal") {
          return `<span style="background-color: green;color: white;border-radius: 5%;padding: 5px 5px;">` + row.key_flag + `</span>`;
        }
        else if (row.key_flag == "Priority") {
          return `<span style="background-color: red;color: white;border-radius: 5%;padding: 5px 5px;">` + row.key_flag + `</span>`;
        }
        else if (row.key_flag == "Repeated") {
          return `<span style="background-color: yellow;color: black;border-radius: 5%;padding: 5px 5px;">` + row.key_flag + `</span>`;
        }
      }
    },
    {
      data: "ai_tracking",
      defaultContent: "",
      title: "AI Tracking",
      render: function (data, type, row, meta) {
        let submittedDate = new Date(row.createddate);
        let closedDate = new Date(row.updated_on);
        let differenceInMs = closedDate - submittedDate;
        let differenceInDays = Math.floor(Math.abs(differenceInMs) / (1000 * 60 * 60 * 24));
        differenceInDays = differenceInDays === 0 ? 1 : differenceInDays;
        let actualDaysSinceElapsed = row.days_since_elapsed;

        if (['Resolved', 'Rejected'].includes(row.status)) {
          actualDaysSinceElapsed = differenceInDays;
        }
        if (row.colorcode == 0) {
          return `<span style="color: green;"> ` + actualDaysSinceElapsed + ` / <span style="background-color: green; color: white; border-radius: 50%; padding: 5px 6px;">` + row.days_assigned + `</span></span>`;
        }
        else if (row.colorcode == 1) {
          return `<span style="color: red;"> ` + actualDaysSinceElapsed + ` / <span style="background-color: red; color: white; border-radius: 50%; padding: 5px 6px;">` + row.days_assigned + `</span></span>`;
        }
        else if (row.colorcode == 2) {
          return `<span style="color: orange;"> ` + actualDaysSinceElapsed + ` / <span style="background-color: orange; color: white; border-radius: 50%; padding: 5px 6px;">` + row.days_assigned + `</span></span>`;
        }
      }
    },
  ];


  var table136 = $("#all_tblHome").DataTable({
    serverSide: true, // Enable server-side processing
    processing: true, // Show a loading indicator
    scrollX: true, // Horizontal Scroll
    ajax: {
      url: "allDataNewDept",
      type: "POST",
      contentType: "application/json",
      data: function (d) {
        d.filterValue = localFilterVal; // Send filteredValue with the value of selected radio button
        d.clickedValue = localClickVal; // Send clickedValue with the value of clicked dashboard tab

        // SKY - 06/02/2025
        d.deptFilterVal = deptFilterVal; // For Filtering based on selected department
        d.catgFilterVal = catgFilterVal; // For Filtering based on selected category
        d.fdFilterVal = fdFilterVal; // For Filtering based on selected from / on date
        d.tdFilterVal = tdFilterVal; // For Filtering based on selected to date
        // SKY - 06/02/2025
        d.districtFilterVal = districtFilterVal; // For Filtering based on selected district
        d.officeFilterVal = officeFilterVal //For Filtering based on selected office name


        return chkV(JSON.stringify(d)); // Send Encrypted JSON payload
      },
      dataSrc: function (response) {
        globalUserType = response.user_type; // Store the user_type globally
        //console.log("user_type :: " + globalUserType);
        globalAllData = response.data;
        return response.data; // Return the data for the table
      },
    },
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },

      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "true", // Automatically triggers PDF download
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Dynamically adjust the first few columns, and then use '*' for others
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];

          // // Adjust width of the first column dynamically
          // columnWidths.push("auto"); // 'auto' for the first column
          // columnWidths.push("auto"); // Adjust others similarly if needed



          // For other columns, set widths to 'auto' or calculated based on content
          for (var i = 0; i < totalColumns; i++) {
            // Approximate min-content by using "auto" for other columns
            columnWidths.push("auto");
          }

          // Set calculated column widths
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: column,
    rowCallback: function (row, data) {
      // Check the value of the 'application' column and apply the corresponding class
      const color = {
        Forwarded: "web-application-forwarded",
        Resolved: "web-application-resolved",
        Acknowledged: "web-application-acknowledged",
        "Proposed Disposed": "web-application-proposed-disposed",
        Rejected: "web-application-rejected",
        Appealed: "web-application-appealed",
        "Under Process": "web-application-under-proccess",
        Pending: "web-application-pending",
        dnpToOffice: "web-application-dnptooffice",
      };

      const customClass = color[data.action]
        ? color[data.action]
        : "web-application-row";

      $(row).addClass(customClass);
    },
    order: [[9, "desc"]], // Default sorting by the second column (Grievance ID i.e uniqid)
    lengthMenu: [10, 50, 100, 500, 1000], // Page length options
    pageLength: 10, // Default page length
  });

  $("#all_tblHome_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table136.search(cleanValue).draw(); // Update DataTable search
  });

  $(".btn-customBtn").on("click", function () {
    // console.log("." + $(this).val())
    var btn = $(this).val();
    if (btn === "buttons-reset") {
      // console.log(btn)
      // Reset all radio buttons and select the "All" radio button
      $("input[name='total-app']").prop("checked", false); // Uncheck all radio buttons
      $("#total-all-search").prop("checked", true); // Check the "All" radio button (id: total-all-search)

      localFilterVal = "home";
      localClickVal = "Total";
      table136.ajax.reload();
    } else {
      btn = "." + btn;
      $.ajax({
        url: "allDataNewDept",
        type: "POST",
        contentType: "application/json",
        data: chkV(
          JSON.stringify({
            start: 0, // Request all data from the backend
            length: -1, // Indicate fetch-all

            filterValue: localFilterVal, // Send filteredValue with the value of selected radio button
            clickedValue: localClickVal, // Send clickedValue with the value of clicked dashboard tab

            // SKY - 06/02/2025
            deptFilterVal: deptFilterVal, // For Filtering based on selected department
            catgFilterVal: catgFilterVal, // For Filtering based on selected category
            fdFilterVal: fdFilterVal, // For Filtering based on selected from / on date
            tdFilterVal: tdFilterVal, // For Filtering based on selected to date
            // SKY - 06/02/2025
            districtFilterVal: districtFilterVal, // For Filtering based on selected district
            officeFilterVal: officeFilterVal, //For Filtering based on selected office name
            columns: table136.settings().init().columns, // Pass column definitions
          })
        ),
        success: function (response) {
          var allData = response.data;
          //console.log(allData)
          var originalData = table136.data().toArray(); // Backup current data
          //console.log(originalData)

          // Temporarily load all data into DataTable for export
          table136.clear().rows.add(allData).draw(false);

          // Trigger export
          // $.fn.dataTable.ext.buttons[exportType + "Html5"].action.call(this, e, table136, button, config);
          table136.button(btn).trigger();

          // Restore original data
          table136.clear().rows.add(originalData).draw(false);
        },
        error: function (xhr) {
          console.error("Failed to fetch all data for export", xhr);
          table136.processing(false); // Disable processing if error occurs
        },
      });
    }
  });
}
// Server Side datatable - end
$(document).on("change", "#dateFrom", function (e) {
  var val = e.target.value;
  if (val != "") {
    //  $('#subdate').show();
    $("#dateTo").attr("disabled", false);
    //datatable(val);
  } else {
    $("#dateTo").attr("disabled", true);
  }
});


function conPenrptData(radioVal) {

  console.log(radioVal)
  var c = JSON.stringify({ val: radioVal });
  var d = chkV(c);
  var settings = {
    url: "conPenrptDataApi?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j);
    getConPendReport(j.data, radioVal);
  });
}

function getConPendReport(data, radioVal) {
  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table151.button("." + $(this).val()).trigger();
  });

  var columns = [];
  var headingText = "";
  if (radioVal === "userwise") {
    columns = [
      {
        data: "id",
        defaultContent: "",
        title: "S. No.",
      },

      {
        data: "officer_name",
        defaultContent: "",
        title: "Officer Name",
        render: function (data, type, row) {
          // Trim whitespace from the full_name
          return $.trim(data);
        },
      },

      {
        data: "office",
        defaultContent: "",
        title: "Office Name & Designation",
      },

      {
        data: "department",
        defaultContent: "",
        title: "Department",
      },

      {
        data: "officer_type",
        defaultContent: "",
        title: "User Type",
      },
      {
        data: "usertype_of_assigned_user",
        defaultContent: "",
        title: "User Level",
      },

      // {
      //   data: "reporting_officer",
      //   defaultContent: "",
      //   title: "RO",
      // },

      {
        data: "pending_count",
        defaultContent: "",
        title: "Pending Grievances",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.pending_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Pending" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
    ];
    headingText = "User Wise Pendency Report";
  } else if (radioVal === "deptwise") {
    columns = [
      {
        title: "S. No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },

      {
        data: "department",
        defaultContent: "",
        title: "Department Name",
      },

      {
        data: "pending_count",
        defaultContent: "",
        title: "Pending Grievances",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.pending_grv_ids) + '"';
          return (
            '<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "Pending" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
    ];
    headingText = "Department Wise Pendency Report";
  }

  // Check if DataTable is already initialized
  if ($.fn.DataTable.isDataTable("#pendTbl")) {
    var table = $("#pendTbl").DataTable();
    table.clear(); // Clear the table data
    table.destroy(); // Destroy the table
    $("#pendTbl").empty(); // Empty the table element
  }

  var table151 = $("#pendTbl").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    //scrollY: 500,
    paging: true,
    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: columns,
  });

  $("#pendTbl_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table151.search(cleanValue).draw(); // Update DataTable search
  });
  $(".whichWiseHeading").text(headingText);
}


function agePendingAreportData(radioVal) {
  var c = JSON.stringify({ val: radioVal });
  var d = chkV(c);
  var settings = {
    url: "agePendingAnalysisReport?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };

  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j);
    getAgeAnalysis(j.data, radioVal);
  });
}

//Naitik Changes on 29/01/2026

$(document).on('click', '.grievancepdf', function () {
  var grievanceId = $(this).attr('data-grievance-id');

  $.ajax({
    url: cp + "/dept/downloadPdfHistory",
    type: 'POST',
    data: {
      grievanceId: grievanceId
    },
    xhrFields: {
      responseType: 'blob'
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader(header, token);
      Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    },
    success: function (blob, status, xhr) {
      Swal.close();


      var link = document.createElement('a');
      var url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = 'Grievance_Details_' + grievanceId + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'PDF downloaded successfully',
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: function (xhr) {
      Swal.close();
      console.error('Download failed', xhr.status);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to download PDF. Please try again.',
        confirmButtonColor: '#7246f5'
      });
    }
  });
});
//Naitik Changes End 29/01/2026
