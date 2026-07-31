$(function () {
  loadFeedBack();
  loadMisIndividual();
  loadMisDept();
  //   for age analysis report on load of agepage endpoint
  if (window.location.href.indexOf("/feedbackAnalysis") != -1) {
    // alert('working...')
    feedbackAnalysisAPIs();
    departments();
    districtss();

    // var usrType=$('#usrType').val();
    // if(usrType=='ROLE_Admin'){
    //   $("#departmentss").prop(":selectedIndex", 1);
    // }

  }

  $(".multi-select2").select2({
    placeholder: "",
    allowClear: true, // Optional, adds a clear button
    //selectOnClose: true // automactic selection when drop down is closed
    //closeOnSelect: false, // auto close of drop down after selection is not allowed
    //maximumSelectionLength: 2, // limiting user selection
  });
});



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

$("#reset").click(function () {
  window.location.reload();
});

// ===================================================== FEEDBACK CHART's / GRAPH's =====================================================
var MyGlobalObject1 = {};
var MyGlobalObject2 = {};
// PIE CHART - start
function chartMaster(dataF, divId) {
  if (MyGlobalObject2[divId]) {
    // Check if chart exists, dispose it
    MyGlobalObject2[divId].dispose();
  }
  am5.ready(function () {
    var root = am5.Root.new(divId);
    root._logo.dispose();
    // Set roots
    MyGlobalObject2[divId] = root;
    root.setThemes([am5themes_Animated.new(root)]);
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );
    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        alignLabels: true,
        calculateAggregates: true,
        valueField: "count",
        categoryField: "status",
      })
    );
    series.labels.template.setAll({
      maxWidth: 150,
      oversizedBehavior: "wrap", // to truncate labels, use "truncate"
      fontSize: 12,
    });
    series.data.setAll(dataF);

    // Click event naitik changes 10/03/2026
    series.slices.each(function (slice) {
      slice.events.on("click", function (ev) {
        // console.log("Clicked dataContext:", slice.dataItem.dataContext);
        $("html, body").animate({ scrollTop: 0 }, "slow");
        var dataContext = slice.dataItem.dataContext;
        dataContext.attribute = attribute;
        chartBasedfilterData(dataContext);
      });
    });

    //Naitik changes End 

    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 12,
      })
    );
    legend.data.setAll(series.dataItems);

    // Adding the Exporting functionality integration
    var exporting = am5plugins_exporting.Exporting.new(root, {
      menu: am5plugins_exporting.ExportingMenu.new(root, {
        items: [
          {
            label: "PNG",
            format: "png", // Restrict to PNG
          },
          {
            label: "JPG",
            format: "jpg", // Restrict to JPG
          },
        ],
      }),
      dataSource: dataF, // Provide the same data that the chart is using
    });


    series.appear(1000, 100);
    chart.appear(1000, 100);
  });
}
// PIE CHART - end

// BAR CHART - start
function AMchart(data, divId) {
  if (MyGlobalObject1[divId]) {
    //check if exist chart dispose that
    MyGlobalObject1[divId].dispose();
  }
  var root = am5.Root.new(divId);
  root._logo.dispose();
  MyGlobalObject1[divId] = root;
  root.setThemes([am5themes_Animated.new(root)]);
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0,
      paddingRight: 1,
    })
  );

  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);
  var xRenderer = am5xy.AxisRendererX.new(root, {
    minGridDistance: 30,
    minorGridEnabled: true,
  });
  xRenderer.labels.template.setAll({
    // rotation: -90,
    //rotation: -30,
    //centerY: am5.p50,
    //centerX: am5.p100,
    //paddingRight: 15,
    location: 0.5,
    fontSize: 12,
    oversizedBehavior: "wrap",
    textAlign: "center",
    maxWidth: 90,
  });
  xRenderer.grid.template.setAll({
    location: 1,
  });
  var xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "status",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {}),
    })
  );
  var yRenderer = am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1,
  });
  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      maxPrecision: 0,
      renderer: yRenderer,
    })
  );
  // Create a universal tooltip to be used for multiple series - start - SKY
  var tooltip = am5.Tooltip.new(root, {
    getFillFromSprite: false,
    getStrokeFromSprite: true,
    autoTextColor: false,
    getLabelFillFromSprite: true,
    labelText: "[bold]{categoryX}: {valueY}",
  });

  tooltip.get("background").setAll({
    fill: am5.color(0xffffff),
    fillOpacity: 0.8,
  });
  // Create a universal tooltip to be used for multiple series - end - SKY

  var series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      sequencedInterpolation: true,
      categoryXField: "status",
      tooltip: tooltip,
    })
  );

  series.columns.template.events.on("click", function (event) {
    // console.log("Bar clicked");
    var barData = event.target.dataItem.dataContext;
    // console.log(barData)
    $("html, body").animate({ scrollTop: 0 }, "slow");
    chartBasedfilterData(barData);
  });

  series.columns.template.setAll({
    cornerRadiusTL: 5,
    cornerRadiusTR: 5,
    strokeOpacity: 0,
    width: 50,
  });
  series.columns.template.adapters.add("fill", function (fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.adapters.add("stroke", function (stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });
  var dataaa = data;
  xAxis.data.setAll(dataaa);

  series.data.setAll(dataaa);
  series.appear(1000);
  chart.appear(1000, 100);

  // Exporting functionality integration
  var exporting = am5plugins_exporting.Exporting.new(root, {
    menu: am5plugins_exporting.ExportingMenu.new(root, {
      items: [
        {
          label: "PNG",
          format: "png", // Restrict to PNG
        },
        {
          label: "JPG",
          format: "jpg", // Restrict to JPG
        }
      ],
    }),
    dataSource: dataaa,  // Provide the same data that the chart is using
  });

}
// BAR CHART - end
// ===================================================== FEEDBACK CHART's / GRAPH's =====================================================

// ===================================================== FEEDBACK CHART's / GRAPH's API's================================================
// 30 April 2024 - SKY

function departments() {
  $("#departmentss").html("");
  $("#departmentss").append('<option value="0">Select</option>');
  var division = "none";
  if (division != 0) {
    var c = JSON.stringify({
      divison: division,
    });
    var d = chkV(c);
    var settings = {
      url: "departmentForGraph?d=" + d,
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
      // console.log(j)
      if (j.statusCode == "1" && j.userType == "ROLE_Admin") {

        $('#catGraph').attr("disabled", false);
        $("#departmentss").attr("disabled", true);
        makeDropdown(departmentss, j.data);
        $("#departmentss").prop("selectedIndex", 1);
        getCategory();
      } else {
        $('#catGraph').attr("disabled", false);
        makeDropdown(departmentss, j.data);
      }
    });
  } else {
    $("#departmentss").html("");
    $("#departmentss").append('<option value="0">Select</option>');
  }
}

$("#departmentss").change(function () {
  getCategory();
  loadMisIndividual();
  loadMisDept();
});

function getCategory() {

  $("#catGraph").html("");
  $("#catGraph").append('<option value="0">Select</option>');
  var val = $("#departmentss").find(":selected").val();

  // if (val != 0) {
  //console.log(val);
  var c = JSON.stringify({
    value: val,
  });
  var d = chkV(c);
  var settings = {
    url: cp + "/analytics/categ?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    //  console.log(j);
    makeDropdown(catGraph, j.data);
    feedbackAnalysisAPIs();
    loadFeedBack();
    if (j.statusCode == "1") {
      if (j.data.length == 1) {
        $("#catGraph").attr("disabled", false);
      }
    } else {
    }
  });
}
//}

$("#catGraph").change(function () {
  var categName = $("#catGraph").find(":selected").val();
  if (categName != "0") {
    feedbackAnalysisAPIs();
    loadFeedBack();
  }
});
$("#selGender").change(function () {
  var selGender = $("#selGender").find(":selected").val();
  if (selGender != "0") {
    feedbackAnalysisAPIs();
    loadFeedBack();
  }
});


function feedbackAnalysisAPIs() {
  // Pie Chart Functions
  pieChart1();
  pieChart2();
  pieChart3();
  pieChart4();
  // Bar Chart Functions
  barChart1();
  barChart2();
}
function pieChart1() {
  var departmentName = $("#departmentss").find(":selected").val();
  var categName = $("#catGraph").find(":selected").val();
  var selGender = $("#selGender").find(":selected").val();
  //Naitik Changes Start
  var dateFrom = $("#dateFrom").val();
  var dateTo = $("#dateTo").val();
  var district = $("#districtss").find(":selected").val();//Naitik Changes End

  var c = JSON.stringify({
    value: "pieChart1",
    department: departmentName,
    category: categName,
    gender: selGender,
    //Naitik Changes Start
    toDate: dateTo,
    fromDate: dateFrom,
    attribute: null,
    district: district,//Naitik Changes End 


  });
  var d = chkV(c);
  var settings = {
    url: "feedbackPieGraph1?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    if (j.statusCode == "1") {
      // console.log(j.data);
      var data = j.data;
      var obj1 = { attribute: "satisfied", status: "Yes", count: data[0].Yes };
      var obj2 = { attribute: "satisfied", status: "No", count: data[0].No };

      var arr = [obj1, obj2];
      chartMaster(arr, "pieDiv1");
    }
  });
}
function pieChart2() {
  var departmentName = $("#departmentss").find(":selected").val();
  var categName = $("#catGraph").find(":selected").val();
  var selGender = $("#selGender").find(":selected").val();

  //Naitik Changes Start
  var dateFrom = $("#dateFrom").val();
  var dateTo = $("#dateTo").val();
  var district = $("#districtss").find(":selected").val();//Naitik Changes End 

  var c = JSON.stringify({
    value: "pieChart2",
    department: departmentName,
    category: categName,
    gender: selGender,

    //Naitik Changes Start
    toDate: dateTo,
    fromDate: dateFrom,
    attribute: null,
    district: district,//Naitik Changes End 

  });
  var d = chkV(c);
  var settings = {
    url: "feedbackPieGraph1?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    if (j.statusCode == "1") {
      // console.log(j.data);
      var data = j.data;
      var obj1 = {
        attribute: "call_received",
        status: "Yes",
        count: data[0].Yes,
      };
      var obj2 = {
        attribute: "call_received",
        status: "No",
        count: data[0].No,
      };

      var arr = [obj1, obj2];
      chartMaster(arr, "pieDiv2");
    }
  });
}
function pieChart3() {
  var departmentName = $("#departmentss").find(":selected").val();
  var categName = $("#catGraph").find(":selected").val();
  var selGender = $("#selGender").find(":selected").val();

  var dateFrom = $("#dateFrom").val();//Naitik Changes Start
  var dateTo = $("#dateTo").val();
  var district = $("#districtss").find(":selected").val();//Naitik Changes End 


  var c = JSON.stringify({
    value: "pieChart3",
    department: departmentName,
    category: categName,
    gender: selGender,
    //Naitik Changes Start
    toDate: dateTo,
    fromDate: dateFrom,
    attribute: null,
    district: district,//Naitik Changes End 

  });
  var d = chkV(c);
  var settings = {
    url: "feedbackPieGraph1?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    if (j.statusCode == "1") {
      // console.log(j.data);
      var data = j.data;
      var obj1 = { attribute: "rating1", status: "1-5", count: data[0].r1 };
      var obj2 = { attribute: "rating1", status: "6-10", count: data[0].r2 };

      var arr = [obj1, obj2];
      chartMaster(arr, "pieDiv3");
    }
  });
}
function pieChart4() {
  var departmentName = $("#departmentss").find(":selected").val();
  var categName = $("#catGraph").find(":selected").val();
  var selGender = $("#selGender").find(":selected").val();

  var dateFrom = $("#dateFrom").val();//Naitik Changes Start 

  var dateTo = $("#dateTo").val();//Naitik Changes 
  var district = $("#districtss").find(":selected").val();//Naitik Changes 

  var c = JSON.stringify({
    value: "pieChart4",
    department: departmentName,
    category: categName,
    gender: selGender,
    //NAitik Changes Start 
    toDate: dateTo,
    fromDate: dateFrom,
    attribute: null,
    district: district,//Naitik Changes End


  });
  var d = chkV(c);
  var settings = {
    url: "feedbackPieGraph1?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    if (j.statusCode == "1") {
      // console.log(j.data);
      var data = j.data;
      var obj1 = { attribute: "rating2", status: "1-5", count: data[0].r3 };
      var obj2 = { attribute: "rating2", status: "6-10", count: data[0].r4 };

      var arr = [obj1, obj2];
      chartMaster(arr, "pieDiv4");
    }
  });
}
function barChart1() {
  var departmentName = $("#departmentss").find(":selected").val();
  var categName = $("#catGraph").find(":selected").val();
  var selGender = $("#selGender").find(":selected").val();
  var dateFrom = $("#dateFrom").val();//Naitik Changes Start
  var dateTo = $("#dateTo").val();
  var district = $("#districtss").find(":selected").val();//Naitik Changes End

  var c = JSON.stringify({
    value: "barChart1",
    department: departmentName,
    category: categName,
    gender: selGender,
    toDate: dateTo,
    fromDate: dateFrom,
    attribute: null,
    district: district,//Naitik Changes
  });
  var d = chkV(c);
  var settings = {
    url: "feedbackPieGraph1?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    if (j.statusCode == "1") {
      // console.log(j.data);
      var data = j.data;
      var obj1 = {
        attribute: "grv_process",
        status: "Grievance Lodging",
        count: data[0].grvp1,
      };
      var obj2 = {
        attribute: "grv_process",
        status: "Visit of Department Officails",
        count: data[0].grvp2,
      };
      var obj3 = {
        attribute: "grv_process",
        status: "Lodging Appeal",
        count: data[0].grvp3,
      };
      var obj4 = {
        attribute: "grv_process",
        status: "Resolution Provided by Department",
        count: data[0].grvp4,
      };

      var arr = [obj1, obj2, obj3, obj4];
      // AMchart(arr, "barDiv1");
    }
  });
}
function barChart2() {
  var departmentName = $("#departmentss").find(":selected").val();
  var categName = $("#catGraph").find(":selected").val();
  var selGender = $("#selGender").find(":selected").val();
  var dateFrom = $("#dateFrom").val();//Naitik Changes start 
  var dateTo = $("#dateTo").val();
  var district = $("#districtss").find(":selected").val();//Naitik Changes End 
  var c = JSON.stringify({
    value: "barChart2",
    department: departmentName,
    category: categName,
    gender: selGender,

    //NAitik Changes Start
    toDate: dateTo,
    fromDate: dateFrom,
    attribute: null,
    district: district,//Naitik Changes End 
  });
  var d = chkV(c);
  var settings = {
    url: "feedbackPieGraph1?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    if (j.statusCode == "1") {
      // console.log(j.data);
      var data = j.data;
      var obj1 = {
        attribute: "reccomendation",
        status: "Yes, definitely",
        count: data[0].rec1,
      };
      var obj2 = {
        attribute: "reccomendation",
        status: "Maybe, if it take less time",
        count: data[0].rec2,
      };
      var obj3 = {
        attribute: "reccomendation",
        status: "No, never",
        count: data[0].rec3,
      };
      var obj4 = {
        attribute: "reccomendation",
        status: "Maybe, if the process will change",
        count: data[0].rec4,
      };

      var arr = [obj1, obj2, obj3, obj4];
      AMchart(arr, "barDiv2");
    }
  });
}

// ===================================================== FEEDBACK CHART's / GRAPH's API's================================================

// ========================================================== FEEDBACK TABLE =============================================================
function chartBasedfilterData(data) {
  // console.log(data);
  loadFeedBack(data);
}

function loadFeedBack(data) {
  // console.log("loadFeedBack")
  // console.log(data!= undefined)
  var departmentName = $("#departmentss").find(":selected").val();
  var categName = $("#catGraph").find(":selected").val();
  var selGender = $("#selGender").find(":selected").val();
  var district = $("#districtss").find(":selected").val();//Naitik Changes 
  var dateFrom = $("#dateFrom").val();
  var dateTo = $("#dateTo").val();
  var attr = "0";
  var stat = "0";
  if (data != undefined) {
    attr = data.attribute;
    stat = data.status;
  }

  var c = JSON.stringify({
    value: "feedbackTbl",
    department: departmentName,
    category: categName,
    gender: selGender,
    toDate: dateTo,
    fromDate: dateFrom,
    attribute: attr,
    status: stat,
    district: district
  });
  var d = chkV(c);
  var settings = {
    url: cp + "/analytics/loadfeedbackdata?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = JSON.parse(setV(j));
    // console.log(j);
    //console.log("RAW DATA ROW 0:", j.data[0]);
    if (j.statusCode == "1" && j.data.length > 0) {
      j.data = j.data.map((current) => {
        if (current.feedback_received != null) {
          current.feedback_received = format_date(current.feedback_received);
        }
        return current;
      });
      makeFeedbackDataTable(j.data);
    } else {
      makeFeedbackDataTable(0);
    }
  });
}
function makeFeedbackDataTable(data) {
  $("#feedBackTbl").empty();
  // Dynamically create columns based on the keys of the first object
  // var columns = [];
  // $.each(data[0], function(key, value) {
  //     columns.push({ data: key, title: key });
  // });

  $(".btnFD-customBtn").on("click", function () {
    // console.log($(this).val());
    table129.button("." + $(this).val()).trigger();
  });

  var table129 = $("#feedBackTbl").DataTable({
    data: data,
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
    //columns: columns,
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
        data: "categ",
        defaultContent: "",
        title: "Main Category",
      },
      {
        data: "feedback_received",
        defaultContent: "",
        title: "Feedback",
      },
      {
        data: "gender",
        defaultContent: "",
        title: "Gender",
      },
      {
        data: "uniqid",
        defaultContent: "",
        class: "noExport",
        title: "Details",
        render: function (data, type, row, meta) {
          var btn =
            '<div class = ""><button class="btn btn-sm btn-primary bi bi-eye vDetails m-2" data-appflag = "JKSAMADHAN" title="View History" value="' +
            data +
            '"></button>'
            +
            '<button class="btn btn-sm btn-warning bi bi-eye vfbFormPreview" title="View Feedback Preview" value="' +
            data +
            '"></button>';
          return btn + "</div>";
        },
      },
    ],
  });

  $("#feedBackTbl_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table129.search(cleanValue).draw(); // Update DataTable search
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
  console.log(c)
  // let d = chkV(c);
  // // window.location.href = "grievanceDatail?d=" + d;
  // window.open("grievanceDatail?d=" + d, "_blank");
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

// $(document).on("click", ".vfbFormPreview", function (e) {
//   let c = e.target.value;
//   console.log(c);
//   let d = chkV(c);
//   var settings = {
//     url: "getfeedbackFormData?d=" + d,
//     method: "POST",
//     timeout: 0,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   $.ajax(settings).done(function (j) {
//     j = setV(j);
//     j = JSON.parse(j);
//     console.log(j.data)
//     // if (j.statusCode != 0 && j.data.length > 0) {
//     //   j.data = j.data.map((current) => {
//     //     if (current.created_date != null) {
//     //       current.created_date = format_date(current.created_date);
//     //     }
//     //     return current;
//     //   });
//     // }
//   });
//   // show modal
//   $("#fbFormPreview").modal("show");
// });


//Naitik changes 10/03/2026

function chartBasedfilterData(dataContext) {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  loadFeedBack({
    attribute: dataContext.attribute,
    status: dataContext.status
  });
}
//Naitik changes End 10/03/2026
// // ========================================================== FEEDBACK TABLE =============================================================


$(document).on("click", ".vfbFormPreview", function (e) {
  let c = e.target.value;
  console.log(c);
  let d = chkV(c);
  var settings = {
    url: "getfeedbackFormData?d=" + d,
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    // console.log("jjjjjjjjjjjjjjjjjjjjjjjjjj",j.data)
    const data = j.data[0];

    console.log("data.satisfied", data.satisfied)


    if (data.satisfied === "Yes") {
      $("#satisfied-Yes").prop("checked", true);
      $(".noDiv").addClass("visually-hidden");
    } else if (data.satisfied === "No") {
      $("#satisfied-No").prop("checked", true);
      $(".noDiv").removeClass("visually-hidden");
      $("#description-box").val(data.description).prop("readonly", true);
      $("#satisfied-Yes").prop("disabled", true);
      $("#satisfied-No").prop("disabled", true);

    }



    if (data.call_received === "Yes") {
      $("#call-msg-Yes").prop("checked", true);
    } else if (data.call_received === "No") {
      $("#call-msg-No").prop("checked", true);
      $("#call-msg-Yes").prop("disabled", true);
      $("#call-msg-No").prop("disabled", true);

    }


    // For rating1
    $(".rating1").removeClass("rg-selectedBtn");
    $(".rating1").each(function () {
      let btnVal = $(this).text().trim();
      let ratingVal = String(data.rating1).trim();
      if (btnVal === ratingVal) {
        $(this).addClass("rg-selectedBtn");
      }
    });

    // For rating2
    $(".rating2").removeClass("rg-selectedBtn");
    $(".rating2").each(function () {
      let btnVal = $(this).text().trim();
      let ratingVal = String(data.rating2).trim();
      if (btnVal === ratingVal) {
        $(this).addClass("rg-selectedBtn");
      }
    });



    $("input[name='loading']").each(function () {
      if ($(this).val() === data.reccomendation) {
        $(this).prop("checked", true).prop("disabled", true);
      }
    });


    $("#uniqueID").text(data.uniqid);
    $("#Grevstatus").text(data.status);
    $("#departmentId").text(data.department);
    $("#last_updated_on").text(data.last_updated_on);
    // if (j.statusCode != 0 && j.data.length > 0) {
    //   j.data = j.data.map((current) => {
    //     if (current.created_date != null) {
    //       current.created_date = format_date(current.created_date);
    //     }
    //     return current;
    //   });
    // }

    $("#fbFormPreview").modal("show");
  });
  // show modal

});

function makeDropdownSafe(selectorId, data) {
  const $target = $(selectorId);

  if ($target.length === 0) {
    console.error("Dropdown not found:", selectorId);
    return;
  }

  $target.empty().append('<option value="0">Select</option>');

  $.each(data, function (index, item) {
    if (item && item.values) {
      $target.append(
        $("<option></option>")
          .attr("value", item.values)
          .text(item.values.toUpperCase())
      );
    }
  });
}




function districtss() {
  const selector = "#districtss";
  $(selector).html("");
  $(selector).append('<option value="0">Select</option>');


  $.ajax({
    url: cp + "/analytics/districtForGraph",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
  }).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);

    // if (j.statusCode == "1" && j.userType == "ROLE_SuperAdmin") {
    // Naitik - changes
    if (j.statusCode == "1" && j.userType == "ROLE_SuperAdmin" || j.userType == 'ROLE_Admin' || j.userType == 'ROLE_DM') {

      console.log("Dropdown Data:", j.data);
      makeDropdownSafe(selector, j.data);
      $(selector).prop("selectedIndex", 0);
    }
  });


}



$("#districtss").change(function () {
  var distName = $("#districtss").find(":selected").val();
  if (distName != "0") {
    feedbackAnalysisAPIs();
    loadFeedBack();
  }
});



$(document).on("change", "#dateFrom", function (e) {

  var dateFrom = e.target.value;
  console.log(dateFrom)
  if (dateFrom != "0") {
    feedbackAnalysisAPIs();
    loadFeedBack();
  }
});


$(document).on("change", "#dateTo", function (e) {
  var dateTo = e.target.value;
  if (dateTo != "0") {
    feedbackAnalysisAPIs();
    loadFeedBack();
  }
});


function loadMisDept() {
  var table;
  var department = $('#departmentss').val()

  table = new DataTable("#misReportTableDepartment", {
    serverSide: true,
    processing: true,
    destroy: true,
    scrollX: true,
    //Naitik Changes on MIS 03/10/2025
    autoWidth: false,
    //Naitik Changes End
    // lengthMenu: [10, 50, 100],
    dom: 'Bfrtip',

    columns: [
      {
        render: function (data, type, row, meta) {
          return meta.settings._iDisplayStart + meta.row + 1;
        }
      },
      { data: 'department' },

      { data: 'totalGrievances' },

      { data: 'satisfiedYesPercent' },
      { data: 'satisfiedNoPercent' },

      { data: 'callReceivedYesPercent' },
      { data: 'callReceivedNoPercent' },

      { data: 'grievanceProcess1_5Percent' },
      { data: 'grievanceProcess6_10Percent' },

      { data: 'lodgingProcess1_5Percent' },
      { data: 'lodgingProcess6_10Percent' },

      { data: 'recommendYesDefinitely' },
      { data: 'recommendMaybeLessTime' },
      { data: 'recommendNoNever' },
      { data: 'recommendProcessChange' }
    ],
    ajax: {
      url: "loadMisRepoDept",
      method: "POST",
      contentType: "application/json",
      data: function (d) {
        // console.log(d)
        const content = {
          draw: d.draw,
          page: d.start / d.length,
          size: d.length,
          search: d.search.value,
          export: false,
          department: department

        }
        // console.log(content)
        lastRequest = { ...content, export: true };
        return chkV(JSON.stringify(content));
      },
      dataFilter: function (data) {
        data = setV(data);
        data = JSON.parse(data);

        return JSON.stringify(data);
      }
    },
    lengthMenu: [2, 10, 50, 100],
    pageLength: 10
  });


  $("#misReportTableDepartment_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table181.search(cleanValue).draw(); // Update DataTable search
  });


  $(".dwd-customBtnDept").on("click", function () {

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
      url: "loadMisRepoDept",
      method: "POST",
      timeout: 0,
      contentType: 'application/json',
      xhrFields: {
        responseType: 'blob'  // 
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


}


//Naitik Changes END





//load Mis Report Individual Changes by Naitik

function loadMisIndividual() {
  var table;
  var departments = $('#departmentss').val()
  table = new DataTable("#misReportTable", {
    serverSide: true,
    processing: true,
    destroy: true,
    scrollX: true,
    dom: 'Bfrtip',

    columns: [
      {
        render: function (data, type, row, meta) {
          return meta.settings._iDisplayStart + meta.row + 1;
        }
      },
      { data: 'department' },

      { data: 'uniqid' },

      { data: 'complainantName' },



      { data: 'complainantMobile' },

      { data: 'userInfo' },

      { data: 'satisfiedYesPercent' },
      { data: 'satisfiedNoPercent' },

      { data: 'callReceivedYesPercent' },
      { data: 'callReceivedNoPercent' },

      { data: 'grievanceProcess1_5Percent' },
      { data: 'grievanceProcess6_10Percent' },

      { data: 'lodgingProcess1_5Percent' },
      { data: 'lodgingProcess6_10Percent' },

      { data: 'recommendYesDefinitely' },
      { data: 'recommendMaybeLessTime' },
      { data: 'recommendNoNever' },
      { data: 'recommendProcessChange' }
    ],
    ajax: {
      url: "loadMisUser",
      method: "POST",
      contentType: "application/json",
      //Naitik Changes on 19/09/2025
      data: function (d) {
        const content = {
          draw: d.draw,
          page: d.start / d.length,
          size: d.length,
          search: d.search.value,
          export: false,
          departments: departments || "0"
        }
        // console.log("Sending data:", content);
        lastRequest = { ...content, export: true };
        return chkV(JSON.stringify(content));
      },
      //Naitik Changes End
      dataFilter: function (data) {
        data = setV(data);
        data = JSON.parse(data);
        //console.log(data)
        // const parsed = JSON.parse(data);
        // const decrypted = JSON.parse(setV(parsed.result)); // decrypt + parse JSON
        // console.log("Decrypted Response for DataTables:", decrypted);
        // dataForDownload = decrypted.data;
        // ✅ Return the full JSON string (draw, recordsTotal, etc.)
        return JSON.stringify(data);
      }
    },
    lengthMenu: [2, 10, 50, 100],
    pageLength: 10
  });

  $("#misReportTable_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
    $(this).val(cleanValue);
    table181.search(cleanValue).draw(); // Update DataTable search
  });


  $(".dwd-customBtn").on("click", function () {

    var btn = $(this).val();
    const exportType = btn === "buttons-pdf" ? "pdf" : "xlsx";

    const exportRequest = {
      ...lastRequest,
      page: 0,
      size: 2147483647,
      exportType: exportType
    }

    //  console.log(exportRequest);


    $.ajax({
      url: "loadMisUser",
      method: "POST",
      timeout: 0,
      contentType: 'application/json',
      xhrFields: {
        responseType: 'blob'
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


}

//Naitik Changes on Radio Button for MIS Reports 03/10/2025
// Naitik Changes - Merged & Fixed Radio Button Toggle
document.addEventListener("DOMContentLoaded", function () {

  // SAFE HELPERS
  function safeClosest(id, selector) {
    const el = document.getElementById(id);
    return el ? el.closest(selector) : null;
  }

  // MIS ROWS
  const overallRow = safeClosest("misReportTable", ".row");
  const departmentRow = safeClosest("misReportTableDepartment", ".row");

  // FEEDBACK SECTIONS
  const feedbackTableRow = safeClosest("feedBackTbl", ".row");
  const feedbackPieDiv = document.getElementById("feedbackGraphPieDiv");
  const feedbackBarDiv = document.getElementById("feedbackGraphBarDiv");

  // FILTERS
  const filters = ["#catGraph", "#selGender", "#dateFrom", "#dateTo", "#districtss"]
    .map(sel => document.querySelector(sel)?.closest(".col-md-2"))
    .filter(Boolean);

  const mainRadios = document.querySelectorAll(".report-toggle-main");

  // HIDE / SHOW HELPERS
  function hideAll() {
    [overallRow, departmentRow, feedbackTableRow, feedbackPieDiv, feedbackBarDiv]
      .forEach(el => el && (el.style.display = "none"));
  }

  function hideAllFilters() {
    filters.forEach(f => f.style.display = "none");
  }

  function showAllFilters() {
    filters.forEach(f => f.style.display = "block");
  }

  // DATATABLE ADJUST
  function adjustVisibleTables() {
    setTimeout(function () {
      [
        ['#misReportTable', overallRow],
        ['#misReportTableDepartment', departmentRow],
        ['#feedBackTbl', feedbackTableRow]
      ].forEach(function ([selector, rowElem]) {
        if ($.fn.dataTable.isDataTable(selector) && $(rowElem).is(':visible')) {
          $(selector).DataTable().columns.adjust().draw(false);
        }
      });
    }, 80);
  }

  // MAIN TOGGLE
  function toggleMainView() {
    const selected = document.querySelector('input[name="mainReportType"]:checked')?.value;

    hideAll();
    hideAllFilters();

    if (selected === "mis") {
      if (overallRow) overallRow.style.display = "block";
      if (departmentRow) departmentRow.style.display = "block";

      $("#departmentFilter").prop("disabled", false).closest('.col-md-2').show();

    } else if (selected === "feedback") {
      if (feedbackTableRow) feedbackTableRow.style.display = "block";
      if (feedbackPieDiv) feedbackPieDiv.style.display = "block";
      if (feedbackBarDiv) feedbackBarDiv.style.display = "block";

      showAllFilters();

      $("#departmentFilter").prop("disabled", true).closest('.col-md-2').hide();

      // Clear MIS table filters to prevent misalignment
      if ($.fn.dataTable.isDataTable('#misReportTableDepartment')) {
        $('#misReportTableDepartment').DataTable().search('').columns().search('').draw(false);
      }
      if ($.fn.dataTable.isDataTable('#misReportTable')) {
        $('#misReportTable').DataTable().search('').columns().search('').draw(false);
      }

    } else {
      // Fallback: show everything
      [overallRow, departmentRow, feedbackTableRow, feedbackPieDiv, feedbackBarDiv]
        .forEach(el => el && (el.style.display = "block"));
      showAllFilters();
      $("#departmentFilter").prop("disabled", false).closest('.col-md-2').show();
    }

    adjustVisibleTables();
  }

  // BIND RADIO BUTTONS
  mainRadios.forEach(radio => radio.addEventListener("change", toggleMainView));

  // INITIAL LOAD
  toggleMainView();

  // FILTER EVENT HANDLERS
  $('#departmentFilter').on('change', function () {
    if ($.fn.dataTable.isDataTable('#misReportTableDepartment')) {
      const dt = $('#misReportTableDepartment').DataTable();
      dt.draw(false);
      setTimeout(() => dt.columns.adjust().draw(false), 60);
    }
  });

  $('#catGraph, #selGender, #dateFrom, #dateTo, #districtss').on('change', function () {
    if ($.fn.dataTable.isDataTable('#feedBackTbl')) {
      const dt = $('#feedBackTbl').DataTable();
      dt.draw(false);
      setTimeout(() => dt.columns.adjust().draw(false), 60);
    }
  });

  // Adjust column widths on Bootstrap tab switch
  $(document).on('shown.bs.tab', function () {
    adjustVisibleTables();
  });

});
// Naitik Changes End
