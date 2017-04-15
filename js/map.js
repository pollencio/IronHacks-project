var map;

var placeMarkers = [];
var mapCircles = [];

var homeIcon = "map_pin_icons/home.png";
var shomeIcon = "map_pin_icons/shome.png";
var collegeIcon = "map_pin_icons/college.png";
// var crimeIcon = "map_pin_icons/crime.png";
var youIcon = "map_pin_icons/you.png";

var universityPos = {lat: 41.8708, lng: -87.6505};
var actualPos = {lat: 41.807846, lng: -87.664140};

//Methods
function centerMap(location, map) {
  map.setCenter(location);
  map.setZoom(14);
};

function selectMapPlace(location, map) {
centerMap(location, map);
  location.lat = location.lat.toFixed(10);
  location.lng = location.lng.toFixed(10);
  console.log(location);
  placeMarkers.forEach(function(placeMarker) {
    var mLoc = {lat: placeMarker.getPosition().lat().toFixed(10), lng: placeMarker.getPosition().lng().toFixed(10)};
    console.log(mLoc);
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
  controlUI.style.backgroundColor = 'rgb(28, 87, 102)';
  controlUI.style.border = '2px solid rgb(28, 87, 102)';
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

function ShowControl(controlDiv, map, markers) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'rgb(149, 91, 165)';
  controlUI.style.border = '2px solid rgb(149, 91, 165)';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '9px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to show or hide place markers';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'white';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '11px';
  controlText.style.padding = '8px';
  controlText.innerHTML = 'Show Places';
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
      controlText.innerHTML = 'Show Places';
    } else {
      markers.forEach(function(marker) {
        marker.setMap(map);
      });
      controlText.innerHTML = 'Hide Places';
    }
  });
}

function initMap() {
  //create map
  map = new google.maps.Map(document.getElementById('map'), {
    center: universityPos,
    zoom: 14
  });

  var uMarker = new google.maps.Marker({
    position: universityPos,
    map: map,
    icon: collegeIcon,
    title: 'University of Illinois at Chicago'
  });

  var yourMarker = new google.maps.Marker({
    position: actualPos,
    map: map,
    icon: youIcon,
    title: 'Your position'
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

  for (var i=5; i>=0; i--) {
    var circle = new google.maps.Circle({
      strokeColor: '#085166',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: 'rgb(' + (65) + ', ' + (70+30*i) + ', ' + (244) + ')',
      fillOpacity: 0.15,
      map: null,
      center: universityPos,
      radius: i * 6000 // Add a cicle every 5Km from the university
    });
    mapCircles.push(circle);
  };

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

  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  var showControlDiv = document.createElement('div');
  var showControl = new ShowControl(showControlDiv, map, placeMarkers);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  showControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(showControlDiv);
};
