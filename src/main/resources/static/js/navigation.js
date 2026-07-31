var G_map;
var clipLayer;

$(document).ready(function () {

  

var G_jk = [75.3412, 33.5778];
             G_map = new ol.Map({
              // overlays: [overlay],
              target: "G_map",
              view: new ol.View({
                center: ol.proj.transform(G_jk, "EPSG:4326", "EPSG:3857"),
                zoom: 7.5,
              }),
              layers: [
                new ol.layer.Tile({
                visible: true,
                source: new ol.source.TileImage({
                  url: "http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                }),
                name: "MYL",
              })
            ]
            });

// Create a vector source to hold the selected point
var vectorSource = new ol.source.Vector();

// Create a vector layer to display the selected point
var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 8, // Radius of the circle
      fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.6)' }), // Blue fill with some transparency
      stroke: new ol.style.Stroke({ color: 'blue', width: 2 }) // Blue stroke
    })
  })
});

// Add the vector layer to the map
G_map.addLayer(vectorLayer);

// Add a click event listener to the map
G_map.on('singleclick', function(evt) {
  // Get the coordinates of the clicked point in EPSG:3857
  var coordinates = evt.coordinate;

  // Transform the coordinates to EPSG:4326 (latitude and longitude)
  var latLong = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');

  // Log the latitude and longitude
  console.log('Latitude: ' + latLong[1] + ', Longitude: ' + latLong[0]);

  $("#latLongDiv").show();
  var lat = $("#lat").html(latLong[1]);
  var long = $("#long").html(latLong[0]);


  // Clear previous features
  vectorSource.clear();

  // Create a new feature for the clicked point
  var feature = new ol.Feature({
    geometry: new ol.geom.Point(coordinates)
  });

  // Add the feature to the vector source
  vectorSource.addFeature(feature);
});


$('#G_map').hide();
getDistricts();
});
// -----------------------
var districtlist = [];
var talukalist = [];
var villagelist =[];
function getDistricts() {
  
  clip(G_map,"01",null,null,null);

  var d = JSON.stringify({
    code:'',
    type:'district'
  });
  var e_d = chkV(d);
  let j=getData("getNavigation?d="+e_d,"POST");
 
        var options = "";
        options += '<option value="0" disabled selected>District </option>';
        for (var i = 0; i < j.length; i++) {
         options += '<option value="' + j[i].district_c + '" >'+ j[i].name11 + '</option>';
         districtlist.push({ "districtcode": j[i].district_c, "minx": j[i].minx, "miny": j[i].miny, "maxx": j[i].maxx, "maxy": j[i].maxy });
     }
     $("select#district").html(options);
    }





    $("#district").change(function() {

    var selecteddistrictcode = $(this).children("option:selected").val();
   clip(G_map,null,selecteddistrictcode,null,null);
var s = districtlist.find(x => x.districtcode == selecteddistrictcode);
    var extent = [s.minx, s.miny, s.maxx, s.maxy];
      zoom(extent);
       
        var dist = JSON.stringify({
					code:selecteddistrictcode,
           type:'taluka'
				});
				var e_dist = chkV(dist);
        let j=getData("getNavigation?d="+e_dist,"POST");
    
          var options = ""; 
          options += '<option value="0" disabled selected>Taluka </option>'; 
          for (var i = 0; i < j.length; i++) { 
           options += '<option value="' + j[i].sdtcode11 + '" >' + j[i].name11 + '</option>'; 
               talukalist.push({ "talukacode": j[i].sdtcode11, "minx": j[i].minx, "miny": j[i].miny, "maxx": j[i].maxx, "maxy": j[i].maxy });
       }
  
       $("select#taluka").html(options);
       $("select#village").html("");
  
    });


    $("#taluka").change(function() {
      var selectedtalukacode = $(this).children("option:selected").val();
          clip(G_map,null,null,selectedtalukacode,null);
          var s = talukalist.find(x => x.talukacode == selectedtalukacode);
      var extent = [s.minx, s.miny, s.maxx, s.maxy];
      zoom(extent);

      var tal = JSON.stringify({
        code:selectedtalukacode,
         type:'village'
      });
      var e_tal = chkV(tal);

      let j=getData("getNavigation?d="+e_tal,"POST");
    
        var options = "";

        options += '<option value="0" disabled selected>Village </option>';

        for (var i = 0; i < j.length; i++) {

         options += '<option value="' + j[i].vil_2011 + '" >'
             + j[i].name11 + '</option>';

             villagelist.push({ "villagecode": j[i].vil_2011, "minx": j[i].minx, "miny": j[i].miny, "maxx": j[i].maxx, "maxy": j[i].maxy });


     }

     $("select#village").html(options);
     
    })


    $("#village").change(function() {
      var selectedvillagecode = $(this).children("option:selected").val();
        clip(G_map,null,null,null,selectedvillagecode);
      var s = villagelist.find(x => x.villagecode == selectedvillagecode);
      var extent = [s.minx, s.miny, s.maxx, s.maxy];
      zoom(extent);
    });




    function zoom(extent) {
        extent = ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
        G_map.getView().fit(extent), { duration: 200 };
        //map.getView().setZoom(3.0);
    }



function clip(map,sid,did,tid,vid)
{
	var jsondata=null;


		if(clipLayer!=null)
	 	{
 	 		clipLayer.getSource().clear();
		}
	if (did != null)
	{
    var data = JSON.stringify({
               column : 'district_c' ,
               code : did ,
        type:'geojson'
     });
     var e_data = chkV(data);
		jsondata=getData("getNavigation?d="+e_data,"POST");
	}
	else if(tid!=null)
	{
    var data = JSON.stringify({
               column : 'sdtcode11' ,
               code : tid ,
        type:'geojson'
     });
     var e_data = chkV(data);
     jsondata=getData("getNavigation?d="+e_data,"POST");
	}
	else if(vid!=null)
	{
    var data = JSON.stringify({
               column : 'vil_2011' ,
               code : vid ,
        type:'geojson'
     });
     var e_data = chkV(data);
     jsondata=getData("getNavigation?d="+e_data,"POST");
	}
	else
	{
    var data = JSON.stringify({
               column : 'stcode11' ,
               code : sid ,
        type:'geojson'
     });
     var e_data = chkV(data);
     jsondata=getData("getNavigation?d="+e_data,"POST");
	}
	
   	var jsonurl =JSON.parse(jsondata[0].st_asgeojson);
		
	var defaultStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(255, 255, 255, 0.0)'
  }),
  stroke: new ol.style.Stroke({
    color: '#0000ff',
    width: 4
  })
});
	 clipLayer = new ol.layer.Vector({
		  style: defaultStyle,
		  source: new ol.source.Vector({
			 // url: jsonurl,
			   // format: new ol.format.GeoJSON(),
			  features: (new ol.format.GeoJSON({
	              featureProjection: 'EPSG:3857',
	              dataProjection: 'EPSG:4326'
	            })).readFeatures(jsonurl)
		  })
		});
	//clipLayer.getSource().on('addfeature', function () {
		//Road.setExtent(clipLayer.getSource().getExtent());
		//	});
 map.addLayer(clipLayer);
	
	//clipLayer.getSource().on('addfeature', function () {
	//Road.setExtent(clipLayer.getSource().getExtent());
	//	});
}


function getData(url,method)
{
	var data1=null;

	$.ajax({
		url: url ,//'layergeojson',
		method: method, //'POST',
		//  data : { 'tableaa' : table},
		async: false,
//		contentType:"application/json;charset=utf-8",
		//	data:codobject,
		success:function(j)
		{
			
			data1=j;
		},
		error:function(error)
		{
			alert(error);
		}
	});
	return data1;
}