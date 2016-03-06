var map, lat, long, homeMarker, finalMarker, directionsDisplay, trip, gotLat = false;

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
            trip = result.routes[0].legs[0]
            homeMarker.setMap(null);
            finalMarker.setMap(null);
        }
    });
    runDependentFunctions();
}

function runDependentFunctions() {
    getWeather();
    getUber();
    doSpotify(homeMarker, finalMarker);
}

function getWeather() {
    var date = $("#datepicker").datepicker("getDate");
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    var url = "https://api.forecast.io/forecast/88e8ca844f0b17a64b8fd82368b332d0/" + finalMarker.position.lat() + "," + finalMarker.position.lng() + "," + yyyy + "-" + mm + "-" + dd + "T12:00:00";
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function() {
        if (req.readyState == 4 && req.status == 200) {
            var data = JSON.parse(req.responseText).daily.data[0];
            var vals = {
                "Summary": data.summary,
                "Visibility": data.visibility + " mi",
                "Precipitation Chance": data.precipProbability * 100 + "%",
                "Humidity": data.humidity * 100 + "%",
                "High Temp": Math.round(data.temperatureMax) + "º",
                "Low Temp": Math.round(data.temperatureMin) + "º"
            };

            $("#weather").html("");
            for (var i in vals) {
                var innerString = i + ": " + vals[i];
                if (i === "Summary") {
                    innerString = vals[i];
                }
                $("#weather").append("<span class='weatherItem'>" + innerString + "</span><br/>");
            }
        }
    }, false);
    req.send(null);
}

function getUber() {
    var req = new XMLHttpRequest();
    req.open("GET", "https://sandbox-api.uber.com/v1/products?latitude=" + finalMarker.position.lat() + "&longitude=" + finalMarker.position.lng());
    req.setRequestHeader("Authorization", "Token bDqrKzbzcqvlceO6nbdqPOQeG0f1ZaOllg8M_9qR");
    // $("#uber").html("");
    req.addEventListener("load", function() {
        var data = JSON.parse(req.responseText).products;
        for (var i = 0; i < data.length; i++) {
            var cost = data[i].price_details.cost_per_minute * (trip.distance.value / 60.0);
            var price = Math.ceil(cost * 100) / 100 + "";
            if (price.match(/^\d*\.\d$/m)) {
                price += "0";
            }
            $("#uber").append("<span>" + data[i].display_name + " (<img class='car' src='" + data[i].image + "'/>)</span><br/><span>Estimated Cost: $" + price + "</span><br/><br/>");
        }
    }, false)
    req.send();
}
