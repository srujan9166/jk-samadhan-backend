
//console.log(cmonthly)

function getButtons() {

	return [
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
	];


}

// console.log(ddata);
if (cmonthly != null && cmonthly.length > 0) {
	$('#total_cmonthly').html(cmonthly[0].total_count);
	$('#total_cmonthly1').html(cmonthly[0].total_count);
	const statewisestatenames = cmonthly.map(item => item.month_year);
	const statewisecounts = cmonthly.map(item => item.count);

	const statewiseoptions = {
		chart: {

			type: 'bar',
			height: 500
		},
		series: [{
			name: 'Counts',
			data: statewisecounts
		}],
		colors: '#ec6d67',
		xaxis: {
			categories: statewisestatenames
		},
		title: {
			//  text: 'Month-wise grievance count',
			align: 'center'
		}
		, plotOptions: {
			bar: {
				horizontal: false, // Make sure the bars are vertical
				columnWidth: '50%' // Adjust the column width to fit your labels
			}
		}
	};

	var statewisechart1 = new ApexCharts(document.querySelector("#chart_cmonthly"), statewiseoptions);
	statewisechart1.render();
}
else {
	$('#cmonthly_id').hide();
}

$(".btn-mcr-customBtn").on("click", function () {
	// console.log($(this).val());
	mcr_table.button("." + $(this).val()).trigger();
});

var mcr_table = $('#mcr_table').DataTable({

	//dom: 'frtip',
	buttons: getButtons(),
	paging: true,
	pageLength: 10,
	searching: true,
	responsive: true,
	data: cmonthly,
	//	serverSide: true,
	processing: true,
	columns: [
		{
			data: null, title: "Sr No", render: function (data, type, row, meta) {
				var adjustedIndex = meta.row + 1 + (meta.settings._iDisplayStart);
				return adjustedIndex;
			}
		},
		{ title: 'Month-Year', data: 'month_year' },
		{ title: "Count", data: "count" },
	],
});


//			--------------------------------------


if (monthly != null && monthly.length > 0) {
	$('#total_monthly').html(monthly[0].total_count);
	$('#total_monthly1').html(monthly[0].total_count);
	const statewisestatenames = monthly.map(item => item.month_year);
	const statewisecounts = monthly.map(item => item.count);

	const statewiseoptions = {
		chart: {

			type: 'bar',
			height: 500
		},
		series: [{
			name: 'Counts',
			data: statewisecounts
		}],
		colors: '#CCCC33',
		xaxis: {
			categories: statewisestatenames
		},
		title: {
			//  text: 'Month-wise grievance count',
			align: 'center'
		}
		, plotOptions: {
			bar: {
				horizontal: false, // Make sure the bars are vertical
				columnWidth: '50%' // Adjust the column width to fit your labels
			}
		}
	};

	var statewisechart = new ApexCharts(document.querySelector("#chart_monthly"), statewiseoptions);
	statewisechart.render();
}
else {
	$('#monthly_id').hide();
}


$(".btn-mg-customBtn").on("click", function () {
	// console.log($(this).val());
	mg_table.button("." + $(this).val()).trigger();
});

var mg_table = $('#mg_table').DataTable({

	//dom: 'frtip',
	buttons: getButtons(),
	paging: true,
	pageLength: 10,
	searching: true,
	responsive: true,
	data: monthly,
	//	serverSide: true,
	processing: true,
	columns: [
		{
			data: null, title: "Sr No", render: function (data, type, row, meta) {
				var adjustedIndex = meta.row + 1 + (meta.settings._iDisplayStart);
				return adjustedIndex;
			}
		},
		{ title: 'Month-Year', data: 'month_year' },
		{ title: "Count", data: "count" },
	],
});


//			-----------------------------------------

//console.log(data.length);
if (data != null && data.length > 0) {
	$('#total_c').html(data[0].total_c);
	const statenames = data.map(item => item.department);
	const counts = data.map(item => item.count);

	const options = {
		chart: {
			type: 'bar',
			height: 500, // Increase the overall chart height
		},
		series: [{
			name: 'Counts',
			data: counts,
		}],
		colors: '#66DA26',
		xaxis: {
			categories: statenames,
			labels: {
				trim: true,
				rotate: -45,
				style: {
					fontSize: '10px', // Adjust the font size to fit your labels
					fontFamily: 'Helvetica, Arial, sans-serif',
					cssClass: 'apexcharts-xaxis-label' // Add a custom CSS class
				},
				hideOverlappingLabels: true
			},
			tickPlacement: 'on', // Place the tick marks on the axis
			tickAmount: statenames.length, // Show all tick marks
			min: 0, // Start the x-axis from 0
			max: statenames.length - 1, // End the x-axis at the last category

		},
		title: {
			align: 'center'
		},
		plotOptions: {
			bar: {
				horizontal: false, // Make sure the bars are vertical
				columnWidth: '50%' // Adjust the column width to fit your labels
			}
		}
	};
	var chart = new ApexCharts(document.querySelector("#chart_H1"), options);
	chart.render();
}

$(".btn-dg-customBtn").on("click", function () {
	// console.log($(this).val());
	dg_table.button("." + $(this).val()).trigger();
});

var dg_table = $('#dg_table').DataTable({

	//dom: 'frtip',
	buttons: getButtons(),
	paging: true,
	pageLength: 10,
	searching: true,
	responsive: true,
	data: data,
	//	serverSide: true,
	processing: true,
	columns: [
		{
			data: null, title: "Sr No", render: function (data, type, row, meta) {
				var adjustedIndex = meta.row + 1 + (meta.settings._iDisplayStart);
				return adjustedIndex;
			}
		},
		{ title: 'Department', data: 'department' },
		{ title: "Count", data: "count" },
		{ title: "Grievance Share %", data: "grievance_share_percentage" },

	],
});

