var map, lat, long, homeMarker;

function initMap() {
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locatePosition);
        setTimeout(function() {
          createMarker(map.center.lat(), map.center.lng());
        }, 1500);
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
}

function createMarker(lat, long) {
    homeMarker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: long
        },
        map: map
    });
}
