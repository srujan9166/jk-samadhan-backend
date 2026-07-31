$(function () {
  // for back btn
  $(".cBb").on('click', function () {
  // Check if there's a history to go back to
              if (window.history.length > 1) {
                 // window.history.back();
  			   window.history.go(-1); // Go back to the previous page
              } else {
                  // Redirect to a default page if no history
                  window.location.href = "home";
              }
   });
  // select2
  $(".multi-select2").select2({
    placeholder: "",
    allowClear: true, // Optional, adds a clear button
  });
 
  let selectedValue = $('input[name="search-mod-app"]:checked').val();
  $("#tblHeading").html("JK-SAMADHAN Grievances");

  if (window.location.href.indexOf("/efile") != -1) {
    defaultFunction(selectedValue, "null");
  }

});

// const Listen = (doc) => {
//   return {
//     on: (type, selector, callback) => {
//       doc.addEventListener(
//         type,
//         (event) => {
//           if (!event.target.matches(selector)) return;
//           callback.call(event.target, event);
//         },
//         false
//       );
//     },
//   };
// };

// Listen(document).on("click", ".closeLogout", function (e) {
//   this.closest("form").submit();
// });

$('input[name="search-mod-app"]').change(function () {
  selectedValue = $('input[name="search-mod-app"]:checked').val();
  if (selectedValue == "jkigrams") {
    $("#tblHeading").html("JK-IGRAMS Grievances");
  } else if (selectedValue == "cpgrams") {
    $("#tblHeading").html("CPGRAM Grievances");
  } else {
    $("#tblHeading").html("JK-SAMADHAN Grievances");
  }
  $(".masterModuleDiv").addClass("d-none");
  defaultFunction(selectedValue, "null");
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

$(".searchbtn").on('click', function () {
	selectedValue = $('input[name="search-mod-app"]:checked').val();
	var keyWords = getSelectedValuesMsel("#categories", ", ", []);
	defaultFunction(selectedValue, keyWords);
     }); 

function defaultFunction(radioVal, keyWords) {
  var c = JSON.stringify({
    radioVal: radioVal,
    keyWords: keyWords,
  });
  var d = chkV(c);
  var settings = {
    url: "searchModuleApi?d=" + d,
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
    defaultTable(j.data, radioVal);
  });
}

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

let datatTable;
function defaultTable(data, radioVal) {
  let columns = [];

  if (radioVal == "jksamadhan") {
    columns = [
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
          } else if (data === "dnpToOffice") {
            var st = "Does not pertain";
            return (
              '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
              st +
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
            '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vDetails" title="Details" value = "' +
            data +
            '"></button>';
          return btn + "</div>";
        },
      },
    ];
  } else if (radioVal == "jkigrams") {
    columns = [
      {
        title: "S. No.",
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
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
        data: "current_status",
        defaultContent: "",
        title: "Status",
        // render: function (data, type, row, meta) {
        //   if (data === "Pending") {
        //     return (
        //       '<div class="btn btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' +
        //       data +
        //       "</div>"
        //     );
        //   } else if (data === "Acknowledged") {
        //     return (
        //       '<div class="btn btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' +
        //       data +
        //       "</div>"
        //     );
        //   } else if (data === "Under Process") {
        //     return (
        //       '<div class="btn btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' +
        //       data +
        //       "</div>"
        //     );
        //   } else if (data === "Rejected") {
        //     return (
        //       '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' +
        //       data +
        //       "</div>"
        //     );
        //   } else if (data === "Resolved") {
        //     return (
        //       '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' +
        //       data +
        //       "</div>"
        //     );
        //   } else if (data === "Appealed") {
        //     return (
        //       '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
        //       data +
        //       "</div>"
        //     );
        //   } else if (data === "Closed") {
        //     return (
        //       '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
        //       data +
        //       "</div>"
        //     );
        //   }
        //   {
        //     var st = "Does not pertain to this department";
        //     return (
        //       '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
        //       st +
        //       "</div>"
        //     );
        //   }
        // },
      },
      {
        data: "pending_at",
        defaultContent: "",
        title: "Pending With",
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
      //         '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary vDetails" value = "' +
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
      {
        data: "reference_id",
        defaultContent: "",
        class: "noExport",
        title: "Action",
        render: function (data, type, row, meta) {
          var btn =
            '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vDetails" title="Details" value = "' +
            data +
            '"></button>';
          return btn + "</div>";
        },
      },
    ];
  } else if (radioVal == "cpgrams") {
    columns = [
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
        data: "letter_date",
        defaultContent: "",
        title: "Submitted On",
      },
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
          } else if (data === "Appealed") {
            return (
              '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
              data +
              "</div>"
            );
          } else if (data === "Closed") {
            return (
              '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
              data +
              "</div>"
            );
          }
          {
            var st = "Does not pertain to this department";
            return (
              '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' +
              st +
              "</div>"
            );
          }
        },
      },

      {
        data: "registration_no",
        defaultContent: "",
        class: "noExport",
        title: "Action",
        render: function (data, type, row, meta) {
          var btn =
            '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vDetails" title="Details" value = "' +
            data +
            '"></button>';

          return btn + "</div>";
        },
      },
    ];
  }

  try {
    datatTable.destroy();
  } catch (error) {}
  $("#searchModuleDT").empty();

  $(".btn-customBtn").on("click", function () {
    datatTable132.button("." + $(this).val()).trigger();
  });

  datatTable132 = $("#searchModuleDT").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10],
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
}

$(document).on("click", ".vDetails", function (e) {
  $(".descHis").html("");
  $(".descHisDoc").html("");
  $(".descHisDocCitz").html("");
  var c = JSON.stringify({
    radioVal: $('input[name="search-mod-app"]:checked').val(),
    gId: e.target.value,
  });
  // console.log(c);
  let d = chkV(c);
  var settings = {
    url: "searchModuleApi2?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log(j.data[0].updated_on);
    // console.log(j.data[0]);
    console.log(j.hisQdata);
    if ((statusCode = "1")) {
      // For Grievance Details
      $("#gId").html(j.data[0].uniqid);
      $("#name").html(j.data[0].name);
      $("#mobile").html(j.data[0].mobile);
      $("#email").html(j.data[0].submitted_by);
      $("#address").html(j.data[0].address);
      $("#department").html(j.data[0].department);
      $("#category").html(j.data[0].category);
      $("#description").html(j.data[0].description);
      $("#submitted").html(j.data[0].createddate);
      $("#latitude").html(j.data[0].latitude);
      $("#longitude").html(j.data[0].longitude);

      // For Desc Grievance History
      if (j.hisQdata.length > 0) {

        // Filter out non-null/empty dept_file_name values and map to get dept_file_name and dept_name
        var validDeptDetails = j.hisQdata
          .filter(function (item) {
            return item.dept_file_name && item.dept_file_name.trim() !== "";
          })
          .map(function (item) {
            return {
              uploadedby: item.action_taken_by,
              depdocument: item.depdocument,
              dept_file_name: item.dept_file_name,
              updatedon: format_date(item.updated_on)
            };
          });
        // Display the valid dept_file_name and dept_name values in the console
        validDeptDetails.forEach(function (detail) {
          var newDiv2 = $("<div></div>");
          newDiv2.html(
            '<div class="status">Uploaded By: ' + detail.uploadedby + '</div>' +
            '<div class="remarks">File Name: ' + detail.dept_file_name + '</div>' +
            '<div class="timestamp">' + detail.updatedon + '</div>' +
            '<div class="updated-by" style="margin-top: -10px;">' +
            '<a class="btn-view btn-pur fileViewer" href="#" data-filename="' + detail.depdocument + '" data-name="' + detail.dept_file_name + '" title="View"><i class="bi bi-eye-fill"></i></a>' +
            //'<a class="btn-view btn-blue fileDownloader" title="Download"><i class="bi bi-cloud-arrow-down-fill"></i></a>' +
            '</div>'
        );
        newDiv2.addClass("created-div"); // Optionally add a class
        $(".descHisDoc").append(newDiv2);
        $(".descHisDoc").removeClass("d-none");
        });

            // Filter out non-null/empty citizen file values and map to get file path url and name
            var validCitizenDetails = j.hisQdata
            .filter(function (item) {
              return item.file_name && item.file_name.trim() !== "";
            })
            .map(function (item) {
              return {
                uploadedby: item.submitted_by,
                citizendocument: item.file_path,
                file_name: item.file_name,
                updatedon: format_date(item.updated_on)
              };
            });
          // Display the valid dept_file_name and dept_name values in the console
          validCitizenDetails.forEach(function (detail) {
            var newDiv3 = $("<div>CITIZEN DOC's</div>");
            newDiv3.html(
              '<div class="status">Uploaded By: ' + detail.uploadedby + '</div>' +
              '<div class="remarks">File Name: ' + detail.file_name + '</div>' +
              '<div class="timestamp">' + detail.updatedon + '</div>' +
              '<div class="updated-by" style="margin-top: -10px;">' +
              '<a class="btn-view btn-pur fileViewer" href="#" data-filename="' + detail.citizendocument + '" data-name="' + detail.file_name + '" title="View"><i class="bi bi-eye-fill"></i></a>' +
              //'<a class="btn-view btn-blue fileDownloader" title="Download"><i class="bi bi-cloud-arrow-down-fill"></i></a>' +
              '</div>'
          );
          newDiv3.addClass("created-div"); // Optionally add a class
          $(".descHisDocCitz").append(newDiv3);
          $(".descHisDocCitz").removeClass("d-none");
          });

        for (var i = 0; i < j.hisQdata.length; i++) {
          // Replace null or empty values with '-'
          var status = j.hisQdata[i].status ? j.hisQdata[i].status : "";
          var remarks = j.hisQdata[i].remarks ? j.hisQdata[i].remarks : "";
          var updated_on = j.hisQdata[i].updated_on ? j.hisQdata[i].updated_on : "";
          var action_taken_by = j.hisQdata[i].action_taken_by ? j.hisQdata[i].action_taken_by : "";
          var action_taken = j.hisQdata[i].action_taken ? j.hisQdata[i].action_taken : "";

          console.log(updated_on);

          // Create a new div element
          var formatedDate = updated_on === '' ? updated_on : format_date(updated_on);
          var newDiv = $("<div></div>");
                  // Add content to the div
                  newDiv.html(
                    '<div class="status">Status: ' + status + '</div>' +
                    '<div class="remarks">Remarks: ' + remarks + '</div>' +
                    '<div class="remarks">' + action_taken + '</div>' +
                    '<div class="timestamp">' + formatedDate + '</div>' +
                    '<div class="updated-by">' + action_taken_by + '</div>'
                );
          newDiv.addClass("created-div"); // Optionally add a class
          // Append the new div to the descHis container
          $(".descHis").append(newDiv);
        }
        $(".descHis").removeClass("d-none");
      } else {
        $(".descHis").addClass("d-none");
        $(".descHisDoc").addClass("d-none");
      }

      // show Master Div
      $(".masterModuleDiv").removeClass("d-none");
      // smooth scroll on click.
      $('.masterModuleDiv')[0].scrollIntoView({ behavior: 'smooth' });
    } else {
      $(".masterModuleDiv").addClass("d-none");
      alert("No Data Available.");
    }
  });
});


 // Handle click on fileViewer links to open in a popup window
 $(document).on("click", ".fileViewer", function(e) {
	//debugger
  e.preventDefault();
  var filename = $(this).data("filename");
  var name = $(this).data("name");
  var url = "/fileViewer?filename=" + chkV(filename) + "&name=" + name;
  var width = 800;
  var height = 600;
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;

  // Open popup window
  window.open(url, "_blank", "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top);
});