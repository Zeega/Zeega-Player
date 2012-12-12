require([
    // Application.
    "modules/player/player"
],
function( Zeega ) {
    window.Zeega = Zeega;
    // TODO: This might perform better if called as
    // $( window ).triggerHandler("zeega_ready");
    // Investigate whether bubbling is necessary
    $( window ).trigger("zeega_ready");
});
