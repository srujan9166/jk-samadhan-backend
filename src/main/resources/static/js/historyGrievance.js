
// format previous date's
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
// Current Date & Time
function getCurrentDateTime() {
	const currentDate = new Date();
	const day = ("0" + currentDate.getDate()).slice(-2);
	const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Month starts from 0
	const year = currentDate.getFullYear();
	const hours = ("0" + currentDate.getHours()).slice(-2);
	const minutes = ("0" + currentDate.getMinutes()).slice(-2);
	const seconds = ("0" + currentDate.getSeconds()).slice(-2);
	let dateAndTime = day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
	return dateAndTime;
}

$(document).ready(function () {
	const formattedDateTime = getCurrentDateTime();
	$(".stDateTime").val(formattedDateTime);
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


Listen(document).on('click', '.closeLogout', function (e) {
	this.closest('form').submit();
});


$('#doccss').click(function (e) {
	//alert(e.target.value)
	//var path=$('#doccss').attr('val');
	var path = e.target.value;
	window.location.href = 'download1?fileName=' + encodeURIComponent(path)
	// $("#doccss").attr("href", 'download1?fileName=' + encodeURIComponent(path));
})

$(document).on('click', '#doccc2', function (e) {

	var path = e.target.value;
	console.log(path)
	window.location.href = 'download1?fileName=' + encodeURIComponent(path)
	//$("#doccc2").attr("href", 'download1?fileName=' + encodeURIComponent(path));
})


// ------------------------------------------ 02 MARCH 2024 -------------------------------------------------------
// file validation
$('#stUploadPhoto1').on('change', function () {
	//docss=[];
	//fileValidation()

	var id = $(this).attr("id")
	var fff = fileValidation(id);
	if (fff != false) {
		var t = checkMaliciousFile(id);
		t.then(function (success) {
			if (success == true) {
				return true;

				//fileValidation(id);
			} else {
				$('#' + id).val("");
				alert("Malicious File Detected")
			}
		})
	}
})


function checkMaliciousFile(id) {

	var file = document.getElementById(id).files[0];
	var formData = new FormData();
	formData.append('d', file);
	//    formData.append('file', cdd);

	return new Promise(function (resolve) {

		var settings = {
			"url": "checkMeliciousFile",
			"method": "POST",
			//	"data": {d:c,file:cdd},
			"data": formData,
			"contentType": false,
			"processData": false,
			//"timeout": 0,
		};

		$.ajax(settings).done(function (j) {
			j = setV(j);
			j = JSON.parse(j);
			//console.log(j.status)
			if (j.checkFile == '1') {
				resolve(true, j.status);

			} else {
				resolve(false, j.status);

			}
		})

	});
}

function fileValidation(id) {

	const fi = document.getElementById(id);
	var filePath = fi.value;
	var filename = filePath.replace(/^.*[\\\/]/, '');
	var allowedExtensions = /(\.png|\.PNG|\.jpg|\.JPG|\.jpeg|\.JPEG|\.PDF|\.pdf)$/i;
	if (!allowedExtensions.exec(filePath)) {
		alert('Please upload PDF,JPEG,JPG and PNG file only');
		fi.value = '';
		return false;
	}
	if (fi.files.length > 0) {
		//  for (const i = 0; i <= fi.files.length - 1; i++) {

		const fsize = fi.files.item(0).size;
		const file = Math.round((fsize / 1024));
		// The size of the file.
		if (file >= 2048) {
			alert("File size should be less than 2 MB");
			$("#" + id).val('');
			return false;
		}

	}
}


// 02 March 2024 - updateGrvBtn - start - SKY
$(document).on("click", ".updateGrvBtn", function () {
  // storing values from history-grievance
  var gId = $(".grevId12").text().trim();
  console.log(gId)
  var previousStatus = $(".statusRes").val();
  var updatedRemarks = $(".stRemarks").val();
  var dateTime = $(".stDateTime").val();

  if (updatedRemarks == "" || updatedRemarks == null) {
    alert("Remark cannot be blank. Try again.");
  } else {
    if (
      confirm(
        "Are you sure you want to update the details? This action is irreversible."
      )
    ) {
      if (!previousStatus == "") {
        var c = JSON.stringify({
          greiveanceId: gId,
          finalStatus: previousStatus,
          remarks: updatedRemarks,
          dateTime: dateTime,
        });
      }
	  console.log(c)

      // encrypting object
      var d = chkV(c);
      // file upload
      let file = document.getElementById("stUploadPhoto1").files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("d", d);
      // ajax call
      var settings = {
        url: "updateHistoryGrievance",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      };
      $.ajax(settings).done(function (j) {
        j = setV(j);
        j = JSON.parse(j);
        if (j == 1) {
          //console.log(j.data);
          alert("Grievance updated successfully.");
          window.location.href = "home";
        } else {
          alert("Something went wrong");
          window.location.reload();
        }
      });
    }
  }
});
$(".btn-customBtn").on("click", function () {
	// console.log($(this).val());
	table130.button("." + $(this).val()).trigger();
  });
var table130 = $("#MyTable1").DataTable({
       lengthMenu: [10, 50, 100],
       pageLength: 10,
       scrollX: true,
       responsive: true,
       paging: true,
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
   });

   // Default Search Input Validation - start
   $('.dataTables_filter input').unbind().keyup(function (e) {
	// console.log("Search input triggered");

	const validPattern = /^[a-zA-Z0-9/ ]*$/; // Allow alphanumeric characters, '/' and space
	let input = $(this).val();

	// Remove any invalid characters from the input (strict pattern for alphanumeric, space, and '/')
	if (!validPattern.test(input)) {
	  $(this).val(input.replace(/[^a-zA-Z0-9/ ]/g, '')); // Remove invalid characters
	}

	// After validation, trigger the DataTable search if the input is valid
	if (validPattern.test(input)) {
	  var table130 = $('#dealingHandTbl').DataTable();  // Initialize the table
	  table130.search(input).draw();  // Trigger search on the table
	}
  });
  // Default Search Input Validation - end

// $(".btn-customBtn").on("click", function () {
//    table.button("." + $(this).val()).trigger();
//  });

// 02 March 2024 - updateGrvBtn - end - SKY