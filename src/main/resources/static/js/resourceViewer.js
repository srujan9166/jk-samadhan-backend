$(document).ready(function () {

  const $toastEl = $('#loginToast');
  if ($toastEl.length) {
    const toast = new bootstrap.Toast($toastEl[0], {
      delay: 5000, // Show for 5 seconds
      autohide: true
    });
    toast.show();
  }

  $(document)
    .ajaxStart(function () {
      $("#loader").show();
    })
    .ajaxStop(function () {
      $("#loader").hide();
    });

  const originalAlert = window.alert;
  window.alert = function (message) {
    if (message && message.toString() === document.domain) {
      return;
    }
    originalAlert(message);
  };

  jQuery.prehtml = function () { };
  if (window.location.href.indexOf("/deptMapping") != -1) {
    sessionvalue();
  }
});
$("#videoViewer").on("hidden.bs.modal", function () {
  var x = document.getElementById("resVid");
  x.pause();
});

$(document).on("click", ".vidDropdown .dropdown-item", function (e) {
  e.preventDefault();
  var videoFileName = $(this).closest("li").data("value");
  console.log("contentViewer?p=" + videoFileName + "&n=" + videoFileName);
  var url = "contentViewer?p=" + chkA(videoFileName) + "&n=" + videoFileName;
  console.log(url);
  $("#videoSource").attr("src", url);
  $("#resVid")[0].load();
});

$(document).on("click", ".pdfDropdown .dropdown-item", function (e) {
  e.preventDefault();
  var pdfFileName = $(this).closest("li").data("value");
  var url = "contentViewer?p=" + chkA(pdfFileName) + "&n=" + pdfFileName;
  window.open(url, "_blank");
});

function sessionvalue() {
  $.ajax({
    url: "sessionvalue",
    method: "GET",
    data: { sessionname: sessionname },
    contentType: "application/json",
    success: function (j) {
      $(".sessionvalue").val(j);
    },
  });
}

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});


// Compose Notification - SKY

// Show modal when the compose button is clicked
$(".composeCustNotification").on("click", function () {
  $("#composeNotificationModal").modal("show");
});

// Show/hide department dropdown based on recipient selection
$("#recipient").on("change", function () {
  if ($(this).val() === "specificDept") {
    $("#departmentDropdown").show(); // Show the dropdown
  } else {
    $("#departmentDropdown").hide(); // Hide the dropdown
    $("#deptListforNotification").val(""); // Clear the selection
  }
});
// Reset form functionality
$("#resetButton").on("click", function () {
  $("#composeNotificationForm")[0].reset(); // Reset the form
  $("#departmentDropdown").hide(); // Hide department dropdown on reset
});

// composeNotificationForm submission
$('#composeNotificationForm').on('submit', function (e) {
  e.preventDefault(); // Prevent the default form submission
  var c = JSON.stringify({
    recipient: $('#recipient').val(),
    department: $('#deptListforNotification').val(),
    compositionType: $('#compositionType').val(),
    priority: $('#priority').val(),
    message: $('#notificationMessage').val()
  });
  console.log(c)
  var d = chkV(c);
  let file = document.getElementById("attachment").files[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("d", d);

  console.log(formData)
  // ajax call
  var settings = {
    url: "createNotification",
    method: "POST",
    data: formData,
    processData: false,
    contentType: false,
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    console.log(j);
  });
});



function newAcknowledgeSlip(downloadStatus, gID) {
  var download = downloadStatus;
  var c = JSON.stringify({
    token: "c496b16946f1bd47869a2a423bc7fdf5fb52054d",
    grievanceID: gID,
    download: download
  });
  var d = chkV(c);
  var settings = {
    url: cp +"/generateAcknowledgementSlip?d=" + d,
    method: "POST",
    timeout: 0,
    xhrFields: {
      responseType: 'blob'
    },
  };
  $.ajax(settings).done(function (response) {
    var blob = response;
    if (download === true) {
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = cp +"Acknowledgement_" + gID + ".pdf";
      link.click();
      URL.revokeObjectURL(url);
      window.location.href = "home";
    } else {
      var url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
    }
  });
}

$(".ackSlip").click(function () {
  let gID = $(this).attr('data-value');
  let download = $(this).attr('data-status') === 'true';
  newAcknowledgeSlip(download, gID);
});

