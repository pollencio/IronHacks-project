// Data Arrays
var placesData = [];
var crimesData = [];

// Marker arrays
var placeMarkers = [];
var policeMarkers = [];
var libraryMarkers = [];
var fireMarkers = [];
var shopMarkers = [];
var crimeMarkers = [];

// Positions
var universityPos = {lat: 41.85081542, lng: -87.69123528};
var actualPos = {lat: 41.807846, lng: -87.664140};

// Map elements
var map;
var service;
var securityHeatmap;
var mapDistanceCircles = [];
var Acircle;

// Icon url
var iconURL = "map_pin_icons/";

$(window).load(function() {
  var mapOptions = {
    zoom: 12,
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'road.local',
        stylers: [{visibility: 'off'}]
      }
    ],

    center: universityPos
  }
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  infowindow = new google.maps.InfoWindow({ content: '' });
  // service = new google.maps.DistanceMatrixService();

  // Set markers
  setMarkersSODA('9rg7-mz9y.json', policeMarkers, ['district_name','latitude','longitude'], 'police');
  setMarkersSODA('psqp-6rmg.json', libraryMarkers, ['name_','location','location'], 'library');
  setMarkersSODA('b4bk-rjxe.json', fireMarkers, ['name','location','location'], 'fire');
  setMarkersSODA('j97f-trs4.json', shopMarkers, ['store_name','latitude','longitude'], 'shop');

  setCrimeData(crimeMarkers, 'crime', crimesData);
  setPlaceData(placeMarkers, 'home', placesData);

  marker = new google.maps.Marker({
    position: universityPos,
    map: map,
    title: 'University of Illinois at Chicago',
    icon: iconURL+'college.png'
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<b>University of Illinois at Chicago</b><br>Department of Computer Science');
    infowindow.open(map, marker);
  });

  // Set Heatmap
  securityHeatmap = new google.maps.visualization.HeatmapLayer({
    data : crimesData
  });

  // Create distance circles
  for (var i=9; i>=0; i--) {
    var circle = new google.maps.Circle({
      strokeColor: '#085166',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: 'rgb(' + (244) + ', ' + (244) + ', ' + (244-29*i) + ')',
      fillOpacity: 0.1,
      map: null,
      center: universityPos,
      radius: i * 3000 // Add a cicle every 3Km from the university
    });
    mapDistanceCircles.push(circle);
  };
  Acircle = new google.maps.Circle({
    strokeColor: '#085166',
    strokeOpacity: 0.2,
    strokeWeight: 1,
    fillColor: '#d43bc9',
    fillOpacity: 0.3,
    map: null,
    center: new google.maps.LatLng(0, 0),
    radius: 2000
  });

  // Controls
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  var showControlDiv = document.createElement('div');
  var showControl = new ShowControl(showControlDiv, map, placeMarkers, 'home', 'Places', 'rgb(149, 91, 165)');
  map.controls[google.maps.ControlPosition.RIGHT].push(showControlDiv);

  var showControl3Div = document.createElement('div');
  var showControl = new ShowControl(showControl3Div, map, crimeMarkers, 'pin', 'Crimes', 'rgb(231, 75, 59)');
  map.controls[google.maps.ControlPosition.RIGHT].push(showControl3Div);

  var showControl2Div = document.createElement('div');
  var showControl = new ShowControl(showControl2Div, map, policeMarkers, 'protect', 'Police Stations', 'rgb(59, 98, 255)');
  map.controls[google.maps.ControlPosition.RIGHT].push(showControl2Div);

  var showControl4Div = document.createElement('div');
  var showControl = new ShowControl(showControl4Div, map, fireMarkers, 'fire', 'Fire Stations', 'rgb(255, 66, 66)');
  map.controls[google.maps.ControlPosition.RIGHT].push(showControl4Div);

  var showControl5Div = document.createElement('div');
  var showControl = new ShowControl(showControl5Div, map, libraryMarkers, 'book', 'Libraries', 'rgb(148, 148, 148)');
  map.controls[google.maps.ControlPosition.RIGHT].push(showControl5Div);

  var showControl6Div = document.createElement('div');
  var showControl = new ShowControl(showControl6Div, map, shopMarkers, 'shop', 'Grocery Stores', 'rgb(65, 224, 137)');
  map.controls[google.maps.ControlPosition.RIGHT].push(showControl6Div);

  // Set Data into cards
  // dataContainer.placesList = placesData;

});

// Datasets access functions
function setMarkersSODA(url, markers, names, icon) {
  $.getJSON('https://data.cityofchicago.org/resource/' + url, function(data, textstatus) {
    if(names[2] == 'location') {
      $.each(data, function(i, entry) {
        var mapURL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCC4lO1PjOC9xzRaOK86FJoht6VBFYcsB8&address='+entry.address+', Chicago, US';
        $.getJSON(mapURL, function(address, textstatus) {
          var marker = new google.maps.Marker({
            position: address.results[0].geometry.location,
            map: null,
            title: entry[names[0]],
            icon: iconURL + icon + '.png'
          });
          google.maps.event.addListener(marker, 'click', function() {
            setInfoWindow(map, entry[names[0]], marker);
          });
          markers.push(marker);
        });
      });
    } else {
      $.each(data, function(i, entry) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(entry[names[1]],entry[names[2]]),
          map: null,
          title: entry[names[0]],
          icon: iconURL + icon + '.png'
        });
        google.maps.event.addListener(marker, 'click', function() {
          setInfoWindow(map, entry[names[0]], marker);
        });
        markers.push(marker);
      });
    }
  });
}

function setPlaceData (markers, icon, array) {
  $.getJSON('https://data.cityofchicago.org/resource/uahe-iimk.json', function(data, textstatus) {
    $.each(data, function(i, entry) {
      var location = new google.maps.LatLng(entry.latitude,entry.longitude);
      // Markers
      var marker = new google.maps.Marker({
        position: location,
        map: null,
        title: entry.property_name,
        icon: iconURL + icon + '.png'
      });
      google.maps.event.addListener(marker, 'click', function() {
        setInfoWindow(map, '<b>'+entry.property_name+'</b><br>'+entry.address, marker);
      });
      markers.push(marker);
    });
  });
}

function setCrimeData (markers, icon, array) {
  $.getJSON("https://data.cityofchicago.org/resource/6zsd-86xi.json", function(data, textstatus) {
    $.each(data, function(i, entry) {
      var location = new google.maps.LatLng(parseFloat(entry.latitude), parseFloat(entry.longitude));
      // Markers
      var marker = new google.maps.Marker({
        position: location,
        map: null,
        title: entry.primary_type,
        icon: iconURL + icon + '.png'
      });
      google.maps.event.addListener(marker, 'click', function() {
        setInfoWindow(map, '<b>'+entry.primary_type+'-'+entry.description+'</b><br>Location: '+entry.location_description+'<br>Date: '+entry.date, marker);
      });
      markers.push(marker);
      array.push({lat: location.lat(), lng: location.lng()});
    });
  });
}

// Map controls functions
function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'rgb(29, 185, 224)';
  controlUI.style.border = '2px solid rgb(29, 185, 224)';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '9px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'white';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '11px';
  controlText.style.padding = '8px';
  controlText.innerHTML = 'Center University';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to UIC.
  controlUI.addEventListener('click', function() {
    centerMap(universityPos, map);
  });
}

function ShowControl(controlDiv, map, markers, icon, text, color) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'rgb(247, 247, 247)';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '9px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to show or hide ' + text + ' markers';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = '#444444';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '12px';
  controlText.style.padding = '8px';
  controlText.innerHTML = '<i class="' + icon + ' icon" style="font-size:1.4em"></i>';
  controlUI.appendChild(controlText);

  // Setup the click event listeners:
  controlUI.addEventListener('click', function() {
    var count = 0;
    markers.forEach(function(marker) {
      if (marker.map != null) {
        count ++;
      }
    });
    if (count != 0) {
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      controlUI.style.backgroundColor = 'rgb(247, 247, 247)';
      controlText.style.color = '#444444';
      if(text === 'Places') {
        Acircle.setMap(null);
      }
    } else {
      markers.forEach(function(marker) {
        marker.setMap(map);
      });
      controlUI.style.backgroundColor = color;
      controlText.style.color = 'white';
      if(text === 'Places') {
        Acircle.setMap(map);
      }
    }
  });
}

// Methods
function centerMap(location, map) {
  map.setCenter(location);
  map.setZoom(12);
};

function selectMapPlace(location, map, name, address) {
  centerMap(location, map);
  var latlng = new google.maps.LatLng(location.lat, location.lng);
  Acircle.setCenter(latlng);
  Acircle.setMap(map);
  location.lat = location.lat.toFixed(10);
  location.lng = location.lng.toFixed(10);
  placeMarkers.forEach(function(placeMarker) {
    var mLoc = {lat: placeMarker.getPosition().lat().toFixed(10), lng: placeMarker.getPosition().lng().toFixed(10)};
    if (mLoc.lat == location.lat && mLoc.lng == location.lng) {
      placeMarker.setIcon(iconURL+'shome.png');
      placeMarker.setMap(map);
      setInfoWindow(map, '<b>'+name+'</b><br>'+address, placeMarker);
    } else {
      placeMarker.setIcon(iconURL+'home.png');
    }
  })
}

function setInfoWindow(map, html, marker) {
  infowindow.setContent(html);
  infowindow.open(map, marker);
}

function routeApartment(map, address) {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  directionsService.route({
    origin: {address},
    destination: {universityPos},
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
