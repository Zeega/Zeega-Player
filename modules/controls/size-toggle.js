define([
    "player/app"
],
function( app ) {

    return app.Backbone.Layout.extend({
        template: "app/player/templates/controls/size-toggle",
        className: "ZEEGA-player-control controls-screen-toggle",

        initialize: function() {
            this.mobile = this.model.get("previewMode") == "mobile";
        },

        serialize: function() {
            return this.model.toJSON();
        },

        toggle: function() {
            this.$("i").tipsy("hide");

            this.mobile = !this.mobile;
            this.$("i")
                .toggleClass("size-toggle-laptop")
                .toggleClass("size-toggle-mobile");

            if ( this.mobile ) {
                this.$("i").attr("title", "Switch to laptop view");
            } else {
                this.$("i").attr("title", "Switch to mobile view");
            }
            // this.initTipsy();
        },

        afterRender: function() {
            this.initTipsy();

            this.$("i").tipsy("show");
            setTimeout(function() {
                // this.$("i").tipsy("hide");
            }.bind(this), 5000 );
        },

        initTipsy: function() {
            this.$("i").tipsy({
                fade: true,
                content: function() {
                    return $(this).attr("title");
                },
                gravity: function() {
                    return $(this).data("gravity") || "s";
                }
            });
        }
    });

});
