



let context_path = $("#context_path").val();
// start kajal 16 July 2025

$(document).ready(function () {

    if (window.location.href.indexOf("/appealMisReport") != -1) {
        departments();
        loadMisAppeal();
    }

});

$("#departmentss1").change(function () {
    loadMisAppeal();
})

function departments() {
    $("#departmentss1").html("");
    $("#departmentss1").append('<option value="0">Select</option>');
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
            //   console.log('kk ', j)
            if (j.statusCode == "1") {
                makeDropdown(departmentss1, j.data);
            }
        });
    } else {
        $("#departmentss1").html("");
        $("#departmentss1").append('<option value="0">Select</option>');
    }
}

function loadMisAppeal() {
    //console.log("ihyil")
    var table;
    var department = $("#departmentss1").find(":selected").val();
   // console.log('dept ', department)
    table = new DataTable("#misReportTableAppeal", {
        serverSide: true,
        processing: true,
        destroy: true,
        scrollX: true,
        // lengthMenu: [10, 50, 100],
        dom: 'Bfrtip',

        columns: [
            {
                title: "S. No.",
                render: function (data, type, row, meta) {
                    // return meta.row + 1;
                    return meta.settings._iDisplayStart + meta.row + 1;
                }
            },

            {
                data: "department",
                title: "Department"
            },
            {
                data: "totalAppeals",
                title: "Total Appeal",

            },
            {
                data: "appealsDisposed",
                title: "Appeals Disposed"
            },
            {
                data: "appealsRejected",
                title: "Appeals Rejected"
            },
            {
                data: "appealsPending",
                title: "Appeals Pending",

            },
            {
                data: "appealsUnderProcess",
                title: "Appeals Under Process<br><small>(Forwarded To Subordinate Users)</small>",
            },
            {
                data: "appealsOpen",
                title: "Appeals Open<br><small>(Pending+Forwarded)</small>",
            },
            {
                data: "appealsClosed",
                title: "Appeals Closed<br><small>(Disposed+Rejected)</small>",
            },
            {
                data: "disposalPercentage",
                title: "Disposal%",
            },
        ],
        ajax: {
            url: "appealMisReport",
            method: "POST",
            contentType: "application/json",
            data: function (d) {
              //  console.log(d)
                const content = {
                    draw: d.draw,
                    page: d.start / d.length,
                    size: d.length,
                    search: d.search.value,
                    department: department,
                    export: false

                }
                //console.log( d.search.value)
                lastRequest = { ...content, export: true };
                return chkV(JSON.stringify(content));
            },
            dataFilter: function (data) {
                data = setV(data);
                data = JSON.parse(data);
                console.log(data);
                return JSON.stringify(data);
            }
        },
        lengthMenu: [2, 10, 50, 100],
        pageLength: 10
    });

    $("#misReportTableAppeal_filter input[type='search']").on("input", function () {
    // alert("jjjds")

    var cleanValue = $(this).val().replace(/[^a-zA-Z0-9/\s-]/g, ""); // Remove special characters
       $(this).val(cleanValue);
       table181.search(cleanValue).draw(); // Update DataTable search
   });




    $(".btn-customBtnAppeal").on("click", function () {

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
            url: "appealMisReport",
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

// end Kajal 16 July 2025

function makeDropdown(passedId, data) {
  $.each(data, function (key, value) {
    $(passedId).append(
      $("<option></option>").attr("value", value.values).text(value.values)
    );
  });
}