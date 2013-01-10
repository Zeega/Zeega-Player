define([
    "zeega"
],
function( Zeega ) {
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
            this.setControls();
        },

        setControls: function() {
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

        resizeWindow: function() {
            // animate the window size in place
            var css = this.getWindowSize();
            this.$(".ZEEGA-player-window").animate( css );
            this.model.trigger( "window_resized", css );
            Zeega.trigger( "resize_window", css );
        },

        // calculate and return the correct window size for the player window
        // uses the player"s window_ratio a || 4/3ttribute
        getWindowSize: function() {
            // TODO: This could be refactored a bit more
            var css = {},
                windowRatio = this.model.get("window_ratio") || 4/3,
                winWidth = Zeega.$( this.model.get("target") ).find(".ZEEGA-player").width(),
                winHeight = Zeega.$( this.model.get("target") ).find(".ZEEGA-player").height(),
                actualRatio = winWidth / winHeight;

            if ( this.model.get("window_fit") ) {
                if ( actualRatio > windowRatio ) {
                    css.width = winWidth;
                    css.height = winWidth / windowRatio;
                } else {
                    css.width = winHeight * windowRatio;
                    css.height = winHeight;
                }
            } else {
                if ( actualRatio > windowRatio ) {
                    css.width = winHeight * windowRatio;
                    css.height = winHeight;
                } else {
                    css.width = winWidth;
                    css.height = winWidth / windowRatio;
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
