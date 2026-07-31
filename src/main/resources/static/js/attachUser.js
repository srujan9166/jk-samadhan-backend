// $(document).ready(function() {
//   $(".multi-select2").select2({
//     placeholder: "",
//     allowClear: true, // Optional, adds a clear button
//     //selectOnClose: true // automactic selection when drop down is closed
//     //closeOnSelect: false, // auto close of drop down after selection is not allowed
//     //maximumSelectionLength: 2, // limiting user selection
//   });
  
// })
function getSelectedValuesMsel(selector, delimiter, defaultValue) {
  var selectedValues = $(selector).val() || defaultValue;
  if (selectedValues.length === 0) {
    return 0;
  }
  var quotedValues = selectedValues.map(function (value) {
    return "'" + value + "'";
  });
  return quotedValues.join(delimiter);
  }


var userLvl;
  var settings = {
    "url": "attachingUser",
    "method": "POST",
    "timeout": 0,
  };
  $.ajax(settings).done(function(j) {
    j = setV(j);
    j = JSON.parse(j);
    //  console.log(j.data);

    //  if (j.statusCode == '1') {
    //$(document).ready(function() {
    var table = $('#attachUser').DataTable({
        data: j.data,
        destroy: true,
        lengthMenu: [5, 10, 25],
        pageLength: 10,
        scrollX: true,
        "columns": [
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
            { "data": "name",
                defaultContent: "",
                title: "Name And Designation",
             },
            
              {
                data: "created_by",
               defaultContent: "",
               title: "Created By",
              },
              {
                data: "usertype_of_assigned_user",
               defaultContent: "",
               title: "User Level",
              },
              {
                data: "created_date",
               defaultContent: "",
               title: "Created Date",
              },
              // {
              //   data: "username",
              //  defaultContent: "",
              //  title: "Email",
              // },
            {
                data: "username",
                defaultContent: "",
                class: "noExport",
                title: "Action",
                render: function (data, type, row, meta) {
                    var btn='';
                    return  btn = '<div><a href="#" data-value = "'+data+'" data-value1 = "'+row.usertype_of_assigned_user+'"  class="btn btn-sm btn-primary bi bi-eye attUser" title="Attach"></a>';
                     
                }
             },
        ]
    });
  table.columns.adjust().draw();
    // jQuery to handle enabling radio buttons when the checkbox is checked
  
//});
    //}
  });
  var div;
  var dist;
        $(document).on("click", ".attUser", function (e) {
      //  console.log($(".attUser").attr("data-value"));
      let email =this.getAttribute('data-value');
      let usrLvl =this.getAttribute('data-value1');
     // var email=$(this).data('value');

     var selLvl;
    
if(usrLvl!="DISTRICT"){
  selLvl='<div><input type="radio" name="selLvl" value="UT">UT'
  +'<input type="radio" name="selLvl" value="DIVISION">Division'
 // +'<input type="radio" name="selLvl" value="DISTRICT">District'
  +'</div>';

}else {

  selLvl='<div>'
     +'<input type="radio" name="selLvl" value="DISTRICT">District'
     +'</div>';
    
}
     

        $('#attachUserList').modal('show');
        var html='<div class="col-lg-12" ><div class="card" ><div class="card-body"><h5 class="card-title">Attach new User</h5><div><div class="row" >'
        +selLvl
     
        +'<div class="col-md-4"><div class="form-floating"><input type="text" class="form-control input-f" id="attachEmail" value="'+email+'" disabled> <label for="floatingZip">Email Id</label></div></div>'
       
         +'<div class="col-md-4">'
         +'<div class="form-input-block ">'
           +'<label>Select Office Name<span class="text-danger m-0 h6">*</span></label>'
           +'<select id="office" class="form-select">'
             +'<option value="0">--Select office--</option>'
         +' </select>'

       +' </div>'
+'</div>'
         +'<div class="col-md-4" id="attDiv">'
                  +'<div class="form-input-block ">'
                    +'<label>Select designation<span class="text-danger m-0 h6">*</span></label>'
                    +'<select id="desig" class="form-select">'
                      +'<option value="0">--Select designation--</option>'
                  +'  </select>'

                +'  </div>'
          +'</div>'   
          +'<div class="col-md-4"  id="divisDiv" style="display:none">'
          +'<div class="form-input-block ">'
            +'<label>Division<span class="text-danger m-0 h6">*</span></label>'
            +'<select id="division" class="form-select">'
              +'<option value="0">--Select division--</option>'
          +'  </select>'
        +'  </div>'
        +'</div>'
       + '<div class="col-md-4 mt-3" id="distDiv" style="display:none">'
        +           '<div class="form-input-block">'
        +             '<label for="floatingZip">District<span class="text-danger m-0 h6">*</span></label>'
        +             '<select id="districts" class="form-select multi-select2" style="width: 9.75rem" multiple="multiple">'
        +           ' </select>'
            +         '</div>'
            +     '</div>'
//         +'<div class="col-md-4" id="distDiv" style="display:none">'
// +'<div class="form-input-block" >'
// +'<label>District<span class="text-danger m-0 h6">*</span></label>'
// +'<select id="districts" class="form-select">'
// +'<option value="0">--Select district--</option>'
// +' </select>'

// +' </div>'
// +'</div>'      
        +'<div class="col-md-6 mt-3"><div><button type="submit" class="btn btn-primary" id="AttNewUser">Attach</button></div></div>'
        +'</div></div></div></div>'
        $('#modalAttachUser').html(html);


        $('input[type="radio"][name="selLvl"]').click(function () {

          $('.multi-select2').select2({
            placeholder: "",
            allowClear: true,
            dropdownParent: $('#attachUserList') // Attach the dropdown to the modal
        });
        
          var val=$(this).val(); 

          $("#office").html("");
          $("#office").append('<option value="0">Select Office</option>');
          var c = JSON.stringify({
            email: email,
            usrLvl:val
        });
        var d = chkV(c);

          var settings = {
            url: "attachUserLevel?d=" + d,
            method: "POST",
            timeout: 0,
          headers: {
            "Content-Type": "application/json",
          },
        };
        $.ajax(settings).done(function (j) {
            j = setV(j);
            j = JSON.parse(j);
            $('#division').html("");
            $('#districts').html("");
            if(val=="UT"){
              
              $('#divisDiv').hide();
              $('#distDiv').hide();
            }else if(val=="DIVISION" || val=="Division"){
              $('#divisDiv').show();
              $('#distDiv').hide();
            }else{
              $('#divisDiv').show();
              $('#distDiv').show();
            }
              //console.log(j.distAndDiv)
            // alert(JSON.stringify(j))
            if (j.statusCode == "1") {
                
                if(val=="DIVISION" || val=="Division"){
                  
                  $("#division").append('<option value="0">Select Division</option>');
                  makeDropdown(division, j.distAndDiv);

                }else{
                 
                  $("#division").append('<option value="0">Select Division</option>');
                //  $("#districts").append('<option value="0">Select District</option>');
                  makeDropdown(division, j.distAndDiv);

                }
              makeDropdown(office, j.data);
            } else {
            }
          });
        
        })

        $('#office').change(function () {
         var office_name= $("#office").find(":selected").val();
        var val=$('input[name="selLvl"]:checked').val();

          $("#desig").html("");
          $("#desig").append('<option value="0">Select Office</option>');
          var c = JSON.stringify({
            email: email,
            usrLvl:val,
            office:office_name
        });
       // console.log(c)
        var d = chkV(c);

          var settings = {
            url: "attachUserDesignation?d=" + d,
            method: "POST",
            timeout: 0,
          headers: {
            "Content-Type": "application/json",
          },
        };
        $.ajax(settings).done(function (j) {
            j = setV(j);
            j = JSON.parse(j);
      
            //  console.log(j)
            // alert(JSON.stringify(j))
            if (j.statusCode == "1") {
              makeDropdown(desig, j.data);
            } else {
            }
          });
        
        })

         
  $('#division').change(function () {
      var division= $("#division").find(":selected").val();
     // var val=$('input[name="selLvl"]:checked').val();
  
        $("#districts").html("");
       // $("#districts").append('<option value="0">Select District</option>');
        var c = JSON.stringify({
          value:division
      });
      var d = chkV(c);
  
        var settings = {
          url: "attachDistricts?d=" + d,
          method: "POST",
          timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
      };
      $.ajax(settings).done(function (j) {
          j = setV(j);
          j = JSON.parse(j);
    
          //  console.log(j)
          // alert(JSON.stringify(j))
          if (j.statusCode == "1") {
            makeDropdown(districts, j.data);
          } else {
          }
        });
      
      })
  
    })
  //})

 


    $(document).on("click","#AttNewUser",function(){

        var email=$('#attachEmail').val().trim();
        var off=$('#office').val().trim();
        var des=$('#desig').val().trim();
        var division=$('#division').val();
      //  var districts=$('#districts').val();
        var districts = getSelectedValuesMsel("#districts", ", ", []);
       //var distVis= $('#distDiv').is(':visible');
       //var divVis= $('#divisDiv').is(':visible')

       var val=$('input[name="selLvl"]:checked').val();
       //console.log(val);

       var validation;
       if(val=="DISTRICT"){
          validation= off=="0" || des=="0" || districts==0 || division=="0";
       }else if(val=="DIVISION"){
        validation= off=="0" || des=="0" || division=="0";
       }else{
        validation= off=="0" || des=="0";
       }
    if(validation){

        alert("All fields are mandatory")
    }else{
        var c = JSON.stringify({
            email: email,
            office_name:off,
            designation:des,
            division:division,
            districts:districts
        });
        var d = chkV(c);
        console.log(c)

        var settings = {
            url: "attachUserTodep?d=" + d,
            method: "POST",
            timeout: 0,
          headers: {
            "Content-Type": "application/json",
          },
        };
        $.ajax(settings).done(function (j) {
            j = setV(j);
            j = JSON.parse(j);
            console.log(j)
             if(j.statusCode == 1){
                  alert("User attached Successufully")
                  window.location.reload();
                  }else if(j.statusCode==2){
                    alert("User already attached")
                    window.location.reload();
                  }else{
                    alert("Somenthing went wrong")
                    window.location.reload();
                  }
           
            })
    
    }
       


    })

   
