define([
	"zeega",
	"zeega_dir/player/layer"
],

function(Zeega, Layer)
{
	var Frame = Zeega.module();

	var FrameModel = Zeega.Backbone.Model.extend({

		ready : false,
		status : 'waiting', // waiting, loading, ready, destroyed
		hasPlayed : false,

		// frame render as soon as it's loaded. used primarily for the initial frame
		renderOnReady : null,

		defaults : {
			attr : { advance : 0 },
			common_layers : {},			// ids of frames and their common layers for loading
			layers : [],				// ids of layers contained on frame
			link_to : [],				// ids of frames this frame can lead to
			link_from : [],				// ids of frames this frame can be accessed from
			preload_frames : [],
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

		preload : function()
		{
			var _this = this;
			if(this.status != 'ready')
			{
				this.layers.each(function(layer){
					if( layer.status == 'waiting' )
					{
						layer.on('layer_ready', _this.onLayerReady, _this);
						layer.render();
					}
				});
			}
		},

		// render from frame.
		render : function( oldID )
		{
			// if frame is completely loaded, then just render it
			// else try preloading the layers
			var _this = this;
			if( _this.status == 'ready' )
			{
				// only render non-common layers. allows for persistent layers
				var commonLayers = this.get('common_layers')[oldID] || [];
				// if the frame is 'ready', then just render the layers
				this.layers.each(function(layer){
					if( !_.include(commonLayers, layer.id) ) layer.render();
				});
				this.trigger('frame_rendered', _.extend({}, this.toJSON(), {layers: this.layers.toJSON()} ));
			}
			else
			{
				this.renderOnReady = oldID;
			}
			this.layers.each(function(layer, i){
				layer.updateZIndex( _this.layers.length - i );
			});
		},

		onLayerReady : function( layer )
		{
			//this.trigger('layer_ready',layer.toJSON() );
			this.trigger('frame_progress', this.getLayerStates() );

			if( this.isFrameReady() ) this.onFrameReady();

			// trigger events on layer readiness
			var statuses = this.layers.map(function(layer){ return layer.status;	});
			//var include
		},

		onFrameReady : function()
		{
			this.ready = true;
			this.status = 'ready';
			this.trigger('frame_ready',{ frame: this.toJSON(),layers: this.layers.toJSON() });
			if( !_.isNull(this.renderOnReady) )
			{
				this.render( this.renderOnReady );
				this.renderOnReady = null;
			}
		},

		getLayerStates : function()
		{
			var states = {};
			states.ready =		_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'ready'; }), function(layer){ return layer.attributes; });
			states.waiting =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'waiting'; }), function(layer){ return layer.attributes; });
			states.loading =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'loading'; }), function(layer){ return layer.attributes; });
			states.destroyed =	_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'destroyed'; }), function(layer){ return layer.attributes; });
			states.error =		_.map( _.filter( _.toArray(this.layers), function(layer){ return layer.status == 'error'; }), function(layer){ return layer.attributes; });
			return states;
		},

		isFrameReady : function()
		{
			var states = this.getLayerStates();
			if( states.ready.length + states.error.length  == this.layers.length ) return true;
			return false;
		},

		pause : function()
		{
			this.layers.each(function(layer){
				layer.pause();
			});
		},

		play : function()
		{
			this.layers.each(function(layer){
				layer.play();
			});
		},

		exit : function( newID )
		{
			var commonLayers = this.get('common_layers')[newID] || [];
			this.layers.each(function(layer){
				if( !_.include(commonLayers, layer.id) ) layer.exit();
			});
		},

		unrender : function( newID )
		{
			// not sure I need this
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

	Frame.Collection = Zeega.Backbone.Collection.extend({
		model : FrameModel,

		// logic that populates the frame with information about it's connections, state, and position within the project
		load : function( sequences,layers, preload_ahead )
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

				// listen for layer events and propagate through the frame to the player
				frame.layers.on('all',function(e,obj){
					var emit = _.extend({},obj,{frame:frame.id});
					_this.trigger(e, emit);
				});
				
			});
			
			// another for loop that has to happen after all link layers are populated
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

			// figure out the frames that should preload when this frame is rendered
			var preloadAhead = preload_ahead || 0;
			if(preloadAhead)
			{

				this.each(function(frame){

					var framesToPreload = [frame.id];
					var targetArray = [frame.id];

					var loop = function()
					{
						_.each( targetArray, function(frameID){
							targetArray = _.compact([ frame.get('prev'), frame.get('next') ]);
							framesToPreload = _.union( framesToPreload, targetArray, frame.get('link_to'), frame.get('link_from'));
						});
					};

					for( var i = 0 ; i < preloadAhead ; i++) loop();

					frame.set('preload_frames', framesToPreload );
				});

			}
		}

		

	});

	

	return Frame;
});