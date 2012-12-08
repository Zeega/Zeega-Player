/*
	relay.js

	model that keeps track of player state, emits events, and relays commands to the player
*/

define([
	"zeega"
],

function(Zeega) {

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
			this.on('change:current_frame',this.onChangeFrame,this);
		},

		onChangeFrame: function(info) {
		
			/* update the previous frame data */
			if(this.get('current_frame'))
			{
				this.set({
					previous_frame: this.get('current_frame_id'),
					previous_frame_model: this.get('current_frame_model')
				},{ silent: true });
			}
			/* update the current_frame_model */
			var frameModel = this.project.frames.get( this.get('current_frame_id') );

			this.set({ 'current_frame_model': frameModel },{silent:true});
			this.emit('frame_rendered', _.extend({}, frameModel.toJSON(), {layers: frameModel.layers.toJSON()} )  );

			/* check to see if the sequence entered is new */
			if(this.get('current_sequence') != frameModel.get('_sequence')) {
				this.set({
					current_sequence_id: frameModel.get('_sequence'),
					current_sequence_model: this.project.sequences.get( frameModel.get('_sequence') )
				});
				this.emit('sequence_enter', _.extend({},this.get('current_sequence_model')) );
			}

		},

		/*
			emit the state change to the external api
		*/
		emit: function(e,info) {
			if(!this.silent) this.project.trigger(e,info);
		},

		/*
			remotely trigger events internally to the player
		*/
		remote: function(e,info) {

		}

	});

	return Status;
});