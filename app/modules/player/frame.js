define([
    "zeega",
    "zeega_dir/player/layer"
],

function( Zeega, Layer ) {

    var Frame = Zeega.module();

    var FrameModel = Zeega.Backbone.Model.extend({

        ready: false,
        // waiting, loading, ready, destroyed
        state: "waiting",
        hasPlayed: false,
        elapsed: 0,

        // frame render as soon as it's loaded. used primarily for the initial frame
        renderOnReady: null,

        defaults: {
            attr: { advance: 0 },
            // ids of frames and their common layers for loading
            common_layers: {},
            // ids of layers contained on frame
            layers: [],
            // ids of frames this frame can lead to
            link_to: [],
            // ids of frames this frame can be accessed from
            link_from: [],

            preload_frames: [],
            // id of the next frame
            _next: null,
            // id of the previous frame
            _prev: null
        },

        // for convenience
        getNext: function() {
            return this.get("_next");
        },

        getPrev: function() {
            return this.get("_prev");
        },

        // sets the sequence adjacencies as a string
        setConnections: function() {
            var prev = this.get("_prev"),
                next = this.get("_next");

            this.set( "connections",
                prev & next ? "lr" :
                prev ? "l" :
                next ? "r" : "none"
            );
        },

        preload: function() {
            if ( !this.ready ) {
                this.layers.each(function( layer ) {
                    if ( layer.state === "waiting" || layer.state === "loading" ) {
                        layer.on( "layer_ready", this.onLayerReady, this );
                        layer.render();
                    }
                }, this );
            }
        },

        // render from frame.
        render: function( oldID ) {
            var commonLayers;
            // if frame is completely loaded, then just render it
            // else try preloading the layers
            if ( this.ready ) {
                // only render non-common layers. allows for persistent layers
                commonLayers = this.get("common_layers")[ oldID ] || [];
                // if the frame is "ready", then just render the layers
                this.layers.each(function( layer ) {
                    if ( !_.include(commonLayers, layer.id) ) {
                        layer.render();
                    }
                });

                // update status
                this.status.set( "current_frame",this.id );
                // set frame timer
                advance = this.get("attr").advance;
                if ( advance ) {
                    this.startTimer( advance );
                }

                if ( !this.get("_next") && this.get("link_to").length === 0 ) {
                    this.status.emit("deadend_frame", _.extend({}, this.toJSON() ) );
                }

               
            } else {
                this.renderOnReady = oldID;
            }

            /* determines the z-index of the layer in relation to other layers on the frame */
            this.layers.each(function(layer, i){
                layer.updateZIndex( i );
            });

        },

        onLayerReady: function( layer ) {

            this.status.emit("layer_ready", layer );

            if ( this.isFrameReady() && !this.ready ) {
                this.onFrameReady();
            }

            // TODO: This does nothing?
            // trigger events on layer readiness
            var states = this.layers.map(function(layer){ return layer.state; });
        },

        onFrameReady: function() {
            this.ready = true;
            this.state = "ready";
            this.status.emit("frame_ready", {
                frame: this.toJSON(),
                layers: this.layers.toJSON()
            });

            if ( !_.isNull(this.renderOnReady) ) {
                this.status.emit("can_play");
                this.render( this.renderOnReady );
                this.renderOnReady = null;
            }
        },

        getLayerStates: function() {
            var layers = _.toArray( this.layers );

            return [
                "ready", "waiting", "loading", "destroyed", "error"
            ].reduce(function( states, which ) {
                var filtereds = layers.filter(function( layer ) {
                    return layer.state === which;
                });

                states[ which ] = filtereds.map(function( layer ) {
                    return layer.attributes;
                });

                return states;
            }, {});
        },

        isFrameReady: function() {
            var states = this.getLayerStates();

            if ( (states.ready.length + states.error.length) === this.layers.length ) {
                return true;
            }
            return false;
        },

        pause: function() {

            // cancel the timer
            // record the current elapsed time on the frame
            // the elapsed time will be subtracted from the total advance time when the timer is restarted in play()
            if( this.timer ) {
                clearTimeout( this.timer );
                this.elapsed += ( new Date().getTime() - this.status.playTimestamp );
            }

            this.layers.each(function( layer ) {
                layer.pause();
            });
        },

        play: function() {
            var advance;

            this.layers.each(function( layer ) {
                layer.play();
            });

            // set frame timer
            advance = this.get("attr").advance;
            if ( advance ) {
                this.startTimer( advance - this.elapsed );
            }
        },

        startTimer: function( ms ) {
            if ( this.timer ) {
                clearTimeout( this.timer );
            }
            this.timer = setTimeout(function() {
                this.relay.set({
                    current_frame: this.get("_next")
                },{silent:false});
            }.bind(this), ms );
        },

        exit: function( newID ) {
            var commonLayers = this.get("common_layers")[ newID ] || [];

            this.elapsed = 0;
            if( this.timer ) {
                clearTimeout( this.timer );
            }
            this.layers.each(function( layer ) {
                if ( !_.include(commonLayers, layer.id) ) {
                    layer.exit();
                }
            });
        },

        unrender: function( newID ) {
            // not sure I need this
        },

        // manages the removal of all child layers
        destroy: function() {
            // do not attempt to destroy if the layer is waiting or destroyed
            if ( this.state !== "waiting" && this.state !== "destroyed" ) {
                this.layers.each(function( layer ) {
                    layer.destroy();
                });
                this.state = "destroyed";
            }
        }

    });

    Frame.Collection = Zeega.Backbone.Collection.extend({
        model: FrameModel,

        // logic that populates the frame with information about it's connections, state, and position within the project
        load: function( sequences, layers, preloadRadius ) {
            var _this = this,
            // create a layer collection. this does not need to be saved anywhere
                layerCollection = new Layer.Collection( layers );
                sequenceCollection = new Zeega.Backbone.Collection( sequences );

            this.each(function( frame ) {
                var linkedArray = [];

                // make a layer collection inside the frame
                frame.layers = new Layer.Collection();
                frame.relay = _this.relay;
                frame.status = _this.status;
                // add each layer to the collection
                _.each( frame.get("layers"), function( layerID ) {
                    frame.layers.add( layerCollection.get( layerID ) );
                });
                // make connections by sequence>frame order
                sequenceCollection.each(function( sequence, i ){
                    var frames = sequence.get("frames"),
                        advance = sequence.get("advance_to"),
                        index = frames.indexOf( frame.id ),
                        prev = null,
                        next = null;

                    if ( index > -1 ) {

                        if ( index > 0 && frames.length > 1 ) {
                            prev = frames[ index - 1 ];
                        } else if ( i > 0 && sequences[ i - 1 ].advance_to ) {

                            // TODO connect sequences in reverse

                        }

                        if ( index < frames.length - 1 && frames.length > 1 ) {
                            next = frames[ index +1 ];
                        } else if ( advance && sequenceCollection.get( advance ) ) {
                            next = sequenceCollection.get( advance ).get("frames")[0];
                        }

                        frame.set({
                            _prev: prev,
                            _next: next,
                            _sequence: sequence.id
                        });
                        frame.setConnections();
                    }
                });

                // make connections by link layers
                // get all a frame's link layers
                var linkLayers = frame.layers.where({ type:"Link" }),
                    linkTo = [],
                    linkFrom = [];

                _.each( linkLayers, function( layer ) {
                    // links that originate from this frame
                    if ( layer.get("attr").from_frame == frame.id ) {
                        linkTo.push( layer.get("attr").to_frame );
                    } else {
                        // links that originate on other frames
                        // remove layer model from collection because it shouldn"t be rendered
                        frame.layers.remove( layer );
                        linkFrom.push( layer.get("attr").from_frame );
                    }
                });

                frame.set({
                    link_to: linkTo,
                    link_from: linkFrom
                });


                frame.layers.each(function( layer ) {
                    layer.relay = _this.relay;
                    layer.status = _this.status;
                });

            });

            // another for loop that has to happen after all link layers are populated
            this.each(function( frame ) {
                // set common layers object
                // {
                //      123: [a,b,c],
                //      234: [c,d,e]
                // }
                var connected, commonLayers,
                    values = [ "_prev", "_next", "link_to", "link_from" ].map(function( value ) {
                        return frame.get( value );
                    });

                // This is sort of insane...
                connected = _.uniq( _.compact( _.union.apply( null, values ) ) );

                commonLayers = connected.reduce(function( common, id ) {
                    common[ id ] = _.intersection(
                        frame.layers.pluck("id"), this.get( id ).layers.pluck("id")
                    );
                    return common;
                }.bind(_this), {});

                frame.set({
                    common_layers: commonLayers
                });
            });

            // figure out the frames that should preload when this frame is rendered
            // TODO: Investigate why (formerly preload_ahead) was being passed,
            // despite it not actually being a functional parameter beyond ensuring that
            // this conditional expression evaluated as true
            // if ( preloadRadius ) {

            this.each(function( frame ) {
                var sequenceAhead = sequenceCollection.get( frame.get("_sequence") ).get("advance_to"),
                    ahead = frame.get("_next"),
                    behind = frame.get("_prev"),
                    targets = [
                        frame.id,
                        ahead,
                        behind
                    ].filter(Boolean);

                for( var i = 0; i < preloadRadius - 1; i++ ) {
                    if( ahead ) {
                        ahead = this.get( ahead ).get("_next") || null;
                    }
                    if( behind ) {
                        behind = this.get( behind ).get("_next") || null;
                    }
                    if( !ahead && !behind ) break;
                    if( ahead ) {
                        targets.push( ahead );
                    }
                    if( behind ) {
                        targets.push( behind );
                    }
                }

                _.compact(targets);

                if( sequenceAhead && sequenceCollection.get( sequenceAhead ) ) {
                    targets.push( sequenceCollection.get( sequenceAhead ).get("frames")[0] );
                }
                console.log('---frames', targets );

                frame.set( "preload_frames",
                    _.union(
                        targets, frame.get("link_to"), frame.get("link_from")
                    )
                );
            }.bind( this ));
        }
    });



    return Frame;
});
