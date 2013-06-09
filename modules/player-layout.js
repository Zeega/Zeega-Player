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

        mobileView: true,
        mobileOrientation: "portrait", // "landscape"

        initialize: function() {
            // debounce the resize function so it doesn"t bog down the browser
            var divId = this.model.get("divId"),
                lazyResize = _.debounce(function() {
                    this.resizeWindow();
                }.bind(this), 300);

            this.mobileView = this.model.get("previewMode") == "mobile";

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

        toggleSize: function() {
            this.mobileView = !this.mobileView;
            if ( this.mobileView ) {
                this.$(".ZEEGA-player-wrapper").css( this.getPlayerSize() );
            } else {
                this.$(".ZEEGA-player-wrapper").css( this.getWrapperSize() );
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
            var windowRatio, screenRatio, winHeight, winWidth,
                css = {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                };

            winHeight = app.$( this.model.get("target") ).find(".ZEEGA-player").height();
            winWidth = app.$( this.model.get("target") ).find(".ZEEGA-player").width();

            windowRatio = this.model.get("windowRatio");
            screenRatio = winWidth / winHeight;

            if ( this.mobileView ) {
                if ( screenRatio < windowRatio ) { // vertical
                    var wrapperHeight = ( winWidth / windowRatio ) * 1.1326;

                    css.width = winWidth;
                    css.height = winWidth / windowRatio;
                    css.top = (wrapperHeight - css.height) / 2;
                } else { // portrait
                    css.height = winHeight;
                    css.width = css.height * windowRatio;
                    css.top = 0;
                }
            } else {
                css.width = winHeight * windowRatio;
                css.height = winHeight;
                css.top = (winHeight - css.height) / 2;
            }

            css.fontSize = ( css.width / 520 ) +'em';

            return css;
        },

        // calculate and return the correct window size for the player window
        getWrapperSize: function() {
            var windowRatio, winWidth, winHeight, screenRatio, playerMaxWidth, playerMinWidth,
                css = {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                };

            windowRatio = this.model.get("windowRatio");
            winWidth = app.$( this.model.get("target") ).find(".ZEEGA-player").width();
            winHeight = app.$( this.model.get("target") ).find(".ZEEGA-player").height();
            screenRatio = winWidth / winHeight;

            playerMaxWidth = winHeight * (16/9);
            playerMinWidth = winHeight * windowRatio;

            if ( this.model.get("mobile") ) {
                css.width = winWidth;
                css.height = ( winWidth / windowRatio ) * 1.1326;

                if ( screenRatio < windowRatio ) { // vertical
                    css.top = ( winHeight - css.height ) / 2;
                } else { // portrait
                    css.top = 0;
                }
                
            } else {
                css.width = winWidth < playerMaxWidth ? winWidth : playerMaxWidth;
                css.height = winHeight;
                css.top = (winHeight - css.height) / 2;
            }

            // Append unit to calculated value
            css.width += "px";
            css.height += "px";

            return css;
        }
    });

    return Player;
});
