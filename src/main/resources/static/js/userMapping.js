$("#selDept").change(
			function() {
				var addDeptV = $('#selDept').find(":selected").val();
				var division = $('#selectDepart').find(":selected").val();
				$("#selUser").html('');
									$("#selUser").append('<option value="0">Select</option>');
		
				if (addDeptV != '0') {
					$("#createUserDiv").show();
					//$("#categDiv").show();
					var c = JSON.stringify({
						value: addDeptV,
						department_type:division
						// divison:division
					});
					var d = chkV(c);
					var settings = {
						"url": "deptUsers?d=" + d,
						"method": "POST",
						"timeout": 0,
					};
					$.ajax(settings).done(function(j) {
						j = setV(j);
						j = JSON.parse(j);
						// console.log(j);
						if (j.statusCode == '1') {
							//console.log(j.data);
							makeDropdown(selUser, j.data);
							getGrievList(addDeptV);
							$('#userListDiv').show();

						$('#selUser').prop('selectedIndex', 1);
									
		$('#selUser').attr('disabled',true)
							//makeCheckBoxes(checkBoxDiv,addDeptV);
						} else {
							$('#userListDiv').hide();
							$("#selUser").append('<option value="add">Create new User</option>');
		$('#selUser').attr('disabled',false)
		
		
						}
					});
				} else {
					$("#selUser").html('');
					$("#createUserDiv").hide();
					$("#categDiv").hide();
					$("#newUserDiv").hide();
					$("#assignDiv").hide();
				}
			});
			
			
			$("#selectDepart").change(
		function() {
			var addDeptV = $('#selectDepart').find(":selected").val();
			$("#selDept").html('');
			$("#selDept").append('<option value="0">Select</option>');
			$("#selDept").prop("disabled", false);
			//console.log(stateS);
			if (addDeptV != '0') {
				///to add new///
				
					var c = JSON.stringify({
						value: addDeptV
					});
					var d = chkV(c);
					var settings = {
						"url": "selectDpartment?d=" + d,
						"method": "POST",
						"timeout": 0,
					};
					$.ajax(settings).done(function(j) {
						j = setV(j);
						j = JSON.parse(j);
						if (j.statusCode == '1') {
							$("#createUserDiv").hide();
							$("#userListDiv").hide();
							userListDiv
							//console.log(j.data);
							//console.log(categ)
						//	inputRegion(addDeptV);
							makeDropdown(selDept, j.data);
						}
					});	
				
			}else {
				
				
			}
		});
		
		function inputRegion(dep){
		
/*		var addDeptV = $('#inputRegion').find(":selected").val();
*/
	var addDeptV = dep;
		$("#inputDistrict").html('');
		$("#inputDistrict").append('<option value="0">--Select District--</option>');
		if (addDeptV != '0') {
			$("#inputDistrict").attr("disabled",false);
				var c = JSON.stringify({
					value: addDeptV
				});
				var d = chkV(c);
				var settings = {
					"url": "districts?d=" + d,
					"method": "POST",
					"timeout": 0,
				};
				$.ajax(settings).done(function(j) {
					j = setV(j);
					j = JSON.parse(j);
					if (j.statusCode == '1') {
						//console.log(j.data);
						makeDropdown(inputDistrict, j.data);
					}
				});
		}else {
			$("#inputDistrict").attr("disabled",true);
		}
			
		}
		
		$("#inputRegion").change(
	function() {
		var addDeptV = $('#inputRegion').find(":selected").val();
		$("#inputDistrict").html('');
		$("#inputDistrict").append('<option value="0">--Select District--</option>');
		if (addDeptV != '0') {
			$("#inputDistrict").attr("disabled",false);
				var c = JSON.stringify({
					value: addDeptV
				});
				var d = chkV(c);
				var settings = {
					"url": "districts?d=" + d,
					"method": "POST",
					"timeout": 0,
				};
				$.ajax(settings).done(function(j) {
					j = setV(j);
					j = JSON.parse(j);
					if (j.statusCode == '1') {
						//console.log(j.data);
						makeDropdown(inputDistrict, j.data);
					}
				});
		}else {
			$("#inputDistrict").attr("disabled",true);
		}
	});
	
	
	
	  $("#selUser").change(function(){
   
    var dep=$('#selDept').find(":selected").val();
    $("#selUsrType").html('');
	$("#selUsrType").append('<option value="0">Select User Type</option>');
   var c = JSON.stringify({
  dep:dep
  });
  var d = chkV(c);
  var settings = {
  "url": "getUserTypeForUsrCreation?d=" + d,
  "method": "POST",
  "timeout": 0,
  };
$.ajax(settings).done(function(j) {
  j = setV(j);
  j = JSON.parse(j);
 // console.log(j)
  // alert(JSON.stringify(j))
  if(j.statusCode == '1') {
  	makeDropdown(selUsrType, j.data);
  }else {
  
  }
  });
    });
    
      $("#selUsrType").change(function(){
    var dep=$('#selDept').find(":selected").val();
    var val=$('#selUsrType').find(":selected").val();
    $("#designation").html('');
	$("#designation").append('<option value="0">Select Designation</option>');
   var c = JSON.stringify({
           value: val,
           dep:dep
            });
  var d = chkV(c);
  var settings = {
  "url": "getUserDesignation?d=" + d,
  "method": "POST",
  "timeout": 0,
  };
$.ajax(settings).done(function(j) {
  j = setV(j);
  j = JSON.parse(j);
  console.log(j)
  // alert(JSON.stringify(j))
  if(j.statusCode == '1') {
  	makeDropdown(designation, j.data);
  }else {
  
  }
  });
    });

	
