define([
    "zeega",
    "zeega_dir/plugins/layers/_all"
],

function( Zeega, Plugin ) {

    var Layer = Zeega.module();

    var LayerModel = Zeega.Backbone.Model.extend({

        ready: false,
        state: "waiting", // waiting, loading, ready, destroyed, error

        defaults: {
            mode: "player"
        },

        initialize: function() {
            var plugin = Plugin[ this.get("type") ];

            // init link layer type inside here
            if ( plugin ) {
                this.layerClass = new plugin();
                this.set( _.defaults( this.toJSON(), this.layerClass.defaults ) );

                // create and store the layerClass
                this.visualElement = new plugin.Visual({
                    model: this,
                    attributes: {
                        "id": "visual-element-" + this.id,
                        "data-layer_id": this.id
                    }
                });
                // listen to visual element events
                this.on( "visual_ready", this.onVisualReady, this );
                this.on( "visual_error", this.onVisualError, this );
            } else {
                this.ready = true;
                this.state = "error";
                console.log( "could not find valid layer type: ", this.get("type") );
            }
        },

        render: function() {
            // make sure the layer class is loaded or fail gracefully
            if ( this.visualElement ) {
                // if the layer is ready, then just show it
                if ( this.state == "waiting") {
                    this.state = "loading";
                    this.status.emit("layer_loading", this.toJSON());
                    this.visualElement.player_onPreload();
                } else if( this.state == "ready" ) {
                    this.visualElement.play();
                }
            } else {
                console.log("***    The layer "+ this.get("type") +" is missing. ): ", this.id);
            }
        },

        onVisualReady: function() {
            this.ready = true;
            this.state = "ready";
            this.trigger("layer_ready", this.toJSON());
        },

        onVisualError: function() {
            this.ready = true;
            this.state = "error";
            this.trigger("layer_error", this.toJSON());
        },

        updateZIndex: function(z) {
            this.visualElement.updateZIndex(z);
        },

        pause: function() {
            this.visualElement.player_onPause();
        },

        play: function() {
            this.visualElement.player_onPlay();
        },

        exit: function() {
            if ( this.layerClass ) {
                this.visualElement.player_onExit();
            }
        },

        remove: function() {
            if ( this.layerClass ) {
                this.visualElement.remove();
            }
        },

        // removes the layer. destroys players, removes from dom, etc
        destroy: function() {
            // do not attempt to destroy if the layer is waiting or destroyed
            if ( this.state != "waiting" && this.state != "destroyed" ) {
                this.state = "destroyed";
            }
        }
    });

    Layer.Collection = Zeega.Backbone.Collection.extend({
        model: LayerModel
    });

    return Layer;
});
