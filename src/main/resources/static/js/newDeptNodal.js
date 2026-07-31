
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

$(function(){
  sessionFunc();
    officeList();  
})

var table131;
function officeList() {
   
   
    var settings = {
      url: "getDesigAndOffList",
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
      if (j.statusCode != 0 && j.data.length > 0) {
        j.data = j.data.map((current) => {
          if (current.created_date != null) {
            current.created_date = format_date(current.created_date);
          }
          return current;
        });
      }

      $(".btn-customBtn").on("click", function () {
        // console.log($(this).val());
        table131.button("." + $(this).val()).trigger();
      });
  
       table131 = $("#YRreport11").DataTable({
        data: j.data,
        destroy: true,
        lengthMenu: [10, 50, 100],
        pageLength: 10,
        scrollX: true,
        //scrollY: 500,
        paging: true,
        ////dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
        //dom: '<"row"<"col-sm-4 text-start"l><"col-sm-4 text-center"B><"col-sm-4 text-center"f>">',
        // dom:
        // "<'ui grid'"+
        // 	"<'row'"+
        // 		"<'col-sm-4 text-start mb-1'l>"+
        // 		"<'col-sm-4 d-flex justify-content-center mb-1'B>"+
        // 		"<'col-sm-4 text-center mb-1'f>"+
        // 	">"+
        // 	"<'row dt-table'"+
        // 		"<'col-sm-12'tr>"+
        // 	">"+
        // 	"<'row'"+
        // 		"<'col-sm-6'i>"+
        // 		"<'col-sm-6 text-end'p>"+
        // 	">"+
        // ">",
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
            data: "department",
            defaultContent: "",
            title: "Department",
          },
          {
            data: "office_name",
            defaultContent: "",
            title: "Office",
          },
           {
                     data: "designation",
                     defaultContent: "",
                     title: "Designation",
                   },
                   {
                    data: "level",
                    defaultContent: "",
                    title: "User Level",
                  },
                  {
                    data: "user_type",
                    defaultContent: "",
                    title: "User Type",
                  },        
         
          {
            data: "insertdate",
            defaultContent: "",
            title: "Created On",
          },
          {
            data: "id",
            defaultContent: "",
            class: "noExport",
            title: "Action",
            "render": function ( data, type, row, meta ) { 
							return '<div class = "d-flex justify-content-center"><button type="button" value="'+data+'" class="btn btn-sm btn-success edit-btn mx-1">Edit</button></div>' 
									} 
          },
         
          /*{
                     data: "pendingWith",
                     defaultContent: "",
                     title: "Pending With",
                   },*/
          /*{
                    data: "username",
                    defaultContent: "",
                    class: "noExport",
                    title: "Action",
                    render: function (data, type, row, meta) {
                      return `<button value = "${data}" class="btn btn-sm btn-primary dtl-btn">Details</button>
                      <button value = "${data}" class="btn btn-sm btn-warning text-white visibility-hidden" style="display:none;"><i class="bi bi-pencil-square""></i></button>
                      <button value = "${data}" class="btn btn-sm btn-danger text-white visibility-hidden" style="display:none;"><i class="bi bi-trash"></i></button>`;
                    },
                  },*/
        ],
      });

      $("#YRreport11_filter input[type='search']").on("input", function () {
       // alert("jjjds")
       var regex = /^[A-Za-z0-9._-\s]*$/;

          var cleanValue = $(this).val().replace(/[^a-zA-Z0-9\s]/g, ""); // Remove special characters
          $(this).val(cleanValue);
          table131.search(cleanValue).draw(); // Update DataTable search
      });
    });
  }
  

  $(document).on("click", ".edit-btn", function (e) {
    let c = e.target.value;
    var ck = {
        value : c
    }
    ck = JSON.stringify(ck);
    let d = chkV(ck);
  var settings = {
          url: "updateDet?d=" + d,
          method: "POST",
          timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
        };
        $.ajax(settings).done(function (j) {
          j = setV(j);
          j = JSON.parse(j);
           console.log(JSON.stringify(j));
          if(j.statusCode == 1){
            $('#departmentName').val(j.data[0].department);
            $('#offName').val(j.data[0].office_name);
            $('#Desig').val(j.data[0].designation);
            $('#usLvl').val(j.data[0].level);
            $('#usTpe').val(j.data[0].user_type);
          //  $('#subCateg4').val(j.data[0].sub_category_level4_name);
            $('#idenV').val(j.data[0].id);
            $('#exampleModal').modal('show');
          }
        });
  });

  $("#usLvl").change(function () {
    var level=$(this).val();
    if(level=='District'){
      $('#usTpe').prop("selectedIndex",1);
    }else{
      $('#usTpe').prop("selectedIndex",0);
    }
  })

  $("#updateCateg").on("click",function () {
    var ck = {
     depName: $('#departmentName').val(),
     officeName: $('#offName').val(),
     designation:$('#Desig').val(),
     level:$('#usLvl').val(),
     user_type:$('#usTpe').val(),
     id:$('#idenV').val()
              }
ck = JSON.stringify(ck);
let d = chkV(ck);
var settings = {
    url: "officeUpdate?d=" + d,
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
    if(j.statusCode == 1){
      alert(j.message);
        window.location.reload();
    }else if(j.statusCode == 2){
      alert(j.message);
      window.location.reload();
    }else {
      alert("Something went wrong.");
        window.location.reload();
    }
  });
});


$("#addnewoffcnodal").change(function () {
    var addOffcV = $("#addnewoffcnodal").find(":selected").val();
    var addDeptV = $("#newdeptname").val();
    $("#addnewDesignodal").html("");
    $("#addnewDesignodal").append(
      '<option value="0">Select</option><option value="adddesg">Add new Designation</option>'
    );
    $("#addnewDesignodal").prop("disabled", false);
    if (addOffcV != "0") {
      ///to add new///
      if (addOffcV == "addoffice") {
      //	$("#addDeptV").val("");
               $("#newOffcnodalDiv").show();
          //.     $("#addnewDesig").prop("disabled", false);
      } else {
          $("#newOffcnodalDiv").hide();
        var c = JSON.stringify({
          value: addOffcV,
          designation : addDeptV,
        });
        var d = chkV(c);
        var settings = {
          url: "getDesgListByOffc?d=" + d,
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
            makeDropdown(addnewDesignodal, j.data);
          }
        });
      }
    } else {
    
    }
  });
  
  $("#addnewDesignodal").change(function () {
        var addDesgV = $("#addnewDesignodal").find(":selected").val();
       
        if (addDesgV != "0") {
          $("#addnewulevel").prop("disabled", false);
          if (addDesgV == "adddesg") {
              $("#newDesignodalDiv").show();
                  } 
          else{
              $("#newDesignodalDiv").hide();
          }
        } else {
        
        }
      });

$("#addnewulevel").change(function(){
  
  var lvl=$(this).val();
if(lvl=="District"){
$('#userType').prop("selectedIndex", 2);

}else if(lvl=="Appellate"){
  $('#userType').prop("selectedIndex", 3);

}else{

$('#userType').prop("selectedIndex", 1);

}
}) 

      
      $("#submitNewDeptNodal").click(function () {
        var dept = $("#newdeptname").val();
        var offc = $("#addnewoffcnodal").find(":selected").val();
        var desg = $("#addnewDesignodal").find(":selected").val();
        var ulevel = $("#addnewulevel").find(":selected").val();
        var userType = $("#userType").find(":selected").val();

        if (dept == "0" || offc == "0" ||desg == "0" || userType=="0" || ulevel=="0") {
          alert("All fields are mandatory.");
        } else if (
          offc == "addoffice" &&
          ($("#newofcnodal").val() == null || $("#newofcnodal").val().trim() == "")
        ) {
          alert("Add new Office.");
        } else if (
          desg == "adddesg" &&
          ($("#newdesg").val() == null || $("#newdesg").val().trim() == "")
        ) {
          alert("Add new Designation.");
        }  else {
          if (offc == "addoffice") {
            offc = $("#newofcnodal").val();
          } else {
            offc = offc;
          }
          if (desg == "adddesg") {
            desg = $("#newdesg").val();
          } else {
            desg = desg;
          }
          var c = JSON.stringify({
            department_name: dept,
            office_name: offc,
            desg_name: desg,
            user_type: userType,
            level: ulevel,
            sessionvalue: $("#sessionvalue").val(),
            sessionname: $("#sessionname").val(),
           
          });

          var d = chkV(c);
          var settings = {
            url: "saveNewDeptNodal?d=" + d,
            method: "POST",
            timeout: 0,
            headers: {
              "Content-Type": "application/json",
            },
          };
          $.ajax(settings).done(function (j) {
            j = setV(j);
            j = JSON.parse(j);
            if (j.statusCode == "0") {
              alert("Office and designations added successfully.");
              window.location.reload();
            } else if (j.statusCode == "1") {
              alert("failed to save data.");
              window.location.reload();
            } else if (j.statusCode == "2") {
              alert("This sequence already exist.");
              window.location.reload();
            } else if (j.statusCode == "3") {
              alert("Form bombarding not allowed");

            }else{
              alert("Something went wrong");
              window.location.reload();
            }
          });
        }
      });
      
      $("#resetnewDept").click(function () {
          window.location.reload();
      });
      
      $(document).on("click", ".vDetails", function (e) {
                    $(".descHis").html("");
                    $(".descHisDoc").html("");
                    $(".descHisDocCitz").html("");
                    var c = JSON.stringify({
                      radioVal: "jksamadhan",
                      gId: e.target.value,
                    });
                    let d = chkV(c);
                    // window.location.href = "grievanceDatail?d=" + d;
                    window.open("grievanceDatail?d=" + d, "_blank");
                        
                  });


                  $(document).on("click", ".grievancepdf", function (e) {
                 
                             // Temporarily hide elements you don't want in the PDF
                             $('.no-print').hide();

                             var element = document.getElementById('downloadgrpdf');
                             html2pdf().from(element).save().then(function () {
                                 // Show the elements again after the PDF is generated
                                 $('.no-print').show();
                             });
                         });

                         function makeDropdown(passedId, data) {
                            $.each(data, function (key, value) {
                              $(passedId).append(
                                $("<option></option>").attr("value", value.values).text(value.values)
                              );
                            });
                          }
  

                          $("#newofcnodal").keypress(function (e) {
                            //console.log($(this).val())
                            return validTextArea(e);
                          });

                          $("#newdesg").keypress(function (e) {
                            //console.log($(this).val())
                            return validTextArea(e);
                          });
                          
                          $("#offName").keypress(function (e) {
                            //console.log($(this).val())
                            return validTextArea(e);
                          });

                          $("#Desig").keypress(function (e) {
                            //console.log($(this).val())
                            return validTextArea(e);
                          });
                         

                          function validTextArea(e) {
                            var keyCode = e.keyCode || e.which;
                          
                         
                            var regex = /^[A-Za-z0-9._-\s]*$/;
                          
                            //Validate TextBox value against the Regex.
                            var isValid = regex.test(String.fromCharCode(keyCode));
                            if (!isValid) {
                              //lblError5.innerHTML = "Please valid email Id.";
                            }
                          
                            return isValid;
                          }

                        