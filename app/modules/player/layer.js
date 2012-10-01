define([
	"zeega",
	"zeega_layers/_all"
],

function(Zeega, Plugin)
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
			if( Plugin[this.get('type')] )
			{
				this.layerClass = Plugin[this.get('type')];
				var def = _.defaults( this.toJSON(), this.layerClass.defaults );
				this.set(def);
			}
		},

		render : function()
		{
			if( this.layerClass )
			{
				this.visualElement = new this.layerClass.Visual({model:this, attributes:{
					id : 'visual-element-' + this.id,
					'data-layer_id' : this.id
				}});
				this.visualElement.render();
			}
		},

		remove : function()
		{
			if( this.layerClass )
			{
				this.visualElement.remove();
			}
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