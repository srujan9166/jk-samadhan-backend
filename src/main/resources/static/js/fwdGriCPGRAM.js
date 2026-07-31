$(document).ready(function () {

	$("#state").change(
		function () {
			var stateCode = $('#state').find(":selected").val();
			$("#district").html('');
			$("#district").append('<option value="0">--Select District--</option>');
			$("#district").prop("disabled", false);
			//console.log(stateS);
			if (stateCode != '0') {
				///to add new///

				var c = JSON.stringify({
					value: stateCode
				});
				var d = chkV(c);
				var settings = {
					"url": "districtList?d=" + d,
					"method": "POST",
					"timeout": 0,
				};
				$.ajax(settings).done(function (j) {
					j = setV(j);
					j = JSON.parse(j);
					if (j.statusCode == '1') {

						distDropdown(district, j.data);
					}
				});

			} else {

			}
		});

	//  ADD HERE — inside document.ready utkarsh
	$('#address1, #address2, #address3').on('input', function () {
		var val = $(this).val();
		$(this).val(val.replace(/[^a-zA-Z0-9\-,()\s]/g, ''));  // removed duplicate \d (same as 0-9)
	});

	$('#email').on('input', function () {
		var val = $(this).val();
		$(this).val(val.replace(/[^a-zA-Z0-9@.,]/g, ''));  // removed \s (spaces not needed in email)
	});

	$('#phNo').on('input', function () {
		var val = $(this).val();
		$(this).val(val.replace(/[^0-9-]/g, ''));
	});

	$('#pincode').on('input', function () {
		var val = $(this).val();
		val = val.replace(/[^0-9]/g, '');
		$(this).val(val.substring(0, 6));
	});
	// ADD END utkarsh

})
function distDropdown(passedId, data) {

	$.each(data, function (key, value) {
		$(passedId).append($("<option></option>")
			.attr("value", value.distcode)
			.text(value.distname));
	});
}


$("#exSer").change(function () {

	if ($(this).val() == "Y") {

		$("#defSerDiv").show();
		$("#serNoDiv").show();
	} else {
		$('#defSer').val("0");
		$('#serNo').val("");
		$("#defSerDiv").hide();
		$("#serNoDiv").hide();

	}

})

$("#country").change(function () {

	if ($(this).val() != "001") {

		//  $("#state").val("");
		$("#state").val('0');
		$("#state").attr('disabled', true);
		$("#district").html('');
		$("#district").append('<option value="0">--Select District--</option>');
		$("#district").attr('disabled', true);
	} else {

		$("#state").attr('disabled', false);
		$("#district").attr('disabled', false);
		$("#state").prop('selectedIndex', '0');
		$("#district").html('');
		$("#district").append('<option value="0">--Select District--</option>');

	}

})

// comment out by utkarsh as we are using input event for phone no. validation
// $('#phNo').keyup(function (e) {
//  return comVal(e);
// });

function comVal(e) {
	var keyCode = e.keyCode || e.which;

	var lblError5 = document.getElementById("lblError1");
	lblError5.innerHTML = "";

	//Regex for Valid Characters i.e. Alphabets.
	var regex = /^[0-9]{8,15}$/;

	//Validate TextBox value against the Regex.
	var inpVal = e.target.value
	if (inpVal != "") {
		var isValid = regex.test(e.target.value);
		if (!isValid) {
			lblError5.innerHTML = "Invalid Phone No. Format.";
			$('#fwdGri').attr("disabled", true);
		} else {
			$('#fwdGri').attr("disabled", false);
		}
	} else {
		$('#fwdGri').attr("disabled", false);
	}
	return isValid;
}


$('#AFOC').keyup(function (e) {
	return AFOC(e);
});

function AFOC(e) {
	var keyCode = e.keyCode || e.which;

	var lblError5 = document.getElementById("lblError2");
	lblError5.innerHTML = "";

	//Regex for Valid Characters i.e. Alphabets.
	var regex = /^[A-Z a-z 0-9]{5}$/;

	//Validate TextBox value against the Regex.
	var inpVal = e.target.value;
	if (inpVal != "") {
		var isValid = regex.test(inpVal);
		if (!isValid) {
			lblError5.innerHTML = "Invalid Format.";
			$('#fwdGri').attr("disabled", true);
		} else {
			$('#fwdGri').attr("disabled", false);
		}
	} else {
		$('#fwdGri').attr("disabled", false);

	}
	return isValid;
}



$("#fwdGri").click(function () {

	var minDepCode = $("#minDep").find(":selected").val();
	var griRefNo = $("#griRefNo").val();
	var country = $("#country").find(":selected").val();
	var state = $("#state").find(":selected").val();
	var dist = $("#district").find(":selected").val();
	var phoneNo = $("#phNo").val();
	var lang = $("#lang").find(":selected").val();
	var compIp = $("#CIA").val();
	var exSer = $("#exSer").find(":selected").val();
	var defSer = $("#defSer").find(":selected").val();
	var serNo = $("#serNo").val();
	var autoForOrgCode = $("#AFOC").val();
	var addField1 = $("#additionalField1").val();
	var addField2 = $("#additionalField1").val();
	var addField3 = $("#additionalField1").val();
	var address1 = $("#address1").val();
	var address2 = $("#address2").val();
	var address3 = $("#address3").val();
	// newly added fields by utkarsh
	var email = $("#email").val();
	var pincode = $("#pincode").val();
	//end of newly added fields by utkarsh
	var validation;

	if (exSer == 'Y') {

		validation = minDepCode == '0' || country == '0' || lang == '0' || exSer == '0' || defSer == '0' || serNo == "";
	} else {

		validation = minDepCode == '0' || country == '0' || lang == '0' || exSer == '0';

	}

	if (state != '0') {
		validation = + dist == '0';
	}


	if (validation) {

		alert("PLease fill all the mandatory fields")

	} else {

		if (state == '0') {
			state = "";
		}

		if (defSer == '0') {
			defSer = "";
		}

		var c = JSON.stringify({
			minDepCode: minDepCode,
			griRefNo: griRefNo,
			country: country,
			state: state,
			dist: dist,
			phoneNo: phoneNo,
			lang: lang,
			compIp: compIp,
			exSer: exSer,
			defSer: defSer,
			serNo: serNo,
			autoForOrgCode: autoForOrgCode,
			addField1: addField1,
			addField2: addField2,
			addField3: addField3,
			address1: address1,
			address2: address2,
			address3: address3,
			//newly added fields by utkarsh
			email: email,
			pincode: pincode
			//Newly added fields end

		});

		// console.log("data before saving : " + c)
		var d = chkV(c);
		var settings = {
			"url": "forwardToCPGRAM?d=" + d,
			"method": "POST",
			"timeout": 0,
		};
		$.ajax(settings).done(function (j) {
			j = setV(j);
			j = JSON.parse(j);
			if (j.statusCode == '1') {

				alert("Grievance forwarded to CPGRAM successfully")
				window.location.href = "home";
			} else {

				alert(j.result)
			}
		});

	}



})
