define([
    "app"
],
function( app ) {

    return app.Backbone.Layout.extend({
        template: "app/player/templates/controls/arrows",
        className: "ZEEGA-player-control controls-arrows"
    });

});
