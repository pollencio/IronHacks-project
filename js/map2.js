// $(document).on('ready', function() {
//   var map2 = new google.maps.Map(document.getElementById('map2'), {
//     mapTypeControl: false,
//     center: {lat: 41.85081542, lng: -87.69123528},
//     zoom: 13
//   });
//   new AutocompleteDirectionsHandler(map2);
// });
//
// function AutocompleteDirectionsHandler() {
//   this.map = map;
//   this.originPlaceId = null;
//   this.destinationPlaceString = '1542 W 47th St' + ", Chicago, IL, United States";
//   this.travelMode = 'WALKING';
//   this.directionsService = new google.maps.DirectionsService;
//   this.directionsDisplay = new google.maps.DirectionsRenderer;
//   this.directionsDisplay.setMap(map);
//   var originInput = document.getElementById('origin-input');
//   var modeSelector = document.getElementById('mode-selector');
//   map2.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
//   map2.controls[google.maps.ControlPosition.TOP_RIGHT].push(modeSelector);
//
//   var originAutocomplete = new google.maps.places.Autocomplete(
//       originInput, {placeIdOnly: true});
//
//   this.setupClickListener('changemode-walking', 'WALKING');
//   this.setupClickListener('changemode-transit', 'TRANSIT');
//   this.setupClickListener('changemode-driving', 'DRIVING');
//
//   this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
// }
//
// // Sets a listener on a radio button to change the filter type on Places
// // Autocomplete.
// AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
//   var radioButton = document.getElementById(id);
//   var me = this;
//   radioButton.addEventListener('click', function() {
//     me.travelMode = mode;
//     me.route();
//   });
// };
//
// AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
//   var me = this;
//   if (mode == 'ORIG') {
//     autocomplete.bindTo('bounds', this.map);
//     autocomplete.addListener('place_changed', function() {
//       var place = autocomplete.getPlace();
//       if (!place.place_id) {
//         window.alert("Please select an option from the dropdown list.");
//         return;
//       }
//       me.route();
//     });
//     me.originPlaceId = place.place_id;
//   } else {
//     me.destinationPlaceString = '';
//   }
//
// };
//
// AutocompleteDirectionsHandler.prototype.route = function() {
//   if (!this.originPlaceId) {
//     return;
//   }
//   var me = this;
//
//   this.directionsService.route({
//     origin: {'placeId': this.originPlaceId},
//     destination: this.destinationPlaceString,
//     travelMode: this.travelMode
//   }, function(response, status) {
//     if (status === 'OK') {
//       me.directionsDisplay.setDirections(response);
//     } else {
//       window.alert('Directions request failed due to ' + status);
//     }
//   });
// };

function initMap2() {
        var map2 = new google.maps.Map(document.getElementById('map2'), {
          mapTypeControl: false,
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });

        new AutocompleteDirectionsHandler(map2);
      }

       /**
        * @constructor
       */
      function AutocompleteDirectionsHandler(map) {
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = '1542 W 47th St' + ", Chicago, IL, United States";
        this.travelMode = 'WALKING';
        var originInput = document.getElementById('origin-input');
        var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});

        this.setupClickListener('changemode-walking', 'WALKING');
        this.setupClickListener('changemode-transit', 'TRANSIT');
        this.setupClickListener('changemode-driving', 'DRIVING');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
      }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
        var radioButton = document.getElementById(id);
        var me = this;
        radioButton.addEventListener('click', function() {
          me.travelMode = mode;
          me.route();
        });
      };

      AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      AutocompleteDirectionsHandler.prototype.route = function() {
        if (!this.originPlaceId) {
          return;
        }
        var me = this;

        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: this.destinationPlaceId,
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      };
