$(document).ready(function () {
  getGrievList2("cpgramHome");
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

Listen(document).on("click", ".tt_griev", function (e) {
  let btnVal = e.target.value;
  //alert(btnVal)
  // alert(btnVal)
  getGrievList2(btnVal);
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

//Naitik changes Start on 15-01-2026

var usrFlg = $("#usrFlg").val();

//TILE CLICK HANDLERS

$(document).on('click', '.filterData', function (e) {
  e.preventDefault();
  var clickedValue = $(this).data('value');
  getGrievList2('cpgramHome', clickedValue);
});

$(document).on('click', '.card-box:not(:has(a))', function (e) {
  var tileText = $(this).find('p.mb-0').text().trim();
  var clickedValue = null;

  if (tileText === 'Pending with Department') {
    clickedValue = "'Pending','Acknowledged','Under Process'";
  }

  if (clickedValue) {
    getGrievList2('cpgramHome', clickedValue);
  }
});


function getGrievList2(btnVal, clickedValue) {

  var requestData = { value: btnVal };
  if (clickedValue) {
    requestData.clickedValue = clickedValue;
  }

  var c = JSON.stringify(requestData);
  var d = chkV(c);

  var settings = {
    url: "cpgramApi_v2?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };

  $.ajax(settings).done(function (j) {

    j = setV(j);
    j = JSON.parse(j);

    //
    if (!j.data) {
      j.data = [];
    }

    if (j.statusCode != 0 && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.createddate != null) {
          current.createddate = format_date(current.createddate);
        }
        if (current.date_of_receipt != null) {
          current.date_of_receipt = format_date(current.date_of_receipt);
        }
        return current;
      });
    }

    let tblID;
    if (btnVal == "cpgramHome") {
      tblID = "cpgramHome";
    } else if (btnVal == "forwardedGri") {
      tblID = "all_tblfwdGrivances";
    } else if (btnVal == "DoesNotPertain") {
      tblID = "all_tblDoesNotPertain";
    } else if (btnVal == "remarkGri") {
      tblID = "all_tblRmkGrievances";
    } else if (btnVal == "fwdByOtherDep") {
      tblID = "all_tblfwdByOtherDep";
    }

    // COLUMNS

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
        title: "Grievance ID",
      },
      {
        data: "category",
        defaultContent: "",
        title: "Main Category",
      },
      {
        data: "name",
        defaultContent: "",
        title: "Submitted By",
        render: function (data, type, row) {
          return row.name || "";
        },
      },
      {
        data: "date_of_receipt",
        defaultContent: "",
        title: "Submitted On",
      },
      {
        data: "status",
        defaultContent: "",
        title: "Status",
        render: function (data, type, row) {

          if (!row) return "";

          if (data === "Pending") {
            var text = row.reminder == "1" ? "Kindly take action" : "";
            return '<div class="btn pe-none btn-warning btn-sm yr-mw">' +
              '<i class="bi bi-exclamation-triangle"></i> ' + data +
              '</div> <span class="text-danger blink">' + text + '</span>';
          }
          else if (data === "Acknowledged") {
            return '<div class="btn pe-none btn-info btn-sm yr-mw">' +
              '<i class="bi bi-exclamation-circle"></i> ' + data + '</div>';
          }
          else if (data === "Under Process") {
            return '<div class="btn pe-none btn-upprocess btn-sm yr-mw">' +
              '<i class="bi bi-exclamation-diamond"></i> ' + data + '</div>';
          }
          else if (
            (data === "Resolved" || data === "Rejected") &&
            ["Final Disposed", ""].includes(row.final_status)
          ) {
            return '<div class="btn pe-none btn-success btn-sm yr-mw">' +
              '<i class="bi bi-check-circle"></i> Final Disposed</div>';
          }
          else if (
            !["Does not pertain to this office", "dnpToOffice"].includes(data) &&
            row.final_status === "Recieved"
          ) {
            return '<div class="btn pe-none btn-success btn-sm yr-mw">' +
              '<i class="bi bi-check-circle"></i> Proposed Disposed</div>';
          }
          else if (data === "Forwarded") {
            return '<div class="btn btn-dangar btn-sm yr-mw" style="background-color:#33FFE3">' +
              '<i class="bi bi-exclamation-octagon"></i> ' + data + '</div>';
          }
          else if (data === "Remark Added") {
            return '<div class="btn btn-dangar btn-sm yr-mw" style="background-color:#3399FF">' +
              '<i class="bi bi-exclamation-octagon"></i> ' + data + '</div>';
          }

          return data || "";
        },
      },
      {
        data: "registration_no",
        defaultContent: "",
        class: "noExport",
        title: "Forwarded To",
        render: function (data, type, row) {
          if (row && row.status === "Forwarded") {
            return '<a href="#" data-value="' + data + '" class="fwd">View</a>';
          }
          return "";
        },
      },
      {
        data: "registration_no",
        defaultContent: "",
        class: "noExport",
        title: "Action",
        render: function (data, type, row) {


          if (!row || !row.status || usrFlg === "depSecretary") {
            return "";
          }

          var btn =
            '<div class="dropdown">' +
            '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">' +
            '<i class="bi bi-three-dots"></i></button>' +
            '<ul class="dropdown-menu yr-dropdown">' +
            '<li class="border-bottom border-success">' +
            '<button class="btn btn-sm vDetails" value="' + data + '" data-appflag="cpgrams">' +
            'Grievance Details</button></li>';

          if (
            (["Pending", "Under Process", "Acknowledged"].includes(row.status) &&
            ["", undefined, "Recieved"].includes(row.final_status)) || (row.status=="Forwarded" && row.final_status=="Recieved") 
          ) {
            btn += '<li class="border-bottom border-warning">' +
              '<button class="btn btn-sm grevP" value="' + data + '">Process</button></li>';
          }
 
          if (
            ["Pending", "Under Process", "Acknowledged"].includes(row.status) &&
            row.authority === "Process"
          ) {
            btn += '<li class="border-bottom border-success">' +
              '<button class="btn btn-sm forward" value="' + data + '">Forward</button></li>';
          }

          return btn + "</ul></div>";
        },
      }
    ];
    var table111 = $("#" + tblID).DataTable({
      destroy: true,
      data: j.data,
      columns: columns,
      dom: 'Bfrtip',
      lengthMenu: [10, 50, 100],
      pageLength: 10,
      scrollX: true,
      paging: true,
      buttons: [
        {
          extend: "excel",
          className: "dt-excel",
          title: "JKGOVT",
          exportOptions: { columns: ":not(.noExport)" }
        },
        {
          extend: "pdf",
          className: "dt-pdf",
          title: "JKGOVT",
          pageSize: "A4",
          download: "open",
          exportOptions: { columns: ":not(.noExport)" }
        }
      ]
    });

    $(".btn-excel").off("click").on("click", function () {
      table111.button('.dt-excel').trigger();
    });

    $(".btn-pdf").off("click").on("click", function () {
      table111.button('.dt-pdf').trigger();
    });

    table111.columns.adjust().draw();

  });
}

//Naitik changes End on 15-01-2026


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

$(document).on("click", ".grevP", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  var settings = {
    url: "cpgramGrievanceAcknowledged?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    console.log(j);
    j = setV(j);
    j = JSON.parse(j);
    // if (j.statusCode[0] == 1) {
    //   alert("Pulled Successfully.");
    // } else {
    //   alert("Something went wrong");
    // }
    window.location.href = "cpgramProcessGrievance?d=" + d;
  });
});

$(document).on("click", ".forward", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  window.location.href = "forwardAplication?d=" + d;
});

$(document).on("click", ".vHis", function (e) {
  let c = e.target.value;
  let d = chkV(c);
  //   window.location.href = "historyGrievance?d=" + d;
  window.open("historyGrievance?d=" + d, "_blank");
});

$(document).on("click", ".fwd", function (e) {
  let gId = this.getAttribute("data-value");
  //	console.log(gId);
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
  //	console.log(d)
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
      class: "noExport",
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
  ];

  $(".btn-customBtn").on("click", function () {
    // console.log($(this).val());
    table112.button("." + $(this).val()).trigger();
  });

  var table112 = $("#assignedTable").DataTable({
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
  table112.columns.adjust().draw();
}
