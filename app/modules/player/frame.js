define([
	"zeega",
	"player/layer"
],

function(Zeega, Layer)
{
	var Frame = Zeega.module();

	var FrameModel = Backbone.Model.extend({

		ready : false,
		status : 'waiting', // waiting, loading, ready, destroyed
		hasPlayed : false,

		defaults : {
			attr : { advance : 0 },
			common_layers : {},			// ids of frames and their common layers for loading
			layers : [],				// ids of layers contained on frame
			link_to : [],				// ids of frames this frame can lead to
			link_from : [],				// ids of frames this frame can be accessed from
			next : null,				// id of the next frame
			prev : null					// id of the previous frame
		},

		// for convenience
		getNext : function(){ return this.get('next'); },
		getPrev : function(){ return this.get('prev'); },

		// sets the sequence adjacencies as a string
		setConnections : function()
		{
			if( !_.isNull(this.get('prev')) && !_.isNull(this.get('next')) ) this.set('connections','lr');
			else if( !_.isNull(this.get('prev')) && _.isNull(this.get('next')) ) this.set('connections','l');
			else if( _.isNull(this.get('prev')) && !_.isNull(this.get('next')) ) this.set('connections','r');
			else this.set('connections','none');
		},

		// render from frame.
		render : function( oldID )
		{
			// if frame is completely loaded, then just render it
			// else try preloading the layers
			var _this = this;
			// only render non-common layers. allows for persistent layers
			var commonLayers = this.get('common_layers')[oldID] || [];

			if( _this.status == 'ready' )
			{
				this.layers.each(function(layer){
					if( !_.include(commonLayers, layer.id) ) layer.render(); // player_onPlay()
				});
			}
			else
			{
				// if layer is already loading, ignore it
				// if layer is waiting, the preload it
				this.layers.each(function(layer){
					if( layer.status == 'waiting' && !_.include(commonLayers, layer.id) )
					{
						layer.on('ready', _this.onLayerReady, _this);
						layer.render(); // player_onPreload()
					}
				});
			}
				
		},

		onLayerReady : function( layer )
		{
			var states = getLayerStates();
			if( states.ready.length == this.layers.length ) this.ready = true;

			var statuses = this.layers.map(function(layer){ return layer.status;	});
			//var include
		},

		getLayerStates : function()
		{
			var states = {};
			states.ready = _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'ready'; });
			states.waiting = _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'waiting'; });
			states.loading = _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'loading'; });
			states.destroyed = _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'destroyed'; });
			return states;
		},

		unrender : function( newID )
		{
			var commonLayers = this.get('common_layers')[newID] || [];
			this.layers.each(function(layer){
				if( !_.include(commonLayers, layer.id) ) layer.remove();
			});
		},

		// manages the removal of all child layers
		destroy : function()
		{
			// do not attempt to destroy if the layer is waiting or destroyed
			if( this.status != 'waiting' && this.status != 'destroyed' )
			{
				this.layers.each(function(layer){ layer.destroy(); });
				this.status = 'destroyed';
			}
		}

	});

	Frame.Collection = Backbone.Collection.extend({
		model : FrameModel,

		load : function( sequences,layers )
		{
			var _this = this;
			// create a layer collection. this does not need to be saved anywhere
			var layerCollection = new Layer.Collection(layers);

			this.each(function(frame){

				var linkedArray = [];
				// make a layer collection inside the frame
				frame.layers = new Layer.Collection();
				// add each layer to the collection
				_.each( frame.get('layers'), function(layerID){
					frame.layers.add( layerCollection.get(layerID) );
				});

				// make connections by sequence>frame order
				_.each( sequences, function(sequence){
					if( sequence.frames.length > 1 )
					{
						var index = _.indexOf( sequence.frames, frame.id );
						if( index > -1 )
						{
							var prev = sequence.frames[index-1] || null;
							var next = sequence.frames[index+1] || null;

							frame.set({
								prev : prev,
								next : next
							});
							frame.setConnections();
						}
					}
				});

				// make connections by link layers
				// get all a frame's link layers
				var linkLayers = frame.layers.where({type:'Link'});
				var linkTo = [];
				var linkFrom = [];
				_.each( linkLayers, function(layer){
					// links that originate from this frame
					if( layer.get('attr').from_frame == frame.id )
						linkTo.push( layer.get('attr').to_frame );
					else
					{
						// links that originate on other frames
						// remove layer model from collection because it shouldn't be rendered
						frame.layers.remove( layer );
						linkFrom.push( layer.get('attr').from_frame );
					}
				});
				frame.set({
					link_to : linkTo,
					link_from : linkFrom
				});
				
			});
			
			// another for loop that has to happen after all link layers are settled
			this.each(function(frame){
				// set common layers object
				// {
				//		123 : [a,b,c],
				//		234 : [c,d,e]
				// }
				var commonLayers = {};
				var allConnected = _.uniq( _.compact( _.union( frame.get('prev'), frame.get('next'), frame.get('link_to'), frame.get('link_from') ) ) );
				_.each( allConnected, function(frameID){
					commonLayers[frameID] = _.intersection( frame.layers.pluck('id'), _this.get(frameID).layers.pluck('id') );
				});
				frame.set({ common_layers: commonLayers });
			});
		}
	});

	

	return Frame;
});