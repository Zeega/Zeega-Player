define([
    "player/app"
],
function( app ) {

    return app.Backbone.Layout.extend({
        template: "app/player/templates/controls/close",
        className: "controls-close"
    });

});
