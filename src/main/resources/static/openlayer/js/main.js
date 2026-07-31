var wmsurl190 = "../wmsurl/";
var cql = "geom is not null";

var high_res;
var stateboundary = null;
var districtboundary = null;
var talukaboundary=null;
var village_boundary=null;
var grievancemaster = null;
var grievancemasterfilter = null;
var grievanceview = null;
//var distPertain = null;

var heatmapLayer = null;
var createtableforfilter = null;


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
var map = new ol.Map({
  overlays: [overlay],
  target: "map",
  view: new ol.View({
    center: ol.proj.transform(india, "EPSG:4326", "EPSG:3857"),
    zoom: 4.8,
  }),
  layers: [],
});


$(document).ready(function () {
  cql = "geom is not null";
  showlayer(cql);
  $("#typeofmap").val("PAN");
  map.getLayers().forEach(function (layer, i) {
   if(layer.get("name") == "view_grievance"){
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
      //  $("#legend").append(img);
       $("#view_grievancelegend").hide();
    }
  });   
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
      // crossOrigin: 'anonymous',
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
      // crossOrigin: 'anonymous',
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
      // crossOrigin: 'anonymous',
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
      // crossOrigin: 'anonymous',
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
      // // crossOrigin: 'anonymous',
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
      // crossOrigin: 'anonymous',
      tiled: "true",
      params: {
        LAYERS: "grievance_master",
        version: "1.1.1",
        format_options: "dpi:110",
        CQL_FILTER: "geom is not null and location_flag is not null", //cql,
      },
    }),
    showLegend: true,
    name: "Grievance",
    visible: true,
  });

//  distPertain = new ol.layer.Tile({
//    source: new ol.source.TileWMS({
//      url: wmsurl190,
//      // crossOrigin: 'anonymous',
//      tiled: "true",
//      params: {
//        LAYERS: "district_pertain",
//        version: "1.1.1",
//        format_options: "dpi:110",
//        CQL_FILTER: cql,
//      },
//    }),
//    showLegend: false,
//    name: "district_pertain",
//    visible: false,
//  });

  map.addLayer(high_res);
  map.addLayer(stateboundary);
  map.addLayer(districtboundary);
  map.addLayer(talukaboundary);
  map.addLayer(village_boundary);
  map.addLayer(grievanceview);
  map.addLayer(grievancemaster);
//  map.addLayer(distPertain);
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
    // cql = "stcode11 = '01' AND geom is not null";
  } else {
    map
      .getView()
      .setCenter(ol.proj.transform(india, "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(4.8);
    $("#typeofmap").val("PAN");
    // cql = "geom is not null";
  }

  map.removeLayer(grievancemasterfilter);
  map.removeLayer(stateboundary);
  map.removeLayer(districtboundary);
  map.removeLayer(talukaboundary);
  map.removeLayer(village_boundary);
  map.removeLayer(grievancemaster);
  map.removeLayer(grievanceview);  
//  map.removeLayer(distPertain);
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
      FEATURE_COUNT: 100, // retrieve 10 features
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
            '<tr><td style="color:green;">Grievance ID &nbsp;</td><td style="color:black"> ' +
            a.uniqid +
            "</td></tr>" +
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

  let cqlfilter = ""; //document.getElementById("cqlfilter").value;

  if ($.fn.DataTable.isDataTable("#grievancetable")) {
    $("#grievancetable").dataTable().fnDestroy();
    $("#grievancetable").empty();
  }

  $(".btnHeat-customBtn").on("click", function () {
    table155.button("." + $(this).val()).trigger();
  });

  var table155 = $("#grievancetable").DataTable({
    //dom: 'frtip',
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
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
      {
        extend: "pdf",
        title: "JKGOVT",
        messageBottom: "The information in this table is copyright to JK GOVT.",
        pageSize: "A4",
        download: "open",
        customize: function (doc) {
          // Set the page orientation and size
          doc.pageSize = "A4";
          doc.pageOrientation = "landscape";

          // Adjust the content styling
          doc.styles.tableHeader.fontSize = 8;
          doc.styles.tableBodyOdd.fontSize = 8;
          doc.styles.tableBodyEven.fontSize = 8;

          // Center the table content
          var rowCount = doc.content[1].table.body.length;
          for (var i = 0; i < rowCount; i++) {
            var row = doc.content[1].table.body[i];
            for (var j = 0; j < row.length; j++) {
              row[j].alignment = "center";
            }
          }

          // Scale the table width to fit the page
          var totalColumns = doc.content[1].table.body[0].length;
          var columnWidths = [];
          for (var i = 0; i < totalColumns; i++) {
            columnWidths.push("*");
          }
          doc.content[1].table.widths = columnWidths;
        },
        exportOptions: {
          columns: ":not(.noExport)", // Exclude columns with the class 'noExport'
        },
      },
    ],
    paging: true,
    pageLength: 10,
    searching: true,
    responsive: true,
    ajax: {
      url: "getgrievancedetails",
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
      // { title: "Description", data: "description" },
    ],
  });
  $('html, body').animate({
          scrollTop: $('.heatmap-table').offset().top - 500
      }, 1000); 
}







var checkedValuesdep = [];
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
    url: "categorybydepart?d=" + d,
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


var checkedValuescat = [];
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
$("#Filter").click(function () {
  var dateFrom = $("#dateFrom").val();
  var dateTo = $("#dateTo").val();
  var depName = $("#departmentlist").val();
  var categ = $("#categorylist").val();
  let cqlfilter = " geom is not null and location_flag is not null ";

  if (depName != "" && depName != "0") {
    cqlfilter += " and department IN (" + depName + ")";
  }
  if (categ != "" && categ != "0") {
    if (cqlfilter != "") cqlfilter += " and category IN (" + categ + ")";
    else cqlfilter += " and  category IN (" + categ + ")";
  }

  if (dateFrom != "" && dateFrom != "0" && dateTo != "" && dateTo != "0") {
    if (cqlfilter != "")
      cqlfilter +=
        " and (createddate >= '" +
        dateFrom +
        "' and createddate  <= '" +
        dateTo +
        "')";
    else
      cqlfilter +=
        "  and (createddate >= '" +
        dateFrom +
        "' and createddate  <= '" +
        dateTo +
        "')";
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
      // crossOrigin: 'anonymous',
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

$("#reset").click(function () {
  location.reload();
});






// Create the layer panel
const layerPanel = document.getElementById("layer-panel");

// Add event listeners to the checkboxes
document
  .getElementById("layer1-checkbox")
  .addEventListener("change", (event) => {
    // map.addLayer(grievancemaster);
    grievancemaster.setVisible(event.target.checked);
    if (event.target.checked) {
      $("#" + grievancemaster.getSource().getParams().LAYERS + "legend").show();
    } else {
      $("#" + grievancemaster.getSource().getParams().LAYERS + "legend").hide();
      overlay.setPosition(undefined);
      closer.blur();
    }
  });
document
  .getElementById("layer2-checkbox")
  .addEventListener("change", (event) => {
    // map.addLayer(grievanceview);
    grievanceview.setVisible(event.target.checked);
    if (event.target.checked) {
      $("#" + grievanceview.getSource().getParams().LAYERS + "legend").show();
    } else {
      $("#" + grievanceview.getSource().getParams().LAYERS + "legend").hide();
      $('.heatmapTbl').addClass('d-none');
    }
  });
//  document
//  .getElementById("layer3-checkbox")
//  .addEventListener("change", (event) => {
//    // map.addLayer(grievanceview);
//    distPertain.setVisible(event.target.checked);
//    if (event.target.checked) {
//      $("#" + distPertain.getSource().getParams().LAYERS + "legend").show();
//    } else {
//      $("#" + distPertain.getSource().getParams().LAYERS + "legend").hide();
//    }
//  });
function checkStatus() {
  var checkbox = document.getElementById("myCheckbox");
  if (checkbox.checked) {
    high_res.setVisible(true);
  } else {
    high_res.setVisible(false);
  }
}



