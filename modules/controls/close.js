define([
    "app"
],
function( app ) {

    return app.Backbone.Layout.extend({
        template: "app/player/templates/controls/close",
        className: "ZEEGA-player-control  controls-close"
    });

});
