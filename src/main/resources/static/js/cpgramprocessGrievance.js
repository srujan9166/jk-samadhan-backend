


var selectedValue21 = '';
var dropdownValue21 = '';

$(document).ready(function () {
  sessionFunc();
})

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

$(".btn-customBtn").on("click", function () {
  // console.log($(this).val());
  table113.button("." + $(this).val()).trigger();
});

var table113 = $('#cpgramUserTable').DataTable({
  //  data: j,
  destroy: true,
  lengthMenu: [5, 10, 25],
  pageLength: 10,
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
})



$("#decc").keypress(function (e) {
  //console.log($(this).val())
  return validTextArea(e);
});

function validTextArea(e) {
  var keyCode = e.keyCode || e.which;
  var regex = /^[A-Za-z0-9,._\-/\s]+$/;
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}

$(document).on("click", ".procGrev", function () {
  // get value(status) of a selected radio button
  let btnVal = $(this).text();
  let selectedValue = $('input[name="actionCheckBox"]:checked').val();
  // alert(selectedValue)


  var dropdownValue = (selectedValue == selectedValue21) ? dropdownValue21 : "NA";

  // console.log(dropdownValue)

  if (selectedValue == null || selectedValue == "" || $(".stRemarks").val().trim() == "" || $(".stRemarks").val().trim() == null) {
    alert("Action on Grievance and Remarks are mandatory fields. Please fill them and try again.");
  } else {
    // storing values from process-grievance having className's
    var gervId = $(".gGrevId").text();
    var status = selectedValue;
    var remarks = $(".stRemarks").val();
    var dateTime = $(".stDateTime").val();

    //var uploadPhoto = $(".stUploadPhoto").val();
    //   console.log(status : ` + status + ` remarks : ` + remarks + ` dateTime : ` + dateTime + ` uploadPhoto : + uploadPhoto)

    if (!status == "") {
      var userType = $('.usrT').val();

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

    // encrypting object
    var d = chkV(c);
    // file upload
    let file = document.getElementById("stUploadPhoto1").files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("d", d);


    console.log(formData)
    // ajax call
    var settings = {
      //url: "grievanceForm?d=" + d,
      url: "cpgramGrievanceForm",
      method: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 0,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j == 1) {
        //console.log(j.data);
        alert("Grievance processed successfully.");
       window.location.href = "cpgramDashboard";
      } else if (j == "2") {
        alert("Malicious file detected");
        window.location.reload();
      } else if (j == "3") {
        alert("Form bombarding not allowed.");
        window.location.reload();
      }else {
        alert("Something went wrong");
        window.location.reload();
      }
    });
  }

});

$('#stUploadPhoto1').on('change', function () {
  //docss=[];
  //fileValidation()

  var id = $(this).attr("id")
  var fff = fileValidation(id);
  if (fff != false) {
    var t = checkMaliciousFile(id);
    t.then(function (success) {
      if (success == true) {
        return true;

        //fileValidation(id);
      } else {
        $('#' + id).val("");
        alert("Malicious File Detected")
      }
    })

  }
})

function checkMaliciousFile(id) {

  var file = document.getElementById(id).files[0];
  var formData = new FormData();
  formData.append('d', file);
  //    formData.append('file', cdd);

  return new Promise(function (resolve) {

    var settings = {
      "url": "checkMeliciousFile",
      "method": "POST",
      //	"data": {d:c,file:cdd},
      "data": formData,
      "contentType": false,
      "processData": false,
      //"timeout": 0,
    };

    $.ajax(settings).done(function (j) {
      //j = setV(j);
      //j = JSON.parse(j);
      console.log(j)
      if (j == '1') {
        resolve(true, j);

      } else {
        resolve(false, j);

      }
    })

  });
}


function fileValidation(id) {

  const fi = document.getElementById(id);
  var filePath = fi.value;
  var filename = filePath.replace(/^.*[\\\/]/, '');
  // var allowedExtensions = /(\.png|\.PNG|\.jpg|\.JPG|\.jpeg|\.JPEG|\.PDF|\.pdf)$/i;
  var allowedExtensions = /(\.PDF|\.pdf)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert('Please upload PDF file only');
    fi.value = '';
    return false;
  }
  if (fi.files.length > 0) {
    //  for (const i = 0; i <= fi.files.length - 1; i++) {

    const fsize = fi.files.item(0).size;
    const file = Math.round((fsize / 1024));
    // The size of the file.
    if (file >= 2048) {
      alert("File size should be less than 2 MB");
      $("#" + id).val('');
      return false;
    }

  }
}


$('#doccss').click(function (e) {
  //alert(e.target.value)
  //var path=$('#doccss').attr('val');
  var path = e.target.value;
  window.location.href = 'download1?fileName=' + encodeURIComponent(path)
  // $("#doccss").attr("href", 'download1?fileName=' + encodeURIComponent(path));
})