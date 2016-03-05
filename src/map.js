var map, lat, long, homeMarker, finalMarker;

function initMap() {
    getLocation();
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
    homeMarker = createMarker(map.center.lat(), map.center.lng(), "from.png");
    finalMarker = createMarker(map.center.lat() + randomSmallValue(), map.center.lng() + randomSmallValue(), "to.png");
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
        icon: image,
    });
    return mark;
}

function randomSmallValue() {
  var rand = Math.random() * 0.006 + 0.003, decider = Math.random();
  if(decider <= 0.5) {
    rand *= -1;
  }
  return rand;
}
