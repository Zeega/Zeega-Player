define([
	"zeega",
	"zeega_layers/_all"
],

function(Zeega, Plugin)
{
	var Layer = Zeega.module();

	var LayerModel = Backbone.Model.extend({

		ready : false,
		status : 'waiting', // waiting, loading, ready, destroyed, error
		
		defaults : {
			mode: 'player'
		},

		initialize : function()
		{
			// init link layer type inside here
			if( Plugin[this.get('type')] )
			{
				this.layerClass = new Plugin[this.get('type')]();
				var def = _.defaults( this.toJSON(), this.layerClass.defaults );
				this.set(def);

				// create and store the layerClass
				this.visualElement = new Plugin[this.get('type')].Visual({model:this, attributes:{
					id : 'visual-element-' + this.id,
					'data-layer_id' : this.id
				}});
				// listen to visual element events
				this.on('visual_ready', this.onVisualReady, this);
				this.on('visual_error', this.onVisualError, this);
			}
			else
			{
				this.ready = true;
				this.status = 'error';
			}
		},

		render : function()
		{
			// make sure the layer class is loaded or fail gracefully
			if( this.visualElement )
			{
				// if the layer is ready, then just show it
				if( this.status == 'waiting')
				{
					this.visualElement.player_onPreload();
				}
				else if( this.status == 'ready' )
				{
					this.visualElement.play();
				}
			}
			else
			{
				console.log('***	The layer '+ this.get('type') +' is missing. ): ', this.id);
			}
		},

		onVisualReady : function()
		{
			this.ready = true;
			this.status = 'ready';
			this.trigger('ready', this);
		},

		onVisualError : function()
		{
			this.ready = true;
			this.status = 'error';
			this.trigger('error');
		},

		exit : function()
		{
			if( this.layerClass )
			{
				this.visualElement.player_onExit();
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