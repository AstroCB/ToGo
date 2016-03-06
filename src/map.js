var map, lat, long, homeMarker, finalMarker, directionsDisplay;

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
            homeMarker.setMap(null);
            finalMarker.setMap(null);
        }
    });
}
