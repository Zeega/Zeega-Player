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

            current_layers: []
        },

        initialize: function() {
            this.initTimer = _.once( this._initProjectTimer );
            this.on("change:current_frame", this.onChangeFrame,this);
            
            console.log('this', this, this.project);
        },

        loadProject: function( project ) {
            this.project = project;
            this.project.on("play", this.onPlay, this );
            this.project.on("pause", this.onPause, this );
        },

        onChangeFrame: function( info ) {
            var frame, sequence,
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
