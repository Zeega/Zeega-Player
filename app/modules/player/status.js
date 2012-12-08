/*
	status.js

	model that keeps track of player state and emits events
*/

define([
	"zeega"
],

function(Zeega) {

	var Status = {};

	Status.Model = Zeega.Backbone.Model.extend({

		silent: false,

		defaults: {
			data_url: null,
			previous_frame_id: null,
			previous_frame_model: null,
			current_frame_id: null,
			current_frame_model: null,
			current_sequence_id: null,
			current_sequence_model: null,
			current_layers: []
		},

		initialize: function() {
			this.on('change:current_frame_id',this.onChangeFrame,this);
		},

		onChangeFrame: function(info) {
		
			/* update the previous frame data */
			if(this.get('current_frame_id'))
			{
				this.set({
					previous_frame_id: this.get('current_frame_id'),
					previous_frame_model: this.get('current_frame_model')
				},{ silent: true });
			}
			/* update the current_frame_model */
			var frameModel = this.project.frames.get( this.get('current_frame_id') );
			this.set({ 'current_frame_model': frameModel },{silent:true});
			this.emit('frame_rendered', _.extend({}, frameModel.toJSON(), {layers: frameModel.layers.toJSON()} )  );
		},

		/*
			emit the state change to the external api
		*/
		emit: function(e,info) {
			if(!this.silent) this.project.trigger(e,info);
		}

	});

	return Status;
});