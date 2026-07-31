
$(document).ready(function () {
  sessionFunc();
})

let context_path = $("#context_path").val();
function sessionFunc() {
  var settings = {
    url: context_path + "/sessionvalue",
    method: "POST",
    data: { sessionname: $("#sessionname").val() },
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    $(".sessionvalue").val(j);
  });
}

$(document).on('change', '.checkval', function () {

    var rowIndex = $(this).data('row-index');
    if ($(this).is(':checked')) {
        // Enable the radio buttons in the same row

        $('input.auth_' + rowIndex).prop('disabled', false);
        $('input.prior_' + rowIndex).prop('disabled', false);
    } else {
        // Disable the radio buttons if the checkbox is unchecked
        $('input.auth_' + rowIndex).prop('disabled', true);
        $('input.prior_' + rowIndex).prop('disabled', true);
    }

    //alert(e.target.value)
    var val = $(this).val();
    //	alert(val)

    if ($(this).prop('checked')) {

        $("#divv" + val).append('<textarea  name="remark"></textarea><span class="err" style="color:red">')
    } else {
        $("#divv" + val).html('');

    }

})

$(document).on('change', '.auth', function () {
    var selectedValue = $(this).val();
    var rowIndex = $(this).attr('name').split('_')[1]; // Extract row index
    console.log("Row Index:", rowIndex, "Selected Value:", selectedValue);

    // Clear and add a new textarea inside the div
    $("#divv" + rowIndex).html('<textarea name="remark" class="forwardUserRemark" placeholder="Enter Remark"></textarea><span class="err" style="color:red"></span>');
    $('.prior_' + rowIndex).prop('disabled', false);
    if (selectedValue === "Process") {
        // Enable priority selection for the selected row

        // Disable and uncheck all other "Remark" and "Process" radio buttons
        $('.auth').each(function () {
            var otherRowIndex = $(this).attr('name').split('_')[1];
            if (otherRowIndex !== rowIndex) {
                $(this).prop('disabled', true).prop('checked', false); // Disable and uncheck
                $("#divv" + otherRowIndex).html('');
            }
        });

    } else {
        // Disable priority selection if "Remark" is selected
        //  $('.prior_' + rowIndex).prop('disabled', true);

        // Enable all "Remark" and "Process" radio buttons
        $('.auth').prop('disabled', false);
    }
    $(".forwardUserRemark").keypress(function (e) {
  console.log($(this).val())
  return validTextArea(e);
});
});



      function validTextArea(e) {
  var keyCode = e.keyCode || e.which;
  var regex = /^[A-Za-z0-9,._\-/\s]+$/;
  var isValid = regex.test(String.fromCharCode(keyCode));
  if (!isValid) {
    //lblError5.innerHTML = "Please valid email Id.";
  }

  return isValid;
}




/* $(document).on('change', '.checkval', function() {
       var rowIndex = $(this).data('row-index');
       if ($(this).is(':checked')) {
           // Enable the radio buttons in the same row
           $('input.auth_' + rowIndex).prop('disabled', false);
       } else {
           // Disable the radio buttons if the checkbox is unchecked
           $('input.auth_' + rowIndex).prop('disabled', true);
       }
   });
*/


var fwdType=$('#fwdType').val();

if ($('#ussTp').val() == 'ROLE_Department' || $('#ussTp').val() == 'ROLE_SuperAdmin') {

   // $('.yrTab').show();
    $('#depDivss').hide()
    userList(null, "department")
    
} else if(($('#ussTp').val() == 'ROLE_Admin' && fwdType=='Inter')) {
  //  $('.yrTab').show();
    $('#depDivss').hide();
    var depVal = $('#inDep').prop("selectedIndex", 2)
    userList("Intra", null);

}else{
    var depVal = $('#inDep').prop("selectedIndex", 2)
    userList("Intra", null);
}

$('#inDep').on('change', function () {

    var dep = $(this).val();
    if (dep != 0) {
        //$('.yrTab').show();
        userList(dep, null)

    } else {

        //$('.yrTab').hide();
    }

})

function userList(dep, attach) {
    //alert(dep)
    $('.yrTab').show();
    var gri = $('#griId').val();
    var auth = $('#auth').val();
    var userTYpe=$('#ussTp').val();
    var c = JSON.stringify({
        gri: gri,
        dep: dep,
        attStatus: attach

    });
    console.log(userTYpe)
    var d = chkV(c);

    var settings = {
        "url": "usrList?d=" + d,
        "method": "POST",
        "timeout": 0,
    };
    $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
       // console.log(j);
        //	if (j.statusCode == '1') {

        console.log(j)
        $(document).ready(function () {

            var table;
            function initializeDataTable() {
                if ($.fn.DataTable.isDataTable('#userMap')) {
                    // table.destroy(); // Destroy existing DataTable instance if it exists
                }
                table = $('#userMap').DataTable({
                    data: j.data,
                    destroy: true,
                    scrollX: true,
                    lengthMenu: [5, 10, 25],
                    pageLength: 10,
                    responsive: true,
                    columns: [
                        {
                            "data": "Sl. No.",
                            "render": function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        { "data": "nameAndDesig" },
                        { "data": "department" },
                        { "data": "office_name" },
                        { "data": "usertype_of_assigned_user" },
                        { "data": "username" },
                        {
                            "data": "",
                            "render": function (data, type, row, meta) {
                                
                                if(userTYpe!="ROLE_SuperAdmin"){

                                    if (auth == "Remark") {
                                        return '<input type="radio" class="auth auth_' + meta.row + '" name="auth_' + meta.row + '" value="Remark">Remark<br>'
    
                                    } else {
                                        return '<input type="radio" class="auth auth_' + meta.row + '" name="auth_' + meta.row + '" value="Remark">Remark<br>' +
                                            '<input type="radio" class="auth auth_' + meta.row + '" name="auth_' + meta.row + '" value="Process">Process';
    
                                    }
                                }else{
                                    return    '<input type="checkbox" class="auth auth_' + meta.row + '" name="auth_' + meta.row + '" value="Process" >Process';

                                }

                              
                            }
                        },
                        // {
                        //     "data": "username",
                        //     "render": function(data, type, row, meta) {
                        //         return '<input type="checkbox" class="checkval" data-row-index="' + meta.row + '" name="chk" value="' + meta.row + meta.settings._iDisplayStart + 1 + '">';
                        //     }
                        // },
                        // {
                        //     "data": "username",
                        //     "render": function(data, type, row, meta) {
                        //         return '<div id="divv' + meta.row + meta.settings._iDisplayStart + 1 + '"></div>';
                        //     }
                        // },

                        {
                            "data": "username",
                            "render": function (data, type, row, meta) {
                                return '<div id="divv' + meta.row + '"></div>';
                            }
                        },

                        {
                            "data": "district",
                            "render": function (data, type, row, meta) {
                                if (data != "0" && data != "NA" && data != null) {
                                    var arr = data.split(",").map(item => item.replace(/'/g, ""));
                                    var districts = arr;
                                    var dropdown = $('<select></select>').attr('name', 'selDist').addClass('form-select');
                                    dropdown.append($('<option></option>').attr('value', '0').text('--Select district--'));

                                    $.each(districts, function (index, value) {
                                        dropdown.append($('<option></option>').attr('value', value).text(value));
                                    });

                                    return '<div class="">'
                                        + '<div class="form-input-block">'
                                        + dropdown.prop('outerHTML')
                                        + '</div>'
                                        + '</div>';
                                } else {
                                    return "NA";
                                }
                            }
                        },



                        {
                            "data": "",
                            "render": function (data, type, row, meta) {
                                return '<input type="radio" class="prior prior_' + meta.row + '" name="prior_' + meta.row + '" value="28" disabled>Normal<br>' +
                                    '<input type="radio" class="prior prior_' + meta.row + '" name="prior_' + meta.row + '" value="7" disabled>Urgent<br>';
                            }
                        }
                    ]
                });

                $("#userMap_filter input[type='search']").on("input", function () {
                    // alert("jjjds")
              
                       var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
                       $(this).val(cleanValue);
                       table.search(cleanValue).draw(); // Update DataTable search
                   });
            }

            initializeDataTable();

            // 			   $(document).on('change', '.checkval', function() {
            // //			                  initializeDataTable();
            // 			                  table.columns.adjust().draw(); // Adjust and redraw the columns
            // 			              });  

            //table.columns.adjust().draw();
            // jQuery to handle enabling radio buttons when the checkbox is checked

        });
        //}
    });
}



$(".assignUsers").click(function (e) {

    var btnVal=e.target.value

    forwardGrievance(btnVal);
});




function forwardGrievance(btnVal) {
    var products = [];
    var isAnyChecked = false; // Variable to track if at least one checkbox is checked
    var isValid = true; // Variable to track the validity of all required fields in checked rows

    // Use DataTables API to get all rows data
    var table = $('#userMap').DataTable();
    var data = table.rows().nodes(); // Get all row nodes

    // Loop through each row
    $(data).each(function (index, row) {
        var chkBox = $(row).find('input[type="checkbox"][name="chk"]');
        var chkVal = chkBox.prop("checked");
        var rmk = $(row).find("textarea[name='remark']").val();
        var username = $(row).find("td:eq(5)").text();
        var rdbtn = $('input[name="auth_' + index + '"]:checked').val();
        var priorbtn = $('input[name="prior_' + index + '"]:checked').val();
        var district = $(row).find("select[name='selDist']").val();
        var forwardType;
        if ($('#ussTp').val() == 'ROLE_SuperAdmin') {
            forwardType = "Outside"
        } else if ($('#ussTp').val() == 'ROLE_Department') {
            forwardType = "Intra";
        } else {
            forwardType = $('#inDep').val();
        }


        // If the action checkbox is checked
        //if (chkVal) {
        if (rdbtn) {
            isAnyChecked = true;

            // Check if remark and authority are both filled
            if (rmk.trim() !== "" && rdbtn !== undefined && priorbtn !== undefined && district != "0") {
                var product = {
                    username: username,
                    grievanceId: $("#griId").val(),
                    remark: rmk,
                    authority: rdbtn,
                    priority: priorbtn,
                    district: district,
                    forwardType: forwardType,
                    buttonValue:btnVal,
                    sessionvalue: $("#sessionvalue").val(),
                    sessionname: $("#sessionname").val(),
                };
                products.push(product);
            } else {
                isValid = false;
                return false; // Exit loop if validation fails
            }
        }
    });

   // console.log(products);

    // If at least one checkbox is checked and all required fields are valid
    if (isAnyChecked && isValid) {
        var c = JSON.stringify({
            arr: products,
        });
        console.log(c);
        var d = chkV(c);
        var settings = {
            url: "assignApplicationToUsr?d=" + d,
            method: "POST",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
            },
        };
        $.ajax(settings).done(function (j) {
            j = setV(j);
            j = JSON.parse(j);
            if (j.statusCode == "1") {
                alert("Application Forwarded successfully.");
                if (j.flag == "CPGRAM") {
                    // window.location.href = "cpgramDashboard";
                    window.location.reload();
                } else {
                    // window.location.href = "home";
                   window.location.reload();
                }
            } else if (j.statusCode == "4") {
                var msg = j.statusName;
                alert(msg);
                //    window.location.reload();
            }else if(j.statusCode == "3"){
                alert("This grievance is sent back to the selected user.");
               // window.location.reload();
               if (j.flag == "CPGRAM") {
                 window.location.href = "cpgramDashboard";
               // window.location.reload();
            } else {
                 window.location.href = "home";
              //  window.location.reload();
            }
            
            } else if(j.statusCode == "2"){
                alert("This grievance is already forwarded to the sub-ordinate officer.");
                 window.location.reload();
            
            } else if(j.statusCode == "5"){
                alert("Form bombarding not allowed.");
                 window.location.reload();
            }else{
                alert("Something went wrong");
                 window.location.reload();
            }
        });
    } else {
        alert("Please mark at least one checkbox, provide corresponding remarks, and ensure the authority is selected for each checked row.");
    }
}


$(document).on("click", ".user-search", function (e) {
    // console.log($(this).val());
    userList(null, $(this).val())
});

