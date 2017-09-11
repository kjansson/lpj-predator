drawTimeLine();
//getSelectedYearURL();
getSelectedYear();
drawMap();

var startyear;
var endyear;
var year;
var selected_hunter = null;
var selected_animal = null;
var map;
var heatmap;


function redrawAll()    {

        getSelectedYear();
        drawMap();

}

function getSelectedYear()	{

	year = $('#year').val();

}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}


function getSelectedYearURL()	{

	//var start = document.getElementById("startyear");
	//var end = document.getElementById("endyear");
	//var start = $("#startyear");
	var year = $("#year");
	
	
	//if(start == end)	{
//		return null;
//	}

	var ustart;
	var uend;
	var req = 'action=getyear';
        $.getJSON('api', req, function(data)        {

		ustart = data.start;

	});	

}

function drawStatus()	{

	//if (typeof selected_hunter != 'undefined')	{
	if (!selected_hunter)	{
		$("#hstatus")[0].innerHTML = "Jägare: Alla";
	}
	else	{
		$("#hstatus")[0].innerHTML = "Jägare: "+selected_hunter;
	}

	//if (typeof selected_animal != 'undefined')     {
	if (!selected_animal)     {
		$("#hstatus")[0].innerHTML = "Jägare: Alla";
	}
	else	{

		var req = 'action=getspecies';

                $.getJSON('api', req, function(data)        {

                        data.forEach(function(animal)     {
				if(animal.Id == selected_animal)	{
					$("#vstatus")[0].innerHTML = "Vilt: "+animal.Realname;					
				}
                        });

                });
	}	

}

function drawMemberList()	{
	var memberList = document.getElementById("memberlist");
	$("#memberlist").empty();


	var li = document.createElement("li");
	var a = document.createElement("a")
	a.href = "#"
	a.onclick = function(){selected_hunter = null; redrawAll(); return false;};
	var info = document.createTextNode("Alla");
	a.appendChild(info);
	li.appendChild(a);
	memberList.appendChild(li);


        if(memberList) {
                var req = 'action=gethunters';

                $.getJSON('api', req, function(data)        {

                        data.forEach(function(hunter)     {
                                var li = document.createElement("li");
				var a = document.createElement("a")
				a.href = "#"
				a.id = hunter.Name;
				a.onclick = function(){selected_hunter = hunter.Name; redrawAll(); return false;}; 
                                var info = document.createTextNode(hunter.Name);
				a.appendChild(info);
				li.appendChild(a);
                                memberList.appendChild(li);
                        });
                });
        }
}

function drawAnimalList()       {
        var animalList = document.getElementById("animallist");

	$("#animallist").empty();
        if(animalList) {

		var li = document.createElement("li");
		var a = document.createElement("a");
		//a.href = "?species="+animal.Id
		a.href = "#";
		a.onclick = function(){selected_animal = null; redrawAll(); return false;};
		var info = document.createTextNode("Alla");
		a.appendChild(info);
		li.appendChild(a);
		animalList.appendChild(li);

                var req = 'action=getspecies';

                $.getJSON('api', req, function(data)        {

                        data.forEach(function(animal)     {
                                var li = document.createElement("li");
                                var a = document.createElement("a");
                                //a.href = "?species="+animal.Id
                                a.href = "#";
				a.onclick = function(){selected_animal = animal.Id; redrawAll(); return false;};
                                var info = document.createTextNode(animal.Realname);
                                a.appendChild(info);
                                li.appendChild(a);
                                animalList.appendChild(li);
                        });

                });
        }
}


function drawKillList()	{

	var killList = document.getElementById("killList");

	 $("#killList").empty();

	if(killList) {

		var h2 = document.createElement("h2");
		var info = document.createTextNode("Senast nedlagda");
		h2.appendChild(info)
		killList.appendChild(h2);

	        var req = 'action=getkills';
		//var hunter = getUrlParameter('hunter');
		var hunter = selected_hunter;
		//var species = getUrlParameter('species');
		var species = selected_animal;

		if(hunter)      {
			req = req.concat('&hunter=').concat(hunter);
		}
		if(species)     {
			req = req.concat('&species=').concat(species);
	        }
		req = req.concat('&limit=10')
		if(year)	{
			req = req.concat('&year=').concat(year);
		}

		$.getJSON('api', req, function(data)        {

			data.forEach(function(kill)	{
				var p = document.createElement("p");
				var info = document.createTextNode(kill.Date+" - "+kill.Animal.Realname+" ("+kill.Q+") - "+kill.Location.Pass+" - "+kill.Hunter);
				p.appendChild(info)
				killList.appendChild(p);
			});

		});
	}
}


function showContextMenu(caurrentLatLng  ) {
         var projection;
         var contextmenuDir;
         projection = map.getProjection() ;
         $('.contextmenu').remove();
          contextmenuDir = document.createElement("div");
           contextmenuDir.className  = 'contextmenu';
           contextmenuDir.innerHTML = '<a id="menu1"><div class="context">menu item 1<\/div><\/a>'
                                   + '<a id="menu2"><div class="context">menu item 2<\/div><\/a>';

         $(map.getDiv()).append(contextmenuDir);
      
         setMenuXY(caurrentLatLng);

         contextmenuDir.style.visibility = "visible";
}

function getCanvasXY(caurrentLatLng){
       var scale = Math.pow(2, map.getZoom());
      var nw = new google.maps.LatLng(
          map.getBounds().getNorthEast().lat(),
          map.getBounds().getSouthWest().lng()
      );
      var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
      var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
      var caurrentLatLngOffset = new google.maps.Point(
          Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
          Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
      );
      return caurrentLatLngOffset;
}

function setMenuXY(caurrentLatLng){
     var mapWidth = $('#map_canvas').width();
     var mapHeight = $('#map_canvas').height();
     var menuWidth = $('.contextmenu').width();
     var menuHeight = $('.contextmenu').height();
     var clickedPosition = getCanvasXY(caurrentLatLng);
     var x = clickedPosition.x ;
     var y = clickedPosition.y ;

      if((mapWidth - x ) < menuWidth)//if to close to the map border, decrease x position
          x = x - menuWidth;
     if((mapHeight - y ) < menuHeight)//if to close to the map border, decrease y position
         y = y - menuHeight;

     $('.contextmenu').css('left',x  );
     $('.contextmenu').css('top',y );
}

function drawMap() {

        var req = 'action=getkills';
 //       var hunter = getUrlParameter('hunter');
	var hunter = selected_hunter;
  //      var species = getUrlParameter('species');
	var species = selected_animal;

        if(hunter)      {
                req = req.concat('&hunter=').concat(hunter);
        }
        if(species)     {
                req = req.concat('&species=').concat(species);
        }
       	if(year)        {
		req = req.concat('&year=').concat(year);
	}

	req = req.concat('&limit=0')
        var test;
        $.getJSON('api', req, function(data)        {

                var mapOptions = {
                        zoom: 12,
                        center:new google.maps.LatLng(59.418238, 15.505225),
                        mapTypeId: google.maps.MapTypeId.SATELLITE
                };

		if (!map)	{
                	map = new google.maps.Map(document.getElementById('adminmap'), mapOptions);
			google.maps.event.addListener(map, "rightclick",function(event){showContextMenu(event.latLng);})
		}
		else	{
			//heatmap.setMap(null)
		}

                var gpoints = [];
                var i;
                var d = 0;
                $.each(data, function(points)   {
                        for(i = 1; i <= data[points]['Q']; i++) {
                                //        gpoints.push(new google.maps.LatLng(data[points]['Location']['Lat'], data[points]['Location']['Lon']));
				 marker = new google.maps.Marker({
		                  position: new google.maps.LatLng(data[points]['Location']['Lat'], data[points]['Location']['Lon']),
        		          map: map
                		});
                        }
                });
                var pointArray = new google.maps.MVCArray(
                        gpoints
                );
        //        heatmap = new google.maps.visualization.HeatmapLayer({
          //              data: pointArray,
	//		map: map
          //      });a
//		var marker = new google.maps.Marker({
//	          position: pointArray,
  //      	  map: map
//	        });		
   //             heatmap.set('radius', 35);
     //           heatmap.setMap(map);
        });
}
/*
function toggleHeatmap() {
	heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
	var gradient = [
		'rgba(0, 255, 255, 0)',
		'rgba(0, 255, 255, 1)',
		'rgba(0, 191, 255, 1)',
		'rgba(0, 127, 255, 1)',
		'rgba(0, 63, 255, 1)',
		'rgba(0, 0, 255, 1)',
		'rgba(0, 0, 223, 1)',
		'rgba(0, 0, 191, 1)',
		'rgba(0, 0, 159, 1)',
		'rgba(0, 0, 127, 1)',
		'rgba(63, 0, 91, 1)',
		'rgba(127, 0, 63, 1)',
		'rgba(191, 0, 31, 1)',
		'rgba(255, 0, 0, 1)'
	]
	heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
	heatmap.set('radius', heatmap.get('radius') ? null : 30);
}

function changeOpacity() {
	heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}
*/
function drawTimeLine()	{

        var req = 'action=gettimeline';
 //       var hunter = getUrlParameter('hunter');
   //     var species = getUrlParameter('species');
        var hunter = selected_hunter;
        var species = selected_animal;


        if(hunter)      {
                req = req.concat('&hunter=').concat(hunter);
        }
        if(species)     {
                req = req.concat('&species=').concat(species);
        }
        if(year)        {
                req = req.concat('&year=').concat(year);
        }
	req = req.concat('&limit=0')
	
	//$.getJSON('/api', req).done(function(data)        {

$.ajax({
	dataType: "json",
	url: '/api',
	data: req,
	success: drawTS
});




}

function drawTS(data, stat, obj)	{
		var index = 0

	

	var series = []

	for(i = 0; i < data.length; i++)      {
		series[i] = {name:data[i].Name, data:data[i].Data}
	}

//	var names = []
//	var tdata = [0,0,0,0,0,0,0,0,0,0,0,0]
//	var months = [new RegExp("\\d\\d-07-\\d\\d", "g"),new RegExp("\\d\\d-08-\\d\\d", "g"), new RegExp("\\d\\d-09-\\d\\d", "g"), new RegExp("\\d\\d-10-\\d\\d", "g"), new RegExp("\\d\\d-11-\\d\\d", "g"), new RegExp("\\d\\d-12-\\d\\d", "g"), new RegExp("\\d\\d-01-\\d\\d", "g"), new RegExp("\\d\\d-02-\\d\\d", "g"), new RegExp("\\d\\d-03-\\d\\d", "g"), new RegExp("\\d\\d-04-\\d\\d", "g"), new RegExp("\\d\\d-05-\\d\\d", "g"), new RegExp("\\d\\d-06-\\d\\d", "g")];
/*
		for(i = 0; i < data.length; i++)	{
		//a$.each(data, function(kill)     {
			if($.inArray(data[i].Animal.Realname, names) < 0)        {
				names[index] = data[i].Animal.Realname;
				series[index] = {name:data[i].Animal.Realname, data:tdata.slice()};
				index++;
			}
		}

		for(i = 0; i < months.length; i++)	{
			for(n = 0; n < data.length; n++)	{
				if(months[i].test(data[n].Date))	{
					series[names.indexOf(data[n].Animal.Realname)].data[i] += parseInt(data[n].Q)
				}
			}
		}
*/
	    $('#timelinechart').highcharts({
		title: {
		    text: 'Tidslinje över nedlagda vilt',
		    x: -20 //center
			},
			chart: {type: 'spline',
				events: {
					load: resize,
					afterPrin: resize
				},
				reflow: true,
				width: 1000
			},
			xAxis: {
			    categories: ['Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec',
				'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun']},
			yAxis: {
				allowDecimals: false,
			    title: {
				text: 'Nedlagda vilt'
			    },
			    plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			    }]},
			legend: {
			    layout: 'vertical',
			    align: 'right',
			    verticalAlign: 'middle',
			    borderWidth: 0},
			series: series
		    });

	//chart.reflow()


}

function resize()	{
	$(window).resize();
}
