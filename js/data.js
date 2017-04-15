var today = new Date();

var xmlhttp = new XMLHttpRequest();
var url = "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD"
xmlhttp.open("GET", url, true);
xmlhttp.send();
var washedData = [];
var travelData = [];

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
            imageURL: 'https://maps.googleapis.com/maps/api/streetview?' +
                    'location=' + json.data[i][12] +
                    '&size=600x300' +
                    '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA',
            state: '',
            description: '',
            price: ''
          };
          washedData.push(dataLine);
        };
    }
};

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
        <div class="ui primary button" v-on:click="showVisitWindow(data)"><i class="marker icon"></i> Visit </div>
        <div class="ui button" v-on:click="showViewDetails(data)">View <i class="right chevron icon"></i></div>
      </div>
    </div>`,
    methods: {
      showVisitWindow: function(dataItem) {
        modal.destination = dataItem.address;
        $('#modal').modal('show');
      },
      showViewDetails: function(dataItem) {
        this.selectPlace(dataItem);
        dataContainer.activateButton(dataContainer.buttonsList[1]);
      },
      selectPlace: function(dataItem) {
        for (var i = 0; i < dataContainer.placesList.length; i++) {
          if (dataContainer.placesList[i] === dataItem) {
            dataContainer.placesList[i].state = 'active';
          } else {
            dataContainer.placesList[i].state = '';
          }
        }
        dataContainer.selectedPlace = dataItem;
        var location = {lat: parseFloat(dataItem.latitude), lng: parseFloat(dataItem.longitude)};
        selectMapPlace(location, map);
      }
    }
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
        text: 'Available Places',
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
    showVisitWindow: function(dataItem) {
      modal.destination = dataItem.address;
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
