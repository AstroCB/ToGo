function doSpotify(home, end) {
    $.get("https://dl.dropboxusercontent.com/u/24397004/allPlacesLat.json", function(data) {
        allSpotifyPlaces = JSON.parse(data);
        gotLat = true;
        var closest = findClosest(home, end);
        var matched = closest[1].match(/playlist\/(.*)/);
        if (matched != null) {
            matched = matched[1];
        } else {
            matched = "417C1CGBQOq0JYojlUkfaN";
        }
        $("#spotify").html('<iframe src="https://embed.spotify.com/?uri=spotify:user:thesoundsofspotify:playlist:' + matched + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>');
    });
}

function findClosest(home, end) {
    endLat = end.position.lat();
    endLng = end.position.lng();
    smallestDist = Number.MAX_SAFE_INTEGER;
    closestPlace = ["Topeka", "https://play.spotify.com/user/thesoundsofspotify/playlist/2VbihVrCxmOnMKtZHngFFH"];
    for (var i in allSpotifyPlaces) {
        tempDist = getDistanceFromLatLonInKm(endLat, endLng, allSpotifyPlaces[i].lat, allSpotifyPlaces[i].ln);
        if (tempDist < smallestDist) {
            smallestDist = tempDist;
            closestPlace = [allSpotifyPlaces[i].name, allSpotifyPlaces[i].href];
        }
    }
    return closestPlace;

}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
