/**
 * Created by toms on 1/1/2.
 */

/**
 * Searches address or city puts in $("#addressFrom") and displays it on map.
 */
function searchAddressFrom() {
    var geocoder = new google.maps.Geocoder();
    var address = $("#addressFrom").val();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var coords = results[0].geometry.location;
            $("#map").putMarker({coords: [coords.lat(), coords.lng()]});
            $("#map").setCenter(coords);
        } else {
            alert("Le geocodage n\'a pu etre effectue pour la raison suivante: " + status);
        }
    });
}

/**
 * Searches address or city puts in $("#addressTo") and displays it on map.
 */
function searchAddressTo() {
    var geocoder = new google.maps.Geocoder();
    var address = $("#addressTo").val();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var coords = results[0].geometry.location;
            $("#map").putMarker({coords: [coords.lat(), coords.lng()]});
            $("#map").setCenter(coords);
        } else {
            alert("Le geocodage n\'a pu etre effectue pour la raison suivante: " + status);
        }
    });
}


/**
 * Clears map for each itinerary call.
 * Displays itinerary from departure point to final point.
 * Sets and displays time and distance between points.
 */
function goToAddress() {
    $("#map").createMap(); // clear map
    $("#map").addItinerary({origin: $("#from").val(), destination: $("#to").val(), travelMode: $("#travel_mode").val()});
    $("#map").specifyItineraryOptions({travelMode: $("#travel_mode").val()});
    $("#text_from").html("");
    $("#text_to").html("");
    $("#distance").html("");
    $("#duration").html("");
}


$(function() {

    var tab = [];
    var lstorage = window.sessionStorage;
    lstorage.localstorage = JSON.stringify(tab);

    /**
     * Creates map on web page
     * @param options
     * @returns {$}
     */
    $.fn.createMap = function (options) {
        // default options for map initialization -> zoom , center and map
        options = $.extend({
            zoom: 8,
            coords: [48.895651, 2.290569],
            type: "ROADMAP"
        }, options);

        // map type options
        // ( four map options  available -> https://developers.google.com/maps/documentation/javascript/reference#MapOptions )
        switch (options.type) {
            case 'ROADMAP':
            case 'SATELLITE':
            case 'HYBRID':
            case 'TERRAIN':
                options.type = google.maps.MapTypeId[options.type];
                break;
            default:
                options.type = google.maps.MapTypeId.ROADMAP;
                break;
        }

        // iterator
        this.each(function () {
            // map initialization
            var map = new google.maps.Map(this, {
                zoom: options.zoom,
                center: new google.maps.LatLng(options.coords[0], options.coords[1]),
                mapTypeId: options.type,
            });
            $(this).data('googleMap', map);

        });

        return this;
    }


    /**
     * Adds marker on map and stores it in local navigator database.
     * @param options
     * @returns {$}
     */
    $.fn.putMarker = function (options){
        // default marker options if options are not indicates by user
        options = $.extend({
            coords: [48.895651, 2.290569],
            draggable: true
        }, options);

        this.each(function () {
            // adds marker on map at marker's position latitude and longitude
            var marker = new google.maps.Marker({
                map: $(this).data('googleMap'),
                position: new google.maps.LatLng(options.coords[0], options.coords[1]),
                draggable: options.draggable
            });

            // adds markers on local database
            var markers = [];
            markers = JSON.parse(lstorage.getItem('localstorage'));
            markers.push({lat: options.coords[0],lg:  options.coords[1]});
            lstorage.setItem('localstorage', JSON.stringify(markers));
        })
        return this;
    }


    /**
     * Deletes a marker from map and local navigator database.
     * @param options
     * @returns {$}
     */
    $.fn.deleteMarker = function (options){
        options = $.extend({
            coords: [0,0]
        }, options);
        var markers = [];
        var del_iterator = 0;
        markers = JSON.parse(lstorage.getItem('localstorage'));

        // catches the marker position in storage
        for (var i = 0; i < markers.length; i++){
            if (markers[i].lat == options.coords[0] && markers[i].lg == options.coords[1]){
                del_iterator = i;
                break;
            }
        }

        // deletes from storage the marker
        for (del_iterator; del_iterator < markers.length - 1; ++del_iterator){
            markers[del_iterator] = markers[del_iterator + 1];
        }
        markers[markers.length - 1] = null;
        --markers.length;

        lstorage.setItem('localstorage', JSON.stringify(markers));

        $("#markers").html("");
        $("#markers").html("<p>" + lstorage.getItem('localstorage') + "</p>");

        return this;
    }


    /**
     * Adds itinerary from points in function to travel mode.
     * @param options
     */
    $.fn.addItinerary = function (options) {
        options = $.extend({
            origin: "Paris",
            destination: "Marseille",
            travelMode: 'DRIVING'
        }, options);

        // travel modes available
        switch (options.travelMode) {
            case 'TRANSIT':
                options.type = google.maps.TravelMode.TRANSIT;
                break;
            case 'BICYCLING':
                options.type = google.maps.TravelMode.BICYCLING;
                break;
            case 'WALKING':
                options.type = google.maps.TravelMode.WALKING;
                break;
            case 'DRIVING':
                options.type = google.maps.TravelMode.DRIVING;
                break;
        }

        // displays itinerary from specific travel mode
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsService.route({
            origin: options.origin,
            destination: options.destination,
            travelMode: options.travelMode
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                alert('Echec dû à ' + status);
            }
        });
        directionsDisplay.setMap($(this).data('googleMap'));
    }


    /**
     * Gets specific data from itinerary -> time and distance.
     * @param options
     */
    $.fn.specifyItineraryOptions = function (options) {

        options = $.extend({
            travelMode: 'DRIVING',
            avoidHighways: false,
            avoidTolls: false
        }, options);

        switch (options.travelMode) {
            case 'TRANSIT':
                options.type = google.maps.TravelMode.TRANSIT;
                break;
            case 'BICYCLING':
                options.type = google.maps.TravelMode.BICYCLING;
                break;
            case 'WALKING':
                options.type = google.maps.TravelMode.WALKING;
                break;
            case 'DRIVING':
                options.type = google.maps.TravelMode.DRIVING;
                break;
        }

        // Google API which calcultaes and returns specific data from itinerary.
        service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
            {
                origins: [$("#from").val()],
                destinations: [$("#to").val()],
                travelMode: options.travelMode,
                avoidHighways: options.avoidHighways,
                avoidTolls: options.avoidTolls
            },
            callback
        );

        switch ($("#travel_mode").val()) {
            case 'TRANSIT':
                options.type = google.maps.TravelMode.TRANSIT;
                break;
            case 'BICYCLING':
                options.type = google.maps.TravelMode.BICYCLING;
                break;
            case 'WALKING':
                options.type = google.maps.TravelMode.WALKING;
                break;
            case 'DRIVING':
                options.type = google.maps.TravelMode.DRIVING;
                break;
        }

        switch ($("#highways").val()) {
            case 'YES':
                options.avoidHighways = true;
                break;
            case 'NO':
                options.avoidHighways = false;
                break;
        }

        switch ($("#toll").val()) {
            case 'YES':
                options.avoidTolls = true;
                break;
            case 'NO':
                options.avoidTolls = false;
                break;
        }


        /**
         * Gets and displays specific data from itinerary -> time, distance and addresses.
         *                                  Function call with .fn.specifyItineraryOptions
         * @param response
         * @param status
         */
        function callback(response, status) {
            var orig = document.getElementById("from"),
                dest = document.getElementById("to"),
                dist = document.getElementById("distance"),
                time = document.getElementById("duration");

            if(status=="OK") {
                orig.value = response.destinationAddresses[0];
                dest.value = response.originAddresses[0];
                dist.value = response.rows[0].elements[0].distance.text;
                time.value = response.rows[0].elements[0].duration.text;
            } else {
                alert("Error: " + status);
            }
        }

    }

});