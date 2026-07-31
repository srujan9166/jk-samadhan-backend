
var url = "";
$(document).ready(function () {

  $(document).keypress("#userClarificationMessage", function (e) {
    //console.log($(this).val())
    return validTextArea(e);
  });

  $("#descrpA").on("keyup", function () {
    this.value = this.value.replace(/[^0-9a-zA-Z:,-./(); \s]/g, '');

  });

  sessionFunc();
  if (
    window.location.href.indexOf("/forwarTolodgeGrievance") != -1 ||
    window.location.href.indexOf("/lodgeAppeal") != -1
  ) {
    //alert('forwarTolodgeGrievance')
    $("#descrp, #descrpA").on("input", function () {
      var text = $(this).val();
      var charCount = text.length;
      var remainingCount = 3000 - charCount;
      $(".remWCounter").text(remainingCount);
    });
  }
  // 11th June 2024 - Rich Text Editor - SKY - start
  //     tinymce.init({
  //     selector: '#descrp',
  //     height: 300,
  //     plugins: 'lists link',
  //     toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link',
  //     menubar: false,
  //     branding: false // Add this line to remove the TinyMCE branding
  // });
  // 11th June 2024 - Rich Text Editor - SKY - end

  $(window).on("click", function (event) {
    // alert("true1")
    if (event.target.id === "exampleModal") {
      alert("true2");
      $(".reset-on-close").val("");
    }
  });
  // alert("hello")
  // Select the input fields by their IDs
  const newPassword = $(".newPwd");
  const cNewPassword = $(".cNewPwd");
  // Add keyup event handlers to both input fields
  newPassword.on("keyup", function () {
    compareAndHighlight();
  });
  cNewPassword.on("keyup", function () {
    compareAndHighlight();
  });
  // Function to compare strings and apply visual feedback
  function compareAndHighlight() {
    const string1 = newPassword.val();
    const string2 = cNewPassword.val();

    // alert(string1)
    // alert(string2)

    if (string1 === string2 && (string1, string2) != "") {
      // alert("yes")
      newPassword.css("border-color", "green"); // Match: Set border color to green
      cNewPassword.css("border-color", "green");
      $(".errorMsg1").html("New Password And Confirm Password Match!"); // Show message that it matches
      $(".chngPwd").prop("disabled", false);
    } else {
      // alert("no")
      $(".chngPwd").prop("disabled", true);
      $(".errorMsg1").html("New Password And Confirm Password Does Not Match!"); // Show message that it matches
      newPassword.css("border-color", "red"); // No match: Set border color to red
      cNewPassword.css("border-color", "red");
    }
  }

  $("#descrp").keypress(function (e) {
    //console.log($(this).val())
    return validTextArea(e);
  });

  $(document).keypress(".moreData", function (e) {
    //console.log($(this).val())
    return validTextArea(e);
  });

  // $(".btn-customBtn").on("click", function () {
  // 	var table=$("#YRreport").DataTable({});
  //     table.button("." + $(this).val()).trigger();
  //   });

  function validTextArea(e) {
    var keyCode = e.keyCode || e.which;
    //Regex for Valid Characters i.e. Alphabets.
    // var regex = /^[A-Za-z0-9.,?()_-\s]*$/;

    // Naitik changes - regex
    //added () in regex by utkarsh 09/03/2026 
    var regex = /^[A-Za-z0-9.,\-\/:;()\s]*$/;

    var char = e.key ? e.key : String.fromCharCode(keyCode);


    var isValid = regex.test((char));
    if (!isValid) {
      //lblError5.innerHTML = "Please valid email Id.";
    }

    return isValid;
  }

  /*$(document).click('#doccss',function(e){

  var path=$('#doccss').attr('val')
 $("#doccss").attr("href", 'download1?fileName=' + encodeURIComponent(path));
})*/

  // $('#YRreport').DataTable( {
  // 	  //  data: j,
  // 	    destroy: true,
  // 	    lengthMenu:[5,10,25],
  // 	    pageLength: 10,
  // 	    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
  //         buttons: [
  //             'excel'
  //         ],
  //         })


  if (
    window.location.href.indexOf("/home") != -1
  ) {
    loaddatatable("home");
    // url = cp + "/user/downloadPdfHistory"
  } else {
    url = cp + "/downloadTrackedHistory"
  }

  // Handle browser back/forward button
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      // Page was restored from bfcache back button
      checkProfileCompleteness();
    }
  });

  // Profile Completeness Check after Citizen Login by Naitik 20/04/2026

  if (sessionStorage.getItem('checkProfileOnLoad') === 'true') {

    // sessionStorage.removeItem('checkProfileOnLoad'); // consume immediately

    // Profile Completeness Check after Citizen Login by Naitik 20/04/2026

    function checkProfileCompleteness() {
      $.get(cp + "/getUserProfile", function (u) {

        if (!u || Object.keys(u).length === 0) return;

        var requiredFields = {
          'First Name': u.first_name,
          'Mobile': u.mobile,
          'Email': u.email,
          'Address': u.address,
          'Pincode': u.pincode,
          'State': u.region,
          'District': u.district,
          'Date of Birth': u.date_of_birth
        };

        var missingFields = [];
        $.each(requiredFields, function (label, value) {
          if (!value || value.toString().trim() === '' || value.toString().trim() === '0') {
            missingFields.push(label);
          }
        });

        // All fields present — unlock everything, do nothing
        if (missingFields.length === 0) {
          sessionStorage.removeItem('profileIncomplete');
          return;
        }

        // Mark profile as incomplete in sessionStorage
        sessionStorage.setItem('profileIncomplete', 'true');

        // DISABLE ALL NAV LINKS & BUTTONS 
        disableHomePage();

        var missingList = missingFields.map(function (f) {
          return '<li style="text-align:left; margin-bottom:4px;">' + f + '</li>';
        }).join('');

        Swal.fire({
          icon: 'warning',
          title: 'Complete Your Profile First!',
          html: '<p>The following details are missing:</p>'
            + '<ul style="color:#dc3545; margin-top:8px; padding-left:20px;">'
            + missingList
            + '</ul>'
            + '<p class="mt-2"><b>You must update your profile before using the portal.</b></p>',
          confirmButtonText: 'Update Profile Now',
          confirmButtonColor: '#0d6efd',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(function (result) {
          if (result.isConfirmed) {
            window.location.href = cp + '/user/userProfile#profile-update-details';
          }
        });

      }).fail(function () {
        console.warn('[Profile Check] /getUserProfile failed, skipping.');
      });
    }

  }
  function disableHomePage() {

    //Disable all sidebar navigation links
    $('aside a, .sidebar a, #sidebar a, .nav-link, .side-nav a').each(function () {
      var href = $(this).attr('href');
      // Keep logout and profile links working
      if (href && (href.includes('logout') || href.includes('userProfile'))) return;
      $(this).attr('data-original-href', href || '')
        .removeAttr('href')
        .css({ 'pointer-events': 'none', 'opacity': '0.5', 'cursor': 'not-allowed' })
        .attr('title', 'Please complete your profile first');
    });

    //Disable all action buttons (Lodge Grievance, Appeal, etc.)
    $('button, .btn, a.btn').each(function () {
      var txt = $(this).text().trim().toLowerCase();
      var href = $(this).attr('href') || '';
      // Keep logout and profile buttons working
      if (href.includes('logout') || href.includes('userProfile') ||
        txt.includes('logout') || txt.includes('profile')) return;
      $(this).prop('disabled', true)
        .css({ 'pointer-events': 'none', 'opacity': '0.5', 'cursor': 'not-allowed' })
        .attr('title', 'Please complete your profile first');
    });

    //Disable all clickable menu items
    $('li.nav-item a, .menu-item a').each(function () {
      var href = $(this).attr('href') || '';
      if (href.includes('logout') || href.includes('userProfile')) return;
      $(this).attr('data-original-href', href)
        .removeAttr('href')
        .css({ 'pointer-events': 'none', 'opacity': '0.5', 'cursor': 'not-allowed' });
    });

    // Show a persistent banner at top of page
    if ($('#profileIncompleteBanner').length === 0) {
      $('body').prepend(
        '<div id="profileIncompleteBanner" style="'
        + 'position: fixed; top: 0; left: 0; width: 100%; z-index: 99999;'
        + 'background: #dc3545; color: #fff; text-align: center;'
        + 'padding: 10px 20px; font-size: 14px; font-weight: 600;'
        + 'box-shadow: 0 2px 8px rgba(0,0,0,0.3);">'
        + '⚠️ Your profile is incomplete. Please '
        + '<a href="' + cp + '/user/userProfile#profile-update-details" '
        + 'style="color:#fff; text-decoration:underline; font-weight:800;">'
        + 'Update Your Profile</a> to access all features.'
        + '</div>'
      );

      // Push page content down so banner doesn't overlap
      $('body').css('margin-top', '45px');
    }

    // Block any link clicks on the whole page
    $(document).on('click.profileBlock', 'a, button', function (e) {
      var href = $(this).attr('href') || '';
      var txt = $(this).text().trim().toLowerCase();
      if (href.includes('logout') || href.includes('userProfile') ||
        txt.includes('logout') || txt.includes('profile') ||
        txt.includes('update')) return; // allow these through
      e.preventDefault();
      e.stopImmediatePropagation();

      Swal.fire({
        icon: 'warning',
        title: 'Profile Incomplete',
        text: 'Please complete your profile before accessing this feature.',
        confirmButtonText: 'Update Profile Now',
        confirmButtonColor: '#0d6efd',
        allowOutsideClick: false
      }).then(function (result) {
        if (result.isConfirmed) {
          window.location.href = cp + '/user/userProfile#profile-update-details';
        }
      });
    });
  }

  // Trigger the check
  if (sessionStorage.getItem('checkProfileOnLoad') === 'true') {
    sessionStorage.removeItem('checkProfileOnLoad');
    checkProfileCompleteness();
  }

  // Also re-check on every home page load if flag persists
  // (handles back-button navigation before profile is complete)
  if (sessionStorage.getItem('profileIncomplete') === 'true') {
    checkProfileCompleteness();
  }

  // ===== End Profile Completeness Check =====
  // ===== End Profile Completeness Check =====


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


});


function loaddatatable(btnVal) {
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "grievanceDetail?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    // console.log(j);
    j = JSON.parse(j);
    // if (j.statusCode == "1") {
    //console.log(j.data);
    griDetaisTable(j.data);
    // }
  });
}

//New Changes Start 05/02/2026
$(document).on("click", ".status-filter", function () {
  var selectedStatus = $(this).data("status");

  // Remove active class from all cards and add to clicked card
  $(".status-filter").removeClass("active-filter");
  $(this).addClass("active-filter");

  var table = $("#YRreport").DataTable();

  if (selectedStatus === "all") {
    // Show all records
    table.search("").columns().search("").draw();
  } else {
    // Filter by status using regex (handles multiple statuses separated by |)
    table.column(5).search(selectedStatus, true, false).draw();
  }
});
//New Changes End 05/02/2026

$(document).on("click", ".data-search", function (e) {
  var btnVal = $(this).val();
  var c = JSON.stringify({
    value: btnVal,
  });
  var d = chkV(c);
  var settings = {
    url: "grievanceDetail?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // if (j.statusCode == "1") {
    //console.log(j.data);
    griDetaisTable(j.data);
    // }
  });
});

function griDetaisTable(d) {
  // console.log(d);
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
      title: "Grievance ID",
      //  render: function (data, type, row, meta) {
      //    return (
      //      '<button class="btn btn-link grievance-btn vDetails" value = "' +data+'" data-appflag = "JKSAMADHAN">' +
      //      data +
      //      "</button>"
      //    );
      //  },
    },

    {
      data: "department",
      defaultContent: "",
      title: "Department",
    },
    {
      data: "category",
      defaultContent: "",
      title: "Main category",
    },
    {
      data: "createdDate",
      defaultContent: "",
      title: "Date",
    },
    {
      data: "status",
      title: "Status",
      defaultContent: "",
      render: function (data, type, row, meta) {
        if (data === "Pending") {
          return (
            '<div class="btn btn-warning btn-sm yr-mw"><i class="bi bi-exclamation-triangle"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Acknowledged") {
          return (
            '<div class="btn btn-info btn-sm yr-mw"><i class="bi bi-exclamation-circle"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Under Process") {
          return (
            '<div class="btn btn-upprocess btn-sm yr-mw"><i class="bi bi-exclamation-diamond"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Rejected") {
          return (
            '<div class="btn btn-danger btn-sm yr-mw"><i class="bi bi-x-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Resolved") {
          return (
            '<div class="btn btn-success btn-sm yr-mw"><i class="bi bi-check-circle"></i> ' +
            data +
            "</div>"
          );
        } else if (data == "dnpToOffice") {
          var st = "Does not pertain";
          return (
            '<div class="btn btn-dangar btn-sm yr-mw"><i class="bi bi-exclamation-octagon"></i> ' +
            st +
            "</div>"
          );
        } else if (data === "Appealed") {
          return (
            '<div class="btn btn-primary btn-sm yr-mw"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Forwarded To CPGRAM") {
          return (
            '<div class="btn btn-sm yr-mw" style="background-color: #e7e7e7"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else if (data === "Forwarded") {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw" style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' +
            data +
            "</div>"
          );
        } else {
          return (
            '<div class="btn btn-dangar btn-sm yr-mw"><i class="bi bi-exclamation-octagon"></i> ' +
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

        var feedbackBtn = "";
        if (row.feedbackflag == 0 && (row.status == "Resolved" || row.status == "Rejected")) {
          feedbackBtn = '<button class="btn btn-secondary me-2 btn-sm" data-bs-toggle="modal" data-bs-target="#feedBackM" id = "fBack" value="' + data + '"><span class = "bi bi-chat-dots-fill me-1"></span>Rate Us</button>';
          // $('#feedBackMLabel').text('Submit Feedback For : ' + data);
          // <i class="bi bi-emoji-smile" style="color: green"></i>
          // <i class="bi bi-emoji-frown" style="color: red"></i>
        }

        var btn =
          '<div class="dropdown">' +
          feedbackBtn +
          '<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">' +
          '<i class="bi bi-three-dots"></i>' +
          "</button>" +
          '<ul class="dropdown-menu yr-dropdown" aria-labelledby="dropdownMenuButton">' +
          '<li class=""><button class="btn btn-sm view" value = "' +
          data +
          '">Grievance Details</button></li>';
        if (row.status != "Pending") {
          btn =
            btn +
            '<li><button class="btn btn-sm His" value = "' +
            data +
            '" data-value="' + row.mobile + '">History</button></li>';
        }

        return btn + "</ul></div>";
      },
    },
  ];
  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table152.button("." + $(this).val()).trigger();
  });

  // var table152 = $("#YRreport").DataTable({
  //   data: d,
  //   destroy: true,
  //   lengthMenu: [10, 50, 100],
  //   pageLength: 10,
  //   scrollX: true,
  //   //"scrollY": 500,
  //   //"scrollCollapse": true,
  //   paging: true,

  //   //dom: 'Blfrtip',
  //   //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
  //   buttons: [
  //     {
  //       extend: "excel",
  //       title: "JKGOVT",
  //       messageTop: "The information in this table is copyright to JK GOVT.",
  //       exportOptions: {
  //         columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
  //       }
  //     },
  //     {
  //       extend: "pdf",
  //       title: "JKGOVT",
  //       messageBottom:
  //         "The information in this table is copyright to JK GOVT.",
  //       pageSize: "A4",
  //       download: "open",
  //       customize: function (doc) {
  //         // Set the page orientation and size
  //         doc.pageSize = 'A4';
  //         doc.pageOrientation = 'landscape';

  //         // Adjust the content styling
  //         doc.styles.tableHeader.fontSize = 8;
  //         doc.styles.tableBodyOdd.fontSize = 8;
  //         doc.styles.tableBodyEven.fontSize = 8;

  //         // Center the table content
  //         var rowCount = doc.content[1].table.body.length;
  //         for (var i = 0; i < rowCount; i++) {
  //           var row = doc.content[1].table.body[i];
  //           for (var j = 0; j < row.length; j++) {
  //             row[j].alignment = 'center';
  //           }
  //         }

  //         // Scale the table width to fit the page
  //         var totalColumns = doc.content[1].table.body[0].length;
  //         var columnWidths = [];
  //         for (var i = 0; i < totalColumns; i++) {
  //           columnWidths.push('*');
  //         }
  //         doc.content[1].table.widths = columnWidths;
  //       },
  //       exportOptions: {
  //         columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
  //       }
  //     },
  //   ],
  //   columns: columns,
  //   rowCallback: function (row, data) {

  //     // Check the value of the 'application' column and apply the corresponding class
  //     const color = {
  //       Forwarded: "web-application-forwarded",
  //       Resolved: "web-application-resolved",
  //       Acknowledged: "web-application-acknowledged",
  //       "Proposed Disposed": "web-application-proposed-disposed",
  //       Rejected: "web-application-rejected",
  //       Appealed: "web-application-appealed",
  //       "Under Process": "web-application-under-proccess",
  //       Pending: "web-application-pending",
  //       dnpToOffice: "web-application-dnptooffice",
  //     };

  //     const customClass = color[data.status]
  //       ? color[data.status]
  //       : "web-application-row";

  //     $(row).addClass(customClass);
  //   }
  // });



  // $(document).on('click','.toggle-sidebar-btn',function(){
  //   table152.destroy();  

  // });

  //New Changes 05/02/2026
  var table152 = $("#YRreport").DataTable({
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
    drawCallback: function (settings) {
      // Recalculate serial numbers after draw (filtering, pagination, etc.)
      var api = this.api();
      var startIndex = api.page.info().start;
      api.column(0, { page: 'current' }).nodes().each(function (cell, i) {
        cell.innerHTML = startIndex + i + 1;
      });
    }
  });

  //New Changes End 05/02/2026
  table152.columns.adjust().draw();
}

$(document).on("click", "#fBack", function (e) {
  let gId = this.getAttribute("value");
  //	console.log(gId);
  $("#feedBackM").show();
  $('#feedBackMLabel').text('Submit Feedback For : ' + gId);
  $('.feedB-btn').attr("value", gId);

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

$("#latLongDiv").hide();

$("#inputRegion1").change(function () {
  var addDeptV = $("#inputRegion1").find(":selected").val();
  $("#inputDistrict").html("");

  if (addDeptV == "UT(J&K)") {
    $("#distDivs").hide();
  } else {
    $("#distDivs").show();
    $("#inputDistrict").append(
      '<option value="0">--Select District--</option>'
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
  }
});

Listen(document).on("click", ".closeLogout", function (e) {
  this.closest("form").submit();
});

$("#checkval").on("change", function () {
  if ($(this).is(":checked")) {
    var checkboxValue = $(this).val();
    $("#subCheckval").attr("disabled", false);
  } else {
    $("#subCheckval").attr("disabled", true);
  }
});

function depData(dep) {
  var addDeptV = dep;
  $("#depName").html("");
  $("#depName").append('<option value="0">Select</option>');
  console.log(addDeptV);
  if (addDeptV != "0") {
    ///to add new///
    //	$("#subcateg").prop("disabled", false);
    var c = JSON.stringify({
      divison: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "departmentByDivision?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      console.log(j);
      if (j.statusCode == "1") {
        //	$('#depName').val(j.data[0].department_name)
        makeDropdown(depName, j.data);
      }
    });
  } else {
    $("#subcateg").prop("disabled", true);
  }
}



// for Raabita - 03/01/2025 - start
$("#divName").change(function () {
  //alert("llll")
  var addDeptV = $("#divName").find(":selected").val();
  $("#distName").html("");
  $("#distName").append('<option value="0">Select District</option>');
  $("#blockName").html("");
  $("#blockName").append('<option value="0">Select Block</option>');
  $("#panchayatName").html("");
  $("#panchayatName").append('<option value="0">Select Panchayat</option>');
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
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      if (j.statusCode == "1") {
        // console.log( j.data)
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


  //moreData();

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

// for Raabita - 03/01/2025 - end

$("#depName").change(function () {
  $("#addInfoDiv").hide();
  var addDeptV = $("#depName").find(":selected").val();
  var division = $("#inputRegion1").find(":selected").val();
  $("#categ").html("");
  $("#categ").append('<option value="0">--Select category--</option>');
  if (addDeptV != "0") {
    //$("#inputDistrict").attr("disabled",false);
    var c = JSON.stringify({
      divison: division,
      department_name: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "categoryBydepartment?d=" + d,
      method: "POST",
      timeout: 0,
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
    $("#inputDistrict").attr("disabled", true);
  }
});

function CategoryBydept(dep) {
  var addDeptV = dep;
  $("#categ").html("");
  $("#categ").append('<option value="0">Select</option>');
  console.log(addDeptV);
  if (addDeptV != "0") {
    ///to add new///
    //	$("#subcateg").prop("disabled", false);
    var c = JSON.stringify({
      divison: addDeptV,
    });
    var d = chkV(c);
    var settings = {
      url: "categoryBydepartment?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);
      console.log(j);
      if (j.statusCode == "1") {
        //	$('#depName').val(j.data[0].department_name)
        makeDropdown(categ, j.data);
      }
    });
  } else {
    //$("#subcateg").prop("disabled", true);
  }
}

var docss1 = [];
var docss = [];
$("#fileUp,#fileUpAppeal").on("change", function () {
  //docss=[];
  //fileValidation()
  var id = $(this).attr("id");
  var fff = fileValidation(id);
  if (fff != false) {
    var t = checkMaliciousFile(id);
    console.log(t);
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

$("#fileAudVid").on("change", function () {
  //docss=[];
  //fileValidation()
  var id = $(this).attr("id");
  var fff = fileValidationforAudionVideo(id);
  if (fff != false) {
    var t = checkMaliciousFile(id);
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

function fileValidationforAudionVideo(id) {
  const fi = document.getElementById(id);
  var filePath = fi.value;
  var filename = filePath.replace(/^.*[\\\/]/, "");
  var allowedExtensions = /(\.mp3|\.MP3|\.wav|\.WAV|\.mp4|\.MP4|\.avi|\.AVI)$/i;

  if (!allowedExtensions.exec(filePath)) {
    alert("Please upload audio (MP3, WAV) or video (MP4, AVI) files only");
    fi.value = "";
    return false;
  }

  if (fi.files.length > 0) {
    const fsize = fi.files.item(0).size;
    const file = Math.round(fsize / 1024);
    // The size of the file.
    if (file >= 40 * 1024) { // 100 MB limit
      alert("File size should be less than 5 MB");
      $("#" + id).val("");
      return false;
    }
  }

  return true;
}


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
      console.log(j);
      if (j == "1") {
        resolve(true, j);
      } else {
        resolve(false, j);
      }
    });
  });

  /*return new Promise(function(resolve) {
        var d = chkV(usr);
        var settings = {
            "url": "checkCaptcha?d=" + d,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
            },
        };

        $.ajax(settings).done(function(j) {
            j = setV(j);
            j = JSON.parse(j);

            if (j.statusCode === '1') {
             //   alert("success");
                resolve(true);
            } else {
                alert("Invalid Captcha");
                resetCaptcha();
                resolve(false);
            }
        });
    });*/
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

    if (file >= 5 * 1024) {

      alert("File size should be less than 5 MB");
      $("#" + id).val("");
      return false;
    }
  }
}

/*$('#fileUpAppeal').on('change',function(){
  //  docss1=[];
var id=$(this).attr("id")
  var fff=fileValidation(id);
if(fff!=false){
  var t=checkMaliciousFile(id);
  console.log(t);
  t.then(function(success){
    if(success==true){
       return true;
      //fileValidation(id);
    }else{
      $('#'+id).val("");
      alert("Malicious File Detected")
    }
  })
  }
	
})*/

function fileValidation1() {
  const fi = document.getElementById("fileUpAppeal");
  var filePath = fi.value;
  var filename = filePath.replace(/^.*[\\\/]/, "");
  var allowedExtensions =
    /(\.png|\.PNG|\.jpg|\.JPG|\.jpeg|\.JPEG|\.PDF|\.pdf)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert("Please upload jpeg, png or jpeg file only");
    fi.value = "";
    return false;
  }
  if (fi.files.length > 0) {
    //  for (const i = 0; i <= fi.files.length - 1; i++) {

    const fsize = fi.files.item(0).size;
    const file = Math.round(fsize / 1024);
    // The size of the file.
    if (file >= 5 * 1024) {
      alert("File size should be less than 2 MB");
      $("#fileUpAppeal").val("");
    } else {
      var reader = new FileReader();

      reader.addEventListener(
        "load",
        function () {
          ans = this.result;

          // use the function:
          ans = getSecondPart(ans);
          //ans=ans.subString;

          //   str = ans.split(',');
          var doc = {
            file_path: ans,
            file_name: filename,
          };
          docss1.push(doc);
        },
        false
      );

      reader.readAsDataURL(fi.files.item(0));
    }
    // }
  }
}

$("#categ").change(function () {
  var addDeptV = $("#categ").find(":selected").val();
  var depName = $("#depName").find(":selected").val();
  $("#subcateg").html("");
  $("#subcateg").append('<option value="0">Select</option>');
  //console.log(stateS);
  //moreData();
  if (addDeptV != "0") {
    ///to add new///
    if (addDeptV == "add") {
      $("#categV").val("");
      $("#categT").show();
      $("#subcateg").prop("disabled", false);
      $("#subcategDiv").hide();
      $("#subcateg2Div").hide();
    } else {
      $("#subcategDiv").show();
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
        department_name: depName
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
        console.log(j);

        if (j.statusCode == "1") {
          //	console.log(j.data);
          //	$("#subcategDiv").show();
          $("#subcateg").attr("disabled", false);
          //$('#depName').val(j.data[0].department_name);
          if (j.data[0].values != "") {
            $("#subcategDiv").show();

            $("#subcateg2Div").hide();
            $("#subcateg3Div").hide();
            $("#subcateg4Div").hide();
            makeDropdown(subcateg, j.data);
          } else {
            $("#subcategDiv").hide();
            $("#subcateg2Div").hide();
            $("#subcateg3Div").hide();
            $("#subcateg4Div").hide();
            $("#subcateg").attr("disabled", true);
          }
        } else {
          $("#subcategDiv").hide();
          $("#subcateg2Div").hide();
          $("#subcateg3Div").hide();
          $("#subcateg4Div").hide();
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
    $("#subcategDiv").hide();
    $("#subcateg2Div").hide();
    $("#subcateg3Div").hide();
    $("#subcateg4Div").hide();
  }
});

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
            ':<span style="color:red">*</span></div><div class="col-lg-9 col-md-8 py-2 border-bottom"><div style="max-width: 450px"><input type="search" class="form-control moreData" data-value=' +
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

function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>")
        .attr("value", value.values)
        .text(value.values.toUpperCase())
    );
  });
}

$("#subcateg").change(function () {
  var addDeptV = $("#subcateg").find(":selected").val();
  var depName = $("#depName").find(":selected").val();
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
    $("#subcateg2Div").show();

    $("#subcateg3Div").hide();
    $("#subcateg4Div").hide();

    var c = JSON.stringify({
      value: addDeptV,
      department_name: depName
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
        $("#subcateg2Div").show();

        $("#subcateg3Div").hide();
        $("#subcateg4Div").hide();
        $("#subcateg2").attr("disabled", false);
        makeDropdown(subcateg2, j.data);
      } else {
        $("#subcateg3Div").hide();
        $("#subcateg4Div").hide();
        $("#subcateg2Div").hide();
        $("#subcateg2").attr("disabled", true);
      }
    });
  } else {
    $("#subcateg3Div").hide();
    $("#subcateg4Div").hide();
    $("#subcateg2Div").hide();
    $("#subcateg2").prop("disabled", true);
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg2").val(0);
    $("#subcateg3").val(0);
    $("#subcateg4").val(0);
  }
});

/*$("#subcateg").change(
    function() {
      //var addDeptV = $('#subcateg').find(":selected").val();
      var addDeptV = $('#categ').find(":selected").val();
      //console.log(addDeptV);
      $("#forwardTo").html('');
      $("#forwardTo").append('<option value="0">Select</option>');
      if(addDeptV!=0){
        $("#forwardTo").prop("disabled", true);
        $("#forwardTo").val(0);
      	
      var c = JSON.stringify({
            value: addDeptV
          });
          var d = chkV(c);
          var settings = {
            "url": "forwardedTo?d=" + d,
            "method": "POST",
            "timeout": 0,
          };
          $.ajax(settings).done(function(j) {
            j = setV(j);
            j = JSON.parse(j);
            //  console.log(j)
            console.log(j);
            if (j.statusCode == '1') {
              console.log(j.data);
            $("#forwardTo").attr('disabled',false);
              makeDropdown(forwardTo, j.data);
            }	else{
              $("#forwardTo").attr('disabled',true);
            }
          });	
      }else{
      	
        $("#forwardTo").prop("disabled", true);
        $("#forwardTo").val(0);
    	
      	
      }
  	
    });*/

$("#subcateg2").change(function () {
  var addDeptV = $("#subcateg2").find(":selected").val();
  var depName = $("#depName").find(":selected").val();
  //console.log(addDeptV);
  $("#subcateg3").html("");
  $("#subcateg3").append('<option value="0">Select</option>');
  if (addDeptV != 0) {
    $("#subcateg3Div").show();
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
    $("#subcateg3").val(0);

    $("#subcateg4Div").hide();
    var c = JSON.stringify({
      value: addDeptV,
      department_name: depName
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
        $("#subcateg3Div").show();
        $("#subcateg4Div").hide();
        $("#subcateg3").attr("disabled", false);
        //	console.log(j.data);
        makeDropdown(subcateg3, j.data);
      } else {
        $("#subcateg3Div").hide();
        $("#subcateg4Div").hide();
        $("#subcateg2").attr("disabled", true);
      }
    });
  } else {
    $("#subcateg4Div").hide();
    $("#subcateg3Div").hide();
    $("#subcateg3").prop("disabled", true);
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
    $("#subcateg3").val(0);
  }
});

$("#subcateg3").change(function () {
  var addDeptV = $("#subcateg3").find(":selected").val();
  var depName = $("#depName").find(":selected").val();
  //console.log(addDeptV);
  $("#subcateg4").html("");
  $("#subcateg4").append('<option value="0">Select</option>');
  if (addDeptV != 0) {
    $("#subcateg4Div").show();
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
    var c = JSON.stringify({
      value: addDeptV,
      department_name: depName
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
        $("#subcateg4Div").show();
        //	console.log(j.data);
        $("#subcateg4").attr("disabled", false);
        makeDropdown(subcateg4, j.data);
      } else {
        $("#subcateg4Div").hide();
        $("#subcateg4").attr("disabled", true);
      }
    });
  } else {
    $("#subcateg4Div").hide();
    $("#subcateg4").prop("disabled", true);
    $("#subcateg4").val(0);
  }
});

/*$("#subcateg").change(
    function() {
      var addDeptV = $('#subcateg').find(":selected").val();
      //console.log(stateS);
      if (addDeptV != '0') {
        ///to add new///
        if(addDeptV == 'add') {
          $("#subcategV").val('');
          $("#subcategT").show();
          $("#subcateg").prop("disabled", false);
        }else {
          $("#subcateg").prop("disabled", false);
          $("#subcategT").hide();
        }
      }else {
        $("#subcategT").hide();
      }
    });*/

function getSecondPart(str) {
  return str.split("base64,")[1];
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




$("#submitGrievance").click(function () {

  var cat = $("#categ").find(":selected").val();
  var subcateg = $("#subcateg").find(":selected").val();
  var subCatNextLevel2 = $("#subcateg2").find(":selected").val();
  var subCatNextLevel3 = $("#subcateg3").find(":selected").val();
  var subCatNextLevel4 = $("#subcateg4").find(":selected").val();
  //var forwardTo=$('#forwardTo').find(":selected").val();
  var usrName = $("#usrName").text();
  var mobNo = $("#mobNo").text();
  //	var emailId = $('#emailId').text();
  var add = $("#add").text();
  // var descrp = tinymce.get('descrp').getContent();
  var descrp = $("#descrp").val();
  var lat = $("#lat").text();
  var long = $("#long").text();
  var dep = $("#depName").val();

  //var divison = $("#inputRegion1").find(":selected").val();
  //var district = $("#inputDistrict").find(":selected").val();
  var info = $("#addInfo").find(":selected").val();

  var divName = $('#divName').find(":selected").val();
  var distName = $('#distName').find(":selected").val();
  var panchayatName = $('#panchayatName').find(":selected").val();
  var psga = $('input[name="psga"]:checked').val();

  var wardName = $('#wardName').find(":selected").val();
  var umrb = $('input[name="umrb"]:checked').val() || "";

  var municipalityOrBlock = 0;
  if (umrb == "Municipality") {
    municipalityOrBlock = $('#municipalityName').find(":selected").val();

  } else if (umrb == "Block") {

    municipalityOrBlock = $('#blockName').find(":selected").val();

  }

  var platform = $("input[name='concern']:checked").val();

  //console.log("platform : "+platform)

  if (lat == "" && long == "") {
    alert("Please mark your location");
  } else {
    //	var checkVisibility=$('#distDivs').is(":visible")
    var addInfoDiv = $("#addInfoDiv").is(":visible");
    var validation;

    if (addInfoDiv) {
      var isValid = false;
      $(".moreData").each(function () {
        if ($(this).val().trim() === "") {
          isValid = false;
          //   $(this).addClass("invalid");
        } else {
          // $(this).removeClass("invalid");
          isValid = true;
        }
      });
      validation = cat == "0" || dep == "" || descrp == null || descrp == "" || info == 0 || divName == 0 || distName == 0 || psga == undefined || municipalityOrBlock == 0 || isValid == false;
    } else {
      validation = cat == "0" || dep == "" || descrp == null || descrp == "" || divName == 0 || distName == 0 || psga == undefined || municipalityOrBlock == 0;
    }

    // console.log(umrb)
    //console.log(municipalityName)
    //console.log(blockName)

    //  console.log(isValid + " hhh " + info);
    //Naitik Changes on popup 09/10/2025
    if (validation) {
      alert("Please fill all the mandatory fields.");
    } else {

      if (!confirm("Are you sure that you want to submit Grievance?")) {
        return;
      }

      $("#submitGrievance").attr("disabled", true);

      //Naitik Changes End 09/10/2025


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
      //fileValidation()

      var c = JSON.stringify({
        //divison: divison,
        //district: district,
        category: cat,
        value: descrp,
        name: usrName,
        mobile: mobNo,
        address: add,
        latitude: lat,
        longitude: long,
        department_name: dep,
        sub_category: subcateg,
        sub_Cat_Next_Level2: subCatNextLevel2,
        sub_Cat_Next_Level3: subCatNextLevel3,
        sub_Cat_Next_Level4: subCatNextLevel4,
        more_info: info,
        exData: inputValues,
        div_id: divName,
        dist_id: distName,
        municipality_or_block_id: municipalityOrBlock,
        panchayat_id: panchayatName,
        ward_id: wardName,
        umrb: umrb,
        psga: psga,
        platform: platform,
        sessionvalue: $('#sessionvalue').val(),
        sessionname: $("#sessionname").val()
        //user_assigned:forwardTo
      });
      //console.log(c);
      var d = chkV(c);
      var id = $(this).attr("id");
      var doc = document.getElementById("fileUp").files[0];
      var audvid = document.getElementById("fileAudVid").files[0];
      // console.log("doc = ",doc)
      // console.log("audvid = ",audvid)
      var formData = new FormData();
      formData.append("d", d);
      formData.append("file", doc);
      formData.append('filevideo', audvid);



      var settings = {
        url: "grievance",
        method: "POST",
        //	"data": {d:c,file:cdd},
        data: formData,
        contentType: false,
        processData: false,
        //"timeout": 0,
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        console.log(j);
        if (j.statusCode == "1") {
          //	var id=j.appId;

          //	 var cdd = JSON.stringify(docss[0])
          //	sendDocument(j.appId,cdd);
          //	$("#grivanceId").val(j.appId);
          //	$("#docForm").submit();
          //console.log(j.appId);
          alert("Grievance " + j.appId + " submitted successfully.");
          // acknowledgeSlip(c, j.appId);
          newAcknowledgeSlip(true, j.appId);
          // window.location.href = "home";
        } else if (j.statusCode == "2") {
          alert("Malicious file detected");
          // window.location.reload();
        }
        // cmt_24
        else if (j.statusCode == "4") {
          var msg = j.statusName;
          alert(msg);
          window.location.reload();
        }
        else {
          alert("Something went wrong");
          // window.location.reload();
        }
      });
    }
  }
});
function formatDate(date) {
  var day = String(date.getDate()).padStart(2, "0");
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var year = date.getFullYear();
  return day + "/" + month + "/" + year;
}



// function acknowledgeSlip(data, gID) {
//   var grvData = JSON.parse(data);
//   var currentDate = new Date();
//   var formattedDate = formatDate(currentDate);
//   var template;
//   var platform = $("input[name='concern']:checked").val();
//   if(platform=="JKSamadhan"){

//     template =
//     //    '<div class="top">' +
//       //    "<p>0194-2483236, 2502910, 2502911 (S) Fax Nos.0194-2501262 (S)</p>" +
//       //    "<p>Tele Nos. 0191- 2560265, 2560109, 2560266(J) Fax No.0191-2566182(J)</p>" +
//       //    "</div>" +
//           '<div class="header-top">' +
//           "<h2 style='font-weight: bold;'>Union Territory of Jammu and Kashmir</h2>" +
//           "<h1 style='font-weight: bold;'>Department of Public Grievances</h1>" +
//       //    "<h2 style='font-weight: bold;'>Civil Secretariat, Srinagar/ Jammu</h2>" +
//           "<div class='header-line'><p>website: <a href='samadhan.jk.gov.in' target='_blank'>samadhan.jk.gov.in</a></p>  <p>Email : <a href='mailto:jk-grievance@jk.gov.in' target='_blank'>jk-grievance@jk.gov.in</a></p></div>" +
//           "</div>" +
//           '<div class="content">' +
//           "<h3 style='font-weight: bold;'>Subject: Acknowledgement of Grievance Registration - " +
//           gID +
//           "</h3>" +
//           "<div class='para'> " +
//           "<p style='margin-bottom: 2.5rem;'>Sir/Madam " +
//           grvData.name +
//           ",</p>" +
//           "<p style='margin-bottom: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Your grievance has been registered on <b>JK Samadhan Portal</b> with Grievance ID <b>" +
//           gID +
//           "</b> on <b>" +
//           formattedDate +
//           "</b>. Your grievance has been forwarded to the <b>" +
//           grvData.department_name +
//           " Department</b> for redressal.</p>" +
//           "<p style='margin-bottom: 2.5rem;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can track the progress of your grievance online by visiting the Jammu and Kashmir Grievance Portal JK Samadhan <b>https://samadhan.jk.gov.in</b> by entering your <b>Grievance ID and Phone No </b>(provided in your application).</p>" +
//           "<p style='margin-top: 3rem; margin-bottom: 5rem; text-align: right;'>Sincerely,</p>" +
//           "<p style='margin-bottom: 6px; font-weight: 800; text-align: right;'>Department of Public Grievances</p>" +
//         "<div class='footer-lines' style='margin-top: 2rem; margin-bottom: 1.5rem;'>"+
//         "<p style='margin-bottom: 6px; text-align: right;'>Civil Secretariat, Jammu <br/>Church Lane, Sonwar, Srinagar /</p>" +
//         "</div>"+
//       //    "<p>Civil Secretariat, Srinagar/ Jammu</p>" +

//           "<p class='text-right' style='font-size: 18px; margin-bottom: 4px; line-height: 28px; '>Tele Nos. 0191-2560265, 2560109, 2560266 (Jammu)</p>" +
//           "<p class='text-right' style='font-size: 18px; margin: 0px; line-height: 26px;'>0194-2483236, 2502910, 2502911 (Srinagar)</p>" + 

//           "</div>" +
//           "</div>";

//   }else{
//     template =
//     //    '<div class="top">' +
//     //    "<p>0194-2483236, 2502910, 2502911 (S) Fax Nos.0194-2501262 (S)</p>" +
//     //    "<p>Tele Nos. 0191- 2560265, 2560109, 2560266(J) Fax No.0191-2566182(J)</p>" +
//     //    "</div>" +
//     '<div id="mainContainer" class="header-top">' +
//     "<h1 style='font-weight: bold;'>Government of Jammu & Kashmir</h2>" +
//     "<h1 style='font-weight: bold;'>CHIEF MINISTER'S SECRETARIAT</h1>" +
//     "<h1 style='font-weight: bold;'>PUBLIC SERVICES & OUTREACH OFFICE (Raabita)</h2>" +
//     "<h1 style='font-weight: bold;'>Srinagar/Jammu</h2>" +
//     // "<div class='header-line'><p>website: <a href='samadhan.jk.gov.in' target='_blank'>samadhan.jk.gov.in</a></p>  <p>Email : <a href='mailto:jk-grievance@jk.gov.in' target='_blank'>jk-grievance@jk.gov.in</a></p></div>" +
//     "</div>" +
//     '<div class="content">' +
//     "<h3 style='font-weight: bold;'>Subject: Acknowledgement of Grievance Registration - " +
//     gID +
//     "</h3>" +
//     "<div class='para'> " +
//     "<p style='margin-bottom: 1.5rem;'>Sir/Madam " +
//     grvData.name +
//     ",</p>" +
//     "<p style='margin-bottom: 20px;'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Thank your for lodging your concern on the <b>CM Raabita Portal.</b> It has been registered under ID <b>" +
//     gID +
//     "</b> on <b>" +
//     formattedDate +
//     "</b> and has been forwarded to the <b>" +
//     grvData.department_name +
//     " Department</b>for redressal. For updates visit <b>https://samadhan.jk.gov.in</b>.</p>" +
//     // "<p style='margin-bottom: 2.5rem;'>For updates visit <b>https://samadhan.jk.gov.in</b>.</p>" +
//     // "<p style='margin-top: 3rem; margin-bottom: 5rem; text-align: right;'>Sincerely,</p>" +
//     "<p style='margin-bottom: 6px; font-weight: 800; text-align: right;'>Team Raabita</p>" +
//     "<div class='footer-lines' style='margin-top: 2rem; margin-bottom: 1.5rem;'>" +
//     "<p style='margin-bottom: 6px; text-align: right;'>CHIEF MINISTER'S SECRETARIAT</p>" +
//     "</div>" +
//     //    "<p>Civil Secretariat, Srinagar/ Jammu</p>" +

//     "<p class='text-right' style='font-size: 20px; margin-bottom: 4px; line-height: 30px; '>PUBLIC SERVICES & OUTREACH OFFICE (Raabita)</p>" +
//     "<p class='text-right' style='font-size: 20px; margin: 0px; line-height: 30px;'>Email: jkcm-raabita@jk.gov.in</p>" +

//     "</div>" +
//     "</div>";
//   }

//   var tempDiv = document.createElement("div");
//   tempDiv.id = "mainContainer";
//   tempDiv.innerHTML = template;
//   document.body.appendChild(tempDiv);

//   html2canvas(tempDiv).then((canvas) => {
//     var imgData = canvas.toDataURL("image/jpeg", 0.2); // Change to JPEG and set quality to 20%
//     var pdf = new jspdf.jsPDF("p", "mm", "a4");
//     var imgWidth = 210; // A4 width in mm
//     var pageHeight = 297; // A4 height in mm
//     var imgHeight = (canvas.height * imgWidth) / canvas.width;
//     var heightLeft = imgHeight;
//     var position = 0;

//     pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight;

//     while (heightLeft >= 0) {
//       position = heightLeft - imgHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//     }
//     pdf.save("AcknowledgementSlip.pdf");
//     var pdfBlob = pdf.output("blob");
//     console.log('Size of generated PDF (before compression):', pdfBlob.size, 'bytes');
//     uploadPDF(pdfBlob, gID);
//     document.body.removeChild(tempDiv);
//   });
// }

// function uploadPDF(pdfBlob, gID) {
//   var formData = new FormData();
//   formData.append("file", pdfBlob, "AcknowledgementSlip.pdf");
//   formData.append("gID", gID);

//   var settings = {
//     url: "uploadAckSlipPDF",
//     method: "POST",
//     data: formData,
//     processData: false,
//     contentType: false,
//     // timeout: 0,
//   };
//   $.ajax(settings).done(function (j) {
//     window.location.href = "home";
//   }).fail(function (jqXHR, textStatus, errorThrown) {
//     //console.error("Upload failed:", textStatus, errorThrown);
//   });
// }

function sendDocument(id, doc) {
  var d = chkV(id);
  var formData = new FormData();
  formData.append("d", d);
  formData.append("file", doc);

  var settings = {
    url: "sendDocument",
    method: "POST",
    //	"data": {d:c,file:cdd},
    data: formData,
    contentType: false,
    processData: false,
    //"timeout": 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    console.log(j);
    if (j.statusCode == "1") {
      alert("Grievance submitted successfully.");
      window.location.href = "home";
    } else {
      alert("Something went wrong");
      window.location.reload();
    }
  });
}

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


    //Naitik Changes on popup 09/10/2025

    if (!confirm("Are you sure that you want to submit Appeal?")) {
      return;
    }

    //Naitik Changes on pop up End 09/10/2025

    $("#submitAppeal").attr("disabled", true);

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

    // console.log(c);
    var d = chkV(c);
    //var cdd = JSON.stringify(docss1[0])
    let filenameadd = document.getElementById("fileUpAppeal").files[0];
    // var filenameadd;
    const formData = new FormData();
    //  if (!file) {
    //      // alert("Please select a file before uploading."); // Alert the user
    //     filenameadd = chkV(file)
    //  }else{
    //    filenameadd = chkV(file.name)
    //  }
    formData.append("files", filenameadd); //2007
    formData.append("d", d);

    console.log(filenameadd)
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

//////
function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>")
        .attr("value", value.values)
        .text(value.values.toUpperCase())
    );
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

$(".geoLoc").click(function () {
  getLocation();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  $("#latLongDiv").show();
  var lat = $("#lat").html(position.coords.latitude);
  var long = $("#long").html(position.coords.longitude);
  //$('#lat').val(lat);
  //$('#long').val(long);
}

$(document).on("click", ".view", function (e) {
  //console.log($(this).closest('tr').find('td:first').text());
  //console.log(e.target.value);
  var gId = e.target.value;
  var d = chkV(gId);
  // $("#gIdaction").val(d);
  // $("#submitgrievancedata").submit();
  // // window.location.href = "viewApp?d=" + d;
  window.open("viewApp?d=" + d, "_blank");
});

$(document).on("click", ".His", function (e) {
  //console.log($(this).closest('tr').find('td:first').text());

  let mobile = this.getAttribute("data-value");

  var gId = e.target.value;

  var c = JSON.stringify({
    radioVal: "JKSAMADHAN",
    gId: gId,
    mobile: mobile,
  });
  var d = chkV(c);

  // window.location.href = "historyGrievance?d=" + d;
  window.open('grievanceDatail?d=' + d, '_blank');

});

// SKY - 05 JAN 2023- modal for changing password - start
// var exampleModal = document.getElementById("exampleModal");
// exampleModal.addEventListener("show.bs.modal", function (event) {
//   var button = event.relatedTarget;
//   var recipient = button.getAttribute("data-bs-whatever");
//   var modalTitle = exampleModal.querySelector(".modal-title");
//   var modalBodyInput = exampleModal.querySelector(".modal-body input");
//   modalTitle.textContent = "Change Password ";
//   modalBodyInput.value = recipient;
// });
// SKY - 05 JAN 2023- modal for changing password - end

$(".chngPwd").click(function () {
  const currentPassword = $(".currentPwd").val();
  let newPassword = $(".newPwd").val();
  let cNewPassword = $(".cNewPwd").val();
  if (newPassword === cNewPassword) {
    //$(".chngPwd").prop("disabled", true);
  }
  alert(
    `current pwd : ` +
    currentPassword +
    ` new pwd : ` +
    newPassword +
    ` confirm new pwd : ` +
    cNewPassword
  );
});

$(document).ready(function () {
  let recognition;
  let isListening = true; // Track if currently listening

  function startListening() {
    if (isListening) {
      // Create a new SpeechRecognition object
      recognition = new webkitSpeechRecognition() || new SpeechRecognition();

      // Set recognition language to English (United States)
      recognition.lang = "en-US";

      // Event handler when speech recognition starts
      recognition.onstart = function () {
        console.log("Speech recognition started");
        $("#startButton").hide();
        $("#stopButton").show();
        isListening = true;
      };

      // Event handler for speech recognition results
      recognition.onresult = function (event) {
        // Get the latest transcription
        const transcript =
          event.results[event.results.length - 1][0].transcript;

        // Update the output element by appending the latest transcript with a space
        $("#output").text($("#output").text() + transcript + " ");
      };

      // Event handler when speech recognition ends
      recognition.onend = function () {
        console.log("Speech recognition ended");
        //alert(isListening)
        // Restart listening if still supposed to be listening
        if (isListening === true) {
          // alert(isListening)
          startListening();
        }
      };

      // Start speech recognition
      recognition.start();
    }
  }

  function stopListening() {
    if (isListening) {
      // Stop the speech recognition process
      recognition.stop();
      console.log("Speech recognition stopped");
      $("#startButton").show();
      $("#stopButton").hide();
      isListening = false; // Update listening status
    }
  }

  // Event listener for Start Listening button click
  $("#startButton").on("click", function () {
    isListening = true;
    startListening();
  });

  // Event listener for Stop Listening button click
  $("#stopButton").on("click", function () {
    stopListening();
  });
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

$("#yrLodgegrievance").on("hidden.bs.modal", function () {
  var x = document.getElementById("yrVideos");
  x.pause();
});

document.addEventListener("DOMContentLoaded", function () {
  // Hide the loader and show the content
  var loader = document.getElementById('loader');
  var content = document.getElementById('lodgecontent');
  loader.style.display = 'none';
  content.style.display = 'block';
});

//download pdf of grievance history on click naitik Changes 28/01/26

$(document).on("click", ".grievancepdf2", function (e) {

  // Temporarily hide elements you don't want in the PDF
  $('.no-print').hide();

  var element = document.getElementById('downloadgrpdf2');
  html2pdf().from(element).save().then(function () {
    // Show the elements again after the PDF is generated
    $('.no-print').show();
  });
});


$(document).on('click', '.grievancepdf', function () {
  var grievanceId = $(this).attr('data-grievance-id');

  $.ajax({
    url: url,
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

//Naitik Changes End 28/01/2026




//grievance history
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
  window.location.href = "grievanceDatail?d=" + d;
});

// Raabta - 04th December 2024 - SKY - Start
$("#lodgeRaabtaLink").on("click", function (e) {
  e.preventDefault();

  // Confirm dialog
  var userConfirmed = confirm(
    "Are you sure you want to proceed with Lodge Raabta? You can submit grievances through 'Lodge Grievance' as well."
  );

  if (userConfirmed) {
    var d = chkV("true");
    console.log(d)
    window.location.href = "lodgeRaabta?d=" + d;
  }
});


// Citizen Feedback - 29/01/2025
$('input[name="satisfied-feed"]').change(function () {
  if ($(this).val() === "No") {
    $(".noDiv").removeClass("visually-hidden");
  } else {
    $(".noDiv").addClass("visually-hidden");
  }
});
var ratingValue1, ratingValue2;

$(".rBtn1").on("click", ".rating1", function () {
  $(".rBtn1 .rating1").removeClass("rg-selectedBtn");
  $(this).addClass("rg-selectedBtn");
  ratingValue1 = $(this).text();
  //console.log("Selected rBtn1: " + ratingValue1);
});

$(".rBtn2").on("click", ".rating2", function () {
  $(".rBtn2 .rating2").removeClass("rg-selectedBtn");
  $(this).addClass("rg-selectedBtn");
  ratingValue2 = $(this).text();
  //console.log("Selected rBtn2: " + ratingValue2);
});

$(document).on("click", ".feedB-btn", function (e) {
  var satisfiedValue = $('input[name="satisfied-feed"]:checked').val() || "NA";
  var descriptionValue = satisfiedValue === "No" ? $("#desciption-box").val() : "NA";
  var callMsg = $('input[name="call-msg"]:checked').val() || "NA";
  var finalRating1 = ratingValue1 || "NA";
  var finalRating2 = ratingValue2 || "NA";
  // var processValue = $('input[name="process"]:checked').val() || "NA";
  var recommendValue = $('input[name="loading"]:checked').val() || "NA";

  //var grvId =$('#fBack').val();
  let grvId = this.getAttribute("value");
  //console.log(gId)

  // Log the values
  if (
    satisfiedValue != "NA" &&
    callMsg != "NA" &&
    finalRating1 != "NA" &&
    finalRating2 != "NA" &&
    // processValue != "NA" &&
    recommendValue != "NA" &&
    !(satisfiedValue === "No" && descriptionValue == "")
  ) {
    // encrypting varaibles and passing through endpoint
    var c = JSON.stringify({
      satisfiedValue: satisfiedValue,
      descriptionValue: descriptionValue,
      callMsg: callMsg,
      finalRating1: finalRating1,
      finalRating2: finalRating2,
      // processValue: processValue,
      recommendValue: recommendValue,
      grvId: grvId,
      sessionvalue: $('#sessionvalue').val(),
      sessionname: $("#sessionname").val()
    });
    console.log(c)
    var d = chkV(c);
    console.log(d)
    var settings = {
      url: cp + "getFeedbackData?d=" + d,
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    $.ajax(settings).done(function (j) {
      j = JSON.parse(setV(j));
      //console.log(j);
      if (j.statusCode == "1") {
        alert(
          "Feedback submitted successfully. Your feedback is valuable to us. Thank you!"
        );
        window.location.reload();
      } else if (j.statusCode == "2") {
        alert("Feedback already received for " + grvId + ".");
      } else if (j.statusCode == "3") {
        alert("Form bombarding not allowed");
      } else {
        alert("Something went wrong.");
      }
      // window.location.reload();
    });
  } else {
    alert("All fields are mandatory!");
  }
});
// Citizen Feedback - 29/01/2025



/////////NEW FEEDBACK DATA NAITIK CHANGES 29/12/2025///////////////////////////////////////////////////////


$('#feedBackM').on('shown.bs.modal', function () {

  // Reset form
  $('input[name="experience"]').prop('checked', false).prop('disabled', false);
  $('input[name="time-satisfaction"]').prop('checked', false).prop('disabled', false);
  $('input[name="reuse-portal"]').prop('checked', false).prop('disabled', false);
  $('#Newdescription-box').val('').prop('readonly', false);
  $('.noDiv').addClass('visually-hidden');

  // remove old handlers
  $(document).off("click", ".feedB-btn");

  // attach handler
  $(document).on("click", ".feedB-btn", function (e) {
    e.preventDefault();

    const overallExperience = $('input[name="experience"]:checked').val();
    const poorReasonRaw = $('#Newdescription-box').val().trim();
    const timeSatisfaction = $('input[name="time-satisfaction"]:checked').val();
    const reusePortal = $('input[name="reuse-portal"]:checked').val();
    const grvId = $(this).val();

    if (!overallExperience || !timeSatisfaction || !reusePortal) {
      alert("All fields are mandatory!");
      return;
    }

    // Poor reason check
    if (overallExperience === "Poor") {
      if (poorReasonRaw === "") {
        alert("Please specify reason for poor experience");
        return;
      }

      if (poorReasonRaw.length > 255) {
        alert("Reason for poor experience cannot exceed 255 characters");
        return;
      }
    }

    const payload = JSON.stringify({
      grvId: grvId,
      overallExperience: overallExperience,
      poorReason: overallExperience === "Poor" ? poorReasonRaw : "NA",
      timeSatisfaction: timeSatisfaction,
      reusePortal: reusePortal
    });

    const d = chkV(payload);

    $.ajax({
      url: cp + "/user/getNewFeedbackData?d=" + d,
      type: "POST",
      success: function (resp) {
        const res = JSON.parse(setV(resp));

        if (res.statusCode === "1") {
          alert("Feedback submitted successfully. Your feedback is valuable to us. Thank you!");
          location.reload();
        } else if (res.statusCode === "2") {
          alert("Feedback already submitted");
        } else {
          alert("Server error, please try again later");
        }
      },
      error: function () {
        alert("Server error, please try again later");
      }
    });
  });
});


$('input[name="experience"]').on("change", function () {
  if ($(this).val() === "Poor") {
    $(".noDiv").removeClass("visually-hidden");
  } else {
    $(".noDiv").addClass("visually-hidden");
    $('#Newdescription-box').val("");
  }
});

//Naitik changes End for New Feedback form 30/12/2025


// ===== Auto-open Update Profile tab if redirected from profile check =====
// Naitik changes [today's date]

$(document).ready(function () {
  if (window.location.hash === '#profile-update-details') {

    var $tabBtn = $('[data-bs-target="#profile-update-details"]');

    if ($tabBtn.length) {
      setTimeout(function () {

        // Activate the Bootstrap tab
        $tabBtn.tab('show');

        // Smooth scroll to tab
        $('html, body').animate({
          scrollTop: $tabBtn.offset().top - 80
        }, 400);

        // Pre-fill the form with existing data
        loadUserProfile();

        // Clean hash from URL without page reload
        history.replaceState(null, '', window.location.pathname);

      }, 300);
    }
  }
});

// ===== End Auto-open Update Profile tab =====