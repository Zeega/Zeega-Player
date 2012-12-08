/*
	relay.js

	model that keeps track of player state, emits events, and relays commands to the player
*/

define([
	"zeega"
],

function(Zeega) {

	var Relay = {};

	Relay.Model = Zeega.Backbone.Model.extend({

		defaults: {

			current_frame: null,
			current_frame_model: null

		}

	});

	return Relay;
});