require([
  // Application.
  "modules/player/player"
],
function(Zeega){
  window.Zeega = Zeega || {};
  $(window).trigger('zeega_ready');
});
