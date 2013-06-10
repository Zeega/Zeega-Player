define([
    "player/app"
],
function( app ) {

    return app.Backbone.Layout.extend({
        template: "app/player/templates/controls/size-toggle",
        className: "ZEEGA-player-control controls-screen-toggle",

        serialize: function() {
            return this.model.toJSON();
        }
    });

});
