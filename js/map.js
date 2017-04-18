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
var universityPos ={lat: 41.85081542, lng: -87.69123528};
var actualPos = {lat: 41.807846, lng: -87.664140};

// Map elements
var map;
var service;
var securityHeatmap;
var mapDistanceCircles = [];

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
  service = new google.maps.DistanceMatrixService();

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
    title: 'University of Illinois in Chicago',
    icon: iconURL+'college.png'
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('University of Illinois in Chicago');
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
            infowindow.setContent(entry[names[0]]);
            infowindow.open(map, marker);
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
          infowindow.setContent(entry[names[0]]);
          infowindow.open(map, marker);
        });
        markers.push(marker);
      });
    }
  });
}

function setPlaceData (markers, icon, array) {
  // $.getJSON("https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD", function( json ) {
  //   for (var i = 0; i<20; i++) {
  //     // var location = new google.maps.LatLng(parseFloat(json.data[i][19]),parseFloat(json.data[i][19]));
  //     var location = {lat: parseFloat(json.data[i][19]), lng: parseFloat(json.data[i][20])};
  //     // Markers
  //     var marker = new google.maps.Marker({
  //       position: location,
  //       map: null,
  //       title: json.data[i][11],
  //       icon: iconURL + icon + '.png'
  //     });
  //     google.maps.event.addListener(marker, 'click', function() {
  //       infowindow.setContent('<b>'+json.data[i][11]+'</b><br>'+json.data[i][12]);
  //       infowindow.open(map, marker);
  //     });
  //     markers.push(marker);
  //     // Data
  //     var PILurl = 'https://api.placeilive.com/v1/houses/search?ll=' + json.data[i][19] + ',' + json.data[i][20];
  //
  //     var dataLine = {
  //       name: json.data[i][11],
  //       address: json.data[i][12],
  //       phone: json.data[i][14],
  //       type: json.data[i][10],
  //       number: json.data[i][16],
  //       area: json.data[i][8],
  //       company: json.data[i][15],
  //       latitude: json.data[i][19],
  //       longitude: json.data[i][20],
  //       location: location,
  //       imageURL: 'https://maps.googleapis.com/maps/api/streetview?' +
  //               'location=' + json.data[i][12] +
  //               '&size=600x300' +
  //               '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA',
  //       state: '',
  //       description: '',
  //       price: '',
  //       travelData: [],
  //       ratings: []
  //     };
  //
  //     array.push(dataLine);
  //   }
  // });
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
        infowindow.setContent('<b>'+entry.property_name+'</b><br>'+entry.address);
        infowindow.open(map, marker);
      });
      markers.push(marker);
      // data
      var dataLine = {
        name: entry.property_name,
        address: entry.address,
        units: entry.units,
        phone: entry.phone_number,
        company: entry.management_company,
        area: entry.community_area,
        type: entry.property_type,
        latitude: location.lat(),
        longitude: location.lng(),
        location: location,
        imageURL: 'https://maps.googleapis.com/maps/api/streetview?' +
                'location=' + entry.address +
                '&size=600x300' +
                '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA',
        state: '',
        price: '',
        travelData: [],
        ratings: []
      };
      array.push(dataLine);
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
        infowindow.setContent('<b>'+entry.primary_type+'-'+entry.description+'</b><br>Location: '+entry.location_description+'<br>Date: '+entry.date);
        infowindow.open(map, marker);
      });
      markers.push(marker);
      array.push(location);
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

// Methods
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
      placeMarker.setIcon(iconURL+'shome.png');
      placeMarker.setMap(map);
    } else {
      placeMarker.setIcon(iconURL+'home.png');
    }
  })
}

function setTravelTimes(place) {
  var list = [
    {
      mode: 'DRIVING',
      icon: 'car'
    },
    {
      mode: 'TRANSIT',
      icon: 'subway'
    },
    {
      mode: 'WALKING',
      icon: 'street view'
    },
    {
      mode: 'BICYCLING',
      icon: 'bicycle'
    }
  ];
  // placesList.forEach(function(place) {
    var location = place.location;
    var travelData = [];
    list.forEach(function(item) {
      service.getDistanceMatrix({
        origins: [universityPos],
        destinations: [location],
        travelMode: item.mode,
        transitOptions: {
          modes: ['SUBWAY']
        }
      }, function(response, status) {
        var result;
        if (status !== 'OK') {
          alert('Error was: ' + status);
        } else {
          result = response.rows[0].elements[0];
        }
        travelData.push({d: result.distance.text, t: result.duration.text, icon: 'large ' + item.icon + ' icon'});
        place.ratings.push((result.distance.value / 270).toFixed(1));
      });
    });
    var PILurl = 'https://api.placeilive.com/v1/houses/search?ll=' + location.lat + ',' + location.lng;
    place.travelData = travelData;
    $.getJSON(PILurl, function(data, textstatus) {
      console.log(data);
    });
  // });
};
