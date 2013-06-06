define([
    "player/app",
    "player/modules/controls-view"
],
function( app, ControlsView ) {
    /*
        the player layout

        # contains resize logic
        # renders the window target for frames/layers

    */
    var Player = {};

    Player.Layout = app.Backbone.Layout.extend({

        template: "app/player/templates/layouts/player-layout",
        className: "ZEEGA-player",

        initialize: function() {
            // debounce the resize function so it doesn"t bog down the browser
            var divId = this.model.get("divId"),
                lazyResize = _.debounce(function() {
                    this.resizeWindow();
                }.bind(this), 300);

            // attempt to detect if the parent container is being resized
            app.$( window ).resize( lazyResize );
        },

        serialize: function() {
            return this.model.toJSON();
        },

        afterRender: function() {
            // correctly size the player window
            this.$(".ZEEGA-player-wrapper").css( this.getWrapperSize() );
            this.$(".ZEEGA-player-window").css( this.getPlayerSize() );

            this.setPrevNext();
            this.renderControls();
        },

        setPrevNext: function() {
            // TODO: Investigate whether or not this-alias can be safely
            // replaced by bind(this)
            var next = this.model.get("next"),
                prev = this.model.get("prev"),
                _this = this;

            if ( next && next.length ) {
                app.$( next ).click(function() {
                    _this.model.cueNext();
                    return false;
                });
            }
            if ( prev && prev.length ) {
                app.$( prev ).click(function() {
                    _this.model.cuePrev();
                    return false;
                });
            }
        },

        renderControls: function() {
            var controlSettings = this.model.get("controls");

            if ( _.isObject( controlSettings ) || controlSettings === true ) {

                if ( controlSettings === true ) {
                    controlSettings = {
                        close: true,
                        arrows: true,
                        playpause: true
                    };
                } else if ( controlSettings === false ) {
                    controlSettings = {
                        arrows: false,
                        close: false,
                        playpause: falsed
                    };
                }

                this.controls = new ControlsView({ model: this.model, settings: controlSettings });

                this.$el.prepend( this.controls.el );
                this.controls.render();
            }
        },

        resizeWindow: function() {
            // animate the window size in place
            var css = this.getWrapperSize();

            this.$(".ZEEGA-player-wrapper").css( css );
            this.$(".ZEEGA-player-window").css( this.getPlayerSize() );
            
            this.model.trigger( "window_resized", css );
            app.trigger( "resize_window", css );
        },

        getPlayerSize: function() {
            var windowRatio, winHeight,
                css = {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                };

            windowRatio = this.model.get("windowRatio");
            winHeight = app.$( this.model.get("target") ).find(".ZEEGA-player").height();

            css.width = winHeight * windowRatio;
            css.height = winHeight;
            css.top = (winHeight - css.height) / 2;

            return css;
        },

        // calculate and return the correct window size for the player window
        getWrapperSize: function() {
            var windowRatio, winWidth, winHeight, actualRatio, playerMaxWidth, playerMinWidth,
                css = {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                };

            windowRatio = this.model.get("windowRatio");
            winWidth = app.$( this.model.get("target") ).find(".ZEEGA-player").width();
            winHeight = app.$( this.model.get("target") ).find(".ZEEGA-player").height();
            actualRatio = winWidth / winHeight;

            playerMaxWidth = winHeight * (16/9);
            playerMinWidth = winHeight * windowRatio;


            if ( this.model.get("mobile") ) {

            } else {
                // if ( actualRatio > windowRatio ) {           // width > height // fit left & right
                    css.width = winWidth < playerMaxWidth ? winWidth : playerMaxWidth;
                    css.height = winHeight;
                    css.top = (winHeight - css.height) / 2;
                // } else {                                     // width < height
                //     css.width = winHeight * windowRatio;
                //     css.height = winHeight;
                //     css.left = (winWidth - css.width) / 2;
                // }
            }

            // if ( this.model.get("cover") === true ) {
            //     if ( actualRatio > windowRatio ) { // width > height // fit left & right
            //         css.width = winWidth;
            //         css.height = winWidth / windowRatio;
            //         css.top = (winHeight - css.height) / 2;
            //     } else if ( this.model.get("cover") == "vertical" ) {
            //         css.width = winHeight * windowRatio;
            //         css.height = winHeight;
            //         css.left = (winWidth - css.width) / 2;
            //     } else { // width < height
            //         css.width = winHeight * windowRatio;
            //         css.height = winHeight;
            //         css.left = (winWidth - css.width) / 2;
            //     }
            // } else if ( this.model.get("cover") === false ) {
            //     if ( actualRatio > windowRatio ) { // width > height
            //         css.width = winHeight * windowRatio;
            //         css.height = winHeight;
            //     } else { // width < height
            //         css.width = winWidth;
            //         css.height = winWidth / windowRatio;
            //         css.top = (winHeight - css.height) / 2;
            //     }
            // } else {
            //     if ( this.model.get("cover") == "horizontal" ) { // width > height // fit left & right
            //         css.width = winWidth;
            //         css.height = winWidth / windowRatio;
            //         css.top = (winHeight - css.height) / 2;
            //     } else if ( this.model.get("cover") == "vertical" ) {
            //         var left = ( winWidth - winHeight * windowRatio ) / 2;

            //         css.width = winHeight * windowRatio;
            //         css.height = winHeight;
            //         css.left = left < 0 ? left : 0;
            //     }
            // }

            css.fontSize = ( css.width / 520 ) +'em';

            // Append unit to calculated value
            css.width += "px";
            css.height += "px";

            return css;
        }
    });

    return Player;
});
