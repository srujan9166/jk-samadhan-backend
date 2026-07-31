// Global tableServerSide Init
var tableServerSide;

// Global Filters Init
let globalFilters = {
  deptFilterVal: "0",
  catgFilterVal: "0",
  fdFilterVal: "0",
  tdFilterVal: "0",
  districtFilterVal: "0",
  subCatGraphVal: "0",
  psgaFilterVal: "0",
  adminTypeFilterVal: "0",
  divisionFilterVal: "0",
  municipality_block_FilterVal: "0",
  ward_panchayat_FilterVal: "0",
  statusFilterVal: "0",
  overallStatusFilterVal: "0",
  windowFilterVal: "0",
  modeFilterVal: "0",
  aiClassificationFilterVal: "0",
  aiTrackingFilterVal: "0",
  authorityAssignedFilterVal: "0",
  operandFilterVal: "0",
  operatorFilterVal: "0",
  eCheck0: "0",
  eCheck1: "0"
};


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
$(".cBb").on("click", function () {
  // Check if there's a history to go back to
  if (window.history.length > 1) {
    // window.history.back();
    window.history.go(-1); // Go back to the previous page
  } else {
    // Redirect to a default page if no history
    window.location.href = "home";
  }
});
Listen(document).on("click", ".closeLogout", function (e) {
  this.closest("form").submit();
});

function format_date(created_date) {
  let formatted_date = "";
  if (created_date) {
    // Check if data is truthy (not null, undefined, or empty string)
    let date_string = created_date.toString(); // Ensure it's a string
    // Check for 'T' to determine the format
    if (date_string.includes("T")) {
      // Format: YYYY-MM-DDTHH:MM:SS.MS (or similar)
      const date_time_parts = date_string.split("T");
      const date_parts_iso = date_time_parts[0].split("-"); // YYYY, MM, DD
      const time_full = date_time_parts[1]; // HH:MM:SS.MS or HH:MM:SS
      // Reformat to DD-MM-YYYY HH:MM:SS (or HH:MM:SS.MS if desired)
      formatted_date = `${date_parts_iso[2]}-${date_parts_iso[1]}-${date_parts_iso[0]} ${time_full}`;
      // If you specifically want to truncate milliseconds for consistency:
      // const time_parts_no_ms = time_full.split('.');
      // formatted_date = `${date_parts_iso[2]}-${date_parts_iso[1]}-${date_parts_iso[0]} ${time_parts_no_ms[0]}`;
    } else {
      // Original format: YYYY-MM-DD HH:MM:SS
      const date_time_parts = date_string.split(" ");
      const date_parts = date_time_parts[0].split("-"); // YYYY, MM, DD
      const time = date_time_parts[1]; // HH:MM:SS
      // Reformat to DD-MM-YYYY HH:MM:SS
      formatted_date = `${date_parts[2]}-${date_parts[1]}-${date_parts[0]} ${time}`;
    }
  }
  return formatted_date;
}

// Dcoument Ready - SKY - 27/01/2025
$(document).ready(function () {
  departments();
  serverMasterAnalytics();
});

$(document).on("click", "#monitorDesk", function () { });

function departments() {
  $("#departmentss").html("");
  $("#departmentss").append('<option value="0">Select</option>');
  $("#catGraph").html("");
  $("#catGraph").append('<option value="0">Select</option>');
  var division = "none";

  if (division != 0) {
    var c = JSON.stringify({
      divison: division,
    });

    var d = chkV(c);
    var settings = {
      url: cp + "/analytics/departmentForGraph?d=" + d,
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
      //  console.log(j)
      if (j.statusCode == "1") {
        makeDropdown(departmentss, j.data);
        if (j.data.length == 1) {
          $("#departmentss").prop("selectedIndex", 1);
          $("#departmentss").attr("disabled", true);
          // $("#departmentss").trigger("change");
          var kk = $("#datGraphDiv").is(":hidden");
          var ff = $("#lineGraphDiv").is(":hidden");

          $("#catGraph").attr("disabled", false);
          $("#catGraph").html("");
          $("#catGraph").append('<option value="0">Select</option>');
          var val = $("#departmentss").find(":selected").val();

          if (val != "0") {
            var c = JSON.stringify({
              value: val,
            });

            var d = chkV(c);
            var settings = {
              url: cp + "/analytics/categ?d=" + d,
              method: "POST",
              timeout: 0,
            };
            $.ajax(settings).done(function (j) {
              j = setV(j);
              j = JSON.parse(j);

              if (j.statusCode == "1" || j.statusCode == "0") {
                makeDropdown(catGraph, j.data);
              }
            });
          }
        }
      }
    });
  } else {
    $("#departmentss").html("");
    $("#departmentss").append('<option value="0">Select</option>');
    $("#catGraph").html("");
    $("#catGraph").append('<option value="0">Select</option>');
  }
}

$(document).on("change", "#dateFrom", function (e) {
  var val = e.target.value;
  var kk = $("#datGraphDiv").is(":hidden");
  var ff = $("#lineGraphDiv").is(":hidden");
  if (val != "") {
    //  $('#subdate').show();
    $("#dateTo").attr("disabled", false);
    //datatable(val);
  } else {
    $("#dateTo").attr("disabled", true);
  }
});

function reset() {
  if ($("#usrR").val() == "ROLE_Admin") {
    $("#catGraph").prop("selectedIndex", 0);
  } else {
    $("#departmentss").prop("selectedIndex", 0);
    $("#catGraph").html("");
    $("#catGraph").append('<option value="0">Select</option>');
    $("#catGraph").attr("disabled", true);
  }
  $("#dataCount").hide();
  $("#department").show();
  $("#dateTo").attr("disabled", true);
  $("#dateTo").val("");
  $("#dateFrom").val("");
  //departments();
  var kk = $("#datGraphDiv").is(":hidden");
  var ff = $("#lineGraphDiv").is(":hidden");
}

$(document).on("click", "#reset", function () {
  // reset();
  window.location.reload();
});

$("#departmentss").change(function () {
  //  var kk = $("#datGraphDiv").is(":hidden");
  //  var ff = $("#lineGraphDiv").is(":hidden");
  //
  $("#catGraph").attr("disabled", false);
  $("#catGraph").html("");
  $("#catGraph").append('<option value="0">Select</option>');

  // 07 March 2025 - Main Category On Change for Sub Category - SKY
  $("#subCatGraph").attr("disabled", true);
  $("#subCatGraph").html("");
  $("#subCatGraph").append('<option value="0">Select</option>');

  var val = $("#departmentss").find(":selected").val();

  if (val != "0") {
    var c = JSON.stringify({
      value: val,
    });

    var d = chkV(c);
    var settings = {
      url: cp + "/analytics/categ?d=" + d,
      method: "POST",
      timeout: 0,
    };
    $.ajax(settings).done(function (j) {
      j = setV(j);
      j = JSON.parse(j);

      if (j.statusCode == "1" || j.statusCode == "0") {
        makeDropdown(catGraph, j.data);
      }
    });
  }
});

// function makeDropdown(passedId, data) {
//   $.each(data, function (key, value) {
//     $(passedId).append(
//       $("<option></option>").attr("value", value.values).text(value.values)
//     );
//   });
// }

$(document).click(".disposedReport", function (e) {
  var req = e.target.textContent;
  var chtDiv = $("#lineDiv");
  var rpDiv = $("#disposedReportDiv");
  if (req == "Report") {
    chtDiv.hide();
    rpDiv.show();
    //datatable()
  } else {
    chtDiv.show();
    rpDiv.hide();
  }
});

document.querySelectorAll('button[data-bs-toggle="tab"]').forEach((el) => {
  el.addEventListener("shown.bs.tab", () => {
    DataTable.tables({ visible: true, api: true }).columns.adjust();
  });
});

// ==============================================SKY========================================================

// SKY ====================================== 02 FEB 2024
$(document).on("click", "#treeDesk", function () {
  $("#newCharts").hide();

  $("#countAppDiv").hide();
  $("#divisionDiv").hide();
  $("#datGraphDiv").hide();
  $("#lineGraphDiv").hide();

  $("#dataCount").hide();
  $("#department").hide();
  $("#divisionDiv").hide();
  $("#treeDeskDash").show();

  // function call for loading division list
  //loadDivisions();
});

// SKY SIDDHESHWAR ============================ 29 FEB 2024

$.get(cp + "/analytics/dropdown-department", function (data) {
  //	console.log(data)
  var dropdown = '<option value="0">Select Department</option>';
  for (var i = 0; i < data.length; i++) {
    dropdown +=
      '<option value="' +
      data[i].department_name +
      '">' +
      data[i].department_name +
      "</option>";
  }
  $("#mydepartmentss").html(dropdown);
  if (data.length === 1) {
    $("#mydepartmentss").prop("selectedIndex", 1);
    $("#mydepartmentss").prop("disabled", true);
    $("#mydepartmentss").trigger("change");
  }
});

$("#mydepartmentss").on("change", function () {
  // Empty all elements inside the div with id "tree"
  $("#tree").empty();

  //var division = $("#mydivisonss").find(":selected").val();
  var departmentName = $("#mydepartmentss").find(":selected").val();

  // Insert centered text into the div with id "tree"
  if (departmentName != 0) {
    $("#tree").html(
      '<h5 class="card-title text-start p-3 mb-0">' + departmentName + "</h5>"
    );

    $("#tDas").attr("data-value1", departmentName);
  }

  // AJAX call to fetch initial tree structure data
  var cc = JSON.stringify({
    //division : division ,
    departmentName: departmentName,
  });
  var dd = chkV(cc);
  var settingss = {
    url: cp + "/analytics/getMainCategories?d=" + dd,
    method: "GET",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settingss).done(function (data) {
    main_category_name(data, $("#tree"));
  });
});

// Click event handler for expanding/collapsing tree nodes
$("#tree").on("click", ".node", function (event) {
  // Stop the event from propagating up the DOM tree
  event.stopPropagation();
  //var state = $("#mydivisonss").find(":selected").val();
  var departmentName = $("#mydepartmentss").find(":selected").val();
  var node = $(this);
  var node1 = $(this).closest("li");
  var nodeId = node.data("id");
  var titlename = node.attr("data-id");
  //alert(titlename)
  function ajaxCall(url) {
    var c = JSON.stringify({
      categoryID: titlename,
      //division: state,
      departmentName: departmentName,
    });
    var d = chkV(c);
    var settings = {
      url: url + "?d=" + d,
      method: "GET",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    };
    return settings;
  }

  // var nodeID = node.attr('id');
  if (!node.hasClass("expanded")) {
    // Get the value of the 'title' attribute from the clicked <li> tag
    var titleValue = node.attr("title");
    // Fetch child nodes via AJAX
    if (titleValue === "category_name") {
      var settingss = ajaxCall(cp + "/analytics/getSubCategories");
      $.ajax(settingss).done(function (data) {
        if (data.length > 0) {
          sub_category_name(data, node1);
        }
      });
    } else if (titleValue === "sub_category_name") {
      var settingss = ajaxCall(cp + "/analytics/getNextLevelCategoriesL2");
      $.ajax(settingss).done(function (data) {
        if (data.length > 0) {
          sub_category_name_L2(data, node1);
        }
      });
    } else if (titleValue === "sub_category_level2_name") {
      var settingss = ajaxCall(cp + "/analytics/getNextLevelCategoriesL3");
      $.ajax(settingss).done(function (data) {
        if (data.length > 0) {
          sub_category_name_L3(data, node1);
        }
      });
    } else if (titleValue === "sub_category_level3_name") {
      var settingss = ajaxCall(cp + "/analytics/getNextLevelCategoriesL4");
      $.ajax(settingss).done(function (data) {
        if (data.length > 0) {
          sub_category_name_L4(data, node1);
        }
      });
    }
    // Add the 'expanded' class after successful AJAX call
    node.addClass("expanded");
  } else {
    node.closest("li").children("ul.children").toggle();
  }
});

function renderTree(nodes, parentElement, name, title) {
  var childrenContainer = $('<ul class="children"></ul>');

  nodes.forEach(function (node) {
    var nameInsert = getNodeName(node, name);
    var nodeLi = $(`<li>
      <a class="node" data-id="${nameInsert}" title="${title}">${nameInsert}
      </a>
      <span class="badge rounded-pill bg-primary text-white ms-0 me-3 treeDashboardCountClass" content="${$(
      "#mydepartmentss"
    )
        .find(":selected")
        .val()}" data-id="${title}" data-value="${nameInsert}" style="cursor: pointer !important;">${node.count
      }</span>
      </li>`);
    childrenContainer.append(nodeLi);
  });

  parentElement.append(childrenContainer);
}

// Function to get the correct name based on the node and level
function getNodeName(node, name) {
  switch (name) {
    case "category_name":
      return node.category_name;
    case "sub_category_name":
      return node.sub_category_name;
    case "sub_category_level2_name":
      return node.sub_category_level2_name;
    case "sub_category_level3_name":
      return node.sub_category_level3_name;
    case "sub_category_level4_name":
      return node.sub_category_level4_name;
    default:
      return "";
  }
}

function main_category_name(nodes, parentElement) {
  var name = "category_name";
  renderTree(nodes, parentElement, name, "category_name");
}

function sub_category_name(nodes, parentElement) {
  var name = "sub_category_name";
  renderTree(nodes, parentElement, name, "sub_category_name");
}
function sub_category_name_L2(nodes, parentElement) {
  var name = "sub_category_level2_name";
  renderTree(nodes, parentElement, name, "sub_category_level2_name");
}
function sub_category_name_L3(nodes, parentElement) {
  var name = "sub_category_level3_name";
  renderTree(nodes, parentElement, name, "sub_category_level3_name");
}
function sub_category_name_L4(nodes, parentElement) {
  var name = "sub_category_level4_name";
  renderTree(nodes, parentElement, name, "sub_category_level4_name");
}

$(document).on("click", ".printTree", function () {
  let treeHTML = $("#tree").html(); // Get the content of the #tree div
  let printWindow = window.open("", ""); // Open a new window

  // Copy the CSS from the current page to the print window
  let css = "";
  $('link[rel="stylesheet"], style').each(function () {
    css += $(this).prop("outerHTML"); // Append external stylesheets and style tags
  });

  printWindow.document.write("<html><head><title>Print Tree</title>");
  printWindow.document.write(css); // Add the CSS to the print window
  printWindow.document.write("</head><body>");
  printWindow.document.write(treeHTML); // Write the content of the tree into the new window
  printWindow.document.write("</body></html>");
  printWindow.document.close(); // Close the document

  printWindow.print(); // Trigger the print dialog
});

$(document).on("click", ".printCharts", function () {
  const chartDivId = $(this).attr("data-value");
  const charttitle = $(this).attr("data-value1");

  var chartDiv = $("#" + chartDivId); // Get the DOM element using jQuery
  if (chartDiv.length) {
    // Add a delay to ensure the element is fully rendered
    setTimeout(function () {
      html2canvas(chartDiv[0])
        .then((canvas) => {
          var imgData = canvas.toDataURL("image/png", 0.8); // Change to PNG and set quality to 80%
          var pdf = new jspdf.jsPDF("p", "mm", "a4");
          var imgWidth = 150; // Adjust width of the image
          var pageHeight = 297; // A4 height in mm
          var imgHeight = (canvas.height * imgWidth) / canvas.width;
          var heightLeft = imgHeight;

          // Add title
          var title = charttitle;
          pdf.setFontSize(18);
          pdf.text(title, 105, 20, null, null, "center"); // Center the title at the top of the page

          // Center the image horizontally and add a top margin
          var xOffset = (210 - imgWidth) / 2; // A4 width in mm minus image width divided by 2
          var yOffset = 40; // Top margin in mm

          pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
          heightLeft -= pageHeight - yOffset;

          while (heightLeft >= 0) {
            yOffset = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          pdf.save(chartDivId + ".pdf");
        })
        .catch(function (error) {
          console.error("Error capturing element:", error);
        });
    }, 100); // Delay of 100 milliseconds
  } else {
    console.error("Element with ID " + chartDivId + " not found.");
  }
});

function getRFdata() {
  return getRF();
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
  //   window.location.href = "/analytics/grievanceDatail?d=" + d;
  window.open(cp + "/analytics/grievanceDatail?d=" + d, "_blank");
});

// Handle click on fileViewer links to open in a popup window
$(document).on("click", ".fileViewer", function (e) {
  e.preventDefault();
  var filename = $(this).data("filename");
  var name = $(this).data("name");
  var url = "../fileViewer?filename=" + chkV(filename) + "&name=" + name;
  var width = 800;
  var height = 600;
  var left = (screen.width - width) / 2;
  var top = (screen.height - height) / 2;

  // Open popup window
  window.open(
    url,
    "_blank",
    "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top
  );
});

$(document).on("click", "#vAi", function (e) {
  e.preventDefault();
  const gID = $(this).attr("data-value");
  var c = JSON.stringify({
    uniqid: gID,
  });
  let d = chkV(c);
  var settings = {
    url: cp + "/analytics/vAi?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };

  $.ajax(settings).done(function (res) {
    // res = JSON.parse(res);
    console.log("res", res);

    console.log("res", res.data[0].value);

    // Example data for the table
    // const matchData = [
    //   { matchedWith: "GRV2025/80693", percent: "87.56%" },
    //   { matchedWith: "RBTC/2025/80690", percent: "78.91%" },
    //   { matchedWith: "GRV2025/80670", percent: "64.23%" }
    // ];
    const matchData = JSON.parse(res.data[0].value);

    // Remove any existing modal to avoid duplicates
    $("#aiMatchModal").remove();

    // Build the modal HTML as a string
    const modalHtml = `
    <div class="modal fade" id="aiMatchModal" tabindex="-1" aria-labelledby="aiMatchModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="aiMatchModalLabel"> Grievance: <button class="btn btn-lg btn-link text-decoration-none vDetails" data-appflag = "JKSAMADHAN" title="Grievance detail" value = "${res.data[0].uniqid}">${res.data[0].uniqid}</button>  </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <table class="table table-lg table-bordered">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Matched With</th>
                  <th>Matched %</th>
                </tr>
              </thead>
              <tbody id="aiMatchTableBody">
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

    // Append modal to body
    $("body").append(modalHtml);

    // Populate table body
    matchData.forEach((item, index) => {
      const row = `
      <tr>
        <td>${index + 1}</td>
        <td><button class="btn btn-sm btn-link text-decoration-none vDetails" data-appflag = "JKSAMADHAN" title="Grievance detail" value = "${item.uniqid
        }">${item.uniqid}</button></td>
        <td>${item.match}</td>
      </tr>
    `;
      $("#aiMatchTableBody").append(row);
    });

    // Show the modal using Bootstrap 5's modal API
    const modal = new bootstrap.Modal(document.getElementById("aiMatchModal"));
    modal.show();
  });
});

let treeDashBoardTable;
$(document).on("click", ".treeDashboardCountClass", function () {
  const column = this.getAttribute("data-id");
  const value = this.getAttribute("data-value");
  const departmentName = $("#mydepartmentss").find(":selected").val();

  const content = { column, value, departmentName };

  console.log(content);

  const d = chkV(JSON.stringify(content));
  $.ajax({
    url: cp + "/analytics/treedashboardData?d=" + d,
    type: "POST",
    success: function (res) {
      // const response = setV(res);
      if (treeDashBoardTable) {
        treeDashBoardTable.destroy();
      }
      treeDashBoardTable = new DataTable("#treeDashBoardTable", {
        columns: [
          { data: null },
          { data: "uniqid" },
          { data: "department" },
          { data: "status" },
        ],
        columnDefs: [
          {
            render: function (data, type, row) {
              return `<a target="_blank" href="${cp}/analytics/grievanceDatail?d=${chkV(
                JSON.stringify({
                  radioVal: "JKSAMADHAN",
                  gId: data,
                })
              )}">${data}</a>`;
            },
            targets: 1,
          },
        ],
        data: res,
        fnRowCallback: function (nRow, aData, iDisplayIndex) {
          $("td:first", nRow).html(iDisplayIndex + 1);
          return nRow;
        },
      });
      $("#treeDashBoardTable_filter input[type='search']").on(
        "input",
        function () {
          // alert("jjjds")

          var cleanValue = $(this)
            .val()
            .replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
          $(this).val(cleanValue);
          treeDashBoardTable.search(cleanValue).draw(); // Update DataTable search
        }
      );
    },
    error: function (error) {
      console.log(error);
    },
  });

  $("#treeDashboardDataModal").modal("toggle");
});

// 07 March 2025 - Updated Makedropdown, if id & value both are passed or only value is passed, it will handle - SKY
function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    const text = value.value || value.values;
    const optionValue = value.id || value.values;
    $(passedId).append(
      $("<option></option>").attr("value", optionValue).text(text)
    );
  });
}
// 07 March 2025 - Additional Filters - SKY
function reuseDropDownChange(e, JKS_API_URL, dataKey, targetDropdown) {
  const val = e.target ? e.target.value : e;
  const dropDownID = $(targetDropdown);
  if (val === "0" && JKS_API_URL != "NA") {
    dropDownID.html('<option value="0">Select</option>');
    dropDownID.attr("disabled", true); // Disable the dropdown
    return;
  }
  const d = chkV(JSON.stringify({ [dataKey]: val }));
  $.ajax({
    url: `${JKS_API_URL}?d=${d}`,
    method: "POST",
    timeout: 0,
  }).done(function (j) {
    dropDownID.html('<option value="0">Select</option>');
    j = JSON.parse(setV(j));
    if (j.statusCode === "1") {
      dropDownID.removeAttr("disabled"); // Enable the dropdown
      makeDropdown(dropDownID, j.data);
    } else {
      dropDownID.attr("disabled", true); // Disable the dropdown
    }
  });
}

// For subCatGraph Filter
$(document).on("change", "#catGraph", function (e) {
  reuseDropDownChange(e, cp + "/analytics/subcateg", "value", "#subCatGraph");
});
// For divisionFilter Filter

// $(document).on("change", "#divisionFilter", function (e) {
//   reuseDropDownChange(
//     e,
//     cp + "/analytics/districtByDivision",
//     "department_name",
//     "#districtFilter"
//   );
// });

// For adminDivisionFilter Filter
$(document).on("change", "#districtFilter", function (e) {
  // for static data rendering (when data not required from server ( DB ))
  let windowDropDownID = $("#windowFilter").val();
  const dropDownID = $("#adminDivisionFilter");
  (e.target.value && windowDropDownID === "RAABITA") != "0"
    ? dropDownID.removeAttr("disabled")
    : (dropDownID.prop("selectedIndex", 0), dropDownID.attr("disabled", false));
});
// For municipality-block-Filter Filter
$(document).on("change", "#adminDivisionFilter", function (e) {
  let eData = $("#districtFilter").val();
  // console.log(eData)
  let URI =
    e.target.value !== "0"
      ? e.target.value === "Municipality"
        ? "municipalityByDistrict"
        : e.target.value === "Block"
          ? "blockByDistrict"
          : "0"
      : "0";
  // console.log(URI)
  URI != "0"
    ? reuseDropDownChange(eData, URI, "value", "#municipality-block-Filter")
    : null;
});
// For ward-panchayat-Filter Filter
$(document).on("change", "#municipality-block-Filter", function (e) {
  let eCheck = $("#adminDivisionFilter").val();
  // console.log(eCheck)
  let URI =
    e.target.value !== "0"
      ? eCheck === "Municipality"
        ? "wardByMunicipality"
        : eCheck === "Block"
          ? "panchayatByBlock"
          : "0"
      : "0";
  // console.log(URI)
  URI !== "0" && e.target.value !== "0"
    ? reuseDropDownChange(e, URI, "value", "#ward-panchayat-Filter")
    : null;
});




// ================================================== ReStructuring of ServerSideDtAnalytical & ServerSideChartAnalytical (start) (26 June 2025 - SKY) ================================================

// Global Filters onChange

// Department filter
$("#departmentss").on("change", function () {
  globalFilters.deptFilterVal = $(this).val();
  globalFilters.catgFilterVal = "0"; // Reset category
  globalFilters.subCatGraphVal = "0"; // Reset sub category
  serverMasterAnalytics();
});

// Category filter
$("#catGraph").on("change", function () {
  globalFilters.catgFilterVal = $(this).val();
  globalFilters.subCatGraphVal = "0"; // Reset sub category
  serverMasterAnalytics();
});

// Sub-category
$("#subCatGraph").on("change", function () {
  globalFilters.subCatGraphVal = $(this).val();
  serverMasterAnalytics();
});

// From date
$("#dateFrom").on("change", function (e) {
  globalFilters.fdFilterVal = e.target.value;
  serverMasterAnalytics();
});

// To date
$("#dateTo").on("change", function (e) {
  globalFilters.tdFilterVal = e.target.value;
  serverMasterAnalytics();
});

// Admin Type
$("#adminTypeFilter").on("change", function () {
  const val = $(this).val();
  globalFilters.adminTypeFilterVal = val;

  // Reset dropdowns visually + in global filters
  $("#divisionFilter").prop("selectedIndex", 0);
  $("#districtFilter").prop("selectedIndex", 0);
  globalFilters.divisionFilterVal = "0";
  globalFilters.districtFilterVal = "0";

  // Toggle sections
  $("#divisionFilterDiv").toggleClass("d-none", val !== "1");
  $("#districtFilterDiv").toggleClass("d-none", val !== "2");

  serverMasterAnalytics();
});

// Division
$("#divisionFilter").on("change", function () {
  globalFilters.divisionFilterVal = $(this).val();
  globalFilters.districtFilterVal = "0"; // Reset district
  serverMasterAnalytics();
});

// District
$("#districtFilter").on("change", function (e) {
  globalFilters.districtFilterVal = $(this).find("option:selected").text();
  serverMasterAnalytics();
});

// PSGA
$("#psgaFilter").on("change", function () {
  globalFilters.psgaFilterVal = $(this).val();
  serverMasterAnalytics();
});

// Municipality/Block
$("#municipality-block-Filter").on("change", function () {
  const adminDiv = $("#adminDivisionFilter").val();
  globalFilters.eCheck0 = adminDiv === "Municipality" ? "municipality_id" :
    adminDiv === "Block" ? "block_id" : "0";
  globalFilters.municipality_block_FilterVal = $(this).val();
  serverMasterAnalytics();
});

// Ward/Panchayat
$("#ward-panchayat-Filter").on("change", function () {
  const adminDiv = $("#adminDivisionFilter").val();
  globalFilters.eCheck1 = adminDiv === "Municipality" ? "ward_id" :
    adminDiv === "Block" ? "panchayat_id" : "0";
  globalFilters.ward_panchayat_FilterVal = $(this).val();
  serverMasterAnalytics();
});

// Status filter
$("#statusFilter").on("change", function () {
  globalFilters.statusFilterVal = $(this).val();
  console.log("statusFilterVal : " + globalFilters.statusFilterVal);
  serverMasterAnalytics();
});

// Overall Status filter
$("#overallStatusFilter").on("change", function () {
  const val = $(this).val();
  globalFilters.overallStatusFilterVal = val;

  const $statusFilter = $("#statusFilter");
  const $options = $statusFilter.find("option");

  if (val === "Closed") {
    $statusFilter.prop("disabled", false);
    $options.hide();
    $statusFilter.find("option[value='0'], option[value='Resolved'], option[value='Rejected']").show();
  } else if (val === "Open") {
    $statusFilter.prop("disabled", false);
    $options.hide();
    $statusFilter.find("option[value='0'], option[value='Forwarded'], option[value='Pending'], option[value='Under Process'], option[value='dnpToOffice'], option[value='Appealed'], option[value='Acknowledged'], option[value='Forwarded To CPGRAM']").show();
  } else {
    $statusFilter.prop("disabled", true);
    $options.show();
  }

  $statusFilter.val("0");
  globalFilters.statusFilterVal = "0";
  serverMasterAnalytics();
});

// Window filter
$("#windowFilter").on("change", function () {
  globalFilters.windowFilterVal = $(this).val();
  serverMasterAnalytics();
});

// Mode filter
$("#modeFilter").on("change", function () {
  globalFilters.modeFilterVal = $(this).val();
  serverMasterAnalytics();
});

// AI Classification filter
$("#aiClassificationFilter").on("change", function () {
  globalFilters.aiClassificationFilterVal = $(this).val();
  serverMasterAnalytics();
});

// AI Tracking filter
$("#aiTrackingFilter").on("change", function () {
  globalFilters.aiTrackingFilterVal = $(this).val();
  serverMasterAnalytics();
});

// Authority Assigned filter
$("#authorityAssignedFilter").on("change", function () {
  globalFilters.authorityAssignedFilterVal = $(this).val();
  serverMasterAnalytics();
});

// Operand filter (input)
$("#operandFilter").on("input", function (e) {
  globalFilters.operandFilterVal = e.target.value;
  globalFilters.operatorFilterVal = "0";
  $("#operatorFilter").val("0");
});

// Operator filter
$("#operatorFilter").on("change", function () {
  globalFilters.operatorFilterVal = $(this).val();
  globalFilters.operatorFilterVal == "0" ? $("#operandFilter").val("") : "";
  serverMasterAnalytics();
});


function serverMasterAnalytics() {
  if ($.fn.DataTable.isDataTable('#YRreport223')) {
    $('#YRreport223').DataTable().clear().destroy();
  }
  serverSideAnalysisCounts();
  serverSideAnalysisDT();
  serverSideAnalysisChart();
}


function serverSideAnalysisCounts() {
  let payload = {
    filters: { ...globalFilters }
  };
  var settings = {
    url: cp + "/analytics/grievancesCounts",
    method: "POST",
    timeout: 0,
    // async: false,
    contentType: "application/json",
    data: chkV(JSON.stringify(payload)),
  };
  $.ajax(settings).done(function (response) {
    //console.log('Count Response', response);
    // Update UI with counts
    let counts = response.allCounts || {};
    $("#totalGri").text(counts.total_count || 0);
    $("#toGr").text(counts.total_closed || 0);
    $("#resolved").text(counts.resolved_count || 0);
    $("#rejected").text(counts.rejected_count || 0);
    $("#open").text(counts.total_open || 0);
    $("#flagged").text(counts.appealed_count || 0);
    $("#disPer").text(counts.disposed_percentage || 0);
  });
}

function serverSideAnalysisDT() {
  // console.log("Current Filters:", JSON.stringify(globalFilters, null, 2));
  var usdd = $("#usrVV").val();
  var column = [
    // {
    //   data: "uniqid",
    //   defaultContent: "",
    //   class: "noExport",
    //   title: "Action",
    //   render: function (data, type, row, meta) {
    //     var btn =
    //       '<div class = "d-flex justify-content-between"><button class="btn btn-sm btn-primary bi bi-eye vDetails" data-appflag = "JKSAMADHAN" title="Grievance detail" value = "' +
    //       data +
    //       '"></button>';

    //     return btn + "</div>";
    //   },
    // },

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
      render: function (data, type, row, meta) {
        let appflag = row.origin === "CPGRAM" ? "cpgrams" : "JKSAMADHAN";
        return (btn =
          '<button class="btn btn-sm btn-link text-decoration-none vDetails" data-appflag = "' +
          appflag +
          '" title="Grievance detail" value = "' +
          data +
          '">' +
          data +
          "</button>");
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
      data: "subCategory",
      defaultContent: "",
      title: "Sub Category",
    },
    {
      data: "submittedBy",
      defaultContent: "",
      title: "Submitted By",
    },
    {
      data: "createdDate",
      defaultContent: "",
      title: "Submitted On",
      render: function (data, type, row, meta) {
        if (data) {
          return format_date(data);
        }
        return "NA";
      },
    },
    {
      data: "origin",
      defaultContent: "",
      title: "Window",
    },
    {
      data: "dmDivision",
      defaultContent: "",
      title: "Division",
    },
    {
      data: "dmDistrict",
      defaultContent: "",
      title: "District",
    },
    {
      data: "",
      defaultContent: "",
      title: "Status",
      render: function (data, type, row, meta) {
        // Map each status to an object with class, icon, and text
        // console.log(data)
        data = $('#districtFilter').val() == "0" ? row.status : row.action;

        const statusConfig = {
          Pending: ["btn-warning", "bi-exclamation-triangle", data],
          Acknowledged: ["btn-info", "bi-exclamation-circle", data],
          "Under Process": ["btn-upprocess", "bi-exclamation-diamond", data],
          Resolved: ["btn-success", "bi-check-circle", data],
          Rejected: ["btn-danger", "bi-check-circle", data],
          dnpToOffice: ["btn-dangar", "bi-exclamation-octagon", data],
          Appealed: ["btn-primary", "bi-exclamation-octagon", data],
          "Forwarded To CPGRAM": [
            "btn-secondary",
            "bi-exclamation-octagon",
            data,
          ],
          Forwarded: [
            "btn-dangar",
            "bi-exclamation-octagon",
            data,
            "background-color: #33FFE3",
          ],
        };

        // Get the matching status configuration, or fall back to default
        const [className, icon, text, style = ""] = statusConfig[data] || [
          "btn-dangar",
          "bi-exclamation-octagon",
          data,
        ];

        // Return the button HTML
        return `<div class="btn btn-sm yr-mw ${className}" style="${style}">
                  <i class="bi ${icon}"></i> ${text}
                </div>`;
      },
    },

    // AI Integration - SKY - 24/05/2025
    {
      data: "aiClassification",
      defaultContent: "",
      title: "AI Classification",
      render: function (data, type, row, meta) {
        if (row.aiClassification == "Normal") {
          return (
            `<span style="background-color: green;color: white;border-radius: 5%;padding: 5px 5px;">` +
            row.aiClassification +
            `</span>`
          );
        } else if (row.aiClassification == "Priority") {
          return (
            `<span style="background-color: red;color: white;border-radius: 5%;padding: 5px 5px;">` +
            row.aiClassification +
            `</span>`
          );
        } else if (row.aiClassification == "Repeated") {
          return (
            `<span id = "vAi" class= "" data-value = "${row.uniqid}" style="background-color: yellow;color: black;border-radius: 5%;padding: 5px 5px; cursor:pointer;">` +
            row.aiClassification +
            `</span>`
          );
        }
      },
    },

    {
      data: "aiTracking",
      defaultContent: "",
      title: "AI Tracking",
      render: function (data, type, row, meta) {

        let submittedDate = new Date(row.createdDate);

        let days_since_elapsed = Math.floor(Math.abs(new Date() - submittedDate) / (1000 * 60 * 60 * 24));

        let closedDate = new Date(row.actionDate);
        let differenceInMs = closedDate - submittedDate;
        let differenceInDays = Math.floor(Math.abs(differenceInMs) / (1000 * 60 * 60 * 24));
        differenceInDays = differenceInDays === 0 ? 1 : differenceInDays;
        let actualDaysSinceElapsed = days_since_elapsed;

        if (['Resolved', 'Rejected'].includes(row.status)) {
          actualDaysSinceElapsed = differenceInDays;
        }

        let color =
          actualDaysSinceElapsed < row.aiTracking
            ? "green"
            : actualDaysSinceElapsed > row.aiTracking
              ? "red"
              : "orange";
        return `
      <span style="color: ${color};">
        ${actualDaysSinceElapsed} / 
        <span style="background-color: ${color}; color: white; border-radius: 50%; padding: 5px 6px;">
          ${row.aiTracking}
        </span>
      </span>`;
      },
    },
  ];

  tableServerSide = $("#YRreport223").DataTable({
    serverSide: true, // Enable server-side processing
    processing: true, // Show a loading indicator
    scrollX: true, // Horizontal Scroll
    ajax: {
      // url: cp + "/analytics/allDataNewAnalysis",
      url: cp + "/analytics/grievances",
      type: "POST",
      // async: false,
      contentType: "application/json",
      data: function (d) {
        // Map DataTables parameters to Spring Pageable
        let page = Math.floor(d.start / d.length);
        let size = d.length;
        let sort = [];
        if (d.order && d.order.length > 0) {
          d.order.forEach(function (order) {
            let column = d.columns[order.column].data;
            let direction = order.dir === "asc" ? "ASC" : "DESC";
            sort.push(`${column},${direction}`);
          });
        }
        let search = d.search.value || "";

        // Construct payload
        let payload = {
          draw: d.draw,
          page: page,
          size: size,
          sort: sort,
          search: search,
          filters: { ...globalFilters }
        };

        return chkV(JSON.stringify(payload)); // No chkV encryption for simplicity; adjust if needed
      },
      dataSrc: function (response) {
        //  console.log("Response:", response);
        return response.data.content;
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
  $("#YRreport223_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this)
      .val()
      .replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    tableServerSide.search(cleanValue).draw(); // Update DataTable search
  });
}

function serverSideAnalysisChart() {
  let payload = {
    filters: { ...globalFilters }
  };
  var settings = {
    url: cp + "/analytics/grievancesChart",
    method: "POST",
    timeout: 0,
    // async: false,
    contentType: "application/json",
    data: chkV(JSON.stringify(payload)),
  };

  $.ajax(settings).done(function (response) {
    // console.log('ServerSide Chart', response);
    return Progress(response || {});
  });

  function Progress(data) {
    // Monthly Citizen Registration Chart
    (function () {
      let monthlyCitizens = data.monthlyCitizens;
      if (!monthlyCitizens) return;
      $("#total_cmonthly1").html(
        monthlyCitizens !== undefined &&
          monthlyCitizens !== null &&
          monthlyCitizens.length > 0
          ? monthlyCitizens[0].total_count
          : 0
      );
      const statewisestatename = monthlyCitizens.map((item) => item.month_year);
      const statewisecount = monthlyCitizens.map((item) => item.count);
      // Draw Chart
      statewisechart1.updateOptions({
        xaxis: {
          categories: statewisestatename,
        },
        series: [
          {
            name: "Counts",
            data: statewisecount,
          },
        ],
      });
      mcr_table.clear();
      mcr_table.rows.add(monthlyCitizens);
      mcr_table.draw();
    })();

    // Monthly Grievance Chart
    (function () {
      let monthlyGrievances = data.monthlyGrievances;
      if (!monthlyGrievances) return;
      const totalCount = monthlyGrievances.reduce(
        (sum, item) => sum + item.count,
        0
      );
      $("#total_monthly_grvs").text(totalCount.toLocaleString());
      const statewisestatenames = monthlyGrievances.map(
        (item) => item.month_year
      );
      const statewisecounts = monthlyGrievances.map((item) => item.count);
      statewisechart.updateOptions({
        xaxis: {
          categories: statewisestatenames,
        },
        series: [
          {
            name: "Counts",
            data: statewisecounts,
          },
        ],
      });
      mg_table.clear();
      mg_table.rows.add(monthlyGrievances);
      mg_table.draw();
    })();

    // Departmental Grievance Chart
    (function () {
      let departmentalGrievances = data.departmentalGrievances;
      if (!departmentalGrievances) return;
      const totalCount = departmentalGrievances.reduce(
        (sum, item) => sum + item.count,
        0
      );

      $("#dept_grvs").text(totalCount.toLocaleString());
      const statenames = departmentalGrievances.map((item) => item.department);
      const counts = departmentalGrievances.map((item) => item.count);
      chart.updateOptions({
        xaxis: {
          categories: statenames,
        },
        series: [
          {
            name: "Counts",
            data: counts,
          },
        ],
      });
      chart1.updateOptions({
        series: counts,
        labels: statenames,
      });
      dg_table.clear();
      dg_table.rows.add(departmentalGrievances);
      dg_table.draw();
    })();

    // DistrictWise Report And Chart
    (function () {
      let districtWiseChartReport = data.districtWiseChartReport;
      if (!districtWiseChartReport) return;
      const totalCount = districtWiseChartReport.reduce(
        (sum, item) => sum + item.total_count,
        0
      );
      $("#distwise_grvs").text(totalCount.toLocaleString());
      const distwisestatenames = districtWiseChartReport.map(
        (item) => item.dm_district
      );
      const distwisecounts = districtWiseChartReport.map(
        (item) => item.total_count
      );
      // district wise bar chart
      distwisechart.updateOptions({
        xaxis: {
          categories: distwisestatenames,
        },
        series: [
          {
            name: "Counts",
            data: distwisecounts,
          },
        ],
      });
      // district wise pie chart
      chart_pie.updateOptions({
        series: distwisecounts,
        labels: distwisestatenames,
      });
      // district wise table
      distPertainTable.clear();
      distPertainTable.rows.add(districtWiseChartReport);
      distPertainTable.draw();
    })();

    // DayWise Chart
    (function () {
      let dayWise = data.dayWise;
      let overall = data.dayWiseOverall;
      if (!dayWise && !overall) return;
      const totalCount = dayWise.reduce((sum, item) => sum + item.count, 0);
      $("#dayWise_grvs").text(totalCount.toLocaleString());
      const ldSelect = document.getElementById("line-date-select");
      const lineYearSelect = document.getElementById("line-year");
      if (dayWise != undefined && dayWise != null && dayWise.length > 0) {
        const matchingOption1 = ldSelect.querySelector(
          `option[value="${dayWise[0].current_month}"]`
        );
        if (matchingOption1) {
          matchingOption1.selected = true;
        }
        const lineYearSelectOption = lineYearSelect.querySelector(
          `option[value="${dayWise[0].current_year}"]`
        );
        if (lineYearSelectOption) {
          lineYearSelectOption.selected = true;
        }
      }
      const dstatenames = dayWise.map((item) =>
        item.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$3-$2-$1").substring(0, 2)
      );
      const dcounts = dayWise.map((item) => item.count);
      dchart.updateOptions({
        xaxis: {
          categories: dstatenames,
        },
        series: [
          {
            name: "Counts",
            data: dcounts,
          },
        ],
      });
      // day wise table
      overall_table.clear();
      overall_table.rows.add(overall);
      overall_table.draw();
    })();

    // MobileApp Chart
    (function () {
      let mobileapp = data.mobileapp;
      // console.log("mobileapp:", mobileapp);
      if (!mobileapp) return;
      const totalCount = mobileapp.reduce((sum, item) => sum + item.count, 0);
      $("#total_mac").text(totalCount.toLocaleString());
      const mastatenames = mobileapp.map((item) => item.department);
      const macounts = mobileapp.map((item) => item.count);
      // console.log("mastatenames:", mastatenames);
      // console.log("macounts:", macounts);

      const chartContainer = document.querySelector("#chart_ma");

      // Destroy existing chart instance if present
      if (chartContainer._machart instanceof ApexCharts) {
        chartContainer._machart.destroy();
      }

      const maoptions = {
        chart: {
          type: "bar",
          height: 700,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            horizontal: true,
          },
        },
        series: [
          {
            name: "Counts",
            data: macounts,
          },
        ],
        colors: "#009999",
        xaxis: {
          categories: mastatenames,
        },
        title: {
          // text: 'mobileapp',
          align: "center",
        },
      };

      // Create and render new chart, and store reference on DOM element
      const machart = new ApexCharts(chartContainer, maoptions);
      machart.render();
      chartContainer._machart = machart;
    })();

    // WebApp Chart
    (function () {
      let webapp = data.webapp;
      // console.log("webapp:", webapp);
      if (!webapp) return;
      const totalCount = webapp.reduce((sum, item) => sum + item.count, 0);
      $("#total_wac").text(totalCount.toLocaleString());
      const wastatenames = webapp.map((item) => item.department);
      const wacounts = webapp.map((item) => item.count);
      // console.log("wastatenames:", wastatenames);
      // console.log("wacounts:", wacounts);

      const chartContainer1 = document.querySelector("#chart_wa");

      // Destroy existing chart instance if present
      if (chartContainer1.wachart instanceof ApexCharts) {
        chartContainer1.wachart.destroy();
      }

      const waoptions = {
        chart: {
          type: "bar",
          height: 700,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            horizontal: true,
          },
        },
        series: [
          {
            name: "Counts",
            data: wacounts,
          },
        ],
        colors: "#009999",
        xaxis: {
          categories: wastatenames,
        },
        title: {
          // text: 'webapp',
          align: "center",
        },
      };

      // Create and render new chart, and store reference on DOM element
      const wachart = new ApexCharts(chartContainer1, waoptions);
      wachart.render();
      chartContainer1._wachart = wachart;
    })();
  }
}

$(".btn-customBtn").on("click", function () {
  var btn = $(this).val();
  const exportType = btn === "buttons-pdf" ? "pdf" : "xlsx";
  const payload = {
    filters: globalFilters,
    exportType: exportType,
  };
  $.ajax({
    url: cp + "/analytics/exportGrievances",
    method: "POST",
    timeout: 0,
    xhrFields: {
      responseType: 'blob'
    },
    contentType: "application/json",
    data: chkV(JSON.stringify(payload)),
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

// ================================================== ReStructuring of ServerSideDtAnalytical & ServerSideChartAnalytical (end) (26 June 2025 - SKY) ==================================================


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
    url: cp + "getGrievancesByMobile?d=" + d,
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