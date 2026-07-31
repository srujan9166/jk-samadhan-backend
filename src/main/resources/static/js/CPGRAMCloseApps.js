  
  Listen(document).on('click', '.closeLogout', function(e) {
	this.closest('form').submit();
});
  
  $("#MyTable1").DataTable();
    $("#submitButton").click(function() {
        var checkboxes = document.querySelectorAll('.checkbox:checked');
        var selectedValues = [];
        checkboxes.forEach(function(checkbox) {
            selectedValues.push(checkbox.value);
                  
        });
        console.log(selectedValues);
        
        if(selectedValues.length>0){
			
			  var c = JSON.stringify({
		value: selectedValues,
	});
	var d = chkV(c);
	var settings = {
		url: "closeProcessedGrievances?d=" + d,
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
	//	if(j==" - Successful."){
			
			//alert("Selcted grievances are closed now.");
			alert(j.result)
			
		//	window.location.href="home"
		window.location.reload();
			
		//}else if(j==" - You have already sent consumption flag for this grievance"){
		//	}else {
		//	alert("failed")
			
		//}
		
		
		})
        
		}else{
			
			alert("Please select atleast one grievance")
			
		}
        
      
        
    });


	$("#griMov").click(function() {
        var checkboxes = document.querySelectorAll('.checkbox:checked');
        var selectedValues = [];
        checkboxes.forEach(function(checkbox) {
            selectedValues.push(checkbox.value);
                  
        });
        console.log(selectedValues);
        
        if(selectedValues.length>0){
			
			  var c = JSON.stringify({
		value: selectedValues,
	});
	var d = chkV(c);
	var settings = {
		url: "grievanceMovement?registrationNo=" + selectedValues,
		method: "POST",
		timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
	};
	$.ajax(settings).done(function (j) {
		//j = setV(j);
	//	j = JSON.parse(j);
		console.log(j)
	//	if(j==" - Successful."){
			
			alert(j)
			
		//	window.location.href="home"
		//window.location.reload();
			
		//}else if(j==" - You have already sent consumption flag for this grievance"){
		//	}else {
		//	alert("failed")
			
		//}
		
		
		})
        
		}else{
			
			alert("Please select atleast one grievance")
			
		}
        
      
        
    });

	$("#caseRepRep").click(function() {
        var checkboxes = document.querySelectorAll('.checkbox:checked');
        var selectedValues = [];
        checkboxes.forEach(function(checkbox) {
            selectedValues.push(checkbox.value);
                  
        });
        console.log(selectedValues);
        
        if(selectedValues.length>0){
			
			  var c = JSON.stringify({
		value: selectedValues,
	});
	var d = chkV(c);
	var settings = {
		url: "caseReportReply?registrationNo=" + selectedValues,
		method: "POST",
		timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
	};
	$.ajax(settings).done(function (j) {
		//j = setV(j);
	//	j = JSON.parse(j);
		console.log(j)
	//	if(j==" - Successful."){
			
			alert(j)
			
		//	window.location.href="home"
		//window.location.reload();
			
		//}else if(j==" - You have already sent consumption flag for this grievance"){
		//	}else {
		//	alert("failed")
			
		//}
		
		
		})
        
		}else{
			
			alert("Please select atleast one grievance")
			
		}
        
      
        
    });


	$("#confcase").click(function() {
        var checkboxes = document.querySelectorAll('.checkbox:checked');
        var selectedValues = [];
        checkboxes.forEach(function(checkbox) {
            selectedValues.push(checkbox.value);
                  
        });
        console.log(selectedValues);
        
        if(selectedValues.length>0){
			
			  var c = JSON.stringify({
		value: selectedValues,
	});
	var d = chkV(c);
	var settings = {
		url: "recieptConfirm?registrationNo=" + selectedValues,
		method: "POST",
		timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
	};
	$.ajax(settings).done(function (j) {
		//j = setV(j);
	//	j = JSON.parse(j);
		console.log(j)
	//	if(j==" - Successful."){
			
			alert(j)
			
		//	window.location.href="home"
		//window.location.reload();
			
		//}else if(j==" - You have already sent consumption flag for this grievance"){
		//	}else {
		//	alert("failed")
			
		//}
		
		
		})
        
		}else{
			
			alert("Please select atleast one grievance")
			
		}
        
      
        
    });


	$(".cpgramGri").click(function() {
       
		var cpgramApi=$(this).val();
       // console.log(cpgramApi);
        
	// var settings = {
	// 	url: cpgramApi,
	// 	method: "GET",
	// 	timeout: 0,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
	// };
	// $.ajax(settings).done(function (j) {
		//j = setV(j);
	//	j = JSON.parse(j);
		//console.log(j)
	//	if(j==" - Successful."){
			
		//	alert(j)

		window.location.href=cpgramApi
		
		
		
		//})
          
    });




    $('#selectAll').click(function(){
        $('.checkbox').prop('checked', this.checked);
        
    });

