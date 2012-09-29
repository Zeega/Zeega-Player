define([ "zeega" ],

function(Zeega)
{
	var Layer = Zeega.module();

	var LayerModel = Backbone.Model.extend({

		ready : false,
		status : 'waiting',
		
		defaults : {

		},

		initialize : function()
		{
			// init link layer type inside here
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