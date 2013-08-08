define([
    "app",
    "player/modules/controls/arrows",
    "player/modules/controls/close",
    "player/modules/controls/playpause",
    "player/modules/controls/size-toggle"
],
function( app, ArrowView, CloseView, PlayPauseView, SizeToggle ) {

    return app.Backbone.Layout.extend({

        className: "ZEEGA-basic-controls",
        manage: true,

        initialize: function( args, options ) {

            this.model.on("page:play", this.onFramePlay, this );
            this.model.on("play", this.onPlay, this );
            this.model.on("pause", this.onPause, this );

            this.model.on("player_destroyed", this.cleanup, this );
        },

        beforeRender: function() {
            if ( this.options.settings.close ) {
                this.insertView( new CloseView() );
            }
            if ( this.options.settings.arrows ) {
                this.insertView( new ArrowView() );
            }

            if ( this.options.settings.playpause ) {
                this.insertView( new PlayPauseView() );
            }

            if ( this.options.settings.sizeToggle ) {
                this.sizeToggle = new SizeToggle({ model: this.model });
                this.insertView( this.sizeToggle );
            }
        },

        afterRender: function() {
            this.onFramePlay()
        },

        events: {
            "click .ZEEGA-close": "close",
            "click .ZEEGA-prev": "prev",
            "click .ZEEGA-next": "next",
            "click .ZEEGA-playpause": "playpause",
            "click .size-toggle": "toggleSize"
        },

        toggleSize: function( event ) {
            this.model.toggleSize();
            this.model.trigger("size_toggle");

            this.sizeToggle.toggle();
        },

        close: function( event ) {
            event.preventDefault();
            this.model.destroy();
        },

        prev: function( event ) {
            event.preventDefault();
            this.model.cuePrev();
        },

        next: function( event ) {
            event.preventDefault();
            this.model.cueNext();
        },
       
        onFramePlay: function() {
            if( this.model.zeega.getPreviousPage() ){
                this.activateArrow("ZEEGA-prev");
            } else {
                this.disableArrow("ZEEGA-prev");
            }

            if( this.model.zeega.getNextPage() ){
                this.activateArrow("ZEEGA-next");
            } else {
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

        playpause: function( event ) {
            event.preventDefault();
            this.model.playPause();
        },

        activateArrow: function(className) {
            this.$("."+ className +".disabled").removeClass("disabled");
        },

        disableArrow: function(className) {
            this.$("."+ className).addClass("disabled");
        },

        cleanup: function() {
            $(".tipsy").remove();
        }

    });

});
