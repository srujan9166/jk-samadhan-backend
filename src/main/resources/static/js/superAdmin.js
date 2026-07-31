var cpgramRawData = [];
var table145;
// cmt_25
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
// table = $('#depTable').DataTable({
// 	destroy: true,
// 	lengthMenu: [5, 10, 25],
// 	pageLength: 10,
//   });
$(function () {
  // cmt_25
  sessionFunc();

  $(".cBb").one("click", function () {
    // Check if there's a history to go back to
    if (window.history.length > 1) {
      // window.history.back();
      window.history.go(-1); // Go back to the previous page
    } else {
      // Redirect to a default page if no history
      window.location.href = "home";
    }
  });
  // datatable("Total");

  serverSideDT();

  // For District Wise MIS Report (With origin/appflag to filter distrcit data) - 09 May 2025 - SKY
  if (window.location.href.includes("/distWiseRpt")) {
    let defaultValue = "'JKSAMADHAN', 'RAABITA'";
    distWiseReport(defaultValue);
    $("#pills-tab-AA").on("click", "button", function () {
      defaultValue = $(this).data("value");
      distWiseReport(defaultValue);
    });
  }


  // for avg time taken by department 21/03/2025
  if (window.location.href.indexOf("/avgttByDept") != -1) {
    avgTTRptFunc();

  }
  // 21/03/2025

  // for appellate report 20/03/2025
  if (window.location.href.indexOf("/appellateRpt") != -1) {

    $("#deptTypeFilter , #fromDate, #toDate").on("change", function () {
      // const selectedDept = $(this).val();
      var selectedDept = $("#deptTypeFilter").val();
      //  alert(selectedDept)
      appellateRptFunc(selectedDept);
    });
    appellateRptFunc("");
  }
  // 20/03/2025

  // for citizen registration list 06/02/2025
  if (window.location.href.indexOf("/getCitizenList") != -1) {
    citRegFunc();
  }
  // 06/02/2025

  // 20 May 2024
  if (window.location.href.indexOf("/getUserList") != -1) {
    $(document).on("click", ".shwUptDetails", function (e) {
      let c = $(this).val();
      let d = chkV(c);
      window.location.href = "basedUlUpdProfile?d=" + d;
    });
  }
  // 20 May 2024

  //   for MIS Report Section endpoint
  if (window.location.href.indexOf("/misReportSection") != -1) {
    $(".usrLis").click(function () {
      window.location.href = "getUserList";
    });
    $(".dealHLis").click(function () {
      window.location.href = "dhlPage";
    });
    $(".ageLis").click(function () {
      window.location.href = "agePage";
    });
    $(".usrWsLis").click(function () {
      window.location.href = "uWRpt";
    });
  }
  //   for dealing hand list on load of dhlpage endpoint
  if (window.location.href.indexOf("/dhlPage") != -1) {
    dhlData();
  }
  //   for age analysis report on load of agepage endpoint
  if (window.location.href.indexOf("/agePage") != -1) {
    $(".data-whichWise:checked").trigger("change");
    // ageAreportData();
  }

  if (window.location.href.indexOf("/agePendingPage") != -1) {
    $(".data-whichWise:checked").trigger("change");
    // ageAreportData();
  }


  //   for user wise status report on load of agepage endpoint
  if (window.location.href.indexOf("/uWRpt") != -1) {
    $(".data-whichWise:checked").trigger("change");
    // uWRptData();
  }

  // consolidated pendency report document ready datatable - sky - 07th July 2024
  if (window.location.href.indexOf("/conPenrpt") != -1) {
    $(".data-whichWise:checked").trigger("change");
    // conPenrptData();
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

  //   for user wise status detailed report on load of detailedviewUW endpoint
  if (window.location.href.indexOf("/detailedviewUW") != -1) {
    var dataFromStorage = sessionStorage.getItem("data"); // Retrieve data from session storage
    if (dataFromStorage) {
      detailedViewForUW(dataFromStorage);
    } else {
      detailedViewForUW(0);
    }
  }

  if (window.location.href.indexOf("/suggesionReport") != -1) {
    viewSuggesionrpt();
  }

  if (window.location.href.indexOf("/SetupMeetings") != -1) {
    getlgmulakartable("lgmsamadhan");
  }
  if (window.location.href.indexOf("/LGGrivanceList") != -1) {
    getLGMSelectedDate();
  }
  if (window.location.href.indexOf("/meetingSummery") != -1) {
    getMeetingSummery();
  }

  $("#saverem").click(function () {
    saveremarks();
  });
  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table133.button("." + $(this).val()).trigger();
  });
  var table133 = $("#minutesofmeeting").DataTable({
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    responsive: true,
    paging: true,
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
            columnWidths.push("auto");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
  });
  // $(".btn-customBtn").on("click", function () {
  //   table.button("." + $(this).val()).trigger();
  // });
  loadMisCitizen();
  loadMisDistrict()
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

function getSelectedValuesChk(list) {
  var checkedValues = list.map(function (value) {
    return "'" + value + "'";
  });
  if (checkedValues.length === 0) {
    return 0;
  }
  return checkedValues.join(", ");
}

// $('.table').DataTable( {
// 	  //  data: j,
// 	    destroy: true,
// 	    lengthMenu:[5,10,25],
// 	    pageLength: 10,
// 	    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
//     /*   buttons: [
//             'copy', 'csv', 'excel', 'pdf', 'print'
//         ]*/
//          buttons: [
//              'excel'
//         ]
//         })

////////

/*$("#inputRegion").change(
  function() {
    var addDeptV = $('#inputRegion').find(":selected").val();
    $("#inputDistrict").html('');
    $("#inputDistrict").append('<option value="0">--Select District--</option>');
    if (addDeptV != '0') {
      $("#inputDistrict").attr("disabled",false);
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
          if (j.statusCode == '1') {
            //console.log(j.data);
            makeDropdown(inputDistrict, j.data);
          }
        });
    }else {
      $("#inputDistrict").attr("disabled",true);
    }
  });*/

$(".custBtn").click(function () {
  if (this.value == "other") {
    cpgramGrievances("cpgramTotal");
  } else if (this.value == "jkigrams") {
    jkiGram();
  } else {
    datatable("Total");
  }
});

$("#addDivision").change(function () {
  var addDeptV = $("#addDivision").find(":selected").val();
  $("#addDept").html("");
  $("#addDept").append(
    '<option value="0">Select</option><option value="add">Add new department</option>'
  );
  $("#addDept").prop("disabled", false);
  //console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///

    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "selectDpartment?d=" + d,
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
        //console.log(j.data);
        //console.log(categ)
        //   makeDropdown(addDept, j.data);
      }
    });
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

//$("#addDept").change(
$("#addDept").change(function () {
  var addDeptV = $("#addDept").find(":selected").val();
  $("#categ").html("");
  $("#categ").append();
  $("#categ").prop("disabled", false);
  //console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#addDeptV").val("");
      $("#addDeptT").show();
      $("#deptoffcdiv").show();
      $("#categ").prop("disabled", false);
    } else {
      $("#categ").prop("disabled", false);
      $("#addDeptT").hide();
      $("#deptoffcdiv").hide();
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
          //console.log(j.data);
          //console.log(categ)
          makeDropdown("categ", j.data);
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
  //console.log(stateS);
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
          //console.log(j.data);
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
  //console.log(stateS);
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
          //console.log(j.data);
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
  //console.log(addDeptV);
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
      //console.log(c)
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
  //console.log(addDeptV);
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
  //console.log(stateS);
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

  $("#subcateg2").prop("disabled", true);
  $("#subcateg3").prop("disabled", true);
  $("#subcateg4").prop("disabled", true);
  $("#addDept").prop("disabled", true);
  $("#addDivision").prop("selectedIndex", 0);
  $("#subcategV2").val("");
  $("#subcategV3").val("");
  $("#subcategV4").val("");
  $("#subcategT2").hide();
  $("#subcategT3").hide();
  $("#subcategT4").hide();
  $("#subcateg2").prop("selectedIndex", 0);
  $("#subcateg3").prop("selectedIndex", 0);
  $("#subcateg4").prop("selectedIndex", 0);
});

$("#submitDept").click(function () {
  //			alert("hello");
  var divison = $("#addDivision").find(":selected").val();
  var dp = $("#addDept").find(":selected").val();
  var desig = $("#addDesignation").val();
  var sessionvalue = $("#sessionvalue").val();
  var sessionname = $("#sessionname").val();

  var chkVal;
  if (dp == "0") {
    chkVal = "0";
  } else if (dp == "add" && $("#addDeptV").val() == "") {
    chkVal = "0";
  } else {
    chkVal = 1;
  }
  if (chkVal == "0" || divison == "0" || desig == "" || desig == null) {
    alert("All fields are mandatory.");
  } else {
    if (dp == "add") {
      dp = $("#addDeptV").val();
    } else {
      dp = dp;
    }

    //				alert("good");
    var c = JSON.stringify({
      department_name: dp,
      // divison: divison
      department_type: divison,
      designation: desig,
      sessionvalue: sessionvalue,
      sessionname: sessionname,
    });

    // console.log(c)
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
        //console.log(j.data);
        alert("Department added successfully.");
        window.location.reload();
      } else if (j.statusCode == "2") {
        //console.log(j.data);
        alert("Department already exists.");
        window.location.reload();
      }

      //Naitik Changes on popup 09/10/2025

      if (!confirm("Are you sure that you want to create this Department?")) {
        return;
      }

      //Naitik Changes End on popup 09/10/2025




      // cmt_8_8
      else if (j.statusCode == "4") {
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

$(document).on("click", "#editDep", function (e) {
  var dep = e.target.value;
  //alert(dep)
  $("#changeDepModal").modal("show");
  $("#oldDep").val(dep);
  $("#newDepName").val(dep);
});

$(document).on("click", "#changeDepName", function (e) {
  $("#exampleModal").modal("show");
  var oldDep = $("#oldDep").val();
  //console.log($('#oldDep').val());
  //var dep=e.target.value;
  var newDep = $("#newDepName").val();
  if (newDep == "") {
    alert("Field can not be empty");
  }
  else if (!/^[a-zA-Z\s\-,()]+$/.test(newDep)) {
    alert("Department name can only contain letters, numbers, spaces, hyphens (-), commas (,), and brackets ().");
  } else {
    changeDepartment(oldDep, newDep);
  }
});

function changeDepartment(oldDep, newDep) {
  // alert(oldDep)
  var c = JSON.stringify({
    oldDEp: oldDep,
    newDEp: newDep,
  });

  // console.log(c)
  var d = chkV(c);
  var settings = {
    url: "updateDepartment?d=" + d,
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
      alert("Department name changed.");
      window.location.reload();
    }
    // cmt_25
    else if (j.statusCode == "4") {
      var msg = j.statusName;
      alert(msg);
      // window.location.reload();
    } else {
      alert("Something went wrong.");
    }
  });
}

$("#selUser").change(function () {
  var addDeptV = $("#selUser").find(":selected").val();
  //console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#newUserDiv").show();
      $("#assignDiv").hide();
    } else {
      $("#newUserDiv").hide();
      // $("#assignDiv").show();
    }
  } else {
    $("#newUserDiv").hide();
    $("#assignDiv").hide();
  }
});

$("#inputRegion").change(function () {
  var addDeptV = $("#inputRegion").find(":selected").val();
  $("#inputDistrict").html("");
  $("#inputDistrict").append('<option value="0">--Select District--</option>');
  if (addDeptV != "0") {
    $("#inputDistrict").attr("disabled", false);
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
      //   console.log(j);
      if (j.statusCode == "1") {
        //  CategoryBydept(addDeptV)
        // depData(addDeptV)
        makeDropdown(inputDistrict, j.data);
      }
    });
  } else {
    $("#inputDistrict").attr("disabled", true);
    // $("#depName").html('');
    // 	$("#depName").append('<option value="0">Select</option>');
  }
});

// $("#password").on("input", function () {
//   var password = $(this).val();
//   validatePassword(password);
// });

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

// function validatePassword(password) {
//   var uppercasePattern = /[A-Z]/;
//   var lowercasePattern = /[a-z]/;
//   var digitPattern = /\d/;
//   var specialPattern = /[@$!%*?&]/;
//   var lengthPattern = /.{8,}/;

//   checkPattern(uppercasePattern, password, "#uppercase");
//   checkPattern(lowercasePattern, password, "#lowercase");
//   checkPattern(digitPattern, password, "#digit");
//   checkPattern(specialPattern, password, "#special");
//   checkPattern(lengthPattern, password, "#length");
// }

// function checkPattern(pattern, password, element) {
//   if (pattern.test(password)) {
//     //	console.log("success")
//     $(element).addClass("matched");
//   } else {
//     //	console.log("failed")
//     $(element).removeClass("matched");
//   }
// }

$("#submitUser").click(function () {
  var division = $("#selectDepart").find(":selected").val();
  var dp = $("#selDept").find(":selected").val();
  var inptRegion = $("#inputRegion").find(":selected").val();
  var inptDist = $("#inputDistrict").find(":selected").val();

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
      // $("#errMsg").hide();
      if (
        inptRegion == "0" ||
        inptDist == "0" ||
        dp == "0" ||
        $("#fn").val() == null ||
        $("#fn").val().trim() == "" ||
        $("#ln").val() == null ||
        $("#ln").val().trim() == "" ||
        $("#mobile").val() == null ||
        $("#mobile").val().trim() == "" ||
        $("#email").val() == null ||
        $("#email").val().trim() == "" ||
        $("#selUsrType").find(":selected").val() == "0" ||
        $("#designation").find(":selected").val() == "0" ||
        $("#password").val() == null ||
        $("#password").val().trim() == ""
      ) {
        alert("All fields except middle name are mandatory.");
      } else {
        var fn = $("#fn").val().trim();
        var mn = $("#mn").val();
        var ln = $("#ln").val().trim();
        var mobile = $("#mobile").val().trim();
        var email = $("#email").val().trim();
        var designation = $("#designation").find(":selected").val();
        var usrType = $("#selUsrType").find(":selected").val();
        var passw = $("#password").val().trim();

        if (mn != null) {
          mn = mn;
        } else {
          mn = "";
        }

        if (isEmail(email) && isMobile(mobile)) {
          var c = JSON.stringify({
            first_name: fn,
            middle_name: mn,
            last_name: ln,
            mobile: mobile,
            email: email,
            designation: designation,
            passw: passw,
            department_name: dp,
            divison: inptRegion,
            district: inptDist,
            user_assigned: usrType,
            // divison: division
            department_type: division,
            sessionvalue: $("#sessionvalue").val(),
            sessionname: $("#sessionname").val(),
          });

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
            if (j.statusCode == "1") {
              //console.log(j.data);
              alert("User added successfully.");
              window.location.reload();
            } else if (j.statusCode == "2") {
              //console.log(j.data);
              alert("Email Id already exists.");
              window.location.reload();
            } // cmt_8_8
            else if (j.statusCode == "4") {
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
      // $("#errMsg").show();
      //$("#errMsg").html(j.msg);
      return false;
    }
  });
});

$("#selectUser").change(function () {
  var addDeptV = $("#selectUser").find(":selected").val();
  // alert(addDeptV);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "dealingHand") {
      $("#distDiv").removeClass("d-none");
      $("#inputRegion").find('option[value="UT"]').length ||
        $("#inputRegion").append('<option value="UT">UT</option>');
      $("#inputRegion")
        .find(
          'option[value="JAMMU"], option[value="KASHMIR"], option[value="0"], option[value="UT"]'
        )
        .removeClass("d-none");
      $("#inputRegion").find('option[value="0"]').prop("selected", true);
      $("#distsss").addClass("d-none");
    } else if (addDeptV == "RMC" || addDeptV == "Raabita") {
      $("#distDiv").removeClass("d-none");
      $("#inputRegion").find('option[value="UT"]').length ||
        $("#inputRegion").append('<option value="UT">UT</option>');
      $("#inputRegion").find('option[value="UT"]').prop("selected", true);
      $("#inputRegion")
        .find(
          'option[value="JAMMU"], option[value="KASHMIR"], option[value="0"]'
        )
        .addClass("d-none");
      $("#distsss").addClass("d-none");
    } else if (addDeptV == "DM") {
      $("#distDiv").removeClass("d-none");
      $("#inputRegion").find('option[value="UT"]').addClass("d-none");
      $("#inputRegion")
        .find(
          'option[value="JAMMU"], option[value="KASHMIR"], option[value="0"]'
        )
        .removeClass("d-none");
      $("#inputRegion").find('option[value="0"]').prop("selected", true);
      $("#distsss").removeClass("d-none");
    }
    // For Executive Administrator - 21 August 2024 - SKY
    else if (addDeptV == "EAdmin") {
      $("#distDiv").addClass("d-none");
    }
    //for appeal - 24-01-2025
    else if (addDeptV == "Appellate") {
      $("#inputRegion").find('option[value="UT"]').addClass("d-none");
      $('#distDiv').addClass('d-none');
      $("#distsss").addClass("d-none");
    }

    $("#newUserDiv").show();
  } else {
    $("#newUserDiv").hide();
  }
});

$("#submitDMAndDealingHandUser").click(function () {
  var usrType = $("#selectUser").find(":selected").val();
  var division = $("#selectDepart").find(":selected").val();
  var dp = $("#selDept").find(":selected").val();
  var inptRegion = $("#inputRegion").find(":selected").val();
  var inptDist = $("#inputDistrict").find(":selected").val();

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
      //$("#errMsg1").hide();

      if (
        (inptRegion == "0" && usrType == "dealingHand") ||
        (inptRegion == "0" && usrType == "RMC") ||
        (usrType == "DM" && inptDist == "0") ||
        dp == "0" ||
        $("#fn").val() == null ||
        $("#fn").val().trim() == "" ||
        $("#ln").val() == null ||
        $("#ln").val().trim() == "" ||
        $("#mobile").val() == null ||
        $("#mobile").val().trim() == "" ||
        $("#email").val() == null ||
        $("#email").val().trim() == "" ||
        $("#designation").val() == null ||
        $("#designation").val().trim() == "" ||
        $("#password").val() == null ||
        $("#password").val().trim() == ""
      ) {
        alert("All fields except middle name are mandatory.");
      } else {
        var fn = $("#fn").val().trim();
        var mn = $("#mn").val();
        var ln = $("#ln").val().trim();
        var mobile = $("#mobile").val().trim();
        var email = $("#email").val().trim();
        var designation = $("#designation").val().trim();
        var passw = $("#password").val().trim();

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

          //Naitik Changes End 09/10/2025
          var c = JSON.stringify({
            first_name: fn,
            middle_name: mn,
            last_name: ln,
            mobile: mobile,
            email: email,
            designation: designation,
            passw: passw,
            department_name: dp,
            divison: inptRegion,
            district: inptDist,
            // divison: division
            department_type: division,
            value: usrType,
            sessionvalue: $("#sessionvalue").val(),
            sessionname: $("#sessionname").val(),
            // cmt_25
          });

          //  console.log(c);

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
            if (j.statusCode == "1") {
              //console.log(j.data);
              alert("User added successfully.");
              window.location.reload();
            } else if (j.statusCode == "2") {
              //console.log(j.data);
              alert("Email Id already exists.");
              window.location.reload();
            } // cmt_8_8
            else if (j.statusCode == "4") {
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
      //$("#errMsg").show();
      // $("#errMsg1").html(j.msg);
      return false;
    }
  });
});

$("#assignUser").click(function () {
  var dp = $("#selDept").find(":selected").val();
  //	var usr = $('#selUser').find(":selected").val();
  var chked = "";
  $(".flexCheckChecked:checked").each(function () {
    var vl = $(this).val();
    chked = chked + vl + ",";
  });
  chked = chked.substring(0, chked.length - 1);
  //			alert(chked);
  if ($("#selUser").val() == "0") {
    alert("All fields are mandatory.");
  } else {
    var fn = $("#selUser").val();

    var c = JSON.stringify({
      email: fn,
      department_name: dp,
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
        //console.log(j.data);
        alert("Department assigned successfully.");
        window.location.reload();
      } else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }
});

function makeDataTable(d) {
  $("#exampleModal").modal("show");

  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table134.button("." + $(this).val()).trigger();
  });

  var table134 = $("#rtb2").DataTable({
    data: d,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    scrollY: 500,
    paging: true,
    //dom: "Blfrtip",
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
            columnWidths.push("auto");
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
            data +
            '" class="btn btn-danger del-btn">Remove</button>'
          );
        },
      },
    ],
  });
  tatable134ble.columns.adjust().draw();
}
function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>").attr("value", value.values).text(value.values)
    );
  });
}

/////
//Utkarsh changes for download 26/02/2026
$(".input-field").keyup(function (e) {
  var $th = $(this);
  // $th.val($th.val().replace(/(\s{2,})|[^a-zA-Z']/g, " "));
  $th.val($th.val().replace(/(\s{2,})|[^a-zA-Z\-,()\s]/g, " "));
  $th.val($th.val().replace(/^\s*/, ""));
});

//   Initialize depTable with Excel/PDF export buttons for department Mapping
var depTable2 = $("#depTable2").DataTable({
  destroy: true,
  lengthMenu: [10, 25, 50],
  pageLength: 10,
  processing: true,
  deferRender: true,
  dom: 'lBfrtip',
  //when we selcted any page then index will be start S.No. in a sequence. changes by Utkarsh 09/03/2026
  rowCallback: function (row, data, displayIndex) {
    $('td:first-child, th:first-child', row).html(displayIndex + 1);
  },

  drawCallback: function () {
    var api = this.api();
    var pageInfo = api.page.info();
    api.column(0, { page: 'current' }).nodes().each(function (cell, i) {
      cell.innerHTML = pageInfo.start + i + 1;
    });
  },
  //end of changes by Utkarsh 09/03/2026
  buttons: [
    {
      extend: "excel",
      title: "JKGOVT",
      className: "buttons-excel",
      messageTop: "The information in this table is copyright to JK GOVT.",
      exportOptions: {
        columns: ":not(.noExport)"
      }
    },
    {
      extend: "pdf",
      title: "JKGOVT",
      className: "buttons-pdf",
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
          columnWidths.push("auto");
        }
        doc.content[1].table.widths = columnWidths;
      },
      exportOptions: {
        columns: ":not(.noExport)"
      }
    }
  ]
});

//   Wire up the custom buttons to depTable
$(".btn-depTable-customBtn").on("click", function () {
  // console.log("clicked");
  depTable2.button("." + $(this).val()).trigger();
});


//Utkarsh changes for download 26/02/2026
var filterDeptType = document.getElementById('filterDeptType');
if (filterDeptType) {
  filterDeptType.addEventListener('change', function () {
    depTable2.column(2).search(this.value, false, false).draw();
  });
}


$(".input-f").keypress(function (e) {
  return validN(e);
});

function validN(e) {
  var keyCode = e.keyCode || e.which;
  //Regex for Valid Characters i.e. Alphabets.
  var regex = /^[A-Za-z]+$/;
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

$(document).on("click", ".data-search11", function (e) {
  var btnVal = $(this).val();

  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "api_v9?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(JSON.stringify(j))
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
      myTable(j.data);
    } else {
      myTable(j.data);
    }
  });
});

function getGrievList(deptName) {
  // alert(deptName);
  var divison = $("#selectDepart").find(":selected").val();
  var c = JSON.stringify({
    value: deptName,
    department_type: divison,
    // divison:divison
  });
  var d = chkV(c);
  var settings = {
    url: "api_v3?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    // alert("jjjjj")
    j = setV(j);
    j = JSON.parse(j);
    //	console.log(j);
    j.data = j.data.map((current) => {
      if (current.created_date != null) {
        current.created_date = format_date(current.created_date);
      }
      return current;
    });
    $(".btn-customBtn").on("click", function () {
      // console.log($(this).val());
      table135.button("." + $(this).val()).trigger();
    });
    var table135 = $("#YRreport45").DataTable({
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
              columnWidths.push("auto");
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
          data: (row) =>
            row.first_name + " " + row.middle_name + " " + row.last_name,
          defaultContent: "",
          title: "Name",
        },
        {
          data: "department",
          defaultContent: "",
          title: "Department",
        },
        {
          data: "designation",
          defaultContent: "",
          title: "Designation",
        },
        // {
        //   data: "mobile",
        //   defaultContent: "",
        //   title: "Mobile Number",
        // },
        // {
        //   data: "email",
        //   defaultContent: "",
        //   title: "Email Id",
        // },

        {
          data: "created_date",
          defaultContent: "",
          title: "Created On",
        },
        {
          data: "nameAndDesignation",
          defaultContent: "",
          title: "Created By",
        },
        //   {
        // 	data: "username",
        // 	defaultContent: "",
        // 	class: "noExport",
        //  title: "Action",
        // 	render: function (data, type, row, meta) {
        // 	  return `<button value = "${data}" class="btn btn-sm btn-primary dtl-btn visually-hidden">Details</button>
        // 	  <button value = "${data}" class="btn btn-sm btn-warning text-white visually-hidden"><i class="bi bi-pencil-square""></i></button>
        // 	  <button value = "${data}" class="btn btn-sm btn-danger text-white visually-hidden"><i class="bi bi-trash"></i></button>`;
        // 	},
        //   },
      ],
    });

    $("#YRreport45_filter input[type='search']").on("input", function () {
      // alert("jjjds")

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      table135.search(cleanValue).draw(); // Update DataTable search
    });
  });
}
// var arr = [];
// function datatable(val) {
// 	var settings = {
// 		url: "allData",
// 		method: "POST",
// 		timeout: 0,
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	};
// 	$.ajax(settings).done(function (j) {
// 		// alert("jjjjj")
// 		j = setV(j);
// 		j = JSON.parse(j);
// 		//console.log(j)

// 		if (j.statusCode == "1") {
// 			var data = j.data;
// 			$.each(data, function (index, value) {

// 				if (val == "Total") {
// 					arr.push(value);
// 				} else if (val == "Pending") {
// 					if (
// 						value.status == "Pending" ||
// 						value.status == "Under Process" ||
// 						value.status == "Acknowledged"
// 					) {
// 						arr.push(value);
// 					}
// 				} else {
// 					if (value.status == val) {
// 						arr.push(value);
// 					}
// 				}
// 			});
// 			myTable(arr, j.user_type);
// 		} else {
// 			myTable(arr, j.user_type);
// 			// alert("No data to display")
// 		}
// 	});
// }

// function myTable(data, user_type) {
// 	// console.log(data)
// 	var usdd = $("#usrVV").val();

// 	$("#dataCount").show();
// 	$("#department").hide();

// 	// console.log("llll :"+data.length)

// 	if (data.length > 0) {
// 		data = data.map((current) => {
// 			if (current.createddate != null) {
// 				current.createddate = format_date(current.createddate);
// 			}
// 			return current;
// 		});
// 	}

// 	$(".btn-customBtn").on("click", function () {
// 		table136.button("." + $(this).val()).trigger();
// 	});

// 	var table136 = $("#YRreport999").DataTable({
// 		data: data,
// 		destroy: true,
// 		lengthMenu: [10, 50, 100],
// 		pageLength: 10,

// 		scrollX: true,
// 		//	scrollY: 500,
// 		paging: true,
// 		//dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
// 		buttons: [
// 			{
// 				extend: "excel",
// 				title: "JKGOVT",
// 				messageTop: "The information in this table is copyright to JK GOVT.",
// 				exportOptions: {
// 					columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
// 				}
// 			},
// 			{
// 				extend: "pdf",
// 				title: "JKGOVT",
// 				messageBottom:
// 					"The information in this table is copyright to JK GOVT.",
// 				pageSize: "A4",
// 				download: "open",
// 				customize: function (doc) {
// 					// Set the page orientation and size
// 					doc.pageSize = 'A4';
// 					doc.pageOrientation = 'landscape';

// 					// Adjust the content styling
// 					doc.styles.tableHeader.fontSize = 8;
// 					doc.styles.tableBodyOdd.fontSize = 8;
// 					doc.styles.tableBodyEven.fontSize = 8;

// 					// Center the table content
// 					var rowCount = doc.content[1].table.body.length;
// 					for (var i = 0; i < rowCount; i++) {
// 						var row = doc.content[1].table.body[i];
// 						for (var j = 0; j < row.length; j++) {
// 							row[j].alignment = 'center';
// 						}
// 					}

// 					// Scale the table width to fit the page
// 					var totalColumns = doc.content[1].table.body[0].length;
// 					var columnWidths = [];
// 					for (var i = 0; i < totalColumns; i++) {
// 						columnWidths.push('*');
// 					}
// 					doc.content[1].table.widths = columnWidths;
// 				},
// 				exportOptions: {
// 					columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
// 				}
// 			},
// 		],
// 		columns: [
// 			{
// 				className: 'dt-control',
// 				class: "noExport",
// 				orderable: false,
// 				data: null,
// 				defaultContent: ''
// 			},
// 			// {
// 			//   title:
// 			//     "<button class='btn btn-sm btn-danger text-white forHlg' title='Forward to HLG' type='button'>HLG</button>",
// 			//   render: function (data, type, row) {
// 			//     return `<input type="checkbox" class="row-checkbox" data-uniqid="${row.uniqid}">`;
// 			//   },
// 			//   orderable: false,
// 			// },
// 			{
// 				title: "S. No.",
// 				render: function (data, type, row, meta) {
// 					return meta.row + meta.settings._iDisplayStart + 1;
// 				},
// 			},
// 			{
// 				data: "uniqid",
// 				title: "Grievance ID",
// 				render: function (data, type, row, meta) {
// 					return (
// 						'<button class="btn btn-link grievance-btn griDetails" data-uniqid="' +
// 						data +
// 						'">' +
// 						data +
// 						"</button>"
// 					);
// 				},
// 			},
// 			{
// 				data: "department",
// 				defaultContent: "",
// 				title: "Department",
// 			},
// 			{
// 				data: "category",
// 				defaultContent: "",
// 				title: "Category",
// 			},
// 			{
// 				data: "name",
// 				defaultContent: "",
// 				title: "Submitted By",
// 			},
// 			{
// 				data: "createddate",
// 				defaultContent: "",
// 				title: "Date",
// 			},
// 			{
// 				data: "status",
// 				defaultContent: "",
// 				title: "Status",
// 				render: function (data, type, row, meta) {
// 					if (data === "Pending") {
// 						return (
// 							'<div class="btn btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
// 							data +
// 							"</div>"
// 						);
// 					} else if (data === "Acknowledged") {
// 						return (
// 							'<div class="btn btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
// 							data +
// 							"</div>"
// 						);
// 					} else if (data === "Under Process") {
// 						return (
// 							'<div class="btn btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
// 							data +
// 							"</div>"
// 						);
// 					} else if (data === "Resolved" || data === "Rejected") {
// 						return (
// 							'<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
// 							row.final_status +
// 							"</div>"
// 						);
// 					} else if (data == "dnpToOffice") {
// 						var st = "Does not pertain";
// 						return (
// 							'<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
// 							st +
// 							"</div>"
// 						);
// 					} else if (data === "Appealed") {
// 						return (
// 							'<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
// 							data +
// 							"</div>"
// 						);
// 					} else if (data === "Forwarded To CPGRAM") {
// 						return (
// 							'<div class="btn btn-sm yr-mw " style="background-color: #e7e7e7"><i class="bi bi-exclamation-octagon"></i> ' +
// 							data +
// 							"</div>"
// 						);
// 					} else if (data === "Forwarded") {
// 						return (
// 							'<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
// 							data +
// 							"</div>"
// 						);
// 					} else {
// 						return (
// 							'<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
// 							data +
// 							"</div>"
// 						);
// 					}
// 				},
// 			},

// 			{
// 				data: "uniqid",
// 				defaultContent: "",
// 				class: "noExport",
// 				title: "Action",
// 				render: function (data, type, row, meta) {
// 					/*var btn =
// 					  '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vHis" title="History" value = "' +
// 					  data +
// 					  '"></button>';*/

// 					var btn =
// 						'<div class="dropdown">' +
// 						'<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
// 						'<i class="bi bi-three-dots"></i>' +
// 						"</button>" +
// 						'<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
// 						'<li class=""><button class="btn btn-sm vDetails" value = "' +
// 						data +
// 						'" data-appflag = "JKSAMADHAN">Grievance Details</button></li>' +
// 						'<li class=""><button class="btn btn-sm vHis" title = "History" value = "' +
// 						data +
// 						'">History</button></li>';

// 					if (user_type == "ROLE_SuperAdmin") {
// 						if (row.status == "Appealed" && usdd == "no") {
// 							btn =
// 								btn +
// 								'<li class=""><button class="btn btn-sm appP" value = "' +
// 								data +
// 								'" id="grevP">Process</button></li>';
// 						} else if (row.status == "dnpToOffice") {
// 							btn =
// 								btn + '<li class=""><button class="btn btn-sm grevP" value = "' + data + '">Edit</button></li>' +
// 								'<li class=""><button class="btn btn-sm fwdCpgram text-start" value = "' + data + '">Forward to CPGRAM</button></li>';

// 							//	'<li class=""><button class="btn btn-sm vHis" value = "' +data +'">History</button></li>' ;
// 							//  btn + '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
// 						} else if (row.status == "Forwarded To CPGRAM") {
// 							btn =
// 								btn +
// 								'<li><button class="btn btn-sm  cpgramStatus" value = "' +
// 								data +
// 								'" style="background-color: #e7e7e7">Check</button></li>';
// 						}
// 					}
// 					return btn + "</ul></div>";
// 				},
// 			},
// 		],
// 		rowCallback: function (row, data) {
// 			// Check the value of the 'application' column and apply the corresponding class
// 			if (data.application === "webapp") {
// 				$(row).addClass("web-application-row");
// 			} else {
// 				$(row).addClass("other-application-row");
// 			}
// 		},

// 	});

// 	$(document).on("click", ".data-search", function (e) {
// 		var filteredDeptValue = $(this).val();
// 		if (filteredDeptValue == "web") {
// 			filteredDeptValue = "webapp";
// 		} else if (filteredDeptValue == "mobile") {
// 			filteredDeptValue = "mobileapp";
// 		}
// 		if (filteredDeptValue != "0" && filteredDeptValue != "" && filteredDeptValue != " " && filteredDeptValue != "home") {
// 			// Filter the usrListGlobal array based on the selected department value
// 			var filteredData = arr.filter(function (checkDept) {
// 				if (filteredDeptValue == "Normal" || filteredDeptValue == "Priority") {
// 					return checkDept.key_flag != null && checkDept.key_flag == filteredDeptValue;

// 				} else {
// 					return checkDept.application != null && checkDept.application == filteredDeptValue;
// 				}
// 			});
// 			// Update the DataTable with the filtered data
// 			$('#YRreport999').DataTable().clear().rows.add(filteredData).draw();
// 		} else {
// 			// If no specific department is selected, show all data
// 			$('#YRreport999').DataTable().clear().rows.add(arr).draw();
// 		}
// 	});

// 	$("#YRreport999 tbody").on("click", ".griDetails", function () {
// 		var uniqid = $(this).data("uniqid");
// 		let d = chkV(uniqid);
// 		window.open("viewApp?d=" + d, "_blank");
// 	});
// }

// Server Side datatable - start
var globalUserType;
var globalAllData;
function serverSideDT() {
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
    loadMisDistrict();
  })


  let statusFilterVal = "0";
  $('#statusFilter').change(function () {
    let filteredValue = $(this).val();
    statusFilterVal = filteredValue;
    //  console.log("statusFilterVal : " + statusFilterVal);
    table136.ajax.reload();
  });




  var column = [
    {
      data: "uniqid",
      defaultContent: "",
      class: "noExport",
      title: "Action",
      render: function (data, type, row, meta) {

        var feedbackBtn = "";
        if (row.feedbackflag == 1 && (row.status == "Resolved" || row.status == "Rejected")) {
          feedbackBtn = '<span class="bi bi-emoji-smile me-2" style="color: green font-size: 1.5rem"></button>';
        }

        var btn =
          '<div class="dropdown">' +
          feedbackBtn +
          '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
          '<i class="bi bi-three-dots"></i>' +
          "</button>" +
          '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
          '<li class=""><button class="btn btn-sm vDetails" value = "' +
          data +
          '" data-appflag = "JKSAMADHAN">Grievance Details</button></li>';
        // +'<li class=""><button class="btn btn-sm vHis" title = "History" value = "' +
        // data +
        // '">History</button></li>';
        if (globalUserType == "ROLE_SuperAdmin") {
          if (row.status == "Appealed" && usdd == "no") {
            btn =
              btn +
              '<li class=""><button class="btn btn-sm appP" value = "' +
              data +
              '" id="grevP">Process</button></li>';
          } else if (["dnpToOffice", "Pending", "Acknowledged", "Under Process", "Forwarded", "Remarks Added"].includes(row.status) ||
            ["Recieved", "dnpToOffice"].includes(row.final_status)) {
            btn =
              btn +
              '<li class=""><button class="btn btn-sm grevP" value = "' +
              data +
              '">Edit</button></li>' +
              '<li class=""><button class="btn btn-sm fwdCpgram text-start" value = "' +
              data +
              '">Forward to CPGRAM</button></li>';

            //	'<li class=""><button class="btn btn-sm vHis" value = "' +data +'">History</button></li>' ;
            //  btn + '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
          } else if (row.status == "Forwarded To CPGRAM") {
            btn =
              btn +
              '<li><button class="btn btn-sm  cpgramStatus" value = "' +
              data +
              '" style="background-color: #e7e7e7">Check</button></li>';
          }
        }
        return btn + "</ul></div>";
      },
    },
    {
      title: "S. No.",
      orderable: false, // Disable sorting for this column
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    //Naitik changes 30/03/2026
    {
      data: "uniqid",
      title: "Grievance ID",
      render: function (data, type, row, meta) {

        // Grievance ID button
        let button = '<span class="btn btn-link text-decoration-none">' + data + '</span>';

        // Document check
        const hasDoc = row.file_name !== null
          && row.file_name !== undefined
          && row.file_name.toString().trim() !== '';

        button += hasDoc
          ? `<span class="d-block width-fit fw-bold">Document Uploaded by Citizen : <span class="text-success">Yes</span></span>`
          : `<span class="d-block width-fit fw-bold">Document Uploaded by Citizen : <span class="text-danger">No</span></span>`;

        return button;
      }
    },

    //Naitik Changes End 30/03/2026 


    //Naitik Start,Date-15/05/2025

    {
      data: "application",
      title: "Mode",
      render: function (data, type, row, meta) {
        // Append application mode if available
        let button = (row.application === "webapp" || row.application === "mobileapp")
          ? `<span class="d-block width-fit fw-bold">${row.application.replace('app', '')}</span>`
          : "";
        return button;
      },
    },


    {
      data: "uniqid",
      title: "Privilege Assigned",
      render: function (data, type, row, meta) {
        // Determine privilegeD based on days_assigned
        let privilegeD = null;

        if (row.days_assigned === 28) {
          privilegeD = "Normal";
        } else if (row.days_assigned === 7) {
          privilegeD = "Urgent";
        }

        if (row.days_assigned === 28 || row.days_assigned === 7) {
          return `<span class="d-block width-fit fw-bold">
                <span class="text-${privilegeD === 'Normal' ? 'success' : 'danger'}">${privilegeD}</span>
            </span>`;
        }

        return "";
      },
    },

    //Naitik End 15 may


    //Naitik 16 may Start


    {
      data: "mobile",
      title: "Mobile Number",
      render: function (data, type, row, meta) {

        return '<span class="text-muted">' + data + '</span>';



      },
    },


    {
      data: "updated_on",
      defaultContent: " ",
      title: "Date of Last Action",
    },


    // {
    //   data:"",
    //   defaultContent:" ",
    //   title:"Pending With",
    // },





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
      data: "grievancereference",
      defaultContent: "",
      title: "Received From",
    },
    {
      data: "createddate",
      defaultContent: "",
      title: "Date",
      render: function (data, type, row, meta) {
        if (data) {
          // Ensure data is not null or undefined
          return format_date(data); // Format the date directly
        }
        return ""; // Return an empty string if the data is null
      },
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
        } else if (data === "Resolved" || data === "Rejected") {
          return (
            '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
            row.final_status +
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

  var table136 = $("#YRreport999").DataTable({
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

        // SKY - 06/02/2025
        d.deptFilterVal = deptFilterVal; // For Filtering based on selected department
        d.catgFilterVal = catgFilterVal; // For Filtering based on selected category
        d.fdFilterVal = fdFilterVal; // For Filtering based on selected from / on date
        d.tdFilterVal = tdFilterVal; // For Filtering based on selected to date
        // SKY - 06/02/2025
        d.districtFilterVal = districtFilterVal; // For Filtering based on selected district

        d.statusFilterVal = statusFilterVal;



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

      const customClass = color[data.status]
        ? color[data.status]
        : "web-application-row";

      $(row).addClass(customClass);
    },
    order: [[6, "desc"]], // Default sorting by the second column (Grievance ID i.e uniqid)
    lengthMenu: [10, 50, 100, 500, 1000], // Page length options
    pageLength: 10, // Default page length
  });

  $("#YRreport999_filter input[type='search']").on("input", function () {
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
        url: "allDataNew",
        type: "POST",
        contentType: "application/json",
        data: chkV(
          JSON.stringify({
            start: 0, // Request all data from the backend
            length: -1, // Indicate fetch-all
            filterValue: localFilterVal, // Send filteredValue with the value of selected radio button
            clickedValue: localClickVal, // Send clickedValue with the value of clicked dashboard tab
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

  $("#YRreport999 tbody").on("click", ".griDetails", function () {
    var uniqid = $(this).data("uniqid");
    let d = chkV(uniqid);
    window.open("viewApp?d=" + d, "_blank");
  });

  // Default Search Input Validation - start
  // $('.dataTables_filter input').unbind().keyup(function (e) {
  // 	// console.log("Search input triggered");

  // 	const validPattern = /^[a-zA-Z0-9/ ]*$/; // Allow alphanumeric characters, '/' and space
  // 	let input = $(this).val();

  // 	// Remove any invalid characters from the input (strict pattern for alphanumeric, space, and '/')
  // 	if (!validPattern.test(input)) {
  // 		$(this).val(input.replace(/[^a-zA-Z0-9/ ]/g, '')); // Remove invalid characters
  // 	}

  // 	// After validation, trigger the DataTable search if the input is valid
  // 	if (validPattern.test(input)) {
  // 		var table115 = $('#dealingHandTbl').DataTable();  // Initialize the table
  // 		table115.search(input).draw();  // Trigger search on the table
  // 	}
  // });
  // // Default Search Input Validation - end
}
// Server Side datatable - end

$(document).on("click", ".fwdCpgram", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  //console.log(c)
  window.location.href = "fwdGriCpgram?d=" + d;
});

$(document).on("click", ".cpgramStatus", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  //  alert(c)
  window.location.href = "cpgramFwdGri?d=" + d;
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

Listen(document).on("click", ".tt_griev", function (e) {
  let btnVal = e.target.value;
  dnpTable(btnVal);
});

Listen(document).on("click", ".cp_griev", function (e) {
  let btnVal = e.target.value;

  var c = JSON.stringify({
    value: btnVal,
  });
  //}

  var d = chkV(c);

  var settings = {
    url: "CPGRAMGrievances?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    //console.log(j);
    if (j.statusCode == "1") {
      cpgramTable(j.data, btnVal);
    } else {
      cpgramTable(j.data, btnVal);
    }
  });
});

//NAITIK changes for tiles click filter 08/04/2026

$(document).on("click", ".count[data-value]", function (e) {
  e.preventDefault();
  if (!table145 || !cpgramRawData.length) return;

  var tileValue = $(this).data("value");
  var filtered;

  if (tileValue === "Total") {
    filtered = cpgramRawData;

  } else if (tileValue === "Pending") {
    filtered = cpgramRawData.filter(function (r) {
      return r.status === "Pending";
    });

  } else if (tileValue === "Closed") {
    filtered = cpgramRawData.filter(function (r) {
      return r.final_status === "Closed";
    });

  } else if (tileValue === "Opened") {
    filtered = cpgramRawData.filter(function (r) {
      return r.final_status !== "Closed";
    });

  } else {
    filtered = cpgramRawData.filter(function (r) {
      return r.status === tileValue;
    });
  }

  $("#YRreport000").DataTable().clear().rows.add(filtered).draw();
});

//Naitik Changes End 08/04/2026

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

$(document).on("click", ".vHis", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  // window.location.href = "historyGrievance?d=" + d;
  window.open("historyGrievance?d=" + d, "_blank");
});

$(document).on("click", ".grevP", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  // var settings = {
  //   url: "grievanceAcknowledged?d=" + d,
  //   method: "POST",
  //   timeout: 0,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // };
  // $.ajax(settings).done(function (j) {
  //   j = setV(j);
  //   j = JSON.parse(j);
  // if (j.statusCode[0] == 1) {
  //   alert("Pulled Successfully.");
  // } else {
  //   alert("Something went wrong");
  // }
  window.open("processGrievance?d=" + d, "_blank");
  // });
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
    window.location.href = "processGrievanceJKI?d=" + d;
  });
});

function dnpTable(btnVal) {
  // alert(btnVal);
  //if (btnVal == "DoesNotPertain" || btnVal == "cpgramDoesNotPertain") {
  var c = JSON.stringify({
    value: btnVal,
  });
  //}

  var d = chkV(c);
  var settings = {
    url: "api_v9?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    //   console.log(JSON.stringify(j))
    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
    }

    //console.log(j.data)
    var tblID;
    if (btnVal == "DoesNotPertain") {
      tblID = "all_tblDoesNotPertain";
    } else if (btnVal == "cpgramDoesNotPertain") {
      tblID = "cpgramTable";
    }

    $(".btn-customBtn").on("click", function () {
      // console.log($(this).val());
      table137.button("." + $(this).val()).trigger();
    });

    var table137 = $("#" + tblID).DataTable({
      data: j.data,
      destroy: true,
      lengthMenu: [10, 50, 100],
      pageLength: 10,
      scrollX: true,
      //scrollY: 500,
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
              columnWidths.push("auto");
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
          data: "uniqid",
          defaultContent: "",
          title: "Grievance ID",
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
        },
        {
          data: "createddate",
          defaultContent: "",
          title: "Submitted On",
        },
        {
          data: "flag",
          defaultContent: "",
          title: "Classification",
        },
        {
          data: "status",
          defaultContent: "",
          title: "Status",
          render: function (data, type, row, meta) {
            if (data == "dnpToOffice") {
              var st = "Does not pertain to this department";
              return st;
            } else {
              return data;
            }
          },
        },

        {
          data: "uniqid",
          defaultContent: "",
          class: "noExport",
          title: "Action",
          render: function (data, type, row, meta) {
            var btn =
              '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +
              data +
              '">History</button>';
            if (btnVal == "DoesNotPertain") {
              '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +
                data +
                '">History</button>';
              if (
                row.status == "dnpToOffice"
                // row.status == "Does not pertain to this division"
                //   && row.doesnotpertain_status == "changeDepartment"
              ) {
                btn =
                  '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +
                  data +
                  '">History</button>' +
                  //  btn + '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
                  '<button class="btn btn-sm btn-danger grevP" value = "' +
                  data +
                  '">Edit</button>';
                return btn;
              }
            }
            return btn + "</div>";
          },
        },
      ],
      rowCallback: function (row, data) {
        // Check the value of the 'application' column and apply the corresponding class
        if (data.application === "webapp") {
          $(row).addClass("web-application-row");
        } else {
          $(row).addClass("other-application-row");
        }
      },
    });
  });
}

$(document).on("click", ".forward", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  window.open("forwardAplication?d=" + d, "_blank");
});

////
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

// dealinghand - 03 April 2024 - SKY

function dhlData() {
  var settings = {
    url: "getDHList",
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
      getDealingHandList(j.data);
    } else {
      getDealingHandList(0);
    }
  });
}

function getDealingHandList(data) {
  $(".btnDlh-customBtn").on("click", function () {
    // console.log($(this).val());
    table138.button("." + $(this).val()).trigger();
  });

  var table138 = $("#dhltbl").DataTable({
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
            columnWidths.push("auto");
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
        data: "submitted_by",
        defaultContent: "",
        title: "Email",
      },
      {
        data: "designation",
        defaultContent: "",
        title: "Designation",
      },
      {
        data: "mobile",
        defaultContent: "",
        title: "Contact Number",
      },
      {
        data: "count",
        defaultContent: "",
        title: "Total",
        render: function (data, type, row) {
          var dataAttributes = 'data-submittedby="' + row.submitted_by + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn" data-toggle="modal" data-target="#myModal" ' +
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
    table138.search(cleanValue).draw(); // Update DataTable search
  });
}

$(document).on("click", ".action-btn", function (e) {
  var submittedBy = $(this).data("submittedby");
  var c = JSON.stringify({
    submittedBy: submittedBy,
  });

  let d = chkV(c);
  var settings = {
    url: "getDHList?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    //  console.log(j);
    if (j.statusCode == "1" && j.data.length > 0) {
      makeDataTable2(j.data);
    } else {
      makeDataTable2(0);
    }
  });
});

$("#dhltbl").on("click", ".action-btn", function () {
  $("#myModal").modal("show");

  // readjusting the column / row width of the table to fit in the modal window
  $("#myModal").one("shown.bs.modal", function () {
    $(".advPendingWithDiv").removeClass("visually-hidden");
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
  });
});

$("#AgeDetailedDataTable").on("click", ".ageStatus", function () {
  $("#myModal").modal("show");

  // readjusting the column / row width of the table to fit in the modal window
  $("#myModal").one("shown.bs.modal", function () {
    $(".advPendingWithDiv").removeClass("visually-hidden");
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
  });
});

function makeDataTable2(data) {
  var tableLogedGrievances = $("#filteredDHList").DataTable({
    data: data,
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
            columnWidths.push("auto");
          }
          doc.content[1].table.widths = columnWidths;
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
        title: "Grievance Id",
        render: function (data, type, row, meta) {
          return '<a href="#" ><button class="btn btn-sm vDetails" value = "' +
            data +
            '" data-appflag = "JKSAMADHAN" style="color:blue">' + data + '</button></a>';
        }
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
        data: "submitted_by",
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
      },
    ],
  });

  $(".dwd-grievancesLodged").on("click", function () {
    // console.log($(this).val());
    tableLogedGrievances.button("." + $(this).val()).trigger();
  });

}



$(document).on("click", ".ageStatus", function (e) {

  var status = this.getAttribute("data-status");
  var username = this.getAttribute("data-assignedto");
  var caseVal = this.getAttribute("data-casevalue");
  // console.log(status)

  var c = JSON.stringify({
    username: username,
    status: status,
    caseVal: caseVal
  });

  let d = chkV(c);
  var settings = {
    url: "filterdData?d=" + d,
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
      makeDataTable2(j.data);
    } else {
      makeDataTable2(j.data);
    }
  });
});
// dealinghand - 03 April 2024 - SKY

// Age Analysis Report - 05 April 2024 - SKY
var globalMISRadioValue = "userwise"; // Default value
var globalActiveTabValue = "JKSAMADHAN"; // Default tab value

$(document).on("change", ".data-whichWise", function (e) {
  var chckRadioVal = $(this).val();
  // globalMISRadioValue = chckRadioVal;
  // ageAreportData(globalMISRadioValue, globalActiveTabValue);

  if (window.location.href.indexOf("/agePage") != -1) {
    ageAreportData(chckRadioVal);
  }

  if (window.location.href.indexOf("/agePendingPage") != -1) {
    agePendingAreportData(chckRadioVal);
  }
  if (window.location.href.indexOf("/uWRpt") != -1) {
    uWRptData(chckRadioVal);
  }
  if (window.location.href.indexOf("/conPenrpt") != -1) {
    conPenrptData(chckRadioVal);
  }

});
// $(document).on("click", "#pills-tab-AA button", function (e) {
//   var activeTabValue = $(this).data("value");
//   globalActiveTabValue = activeTabValue;
//   ageAreportData(globalMISRadioValue, globalActiveTabValue);
// });

function ageAreportData(globalMISRadioValue, globalActiveTabValue) {
  var c = JSON.stringify({ val: globalMISRadioValue, activeTabVal: globalActiveTabValue });
  var d = chkV(c);
  var settings = {
    url: "ageAnalysisReport?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };

  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j);
    getAgeAnalysis(j.data, globalMISRadioValue);
  });
}


//utkarsh chnages 05-05-2026 Age wise pendency Report filter
// Store raw data globally for filtering (set after agePendingAreportData loads)
var ageRawData = [];

// Override getAgeAnalysis to also store raw data
var _originalGetAgeAnalysis = getAgeAnalysis;
// We'll patch ageRawData inside agePendingAreportData instead (see below)

// Apply Filter button
$(document).on("click", "#applyAgeFilter", function () {
    var selectedDistrict = $("#ageFilterDistrict").val();
    var selectedDept = $("#ageFilterDept").val();

    // normalize selected values once
    var selectedDistrictVal = (selectedDistrict || "").toString().trim().toLowerCase();
    var selectedDeptVal = (selectedDept || "").toString().trim().toLowerCase();

    var filtered = ageRawData.filter(function (row) {
        var districtMatch = true;
        var deptMatch = true;

        //  District filter (ONLY use district_name)
        if (selectedDistrictVal !== "") {
            var rowDistrict = (row.district_name || "").toString().trim().toLowerCase();
            districtMatch = rowDistrict === selectedDistrictVal;
        }

        //  Department filter (ONLY use department_name)
        if (selectedDeptVal !== "") {
            var rowDept = (row.department_name || "").toString().trim().toLowerCase();
            deptMatch = rowDept === selectedDeptVal;
        }

        return districtMatch && deptMatch;
    });

    // Update the DataTable with filtered data
    if ($.fn.DataTable.isDataTable("#dhltbl")) {
        $("#dhltbl").DataTable().clear().rows.add(filtered).draw();
    }

    // Close the offcanvas
    var offcanvasEl = document.getElementById("filterOffcanvas");
    var bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
});
// Reset Filter button
$(document).on("click", "#resetAgeFilter", function () {
    $("#ageFilterDistrict").val("");
    $("#ageFilterDept").val("");

    // Restore full data
    if ($.fn.DataTable.isDataTable("#dhltbl")) {
        $("#dhltbl").DataTable().clear().rows.add(ageRawData).draw();
    }

    // Close the offcanvas
    var offcanvasEl = document.getElementById("filterOffcanvas");
    var bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) bsOffcanvas.hide();
});

//end utkarsh chnages 05-05-2026 Age wise pendency Report filter

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

//Added by utkarsh 05-05-2026 to populate filter dropdowns in age wise pendency report
function populateAgeFilterDropdownsFromData(data) {
    var districts = {};
    var departments = {};

    $.each(data, function (i, row) {
        //  Always use standardized master values
        var distRaw = (row.district_name || "").toString().trim();
        var deptRaw = (row.department_name || "").toString().trim();

        //  Normalize to avoid duplicates (case/space issues)
        var distKey = distRaw.toLowerCase();
        var deptKey = deptRaw.toLowerCase();

        if (distRaw) districts[distKey] = distRaw;
        if (deptRaw) departments[deptKey] = deptRaw;
    });

    // Populate district dropdown
    var distSelect = $("#ageFilterDistrict");
    distSelect.html('<option value="">Districts</option>');
    $.each(Object.keys(districts).sort(), function (i, key) {
        distSelect.append('<option value="' + districts[key] + '">' + districts[key] + '</option>');
    });

    // Populate department dropdown
    var deptSelect = $("#ageFilterDept");
    deptSelect.html('<option value="">Departments</option>');
    $.each(Object.keys(departments).sort(), function (i, key) {
        deptSelect.append('<option value="' + departments[key] + '">' + departments[key] + '</option>');
    });
}
//ended by utkarsh 05-05-2026 to populate filter dropdowns in age wise pendency report
function getAgeAnalysis(data, radioVal) {
  // console.log(radioVal);

  $(".btnAA-customBtn").on("click", function () {
    table139.button("." + $(this).val()).trigger();
  });

  var reprotType = $('.reportType').val();
  //  console.log(reprotType)
  var columns = [];
  var headingText = "";
  if (radioVal === "userwise") {
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
        title: "Office Name & Designation123",
      },
      {
        data: "department",
        defaultContent: "",
        title: "Department",
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
      // {
      //   data: "origin",
      //   defaultContent: "",
      //   title: "Window",
      // },
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
  } else if (radioVal === "deptwise" || radioVal === "deptmentalwise") {
    columns = [
      {
        // data: "Sl. No.",
        title: "S. No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      // {
      //   data: "department",
      //   defaultContent: "",
      //   title: "Department",
      // },
      // added by utkarsh - 04-05-2026 (dm_district is added in backend for age analysis report)
      {
        data: "dm_district",
        defaultContent: "",
        title: "District",
      },
      {
        data: "d1",
        defaultContent: "",
        title: "0 - 7 Days",
        render: function (data, type, row) {
          var dataAttributes = [
            'data-assignedto="' + chkA(row.department) + '"',
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
            'data-assignedto="' + chkA(row.department) + '"',
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
            'data-assignedto="' + chkA(row.department) + '"',
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
            'data-assignedto="' + chkA(row.department) + '"',
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
            'data-assignedto="' + chkA(row.department) + '"',
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
      headingText = "Department Wise Age Analysis";

    } else {
      headingText = "Department Wise Pending Age Analysis";

    }
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
    destroy: true, // Ensure existing DataTable instance is destroyed
    data: data,
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
            columnWidths.push("auto");
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

$(document).on("click", ".action-btn2", function (e) {
  console.log(setV($(this).data("assignedto")));
  console.log(setV($(this).data("caseval")));

  var assigned_to = setV($(this).data("assignedto"));
  var caseVal = setV($(this).data("caseval"));
  if (caseVal != "NA") {
    var c = JSON.stringify({
      value: globalMISRadioValue,
      caseVal: caseVal,
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
    // console.log(j);
    if (j.statusCode == "1" && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
      detailsAgeTbl(j.data, j.MISRadioVal, j.caseValue);
    } else {
      detailsAgeTbl(0, j.MISRadioVal);
    }
  });
}

function detailsAgeTbl(data, misRadioVal, caseValue) {
  // console.log("detailsAgeTbl working..")

  // console.log(data)

  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table140.button("." + $(this).val()).trigger();
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
      data: "total_count",
      defaultContent: "",
      title: "Total",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
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
      title: "Resolved",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
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
      title: "Pending",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
          row.pending_count +
          '" data-status = "Pending" ' +
          dataAttributes +
          ">" +
          data +
          "</button>"
        );
      },
    },
    // Forwarded, DNP, Remark Added statues 04/11/2024 - SKY - start
    // Forwarded
    {
      data: "forwarded_count",
      defaultContent: "",
      title: "Forwarded",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
          row.forwarded_count +
          '" data-status = "Forwarded" ' +
          dataAttributes +
          ">" +
          data +
          "</button>"
        );
      },
    },
    // DNP
    {
      data: "dnp_count",
      defaultContent: "",
      title: "Does Not Pertain",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
          row.dnp_count +
          '" data-status = "dnpToOffice" ' +
          dataAttributes +
          ">" +
          data +
          "</button>"
        );
      },
    },
    // Remark Added
    {
      data: "remark_count",
      defaultContent: "",
      title: "Remark Added",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
          row.remark_count +
          '" data-status = "Remark Added" ' +
          dataAttributes +
          ">" +
          data +
          "</button>"
        );
      },
    },
    // end
    {
      data: "rejected_count",
      defaultContent: "",
      title: "Rejected",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
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
      title: "Appealed",
      render: function (data, type, row) {
        var dataAttributes = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        return (
          '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#staticBackdrop" value = "' +
          row.appealed_count +
          '" data-status = "Appealed" ' +
          dataAttributes +
          ">" +
          data +
          "</button>"
        );
      },
    },
    // lg_count
    // {
    //   data: "lg_count",
    //   defaultContent: "",
    //   title: "LG Mulakat",
    //   render: function (data, type, row) {
    //     var dataAttributes = 'data-assignedto="' + row.assigned_to + '" ';
    //     return (
    //       '<button class="btn btn-sm" data-toggle="modal" data-target="#staticBackdrop" value = "' +
    //       row.appealed_count +
    //       '" data-status = "Appealed" ' +
    //       dataAttributes +
    //       ">" +
    //       data +
    //       "</button>"
    //     );
    //   },
    // },
  ];
  // console.log("globalMISRadioValue :: " + misRadioVal)
  // Conditionally add columns based on misRadioVal
  if (misRadioVal === "userwise") {
    column.splice(
      1,
      0, // Insert at index 1
      {
        data: "name",
        defaultContent: "",
        title: "Officer Name",
      },
      {
        data: "username",
        defaultContent: "",
        title: "Email",
      }
    );
  } else if (misRadioVal === "deptwise") {
    column.splice(
      1,
      0, // Insert at index 1
      {
        data: "department",
        defaultContent: "",
        title: "Department",
      }
    );
  }

  var table140 = $("#AgeDetailedDataTable").DataTable({
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
            columnWidths.push("auto");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: column,
  });

  $("#AgeDetailedDataTable_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table140.search(cleanValue).draw(); // Update DataTable search
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
    //  console.log("Data to be sent is ", c);
    $.ajax(settings).done(function (j) {
      j = JSON.parse(setV(j));
      //   console.log(j)

      if (j.statusCode == "1" && j.data.length > 0) {
        j.data = j.data.map((current) => {
          if (current.createddate != null) {
            current.createddate = format_date(current.createddate);
          }
          return current;
        });

        $(".btn-customBtn").on("click", function () {
          // console.log($(this).val());
          table141.button("." + $(this).val()).trigger();
        });
        var table141 = $("#ageStatWiseReport").DataTable({
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
                  columnWidths.push("auto");
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

function uWRptData(radioVal) {
  var c = JSON.stringify({ val: radioVal });
  var d = chkV(c);
  var settings = {
    url: "uWRptDataApi?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j)
    getUserWiseReport(j.data, radioVal);
  });
}

function getUserWiseReport(data, radioVal) {
  $(".btnSW-customBtn").on("click", function () {
    // console.log($(this).val());
    table142.button("." + $(this).val()).trigger();
  });

  var columns = [];
  if (radioVal === "userwise") {
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
        data: "total_count",
        defaultContent: "",
        title: "Total",
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
        title: "Resolved",
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
        title: "Pending",
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
      // Adding Forwarded, DNP, and Remarked Added Statues - 04/11/2024 - start - SKY
      // Forwarded
      {
        data: "forwarded_count",
        defaultContent: "",
        title: "Forwarded",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.forwarded_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Forwarded" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      // DNP
      {
        data: "dnp_count",
        defaultContent: "",
        title: "Does Not Pertain",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.dnp_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "dnpToOffice" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      // Remark Added
      {
        data: "remark_count",
        defaultContent: "",
        title: "Remark Added",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.remark_grv_ids) + '"';
          return (
            '<button class="btn btn-sm btn-link action-btn3" data-toggle="modal" data-target="#myModal" data-status = "Remark Added" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      // Adding Forwarded, DNP, and Remarked Added Statues - 04/11/2024 - end - SKY
      {
        data: "rejected_count",
        defaultContent: "",
        title: "Rejected",
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
        title: "Appealed",
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
    ];
    headingText = "User Wise Status Report";
  } else if (radioVal === "deptwise") {
    columns = [
      {
        // data: "Sl. No.",
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
        data: "total_count",
        defaultContent: "",
        title: "Total",
        render: function (data, type, row) {
          var dataAttributes =
            row.total_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.total_grv_ids) + '"';
          return (
            '<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "Total" ' +
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
        title: "Resolved",
        render: function (data, type, row) {
          var dataAttributes =
            row.resolved_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.resolved_grv_ids) + '"';
          return (
            '<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "Resolved" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      // Adding Forwarded, DNP, and Remarked Added Statues - 04/11/2024 - start - SKY
      // Forwarded
      {
        data: "forwarded_count",
        defaultContent: "",
        title: "Forwarded",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.forwarded_grv_ids) + '"';
          return (
            '<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "Forwarded" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      // DNP
      {
        data: "dnp_count",
        defaultContent: "",
        title: "Does Not Pertain",
        render: function (data, type, row) {
          var dataAttributes =
            row.pending_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.dnp_grv_ids) + '"';
          return (
            '<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "dnpToOffice" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
      // Remark Added
      // {
      // 	data: "remark_count",
      // 	defaultContent: "",
      // 	title: "Remark Added",
      // 	render: function (data, type, row) {
      // 		var dataAttributes =
      // 			row.pending_grv_ids == null
      // 				? 'data-grvid="NA"'
      // 				: 'data-grvid="' + chkA(row.remark_grv_ids) + '"';
      // 		return (
      // 			'<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "Remark Added" ' +
      // 			dataAttributes +
      // 			">" +
      // 			data +
      // 			"</button>"
      // 		);
      // 	},
      // },
      // Adding Forwarded, DNP, and Remarked Added Statues - 04/11/2024 - end - SKY
      {
        data: "pending_count",
        defaultContent: "",
        title: "Pending",
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
      {
        data: "rejected_count",
        defaultContent: "",
        title: "Rejected",
        render: function (data, type, row) {
          var dataAttributes =
            row.rejected_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.rejected_grv_ids) + '"';
          return (
            '<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "Rejected" ' +
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
        title: "Appealed",
        render: function (data, type, row) {
          var dataAttributes =
            row.appealed_grv_ids == null
              ? 'data-grvid="NA"'
              : 'data-grvid="' + chkA(row.appealed_grv_ids) + '"';
          return (
            '<button class="btn btn-sm" data-toggle="modal" data-target="#myModal" data-status = "Appealed" ' +
            dataAttributes +
            ">" +
            data +
            "</button>"
          );
        },
      },
    ];
    headingText = "Department Wise Status Report";
  }

  // Check if DataTable is already initialized
  if ($.fn.DataTable.isDataTable("#dhltbl")) {
    var table = $("#dhltbl").DataTable();
    table.clear(); // Clear the table data
    table.destroy(); // Destroy the table
    $("#dhltbl").empty(); // Empty the table element
  }

  var table142 = $("#dhltbl").DataTable({
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
            columnWidths.push("auto");
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

  $("#dhltbl_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table142.search(cleanValue).draw(); // Update DataTable search
  });
  $(".whichWiseHeading").text(headingText);
}

$(document).on("click", ".action-btn3", function (e) {
  // console.log($(this).data("grvid"))
  var status = $(this).data("status");
  var grvID = $(this).data("grvid");
  // console.log(grvID);
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
    //  console.log(j);
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
    table143.button("." + $(this).val()).trigger();
  });
  var table143 = $("#UWdetailedDataTable").DataTable({
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
            columnWidths.push("auto");
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

  $("#UWdetailedDataTable_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table143.search(cleanValue).draw(); // Update DataTable search
  });
}
// USer Wise

function cpgramGrievances(btnVal) {
  var c = JSON.stringify({
    value: btnVal,
  });

  var d = chkV(c);
  var settings = {
    url: "CPGRAMGrievances?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    //	console.log(format_date(j.data[0].created_date));
    //format_date(j.data[0].created_date);
    $('#lastFetched').text("Last Fetched: " + format_date(j.data[0].created_date))
    cpgramRawData = j.data || [];
    if (j.statusCode == "1") {
      cpgramTable(j.data, btnVal, j.user_type);
    } else {
      cpgramTable(j.data, btnVal, j.user_type);
    }
  });
}

function cpgramTable(data, btnVal, user_type) {
  //console.log(data)
  var tbId;
  if (btnVal == "cpgramTotal") {
    tbId = "YRreport000";
  } else if (btnVal == "cpgramDoesNotPertain") {
    tbId = "cpgramTable";
  }

  var columns = [
    {
      title: "S. No.",
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      data: "registration_no",
      defaultContent: "",
      title: "Registration No",
    },
    {
      data: "category",
      defaultContent: "",
      title: "Category",
    },
    {
      data: "from_org_name",
      defaultContent: "",
      title: "Organisation Name",
    },
    {
      data: "date_of_receipt",
      defaultContent: "",
      title: "Submitted On",
      render: function (data, type, row, meta) {

        return format_date(data);
      }

    },
    //  {
    //   data: "created_date",
    //   defaultContent: "",
    //   title: "Fetched On",
    //   render: function(data,type,row,meta){

    //     return format_date(data);
    //   }
    // },
    {
      data: "name",
      defaultContent: "",
      title: "Name",
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
        } else if (data === "Resolved" || data === "Rejected") {
          return (
            '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
            row.final_status +
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
        } else if (data === "Closed") {
          return (
            '<div class="btn pe-none btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
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

    // {
    //   data: "registration_no",
    //   defaultContent: "",
    //   title: "Forwarded To",
    //   render: function (data, type, row, meta) {
    //     var btn =
    //       '<div><a href="#" data-value = "' +
    //       data +
    //       '" class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
    //     return btn;
    //   },
    // },

    {
      data: "updated_date",
      defaultContent: "",
      title: "Last Action On",
      render: function (data, type, row, meta) {

        return format_date(data);
      }
    },
    {
      data: "assigned_user_info",
      defaultContent: "",
      title: "Forwarded To",

    },
    {
      data: "department",
      defaultContent: "",
      title: "Forwarded Department",
    },
  ];

  if (user_type == "ROLE_SuperAdmin") {
    columns.push({
      data: "registration_no",
      defaultContent: "",
      class: "noExport",
      title: "Action",
      render: function (data, type, row, meta) {
        var btn =
          '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vHis" title="History" value = "' +
          data +
          '"></button>';

        var btn =
          '<div class="dropdown">' +
          '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
          '<i class="bi bi-three-dots"></i>' +
          "</button>" +
          '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
          '<li class=""><button class="btn btn-sm vDetails" value = "' +
          data +
          '" data-appflag = "cpgrams">Grievance Details</button></li>';

        if (["dnpToOffice"].includes(row.status)) {

          btn =
            btn +
            '<li class=""><button class="btn btn-sm grevP" value = "' +
            data +
            '">Edit</button></li>';
        }

        if (row.status == "Pending") {
          btn =
            btn +
            '<li class=""><button class="btn btn-sm forward" value = "' +
            data +
            '">Forward</button></li>';
        }

        //  if(['Pending','dnpToOffice'].includes(row.status)){
        //    btn =
        //     btn +
        //     '<li class=""><button class="btn btn-sm cpgramReturn" value = "' +
        //     data +
        //     '">Return To CPGRAM</button></li>';
        // }



        return btn + "</ul></div>";


      },
    });
  }
  /*	if(btnVal=="cpgramDoesNotPertain"){
    	
    columns.push(
     {
      data: "registration_no",
      defaultContent: "",
      class: "noExport",
      title: "Action",
      render: function (data, type, row, meta) {
        var btn ='<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +data +'">History</button>';
        if (btnVal == "DoesNotPertain") {
        if (
          row.status == "dnpToOffice" 
         // row.status == "Does not pertain to this division" 
         //   && row.doesnotpertain_status == "changeDepartment"
        ) {
          btn ='<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +data +'">History</button>'+
          //  btn + '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
          '<button class="btn btn-sm btn-danger grevP" value = "' +
          data +
          '">Edit</button>';
          return btn;
        }
        }
        return btn + "</div>";
      },
      },
      )
    }*/
  $(".btn-CPcustomBtn").on("click", function () {
    // console.log($(this).val());
    table145.button("." + $(this).val()).trigger();
  });
  table145 = $("#" + tbId).DataTable({
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
            columnWidths.push("auto");
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

  $("#YRreport000_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table145.search(cleanValue).draw(); // Update DataTable search
  });
}

$(document).on("click", ".fwd", function (e) {
  let gId = this.getAttribute("data-value");
  //console.log(this.getAttribute('data-value'));
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
      data: "assigned_to",
      defaultContent: "",
      title: "Email Id",
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
  ];
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
  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table146.button("." + $(this).val()).trigger();
  });
  var table146 = $("#assignedTable").DataTable({
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
            columnWidths.push("auto");
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
  table146.columns.adjust().draw();
}

$(document).on("click", ".cpgramgrevP", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  window.location.href = "forwardAplication?d=" + d;

  //   window.location.href = "cpgramProcessGrievance?d=" + d;
});

$(document).on("click", "#fetchGri", function (e) {
  //console.log("clicked");
  spinner();
  var settings = {
    url: "getGrievances",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    /*j = setV(j);
      j = JSON.parse(j);*/
    //	console.log(j)
    if (j == "Successful.") {
      document.getElementsByClassName("yr-loader")[0].style.display = "none";
      alert("Grievances fetched successfully");
      //}else if(j==" - You have already sent consumption flag for this grievance"){
    } else {
      alert("No data to fetch");
      // location.reload();
    }
    localStorage.setItem('activateCpgramTab', 'true');
    location.reload();

  });
});

$(document).ready(function () {
  // Check if the flag is set in localStorage
  if (localStorage.getItem('activateCpgramTab') === 'true') {
    // Trigger the click to activate the "CPGRAMS" tab
    $('#pills-cpgram-tab').click();

    // Clear the flag so it doesn't keep activating the tab on every reload
    localStorage.removeItem('activateCpgramTab');
  }
});


function spinner() {
  document.getElementsByClassName("yr-loader")[0].style.display = "flex";
}

// JK-IGRAMS - 25th JUNE - SKY

function jkiGram() {
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
      data: "pending_at",
      defaultContent: "",
      title: "Pending With",
    },

    {
      data: "current_status",
      defaultContent: "",
      title: "JKIGRAMS Status",
    },

    {
      data: "status",
      defaultContent: "",
      title: "JKSamadhan Status",
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

    // {
    //   data: "reference_id",
    //   defaultContent: "",
    //   title: "Forwarded To",
    //   render: function (data, type, row, meta) {
    //     var btn =
    //       '<div><a href="#" data-value = "' +
    //       data +
    //       '" class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
    //     return btn;
    //   },
    // },

    {
      data: "reference_id",
      defaultContent: "",
      class: "noExport",
      title: "Action",
      render: function (data, type, row, meta) {

        var btn =
          '<button class="btn btn-sm vDetails bi bi-eye" value = "' +
          data + '" title="View Details"' +
          '" data-appflag = "JKIGRAMS"></button>';

        return btn;

        // var btn =
        //   '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vHis" title="History" value = "' +
        //   data +
        //   '"></button>';

        // var btn =
        //   '<div class="dropdown">' +
        //   '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
        //   '<i class="bi bi-three-dots"></i>' +
        //   "</button>" +
        //   '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
        //   '<li class=""><button class="btn btn-sm vDetails" value = "' +
        //   data +
        //   '" data-appflag = "JKIGRAMS">Grievance Details</button></li>';

        // + '<li class=""><button class="btn btn-sm vHis" title = "History" value = "' +
        //   data +
        //   '">History</button></li>';

        // if (row.user_type == "ROLE_SuperAdmin") {
        //   if (row.status == "Appealed" && usdd == "no") {
        //     btn =
        //       btn +
        //       '<li class=""><button class="btn btn-sm appP" value = "' +
        //       data +
        //       '" id="grevP">Process</button></li>';
        //   } else if (row.status == "dnpToOffice") {
        //     btn =
        //       btn +
        //       '<li class=""><button class="btn btn-sm vHis" value = "' +
        //       data +
        //       '">History</button></li>' +
        //       btn + '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
        //     '<li class=""><button class="btn btn-sm grevP" value = "' +
        //       data +
        //       '">Edit</button></li>';
        //   }
        // }

        // return btn + "</ul></div>";
      },
    },
    // {
    //   data: "registration_no",
    //   defaultContent: "",
    //   title: "Forwarded To",
    //   render: function (data, type, row, meta) {
    //     var btn =
    //       '<div><a href="#" data-value = "' +
    //       data +
    //       '" class="btn btn-sm btn-primary bi bi-eye fwd" title="View"></a>';
    //     return btn;
    //   },
    // },

    // {
    //   data: "registration_no",
    //   defaultContent: "",
    //   class: "noExport",
    //  title: "Action",
    //   render: function (data, type, row, meta) {
    //     var btn;
    //     if (btnVal == "cpgramTotal") {
    //       btn =
    //         '<button class="forward btn btn-warning btn-sm yr-mw " value = "' +
    //         data +
    //         '">Forward</button>';
    //     } else {
    //       btn =
    //         '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vHis" value = "' +
    //         data +
    //         '">History</button>' +
    //         '<button class="btn btn-sm btn-danger cpgramgrevP" value = "' +
    //         data +
    //         '">Edit</button>';
    //       return btn;
    //     }

    //     return btn + "</div>";
    //   },
    // },
  ];
  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table158.button("." + $(this).val()).trigger();
  });
  var table158 = $("#YRreport010").DataTable({
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
            columnWidths.push("auto");
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
      url: "jkIgramsApi",
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

  $("#YRreport010_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table158.search(cleanValue).draw(); // Update DataTable search
  });
}

function getlgmulakartable(btnVal) {
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "allDataLgMeetings?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    var arr = [];
    if (j.statusCode == "1") {
      var data = j.data;
      $.each(data, function (index, value) {
        arr.push(value);
      });
      getDataall(arr, j.user_type, btnVal);
    }
  });
}

$(document).on("click", ".data-lgm", function (e) {
  var btnVal = $(this).val();
  //function getlgmulakartable() {
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "allDataLgMeetings?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    var arr = [];
    if (j.statusCode == "1") {
      var data = j.data;
      $.each(data, function (index, value) {
        arr.push(value);
      });
      getDataall(arr, j.user_type, btnVal);
    }
  });
  //}
});
var table147 = null;
function getDataall(data, user_type, btnVal) {
  if (data.length > 0) {
    data = data.map((current) => {
      if (current.createddate != null) {
        current.createddate = format_date(current.createddate);
      }
      return current;
    });
  }

  $(".btn-customBtn").on("click", function () {
    table147.button("." + $(this).val()).trigger();
  });

  table147 = $("#lgmulakatdata").DataTable({
    data: data,
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
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
      },
    ],
    columns: [
      {
        // title: "<button class='btn btn-sm btn-danger text-white forlgm' title='Action' type='button'>Action</button>",
        render: function (data, type, row) {
          return `<input type="checkbox" class="row-checkbox" data-uniqid="${row.uniqid}">`;
        },
        orderable: false,
      },
      {
        title: "Sr. no",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "uniqid",
        title: "Grievance ID",
        render: function (data, type, row, meta) {
          return (
            '<button class="btn btn-link grievance-btn griDetails" data-uniqid="' +
            data +
            '">' +
            data +
            "</button>"
          );
        },
      },

      {
        data: "department",
        defaultContent: "",
        title: "Department",
      },
      /*{
        data: "category",
        defaultContent: "",
        title: "Category",
      },*/
      {
        data: "name",
        defaultContent: "",
        title: "Submitted By",
      },
      {
        data: "createddate",
        defaultContent: "",
        title: "Submitted Date",
        render: function (data, type, row) {
          if (data) {
            return data.split(" ")[0]; // Assuming your date and time are separated by a space
          }
          return "";
        },
      },
      {
        data: "status",
        defaultContent: "",
        title: "Status",
      },
    ],
    rowCallback: function (row, data) {
      // Check the value of the 'application' column and apply the corresponding class
      if (data.application === "webapp") {
        $(row).addClass("web-application-row");
      } else {
        $(row).addClass("other-application-row");
      }
    },
  });

  $("#lgmulakatdata_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table147.search(cleanValue).draw(); // Update DataTable search
  });

  // Enforce the 20-row selection limit
  $("#lgmulakatdata").on("change", ".row-checkbox", function () {
    var maxSelection = 20;
    var selectedCount = table147.$("input.row-checkbox:checked").length;

    if (selectedCount > maxSelection) {
      alert("You can only select up to " + maxSelection + " rows.");
      $(this).prop("checked", false);
    }
  });

  $("#lgmulakatdata tbody").on("click", ".griDetails", function () {
    var uniqid = $(this).data("uniqid");
    // Continue with your custom function
    let d = chkV(uniqid);
    // window.location.href = "viewApp?d=" + d;
    window.open("viewApp?d=" + d, "_blank");
  });
}

$(".forlgm").on("click", function () {
  var seldate = document.getElementById("meetingdate").value;
  //console.log("Date", seldate, "s");
  if (seldate === "") {
    alert("please select date");
  } else {
    var selectedRows = [];
    table147.$("input.row-checkbox:checked").each(function () {
      selectedRows.push($(this).data("uniqid"));
    });
    if (selectedRows != "") {
      var selectedValue = $('input[name="total-lgm"]:checked').val();
      var selectedHlgVal = getSelectedValuesChk(selectedRows);
      var d = chkV(selectedHlgVal);
      var settings = {
        url:
          "SaveCheckedLgid?d=" +
          d +
          "&mdate=" +
          encodeURIComponent(seldate) +
          "&t=" +
          selectedValue,
        method: "POST",
        timeout: 0,
      };
      $.ajax(settings).done(function (j) {
        j = JSON.parse(setV(j));
        //console.log(j);
        if (j.statusCode == "1") {
          alert("Grievance has been selected for LG mulakat");
          window.location.reload();
        } else {
          alert("Not able to process. Please try again later.");
          window.location.reload();
        }
      });
    } else {
      alert("Please select atleast 20 grievances for LG Mulakat");
    }
  }
});

function getMeetingSummery() {
  var settings = {
    url: "allDataLgMSelected",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    var arr = [];
    if (j.statusCode == "1") {
      var data = j.data;
      $.each(data, function (index, value) {
        arr.push(value);
      });
      getMeetingDataall(arr, j.user_type);
    }
  });
}

function getMeetingDataall(data, user_type) {
  if (data.length > 0) {
    data = data.map((current) => {
      if (current.createddate != null) {
        current.createddate = format_date(current.createddate);
      }
      return current;
    });
  }

  $(".btn-customBtn").on("click", function () {
    table148.button("." + $(this).val()).trigger();
  });

  var table148 = $("#meetingsummery").DataTable({
    data: data,
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
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
      },
    ],
    columns: [
      {
        title: "Sr no",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "meetingdate",
        defaultContent: "",
        title: "Meeting Date",
        render: function (data, type, row) {
          if (data) {
            return data.split(" ")[0]; // Assuming your date and time are separated by a space
          }
          return "";
        },
      },
      {
        data: null,
        title: "Actions",
        render: function (data, type, row, meta) {
          return (
            '<button class="btn btn-sm btn-primary lgmdtl" data-meetingdate="' +
            data.meetingdate +
            '">Show Minutes of Meetings</button>'
          );
        },
      },
    ],
    rowCallback: function (row, data) {
      // Check the value of the 'application' column and apply the corresponding class
      if (data.application === "webapp") {
        $(row).addClass("web-application-row");
      } else {
        $(row).addClass("other-application-row");
      }
    },
  });

  $("#meetingsummery_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table148.search(cleanValue).draw(); // Update DataTable search
  });

  $("#meetingsummery tbody").on("click", ".lgmdtl", function () {
    var selectedDate = $(this).attr("data-meetingdate");
    let d = chkV(selectedDate);
    window.location.href = "viewDateMeeting?d=" + d;
    //getSummurylgmDatedata(selectedDate);
  });
}

function getLGMSelectedDate() {
  var settings = {
    url: "allDataLgMSelected",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    var arr = [];
    if (j.statusCode == "1") {
      var data = j.data;
      $.each(data, function (index, value) {
        arr.push(value);
      });
      getlgmDataall(arr, j.user_type);
    }
  });
}

function getlgmDataall(data, user_type) {
  if (data.length > 0) {
    data = data.map((current) => {
      if (current.createddate != null) {
        current.createddate = format_date(current.createddate);
      }
      return current;
    });
  }

  $(".btn-customBtn").on("click", function () {
    table149.button("." + $(this).val()).trigger();
  });

  var table149 = $("#lgmlist").DataTable({
    data: data,
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
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
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
        data: "meetingdate",
        defaultContent: "",
        title: "Meeting Date",
        render: function (data, type, row) {
          if (data) {
            return data.split(" ")[0]; // Assuming your date and time are separated by a space
          }
          return "";
        },
      },
      {
        data: null,
        title: "Actions",
        render: function (data, type, row, meta) {
          return (
            '<button class="toggle-arrow arrow-btn" data-meetingdate="' +
            data.meetingdate +
            '"><i class="bi bi-chevron-down"></i></button>'
          );
        },
      },
    ],
    rowCallback: function (row, data) {
      if (data.application === "webapp") {
        $(row).addClass("web-application-row");
      } else {
        $(row).addClass("other-application-row");
      }
    },
  });

  $("#lgmlist_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table149.search(cleanValue).draw(); // Update DataTable search
  });

  $("#lgmlist tbody").on("click", ".toggle-arrow", function () {
    var tr = $(this).closest("tr");
    var row = table149.row(tr);
    var cardRow = tr.next("tr.card-row");

    // Close all other open card rows and clear their content
    $("#lgmlist")
      .find("tr.card-row")
      .not(cardRow)
      .each(function () {
        $(this).remove();
      });

    // Toggle visibility of the clicked card row
    if (cardRow.length === 0) {
      var selectedDate = $(this).data("meetingdate");
      getSelectedDatedata(selectedDate);
      table149.columns.adjust().draw();
      // Card row does not exist, create it
      //  tr.after('<tr class="card-row"><td colspan="3"><div class="card">Card content for ' + data[row.index()].meetingdate + '</div></td></tr>');
      tr.after(
        '<tr class="card-row"><td colspan="3"><div class="card"><div class="card-body "><table class="table stripe datatable" id="selectedDatetable"style="width: 100%;"></table></div></div></td></tr>'
      );
    } else {
      // Card row exists, toggle its visibility
      cardRow.toggle();
    }
  });
}

function getSelectedDatedata(sdate) {
  var settings = {
    url: "getSelectedDateDatalgm?sdate=" + sdate,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    var arr = [];
    if (j.statusCode == "1") {
      var data = j.data;
      $.each(data, function (index, value) {
        arr.push(value);
      });
      getlgmDatasel(arr, j.user_type);
    }
  });
}
function getlgmDatasel(data, user_type) {
  if (data.length > 0) {
    data = data.map((current) => {
      if (current.createddate != null) {
        current.createddate = format_date(current.createddate);
      }
      return current;
    });
  }

  $(".btn-customBtn").on("click", function () {
    table150.button("." + $(this).val()).trigger();
  });

  var table150 = $("#selectedDatetable").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    responsive: true,
    //	scrollY: 500,
    paging: true,
    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
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
        title: "Grievance ID",
        render: function (data, type, row, meta) {
          return (
            '<button class="btn btn-link grievance-btn griDetails" data-uniqid="' +
            data +
            '">' +
            data +
            "</button>"
          );
        },
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
        data: "meetingdate",
        defaultContent: "",
        title: "Meeting Date",
        render: function (data, type, row) {
          if (data) {
            return data.split(" ")[0]; // Assuming your date and time are separated by a space
          }
          return "";
        },
      },
      {
        data: "insertdate",
        defaultContent: "",
        title: "Insert Date",
        render: function (data, type, row) {
          if (data) {
            return data.split(" ")[0]; // Assuming your date and time are separated by a space
          }
          return "";
        },
      },
      /*  {
          data: "remarks",
          defaultContent: "",
          title: "LG Remarks",
        },*/
      {
        title: "Remarks",
        render: function (data, type, row, meta) {
          if (
            row.remarks === null ||
            row.remarks === undefined ||
            row.remarks === ""
          ) {
            return ""; // Return an empty string if from_lg is not "yes"
          } else {
            // Assuming you have a function showRemarksDialog() to handle the click event
            return '<button class="btn btn-sm btn-primary btn-viewrem" data-bs-toggle="modal" data-bs-target="#viewremark">View LG remarks</button>';
          }
        },
      },
      {
        title: "Actions",
        render: function (data, type, row, meta) {
          if (row.from_lg === "Yes") {
            return ""; // Return an empty string if from_lg is not "yes"
          } else {
            var uniqid1 = row.uniqid;
            //	console.log("uniqid:", uniqid1); // Debugging line
            // Assuming you have a function showRemarksDialog() to handle the click event
            return '<button class="btn btn-sm btn-primary btn-remarks" data-bs-toggle="modal" data-bs-target="#remarkmodal">LG Remarks</button>';
          }
        },
      },
    ],
    rowCallback: function (row, data) {
      // Check the value of the 'application' column and apply the corresponding class
      if (data.application === "webapp") {
        $(row).addClass("web-application-row");
      } else {
        $(row).addClass("other-application-row");
      }
    },
  });
  // Add event listener for opening the modal and passing uniqid
  $("#selectedDatetable tbody").on("click", ".btn-remarks", function () {
    var data = table150.row($(this).parents("tr")).data();
    showRemarksDialog(data.uniqid, data.id, data.remarks);
  });
  $("#selectedDatetable tbody").on("click", ".griDetails", function () {
    var uniqid = $(this).data("uniqid");
    // Continue with your custom function
    let d = chkV(uniqid);
    // window.location.href = "viewApp?d=" + d;
    window.open("viewApp?d=" + d, "_blank");
  });
  $("#selectedDatetable tbody").on("click", ".btn-viewrem", function () {
    var data = table150.row($(this).parents("tr")).data();
    viewremarks(data.uniqid, data.remarks);
  });
}
//Show  uniq id in remarks model
function showRemarksDialog(uniqid, id, rem) {
  var mySpan = document.getElementById("remuniqid");
  mySpan.innerHTML = uniqid;
  var mySpan = (document.getElementById("hidid").value = id);
  if (rem === null || rem === undefined || rem === "") {
    document.getElementById("remarkstxt").value = "";
    document.getElementById("saverem").innerText = "Save";
  } else {
    document.getElementById("remarkstxt").value = rem;
    document.getElementById("saverem").innerText = "Update";
  }
}

function viewremarks(uniqid, rem) {
  var mySpan = document.getElementById("viewremid");
  mySpan.innerHTML = uniqid;
  if (rem === null || rem === undefined || rem === "") {
    document.getElementById("viewremtxt").value = "";
  } else {
    document.getElementById("viewremtxt").value = rem;
  }
}
function saveremarks() {
  // $("#saverem").click(function () {
  var uniqid = document.getElementById("remuniqid").innerHTML;
  var textarearem = document.getElementById("remarkstxt").value;
  var hidid = document.getElementById("hidid").value;
  // alert(uniqid+hidid)
  if (textarearem != "" && uniqid != "") {
    var settings = {
      url:
        "SaveRemarksbyuniqid?d=" +
        uniqid +
        "&rem=" +
        encodeURIComponent(textarearem) +
        "&hid=" +
        encodeURIComponent(hidid),
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = JSON.parse(setV(j));
      //console.log(j);
      if (j.statusCode == "1") {
        alert("Remarks successfully added.");
        window.location.reload();
      } else {
        alert("Not able to process. Please try again later.");
        window.location.reload();
      }
    });
  } else {
    alert("Enter Remarks");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var forwardButtons = document.querySelectorAll(".griDetailsminmeetng");

  forwardButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var uniqid = this.getAttribute("data-uniqid");
      let d = chkV(uniqid);
      // window.location.href = "viewApp?d=" + d;
      window.open("viewApp?d=" + d, "_blank");
    });
  });
});
//document.addEventListener('DOMContentLoaded', function() {
document.addEventListener("DOMContentLoaded", function () {
  var forwardButtons = document.querySelectorAll(".forward-btn");

  forwardButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var uniqid = this.getAttribute("data-uniqid");
      var rem = this.getAttribute("data-rem");
      if (rem !== null && rem !== "") {
        let uid = chkV(uniqid);
        window.location.href = "forwardAplication?d=" + uid;
      } else {
        alert("please add remarks!!");
      }
    });
  });
});

$("#yrDOPG").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos7");
  x.pause();
});

// consolidated pendency report document ready data
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
            columnWidths.push("auto");
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
        //console.log(categ)
        makeDropdown(addnewDesig, j.data);
      }
      });
    }
    } else {
   
    }
  });*/

/*$("#addnewoffc").change(function () {
      var addOffcV = $("#addnewoffc").find(":selected").val();
      var addDeptV = $("#newdeptname").find(":selected").val();
      $("#addnewDesig").html("");
      $("#addnewDesig").append(
      '<option value="0">Select</option><option value="adddesg">Add new Designation</option>'
      );
      $("#addnewDesig").prop("disabled", false);
      if (addOffcV != "0") {
      ///to add new///
      if (addOffcV == "addoffice") {
      //	$("#addDeptV").val("");
           $("#newOffcDiv").show();
           $("#addnewDesig").prop("disabled", false);
      } else {
        var c = JSON.stringify({
        value: addOffcV,
        designation : addDeptV,
        });
        var d = chkV(c);
        var settings = {
        url: "getDesgListByOffc?d=" + d,
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
          makeDropdown(addnewDesig, j.data);
        }
        });
      }
      } else {
      
      }
    });*/

/*$("#addnewDesig").change(function () {
        var addDesgV = $("#addnewDesig").find(":selected").val();
       
        if (addDesgV != "0") {
        if (addDesgV == "adddesg") {
          $("#newDesigDiv").show();
            } 
        else{
          $("#newDesigDiv").hide();
        }
        } else {
        
        }
      });*/

/*$("#submitNewDept").click(function () {
        var dept = $("#newdeptname").find(":selected").val();
      //  var offc = $("#addnewoffc").find(":selected").val();
        var desg = $("#addnewDesig").find(":selected").val();

        if (dept == "0" || desg == "0") {
        alert("All fields are mandatory.");
        } else if (
        offc == "addoffice" &&
        ($("#newofc").val() == null || $("#newofc").val().trim() == "")
        ) {
        alert("Add new Office.");
        } else if (
        desg == "adddesg" &&
        ($("#newdesg").val() == null || $("#newdesg").val().trim() == "")
        ) {
        alert("Add new Designation.");
        }  else {
        if (offc == "addoffice") {
          offc = $("#newofc").val();
        } else {
          offc = offc;
        }
        if (desg == "adddesg") {
          desg = $("#newdesg").val();
        } else {
          desg = desg;
        }
        var c = JSON.stringify({
          department_name: dept,
         // office_name: offc,
          desg_name: desg,
         
        });

        var d = chkV(c);
        var settings = {
          url: "saveNewDept?d=" + d,
          method: "POST",
          timeout: 0,
          headers: {
          "Content-Type": "application/json",
          },
        };
        $.ajax(settings).done(function (j) {
          j = setV(j);
          j = JSON.parse(j);
          if (j.statusCode == "0") {
          alert("Department added successfully.");
          window.location.reload();
          } else if (j.statusCode == "1") {
          alert("failed to save data.");
          window.location.reload();
          } else if (j.statusCode == "2") {
          alert("this sequence already exist.");
          window.location.reload();
          } else {
          alert("Something went wrong");
          window.location.reload();
          }
        });
        }
      });
    	
      $("#resetnewDept").click(function () {
        window.location.reload();
      });*/

// $(document).on("click", ".grievancepdf", function () {
//   // alert('nnnnnnnnnnnnnnnnnnnnnnn')
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
$(document).on("click", ".grievanceprint", function () {
  var contentDiv = $(this).attr("data-value");
  var divToPrint = $("#" + contentDiv);

  if (divToPrint.length > 0) {
    var newWin = window.open("", "_blank");
    newWin.document.open();
    newWin.document.write("<html><head><title>Print</title>");

    // Copy styles
    var styles = document.querySelectorAll('style, link[rel="stylesheet"]');
    for (var i = 0; i < styles.length; i++) {
      newWin.document.write(styles[i].outerHTML);
    }

    newWin.document.write("</head><body>");
    newWin.document.write(divToPrint[0].outerHTML);
    newWin.document.write("</body></html>");
    newWin.document.close();
    newWin.focus();
    newWin.onload = function () {
      newWin.print();
    };
  } else {
    console.error("No element found with ID:", contentDiv);
  }
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
      //("Form Data: ", formString);
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

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");
  const transcriptElement = document.getElementById("transcript");

  if (!("webkitSpeechRecognition" in window)) {
    alert("Sorry, your browser doesn't support speech recognition.");
  } else {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // Set the language as needed

    let finalTranscript = "";

    recognition.onstart = function () {
      transcriptElement.textContent = "Listening...";
    };

    recognition.onresult = function (event) {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      transcriptElement.textContent = finalTranscript + interimTranscript;
    };

    recognition.onerror = function (event) {
      console.error("Speech recognition error detected: " + event.error);
    };

    recognition.onend = function () {
      transcriptElement.textContent += " (Stopped listening)";
    };

    startButton.addEventListener("click", function () {
      finalTranscript = ""; // Reset transcript
      transcriptElement.textContent = "";
      recognition.start();
    });

    stopButton.addEventListener("click", function () {
      recognition.stop();
    });
  }
});

function viewSuggesionrpt() {
  var settings = {
    url: "allSuggestionDatalist",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    var arr = [];
    if (j.statusCode == "1") {
      var data = j.data;
      $.each(data, function (index, value) {
        arr.push(value);
      });
      getSugestionDetail(arr);
    }
  });
}

function getSugestionDetail(data) {
  $(".btn-customBtn").on("click", function () {
    table147.button("." + $(this).val()).trigger();
  });

  var table147 = $("#SuggesionDatatbl").DataTable({
    data: data,
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
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
      },
    ],
    columns: [
      {
        title: "Sr. no",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "sname",
        defaultContent: "",
        title: "Name",
      },
      {
        data: "smobile",
        defaultContent: "",
        title: "Mobile",
      },
      {
        data: "semail",
        defaultContent: "",
        title: "Email",
      },
      {
        data: "insertdate",
        defaultContent: "",
        title: "Insertdate",
      },
      {
        data: "sugone",
        defaultContent: "",
        title: "Suggesion1",
      },
      {
        data: "descone",
        defaultContent: "",
        title: "Description1",
      },
      {
        data: "sugtwo",
        defaultContent: "",
        title: "Suggesion2",
        render: function (data) {
          return data === "0" ? null : data;
        },
      },
      {
        data: "desctwo",
        defaultContent: "",
        title: "Description2",
        render: function (data) {
          return data === "0" ? null : data;
        },
      },
      {
        data: "sugthree",
        defaultContent: "",
        title: "Suggesion3",
        render: function (data) {
          return data === "0" ? null : data;
        },
      },
      {
        data: "descthree",
        defaultContent: "",
        title: "Description3",
        render: function (data) {
          return data === "0" ? null : data;
        },
      },
    ],
  });
}
//  $(document).on("click", ".fileViewer", function(e) {
//   e.preventDefault();
//   var filename = $(this).data("filename");
//   var name = $(this).data("name");
//   var url = "fileViewer?filename=" + chkV(filename) + "&name=" + name;
//   var width = 800;
//   var height = 600;
//   var left = (screen.width - width) / 2;
//   var top = (screen.height - height) / 2;

//   // Open popup window
//   window.open(url, "_blank", "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top);
// });

// $(".filterData").click(function (e) {
// 	var dataValue = $(this).attr('data-value');
// 	filterApi(dataValue)
// 	//alert(dataValue);
// 	// return false;

// })

// function filterApi(btnVal) {
// 	// alert(usrFlg);

// 	var c = JSON.stringify({
// 		value: btnVal,
// 	});
// 	var d = chkV(c);
// 	var settings = {
// 		url: "filterApi?d=" + d,
// 		method: "POST",
// 		timeout: 0,
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	};
// 	$.ajax(settings).done(function (j) {
// 		j = setV(j);
// 		j = JSON.parse(j);
// 		// console.log(JSON.stringify(j))
// 		if (j.statusCode != 0 && j.data.length > 0) {
// 			j.data = j.data.map((current) => {
// 				// console.log(current)
// 				if (current.createddate != null) {
// 					current.createddate = format_date(current.createddate);
// 				}
// 				return current;
// 			});

// 			myTable(j.data, j.user_type)
// 		}

// 	})
// }
// AALOWING ONLY SPACES, NUMBERS AND DIGITS 
$("#annoucement").on("keyup", function () {
  this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ');
});

// CREATING ANNOUNCEMENT
$("#createAnnoucementBtn").on("click", function () {
  const validTilldate = $("#validTill").val();
  const announcement = $("#annoucement").val();
  const announcementTo = $("#announcementTo").val();

  const today = new Date();
  const vaildTill = new Date(validTilldate);


  //Naitik Changes on popup  09/10/2025

  if (vaildTill < today) {
    alert("Valid Till date cannot be less than current time");
    return;
  }

  if (announcement.trim().length === 0) {
    alert("Please enter announement.");
    return;
  }

  if (!confirm("Are you sure that you want to create this Announcement?")) {
    return;
  }

  //Naitik Changes End on popup 09/10/2025


  const d = chkV(
    JSON.stringify({
      valid: vaildTill,
      announcement: announcement,
      announcementTo: announcementTo,
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
        window.location.reload();

      } else if (response.statusCode === "0") {


        if (response.message === "Malicious File found.") {
          alert("Malicious file detected!");


          $("#addfile").val("");

        } else {
          alert(response.message);
        }

      } else if (response.statusCode === "2") {
        alert(response.message);
      }
    },
    error: function (xhr) {
      console.error(xhr);
    },
  });
});


$("#deptFilter").change(function () {

  //  var kk = $("#datGraphDiv").is(":hidden");
  //  var ff = $("#lineGraphDiv").is(":hidden");
  //
  $("#categFilter").attr("disabled", false);
  $("#categFilter").html("");
  $("#categFilter").append('<option value="0">Select</option>');
  var val = $("#deptFilter").find(":selected").val();


  if (val != "0") {
    var c = JSON.stringify({
      value: val,
    });

    var d = chkV(c);
    var settings = {
      url: "categ?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      if (j.statusCode == "1" || j.statusCode == "0") {
        makeDropdown(categFilter, j.data);
      }
    });
  }
});

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

// citizen registration function
function citRegFunc() {
  // Filter table on radio button click
  var localFilterVal = "home";
  $(document).on("click", ".data-search", function () {
    var filteredValue = $(this).val();
    localFilterVal = filteredValue;
    table181.ajax.reload();
  });

  // Filter table on clickable dashboard tabs
  var localClickVal = "Total";
  $(document).on("click", ".filterData", function () {
    var clickedValue = $(this).attr("data-value");
    localClickVal = clickedValue;
    table181.ajax.reload();
  });

  // Date filters
  var fdFilterVal = "0";
  $(document).on("change", "#dateFrom", function (e) {
    var filteredValue = e.target.value;
    fdFilterVal = filteredValue;
    table181.ajax.reload();
  });

  var tdFilterVal = "0";
  $(document).on("change", "#dateTo", function (e) {
    var filteredValue = e.target.value;
    tdFilterVal = filteredValue;
    table181.ajax.reload();
  });

  // Initialize filter variables
  var stateFilterVal = "0";
  var districtFilterVal = "0";
  var municipalityFilterVal = "0";
  var wardFilterVal = "0";
  var blockFilterVal = "0";
  var panchayatFilterVal = "0";

  // Radio button functionality integrated with your existing hide/show code
  $(document).on("change", 'input[name="area"]', function () {
    var selectedArea = $(this).val();

    if (selectedArea === "municipality") {
      // Reset block filters when switching to municipality
      blockFilterVal = "0";
      panchayatFilterVal = "0";
    } else if (selectedArea === "block") {
      // Reset municipality filters when switching to block
      municipalityFilterVal = "0";
      wardFilterVal = "0";
    }

    table181.ajax.reload();
  });

  // State filter
  $("#stateFilter").change(function () {
    $("#districtFilter").html('')
    $("#districtFilter").append('<option value="0">--Select District--</option>');

    // Reset dependent filters
    districtFilterVal = "0";
    municipalityFilterVal = "0";
    wardFilterVal = "0";
    blockFilterVal = "0";
    panchayatFilterVal = "0";

    var stateName = $(this).val();
    var c = JSON.stringify({
      value: stateName,
    });

    var d = chkV(c);
    var settings = {
      url: "allDistrictByState?d=" + d,
      method: "POST",
      timeout: 0,
    };

    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      console.log(j)
      $('#districtFilter').attr("disabled", false)
      var filteredValue = stateName;
      stateFilterVal = filteredValue;
      table181.ajax.reload();
      makeDropdown(districtFilter, j.data)
    })
  });

  // District filter - Load both municipalities and blocks
  $("#districtFilter").change(function () {
    // Clear and reset all dependent dropdowns
    $("#Municipalityfilter").html('<option value="0">--Select Municipality--</option>').attr("disabled", true);
    $("#Wardfilter").html('<option value="0">--Select Ward--</option>').attr("disabled", true);
    $("#Blockfilter").html('<option value="0">--Select Block--</option>').attr("disabled", true);
    $("#Panchayatfilter").html('<option value="0">--Select Panchayat--</option>').attr("disabled", true);

    // Reset all dependent filter values
    municipalityFilterVal = "0";
    wardFilterVal = "0";
    blockFilterVal = "0";
    panchayatFilterVal = "0";

    var districtId = $(this).val();
    districtFilterVal = districtId;

    // Load both municipalities and blocks if a valid district is selected
    if (districtId && districtId !== "0") {
      loadMunicipalitiesByDistrict(districtId);
      loadBlocksByDistrict(districtId);
    }

    table181.ajax.reload();
  });

  // Municipality filter
  $("#Municipalityfilter").change(function () {
    // Clear and reset ward dropdown
    $("#Wardfilter").html('<option value="0">--Select Ward--</option>');
    $("#Wardfilter").attr("disabled", false);
    wardFilterVal = "0";

    var selectedMunicipalityId = $(this).val();
    municipalityFilterVal = selectedMunicipalityId;

    console.log("Municipality selected:", selectedMunicipalityId);

    // Load wards for this municipality (if you have this API)
    if (selectedMunicipalityId && selectedMunicipalityId !== "0") {
      loadWardsByMunicipality(selectedMunicipalityId);
    }

    table181.ajax.reload();
  });

  // Ward filter
  $("#Wardfilter").change(function () {
    var selectedWardId = $(this).val();
    wardFilterVal = selectedWardId;
    console.log("Ward selected:", selectedWardId);
    table181.ajax.reload();
  });

  // Block filter
  $("#Blockfilter").change(function () {
    // Clear and reset panchayat dropdown
    $("#Panchayatfilter").html('<option value="0">--Select Panchayat--</option>');
    $("#Panchayatfilter").attr("disabled", false);
    panchayatFilterVal = "0";

    var selectedBlockId = $(this).val();
    blockFilterVal = selectedBlockId;

    console.log("Block selected:", selectedBlockId);

    // Load panchayats for this block
    if (selectedBlockId && selectedBlockId !== "0") {
      loadPanchayatsByBlock(selectedBlockId);
    }

    table181.ajax.reload();
  });

  // Panchayat filter
  $("#Panchayatfilter").change(function () {
    var selectedPanchayatId = $(this).val();
    panchayatFilterVal = selectedPanchayatId;
    console.log("Panchayat selected:", selectedPanchayatId);
    table181.ajax.reload();
  });

  //  load municipalities by district
  function loadMunicipalitiesByDistrict(districtId) {
    var c = JSON.stringify({
      value: districtId,
    });

    var d = chkV(c);
    var settings = {
      url: "municipalityByDistrict?d=" + d,
      method: "POST",
      timeout: 0,
    };

    $.ajax(settings)
      .done(function (j) {
        try {
          j = setV(j);
          j = JSON.parse(j);

          console.log("Municipality API Response:", j);

          if (j.statusCode === "1" && j.data && j.data.length > 0) {
            $('#Municipalityfilter').attr("disabled", false);
            makeDropdown(Municipalityfilter, j.data);
            console.log("Municipality dropdown populated with", j.data.length, "items");
          } else {
            console.log("No municipalities found for district:", districtId);
            $('#Municipalityfilter').append('<option value="0">No municipalities found</option>');
          }
        } catch (error) {
          console.error("Error parsing municipality response:", error, j);
        }
      })
      .fail(function (xhr, status, error) {
        console.error("Failed to load municipalities:", status, error);
        console.error("Response:", xhr.responseText);
        $('#Municipalityfilter').append('<option value="0">Error loading municipalities</option>');
      });
  }

  // load blocks by district
  function loadBlocksByDistrict(districtId) {
    var c = JSON.stringify({
      value: districtId,
    });

    var d = chkV(c);
    var settings = {
      url: "blockByDistrict?d=" + d,
      method: "POST",
      timeout: 0,
    };

    $.ajax(settings)
      .done(function (j) {
        try {
          j = setV(j);
          j = JSON.parse(j);

          console.log("Block API Response:", j);

          if (j.statusCode === "1" && j.data && j.data.length > 0) {
            $('#Blockfilter').attr("disabled", false);
            makeDropdown(Blockfilter, j.data);
            console.log("Block dropdown populated with", j.data.length, "items");
          } else {
            console.log("No blocks found for district:", districtId);
            $('#Blockfilter').append('<option value="0">No blocks found</option>');
          }
        } catch (error) {
          console.error("Error parsing block response:", error, j);
        }
      })
      .fail(function (xhr, status, error) {
        console.error("Failed to load blocks:", status, error);
        console.error("Response:", xhr.responseText);
        $('#Blockfilter').append('<option value="0">Error loading blocks</option>');
      });
  }

  //  load wards by municipality
  function loadWardsByMunicipality(municipalityId) {
    var c = JSON.stringify({
      value: municipalityId,
    });

    var d = chkV(c);
    var settings = {
      url: "wardByMunicipality?d=" + d,
      method: "POST",
      timeout: 0,
    };

    $.ajax(settings)
      .done(function (j) {
        try {
          j = setV(j);
          j = JSON.parse(j);

          console.log("Ward API Response:", j);

          if (j.statusCode === "1" && j.data && j.data.length > 0) {
            $('#Wardfilter').attr("disabled", false);
            makeDropdown(Wardfilter, j.data);
            console.log("Ward dropdown populated with", j.data.length, "items");
          } else {
            console.log("No wards found for municipality:", municipalityId);
            $('#Wardfilter').append('<option value="0">No wards found</option>');
          }
        } catch (error) {
          console.error("Error parsing ward response:", error, j);
        }
      })
      .fail(function (xhr, status, error) {
        console.error("Failed to load wards:", status, error);
        console.error("Response:", xhr.responseText);
        $('#Wardfilter').append('<option value="0">Error loading wards</option>');
      });
  }

  //load panchayats by block
  function loadPanchayatsByBlock(blockId) {
    var c = JSON.stringify({
      value: blockId,
    });

    var d = chkV(c);
    var settings = {
      url: "panchayatByBlock?d=" + d,
      method: "POST",
      timeout: 0,
    };

    $.ajax(settings)
      .done(function (j) {
        try {
          j = setV(j);
          j = JSON.parse(j);

          console.log("Panchayat API Response:", j);

          if (j.statusCode === "1" && j.data && j.data.length > 0) {
            $('#Panchayatfilter').attr("disabled", false);
            makeDropdown(Panchayatfilter, j.data);
            console.log("Panchayat dropdown populated with", j.data.length, "items");
          } else {
            console.log("No panchayats found for block:", blockId);
            $('#Panchayatfilter').append('<option value="0">No panchayats found</option>');
          }
        } catch (error) {
          console.error("Error parsing panchayat response:", error, j);
        }
      })
      .fail(function (xhr, status, error) {
        console.error("Failed to load panchayats:", status, error);
        console.error("Response:", xhr.responseText);
        $('#Panchayatfilter').append('<option value="0">Error loading panchayats</option>');
      });
  }

  // DataTable columns definition
  var column = [
    {
      title: "S. No.",
      orderable: false,
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      data: "name",
      title: "Name",
    },
    {
      data: "region",
      defaultContent: "",
      title: "State/UT",
    },
    {
      data: "district",
      defaultContent: "",
      title: "District",
    },
    {
      data: "created_date",
      defaultContent: "",
      title: "Created On",
    },
    {
      data: "gender",
      defaultContent: "",
      title: "Gender",
    },
    {
      data: "mobile",
      defaultContent: "",
      title: "Mobile",
    },
    {
      data: "municipality",
      defaultContent: "",
      title: "Municipality",
    },

    {
      data: "ward",
      defaultContent: "",
      title: "Ward",
    },

    {
      data: "block",
      defaultContent: "",
      title: "Block",
    },

    {
      data: "panchayat",
      defaultContent: "",
      title: "Panchayat",
    },
    {
      data: "mode",
      defaultContent: "",
      title: "Registration Mode",
    },
    {
      data: "grievancefiled",
      defaultContent: "",
      title: "No. of Grievance Lodged",
      render: function (data, type, row, meta) {
        return "<a href='#' class='griCount' data-value='" + row.mobile + "'>" + data + "</a>";
      },
    },
  ];

  // Initialize DataTable
  var table181 = $("#citizenRegtbl").DataTable({
    serverSide: true,
    processing: true,
    deferRender: true,
    scrollX: true,
    ajax: {
      url: "getCitizenList",
      type: "POST",
      contentType: "application/json",
      data: function (d) {
        d.filterValue = localFilterVal;
        d.clickedValue = localClickVal;
        d.fdFilterVal = fdFilterVal;
        d.tdFilterVal = tdFilterVal;
        d.districtFilterVal = districtFilterVal;
        d.stateFilterVal = stateFilterVal;
        d.municipalityFilterVal = municipalityFilterVal;
        d.wardFilterVal = wardFilterVal;
        d.blockFilterVal = blockFilterVal;
        d.panchayatFilterVal = panchayatFilterVal;

        return chkV(JSON.stringify(d));
      },
      dataSrc: function (response) {
        globalUserType = response.user_type;
        globalAllData = response.data;
        return response.data;
      },
    },
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
        download: "true",
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
          columnWidths.push("auto");
          columnWidths.push("auto");

          for (var i = 2; i < totalColumns; i++) {
            columnWidths.push("auto");
          }

          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)",
        },
      },
    ],
    columns: column,
    order: [[4, "desc"]],
    lengthMenu: [10, 50, 100, 500, 1000],
    pageLength: 10,
  });

  // Search functionality
  $("#citizenRegtbl_filter input[type='search']").on("input", function () {
    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, "");
    $(this).val(cleanValue);
    table181.search(cleanValue).draw();
  });

  // Export functionality
  $(".btnmis-customBtn").on("click", function () {
    var btn = $(this).val();
    if (btn === "buttons-reset") {
      $("input[name='total-app']").prop("checked", false);
      $("#total-all-search").prop("checked", true);

      localFilterVal = "home";
      localClickVal = "Total";
      table181.ajax.reload();
    } else {
      btn = "." + btn;
      $.ajax({
        url: "getCitizenList",
        type: "POST",
        contentType: "application/json",
        data: chkV(
          JSON.stringify({
            start: 0,
            length: -1,
            filterValue: localFilterVal,
            clickedValue: localClickVal,
            fdFilterVal: fdFilterVal,
            tdFilterVal: tdFilterVal,
            districtFilterVal: districtFilterVal,
            stateFilterVal: stateFilterVal,
            municipalityFilterVal: municipalityFilterVal,
            wardFilterVal: wardFilterVal,
            blockFilterVal: blockFilterVal,
            panchayatFilterVal: panchayatFilterVal,
            columns: table181.settings().init().columns,
          })
        ),
        success: function (response) {
          var allData = response.data;
          var originalData = table181.data().toArray();
          table181.clear().rows.add(allData).draw(false);
          table181.button(btn).trigger();
          table181.clear().rows.add(originalData).draw(false);
        },
        error: function (xhr) {
          console.error("Failed to fetch all data for export", xhr);
          table181.processing(false);
        },
      });
    }
  });
}
$("#email").keypress(function (e) {
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

// For Avg Time taken by department
var deptSummListGlobal;
var distSummListGlobal;
$("#filterDept").change(function () {
  var filteredDeptValue = $("#filterDept").find(":selected").val();

  if (filteredDeptValue != "0" && filteredDeptValue != "" && filteredDeptValue != " ") {
    // Filter the deptSummListGlobal array based on the selected department value
    var filteredData = deptSummListGlobal.filter(function (checkDept) {
      return checkDept.department != null && checkDept.department == filteredDeptValue;
    });

    // Update the DataTable with the filtered data
    $('#avgttTbl').DataTable().clear().rows.add(filteredData).draw();
  } else {
    // If no specific department is selected, show all data
    $('#avgttTbl').DataTable().clear().rows.add(deptSummListGlobal).draw();
  }
});
$("#filterDist").change(function () {
  var filteredDistValue = $("#filterDist").find(":selected").val();

  if (filteredDistValue != "0" && filteredDistValue != "" && filteredDistValue != " ") {
    // Filter the deptSummListGlobal array based on the selected department value
    var filteredData = distSummListGlobal.filter(function (checkDept) {
      return checkDept.district != null && checkDept.district == filteredDistValue;
    });

    // Update the DataTable with the filtered data
    $('#avgttTbl1').DataTable().clear().rows.add(filteredData).draw();
  } else {
    // If no specific department is selected, show all data
    $('#avgttTbl1').DataTable().clear().rows.add(distSummListGlobal).draw();
  }
});
function avgTTRptFunc() {
  var settings = {
    url: "getAvgttByDept",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    deptSummListGlobal = j.deptData;
    distSummListGlobal = j.distData;

    if (deptSummListGlobal.length > 0) {
      $(".btnAvgT-customBtn").on("click", function () {
        // console.log($(this).val());
        table202.button("." + $(this).val()).trigger();
      });
    }
    if (distSummListGlobal.length > 0) {
      $(".btnAvgTT-customBtn").on("click", function () {
        // console.log($(this).val());
        table333.button("." + $(this).val()).trigger();
      });
    }

    var table202 = $("#avgttTbl").DataTable({
      data: j.deptData,
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
              columnWidths.push("auto");
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
          data: "department",
          defaultContent: "",
          title: "Department",
        },
        {
          data: "total",
          defaultContent: "",
          title: "Grievance Recieved",
        },
        {
          data: "avgdays",
          defaultContent: "",
          title: "Avg Days (Per Grievances)",
        }
      ],
    });

    var table333 = $("#avgttTbl1").DataTable({
      data: j.distData,
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
              columnWidths.push("auto");
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
          data: "district",
          defaultContent: "",
          title: "District",
        },
        {
          data: "total",
          defaultContent: "",
          title: "Grievance Recieved",
        },
        {
          data: "avgdays",
          defaultContent: "",
          title: "Avg Days (Per Grievances)",
        }
      ],
    });

    $("#avgttTbl_filter input[type='search'], #avgttTbl1_filter input[type='search']").on("input", function () {
      // alert("jjjds")

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      table202.search(cleanValue).draw(); // Update DataTable search
      table333.search(cleanValue).draw(); // Update DataTable search
    });
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

    // console.log(j.data)

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
    });

    $("#distWiseTbl_filter input[type='search']").on("input", function () {
      // alert("jjjds")

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      districtWiseTbl.search(cleanValue).draw(); // Update DataTable search
    });
  });
}


// $(document).on("click", ".cpgramReturn", function (e) {

//   $('#sendreturnCase').modal('show');
//   var regId= "Grievance Id: " + $(this).val();
//   $('#regNo').text(regId);
//    $('#regNo').val($(this).val());

// })

$("#returnRemark").keypress(function (e) {
  //console.log($(this).val())
  return validRemarkTextArea(e);
});

function validRemarkTextArea(e) {
  var keyCode = e.keyCode || e.which;
  var regex = /^[A-Za-z0-9,._\-/\s]+$/;
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}


$(document).on("click", "#rtnCaseBtn", function (e) {

  // var regId= $('#regNo').val();
  var regId = $('#gId').text();
  var remark = $('#returnRemark').val();
  //console.log("gId "+gId)
  if (remark == "") {
    return alert("Remark cannot be empty.")
  }

  returnToCPGRAM(regId, remark)
})


function returnToCPGRAM(regId, remark) {
  var c = JSON.stringify({
    registration_no: regId,
    Remarks: remark
  });

  var d = chkV(c);
  //console.log(c)
  var settings = {
    url: "returnToCPGRAM?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    alert(j.result);
    $('#sendreturnCase').modal('hide');
    window.location.href = "home"
  });
}

$('#sendreturnCase').on('hidden.bs.modal', function () {
  $('#returnRemark').val("");
});

stateList();
function stateList() {

  var settings = {
    url: "allState",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    makeDropdown(stateFilter, j.data);

    // console.log(j)
  });
}


$("#citizenRegtbl").on("click", ".griCount", function () {
  $("#citizenModal").modal("show");
  //   $(".advPendingWithDiv").removeClass("visually-hidden");
  setTimeout(() => {
    $('#filteredDHList').DataTable().columns.adjust().draw();
  }, 200)


  var mob = $(this).attr("data-value");
  var c = JSON.stringify({
    value: mob
  });
  var d = chkV(c);
  var settings = {
    url: "getGrievancesByMobile?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(j.data)
    makeDataTable2(j.data)
  });
});


function appellateRptFunc(deptType) {
  var fromDate = $("#fromDate").val();
  var toDate = $("#toDate").val();

  const payload = {
    departmentType: deptType || "",
    fromDate: fromDate || "",
    toDate: toDate || ""

  };
  var column = [
    {
      title: "S. No.",
      orderable: false,
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      data: "name",
      title: "Appellate Name",
    },
    {
      data: "office",
      defaultContent: "",
      title: "Office & Desgination",
    },
    {
      data: "department",
      defaultContent: "",
      title: "Department",
    },
    {
      data: "total_appeals",
      defaultContent: "",
      title: "Total Appeals",
      render: function (data, type, row) {
        return `<a href="#" class="appeal-link" data-type="total" data-dept="${row.department}">${data}</a>`;
      }
    },
    {
      data: "resolved",
      defaultContent: "",
      title: "Appeals Resolved",
      render: function (data, type, row) {
        return `<a href="#" class="appeal-link" data-type="resolved" data-dept="${row.department}">${data}</a>`;
      }
    },
    {
      data: "pending",
      defaultContent: "",
      title: "Appeals Pending",
      render: function (data, type, row) {
        return `<a href="#" class="appeal-link" data-type="pending" data-dept="${row.department}">${data}</a>`;
      },
    },
  ];

  var settings = {
    url: "getAppellateRpt",
    method: "POST",
    timeout: 0,
    contentType: "application/json",
    data: chkV(JSON.stringify(payload))
  };

  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);


    console.log(j)
    $(".btnAR-customBtn").on("click", function () {
      table196.button("." + $(this).val()).trigger();
    });

    var table196 = $("#apllRptTbl").DataTable({
      data: j.data,
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
          download: "true",
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
            var columnWidths = ["auto", "auto"];
            for (var i = 2; i < totalColumns; i++) {
              columnWidths.push("auto");
            }
            doc.content[1].table.widths = columnWidths;
          },
          exportOptions: {
            columns: ":not(.noExport)",
          },
        },
      ],
      columns: column,
    });

    $("#apllRptTbl_filter input[type='search']").on("input", function () {
      // alert("jjjds")

      var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
      $(this).val(cleanValue);
      table151.search(cleanValue).draw(); // Update DataTable search
    });
  });
}



$(document).on("click", ".appeal-link", function (e) {
  e.preventDefault();

  const dept = $(this).data("dept");
  const type = $(this).data("type");

  const fromDate = $('#fromDate').val();
  const toDate = $('#toDate').val();

  $.ajax({
    url: "getAppealDetailByType",
    method: "POST",
    contentType: "application/json",
    data: chkV(JSON.stringify({
      department: dept,
      type: type,
      fromDate: fromDate,
      toDate: toDate
    })),
    success: function (j) {
      const response = JSON.parse(setV(j));
      const data = response.data;


      $('#appealDetailTable').DataTable({
        data: data,
        destroy: true,
        lengthMenu: [10, 50, 100],
        pageLength: 10,
        columns: [
          {
            data: null,
            title: "S. No.",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          },
          {
            data: "grievance_id",
            defaultContent: "",
            title: "Grievance ID",
            render: function (data, type, row, meta) {
              return '<a href="#" ><button class="btn btn-sm vDetails" value = "' +
                data +
                '" data-appflag = "JKSAMADHAN" style="color:blue">' + data + '</button></a>';
            }
          },
          {
            data: "category",
            defaultContent: "",
            title: "Category"
          },
          {
            data: "submitted_by",
            defaultContent: "",
            title: "Submitted By"
          },
          {
            data: "status",
            defaultContent: "",
            title: "Status"
          },
          {
            data: "createddate",
            defaultContent: "",
            title: "Created Date"
          }
        ]
      });

      $("#appealDetailTable_filter input[type='search']").on("input", function () {
        // alert("jjjds")

        var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
        $(this).val(cleanValue);
        table151.search(cleanValue).draw(); // Update DataTable search
      });

      $('#myModal').modal('show');
    }
  });
});


function loadMisCitizen() {
  // console.log("asda")
  var table;
  table = new DataTable("#misReportTableCitizen", {
    serverSide: true,
    processing: true,
    destroy: true,
    scrollX: true,
    dom: 'Bfrtip',

    columns: [
      {
        title: "S.No.",
        render: function (data, type, row, meta) {
          return meta.row + 1;
        }
      },


      {
        data: 'totalRegistration',
        title: 'Total Citizens Registered'
      },

      {
        data: 'jammuDivision',

        title: 'Jammu Divison'
      },


      {
        data: 'kashmirDivision',

        title: 'Kashmir Divison'
      },
    ],
    ajax: {
      url: "loadMisCitizen",
      method: "POST",
      contentType: "application/json",
      data: function (d) {
        const content = {
          draw: d.draw,
          page: d.start / d.length,
          size: d.length,
          search: d.search.value,
          export: false

        }
        //console.log( d.search.value)
        lastRequest = { ...content, export: true };
        return chkV(JSON.stringify(content));
      },
      dataFilter: function (data) {
        data = setV(data);
        data = JSON.parse(data);
        // console.log(data);

        return JSON.stringify(data);
      }
    },
    lengthMenu: [2, 10, 50, 100],
    pageLength: 10
  });

  $("#misReportTableCitizen_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table181.search(cleanValue).draw(); // Update DataTable search
  });


  $(".dwd-customBtnctz").on("click", function () {

    var btn = $(this).val();
    const exportType = btn === "buttons-pdf" ? "pdf" : "xlsx";

    const exportRequest = {
      ...lastRequest,
      page: 0,
      size: 2147483647,
      exportType: exportType
    }

    // console.log(exportRequest);


    $.ajax({
      url: "loadMisCitizen",
      method: "POST",
      timeout: 0,
      contentType: 'application/json',
      xhrFields: {
        responseType: 'blob'  // ✅ tells jQuery to treat response as a blob
      },
      data: chkV(JSON.stringify(exportRequest)),
      success: function (blob, status, xhr) {
        const currentDate = new Date().toLocaleDateString('en-GB').split('/').join('-');
        const disposition = xhr.getResponseHeader("Content-Disposition");
        const filenameMatch = disposition && disposition.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : `JKSamadhan - Analytical Data - ${currentDate}.${exportType}`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: function (xhr, status, error) {
        console.error("Export failed:", error);
        alert("Export failed. Please try again.");
      }
    });
  });

}


//load Mis Report Districtwise changes by Naitik

function loadMisDistrict() {
  //console.log("dataaaaaaaaa")
  var table;
  var state = $('#stateFilter').val();
  var district = $('#districtFilter').val()
  table = new DataTable("#misReportTableDistrict", {
    serverSide: true,
    processing: true,
    destroy: true,
    scrollX: true,
    dom: 'Bfrtip',


    columns: [
      {
        title: "S.No.",
        render: function (data, type, row, meta) {
          return meta.settings._iDisplayStart + meta.row + 1;
        }
      },

      {
        data: 'district',

        title: 'Name of the District'
      },



      {
        data: 'region',

        title: 'State'
      },


      {
        data: 'totalRegistration',
        title: 'Total Citizens Registered'
      },
    ],
    ajax: {
      url: "loadMisDistrict",
      method: "POST",
      contentType: "application/json",
      data: function (d) {
        const content = {
          draw: d.draw,
          page: d.start / d.length,
          size: d.length,
          search: d.search.value,
          export: false,
          state: state,
          district: district

        }
        //console.log( d.search.value)
        lastRequest = { ...content, export: true };
        return chkV(JSON.stringify(content));
      },
      dataFilter: function (data) {
        data = setV(data);
        data = JSON.parse(data);
        // console.log(data);

        return JSON.stringify(data);
      }
    },
    lengthMenu: [2, 10, 50, 100],
    pageLength: 10
  });

  $("#misReportTableDistrict_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table181.search(cleanValue).draw(); // Update DataTable search
  });

  $(".dwd-customBtndist").on("click", function () {

    var btn = $(this).val();
    const exportType = btn === "buttons-pdf" ? "pdf" : "xlsx";

    const exportRequest = {
      ...lastRequest,
      page: 0,
      size: 2147483647,
      exportType: exportType
    }

    $.ajax({
      url: "loadMisDistrict",
      method: "POST",
      timeout: 0,
      contentType: 'application/json',
      xhrFields: {
        responseType: 'blob'  // ✅ tells jQuery to treat response as a blob
      },
      data: chkV(JSON.stringify(exportRequest)),
      success: function (blob, status, xhr) {
        const currentDate = new Date().toLocaleDateString('en-GB').split('/').join('-');
        const disposition = xhr.getResponseHeader("Content-Disposition");
        const filenameMatch = disposition && disposition.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : `JKSamadhan - Analytical Data - ${currentDate}.${exportType}`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: function (xhr, status, error) {
        console.error("Export failed:", error);
        alert("Export failed. Please try again.");
      }
    });
  });
}


///Naitik changes on radio button to filter Muncipality and Block at Citizen level MIS

(function () {
  const muniRadioId = 'municipality-search';
  const blockRadioId = 'block-search';
  const muniWrapId = 'municipalityDropdowns';
  const blockWrapId = 'blockDropdowns';
  const muniSelects = ['Municipalityfilter', 'WardFilter'];
  const blockSelects = ['Blockfilter', 'Panchayatfilter'];
  const get = id => document.getElementById(id);
  //const log = (...args) => { if (window.console) console.log('[area-filter]', ...args); };

  const DEBUG = false; // change to true when you want logs

  const log = (...args) => {
    if (DEBUG && window.console) {
      console.log('[area-filter]', ...args);
    }
  };

  const muniRadio = get(muniRadioId);
  const blockRadio = get(blockRadioId);
  const muniWrap = get(muniWrapId);
  const blockWrap = get(blockWrapId);

  if (!muniRadio && !blockRadio) {
    log('No radios found. Check IDs:', muniRadioId, blockRadioId);
    return;
  }
  if (!muniWrap && !blockWrap) {
    log('Warning: wrapper rows not found. Expected IDs:', muniWrapId, blockWrapId);
  }

  function disableIds(ids) {
    ids.forEach(id => {
      const el = get(id);
      if (el) el.disabled = true;
    });
  }
  function enableIds(ids) {
    ids.forEach(id => {
      const el = get(id);
      if (el) el.disabled = false;
    });
  }
  function hideWrapper(wrapper, selectIds = []) {
    if (!wrapper) return;
    wrapper.style.display = 'none';
    disableIds(selectIds);
  }
  function showWrapper(wrapper, selectIds = []) {
    if (!wrapper) return;
    wrapper.style.display = wrapper.classList.contains('row') ? 'flex' : '';
    enableIds(selectIds);
  }

  function hideBoth() {
    hideWrapper(muniWrap, muniSelects);
    hideWrapper(blockWrap, blockSelects);
  }
  function showMunicipality() {
    log('Show municipality dropdowns');
    showWrapper(muniWrap, muniSelects);
    hideWrapper(blockWrap, blockSelects);
  }
  function showBlock() {
    log('Show block dropdowns');
    showWrapper(blockWrap, blockSelects);
    hideWrapper(muniWrap, muniSelects);
  }

  hideBoth();
  function attachRadioHandlers(radio) {
    if (!radio) return;
    const handler = function () {
      if (!this.checked) return;
      const v = (this.value || '').toString().trim().toLowerCase();
      log('radio clicked/changed ->', this.id, v);
      if (v === 'municipality') showMunicipality();
      else if (v === 'block') showBlock();
      else hideBoth();
    };
    radio.addEventListener('change', handler);
    radio.addEventListener('click', handler);
  }

  attachRadioHandlers(muniRadio);
  attachRadioHandlers(blockRadio);

  document.querySelectorAll('input[name="area"]').forEach(r => {
    if (r.id !== muniRadioId && r.id !== blockRadioId) attachRadioHandlers(r);
  });

  const pre = document.querySelector('input[name="area"]:checked');
  if (pre) {
    const pv = (pre.value || '').toString().trim().toLowerCase();
    log('pre-checked found on load ->', pre.id || pre.value, pv);
    if (pv === 'municipality') showMunicipality();
    else if (pv === 'block') showBlock();
  } else {
    log('No pre-checked radio; both groups hidden.');
  }
})();


//Naitik Changes on 21/01/2026

//NAITIK MODEL CHECK FOR GRIEVANCE ID TO SHOW FEEDBACK DATA AT HISTORY-21/01/2026 START


$(document).on("click", ".vfbFormPreview1", function (e) {
  let c = $('#gId').text();
  let d = chkV(c);

  $.ajax({
    url: cp + "/analytics/getNewfeedbackFormData?d=" + d,
    method: "POST",
    timeout: 0,
    headers: { "Content-Type": "application/json" },
  }).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    if (j.statusCode === "1" && j.data && j.data.length > 0) {
      showNewFeedbackModal(j.data[0]);
    } else {
      $.ajax({
        url: "getfeedbackFormData?d=" + d,
        method: "POST",
        timeout: 0,
        headers: { "Content-Type": "application/json" },
      }).done(function (j2) {
        j2 = setV(j2);
        j2 = JSON.parse(j2);

        if (j2.statusCode === "1" && j2.data && j2.data.length > 0) {
          showOldFeedbackModal(j2.data[0]);
        } else {
          alert("No feedback available.");
        }
      });
    }
  });
});

function showNewFeedbackModal(data) {

  $("#uniqueidd").text(data.uniqid);
  $("#Grevstatuss").text(data.status);
  $("#departmentIds").text(data.department);
  $("#last_updatedon").text(data.last_updated_on);

  // Q1: Overall Experience
  $("input[name='experience']").each(function () {
    if ($(this).val() === data.overall_experience) {
      $(this).prop("checked", true);
    }
    $(this).prop("disabled", true);
  });

  if (data.overall_experience === "Poor") {
    $(".noDiv").removeClass("visually-hidden");
    $("#Newdescription-box")
      .val(data.poor_reason)
      .prop("readonly", true);
  }

  // Q2: Time Satisfaction
  $("input[name='time-satisfaction']").each(function () {
    if ($(this).val() === data.time_satisfaction) {
      $(this).prop("checked", true);
    }
    $(this).prop("disabled", true);
  });

  // Q3: Reuse Portal
  if (data.overall_experience === "Poor") {
    $(".noDiv").removeClass("visually-hidden");
    $("#Newdescription-box")
      .prop("disabled", false)
      .prop("readonly", true)
      .val(data.poor_reason && data.poor_reason !== "NA" ? data.poor_reason : "");
  } else {
    $(".noDiv").addClass("visually-hidden");
    $("#Newdescription-box").val("").prop("readonly", true);
  }


  $("#NewfbFormPreview1").modal("show");
}

function showOldFeedbackModal(data) {
  // META INFORMATION 
  $("#uniqueID").text(data.uniqid);
  $("#Grevstatus").text(data.status);
  $("#departmentId").text(data.department);
  $("#last_updated_on").text(data.last_updated_on);

  if (data.satisfied === "Yes") {
    $("#satisfied-Yes").prop("checked", true);
    $(".noDiv").addClass("visually-hidden");
  } else if (data.satisfied === "No") {
    $("#satisfied-No").prop("checked", true);
    $(".noDiv").removeClass("visually-hidden");
    $("#description-box").val(data.description).prop("readonly", true);
    $("#satisfied-Yes").prop("disabled", true);
    $("#satisfied-No").prop("disabled", true);
  }

  if (data.call_received === "Yes") {
    $("#call-msg-Yes").prop("checked", true);
  } else if (data.call_received === "No") {
    $("#call-msg-No").prop("checked", true);
    $("#call-msg-Yes").prop("disabled", true);
    $("#call-msg-No").prop("disabled", true);
  }

  // Rating 1
  $(".rating1").removeClass("rg-selectedBtn");
  $(".rating1").each(function () {
    let btnVal = $(this).text().trim();
    let ratingVal = String(data.rating1).trim();
    if (btnVal === ratingVal) {
      $(this).addClass("rg-selectedBtn");
    }
  });

  // Rating 2
  $(".rating2").removeClass("rg-selectedBtn");
  $(".rating2").each(function () {
    let btnVal = $(this).text().trim();
    let ratingVal = String(data.rating2).trim();
    if (btnVal === ratingVal) {
      $(this).addClass("rg-selectedBtn");
    }
  });

  $("input[name='loading']").each(function () {
    if ($(this).val() === data.reccomendation) {
      $(this).prop("checked", true).prop("disabled", true);
    }
  });

  $("#fbFormPreview1").modal("show");
}
//Naitik Changes End 27/02/2026

//Naitik Changes Start 30/01/2026

$(document).on('click', '.grievancepdf', function () {
  var grievanceId = $(this).attr('data-grievance-id');

  $.ajax({
    url: cp + "/superAdmin/downloadPdfHistory",
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

//Naitik Changes End 30/01/2026

