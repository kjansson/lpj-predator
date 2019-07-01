drawTimeLine();
//getSelectedYearURL();
getSelectedYear();
drawDatePicker();
drawMap();
drawKillList();
drawMemberList();
drawAnimalList();
drawOtherList();
drawTopTen();

var startyear;
var endyear;
var year;
var selected_hunter = null;
var selected_animal = null;
var map;
var heatmap;


function redrawAll()    {

        getSelectedYear();
//      getSelectedYearURL();
        drawMap();
        drawKillList();
        drawStatus();
        drawTimeLine();
        //drawMemberList();
        //drawAnimalList();
        drawTopTen();

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
        $.getJSON('lpjl/api', req, function(data)        {

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
		$("#vstatus")[0].innerHTML = "Vilt: Alla";
	}
	else	{

		var req = 'action=getspecies';

                $.getJSON('lpjl/api', req, function(data)        {

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

                $.getJSON('lpjl/api', req, function(data)        {

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

function drawDatePicker()	{

	//var start = getUrlParameter("startyear");
	var year = getUrlParameter("year");

	$("#yearpicker").empty();
	var req = 'action=getyears';
	$.getJSON('lpjl/api', req, function(data)        {
		var s = $('<select id="year" onchange="redrawAll()" />'); 

		var roof = 999;

		for(var val in data) 
		{    
			if(year == data[val].Name)	{
				$('<option />', {selected: "selected", value: data[val].Name, text: data[val].Name}).appendTo(s); 
				roof = val;
			}
			else	{
				if(typeof data[val+1] !== 'undefined')	{
					$('<option />', {value: data[val].Name, text: data[val].Name}).appendTo(s);
				}
				else	{
					$('<option />', {selected: "selected", value: data[val].Name, text: data[val].Name}).appendTo(s);
				}
			}
		} 
		s.appendTo('#yearpicker');

		//$('#yearpicker').append('<p class="special_binder_yearpicker"> till </p>');

		/*
		var s = $('<select id="endyear"/>');
		for(var val in data)
		{
			if(!end)	{
				if(roof == 999)	{
					if(data[val].Name == start)	{
						$('<option />', {selected: "selected", value: data[val].Name, text: data[val].Name}).appendTo(s);
					}
					else	{
						$('<option />', {value: data[val].Name, text: data[val].Name}).appendTo(s);
					}
				}
				else	{
					if(roof >= val)	{
						if(data[val].Name == start)     {
							$('<option />', {selected: "selected", value: data[val].Name, text: data[val].Name}).appendTo(s);
						}
						else    {
							$('<option />', {value: data[val].Name, text: data[val].Name}).appendTo(s);
						}
					}
				}
			}
			else	{
				if(roof == 999) {
                                        if(data[val].Name == end) {
                                                $('<option />', {selected: "selected", value: data[val].Name, text: data[val].Name}).appendTo(s);
                                        }
                                        else    {
                                                $('<option />', {value: data[val].Name, text: data[val].Name}).appendTo(s);
                                        }
                                }
                                else    {
                                        if(roof >= val) {
                                                if(data[val].Name == end)     {
                                                        $('<option />', {selected: "selected", value: data[val].Name, text: data[val].Name}).appendTo(s);
                                                }
                                                else    {
                                                        $('<option />', {value: data[val].Name, text: data[val].Name}).appendTo(s);
                                                }
                                        }
                                }
			}
		}
		s.appendTo('#yearpicker');
		*/
	});
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

                $.getJSON('lpjl/api', req, function(data)        {

                        data.forEach(function(animal)     {

				if (animal.Realname != "split")	{
					var li = document.createElement("li");
					var a = document.createElement("a");
					//a.href = "?species="+animal.Id
					a.href = "#";
					a.onclick = function(){selected_animal = animal.Id; redrawAll(); return false;};
					var info = document.createTextNode(animal.Realname);
					a.appendChild(info);
					li.appendChild(a);
					animalList.appendChild(li);
				}
                        });

                });
        }
}

function drawOtherList()       {
        var otherList = document.getElementById("otherlist");

        $("#otherlist").empty();
        if(otherList) {

                var li = document.createElement("li");
                var a = document.createElement("a");
                //a.href = "?species="+animal.Id
                a.href = "#";
                a.onclick = function(){selected_animal = "tot"; redrawAll(); return false;};
                var info = document.createTextNode("Totalt fällda");
                a.appendChild(info);
                li.appendChild(a);
                otherList.appendChild(li);

                var li = document.createElement("li");
                var a = document.createElement("a");
                a.href = "#";
                a.onclick = function(){selected_animal = "list"; redrawAll(); return false;};
                var info = document.createTextNode("Poänglista");
                a.appendChild(info);
                li.appendChild(a);
                otherList.appendChild(li);

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
		if(species && species != "tot")     {
			req = req.concat('&species=').concat(species);
	        }
		req = req.concat('&limit=10')
		if(year)	{
			req = req.concat('&year=').concat(year);
		}

		$.getJSON('lpjl/api', req, function(data)        {

			data.forEach(function(kill)	{

				if(kill.Animal.Realname != "split") {
					var p = document.createElement("p");
					var info = document.createTextNode(kill.Date+" - "+kill.Animal.Realname+" ("+kill.Q+") - "+kill.Location.Pass+" - "+kill.Hunter);
					p.appendChild(info)
					killList.appendChild(p);
				}
			});

		});
	}
}


function drawTopTen() {

        var topTen = document.getElementById("topTen");

	 $("#topTen").empty();

        if(topTen) {

//		var hunter = getUrlParameter('hunter');
//		var species = getUrlParameter('species');

		//if(!hunter && !species)	{
		// Nothing chosen. Show top ten list.
		if(selected_animal == null && selected_hunter == null)	{
			var h2 = document.createElement("h2");
                        var info = document.createTextNode("Topplista");
                        h2.appendChild(info)
                        topTen.appendChild(h2);

			var req = 'action=gettopten';
			if(year)        {
                        	req = req.concat('&year=').concat(year);
			}

			$.getJSON('lpjl/api', req, function(data)        {

				var place = 1
				data.forEach(function(scorer)     {
				
					if(scorer.Score != 0 && scorer.Name != "Ej medlem")	{

						var p = document.createElement("p");
						var info = document.createTextNode(place+": "+scorer.Name+" - "+scorer.Score+" poäng");
						p.appendChild(info)
						topTen.appendChild(p);
						place++
					}

				});
			});
		}
		// Just animal selected. Show toplist for animal.
		else if ((selected_animal != null && selected_animal != "tot" && selected_animal != "list") && selected_hunter == null)	{

                        var h2 = document.createElement("h2");
                        var info = document.createTextNode("Topplista");
                        h2.appendChild(info)
                        topTen.appendChild(h2);

                        var req = 'action=gettoptenforspecies';
                        if(year)        {
                                req = req.concat('&year=').concat(year);
                        }
			if(selected_animal)	{
				req = req.concat('&species=').concat(selected_animal);
			}

                        $.getJSON('lpjl/api', req, function(data)        {

                                var place = 1
                                data.forEach(function(scorer)     {

                                        //if(scorer.Score != 0 && scorer.Name != "Ej medlem")   {
                                        if(scorer.Score != 0)   {

                                                var p = document.createElement("p");
                                                var info = document.createTextNode(place+": "+scorer.Name+" - "+scorer.Score+" poäng");
                                                p.appendChild(info)
                                                topTen.appendChild(p);
                                                place++
                                       }

                                });
                        });
		}
		// Total selected. Show total kills overall.
		else if (selected_animal == null && selected_hunter != null)	{
	
			var h2 = document.createElement("h2");
                        var info = document.createTextNode("Totalt fällda");
                        h2.appendChild(info)
                        topTen.appendChild(h2);
			var req = 'action=gettotals';
			if(year)        {
                                req = req.concat('&year=').concat(year);
                        }

			//var hunter = getUrlParameter('hunter');
			//var species = getUrlParameter('species');

			

			if(selected_hunter)      {
				req = req.concat('&hunter=').concat(selected_hunter);
			}

			$.getJSON('lpjl/api', req, function(data)        {

				data.forEach(function(kill)     {

					if(kill.Animal != "split") {

						var p = document.createElement("p");
						var info = document.createTextNode(kill.Animal+" - "+kill.Q+"st");
						p.appendChild(info)
						topTen.appendChild(p);
					}
				});

                	});
		}
		// Total selected. Show total kills overall.
                else if (selected_animal == "tot")      {

                        var h2 = document.createElement("h2");
                        var info = document.createTextNode("Totalt fällda");
                        h2.appendChild(info)
                        topTen.appendChild(h2);
                        var req = 'action=gettotals';
                        if(year)        {
                                req = req.concat('&year=').concat(year);
                        }

                        //var hunter = getUrlParameter('hunter');
                        //var species = getUrlParameter('species');



                        if(selected_hunter)      {
                                req = req.concat('&hunter=').concat(selected_hunter);
                        }

                        $.getJSON('lpjl/api', req, function(data)        {

                                data.forEach(function(kill)     {
					if(kill.Animal != "split") {
                           	             var p = document.createElement("p");
                               		         var info = document.createTextNode(kill.Animal+" - "+kill.Q+"st");
                               	       		  p.appendChild(info)
                               		         topTen.appendChild(p);
					}
                                });

                        });
                }
		else if (selected_animal == "list")      {
			var h2 = document.createElement("h2");
                        var info = document.createTextNode("Aktuella poäng");
                        h2.appendChild(info)
                        topTen.appendChild(h2);
                        var req = 'action=getspecies';
                        $.getJSON('lpjl/api', req, function(data)        {

                                data.forEach(function(predator)     {

                                        var p = document.createElement("p");
                                        var info = document.createTextNode(predator.Realname+" - "+predator.Points+" poäng");
                                        p.appendChild(info)
                                        topTen.appendChild(p);
                                });

                        });
		}

        }
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
        $.getJSON('lpjl/api', req, function(data)        {

                var mapOptions = {
                        zoom: 12,
                        center:new google.maps.LatLng(59.418238, 15.505225),
                        mapTypeId: google.maps.MapTypeId.SATELLITE
                };

		if (!map)	{
                	map = new google.maps.Map(document.getElementById('map'), mapOptions);
		}
		else	{
			heatmap.setMap(null)
		}

                var gpoints = [];
                var i;
                var d = 0;
                $.each(data, function(points)   {
                        for(i = 1; i <= data[points]['Q']; i++) {
                                if(data[points]['Location']['Lat'] == '59.434308' && data[points]['Location']['Lon'] == '15.486962')    {
                                        if(d % 10 == 0) {
                                                gpoints.push(new google.maps.LatLng(data[points]['Location']['Lat'], data[points]['Location']['Lon']));
                                        }
                                        d++;
                                }
                                else    {
                                        gpoints.push(new google.maps.LatLng(data[points]['Location']['Lat'], data[points]['Location']['Lon']));
                                }
                        }
                });
                var pointArray = new google.maps.MVCArray(
                        gpoints
                );
                heatmap = new google.maps.visualization.HeatmapLayer({
                        data: pointArray,
			map: map
                });
                heatmap.set('radius', 35);
                heatmap.setMap(map);
        });
}

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
	url: '/lpjl/api',
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
