// document ready
$(function () {
    // Calling miscDataAPI
    onPageLoad();
    ssDT();
});

// Updated makeDropdown, if both id & value are passed or only value is passed, it will handle
function makeDropdown(dropdownId, data) {
    $.each(data, function (key, value) {
        const text = value.value || value.values;
        const optionValue = value.id || value.values;
        $(dropdownId).append(
            $("<option></option>").attr("value", optionValue).text(text)
        );
    });
}

function onPageLoad() {
    const resetDropdowns = () => {
        $("#departmentss, #catGraph").html('<option value="0">Select</option>');
    };
    resetDropdowns();
    const requestData = JSON.stringify({ whichDateReq: 'departmentData' });
    const requestPayload = chkV(requestData);
    $.ajax({
        url: `/analytics/miscDataAPI?d=${requestPayload}`,
        method: "POST",
        timeout: 0,
        headers: { "Content-Type": "application/json" }
    }).done(function (responseData) {
        responseData = JSON.parse(responseData);
        console.log(responseData.data.length)
        responseData.statusCode === "1" ? makeDropdown("#departmentss", responseData.data) : console.log('No Data!');
    });
}

// Department onChange for Main Category DropDown
$(document).on("change", "#departmentss", function (e) {
    var departmentID = e.target.value;
    console.log(departmentID)
    const resetDropdowns = () => {
        $("#catGraph, #subCatGraph").html('<option value="0">Select</option>');
    };
    resetDropdowns();
    const requestData = JSON.stringify({ whichDateReq: 'categoryData', filterBasedOn: departmentID });
    const requestPayload = chkV(requestData);
    $.ajax({
        url: `/analytics/miscDataAPI?d=${requestPayload}`,
        method: "POST",
        timeout: 0,
        headers: { "Content-Type": "application/json" }
    }).done(function (responseData) {
        responseData = JSON.parse(responseData);
        console.log(responseData)
        responseData.statusCode === "1" ? (makeDropdown("#catGraph", responseData.data), $("#catGraph").attr("disabled", false)) :
            responseData.statusCode === "0" ? (resetDropdowns(), $("#catGraph, #subCatGraph").attr("disabled", true)) : console.log('No Data!');
    });
});

// Main Category onChange for Sub Category DropDown
$(document).on("change", "#catGraph", function (e) {
    var departmentID = $('#departmentss').val();
    var categoryID = e.target.value;
    console.log(departmentID)
    const resetDropdowns = () => {
        $("#subCatGraph").html('<option value="0">Select</option>');
    };
    resetDropdowns();
    const requestData = JSON.stringify({ whichDateReq: 'subCategoryData', filterBasedOn: departmentID, filterBasedOn2: categoryID });
    const requestPayload = chkV(requestData);
    $.ajax({
        url: `/analytics/miscDataAPI?d=${requestPayload}`,
        method: "POST",
        timeout: 0,
        headers: { "Content-Type": "application/json" }
    }).done(function (responseData) {
        responseData = JSON.parse(responseData);
        console.log(responseData)
        responseData.statusCode === "1" ? (makeDropdown("#subCatGraph", responseData.data), $("#subCatGraph").attr("disabled", false)) :
            responseData.statusCode === "0" ? (resetDropdowns(), $("#subCatGraph").attr("disabled", true)) : console.log('No Data!');
    });
});


function ssDT() {
    var table = $('#ssCoTbl').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: '/analytics/ssDT',
            method: "POST",
            // timeout: 0,
            // contentType: "application/json",
            data: function (d) {
                const requestData = JSON.stringify({
                    search: {
                        // value: $('#ssCoTbl_filter input').val(),
                    },
                    page: d.start / d.length,
                    size: d.length,
                    orderDir: d.order[0].dir,
                    columnToSort: d.columns[d.order[0].column].data,
                    searchTerm: d.search.value,
                    // searchTerm = "Aftab"
                    // searchTerm = department ilike %AFTAB%
                });
                const requestPayload = chkV(requestData);
                return { d: requestPayload };
            },
            dataSrc: function (json) {
                console.log(json);
                return json.data;
            }
        },
        columns: [
            { data: 'department' },
            { data: 'category' },
            { data: 'grievancesReceived' },
            { data: 'grievancesClosed' },
            { data: 'grievancesOpen' },
        ],
        order: [[0, 'asc'], [1, 'asc']],
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100, 1728]
    });

    // Handle search input
    $('#departmentss').on('change', function () {
        table.ajax.reload();
    });
}

