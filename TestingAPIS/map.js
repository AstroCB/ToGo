function initMap() {
    createMap()
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locatePosition);
    }
}

function locatePosition(position) {
  createMap(position.coords.latitude, position.coords.longitude);
}

function createMap(lat, long) {
  if(!lat) {
    lat = 39.290385;
  }
  if(!long) {
    long = -76.612189;
  }
  var map = new google.maps.Map(document.getElementById('map'), {
      center: {
          lat: lat,
          lng: long
      },
      scrollwheel: true,
      zoom: 15
  });
  return map;
}
