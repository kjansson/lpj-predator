drawTimeLine();
drawMap();
drawKillList();
drawMemberList();
drawAnimalList();
drawTopTen();

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

function drawMemberList()	{
	var memberList = document.getElementById("memberlist");

        if(memberList) {
                var req = 'action=gethunters';

                $.getJSON('api', req, function(data)        {

                        data.forEach(function(hunter)     {
                                var li = document.createElement("li");
				var a = document.createElement("a")
				a.href = "?hunter="+hunter.Name
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

        if(animalList) {
                var req = 'action=getspecies';

                $.getJSON('api', req, function(data)        {

                        data.forEach(function(animal)     {
                                var li = document.createElement("li");
                                var a = document.createElement("a")
                                a.href = "?species="+animal.Id
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

	if(killList) {
	        var req = 'action=getkills';
		var hunter = getUrlParameter('hunter');
		var species = getUrlParameter('species');

		if(hunter)      {
			req = req.concat('&hunter=').concat(hunter);
		}
		if(species)     {
			req = req.concat('&species=').concat(species);
	        }
		req = req.concat('&limit=10')

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


function drawTopTen() {

        var topTen = document.getElementById("topTen");

        if(topTen) {

		var hunter = getUrlParameter('hunter');
		var species = getUrlParameter('species');

		if(!hunter && !species)	{
			var h2 = document.createElement("h2");
                        var info = document.createTextNode("Topplista");
                        h2.appendChild(info)
                        topTen.appendChild(h2);

			var req = 'action=gettopten';
			$.getJSON('api', req, function(data)        {

				var place = 1
				data.forEach(function(scorer)     {
				
					if(scorer.Score != 0)	{

						var p = document.createElement("p");
						var info = document.createTextNode(place+": "+scorer.Name+" - "+scorer.Score+" poäng");
						p.appendChild(info)
						topTen.appendChild(p);
						place++
					}

				});
			});
		}
		else	{
	
			var h2 = document.createElement("h2");
                        var info = document.createTextNode("Totalt fällda");
                        h2.appendChild(info)
                        topTen.appendChild(h2);
			var req = 'action=gettotals';
			var hunter = getUrlParameter('hunter');
			var species = getUrlParameter('species');

			

			if(hunter)      {
				req = req.concat('&hunter=').concat(hunter);
			}
	                if(species)     {
         	               req = req.concat('&species=').concat(species);
	                }

			$.getJSON('api', req, function(data)        {

				data.forEach(function(kill)     {

					var p = document.createElement("p");
					var info = document.createTextNode(kill.Animal+" - "+kill.Q+"st");
					p.appendChild(info)
					topTen.appendChild(p);
				});

                	});
		}
        }
}



function drawMap() {

        var req = 'action=getkills';
        var hunter = getUrlParameter('hunter');
        var species = getUrlParameter('species');

        if(hunter)      {
                req = req.concat('&hunter=').concat(hunter);
        }
        if(species)     {
                req = req.concat('&species=').concat(species);
        }
	req = req.concat('&limit=0')
        var test;
        $.getJSON('api', req, function(data)        {

                var mapOptions = {
                        zoom: 12,
                        center:new google.maps.LatLng(59.418238, 15.505225),
                        mapTypeId: google.maps.MapTypeId.SATELLITE
                };

                map = new google.maps.Map(document.getElementById('map'), mapOptions);

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
        var hunter = getUrlParameter('hunter');
        var species = getUrlParameter('species');


        if(hunter)      {
                req = req.concat('&hunter=').concat(hunter);
        }
        if(species)     {
                req = req.concat('&species=').concat(species);
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
