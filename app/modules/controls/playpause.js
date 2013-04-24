define([
    "app"
],
function( app ) {

    return app.Backbone.LayoutView.extend({
        template: "controls/playpause",
        className: "controls-playpause"
    });

});
