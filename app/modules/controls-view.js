define([
    "zeega"
],
function( Zeega ) {

    return Zeega.Backbone.LayoutView.extend({

        template: "controls",
        className: "ZEEGA-basic-controls",

        initialize: function( args, options ) {
            this.model.on("frame_play", this.onFramePlay, this );
        },

        serialize: function() {
            return this.options.settings;
        },

        events: {
            "click .close": "close",
            "click .prev": "prev",
            "click .next": "next"
        },

        close: function() {
            this.model.destroy();
        },

        prev: function() {
            this.model.cuePrev();
        },

        next: function() {
            this.model.cueNext();
        },

        onFramePlay: function( info ) {
            switch(info._connections) {
                case "l":
                    this.activateArrow("prev");
                    this.disableArrow("next");
                    break;
                case "r":
                    this.disableArrow("prev");
                    this.activateArrow("next");
                    break;
                case "lr":
                    this.activateArrow("prev");
                    this.activateArrow("next");
                    break;
                default:
                    this.disableArrow("prev");
                    this.disableArrow("next");
            }
        },

        activateArrow: function(className) {
            this.$("."+ className +".disabled").removeClass("disabled");
        },

        disableArrow: function(className) {
            this.$("."+ className).addClass("disabled");
        },

        fetch: function( path ) {
            // Initialize done for use in async-mode
            var done;

            // Concatenate the file extension.
            path = "app/templates/"+ path + ".html";

            // If cached, use the compiled template.
            if ( JST[ path ] ) {
                return JST[ path ];
            } else {
                // Put fetch into `async-mode`.
                done = this.async();

                // Seek out the template asynchronously.
                return Zeega.$.ajax({ url: Zeega.root + path }).then(function(contents) {
                    done( JST[path] = _.template(contents) );
                });
            }
        }
    });

});
