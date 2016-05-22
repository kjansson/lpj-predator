drawMap();
drawKillList();
drawMemberList();
drawAnimalList();

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
//		echo "<p>".$kill['date']." - ".$kill['animal']['realname']." (".$kill['q'].") - ".$kill['location']['pass']." - ".$kill['hunter']."<br>";		




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
                heatmap.set('radius', 20);
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


