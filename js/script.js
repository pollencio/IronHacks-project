$(document).on('ready', function() {

  $('.ui.sticky').sticky();

  $('.ui.rating').rating();

  $('.card').popup({inline: true});

  $('.ui.dropdown').dropdown();

  // $('#welcome_modal').modal('show');

  // var Zurl = 'http://campuapi.azurewebsites.net/Home/ZillowApi?url=GetSearchResults.htm?zws-id=X1-ZWz199gokqk5xn_7oq0o$address=2114+Bigelow+Ave$citystatezip=Seattle%2C+WA';
  // var price;
  // getZillowData(Zurl, price);
  // console.log(price);

});

$('.ui.map.button').on('click', function() {
  $(this).toggleClass('active');
});

$('#distance-btn').on('click', function() {
  if (mapDistanceCircles[0].map != null) {
    mapDistanceCircles.forEach(function(circle) {
      circle.setMap(null);
    });
  } else {
    mapDistanceCircles.forEach(function(circle) {
      circle.setMap(map);
    });
    map.setZoom(10);
    centerMap(universityPos, map);
  }
});

$('#security-btn').on('click', function() {
  if (securityHeatmap.map != null) {
    securityHeatmap.setMap(null);
  } else {
    securityHeatmap.setMap(map);
    centerMap(universityPos, map);
    map.setZoom(10);
  }
});

$('#price-btn').on('click', function() {
})
