/*
    relay.js

    model that keeps track of player state, emits events, and relays commands to the player
*/

define([
    "zeega"
],
function( Zeega ) {

    var Status = {};

    Status.Model = Zeega.Backbone.Model.extend({

        silent: false,

        defaults: {

            previous_frame: null,
            previous_frame_model: null,

            current_frame: null,
            current_frame_model: null,

            current_sequence: null,
            current_sequence_model: null,

            current_layers: []
        },

        initialize: function() {
            this.on("change:current_frame",this.onChangeFrame,this);
        },

        onChangeFrame: function( info ) {
            var frame, sequence,
                currentFrame = this.get("current_frame"),
                currentFrameModel = this.get("current_frame_model");

            /* update the previous frame data */
            if ( currentFrame ) {
                this.set({
                    previous_frame: currentFrame,
                    previous_frame_model: currentFrameModel
                }, { silent: true });
            }
            /* update the current_frame_model */
            frame = this.project.frames.get( currentFrame );
            sequence = frame.get("_sequence");

            this.set({ "current_frame_model": frame }, { silent: true });
            this.emit( "frame_rendered",
                _.extend({}, frame.toJSON(), {
                    layers: frame.layers.toJSON()
                })
            );

            /* check to see if the sequence entered is new */
            // TODO: Investigate value of "sequence"
            if ( this.get("current_sequence") != sequence ) {
                this.set({
                    current_sequence: sequence,
                    current_sequence_model: this.project.sequences.get( sequence )
                });

                this.emit( "sequence_enter",
                    _.extend({}, this.get("current_sequence_model").toJSON() )
                );
            }

        },

        /*
            emit the state change to the external api
        */
        emit: function( e, info ) {
            if ( !this.silent ) {
                this.project.trigger( e, info );
            }
        },

        /*
            remotely trigger events internally to the player
        */
        remote: function( e, info ) {

        }
    });

    return Status;
});
