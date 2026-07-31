$(document).ready(function () {



  if (window.location.href.indexOf("/getCitizenList") != -1) {
    stateList();
  }

  var userType = $('#userType').val();
  var dm_district = $('#dm_district').val();
  // console.log(userType)
  // For DM user
  setTimeout(function () {
    if (userType === 'ROLE_DM') {
      var state = "JAMMU AND KASHMIR";

      // Clear and set the state dropdown
      $("#stateFilter").html('');
      $("#stateFilter").append($("<option></option>").attr("value", state).text(state).prop("selected", true));

      $("#stateFilter").attr("disabled", true);
      $("#stateFilter").trigger("change");

      setTimeout(function () {
        $("#districtFilter").append($("<option></option>").attr("value", dm_district).text(dm_district).prop("selected", true));
        $("#districtFilter").attr("disabled", true);
        $("#districtFilter").trigger("change");
      }, 200)

    }
  }, 100);



  // for avg time taken by department 11/12/2025
  if (window.location.href.indexOf("/avgttByDept") != -1) {
    avgTTRptFunc();

  }
  // 11/12/2025

  var activeTabValue = $(".switcherDiv .nav-link.active").val();
  //console.log(activeTabValue);



  if (window.location.href.indexOf("/home") != -1) {
    DMData(activeTabValue);
  }

  $(".custBtn").click(function () {

    DMData(this.value);

  });


  if (window.location.href.indexOf("/deptSummary") != -1) {
    fetchDeptSummaryRpt();
  }

  if (window.location.href.indexOf("/getCitizenList") != -1) {
    citRegFunc();
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

  if (window.location.href.indexOf("/agePendingPage") != -1) {
    $(".data-whichWise:checked").trigger("change");
    // ageAreportData();
  }

  if (window.location.href.indexOf("/detailedviewUW") != -1) {
    var dataFromStorage = sessionStorage.getItem("data");
    if (dataFromStorage) {
      detailedViewForUW(dataFromStorage);
    } else {
      detailsUserWiseTbl(0);
    }
  }
});


function DMData(origin) {
  var c = JSON.stringify({ origin: origin });
  var d = chkV(c);
  var settings = {
    url: "DMData?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    console.log(j);

    getGrievList(j.data)

    $('#total').text(j.counts[0].total_count);
    $('#pending').text(j.counts[0].pending_count);
    $('#resolved').text(j.counts[0].resolved_count);
    $('#rejected').text(j.counts[0].rejected_count);
    $('#appealed').text(j.counts[0].appealed_count);
    $('#dnp').text(j.counts[0].dnp_count);
    $('#remark').text(j.counts[0].remarkadded_count);
  });
}

var table128;
function getGrievList(data) {

  table128 = $("#YRreport").DataTable({
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
        data: "category",
        defaultContent: "",
        title: "Category",
      },
      {
        data: "createddate",
        defaultContent: "",
        title: "Submitted Date",
      },
      {
        data: "department",
        defaultContent: "",
        title: "Department",
      },

      {
        data: "appflag",
        defaultContent: "",
        title: "Origin",
      },
      {
        data: "action",
        defaultContent: "",
        title: "District Status",
        render: function (data, type, row, meta) {
          data = (data == "Under Process" || data == "Acknowledged" || data == "Forwarded") ? "Pending" : data;
          return data;
        },
      },
      {
        data: "status",
        defaultContent: "",
        title: "Administrative Status",
      },
      {
        data: "",
        defaultContent: "",
        title: "Action",
        render: function (data, type, row, meta) {
          return " <button class='btn btn-sm btn-primary vHis' value=" + row.origin + ">Grievance details </button>";
        },
      },

    ],
  });

  $("#YRreport_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table135.search(cleanValue).draw(); // Update DataTable search
  });

}

// var table128 = $('#YRreport').DataTable( {
//   //  data: j,
//     destroy: true,
//     lengthMenu:[5,10,25],
//     pageLength: 10, 
//     //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
//     buttons: [
//       {
//         extend: "excel",
//         title: "JKGOVT",
//         messageTop: "The information in this table is copyright to JK GOVT.",
//         exportOptions: {
//           columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
//       }
//       },
//       {
//         extend: "pdf",
//         title: "JKGOVT",
//         messageBottom:
//           "The information in this table is copyright to JK GOVT.",
//         pageSize: "A4",
//         download: "open",
//         customize: function (doc) {
//           // Set the page orientation and size
//           doc.pageSize = 'A4';
//           doc.pageOrientation = 'landscape';

//           // Adjust the content styling
//           doc.styles.tableHeader.fontSize = 8;
//           doc.styles.tableBodyOdd.fontSize = 8;
//           doc.styles.tableBodyEven.fontSize = 8;

//            // Center the table content
//            var rowCount = doc.content[1].table.body.length;
//            for (var i = 0; i < rowCount; i++) {
//                var row = doc.content[1].table.body[i];
//                for (var j = 0; j < row.length; j++) {
//                    row[j].alignment = 'center';
//                }
//            }

//           // Scale the table width to fit the page
//           var totalColumns = doc.content[1].table.body[0].length;
//           var columnWidths = [];
//           for (var i = 0; i < totalColumns; i++) {
//               columnWidths.push('*');
//           }
//           doc.content[1].table.widths = columnWidths;
//       },
//       exportOptions: {
//           columns: ':not(.noExport)' // Exclude columns with the class 'noExport'
//       }
//       },
//     ],
//       }); 

function uWRptData(radioVal) {
  var c = JSON.stringify({ val: radioVal });
  var d = chkV(c);
  var settings = {
    url: "uWRptDataApiDM?d=" + d,
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
  $(".whichWiseHeading").text(headingText);
}



function citRegFunc() {


  // alert("Hello")
  // var usdd = $("#usrVV").val();

  // Filter table on radio button click
  //  Default value is All i.e is home
  var localFilterVal = "home";
  $(document).on("click", ".data-search", function () {
    var filteredValue = $(this).val();
    //console.log("filteredValue :: " + filteredValue);
    // override localFilterVal based on the click event
    localFilterVal = filteredValue;
    table181.ajax.reload();
  });

  //  Filter table on clickable dashbaord tabs
  // Defualt Value is All i.e is Total
  var localClickVal = "Total";
  $(document).on("click", ".filterData", function () {
    var clickedValue = $(this).attr("data-value");
    // console.log("clickedValue :: " + clickedValue);
    // override localFilterVal based on the click event
    localClickVal = clickedValue;
    table181.ajax.reload();
  });


  // from / on date filter
  var fdFilterVal = "0";
  $(document).on("change", "#dateFrom", function (e) {
    var filteredValue = e.target.value;
    fdFilterVal = filteredValue;
    // console.log("fdFilterVal : " + fdFilterVal)
    table181.ajax.reload();
  });

  // to date filter
  var tdFilterVal = "0";
  $(document).on("change", "#dateTo", function (e) {
    var filteredValue = e.target.value;
    tdFilterVal = filteredValue;
    // console.log("tdFilterVal : " + tdFilterVal)
    table181.ajax.reload();
  });

  // district filter
  var districtFilterVal = "0";
  $("#districtFilter").change(function () {
    var filteredValue = $(this).val();
    districtFilterVal = filteredValue;
    // console.log("districtFilterVal : " + districtFilterVal)
    table181.ajax.reload();
  })

  //naitik start

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
    //  alert("fff")
    $("#districtFilter").html('')
    $("#districtFilter").append('<option value="0">--Select District--</option>');

    // Reset dependent filters
    stateFilterVal = '0';
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

      // console.log(j)
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

    // console.log("Municipality selected:", selectedMunicipalityId);

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
    // console.log("Ward selected:", selectedWardId);
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

    //console.log("Block selected:", selectedBlockId);

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
    // console.log("Panchayat selected:", selectedPanchayatId);
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


  //naitik end


  var column = [
    {
      title: "S. No.",
      orderable: false, // Disable sorting for this column
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
      title: "Region",
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

    // {
    //   data: "mode",
    //   defaultContent: "",
    //   title: "Registered From",
    // },

  ];

  var table181 = $("#citizenRegtbl").DataTable({
    serverSide: true, // Enable server-side processing
    processing: true, // Show a loading indicator
    scrollX: true, // Horizontal Scroll
    ajax: {
      url: "getCitizenListDM",
      type: "POST",
      contentType: "application/json",
      data: function (d) {
        d.filterValue = localFilterVal; // Send filteredValue with the value of selected radio button
        d.clickedValue = localClickVal; // Send clickedValue with the value of clicked dashboard tab

        // SKY - 06/02/2025
        d.fdFilterVal = fdFilterVal; // For Filtering based on selected from / on date
        d.tdFilterVal = tdFilterVal; // For Filtering based on selected to date
        // SKY - 06/02/2025
        // d.districtFilterVal = districtFilterVal; // For Filtering based on selected district
        d.districtFilterVal = districtFilterVal; // For Filtering based on selected district
        d.stateFilterVal = stateFilterVal;
        d.municipalityFilterVal = municipalityFilterVal;
        d.wardFilterVal = wardFilterVal;
        d.blockFilterVal = blockFilterVal;
        d.panchayatFilterVal = panchayatFilterVal;


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
          // columnWidths.push("auto"); // Adjust others similarly if needed

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
    order: [[4, "desc"]], // Default sorting by the second column (Grievance ID i.e uniqid)
    lengthMenu: [10, 50, 100, 500, 1000], // Page length options
    pageLength: 10, // Default page length
  });

  $("#citizenRegtbl_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table181.search(cleanValue).draw(); // Update DataTable search
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
      table181.ajax.reload();
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
            columns: table181.settings().init().columns, // Pass column definitions
          })
        ),
        success: function (response) {
          var allData = response.data;
          //console.log(allData)
          var originalData = table181.data().toArray(); // Backup current data
          //console.log(originalData)

          // Temporarily load all data into DataTable for export
          table181.clear().rows.add(allData).draw(false);

          // Trigger export
          // $.fn.dataTable.ext.buttons[exportType + "Html5"].action.call(this, e, table181, button, config);
          table181.button(btn).trigger();

          // Restore original data
          table181.clear().rows.add(originalData).draw(false);
        },
        error: function (xhr) {
          console.error("Failed to fetch all data for export", xhr);
          table181.processing(false); // Disable processing if error occurs
        },
      });
    }
  });


  $(".btnmis-customBtn").on("click", function () {
    // console.log("." + $(this).val())
    var btn = $(this).val();
    if (btn === "buttons-reset") {
      // console.log(btn)
      // Reset all radio buttons and select the "All" radio button
      $("input[name='total-app']").prop("checked", false); // Uncheck all radio buttons
      $("#total-all-search").prop("checked", true); // Check the "All" radio button (id: total-all-search)

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
            start: 0, // Request all data from the backend
            length: -1, // Indicate fetch-all


            filterValue: localFilterVal, // Send filteredValue with the value of selected radio button
            clickedValue: localClickVal, // Send clickedValue with the value of clicked dashboard tab

            // SKY - 06/02/2025
            fdFilterVal: fdFilterVal, // For Filtering based on selected from / on date
            tdFilterVal: tdFilterVal, // For Filtering based on selected to date
            // SKY - 06/02/2025
            districtFilterVal: districtFilterVal, // For Filtering based on selected district
            //   stateFilterVal: stateFilterVal, // For Filtering based on selected district



            columns: table181.settings().init().columns, // Pass column definitions
          })
        ),
        success: function (response) {
          var allData = response.data;
          //console.log(allData)
          var originalData = table181.data().toArray(); // Backup current data
          //console.log(originalData)

          // Temporarily load all data into DataTable for export
          table181.clear().rows.add(allData).draw(false);

          // Trigger export
          // $.fn.dataTable.ext.buttons[exportType + "Html5"].action.call(this, e, table181, button, config);
          table181.button(btn).trigger();

          // Restore original data
          table181.clear().rows.add(originalData).draw(false);
        },
        error: function (xhr) {
          console.error("Failed to fetch all data for export", xhr);
          table181.processing(false); // Disable processing if error occurs
        },
      });
    }
  });


}

var tdFilterVal = "0";
$(document).on("change", "#dateTo", function (e) {
  var filteredValue = e.target.value;
  tdFilterVal = filteredValue;
  // console.log("tdFilterVal : " + tdFilterVal)
  table181.ajax.reload();
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

function ageAreportData(radioVal) {
  var c = JSON.stringify({ val: radioVal });
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
    getAgeAnalysis(j.data, radioVal);
  });
}

//var globalMISRadioValue;
var globalMISRadioValue = "userwise";
$(document).on("change", ".data-whichWise", function (e) {
  // alert(e)
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

  if (window.location.href.indexOf("/agePendingPage") != -1) {
    agePendingAreportData(chckRadioVal);
  }
});

function getAgeAnalysis(data, radioVal) {

  $(".btnAA-customBtn").on("click", function () {
    table139.button("." + $(this).val()).trigger();
  });
  // console.log(radioVal);
  var reprotType = $('.reportType').val();

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
        title: "Department",
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
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push('auto');
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
  $(".whichWiseHeading").text(headingText);
}


function conPenrptData(radioVal) {

  console.log(radioVal)
  var c = JSON.stringify({ val: radioVal });
  var d = chkV(c);
  var settings = {
    url: "conPenrptDataApiDM?d=" + d,
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
  $(".whichWiseHeading").text(headingText);
}



const Listen = (doc) => {
  return {
    on: (type, selector, callback) => {
      doc.addEventListener(type, (event) => {
        if (!event.target.matches(selector)) return;
        callback.call(event.target, event);
      }, false);
    }
  }
};

Listen(document).on('click', '.closeLogout', function (e) {
  this.closest('form').submit();
});

$(".btn-customBtn").on("click", function () {
  // console.log($(this).val());
  table128.button("." + $(this).val()).trigger();
});






$(document).on("click", ".grevP", function () {
  //console.log($(this).closest('tr').find('td:first').text());
  var gId = $(this).closest('tr').find('td:first').text();
  var d = chkV(gId);
  window.location.href = "forwardedApp?gId=" + d;
});


// $(document).on("click", ".vHis", function () {
//   let d = $(this).closest("tr").find("td:first").text();
//   // window.open("historyGrievance?d=" + d, "_blank");
//   window.location.href = "historyGrievance?d=" + d;
// });

// $(document).on("click", ".vHis", function (e) {
//   let c = $(this).closest("tr").find("td:first").text();
//   let d = chkV(c);
//   // window.open("historyGrievance?d=" + d, "_blank");
//   window.location.href = "historyGrievance?d=" + d;
// });

$(document).on("click", ".vHis", function (e) {
  $(".descHis").html("");
  $(".descHisDoc").html("");
  $(".descHisDocCitz").html("");
  var appflag = $(this).val();

  console.log(appflag)
  console.log($(this).closest("tr").find("td").eq(1).text())

  var c = JSON.stringify({
    radioVal: appflag,
    gId: $(this).closest("tr").find("td").eq(1).text()
  });
  let d = chkV(c);
  // window.location.href = "grievanceDatail?d=" + d;
  window.open("grievanceDatail?d=" + d, "_blank");
});

$(document).on("click", ".procGrev", function () {
  // get value(status) of a selected radio button
  /*let selectedValue = $('input[name="actionCheckBox"]:checked').val();
  if (selectedValue == "Others") {
    selectedValue = $(".statusOthersInput").val();
  } else if (selectedValue != "Others") {
    $(".statusOthersInput").hide();
  }*/
  // storing values from process-grievance having className's
  var gervId = $(".gGrevId").text();
  //console.log(gervId)
  // var status = selectedValue;
  var remarks = $(".stRemarks").val();
  var dateTime = $(".stDateTime").val();
  // var uploadPhoto = $(".stUploadPhoto").val();
  //   console.log(status : ` + status + ` remarks : ` + remarks + ` dateTime : ` + dateTime + ` uploadPhoto : + uploadPhoto)
  if (!remarks == "") {
    var c = JSON.stringify({
      greiveanceId: gervId,
      //finalStatus: status,
      remarks: remarks,
      //  dateTime: dateTime,
    });
  } else {
    alert("Please Enter Remark")
    return false;
  }
  // encrypting object

  var d = chkV(c);
  // file upload
  // let file = document.getElementById("stUploadPhoto1").files[0];
  const formData = new FormData();
  //formData.append("file", file);
  formData.append("d", d);
  // ajax call
  var settings = {
    //url: "grievanceForm?d=" + d,
    url: "updateDmRemark",
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
    console.log(j);
    if (j.statusCode == 1) {
      //console.log(j.data);
      alert("Remark  processed successfully.");
      window.location.href = "home";
    } else {
      alert("Something went wrong");
      //  window.location.reload();
    }
  });

});

var deptSummListGlobal;

$("#filterDept").change(function () {
  var filteredDeptValue = $("#filterDept").find(":selected").val();

  if (filteredDeptValue != "0" && filteredDeptValue != "" && filteredDeptValue != " ") {
    // Filter the deptSummListGlobal array based on the selected department value
    var filteredData = deptSummListGlobal.filter(function (checkDept) {
      return checkDept.department != null && checkDept.department == filteredDeptValue;
    });

    // Update the DataTable with the filtered data
    $('#deptSummRpt').DataTable().clear().rows.add(filteredData).draw();
  } else {
    // If no specific department is selected, show all data
    $('#deptSummRpt').DataTable().clear().rows.add(deptSummListGlobal).draw();
  }
});


function fetchDeptSummaryRpt() {
  var settings = {
    url: "deptSummRptApi",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));

    deptSummListGlobal = j.data;

    $(".btn-customBtn").on("click", function () {
      table159.button("." + $(this).val()).trigger();
    });

    var table159 = $("#deptSummRpt").DataTable({
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
              columnWidths.push('auto');
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
          data: "department",
          defaultContent: "",
          title: "Department"
        },
        {
          data: "total",
          defaultContent: "",
          title: "Total Grievances",
          render: function (data, type, row) {
            var dataAttributes =
              row.totalgrvids == null
                ? 'data-grvid="NA"'
                : 'data-grvid="' + row.totalgrvids + '"';
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
          data: "pending",
          defaultContent: "",
          title: "Pending Grievances"
        },
        {
          data: "resolved",
          defaultContent: "",
          title: "Resloved Grievances"
        },
        {
          data: "rejected",
          defaultContent: "",
          title: "Rejected Grievances"
        },
        {
          data: "appealed",
          defaultContent: "",
          title: "Appealed Grievances"
        },
      ]
    });
  });
}

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
      console.error(xhr);
    },
  });
});


$(".card-box").on("click", function () {

  if (this.innerHTML.includes("Pending")) {
    table128.column(6).search("Pending", true, false).draw();
  } else if (this.innerHTML.includes("Resolved")) {
    table128.column(6).search("Resolved", true, false).draw();
  } else if (this.innerHTML.includes("Appealed")) {
    table128.column(6).search("Appealed", true, false).draw();
  } else if (this.innerHTML.includes("Rejected")) {
    table128.column(6).search("Rejected", true, false).draw();
  } else if (this.innerHTML.includes("Does Not Pertain")) {
    table128.column(6).search("dnpToOffice", true, false).draw();
  } else if (this.innerHTML.includes("Remark Added")) {
    table128.column(6).search("Remark Added", true, false).draw();
  } else {
    table128.column(6).search("", true, false).draw();
  }
})



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

(function () {
  const muniRadioId = 'municipality-search';
  const blockRadioId = 'block-search';
  const muniWrapId = 'municipalityDropdowns';
  const blockWrapId = 'blockDropdowns';
  const muniSelects = ['Municipalityfilter', 'WardFilter'];
  const blockSelects = ['Blockfilter', 'Panchayatfilter'];
  const get = id => document.getElementById(id);
  const log = (...args) => { if (window.console) console.log('[area-filter]', ...args); };

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

//Naitik Changes End

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

    console.log(j)
  });
}

function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>").attr("value", value.values).text(value.values)
    );
  });
}

// Naitik Changes Start 30/01/2026
$(document).on('click', '.grievancepdf', function () {
  var grievanceId = $(this).attr('data-grievance-id');

  $.ajax({
    url: cp + "/DM/downloadPdfHistory",
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
// Naitik Changes End 30/01/2026

/// New chnages by utkarsh  hyperlink working for age analysis report - start
if (window.location.href.indexOf("/dviewAge") != -1) {
  var dataFromStorage1 = sessionStorage.getItem("actiondata2");
  if (dataFromStorage1) {
    detailedviewAge1(dataFromStorage1);
  } else {
    detailedviewAge1(0); // called with 0 when no session data
  }
}


$(document).on("click", ".action-btn2", function (e) {
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
  var settings = {
    url: "detailedviewAgeApi?d=" + data,
    method: "POST",
    timeout: 0,
    headers: { "Content-Type": "application/json" },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
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
  $(".btn-customBtn").on("click", function () {
    table140.button("." + $(this).val()).trigger();
  });

  var column = [
    {
      title: "S. No.",
      render: function (data, type, row, meta) {
        return meta.row + meta.settings._iDisplayStart + 1;
      },
    },
    {
      data: "total_count", defaultContent: "", title: "Total",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.total_count + '" data-status="Total" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.total_count + '" data-status="Total" ' + da + '>' + data + '</button>';
      },
    },
    {
      data: "resolved_count", defaultContent: "", title: "Resolved",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.resolved_count + '" data-status="Resolved" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.resolved_count + '" data-status="Resolved" ' + da + '>' + data + '</button>';
      },
    },
    {
      data: "pending_count", defaultContent: "", title: "Pending",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.pending_count + '" data-status="Pending" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.pending_count + '" data-status="Pending" ' + da + '>' + data + '</button>';
      },
    },
    {
      data: "forwarded_count", defaultContent: "", title: "Forwarded",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.forwarded_count + '" data-status="Forwarded" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.forwarded_count + '" data-status="Forwarded" ' + da + '>' + data + '</button>';
      },
    },
    {
      data: "dnp_count", defaultContent: "", title: "Does Not Pertain",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.dnp_count + '" data-status="dnpToOffice" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.dnp_count + '" data-status="Does Not Pertain" ' + da + '>' + data + '</button>';
      },
    },
    {
      data: "remark_count", defaultContent: "", title: "Remark Added",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.remark_count + '" data-status="Remark Added" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.remark_count + '" data-status="Remark Added" ' + da + '>' + data + '</button>';
      },
    },
    {
      data: "rejected_count", defaultContent: "", title: "Rejected",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.rejected_count + '" data-status="Rejected" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.rejected_count + '" data-status="Rejected" ' + da + '>' + data + '</button>';
      },
    },
    {
      data: "appealed_count", defaultContent: "", title: "Appealed",
      render: function (data, type, row) {
        var da = 'data-assignedto="' + row.username + '" data-casevalue="' + caseValue + '"';
        // return '<button class="btn btn-sm ageStatus" data-toggle="modal" data-target="#myModal" value="' + row.appealed_count + '" data-status="Appealed" ' + da + '>' + data + '</button>';
        return '<button class="btn btn-sm btn-link ageStatus" data-bs-toggle="modal" data-bs-target="#myModal" value="' + row.appealed_count + '" data-status="Appealed" ' + da + '>' + data + '</button>';
      },
    },
  ];

  if (misRadioVal === "userwise") {
    column.splice(1, 0,
      { data: "name", defaultContent: "", title: "Officer Name" },
      { data: "username", defaultContent: "", title: "Email" }
    );
  } else if (misRadioVal === "deptwise") {
    column.splice(1, 0,
      { data: "department", defaultContent: "", title: "Department" }
    );
  }

  var table140 = $("#AgeDetailedDataTable").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    paging: true,
    buttons: [
      {
        extend: "excel", title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: { columns: ":not(.noExport)" },
      },
      {
        extend: "pdf", title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4", download: "open",
        customize: function (doc) {
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) { row[j].alignment = "center"; }
          }
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) { columnWidths.push("auto"); }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: { columns: ":not(.noExport)" },
      },
    ],
    columns: column,
  });

  $("#AgeDetailedDataTable_filter input[type='search']").on("input", function () {
    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, "");
    $(this).val(cleanValue);
    table140.search(cleanValue).draw();
  });
}

$(document).on("click", ".ageStatus", function (e) {

  var status = this.getAttribute("data-status");
  var username = this.getAttribute("data-assignedto");
  var caseVal = this.getAttribute("data-casevalue");

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
    if (j.statusCode == "1" && j.data.length > 0) {
      makeDataTable2(j.data);
    } else {
      makeDataTable2(j.data);
    }
  });
});

function makeDataTable2(data) {
  console.log("data", data);

  var table = $("#filteredDHList").DataTable({
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
}
$(document).on("click", ".vDetails", function (e) {
  var appflag = $(this).data("appflag");
  var c = JSON.stringify({
    radioVal: appflag,
    gId: e.target.value,
  });
  let d = chkV(c);
  window.open("grievanceDatail?d=" + d, "_blank");
});

/////////utkarsh end 25/02/2026

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
// date: 26/02/2026

//utkarsh chnages for Status Wise Report - start - 25/02/2026

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
    if (j.statusCode == "1" && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        return current;
      });
      detailsUserWiseTbl(j.data);
    } else {
      detailsUserWiseTbl([]);
    }
  });
}

//  NEW CHANGE — detailsUserWiseTbl table render function added
function detailsUserWiseTbl(data) {
  $(".btn-customBtn").on("click", function () {
    table143.button("." + $(this).val()).trigger();
  });
  var table143 = $("#UWdetailedDataTable").DataTable({
    data: data,
    destroy: true,
    lengthMenu: [10, 50, 100],
    pageLength: 10,
    scrollX: true,
    paging: true,
    dom: 'Bfrtip',
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
            return '<div class="btn btn-warning btn-sm yr-mw "><i class="bi bi-exclamation-triangle"></i> ' + data + "</div>";
          } else if (data === "Acknowledged") {
            return '<div class="btn btn-info btn-sm yr-mw "><i class="bi bi-exclamation-circle"></i> ' + data + "</div>";
          } else if (data === "Under Process") {
            return '<div class="btn btn-upprocess btn-sm yr-mw "><i class="bi bi-exclamation-diamond"></i> ' + data + "</div>";
          } else if (data === "Rejected") {
            return '<div class="btn btn-danger btn-sm yr-mw "><i class="bi bi-x-octagon"></i> ' + data + "</div>";
          } else if (data === "Resolved") {
            return '<div class="btn btn-success btn-sm yr-mw "><i class="bi bi-check-circle"></i> ' + data + "</div>";
          } else if (data == "dnpToOffice") {
            var st = "Does not pertain";
            return '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' + st + "</div>";
          } else if (data === "Appealed") {
            return '<div class="btn btn-primary btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' + data + "</div>";
          } else if (data === "Forwarded To CPGRAM") {
            return '<div class="btn btn-sm yr-mw " style="background-color: #e7e7e7"><i class="bi bi-exclamation-octagon"></i> ' + data + "</div>";
          } else if (data === "Forwarded") {
            return '<div class="btn btn-dangar btn-sm yr-mw " style="background-color: #33FFE3"><i class="bi bi-exclamation-octagon"></i> ' + data + "</div>";
          } else {
            return '<div class="btn btn-dangar btn-sm yr-mw "><i class="bi bi-exclamation-octagon"></i> ' + data + "</div>";
          }
        },
      },
      {
        data: "uniqid",
        defaultContent: "",
        title: "History",
        render: function (data, type, row, meta) {
          var btn = '<div class="d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vHis" title="History" value="' + data + '"></button>';
          return btn + "</div>";
        },
      },
    ],
  });

  $("#UWdetailedDataTable_filter input[type='search']").on("input", function () {
    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, "");
    $(this).val(cleanValue);
    table143.search(cleanValue).draw();
  });
}

///utkarsh changes for Status Wise Report - end - 25/02/2026

