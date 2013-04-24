define([
    "app"
],
function( app ) {

    return app.Backbone.LayoutView.extend({
        template: "controls/close",
        className: "controls-close"
    });

});
