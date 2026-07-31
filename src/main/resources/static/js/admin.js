let context_path = $("#context_path").val();
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

$(function () {
  sessionFunc();

  $(".multi-select2").select2({
    placeholder: "",
    allowClear: true, // Optional, adds a clear button
    //selectOnClose: true // automactic selection when drop down is closed
    //closeOnSelect: false, // auto close of drop down after selection is not allowed
    //maximumSelectionLength: 2, // limiting user selection
  });
  // 20 May 2024
  if (window.location.href.indexOf("/getUserList") != -1) {
    $(document).on("click", ".shwUptDetails", function (e) {
      let c = $(this).val();
      let d = chkV(c);
      window.location.href = "basedUlUpdProfile?d=" + d;
      console.log("Clicked on user with email: " + c);
    });
  }
  // 20 May 2024

  $("#fwdByOtherDep-tab").removeClass("active");
  $("#home-tab").addClass("active");
  getGrievList("cUserTblDetails12");
  // getGrievList2("all_tblHome");
  serverSideDT();
  //var addDeptV = $('#selDept').find(":selected").val();
  // getGrievList("cUserTblDetails");
});

// capture multi select 2 values as list for IN query
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

//   for MIS Report Section endpoint
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

if (window.location.href.indexOf("/agePendingPage") != -1) {
  agePendingAreportData("userwise");
}

if (window.location.href.indexOf("/conPenrpt") != -1) {
  conPenrptData("userwise");
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
/*$('.custBtn').click(function(){
	
  //console.log(this.value)
	
  if(this.value=='other'){
	
    $('#home-tab').removeClass('active')
    $('#fwdByOtherDep-tab').addClass('active')
    getGrievList2('fwdByOtherDep');
	
  }else if(this.value=="dash"){
	
    $('#fwdByOtherDep-tab').removeClass('active')
    $('#home-tab').addClass('active')
    getGrievList2('all_tblHome');
	
  }else if(this.value=="CPGRAM"){
  	
    window.location.href="cpgramDashboard"
  	
  }
})*/

$(".custBtn").click(function () {
  //  alert(this.value);

  if (this.value == "other") {
    $("#fwdByOtherDep-tab, #fwdByOtherDep-tab-pane").addClass("active show");
    getGrievList2("fwdByOtherDep");
  } else if (this.value == "dash") {
    $(
      "#fwdByOtherDep-tab, #fwdByOtherDep-tab-pane,#fwd2-tab,#doesNotOtherDep-tab"
    ).removeClass("active show");
    //$('#fwd2-tab-pane').hide();
    //getGrievList2("all_tblHome");
    serverSideDT();
  }
  // JKIGRAMS
  else if (this.value == "jkigrams") {
    //$("#pills-jkigram-tab").addClass("active show");
    jkiGramForNodal();
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

// $("#YRreport").DataTable({
//   //  data: j,
//   destroy: true,
//   lengthMenu: [5, 10, 25],
//   pageLength: 10,
//   //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
//   /*   buttons: [
// 			'copy', 'csv', 'excel', 'pdf', 'print'
// 		]*/
//   buttons: ["excel"],
// });

////////
$("#addDept").change(function () {
  var addDeptV = $("#addDept").find(":selected").val();
  $("#categ").html("");
  $("#categ").append(
    '<option value="0">Select</option><option value="add">Add new category</option>'
  );
  $("#categ").prop("disabled", false);
  ////console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#addDeptV").val("");
      $("#addDeptT").show();
      $("#categ").prop("disabled", false);
    } else {
      $("#categ").prop("disabled", false);
      $("#addDeptT").hide();
      var c = JSON.stringify({
        value: addDeptV,
      });
      var d = chkV(c);
      var settings = {
        url: "categ?d=" + d,
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
          ////console.log(j.data);
          ////console.log(categ)
          makeDropdown(categ, j.data);
        }
      });
    }
  } else {
    $("#subDept").prop("disabled", true);
    $("#addDeptT").hide();
    $("#addDeptV").val("");

    $("#categ").prop("disabled", true);
    $("#categT").hide();
    $("#categV").val("");

    $("#subcateg").prop("disabled", true);

    $("#subcategT").hide();
    $("#subcategV").val("");

    $("#subcateg2").prop("disabled", true);
    $("#subcategT2").hide();
    $("#subcategV2").val("");

    $("#subcateg3").prop("disabled", true);
    $("#subcategT3").hide();
    $("#subcategV3").val("");

    $("#subcateg4").prop("disabled", true);
    $("#subcategT4").hide();
    $("#subcategV4").val("");
  }
});

$("#categ").change(function () {
  var addDeptV = $("#categ").find(":selected").val();
  $("#subcateg").html("");
  $("#subcateg").append(
    '<option value="0">Select</option><option value="add">Add new sub-category</option>'
  );
  ////console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#categV").val("");
      $("#categT").show();
      $("#subcateg").prop("disabled", false);
    } else {
      $("#subcateg").prop("disabled", false);
      $("#categT").hide();
      var c = JSON.stringify({
        value: addDeptV,
      });
      var d = chkV(c);
      var settings = {
        url: "subcateg?d=" + d,
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
          ////console.log(j.data);
          makeDropdown(subcateg, j.data);
        }
      });
    }
  } else {
    $("#subcateg").prop("disabled", true);
    $("#subcategT").hide();
    $("#categT").hide();
    $("#subcateg2").prop("disabled", true);
    $("#subcategT2").hide();
    $("#subcateg3").prop("disabled", true);
    $("#subcategT3").hide();
    $("#subcateg4").prop("disabled", true);
    $("#subcategT4").hide();
  }
});

//my code

$("#subcateg").change(function () {
  var addDeptV = $("#subcateg").find(":selected").val();
  $("#subcateg2").html("");
  $("#subcateg2").append(
    '<option value="0">Select</option><option value="add">Add new sub-category</option>'
  );
  ////console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#subcategV").val("");
      $("#subcategT").show();
      $("#subcateg2").prop("disabled", false);
    } else {
      $("#subcateg2").prop("disabled", false);
      $("#subcategT").hide();

      var c = JSON.stringify({
        value: addDeptV,
      });
      var d = chkV(c);
      var settings = {
        url: "subcategNextLevel2?d=" + d,
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
          ////console.log(j.data);
          makeDropdown(subcateg2, j.data);
        }
      });
    }
  } else {
    $("#subcategT").hide();
    $("#subcateg2").prop("disabled", true);
    $("#subcategT2").hide();
    $("#subcateg3").prop("disabled", true);
    $("#subcategT3").hide();
    $("#subcateg4").prop("disabled", true);
    $("#subcategT4").hide();
  }
});

$("#subcateg2").change(function () {
  var addDeptV = $("#subcateg2").find(":selected").val();
  $("#subcateg3").html("");
  $("#subcateg3").append(
    '<option value="0">Select</option><option value="add">Add new sub-category</option>'
  );
  ////console.log(addDeptV);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#subcategV2").val("");
      $("#subcategT2").show();
      $("#subcateg3").prop("disabled", false);
    } else {
      $("#subcateg3").prop("disabled", false);
      $("#subcategT2").hide();

      var c = JSON.stringify({
        value: addDeptV,
      });
      ////console.log(c)
      var d = chkV(c);
      var settings = {
        url: "subcategNextLevel3?d=" + d,
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
          //		//console.log(j.data);
          makeDropdown(subcateg3, j.data);
        }
      });
    }
  } else {
    $("#subcategT2").hide();
    $("#subcateg3").prop("disabled", true);
    $("#subcategT3").hide();
    $("#subcateg4").prop("disabled", true);
    $("#subcategT4").hide();
  }
});

$("#subcateg3").change(function () {
  var addDeptV = $("#subcateg3").find(":selected").val();
  $("#subcateg4").html("");
  $("#subcateg4").append(
    '<option value="0">Select</option><option value="add">Add new sub-category</option>'
  );
  ////console.log(addDeptV);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#subcategV3").val("");
      $("#subcategT3").show();
      $("#subcateg4").prop("disabled", false);
    } else {
      $("#subcateg4").prop("disabled", false);
      $("#subcategT3").hide();

      var c = JSON.stringify({
        value: addDeptV,
      });
      var d = chkV(c);
      var settings = {
        url: "subcategNextLevel4?d=" + d,
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
          //	//console.log(j.data);
          makeDropdown(subcateg4, j.data);
        }
      });
    }
  } else {
    $("#subcategT3").hide();
    $("#subcateg4").prop("disabled", true);
    $("#subcategT4").hide();
  }
});

$("#subcateg4").change(function () {
  var addDeptV = $("#subcateg4").find(":selected").val();
  ////console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#subcategV4").val("");
      $("#subcategT4").show();
      $("#subcateg4").prop("disabled", false);
    } else {
      $("#subcateg4").prop("disabled", false);
      $("#subcategT4").hide();
    }
  } else {
    $("#subcategT4").hide();
  }
});

//$(document).on("click", "#grevP", function () {
//  let d = $(this).closest('tr').find('td:first').text()
//      d = chkV(d);
//  window.open('actionOnflaggedGrievances?d=' + d, '_blank');
//
//});

$("#resetDept").click(function () {
  $("#addDeptT").hide();
  $("#categ").prop("disabled", true);
  $("#categT").hide();
  $("#subcategT").hide();
  $("#subcateg").prop("disabled", true);
  $("#addDeptV").val("");
  $("#categV").val("");
  $("#subcategV").val("");
  $("#categ").prop("selectedIndex", 0);
  $("#subcateg").prop("selectedIndex", 0);
  $("#addDept").prop("selectedIndex", 0);
});

$("#submitDept").click(function () {
  //			alert("hello");
  var dp = $("#addDept").find(":selected").val();
  var cat = $("#categ").find(":selected").val();
  var subCat = $("#subcateg").find(":selected").val();
  var subCatNextLevel2 = $("#subcateg2").find(":selected").val();
  var subCatNextLevel3 = $("#subcateg3").find(":selected").val();
  var subCatNextLevel4 = $("#subcateg4").find(":selected").val();

  if (dp == "0" || cat == "0") {
    alert("All fields are mandatory.");
  } else if (
    dp == "add" &&
    ($("#addDeptV").val() == null || $("#addDeptV").val().trim() == "")
  ) {
    alert("Add new department.");
  } else if (
    cat == "add" &&
    ($("#categV").val() == null || $("#categV").val().trim() == "")
  ) {
    alert("Add new category.");
  } /*if(subCat == 'add' && ($("#subcategV").val() == null || $("#subcategV").val().trim() == '')) {
				alert("Add new sub-category.")
			}else*/ else {
    if (dp == "add") {
      dp = $("#addDeptV").val();
    } else {
      dp = dp;
    }
    if (cat == "add") {
      cat = $("#categV").val();
    } else {
      cat = cat;
    }
    if (subCat == "add") {
      subCat = $("#subcategV").val();
    } else {
      subCat = subCat;
    }
    if (subCatNextLevel2 == "add") {
      subCatNextLevel2 = $("#subcategV2").val();
    } else {
      subCatNextLevel2 = subCatNextLevel2;
    }
    if (subCatNextLevel3 == "add") {
      subCatNextLevel3 = $("#subcategV3").val();
    } else {
      subCatNextLevel3 = subCatNextLevel3;
    }
    if (subCatNextLevel4 == "add") {
      subCatNextLevel4 = $("#subcategV4").val();
    } else {
      subCatNextLevel4 = subCatNextLevel4;
    }

    //Naitik Changes on popup 09/10/2025
    if (!confirm("Are you sure that you want to create this Department Category?")) {
      return;
    }
    //Naitik Changes End on popup 09/10/2025


    //				alert("good");
    var c = JSON.stringify({
      department_name: dp,
      category: cat,
      sub_category: subCat,
      sub_Cat_Next_Level2: subCatNextLevel2,
      sub_Cat_Next_Level3: subCatNextLevel3,
      sub_Cat_Next_Level4: subCatNextLevel4,
      sessionvalue: $("#sessionvalue").val(),
      sessionname: $("#sessionname").val(),
    });

    //	//console.log(c)
    var d = chkV(c);
    var settings = {
      url: "addDept?d=" + d,
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
        ////console.log(j.data);
        alert("Department added successfully.");
        window.location.reload();
      } else if (j.statusCode == "2") {
        ////console.log(j.data);
        alert("Department-Category-Sub Category combination exists.");
        window.location.reload();
      } else if (j.statusCode == "4") {
        var msg = j.statusName;
        alert(msg);
        // window.location.reload();
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }
});

function dptName() {
  // $("#selDept").change(
  // 		function() {
  var addDeptV = $("#selDept").find(":selected").val();
  //$("#selUser").html('');
  //	$("#selUser").append('<option value="0">Select</option><option value="add">Create new User</option>');
  if (addDeptV != "0") {
    $("#createUserDiv").show();
    $("#categDiv").show();
    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "deptUsers?d=" + d,
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
        ////console.log(j.data);
        //	makeDropdown(selUser, j.data);
        $("#cUsers").show();
        // makeDropdown(0, j.data);
      } else {
        $("#cUsers").hide();
      }
      //makeCheckBoxes(checkBoxDiv,addDeptV);
    });
  } else {
    $("#selUser").html("");
    $("#createUserDiv").hide();
    $("#categDiv").hide();
    $("#newUserDiv").hide();
    $("#assignDiv").hide();
  }
  // });
}

$("#selUser").change(function () {
  var addDeptV = $("#selUser").find(":selected").val();
  ////console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#newUserDiv").show();
      $("#assignDiv").hide();
    } else {
      $("#newUserDiv").hide();
      $("#assignDiv").show();
    }
  } else {
    $("#newUserDiv").hide();
    $("#assignDiv").hide();
  }
});

// $('input[type="radio"][name="userType"]').change(function () {
$("#userType").change(function () {

  //$('#selUsrLevel').change( function(){
  //	var usrType=$('#selUsrLevel').find(":selected").val();
  $("#newUserDiv").show();
  var usrType = this.value;
  //alert(usrType)
  if (usrType == "UT" || usrType == "Appellate") {
    $("#dist").hide();
    $("#division").hide();
    $("#dist").val("");
    $("#division").val("");
    $("#divvvv").hide();
    $("#distsss").hide();
  } else if (usrType == "DISTRICT") {
    $("#dist").show();
    $("#division").show();
    $("#distsss").show();
    $("#divvvv").show();
  } else if (usrType == "DIVISION") {
    //	$("#distDiv").show();
    $("#distsss").hide();
    $("#distsss").val("");
    $("#divvvv").show();
  }

  getUserType(this.value);

});

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
    //console.log("success")
    $(element).addClass("matched");
  } else {
    //console.log("failed")
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
      // $("#errMsg2").hide();

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

      //var dist = $("#dist").find(":selected").val();
      var district = $("#dist").val();
      // //console.log(dist.length);
      var div = $("#inputRegion").find(":selected").val();
      var usTp = $("#selUsrType").find(":selected").val();
      var des = $("#designation").find(":selected").val();
      //var usLvl = $('#selUsrLevel').find(":selected").val();
      // var usrLvl = $("input[type=radio][name=userType]:checked").val();
      // var usrLvl = $("#userType").val();
      var isChecked = $("#userType").val();

      // var isChecked = $("input[type=radio][name=userType]").is(":checked");

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
          $("#offName").find(":selected").val() == "0" ||
          des == "0" ||
          $("#password").val() == null ||
          $("#password").val().trim() == "" ||
          usTp == "0" ||
          // isChecked == false ||
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
          $("#password").val() == null ||
          $("#password").val().trim() == "" ||
          $("#offName").find(":selected").val() == "0" ||
          des == "0" ||
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
          $("#password").val() == null ||
          $("#password").val().trim() == "" ||
          $("#offName").find(":selected").val() == "0" ||
          des == "0" ||
          usTp == "0" ||
          isChecked == "0";
      }

      if (validation) {
        alert("All fields except middle name are mandatory.");
      } else {
        // var checkedValue = $(
        //   'input[type="radio"][name="userType"]:checked'
        // ).val();
        //var dist = $("#dist").find(":selected").val();
        //  var dist = $("#dist").val();
        var dist = getSelectedValuesMsel("#dist", ", ", []);

        var div = $("#inputRegion").find(":selected").val();
        var fn = $("#fn").val().trim();
        var mn = $("#mn").val();
        var ln = $("#ln").val().trim();
        var mobile = $("#mobile").val().trim();
        var email = $("#email").val().trim();
        var designation = $("#designation").find(":selected").val();
        var passw = $("#password").val().trim();
        var offName = $("#offName").find(":selected").val();

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
            //value: usrLvl,
            value: isChecked,
            office_name: offName,
            sessionvalue: $("#sessionvalue").val(),
            sessionname: $("#sessionname").val(),
          });

          ////console.log(c)

          var d = chkV(c);
          var settings = {
            url: "addUser?d=" + d,
            method: "POST",
            timeout: 0,
            headers: {
              "Content-Type": "application/json",
            },
          };
          $.ajax(settings).done(function (j) {
            j = setV(j);
            j = JSON.parse(j);
            //	//console.log(j);
            if (j.statusCode == "1") {
              alert("User added successfully.");
              window.location.reload();
            } else if (j.statusCode == "2") {
              ////console.log(j.data);
              alert("Email id already exists.");
              window.location.reload();
            } else if (j.statusCode == "4") {
              var msg = j.statusName;
              alert(msg);
              // window.location.reload();
            } else if (j.statusCode == "5") {
              var msg = j.statusName;
              alert(msg);
              // window.location.reload();
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
      // $("#errMsg2").show();
      //$("#errMsg2").html(j.msg);
      return false;
    }
  });
});

$("#createUserType").click(function () {
  var dp = $("#Department").val();
  var usrType = $("#userTypeCreation").val();
  //	var usrLvl = $('#inputUserLevel').find(":selected").val();
  //	var usrLvl = $('input[type=radio][name=userType]:checked').val();

  // var isChecked = $("input[type=radio][name=userType]").is(":checked");

  if (usrType == null || usrType.trim() == "") {
    alert("All fields are mandatory.");
  } else {
    var c = JSON.stringify({
      department: dp,
      user_type: usrType,
      //	user_level: usrLvl,
    });

    ////console.log(c)

    var d = chkV(c);
    var settings = {
      url: "addUserType?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //	//console.log(j);
      if (j.statusCode == "1") {
        alert("User Created successfully.");
        window.location.reload();
      } else if (j.statusCode == "2") {
        ////console.log(j.data);
        alert("User Type already exists.");
        window.location.reload();
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }
});

$("#inputRegion").change(function () {
  var addDeptV = $("#inputRegion").find(":selected").val();
  $("#dist").html("");
  // $("#dist").append('<option value="0">--Select District--</option>');
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
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //	//console.log(j);
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
});

// $("#selUsrType").change(function () {
//   var addDeptV = $("#selUsrType").find(":selected").val();
//   //$("#selUsrLevel").html('');
//   //	$("#selUsrLevel").append('<option value="0">--Select User Level--</option>');
//   if (addDeptV != "0") {
//     //	$("#selUsrLevel").attr("disabled",false);
//     var c = JSON.stringify({
//       value: addDeptV,
//     });
//     var d = chkV(c);
//     var settings = {
//       url: "getUserLevel?d=" + d,
//       method: "POST",
//       timeout: 0,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };
//     $.ajax(settings).done(function (j) {
//       j = setV(j);
//       j = JSON.parse(j);
//       //	//console.log(j);
//       if (j.statusCode == "1") {
//         //	makeDropdown(selUsrLevel, j.data);
//       }
//     });
//   } else {
//     //	$("#selUsrLevel").attr("disabled",true);
//   }
// });

/*$("#inputRegion").change(function() {
  var addDeptV = $('#inputRegion').find(":selected").val();
  $("#dist").html('');
  $("#dist").append('<option value="0">--Select District--</option>');
  if (addDeptV != '0') {
    $("#dist").attr("disabled",false);
      var c = JSON.stringify({
        value: addDeptV
      });
      var d = chkV(c);
      var settings = {
        "url": "districts?d=" + d,
        "method": "POST",
        "timeout": 0,
      };
      $.ajax(settings).done(function(j) {
        j = setV(j);
        j = JSON.parse(j);
        //console.log(j);
        if (j.statusCode == '1') {
        	
    	
          //  CategoryBydept(addDeptV)
           // depData(addDeptV)
          makeDropdown(dist, j.data);
        }
      });
  }else {
    $("#dist").attr("disabled",true);
    // $("#depName").html('');
    // 	$("#depName").append('<option value="0">Select</option>');
  }
});*/

$("#assignUser").click(function () {
  var chked = "";
  $(".flexCheckChecked:checked").each(function () {
    var vl = $(this).val();
    chked = chked + vl + ",";
  });
  chked = chked.substring(0, chked.length - 1);
  //	var remDays=$('#reminder').val();
  //			alert(chked);
  if (
    $(".flexCheckChecked:checked").length == 0 ||
    $("#selUser").val() == "0"
  ) {
    alert("All fields are mandatory.");
  } else {
    var fn = $("#selUser").val();

    var c = JSON.stringify({
      email: fn,
      category: chked,
    });

    var d = chkV(c);
    var settings = {
      url: "extUs?d=" + d,
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
        ////console.log(j.data);
        alert("Categories assigned successfully.");
        window.location.reload();
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }
});

Listen(document).on("click", ".delte-btn", function (e) {
  //	alert(e.target.value);
  var username = $(this).val();
  ////console.log(username);
  var c = JSON.stringify({
    email: username,
  });

  var d = chkV(c);
  var settings = {
    url: "delValByUsername?d=" + d,
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
      ////console.log(j.data);
      alert("User Removed successfully.");
      window.location.reload();
    } else {
      alert("Something went wrong");
      window.location.reload();
    }
  });
});

//////
Listen(document).on("click", ".dtl-btn", function (e) {
  ////console.log(e.target.value);
  var c = JSON.stringify({
    value: e.target.value,
  });

  var d = chkV(c);
  var settings = {
    url: "chkVal?d=" + d,
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
      //	//console.log(j.data);
      makeDataTable(j.data);
    } else {
      alert("No categories to show.");
    }
  });
});

Listen(document).on("click", ".del-btn", function (e) {
  var value = e.target.value;
  var valuesArray = value.split(",");
  var categoryId = valuesArray[0];
  var assignedTo = valuesArray[1];

  var c = JSON.stringify({
    cat_id: categoryId,
    value: assignedTo,
  });

  var d = chkV(c);
  var settings = {
    url: "delVal?d=" + d,
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
      ////console.log(j.data);
      alert("Category Removed successfully.");
      window.location.reload();
    } else {
      alert("Something went wrong");
      window.location.reload();
    }
  });
});

//
function makeDataTable(d) {
  $("#exampleModal").modal("show");

  $(".btn-customBtn").on("click", function () {
    // //console.log($(this).val());
    table101.button("." + $(this).val()).trigger();
  });

  var table101 = $("#rtb2").DataTable({
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
        data: "assigned_to",
        defaultContent: "",
        title: "Assigned To",
      },
      {
        data: "category_name",
        defaultContent: "",
        title: "Assigned Category",
      },
      {
        data: "category_id",
        defaultContent: "",
        class: "noExport",
        title: "Action",
        render: function (data, type, row, meta) {
          return (
            '<button type="button" value="' +
            row.category_id +
            "," +
            row.assigned_to +
            '" class="btn btn-danger del-btn">Remove</button>'
          );
        },
      },
    ],
  });
  //table.columns.adjust().draw();
}

$(document).on("shown.bs.modal", ".modal", function () {
  $($.fn.dataTable.tables(true))
    .DataTable()
    .columns.adjust()
  // .responsive.recalc()
  // .scroller.measure();
});

function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>").attr("value", value.values).text(value.values)
    );
  });
}
function makeCheckBoxes(passedId, dept) {
  //alert("hrllo");
  var c = JSON.stringify({
    value: dept,
  });
  var d = chkV(c);
  var settings = {
    url: "deptCat?d=" + d,
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
      ////console.log(j.data);
      $.each(j.data, function (key, value) {
        if (value.assigned_status == "no") {
          $(passedId).append(
            $(
              '<div class="form-check"><input class="form-check-input flexCheckChecked" type="checkbox" value=' +
              value.id +
              ' name="flexCheckChecked"> <label class="form-check-label" for="flexCheckChecked">' +
              value.category_name +
              "</label></div>"
            )
          );
        } else {
          $(passedId).append(
            $(
              '<div class="form-check"><input class="form-check-input flexCheckChecked" type="checkbox" value=' +
              value.id +
              ' name="flexCheckChecked" disabled> <label class="form-check-label" for="flexCheckChecked">' +
              value.category_name +
              "</label></div>"
            )
          );
        }
      });
    } else {
      alert("No categories to show");
    }
  });
}
/////
$(".input-field").keyup(function (e) {
  var $th = $(this);
  $th.val($th.val().replace(/(\s{2,})|[^a-zA-Z']/g, " "));
  $th.val($th.val().replace(/^\s*/, ""));
});

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

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function isMobile(mobile) {
  var regex = /^([6789][0-9]{9})$/;
  return regex.test(mobile);
}

// $("#mobile").bind("keyup paste", function () {
$("#mobile").bind("input", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// SKY 24 JAN 2024 ==============================================

function getGrievList(btnVal) {
  // alert(btnVal);
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "api_v2?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // //console.log(JSON.stringify(j));
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.created_date != null) {
          current.created_date = format_date(current.created_date);
        }
        return current;
      });
    }

    $(".btn-customBtn").on("click", function () {
      // //console.log($(this).val());
      table102.button("." + $(this).val()).trigger();
    });

    var table102 = $("#YRreport11").DataTable({
      data: j.data,
      destroy: true,
      lengthMenu: [10, 50, 100],
      pageLength: 10,
      scrollX: true,
      //scrollY: 500,
      paging: true,
      ////dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
      //dom: '<"row"<"col-sm-4 text-start"l><"col-sm-4 text-center"B><"col-sm-4 text-center"f>">',
      // dom:
      // "<'ui grid'"+
      // 	"<'row'"+
      // 		"<'col-sm-4 text-start mb-1'l>"+
      // 		"<'col-sm-4 d-flex justify-content-center mb-1'B>"+
      // 		"<'col-sm-4 text-center mb-1'f>"+
      // 	">"+
      // 	"<'row dt-table'"+
      // 		"<'col-sm-12'tr>"+
      // 	">"+
      // 	"<'row'"+
      // 		"<'col-sm-6'i>"+
      // 		"<'col-sm-6 text-end'p>"+
      // 	">"+
      // ">",
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
      columns: [
        {
          title: "S. No.",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
        },
        /* {
					data: (row) =>
					  row.first_name + " " + row.middle_name + " " + row.last_name,
					defaultContent: "",
					title: "Name",
				  },
				*/ {
          data: "department",
          defaultContent: "",
          title: "Department",
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
        {
          data: "mobile",
          defaultContent: "",
          title: "Mobile Number",
        },
        // {
        //   data: "email",
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
            var name =
              row.first_name +
              " " +
              row.middle_name +
              " " +
              row.last_name +
              " (" +
              row.designation +
              ")";

            return name;
          },
        },
        {
          data: "user_assigned",
          defaultContent: "",
          title: "User Type",
        },
        {
          data: "usertype_of_assigned_user",
          defaultContent: "",
          title: "User level",
        },
        {
          data: "created_date",
          defaultContent: "",
          title: "Created On",
        },
        {
          data: "created_by_name",
          defaultContent: "",
          title: "Created By",
        },
        /*{
           data: "pendingWith",
           defaultContent: "",
           title: "Pending With",
         },*/
        /*{
          data: "username",
          defaultContent: "",
          class: "noExport",
title: "Action",
          render: function (data, type, row, meta) {
          return `<button value = "${data}" class="btn btn-sm btn-primary dtl-btn">Details</button>
          <button value = "${data}" class="btn btn-sm btn-warning text-white visibility-hidden" style="display:none;"><i class="bi bi-pencil-square""></i></button>
          <button value = "${data}" class="btn btn-sm btn-danger text-white visibility-hidden" style="display:none;"><i class="bi bi-trash"></i></button>`;
          },
        },*/
      ],
    });

    $("#YRreport11_filter input[type='search']").on("input", function () {
      // alert("jjjds")

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      table102.search(cleanValue).draw(); // Update DataTable search
    });
  });
}

// SKY 24 JAN 2024 ==============================================
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
        ////console.log(j.data);
        alert("Pulled Successfully.");
        window.location.reload();
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  } else {
    // If user clicks "No," you can handle it here or do nothing
    //  //console.log("User clicked No");
  }
});

// API_V1
Listen(document).on("click", ".tt_griev", function (e) {
  let btnVal = e.target.value;
  //alert(btnVal)
  // alert(btnVal)
  getGrievList2(btnVal);
});

// 05th Jan 2024 - SKY - start
$(document).on("click", ".vHis", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  // window.location.href = "historyGrievance?d=" + d;
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
    // if (j.statusCode[0] == 1) {
    //   alert("Pulled Successfully.");
    // } else {
    //   alert("Something went wrong");
    // }
    window.location.href = "jkiProcessGrievance?d=" + d;
  });
});

$(document).on("click", ".forward", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  window.location.href = "forwardAplication?d=" + d;
});

$(document).on("click", ".fwdCpgram", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  window.location.href = "fwdGriCpgram?d=" + d;
});

$(document).on("click", ".cpgramStatus", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  //  alert(c)
  window.location.href = "cpgramFwdGri?d=" + d;
});

Listen(document).on("click", ".tt_griev11", function (e) {
  let btnVal = e.target.value;
  if (btnVal == "Normal" || btnVal == "Priority") {
    $(".backBtn").removeClass("visually-hidden");
  }
  if (btnVal == "Back") {
    btnVal = "Home";
    $(".backBtn").addClass("visually-hidden");
  }
  // alert(btnVal)
  getGrievList2(btnVal);
});

// $(document).on("click", ".data-search", function (e) {
//   getGrievList2($(this).val());
// });

//var usrFlg=$('#usrFlg').val();
function getGrievList2(btnVal) {
  // alert(usrFlg);
  if (btnVal == "Home") {
    btnVal = "all_tblHome";
  }
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "api_v2?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // //console.log(JSON.stringify(j))
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
    }

    //console.log(j.data);

    let tblID;
    if (
      btnVal == "all_tblHome" ||
      btnVal == "Normal" ||
      btnVal == "Priority" ||
      btnVal == "forwardedGriOther" ||
      btnVal == "forwardedGriOtherDep" ||
      btnVal == "mobile" ||
      btnVal == "web"
    ) {
      tblID = "all_tblHome";
    } else if (btnVal == "forwardedGri") {
      tblID = "all_tblfwdGrivances";
    } else if (btnVal == "DoesNotPertain") {
      tblID = "all_tblDoesNotPertain";
    } else if (btnVal == "fwdByOtherDep") {
      $("#fwd2-tab-pane").hide();
      $("#doesNotOtherDep-tab-pane").hide();
      tblID = "all_tblfwdByOtherDep";
    } else if (btnVal == "DoesNotPertainOtherDep") {
      $("#doesNotOtherDep-tab-pane").show();
      tblID = "all_tblDoesNotPertainOtherDep";
    }

    var columns = [
      {
        // data: "Sl. No.",
        title: "S. No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "uniqid",
        defaultContent: "",
        title: "Grievance ID",
        render: function (data, type, row, meta) {
          /*if(row.forwarded_flag=="Yes"){
						return "<div> "+ data +"</div><span class='text-danger'>Forwarded</span>";
						}else{
*/ return data;
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
          var name = row.name;
          ////console.log()
          return name;
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
        data: "status",
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
            (row.final_status === undefined ||
              row.final_status === "Proposed Disposed")
          ) {
            return (
              '<div class="btn pe-none btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
              data +
              "</div>"
            );
          } else if (
            data === "Resolved" &&
            (row.final_status === undefined ||
              row.final_status === "Proposed Disposed")
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
            row.final_status == "Final Disposed"
          ) {
            return (
              '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
              data +
              "</div>"
            );
          } else if (
            !["Does not pertain to this office", "dnpToOffice"].includes(
              data
            ) &&
            row.final_status === "Recieved"
          ) {
            return '<div class="btn pe-none btn-success btn-sm yr-mw "><i class="bi bi-x-octagon"></i>Proposed Disposed</div>';
          } else if (
            data === "Appealed" &&
            (row.final_status === undefined ||
              row.final_status === "Proposed Disposed" ||
              row.final_status === "Final Disposed" ||
              row.final_status === "Recieved" ||
              row.final_status === "")
          ) {
            return (
              '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
              data +
              "</div>"
            );
          } else if (
            ["Does not pertain to this office", "dnpToOffice"].includes(data) ||
            row.final_status == "dnpToOffice"
          ) {
            var st = "Does Not Pertain";
            var dd;
            if (row.final_status == "dnpToOffice") {
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
            [undefined, ""].includes(row.final_status)
          ) {
            return (
              '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
              data +
              "</div>"
            );
          } else if (
            data === "Remark Added" &&
            [undefined, "Proposed Disposed"].includes(row.final_status)
          ) {
            return (
              '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #3399FF"><i class="bi bi-exclamation-octagon"></i> ' +
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
          if (
            row.status == "Pending" &&
            row.final_status != "Recieved" &&
            row.final_status != "Proposed Disposed" &&
            row.final_status != "Final Disposed"
          ) {
            return data;
          } else {
            return "";
          }
        },
      },
      {
        data: "uniqid",
        defaultContent: "",
        title: "Forwarded To",
        render: function (data, type, row, meta) {
          var btn = "";
          if (row.status == "Forwarded") {
            btn =
              '<div><a href="#" data-value = "' +
              data +
              '"  class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
          }
          return btn;
        },
      },
    ];

    if (usrFlg != "depSecretary") {
      if (btnVal != "forwardedGri") {
        columns.push({
          data: "uniqid",
          defaultContent: "",
          class: "noExport",
          title: "Action",
          render: function (data, type, row, meta) {
            // console.log(row.final_status)

            var btn =
              '<div class="dropdown">' +
              '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
              '<i class="bi bi-three-dots"></i>' +
              "</button>" +
              '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
              '<li class="border-bottom border-success"><button class="btn btn-sm vDetails" value = "' +
              data +
              '"  data-appflag = "JKSAMADHAN">Grievance Details</button></li>';

            //console.log(row.status+"  "+row.final_status+"  "+row.authority)
            //   var btn ='<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +data + '">History</button>';
            if (
              ["Pending", "Under Process", "Acknowledged"].includes(
                row.status
              ) &&
              ["", undefined].includes(row.final_status)
            ) {
              //  btn = btn +'<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>'+
              //  '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
              btn =
                btn +
                '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' +
                data +
                '">Process</button></li>';

              if (
                ["Pending", "Under Process", "Acknowledged"].includes(
                  row.status
                ) &&
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
            } else if (row.status == "Does not pertain to this office") {
              /*  btn = btn +'<button class="btn btn-sm btn-warning grevP" value = "' + data +'">Process</button>'+
                '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';*/
              btn = btn
                + '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
              //	+ '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
            } else if (row.status == "Forwarded" && row.final_status == "Recieved") {
              btn = btn
                + '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
                + '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Send Back</button></li>';

            } else if (["Forwarded", "Under Process"].includes(row.status) && row.final_status == "dnpToOffice") {
              btn = btn
                + '<li class="border-bottom border-warning"><button class="btn btn-sm grevP" value = "' + data + '">Process</button></li>'
                + '<li class="border-bottom border-success"><button class="btn btn-sm forward" value = "' + data + '">Forward</button></li>';
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
    }
    $(".btn-customBtn").on("click", function () {
      //console.log($(this).val());
      table103.button("." + $(this).val()).trigger();
    });
    var table103 = $("#" + tblID).DataTable({
      data: j.data,
      destroy: true,
      lengthMenu: [10, 50, 100],
      pageLength: 10,
      scrollX: true,
      scrollY: 500,
      responsive: true,
      paging: true,
      ////dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
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
      columns: columns,
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
          "dnpToOffice": "web-application-dnptooffice"
        };

        const customClass = color[data.status]
          ? color[data.status]
          : "web-application-row";

        $(row).addClass(customClass);
      },
    });

    $("#all_tblfwdByOtherDep_filter input[type='search']").on("input", function () {
      // alert("jjjds")

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      table103.search(cleanValue).draw(); // Update DataTable search
    });


    //	table103.columns.adjust().draw();
  });
}

// $(".filterData").click(function(e){
//   var dataValue = $(this).attr('data-value');
//   filterApi(dataValue)
//   //alert(dataValue);
//  // return false;

// })

// function filterApi(btnVal) {
//   // alert(usrFlg);

//   var c = JSON.stringify({
//     value: btnVal,
//   });
//   var d = chkV(c);
//   var settings = {
//     url: "filterApi?d=" + d,
//     method: "POST",
//     timeout: 0,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   $.ajax(settings).done(function (j) {
//     j = setV(j);
//     j = JSON.parse(j);
//    // console.log(JSON.stringify(j))
//     if (j.statusCode != 0 && j.data.length > 0) {
//       j.data = j.data.map((current) => {
//        // console.log(current)
//         if (current.createddate != null) {
//           current.createddate = format_date(current.createddate);
//         }
//         return current;
//       });
//     }

//      let  tblID = "all_tblHome";

//     var columns = [
//       {
//         // data: "Sl. No.",
//         title: "S. No.",
//         render: function (data, type, row, meta) {
//           return meta.row + meta.settings._iDisplayStart + 1;
//         },
//       },
//       {
//         data: "uniqid",
//         defaultContent: "",
//         title: "Grievance ID",
//       },
//       {
//         data: "category",
//         defaultContent: "",
//         title: "Main Category",
//       },
//       {
//         data: "sub_category",
//         defaultContent: "",
//         title: "Sub Category",
//       },
//       {
//         data: "submitted_by",
//         defaultContent: "",
//         title: "Submitted By",
//         render: function (data, type, row, meta) {
//           var name = row.name;
//           return name;
//         },
//       },
//       {
//         data: "createddate",
//         defaultContent: "",
//         title: "Submitted On",
//       },
//       {
//         data: "key_flag",
//         defaultContent: "",
//         title: "Classification",
//       },
//       {
//         data: "status",
//         defaultContent: "",
//         title: "Status",
//         render: function (data, type, row, meta) {

//           if (row.final_status != "Recieved" && row.final_status!="Proposed Disposed" && row.final_status!="Final Disposed"){
//           if (data === "Pending") {
//             var text = "";
//             if (row.reminder == "1") {
//               text = "Kindly take action";
//             } else {
//               text = "";
//             }
//             return (
//               '<div class="btn btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
//               data +
//               "</div><span class='text-danger d-flex blink'>" +
//               text +
//               "</span>"
//             );
//           } else if (data === "Acknowledged") {
//             return (
//               '<div class="btn btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
//               data +
//               "</div>"
//             );
//           } else if (data === "Under Process") {
//             return (
//               '<div class="btn btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
//               data +
//               "</div>"
//             );
//           }
//           else if (data === "Rejected") {
//             return (
//               '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
//               data +
//               "</div>"
//             );
//           }
//           else if (data === "Resolved") {
//             return (
//               '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
//               data +
//               "</div>"
//             );
//           }

//           else if (data == "dnpToOffice") {
//             var st = "Does not pertain";
//             return (
//               '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
//               st +
//               "</div>"
//             );
//           } else if (data === "Appealed") {
//             return (
//               '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
//               data +
//               "</div>"
//             );
//           } else if (data === "Forwarded To CPGRAM") {
//             return (
//               '<div class="btn btn-sm yr-mw " style="background-color: #e7e7e7"><i class="bi bi-exclamation-octagon"></i> ' +
//               data +
//               "</div>"
//             );
//           } else if (data === "Forwarded") {
//             return (
//               '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
//               data +
//               "</div>"
//             );
//           } else {
//             return (
//               '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
//               data +
//               "</div>"
//             );
//           }
//         }else{
//           if (row.final_status == "Recieved" || row.final_status=="Proposed Disposed") {
//             return (
//               '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>Proposed Disposed</div>'
//             );
//           }
//           else if(row.final_status=="Final Disposed"){
//             return  '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>'+row.final_status+'</div>'

//           }

//         }
//         },

//       },
//       {
//         data: "pending_since",
//         defaultContent: "",
//         title: "Pending Since",
//         render: function (data, type, row, meta) {
//           if (row.status == "Pending" && row.final_status!="Recieved" && row.final_status!="Proposed Disposed" && row.final_status!="Final Disposed") {
//             return data;
//           } else {
//             return "";
//           }
//         },
//       },
//       {
//         data: "uniqid",
//         defaultContent: "",
//         title: "Forwarded To",
//         render: function (data, type, row, meta) {
//           var btn = "";
//           if (row.status == "Forwarded") {
//             btn =
//               '<div><a href="#" data-value = "' +
//               data +
//               '"  class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
//           }
//           return btn;
//         },
//       },
//     ];

//     // //console.log(j.statusCode+"    "+btnVal)

//      if (usrFlg!= "depSecretary") {
//     if (btnVal != "forwardedGri") {
//       columns.push({
//         data: "uniqid",
//         defaultContent: "",
//         class: "noExport",
//         title: "Action",
//         render: function (data, type, row, meta) {
//           var btn =
//             '<div class="dropdown">' +
//             '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
//             '<i class="bi bi-three-dots"></i>' +
//             "</button>" +
//             '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
//             '<li class=""><button class="btn btn-sm vDetails" value = "' +
//             data +
//             '" data-appflag = "JKSAMADHAN">Grievance Details</button></li>'
//             // +'<li class=""><button class="btn btn-sm vHis" title = "History" value = "' +
//             // data +
//             // '">History</button></li>';

//           if (
//             btnVal == btnVal
//           ) {
//             if (
//               row.status != "Resolved" &&
//               row.status != "Rejected" &&
//               row.status != "Appealed" &&
//               row.status != "dnpToOffice" &&
//               row.status != "Forwarded To CPGRAM" &&
//               row.status != "Closed"
//             ) {
//               btn =
//                 btn +
//                 '<li class=""><button class="btn btn-sm grevP" value = "' +
//                 data +
//                 '">Process</button></li>' +
//                 '<li class=""><button class="btn btn-sm forward" value = "' +
//                 data +
//                 '">Forward</button></li>' +
//                 '<li class=""><button class="btn btn-sm fwdCpgram text-start" value = "' +
//                 data +
//                 '">Forward to CPGRAM</button></li>';
//             } else if (row.status == "Forwarded To CPGRAM") {
//               btn =
//                 btn +
//                 '<li><button class="btn btn-sm  cpgramStatus" value = "' +
//                 data +
//                 '" style="background-color: #e7e7e7">Check</button></li>';
//             }
//           } else if (btnVal == "DoesNotPertain") {
//             btn =
//               btn +
//               '<li><button class="btn btn-sm grevP" value = "' +
//               data +
//               '">Process</button></li>' +
//               '<li><button class="btn btn-sm forward" value = "' +
//               data +
//               '">Forward</button></li>';
//           } else if (
//             btnVal == "fwdByOtherDep" &&
//             row.status != "Resolved" &&
//             row.status != "Rejected" &&
//             row.status != "Appealed" &&
//             row.status != "Does not pertain to this division"
//           ) {
//             btn =
//               btn +
//               '<li><button class="btn btn-sm grevP" value = "' +
//               data +
//               '">Process</button></li>' +
//               '<li><button class="btn btn-sm forward" value = "' +
//               data +
//               '">Forward</button></li>';
//           }

//           return btn + "</ul></div>";
//         },
//       });
//     }
//   }
//     $(".btn-customBtn").on("click", function () {
//       //  // //console.log($(this).val());
//       table103.button("." + $(this).val()).trigger();
//     });
//     var table103 = $("#" + tblID).DataTable({
//       data: j.data,
//       destroy: true,
//       lengthMenu: [10, 50, 100],
//       pageLength: 10,
//       scrollX: true,
//       scrollY: 500,
//       responsive: true,
//       paging: true,
//       buttons: [
//         {
//           extend: "excel",
//           title: "JKGOVT",
//           messageTop: "The information in this table is copyright to JK GOVT.",
//           exportOptions: {
//             columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
//         }
//         },
//         {
//           extend: "pdf",
//           title: "JKGOVT",
//           messageBottom:
//             "The information in this table is copyright to JK GOVT.",
//           pageSize: "A4",
//           download: "open",
//           customize: function (doc) {
//             // Set the page orientation and size
//             doc.pageSize = 'A4';
//             doc.pageOrientation = 'landscape';

//             // Adjust the content styling
//             doc.styles.tableHeader.fontSize = 8;
//             doc.styles.tableBodyOdd.fontSize = 8;
//             doc.styles.tableBodyEven.fontSize = 8;

//              // Center the table content
//              var rowCount = doc.content[1].table.body.length;
//              for (var i = 0; i < rowCount; i++) {
//                  var row = doc.content[1].table.body[i];
//                  for (var j = 0; j < row.length; j++) {
//                      row[j].alignment = 'center';
//                  }
//              }

//             // Scale the table width to fit the page
//             var totalColumns = doc.content[1].table.body[0].length;
//             var columnWidths = [];
//             for (var i = 0; i < totalColumns; i++) {
//                 columnWidths.push('*');
//             }
//             doc.content[1].table.widths = columnWidths;
//         },
//         exportOptions: {
//             columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
//         }
//         },
//       ],
//       columns: columns,
//       rowCallback: function (row, data) {

//         if (data.application === "webapp") {
//           $(row).addClass("web-application-row");
//         } else {
//           $(row).addClass("other-application-row");
//         }
//       },
//     });
// //	table103.columns.adjust().draw();

//   })
// }

// $(document).on('click','.grievance-btn',function(e){
//   // alert(e.target.value)
//   var d = chkV(e.target.value);
//   var settings = {
//     url: "viewGRVdetailsModal?d=" + d,
//     method: "POST",
//     timeout: 0,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   $.ajax(settings).done(function (j) {
//     j = setV(j);
//     j = JSON.parse(j);
//     if (j.data != "") {
//       //console.log(j.data)
//       //console.log(j.data[0].name)
//       $('#grvID').text(j.data[0].uniqid);
//       $('#usrName').text(j.data[0].name);
//       $('#mobNo').text(j.data[0].mobile);
//       $('#emailId').text(j.data[0].email);
//       $('#add').text(j.data[0].address);
//       $('#pincode').text(j.data[0].pincode);
//       $('#dep').text(j.data[0].department);
//       $('#cat').text(j.data[0].category);
//       $('#dep').text(j.data[0].department);
//       $('#dep').text(j.data[0].department);

//     }
//   });
// });

//	$(window).on('resize', function() {
//	  checkWidth();
//	});

$(document).on("click", ".fwd", function (e) {
  let gId = this.getAttribute("data-value");
  ////console.log(this.getAttribute('data-value'));
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
  ////console.log(d)
  $("#assignedTable").html("");
  $("#assignedUsersList").modal("show");

  var columns = [
    {
      // data: "Sl. No.",
      title: "S. No.",
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
    // {
    //   data: "remarks",
    //   defaultContent: "",
    //   title: "Remark",
    // },
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
        //	//console.log(data)
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
  ];

  $(".btn-customBtn").on("click", function () {
    // //console.log($(this).val());
    table104.button("." + $(this).val()).trigger();
  });

  var table104 = $("#assignedTable").DataTable({
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
  $("#assignedTable_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table104.search(cleanValue).draw(); // Update DataTable search
  });
  table104.columns.adjust().draw();
}

///appeal --> 03-03-2-24
$(document).on("click", ".appP", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  console.log(c)
  // window.open("historyGrievance?d=" + d, "_blank");
  // window.location.href = "procesAppeal?d=" + d;
  window.location.href = "showAppealDetails?d=" + d;
});
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
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

// $("input[name='userType']").click(function () {
// $("#userType").change(function () {
function getUserType(selectedUserType) {

  var dep = $("#selDept").find(":selected").val();
  // var val = $(this).val();

  var val = selectedUserType;
  $("#selUsrType").html("");
  $("#selUsrType").append('<option value="0">Select User Type</option>');
  var c = JSON.stringify({
    value: val,
    dep: dep,
  });

  //console.log(c);
  var d = chkV(c);
  var settings = {
    url: "getUserTypr?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // //console.log(j)
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
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    //  //console.log(j)
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
    //  //console.log(j)
    // alert(JSON.stringify(j))
    if (j.statusCode == "1") {
      makeDropdown(designation, j.data);
    } else {
    }
  });
});

// $("#selUsrType").change(function () {
//   var dep = $("#selDept").find(":selected").val();
//   var val = $("#selUsrType").find(":selected").val();
//   $("#designation").html("");
//   $("#designation").append('<option value="0">Select Designation</option>');
//   var c = JSON.stringify({
//     value: val,
//     dep: dep,
//   });
//   var d = chkV(c);
//   var settings = {
//     url: "getUserDesignation?d=" + d,
//     method: "POST",
//     timeout: 0,
//       headers: {
//         "Content-Type": "application/json",
//       },
//   };
//   $.ajax(settings).done(function (j) {
//     j = setV(j);
//     j = JSON.parse(j);
//     //  //console.log(j)
//     // alert(JSON.stringify(j))
//     if (j.statusCode == "1") {
//       makeDropdown(designation, j.data);
//     } else {
//     }
//   });
// });
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
    // //console.log(j)

    if (j.statusCode == "1") {
      getAgeAnalysis(j.data);
    } else {
      getAgeAnalysis(0);
    }
  });
}

function getAgeAnalysis(data) {
  $(".btnAA-customBtn").on("click", function () {
    // //console.log($(this).val());
    table105.button("." + $(this).val()).trigger();
  });

  var table105 = $("#dhltbl").DataTable({
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
        title: "S. No.",
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
      {
        data: "user_assigned",
        defaultContent: "",
        title: "User Type",
      },
      {
        data: "district",
        defaultContent: "",
        title: "District",
         render: function (data, type, row) {
        if (!data) return "";

        // remove apostrophes + trim
        return data.replace(/'/g, "").trim();
      },
      },
      // {
      //   data: "department",
      //   defaultContent: "",
      //   title: "Department",
      // },
      /* {
        data: "assigned_to",
        defaultContent: "",
        title: "Email",
      },*/
      {
        data: "d1",
        defaultContent: "",
        title: "0 - 7 Days",
        render: function (data, type, row) {
          // var dataAttributes =
          //   row.d1_ids == null
          //     ? 'data-grvid="NA"'
          //     : 'data-grvid="' + chkA(row.d1_ids) + '"';
          var dataAttributes =
            'data-assignedto="' +
            row.assigned_to +
            '" ' +
            'data-grvid="' +
            chkA(row.d1_ids) +
            '"';
          return (
            '<button class="btn btn-sm btn-link action-btn2" data-toggle="modal" data-target="#myModal" ' +
            dataAttributes +
            ">" +
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
          // var dataAttributes =
          //   row.d2_ids == null
          //     ? 'data-grvid="NA"'
          //     : 'data-grvid="' + chkA(row.d2_ids) + '"';
          var dataAttributes =
            'data-assignedto="' +
            row.assigned_to +
            '" ' +
            'data-grvid="' +
            chkA(row.d2_ids) +
            '"';
          return (
            '<button class="btn btn-sm btn-link action-btn2" data-toggle="modal" data-target="#myModal" ' +
            dataAttributes +
            ">" +
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
          // var dataAttributes =
          //   row.d3_ids == null
          //     ? 'data-grvid="NA"'
          //     : 'data-grvid="' + chkA(row.d3_ids) + '"';
          var dataAttributes =
            'data-assignedto="' +
            row.assigned_to +
            '" ' +
            'data-grvid="' +
            chkA(row.d3_ids) +
            '"';
          return (
            '<button class="btn btn-sm btn-link action-btn2" data-toggle="modal" data-target="#myModal" ' +
            dataAttributes +
            ">" +
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
          // var dataAttributes = row.d4_ids == null ? 'data-grvid="NA"': 'data-grvid="' + chkA(row.d4_ids) + '"';
          var dataAttributes =
            'data-assignedto="' +
            row.assigned_to +
            '" ' +
            'data-grvid="' +
            chkA(row.d4_ids) +
            '"';
          return (
            '<button class="btn btn-sm btn-link action-btn2" data-toggle="modal" data-target="#myModal" ' +
            dataAttributes +
            ">" +
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
          // var dataAttributes = row.d4_ids == null ? 'data-grvid="NA"': 'data-grvid="' + chkA(row.d4_ids) + '"';
          var dataAttributes =
            'data-assignedto="' +
            row.assigned_to +
            '" ' +
            'data-grvid="' +
            chkA(row.d5_ids) +
            '"';
          return (
            '<button class="btn btn-sm btn-link action-btn2" data-toggle="modal" data-target="#myModal" ' +
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
    table105.search(cleanValue).draw(); // Update DataTable search
  });
}

$(document).on("click", ".action-btn2", function (e) {
  // //console.log(setV($(this).data("grvid")));
  // //console.log($(this).data("assignedto"));

  var assigned_to = $(this).data("assignedto");
  var grvID = setV($(this).data("grvid"));
  if (grvID != "NA") {
    var c = JSON.stringify({
      grvID: grvID,
      assigned_to: assigned_to,
    });
    var d = chkV(c);
    sessionStorage.setItem("actiondata2", d);
    window.location.href = "dviewAge";
  } else {
    alert("No Data Available.");
  }
});

function detailedviewAge1(data) {
  // //console.log(data);
  // //console.log("working");
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
    // //console.log(j);
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
  // //console.log("detailsAgeTbl working..")

  $(".btn-customBtn").on("click", function () {
    // //console.log($(this).val());
    table106.button("." + $(this).val()).trigger();
  });

  var table106 = $("#AgeDetailedDataTable").DataTable({
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
        title: "S. No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "full_name",
        defaultContent: "",
        title: "Username",
      },
      {
        data: "assigned_to",
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
    table106.search(cleanValue).draw(); // Update DataTable search
  });
}

$(document).on("click", ".action-btn6", function (e) {
  // //console.log($(this).data("grvid"))
  var value = e.target.value;
  var status = $(this).data("status");
  var assignedto = $(this).data("assignedto");
  // //console.log(status);
  // //console.log(assignedto);
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
    //  //console.log("Data to be sent is ", c);
    $.ajax(settings).done(function (j) {
      j = JSON.parse(setV(j));
      // //console.log(j)

      if (j.statusCode == "1" && j.data.length > 0) {
        j.data = j.data.map((current) => {
          if (current.createddate != null) {
            current.createddate = format_date(current.createddate);
          }
          return current;
        });

        $(".btn-customBtn").on("click", function () {
          // //console.log($(this).val());
          table107.button("." + $(this).val()).trigger();
        });

        var table107 = $("#ageStatWiseReport").DataTable({
          data: j.data,
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
              title: "S. No.",
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
          }
        });

        $("#ageStatWiseReport_filter input[type='search']").on("input", function () {
          // alert("jjjds")

          var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
          $(this).val(cleanValue);
          table107.search(cleanValue).draw(); // Update DataTable search
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
    // //console.log(j)

    if (j.statusCode == "1") {
      getUserWiseReport(j.data);
    } else {
      getUserWiseReport(0);
    }
  });
}

function getUserWiseReport(data) {
  $(".btnSW-customBtn").on("click", function () {
    // //console.log($(this).val());
    table108.button("." + $(this).val()).trigger();
  });

  var table108 = $("#dhltbl").DataTable({
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
        title: "S. No.",
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
    table108.search(cleanValue).draw(); // Update DataTable search
  });
}

$(document).on("click", ".action-btn3", function (e) {
  // //console.log($(this).data("grvid"))
  var status = $(this).data("status");
  var grvID = $(this).data("grvid");
  // //console.log(grvID);
  if (setV(grvID) != "NA") {
    var c = JSON.stringify({
      status: status,
      grvID: setV(grvID),
    });
    var d = chkV(c);
    sessionStorage.setItem("data", d);
    window.location.href = "detailedviewUW";
  } else {
    alert("No Data Available.");
  }
});
function detailedViewForUW(data) {
  // //console.log(data);
  // //console.log("working");
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
    // //console.log(j);
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
    // //console.log($(this).val());
    table109.button("." + $(this).val()).trigger();
  });

  var table109 = $("#UWdetailedDataTable").DataTable({
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
        title: "S. No.",
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
    }
  });

  $("#UWdetailedDataTable_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table109.search(cleanValue).draw(); // Update DataTable search
  });
}
// USer Wise

$("#griDoc").click(function () {
  var c = $(this).attr("value");
  let d = chkV(c);
  //  window.location.href = "downloadCPGRAMDoc?d=" + d;
});
$("#caseClose").click(function () {
  var regNo = $("#regNo").text();
  var name = $("#name").text();
  var dor = $("#dor").text();
  var recOrg = $("#recOrg").text();
  var griDetail = $("#griDetail").text();
  var remark = $("#remark").text();
  var doa = $("#doa").text();
  var currentStatus = $("#curStatus").text();
  var perToorg = $("#toOrg").text();

  var c = JSON.stringify({
    regNo: regNo,
    name: name,
    dor: dor,
    recOrg: recOrg,
    griDetail: griDetail,
    remark: remark,
    doa: doa,
    currentStatus: currentStatus,
    perToorg: perToorg,
  });
  var d = chkV(c);
  var settings = {
    url: "closeCPGRAMGrievance?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  //  //console.log("Data to be sent is ", c);
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));

    if (j.statusCode == "1") {
      alert("Application closed");
      window.location.href = "home";
    } else {
      alert("Something went wrong");
    }
    // //console.log(j)
  });
});

$("#yrFwdIntDep").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos1");
  x.pause();
});

$("#yrFwdHis").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos2");
  x.pause();
});

$("#yrAnalDas").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos3");
  x.pause();
});

$("#yrCrtUsr").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos4");
  x.pause();
});

$("#yrMapUpdat").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos5");
  x.pause();
});

$("#yrCPGRAMGri").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos6");
  x.pause();
});

$("#yrProcess").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos8");
  x.pause();
});

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

  //alert(appflag)

  var c = JSON.stringify({
    radioVal: appflag,
    gId: e.target.value,
  });
  let d = chkV(c);
  // window.location.href = "grievanceDatail?d=" + d;
  window.open("grievanceDatail?d=" + d, "_blank");
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

$(document).on("click", ".grievanceprint", function () {
  var contentdiv = $(this).attr("data-value");
  var divToPrint = $("#" + contentdiv);
  var newWin = window.open("", "Print-Window");

  newWin.document.open();
  newWin.document.write(
    '<html><head><title>Print</title></head><body onload="window.print()">' +
    divToPrint.innerHTML +
    "</body></html>"
  );
  newWin.document.close();

  setTimeout(function () {
    newWin.close();
  }, 10);
});

/*$("#newdeptname").change(function () {
    var addDeptV = $("#newdeptname").find(":selected").val();
    $("#addnewDesig").html("");
    $("#addnewDesig").append(
      '<option value="0">Select</option><option value="adddesg">Add new Designation</option>'
    );
    $("#addnewDesig").prop("disabled", false);
    if (addDeptV != "") {
      if (addDeptV == "addoffice") {
       
      } else {
        var c = JSON.stringify({
          value: addDeptV,
        });
        var d = chkV(c);
        var settings = {
          url: "getDesgListBydept?d=" + d,
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
            ////console.log(categ)
            makeDropdown(addnewDesig, j.data);
          }
        });
      }
    } else {
   
    }
  });*/

// JKIGRAMS

function jkiGramForNodal() {
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
          '" data-appflag = "JKIGRAMS">Grievance Details</button></li>';
        // +'<li class=""><button class="btn btn-sm vHis" title = "History" value = "' +
        // data +
        // '">History</button></li>';

        if (
          row.action != "Resolved" &&
          row.action != "Rejected" &&
          row.action != "Appealed" &&
          row.action != "dnpToOffice" &&
          row.action != "Forwarded To CPGRAM" &&
          row.action != "Closed"
        ) {
          btn =
            btn +
            '<li class=""><button class="btn btn-sm grevPJKI" value = "' +
            data +
            '">Process</button></li>' +
            '<li class=""><button class="btn btn-sm forward" value = "' +
            data +
            '">Forward</button></li>' +
            '<li class=""><button class="btn btn-sm fwdCpgram text-start" value = "' +
            data +
            '">Forward to CPGRAM</button></li>';
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
    table110.button("." + $(this).val()).trigger();
  });
  var table110 = $("#YRreport010").DataTable({
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
      url: "jkIgramsforNodalApi",
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

// Server Side datatable - start
var globalUserType;
var globalAllData;
var usrFlg = $("#usrFlg").val();
function serverSideDT() {
  // console.log("Inside Server Side DT");

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
    table103.ajax.reload();
  });

  //  Filter table on clickable dashbaord tabs
  // Defualt Value is All i.e is Total
  var localClickVal = "Total";
  $(document).on("click", ".filterData", function () {
    var clickedValue = $(this).attr("data-value");
    console.log("clickedValue :: " + clickedValue);
    // override localFilterVal based on the click event
    localClickVal = clickedValue;
    table103.ajax.reload();
  });

  var column = [
    {
      // data: "Sl. No.",
      title: "S. No.",
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
        let button = '<span class = "btn btn-link text-decoration-none">' + data + '</span>';
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
      data: "submitted_by",
      defaultContent: "",
      title: "Submitted By",
      render: function (data, type, row, meta) {
        var name = row.name;
        ////console.log()
        return name;
      },
    },
    {
      data: "createddate",
      defaultContent: "",
      title: "Submitted On",
      render: function (data, type, row, meta) {
        return format_date(row.createddate);
      },
    },
    {
      data: "status",
      defaultContent: "",
      title: "Status",
      render: function (data, type, row, meta) {
        //     if (row.final_status != "Recieved" && row.final_status!="Proposed Disposed" && row.final_status!="Final Disposed"){
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
        } else if (
          data === "Rejected" &&
          row.final_status == "Final Disposed"
        ) {
          return (
            '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
            row.final_status +
            "</div>"
          );
        } else if (
          data === "Resolved" &&
          row.final_status == "Final Disposed"
        ) {
          return (
            '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
            row.final_status +
            "</div>"
          );
        } else if (data == "dnpToOffice" && row.final_status == "") {
          var st = "Does not pertain";
          return (
            '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
            st +
            "</div>"
          );
        } else if (data === "Appealed" && row.final_status == "") {
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
        } else if (
          data === "Forwarded" &&
          (row.final_status === "" || row.final_status === undefined)
        ) {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (
          data === "Forwarded" &&
          ["Recieved", "Proposed Disposed"].includes(row.final_status)
        ) {
          return (
            '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
            "Proposed Disposed" +
            "</div>"
          );
        } else if (
          data === "Forwarded" &&
          ["dnpToOffice"].includes(row.final_status)
        ) {
          return (
            '<div class="btn pe-none btn-dangar btn-sm yr-mw " style="background-color:#fffc33"><i class="bi bi-exclamation-octagon"></i>' +
            "Does Not Pertain" +
            "</div>"
          );
        } else {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        }
        // }else{
        //   if (row.final_status == "Recieved" || row.final_status=="Proposed Disposed") {
        //     return (
        //       '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>Proposed Disposed</div>'
        //     );
        //   }
        //   else if(row.final_status=="Final Disposed"){
        //     return  '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i>'+row.final_status+'</div>'

        //   }

        // }
      },
    },
    {
      data: "days_since_elapsed",
      defaultContent: "",
      title: "Pending Since",
      // render: function (data, type, row, meta) {
      //   if (
      //     row.status == "Pending" &&
      //     row.final_status != "Recieved" &&
      //     row.final_status != "Proposed Disposed" &&
      //     row.final_status != "Final Disposed"
      //   ) {
      //     return data;
      //   } else {
      //     return "";
      //   }
      // },
    },
    // {
    //   data: "uniqid",
    //   defaultContent: "",
    //   title: "Forwarded To",
    //   render: function (data, type, row, meta) {
    //     var btn = "";
    //     if (row.status == "Forwarded") {
    //       btn =
    //         '<div><a href="#" data-value = "' +
    //         data +
    //         '"  class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
    //     }
    //     return btn;
    //   },
    // },

    // new changes by utkarsh for forwarded To add name and office_name - 16-03-2026
    {
      data: "uniqid",
      defaultContent: "",
      title: "Forwarded To",
      render: function (data, type, row, meta) {

        if (row.status == "Forwarded") {

          var nameOffice = "";
          if (row.forwarded_to_name) {
            nameOffice = row.forwarded_to_name +
              (row.forwarded_to_office ? " | " + row.forwarded_to_office : "");
          }

          if (type === "export") {
            return nameOffice || "";
          }

          // Display only name and office (eye icon removed)
          return nameOffice ? '<span class="d-block medium mt-1">' + nameOffice + '</span>' : "";
        }

        return "";
      },
    },
    // end of changes by utkarsh - 16-03-2026
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

  var btnVal = "all_tblHome";
  // console.log(btnVal)

  if (usrFlg != "depSecretary") {
    if (btnVal != "forwardedGri") {
      column.unshift({
        // Add Action column at the beginning
        data: "uniqid",
        defaultContent: "",
        class: "noExport",
        title: "Action",
        render: function (data, type, row, meta) {

          //  console.log(row.status+"  "+row.final_status+"  "+data)

          var btn =
            '<div class="dropdown">' +
            '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
            '<i class="bi bi-three-dots"></i>' +
            "</button>" +
            '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">'
            + '<li class=""><button class="btn btn-sm vDetails" value = "' +
            data +
            '" data-appflag = "JKSAMADHAN">Grievance Details</button></li>'
          // +'<li class=""><button class="btn btn-sm vHis" title = "History" value = "' +
          // data +
          // '">History</button></li>';

          if (btnVal == "all_tblHome") {

            // if (row.status != "Resolved" && row.status != "Rejected" && row.status != "Appealed" && row.status != "dnpToOffice" && row.status != "Forwarded To CPGRAM" && row.status != "Closed" && (row.status != "Forwarded" || row.final_status == "Recieved")) {
            if (["Pending", "Acknowledged", "Under Process"].includes(row.status)) {

              btn =
                btn +
                '<li class=""><button class="btn btn-sm grevP" value = "' +
                data +
                '">Process</button></li>' +
                '<li class=""><button class="btn btn-sm forward" value = "' +
                data +
                '">Forward</button></li>' +
                '<li class=""><button class="btn btn-sm fwdCpgram text-start" value = "' +
                data +
                '">Forward to CPGRAM</button></li>';
            } else if (row.status == "Forwarded To CPGRAM") {
              btn =
                btn +
                '<li><button class="btn btn-sm  cpgramStatus" value = "' +
                data +
                '" style="background-color: #e7e7e7">Check</button></li>';
            } else if (["Forwarded", "Under Process"].includes(row.status) && (["Proposed Disposed", "dnpToOffice"].includes(row.final_status))) {

              btn =
                btn +
                '<li class=""><button class="btn btn-sm grevP" value = "' +
                data +
                '">Process</button></li>' +
                '<li class=""><button class="btn btn-sm forward" value = "' +
                data +
                '">Forward</button></li>';

            } else if (["Forwarded"].includes(row.status) && (["Recieved"].includes(row.final_status))) {

              btn =
                btn +
                '<li class=""><button class="btn btn-sm grevP" value = "' +
                data +
                '">Process</button></li>' +
                '<li class=""><button class="btn btn-sm forward" value = "' +
                data +
                '">Send Back</button></li>';
            }

          } else if (btnVal == "DoesNotPertain") {
            btn =
              btn +
              '<li><button class="btn btn-sm grevP" value = "' +
              data +
              '">Process</button></li>' +
              '<li><button class="btn btn-sm forward" value = "' +
              data +
              '">Forward</button></li>';
          } else if (
            btnVal == "fwdByOtherDep" &&
            row.status != "Resolved" &&
            row.status != "Rejected" &&
            row.status != "Appealed" &&
            row.status != "Does not pertain to this division"
          ) {
            btn =
              btn +
              '<li><button class="btn btn-sm grevP" value = "' +
              data +
              '">Process</button></li>' +
              '<li><button class="btn btn-sm forward" value = "' +
              data +
              '">Forward</button></li>';
          }

          /*else if (btnVal == "DoesNotPertain"){
             if(row.status == "Does not pertain to this division" && row.doesnotpertain_status == "catMisMatch"){
               btn = btn + '<button class="btn btn-sm btn-danger grevP" value = "' + data + '">Edit</button>';
               return btn;
             }
           }*/
          return btn + "</ul></div>";
        },
      });
    }
  }

  var table103 = $("#all_tblHome").DataTable({
    destroy: true,
    serverSide: true, // Enable server-side processing
    processing: true, // Show a loading indicator
    scrollX: true, // Horizontal Scroll
    ajax: {
      url: "allDataNew",
      type: "POST",
      contentType: "application/json",
      data: function (d) {
        d.filterValue = localFilterVal; // Send filteredValue with the value of selected radio button
        d.clickedValue = localClickVal; // Send clickedValue with the value of clicked dashboard tab
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

          // Adjust width of the first column dynamically
          columnWidths.push("auto"); // 'auto' for the first column
          columnWidths.push("auto"); // Adjust others similarly if needed

          // Use '*' for other columns to distribute evenly
          for (var i = 2; i < totalColumns; i++) {
            columnWidths.push("*");
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
        "dnpToOffice": "web-application-dnptooffice"
      };

      const customClass = color[data.status]
        ? color[data.status]
        : "web-application-row";

      $(row).addClass(customClass);
    },
    order: [[6, "desc"]], // Default sorting by the second column (Grievance ID i.e uniqid)
    lengthMenu: [10, 50, 100, 500, 1000], // Page length options
    pageLength: 10, // Default page length
  });

  $("#all_tblHome_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table103.search(cleanValue).draw(); // Update DataTable search
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
      table103.ajax.reload();
    } else {
      btn = "." + btn;
      $.ajax({
        url: "allDataNew",
        type: "POST",
        contentType: "application/json",
        data: chkV(
          JSON.stringify({
            start: 0, // Request all data from the backend
            length: -1, // Indicate fetch-all
            filterValue: localFilterVal, // Send filteredValue with the value of selected radio button
            clickedValue: localClickVal, // Send clickedValue with the value of clicked dashboard tab
            columns: table103.settings().init().columns, // Pass column definitions
          })
        ),
        success: function (response) {
          var allData = response.data;
          //console.log(allData)
          var originalData = table103.data().toArray(); // Backup current data
          //console.log(originalData)

          // Temporarily load all data into DataTable for export
          table103.clear().rows.add(allData).draw(false);

          // Trigger export
          // $.fn.dataTable.ext.buttons[exportType + "Html5"].action.call(this, e, table103, button, config);
          table103.button(btn).trigger();

          // Restore original data
          table103.clear().rows.add(originalData).draw(false);
        },
        error: function (xhr) {
          console.error("Failed to fetch all data for export", xhr);
          table103.processing(false); // Disable processing if error occurs
        },
      });
    }
  });

  $("#YRreport999 tbody").on("click", ".griDetails", function () {
    var uniqid = $(this).data("uniqid");
    let d = chkV(uniqid);
    window.open("viewApp?d=" + d, "_blank");
  });
}
// Server Side datatable - end

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

// AALOWING ONLY SPACES, NUMBERS AND DIGITS 
$("#annoucement").on("keyup", function () {
  this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ');
});
// CREATING ANNOUNCEMENT
$("#createAnnoucementBtn").on("click", function () {
  const to = $("#announcementTo").val();
  const validTilldate = $("#validTill").val();
  const announcement = $("#annoucement").val();

  const today = new Date();
  const vaildTill = new Date(validTilldate);

  if (vaildTill < today) {
    alert("Valid Till date cannot be less than current time");
    return;
  }

  if (announcement.trim().length === 0) {
    alert("Please enter announement.");
    return;
  }

  //Naitik Changes on popup 09/10/2025

  if (!confirm("Are you sure that you want to create this Announcement?")) {
    return;
  }

  //Naitik Changes End on popup 09/10/2025
  const d = chkV(
    JSON.stringify({
      to: to,
      valid: vaildTill,
      announcement: announcement,
      sessionvalue: $("#sessionvalue").val(),
      sessionname: $("#sessionname").val()
    })
  );

  const formData = new FormData();
  formData.append("d", d);
  const addfile = document.getElementById("addfile");
  if (addfile.files.length > 0) {
    formData.append("file", addfile.files[0]);
  }
  $.ajax({
    url: "create-announcement",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      response = JSON.parse(setV(response));
      if (response.statusCode === "1") {
        alert("Announcement created successfully.");
        $("#validTill").val("");
        $("#annoucement").val("");
        $("#createAnnoucementModal").modal("toggle");
        window.location.reload();
      } else if (response.statusCode === "2") {
        alert(response.message);
      }
    },
    error: function (xhr) {
      //  console.error(xhr);
    },
  });
});

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

  var table120 = $("#all_tblappeal").DataTable({
    data: d,
    destroy: true,
    responsive: true,
    pageLength: 10,
    scrollX: true,
    paging: true,
    columns: columns,
    scrollY: "auto",
  });
  table120.columns.adjust().draw();

}
$(document).on("click", ".viewAdminAppeal", function () {
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
    console.log(j)
    $("#yr-appealtable").append(
      '<table class="table table-bordered table-striped" id="all_tblappeal" style="width: 100%;"></table>'
    );
    document.getElementById("appealTabData").style.display = "block";

    makeDataTable2(j, "Appeal");
  });
  // localClickVal = clickedValue;
  // table120.ajax.reload();
});
function thisAppeal(e) {
  let c = e.id;
  let d = chkV(c);
  window.location.href = "showAppealDetails?d=" + d;
}


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
    window.location.href = "home";
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
    window.location.href = "home";
  });
}


$("#email").keypress(function (e) {
  //console.log($(this).val())
  return validTextArea(e);
});

$("#password").keypress(function (e) {
  //console.log($(this).val())
  return validPassword(e);
});

$("#annoucement").keypress(function (e) {
  //console.log($(this).val())
  return validTextArea(e);
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

//conPenrptData("userwise");
function conPenrptData(radioVal) {
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
  $(".btnPD-customBtn").on("click", function () {
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

//added by utkarsh for nodal filtering in age analysis report - start
// Store raw data globally for filtering (set after agePendingAreportData loads)
var ageRawData = [];

// Override getAgeAnalysis to also store raw data
var _originalGetAgeAnalysis = getAgeAnalysis;
// We'll patch ageRawData inside agePendingAreportData instead (see below)

// Apply Filter button
$(document).on("click", "#applyAgeFilter", function () {
    var selectedDistrict = $("#ageFilterDistrict").val();
    var selectedDept = $("#ageFilterDept").val();

    var selectedDistrictVal = (selectedDistrict || "").toString().trim().toLowerCase();
    var selectedDeptVal = (selectedDept || "").toString().trim().toLowerCase();

    var filtered = ageRawData.filter(function (row) {
        var districtMatch = true;
        var deptMatch = true;

        // DISTRICT FILTER (CLEAN + SPLIT SAME AS DROPDOWN)
        if (selectedDistrictVal !== "") {
            var distRaw = (row.district_name || row.district || "")
                .toString()
                .replace(/['"]/g, "")
                .trim()
                .toLowerCase();

            var distList = distRaw.split(",");

            districtMatch = distList.some(function (d) {
                var clean = d.trim();

                // skip invalid values
                if (
                    !clean ||
                    clean === "n.a" ||
                    clean === "na" ||
                    clean === "0" ||
                    clean === "null"
                ) return false;

                return clean === selectedDistrictVal;
            });
        }

        // DEPARTMENT FILTER (CLEANED)
        if (selectedDeptVal !== "") {
            var deptRaw = (row.department_name || row.department || "")
                .toString()
                .replace(/['"]/g, "")
                .trim()
                .toLowerCase();

            if (
                deptRaw === "n.a" ||
                deptRaw === "na" ||
                deptRaw === "0" ||
                deptRaw === "null"
            ) {
                deptMatch = false;
            } else {
                deptMatch = deptRaw === selectedDeptVal;
            }
        }

        return districtMatch && deptMatch;
    });

    // Update DataTable
    if ($.fn.DataTable.isDataTable("#dhltbl")) {
        $("#dhltbl").DataTable().clear().rows.add(filtered).draw();
    }

    // Close offcanvas
    var offcanvasEl = document.getElementById("filterOffcanvas");
    var bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
});
//end by utkarsh of nodal filtering in age analysis report - 05-05-2026
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
     ageRawData = j.data || [];
     populateAgeFilterDropdownsFromData(ageRawData);
    // console.log(j);
    getAgeAnalysis(j.data, radioVal);
  });
}
//added by utkarsh 05-05-2026 for nodal filtering in age analysis report - start
function populateAgeFilterDropdownsFromData(data) {
    var districts = {};
    var departments = {};

    $.each(data, function (i, row) {

        //  CLEAN DISTRICT RAW VALUE
        var distRaw = (row.district_name || row.district || "")
            .toString()
            .replace(/['"]/g, "")   // remove quotes
            .trim();

        //  CLEAN DEPARTMENT RAW VALUE
        var deptRaw = (row.department_name || row.department || "")
            .toString()
            .replace(/['"]/g, "")
            .trim();

        //  HANDLE MULTIPLE DISTRICTS
        if (distRaw) {
            var distList = distRaw.split(",");

            distList.forEach(function (d) {
                var cleanDist = d.trim();

                // ❌ SKIP INVALID VALUES
                if (
                    !cleanDist ||
                    cleanDist.toLowerCase() === "n.a" ||
                    cleanDist.toLowerCase() === "na" ||
                    cleanDist === "0" ||
                    cleanDist.toLowerCase() === "null"
                ) {
                    return;
                }

                var key = cleanDist.toLowerCase();
                districts[key] = cleanDist;
            });
        }

        //  HANDLE DEPARTMENT
        if (deptRaw) {
            var cleanDept = deptRaw.trim();

            // ❌ SKIP INVALID VALUES
            if (
                cleanDept.toLowerCase() === "n.a" ||
                cleanDept.toLowerCase() === "na" ||
                cleanDept === "0" ||
                cleanDept.toLowerCase() === "null"
            ) {
                return;
            }

            var deptKey = cleanDept.toLowerCase();
            departments[deptKey] = cleanDept;
        }
    });

    //  Populate district dropdown
    var distSelect = $("#ageFilterDistrict");
    distSelect.html('<option value="">Districts</option>');
    $.each(Object.keys(districts).sort(), function (i, key) {
        distSelect.append('<option value="' + districts[key] + '">' + districts[key] + '</option>');
    });

    //  Populate department dropdown
    var deptSelect = $("#ageFilterDept");
    deptSelect.html('<option value="">Departments</option>');
    $.each(Object.keys(departments).sort(), function (i, key) {
        deptSelect.append('<option value="' + departments[key] + '">' + departments[key] + '</option>');
    });
}

// End by utkarsh 05-05-2026 for nodal filtering in age analysis report

// For District Wise MIS Report (With origin/appflag to filter distrcit data) - 09 May 2025 - SKY
if (window.location.href.includes("/distWiseRpt")) {
  let defaultValue = "'JKSAMADHAN', 'RAABITA'";
  distWiseReport(defaultValue);
  $("#pills-tab-AA").on("click", "button", function () {
    defaultValue = $(this).data("value");
    distWiseReport(defaultValue);
  });
}

function distWiseReport(defaultValue) {
  let originFlag = defaultValue;

  var column = [
    {
      title: "S. No.",
      orderable: false, // Disable sorting for this column
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    { title: 'District', data: 'dm_district' },
    //							{title: "Received Today", data: "rec_today"},
    { title: "Total till date", data: "total_count" },
    { title: "Resolved", data: "resolved_count" },
    { title: "Pending", data: "pending_count" },

    { title: "Forwarded", data: "forwarded_count" },
    { title: "Does Not Pertain", data: "dnp_count" },
    { title: "Remark Added", data: "remark_count" },
    { title: "Rejected", data: "rejected_count" },
    { title: "Appealed", data: "appealed_count" },
    // {title: "LG Mulakat", data: "lg_count"},
    //							{title: "Resolved Percentage", data: "resolved_percentage"},

  ];
  let d = chkV(originFlag);

  var settings = {
    url: "reqDistrictWiseRpt?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    console.log(j.data)

    $(".btnmis-customBtnDD").on("click", function () {
      // console.log($(this).val());
      districtWiseTbl.button("." + $(this).val()).trigger();
    });
    var districtWiseTbl = $("#distWiseTbl").DataTable({
      data: j.data,
      destroy: true,
      lengthMenu: [10, 50, 100],
      pageLength: 10,
      scrollX: true,
      //	scrollY: 500,
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

            // Adjust width of the first column dynamically
            columnWidths.push("auto"); // 'auto' for the first column
            columnWidths.push("auto"); // Adjust others similarly if needed

            // Use '*' for other columns to distribute evenly
            for (var i = 2; i < totalColumns; i++) {
              columnWidths.push("*");
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
    });

    $("#distWiseTbl_filter input[type='search']").on("input", function () {
      // alert("jjjds")

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      districtWiseTbl.search(cleanValue).draw(); // Update DataTable search
    });
  });
}

//Naitik Changes on 30-01-2026

$(document).on('click', '.grievancepdf', function () {
  var grievanceId = $(this).attr('data-grievance-id');

  $.ajax({
    url: cp + "/admin/downloadPdfHistory",
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

//Naitik Changes End on 30-01-2026
