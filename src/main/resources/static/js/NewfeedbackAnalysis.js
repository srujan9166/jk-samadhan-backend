$(function () {
    loadFeedBack();
    loadMisIndividual();
    loadMisDept();
    //   for age analysis report on load of agepage endpoint
    if (window.location.href.indexOf("/NewfeedbackAnalysis") != -1) {
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
function chartMaster(dataF, divId, attribute) {
    if (MyGlobalObject2[divId]) {
        MyGlobalObject2[divId].dispose();
    }

    am5.ready(function () {
        var root = am5.Root.new(divId);
        root._logo.dispose();

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
            oversizedBehavior: "wrap",
            fontSize: 12,
        });

        series.data.setAll(dataF);

        // Tooltip showing count + percentage)
        series.slices.template.setAll({
            tooltipText: "{category}: {value} ({valuePercentTotal.formatNumber('#.00')}%)"
        });

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

        var exporting = am5plugins_exporting.Exporting.new(root, {
            menu: am5plugins_exporting.ExportingMenu.new(root, {
                items: [
                    { label: "PNG", format: "png" },
                    { label: "JPG", format: "jpg" },
                ],
            }),
            dataSource: dataF,
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
    //   console.log(val);
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
        //   console.log(j);
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

//Naitik changes Start on pie charts 30/12/2025

function feedbackAnalysisAPIs() {
    pieChart1();
    pieChart2();
    pieChart3()
    // barChart2();
}

function pieChart1() {


    var departmentName = $("#departmentss").find(":selected").val();
    var categName = $("#catGraph").find(":selected").val();
    var selGender = $("#selGender").find(":selected").val();
    //Naitik Changes Start
    var dateFrom = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();
    var district = $("#districtss").find(":selected").val();//Naitik Changes End
    var ratings = $("#Ratings").find(":selected").val();

    var c = JSON.stringify({
        value: "pieChart1",
        department: departmentName,
        category: categName,
        gender: selGender,
        //Naitik Changes Start
        toDate: dateTo,
        fromDate: dateFrom,
        ratings: ratings,
        attribute: null,
        district: district,
        //Naitik Changes End 
    });

    var d = chkV(c);

    $.post(cp + "/analytics/NewfeedbackGraph?d=" + d, function (j) {

        j = JSON.parse(setV(j));

        if (j.statusCode === "1") {

            let rawData = [
                { status: "Excellent", count: j.data.pie1[0].excellent },
                { status: "Good", count: j.data.pie1[0].good },
                { status: "Average", count: j.data.pie1[0].average },
                { status: "Poor", count: j.data.pie1[0].poor }
            ];

            let finalData = calculatePercentage(rawData);
            chartMaster(finalData, "pieDiv1", "overall_experience");
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
    var ratings = $("#Ratings").find(":selected").val();


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
        ratings: ratings
    });

    var d = chkV(c);

    $.post(cp + "/analytics/NewfeedbackGraph?d=" + d, function (j) {

        j = JSON.parse(setV(j));

        if (j.statusCode === "1") {

            let rawData = [
                { status: "Very Satisfied", count: j.data.pie2[0].verysatisfied },
                { status: "Satisfied", count: j.data.pie2[0].satisfied },
                { status: "Dissatisfied", count: j.data.pie2[0].dissatisfied }
            ];

            let finalData = calculatePercentage(rawData);

            chartMaster(finalData, "pieDiv2", "time_satisfaction");
        }
    });
}



function pieChart3() {

    var departmentName = $("#departmentss").find(":selected").val();
    var categName = $("#catGraph").find(":selected").val();
    var selGender = $("#selGender").find(":selected").val();

    //Naitik Changes Start
    var dateFrom = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();
    var district = $("#districtss").find(":selected").val();//Naitik Changes End 
    var ratings = $("#Ratings").find(":selected").val();


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
        ratings: ratings
    });

    var d = chkV(c);

    $.post(cp + "/analytics/NewfeedbackGraph?d=" + d, function (j) {

        j = JSON.parse(setV(j));

        if (j.statusCode === "1") {

            let rawData = [
                { status: "Yes", count: j.data.pie3[0].yes },
                { status: "Maybe", count: j.data.pie3[0].maybe },
                { status: "No", count: j.data.pie3[0].no }
            ];

            let finalData = calculatePercentage(rawData);

            chartMaster(finalData, "pieDiv3", "reuse_portal");
        }
    });
}


// function barChart2() {
//     var departmentName = $("#departmentss").find(":selected").val();
//     var categName = $("#catGraph").find(":selected").val();
//     var selGender = $("#selGender").find(":selected").val();
//     var dateFrom = $("#dateFrom").val();//Naitik Changes start 
//     var dateTo = $("#dateTo").val();
//     var district = $("#districtss").find(":selected").val();//Naitik Changes End 

//     var c = JSON.stringify({
//         value: "barChart2",
//         department: departmentName,
//         category: categName,
//         gender: selGender,

//         //NAitik Changes Start
//         toDate: dateTo,
//         fromDate: dateFrom,
//         attribute: null,
//         district: district,//Naitik Changes End 
//     });

//     var d = chkV(c);

//     $.post(cp + "/analytics/NewfeedbackGraph?d=" + d, function (j) {

//         j = JSON.parse(setV(j));

//         if (j.statusCode === "1") {

//             let rawData = [
//                 { status: "Yes", count: j.data.bar[0].yes },
//                 { status: "Maybe", count: j.data.bar[0].maybe },
//                 { status: "No", count: j.data.bar[0].no }
//             ];

//             let finalData = calculatePercentage(rawData);

//             AMchart(finalData, "barDiv2");
//         }
//     });
// }



//Naitik Changes for graphs percentage  
function calculatePercentage(dataArr) {
    let total = 0;

    dataArr.forEach(obj => {
        total += Number(obj.count || 0);
    });

    return dataArr.map(obj => {
        let percent = total > 0 ? ((obj.count / total) * 100).toFixed(2) : 0;
        return {
            ...obj,
            percentage: percent,
            label: obj.status + " (" + percent + "%)"
        };
    });
}


//Naitik changes End on 30/12/2025

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
    var category = $("#catGraph").find(":selected").val();
    var selGender = $("#selGender").find(":selected").val();
    var district = $("#districtss").find(":selected").val();//Naitik Changes 
    var dateFrom = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();
    var ratings = $("#Ratings").find(":selected").val();
    var attr = "0";
    var stat = "0";
    if (data != undefined) {
        attr = data.attribute;
        stat = data.status;
    }

    var c = JSON.stringify({
        value: "NewfeedbackTbl",
        department: departmentName,
        category: category,
        gender: selGender,
        toDate: dateTo,
        fromDate: dateFrom,
        attribute: attr,
        status: stat,
        district: district,
        ratings: ratings
    });
    var d = chkV(c);
    var settings = {
        url: cp + "/analytics/Newloadfeedbackdata?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
    };
    $.ajax(settings).done(function (j) {
        j = JSON.parse(setV(j));
        // console.log(j);
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
    $("#NewfeedBackTbl").empty();
    // Dynamically create columns based on the keys of the first object
    // var columns = [];
    // $.each(data[0], function(key, value) {
    //     columns.push({ data: key, title: key });
    // });

    $(".btnFD-customBtn").on("click", function () {
        // console.log($(this).val());
        table129.button("." + $(this).val()).trigger();
    });

    var table129 = $("#NewfeedBackTbl").DataTable({
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
                data: "cateogory",
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
                        '<button class="btn btn-sm btn-warning bi bi-eye vNewfbFormPreview" title="View Feedback Preview" value="' +
                        data +
                        '"></button>';
                    return btn + "</div>";
                },
            },
        ],
    });

    $("#NewfeedBackTbl_filter input[type='search']").on("input", function () {
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
    //  console.log(c)
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

$(document).on("click", ".vNewfbFormPreview", function (e) {

    let c = e.target.value;
    let d = chkV(c);

    var settings = {
        url: cp + "/analytics/getNewfeedbackFormData?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
    };

    $.ajax(settings).done(function (j) {

        j = setV(j);
        j = JSON.parse(j);

        if (j.statusCode !== "1" || !j.data.length) return;

        const data = j.data[0];
        // META INFORMATION
        $("#uniqueID").text(data.uniqid);
        $("#Grevstatus").text(data.status);
        $("#departmentId").text(data.department);
        $("#last_updated_on").text(data.last_updated_on);

        // Q1: Overall Experience
        $("input[name='experience']").each(function () {
            if ($(this).val() === data.overall_experience) {
                $(this).prop("checked", true);
            }
            $(this).prop("disabled", true);
        });

        // Poor reason — set value BEFORE disabled, use readonly NOT disabled
        if (data.overall_experience === "Poor") {
            $(".noDiv").removeClass("visually-hidden");
            $("#Newdescription-box")
                .prop("disabled", false)        // must NOT be disabled — disabled hides value visually
                .prop("readonly", true)         // readonly keeps it uneditable but value shows
                .val(data.poor_reason && data.poor_reason !== "NA" ? data.poor_reason : "");
        } else {
            $(".noDiv").addClass("visually-hidden");
            $("#Newdescription-box").val("").prop("readonly", true);
        }

        // Q2: Time Satisfaction
        $("input[name='time-satisfaction']").each(function () {
            if ($(this).val() === data.time_satisfaction) {
                $(this).prop("checked", true);
            }
            $(this).prop("disabled", true);
        });

        // Q3: Reuse Portal
        $("input[name='reuse-portal']").each(function () {
            if ($(this).val() === data.reuse_portal) {
                $(this).prop("checked", true);
            }
            $(this).prop("disabled", true);
        });


        $("#NewfbFormPreview input:not(#Newdescription-box)").prop("disabled", true);
        $("#Newdescription-box").prop("readonly", true);

        // SHOW MODAL AFTER PREFILL
        $("#NewfbFormPreview").modal("show");
    });
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

        // console.log(j.data)

        // if (j.statusCode == "1" && j.userType == "ROLE_SuperAdmin") {
        // Naitik - changes
        if (j.userType == 'ROLE_DM') {
            $(selector).attr("disabled", true);
            makeDropdownSafe(selector, j.data);
            $(selector).prop("selectedIndex", 1);
            feedbackAnalysisAPIs();
            loadFeedBack();
        }
        else if (j.statusCode == "1" && j.userType == "ROLE_SuperAdmin" || j.userType == 'ROLE_Admin') {
            //  console.log("Dropdown Data:", j.data);
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


$("#Ratings").change(function () {
    var rating = $("#Ratings").find(":selected").val();
    if (rating != "0") {
        feedbackAnalysisAPIs();
        loadFeedBack();
    }
});



$(document).on("change", "#dateFrom", function (e) {

    var dateFrom = e.target.value;
    //  console.log(dateFrom)
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
    var department = $('#departmentss').val();
    //console.log(department)

    table = new DataTable("#misReportTableDepartment", {
        serverSide: true,
        processing: true,
        destroy: true,
        scrollX: true,
        autoWidth: false,
        dom: 'Bfrtip',

        columns: [
            {
                render: function (data, type, row, meta) {
                    return meta.settings._iDisplayStart + meta.row + 1;
                }
            },

            { data: 'department' },

            { data: 'totalGrievances' },

            //Overall Experience 
            { data: 'experienceExcellentPercent' },
            { data: 'experienceGoodPercent' },
            { data: 'experienceAveragePercent' },
            { data: 'experiencePoorPercent' },

            //Time Satisfaction 
            { data: 'timeVerySatisfiedPercent' },
            { data: 'timeSatisfiedPercent' },
            { data: 'timeDissatisfiedPercent' },

            //Reuse Portal 
            { data: 'reuseYesPercent' },
            { data: 'reuseMaybePercent' },
            { data: 'reuseNoPercent' }
        ],
        ajax: {
            url: cp + "/analytics/loadMisRepoDeptNew",
            method: "POST",
            contentType: "application/json",
            data: function (d) {
                const content = {
                    draw: d.draw,
                    page: d.start / d.length,
                    size: d.length,
                    search: d.search.value,
                    export: false,
                    department: department
                };
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
        var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, "");
        $(this).val(cleanValue);
        table181.search(cleanValue).draw();
    });

    $(".dwd-customBtnDept").on("click", function () {
        var btn = $(this).val();
        const exportType = btn === "buttons-pdf" ? "pdf" : "xlsx";

        const exportRequest = {
            ...lastRequest,
            page: 0,
            size: 2147483647,
            exportType: exportType
        };

        $.ajax({
            url: cp + "/analytics/loadMisRepoDeptNew",
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


//Naitik Changes END


//load Mis Report Individual Changes by Naitik

function loadMisIndividual() {
    var table;
    var departments = $('#departmentss').val();

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

            { data: 'complainantname' },
            { data: 'complainantmobile' },
            { data: 'userinfo' },

            //Overall Experience 
            { data: 'experienceExcellentPercent' },
            { data: 'experienceGoodPercent' },
            { data: 'experienceAveragePercent' },
            { data: 'experiencePoorPercent' },

            //Time Satisfaction 
            { data: 'timeVerySatisfiedPercent' },
            { data: 'timeSatisfiedPercent' },
            { data: 'timeDissatisfiedPercent' },

            //Reuse Portal
            { data: 'reuseYesPercent' },
            { data: 'reuseMaybePercent' },
            { data: 'reuseNoPercent' }
        ],

        ajax: {
            url: cp + "/analytics/loadMisUserNew",
            method: "POST",
            contentType: "application/json",

            data: function (d) {
                const content = {
                    draw: d.draw,
                    page: d.start / d.length,
                    size: d.length,
                    search: d.search.value,
                    export: false,
                    departments: departments || "0"
                };

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

    $("#misReportTable_filter input[type='search']").on("input", function () {
        var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, "");
        $(this).val(cleanValue);
        table.search(cleanValue).draw();
    });

    $(".dwd-customBtn").on("click", function () {
        var btn = $(this).val();
        const exportType = btn === "buttons-pdf" ? "pdf" : "xlsx";

        const exportRequest = {
            ...lastRequest,
            page: 0,
            size: 2147483647,
            exportType: exportType
        };

        $.ajax({
            url: cp + "/analytics/loadMisUserNew",
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
                const filename = filenameMatch
                    ? filenameMatch[1]
                    : `JKSamadhan - Analytical Data - ${currentDate}.${exportType}`;

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            },
            error: function () {
                alert("Export failed. Please try again.");
            }
        });
    });
}

//Naitik Changes on Radio Button for MIS Reports 03/10/2025
document.addEventListener("DOMContentLoaded", function () {


    const $id = id => document.getElementById(id);
    const safeRow = id => $id(id)?.closest(".row");

    const overallRow = safeRow("misReportTable");
    const departmentRow = safeRow("misReportTableDepartment");

    const feedbackTableRow = safeRow("NewfeedBackTbl");
    const feedbackPieDiv = $id("feedbackGraphPieDiv");
    const feedbackBarDiv = $id("feedbackGraphBarDiv");

    // ---------- FILTERS ----------
    const filters = [
        "#catGraph",
        "#selGender",
        "#dateFrom",
        "#dateTo",
        "#districtss",
        "#Ratings"
    ].map(sel => document.querySelector(sel)?.closest(".col-md-2")).filter(Boolean);

    const mainRadios = document.querySelectorAll(".report-toggle-main");

    // ---------- HIDE / SHOW ----------
    function hideAll() {
        [overallRow, departmentRow, feedbackTableRow, feedbackPieDiv, feedbackBarDiv]
            .forEach(el => el && (el.style.display = "none"));
    }

    function showFilters(show) {
        filters.forEach(f => f.style.display = show ? "block" : "none");
    }

    // ---------- MAIN TOGGLE ----------
    function toggleMainView() {
        const selected = document.querySelector('input[name="mainReportType"]:checked')?.value;

        hideAll();
        showFilters(false);

        if (selected === "mis") {
            overallRow && (overallRow.style.display = "block");
            departmentRow && (departmentRow.style.display = "block");
        }

        if (selected === "feedback") {
            feedbackTableRow && (feedbackTableRow.style.display = "block");
            feedbackPieDiv && (feedbackPieDiv.style.display = "block");
            feedbackBarDiv && (feedbackBarDiv.style.display = "block");

            showFilters(true);


            setTimeout(feedbackAnalysisAPIs, 100);
        }
    }

    mainRadios.forEach(r => r.addEventListener("change", toggleMainView));

    // ---------- INITIAL LOAD ----------
    toggleMainView();
});

