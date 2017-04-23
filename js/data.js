var today = new Date();

var url = "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD"
var washedData = [];

$.getJSON(url, function( json ) {
  for (var i = 0; i<5; i++) {
    var PILurl = 'https://api.placeilive.com/v1/houses/search?ll=' + json.data[i][19] + ',' + json.data[i][20];
    var location = {lat: parseFloat(json.data[i][19]), lng: parseFloat(json.data[i][20])};
    var universityPos = {lat: 41.8708, lng: -87.6505};

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
      location: location,
      imageURL: 'https://maps.googleapis.com/maps/api/streetview?' +
              'location=' + json.data[i][12] +
              '&size=600x300' +
              '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA',
      state: '',
      description: '',
      price: '',
      distance: '',
      security: '',
      travelData: [],
      ratings: []
    };

    //get zillow data
    var Zurl = 'http://campuapi.azurewebsites.net/Home/ZillowApi?url=GetSearchResults.htm?zws-id=X1-ZWz199gokqk5xn_7oq0o$address=2114+Bigelow+Ave$citystatezip=Seattle%2C+WA';
    // setPrice(Zurl, dataLine);

    //get travel data
    var service = new google.maps.DistanceMatrixService();
    setTravelTimes(dataLine, service);

    //get security data
    location = new google.maps.LatLng(location.lat, location.lng);
    console.log(getNearCrimeNumber(location));

    washedData.push(dataLine);
  }
});

Vue.component('data-item', {
  props: ['data'],
  template:
    `<div class="ui card" v-bind:class=data.state v-on:click="selectPlace(data)">
      <div class="ui image">
        <img v-bind:src=data.imageURL></img>
      </div>
      <div class="content">
        <div class="header">{{ data.name }}</div>
        <p>{{ data.address }}</p>
      </div>
      <div class="ui bottom attached buttons">
        <div class="ui primary button" v-on:click="showVisitWindow()"><i class="marker icon"></i> Visit </div>
        <div class="ui button" v-on:click="showViewDetails(data)">View <i class="right chevron icon"></i></div>
      </div>
    </div>`,
    methods: {
      showVisitWindow: function() {
        $('#modal').modal('show');
      },
      showViewDetails: function(dataItem) {
        this.selectPlace(dataItem);
        dataContainer.activateButton(dataContainer.buttonsList[1]);
      },
      selectPlace: function(dataItem) {
        selectPlace(dataItem);
      }
    }
});

Vue.component('travel-data-item', {
  props: ['data'],
  template:
    `<div class="column">
      <i v-bind:class="data.icon"></i>
      {{ data.t }}
    </div>`
});

Vue.component('rating-item', {
  props: ['data'],
  template:
    `<div>
      <div class="label">{{ data.name }} Rating</div>
      <div class="ui progress" v-bind:class="data.color">
        <div class="bar"></div>
      </div>
    </div>`
});

var dataContainer = new Vue({
  el: '#data-container',
  data: {
    content: 'places',
    placesList: washedData,
    selectedPlace: '',
    selectedTravelData: '',
    buttonsList: [
      {
        name: 'places',
        state: 'active',
        text: 'Places',
        icon: 'home icon'
      },
      {
        name: 'details',
        state: '',
        text: 'Details',
        icon: 'bars icon'
      },
      {
        name: 'statistics',
        state: '',
        text: 'Statistics',
        icon: 'bar chart icon'
      },
      {
        name: 'wish',
        state: '',
        text: '',
        icon: 'heart icon'
      },
      {
        name: 'lucky',
        state: '',
        text: '',
        icon: 'star icon'
      }
    ]
  },
  methods: {
    activateButton: function (button) {
      for (var i = 0; i < this.buttonsList.length; i++) {
        if (this.buttonsList[i] === button) {
          this.buttonsList[i].state = 'active';
        } else {
          this.buttonsList[i].state = '';
        }
      }
      this.content = button.name;
    },
    showVisitWindow: function() {
      $('#modal').modal('show');
    },
    getPlacesLocations: function() {
      var places = [];
      for (var dataItem in this.placesList) {
        var location = {lat: parseInt(dataItem.latitude), lng: parseInt(dataItem.longitude)}
        places.push(location);
      }
      return places;
    }
  }
});

function getPlace(location) {
  return dataContainer.placesList.filter(function (item) {
    return item.address == location
  })
}

function selectPlace(dataItem) {
  dataContainer.selectedPlace = dataItem;
  modal.destination = dataItem.address;
  modal.destinationName = dataItem.name;
  for (var i = 0; i < dataContainer.placesList.length; i++) {
    if (dataContainer.placesList[i] === dataItem) {
      dataContainer.placesList[i].state = 'active';
    } else {
      dataContainer.placesList[i].state = '';
    }
  }
  var location = {lat: parseFloat(dataItem.latitude), lng: parseFloat(dataItem.longitude)};
  selectMapPlace(location, map, dataItem.name, dataItem.address);
}

function setPrice(Zurl, place) {
  var Zrequest = new XMLHttpRequest();
  Zrequest.open("GET", Zurl, true);
  console.log(Zrequest.readyState + ' ' + Zrequest.status);
  Zrequest.onreadystatechange = function () {
    if (Zrequest.readyState == 4 && Zrequest.status == 200) {
      var xml = Zrequest.responseXML;
      var x = xml.getElementsByTagName('amount');
      for(i=0; i<x.length; i++) {
        console.log(x.item(i).textContent);
        place.price = x.item(i).textContent;
      }
    }
  };
}

function setTravelTimes(place, service) {
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
  var location = place.location;
  var travelData = [];
  list.forEach(function(item) {
    service.getDistanceMatrix({
      origins: [{lat: 41.85081542, lng: -87.69123528}],
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
      // place.ratings.push((100 - result.distance.value / 270).toFixed(1));
    });
  });
  place.travelData = travelData;
  var p1 = new google.maps.LatLng(41.85081542, -87.69123528);
  var p2 = new google.maps.LatLng(location.lat, location.lng);
  distance = getDistance(p1, p2);
  place.distance = distance + 'Km';
  place.ratings.push((100 - distance / 0.270).toFixed(1));
};

var rad = function(x) { return x * Math.PI / 180; };

function getDistance(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c / 1000;
  return d.toFixed(2); // returns the distance in meter
}

function getNearCrimeNumber(apartmentLocation) {
  var count = 0;
  crimesData.forEach(function(crimeLocation) {
    console.log('crime: ' + crimeLocation.lat() + ', ' + crimeLocation.lng());
    console.log('apartment: ' + apartmentLocation.lat() + ', ' + apartmentLocation.lng());
    if(getDistance(apartmentLocation, crimeLocation) <= 2) {
      count ++;
    }
  });
  return count;
}
