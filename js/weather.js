var xmlhttp2 = new XMLHttpRequest();
var washedData2 = [];
var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=chicago&appid=6aa0bdb1f586c5630d60b6237dfce45c&cnt=16";
xmlhttp2.open("GET", url, true);
xmlhttp2.send();

xmlhttp2.onreadystatechange = function() {
  if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
    var myArr = xmlhttp2.responseText;
    var text = myArr;
    var json = JSON.parse(text);

    for (var i = 0; i<16; i++) {
      var forecastDay = new Date();
      forecastDay.setDate(forecastDay.getDate()+i);
      if (i!=0) { //set the time of the date to 12:00pm for other days after today
        forecastDay.setHours(12);
        forecastDay.setMinutes(0);
        forecastDay.setSeconds(0);
      }
      var dataLine = {
        date: forecastDay,
        forecast: json.list[i].weather[0].main,
        description: json.list[i].weather[0].description,
        iconURL: "http://openweathermap.org/img/w/" + json.list[i].weather[0].icon + ".png"
      };

      washedData2.push(dataLine);
    };
  }
};

Vue.component('weather-forecast', {
  props: ['day'],
  template:
    `<div class="ui icon purple message">
      <img class="icon" v-bind:src=day.iconURL></img>
      <div class="content">
        <div class="header">It's a {{ day.forecast }} day</div>
        <p>{{ day.description }}</p>
      </div>
    </div>`
});

var modal = new Vue({
  el: '#modal',
  data: {
    selectedDate: today,
    actualPosition: '',
    destination: '4444 W. Lawrence Ave.',
    weatherList: washedData2
  },
  methods: {
    selectedDayWeather: function (weatherList) {
      return weatherList.filter(function (item) {
        return item.date.toDateString() == new Date($('#calendar').calendar('get date')).toDateString()
      })
    },
    selectedDateString: function () {
      return this.selectedDate.toDateString();
    }
  }
});

$(document).on('ready', function() {

  $('#calendar').calendar({
    type: 'date',
    disableMinute: true,
    inline: true,
    initialDate: today,
    maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
    minDate: today,
    onChange: function (date, text, mode) {
      modal.selectedDate = new Date($('#calendar').calendar('get date'));
    }
  });

  $('#calendar').calendar('set date', today);
  $('#calendar').calendar('set date', today);

});
