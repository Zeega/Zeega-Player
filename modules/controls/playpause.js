define([
    "player/app"
],
function( app ) {

    return app.Backbone.Layout.extend({
        template: "app/player/templates/controls/playpause",
        className: "controls-playpause"
    });

});
