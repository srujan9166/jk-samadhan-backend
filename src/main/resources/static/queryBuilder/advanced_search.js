$(document).ready(function () {
  // select2
  $(".multi-select2").select2({
    placeholder: "",
    allowClear: true, // Optional, adds a clear button
    //selectOnClose: true // automactic selection when drop down is closed
    //closeOnSelect: false, // auto close of drop down after selection is not allowed
    //maximumSelectionLength: 2, // limiting user selection
  });

  // getAllDataList('allTarget');
  $(".cBb").one('click', function () {
  	// Check if there's a history to go back to
  	            if (window.history.length > 1) {
  	               // window.history.back();
  				   window.history.go(-1); // Go back to the previous page
  	            } else {
  	                // Redirect to a default page if no history
  	                window.location.href = "home";
  	            }
     });

  // 21 MARCH 2024 - SKY - start
  $("#inputDistrict").attr("disabled", true);
  $(
    "#userTypee1, #categ, #subcateg, #subcategL2, #subcategL3, #subcategL4"
  ).attr("disabled", true);

//  $(
//    ".mainCategDiv, .subCategDiv, .subCategl2Div, .subCategl3Div, .subCategl4Div"
//  ).hide();

  $("#penEoF").prop("disabled", true);
  $("#penTo").prop("disabled", true);
  $("#penTo").prop("readonly", true);
  // 21 MARCH 2024 - SKY - end
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


// $(".btn-customBtn").on("click", function () {
//   table.button("." + $(this).val()).trigger();
// });

///
function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>")
        .attr("value", value.values)
        .text(value.values.toUpperCase())
    );
  });
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

// 05 April 2024 - dynamic function to capture multiple checkboxes as well as multi select 2 - SKY
// capture multiple checkboxes values as list for IN query
function getSelectedValuesChk(selector, delimiter) {
  var checkedValues = $(selector + ":checked")
    .map(function () {
      return "'" + $(this).val() + "'";
    })
    .get();
  if (checkedValues.length === 0) {
    return 0;
  }
  return checkedValues.join(delimiter);
}
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
// 05 April 2024 - dynamic function to capture multiple checkboxes as well as multi select 2 - SKY

// 21 MARCH 2024 - SKY - start

// function getAllDataList(allTargetDropdown) {
//   var settings = {
//     url: "allDropDownData",
//     method: "POST",
//     timeout: 0,
      // headers: {
      //   "Content-Type": "application/json",
      // },
//   };

//   var dropdowns = {
//     // jo NAME from controller : dropdown id's
//     categListName: categ,
//     subcategListName: subcateg,
//     subcategL2ListName: subcategL2,
//     subcategL3ListName: subcategL3,
//     subcategL4ListName: subcategL4,
//   };
//   $.ajax(settings).done(function (j) {
//     j = JSON.parse(setV(j));

//     if (allTargetDropdown == "allTarget") {
//       console.log("allTarget");
//       for (var key in dropdowns) {
//         if (j[key] !== 0) {
//           makeDropdown(dropdowns[key], j[key]);
//         }
//       }
//     }
//     if (allTargetDropdown == "categTarget") {
//       console.log("categTarget");
//       makeDropdown(categ, j.categListName);
//     }
//     if (allTargetDropdown == "subCategTarget") {
//       console.log("subCategTarget");
//       makeDropdown(subcateg, j.subcategListName);
//     }
//     if (allTargetDropdown == "subCategL2Target") {
//       console.log("subCategL2Target");
//       makeDropdown(subcategL2, j.subcategL2ListName);
//     }
//     if (allTargetDropdown == "subCategL3Target") {
//       console.log("subCategL3Target");
//       makeDropdown(subcategL3, j.subcategL3ListName);
//     }
//     if (allTargetDropdown == "subCategL4Target") {
//       console.log("subCategL4Target");
//       makeDropdown(subcategL4, j.subcategL4ListName);
//     }
//   });
// }

// function for initializing the dropdown for districts
// on change of divison (region)
$(".regionListchk").change(function () {
  var selectedRegions = [];
  $(".regionListchk:checked").each(function () {
    selectedRegions.push("'" + $(this).val().toUpperCase() + "'");
  });
  var addDeptV = selectedRegions.length > 0 ? selectedRegions.join(", ") : 0;
  console.log(addDeptV);

  $("#inputDistrict").html("");
  $("#inputDistrict").append(
    '<option value="0" disabled>Select District</option>'
  );
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
      if (j.statusCode == "1") {
        // depData(addDeptV)
        makeDropdown(inputDistrict, j.data);
      }
    });
  } else {
    $("#inputDistrict").attr("disabled", true);
    // $("#depName").html('');
    // 	$("#depName").append('<option value="0" disabled>Select</option>');
  }
});

// function for initializing the dropdown for main categories
// on change of department
$("#dept").change(function () {
  var addDeptV = getSelectedValuesMsel("#dept", ", ", []);
  console.log(addDeptV);
  userTypee(addDeptV);
  $("#categ").html("");
  $("#categ").append(
    '<option value="0" disabled>Select Main Category</option>'
  );
  if (addDeptV != "0") {
    $(".mainCategDiv").show();
    $("#categ").attr("disabled", false);
    var c = JSON.stringify({
      department_name: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "categoryBydepartment?d=" + d,
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

        //  CategoryBydept(addDeptV)
        makeDropdown(categ, j.data);
      }
    });
  } else {
    $(
      ".mainCategDiv, .subCategDiv, .subCategl2Div, .subCategl3Div, .subCategl4Div"
    ).hide();
    $("#categ, #subcateg, #subcategL2, #subcategL3, #subcategL4").attr(
      "disabled",
      true
    );
    $("#subcateg, #subcategL2, #subcategL3, #subcategL4").html("");
    $("#subcateg").append(
      '<option value="0" disabled>Select Sub Category</option>'
    );
    $("#subcategL2").append(
      '<option value="0" disabled>Select Sub Next L2</option>'
    );
    $("#subcategL3").append(
      '<option value="0" disabled>Select Sub Next L3</option>'
    );
    $("#subcategL4").append(
      '<option value="0" disabled>Select Sub Next L4</option>'
    );
  }
});

// function for initializing the dropdown for usertypee
// on change of department
function userTypee(addDeptV) {
  console.log(addDeptV);
  $("#userTypee1").html("");
  $("#userTypee1").append(
    '<option value="0" disabled>Select User Type</option>'
  );
  if (addDeptV != null) {
   // $("#userTypee1").attr("disabled", false);
    var c = JSON.stringify({
      department_name: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "usertypeBydepartment?d=" + d,
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
        console.log(j.data);
        makeDropdown(userTypee1, j.data);
      }
    });
  } else {
    $("#userTypee1").attr("disabled", true);
  }
}

// function for initializing the dropdown for sub categories
// on change of main categories
$("#categ").change(function () {
  var categName = getSelectedValuesMsel("#categ", ", ", []);
  console.log(categName);
  $("#subcateg").html("");
  $("#subcateg").append(
    '<option value="0" disabled>Select Sub Category</option>'
  );
  if (categName != "0") {
    $(".subCategDiv").show();
    $("#subcateg").attr("disabled", false);
    var c = JSON.stringify({
      category: categName,
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

        //  CategoryBydept(addDeptV)
        makeDropdown(subcateg, j.data);
      }
    });
  } else {
    $(".subCategDiv, .subCategl2Div, .subCategl3Div, .subCategl4Div").hide();
    $("#subcateg, #subcategL2, #subcategL3, #subcategL4").attr(
      "disabled",
      true
    );
    $("#subcategL2, #subcategL3, #subcategL4").html("");
    $("#subcategL2").append(
      '<option value="0" disabled>Select Sub Next L2</option>'
    );
    $("#subcategL3").append(
      '<option value="0" disabled>Select Sub Next L3</option>'
    );
    $("#subcategL4").append(
      '<option value="0" disabled>Select Sub Next L4</option>'
    );
  }
});

// function for initializing the dropdown for sub categories L2
// on change of sub categories (basically L1)
$("#subcateg").change(function () {
  var categName = getSelectedValuesMsel("#subcateg", ", ", []);
  console.log(categName);
  $("#subcategL2").html("");
  $("#subcategL2").append(
    '<option value="0" disabled>Select Sub Next L2</option>'
  );
  if (categName != "0") {
    $(".subCategl2Div").show();
    $("#subcategL2").attr("disabled", false);
    var c = JSON.stringify({
      category: categName,
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

        //  CategoryBydept(addDeptV)
        makeDropdown(subcategL2, j.data);
      }
    });
  } else {
    $(".subCategl2Div, .subCategl3Div, .subCategl4Div").hide();
    $("#subcategL2, #subcategL3, #subcategL4").attr("disabled", true);
    $("#subcategL3, #subcategL4").html("");
    $("#subcategL3").append(
      '<option value="0" disabled>Select Sub Next L3</option>'
    );
    $("#subcategL4").append(
      '<option value="0" disabled>Select Sub Next L4</option>'
    );
  }
});

// function for initializing the dropdown for sub categories L3
// on change of sub categories L2
$("#subcategL2").change(function () {
  var categName = getSelectedValuesMsel("#subcategL2", ", ", []);
  console.log(categName);
  $("#subcategL3").html("");
  $("#subcategL3").append(
    '<option value="0" disabled>Select Sub Next L3</option>'
  );
  if (categName != "0") {
    $(".subCategl3Div").show();
    $("#subcategL3").attr("disabled", false);
    var c = JSON.stringify({
      category: categName,
    });
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
        //console.log(j.data);

        //  CategoryBydept(addDeptV)
        makeDropdown(subcategL3, j.data);
      }
    });
  } else {
    $(".subCategl3Div, .subCategl4Div").hide();
    $("#subcategL3, #subcategL4").attr("disabled", true);
    $("#subcategL4").html("");
    $("#subcategL4").append(
      '<option value="0" disabled>Select Sub Next L4</option>'
    );
  }
});

// function for initializing the dropdown for sub categories L4
// on change of sub categories L3
$("#subcategL3").change(function () {
  var categName = getSelectedValuesMsel("#subcategL3", ", ", []);
  console.log(categName);
  $("#subcategL4").html("");
  $("#subcategL4").append(
    '<option value="0" disabled>Select Sub Next L4</option>'
  );
  if (categName != "0") {
    $(".subCategl4Div").show();
    $("#subcategL4").attr("disabled", false);
    var c = JSON.stringify({
      category: categName,
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
        //console.log(j.data);

        //  CategoryBydept(addDeptV)
        makeDropdown(subcategL4, j.data);
      }
    });
  } else {
    $(".subCategl4Div").hide();
    $("#subcategL4").attr("disabled", true);
  }
});

$(".input-num").bind("keyup paste", function () {
  this.value = this.value.replace(/[^0-9]/g, "");
});

$("#penEoF").keyup(function (e) {
  if (
    $("#penEoF").val() != "0" &&
    $("#penEoF").val().trim().length != "" &&
    $("#penEoF").val() != null
  ) {
    $("#penTo").prop("readonly", false);
    // enabling opVal1 when penEoF is not null or has integer value
    $("#opVal1").prop("disabled", false);
  } else {
    $("#penTo").prop("readonly", true);
    $("#penTo").val("");
  }
});

$("#opVal1").change(function () {
  opVal1();
});

function opVal1() {
  var operatorValue = $("#opVal1").find(":selected").val();
  // console.log(operatorValue);
  if (operatorValue === "BETWEEN") {
    $("#penTo").prop("disabled", false);
  } else {
    $("#penTo").prop("disabled", true);
  }
}

$("#reset").click(function () {
  window.location.reload();
});

// 21 MARCH 2024 - SKY - end

// $("#submit").click(function () {
//   var selects = $(".form-select, .form-check-input, .multi-select2, .regionListchk");
//   var chk = 0;
//   for (var i = 0; i < selects.length; i++) {
//     if (selects[i].value != "0" && selects[i].value != "" && selects[i].value != 0) {
//       chk = 1;
//       break;
//     } else {
//       chk = 0;
//     }
//   }
//   if (chk == "0") {
//     alert("All parameters cannot be empty!");
//   } else {
//     $(".form-select").prop("disabled", true);
//     $(".input-num").prop("disabled", true);
//     reportView();
//   }
// });

$("#submit").click(function () {
  // Check if any input field is filled
  var anyInputFilled = false;

  // Checkboxes - .regionListchk
/*  var checkboxes = $(".regionListchk");
  checkboxes.each(function () {
    if ($(this).prop("checked")) {
      anyInputFilled = true;
      return false;
    }
  });*/

  // Checkboxes - .genderchk
  var genderCheckboxes = $(".genderchk");
  genderCheckboxes.each(function () {
    if ($(this).prop("checked")) {
      anyInputFilled = true;
      return false;
    }
  });

  // Multi-select dropdowns
  var multiSelects = $(".multi-select2");
  multiSelects.each(function () {
    if ($(this).val() != null && $(this).val().length !== 0) {
      anyInputFilled = true;
      return false;
    }
  });

  // Normal input fields
  var normalInputs = $(".form-select").not(".multi-select2");
  normalInputs.each(function () {
    if ($(this).val() !== "" && $(this).val() !== "0") {
      anyInputFilled = true;
      return false;
    }
  });

  // Radio buttons
  var radioButtons = $("input[name='grvstatus']");
  radioButtons.each(function () {
    if ($(this).prop("checked")) {
      anyInputFilled = true;
      return false;
    }
  });

  if (anyInputFilled) {
   /* $(".form-select").prop("disabled", true);
    $(".multi-select2").prop("disabled", true);
    $(".input-num").prop("disabled", true);
    $(".regionListchk").prop("disabled", true);
    $(".genderchk").prop("disabled", true);
    $("input[name='grvstatus']").prop("disabled", true);*/

    reportView();
  } else {
    alert("All parameters cannot be empty!");
  }
});

$("input[name='grvstatus']").change(function () {
  var appStatus = $("input[name='grvstatus']:checked").val() || 0;
  var deptName = getSelectedValuesMsel("#dept", ", ", []);
  if (appStatus == "Pending") {
    $("#penEoF").prop("disabled", false);
	$("#userTypee1").attr("disabled", false);
	  userTypee(deptName)
  }else{
	$("#penEoF").prop("disabled", true);
	$("#userTypee1").attr("disabled", true);
  }
});

function reportView() {
  // checkboxes values
  //var region = getSelectedValuesChk(".regionListchk", ", ");
  var gender = getSelectedValuesChk(".genderchk", ", ");

  // multi select 2 values
  var userType = getSelectedValuesMsel("#userTypee1", ", ", []);
  var deptName = getSelectedValuesMsel("#dept", ", ", []);
 // var district = getSelectedValuesMsel("#inputDistrict", ", ", []);
  var appStatus = $("input[name='grvstatus']:checked").val() || 0;
  var categ = getSelectedValuesMsel("#categ", ", ", []);
  var subcateg = getSelectedValuesMsel("#subcateg", ", ", []);
  var subcategL2 = getSelectedValuesMsel("#subcategL2", ", ", []);
  var subcategL3 = getSelectedValuesMsel("#subcategL3", ", ", []);
  var subcategL4 = getSelectedValuesMsel("#subcategL4", ", ", []);

  // var userType = $("#userTypee").find(":selected").val() || 0;
  // var region = $("#inputRegion1").find(":selected").val() || 0;
  // var district = $("#inputDistrict").find(":selected").val() || 0;
  // var gender = $("#gender").find(":selected").val() || 0;
  // var deptName = $("#dept").find(":selected").val() || 0;
  // var appStatus = $("#appStatus").find(":selected").val() || 0;
  // var categ = $("#categ").find(":selected").val() || 0;
  // var subcateg = $("#subcateg").find(":selected").val() || 0;
  // var subcategL2 = $("#subcategL2").find(":selected").val() || 0;
  // var subcategL3 = $("#subcategL3").find(":selected").val() || 0;
  // var subcategL4 = $("#subcategL4").find(":selected").val() || 0;
  //pending from - pending to//
  var penEoF = $("#penEoF").val() || 0;
  var penTo = $("#penTo").val() || 0;
  // operator value //
  var opValue = $("#opVal1").find(":selected").val() || 0;

  var c = JSON.stringify({
    userType: userType,
  //  region: region,
  //  district: district,
    gender: gender,
    deptName: deptName,
    appStatus: appStatus,
    categ: categ,
    subcateg: subcateg,
    subcategL2: subcategL2,
    subcategL3: subcategL3,
    subcategL4: subcategL4,
    //pending from - pending to//
    pendingFrom: penEoF,
    pendingTo: penTo,
    // operator value //
    opValue: opValue,
  });
  var d = chkV(c);
  var settings = {
    url: "reportAdvanced?d=" + d,
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
    // console.log("show " + j.showDaysDiff);
    if (j.statusCode1 == "1" && j.data.length > 0) {
      // format Date to dd MM yyyy hh:mm:ss:ms
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });

      // console.log(j.data);
      // console.log(j.tblCount);
      $("#advQueryCount, #totalCount").text("(" + j.tblCount + ")");
      $(".advQueryDiv").removeClass("visually-hidden");
      makeDataTable(j.data, j.showDaysDiff);
    } else {
      $("#advQueryCount, #totalCount").text("(" + j.tblCount + ")");
      // $(".advQueryDiv").removeClass("visually-hidden");
      // makeDataTable(0);
      // alert("")
      $(".advQueryDiv").addClass("visually-hidden");
      Swal.fire({
        showCloseButton: true,
        showConfirmButton: false,
        title: "No Data Available for the selected parameters!",
        icon: "error",
      });
    }
  });
}

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
  //   window.location.href = "grievanceDatail?d=" + d;
  window.open("grievanceDatail?d=" + d, "_blank");
});

var table1;

function makeDataTable(d, sdD) {
  // console.log(sdD)

  // console.log(d)

  var columns1 = [
    {
      data: "uniqid",
      defaultContent: "",
      class: "noExport",
      title: "Action",
      render: function (data, type, row, meta) {
        var btn =
          '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vDetails" data-appflag = "JKSAMADHAN" title="Grievance detail" value = "' +
          data +
          '"></button>';

        return btn + "</div>";
      },
    },
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
      title: "Main Category",
    },
    {
      data: "sub_category",
      defaultContent: "",
      title: "Sub Category",
    },
    {
      data: "sub_category_next_level2",
      defaultContent: "",
      title: "NL 2",
    },
    {
      data: "sub_category_next_level3",
      defaultContent: "",
      title: "NL 3",
    },
    {
      data: "sub_category_next_level4",
      defaultContent: "",
      title: "NL 4",
    },
    {
      data: "usrregion",
      defaultContent: "",
      title: "Region",
    },
    {
      data: "usrdistrict",
      defaultContent: "",
      title: "District",
    },
    {
      data: "gender",
      defaultContent: "",
      title: "Citizen Gender",
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
      data: "flag",
      defaultContent: "",
      title: "Classification",
    },
    {
      data: "status",
      defaultContent: "",
      title: "Status",
    },
  ];

  if (sdD == "1") {
    var daysdiffColumn = {
      data: "daysdiff",
      defaultContent: "",
      title: "Pending Since (Days)",
    };
    columns1.push(daysdiffColumn);
  }

  // Add usertype column only if usertype exists in the table
  for (var i = 0; i < d.length; i++) {
    if ("usertype" in d[i]) {
      columns1.push({
        render: function (data, type, row) {
          return row.usertype;
        },
        title: "User Type",
      });
    }
  }

  // Add updated by column only if status is "Resolved", "Rejected"
  if (d.length > 0) {
    if (d.some((item) => ["Resolved", "Rejected"].includes(item.status))) {
      columns1.push({
        render: function (data, type, row) {
          if (["Resolved", "Rejected"].includes(row.status)) {
            return row.updated_by;
          } else {
            return "";
          }
        },
        title: "Updated By",
      });
    }
  }

  // Add action button if status is pending, under process, or acknowledged
  if (d.length > 0) {
    if (
      d.some((item) =>
        ["Pending", "Under Process", "Acknowledged"].includes(item.status)
      )
    ) {
      columns1.push({
        defaultContent: "",
        title: "Pending With Details",
        render: function (data, type, row) {
          if (
            ["Pending", "Under Process", "Acknowledged"].includes(row.status)
          ) {
            // Construct the data attributes to pass both uniqid and category_id
            var dataAttributes =
              'data-uniqid="' +
              row.uniqid +
              '" data-category-id="' +
              row.category_id +
              '"';
            return (
              '<button class="btn btn-sm btn-primary action-btn bi bi-eye" data-toggle="modal" data-target="#myModal" ' +
              dataAttributes +
              "></button>"
            );
          } else {
            return "";
          }
        },
      });
    }
  }

  $(".btnQB-customBtn").on("click", function () {
    console.log($(this).val());
    table156.button("." + $(this).val()).trigger();
  });

  table156 = $("#advDetailsTbl").DataTable({
    data: d,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
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
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    columns: columns1,
  });

  $("#advDetailsTbl_filter input[type='search']").on("input", function () {
   
       var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
       $(this).val(cleanValue);
       table156.search(cleanValue).draw(); // Update DataTable search
   });
}

// Event listener for filter button
$("#filterBtn").on("click", function () {
  var fromDate = $("#fromDateInput").val();
  var toDate = $("#toDateInput").val();

  // Find the column index of "createddate" dynamically
  var columnIndex = table1
    .columns()
    .header()
    .toArray()
    .findIndex((header) => $(header).text() === "Submitted On");

  // Apply date range filter to DataTable
  if (columnIndex !== -1) {
    table1
      .columns(columnIndex)
      .search(fromDate + " to " + toDate, true, false)
      .draw();
  } else {
    console.error('Column "Submitted On" not found.');
  }
});

$(document).on("click", ".action-btn", function (e) {
  // Get the value of data-uniqid and data-category-id attributes
  var uniqid = $(this).data("uniqid");
  var categoryId = $(this).data("category-id");
  var c = JSON.stringify({
    uniqid: uniqid,
    category_id: categoryId,
  });
  let d = chkV(c);
  var settings = {
    url: "pendingWithReport?d=" + d,
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

$("#advDetailsTbl").on("click", ".action-btn", function () {
  $("#myModal").modal("show");

  // readjusting the column / row width of the table to fit in the modal window
  $("#myModal").one("shown.bs.modal", function () {
    $(".advPendingWithDiv").removeClass("visually-hidden");
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
  });
});

function makeDataTable2(d) {
  $("#advPendingWithTbl").empty();

  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table157.button("." + $(this).val()).trigger();
  });

  var table157 = $("#advPendingWithTbl").DataTable({
    data: d,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    paging: true,
    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
      }
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

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
              columnWidths.push('*');
          }
          doc.content[1].table.widths = columnWidths;
      },
      exportOptions: {
          columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
      }
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
        data: "grievance_id",
        defaultContent: "",
        title: "Grievance ID",
      },
      {
        data: "created_by",
        defaultContent: "",
        title: "Assgined By",
      },
      {
        data: "assigned_to",
        defaultContent: "",
        title: "Pending With",
      },
      {
        data: "action",
        defaultContent: "",
        title: "Status",
      },
    ],
  });
}
