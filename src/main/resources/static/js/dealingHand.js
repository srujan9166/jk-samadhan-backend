// document ready function
$(document).ready(function () {
  var typeOfUser = $(".usrFlag").val();
  // if(typeOfUser=="Raabita User"){
  //   $("#raabitaDivisions").removeClass("d-none")
  // }

  $(".input-field").keyup(function (e) {
    var $th = $(this);
    $th.val($th.val().replace(/(\s{2,})|[^a-zA-Z'()]/g, " "));
    $th.val($th.val().replace(/^\s*/, ""));
  });

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

  userList();
  // $('.collapsible').on('click', function(){
  //   $(this).toggleClass('active');
  //   var content = $(this).next('.content');
  //   if (content.css('display') === 'block') {
  //     content.slideUp();
  //   } else {
  //     content.slideDown();
  //   }
  // });
  //sessionFunc()
  $(function () {
    sessionFunc()
    $(".cBb").one("click", function () {
      window.history.back();
    });
  });

  if (window.location.href.indexOf("/home") != -1) {
    //console.log("dealing hand List working ....");
    getDealingHandList("Home");

  }

  if (window.location.href.indexOf("/editGrievanceDetails") != -1) {
    previewDetailsForEdit();

  }

  if (window.location.href.indexOf("/createUsersRMCandDH") != -1) {
    getCreatedUsrList("all");
  }

  if (window.location.href.indexOf("/getUserList") != -1) {
    getCreatedUsrList("getuserlist");
    $(document).on("click", ".shwUptDetails", function (e) {
      let c = $(this).val();
      let d = chkV(c);
      window.location.href = "basedUlUpdProfile?d=" + d;
    });
  }
});

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

let context_path = $('#context_path').val();
function sessionFunc() {

  var settings = {
    url: context_path + "/sessionvalue",
    method: "POST",
    data: { "sessionname": $('#sessionname').val(), },
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    $('.sessionvalue').val(j);
  });
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

$("#inputRegion1").change(function () {
  var addDeptV = $("#inputRegion1").find(":selected").val();
  $("#inputDistrict").html("");
  $("#inputDistrict").append('<option value="0">Select</option>');
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
        //console.log(j.data);

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

$("#depName").change(function () {
  var addDeptV = $("#depName").find(":selected").val();
  $("#categ").html("");
  $("#categ").append('<option value="0">Select</option>');
  if (addDeptV != 0) {
    //$("#inputDistrict").attr("disabled",false);
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
        makeDropdown(categ, j.data);

      }
    });
    $("#categ").attr("disabled", false);
  } else {
    $("#categ").attr("disabled", true);
  }



  //Reset Values on change of Divison

  // $("#depName")[0].selectedIndex = 0;
  $("#categ")[0].selectedIndex = 0;
  $("#subcateg")[0].selectedIndex = 0;
  $("#subcateg2")[0].selectedIndex = 0;
  $("#subcateg3")[0].selectedIndex = 0;
  $("#subcateg4")[0].selectedIndex = 0;

});



// for Raabita - 03/01/2025 - start
$("#divName").change(function () {
  var addDeptV = $("#divName").find(":selected").val();
  $("#distName").html("");
  $("#distName").append('<option value="0">Select District</option>');
  $("#blockName").html("");
  $("#blockName").append('<option value="0">Select Block</option>');
  $("#panchayatName").html("");
  $("#panchayatName").append('<option value="0">Select Panchayat</option>');

  $("#municipalityName")[0].selectedIndex = 0;
  $("#wardName")[0].selectedIndex = 0;
  $("#blockName")[0].selectedIndex = 0;
  $("#panchayatName")[0].selectedIndex = 0;

  if (addDeptV != 0) {
    //$("#inputDistrict").attr("disabled",false);
    var c = JSON.stringify({
      department_name: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "districtByDivision?d=" + d,
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
        //console.log( j.data)
        makeDropdown2(distName, j.data);
      }
    });
    $("#distName").attr("disabled", false);
    $("#blockName").attr("disabled", false);
    $("#panchayatName").attr("disabled", false);
  } else {
    $("#distName").attr("disabled", true);
    $("#blockName").attr("disabled", true);
    $("#panchayatName").attr("disabled", true);
  }
});

$("#distName").change(function () {
  var addDeptV = $("#distName").find(":selected").val();

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


  moreData();

  //console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#blockName").prop("disabled", false);
      $("#panchayatName").prop("disabled", false);

      // municipality
      $("#municipalityName").prop("disabled", false);
      $("#wardName").prop("disabled", false);

    } else {
      $("#blockName").prop("disabled", false);
      $("#blockName").val(0);
      $("#panchayatName").prop("disabled", false);
      $("#panchayatName").val(0);


      // municipality
      $("#municipalityName").prop("disabled", false);
      $("#municipalityName").val(0);
      $("#wardName").prop("disabled", false);
      $("#wardName").val(0);


      var c = JSON.stringify({
        value: addDeptV,
      });


      var d = chkV(c);

      // for Block AJAX
      var settings1 = {
        url: "blockByDistrict?d=" + d,
        method: "POST",
        timeout: 0,
      };
      $.ajax(settings1).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        //console.log(j)
        if (j.statusCode == "1") {
          //	console.log(j.data);
          $("#blockName").attr("disabled", false);
          $("#panchayatName").attr("disabled", false);
          //$('#depName').val(j.data[0].department_name);
          if (j.data[0].values != "") {
            makeDropdown2(blockName, j.data);
          } else {
            $("#blockName").attr("disabled", true);
            $("#panchayatName").attr("disabled", true);
          }
        } else {
          $("#blockName").attr("disabled", false);
          $("#panchayatName").attr("disabled", false);
        }
      });

      // for Municipality AJAX
      var settings2 = {
        url: "municipalityByDistrict?d=" + d,
        method: "POST",
        timeout: 0,
      };
      $.ajax(settings2).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        //console.log(j)
        if (j.statusCode == "1") {
          //	console.log(j.data);
          $("#municipalityName").attr("disabled", false);
          $("#wardName").attr("disabled", false);
          //$('#depName').val(j.data[0].department_name);
          if (j.data[0].values != "") {
            makeDropdown2(municipalityName, j.data);
          } else {
            $("#municipalityName").attr("disabled", true);
            $("#wardName").attr("disabled", true);
          }
        } else {
          $("#municipalityName").attr("disabled", false);
          $("#wardName").attr("disabled", false);
        }
      });

    }
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
    $("#panchayatName").prop("disabled", true);
    $("#panchayatName").val(0);

    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "panchayatByBlock?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //  console.log(j)
      if (j.statusCode == "1") {
        // console.log(j.data);
        $("#panchayatName").attr("disabled", false);
        makeDropdown2(panchayatName, j.data);
      } else {
        $("#panchayatName").attr("disabled", true);
      }
    });
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
    $("#wardName").prop("disabled", true);
    $("#wardName").val(0);

    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "wardByMunicipality?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //  console.log(j)
      if (j.statusCode == "1") {
        // console.log(j.data);
        $("#wardName").attr("disabled", false);
        makeDropdown2(wardName, j.data);
      } else {
        $("#wardName").attr("disabled", true);
      }
    });
  } else {
    $("#wardName").prop("disabled", true);
    $("#wardName").val(0);

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

// for Raabita - 03/01/2025 - end

function moreData() {
  var dep = $("#depName").find(":selected").val();
  var cat = $("#categ").find(":selected").val();
  $("#addInfo").html("");
  $("#addInfo").append('<option value="0">Select</option>');

  if (cat != 0) {
    var c = JSON.stringify({
      department: dep,
      category: cat,
    });
    var d = chkV(c);
    var settings = {
      url: "additionalData?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      if (j.statusCode == "1") {
        $("#addInfoDiv").html("");
        $("#addInfoDiv").show();
        for (var i = 0; i <= j.data.length; i++) {
          console.log(j.data[i].values);

          $("#addInfoDiv").append(
            '<div class="col-lg-3 col-md-4 py-2 border-bottom fw-bold colName">' +
            j.data[i].values +
            ':<span style="color:red">*</span></div><div class="col-lg-9 col-md-8 py-2 border-bottom"><div style="max-width: 450px"><input type="text" class="form-control moreData" data-value=' +
            j.data[i].values +
            ' id="" /></div></div>'
          );
        }

        // makeDropdown(addInfo, j.data);
      } else {
        $("#addInfoDiv").hide();
      }
      //makeCheckBoxes(checkBoxDiv,addDeptV);
    });
  } else {
    $("#addInfoDiv").hide();
  }
}

// 03 April 2024 - category , sub categ, and next level sub categ etc... - SKY
$("#categ").change(function () {
  var addDeptV = $("#categ").find(":selected").val();
  $("#subcateg").html("");
  $("#subcateg").append('<option value="0">Select</option>');
  moreData();
  //console.log(stateS);
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#categV").val("");
      $("#categT").show();
      $("#subcateg").prop("disabled", false);
    } else {
      $("#subcateg").prop("disabled", false);
      $("#subcateg2").prop("disabled", true);
      $("#subcateg3").prop("disabled", true);
      $("#subcateg4").prop("disabled", true);
      $("#subcateg").prop("disabled", true);
      $("#categT").hide();
      $("#subcateg2").val(0);
      $("#subcateg3").val(0);
      $("#subcateg4").val(0);
      $("#subcateg").val(0);
      var c = JSON.stringify({
        value: addDeptV,
      });
      var d = chkV(c);
      var settings = {
        url: "subcateg?d=" + d,
        method: "POST",
        timeout: 0,
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        //console.log(j)
        if (j.statusCode == "1") {
          //	console.log(j.data);
          $("#subcateg").attr("disabled", false);
          //$('#depName').val(j.data[0].department_name);
          if (j.data[0].values != "") {
            makeDropdown(subcateg, j.data);
          } else {
            $("#subcateg").attr("disabled", true);
          }
        } else {
          $("#subcateg").attr("disabled", true);
        }
      });
    }
  } else {
    $("#subcateg").prop("disabled", false);
    $("#subcateg2").prop("disabled", true);
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg").prop("disabled", true);
    $("#categT").hide();
    $("#subcateg2").val(0);
    $("#subcateg3").val(0);
    $("#subcateg4").val(0);
    $("#subcateg").val(0);
  }
});

$("#subcateg").change(function () {
  var addDeptV = $("#subcateg").find(":selected").val();
  //console.log(addDeptV);
  $("#subcateg2").html("");
  $("#subcateg2").append('<option value="0">Select</option>');
  if (addDeptV != 0) {
    $("#subcateg2").prop("disabled", true);
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg2").val(0);
    $("#subcateg3").val(0);
    $("#subcateg4").val(0);

    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "subcategNextLevel2?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //  console.log(j)
      if (j.statusCode == "1") {
        //	console.log(j.data);
        $("#subcateg2").attr("disabled", false);
        makeDropdown(subcateg2, j.data);
      } else {
        $("#subcateg2").attr("disabled", true);
      }
    });
  } else {
    $("#subcateg2").prop("disabled", true);
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg2").val(0);
    $("#subcateg3").val(0);
    $("#subcateg4").val(0);
  }
});

$("#subcateg2").change(function () {
  var addDeptV = $("#subcateg2").find(":selected").val();
  //console.log(addDeptV);
  $("#subcateg3").html("");
  $("#subcateg3").append('<option value="0">Select</option>');
  if (addDeptV != 0) {
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
    $("#subcateg3").val(0);
    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "subcategNextLevel3?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //  console.log(j)
      if (j.statusCode == "1") {
        $("#subcateg3").attr("disabled", false);
        //	console.log(j.data);
        makeDropdown(subcateg3, j.data);
      } else {
        $("#subcateg2").attr("disabled", true);
      }
    });
  } else {
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
    $("#subcateg3").val(0);
  }
});

$("#subcateg3").change(function () {
  var addDeptV = $("#subcateg3").find(":selected").val();
  //console.log(addDeptV);
  $("#subcateg4").html("");
  $("#subcateg4").append('<option value="0">Select</option>');
  if (addDeptV != 0) {
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
    var c = JSON.stringify({
      value: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "subcategNextLevel4?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      // console.log(j)
      if (j.statusCode == "1") {
        //	console.log(j.data);
        $("#subcateg4").attr("disabled", false);
        makeDropdown(subcateg4, j.data);
      } else {
        $("#subcateg4").attr("disabled", true);
      }
    });
  } else {
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
  }
});

// 03 April 2024 - category , sub categ, and next level sub categ etc... - SKY

function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>")
        .attr("value", value.values)
        .text(value.values.toUpperCase())
    );
  });
}



$("#stUploadPhoto1").on("change", function () {
  //docss=[];
  //fileValidation()

  var id = $(this).attr("id");
  var fff = fileValidation2(id);
  if (fff != false) {
    var t = checkMaliciousFile2(id);
    //    console.log(t);
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

function checkMaliciousFile2(id) {
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
      //  j = setV(j);
      //j = JSON.parse(j);
      console.log(j);
      if (j == "1") {
        resolve(true, j);
      } else {
        resolve(false, j);
      }
    });
  });
}
function fileValidation2(id) {
  // alert(id)
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

    if (file >= 5 * 1024) {

      alert("File size should be less than 5 MB");
      $("#" + id).val("");
      return false;
    }
  }
}

$("#moComp").on("change", function () {
  var modeOfComp = $("#moComp").find(":selected").val();
  if (modeOfComp != 0) {
    if (modeOfComp == "By Post") {
      // $("#pTrackingDiv").removeClass("visually-hidden");
      $("#pTrackingDiv").show();
    } else {
      $(".pTrackingNo").val("");
      //$("#pTrackingDiv").addClass("visually-hidden");
      $("#pTrackingDiv").hide();
    }
  } else {
    $(".pTrackingNo").val("");
    //$("#pTrackingDiv").addClass("visually-hidden");
    $("#pTrackingDiv").hide();
  }
});

$('#descrp').on('input', function () {
  const validPattern = /^[a-zA-Z0-9/().,\s-]*$/; // Alphanumeric and '/' pattern
  let input = $(this).val();

  // Remove any invalid characters from the input
  if (!validPattern.test(input)) {
    $(this).val(input.replace(/[^a-zA-Z0-9/().,\s-]/g, ''));
    $('#descrpError').show();
  } else {
    $('#descrpError').hide();
  }
});


// Under Municipality / Block - start
$('input[name="umrb"]').on('change', function () {
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

// Under Municipality / Block - end

$(document).on("click", ".dHbtn", function () {

  // Implementing RMC User logic - 16th August 2024 - SKY
  var usrFlag = $('.usrFlag').val();
  // console.log(usrFlag)
  var grvRefrecFrom;
  var commRmcNo;

  var umrb = $('input[name="umrb"]:checked').val() || "";

  var divName = $('#divName').find(":selected").val();
  var distName = $('#distName').find(":selected").val();
  var blockName = $('#blockName').find(":selected").val();
  var panchayatName = $('#panchayatName').find(":selected").val();
  var psga = $('input[name="psga"]:checked').val();
  var municipalityName = $('#municipalityName').find(":selected").val();
  var wardName = $('#wardName').find(":selected").val();

  if (usrFlag == "RMC User") {
    grvRefrecFrom = $('#grvRefrecFrom').find(":selected").val();
    commRmcNo = $(".commRmcNo").val();
    // psga = "No";
  }

  else if (usrFlag == "Raabita User") {
    grvRefrecFrom = "NA";
    commRmcNo = $(".commRmcNo").val();
    // divName = $('#divName').find(":selected").val();
    // distName = $('#distName').find(":selected").val();
    // blockName = $('#blockName').find(":selected").val();
    // panchayatName = $('#panchayatName').find(":selected").val();
    // psga = $('input[name="psga"]:checked').val();

    // municipalityName = $('#municipalityName').find(":selected").val();
    // wardName = $('#wardName').find(":selected").val();


  }


  else {
    grvRefrecFrom = "NA";
    commRmcNo = "NA";
    // psga = "No";
  }
  //  console.log(divName+"  "+distName+"  "+blockName+"  "+panchayatName);
  // console.log(commRmcNo)
  // Implementing RMC User logic - 16th August 2024 - SKY


  var modeOfComp = $("#moComp").find(":selected").val();
  var pTrackingNo = $(".pTrackingNo").val();
  var prevFileNo = $(".prevFileNo").val();
  var grvName = $(".grvName").val();
  var gender = $("#gender").find(":selected").val();
  var mobileNo = $(".mobileNo").val();
  var emailId = $(".emailId").val();
  var grvAddress = $(".grvAddress").val();
  var resiAddress = $(".resiAddress").val();
  var grvPinCode = $(".grvPinCode").val();
  // var grvRegion = $("#inputRegion1").find(":selected").val();
  // var grvDistrict = $("#inputDistrict").find(":selected").val();
  var grvDepName = $("#depName").find(":selected").val();
  var grvCategName = $("#categ").find(":selected").val();
  // 03 April 2024 - sub categ and next level categ - SKY
  var grvSubCategName = $("#subcateg").find(":selected").val();
  var grvSubCateg2Name = $("#subcateg2").find(":selected").val();
  var grvSubCateg3Name = $("#subcateg3").find(":selected").val();
  var grvSubCateg4Name = $("#subcateg4").find(":selected").val();
  var info = $("#addInfo").find(":selected").val();
  // 03 April 2024 - sub categ and next level categ - SKY
  var grvDescription = $("#descrp").val();
  var validation;
  var addInfoDiv = $("#addInfoDiv").is(":visible");

  // console.log(`grvRefrecFrom: ${grvRefrecFrom}, commRmcNo: ${commRmcNo}, modeOfComp: ${modeOfComp}, grvName: ${grvName}, gender: ${gender}, grvAddress: ${grvAddress}, grvPinCode: ${grvPinCode}, grvDepName: ${grvDepName}, grvCategName: ${grvCategName}, grvSubCategName: ${grvSubCategName}, grvDescription: ${grvDescription}, grvSubCateg2Name: ${grvSubCateg2Name}, grvSubCateg3Name: ${grvSubCateg3Name}, grvSubCateg4Name: ${grvSubCateg4Name}`);

  if (usrFlag == "RMC User") {
    validation =
      grvRefrecFrom != "0" &&
      commRmcNo != "" &&
      modeOfComp != "0" &&
      grvName != "" &&
      gender != "0" &&
      grvAddress != "" &&
      resiAddress != "" &&
      grvPinCode != "" &&
      grvDepName != "0" &&
      grvCategName != "0" &&
      // grvSubCategName != 0 &&
      grvDescription != "" &&
      divName != "0" &&
      distName != "0" &&
      psga != undefined &&
      (umrb === 'Municipality' && municipalityName != "0") || (umrb === 'Block' && blockName != "0")
  } else if (usrFlag == "Raabita User") {

    validation =
      grvRefrecFrom != "0" &&
      // commRmcNo != "" &&
      modeOfComp != "0" &&
      grvName != "" &&
      gender != "0" &&
      grvAddress != "" &&
      grvPinCode != "" &&
      grvDepName != "0" &&
      grvCategName != "0" &&
      // grvSubCategName != 0 &&
      grvDescription != "" &&
      divName != "0" &&
      distName != "0" &&
      // blockName!=0 &&
      // panchayatName!=0 &&
      psga != undefined &&
      (umrb === 'Municipality' && municipalityName != "0") || (umrb === 'Block' && blockName != "0")


  } else {
    // console.log(mobileNo+" "+modeOfComp+" "+grvName);
    validation = mobileNo != "" &&
      modeOfComp != "0" &&
      grvName != "" &&
      gender != "0" &&
      grvAddress != "" &&
      grvPinCode != "" &&
      grvDepName != "0" &&
      grvCategName != "0" &&
      grvDescription != "" &&
      divName != "0" &&
      distName != "0" &&
      psga != undefined &&
      (umrb === 'Municipality' && municipalityName != "0") || (umrb === 'Block' && blockName != "0");
  }

  if ($("#pTrackingDiv").is(":visible")) {
    validation = +validation && pTrackingNo != "";
  }


  //Naitik Changes on popup on 09/10/2025
  if (validation) {

    if (!confirm("Are you sure that you want to Submit Grievance?")) {
      return;


    }
  }

  //Naitik Changes End 09/10/2025

  if (validation) {
    $(".dHbtn").attr("disabled", true);
    var inputValues = [];
    $(".moreData").each(function () {
      var col = $(this).data("value");
      var val = $(this).val();
      var obj2 = {
        data_col: col,
        value: val,
      };
      inputValues.push(obj2);
    });
    //if (modeOfComp == "By Post" && pTrackingNo != "") {
    var c = JSON.stringify({

      // 16th August 2024 - RMC - SKY
      grvRefrecFrom: grvRefrecFrom,
      commRmcNo: commRmcNo,
      // 16th August 2024 - RMC - SKY
      modeOfComp: modeOfComp,
      pTrackingNo: pTrackingNo,
      prevFileNo: prevFileNo,
      grvName: grvName,
      gender: gender,
      mobileNo: mobileNo,
      emailId: emailId,
      grvAddress: grvAddress,
      resiAddress: resiAddress,
      grvPinCode: grvPinCode,
      // grvRegion: grvRegion,
      // grvDistrict: grvDistrict,
      grvDepName: grvDepName,
      grvCategName: grvCategName,
      // 03 April 2024 - sub categ and next level categ - SKY
      grvSubCategName: grvSubCategName,
      grvSubCateg2Name: grvSubCateg2Name,
      grvSubCateg3Name: grvSubCateg3Name,
      grvSubCateg4Name: grvSubCateg4Name,
      // 03 April 2024 - sub categ and next level categ - SKY

      psga: psga,


      grvDescription: grvDescription,
      div_id: divName,
      dist_id: distName,
      block_id: blockName,
      panchayat_id: panchayatName,
      exData: inputValues,

      // municipality & ward - SKY - 09/01/2025
      municipalityId: municipalityName,
      wardId: wardName,

      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });

    //console.log(c);
    // console.log("psga :: " + psga)
    // encrypting object
    var d = chkV(c);
    // file upload
    let file = document.getElementById("stUploadPhoto1").files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("d", d);
    // ajax call
    var settings = {
      url: "dealingHandForm",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 0,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    };

    // console.log(inputValues);
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j.statusCode == 1) {
        // console.log(j.data);
        alert("Grievance " + j.appId + " submitted successfully.");
        // acknowledgeSlip(c ,j.appId, usrFlag);

        //Naitik Changes for New pdf format at every dashboard on 13/11/2025
        newAcknowledgeSlip(true, j.appId);

        //Naitik Changes End

        // window.location.href = "home";
      } else {
        alert(
          "Something went wrong. Check whether all mandatory fields are filled / Form Bombarding not allowed."
        );
        //window.location.reload();
      }
    });
    //} else {
    //   alert("If Mode of complaint is By Post, then please enter post tracking number.");
    // }
  } else {
    alert("Please fill all the fields");
  }
});



//forward to cpgram 

$(document).on("click", ".cpgramBtn", function () {

  var usrFlag = $('.usrFlag').val();
  var grvRefrecFrom;
  var commRmcNo;
  if (usrFlag == "RMC User" || usrFlag == "Raabita User") {
    // alert(usrFlag)
    grvRefrecFrom = $('#grvRefrecFrom').find(":selected").val();
    commRmcNo = $(".commRmcNo").val();
  } else {
    grvRefrecFrom = "NA";
    commRmcNo = "NA";
  }
  // console.log(grvRefrecFrom)
  // console.log(commRmcNo)
  // Implementing RMC User logic - 16th August 2024 - SKY


  var modeOfComp = $("#moComp").find(":selected").val();
  var commRmcNo = $(".commRmcNo").val();
  var pTrackingNo = $(".pTrackingNo").val();
  var prevFileNo = $(".prevFileNo").val();
  var grvName = $(".grvName").val();
  var gender = $("#gender").find(":selected").val();
  var mobileNo = $(".mobileNo").val();
  var emailId = $(".emailId").val();
  var grvAddress = $(".grvAddress").val();
  var resiAddress = $(".resiAddress").val();
  var grvPinCode = $(".grvPinCode").val();
  var grvRegion = $("#inputRegion1").find(":selected").val();
  var grvDistrict = $("#inputDistrict").find(":selected").val();
  var grvDepName = $("#depName").find(":selected").val();
  var grvCategName = $("#categ").find(":selected").val();
  // 03 April 2024 - sub categ and next level categ - SKY
  var grvSubCategName = $("#subcateg").find(":selected").val();
  var grvSubCateg2Name = $("#subcateg2").find(":selected").val();
  var grvSubCateg3Name = $("#subcateg3").find(":selected").val();
  var grvSubCateg4Name = $("#subcateg4").find(":selected").val();
  var info = $("#addInfo").find(":selected").val();
  // 03 April 2024 - sub categ and next level categ - SKY
  var grvDescription = $("#descrp").val();
  var validation;
  var addInfoDiv = $("#addInfoDiv").is(":visible");
  // if (addInfoDiv) {
  if (usrFlag == "RMC User" && grvRefrecFrom != 0 && commRmcNo != "" && commRmcNo != "0") {
    //  var isValid = false;
    //     $(".moreData").each(function () {
    //       if ($(this).val().trim() === "") {
    //         isValid = false;
    //         //   $(this).addClass("invalid");
    //       } else {
    //         // $(this).removeClass("invalid");
    //         isValid = true;
    //       }
    //     });
    //     console.log(mobileNo+" "+modeOfComp+" "+grvName);
    validation =
      (usrFlag == "RMC User" && grvRefrecFrom != 0 && commRmcNo != "" && commRmcNo != "0") &&
      modeOfComp != 0 &&
      grvName != "" &&
      gender != 0 &&
      grvAddress != "" &&
      grvPinCode != "" &&
      grvDepName != 0 &&
      grvCategName != 0 &&
      grvSubCategName != 0 &&
      grvSubCateg2Name != 0 &&
      grvSubCateg3Name != 0 &&
      grvSubCateg4Name != 0 &&
      grvDescription != "";


  } else {
    console.log(mobileNo + " " + modeOfComp + " " + grvName);
    // validation =mobileNo!="" && modeOfComp != 0 && grvName != "" && (gender != 0 || gender != "") && grvAddress != "" && grvPinCode != "" && grvDepName != 0 && grvCategName != 0 && grvSubCategName != 0 && grvSubCateg2Name != 0 && grvSubCateg3Name != 0 && grvSubCateg4Name != 0 && (grvDescription != "" || grvDescription != null);
    validation = mobileNo != "" && modeOfComp != 0 && grvName != "" && gender != 0 && grvAddress != "" && grvPinCode != "" && grvDepName != 0 && grvCategName != 0 && grvDescription != "";
    // validation =(mobileNo!="0" || mobileNo!="") || modeOfComp != 0 || grvName != "" || (gender != 0 || gender != "") || grvAddress != "" || grvPinCode != "" || grvDepName != 0 || grvCategName != 0 || grvSubCategName != 0 || grvSubCateg2Name != 0 || grvSubCateg3Name != 0 || grvSubCateg4Name != 0 || (grvDescription != "" || grvDescription != null);


  }

  if ($("#pTrackingDiv").is(":visible")) {
    validation = +validation && pTrackingNo != "";
  }

  if (validation) {
    var inputValues = [];
    $(".moreData").each(function () {
      var col = $(this).data("value");
      var val = $(this).val();
      var obj2 = {
        data_col: col,
        value: val,
      };
      inputValues.push(obj2);
    });
    //if (modeOfComp == "By Post" && pTrackingNo != "") {
    var c = JSON.stringify({

      // 16th August 2024 - RMC - SKY
      grvRefrecFrom: grvRefrecFrom,
      commRmcNo: commRmcNo,
      // 16th August 2024 - RMC - SKY


      modeOfComp: modeOfComp,
      pTrackingNo: pTrackingNo,
      prevFileNo: prevFileNo,
      grvName: grvName,
      gender: gender,
      mobileNo: mobileNo,
      emailId: emailId,
      grvAddress: grvAddress,
      grvPinCode: grvPinCode,
      // grvRegion: grvRegion,
      // grvDistrict: grvDistrict,
      grvDepName: grvDepName,
      grvCategName: grvCategName,
      // 03 April 2024 - sub categ and next level categ - SKY
      grvSubCategName: grvSubCategName,
      grvSubCateg2Name: grvSubCateg2Name,
      grvSubCateg3Name: grvSubCateg3Name,
      grvSubCateg4Name: grvSubCateg4Name,
      // 03 April 2024 - sub categ and next level categ - SKY
      grvDescription: grvDescription,
      exData: inputValues,
      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });

    console.log(c);
    // encrypting object
    var d = chkV(c);
    // file upload
    let file = document.getElementById("stUploadPhoto1").files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("d", d);
    // ajax call
    var settings = {
      url: "fwdGriCpgram",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 0,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    };

    // console.log(inputValues);
    $.ajax(settings).done(function (j) {
      // j = setV(j);
      // j = JSON.parse(j);
      if (j.statusCode == 1) {
        console.log(j.data);
        // alert("Grievance " + j.appId + " submitted successfully.");
        //  acknowledgeSlip(c, j.appId, usrFlag);
        // window.location.href = "home";
      } else {
        alert(
          "Something went wrong. Check whether all mandatory fields are filled."
        );
        //window.location.reload();
      }
    });
    //} else {
    //   alert("If Mode of complaint is By Post, then please enter post tracking number.");
    // }
  } else {
    alert("Please fill all the fields");
  }
});






function formatDate(date) {
  var day = String(date.getDate()).padStart(2, "0");
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}

// Prevent HTML Injection - start
function escapeHtml(str) {
  if (typeof str !== 'string' || !str.trim()) {
    return ''; // Return an empty string if invalid input
  }
  var element = $('<div>');
  element.text(str);
  return element.html();
}
// Prevent HTML Injection - end

function acknowledgeSlip(data, gID, usrFlag) {
  var grvData = JSON.parse(data);
  //console.log(grvData)
  var currentDate = new Date();
  var formattedDate = formatDate(currentDate);

  var template;

  // Sanitize dynamic data using escapeHtml()
  var sanitizedGrvName = escapeHtml(grvData.grvName);
  var sanitizedGrvDepName = escapeHtml(grvData.grvDepName);
  var sanitizedGrvRefrecFrom = escapeHtml(grvData.grvRefrecFrom);
  var sanitizedGrvCommRmcNo = escapeHtml(grvData.commRmcNo);


  if (usrFlag == "DH User") {
    template =
      //    '<div class="top">' +
      //    "<p>0194-2483236, 2502910, 2502911 (S) Fax Nos.0194-2501262 (S)</p>" +
      //    "<p>Tele Nos. 0191- 2560265, 2560109, 2560266(J) Fax No.0191-2566182(J)</p>" +
      //    "</div>" +
      '<div id="mainContainer" class="header-top">' +
      "<h2 style='font-weight: bold;'>Union Territory of Jammu and Kashmir</h2>" +
      "<h1 style='font-weight: bold;'>Department of Public Grievances</h1>" +
      //    "<h2 style='font-weight: bold;'>Civil Secretariat, Srinagar/ Jammu</h2>" +
      "<div class='header-line'><p>website: <a href='samadhan.jk.gov.in' target='_blank'>samadhan.jk.gov.in</a></p>  <p>Email : <a href='mailto:jk-grievance@jk.gov.in' target='_blank'>jk-grievance@jk.gov.in</a></p></div>" +
      "</div>" +
      '<div class="content">' +
      "<h3 style='font-weight: bold;'>Subject: Acknowledgement of Grievance Registration - " +
      gID +
      "</h3>" +
      "<div class='para'> " +
      "<p style='margin-bottom: 2.5rem;'>Sir/Madam " +
      sanitizedGrvName +
      ",</p>" +
      "<p style='margin-bottom: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your grievance has been registered on <b>JK Samadhan Portal</b> with Grievance ID <b>" +
      gID +
      "</b> on <b>" +
      formattedDate +
      "</b>. Your grievance has been forwarded to the <b>" +
      sanitizedGrvDepName +
      " Department</b> for redressal.</p>" +
      "<p style='margin-bottom: 2.5rem;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can track the progress of your grievance online by visiting the Jammu and Kashmir Grievance Portal JK Samadhan <b>https://samadhan.jk.gov.in</b> by entering your <b>Grievance ID and Phone No </b>(provided in your application).</p>" +
      "<p style='margin-top: 3rem; margin-bottom: 5rem; text-align: right;'>Sincerely,</p>" +
      "<p style='margin-bottom: 6px; font-weight: 800; text-align: right;'>Department of Public Grievances</p>" +
      "<div class='footer-lines' style='margin-top: 2rem; margin-bottom: 1.5rem;'>" +
      "<p style='margin-bottom: 6px; text-align: right;'>Civil Secretariat, Jammu <br/>Church Lane, Sonwar, Srinagar /</p>" +
      "</div>" +
      //    "<p>Civil Secretariat, Srinagar/ Jammu</p>" +

      "<p class='text-right' style='font-size: 18px; margin-bottom: 4px; line-height: 28px; '>Tele Nos. 0191-2560265, 2560109, 2560266 (Jammu)</p>" +
      "<p class='text-right' style='font-size: 18px; margin: 0px; line-height: 26px;'>0194-2483236, 2502910, 2502911 (Srinagar)</p>" +

      "</div>" +
      "</div>";
  } else if (usrFlag == "RMC User") {
    var template =
      '<div class="pdf-temp">' +
      '<div id="mainContainer" class="header-top">' +
      "<h2 style='font-weight: bold; color: black;'>GOVERNMENT OF JAMMU AND KASHMIR</h2>" +
      "<h2 style='font-weight: bold;'>GENERAL ADMINISTRATION DEPARTMENT</h2>" +
      //    "<h2 style='font-weight: bold;'>Civil Secretariat, Srinagar/ Jammu</h2>" +
      "<div class='header-line' style='flex-direction: column; gap: 0px;'><p style='font-size: 1.8rem; margin: 0;'>(Lieutenant Governor’s Secretariat References Monitoring Cell)</p>" +
      "<p style='font-size: 1.8rem; margin: 0; '>Civil Secretariat,</p>" +
      "<p style='font-size: 1.8rem; margin: 0;'>Jammu / Srinagar</p>" +
      "<p style='font-size: 1.8rem; margin: 0;'>*</p>" +
      "</div>" +
      "</div>" +
      '<div class="content">' +
      "<h3 style='font-weight: bold;'>Subject: Acknowledgement of Grievance Registration - " +
      gID +
      "</h3>" +
      "<div class='para'> " +
      "<p style='margin-bottom: 2.5rem;'><b>Sir/Madam " +
      sanitizedGrvName +
      ",</b></p>" +
      "<p style='margin-bottom: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your grievance/reference received from <b>" + sanitizedGrvRefrecFrom + "</b> vide Communication Number <b>" + sanitizedGrvCommRmcNo + "</b> has been registered/uploaded on the JK Samadhan Portal with <b>" +
      gID +
      "</b> on <b>" +
      formattedDate +
      "</b> and has been forwarded to the <b>" +
      sanitizedGrvDepName +
      " Department</b> for redressal/appropriate action.</p>" +
      "<p style='margin-bottom: 2.5rem;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can track the progress of your grievance / reference online by visiting the Jammu and Kashmir Grievance Portal, JK Samadhan <b>https://samadhan.jk.gov.in/trackApp</b> by entering the <b>" + gID + "</b> as <b>Grievance ID </b>.</p>" +
      "<p style='margin-top: 3rem; margin-bottom: 2rem; text-align: right;'>Sincerely,</p>" +
      //    "<p style='margin-bottom: 6px; font-weight: 800; text-align: right;'>Department of Public Grievances</p>" +
      "<div class='footer-lines' style='margin-top: 2rem; margin-bottom: 1.5rem;'>" +
      "<p style='margin-bottom: 6px; text-align: right;'>LG’s References Monitoring Cell, </p>" +
      "<p style='text-align: right;'>(General Administration Department)</p>" +
      "</div>" +
      "<p style='text-align: left; margin-bottom: 4rem;'>Copy to the Under Secretary, <b>" + sanitizedGrvRefrecFrom + "</b> for information.</p>" +
      //    "<p>Civil Secretariat, Srinagar/ Jammu</p>" +
      "</div>" +
      "</div>" +
      "</div>";
  } else if (usrFlag == "Raabita User") {

    template =
      //    '<div class="top">' +
      //    "<p>0194-2483236, 2502910, 2502911 (S) Fax Nos.0194-2501262 (S)</p>" +
      //    "<p>Tele Nos. 0191- 2560265, 2560109, 2560266(J) Fax No.0191-2566182(J)</p>" +
      //    "</div>" +
      '<div id="mainContainer" class="header-top">' +
      "<h1 style='font-weight: bold;'>Government of Jammu & Kashmir</h2>" +
      "<h1 style='font-weight: bold;'>CHIEF MINISTER'S SECRETARIAT</h1>" +
      "<h1 style='font-weight: bold;'>PUBLIC SERVICES & OUTREACH OFFICE (Raabita)</h2>" +
      "<h1 style='font-weight: bold;'>Srinagar/Jammu</h2>" +
      // "<div class='header-line'><p>website: <a href='samadhan.jk.gov.in' target='_blank'>samadhan.jk.gov.in</a></p>  <p>Email : <a href='mailto:jk-grievance@jk.gov.in' target='_blank'>jk-grievance@jk.gov.in</a></p></div>" +
      "</div>" +
      '<div class="content">' +
      "<h3 style='font-weight: bold;'>Subject: Acknowledgement of Grievance Registration - " +
      gID +
      "</h3>" +
      "<div class='para'> " +
      "<p style='margin-bottom: 1.5rem;'>Sir/Madam " +
      sanitizedGrvName +
      ",</p>" +
      "<p style='margin-bottom: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Thank your for lodging your concern on the <b>CM Raabita Portal.</b> It has been registered under ID <b>" +
      gID +
      "</b> on <b>" +
      formattedDate +
      "</b> and has been forwarded to the <b>" +
      sanitizedGrvDepName +
      " Department</b>for redressal. For updates visit <b>https://samadhan.jk.gov.in</b>.</p>" +
      // "<p style='margin-bottom: 2.5rem;'>For updates visit <b>https://samadhan.jk.gov.in</b>.</p>" +
      // "<p style='margin-top: 3rem; margin-bottom: 5rem; text-align: right;'>Sincerely,</p>" +
      "<p style='margin-bottom: 6px; font-weight: 800; text-align: right;'>Team Raabita</p>" +
      "<div class='footer-lines' style='margin-top: 2rem; margin-bottom: 1.5rem;'>" +
      "<p style='margin-bottom: 6px; text-align: right;'>CHIEF MINISTER'S SECRETARIAT</p>" +
      "</div>" +
      //    "<p>Civil Secretariat, Srinagar/ Jammu</p>" +

      "<p class='text-right' style='font-size: 20px; margin-bottom: 4px; line-height: 30px; '>PUBLIC SERVICES & OUTREACH OFFICE (Raabita)</p>" +
      "<p class='text-right' style='font-size: 20px; margin: 0px; line-height: 30px;'>Email: jkcm-raabita@jk.gov.in</p>" +

      "</div>" +
      "</div>";
  }

  var tempDiv = document.createElement("div");
  tempDiv.id = "mainContainer";
  tempDiv.innerHTML = template;
  document.body.appendChild(tempDiv);

  html2canvas(tempDiv).then((canvas) => {
    var imgData = canvas.toDataURL("image/jpeg", 0.2); // Change to JPEG and set quality to 20%
    var pdf = new jspdf.jsPDF("p", "mm", "a4");
    var imgWidth = 210; // A4 width in mm
    var pageHeight = 297; // A4 height in mm
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save("AcknowledgementSlip.pdf");
    var pdfBlob = pdf.output("blob");
    console.log('Size of generated PDF (before compression):', pdfBlob.size, 'bytes');
    uploadPDF(pdfBlob, gID);
    document.body.removeChild(tempDiv);
  });
}

function uploadPDF(pdfBlob, gID) {
  var formData = new FormData();
  formData.append("file", pdfBlob, "AcknowledgementSlip.pdf");
  formData.append("gID", gID);

  var settings = {
    url: "uploadAckSlipPDF",
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    // timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    window.location.href = "home";
  }).fail(function (jqXHR, textStatus, errorThrown) {
    //console.error("Upload failed:", textStatus, errorThrown);
  });
}


$(document).on("click", ".vHis", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  // window.open("historyGrievance?d=" + d, "_blank");
  // window.location.href = "historyGrievance?d=" + d;
  window.open("historyGrievance?d=" + d, "_blank");
});

// Validations start
$(".pTrackingNo").keypress(function (e) {
  return Validate_post(e);
});

function Validate_post(e) {
  var keyCode = e.keyCode || e.which;

  var lblError = document.getElementById("postTrack");
  lblError.innerHTML = "";

  var regex = /^[A-Za-z0-9]+$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    lblError.innerHTML = "Only Alphabets and Numbers are allowed.";
  }

  return isValid;
}

$(".grvName").keypress(function (e) {
  return Validate_name(e);
});

function Validate_name(e) {
  var keyCode = e.keyCode || e.which;

  var lblError = document.getElementById("gName");
  lblError.innerHTML = "";

  var regex = /^[A-Za-z /d]+$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    lblError.innerHTML = "Only Alphabets allowed.";
  }

  return isValid;
}

$(".mobileNo").on("keyup", function (e) {
  return Validate_mobile(e);
});

function Validate_mobile(e) {
  // var keyCode = e.keyCode || e.which;
  var input = $(".mobileNo");
  var lblError = document.getElementById("mNo");
  lblError.innerHTML = "";

  var regex = /^([6789][0-9]{9})$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(input.val());
  if (!isValid) {
    lblError.innerHTML = "invalid mobile no.";
    $(".dHbtn").attr("disabled", true);
  } else {
    $(".dHbtn").attr("disabled", false);
  }

  return isValid;
}

$(".emailId").keyup(function (e) {
  Validate_email();
});

function Validate_email() {
  var email = $(".emailId");
  var lblError = document.getElementById("emailId");
  lblError.innerHTML = "";
  var expr =
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (!expr.test(email.val())) {
    lblError.innerHTML = "Invalid email address.";
    $(".dHbtn").attr("disabled", true);
  } else {
    $(".dHbtn").attr("disabled", false);
  }
}

$(".grvPinCode").keypress(function (e) {
  return Validate_pincode(e);
});

function Validate_pincode(e) {
  var keyCode = e.keyCode || e.which;

  var lblError = document.getElementById("pnCode");
  lblError.innerHTML = "";

  var regex = /^[0-9]+$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    lblError.innerHTML = "Invalid pincode.";
  }

  return isValid;
}
// Validations end

$(document).on("click", ".vDetails", function (e) {
  $(".descHis").html("");
  $(".descHisDoc").html("");
  $(".descHisDocCitz").html("");
  var c = JSON.stringify({
    radioVal: "JKSAMADHAN",
    gId: e.target.value,
  });
  let d = chkV(c);
  // window.location.href = "grievanceDatail?d=" + d;
  window.open("grievanceDatail?d=" + d, "_blank");

});
var table115;
function getDealingHandList(btnVal) {

  var userFlag = $('#userFlag').val();
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "api_v26?d=" + d,
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
    // console.log(j.data)

    if (j.statusCode != 0 && j.data.length > 0) {
      // format Date to dd MM yyyy hh:mm:ss:ms
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
    }

    $(".btn-customBtn").on("click", function () {
      // console.log($(this).val());
      table115.button("." + $(this).val()).trigger();
    });

    table115 = $("#dealingHandTbl").DataTable({
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
          data: "name",
          defaultContent: "",
          title: "Citizen Name",
        },
        {
          data: "mobile",
          defaultContent: "",
          title: "Citizen Mobile No.",
        },

        //Naitik column addition for RMC users 

        {
          data: "update_by_name",
          defaultContent: "",
          title: "Uploaded By",
        },

        {
          data: "grievancereference",
          defaultContent: "",
          title: "Received From",
        },

        //Naitik column addition for RMC users End 

        {
          data: "createddate",
          defaultContent: "",
          title: "Submitted On",
        },
        {
          data: "key_flag",
          defaultContent: "",
          title: "Classification",
        },
        {
          data: "modeofcomplaint",
          defaultContent: "",
          title: "Mode Of Complaint",
        },
        {
          data: "status",
          defaultContent: "",
          title: "Status",
          render: function (data, type, row, meta) {

            if (type === 'filter' || type === 'sort') {
              return data;
            }
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
              '">Grievance Details</button></li>'
            // '<li class=""><button class="btn btn-sm vHis" title = "History" value = "' +
            // data +
            // '">History</button></li>'


            if (["Pending"].includes(row.status) && ['RMC User', 'DH User'].includes(userFlag)) {
              btn =
                btn +
                '<li class=""><button class="btn btn-sm grevE" value="' +
                data +
                '">Update Grievance</button></li>';
            }

            if (["dnpToOffice", "Pending", "Acknowledged", "Under Process"].includes(row.status) && ['RMC Head', 'Raabita Head'].includes(userFlag)) {
              btn =
                btn +
                '<li class=""><button class="btn btn-sm grevP" value = "' +
                data +
                '">Edit</button></li>';

              //	'<li class=""><button class="btn btn-sm vHis" value = "' +data +'">History</button></li>' ;
              //  btn + '<button class="btn btn-sm btn-warning forward" value = "' + data + '">Forward</button>';
            }
            ;

            return btn + "</ul></div>";
          },
        },
      ],
    });

    // Default Search Input Validation - start
    $('.dataTables_filter input').unbind().keyup(function (e) {
      // console.log("Search input triggered");

      const validPattern = /^[a-zA-Z0-9/ ]*$/; // Allow alphanumeric characters, '/' and space
      let input = $(this).val();

      // Remove any invalid characters from the input (strict pattern for alphanumeric, space, and '/')
      if (!validPattern.test(input)) {
        $(this).val(input.replace(/[^a-zA-Z0-9/ ]/g, '')); // Remove invalid characters
      }

      // After validation, trigger the DataTable search if the input is valid
      if (validPattern.test(input)) {
        var table115 = $('#dealingHandTbl').DataTable();  // Initialize the table
        table115.search(input).draw();  // Trigger search on the table
      }
    });
    // Default Search Input Validation - end
  });
}

$(document).on("click", ".grevP", function (e) {
  let c = e.target.value;
  let d = chkV(c);

  window.location.href = "processGrievance?d=" + d;
});

$(document).on("click", ".grevE", function (e) {
  let c = e.target.value;
  let d = chkV(c);

  window.open("editGrievanceDetails?d=" + d, "_blank");
  // window.location.href = "editGrievanceDetails?d=" + d;
});


//});

// $(document).on("click", ".genReport", function () {
//   var d = chkV($('html').html());
//   console.log(d)
//   var settings = {
//     url: "convert?d" + d,
//     method: "POST",
// };
// $.ajax(settings).done(function () {
//   console.log(j)
//     var blob = new Blob([data], {type: 'application/pdf'});
//     var link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = 'output.pdf';
//     link.click();
// });
// });

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

$("#submitRMCandDHUsers").click(function () {
  var usrType = $("#usrflag").val();
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
      $("#errMsg1").hide();

      if (
        inptRegion == "0" ||
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
            sessionvalue: $('#sessionvalue').val(),
            sessionname: $("#sessionname").val()
          });

          //          console.log(c);

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
            } else if (j.statusCode == "4") {
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
      $("#errMsg").show();
      $("#errMsg1").html(j.msg);
      return false;
    }
  });
});

function getCreatedUsrList(value) {
  // alert(deptName);
  //var divison = $("#selectDepart").find(":selected").val();
  var c = JSON.stringify({
    value: value,
    //department_type: divison,
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
    // console.log(j);
    if (j.statusCode != 0) {
      $("#userListDiv").removeClass("d-none");
      j.data = j.data.map((current) => {
        if (current.created_date != null) {
          current.created_date = format_date(current.created_date);
        }
        return current;
      });

      var columns = [
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
        {
          data: "mobile",
          defaultContent: "",
          title: "Mobile Number",
        },
        {
          data: "email",
          defaultContent: "",
          title: "Email Id",
        },

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
      ];

      if (value == "getuserlist") {
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
              '<li class=""><button class="btn btn-sm shwUptDetails" value="' +
              data +
              '">Account Settings</button></li></ul></div>';

            return btn;
          },
        });
      }

      $(".btn-customBtn1").on("click", function () {
        // console.log($(this).val());
        table116.button("." + $(this).val()).trigger();
      });

      var table116 = $("#SKYReportRMCUsr").DataTable({
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
        columns: columns,
      });




      $("#SKYReportRMCUsr_filter input[type='search']").on("input", function () {
        // alert("jjjds")

        var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
        $(this).val(cleanValue);
        table116.search(cleanValue).draw(); // Update DataTable search
      });
    } else {
      $(".userListDiv").addClass("d-none");
    }
  });
}

// When the toggle switch is clicked - 09/09/2024 - SKY
var globalToggleValue = false;

$('#toggleEmail').on('change', function () {
  if ($(this).is(':checked')) {
    globalToggleValue = true;
    $('#newEmail').removeClass('d-none');
    $('#userEmail').addClass('d-none');
  } else {
    globalToggleValue = false;
    $('#newEmail').addClass('d-none');
    $('#userEmail').removeClass('d-none');
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
  } else if (!isMobile($("#userMobileNo").val()) || $("#userMobileNo").val() == "") {
    alert("Mobile Number is mandatory and please provide a valid mobile number.");
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
        "userFirstName=" + $("#userFirstName").val() +
        "&userMidname=" + $("#userMidname").val() +
        "&userLastName=" + $("#userLastName").val() +
        "&userMobileNo=" + $("#userMobileNo").val() +
        "&transfereePassword=" + $("#usrpwd").val() +
        "&userEmail=" + $("#userEmail").val() +
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
          alert("Details updated successfully! However email id not updated as it already exists!");
          window.location.reload();
        }
        else {
          alert("Something went wrong. Try again later.");
          window.location.reload();
        }
      });
    }

  }
});


// Process & Forward RMC Greivances.
function userList() {
  var settings = {
    "url": "nodalDeptList",
    "method": "POST",
    "timeout": 0,
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j);
    var table160 = $('#forwardDeptMap').DataTable({
      data: j.data,
      destroy: true,
      scrollX: true,
      lengthMenu: [5, 10, 25],
      pageLength: 10,
      responsive: true,
      columns: [
        {
          title: "S. No.",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          title: "Name And Designation",
          data: "nameAndDesig"
        },
        {
          title: "Department",
          data: "department"
        },
        {
          title: "Office",
          data: "office_name"
        },
        {
          title: "User Level",
          data: "usertype_of_assigned_user"
        },
        {
          title: "Email Id",
          data: "username"
        },
        {
          title: "Action",
          data: "username",
          render: function (data, type, row, meta) {
            return '<input type="checkbox" class="checkval" data-row-index="' + meta.row + '" name="chk" value="' + meta.row + meta.settings._iDisplayStart + 1 + '">';
          }
        },

      ]
    });
  });
}

$(document).on("click", ".rmcBtn", function () {
  var products = [];
  var table = $('#forwardDeptMap').DataTable();
  var data = table.rows().nodes();
  var atLeastOneChecked = false;
  $(data).each(function (index, row) {
    var chkBox = $(row).find('input[type="checkbox"][name="chk"]');
    var chkVal = chkBox.prop("checked");
    if (chkVal) {
      atLeastOneChecked = true;
      var username = $(row).find("td:eq(5)").text();
      var product = {
        username: username,
      };
      products.push(product);
    }
  });
  if (!atLeastOneChecked) {
    alert("Select at least one Officer / Department Nodal to whom the application will be forwarded.");
    return false; // Prevent further execution
  }
  console.log(products);
});


$("#greId").on("change", function () {
  var greId = $("#greId").find(":selected").val();
  var grId = JSON.stringify({
    uniqid: greId,
  });
  var dd = chkV(grId);
  var settings = {
    url: "getDataById?d=" + dd,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    console.log(j);

    $("#category").text(j.data[0].category);
    $("#dep").text(j.data[0].department);
    $("#usrName").text(j.data[0].name);
    $("#mobNo").text(j.data[0].mobile);
    $("#emailId").text(j.data[0].email);
    $("#add").text(j.data[0].address);

    if (j.data[0].sub_category !== "" && j.data[0].sub_category !== null && j.data[0].sub_category !== undefined) {
      $('#nextcatone').show();
      $("#subCat").text(j.data[0].sub_category);
    } else {
      $('#nextcatone').hide();
    }
    if (j.data[0].sub_cat_next_level2 !== "" && j.data[0].sub_cat_next_level2 !== null && j.data[0].sub_cat_next_level2 !== undefined) {
      $('#nextcattwo').show();
      $("#nxtlvl2").text(j.data[0].sub_cat_next_level2);
    } else {
      $('#nextcattwo').hide();
    }

    if (j.data[0].sub_cat_next_level3 !== "" && j.data[0].sub_cat_next_level3 !== null && j.data[0].sub_cat_next_level3 !== undefined) {
      $('#nextcatthree').show();
      $("#nxtlvl3").text(j.data[0].sub_cat_next_level3);
    } else {
      $('#nextcatthree').hide();
    }

    if (j.data[0].sub_cat_next_level4 !== "" && j.data[0].sub_cat_next_level4 !== null && j.data[0].sub_cat_next_level4 !== undefined) {
      $('#nextcatfour').show();
      $("#nxtlvl4").text(j.data[0].sub_cat_next_level4);
    } else {
      $('#nextcatfour').hide();
    }
  });
});


$("#submitAppeal").click(function () {
  var greId = $("#greId").find(":selected").val();
  var descrpA = $("#descrpA").val();
  var usrName = $("#usrName").text();
  var mobNo = $("#mobNo").text();
  //	var emailId = $('#emailId').text();
  var add = $("#add").text();
  //		var lat = $('#lat').text();
  //		var long = $('#long').text();
  var cat = $("#category").text();
  var dep = $("#dep").text();
  var subCat = $("#subCat").text();

  if (greId == "0" || descrpA == "" || descrpA == "") {
    alert("All fields except file attachment are mandatory.");
  } else {
    var c = JSON.stringify({
      value: descrpA,
      passw: greId,
      category: cat,
      name: usrName,
      mobile: mobNo,
      address: add,
      department_name: dep,
      sub_category: subCat,
      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });

    var d = chkV(c);
    //var cdd = JSON.stringify(docss1[0])
    let file = document.getElementById("fileUpAppeal").files[0];
    var filenameadd;
    const formData = new FormData();
    if (!file) {
      // alert("Please select a file before uploading."); // Alert the user
      filenameadd = chkV(file)
    } else {
      filenameadd = chkV(file.name)
    }
    formData.append("file", filenameadd); //2007
    formData.append("d", d);
    var settings = {
      url: "appeal",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j.statusCode == "1") {
        //console.log(j.data);
        alert("Appeal submitted successfully.");
        window.location.href = "home";
      } else if (j.statusCode == "2") {
        alert("Malicious file detected");
        window.location.reload();
      }
      // cmt_24
      else if (j.statusCode == "4") {
        var msg = j.statusName;
        alert(msg);
        window.location.reload();
      }
      else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }
});

$(document).on("click", "#checStatus", function (e) {

  $('#griStatus').modal('show');

})


// Input Validation - start
$('.pTrackingNo').on('input', function () {
  const validPattern = /^[a-zA-Z0-9/-]*$/; // Alphanumeric and '/' pattern
  let input = $(this).val();

  // Enforce the maximum length of 50 characters
  if (input.length > 30) {
    input = input.substring(0, 30); // Trim to 50 characters
    $(this).val(input);
    $('#pTrackingNoError').show();
  } else {
    $('#pTrackingNoError').hide();
  }

  // Remove any invalid characters from the input
  if (!validPattern.test(input)) {
    $(this).val(input.replace(/[^a-zA-Z0-9/-]/g, ''));
  }
});

$('.prevFileNo').on('input', function () {
  const validPattern = /^[a-zA-Z0-9/-]*$/; // Alphanumeric and '/' pattern
  let input = $(this).val();

  // Enforce the maximum length of 50 characters
  if (input.length > 30) {
    input = input.substring(0, 30); // Trim to 50 characters
    $(this).val(input);
    $('#prevFileNoError').show();
  } else {
    $('#prevFileNoError').hide();
  }

  // Remove any invalid characters from the input
  if (!validPattern.test(input)) {
    $(this).val(input.replace(/[^a-zA-Z0-9/-]/g, ''));
  }
});

$('.commRmcNo').on('input', function () {
  const validPattern = /^[a-zA-Z0-9/().,\s-]*$/; // Allow alphanumeric, '/', '()', spaces, and '-'
  let input = $(this).val();

  // Enforce the maximum length of 30 characters
  if (input.length > 30) {
    input = input.substring(0, 30); // Trim to 30 characters
    $(this).val(input);
    $('#commRmcNoError').show();
  } else {
    $('#commRmcNoError').hide();
  }

  // Remove invalid characters
  const sanitizedInput = input.replace(/[^a-zA-Z0-9/().,\s-]/g, '');
  if (input !== sanitizedInput) {
    $(this).val(sanitizedInput); // Set the sanitized value
  }
});


$('.grvName').on('input', function () {
  let input = $(this).val();
  // Enforce the maximum length of 50 characters
  if (input.length > 50) {
    input = input.substring(0, 50); // Trim to 50 characters
    $(this).val(input);
    $('#grvNameError').show();
  } else {
    $('#grvNameError').hide();
  }
});

$('.grvAddress').on('input', function () {
  const validPattern = /^[a-zA-Z0-9/().,\s-]*$/; // Alphanumeric and '/' pattern
  let input = $(this).val();

  // Enforce the maximum length of 50 characters
  if (input.length > 50) {
    input = input.substring(0, 50); // Trim to 50 characters
    $(this).val(input);
    $('#grvAddressError').show();
  } else {
    $('#grvAddressError').hide();
  }

  // Remove any invalid characters from the input
  if (!validPattern.test(input)) {
    $(this).val(input.replace(/[^a-zA-Z0-9/().,\s-]/g, ''));
  }
});

$('.mobileNo').on('input', function () {
  const validPattern = /^[a-zA-Z0-9]*$/; // Alphanumeric and '/' pattern
  let input = $(this).val();

  // Enforce the maximum length of 50 characters
  if (input.length > 10) {
    input = input.substring(0, 10); // Trim to 50 characters
    $(this).val(input);
  }

  // Remove any invalid characters from the input
  if (!validPattern.test(input)) {
    $(this).val(input.replace(/[^a-zA-Z0-9]/g, ''));
  }
});
// Input Validation - end



$('#griId').on('input', function () {
  const validPattern = /^[a-zA-Z0-9/]*$/; // Alphanumeric and '/' pattern
  let input = $(this).val();

  // Enforce the maximum length of 50 characters
  if (input.length > 30) {
    input = input.substring(0, 30); // Trim to 50 characters
    $(this).val(input);
  }

  // Remove any invalid characters from the input
  if (!validPattern.test(input)) {
    $(this).val(input.replace(/[^a-zA-Z0-9/]/g, ''));
    //$('#griIdError').show();
  } else {
    $('#griIdError').hide();
  }
});



$(document).on("click", "#chSt", function (e) {

  var id = $('#griId').val();

  if (id == "") {
    alert("Please enter grievance Id")
  } else {
    var c = JSON.stringify({
      radioVal: "JKSAMADHAN",
      gId: id,
    });
    let d = chkV(c);
    window.open("grievanceDatail?d=" + d, "_blank");
  }
})


// toggle Citizen Email functionality
$('#toggleCitizenEmail').change(function () {
  var emailInput = $('.emailId');
  var lblError = $('#emailId'); // Get the error label

  if ($(this).is(':checked')) {
    emailInput.prop('disabled', false); // Enable the input field
  } else {
    // If unchecked, clear input and disable it
    emailInput.val(''); // Clear the input field
    emailInput.prop('disabled', true); // Disable the input field
    lblError.text(''); // Clear the error message
    $(".dHbtn").attr("disabled", false); // Disable the button
  }
});


//Naitik changes for tiles Click 08/05/2026


$(".card-box").on("click", function () {
  if (!table115) return;

  var statusColIndex = 11;

  if (this.innerHTML.includes("Pending with Department")) {
    table115.column(statusColIndex).search("Pending|Acknowledged|Under Process", true, false).draw();
  } else if (this.innerHTML.includes("Does not Pertain")) {
    table115.column(statusColIndex).search("^dnpToOffice$", true, false).draw();
  } else if (this.innerHTML.includes("Forwarded")) {
    table115.column(statusColIndex).search("^Forwarded$", true, false).draw();
  } else if (this.innerHTML.includes("Resolved")) {
    table115.column(statusColIndex).search("^Resolved$", true, false).draw();
  } else if (this.innerHTML.includes("Appealed")) {
    table115.column(statusColIndex).search("^Appealed$", true, false).draw();
  } else if (this.innerHTML.includes("Rejected")) {
    table115.column(statusColIndex).search("^Rejected$", true, false).draw();
  } else {
    table115.column(statusColIndex).search("", true, false).draw();
  }
});

//Naitik changes for tiles Click 08/05/2026 End

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

function previewDetailsForEdit() {
  const selectedValue = $("input[name='umrb']:checked").val(); // get selected radio value
  if (selectedValue === 'Municipality') {
    $('.umrb1').removeClass('d-none'); // show the Municipality section
  } else {
    $('.umrb1').addClass('d-none'); // hide it otherwise
  }


  if (selectedValue === 'Block') {
    $('.umrb2').removeClass('d-none'); // show the Block section
  } else {
    $('.umrb2').addClass('d-none'); // hide it otherwise
  }


  //psg toggle
  const psgaselectedValue = $("input[name='psga']:checked").val();
  // console.log("Selected PSGA value:", psgaselectedValue);


  // Get the division ID from hidden input
  var divisionId = $('#divID').val();



  // Handle select change event
  $('#divName').on('change', function () {
    var selectedValue = $(this).val();
    var selectedText = $(this).find('option:selected').text();

    console.log('Selected Value:', selectedValue);
    console.log('Selected Text:', selectedText);

    // Update hidden input with selected value
    $('#divID').val(selectedValue);
  });

}

$(document).on("click", ".editGrievanceBtn", function () {

  //debugger;
  // Implementing RMC User logic - 16th August 2024 - SKY
  var usrFlag = $('.usrFlag').val();
  // console.log(usrFlag)
  var grvRefrecFrom;
  var commRmcNo;

  var umrb = $('input[name="umrb"]:checked').val() || "";

  var divName = $('#divName').find(":selected").val();
  var distName = $('#distName').find(":selected").val();
  var blockName = $('#blockName').find(":selected").val();
  var panchayatName = $('#panchayatName').find(":selected").val();
  var psga = $('input[name="psga"]:checked').val();
  var municipalityName = $('#municipalityName').find(":selected").val();
  var wardName = $('#wardName').find(":selected").val();
  var grievanceid = $('.spanDetails').text();

  if (usrFlag == "RMC User") {
    grvRefrecFrom = $('#grvRefrecFrom').find(":selected").val();
    commRmcNo = $(".commRmcNo").val();
    // psga = "No";
  }

  else if (usrFlag == "Raabita User") {
    grvRefrecFrom = "NA";
    commRmcNo = $(".commRmcNo").val();
    // divName = $('#divName').find(":selected").val();
    // distName = $('#distName').find(":selected").val();
    // blockName = $('#blockName').find(":selected").val();
    // panchayatName = $('#panchayatName').find(":selected").val();
    // psga = $('input[name="psga"]:checked').val();

    // municipalityName = $('#municipalityName').find(":selected").val();
    // wardName = $('#wardName').find(":selected").val();


  }


  else {
    grvRefrecFrom = "NA";
    commRmcNo = "NA";
    // psga = "No";
  }
  //  console.log(divName+"  "+distName+"  "+blockName+"  "+panchayatName);
  // console.log(commRmcNo)
  // Implementing RMC User logic - 16th August 2024 - SKY


  var modeOfComp = $("#moComp").find(":selected").val();
  var grvRefrecFrom = $("#grvRefrecFrom").find(":selected").val();
  var commRmcNo = $(".commRmcNo").val();
  var pTrackingNo = $(".pTrackingNo").val();
  var prevFileNo = $(".prevFileNo").val();
  var grvName = $(".grvName").val();
  var gender = $("#gender").find(":selected").val();
  var mobileNo = $(".mobileNo").val();
  var emailId = $(".emailId").val();
  var grvAddress = $(".grvAddress").val();
  var resiAddress = $(".resiAddress").val();
  var grvPinCode = $(".grvPinCode").val();
  // var grvRegion = $("#inputRegion1").find(":selected").val();
  // var grvDistrict = $("#inputDistrict").find(":selected").val();
  var grvDepName = $("#depName").find(":selected").val();
  var grvCategName = $("#categ").find(":selected").val();
  // 03 April 2024 - sub categ and next level categ - SKY
  var grvSubCategName = $("#subcateg").find(":selected").val();
  var grvSubCateg2Name = $("#subcateg2").find(":selected").val();
  var grvSubCateg3Name = $("#subcateg3").find(":selected").val();
  var grvSubCateg4Name = $("#subcateg4").find(":selected").val();
  var info = $("#addInfo").find(":selected").val();
  // 03 April 2024 - sub categ and next level categ - SKY
  var grvDescription = $("#descrp").val();
  var validation;
  var addInfoDiv = $("#addInfoDiv").is(":visible");

  // console.log(`grvRefrecFrom: ${grvRefrecFrom}, commRmcNo: ${commRmcNo}, modeOfComp: ${modeOfComp}, grvName: ${grvName}, gender: ${gender}, grvAddress: ${grvAddress}, grvPinCode: ${grvPinCode}, grvDepName: ${grvDepName}, grvCategName: ${grvCategName}, grvSubCategName: ${grvSubCategName}, grvDescription: ${grvDescription}, grvSubCateg2Name: ${grvSubCateg2Name}, grvSubCateg3Name: ${grvSubCateg3Name}, grvSubCateg4Name: ${grvSubCateg4Name}`);

  if (usrFlag == "RMC User") {
    validation =
      grvRefrecFrom != "0" &&
      commRmcNo != "" &&
      grvRefrecFrom != "0" &&
      modeOfComp != "0" &&
      grvName != "" &&
      gender != "0" &&
      grvAddress != "" &&
      resiAddress != "" &&
      grvPinCode != "" &&
      grvDepName != "0" &&
      grvCategName != "0" &&
      // grvSubCategName != 0 &&
      grvDescription != "" &&
      divName != "0" &&
      distName != "0" &&
      psga != undefined &&
      (umrb === 'Municipality' && municipalityName != "0") || (umrb === 'Block' && blockName != "0")
  } else if (usrFlag == "Raabita User") {

    validation =
      grvRefrecFrom != "0" &&
      commRmcNo != "" &&
      modeOfComp != "0" &&
      grvName != "" &&
      gender != "0" &&
      grvAddress != "" &&
      grvPinCode != "" &&
      grvDepName != "0" &&
      grvCategName != "0" &&
      // grvSubCategName != 0 &&
      grvDescription != "" &&
      divName != "0" &&
      distName != "0" &&
      // blockName!=0 &&
      // panchayatName!=0 &&
      psga != undefined &&
      (umrb === 'Municipality' && municipalityName != "0") || (umrb === 'Block' && blockName != "0")


  } else {
    //console.log(mobileNo+" "+modeOfComp+" "+grvName);
    validation = mobileNo != "" &&
      modeOfComp != "0" &&
      grvName.isem != "" &&
      gender != "0" &&
      grvAddress != "" &&
      resiAddress != "" &&
      grvPinCode != "" &&
      grvDepName != "0" &&
      grvCategName != "0" &&
      grvDescription != "" &&
      divName != "0" &&
      distName != "0" &&
      psga != undefined &&
      (umrb === 'Municipality' && municipalityName != "0") || (umrb === 'Block' && blockName != "0");
  }

  if ($("#pTrackingDiv").is(":visible")) {
    validation = +validation && pTrackingNo != "";
  }

  if (validation) {
    $(".dHbtn").attr("disabled", true);
    var inputValues = [];
    $(".moreData").each(function () {
      var col = $(this).data("value");
      var val = $(this).val();
      var obj2 = {
        data_col: col,
        value: val,
      };
      inputValues.push(obj2);
    });
    //if (modeOfComp == "By Post" && pTrackingNo != "") {
    var c = JSON.stringify({

      // 16th August 2024 - RMC - SKY
      grvRefrecFrom: grvRefrecFrom,
      commRmcNo: commRmcNo,
      // 16th August 2024 - RMC - SKY
      modeOfComp: modeOfComp,
      pTrackingNo: pTrackingNo,
      prevFileNo: prevFileNo,
      grvName: grvName,
      gender: gender,
      mobileNo: mobileNo,
      emailId: emailId,
      grvAddress: grvAddress,
      resiAddress: resiAddress,
      grvPinCode: grvPinCode,
      // grvRegion: grvRegion,
      // grvDistrict: grvDistrict,
      grvDepName: grvDepName,
      grvCategName: grvCategName,
      // 03 April 2024 - sub categ and next level categ - SKY
      grvSubCategName: grvSubCategName,
      grvSubCateg2Name: grvSubCateg2Name,
      grvSubCateg3Name: grvSubCateg3Name,
      grvSubCateg4Name: grvSubCateg4Name,
      // 03 April 2024 - sub categ and next level categ - SKY

      psga: psga,


      grvDescription: grvDescription,
      div_id: divName,
      dist_id: distName,
      block_id: blockName,
      panchayat_id: panchayatName,
      exData: inputValues,

      // municipality & ward - SKY - 09/01/2025
      municipalityId: municipalityName,
      wardId: wardName,
      gid: grievanceid,

      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });

    // console.log("psga :: " + psga)
    // encrypting object
    var d = chkV(c);

    // file upload functionality starts

    let file = document.getElementById("stUploadPhoto1").files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("d", d);
    // ajax call
    var settings = {
      url: "updateGrievanceDetails",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 0,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    };


    //file Upload functionality Ends here

    // console.log(inputValues);
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      //  console.log(j)
      if (j.statusCode == 1) {
        // console.log(j.data);
        alert("Grievance " + j.appId + " updated successfully.");
        //acknowledgeSlip(c, j.appId, usrFlag);
        window.location.href = "home";
      } else if (j.statusCode == 2) {
        alert(
          "Form Bombarding not allowed."
        );
      } else {
        alert(
          "Something went wrong. Check whether all mandatory fields are filled / Form Bombarding not allowed."
        );
        //window.location.reload();
      }
    });
    //} else {
    //   alert("If Mode of complaint is By Post, then please enter post tracking number.");
    // }
  } else {
    alert("Please fill all the fields");
  }
});


//Naitik Changes on clarification function on 10/09/2025

// Immediately hide if user already sent clarification
if (localStorage.getItem("clarificationSent") === "true") {
  document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("clarificationSection");
    if (section) section.style.display = "none";
  });
}

$("#userClarificationBtn").on("click", function () {
  const message = $("#userClarificationMessage").val();
  const gId = this.value;

  if (!message || message.trim().length === 0) {
    alert("Please enter your message.");
    return;
  }
  if (!gId || gId.trim().length === 0) {
    alert("Unable to find Application ID.");
    return;
  }

  const confirmSend = confirm("Are you sure to ask for a Clarification?");
  if (!confirmSend) return;

  const data = { message: message, gId: gId };
  let d = chkV(JSON.stringify(data));

  let fileInput = document.getElementById("userClarificationMessageFile");
  let formData = new FormData();
  formData.append("d", d);
  if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  }

  let settings = {
    url: "askClarification",
    method: "POST",
    data: formData,
    timeout: 0,
    processData: false,
    contentType: false,
  };

  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    if (j.statusCode != 0) {
      alert("Clarification sent successfully");


      $("#clarificationSection").hide();


      localStorage.setItem("clarificationSent", "true");


      $("#userClarificationMessage").val("");
      $("#userClarificationMessageFile").val("");


      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (j.hasOwnProperty("message")) {
      alert(j.message);
    }
  });
});

//Naitik Changes on Clarification end on 10/10/2025





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




//Naitik Changes Start 30/01/2026

$(document).on('click', '.grievancepdf', function () {
  var grievanceId = $(this).attr('data-grievance-id');

  $.ajax({
    url: cp + "/dealingHand/downloadPdfHistory",
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
