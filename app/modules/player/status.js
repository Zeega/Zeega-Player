/*
    status.js

    model that keeps track of player state, emits events, and relays commands to the player
*/

define([
    "zeega"
],
function( Zeega ) {

    var Status = {};

    Status.Model = Zeega.Backbone.Model.extend({

        silent: false,

        projectTimerstamp: null,
        frameTimestamp: null,
        pauseTimestamp: null,

        defaults: {

            previous_frame: null,
            previous_frame_model: null,

            current_frame: null,
            current_frame_model: null,

            current_sequence: null,
            current_sequence_model: null,

            current_layers: [],

            // actual navigation history of ids
            frameHistory: [],
            sequenceHistory: []
        },

        initialize: function() {
            this.initTimer = _.once( this._initProjectTimer );

            this.get("project").on("play", this.onPlay, this );
            this.get("project").on("pause", this.onPause, this );
            this.on("change:current_frame", this.onChangeFrame,this);
        },

        onChangeFrame: function( info ) {
            var frame, sequence, fHist, seqHist,
                currentFrame = this.get("current_frame"),
                currentFrameModel = this.get("current_frame_model");

            // reset the pause timestamp if the frame changes
            this.pauseTimestamp = null;
            // initialize the player timer // only happens once
            this.initTimer();
            // udpate the  the timestamp
            this.frameTimestamp = new Date().getTime();

            /* update the previous frame data */
            if ( currentFrame ) {
                this.put({
                    previous_frame: currentFrame,
                    previous_frame_model: currentFrameModel
                });
            }
            /* update the current_frame_model */
            frame = this.get("project").get("frames").get( currentFrame );
            sequence = frame.get("_sequence");

            fHist = this.get("frameHistory");
            fHist.push( frame.id );
            this.put({
                current_frame_model: frame,
                frameHistory: fHist
            });
            this.emit( "frame_rendered",
                _.extend({}, frame.toJSON(), {
                    layers: frame.layers.toJSON()
                })
            );

            /* check to see if the sequence entered is new */
            // TODO: Investigate value of "sequence"
            if ( this.get("current_sequence") != sequence ) {
                seqHist = this.get("sequenceHistory");
                seqHist.push( sequence );
                this.set({
                    current_sequence: sequence,
                    current_sequence_model: this.get("project").get("sequences").get( sequence ),
                    sequenceHistory: seqHist
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
            console.log( e, info )
            if ( !this.silent ) {
                this.get("project").trigger( e, info );
            }
        },

        /*
            record the time the player is started
        */
        _initProjectTimer: function () {
            this.projectTimerstamp = new Date().getTime();
        },

        onPlay: function() {
            this.playTimestamp = new Date().getTime();
        },

        onPause: function() {
            this.pauseTimestamp = new Date().getTime();
        }

    });

    return Status;
});
