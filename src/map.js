var map, lat, long, homeMarker, finalMarker, directionsDisplay, trip, gotLat = false;

function initMap() {
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(locatePosition, function() {
            createMap();
        });
    } else { // Not available – default loc is Baltimore
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
    var inputStart = document.getElementById('start-input')
    var inputEnd = document.getElementById('end-input')
    var inputButton = document.getElementById('dirButton')
    var spotifyDiv = document.getElementById('spotify')
    var uberDiv = document.getElementById('uber')
    var weatherDiv = document.getElementById('weather')

    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputStart);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputEnd);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputButton);
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(spotifyDiv);
    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(uberDiv);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(weatherDiv);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocompleteInput = new google.maps.places.Autocomplete(inputStart);
    var autocompleteOutput = new google.maps.places.Autocomplete(inputEnd);
    autocompleteInput.bindTo('bounds', map);
    autocompleteOutput.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();

    autocompleteOutput.addListener('place_changed', function() {
        infowindow.close();
        var place = autocompleteOutput.getPlace();
        test = place;
        if (!place.geometry) {
            sweetAlert("Oops...", "No results were found for that array", "error");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }

        finalMarker = createMarker(place.geometry.location.lat(), place.geometry.location.lng(), "to.png");
        finalMarker.setPosition(place.geometry.location);
        finalMarker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''), (place.address_components[1] && place.address_components[1].short_name || ''), (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, finalMarker);
    });
    autocompleteInput.addListener('place_changed', function() {
        infowindow.close();
        var place = autocompleteInput.getPlace();
        test = place

        if (!place.geometry) {
            window.alert("No results found for that place");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }

        homeMarker = createMarker(place.geometry.location.lat(), place.geometry.location.lng(), "from.png");
        homeMarker.setPosition(place.geometry.location);
        homeMarker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''), (place.address_components[1] && place.address_components[1].short_name || ''), (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, homeMarker);
    });

    initializeServices();
}

function initializeServices() {
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
    if (document.getElementById("start-input").value || document.getElementById("end-input").value) {
        var directionsService = new google.maps.DirectionsService();
        var req = {
            origin: homeMarker.position,
            destination: finalMarker.position,
            provideRouteAlternatives: false,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(),
                trafficModel: google.maps.TrafficModel.PESSIMISTIC
            },
            unitSystem: google.maps.UnitSystem.IMPERIAL
        };
        directionsService.route(req, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
                trip = result.routes[0].legs[0];
                homeMarker.setMap(null);
                finalMarker.setMap(null);
            }
        });
        runDependentFunctions();
    } else {
        sweetAlert("Oops...", "Please enter a starting and ending location", "error");
    }
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
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    var url = "http://whateverorigin.org/get?url=" + encodeURIComponent("https://api.forecast.io/forecast/88e8ca844f0b17a64b8fd82368b332d0/" + finalMarker.position.lat() + "," + finalMarker.position.lng() + "," + yyyy + "-" + mm + "-" + dd + "T12:00:00");
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    console.log(req);
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
