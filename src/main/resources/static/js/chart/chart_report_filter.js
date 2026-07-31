
function Progress_old(){
	
	let dept = $("#departmentss").find(":selected").val();
	 let category = $("#catGraph").find(":selected").val();
	let fromDate = $("#dateFrom").val();
    let toDate = $("#dateTo").val();
        let dist = $("#districtFilter").val();

var chart_monthly_c = JSON.stringify({
					dist:dist,
					dept: dept,
					fromDate: fromDate,
					toDate: toDate,
					category: category,
					eCheck0 : eCheck0,
					eCheck1 : eCheck1,
					subCatGraphVal:subCatGraphVal,
					statusFilterVal:statusFilterVal,
					psgaFilterVal:psgaFilterVal,
					divisionFilterVal:divisionFilterVal,
					municipality_block_FilterVal:municipality_block_FilterVal,
					ward_panchayat_FilterVal:ward_panchayat_FilterVal
				});
				var chart_monthly_d = chkV(chart_monthly_c);
				
	$.ajax({
					url: 'getMonthly?d=' + chart_monthly_d,
					type: 'get',
					contentType: 'application/json',
					success: function (j) {
//						j = setV(j);
						j = JSON.parse(j);
						
						let cmonthly = j.cmonthly;
			 //marc
			 if(cmonthly != undefined && cmonthly != null && cmonthly.length > 0){
			$('#total_cmonthly1').html(cmonthly[0].total_count);
			}else{
				$('#total_cmonthly1').html(0);
			}
const statewisestatename = cmonthly.map(item => item.month_year);
			const statewisecount = cmonthly.map(item => item.count);



statewisechart1.updateOptions({
                    xaxis: {
                        categories: statewisestatename
                    },
                    series: [{
                        name: 'Counts',
                        data: statewisecount
                    }]
                });
                
                 mcr_table.clear();
                mcr_table.rows.add(cmonthly); 
                mcr_table.draw();
						
						
						let monthly = j.data;
						
//	$('#total_monthly').html(monthly[0].total_count);
//			$('#total_monthly1').html(monthly[0].total_count);
			
			 const statewisestatenames = monthly.map(item => item.month_year);
                const statewisecounts = monthly.map(item => item.count);

                statewisechart.updateOptions({
                    xaxis: {
                        categories: statewisestatenames
                    },
                    series: [{
                        name: 'Counts',
                        data: statewisecounts
                    }]
                });
			
			
			 mg_table.clear();
                mg_table.rows.add(monthly); 
                mg_table.draw();
                
                
                
                 let dept = j.dept;
                	const statenames = dept.map(item => item.department);
			const counts = dept.map(item => item.count);
                chart.updateOptions({
                    xaxis: {
                        categories: statenames
                    },
                    series: [{
                        name: 'Counts',
                        data: counts
                    }]
                });
                
                 chart1.updateOptions({
                    series: counts,
                    labels: statenames
                });
                
                 dg_table.clear();
                dg_table.rows.add(dept); 
                dg_table.draw();
                
                
                
                let distwise = j.distPertain;
                //marc
                // if(distwisechart != undefined && chart_pie!= undefined ){
//                 if(distwise != null && distwise.length > 0){
                	const distwisestatenames = distwise.map(item => item.name11);
			const distwisecounts = distwise.map(item => item.count);
                
                distwisechart.updateOptions({
                    xaxis: {
                        categories: distwisestatenames
                    },
                    series: [{
                        name: 'Counts',
                        data: distwisecounts
                    }]
                });
                
                
                
                 chart_pie.updateOptions({
                    series: distwisecounts,
                    labels: distwisestatenames
                });
                // }
                
//                  marc
	// if(distPertainTable != undefined){
                let distPertainTable_data = j.distPertainTable;
                 distPertainTable.clear();
                distPertainTable.rows.add(distPertainTable_data); 
                distPertainTable.draw();
                // }
                
                
                let daywise = j.daywise;
                //marc
        //         if(daywise!= undefined && daywise != null && daywise.length > 0)
        //   {     
			 const ldSelect = document.getElementById('line-date-select');
			const lineYearSelect = document.getElementById('line-year');

            if(daywise!= undefined && daywise != null && daywise.length > 0)
                {  
			const matchingOption1 = ldSelect.querySelector(`option[value="${daywise[0].current_month}"]`);
			if (matchingOption1) {
				matchingOption1.selected = true;
			}

			const lineYearSelectOption = lineYearSelect.querySelector(`option[value="${daywise[0].current_year}"]`);
			if (lineYearSelectOption) {
				lineYearSelectOption.selected = true;
			}
        }

                const dstatenames = daywise.map(item => item.date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3-$2-$1').substring(0, 2));
			const dcounts = daywise.map(item => item.count);
                
                dchart.updateOptions({
                    xaxis: {
                        categories: dstatenames
                    },
                    series: [{
                        name: 'Counts',
                        data: dcounts
                    }]
                });
                // }
                
                  let overall = j.overall;
                  overall_table.clear();
                overall_table.rows.add(overall); 
                overall_table.draw();
                
                let mobileapp = j.mobileapp;
                let webapp = j.webapp;
                  if(mobileapp != undefined && mobileapp!=null && mobileapp.length>0 ){
					  $('#total_mac').html(mobileapp[0].total_c);
                    }
                    else{
                        $('#total_mac').html(0);
                    }
                const mastatenames = mobileapp.map(item => item.department);
			const macounts = mobileapp.map(item => item.count);

 machart.updateOptions({
                    xaxis: {
                        categories: mastatenames
                    },
                    series: [{
                        name: 'Counts',
                        data: macounts
                    }]
                });
                
                if(webapp != undefined && webapp!=null && webapp.length>0){
					$('#total_wac').html(webapp[0].total_c);
                }
                else{
                    $('#total_wac').html(0);
                }
                const wastatenames = webapp.map(item => item.department);
			const wacounts = webapp.map(item => item.count);
                 wachart.updateOptions({
                    xaxis: {
                        categories: wastatenames
                    },
                    series: [{
                        name: 'Counts',
                        data: wacounts
                    }]
                });
             
                
	}
	,error: function (xhr, status, error) {
						console.error(error);
					}
				});
			
		}