/*
    status.js

    model that keeps track of player state, emits events, and relays commands to the player
*/

define([
    "player/app"
],
function( app ) {

    var Status = {};

    Status.Model = app.Backbone.Model.extend({

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
            frame = this.get("project").project.getFrame( currentFrame );
            sequence = frame.collection.sequence;

            fHist = this.get("frameHistory");
            if ( fHist.length === 0 || fHist[ fHist.length - 1 ] != frame.id ){
                fHist.push( frame.id );
            }
            

            this.put({
                current_frame_model: frame,
                frameHistory: fHist
            });
            this.emit( "frame_play",
                _.extend({}, frame.toJSON(), {
                    layers: frame.layers.toJSON()
                })
            );

            /* check to see if the sequence entered is new */
            // TODO: Investigate value of "sequence"
            if ( this.get("current_sequence") != sequence.id ) {
                seqHist = this.get("sequenceHistory");
                seqHist.push( sequence.id );
                this.set({
                    current_sequence: sequence.id,
                    current_sequence_model: sequence,
                    sequenceHistory: seqHist
                });

                this.emit( "sequence_enter",
                    _.extend({}, this.get("current_sequence_model").toJSON() )
                );
            }
        },

        onBack: function() {

            fHist = this.get("frameHistory");
            
            if( fHist.length > 1 && fHist[ fHist.length - 1 ] == this.get("current_frame")){
                fHist.pop();
                this.put({
                    frameHistory: fHist
                }); 
            }
            
        },

        /*
            emit the state change to the external api
        */
        emit: function( e, info ) {
            if ( this.get("project").get("debugEvents") === true && e != "media_timeupdate") {
                console.log( "--player event: ",e, info );
            } else if ( this.get("project").get("debugEvents") == e ) {
                console.log( "--player event: ",e, info );
            }
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
