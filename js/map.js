var map;
var placeMarkers = [];
var homeIcon = "map_pin_icons/home.png";
var collegeIcon = "map_pin_icons/college.png";
var crimeIcon = "map_pin_icons/crime.png";
var youIcon = "map_pin_icons/you.png";

var universityPos = {lat: 41.8708, lng: -87.6505};
var actualPos = {lat: 41.807846, lng: -87.664140};
modal.actualPosition = "4722 South Justine Street";

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '9px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '11px';
  controlText.style.padding = '8px';
  controlText.innerHTML = 'Center University';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to UIC.
  controlUI.addEventListener('click', function() {
    map.setCenter(universityPos);
    map.setZoom(13);
  });
}

function ShowControl(controlDiv, map, marker) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '9px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to show or hide University marker';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '11px';
  controlText.style.padding = '8px';
  controlText.innerHTML = 'Hide University';
  controlUI.appendChild(controlText);

  // Setup the click event listeners:
  controlUI.addEventListener('click', function() {
    if (marker.map = null) {
      marker.setMap(map);
      controlText.innerHTML = 'Hide University';
    } else {
      marker.setMap(null);
      controlText.innerHTML = 'Show University';
    }
  });
}

function initMap() {
  //create map
  map = new google.maps.Map(document.getElementById('map'), {
    center: universityPos,
    zoom: 11
  });

  var uMarker = new google.maps.Marker({
    position: universityPos,
    map: map,
    icon: collegeIcon,
    title: 'UIC'
  });
  var yourMarker = new google.maps.Marker({
    position: actualPos,
    map: map,
    icon: youIcon,
    title: 'Your position'
  });

  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  // Create the DIV to hold the control and call the ShowControl()
  // constructor passing in this DIV.
  var showControlDiv = document.createElement('div');
  var showControl = new ShowControl(showControlDiv, map, uMarker);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  showControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(showControlDiv);

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
            title: dataLine.name
          });
          placeMarker.setMap(map);
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
      map: map,
      center: universityPos,
      radius: i * 6000 // Add a cicle every 5Km from the university
    });
  };
};
