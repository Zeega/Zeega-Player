define([
    "zeega",
    "modules/controls-view"
],
function( Zeega, ControlsView ) {
    /*
        the player layout

        # contains resize logic
        # renders the window target for frames/layers

    */
    var Player = {};

    Player.Layout = Zeega.Backbone.Layout.extend({

        fetch: function( path ) {
            // Initialize done for use in async-mode
            var done;

            // Concatenate the file extension.
            path = "app/templates/layouts/"+ path + ".html";

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
        },

        template: "player-layout",
        className: "ZEEGA-player",

        initialize: function() {
            // debounce the resize function so it doesn"t bog down the browser
            var divId = this.model.get("divId"),
                lazyResize = _.debounce(function() {
                    this.resizeWindow();
                }.bind(this), 300);

            // attempt to detect if the parent container is being resized
            Zeega.$( window ).resize( lazyResize );
        },

        serialize: function() {
            return this.model.toJSON();
        },

        afterRender: function() {
            // correctly size the player window
            this.$(".ZEEGA-player-window").css( this.getWindowSize() );
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
                Zeega.$( next ).click(function() {
                    _this.model.cueNext();
                    return false;
                });
            }
            if ( prev && prev.length ) {
                Zeega.$( prev ).click(function() {
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
            var css = this.getWindowSize();
            this.$(".ZEEGA-player-window").animate( css );
            this.model.trigger( "window_resized", css );
            Zeega.trigger( "resize_window", css );
        },

        // calculate and return the correct window size for the player window
        getWindowSize: function() {
            var windowRatio, winWidth, winHeight, actualRatio,
                css = {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0
                };

            windowRatio = this.model.get("windowRatio");
            winWidth = Zeega.$( this.model.get("target") ).find(".ZEEGA-player").width();
            winHeight = Zeega.$( this.model.get("target") ).find(".ZEEGA-player").height();
            actualRatio = winWidth / winHeight;

            if ( this.model.get("cover") === true ) {
                if ( actualRatio > windowRatio ) { // width > height // fit left & right
                    css.width = winWidth;
                    css.height = winWidth / windowRatio;
                    css.top = (winHeight - css.height) / 2;
                } else if ( this.model.get("cover") == "vertical" ) {
                    css.width = winHeight * windowRatio;
                    css.height = winHeight;
                    css.left = (winWidth - css.width) / 2;
                } else { // width < height
                    css.width = winHeight * windowRatio;
                    css.height = winHeight;
                    css.left = (winWidth - css.width) / 2;
                }
            } else if ( this.model.get("cover") === false ) {
                if ( actualRatio > windowRatio ) { // width > height
                    css.width = winHeight * windowRatio;
                    css.height = winHeight;
                } else { // width < height
                    css.width = winWidth;
                    css.height = winWidth / windowRatio;
                    css.top = (winHeight - css.height) / 2;
                }
            } else {
                if ( this.model.get("cover") == "horizontal" ) { // width > height // fit left & right
                    css.width = winWidth;
                    css.height = winWidth / windowRatio;
                    css.top = (winHeight - css.height) / 2;
                } else if ( this.model.get("cover") == "vertical" ) {
                    var left = ( winWidth - winHeight * windowRatio ) / 2;

                    css.width = winHeight * windowRatio;
                    css.height = winHeight;
                    css.left = left < 0 ? left : 0;
                }
            }

            css.fontSize = ( css.width / 520 ) +'em';

            // Append unit to calculated value
            css.width += "px";
            css.height += "px";

            return css;
        }
    });

    return Player;
});
