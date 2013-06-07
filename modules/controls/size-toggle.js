define([
    "player/app"
],
function( app ) {

    return app.Backbone.Layout.extend({
        template: "app/player/templates/controls/size-toggle",
        className: "ZEEGA-player-control controls-screen-toggle"
    });

});
