
// document .ready function
$(function () {
	getGrievList("cUserTblDetails");
	if($("#usl").val() == 3) {
		$(".flexCheckChecked").attr("disabled", true);
	}
  });
  
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

// $('#YRreport').DataTable( {
// 	  //  data: j,
// 	    destroy: true,
// 	    lengthMenu:[5,10,25],
// 	    pageLength: 10,
// 	    //dom: '<"ui grid"<"col-sm-4 float-start"l><"col-sm-4 float-start d-flex justify-content-center"B><"col-sm-4 float-start"f>rt<"row"<"col-sm-6 float-start"i><"col-sm-6 float-end"p>>>',
//     /*   buttons: [
//             'copy', 'csv', 'excel', 'pdf', 'print'
//         ]*/
//          buttons: [
//              'excel'
//         ]
//         })

$("#selUser").change(
		function() {
			var addDeptV = $('#selUser').find(":selected").val();
			//console.log(stateS);
			if (addDeptV != '0') {
				///to add new///
				if(addDeptV == 'add') {
					$("#newUserDiv").show();
					$("#assignDiv").hide();
				}else {
					$("#newUserDiv").hide();
					$("#assignDiv").show();
				}
			}else {
				$("#newUserDiv").hide();
				$("#assignDiv").hide();
			}
		});



Listen(document).on('click', '.closeLogout', function(e) {
	this.closest('form').submit();
});

Listen(document).on('click', '.dtl-btn', function(e) {
//	alert(e.target.value);
	var c = JSON.stringify({
		value: e.target.value,
		});
		
		var d = chkV(c);
		var settings = {
		"url": "chkVal?d=" + d,
		"method": "POST",
		"timeout": 0,
		};
	$.ajax(settings).done(function(j) {
		j = setV(j);
		j = JSON.parse(j);
		if(j.statusCode == '1') {
			//	console.log(j.data);
			makeDataTable(j.data);
		}else {
			alert("No categories to show.");
		}
		});
});

Listen(document).on('click', '.del-btn', function(e) {
//	alert(e.target.value);
	var c = JSON.stringify({
		value: e.target.value,
		});
		
		var d = chkV(c);
		var settings = {
		"url": "delVal?d=" + d,
		"method": "POST",
		"timeout": 0,
		};
	$.ajax(settings).done(function(j) {
		j = setV(j);
		j = JSON.parse(j);
		if (j.statusCode == '1') {
			//console.log(j.data);
			alert("Category removed successfully.")
			window.location.reload();
			}else {
			alert("Something went wrong");
			window.location.reload();
			}
		});
	
});

//
function makeDataTable(d) {
	$('#exampleModal').modal('show');

	$(".btn-customBtn").on("click", function () {
		// console.log($(this).val());
		table153.button("." + $(this).val()).trigger();
	  });
	var table153 = $("#rtb").DataTable(
			{
				data: d,
				destroy: true,
				lengthMenu: [10, 50, 100],
				pageLength: 10,
				"scrollX": true,
//				"scrollY": 500,
				"paging": true,
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
				"columns": [
				            {
				            	"data": "assigned_to",
				            	"defaultContent": "",
				            	title: "Assigned To"
				            }, 
					{
						"data": "category_name",
						"defaultContent": "",
						title: "Assigned Category"
					}, 
					{
						"data": "id",
						"defaultContent": "",
						class: "noExport",
						title: "Action",
						"render": function ( data, type, row, meta ) { 
							return '<button type="button" value="'+data+'" class="btn btn-danger del-btn">Remove</button>' 
									} 
					},
		         ],
			});
}
$(document).on('shown.bs.modal', '.modal', function (){
	$($.fn.dataTable.tables(true)).DataTable()
		.columns.adjust()
		.responsive.recalc()
		.scroller.measure();
});  
////////
$("#submitUser").click(
		function() {
			var chked = ""
			$('.flexCheckChecked:checked').each(function() {    
					      var vl = $(this).val();
					      chked = chked + vl + ',';
					});	
			chked = chked.substring(0,chked.length-1);
//			alert(chked);
			if($('.flexCheckChecked:checked').length == 0 || $("#fn").val() == null || $("#fn").val().trim() == '' || $("#ln").val() == null || $("#ln").val().trim() == '' || $("#mobile").val() == null || $("#mobile").val().trim() == '' || $("#email").val() == null || $("#email").val().trim() == '' || $("#designation").val() == null || $("#designation").val().trim() == '' || $("#password").val() == null || $("#password").val().trim() == ''){
				alert("All fields except middle name are mandatory.")
			}else {
				var fn = $("#fn").val().trim();
				var mn = $("#mn").val();
				var ln = $("#ln").val().trim();
				var mobile = $("#mobile").val().trim();
				var email = $("#email").val().trim();
				var designation = $("#designation").val().trim();
				var passw = $("#password").val().trim();
				////
				var district;
				if($("#usl").val() == 3 ) {
					district = $('#selDist').find(":selected").val();
				}else {
					district = 'NA';
				}
				
				if(mn != null) {
					mn = mn;
				}else {
					mn = ""
				}
				
				if(isEmail(email) && isMobile(mobile)) {
					var c = JSON.stringify({
						first_name: fn,
						middle_name: mn,
						last_name: ln,
						mobile: mobile,
						email: email,
						designation:designation,
						passw:passw,
						category:chked,
						////
						district : district
						///
								});
						
						var d = chkV(c);
						var settings = {
						"url": "addUser?d=" + d,
						"method": "POST",
						"timeout": 0,
						};
					$.ajax(settings).done(function(j) {
						j = setV(j);
						j = JSON.parse(j);
						if (j.statusCode == '1') {
							//console.log(j.data);
							alert("User added successfully.");
							window.location.reload();
							}else if (j.statusCode == '2') {
								//console.log(j.data);
								alert("User already exists.");
								window.location.reload();
								}else {
							alert("Something went wrong");
							window.location.reload();
							}
						});	
					}else {
						alert("Enter valid email and mobile.")
					}
				}		
		});

$("#assignUser").click(
		function() {
			var chked = ""
			$('.flexCheckChecked:checked').each(function() {    
					      var vl = $(this).val();
					      chked = chked + vl + ',';
					});	
			chked = chked.substring(0,chked.length-1);
//			alert(chked);
			var selUserVal;
			if($("#usl").val() == 3) {
				selUserVal = $("#selUser2").val();
			}else {
				selUserVal = $("#selUser").val();
			}
			if($('.flexCheckChecked:checked').length == 0 || selUserVal == '0'){
				alert("All fields are mandatory.")
			}else {
				//
				var fn;
				var district;
				if($("#usl").val() == 3) {
					fn = $('#selUser2').find(":selected").val();
					district = $('#selDist').find(":selected").val();
				}else {
					fn = $('#selUser').find(":selected").val();
					district = 'NA';
				}
				
					var c = JSON.stringify({
						email: fn,
						category:chked,
						district:district
								});
						
						var d = chkV(c);
						var settings = {
						"url": "extUs?d=" + d,
						"method": "POST",
						"timeout": 0,
						};
					$.ajax(settings).done(function(j) {
						j = setV(j);
						j = JSON.parse(j);
						if (j.statusCode == '1') {
							//console.log(j.data);
							alert("Categories assigned successfully.");
							window.location.reload();
							}else {
							alert("Something went wrong");
							window.location.reload();
							}
						});	
				}		
		});

//////
function makeDropdown(passedId, data) {
	$.each(data, function(key, value) {
		$(passedId).append($("<option></option>")
			.attr("value", value.values)
			.text(value.values.toUpperCase()));
	});
}
/////
$('.input-field').keyup(function(e) {
	var $th = $(this);
    $th.val($th.val().replace(/(\s{2,})|[^a-zA-Z']/g, ' '));
    $th.val($th.val().replace(/^\s*/, ''));
});


    $('.input-f').keypress(function(e) {
    	return validN(e);
    	});

    	function validN(e) {
    	    var keyCode = e.keyCode || e.which;
    	    //Regex for Valid Characters i.e. Alphabets.
    	    var regex = /^[A-Za-z]+$/;
    	    //Validate TextBox value against the Regex.
    	    var isValid = regex.test(String.fromCharCode(keyCode));
    	    return isValid;
    	}
    	
    	
    	function isEmail(email) {
    		  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    		  return regex.test(email);
    		}
    	
    	function isMobile(mobile) {
  		  var regex = /^([6789][0-9]{9})$/;
  		  return regex.test(mobile);
  		}
  
    	$('#mobile').bind('keyup paste', function(){
    	    this.value = this.value.replace(/[^0-9]/g, '');
    	});


function getGrievList(btnVal) {
      // alert(btnVal);
      var c = JSON.stringify({
        value: btnVal,
      });
      var d = chkV(c);
      var settings = {
        url: "api_v1?d=" + d,
        method: "POST",
        timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        // alert(JSON.stringify(j))

		if(j.statusCode == '0'){
			$('#cUsers').hide();
		}
		else{
			$('#cUsers').show();
			j.data = j.data.map((current) => {
				if (current.created_date != null) {
					current.created_date = format_date(current.created_date);
				}
				return current;
			});
			$(".btn-customBtn").on("click", function () {
				// console.log($(this).val());
				table154.button("." + $(this).val()).trigger();
			  });
			var table154 = $("#YRreport").DataTable({
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
				  data: (row) =>
					row.first_name + " " + row.middle_name + " " + row.last_name,
				  defaultContent: "",
				  title: "Name",
				},
				{
					data: "department",
					defaultContent: "",
					title: "Department",
				  },
				  {
					data: "designation",
					defaultContent: "",
					title: "Designation",
				  },
				  {
					data: "mobile",
					defaultContent: "",
					title: "Mobile Number",
				  },
				  {
					data: "email",
					defaultContent: "",
					title: "Email Id",
				  },
				  {
					data: "username",
					defaultContent: "",
					title: "Username",
				  },
				  {
					data: "created_date",
					defaultContent: "",
					title: "Created On",
				  },
				  {
					data: "created_by",
					defaultContent: "",
					title: "Created By",
				  },
				{
				  data: "username",
				  defaultContent: "",
				  class: "noExport",
				  title: "Action",
				  render: function (data, type, row, meta) {
					return `<button value = "${data}" class="btn btn-sm btn-primary dtl-btn">Details</button>
					<button value = "${data}" class="btn btn-sm btn-warning text-white" style = "display: none;"><i class="bi bi-pencil-square""></i></button>
					<button value = "${data}" class="btn btn-sm btn-danger text-white" style = "display: none;"><i class="bi bi-trash"></i></button>`;
				  },
				},
			  ],
			});
		}
      });
    }

////////23022024 --> Tushar Sharma new added
$("#selDist").change(
		function() {
			var addDeptV = $('#selDist').find(":selected").val();
			$("#selUser2").html('');
			$("#selUser2").append('<option value="0">Select</option><option value="add">Create new User</option>');
			if (addDeptV != '0') {
				$("#selUser2").attr("disabled",false);
					var c = JSON.stringify({
						value: addDeptV
					});
					var d = chkV(c);
					var settings = {
						"url": "chKUsers?d=" + d,
						"method": "POST",
						"timeout": 0,
					};
					$.ajax(settings).done(function(j) {
						j = setV(j);
						j = JSON.parse(j);
						if (j.statusCode == '1') {
							//console.log(j.data);
							makeDropdown(selUser2, j.data);
							makeCheckBoxes(addDeptV);
						}
					});
			}else {
				$("#selUser2").attr("disabled",true);
				$(".flexCheckChecked").attr("disabled", true);
			}
		});

////////23022024 --> Tushar Sharma new added
$("#selUser2").change(
		function() {
			var addDeptV = $('#selUser2').find(":selected").val();
			//console.log(stateS);
			if (addDeptV != '0') {
				///to add new///
				if(addDeptV == 'add') {
					$("#newUserDiv").show();
					$("#assignDiv").hide();
				}else {
					$("#newUserDiv").hide();
					$("#assignDiv").show();
				}
			}else {
				$("#newUserDiv").hide();
				$("#assignDiv").hide();
			}
		});

////////23022024 --> Tushar Sharma new added
function makeCheckBoxes(district) {
	$(".flexCheckChecked").removeAttr("disabled");
	var c = JSON.stringify({
		value: district,
		});
	var d = chkV(c);
	var settings = {
	"url": "chkCatg?d=" + d,
	"method": "POST",
	"timeout": 0, 
	};
$.ajax(settings).done(function(j) {
	j = setV(j);
	j = JSON.parse(j);
	if (j.statusCode == '1') {
//		console.log(j.data);
		var catgg = j.data;
		var chk = $('.flexCheckChecked');
		for(let ii=0;ii<catgg.length;ii++) {
			for(jj=0;jj<chk.length;jj++) {
				if(catgg[ii].category_id == chk[jj].value) {
					chk[jj].disabled = "true";
				}
			}
		}
		}else {
			$(".flexCheckChecked").removeAttr("disabled");
		}
	});

}