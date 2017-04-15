var map;

var placeMarkers = [];
var mapDistanceCircles = [];
var crimeMarkers = [];
var securityHeatmap;

var homeIcon = "map_pin_icons/home.png";
var shomeIcon = "map_pin_icons/shome.png";
var collegeIcon = "map_pin_icons/college.png";
var crimeIcon = "map_pin_icons/crime.png";
var youIcon = "map_pin_icons/you.png";

var universityPos = {lat: 41.8708, lng: -87.6505};
var actualPos = {lat: 41.807846, lng: -87.664140};

//Methods
function centerMap(location, map) {
  map.setCenter(location);
  map.setZoom(12);
};

function selectMapPlace(location, map) {
centerMap(location, map);
  location.lat = location.lat.toFixed(10);
  location.lng = location.lng.toFixed(10);
  placeMarkers.forEach(function(placeMarker) {
    var mLoc = {lat: placeMarker.getPosition().lat().toFixed(10), lng: placeMarker.getPosition().lng().toFixed(10)};
    if (mLoc.lat == location.lat && mLoc.lng == location.lng) {
      placeMarker.setIcon(shomeIcon);
      placeMarker.setMap(map);
    } else {
      placeMarker.setIcon(homeIcon);
    }
  })
}

//Controls
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
  controlUI.style.backgroundColor = color;
  controlUI.style.border = '2px solid ' + color;
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '9px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to show or hide ' + text + ' markers';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'white';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '11px';
  controlText.style.padding = '8px';
  controlText.innerHTML = '<i class="' + icon + ' icon"></i> Show ' + text;
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
      controlText.innerHTML = '<i class="' + icon + ' icon"></i> Show ' + text;
    } else {
      markers.forEach(function(marker) {
        marker.setMap(map);
      });
      controlText.innerHTML = '<i class="' + icon + ' icon"></i> Hide ' + text;
    }
  });
}

function initMap() {
  //create map
  map = new google.maps.Map(document.getElementById('map'), {
    center: universityPos,
    zoom: 14,
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
    ]
  });

  var uMarker = new google.maps.Marker({
    position: universityPos,
    map: map,
    icon: collegeIcon,
    title: 'University of Illinois at Chicago'
  });
  uMarker.addListener('click', function() {
    new google.maps.InfoWindow({
      content: 'University of Illinois at Chicago'
    }).open(map, uMarker);
  });

  var yourMarker = new google.maps.Marker({
    position: actualPos,
    map: map,
    icon: youIcon,
    title: 'Your position'
  });
  yourMarker.addListener('click', function() {
    new google.maps.InfoWindow({
      content: 'Your position'
    }).open(map, yourMarker);
  });

  //request places data
  var xmlhttp = new XMLHttpRequest();
  var url = "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD"
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var myArr = xmlhttp.responseText;
      var text = myArr;
      var json = JSON.parse(text);

      for (var i = 0; i<json.data.length; i++) {
          var dataLine = {
            name: json.data[i][11],
            address: json.data[i][12],
            phone: json.data[i][14],
            type: json.data[i][10],
            number: json.data[i][16],
            area: json.data[i][8],
            company: json.data[i][15],
            latitude: json.data[i][19],
            longitude: json.data[i][20],
            price: ''
          };
          var placeMarker = new google.maps.Marker({
            position: {lat: parseFloat(dataLine.latitude), lng: parseFloat(dataLine.longitude)},
            icon: homeIcon,
            map: null,
            title: dataLine.name
          });
          placeMarkers.push(placeMarker);
      };
    }
  };

  //create distance circles
  for (var i=7; i>=0; i--) {
    var circle = new google.maps.Circle({
      strokeColor: '#085166',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: 'rgb(' + (244) + ', ' + (244) + ', ' + (244-29*i) + ')',
      fillOpacity: 0.1,
      map: null,
      center: universityPos,
      radius: i * 3000 // Add a cicle every 5Km from the university
    });
    mapDistanceCircles.push(circle);
  };

  //request crimes data
  $.getJSON( "https://data.cityofchicago.org/resource/6zsd-86xi.json", function( data ) {
    var locations = [];
    data.forEach(function(crime) {
      var location = new google.maps.LatLng(parseFloat(crime.latitude), parseFloat(crime.longitude));
      var type = crime.primary_type;
      var crimeMarker = new google.maps.Marker({
        position: location,
        icon: crimeIcon,
        map: null,
        title: type
      });
      crimeMarker.addListener('click', function() {
        new google.maps.InfoWindow({
          content: type
        }).open(map, crimeMarker);
      });
      crimeMarkers.push(crimeMarker);
      if (crime.latitude != undefined) {
        locations.push(location);
      }
    });
    securityHeatmap = new google.maps.visualization.HeatmapLayer({
      data : locations
    });
  });

  //request travel data
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [{lat: 41.807846, lng: -87.664140}],
    destinations: [{lat: 41.8708, lng: -87.6505}],
    travelMode: 'DRIVING',
  }, function(response, status) {
    var result;
    if (status !== 'OK') {
      alert('Error was: ' + status);
    } else {
      result = response.rows[0].elements[0];
    }
    console.log(result);
  });

  //Create controls
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  var showControlDiv = document.createElement('div');
  var showControl = new ShowControl(showControlDiv, map, placeMarkers, 'home', 'Places', 'rgb(149, 91, 165)');

  var showControl2Div = document.createElement('div');
  var showControl = new ShowControl(showControl2Div, map, crimeMarkers, 'pin', 'Crimes', 'rgb(231, 75, 59)');

  // centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  map.controls[google.maps.ControlPosition.RIGHT].push(showControlDiv);
  map.controls[google.maps.ControlPosition.RIGHT].push(showControl2Div);
};
