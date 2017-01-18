/**
 * Created by toms on 1/1/17.
 */

/**
 * Searches address or city puts in $("#addressFrom") and displays it on map.
 */
function searchAddressFrom() {
   // TODO localiser et afficher la ville entré dans le premier input
}

/**
 * Searches address or city puts in $("#addressTo") and displays it on map.
 */
function searchAddressTo() {
  // TODO localiser et afficher la ville entré dans le deuxième input
    // TODO humm ça ressemble beaucoup à la précédente ...
}


/**
 * Clears map for each itinerary call.
 * Displays itinerary from departure point to final point.
 * Sets and displays time and distance between points.
 */
function setItinerary() {
    $("#map").createMap(); // clear map

    // TODO appel à deux API de Google via deux fonctions de notre plugin, une pour le trajet, l'autre pour obtenir
    // TODO les informations du trajet
    // TODO appel à addItinerary et specifyItineraryOptions -> n'oubliez pas les options à définir
    /*******/

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

        //TODO mettre les options par défaut de la carte
        /***************************************/


        //TODO sélectionner l'option d'affichage de la carte en fonction de l'option sélectionné
        //TODO Je suis pas sûr mais ça doit être un switch ou quelque chose comme ça ...
        /**************************************/

        // iterator
        this.each(function () {
            // map initialization

            //TODO créer la carte
            /****************************/

            //a
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

        //TODO mettre les options d'un marqueur par défaut -> coords
        /*********************************************************/

        this.each(function () {

            //TODO créer un marqueur sur la carte
            /***********************************/

            // adds markers on local database
            var markers = [];
            markers = JSON.parse(lstorage.getItem('localstorage'));
            markers.push({lat: options.coords[0],lg:  options.coords[1]});
            lstorage.setItem('localstorage', JSON.stringify(markers));
        })
        return this;
    }



    // TODO Rien du tout à contempler :)
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

        //TODO ajouter les options par défaut d'un itinéraire
        /**********************************************/

        // travel modes available
        switch (options.travelMode) {
            case 'TRANSIT':
                options.type = /***********/;
                break;
            case 'BICYCLING':
                options.type = /***********/;
                break;
            case 'WALKING':
                options.type = /***********/;
                break;
            case 'DRIVING':
                options.type = /***********/;
                break;
        }

        // displays itinerary from specific travel mode

        //TODO appel à DirectionsService et DirectionsRenderer pour le tracé de l'itinéraire
        /************************************************************/

        directionsDisplay.setMap($(this).data('googleMap'));
    }


    /**
     * Gets specific data from itinerary -> time and distance.
     * @param options
     */
    $.fn.specifyItineraryOptions = function (options) {

        //TODO définir les options par défaut de la fonction
        //TODO Je vous demande juste travelMode, avoidTolls et avoidHighways ....
        /*****************************************************************/

        switch (options.travelMode) {
            case 'TRANSIT':
                options.type =/***********/;
                break;
            case 'BICYCLING':
                options.type = /***********/;
                break;
            case 'WALKING':
                options.type = /***********/;
                break;
            case 'DRIVING':
                options.type = /***********/;
                break;
        }

        //TODO appel a DistanceMatrixService pour obtenir diverses infos sur l'itineraire
        //TODO origins, destinations, travelMode, avoidHighways, avoidTolls
        //TODO ne pas oublier la fonction de callback à définir plus bas
        /*************************************/

        service = new google.maps./******/();

        service.getDistanceMatrix(
            {
                /**********/
            },
            /*****/
        );

        switch ($("#travel_mode").val()) {
            case 'TRANSIT':
                options.type = /***********/;
                break;
            case 'BICYCLING':
                options.type = /***********/;
                break;
            case 'WALKING':
                options.type = /***********/;
                break;
            case 'DRIVING':
                options.type = /***********/;
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

        //TODO mettre la fonction de callback juste après le commentaire
        /**
         * Gets and displays specific data from itinerary -> time, distance and addresses.
         *                                  Function call with .fn.specifyItineraryOptions
         * @param response
         * @param status
         */



        // TODO Y'a de la place, beaucoup de place ....





























        //TODO Je suis sympa c'est déjà fait :) :)
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