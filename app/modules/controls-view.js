define([
    "zeega"
],
function( Zeega ) {

    return Zeega.Backbone.LayoutView.extend({

        template: "controls",
        className: "ZEEGA-basic-controls",

        initialize: function( args, options ) {
            this.model.on("frame_play", this.onFramePlay, this );
            this.model.on("play", this.onPlay, this );
            this.model.on("pause", this.onPause, this );
        },

        serialize: function() {
            return _.defaults( this.options.settings, {
                arrows: true,
                close: true,
                playpause: true
            });
        },

        events: {
            "click .ZEEGA-close": "close",
            "click .ZEEGA-prev": "prev",
            "click .ZEEGA-next": "next",
            "click .ZEEGA-playpause": "playpause"
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
                    this.activateArrow("ZEEGA-prev");
                    this.disableArrow("ZEEGA-next");
                    break;
                case "r":
                    this.disableArrow("ZEEGA-prev");
                    this.activateArrow("ZEEGA-next");
                    break;
                case "lr":
                    this.activateArrow("ZEEGA-prev");
                    this.activateArrow("ZEEGA-next");
                    break;
                default:
                    this.disableArrow("ZEEGA-prev");
                    this.disableArrow("ZEEGA-next");
            }
        },

        onPlay: function() {
            this.$(".ZEEGA-playpause")
                .addClass("pause-zcon")
                .removeClass("play-zcon");
        },
        
        onPause: function() {
            this.$(".ZEEGA-playpause")
                .addClass("play-zcon")
                .removeClass("pause-zcon");
        },

        playpause: function() {
            this.model.playPause();
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
