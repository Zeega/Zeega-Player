require([
    // Application.
    "modules/player/player"
],
function( Zeega ) {
    window.Zeega = Zeega;
    // TODO: This might perform better if called as
    // $( window ).triggerHandler("zeega_ready");
    // Investigate whether bubbling is necessary

    var event;
    if (document.createEvent) {
        event = document.createEvent("HTMLEvents");
        event.initEvent("zeega_ready", true, true);
    } else {
        event = document.createEventObject();
        event.eventType = "zeega_ready";
    }
    event.eventName = "zeega_ready";
    if (document.createEvent) {
        window.dispatchEvent(event);
    } else {
        window.fireEvent("on" + event.eventType, event);
    }

    $.noConflict( true ); // return $ to prev owner

});
