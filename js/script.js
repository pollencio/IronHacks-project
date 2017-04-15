$(document).on('ready', function() {

  $('.ui.sticky').sticky();
  $('.large.icon').popup();
});

$('.ui.map.button').on('click', function() {
  $(this).toggleClass('active');
});

$('#distance-btn').on('click', function() {
  if (mapCircles[0].map != null) {
    mapCircles.forEach(function(circle) {
      circle.setMap(null);
    });
  } else {
    mapCircles.forEach(function(circle) {
      circle.setMap(map);
    });
  }
});
