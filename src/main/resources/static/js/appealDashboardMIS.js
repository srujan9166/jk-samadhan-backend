
//  let context_path = $("#context_path").val();
let btnVal = '';

if (typeof window.Listen === "undefined") {

  // let context_path1 = $("#context_path").val();

  window.Listen = (doc) => {
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
}

let context_path1 = $("#context_path").val();

function sessionFunc() {

  var settings = {
    url: context_path1 + "/sessionvalue",
    method: "POST",
    data: { "sessionname": $('#sessionname').val(), },
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    $('.sessionvalue').val(j);
  });
}



window.Listen(document).on("click", ".closeLogout", function (e) {
  this.closest("form").submit();
});


let selectedStatus = '';
let userRole = '';
$(function () {
  sessionFunc();
  userRole = $('#usrType').val();
  appealDashboard();

  // $(document).on("click", ".vHis2", function (e) {
  //   let c = e.target.value;
  //   let obj = {
  //     "gId": c,
  //     "radioVal": "JKSAMADHAN",
  //   }
  //   let d = chkV(JSON.stringify(obj));
  //   window.open("grievanceDatail?d=" + d, "_blank");
  // });

  $(document).on("click", ".vHis2", function (e) {
    let c = e.target.value;
    let obj = {
      "gId": c,
      "radioVal": "JKSAMADHAN",
    }
    let d = chkV(JSON.stringify(obj));
    // sendGrievanceId(this.value);
    window.open(cp + "/appellant/grievanceAppealDatail?d=" + d, "_blank");
  });

  $(document).on("click", ".fwdAppl", function () {

    console.log(this.value)
    sendGrievanceId(this.value)
  })

  $(document).on("click", ".viewRmk", function () {
    viewRemarkId(this.value);
  });


  // $(".procesApp").click(function (e) {
  //   //console.log(e.target.value)
  //   var val = e.target.value;

  //   if (val == "Rejected") {
  //     let remarksDetailsId = document.getElementById("remarksDetailsId").value;
  //     var appealId = $("#appD").text()

  //     if (remarksDetailsId != "") {
  //       acceptAction(val, remarksDetailsId, appealId)
  //     } else {
  //       alert("Please add remark")
  //     }

  //   } else {
  //     sendRemarks();
  //   }

  // })

  //Naitik Changes on popup 09/10/2025

  $(".procesApp").click(function (e) {
    var val = e.target.value;
    btnVal = val;
    let remarksDetailsId = document.getElementById("remarksDetailsId").value;

    if (remarksDetailsId != "") {
      if (!confirm("Are you sure that you want to " + btnVal.replace("sendRemark", "send Remark") + "?")) {
        return;
      }

      $(".procesApp[value='Rejected'],.procesApp[value='Remark Added'], .procesApp[value='sendRemark']").prop("disabled", true).css("opacity", "0.65");

      sendRemarks();
    } else {
      alert("Please add remark");
    }
  });

  //Naitik Changes End on popup 09/10/2025



  $("#addRem").click(function () {

    addRemarkAppeal()
  })

  $(".accApp").click(function () {
    let remarksDetailsId = document.getElementById("remarksDetailsId2").value;
    var appealId = $("#appD").text()
    acceptAction(this.value, remarksDetailsId, appealId)
  })

  $("#remarksDetailsId , #remarksDetailsId2").keypress(function (e) {
    //console.log($(this).val())
    return validTextArea(e);
  });




})

let lastRequest = {};
var table;
function appealDashboard() {


  const columns = [
    {

      render: function (data, type, row, meta) {
        return meta.settings._iDisplayStart + meta.row + 1;
      },
      title: "S.No."
    },

    {
      data: "department",
      title: "Department"
    },
    {
      data: "officeName",
      title: "Office Name",

    },
    {
      data: "grievanceId",
      title: "Grievance Id"
    },
    {
      data: "appealId",
      title: "Appeal Id"
    },
    {
      data: "dateAndTimeOfAction",
      title: "date Of Action",

    },

    {
      data: "actionTaken",
      title: "Action Taken",

    },

    {
      data: "actionTakenBy",
      title: "Action Taken By",
      render: function (data, type, row, meta) {
        if (row.status == 'Appealed') {
          return "";
        }
        return data;
      }

    },

    {
      data: "griforwarded",
      title: "Grievance Forwarded To",
      render: function (data, type, row, meta) {
        if (row.status == 'Appealed') {
          return "";
        }
        return data;
      }

    },

    {
      data: "remarks",
      title: "Remark",

    },

    {
      data: "status",
      title: "Status",

    },


    {
      data: "grievanceId",
      title: "Action",
      render: function (data, type, row, meta) {

        var btn =
          '<div class="dropdown">' +
          '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
          '<i class="bi bi-three-dots"></i>' +
          "</button>" +
          '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
          '<li class=""><button class="btn btn-sm vHis2" value = "' + data + '">Grievance Details</button></li>';

        // if (userRole == 'ROLE_Appellate') {
        //   // if (row.status == "Appealed") {
        //   //   btn =
        //   //     btn +
        //   //     '<li class=""><button class="btn btn-sm fwdAppl" value = "' +
        //   //     data +
        //   //     '">Forward</button></li>';
        //   // }

        //   if (row.status == "Remark Recieved") {
        //     btn =
        //       btn +
        //       '<li class=""><button class="btn btn-sm viewRmk" value = "' +
        //       data +
        //       '">Process</button></li>';
        //   }
        // }

        return btn + "</ul></div>";
      }

    },
  ];

  table = new DataTable("#appealTable", {
    serverSide: true,
    processing: true,
    destroy: true,
    scrollX: true,
    ajax: {
      url: "appealDashboardData",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: function (d) {
        // console.log(d)

        let sortField = null;
        let sortDirection = null;
        if (d.order && d.order.length > 0) {
          const sortColumnIndex = d.order[0].column;
          sortDirection = d.order[0].dir;
          sortField = d.columns[sortColumnIndex].data;
        }
        const content = {
          draw: d.draw,
          page: d.start / d.length,
          size: d.length,
          search: d.search.value,
          status: selectedStatus,
          sortField: sortField,
          sortDirection: sortDirection,
          export: false

        }
        //  console.log(content)
        lastRequest = { ...content, export: true };
        return chkV(JSON.stringify(content));
      },
      dataFilter: function (data) {
        data = setV(data);
        data = JSON.parse(data);
        //   console.log(data)
        // const parsed = JSON.parse(data);
        // const decrypted = JSON.parse(setV(parsed.result)); // decrypt + parse JSON
        // console.log("Decrypted Response for DataTables:", decrypted);
        // dataForDownload = decrypted.data;
        // ✅ Return the full JSON string (draw, recordsTotal, etc.)
        return JSON.stringify(data);
      }
    },
    columns: columns,
    // columnDefs: [{ className: "text-center", targets: "_all" }],
    rowCallback: function (row, data) { },
    order: [[5, 'asc']],
    lengthMenu: [2, 10, 50, 100],
    pageLength: 10,
  });


  $("#appealTable_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table.search(cleanValue).draw(); // Update DataTable search
  });


  $(document).on("click", ".filter-status", function () {
    selectedStatus = $(this).data('status');
    //  console.log(selectedStatus)
    table.ajax.reload(); // Reload with new filter
  });
}


$(".btn-customBtn").on("click", function () {

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
    url: "appealDashboardData",
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




function sendRemarks() {
  let remarksDetailsId = document.getElementById("remarksDetailsId").value;
  let appealcheckbox = document.getElementById("appealcheckbox");
  let gId = document.getElementById("gId").innerHTML;

  //  alert(btnVal+"  -- button value1 "+gId+"  -- gId");


  if (remarksDetailsId == "") {
    alert("Please add remark to proceed further");
    return;
  }

  if (btnVal === 'sendRemark' || btnVal === 'clarification') {
    if (!appealcheckbox || !appealcheckbox.checked) {
      alert("Please tick the checkbox to proceed further");
      return;
    }
  }

  var c = JSON.stringify({
    remarks: remarksDetailsId,
    grevId: gId,
    sessionvalue: $('#sessionvalue').val(),
    sessionname: $("#sessionname").val(),
    btnVal: btnVal
  });

  //alert(c+"  -- json value");
  // console.log(c)
  let d = chkV(c);
  let file = document.getElementById("remarkDocument").files[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("d", d);
  var settings = {
    url: context_path1 + "/appellant/sendRemark",
    method: "POST",
    timeout: 0,
    processData: false,
    contentType: false,
    data: formData,
  };
  //  alert("Before ajax call");

  $.ajax(settings).done(function (j) {
    // j = setV(j);

    //alert(j);

    //console.log(j)
    if (j == "Success") {
      if (btnVal === 'Remark Added') {
        alert("Reply Sent Successfully");
        window.location.href = "home";
      } else if (btnVal === 'Resolved' || btnVal == 'Rejected') {
        alert("Appeal " + btnVal)
        window.location.href = context_path1 + "/appellant/appealDashboard";
      } else {
        alert("Appeal Forwarded Successfully");
        window.location.href = context_path1 + "/appellant/appealDashboard";
      }
    } else if (j == "2") {
      alert("Malicious File Detected");
      // window.location.href = "appealDashboard";
    } else if (j == "3") {
      alert("Special characters not allowed");
      // window.location.href = "appealDashboard";
    } else if (j == "0") {
      alert("Form bombarding not allowed");

    }

  });
}


$("#remarkDocument").on("change", function () {
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


function validTextArea(e) {
  var keyCode = e.keyCode || e.which;
  var regex = /^[A-Za-z0-9._@\-\s.,\/()\:;]*$/;


  //var regex = /^[A-Za-z0-9._@-\s]*$/;

  //Validate TextBox value against the Regex.
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}


//Naitik changes Start 30/01/2026

$(document).on('click', '.grievancepdfAppeal', function () {
  var grievanceId = $(this).attr('data-grievance-id');

  $.ajax({
    url: cp + "/appellant/downloadPdfHistory",
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
//Naitik changes End 30/01/2026
