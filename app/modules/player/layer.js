define([ "zeega" ],

function(Zeega)
{
	var Layer = Zeega.module();

	var LayerModel = Backbone.Model.extend({

		ready : false,
		status : 'waiting', // waiting, loading, ready, destroyed
		
		defaults : {

		},

		initialize : function()
		{
			// init link layer type inside here
		},

		// removes the layer. destroys players, removes from dom, etc
		destroy : function()
		{
			// do not attempt to destroy if the layer is waiting or destroyed
			if( this.status != 'waiting' && this.status != 'destroyed' )
			{
				console.log('layer destroyed', this.id, this, this.status);
				this.status = 'destroyed';
			}
		}
	});

	Layer.Collection = Backbone.Collection.extend({

		model : LayerModel,

		initialize : function()
		{
			
		}
	});

	return Layer;
});