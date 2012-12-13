/*
    relay.js

    model that keeps track of player state, emits events, and relays commands to the player

    the same relay object lives in all frames and layers and can be listened to by any of them

    primarily used to relay commands from a layer to the project
*/

define([
    "zeega"
],
function( Zeega ) {

    var Relay = {};

    Relay.Model = Zeega.Backbone.Model.extend({

        defaults: {
            current_frame: null,
            current_frame_model: null
        }

    });

    return Relay;
});
