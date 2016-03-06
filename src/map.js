var map, lat, long, homeMarker, finalMarker, directionsDisplay

gotLat = false
  var skycons = new Skycons({"color": "black"});

function initMap() {
    getLocation();
    $("#datepicker").datepicker({
        minDate: 0,
        dateFormat: "mm/dd/yy"
    }).datepicker("setDate", new Date());
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locatePosition, function() {
            createMap();
        });
    } else {
        createMap();
    }
}

function locatePosition(position) {
    createMap(position.coords.latitude, position.coords.longitude);
}

function createMap(lat, long) {
    if (!lat) {
        latitude = 39.290385;
    } else {
        latitude = lat;
    }
    if (!long) {
        longitude = -76.612189;
    } else {
        longitude = long;
    }

    var newMap = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: latitude,
            lng: longitude
        },
        scrollwheel: true,
        zoom: 15
    });
    map = newMap;

    initializeServices();
}

function initializeServices() {
    homeMarker = createMarker(map.center.lat(), map.center.lng(), "from.png");
    document.getElementById("from").value = map.center.lat() + ", " + map.center.lng();

    var randLat = map.center.lat() + randomSmallValue(),
        randLong = map.center.lng() + randomSmallValue();
    finalMarker = createMarker(randLat, randLong, "to.png");
    document.getElementById("to").value = randLat + ", " + randLong;

    homeMarker.addListener("dragend", homeDragEnded);
    finalMarker.addListener("dragend", finalDragEnded);

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
    doSpotify(homeMarker, finalMarker)
    getWeather()
}

function createMarker(lat, long, image) {
    var mark = new google.maps.Marker({
        position: {
            lat: lat,
            lng: long
        },
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: "images/" + image
    });
    return mark;
}

function randomSmallValue() {
    var rand = Math.random() * 0.006 + 0.003,
        decider = Math.random();
    if (decider <= 0.5) {
        rand *= -1;
    }
    return rand;
}

function homeDragEnded(e) {
    document.getElementById("from").value = e.latLng.lat() + ", " + e.latLng.lng();
}

function finalDragEnded(e) {
    document.getElementById("to").value = e.latLng.lat() + ", " + e.latLng.lng();
}

function getDirections() {
    var directionsService = new google.maps.DirectionsService();
    var req = {
        origin: homeMarker.position,
        destination: finalMarker.position,
        provideRouteAlternatives: false,
        travelMode: google.maps.TravelMode.DRIVING,
        drivingOptions: {
            departureTime: $("#datepicker").datepicker("getDate"),
            trafficModel: google.maps.TrafficModel.PESSIMISTIC
        },
        unitSystem: google.maps.UnitSystem.IMPERIAL
    };
    directionsService.route(req, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            homeMarker.setMap(null);
            finalMarker.setMap(null);
        }
    });
}

function getWeather() {
    var date = $("#datepicker").datepicker("getDate");
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = "0" + dd
    }

    if (mm < 10) {
        mm = "0" + mm
    }

    // var url = "https://api.forecast.io/forecast/88e8ca844f0b17a64b8fd82368b332d0/" + finalMarker.position.lat() + "," + finalMarker.position.lng() + "," + yyyy + "-" + mm + "-" + dd + "T12:00:00";
    // var url = "https://api.forecast.io/forecast/88e8ca844f0b17a64b8fd82368b332d0/" + finalMarker.position.lat() + "," + finalMarker.position.lng() + "," + yyyy + "-" + mm + "-" + dd + encodeURIComponent("T12:00:00")
    // var url = "https://api.forecast.io/forecast/88e8ca844f0b17a64b8fd82368b332d0/" + finalMarker.position.lat() + "," + finalMarker.position.lng() + "," + yyyy + "-" + mm + "-" + dd + encodeURIComponent("T12:00:00") + "?callback=callback"

    $.ajax({
        url: "https://api.forecast.io/forecast/88e8ca844f0b17a64b8fd82368b332d0/" + finalMarker.position.lat() + "," + finalMarker.position.lng() + "," + yyyy + "-" + mm + "-" + dd + encodeURIComponent("T12:00:00") + "?callback=?",
        // The name of the callback parameter, as specified by the YQL service
        jsonp: "callback",
type: 'GET',

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Tell YQL what we want and that we want JSON
        // Work with the response
        success: function(response, b, c) {
            console.log(response); // server response
            console.log(b); // server response
            console.log(c); // server response
            daily = response.daily;
            var data = daily.data[0];
            console.log(data);
            var vals = {
                "Summary": data.summary,
                "Visibility": data.visibility + " mi",
                "Precipitation Chance": data.precipProbability * 100 + "%",
                "Humidity": data.humidity * 100 + "%",
                "High Temp": data.temperatureMax,
                "Low Temp": data.temperatureMin
            };
$("#weather").append("<canvas id='icon1' width='128' height='128'></canvas>")
console.log(daily.data[0].icon.toUpperCase().replace(/-/g, "_"))
                skycons.add("icon1", Skycons[daily.data[0].icon.toUpperCase().replace(/-/g, "_")]);
skycons.play()
            for (var i in vals) {
                var innerString = i + ": " + vals[i];
                if (i === "Summary") {
                    innerString = vals[i];
                }
                console.log("going")
                $("#weather").append("<span class='weatherItem'>" + innerString + "</span><br/>");
            }
        },
        error: function(err, b, c) {
            console.log(err)
            console.log(b)
            console.log(c)
        }
    });
}
