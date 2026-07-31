var wmsurl190 = "../wmsurl/";
var cql = "geom is not null";
var mystyle=null;
var high_res;
var stateboundary = null;
var districtboundary = null;
var talukaboundary=null;
var village_boundary=null;
var grievancemaster = null;
var grievancemasterfilter = null;
var grievanceview = null;
var statusCategorywisestatus = "";
var status = "";
var heatmapLayer = null;
var createtableforfilter = null;
var openStatuses = ["Acknowledged","Appealed","dnpToOffice","Forwarded","Forwarded To CPGRAM","Pending","Under Process"];
var closedStatuses = ["Resolved", "Rejected"];
var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

var map = null;
let india = [82.191694, 22.8];
let jammu = [74.8022, 33.7782];

var map = new ol.Map({
  overlays: [overlay],
  target: "map",
  view: new ol.View({
    center: ol.proj.transform(india, "EPSG:4326", "EPSG:3857"),
//    zoom: 8.3,
    zoom: 4.9,
  }),
  layers: [],
});

$(document).ready(function (){
  cql = "geom is not null";
  showlayer(cql);
  $("#typeofmap").val("PAN");
});

function showlayer(cql) {
  high_res = new ol.layer.Tile({
    visible: false,
    source: new ol.source.TileImage({
      url: "http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    }),
    name: "High Resolution Image",
  });

  stateboundary = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "StateIndia",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: cql,
      },
    }),
    showLegend: true,
    name: "State Boundary",
    visible: true,
  });

  districtboundary = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "DistrictIndia",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: cql,
      },
    }),
    showLegend: true,
    maxResolution: 500,
    name: "District Boundary",
    visible: true,
  });

  talukaboundary = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "TalukaIndia",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: cql,
      },
    }),
    showLegend: true,
    maxResolution: 100,
    name: "Taluka Boundary",
    visible: true,
  });

  village_boundary = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "VillageIndia",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: cql,
      },
    }),
    showLegend: true,
    maxResolution: 100,
    name: "Village Boundary",
    visible: true,
  });

  grievanceview = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "view_grievance",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: cql,
      },
    }),
    showLegend: false,
    visible: false,
    name: "view_grievance",
  });

  grievancemaster = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "grievance_master",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: "geom is not null and location_flag is not null",
      },
    }),
    showLegend: true,
    name: "Grievance",
    visible: true,
  });

  map.addLayer(high_res);
  map.addLayer(stateboundary);
  map.addLayer(districtboundary);
  map.addLayer(talukaboundary);
  map.addLayer(village_boundary);
  map.addLayer(grievanceview);
  map.addLayer(grievancemaster);
  legendnew();
}

function legendnew(){
  map.getLayers().forEach(function (layer, i) {
    if(layer.get("name")!="High Resolution Image"){
      var layername = layer.getSource().getParams().LAYERS;
      var elements = $();
      var img =
        '<img id="' +
        layername +
        'legend" class="legendimg"' +
        'src="' +
        wmsurl190 +
        "?REQUEST=GetLegendGraphic&sld_version=1.0.0&" +
        "layer=" +
        layername +
        "&format= image/png" +
        "&legend_options=fontSize:13;fontName:san-sarif;bgColor:0xffffff;forceLabels:on" +
        '&WIDTH=15&HEIGHT=15&transparent=true&Scale=2" /><br>';
      elements = elements.add("<li>" + img + "</li>");
      $("#legend").append(img);
    }
  });
}

$(".maptype").click(function () {
  $("#layer1-checkbox").prop("checked", true);
  $("#layer2-checkbox").prop("checked", false);
  $("#layer3-checkbox").prop("checked", false);
  $("#myCheckbox").prop("checked", false);

  cql = "geom is not null";

  if (this.value == "jk") {
    let jk = [75.3412, 33.5778];
    map.getView().setCenter(ol.proj.transform(jk, "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(8);
    $("#typeofmap").val("JK");
  } else {
    map.getView().setCenter(ol.proj.transform(india, "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(4.8);
    $("#typeofmap").val("PAN");
  }

  map.removeLayer(grievancemasterfilter);
  map.removeLayer(stateboundary);
  map.removeLayer(districtboundary);
  map.removeLayer(talukaboundary);
  map.removeLayer(village_boundary);
  map.removeLayer(grievancemaster);
  map.removeLayer(grievanceview);  
  map.removeLayer(high_res);    
  map.removeLayer(heatmapLayer);
  map.removeLayer(createtableforfilter);
  
  $("#view_grievancelegend").hide();
  
  overlay.setPosition(undefined);
  closer.blur();
  $('.heatmapTbl').addClass('d-none');

  showlayer(cql);
});

clickEvent = (evt) => {
  map.getLayers().forEach(function (layer, i) {
    var count = 0;
    if (layer.getVisible() == true) {
      var coordinate = evt.coordinate;
      var resolution = map.getView().getResolution();
      var projection = "EPSG:3857";
      var infoFormat = "application/json";

      if (layer.get("name") == "view_grievance") {
        var url = layer
          .getSource()
          .getFeatureInfoUrl(coordinate, resolution, projection, {
            INFO_FORMAT: infoFormat,
          });

        $.get(url, function (response) {
          response = JSON.parse(response);
          if (response.features[0]) {
            $('.heatmapTbl').removeClass('d-none');
            const a = response.features[0].properties;
            if (response.features[0].id.includes("view_grievance")) {
              grievancetable(a.grievanceid);
              count = a.count;
            }
          }
          else{
            $('.heatmapTbl').addClass('d-none');
          }
        });
      }
   
      if (layer.get("name") == "Grievance") {
        identifcontent(evt, layer, count);
      }
    }
  });
};
map.on("singleclick", clickEvent);

function identifcontent(evt, layer, count) {
  var coordinate = evt.coordinate;
  var resolution = map.getView().getResolution();
  var projection = "EPSG:3857";
  var infoFormat = "application/json";

  var url = layer
    .getSource()
    .getFeatureInfoUrl(coordinate, resolution, projection, {
      INFO_FORMAT: infoFormat,
      FEATURE_COUNT: 100,
    });
  $.get(url, function (response) {
    response = JSON.parse(response);
    if (response.features[0]) {
      var card =
        '<div  style="overflow-y: auto; max-height: calc(100vh - 99px);"><span class="record-title">No of Records: ' +
        response.numberReturned +
        " </span> ";
      if (response.features[0].id.includes("grievance_master")) {
        for (i = 0; i < response.numberReturned; i++) {
          const a = response.features[i].properties;
          card +=
            '<div class="mt-2 card"><div class="card-header"><h5 class="fw-bold mb-0" >Grievance Information</h5></div><div class="card-body"><table class="table table-striped table-bordered mb-0">' +
			'<tr><td style="color:green;">Grievance ID &nbsp;</td>' +
			'<td style="color:black">' +
			   '<a href="#" onclick="postGrievance(\'' + a.uniqid + '\',\'' + a.mobileno + '\'); return false;">' + a.uniqid + '</a>' +
			'</td></tr>'+
            '<tr><td style="color:green;">Name &nbsp;</td><td style="color:black"> ' +
            a.name +
            "</td></tr>" +
            '<tr><td style="color:green;">Category &nbsp;</td><td style="color:black"> ' +
            a.category +
            "</td></tr>" +
            '<tr><td style="color:green;">Department &nbsp;</td><td style="color:black"> ' +
            a.department +
            "</td></tr>" +
            '<tr><td style="color:green;">Status &nbsp;</td><td style="color:black"> ' +
            a.status +
            "</td></tr>" +
            '<tr><td style="color:green;">Remark &nbsp;</td><td style="color:black"> ' +
            a.remark +
            "</td></tr>" +
            '<tr><td style="color:green;">Description &nbsp;</td><td style="color:black"> ' +
            a.description +
            "</td></tr>";
          card += "</table></div></div>";
        }
        card += "</div>";
      }
      content.innerHTML = card;
      overlay.setPosition(evt.coordinate);
    }
    else{
      overlay.setPosition(undefined);
      closer.blur();
    }
  });
}

function grievancetable(grievanceid) {
  let cqlfilter = "";

  if ($.fn.DataTable.isDataTable("#grievancetable")) {
    $("#grievancetable").dataTable().fnDestroy();
    $("#grievancetable").empty();
  }

  $(".btnHeat-customBtn").on("click", function () {
    table155.button("." + $(this).val()).trigger();
  });

  var table155 = $("#grievancetable").DataTable({
    lengthMenu: [
      [10, 25, 50, 100, -1],
      [10, 25, 50, 100, "All"],
    ],
    buttons: [
      {
        extend: "excel",
        title: "JKGOVT",
        messageTop: "The information in this table is copyright to JK GOVT.",
        exportOptions: {
          columns: ":not(.noExport)",
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)",
        },
      },
    ],
    paging: true,
    pageLength: 10,
    searching: true,
    responsive: true,
    ajax: {
      url: "/JKSv2Geo/getgrievancedetails",
      type: "POST",
      contentType: "application/json",
      data: function (d) {
        d.cqlfilter = cqlfilter;
        d.grievanceid = grievanceid;
        d.search = $("#grievancetable_filter input").val();
        return JSON.stringify(d);
      },
    },
    serverSide: true,
    processing: true,
    columns: [
      {
        data: null,
        title: "Sr No",
        render: function (data, type, row, meta) {
          var adjustedIndex = meta.row + 1 + meta.settings._iDisplayStart;
          return adjustedIndex;
        },
      },
      { title: "Grievance ID", data: "uniqid" },
      { title: "Name", data: "name" },
      { title: "Gender", data: "gender" },
      { title: "Mobile", data: "mobile" },
      { title: "Email", data: "submitted_by" },
      { title: "Category", data: "category" },
      { title: "Department", data: "department" },
      { title: "Address", data: "address" },
      { title: "Status", data: "status" },
      { title: "Remark", data: "remark" },
    ],
  });
  $('html, body').animate({
          scrollTop: $('.heatmap-table').offset().top - 500
      }, 1000); 
}
var checkedValuesdep = [];
var checkedValuescat = [];
var selectedStatus = "";
$('input[name="listofdepart"]').on("change", function () {
  checkedValuescat = [];
  $("#departmentlist").val("");
  $("#categorylist").val("");
  $("#category").show();

  if ($(this).is(":checked")) {
    checkedValuesdep.push("'" + $(this).val() + "'");
  } else {
    checkedValuesdep = checkedValuesdep.filter(
      (value) => value !== "'" + $(this).val() + "'"
    );
  }

  $("#departmentlist").val(checkedValuesdep.join());

  var c = JSON.stringify({
    value: checkedValuesdep.join(),
  });
  var d = chkV(c);
  var settings = {
    url: "/JKSv2Geo/categorybydepart?d=" + d,
    method: "POST",
    timeout: 0,
  };
  $.ajax(settings).done(function (j) {
    j = setV(j);
    j = JSON.parse(j);
    if (j.statusCode == "1") {
      var append = "";
      for (var i = 0; i < j.data.length; i++) {
        append +=
          '<li ><input class="form-check-input" name="listofcat" value="' +
          j.data[i].values +
          '" type="checkbox"> <p>' +
          j.data[i].values +
          "</p></li>";
      }
      $("#categoryli").html(append);
    }
  });
});
$(document).on("change", 'input[name="listofcat"]', function () {
  $("#categorylist").val("");
  if ($(this).is(":checked")) {
    checkedValuescat.push("'" + $(this).val() + "'");
  } else {
    checkedValuescat = checkedValuescat.filter(
      (value) => value !== "'" + $(this).val() + "'"
    );
  }
  $("#categorylist").val(checkedValuescat.join());
});
$(document).on("change", 'input[name="status"], select[name="status"]', function () {
  selectedStatus = $(this).val();
});
$("#Filter").click(function () {
  var dateFrom = $("#dateFrom").val();
  var dateTo = $("#dateTo").val();
  var depName = $("#departmentlist").val();
  var categ = $("#categorylist").val();
  var status = selectedStatus || $('input[name="status"]:checked').val() || $('select[name="status"]').val();
  
  let cqlfilter = " geom is not null and location_flag is not null ";

  if (depName != "" && depName != "0") {
    cqlfilter += " and department IN (" + depName + ")";
  }
  
  if (categ != "" && categ != "0") {
    cqlfilter += " and category IN (" + categ + ")";
  }
  if (status != "" && status != "0" && status != undefined) {
    cqlfilter += " and status = '" + status + "'";
  }

  if (dateFrom != "" && dateFrom != "0" && dateTo != "" && dateTo != "0") {
    cqlfilter += " and (createddate >= '" + dateFrom + "' and createddate <= '" + dateTo + "')";
  }

  $("#cqlfilter").val(cqlfilter);

  overlay.setPosition(undefined);
  closer.blur();
  $('.heatmapTbl').addClass('d-none');

  static_layers(cqlfilter);
});
function static_layers(cqlfilter) {
  grievancemaster.setVisible(false);
  $("#layer1-checkbox").prop("checked", false);
  grievanceview.setVisible(false);
  $("#layer2-checkbox").prop("checked", false);
  $("#view_grievancelegend").hide();
  
  map.removeLayer(grievancemasterfilter);
  
  grievancemasterfilter = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "grievance_master",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: cqlfilter,
      },
    }),
    showLegend: true,
    name: "Grievance",
    visible: true,
  });
  map.addLayer(grievancemasterfilter);
}
function static_layers_heatmap(filter, style, status) {
  const openStatuses = ["Acknowledged","Appealed","dnpToOffice","Forwarded","Forwarded To CPGRAM","Pending","Under Process"];
  const closedStatuses = ["Resolved", "Rejected"];
  
  if (status && status !== "" && status !== "0") {
    if (openStatuses.includes(status))
	{
      filter += " and status = '" + status + "'";
    } else if (closedStatuses.includes(status)) {
      filter += " and status = '" + status + "'";
    } else {
      filter += " and status = '" + status + "'";
    }
  }
  
  grievancemaster.setVisible(false);
  $("#layer1-checkbox").prop("checked", false);
  grievanceview.setVisible(false);
  $("#layer2-checkbox").prop("checked", false);
  $("#view_grievancelegend").hide();
  
  map.removeLayer(grievancemasterfilter);
  
  grievancemasterfilter = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: wmsurl190,
      tiled: "true",
      params: {
        LAYERS: "grievance_master",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: filter,
        STYLES: style
      },
    }),
    showLegend: true,
    name: "Grievance",
    visible: true,
  });
  map.addLayer(grievancemasterfilter);
  $("#view_grievancelegend").show();
}
function dynmic_data_count(title, filter, status) {
  const openStatuses = ["Acknowledged","Appealed","dnpToOffice","Forwarded","Forwarded To CPGRAM","Pending","Under Process" ];
  const closedStatuses = ["Resolved", "Rejected"];
  if (status && status !== "" && status !== "0") {
    if (openStatuses.includes(status)) {
      filter += " and status = '" + status + "'";
    } else if (closedStatuses.includes(status)) {
      filter += " and status = '" + status + "'";
    } else {
      filter += " and status = '" + status + "'";
    }
  }
  var data = null;
  var cnt = null;
  
  $.ajax({
    url: "/JKSv2Geo/mastercall",
    method: "POST",
    dataType: "json",
    async: false,
    data: { whr: filter },
    success: function(j) {
      data = j;
      cnt = j.length;
    },
    error: function(error) {
      console.error("Error fetching data:", error);
    }
  });

  $("#titleshow").html("Total Data := " + cnt);
}
$("#reset").click(function () {
  location.reload();
});
document.getElementById("layer1-checkbox").addEventListener("change", (event) => {
  grievancemaster.setVisible(event.target.checked);
  if (event.target.checked) {
    $("#" + grievancemaster.getSource().getParams().LAYERS + "legend").show();
  } else {
    $("#" + grievancemaster.getSource().getParams().LAYERS + "legend").hide();
    overlay.setPosition(undefined);
    closer.blur();
  }
});

document.getElementById("layer2-checkbox").addEventListener("change", (event) => {
  grievanceview.setVisible(event.target.checked);
  if (event.target.checked) {
    $("#" + grievanceview.getSource().getParams().LAYERS + "legend").show();
  } else {
    $("#" + grievanceview.getSource().getParams().LAYERS + "legend").hide();
    $('.heatmapTbl').addClass('d-none');
  }
});

function checkStatus() {
  var checkbox = document.getElementById("myCheckbox");
  if (checkbox.checked) {
    high_res.setVisible(true);
  } else {
    high_res.setVisible(false);
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSelectedValuesforHeatMap() {
    const state = document.getElementById("stateSelect").value;
    const district = document.getElementById("districtSelect")?.value || '';
    const status = document.getElementById("statusSelect").value;
    const category = document.getElementById("categorySelect")?.value || '';
    const statusCategory = document.getElementById("statuscategorySelect")?.value || '';

    const selectedDepartments = Array.from(
        document.querySelectorAll('input[name="listofdepart"]:checked')
    ).map(cb => cb.value);

    const uploadMode = document.querySelector('input[name="upload_mode"]:checked')?.value || '';
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;

    let filters = [];
    let mystyle = "grievance_master";
    const openStatuses = ["Acknowledged","Appealed","dnpToOffice","Forwarded","Forwarded To CPGRAM","Pending","Under Process"];
    const closedStatuses = ["Resolved", "Rejected"];

    if (state)
	{
        filters.push(`stname='${state}'`);
    }

    if (district) {
        filters.push(`district='${district}'`);
        zoom_by_latlon(district);
    }

    // Fixed status filtering logic
    if (status && status !== "") {
        // Individual status takes priority
        filters.push(`status='${status}'`);
    } else if (statusCategory && statusCategory !== "") {
        // Fall back to status category if no individual status is selected
        if (statusCategory === "Open") {
            const statusCategorywisestatus = `status IN (${openStatuses.map(s => `'${s}'`).join(",")})`;
            filters.push(statusCategorywisestatus);
        } else if (statusCategory === "Closed") {
            const statusCategorywisestatus = `status IN (${closedStatuses.map(s => `'${s}'`).join(",")})`;
            filters.push(statusCategorywisestatus);
        }
    }

    if (category) {
        filters.push(`category='${category}'`);
    }

    if (selectedDepartments.length > 0) {
        const depts = selectedDepartments.map(d => `'${d}'`).join(",");
        filters.push(`department IN (${depts})`);
    }

    if (uploadMode === "webapp") {
        filters.push(`application='webapp'`);
    } else if (uploadMode === "mobileapp") {
        filters.push(`application='mobileapp'`);
    }

    if (dateFrom) {
        filters.push(`createddate >= '${dateFrom}'`);
    }

    if (dateTo) {
        filters.push(`createddate <= '${dateTo}'`);
    }

    const cqlFilter = filters.length > 0 ? filters.join(" AND ") : "";

    const v = 1;

    // Debug logs (remove these in production)
    console.log("Status:", status);
    console.log("Status Category:", statusCategory);
    console.log("Final CQL Filter:", cqlFilter);

    if (cqlFilter) {
        static_layers_heatmap(cqlFilter, mystyle);
        dynmic_data_count(v, cqlFilter);
    }

    return {
        state,
        district,
        status,
        category,
        departments: selectedDepartments,
        uploadMode,
        dateFrom,
        dateTo
    };
}

const statuses = ["Acknowledged","Appealed","dnpToOffice","Forwarded","Forwarded To CPGRAM","Pending","Rejected","Resolved","Under Process"];
statuses.forEach(status => {});

function zoom_by_latlon(districtName) {
		$.ajax({
			type: 'POST',
			url: '/JKSv2Geo/getExtent',
			data: { districtName: districtName },
			success: function (r) {
				var coordMin = ol.proj.fromLonLat([r[0].minx, r[0].miny], 'EPSG:3857', 'EPSG:4326');
				var coordMax = ol.proj.fromLonLat([r[0].maxx, r[0].maxy], 'EPSG:3857', 'EPSG:4326');
				var extent = [coordMin[0], coordMin[1], coordMax[0], coordMax[1]];
				map.getView().fit(extent, { size: map.getSize() });
				     map.getView().setZoom(10.1);
			},
		});
}

function updateStatusOptions() {
	var openStatuses = ["Acknowledged","Appealed","dnpToOffice","Forwarded","Forwarded To CPGRAM","Pending","Under Process"];
	 var closedStatuses = ["Resolved", "Rejected"];
	 
  const category = document.getElementById('statuscategorySelect').value;
  const statusSelect = document.getElementById('statusSelect');
 
  statusSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.text = '-- Select Status --';
  statusSelect.appendChild(defaultOption);
  let options = [];
  if(category === 'Open')
	{
    options = openStatuses;
  }
  else if (category === 'Closed') {
    options = closedStatuses;
  }
  options.forEach(status => {
    const opt = document.createElement('option');
    opt.value = status;
    opt.text = status;
    statusSelect.appendChild(opt);
  });
  getSelectedValuesforHeatMap();
}

function postGrievance(d,mobile)
{
	//d = chkV(d);
	//window.open("grievanceDatail_Dmap?d=" + d, "_blank");
	
	var c = JSON.stringify({
	   radioVal: "JKSAMADHAN",
	   gId: d,
	   mobile: mobile,
	 });
	 var rak = chkV(c);

	 // window.location.href = "historyGrievance?d=" + d;
	 window.open('grievanceDatail?d=' + rak, '_blank');
}

function legend(m)
{
 let map=m;
  map.getLayers().forEach(function (grouplayers) {
   var elements = $();
   grouplayers.getLayers().forEach(function (layer) { 
	     if(layer.getVisible()==true)
	     {  
	    	console.log(layer)
	    	try
			{
	      var layername=layer.getSource().getParams().LAYERS;
//	    	alert(layername)
	     } catch (error) {}
	      var myImage ='<img id="'+layername+'" class="legendimg"'
	      +'src="'+wmsurl+'?REQUEST=GetLegendGraphic&sld_version=1.0.0&'
	      +'layer='+layername+'&format= image/png' 		  
	      +'&legend_options=fontSize:13;fontName:san-sarif;bgColor:0xffffff;forceLabels:on' 
	      + '&WIDTH=15&HEIGHT=15&transparent=true&Scale=2" />';
	     elements = elements.add('<li>'+ myImage +'</li>');     
         }
     });   
     $('#legend ul').append(elements);
	 $('#view_grievancelegend').show();      
	 
   });
}

//Latest Code --10062025