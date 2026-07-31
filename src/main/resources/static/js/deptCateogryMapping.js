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

$(function () {
    sessionFunc();

    let initDeptCat = "initDeptCat";
    dataTableFunc(initDeptCat);
});

function format_date(created_date) {
    var formatted_date = '';
    if (created_date != null && created_date != '') {
        var date_parts = created_date.split(" ");
        var date = date_parts[0].split("-");
        var time = date_parts[1];
        formatted_date = date[2] + "-" + date[1] + "-" + date[0] + " " + time;
    }
    return formatted_date;
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

// ------------------------------------- 25 JAN - MAP DEPARTMENT CATEGORY WISE - SKY  -------------------------------------
var dept_name = $('#addDept').val();
var division = "NA";
deptValue(dept_name);
function deptValue(dept_name) {
    var addDeptV = dept_name;
    // var addDeptV = $('#addDept').val();
    $("#categ").html('');
    $("#categ").append('<option value="0">Select</option><option value="add">Add new category</option>');
    $("#categ").prop("disabled", false);
    //console.log(stateS);
    if (addDeptV != '0') {
        ///to add new///
        if (addDeptV == 'add') {
            $("#addDeptV").val('');
            $("#addDeptT").show();
            $("#categ").prop("disabled", false);
        } else {
            $("#categ").prop("disabled", false);
            $("#addDeptT").hide();
            var c = JSON.stringify({
                value: addDeptV,
                divison: division
            });
            var d = chkV(c);
            var settings = {
                "url": "categ?d=" + d,
                "method": "POST",
                "timeout": 0,
            };
            $.ajax(settings).done(function (j) {
                j = setV(j);
                j = JSON.parse(j);
                if (j.statusCode == '1') {
                    // console.log(j.data);
                    //console.log(categ)
                    makeDropdown(categ, j.data);
                }
            });
        }
    } else {
        $("#subDept").prop("disabled", true);
        $("#addDeptT").hide();
        $("#addDeptV").val('');

        $("#categ").prop("disabled", true);
        $("#categT").hide();
        $("#categV").val('');

        $("#subcateg").prop("disabled", true);

        $("#subcategT").hide();
        $("#subcategV").val('');

        $("#subcateg2").prop("disabled", true);
        $("#subcategT2").hide();
        $("#subcategV2").val('');

        $("#subcateg3").prop("disabled", true);
        $("#subcategT3").hide();
        $("#subcategV3").val('');

        $("#subcateg4").prop("disabled", true);
        $("#subcategT4").hide();
        $("#subcategV4").val('');

        $("#reminder").val('');
        $("#reminderDiv").hide();
    }

}

$("#categ").change(
    function () {
        var addDeptV = $('#categ').find(":selected").val();
        $("#subcateg").html('');
        $("#subcateg").append('<option value="0">Select</option><option value="add">Add new sub-category</option>');
        //console.log(stateS);
        if (addDeptV != '0') {
            ///to add new///
            if (addDeptV == 'add') {
                $("#categV").val('');
                $("#categT").show();
                $("#reminder").val('');
                $("#reminderDiv").show();
                $("#reminder").val("28");
                $("#subcateg").prop("disabled", false);

            } else {
                $("#subcateg").prop("disabled", false);
                $("#categT").hide();
                $("#reminder").val('');
                $("#reminderDiv").hide();
                var c = JSON.stringify({
                    value: addDeptV,
                    department_name: dept_name
                });
                var d = chkV(c);
                var settings = {
                    "url": "subcateg?d=" + d,
                    "method": "POST",
                    "timeout": 0,
                };
                $.ajax(settings).done(function (j) {
                    j = setV(j);
                    j = JSON.parse(j);
                    if (j.statusCode == '1') {
                        //console.log(j.data);
                        makeDropdown(subcateg, j.data);
                    }
                });
            }
        } else {
            $("#subcateg").prop("disabled", true);
            $("#subcategT").hide();
            $("#categT").hide();
            $("#subcateg2").prop("disabled", true);
            $("#subcategT2").hide();
            $("#subcateg3").prop("disabled", true);
            $("#subcategT3").hide();
            $("#subcateg4").prop("disabled", true);
            $("#subcategT4").hide();

            $("#reminder").val('');
            $("#reminderDiv").hide();
        }
    });

//my code

$("#subcateg").change(
    function () {
        var addDeptV = $('#subcateg').find(":selected").val();
        $("#subcateg2").html('');
        $("#subcateg2").append('<option value="0">Select</option><option value="add">Add new sub-category</option>');
        //console.log(stateS);
        if (addDeptV != '0') {
            ///to add new///
            if (addDeptV == 'add') {
                $("#subcategV").val('');
                $("#subcategT").show();
                $("#subcateg2").prop("disabled", false);
            } else {
                $("#subcateg2").prop("disabled", false);
                $("#subcategT").hide();

                var c = JSON.stringify({
                    value: addDeptV,
                    department_name: dept_name
                });
                var d = chkV(c);
                var settings = {
                    "url": "subcategNextLevel2?d=" + d,
                    "method": "POST",
                    "timeout": 0,
                };
                $.ajax(settings).done(function (j) {
                    j = setV(j);
                    j = JSON.parse(j);
                    if (j.statusCode == '1') {
                        //console.log(j.data);
                        makeDropdown(subcateg2, j.data);
                    }
                });
            }
        } else {
            $("#subcategT").hide();
            $("#subcateg2").prop("disabled", true);
            $("#subcategT2").hide();
            $("#subcateg3").prop("disabled", true);
            $("#subcategT3").hide();
            $("#subcateg4").prop("disabled", true);
            $("#subcategT4").hide();

        }
    });


$("#subcateg2").change(
    function () {
        var addDeptV = $('#subcateg2').find(":selected").val();
        $("#subcateg3").html('');
        $("#subcateg3").append('<option value="0">Select</option><option value="add">Add new sub-category</option>');
        //console.log(addDeptV);
        if (addDeptV != '0') {
            ///to add new///
            if (addDeptV == 'add') {
                $("#subcategV2").val('');
                $("#subcategT2").show();
                $("#subcateg3").prop("disabled", false);
            } else {
                $("#subcateg3").prop("disabled", false);
                $("#subcategT2").hide();

                var c = JSON.stringify({
                    value: addDeptV,
                    department_name: dept_name
                });
                //console.log(c)
                var d = chkV(c);
                var settings = {
                    "url": "subcategNextLevel3?d=" + d,
                    "method": "POST",
                    "timeout": 0,
                };
                $.ajax(settings).done(function (j) {
                    j = setV(j);
                    j = JSON.parse(j);
                    if (j.statusCode == '1') {
                        console.log(j.data);
                        makeDropdown(subcateg3, j.data);
                    }
                });
            }
        } else {
            $("#subcategT2").hide();
            $("#subcateg3").prop("disabled", true);
            $("#subcategT3").hide();
            $("#subcateg4").prop("disabled", true);
            $("#subcategT4").hide();
        }
    });



$("#subcateg3").change(
    function () {
        var addDeptV = $('#subcateg3').find(":selected").val();
        $("#subcateg4").html('');
        $("#subcateg4").append('<option value="0">Select</option><option value="add">Add new sub-category</option>');
        //console.log(addDeptV);
        if (addDeptV != '0') {
            ///to add new///
            if (addDeptV == 'add') {
                $("#subcategV3").val('');
                $("#subcategT3").show();
                $("#subcateg4").prop("disabled", false);
            } else {
                $("#subcateg4").prop("disabled", false);
                $("#subcategT3").hide();

                var c = JSON.stringify({
                    value: addDeptV,
                    department_name: dept_name
                });
                var d = chkV(c);
                var settings = {
                    "url": "subcategNextLevel4?d=" + d,
                    "method": "POST",
                    "timeout": 0,
                };
                $.ajax(settings).done(function (j) {
                    j = setV(j);
                    j = JSON.parse(j);
                    if (j.statusCode == '1') {
                        console.log(j.data);
                        makeDropdown(subcateg4, j.data);
                    }
                });
            }
        } else {
            $("#subcategT3").hide();
            $("#subcateg4").prop("disabled", true);
            $("#subcategT4").hide();
        }
    });

$("#subcateg4").change(
    function () {
        var addDeptV = $('#subcateg4').find(":selected").val();
        //console.log(stateS);
        if (addDeptV != '0') {
            ///to add new///
            if (addDeptV == 'add') {
                $("#subcategV4").val('');
                $("#subcategT4").show();
                $("#subcateg4").prop("disabled", false);
            } else {
                $("#subcateg4").prop("disabled", false);
                $("#subcategT4").hide();
            }
        } else {
            $("#subcategT4").hide();
        }
    });




$("#resetDept").click(
    function () {
        $("#addDeptT").hide();
        $("#categ").prop("disabled", true);
        $("#categT").hide();
        $("#subcategT").hide();
        $("#subcateg").prop("disabled", true);
        $("#addDeptV").val('');
        $("#categV").val('');
        $("#subcategV").val('');
        $('#categ').prop('selectedIndex', 0);
        $('#subcateg').prop('selectedIndex', 0);
        $('#addDept').prop('selectedIndex', 0);

        $("#subcateg2").prop("disabled", true);
        $("#subcateg3").prop("disabled", true);
        $("#subcateg4").prop("disabled", true);
        $("#subcategV2").val('');
        $("#subcategV3").val('');
        $("#subcategV4").val('');
        $("#subcategT2").hide();
        $("#subcategT3").hide();
        $("#subcategT4").hide();
        $('#subcateg2').prop('selectedIndex', 0);
        $('#subcateg3').prop('selectedIndex', 0);
        $('#subcateg4').prop('selectedIndex', 0);


        $("#reminder").val('');
        $("#reminderDiv").hide();
    });


$('#reminder').keypress(function (e) {
    console.log($(this).val())
    return valid(e)
})

function valid(e) {
    var keyCode = e.keyCode || e.which;

    var lblError5 = document.getElementById("remError");
    lblError5.innerHTML = "";

    //Regex for Valid Characters i.e. Alphabets.
    var regex = /^[0-9]*$/;

    //Validate TextBox value against the Regex.
    var isValid = regex.test(String.fromCharCode(keyCode));
    if (!isValid) {
        lblError5.innerHTML = "Please enter numbers only.";
    }

    return isValid;
}

var inputCount = 0;
$('#addInput').click(function () {
    inputCount++;
    //  var newInput = '<input type="text" class="additionalData" name="input_' + inputCount + '" placeholder="Enter additional detail">';
    var newInput = '<div class="yr-additiDetails"><input type="text" class="additionalData form-control" name="input_' + inputCount + '" placeholder="Enter additional detail"></div>';
    $('#inputContainer').append(newInput);
});

$("#submitDept").click(
    function () {
        //			alert("hello");
        var divison = "NA";
        var dp = $('#addDept').val();
        var cat = $('#categ').find(":selected").val();
        var subCat = $('#subcateg').find(":selected").val();
        var subCatNextLevel2 = $('#subcateg2').find(":selected").val();
        var subCatNextLevel3 = $('#subcateg3').find(":selected").val();
        var subCatNextLevel4 = $('#subcateg4').find(":selected").val();
        var rem = $('#reminder').val();

        if (cat == 0) {

            alert("Please add category ");

        }
			/*
			else if(dp == 'add' && ($("#addDeptV").val() == null || $("#addDeptV").val().trim() == '')){
				alert("Add new department.")
			}else if(cat == 'add' && ($("#categV").val() == null || $("#categV").val().trim() == '')) {
				alert("Add new category.")
			}else /*if(subCat == 'add' && ($("#subcategV").val() == null || $("#subcategV").val().trim() == '')) {
				alert("Add new sub-category.")
			}*/else {

            /* if (dp == 'add') {
                 dp = $("#addDeptV").val();
             } else {
                 dp = dp;
             }*/
            if (cat == 'add') {
                if ($("#categV").val() == '' || rem == '') {
                    alert("Please add category and reminder ")
                    return false;
                } else {
                    cat = $("#categV").val().trim();
                }

            } else {
                cat = cat;
            }

            if (subCat == 'add') {
                subCat = $("#subcategV").val().trim();
            } else {
                subCat = subCat;
            }
            if (subCatNextLevel2 == 'add') {
                subCatNextLevel2 = $("#subcategV2").val().trim();
            } else {
                subCatNextLevel2 = subCatNextLevel2;
            }
            if (subCatNextLevel3 == 'add') {
                subCatNextLevel3 = $("#subcategV3").val().trim();
            } else {
                subCatNextLevel3 = subCatNextLevel3;
            }
            if (subCatNextLevel4 == 'add') {
                subCatNextLevel4 = $("#subcategV4").val().trim();
            } else {
                subCatNextLevel4 = subCatNextLevel4;
            }



            //Naitik Changes on popup 09/10/2025
            if (!confirm("Are you sure that you want to create this Department Category?")) {
                return;
            }
            //Naitik Changes End on popup 09/10/2025




            var inputValues = [];
            $('.additionalData').each(function () {
                // console.log($(this).val());
                if ($(this).val() != "") {
                    var obb = {
                        department: dp,
                        category: cat,
                        more_info: $(this).val()
                    }
                    inputValues.push(obb);
                }
            });

            //console.log(inputValues);


            //				alert("good");
            var c = JSON.stringify({
                department_name: dp,
                divison: divison,
                category: cat,
                sub_category: subCat,
                sub_Cat_Next_Level2: subCatNextLevel2,
                sub_Cat_Next_Level3: subCatNextLevel3,
                sub_Cat_Next_Level4: subCatNextLevel4,
                reminderInDays: rem,
                addData: inputValues,
                sessionvalue: $('#sessionvalue').val(),
                sessionname: $("#sessionname").val()

            });

            console.log(c)
            $("#submitDept").prop("disabled", true);
            var d = chkV(c);
            var settings = {
                "url": "addDept?d=" + d,
                "method": "POST",
                "timeout": 0,
            };
            $.ajax(settings).done(function (j) {
                j = setV(j);
                j = JSON.parse(j);
                if (j.statusCode == '1') {
                    //console.log(j.data);
                    alert("Category added successfully.");
                    window.location.reload();
                } else if (j.statusCode == '2') {
                    //console.log(j.data);
                    alert("Category already exists.");
                    window.location.reload();
                } else if (j.statusCode == "4") {
                    var msg = j.statusName;
                    alert(msg);
                    // window.location.reload();
                } else {
                    alert("Something went wrong");
                    window.location.reload();
                }
            });

        }

    });

function makeDropdown(passedId, data) {
    $.each(data, function (key, value) {
        $(passedId).append($("<option></option>")
            .attr("value", value.values)
            .text(value.values));
    });
}

// ------------------------------- 27-01-2024 - DATATABLE SKY -------------------------------
function dataTableFunc(initDeptCat) {
    //   alert(initDeptCat);
    var c = JSON.stringify({
        value: initDeptCat,
    });
    var d = chkV(c);
    var settings = {
        url: "api_v2?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
    };
    $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        // console.log(JSON.stringify(j));

        // format Date to dd MM yyyy hh:mm:ss:ms
        if (j.statusCode == 1) {
            j.data = j.data.map((current) => {
                if (current.created_date != null) {
                    current.created_date = format_date(current.created_date);
                }
                return current;
            });
        }
        // Initialise Datatable
        $(".btn-customBtn").on("click", function () {
            console.log($(this).val())
            table127.button("." + $(this).val()).trigger();
        });
        var table127 = $("#YRreport82").DataTable({
            data: j.data,
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
            columns: [
                {
                    title: "S. No.",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    },
                },
                {
                    data: "department_name",
                    defaultContent: "",
                    title: "Department",
                },
                {
                    data: "category_name",
                    defaultContent: "",
                    title: "Main Category",
                },
                {
                    data: "sub_category_name",
                    defaultContent: "",
                    title: "Next Level1 Category",
                },
                {
                    data: "sub_category_level2_name",
                    defaultContent: "",
                    title: "Next Level2 Category",
                },
                {
                    data: "sub_category_level3_name",
                    defaultContent: "",
                    title: "Next Level3 Category",
                },
                {
                    data: "sub_category_level4_name",
                    defaultContent: "",
                    title: "Next Level4 Category",
                },
                //                  {
                //                    data: "division",
                //                    defaultContent: "",
                //                    title: "Division",
                //                  },
                {
                    data: "created_date",
                    defaultContent: "",
                    title: "Created On",
                },
                {
                    "data": "id",
                    "defaultContent": "",
                    class: "noExport",
                    title: "Action",
                    "render": function (data, type, row, meta) {
                        return '<div class = "d-flex justify-content-center"><button type="button" value="' + data + '" class="btn btn-sm btn-success edit-btn mx-1">Edit</button></div>'
                    }
                },
            ],
        });

        $("#YRreport82_filter input[type='search']").on("input", function () {
            // alert("jjjds")

            var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
            $(this).val(cleanValue);
            table127.search(cleanValue).draw(); // Update DataTable search
        });

    });
}



////edit and delete ///
$(document).on("click", ".edit-btn", function (e) {
    let c = e.target.value;
    var ck = {
        value: c
    }
    ck = JSON.stringify(ck);
    let d = chkV(ck);
    var settings = {
        url: "catDet?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
    };
    $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        // console.log(JSON.stringify(j));
        if (j.statusCode == 1) {
            $('#departmentName').val(j.data[0].department_name);
            $('#mainCateg').val(j.data[0].category_name);
            $('#subCateg1').val(j.data[0].sub_category_name);
            $('#subCateg2').val(j.data[0].sub_category_level2_name);
            $('#subCateg3').val(j.data[0].sub_category_level3_name);
            $('#subCateg4').val(j.data[0].sub_category_level4_name);
            $('#idenV').val(j.data[0].id);
            $('#exampleModal').modal('show');
        }
    });
});

$("#updateCateg").on("click", function () {
    var ck = {
        department_name: $('#departmentName').val().trim(),
        category: $('#mainCateg').val().trim(),
        sub_category: $('#subCateg1').val().trim(),
        sub_Cat_Next_Level2: $('#subCateg2').val().trim(),
        sub_Cat_Next_Level3: $('#subCateg3').val().trim(),
        sub_Cat_Next_Level4: $('#subCateg4').val().trim(),
        value: $('#idenV').val().trim(),
        sessionvalue: $('#sessionvalue').val(),
        sessionname: $("#sessionname").val()
    }
    ck = JSON.stringify(ck);
    let d = chkV(ck);
    var settings = {
        url: "catUpd?d=" + d,
        method: "POST",
        timeout: 0,
        headers: {
            "Content-Type": "application/json",
        },
    };
    $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        // console.log(JSON.stringify(j));
        if (j.statusCode == 1) {
            alert(j.message);
            window.location.reload();
        } else if (j.statusCode == 2) {
            alert(j.message);
            window.location.reload();
        } else if (j.statusCode == "4") {
            var msg = j.statusName;
            alert(msg);
            // window.location.reload();
        } else {
            alert("Something went wrong.");
            window.location.reload();
        }
    });
});


$('.input-field').keyup(function (e) {
    var $th = $(this);
    $th.val($th.val().replace(/(\s{2,})|[^a-zA-Z']/g, ' '));
    $th.val($th.val().replace(/^\s*/, ''));
});

$('#reminder').bind('keyup blur', function () {
    var node = $(this);
    node.val(node.val().replace(/^[a-zA-Z ]*$/, ''));
}
);




$("#categV").keypress(function (e) {
    //console.log($(this).val())
    return validPassword(e);
});

$("#subcategV").keypress(function (e) {
    //console.log($(this).val())
    return validPassword(e);
});

$("#subcategV2").keypress(function (e) {
    //console.log($(this).val())
    return validPassword(e);
});

$("#subcategV3").keypress(function (e) {
    //console.log($(this).val())
    return validPassword(e);
});


$("#subcategV4").keypress(function (e) {
    //console.log($(this).val())
    return validPassword(e);
});


function validPassword(e) {
    var keyCode = e.keyCode || e.which;


    var regex = /^[A-Za-z0-9._-\s]*$/;

    //Validate TextBox value against the Regex.
    var isValid = regex.test(String.fromCharCode(keyCode));
    if (!isValid) {
        //lblError5.innerHTML = "Please valid email Id.";
    }

    return isValid;
}






